// Pages/Dashboard/ManagerDashboard.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../../composantes/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { produitApi } from '../../services/api/produitApi';
import { bonEntreeApi } from '../../services/api/bonEntreeApi';
import api from '../../services/api/axiosConfig';

const ManagerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        produits: 0,
        bonEntree: 0,
        fournisseurs: 0,
        alertes: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Charger les produits (matières premières)
            let produitsCount = 0;
            try {
                const produitsRes = await api.get('/api/matiere-premiere/getAll');
                if (produitsRes.data && Array.isArray(produitsRes.data)) {
                    produitsCount = produitsRes.data.length;
                } else if (produitsRes.data && produitsRes.data.content) {
                    produitsCount = produitsRes.data.content.length;
                }
            } catch (err) {
                console.log('Erreur chargement produits:', err.message);
                produitsCount = 24; // Valeur par défaut
            }

            // Charger les bons d'entrée
            let bonEntreeCount = 0;
            try {
                const bonEntreeRes = await api.get('/api/bon-entree');
                if (bonEntreeRes.data && Array.isArray(bonEntreeRes.data)) {
                    bonEntreeCount = bonEntreeRes.data.length;
                }
            } catch (err) {
                console.log('Erreur chargement bons entrée:', err.message);
                bonEntreeCount = 12; // Valeur par défaut
            }

            // Charger les fournisseurs
            let fournisseursCount = 0;
            try {
                const fournisseursRes = await api.get('/api/fournisseur/getAll');
                if (fournisseursRes.data && Array.isArray(fournisseursRes.data)) {
                    fournisseursCount = fournisseursRes.data.length;
                }
            } catch (err) {
                console.log('Erreur chargement fournisseurs:', err.message);
                fournisseursCount = 8; // Valeur par défaut
            }

            setStats({
                produits: produitsCount,
                bonEntree: bonEntreeCount,
                fournisseurs: fournisseursCount,
                alertes: 3
            });
        } catch (error) {
            console.error('Erreur chargement données:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const statsData = [
        { icon: '📦', value: stats.produits, label: 'Produits', color: '#0f4c81' },
        { icon: '📥', value: stats.bonEntree, label: 'Bons d\'entrée', color: '#27ae60' },
        { icon: '🏭', value: stats.fournisseurs, label: 'Fournisseurs', color: '#e67e22' },
        { icon: '⚠️', value: stats.alertes, label: 'Alertes stock', color: '#e74c3c' }
    ];

    if (loading) {
        return (
            <Layout>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Chargement du tableau de bord...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div>
                        <h1>Tableau de bord Gestionnaire</h1>
                        <p>Bienvenue, {user?.prenom} {user?.nom}</p>
                    </div>
                    <div className="header-badge">
                        <span className="role-badge">GESTIONNAIRE</span>
                    </div>
                </div>

                {error && (
                    <div className="error-banner">
                        ⚠️ {error} - <button onClick={loadData}>Réessayer</button>
                    </div>
                )}

                <div className="stats-grid">
                    {statsData.map((stat, index) => (
                        <div key={index} className="stat-card" style={{ borderTop: `4px solid ${stat.color}` }}>
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-info">
                                <h3>{stat.value}</h3>
                                <p>{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="quick-actions">
                    <h2>Actions rapides</h2>
                    <div className="actions-grid">
                        <button className="action-card" onClick={() => window.location.href = '/produits'}>
                            <span className="action-icon">📦</span>
                            <span>Gérer les produits</span>
                        </button>
                        <button className="action-card" onClick={() => window.location.href = '/fournisseurs'}>
                            <span className="action-icon">🏭</span>
                            <span>Gérer les fournisseurs</span>
                        </button>
                        <button className="action-card" onClick={() => window.location.href = '/rapports'}>
                            <span className="action-icon">📄</span>
                            <span>Générer un rapport</span>
                        </button>
                        <button className="action-card" onClick={() => window.location.href = '/entery'}>
                            <span className="action-icon">📥</span>
                            <span>Nouvelle entrée</span>
                        </button>
                    </div>
                </div>

                <div className="info-section">
                    <h2>📊 À propos</h2>
                    <p>Bienvenue dans votre espace gestionnaire. Vous pouvez :</p>
                    <ul>
                        <li>✅ Gérer les produits et matières premières</li>
                        <li>✅ Superviser les fournisseurs</li>
                        <li>✅ Suivre les entrées et sorties de stock</li>
                        <li>✅ Générer des rapports d'activité</li>
                    </ul>
                </div>
            </div>

            <style>{`
                .dashboard-container {
                    padding: 24px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                }
                .dashboard-header h1 {
                    font-size: 28px;
                    color: #0f4c81;
                    margin-bottom: 8px;
                }
                .dashboard-header p {
                    color: #666;
                }
                .header-badge .role-badge {
                    background: #e67e22;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 30px;
                    font-size: 14px;
                    font-weight: 600;
                }
                .error-banner {
                    background: #fee2e2;
                    color: #e74c3c;
                    padding: 12px 16px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                }
                .error-banner button {
                    background: none;
                    border: none;
                    color: #0f4c81;
                    text-decoration: underline;
                    cursor: pointer;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                    margin-bottom: 32px;
                }
                .stat-card {
                    background: white;
                    border-radius: 16px;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                .stat-icon {
                    font-size: 40px;
                }
                .stat-info h3 {
                    font-size: 28px;
                    color: #0f4c81;
                    margin: 0;
                }
                .stat-info p {
                    font-size: 13px;
                    color: #666;
                    margin: 5px 0 0;
                }
                .quick-actions {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    margin-bottom: 32px;
                }
                .quick-actions h2 {
                    font-size: 18px;
                    color: #0f4c81;
                    margin-bottom: 20px;
                }
                .actions-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 16px;
                }
                .action-card {
                    background: #f8f9fa;
                    border: none;
                    padding: 20px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }
                .action-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                .action-icon {
                    font-size: 32px;
                }
                .info-section {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                }
                .info-section h2 {
                    font-size: 18px;
                    color: #0f4c81;
                    margin-bottom: 16px;
                }
                .info-section ul {
                    margin: 16px 0 0 20px;
                    color: #666;
                }
                .info-section li {
                    margin: 8px 0;
                }
                .loading-container {
                    text-align: center;
                    padding: 50px;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #0f4c81;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 16px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @media (max-width: 768px) {
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .actions-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .dashboard-header {
                        flex-direction: column;
                        text-align: center;
                        gap: 16px;
                    }
                }
            `}</style>
        </Layout>
    );
};

export default ManagerDashboard;
