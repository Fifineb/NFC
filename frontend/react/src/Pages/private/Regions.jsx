import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';  // ← AJOUTER CETTE LIGNE
import { regionApi } from '../../services/api/regionApi';


const Regions = () => {
    const { user, hasRole } = useAuth();
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingRegion, setEditingRegion] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        nomR: '',
        description: '',
        adresseR: ''
    });

    // Vérifier si l'utilisateur peut modifier
    const canEdit = hasRole(['ADMINISTRATEUR', 'GESTIONNAIRE']);

    useEffect(() => {
        loadRegions();
    }, []);

    const loadRegions = async () => {
        try {
            setLoading(true);
            const data = await regionApi.getAll();
            console.log("DATA =", data);
            setRegions(data);
            setError(null);
        } catch (err) {
            console.error('Erreur:', err);
            setError('Impossible de charger les régions');
        } finally {
            setLoading(false);
        }
    };

    // Ajouter ou Modifier une région
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRegion) {
                // Mise à jour
                await regionApi.update(editingRegion.id, formData);
                console.log('✅ Région modifiée');
            } else {
                // Ajout
                await regionApi.add(formData);
                console.log('✅ Région ajoutée');
            }
            
            setShowForm(false);
            setEditingRegion(null);
            setFormData({ nomR: '', description: '', adresseR: '' });
            loadRegions(); // Recharger la liste
        } catch (err) {
            console.error('Erreur:', err);
            setError(editingRegion ? 'Impossible de modifier la région' : 'Impossible d\'ajouter la région');
        }
    };

    // Ouvrir le formulaire pour modifier
    const handleEdit = (region) => {
        setEditingRegion(region);
        setFormData({
            nomR: region.nomR || '',
            description: region.description || '',
            adresseR: region.adresseR || ''
        });
        setShowForm(true);
    };

    // Supprimer une région
    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette région ?')) {
            try {
                await regionApi.delete(id);
                console.log('✅ Région supprimée');
                loadRegions(); // Recharger la liste
            } catch (err) {
                console.error('Erreur suppression:', err);
                setError('Impossible de supprimer la région');
            }
        }
    };

    // Annuler le formulaire
    const handleCancel = () => {
        setShowForm(false);
        setEditingRegion(null);
        setFormData({ nomR: '', description: '', adresseR: '' });
    };

    // Gérer les changements dans le formulaire
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Filtrer les régions par recherche
    const filteredRegions = regions.filter(region =>
        region.nomR?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        region.adresseR?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="loading">Chargement des régions...</div>;
    }

    return (
        <div className="regions-container">
            <div className="page-header">
                <h1>Gestion des Régions ({regions.length})</h1>
                {canEdit && (
                    <button onClick={() => setShowForm(true)} className="btn-primary">
                        + Nouvelle Région
                    </button>
                )}
            </div>

            {/* Barre de recherche */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Rechercher une région..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Message d'erreur */}
            {error && <div className="error-message" style={{ color: 'red', padding: '10px' }}>{error}</div>}

            {/* Formulaire d'ajout/modification */}
            {showForm && canEdit && (
                <div className="modal-overlay" onClick={handleCancel}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>{editingRegion ? 'Modifier la région' : 'Ajouter une région'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nom de la région *</label>
                                <input
                                    type="text"
                                    name="nomR"
                                    placeholder="Nom de la région"
                                    value={formData.nomR}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Adresse</label>
                                <input
                                    type="text"
                                    name="adresseR"
                                    placeholder="Adresse"
                                    value={formData.adresseR}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="form-textarea"
                                />
                            </div>
                            
                            <div className="form-actions">
                                <button type="submit" className="btn-save">
                                    {editingRegion ? 'Modifier' : 'Ajouter'}
                                </button>
                                <button type="button" className="btn-cancel" onClick={handleCancel}>
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tableau des régions */}
            <div className="table-container">
                <table className="data-table" border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f2f2f2' }}>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Description</th>
                            <th>Adresse</th>
                            {canEdit && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRegions.length === 0 ? (
                            <tr>
                                <td colSpan={canEdit ? 5 : 4} style={{ textAlign: 'center' }}>
                                    {searchTerm ? 'Aucune région trouvée' : 'Aucune région enregistrée'}
                                </td>
                            </tr>
                        ) : (
                            filteredRegions.map((region, index) => (
                                <tr key={region.id}>
                                    <td>{index + 1}</td>
                                    <td>{region.nomR}</td>
                                    <td>{region.description || '-'}</td>
                                    <td>{region.adresseR || '-'}</td>
                                    {canEdit && (
                                        <td>
                                            <button onClick={() => handleEdit(region)} style={{ marginRight: '5px' }}>
                                                ✏️ Modifier
                                            </button>
                                            <button onClick={() => handleDelete(region.id)} style={{ backgroundColor: '#ff4444', color: 'white' }}>
                                                🗑️ Supprimer
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

export default Regions;