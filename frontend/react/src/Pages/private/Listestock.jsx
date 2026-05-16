import React, { useState, useMemo } from 'react'
import Sidebar from './Sidebar'
import Header  from './Header'
import StockDetail from './StockDetail'
import { BiSearch, BiSortAlt2, BiChevronDown, BiChevronUp,
         BiPackage, BiError, BiInfoCircle, BiShow, BiEdit, BiCheck, BiX } from 'react-icons/bi'
import '../../assets/styles/listestock.css'


const UNITES = ['Alger', 'Mascara', 'Batna']

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
            </div>
          </div>

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

        </div>
      )}
    </div>
  )
}


// ── Page principale ───────────────────────────────────────────────
const ListeStock = () => {
  const [produits, setProduits] = useState(produitsInit)
  const [search,   setSearch]   = useState('')
  const [sortAsc,  setSortAsc]  = useState(true)
  const [unite,    setUnite]    = useState('Alger')
  const [detail,   setDetail]   = useState(null)
  const [catFilter, setCatFilter] = useState('Tous')

  const updateSeuil = (id, newSeuil) =>
    setProduits(list => list.map(p => p.id === id ? { ...p, seuil: newSeuil } : p))

  const filtered = useMemo(() => {
  let list = [...produits]
  if (search.trim())
    list = list.filter(p => p.nom.toLowerCase().includes(search.toLowerCase()))
  if (catFilter !== 'Tous')
    list = list.filter(p => p.categorie === catFilter)
  list.sort((a, b) => sortAsc ? a.nom.localeCompare(b.nom) : b.nom.localeCompare(a.nom))
  return list
}, [produits, search, sortAsc, catFilter])

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
            </div>

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
        </div>
      </div>
    </div>
  )
}

export default ListeStock