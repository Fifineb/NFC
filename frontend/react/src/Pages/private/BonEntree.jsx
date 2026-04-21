import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { bonEntreeApi } from '../../services/api/bonEntreeApi';

const BonEntree = () => {
    const { t } = useTranslation();
    const [bonEntrees, setBonEntrees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBon, setSelectedBon] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadBonEntree();
    }, []);

    const loadBonEntree = async () => {
        try {
            setLoading(true);
            const data = await bonEntreeApi.getAll();
            setBonEntrees(data);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const viewDetails = async (id) => {
        try {
            const data = await bonEntreeApi.getById(id);
            setSelectedBon(data);
            setShowModal(true);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const deleteBon = async (id) => {
        if (window.confirm('Supprimer ce bon d\'entrée ?')) {
            try {
                await bonEntreeApi.delete(id);
                loadBonEntree();
            } catch (error) {
                console.error('Erreur:', error);
            }
        }
    };

    if (loading) return <div className="loading">{t('common.loading')}</div>;

    return (
        <div className="bon-entree-container">
            <div className="page-header">
                <h1>{t('bon_entree.title')}</h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    + {t('bon_entree.new')}
                </button>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>{t('bon_entree.numero')}</th>
                            <th>{t('bon_entree.date')}</th>
                            <th>{t('bon_entree.fournisseur')}</th>
                            <th>{t('bon_entree.provenance')}</th>
                            <th>{t('bon_entree.statut')}</th>
                            <th>{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bonEntrees.map((bon) => (
                            <tr key={bon.idBe}>
                                <td>{bon.numeroBe}</td>
                                <td>{bon.dateBe}</td>
                                <td>{bon.fournisseur?.raisonSociale || '-'}</td>
                                <td>
                                    <span className={`badge ${bon.provenance === 'EXTERNE' ? 'badge-externe' : 'badge-interne'}`}>
                                        {bon.provenance}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge badge-${bon.statut?.toLowerCase()}`}>
                                        {bon.statut}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-view" onClick={() => viewDetails(bon.idBe)}>
                                        👁️
                                    </button>
                                    <button className="btn-delete" onClick={() => deleteBon(bon.idBe)}>
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Détails */}
            {showModal && selectedBon && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{t('bon_entree.details')} - {selectedBon.numeroBe}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="info-grid">
                                <div><strong>{t('bon_entree.date')}:</strong> {selectedBon.dateBe}</div>
                                <div><strong>{t('bon_entree.fournisseur')}:</strong> {selectedBon.fournisseur?.raisonSociale || '-'}</div>
                                <div><strong>{t('bon_entree.provenance')}:</strong> {selectedBon.provenance}</div>
                                <div><strong>{t('bon_entree.code_operation')}:</strong> {selectedBon.codeOperation}</div>
                                <div><strong>{t('bon_entree.observation')}:</strong> {selectedBon.observation || '-'}</div>
                            </div>
                            
                            <h3>{t('bon_entree.lignes')}</h3>
                            <table className="sub-table">
                                <thead>
                                    <tr>
                                        <th>{t('produit.nom')}</th>
                                        <th>{t('bon_entree.quantite_conforme')}</th>
                                        <th>{t('bon_entree.quantite_refusee')}</th>
                                        <th>{t('bon_entree.prix_unitaire')}</th>
                                        <th>{t('bon_entree.montant')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedBon.lignes?.map((ligne, idx) => (
                                        <tr key={idx}>
                                            <td>{ligne.produit?.nomPr}</td>
                                            <td>{ligne.quantiteConforme}</td>
                                            <td>{ligne.quantiteRefusee}</td>
                                            <td>{ligne.prixUnitaire} DZD</td>
                                            <td>{ligne.montant} DZD</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BonEntree;