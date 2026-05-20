// Pages/private/Listestock.jsx
import React, { useState, useMemo, useEffect } from 'react';
import Header from '../../composantes/common/Header';
import StockDetail from './StockDetail';
import { BiSearch, BiSortAlt2, BiChevronDown, BiChevronUp,
         BiPackage, BiError, BiInfoCircle, BiShow, BiEdit, BiCheck, BiX } from 'react-icons/bi';
import api from '../../services/api/axiosConfig';
import '../../assets/styles/listestock.css';

const REGIONS = ['Alger', 'Mascara', 'Batna'];

const getStatut = (quantite, seuil) => {
    if (quantite <= 0) return 'rupture';
    if (quantite < seuil) return 'risque';
    return 'ok';
};

// Composant seuil éditable
const SeuilEditor = ({ seuil, unite_mesure, onSave }) => {
    const [editing, setEditing] = useState(false);
    const [val, setVal] = useState(String(seuil));
    const [err, setErr] = useState('');

    const confirm = () => {
        const n = Number(val);
        if (!val || isNaN(n) || n <= 0) { setErr('Valeur invalide'); return; }
        onSave(n);
        setEditing(false);
        setErr('');
    };

    const cancel = () => {
        setVal(String(seuil));
        setEditing(false);
        setErr('');
    };

    if (!editing) return (
        <div className="seuil-display" onClick={() => setEditing(true)} title="Cliquer pour modifier">
            <span className="seuil-value">{seuil?.toLocaleString()} {unite_mesure}</span>
            <BiEdit className="seuil-edit-icon" />
        </div>
    );

    return (
        <div className="seuil-editor">
            <input
                className={`seuil-input ${err ? 'input-error' : ''}`}
                type="number" min="1"
                value={val}
                onChange={e => { setVal(e.target.value); setErr(''); }}
                onKeyDown={e => { if (e.key === 'Enter') confirm(); if (e.key === 'Escape') cancel(); }}
                autoFocus
            />
            <span className="seuil-unit">{unite_mesure}</span>
            <button className="seuil-btn seuil-ok" onClick={confirm}><BiCheck /></button>
            <button className="seuil-btn seuil-cancel" onClick={cancel}><BiX /></button>
            {err && <span className="err-msg">{err}</span>}
        </div>
    );
};

