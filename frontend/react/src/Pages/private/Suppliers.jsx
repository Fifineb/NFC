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
        raisonSociale: '',
        email: '',
        adresse: '',
        telephone: '',
        actif: true
    });

    const canEdit = hasRole && hasRole(['ADMINISTRATEUR', 'GESTIONNAIRE', 'ADMIN', 'MANAGER']);

    useEffect(() => {
        loadFournisseurs();
    }, []);

    const loadFournisseurs = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            console.log('🔑 Token présent:', token ? 'Oui' : 'Non');
            
            const data = await fournisseurApi.getAll();
            console.log('📦 Données brutes reçues:', data);
            
            let cleanData = [];
            if (Array.isArray(data)) {
                cleanData = data.map(f => ({
                    id: f.id,
                    raisonSociale: f.raisonSociale,
                    email: f.email,
                    adresse: f.adresse,
                    telephone: f.telephone,
                    actif: f.actif,
                    dateCreation: f.dateCreation,
                    dateModification: f.dateModification
                    // On ne prend PAS commandes pour éviter la récursion
                }));
            } else if (data && typeof data === 'object') {
                // Si c'est un objet unique, on le met dans un tableau
                cleanData = [{
                    id: data.id,
                    raisonSociale: data.raisonSociale,
                    email: data.email,
                    adresse: data.adresse,
                    telephone: data.telephone,
                    actif: data.actif
                }];
            }
            
            console.log('✅ Données nettoyées:', cleanData);
            setFournisseurs(cleanData);
            
        } catch (error) {
            console.error('❌ Erreur chargement:', error);
            setError(error.response?.data?.message || error.message || 'Erreur de chargement');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // ✅ Utiliser raisonSociale (pas raison_sociale)
            const dataToSend = {
                raisonSociale: formData.raisonSociale,
                email: formData.email,
                adresse: formData.adresse,
                telephone: formData.telephone,
                actif: formData.actif
            };
            
            if (editingFournisseur) {
                await fournisseurApi.update(editingFournisseur.id, dataToSend);
            } else {
                await fournisseurApi.add(dataToSend);
            }
            
            setShowForm(false);
            setEditingFournisseur(null);
            setFormData({ raisonSociale: '', email: '', adresse: '', telephone: '', actif: true });
            await loadFournisseurs();
            
        } catch (error) {
            console.error('❌ Erreur:', error);
            if (error.response?.status === 403) {
                alert('Erreur 403: Vous n\'avez pas les droits pour cette action. Vérifiez votre token et vos permissions.');
            } else {
                alert('Erreur: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleEdit = (fournisseur) => {
        setEditingFournisseur(fournisseur);
        setFormData({
            raisonSociale: fournisseur.raisonSociale || '',
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
                await fournisseurApi.delete(id);
                await loadFournisseurs();
            } catch (error) {
                console.error('❌ Erreur suppression:', error);
                alert('Erreur lors de la suppression');
            }
        }
    };

    const filteredFournisseurs = fournisseurs.filter(f =>
        f.raisonSociale?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                                    value={formData.raisonSociale}
                                    onChange={(e) => setFormData({...formData, raisonSociale: e.target.value})}
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
                                <tr key={fournisseur.id}>
                                    <td>{fournisseur.id}</td>
                                    <td>{fournisseur.raisonSociale}</td>
                                    <td>{fournisseur.email || '-'}</td>
                                    <td>{fournisseur.telephone || '-'}</td>
                                    <td>{fournisseur.adresse || '-'}</td>
                                    {canEdit && (
                                        <td className="actions">
                                            <button onClick={() => handleEdit(fournisseur)} className="btn-edit" title="Modifier">
                                                ✏️
                                            </button>
                                            <button onClick={() => handleDelete(fournisseur.id)} className="btn-delete" title="Supprimer">
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