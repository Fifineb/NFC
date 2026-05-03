import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fournisseurApi } from '../../services/api/fournisseurApi';


const Suppliers = () => {
    const { user, hasRole } = useAuth();
    const [fournisseurs, setFournisseurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingFournisseur, setEditingFournisseur] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        raison_sociale: '',
        email: '',
        adresse: '',
        telephone: '',
        actif: true
    });

    const canEdit = hasRole(['ADMINISTRATEUR', 'GESTIONNAIRE']);

    useEffect(() => {
        console.log('🔍 Composant Suppliers monté');
        loadFournisseurs();
    }, []);

    const loadFournisseurs = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('📡 Chargement des fournisseurs...');
            
            // Vérifier le token
            const token = localStorage.getItem('token');
            console.log('🔑 Token présent:', token ? 'Oui' : 'Non');
            
            const data = await fournisseurApi.getAll();
            console.log('📦 Données reçues:', data);
            
            // Vérifier si data est un tableau
            if (Array.isArray(data)) {
                setFournisseurs(data);
                console.log('✅ Fournisseurs chargés:', data.length);
            } else {
                console.error('❌ Les données ne sont pas un tableau:', data);
                setFournisseurs([]);
            }
        } catch (error) {
            console.error('❌ Erreur chargement:', error);
            setError(error.response?.data?.message || error.message || 'Erreur de chargement');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('📝 Soumission formulaire...');
        console.log('📊 Données du formulaire:', formData);
        
        try {
            if (editingFournisseur) {
                console.log('🔄 Mise à jour du fournisseur ID:', editingFournisseur.id_f);
                await fournisseurApi.update(editingFournisseur.id_f, formData);
                console.log('✅ Mise à jour réussie');
            } else {
                console.log('➕ Création d\'un nouveau fournisseur');
                await fournisseurApi.add(formData);
                console.log('✅ Création réussie');
            }
            
            // Fermer le formulaire
            setShowForm(false);
            setEditingFournisseur(null);
            setFormData({ raison_sociale: '', email: '', adresse: '', telephone: '', actif: true });
            
            // Recharger la liste
            await loadFournisseurs();
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'enregistrement:', error);
            alert('Erreur: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleEdit = (fournisseur) => {
        console.log('✏️ Édition du fournisseur:', fournisseur);
        setEditingFournisseur(fournisseur);
        setFormData({
            raison_sociale: fournisseur.raison_sociale || fournisseur.raison_sociale || '',
            email: fournisseur.email || '',
            adresse: fournisseur.adresse || '',
            telephone: fournisseur.telephone || '',
            actif: fournisseur.actif !== undefined ? fournisseur.actif : true
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce fournisseur ?')) {
            try {
                console.log('🗑️ Suppression du fournisseur ID:', id);
                await fournisseurApi.delete(id);
                console.log('✅ Suppression réussie');
                await loadFournisseurs();
            } catch (error) {
                console.error('❌ Erreur suppression:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const filteredFournisseurs = fournisseurs.filter(f =>
        f.raison_sociale?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.telephone?.includes(searchTerm)
    );

    if (loading) return <div className="loading">Chargement des fournisseurs...</div>;
    if (error) return <div className="error">Erreur: {error}<button onClick={loadFournisseurs}>Réessayer</button></div>;

    return (
        <div className="suppliers-container">
            <div className="page-header">
                <h1>Gestion des fournisseurs ({fournisseurs.length})</h1>
                {canEdit && (
                    <button onClick={() => setShowForm(true)} className="btn-primary">
                        + Nouveau fournisseur
                    </button>
                )}
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Rechercher un fournisseur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {showForm && (
                <div className="modal-overlay" onClick={() => {
                    setShowForm(false);
                    setEditingFournisseur(null);
                }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{editingFournisseur ? 'Modifier' : 'Ajouter'} un fournisseur</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Raison sociale *</label>
                                <input
                                    type="text"
                                    value={formData.raison_sociale}
                                    onChange={(e) => setFormData({...formData, raison_sociale: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Téléphone</label>
                                <input
                                    type="tel"
                                    value={formData.telephone}
                                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Adresse</label>
                                <textarea
                                    value={formData.adresse}
                                    onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                                    rows="3"
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-save">
                                    {editingFournisseur ? 'Modifier' : 'Ajouter'}
                                </button>
                                <button type="button" className="btn-cancel" onClick={() => {
                                    setShowForm(false);
                                    setEditingFournisseur(null);
                                }}>
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Raison sociale</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Adresse</th>
                            {canEdit && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFournisseurs.length === 0 ? (
                            <tr>
                                <td colSpan={canEdit ? 6 : 5} className="text-center">
                                    Aucun fournisseur trouvé
                                </td>
                            </tr>
                        ) : (
                            filteredFournisseurs.map(fournisseur => (
                                <tr key={fournisseur.id_f}>
                                    <td>{fournisseur.id_f}</td>
                                    <td>{fournisseur.raison_sociale}</td>
                                    <td>{fournisseur.email || '-'}</td>
                                    <td>{fournisseur.telephone || '-'}</td>
                                    <td>{fournisseur.adresse || '-'}</td>
                                    {canEdit && (
                                        <td className="actions">
                                            <button onClick={() => handleEdit(fournisseur)} className="btn-edit" title="Modifier">
                                                ✏️
                                            </button>
                                            <button onClick={() => handleDelete(fournisseur.id_f)} className="btn-delete" title="Supprimer">
                                                🗑️
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Suppliers;