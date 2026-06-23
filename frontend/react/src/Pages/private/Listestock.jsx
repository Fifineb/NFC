// Pages/private/Listestock.jsx - Version avec régions dynamiques
import React, { useState, useMemo, useEffect } from 'react';
import { BiSearch, BiSortAlt2, BiChevronDown, BiChevronUp,
         BiPackage, BiError, BiInfoCircle, BiShow } from 'react-icons/bi';
import api from '../../services/api/axiosConfig';

const getStatut = (quantite, seuil) => {
    if (quantite <= 0) return 'rupture';
    if (quantite < seuil) return 'risque';
    return 'ok';
};

const ProduitCard = ({ produit, region, onVoir }) => {
    const [expanded, setExpanded] = useState(false);
    
    // Récupérer le stock pour cette région
    const stockRegion = produit.stocksParRegion?.[region] || { quantite: 0, entrees: 0, sorties: 0 };
    const quantiteActuelle = stockRegion.quantite || 0;
    const seuil = produit.seuilMinimal || 500;
    const statut = getStatut(quantiteActuelle, seuil);
    
    const entrees = stockRegion.entrees || 0;
    const sorties = stockRegion.sorties || 0;
    const stockInitial = quantiteActuelle - entrees + sorties;

    return (
        <div className={`produit-card statut-${statut}`}>
            <div className="pc-header" onClick={() => setExpanded(!expanded)}>
                <div className="pc-header-left">
                    <div className="pc-icon"><BiPackage /></div>
                    <div>
                        <div className="pc-nom">{produit.nom}</div>
                        <div className="pc-cat">{produit.categorie || 'Matière première'}</div>
                    </div>
                </div>
                <div className="pc-header-right">
                    <span className={`statut-badge badge-${statut}`}>
                        {statut === 'rupture' ? '⛔ Rupture' : statut === 'risque' ? '⚠ Risque' : '✓ OK'}
                    </span>
                    <button className="btn-voir" onClick={e => { e.stopPropagation(); onVoir(produit, region); }}>
                        <BiShow /> Détail
                    </button>
                    {expanded ? <BiChevronUp className="pc-chevron"/> : <BiChevronDown className="pc-chevron"/>}
                </div>
            </div>

            <div className="pc-stats">
                <div className="pc-stat">
                    <span className="ps-label">Stock initial</span>
                    <span className="ps-value">{Math.round(stockInitial)} {produit.uniteMesure || 'TONNES'}</span>
                </div>
                <div className="pc-stat">
                    <span className="ps-label">Entrées</span>
                    <span className="ps-value ps-green">+{Math.round(entrees)}</span>
                </div>
                <div className="pc-stat">
                    <span className="ps-label">Sorties</span>
                    <span className="ps-value ps-red">-{Math.round(sorties)}</span>
                </div>
                <div className="pc-stat pc-stat-main">
                    <span className="ps-label">Stock actuel</span>
                    <span className="ps-value ps-big">{Math.round(quantiteActuelle)} {produit.uniteMesure || 'TONNES'}</span>
                </div>
            </div>

            {expanded && (
                <div className="pc-details">
                    <div className="pc-detail-grid">
                        <div className="pd-item">
                            <span className="pd-label">Description</span>
                            <span className="pd-value">{produit.description || '-'}</span>
                        </div>
                        <div className="pd-item">
                            <span className="pd-label">Unité</span>
                            <span className="pd-value">{produit.uniteMesure || '-'}</span>
                        </div>
                        <div className="pd-item">
                            <span className="pd-label">Emplacement</span>
                            <span className="pd-value">{stockRegion.gisement || '-'}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Listestock = () => {
    const [matieres, setMatieres] = useState([]);
    const [regionsList, setRegionsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [sortAsc, setSortAsc] = useState(true);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [detail, setDetail] = useState(null);

    const chargerDonnees = async () => {
        try {
            setLoading(true);
            
            // 1. Charger les régions
            const regionRes = await api.get('/api/region/getAll');
            let regionsData = regionRes.data;
            if (!Array.isArray(regionsData)) regionsData = [];
            const regionNames = regionsData.map(r => r.nomR || r.nom);
            setRegionsList(regionNames);
            if (regionNames.length > 0 && !selectedRegion) {
                setSelectedRegion(regionNames[0]);
            }
            console.log('✅ Régions:', regionNames);
            
            // 2. Charger les matières premières
            const matiereRes = await api.get('/api/matiere-premiere/getAll');
            let matieresData = matiereRes.data;
            if (!Array.isArray(matieresData)) matieresData = [];
            console.log('✅ Matières:', matieresData.length);
            
            // 3. Charger les stocks
            let stocksData = [];
            try {
                const stockRes = await api.get('/api/stock/getAll');
                stocksData = stockRes.data;
                if (!Array.isArray(stocksData)) stocksData = [];
            } catch (err) {
                console.warn('⚠️ Erreur stocks:', err.message);
            }
            
            // 4. Charger les magasins
            let magasinsData = [];
            try {
                const magasinRes = await api.get('/api/magasin/getAll');
                magasinsData = magasinRes.data;
                if (!Array.isArray(magasinsData)) magasinsData = [];
            } catch (err) {
                console.warn('⚠️ Erreur magasins:', err.message);
            }
            
            // Créer un map magasin_id -> region_nom
            const magasinToRegion = {};
            magasinsData.forEach(m => {
                if (m.region && m.region.nomR) {
                    magasinToRegion[m.id] = m.region.nomR;
                } else if (m.region_id) {
                    const region = regionsData.find(r => r.id === m.region_id);
                    if (region) magasinToRegion[m.id] = region.nomR || region.nom;
                }
            });
            
            // Créer un map matiere_id -> stocks par région
            const stocksParMatiere = {};
            stocksData.forEach(stock => {
                const matiereId = stock.matiere_id || stock.matiere?.id;
                const magasinId = stock.magasin_id || stock.magasin?.id;
                const regionNom = magasinToRegion[magasinId] || 'Unité Centrale';
                const quantite = stock.quantite_actuelle || stock.quantiteActuelle || 0;
                
                if (!stocksParMatiere[matiereId]) {
                    stocksParMatiere[matiereId] = {};
                }
                if (!stocksParMatiere[matiereId][regionNom]) {
                    stocksParMatiere[matiereId][regionNom] = { quantite: 0, entrees: 0, sorties: 0, gisement: stock.gisement };
                }
                stocksParMatiere[matiereId][regionNom].quantite += quantite;
            });
            
            // Construire les produits
            const produitsAvecStocks = matieresData.map(m => ({
                id: m.id,
                nom: m.nom_PR || m.nom || 'Sans nom',
                description: m.description || '',
                seuilMinimal: m.seuil_minimal || m.seuilMinimal || 500,
                uniteMesure: m.unite_mesure || m.uniteMesure || 'TONNES',
                statut: m.statut || 'DISPONIBLE',
                categorie: m.categorie?.nom || 'Matière première',
                stocksParRegion: stocksParMatiere[m.id] || {}
            }));
            
            console.log('✅ Produits finaux:', produitsAvecStocks);
            setMatieres(produitsAvecStocks);
            
        } catch (err) {
            console.error('❌ Erreur:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        chargerDonnees();
    }, []);

    // Filtrer et trier
    const filtered = useMemo(() => {
        let list = [...matieres];
        if (search.trim()) {
            list = list.filter(p => p.nom?.toLowerCase().includes(search.toLowerCase()));
        }
        list.sort((a, b) => {
            const nameA = a.nom || '';
            const nameB = b.nom || '';
            return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });
        return list;
    }, [matieres, search, sortAsc]);

    // Statistiques pour la région sélectionnée
    const totalActuel = filtered.reduce((sum, p) => sum + (p.stocksParRegion?.[selectedRegion]?.quantite || 0), 0);
    const enRupture = filtered.filter(p => (p.stocksParRegion?.[selectedRegion]?.quantite || 0) <= 0).length;
    const enRisque = filtered.filter(p => {
        const qte = p.stocksParRegion?.[selectedRegion]?.quantite || 0;
        return qte > 0 && qte < (p.seuilMinimal || 500);
    }).length;

    if (loading) {
        return <div className="stock-page"><div className="loading-spinner">Chargement...</div></div>;
    }

    if (error) {
        return (
            <div className="stock-page">
                <div className="error-container">
                    <p>❌ Erreur: {error}</p>
                    <button onClick={chargerDonnees}>Réessayer</button>
                </div>
            </div>
        );
    }

    if (detail) {
        return (
            <div className="stock-page">
                <button className="back-btn" onClick={() => setDetail(null)}>← Retour</button>
                <div className="detail-view">
                    <h2>{detail.produit.nom}</h2>
                    <p>Région: {detail.region}</p>
                    <p>Quantité: {detail.produit.stocksParRegion?.[detail.region]?.quantite || 0} {detail.produit.uniteMesure}</p>
                    <p>Seuil: {detail.produit.seuilMinimal}</p>
                    <p>Description: {detail.produit.description || '-'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="stock-page">
            <div className="stock-summary">
                <div className="ss-card">
                    <span className="ss-label">📦 Produits</span>
                    <span className="ss-value">{matieres.length}</span>
                </div>
                <div className="ss-card">
                    <span className="ss-label">📊 Stock total ({selectedRegion})</span>
                    <span className="ss-value">{totalActuel.toLocaleString()}</span>
                </div>
                <div className="ss-card ss-danger">
                    <BiError />
                    <span className="ss-label">⛔ En rupture</span>
                    <span className="ss-value">{enRupture}</span>
                </div>
                <div className="ss-card ss-warn">
                    <BiInfoCircle />
                    <span className="ss-label">⚠ À risque</span>
                    <span className="ss-value">{enRisque}</span>
                </div>
            </div>

            <div className="stock-toolbar">
                <div className="search-box">
                    <BiSearch className="icon" />
                    <input 
                        placeholder="Rechercher un produit..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)} 
                    />
                </div>
                <div className="unite-tabs">
                    {regionsList.map(r => (
                        <button 
                            key={r} 
                            className={`unite-tab ${selectedRegion === r ? 'active' : ''}`}
                            onClick={() => setSelectedRegion(r)}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            <div className="produits-list">
                {filtered.length === 0 ? (
                    <div className="no-data">Aucun produit trouvé</div>
                ) : (
                    filtered.map(p => (
                        <ProduitCard 
                            key={p.id} 
                            produit={p} 
                            region={selectedRegion}
                            onVoir={(prod, reg) => setDetail({ produit: prod, region: reg })}
                        />
                    ))
                )}
            </div>

            <style>{`
                .stock-page { padding: 24px; max-width: 1200px; margin: 0 auto; }
                .stock-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
                .ss-card { background: white; padding: 16px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
                .ss-card.ss-danger { border-left: 4px solid #e74c3c; }
                .ss-card.ss-warn { border-left: 4px solid #f39c12; }
                .ss-label { font-size: 14px; color: #666; display: block; }
                .ss-value { font-size: 24px; font-weight: bold; color: #333; }
                .stock-toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; }
                .search-box { display: flex; align-items: center; background: white; border: 1px solid #ddd; border-radius: 8px; padding: 8px 12px; flex: 1; max-width: 300px; }
                .search-box .icon { margin-right: 8px; color: #999; }
                .search-box input { border: none; outline: none; flex: 1; }
                .unite-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
                .unite-tab { padding: 8px 20px; border: none; background: #f0f0f0; border-radius: 20px; cursor: pointer; }
                .unite-tab.active { background: #0f4c81; color: white; }
                .produits-list { display: flex; flex-direction: column; gap: 16px; }
                .produit-card { background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
                .pc-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; flex-wrap: wrap; gap: 10px; }
                .pc-header-left { display: flex; align-items: center; gap: 12px; }
                .pc-icon { font-size: 32px; color: #0f4c81; }
                .pc-nom { font-size: 18px; font-weight: bold; }
                .pc-cat { font-size: 12px; color: #999; }
                .statut-badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; }
                .badge-rupture { background: #e74c3c; color: white; }
                .badge-risque { background: #f39c12; color: white; }
                .badge-ok { background: #27ae60; color: white; }
                .btn-voir { background: #0f4c81; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; margin-left: 12px; }
                .pc-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #eee; }
                .pc-stat { text-align: center; }
                .ps-label { font-size: 12px; color: #999; display: block; }
                .ps-value { font-size: 16px; font-weight: bold; }
                .ps-green { color: #27ae60; }
                .ps-red { color: #e74c3c; }
                .ps-big { font-size: 20px; }
                .loading-spinner, .error-container { text-align: center; padding: 50px; }
                .back-btn { background: #0f4c81; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-bottom: 20px; }
                .detail-view { background: white; padding: 24px; border-radius: 12px; }
                @media (max-width: 768px) {
                    .stock-summary { grid-template-columns: repeat(2, 1fr); }
                    .stock-toolbar { flex-direction: column; align-items: stretch; }
                    .search-box { max-width: 100%; }
                    .pc-stats { grid-template-columns: repeat(2, 1fr); }
                    .pc-header { flex-direction: column; align-items: flex-start; }
                }
            `}</style>
        </div>
    );
};

export default Listestock;