import React, { useState } from 'react'
import Sidebar from '../../composantes/common/Sidebar'
import Header  from '../../composantes/common/Header'
import {
  BiArrowBack, BiPlus, BiTrash, BiEdit, BiSave,
  BiX, BiPackage, BiCalendar, BiChevronDown, BiChevronUp
} from 'react-icons/bi'
import '../../assets/styles/listestock.css'

const calcStock = (s) => s.initial + s.entrees - s.sorties
const calcSacs  = (a) => Math.floor(a / 25)
const calcJour  = (m) => +(m / 30).toFixed(1)
const getStatut = (a) => a <= 0 ? 'rupture' : a < 6000 ? 'risque' : 'ok'

const UNITES = ['Alger', 'Mascara', 'Batna']

// Saisies initiales d'exemple
const saisiesInit = (produit, taille) => [
  {
    id: 1,
    date: '2026-01-01',
    unite: 'Alger',
    taille: taille ?? '—',
    initial: 1000,
    entrees: 500,
    sorties: 200,
    observation: 'Stock de départ',
    auteur: 'Admin',
  },
  {
    id: 2,
    date: '2026-02-15',
    unite: 'Alger',
    taille: taille ?? '—',
    initial: 1300,
    entrees: 300,
    sorties: 120,
    observation: 'Réception fournisseur AlphaMat',
    auteur: 'Karim D.',
  },
  {
    id: 3,
    date: '2026-03-10',
    unite: 'Mascara',
    taille: taille ?? '—',
    initial: 1000,
    entrees: 150,
    sorties: 300,
    observation: 'Sortie atelier nord',
    auteur: 'Sara M.',
  },
]

const emptyForm = (taille) => ({
  date:        new Date().toISOString().slice(0, 10),
  unite:       'Alger',
  taille:      taille ?? '—',
  initial:     '',
  entrees:     '',
  sorties:     '',
  observation: '',
  auteur:      '',
})

// Ajoutez en haut de StockDetail, après les imports :
const SeuilEditor = ({ seuil, unite_mesure, onSave }) => {
  const [editing, setEditing] = useState(false)
  const [val,     setVal]     = useState(String(seuil))
  const [err,     setErr]     = useState('')

  const confirm = () => {
    const n = Number(val)
    if (!val || isNaN(n) || n <= 0) { setErr('Valeur invalide'); return }
    onSave(n); setEditing(false); setErr('')
  }
  const cancel = () => { setVal(String(seuil)); setEditing(false); setErr('') }

  if (!editing) return (
    <div className="seuil-display" onClick={() => setEditing(true)}>
      <span className="seuil-value">{seuil.toLocaleString()} {unite_mesure}</span>
      <BiEdit className="seuil-edit-icon" />
    </div>
  )
  return (
    <div className="seuil-editor">
      <input className={`seuil-input ${err?'input-error':''}`} type="number" min="1"
        value={val} onChange={e=>{setVal(e.target.value);setErr('')}}
        onKeyDown={e=>{if(e.key==='Enter')confirm();if(e.key==='Escape')cancel()}} autoFocus />
      <span className="seuil-unit">{unite_mesure}</span>
      <button className="seuil-btn seuil-ok"     onClick={confirm}><BiCheck /></button>
      <button className="seuil-btn seuil-cancel"  onClick={cancel}><BiX /></button>
      {err && <span className="err-msg">{err}</span>}
    </div>
  )
}


