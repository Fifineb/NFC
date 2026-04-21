// src/Pages/private/DemandeAchat.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { demandeAchatApi } from '../../services/api/bonEntreeApi';
import './DemandeAchat.css';

const DemandeAchat = () => {
    const { t } = useTranslation();
    const [demandes, setDemandes] = useState([]);
    const [urgentes, setUrgentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [allData, urgentesData] = await Promise.all([
                demandeAchatApi.getAll(),
                demandeAchatApi.getUrgentes()
            ]);
            setDemandes(allData);
            setUrgentes(urgentesData);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredDemandes = () => {
        if (filter === 'urgentes') return urgentes;
        if (filter === 'en_attente') return demandes.filter(d => d.statut === 'EN_ATTENTE');
        return demandes;
    };

    if (loading) return <div className="loading">{t('common.loading')}</div>;

    return (
        <div className="demande-achat-container">
            <div className="page-header">
                <h1>{t('demande_achat.title')}</h1>
                <div className="filter-buttons">
                    <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
                        {t('demande_achat.all')}
                    </button>
                    <button className={filter === 'urgentes' ? 'active urgent' : ''} onClick={() => setFilter('urgentes')}>
                        🔴 {t('demande_achat.urgentes')} ({urgentes.length})
                    </button>
                    <button className={filter === 'en_attente' ? 'active' : ''} onClick={() => setFilter('en_attente')}>
                        {t('demande_achat.pending')}
                    </button>
                </div>
            </div>

            <div className="cards-grid">
                {getFilteredDemandes().map((demande) => (
                    <div key={demande.idDa} className={`demande-card ${demande.urgence ? 'urgent' : ''}`}>
                        <div className="card-header">
                            <span className="dossier-num">{demande.numeroDossier}</span>
                            {demande.urgence && <span className="urgent-badge">URGENT</span>}
                        </div>
                        <div className="card-body">
                            <p><strong>{t('demande_achat.date')}:</strong> {demande.dateDemande}</p>
                            <p><strong>{t('demande_achat.departement')}:</strong> {demande.departement}</p>
                            <p><strong>{t('demande_achat.service')}:</strong> {demande.service}</p>
                            <p><strong>{t('demande_achat.nature')}:</strong> {demande.natureMateriel}</p>
                            <p><strong>{t('demande_achat.destination')}:</strong> {demande.destination}</p>
                            <p><strong>{t('demande_achat.delai')}:</strong> {demande.delaiSouhaite}</p>
                        </div>
                        <div className="card-footer">
                            <span className={`status ${demande.statut?.toLowerCase()}`}>
                                {demande.statut}
                            </span>
                            <button className="btn-view">
                                {t('common.view')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DemandeAchat;