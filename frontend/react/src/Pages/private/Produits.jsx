import React, { useState, useEffect } from 'react';
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
            // ✅ Le token est automatiquement ajouté par l'intercepteur
            const response = await api.get('/matiere/getAll');
            console.log('📦 Matières chargées:', response.data);
            setMatieres(response.data);
            setError(null);
        } catch (err) {
            console.error('❌ Erreur chargement:', err);
            setError('Impossible de charger les matières');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error}</div>;

    return (
        <div>
            <h2>Liste des matières ({matieres.length})</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Quantité</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {matieres.map(matiere => (
                        <tr key={matiere.id_pr}>
                            <td>{matiere.id_pr}</td>
                            <td>{matiere.nom_pr}</td>
                            <td>{matiere.quantite}</td>
                            <td>{matiere.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Produits;