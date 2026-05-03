// src/Pages/manager/ManagerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { produitApi } from '../../services/api/produitApi';
import { fournisseurApi } from '../../services/api/fournisseurApi';

const ManagerDashboard = () => {
    const { user } = useAuth();
    const [produits, setProduits] = useState([]);
    const [fournisseurs, setFournisseurs] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [produitsData, fournisseursData] = await Promise.all([
                produitApi.getAll(),
                fournisseurApi.getAll()
            ]);
            setProduits(produitsData);
            setFournisseurs(fournisseursData);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleAddProduit = async (produit) => {
        try {
            await produitApi.create(produit);
            loadData();
            setShowAddModal(false);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleDeleteProduit = async (id) => {
        if (window.confirm('Supprimer ce produit ?')) {
            try {
                await produitApi.delete(id);
                loadData();
            } catch (error) {
                console.error('Erreur:', error);
            }
        }
    };

    const filteredProduits = produits.filter(p => 
        p.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manager-container">
            <h1>Gestion des produits</h1>
            <p>Bienvenue, {user?.prenom} {user?.nom}</p>

            <div className="actions-bar">
                <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button onClick={() => setShowAddModal(true)} className="btn-primary">
                    + Ajouter un produit
                </button>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Seuil minimal</th>
                        <th>Unité</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProduits.map(produit => (
                        <tr key={produit.id}>
                            <td>{produit.nom}</td>
                            <td>{produit.description}</td>
                            <td>{produit.seuilMinimal}</td>
                            <td>{produit.uniteMesure}</td>
                            <td className={produit.stock < produit.seuilMinimal ? 'low-stock' : ''}>
                                {produit.stock || 0}
                            </td>
                            <td>
                                <button className="btn-edit">✏️</button>
                                <button className="btn-delete" onClick={() => handleDeleteProduit(produit.id)}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManagerDashboard;