// Pages/private/Stock.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../../composantes/layout/Layout';
import { stockService } from '../../services/api/stock';

const Stock = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        chargerStocks();
    }, []);

    const chargerStocks = async () => {
        try {
            setLoading(true);
            // Essaie différentes URLs si besoin
            const response = await stockService.getAll();
            console.log('📦 Stocks chargés:', response);
            
            // Nettoie les données pour éviter la récursion
            let stockData = [];
            if (Array.isArray(response)) {
                stockData = response;
            } else if (response.data && Array.isArray(response.data)) {
                stockData = response.data;
            } else if (response.data && typeof response.data === 'object') {
                stockData = [response.data];
            }
            
            // Nettoyer les données récursives
            const cleanedStocks = stockData.map(s => ({
                id: s.id || s.idSt,
                nom: s.matierePremiere?.nomPR || s.nom || 'N/A',
                quantite: s.quantiteActuelle || s.quantite || 0,
                gisement: s.gisement || '-',
                magasin: s.magasin?.nom || '-',
                seuil: s.matierePremiere?.seuilMinimal || 100
            }));
            
            setStocks(cleanedStocks);
        } catch (err) {
            console.error('❌ Erreur chargement stocks:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <Layout>
            <div className="loading">Chargement des stocks...</div>
        </Layout>
    );

    if (error) return (
        <Layout>
            <div className="error">
                <p>Erreur: {error}</p>
                <button onClick={chargerStocks} className="btn-retry">Réessayer</button>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="stock-container">
                <div className="page-header">
                    <h1>Gestion des Stocks</h1>
                    <p>Liste des matières premières en stock</p>
                </div>

                <div className="stats-summary">
                    <div className="stat-badge">
                        📦 Total: {stocks.length} matières
                    </div>
                    <div className="stat-badge">
                        ⚠️ Alertes: {stocks.filter(s => s.quantite <= s.seuil).length}
                    </div>
                </div>

                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom du produit</th>
                                <th>Quantité</th>
                                <th>Seuil</th>
                                <th>Statut</th>
                                <th>Gisement</th>
                                <th>Magasin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center">Aucun stock trouvé</td>
                                </tr>
                            ) : (
                                stocks.map(stock => (
                                    <tr key={stock.id}>
                                        <td>{stock.id}</td>
                                        <td>{stock.nom}</td>
                                        <td className={stock.quantite <= stock.seuil ? 'stock-low' : ''}>
                                            {stock.quantite}
                                        </td>
                                        <td>{stock.seuil}</td>
                                        <td>
                                            <span className={`status-badge ${stock.quantite <= stock.seuil ? 'danger' : 'success'}`}>
                                                {stock.quantite <= stock.seuil ? '⚠️ Stock bas' : '✅ Normal'}
                                            </span>
                                        </td>
                                        <td>{stock.gisement}</td>
                                        <td>{stock.magasin}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style jsx>{`
                .stock-container {
                    padding: 20px;
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
                .stats-summary {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 24px;
                }
                .stat-badge {
                    background: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .table-container {
                    background: white;
                    border-radius: 16px;
                    overflow-x: auto;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .data-table th,
                .data-table td {
                    padding: 12px 16px;
                    text-align: left;
                    border-bottom: 1px solid #eee;
                }
                .data-table th {
                    background: #f8f9fa;
                    font-weight: 600;
                }
                .stock-low {
                    color: #e74c3c;
                    font-weight: bold;
                }
                .status-badge {
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 12px;
                }
                .status-badge.success {
                    background: #27ae60;
                    color: white;
                }
                .status-badge.danger {
                    background: #e74c3c;
                    color: white;
                }
                .text-center {
                    text-align: center;
                }
                .btn-retry {
                    background: #0f4c81;
                    color: white;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                }
            `}</style>
        </Layout>
    );
};

export default Stock;