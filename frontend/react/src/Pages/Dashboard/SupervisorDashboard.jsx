import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { rapportApi } from '../../services/api/rapportApi';

const SupervisorDashboard = () => {
    const { user } = useAuth();
    const [rapports, setRapports] = useState([]);
    const [filter, setFilter] = useState('pending');

    useEffect(() => {
        loadRapports();
    }, []);

    const loadRapports = async () => {
        try {
            const data = await rapportApi.getAll();
            setRapports(data);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleValidate = async (id) => {
        try {
            await rapportApi.validate(id);
            loadRapports();
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const filteredRapports = rapports.filter(r => 
        filter === 'all' ? true : r.statut === filter
    );

    return (
        <div className="supervisor-container">
            <h1>Validation des rapports</h1>
            <p>Bienvenue, {user?.prenom} {user?.nom}</p>

            <div className="filter-tabs">
                <button onClick={() => setFilter('pending')}>En attente</button>
                <button onClick={() => setFilter('validated')}>Validés</button>
                <button onClick={() => setFilter('all')}>Tous</button>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Créé par</th>
                        <th>Montant</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRapports.map(rapport => (
                        <tr key={rapport.id}>
                            <td>{rapport.date}</td>
                            <td>{rapport.type}</td>
                            <td>{rapport.createur?.nom}</td>
                            <td>{rapport.montant} DA</td>
                            <td>{rapport.statut}</td>
                            <td>
                                {rapport.statut === 'EN_ATTENTE' && (
                                    <button onClick={() => handleValidate(rapport.id)} className="btn-validate">
                                        ✅ Valider
                                    </button>
                                )}
                                <button className="btn-view">👁️ Voir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SupervisorDashboard;