// Carte produit - Version dynamique
const ProduitCard = ({ produit, region, onVoir, onUpdateSeuil }) => {
    const [expanded, setExpanded] = useState(false);
    
    // Récupérer le stock pour la région sélectionnée
    const stockItem = produit.stocks?.find(s => s.region === region);
    const quantiteActuelle = stockItem?.quantiteActuelle || 0;
    const seuil = produit.seuilMinimal || 500;
    const statut = getStatut(quantiteActuelle, seuil);
    const pct = Math.min(100, Math.max(0, (quantiteActuelle / (seuil * 2)) * 100));
    
    // Calcul des tendances (basé sur les mouvements récents si disponibles)
    const mouvements = stockItem?.mouvements || [];
    const entrees = mouvements.filter(m => m.type === 'ENTREE').reduce((sum, m) => sum + m.quantite, 0);
    const sorties = mouvements.filter(m => m.type === 'SORTIE').reduce((sum, m) => sum + m.quantite, 0);
    const stockInitial = quantiteActuelle - entrees + sorties;

    return (
        <div className={`produit-card statut-${statut}`}>
            {/* Header */}
            <div className="pc-header" onClick={() => setExpanded(!expanded)}>
                <div className="pc-header-left">
                    <div className="pc-icon"><BiPackage /></div>
                    <div>
                        <div className="pc-nom">{produit.nomPR || produit.nom}</div>
                        <div className="pc-cat">{produit.categorie?.nom || 'Matière première'}</div>
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

            {/* Stats dynamiques */}
            <div className="pc-stats">
                <div className="pc-stat">
                    <span className="ps-label">Stock initial</span>
                    <span className="ps-value">{Math.round(stockInitial)} {produit.uniteMesure || 'kg'}</span>
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
                    <span className="ps-value ps-big">{Math.round(quantiteActuelle)} {produit.uniteMesure || 'kg'}</span>
                </div>
            </div>

            {/* Détails étendus */}
            {expanded && (
                <div className="pc-details">
                    <div className="seuil-row">
                        <div className="seuil-label-wrap">
                            <span className="seuil-label">⚠ Seuil minimal de risque</span>
                            <span className="seuil-hint">Cliquer sur la valeur pour modifier</span>
                        </div>
                        <SeuilEditor
                            seuil={seuil}
                            unite_mesure={produit.uniteMesure || 'kg'}
                            onSave={(v) => onUpdateSeuil(produit.id, v)}
                        />
                    </div>

                    <div className="stock-bar-wrap">
                        <div className="stock-bar-label">
                            <span>0</span>
                            <span>Seuil ({seuil} {produit.uniteMesure || 'kg'})</span>
                            <span>{(seuil * 2)}</span>
                        </div>
                        <div className="stock-bar">
                            <div className={`stock-fill fill-${statut}`} style={{ width: `${pct}%` }} />
                            <div className="stock-seuil" style={{ left: '50%' }} title="Seuil" />
                        </div>
                    </div>

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
                            <span className="pd-value">{stockItem?.gisement || '-'}</span>
                        </div>
                        <div className="pd-item">
                            <span className="pd-label">Magasin</span>
                            <span className="pd-value">{stockItem?.magasin || '-'}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Page principale - Version dynamique
const Listestock = () => {
    const [matieres, setMatieres] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [sortAsc, setSortAsc] = useState(true);
    const [region, setRegion] = useState('Alger');
    const [detail, setDetail] = useState(null);
    const [catFilter, setCatFilter] = useState('Tous');

    // Charger les données depuis l'API
    const chargerDonnees = async () => {
        try {
            setLoading(true);
            console.log('📡 Chargement des données...');
            
            // 1. Charger les matières premières
            const matieresRes = await api.get('/api/matiere-premiere/getAll');
            let matieresData = matieresRes.data;
            if (matieresData && !Array.isArray(matieresData) && matieresData.content) {
                matieresData = matieresData.content;
            }
            
            // 2. Charger les stocks
            const stocksRes = await api.get('/api/stock/getAll');
            let stocksData = stocksRes.data;
            if (stocksData && !Array.isArray(stocksData) && stocksData.content) {
                stocksData = stocksData.content;
            }
            
            // 3. Charger les mouvements
            const mouvementsRes = await api.get('/api/mouvements');
            let mouvementsData = mouvementsRes.data;
            if (mouvementsData && !Array.isArray(mouvementsData) && mouvementsData.content) {
                mouvementsData = mouvementsData.content;
            }
            
            console.log('📦 Matières premières:', matieresData?.length || 0);
            console.log('📦 Stocks:', stocksData?.length || 0);
            console.log('📦 Mouvements:', mouvementsData?.length || 0);
            
            setMatieres(Array.isArray(matieresData) ? matieresData : []);
            setStocks(Array.isArray(stocksData) ? stocksData : []);
            
        } catch (err) {
            console.error('❌ Erreur chargement:', err);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        chargerDonnees();
    }, []);

    // Construire les produits avec leurs stocks par région
    const produits = useMemo(() => {
        return matieres.map(matiere => {
            // Récupérer tous les stocks de cette matière
            const matiereStocks = stocks.filter(s => s.matierePremiere?.id === matiere.id);
            
            // Construire les stocks par région
            const stocksByRegion = matiereStocks.map(stock => ({
                id: stock.idSt,
                quantiteActuelle: stock.quantiteActuelle || 0,
                region: stock.magasin?.region?.nomR || 'Alger',
                magasin: stock.magasin?.nom,
                gisement: stock.gisement,
                dateMiseAJour: stock.dateMiseAJour
            }));
            
            return {
                id: matiere.id,
                nomPR: matiere.nomPR,
                nom: matiere.nomPR,
                description: matiere.description,
                uniteMesure: matiere.uniteMesure,
                seuilMinimal: matiere.seuilMinimal,
                stocks: stocksByRegion,
                categorie: matiere.categorie
            };
        });
    }, [matieres, stocks]);

    // Mettre à jour le seuil d'une matière
    const updateSeuil = async (id, newSeuil) => {
        try {
            await api.put(`/api/matiere-premiere/update/${id}`, { seuilMinimal: newSeuil });
            setMatieres(list => list.map(m => m.id === id ? { ...m, seuilMinimal: newSeuil } : m));
        } catch (err) {
            console.error('Erreur mise à jour seuil:', err);
        }
    };

    // Obtenir les catégories uniques
    const categories = ['Tous', ...new Set(produits.map(p => p.categorie?.nom || 'Général'))];

    // Obtenir la quantité pour une région donnée
    const getQuantiteByRegion = (produit, regionName) => {
        const stock = produit.stocks?.find(s => s.region === regionName);
        return stock?.quantiteActuelle || 0;
    };

    // Filtrer et trier les produits
    const filtered = useMemo(() => {
        let list = [...produits];
        if (search.trim()) {
            list = list.filter(p => p.nomPR?.toLowerCase().includes(search.toLowerCase()));
        }
        if (catFilter !== 'Tous') {
            list = list.filter(p => (p.categorie?.nom || 'Général') === catFilter);
        }
        list.sort((a, b) => {
            const nameA = a.nomPR || '';
            const nameB = b.nomPR || '';
            return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });
        return list;
    }, [produits, search, sortAsc, catFilter]);

    // Statistiques
    const totalActuel = produits.reduce((sum, p) => sum + getQuantiteByRegion(p, region), 0);
    const enRupture = produits.filter(p => getQuantiteByRegion(p, region) <= 0).length;
    const enRisque = produits.filter(p => {
        const qte = getQuantiteByRegion(p, region);
        return qte > 0 && qte < (p.seuilMinimal || 500);
    }).length;

    if (loading) {
        return (
            <div className="app-wrapper">
                <div className="Home">
                    <Header />
                    <div className="content-row">
                        <div className="loading-spinner">Chargement des stocks...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="app-wrapper">
                <div className="Home">
                    <Header />
                    <div className="content-row">
                        <div className="error-container">
                            <p>❌ Erreur: {error}</p>
                            <button onClick={chargerDonnees}>Réessayer</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (detail) {
        return (
            <StockDetail
                produit={detail.produit}
                region={detail.region}
                onBack={() => setDetail(null)}
                onUpdateSeuil={updateSeuil}
            />
        );
    }

    return (
        <div className="app-wrapper">
            <div className="Home">
                <Header />
                <div className="content-row">
                    <div className="stock-page">
                        {/* Résumé */}
                        <div className="stock-summary">
                            <div className="ss-card">
                                <span className="ss-label">Produits</span>
                                <span className="ss-value">{produits.length}</span>
                            </div>
                            <div className="ss-card">
                                <span className="ss-label">Stock total ({region})</span>
                                <span className="ss-value">{totalActuel.toLocaleString()}</span>
                            </div>
                            <div className="ss-card ss-danger">
                                <BiError />
                                <span className="ss-label">En rupture</span>
                                <span className="ss-value">{enRupture}</span>
                            </div>
                            <div className="ss-card ss-warn">
                                <BiInfoCircle />
                                <span className="ss-label">À risque</span>
                                <span className="ss-value">{enRisque}</span>
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div className="stock-toolbar">
                            <div className="search-box">
                                <BiSearch className="icon" />
                                <input 
                                    placeholder="Rechercher..." 
                                    value={search}
                                    onChange={e => setSearch(e.target.value)} 
                                />
                            </div>
                            <div className="tris-bar">
                                <button className="sort-btn" onClick={() => setSortAsc(!sortAsc)}>
                                    <BiSortAlt2 /> {sortAsc ? 'A → Z' : 'Z → A'}
                                </button>
                                <div className="cat-filter">
                                    <select value={catFilter} onChange={e => setCatFilter(e.target.value)}> 
                                        {categories.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="unite-tabs">
                                {REGIONS.map(r => (
                                    <button 
                                        key={r} 
                                        className={`unite-tab ${region === r ? 'active' : ''}`}
                                        onClick={() => setRegion(r)}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Liste des produits */}
                        <div className="produits-list">
                            {filtered.length === 0 ? (
                                <div className="no-data">Aucun produit trouvé</div>
                            ) : (
                                filtered.map(p => (
                                    <ProduitCard 
                                        key={p.id} 
                                        produit={p} 
                                        region={region}
                                        onVoir={(prod, reg) => setDetail({ produit: prod, region: reg })}
                                        onUpdateSeuil={updateSeuil}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Listestock;