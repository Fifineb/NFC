import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { produitApi } from '../../services/api/produitApi';
import { mouvementApi } from '../../services/api/mouvementApi';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalProduits: 0,
        totalFournisseurs: 0,
        totalMouvements: 0,
        alertes: 0
    });
    const [mouvementsRecents, setMouvementsRecents] = useState([]);

    useEffect(() => {
        loadStats();
        loadMouvementsRecents();
    }, []);

    const loadStats = async () => {
        try {
            const produits = await produitApi.getAll();
            const mouvements = await mouvementApi.getAll();
            setStats({
                totalProduits: produits.length,
                totalFournisseurs: 12,
                totalMouvements: mouvements.length,
                alertes: 3
            });
        } catch (error) {
            console.error('Erreur chargement stats:', error);
        }
    };

    const loadMouvementsRecents = async () => {
        try {
            const data = await mouvementApi.getRecents();
            setMouvementsRecents(data);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Tableau de bord - Administrateur</h1>
            <p>Bienvenue, {user?.prenom} {user?.nom}</p>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Produits</h3>
                    <p className="stat-number">{stats.totalProduits}</p>
                </div>
                <div className="stat-card">
                    <h3>Fournisseurs</h3>
                    <p className="stat-number">{stats.totalFournisseurs}</p>
                </div>
                <div className="stat-card">
                    <h3>Mouvements</h3>
                    <p className="stat-number">{stats.totalMouvements}</p>
                </div>
                <div className="stat-card alert">
                    <h3>Alertes</h3>
                    <p className="stat-number">{stats.alertes}</p>
                </div>
            </div>

            <div className="recent-movements">
                <h2>Derniers mouvements</h2>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Produit</th>
                            <th>Type</th>
                            <th>Quantité</th>
                            <th>Utilisateur</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mouvementsRecents.map(mvt => (
                            <tr key={mvt.id}>
                                <td>{mvt.date}</td>
                                <td>{mvt.produit?.nom}</td>
                                <td>{mvt.type}</td>
                                <td>{mvt.quantite}</td>
                                <td>{mvt.utilisateur?.nom}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;