
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { rapportApi } from '../../services/api/rapportApi';

const Raports = () => {
    const { user } = useAuth();
    const [rapports, setRapports] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        type: '',
        date_debut: '',
        date_fin: '',
        description: ''
    });

    useEffect(() => {
        loadRapports();
    }, []);

    const loadRapports = async () => {
        try {
            setLoading(true);
            const data = await rapportApi.getAll();
            setRapports(data);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await rapportApi.create(formData);
            setShowForm(false);
            setFormData({ type: '', date_debut: '', date_fin: '', description: '' });
            loadRapports();
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    if (loading) return <div>Chargement des rapports...</div>;

    return (
        <div className="rapports-container">
            <div className="page-header">
                <h1>Gestion des rapports</h1>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                    + Nouveau rapport
                </button>
            </div>

            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Créer un rapport</h3>
                        <form onSubmit={handleSubmit}>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                required
                            >
                                <option value="">Sélectionner un type</option>
                                <option value="STOCK">Rapport de stock</option>
                                <option value="ACHAT">Rapport d'achat</option>
                                <option value="VENTE">Rapport de vente</option>
                                <option value="INVENTAIRE">Rapport d'inventaire</option>
                            </select>
                            <input
                                type="date"
                                placeholder="Date début"
                                value={formData.date_debut}
                                onChange={(e) => setFormData({...formData, date_debut: e.target.value})}
                                required
                            />
                            <input
                                type="date"
                                placeholder="Date fin"
                                value={formData.date_fin}
                                onChange={(e) => setFormData({...formData, date_fin: e.target.value})}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                            <div className="form-actions">
                                <button type="submit">Créer</button>
                                <button type="button" onClick={() => setShowForm(false)}>Annuler</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <table className="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Date début</th>
                        <th>Date fin</th>
                        <th>Créé par</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rapports.map(rapport => (
                        <tr key={rapport.id}>
                            <td>{rapport.id}</td>
                            <td>{rapport.type}</td>
                            <td>{rapport.date_debut}</td>
                            <td>{rapport.date_fin}</td>
                            <td>{rapport.createur?.nom || '-'}</td>
                            <td>
                                <span className={`status ${rapport.statut === 'VALIDÉ' ? 'status-validated' : 'status-pending'}`}>
                                    {rapport.statut || 'EN_ATTENTE'}
                                </span>
                            </td>
                            <td>
                                <button className="btn-view">👁️ Voir</button>
                                {user?.role === 'SUPERVISEUR' && rapport.statut !== 'VALIDÉ' && (
                                    <button className="btn-validate">✅ Valider</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default Raports;