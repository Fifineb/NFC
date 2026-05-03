import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { produitApi } from '../../services/api/produitApi';
import { mouvementApi } from '../../services/api/mouvementApi';

const StockerDashboard = () => {
    const { user } = useAuth();
    const [produits, setProduits] = useState([]);
    const [showEntryModal, setShowEntryModal] = useState(false);
    const [selectedProduit, setSelectedProduit] = useState(null);
    const [quantite, setQuantite] = useState('');

    useEffect(() => {
        loadProduits();
    }, []);

    const loadProduits = async () => {
        try {
            const data = await produitApi.getAll();
            setProduits(data);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleBonEntree = async (e) => {
        e.preventDefault();
        try {
            await mouvementApi.create({
                produitId: selectedProduit.id,
                quantite: parseFloat(quantite),
                type: 'ENTREE',
                observation: 'Bon d\'entrée'
            });
            loadProduits();
            setShowEntryModal(false);
            setSelectedProduit(null);
            setQuantite('');
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    return (
        <div className="stocker-container">
            <h1>Gestion du stock</h1>
            <p>Bienvenue, {user?.prenom} {user?.nom}</p>

            <div className="alert-banner">
                ⚠️ Produits en alerte : {produits.filter(p => p.stock < p.seuilMinimal).length}
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Nom</th>
                        <th>Stock actuel</th>
                        <th>Seuil</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {produits.map(produit => (
                        <tr key={produit.id} className={produit.stock < produit.seuilMinimal ? 'alert-row' : ''}>
                            <td>{produit.code}</td>
                            <td>{produit.nom}</td>
                            <td>{produit.stock} {produit.unite}</td>
                            <td>{produit.seuilMinimal}</td>
                            <td>
                                {produit.stock === 0 ? 'RUPTURE' : 
                                 produit.stock < produit.seuilMinimal ? 'STOCK BAS' : 'OK'}
                            </td>
                            <td>
                                <button onClick={() => {
                                    setSelectedProduit(produit);
                                    setShowEntryModal(true);
                                }} className="btn-entry">
                                    📥 Entrée
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showEntryModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Bon d'entrée - {selectedProduit?.nom}</h3>
                        <form onSubmit={handleBonEntree}>
                            <input
                                type="number"
                                placeholder="Quantité"
                                value={quantite}
                                onChange={(e) => setQuantite(e.target.value)}
                                required
                            />
                            <button type="submit">Valider</button>
                            <button type="button" onClick={() => setShowEntryModal(false)}>Annuler</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockerDashboard;