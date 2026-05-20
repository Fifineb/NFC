import React, { useState, useEffect } from 'react';
import Layout from '../../composantes/layout/Layout';
import { mouvementApi } from '../../services/api/mouvementApi';
import { BiSearch, BiFilter, BiCalendar, BiShow, BiTrash } from 'react-icons/bi';
//import '../../assets/styles/mouvements.css';

const Mouvements = () => {
    const [mouvements, setMouvements] = useState([]);
    const [filteredMouvements, setFilteredMouvements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('TOUS');
    const [selectedMouvement, setSelectedMouvement] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        chargerMouvements();
    }, []);

    useEffect(() => {
        filtrerMouvements();
    }, [mouvements, searchTerm, typeFilter]);

    const chargerMouvements = async () => {
        try {
            setLoading(true);
            const data = await mouvementApi.getAll();
            console.log('📦 Mouvements chargés:', data);
            
            let mouvementsData = data;
            if (data && !Array.isArray(data) && data.content) {
                mouvementsData = data.content;
            }
            
            setMouvements(Array.isArray(mouvementsData) ? mouvementsData : []);
        } catch (err) {
            console.error('❌ Erreur chargement:', err);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const filtrerMouvements = () => {
        let filtered = [...mouvements];
        
        // Filtre par recherche
        if (searchTerm) {
            filtered = filtered.filter(m => 
                m.referenceBon?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.observation?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Filtre par type
        if (typeFilter !== 'TOUS') {
            filtered = filtered.filter(m => m.typeMouvement === typeFilter);
        }
        
        // Trier par date (plus récent d'abord)
        filtered.sort((a, b) => new Date(b.dateMouvement) - new Date(a.dateMouvement));
        
        setFilteredMouvements(filtered);
    };

    const getTypeIcon = (type) => {
        switch(type) {
            case 'ENTREE': return '📥';
            case 'SORTIE': return '📤';
            case 'CONSOMMATION': return '📊';
            default: return '🔄';
        }
    };

    const getTypeClass = (type) => {
        switch(type) {
            case 'ENTREE': return 'type-entree';
            case 'SORTIE': return 'type-sortie';
            case 'CONSOMMATION': return 'type-consommation';
            default: return '';
        }
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce mouvement ?')) {
            try {
                await mouvementApi.delete(id);
                await chargerMouvements();
            } catch (err) {
                console.error('Erreur suppression:', err);
            }
        }
    };

    const handleViewDetails = (mouvement) => {
        setSelectedMouvement(mouvement);
        setShowModal(true);
    };

    if (loading) {
        return (
            <Layout>
                <div className="loading-spinner">Chargement des mouvements...</div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="error-container">
                    <p>❌ Erreur: {error}</p>
                    <button onClick={chargerMouvements}>Réessayer</button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mouvements-container">
                <div className="page-header">
                    <h1>📋 Mouvements de stock</h1>
                    <p>{filteredMouvements.length} mouvements enregistrés</p>
                </div>

                {/* Filtres */}
                <div className="filters-bar">
                    <div className="search-box">
                        <BiSearch className="icon" />
                        <input 
                            type="text" 
                            placeholder="Rechercher par référence..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="type-filters">
                        <button 
                            className={`filter-btn ${typeFilter === 'TOUS' ? 'active' : ''}`}
                            onClick={() => setTypeFilter('TOUS')}
                        >
                            Tous
                        </button>
                        <button 
                            className={`filter-btn ${typeFilter === 'ENTREE' ? 'active' : ''}`}
                            onClick={() => setTypeFilter('ENTREE')}
                        >
                            📥 Entrées
                        </button>
                        <button 
                            className={`filter-btn ${typeFilter === 'SORTIE' ? 'active' : ''}`}
                            onClick={() => setTypeFilter('SORTIE')}
                        >
                            📤 Sorties
                        </button>
                        <button 
                            className={`filter-btn ${typeFilter === 'CONSOMMATION' ? 'active' : ''}`}
                            onClick={() => setTypeFilter('CONSOMMATION')}
                        >
                            📊 Consommations
                        </button>
                    </div>
                </div>

                {/* Tableau des mouvements */}
                <div className="table-wrapper">
                    <table className="mouvements-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Référence</th>
                                <th>Quantité</th>
                                <th>Produit</th>
                                <th>Date</th>
                                <th>Observation</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMouvements.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="empty-row">
                                        Aucun mouvement trouvé
                                    </td>
                                </tr>
                            ) : (
                                filteredMouvements.map(m => (
                                    <tr key={m.id}>
                                        <td>
                                            <span className={`type-badge ${getTypeClass(m.typeMouvement)}`}>
                                                {getTypeIcon(m.typeMouvement)} {m.typeMouvement}
                                            </span>
                                        </td>
                                        <td>{m.referenceBon || '-'}</td>
                                        <td className={m.typeMouvement === 'ENTREE' ? 'quantite-positive' : 'quantite-negative'}>
                                            {m.typeMouvement === 'ENTREE' ? '+' : '-'}{m.quantite}
                                        </td>
                                        <td>{m.stock?.matierePremiere?.nomPR || '-'}</td>
                                        <td>
                                            <BiCalendar className="date-icon" />
                                            {formatDate(m.dateMouvement)}
                                        </td>
                                        <td className="observation-cell">{m.observation || '-'}</td>
                                        <td>
                                            <button 
                                                className="btn-view" 
                                                onClick={() => handleViewDetails(m)}
                                                title="Voir détails"
                                            >
                                                <BiShow />
                                            </button>
                                            <button 
                                                className="btn-delete" 
                                                onClick={() => handleDelete(m.id)}
                                                title="Supprimer"
                                            >
                                                <BiTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal détails */}
                {showModal && selectedMouvement && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Détails du mouvement</h3>
                                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                            </div>
                            <div className="modal-body">
                                <div className="detail-row">
                                    <span className="detail-label">Type :</span>
                                    <span className={`type-badge ${getTypeClass(selectedMouvement.typeMouvement)}`}>
                                        {getTypeIcon(selectedMouvement.typeMouvement)} {selectedMouvement.typeMouvement}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Référence :</span>
                                    <span>{selectedMouvement.referenceBon || '-'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Quantité :</span>
                                    <span className={selectedMouvement.typeMouvement === 'ENTREE' ? 'quantite-positive' : 'quantite-negative'}>
                                        {selectedMouvement.typeMouvement === 'ENTREE' ? '+' : '-'}{selectedMouvement.quantite}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Produit :</span>
                                    <span>{selectedMouvement.stock?.matierePremiere?.nomPR || '-'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Magasin :</span>
                                    <span>{selectedMouvement.stock?.magasin?.nom || '-'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Région :</span>
                                    <span>{selectedMouvement.stock?.magasin?.region?.nomR || '-'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Date :</span>
                                    <span>{formatDate(selectedMouvement.dateMouvement)}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Observation :</span>
                                    <span>{selectedMouvement.observation || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .mouvements-container {
                    padding: 24px;
                }
                .page-header {
                    margin-bottom: 24px;
                }
                .page-header h1 {
                    font-size: 24px;
                    color: #0f4c81;
                    margin-bottom: 8px;
                }
                .page-header p {
                    color: #666;
                }
                .filters-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                    margin-bottom: 24px;
                    padding: 16px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }
                .search-box {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: #f5f5f5;
                    padding: 8px 16px;
                    border-radius: 8px;
                    flex: 1;
                    max-width: 300px;
                }
                .search-box .icon {
                    color: #999;
                }
                .search-box input {
                    border: none;
                    background: none;
                    outline: none;
                    width: 100%;
                }
                .type-filters {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                .filter-btn {
                    padding: 8px 16px;
                    border: 1px solid #ddd;
                    background: white;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .filter-btn.active {
                    background: #0f4c81;
                    color: white;
                    border-color: #0f4c81;
                }
                .table-wrapper {
                    background: white;
                    border-radius: 12px;
                    overflow-x: auto;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }
                .mouvements-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .mouvements-table th,
                .mouvements-table td {
                    padding: 12px 16px;
                    text-align: left;
                    border-bottom: 1px solid #eee;
                }
                .mouvements-table th {
                    background: #f8f9fa;
                    font-weight: 600;
                }
                .type-badge {
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                }
                .type-entree {
                    background: #e8f5e9;
                    color: #2e7d32;
                }
                .type-sortie {
                    background: #ffebee;
                    color: #c62828;
                }
                .type-consommation {
                    background: #e3f2fd;
                    color: #1565c0;
                }
                .quantite-positive {
                    color: #2e7d32;
                    font-weight: 600;
                }
                .quantite-negative {
                    color: #c62828;
                    font-weight: 600;
                }
                .observation-cell {
                    max-width: 200px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .date-icon {
                    margin-right: 6px;
                    vertical-align: middle;
                }
                .btn-view, .btn-delete {
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 18px;
                    padding: 4px 8px;
                    border-radius: 4px;
                }
                .btn-view { color: #0f4c81; }
                .btn-delete { color: #c62828; }
                .btn-view:hover, .btn-delete:hover {
                    background: #f0f0f0;
                }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    border-radius: 16px;
                    width: 500px;
                    max-width: 90%;
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    border-bottom: 1px solid #eee;
                }
                .modal-header h3 {
                    margin: 0;
                }
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                }
                .modal-body {
                    padding: 20px;
                }
                .detail-row {
                    display: flex;
                    padding: 8px 0;
                    border-bottom: 1px solid #f0f0f0;
                }
                .detail-label {
                    width: 120px;
                    font-weight: 600;
                    color: #333;
                }
                .empty-row {
                    text-align: center;
                    padding: 40px;
                    color: #999;
                }
                .loading-spinner {
                    text-align: center;
                    padding: 50px;
                    font-size: 18px;
                }
                .error-container {
                    text-align: center;
                    padding: 50px;
                }
                .error-container button {
                    margin-top: 16px;
                    padding: 8px 20px;
                    background: #0f4c81;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                }
                @media (max-width: 768px) {
                    .filters-bar {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .search-box {
                        max-width: 100%;
                    }
                    .mouvements-table th,
                    .mouvements-table td {
                        padding: 8px 12px;
                        font-size: 12px;
                    }
                }
            `}</style>
        </Layout>
    );
};

export default Mouvements;