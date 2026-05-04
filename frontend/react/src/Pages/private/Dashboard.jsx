import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { produitApi } from '../../services/api/produitApi'; 

const Dashboard = () => {
    const { user } = useAuth();

    const [nbProduits, setNbProduits] = useState(0);

    useEffect(() => {
        loadProduits();
    }, []);

    const loadProduits = async () => {
        try {
            const data = await produitApi.getAll();
            setNbProduits(data.length);
        } catch (err) {
            console.error("Erreur produits :", err);
        }
    };

    if (!user) {
        return <div>Chargement...</div>;
    }

    // 🔹 affichage selon rôle
    const renderRoleContent = () => {
        switch (user.role) {
            case "ADMINISTRATEUR":
                return (
                    <div className="grid">
                        <Card title="Utilisateurs" value="12" />
                        <Card title="Produits" value={nbProduits} />
                        <Card title="Mouvements" value={user.mouvements?.length || 0} />
                    </div>
                );

            case "GESTIONNAIRE":
                return (
                    <div className="grid">
                        <Card title="Produits" value={nbProduits} />
                        <Card title="Fournisseurs" value="8" />
                        <Card title="Rapports" value="24" />
                    </div>
                );

            case "MAGASINNIER":
                return (
                    <div className="grid">
                        <Card title="Stock" value={nbProduits} />
                        <Card title="Entrées" value="50" />
                        <Card title="Alertes" value="3" />
                    </div>
                );

            case "SUPERVISEUR":
                return (
                    <div className="grid">
                        <Card title="Rapports à valider" value="5" />
                        <Card title="Rapports validés" value="20" />
                        <Card title="Produits" value={nbProduits} />
                    </div>
                );

            default:
                return <p>Aucune donnée</p>;
        }
    };

    return (
        <div className="dashboard-container">

            {/* 🔹 HEADER */}
            <div className="dashboard-header">
                <h1>Bienvenue {user.prenom} {user.nom} 👋</h1>
                <p>Rôle : {user.role}</p>
            </div>

            {/* 🔹 INFOS USER */}
            <div className="user-info">
                <p><strong>ID :</strong> {user.id_user}</p>
                <p><strong>Email :</strong> {user.email}</p>
                <p><strong>Statut :</strong> {user.statut}</p>
                <p><strong>Date :</strong> {user.date_creation}</p>
                <p><strong>Mouvements :</strong> {user.mouvements?.length || 0}</p>
            </div>

            {/* 🔹 CONTENU */}
            <div className="dashboard-content">
                {renderRoleContent()}
            </div>

        </div>
    );
};

// 🔹 Card
const Card = ({ title, value }) => {
    return (
        <div className="card">
            <h3>{title}</h3>
            <p className="card-value">{value}</p>
        </div>
    );
};

export default Dashboard;