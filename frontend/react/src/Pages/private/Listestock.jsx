<<<<<<< HEAD
import React, { useState, useMemo } from 'react'
import Sidebar from '../../composantes/common/Sidebar'
import Header  from '../../composantes/common/Header'
import StockDetail from './StockDetail'
import { BiSearch, BiSortAlt2, BiChevronDown, BiChevronUp,
         BiPackage, BiError, BiInfoCircle, BiShow, BiEdit, BiCheck, BiX } from 'react-icons/bi'
import '../../assets/styles/listestock.css'

=======
// Pages/private/Listestock.jsx - Version avec régions dynamiques
import React, { useState, useMemo, useEffect } from 'react';
import { BiSearch, BiSortAlt2, BiChevronDown, BiChevronUp,
         BiPackage, BiError, BiInfoCircle, BiShow } from 'react-icons/bi';
import api from '../../services/api/axiosConfig';
>>>>>>> cdb999b (listeproduit)

const UNITES = ['Alger', 'Mascara', 'Batna']

<<<<<<< HEAD
const produitsInit = [
  {
    id: 1, nom: 'Fil de soudure', categorie: 'Soudure',
    hasTaille: true, tailles: ['1mm', '1.2mm'], unite_mesure: 'kg',
    seuil: 6000,
    stocks: {
      Alger:   { initial: 1000, entrees: 500,  sorties: 320  },
      Mascara: { initial: 1000, entrees: 300,  sorties: 180  },
      Batna:   { initial: 1000, entrees: 200,  sorties: 95   },
    },
    consommation_mensuelle: 320,
  },
  {
    id: 2, nom: 'Laiton', categorie: 'Métaux',
    hasTaille: true, tailles: ['1mm', '1.2mm'], unite_mesure: 'kg',
    seuil: 6000,
    stocks: {
      Alger:   { initial: 1000, entrees: 400,  sorties: 998  },
      Mascara: { initial: 1000, entrees: 150,  sorties: 1000 },
      Batna:   { initial: 1000, entrees: 100,  sorties: 210  },
    },
    consommation_mensuelle: 210,
  },
  {
    id: 3, nom: 'Fil de zinc', categorie: 'Métaux',
    hasTaille: true, tailles: ['1mm', '1.2mm'], unite_mesure: 'kg',
    seuil: 6000,
    stocks: {
      Alger:   { initial: 1000, entrees: 600,  sorties: 400  },
      Mascara: { initial: 1000, entrees: 250,  sorties: 5800 },
      Batna:   { initial: 1000, entrees: 300,  sorties: 150  },
    },
    consommation_mensuelle: 400,
  },
  {
    id: 4, nom: 'Huile', categorie: 'Lubrifiants',
    hasTaille: false, tailles: [], unite_mesure: 'L',
    seuil: 500,
    stocks: {
      Alger:   { initial: 1000, entrees: 200,  sorties: 180  },
      Mascara: { initial: 1000, entrees: 100,  sorties: 90   },
      Batna:   { initial: 1000, entrees: 80,   sorties: 75   },
    },
    consommation_mensuelle: 180,
  },
]

const calcStock = (s)       => s.initial + s.entrees - s.sorties
const calcSacs  = (a)       => Math.floor(a / 25)
const calcJour  = (m)       => +(m / 30).toFixed(1)
const getStatut = (a, seuil) => a <= 0 ? 'rupture' : a < seuil ? 'risque' : 'ok'

const CATEGORIES = ['Tous',  ...new Set(produitsInit.map(r => r.categorie))]

// ── Composant seuil éditable inline ──────────────────────────────
const SeuilEditor = ({ seuil, unite_mesure, onSave }) => {
  const [editing, setEditing] = useState(false)
  const [val,     setVal]     = useState(String(seuil))
  const [err,     setErr]     = useState('')

  const confirm = () => {
    const n = Number(val)
    if (!val || isNaN(n) || n <= 0) { setErr('Valeur invalide'); return }
    onSave(n)
    setEditing(false)
    setErr('')
  }

  const cancel = () => {
    setVal(String(seuil))
    setEditing(false)
    setErr('')
  }

  if (!editing) return (
    <div className="seuil-display" onClick={() => setEditing(true)} title="Cliquer pour modifier">
      <span className="seuil-value">{seuil.toLocaleString()} {unite_mesure}</span>
      <BiEdit className="seuil-edit-icon" />
    </div>
  )

  return (
    <div className="seuil-editor">
      <input
        className={`seuil-input ${err ? 'input-error' : ''}`}
        type="number" min="1"
        value={val}
        onChange={e => { setVal(e.target.value); setErr('') }}
        onKeyDown={e => { if (e.key === 'Enter') confirm(); if (e.key === 'Escape') cancel() }}
        autoFocus
      />
      <span className="seuil-unit">{unite_mesure}</span>
      <button className="seuil-btn seuil-ok"  onClick={confirm}><BiCheck /></button>
      <button className="seuil-btn seuil-cancel" onClick={cancel}><BiX /></button>
      {err && <span className="err-msg">{err}</span>}
    </div>
  )
}