const StockDetail = ({ produit, tailleInit, unite: uniteDefault, onBack }) => {
  const [saisies,    setSaisies]    = useState(saisiesInit(produit, tailleInit))
  const [showForm,   setShowForm]   = useState(false)
  const [form,       setForm]       = useState(emptyForm(tailleInit))
  const [errors,     setErrors]     = useState({})
  const [editId,     setEditId]     = useState(null)
  const [filterU,    setFilterU]    = useState('Tous')
  const [filterT,    setFilterT]    = useState('Tous')
  const [sortDesc,   setSortDesc]   = useState(true)
  const [expandId,   setExpandId]   = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.date)                              e.date    = 'Requis'
    if (!form.initial || isNaN(form.initial))    e.initial = 'Invalide'
    if (!form.entrees  || isNaN(form.entrees))   e.entrees = 'Invalide'
    if (!form.sorties  || isNaN(form.sorties))   e.sorties = 'Invalide'
    if (!form.auteur.trim())                     e.auteur  = 'Requis'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    const saisie = {
      ...form,
      id:      editId ?? Date.now(),
      initial: Number(form.initial),
      entrees: Number(form.entrees),
      sorties: Number(form.sorties),
    }

    if (editId) {
      setSaisies(s => s.map(x => x.id === editId ? saisie : x))
      setEditId(null)
    } else {
      setSaisies(s => [...s, saisie])
    }

    setForm(emptyForm(tailleInit))
    setErrors({})
    setShowForm(false)
  }

  const handleEdit = (s) => {
    setForm({ ...s, initial: String(s.initial), entrees: String(s.entrees), sorties: String(s.sorties) })
    setEditId(s.id)
    setShowForm(true)
    setExpandId(null)
  }

  const handleDelete = (id) => setSaisies(s => s.filter(x => x.id !== id))

  const handleCancel = () => {
    setForm(emptyForm(tailleInit))
    setErrors({})
    setEditId(null)
    setShowForm(false)
  }

  // Filtres + tri
  const filtered = saisies
    .filter(s => filterU === 'Tous' || s.unite  === filterU)
    .filter(s => filterT === 'Tous' || s.taille === filterT)
    .sort((a, b) => sortDesc
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
    )

  // Stats agrégées sur les saisies filtrées
  const totalEntrees = filtered.reduce((s, x) => s + x.entrees, 0)
  const totalSorties = filtered.reduce((s, x) => s + x.sorties, 0)
  const derniere     = filtered[0]
  const stockDernier = derniere ? calcStock(derniere) : 0
  const statut       = getStatut(stockDernier)

  const tailles = produit.hasTaille ? produit.tailles : []

  return (
    <div className="app-wrapper">
      <Sidebar />
      <div className="Home">
        <Header />
        <div className="content-row">
          <div className="detail-stock-page">

            {/* ── Top bar ── */}
            <div className="ds-topbar">
              <button className="btn-back" onClick={onBack}>
                <BiArrowBack /> Retour à la liste
              </button>
              <button className="btn-primary" onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm(tailleInit)) }}>
                <BiPlus /> Nouvelle saisie
              </button>
            </div>

            {/* ── Hero produit ── */}
            <div className="ds-hero">
              <div className="ds-hero-left">
                <div className="ds-hero-icon"><BiPackage /></div>
                <div>
                  <h1 className="ds-hero-nom">{produit.nom}</h1>
                  <div className="ds-hero-meta">
                    <span className="ds-cat">{produit.categorie}</span>
                    {tailleInit && <span className="ds-taille-badge">{tailleInit}</span>}
                    <span className={`statut-badge badge-${statut}`}>
                      {statut === 'rupture' ? '⛔ Rupture' : statut === 'risque' ? '⚠ Risque' : '✓ OK'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="ds-hero-stats">
                <div className="ds-hs">
                  <span className="ds-hs-label">Total entrées</span>
                  <span className="ds-hs-val ps-green">+{totalEntrees.toLocaleString()} {produit.unite_mesure}</span>
                </div>
                <div className="ds-hs">
                  <span className="ds-hs-label">Total sorties</span>
                  <span className="ds-hs-val ps-red">-{totalSorties.toLocaleString()} {produit.unite_mesure}</span>
                </div>
                <div className="ds-hs">
                  <span className="ds-hs-label">Stock actuel</span>
                  <span className={`ds-hs-val ds-hs-big statut-txt-${statut}`}>
                    {stockDernier.toLocaleString()} {produit.unite_mesure}
                  </span>
                </div>
                <div className="ds-hs">
                  <span className="ds-hs-label">Nb saisies</span>
                  <span className="ds-hs-val">{filtered.length}</span>
                </div>
              </div>
            </div>

            {/* ── Formulaire saisie ── */}
            {showForm && (
              <div className="ds-form-wrap">
                <div className="ds-form-header">
                  <h2 className="ds-form-title">
                    {editId ? '✏ Modifier la saisie' : '＋ Nouvelle saisie'}
                  </h2>
                  <button className="modal-close" onClick={handleCancel}><BiX /></button>
                </div>

                <div className="ds-form-body">
                  {/* Ligne 1 : date + auteur + unité */}
                  <div className="ds-form-row">
                    <div className="ds-field">
                      <label>Date <span className="req">*</span></label>
                      <input type="date" className={`modal-input ${errors.date?'input-error':''}`}
                        value={form.date} onChange={e => { set('date', e.target.value); setErrors(er=>({...er,date:''})) }} />
                      {errors.date && <span className="err-msg">{errors.date}</span>}
                    </div>
                    <div className="ds-field">
                      <label>Auteur <span className="req">*</span></label>
                      <input className={`modal-input ${errors.auteur?'input-error':''}`}
                        placeholder="Votre nom" value={form.auteur}
                        onChange={e => { set('auteur', e.target.value); setErrors(er=>({...er,auteur:''})) }} />
                      {errors.auteur && <span className="err-msg">{errors.auteur}</span>}
                    </div>
                    <div className="ds-field">
                      <label>Unité</label>
                      <select className="modal-input" value={form.unite} onChange={e => set('unite', e.target.value)}>
                        {UNITES.map(u => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                    {produit.hasTaille && (
                      <div className="ds-field">
                        <label>Taille fil</label>
                        <select className="modal-input" value={form.taille} onChange={e => set('taille', e.target.value)}>
                          {produit.tailles.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Ligne 2 : valeurs stock */}
                  <div className="ds-form-row">
                    <div className="ds-field">
                      <label>Stock initial ({produit.unite_mesure}) <span className="req">*</span></label>
                      <input type="number" min="0"
                        className={`modal-input ${errors.initial?'input-error':''}`}
                        placeholder="ex: 1000" value={form.initial}
                        onChange={e => { set('initial', e.target.value); setErrors(er=>({...er,initial:''})) }} />
                      {errors.initial && <span className="err-msg">{errors.initial}</span>}
                    </div>
                    <div className="ds-field">
                      <label>Entrées ({produit.unite_mesure}) <span className="req">*</span></label>
                      <input type="number" min="0"
                        className={`modal-input ${errors.entrees?'input-error':''}`}
                        placeholder="ex: 500" value={form.entrees}
                        onChange={e => { set('entrees', e.target.value); setErrors(er=>({...er,entrees:''})) }} />
                      {errors.entrees && <span className="err-msg">{errors.entrees}</span>}
                    </div>
                    <div className="ds-field">
                      <label>Sorties ({produit.unite_mesure}) <span className="req">*</span></label>
                      <input type="number" min="0"
                        className={`modal-input ${errors.sorties?'input-error':''}`}
                        placeholder="ex: 200" value={form.sorties}
                        onChange={e => { set('sorties', e.target.value); setErrors(er=>({...er,sorties:''})) }} />
                      {errors.sorties && <span className="err-msg">{errors.sorties}</span>}
                    </div>
                  </div>

                  {/* Preview calcul */}
                  {form.initial && form.entrees && form.sorties && (
                    <div className="ds-preview">
                      <span>Stock calculé :</span>
                      <strong className={getStatut(Number(form.initial)+Number(form.entrees)-Number(form.sorties)) === 'rupture' ? 'ps-red' : getStatut(Number(form.initial)+Number(form.entrees)-Number(form.sorties)) === 'risque' ? 'ps-orange' : 'ps-green'}>
                        {(Number(form.initial)+Number(form.entrees)-Number(form.sorties)).toLocaleString()} {produit.unite_mesure}
                      </strong>
                      <span className="ds-preview-sacs">
                        → {calcSacs(Number(form.initial)+Number(form.entrees)-Number(form.sorties))} sacs
                        | {calcJour(produit.consommation_mensuelle)} {produit.unite_mesure}/jour
                      </span>
                    </div>
                  )}

                  {/* Observation */}
                  <div className="ds-field">
                    <label>Observation</label>
                    <textarea className="modal-input ds-textarea"
                      placeholder="Remarque, fournisseur, contexte..."
                      value={form.observation}
                      onChange={e => set('observation', e.target.value)}
                      rows={2} />
                  </div>
                </div>

                <div className="ds-form-footer">
                  <button className="btn-cancel" onClick={handleCancel}>Annuler</button>
                  <button className="btn-confirm" onClick={handleSubmit}>
                    <BiSave /> {editId ? 'Mettre à jour' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            )}

            {/* ── Filtres historique ── */}
            <div className="ds-filters-bar">
              <span className="ds-filters-label">Historique</span>
              <select className="ds-filter-sel" value={filterU} onChange={e => setFilterU(e.target.value)}>
                <option value="Tous">Toutes unités</option>
                {UNITES.map(u => <option key={u}>{u}</option>)}
              </select>
              {produit.hasTaille && (
                <select className="ds-filter-sel" value={filterT} onChange={e => setFilterT(e.target.value)}>
                  <option value="Tous">Toutes tailles</option>
                  {tailles.map(t => <option key={t}>{t}</option>)}
                </select>
              )}
              <button className="sort-btn" onClick={() => setSortDesc(!sortDesc)}>
                <BiCalendar /> {sortDesc ? 'Plus récent' : 'Plus ancien'}
              </button>
              <span className="footer-info" style={{marginLeft:'auto'}}>
                {filtered.length} saisie(s)
              </span>
            </div>

            {/* ── Tableau historique ── */}
            <div className="ds-table-wrap">
              {filtered.length === 0
                ? <div className="no-data">Aucune saisie enregistrée</div>
                : (
                  <table className="rapport-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Unité</th>
                        {produit.hasTaille && <th>Taille</th>}
                        <th>Initial</th>
                        <th>Entrées</th>
                        <th>Sorties</th>
                        <th>Stock actuel</th>
                        <th>Sacs</th>
                        <th>Auteur</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(s => {
                        const act = calcStock(s)
                        const st  = getStatut(act)
                        const exp = expandId === s.id
                        return (
                          <React.Fragment key={s.id}>
                            <tr className={`ds-tr statut-row-${st}`}
                              onClick={() => setExpandId(exp ? null : s.id)}>
                              <td className="td-id">{s.date}</td>
                              <td>{s.unite}</td>
                              {produit.hasTaille && <td>
                                <span className="taille-chip">{s.taille}</span>
                              </td>}
                              <td className="td-num">{s.initial.toLocaleString()}</td>
                              <td className="td-num ps-green">+{s.entrees.toLocaleString()}</td>
                              <td className="td-num ps-red">-{s.sorties.toLocaleString()}</td>
                              <td>
                                <span className={`statut-badge badge-${st}`}>
                                  {act.toLocaleString()} {produit.unite_mesure}
                                </span>
                              </td>
                              <td className="td-num">{calcSacs(act)}</td>
                              <td>{s.auteur}</td>
                              <td onClick={e => e.stopPropagation()}>
                                <div className="action-btns">
                                  <button className="act-btn" onClick={() => handleEdit(s)} title="Modifier">
                                    <BiEdit />
                                  </button>
                                  <button className="act-btn act-danger" onClick={() => handleDelete(s.id)} title="Supprimer">
                                    <BiTrash />
                                  </button>
                                  <button className="act-btn" onClick={() => setExpandId(exp ? null : s.id)} title="Détail">
                                    {exp ? <BiChevronUp /> : <BiChevronDown />}
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {exp && (
                              <tr className="ds-expand-row">
                                <td colSpan={produit.hasTaille ? 10 : 9}>
                                  <div className="ds-expand-body">
                                    <div className="ds-expand-grid">
                                      <div className="pd-item">
                                        <span className="pd-label">Conso mensuelle</span>
                                        <span className="pd-value">{produit.consommation_mensuelle} {produit.unite_mesure}/mois</span>
                                      </div>
                                      <div className="pd-item">
                                        <span className="pd-label">Conso journalière</span>
                                        <span className="pd-value">{calcJour(produit.consommation_mensuelle)} {produit.unite_mesure}/jour</span>
                                      </div>
                                      <div className="pd-item">
                                        <span className="pd-label">À commander</span>
                                        <span className={`pd-value ${Math.max(0,produit.consommation_mensuelle*2-act)>0?'ps-red':'ps-green'}`}>
                                          {Math.max(0,produit.consommation_mensuelle*2-act) || '—'} {produit.unite_mesure}
                                        </span>
                                      </div>
                                      <div className="pd-item">
                                        <span className="pd-label">Observation</span>
                                        <span className="pd-value">{s.observation || '—'}</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        )
                      })}
                    </tbody>
                  </table>
                )
              }
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default StockDetail