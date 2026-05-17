// Pages/private/Produits.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../../composantes/layout/Layout';
import api from '../../services/api/axiosConfig';

const Produits = () => {
    const [matieres, setMatieres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        chargerMatieres();
    }, []);

    const chargerMatieres = async () => {
        try {
            setLoading(true);
            // URL correcte selon ton backend
            const response = await api.get('/api/matiere-premiere/getAll');
            console.log('📦 Réponse brute:', response);
            
            // Extraire les données
            let data = response.data;
            if (data && !Array.isArray(data) && data.content) {
                data = data.content;
            }
            
            // Nettoyer les données pour éviter la récursion
            const cleanedData = (Array.isArray(data) ? data : []).map(m => ({
                id: m.id,
                nom: m.nomPR || m.nom || 'N/A',
                description: m.description || '-',
                seuilMinimal: m.seuilMinimal || 0,
                uniteMesure: m.uniteMesure || '-',
                statut: m.statut || 'ACTIF',
                quantite: m.stocks?.[0]?.quantiteActuelle || 0
            }));
            
            console.log('✅ Matières nettoyées:', cleanedData);
            setMatieres(cleanedData);
        } catch (err) {
            console.error('❌ Erreur:', err);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="loading-spinner">Chargement des matières...</div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="error-container">
                    <p>❌ Erreur: {error}</p>
                    <button onClick={chargerMatieres} className="retry-btn">Réessayer</button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="produits-container">
                <div className="header-produits">
                    <h1>📦 Matières Premières</h1>
                    <p>{matieres.length} matières disponibles</p>
                </div>

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
                            </tr>
                        </thead>
                        <tbody>
                            {matieres.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="empty-row">Aucune matière trouvée</td>
                                </tr>
                            ) : (
                                matieres.map(m => (
                                    <tr key={m.id}>
                                        <td>{m.id}</td>
                                        <td><strong>{m.nom}</strong></td>
                                        <td className={m.quantite <= m.seuilMinimal ? 'low-stock' : ''}>
                                            {m.quantite}
                                        </td>
                                        <td>{m.seuilMinimal}</td>
                                        <td>{m.uniteMesure}</td>
                                        <td>
                                            <span className={`statut ${m.statut === 'DISPONIBLE' ? 'disponible' : 'indisponible'}`}>
                                                {m.statut === 'DISPONIBLE' ? '✅ Disponible' : '⛔ Indisponible'}
                                            </span>
                                        </td>
                                        <td>{m.description}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .produits-container {
                    padding: 24px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .header-produits {
                    margin-bottom: 24px;
                }
                .header-produits h1 {
                    font-size: 24px;
                    color: #0f4c81;
                    margin-bottom: 8px;
                }
                .header-produits p {
                    color: #666;
                }
                .table-wrapper {
                    background: white;
                    border-radius: 16px;
                    overflow-x: auto;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                .table-produits {
                    width: 100%;
                    border-collapse: collapse;
                }
                .table-produits th,
                .table-produits td {
                    padding: 12px 16px;
                    text-align: left;
                    border-bottom: 1px solid #eee;
                }
                .table-produits th {
                    background: #f8f9fa;
                    font-weight: 600;
                    color: #333;
                }
                .table-produits tr:hover {
                    background: #f5f5f5;
                }
                .low-stock {
                    color: #e74c3c;
                    font-weight: bold;
                }
                .statut {
                    padding: 4px 8px;
                    border-radius: 20px;
                    font-size: 12px;
                }
                .statut.disponible {
                    background: #27ae60;
                    color: white;
                }
                .statut.indisponible {
                    background: #e74c3c;
                    color: white;
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
                    color: #0f4c81;
                }
                .error-container {
                    text-align: center;
                    padding: 50px;
                }
                .retry-btn {
                    background: #0f4c81;
                    color: white;
                    border: none;
                    padding: 10px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    margin-top: 16px;
                }
                @media (max-width: 768px) {
                    .produits-container {
                        padding: 16px;
                    }
                    .table-produits th,
                    .table-produits td {
                        padding: 8px 12px;
                        font-size: 12px;
                    }
                }
            `}</style>
        </Layout>
    );
};

export default Produits;