// ── Carte produit ─────────────────────────────────────────────────
const ProduitCard = ({ produit, unite, onVoir, onUpdateSeuil }) => {
  const [taille,   setTaille]   = useState(produit.tailles[0] ?? null)
  const [expanded, setExpanded] = useState(false)

  const s      = produit.stocks[unite]
  const actuel = calcStock(s)
  const statut = getStatut(actuel, produit.seuil)
  const sacs   = calcSacs(actuel)
  const jour   = calcJour(produit.consommation_mensuelle)
  const aCmd   = Math.max(0, produit.consommation_mensuelle * 2 - actuel)
  const pct    = Math.min(100, Math.max(0, (actuel / (produit.seuil * 2)) * 100))

  return (
    <div className={`produit-card statut-${statut}`}>

      {/* Header */}
      <div className="pc-header" onClick={() => setExpanded(!expanded)}>
        <div className="pc-header-left">
          <div className="pc-icon"><BiPackage /></div>
          <div>
            <div className="pc-nom">{produit.nom}</div>
            <div className="pc-cat">{produit.categorie}</div>
          </div>
        </div>
        <div className="pc-header-right">
          <span className={`statut-badge badge-${statut}`}>
            {statut === 'rupture' ? '⛔ Rupture'
              : statut === 'risque' ? '⚠ Risque' : '✓ OK'}
          </span>
          <button className="btn-voir"
            onClick={e => { e.stopPropagation(); onVoir(produit, taille) }}>
            <BiShow /> Détail
          </button>
          {expanded ? <BiChevronUp className="pc-chevron"/> : <BiChevronDown className="pc-chevron"/>}
        </div>
      </div>

      {/* Taille */}
      {produit.hasTaille && (
        <div className="pc-tailles">
          {produit.tailles.map(t => (
            <button key={t} className={`taille-btn ${taille === t ? 'active' : ''}`}
              onClick={() => setTaille(t)}>{t}</button>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="pc-stats">
        {[
          { label: 'Stock initial', val: `${s.initial.toLocaleString()} ${produit.unite_mesure}`, cls: '' },
          { label: 'Entrées',       val: `+${s.entrees.toLocaleString()}`,                        cls: 'ps-green' },
          { label: 'Sorties',       val: `-${s.sorties.toLocaleString()}`,                        cls: 'ps-red' },
          { label: 'Stock actuel',  val: `${actuel.toLocaleString()} ${produit.unite_mesure}`,    cls: 'ps-big', main: true },
        ].map(({ label, val, cls, main }) => (
          <div key={label} className={`pc-stat ${main ? `pc-stat-main statut-bg-${statut}` : ''}`}>
            <span className="ps-label">{label}</span>
            <span className={`ps-value ${cls}`}>{val}</span>
          </div>
        ))}
      </div>

      {/* Détails */}
      {expanded && (
        <div className="pc-details">

          {/* Seuil minimal éditable */}
          <div className="seuil-row" onClick={e => e.stopPropagation()}>
            <div className="seuil-label-wrap">
              <span className="seuil-label">⚠ Seuil minimal de risque</span>
              <span className="seuil-hint">Cliquer sur la valeur pour modifier</span>
            </div>
            <SeuilEditor
              seuil={produit.seuil}
              unite_mesure={produit.unite_mesure}
              onSave={(v) => onUpdateSeuil(produit.id, v)}
            />
          </div>

          {/* Barre stock vs seuil */}
          <div className="stock-bar-wrap">
            <div className="stock-bar-label">
              <span>0</span>
              <span>Seuil ({produit.seuil.toLocaleString()} {produit.unite_mesure})</span>
              <span>{(produit.seuil * 2).toLocaleString()}</span>
            </div>
            <div className="stock-bar">
              <div className={`stock-fill fill-${statut}`} style={{ width: `${pct}%` }} />
              <div className="stock-seuil" style={{ left: '50%' }} title="Seuil" />
=======
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
>>>>>>> cdb999b (listeproduit)
            </div>
          </div>

<<<<<<< HEAD
          {/* Détail grid */}
          <div className="pc-detail-grid">
            {[
              { label: 'Nb sacs',          val: `${sacs} sacs`,                                    cls: '' },
              { label: 'Conso mensuelle',  val: `${produit.consommation_mensuelle} ${produit.unite_mesure}/mois`, cls: '' },
              { label: 'Conso journalière',val: `${jour} ${produit.unite_mesure}/j`,                cls: '' },
              { label: 'À commander',      val: aCmd > 0 ? `${aCmd.toLocaleString()} ${produit.unite_mesure}` : '—', cls: aCmd > 0 ? 'ps-red' : 'ps-green' },
            ].map(({ label, val, cls }) => (
              <div key={label} className="pd-item">
                <span className="pd-label">{label}</span>
                <span className={`pd-value ${cls}`}>{val}</span>
              </div>
            ))}
          </div>

=======
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
>>>>>>> cdb999b (listeproduit)
        </div>
      )}
    </div>
  )
}

<<<<<<< HEAD

// ── Page principale ───────────────────────────────────────────────
const Listestock = () => {
  const [produits, setProduits] = useState(produitsInit)
  const [search,   setSearch]   = useState('')
  const [sortAsc,  setSortAsc]  = useState(true)
  const [unite,    setUnite]    = useState('Alger')
  const [detail,   setDetail]   = useState(null)
  const [catFilter, setCatFilter] = useState('Tous')

  const updateSeuil = (id, newSeuil) =>
    setProduits(list => list.map(p => p.id === id ? { ...p, seuil: newSeuil } : p))
=======
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
>>>>>>> cdb999b (listeproduit)

  const filtered = useMemo(() => {
  let list = [...produits]
  if (search.trim())
    list = list.filter(p => p.nom.toLowerCase().includes(search.toLowerCase()))
  if (catFilter !== 'Tous')
    list = list.filter(p => p.categorie === catFilter)
  list.sort((a, b) => sortAsc ? a.nom.localeCompare(b.nom) : b.nom.localeCompare(a.nom))
  return list
}, [produits, search, sortAsc, catFilter])

<<<<<<< HEAD
  const totalActuel = produits.reduce((s, p) => s + calcStock(p.stocks[unite]), 0)
  const enRupture   = produits.filter(p => calcStock(p.stocks[unite]) <= 0).length
  const enRisque    = produits.filter(p => {
    const a = calcStock(p.stocks[unite])
    return a > 0 && a < p.seuil
  }).length

  if (detail) return (
    <StockDetail
      produit={detail.produit}
      tailleInit={detail.taille}
      unite={unite}
      onBack={() => setDetail(null)}
      onUpdateSeuil={updateSeuil}
    />
  )


  return (
    <div className="app-wrapper">
      <Sidebar />
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
                <span className="ss-label">Stock total ({unite})</span>
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
                <input placeholder="Rechercher..." value={search}
                  onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="tris-bar">
              <button className="sort-btn" onClick={() => setSortAsc(!sortAsc)}>
                <BiSortAlt2 /> {sortAsc ? 'A → Z' : 'Z → A'}
              </button>
              <div className="cat-filter">
              <select value={catFilter} onChange={e => setCatFilter(e.target.value)} > 
                {CATEGORIES.map(c => ( <option key={c}>{c}</option>))}
              </select>
              </div>
              </div>
              <div className="unite-tabs">
                {UNITES.map(u => (
                  <button key={u} className={`unite-tab ${unite === u ? 'active' : ''}`}
                    onClick={() => setUnite(u)}>{u}</button>
                ))}
              </div>
=======
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
>>>>>>> cdb999b (listeproduit)
            </div>

<<<<<<< HEAD
            {/* Liste */}
            <div className="produits-list">
              {filtered.length === 0
                ? <div className="no-data">Aucun produit trouvé</div>
                : filtered.map(p => (
                  <ProduitCard key={p.id} produit={p} unite={unite}
                    onVoir={(prod, taille) => setDetail({ produit: prod, taille })}
                    onUpdateSeuil={updateSeuil}
                  />
                ))
              }
            </div>

          </div>
=======
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
>>>>>>> cdb999b (listeproduit)
        </div>
      </div>
    </div>
  )
}

export default Listestock