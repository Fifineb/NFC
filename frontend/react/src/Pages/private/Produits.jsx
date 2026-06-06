import React, { useState, useEffect } from 'react';
import api from '../../services/api/axiosConfig';

const Produits = () => {
    const [matieres, setMatieres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const [newProduit, setNewProduit] = useState({
        nom_PR: '',
        description: '',
        seuil_minimal: '',
        unite_mesure: '',
        quantite: '',
        statut: 'DISPONIBLE',
        actif: true
    });

    useEffect(() => {
        chargerMatieres();
    }, []);

    const chargerMatieres = async () => {
        try {
            setLoading(true);
            console.log('🔄 Début chargement des matières...');
            
            const response = await api.get('/api/matiere-premiere/getAll');
            
            let data = response.data;
            if (!Array.isArray(data)) {
                data = [];
            }
            
            // ✅ TRIER PAR ID (ordre croissant)
            const cleanedData = data
                .map(m => ({
                    id: m.id,
                    nom: m.nom_PR || 'N/A',
                    description: m.description || '-',
                    seuilMinimal: m.seuil_minimal || 0,
                    uniteMesure: m.unite_mesure || '-',
                    statut: m.statut || 'DISPONIBLE',
                    quantite: m.quantite || 0
                }))
                .sort((a, b) => a.id - b.id);  // ← Tri par ID
            
            console.log('📊 Données nettoyées et triées:', cleanedData);
            setMatieres([...cleanedData]);
            
        } catch (err) {
            console.error('❌ Erreur chargement:', err);
            alert('Erreur lors du chargement des produits');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setNewProduit({
            ...newProduit,
            [e.target.name]: e.target.value
        });
    };

    const resetForm = () => {
        setNewProduit({
            nom_PR: '',
            description: '',
            seuil_minimal: '',
            unite_mesure: '',
            quantite: '',
            statut: 'DISPONIBLE',
            actif: true
        });
        setIsEditing(false);
        setSelectedId(null);
        setShowForm(false);
    };

    const handleEdit = (produit) => {
        setNewProduit({
            nom_PR: produit.nom,
            description: produit.description === '-' ? '' : produit.description,
            seuil_minimal: produit.seuilMinimal,
            unite_mesure: produit.uniteMesure,
            quantite: produit.quantite,
            statut: produit.statut,
            actif: true
        });
        setSelectedId(produit.id);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleDeleteClick = (produit) => {
        setProductToDelete(produit);
        setShowConfirmDelete(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        
        try {
            await api.delete(`/api/matiere-premiere/delete/${productToDelete.id}`);
            alert(`✅ Produit "${productToDelete.nom}" supprimé avec succès`);
            chargerMatieres();
        } catch (error) {
            console.error('Erreur suppression:', error);
            alert('❌ Erreur lors de la suppression');
        } finally {
            setShowConfirmDelete(false);
            setProductToDelete(null);
        }
    };

    const ajouterOuModifierProduit = async () => {
        // Validation
        if (!newProduit.nom_PR.trim()) {
            alert('Veuillez entrer un nom de produit');
            return;
        }
        if (!newProduit.seuil_minimal) {
            alert('Veuillez entrer un seuil minimal');
            return;
        }
        if (!newProduit.unite_mesure) {
            alert('Veuillez sélectionner une unité de mesure');
            return;
        }

        try {
            // ✅ INCLURE LA QUANTITÉ dans les données envoyées
            const produitData = {
                nom_PR: newProduit.nom_PR,
                description: newProduit.description,
                seuil_minimal: parseInt(newProduit.seuil_minimal),
                unite_mesure: newProduit.unite_mesure,
                quantite: parseInt(newProduit.quantite) || 0,  // ← AJOUT DE LA QUANTITÉ
                statut: newProduit.statut,
                actif: true
            };

            console.log('📤 Données envoyées:', produitData);
            
            if (isEditing && selectedId) {
                // MODIFICATION
                console.log('✏️ Modification ID:', selectedId);
                const response = await api.put(`/api/matiere-premiere/update/${selectedId}`, produitData);
                console.log('✅ Réponse modification:', response.data);
                alert('✅ Produit modifié avec succès');
            } else {
                // AJOUT
                console.log('➕ Ajout produit:', produitData);
                const response = await api.post('/api/matiere-premiere/add', produitData);
                console.log('✅ Réponse ajout:', response.data);
                alert('✅ Produit ajouté avec succès');
            }

            setShowForm(false);
            resetForm();
            await chargerMatieres();
            
        } catch (error) {
            console.error('❌ Erreur détaillée:', error);
            alert(`❌ Erreur ${isEditing ? 'modification' : 'ajout'} du produit`);
        }
    };

    // ✅ TRIER LES PRODUITS FILTRÉS PAR ID
    const produitsFiltres = matieres
        .filter((m) => m.nom.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => a.id - b.id);  // ← Tri par ID

    const getStatutClass = (statut) => {
        switch(statut) {
            case 'DISPONIBLE': return 'disponible';
            case 'RUPTURE': return 'rupture';
            case 'PERIME': return 'perime';
            default: return 'disponible';
        }
    };

    const getStatutText = (statut) => {
        switch(statut) {
            case 'DISPONIBLE': return 'Disponible';
            case 'RUPTURE': return 'Rupture';
            case 'PERIME': return 'Périmé';
            default: return statut;
        }
    };

    return (
        <div className="produits-container">
            {/* Modal confirmation suppression */}
            {showConfirmDelete && (
                <div className="modal-overlay" onClick={() => setShowConfirmDelete(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Confirmer la suppression</h3>
                        <p>Voulez-vous vraiment supprimer le produit <strong>"{productToDelete?.nom}"</strong> ?</p>
                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowConfirmDelete(false)}>Annuler</button>
                            <button className="btn-delete" onClick={confirmDelete}>Supprimer</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="header-produits">
                <div>
                    <h1>📦 Matières Premières</h1>
                    <p>{matieres.length} matières disponibles</p>
                </div>

                <div className="actions">
                    <input
                        type="text"
                        placeholder="🔍 Rechercher un produit..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <button className="add-btn" onClick={() => { resetForm(); setShowForm(true); }}>
                        + Nouveau Produit
                    </button>
                </div>
            </div>

            {/* Formulaire Ajout/Modification */}
            {showForm && (
                <div className="form-container">
                    <input
                        type="text"
                        name="nom_PR"
                        placeholder="Nom produit *"
                        value={newProduit.nom_PR}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={newProduit.description}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="quantite"
                        placeholder="Quantité"
                        value={newProduit.quantite}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="seuil_minimal"
                        placeholder="Seuil minimal *"
                        value={newProduit.seuil_minimal}
                        onChange={handleChange}
                    />
                    <select name="unite_mesure" value={newProduit.unite_mesure} onChange={handleChange}>
                        <option value="">Unité *</option>
                        <option value="KG">Kilogramme (KG)</option>
                        <option value="TONNES">Tonnes</option>
                        <option value="LITRES">Litres</option>
                        <option value="UNITE">Unité</option>
                    </select>
                    <select name="statut" value={newProduit.statut} onChange={handleChange}>
                        <option value="DISPONIBLE">Disponible</option>
                        <option value="RUPTURE">Rupture</option>
                        <option value="PERIME">Périmé</option>
                    </select>
                    <div className="form-buttons">
                        <button className="cancel-btn" onClick={resetForm}>Annuler</button>
                        <button className="save-btn" onClick={ajouterOuModifierProduit}>
                            {isEditing ? 'Modifier' : 'Enregistrer'}
                        </button>
                    </div>
                </div>
            )}

            {/* Tableau des produits */}
            {loading ? (
                <p>Chargement...</p>
            ) : (
                <div className="table-wrapper">
                    <table className="table-produits">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Quantité</th>
                                <th>Seuil</th>
                                <th>Unité</th>
                                <th>Statut</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produitsFiltres.map((m) => (
                                <tr key={m.id}>
                                    <td>{m.id}</td>
                                    <td><strong>{m.nom}</strong></td>
                                    <td className={m.quantite <= m.seuilMinimal ? 'low-stock' : ''}>
                                        {m.quantite}
                                    </td>
                                    <td>{m.seuilMinimal}</td>
                                    <td>{m.uniteMesure}</td>
                                    <td>
                                        <span className={`statut ${getStatutClass(m.statut)}`}>
                                            {getStatutText(m.statut)}
                                        </span>
                                    </td>
                                    <td>{m.description}</td>
                                    <td className="actions-cell">
                                        <button className="edit-btn" onClick={() => handleEdit(m)}>
                                            ✏️
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDeleteClick(m)}>
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <style>{`
                .produits-container { padding: 24px; }
                .header-produits { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px; }
                .actions { display: flex; gap: 10px; align-items: center; }
                .search-input { padding: 10px; border-radius: 8px; border: 1px solid #ccc; width: 250px; }
                .add-btn { background: #0f4c81; color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; }
                .form-container { background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
                .form-container input, .form-container select { padding: 10px; border-radius: 8px; border: 1px solid #ccc; }
                .form-buttons { display: flex; gap: 10px; }
                .save-btn { background: #27ae60; color: white; border: none; border-radius: 8px; cursor: pointer; padding: 10px 20px; }
                .cancel-btn { background: #95a5a6; color: white; border: none; border-radius: 8px; cursor: pointer; padding: 10px 20px; }
                .table-wrapper { background: white; border-radius: 16px; overflow: auto; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
                .table-produits { width: 100%; border-collapse: collapse; }
                .table-produits th, .table-produits td { padding: 14px; border-bottom: 1px solid #eee; text-align: left; }
                .table-produits th { background: #f8f9fa; }
                .table-produits tr:hover { background: #f5f5f5; }
                .low-stock { color: red; font-weight: bold; }
                .statut { padding: 5px 10px; border-radius: 20px; color: white; font-size: 12px; display: inline-block; }
                .disponible { background: #27ae60; }
                .rupture { background: #e74c3c; }
                .perime { background: #f39c12; }
                .actions-cell { display: flex; gap: 8px; }
                .edit-btn, .delete-btn { background: none; border: none; cursor: pointer; font-size: 18px; padding: 5px; border-radius: 6px; transition: 0.2s; }
                .edit-btn:hover { background: #ffc107; }
                .delete-btn:hover { background: #e74c3c; }
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
                .modal-content { background: white; border-radius: 12px; padding: 25px; width: 400px; max-width: 90%; }
                .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
                .btn-delete { background: #e74c3c; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
                .btn-cancel { background: #95a5a6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
                @media (max-width: 768px) {
                    .form-container { grid-template-columns: 1fr; }
                    .header-produits { flex-direction: column; align-items: flex-start; }
                    .actions { width: 100%; flex-direction: column; }
                    .search-input { width: 100%; }
                }
            `}</style>
        </div>
    );
};

export default Produits;