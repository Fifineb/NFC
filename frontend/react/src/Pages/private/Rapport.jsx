import React, { useState } from 'react'
import Sidebar from '../../composantes/common/Sidebar'
import Header from '../../composantes/common/Header'
import RapportDetail from '../private/RapportDetail'
import NouveauRapport from '../private/NouveauRapport'
import { BiDownload, BiFilter, BiPlus, BiSearch, BiFile, BiTrash, BiShow } from 'react-icons/bi'
import '../../assets/styles/rapport.css';

const typeColors = {
  'Consommation': { bg: '#e8f0fe', color: '#1a3a6b' },
  'Commandes':    { bg: '#e6f4ea', color: '#1b5e20' },
  'Entrées':      { bg: '#fce8e6', color: '#6b1a1a' },
  'Sorties':      { bg: '#fef7e0', color: '#5f4200' },
  'Stock':        { bg: '#f0f0f0', color: '#2c2c2c' },
}

const fmt = (n) => Number(n).toLocaleString('fr-DZ') + ' DA'

const Rapport = () => {
  const [rapports, setRapports] = useState([
    { id: 1, type: 'Consommation', debut: '2024-01-01', fin: '2024-03-31', ht: 120000, net: 115200, tva: 20, fournisseur: 'AlphaMat' },
    { id: 2, type: 'Commandes',    debut: '2024-02-01', fin: '2024-04-30', ht: 85000,  net: 82620,  tva: 20, fournisseur: 'BetaStock' },
    { id: 3, type: 'Entrées',      debut: '2024-03-01', fin: '2024-03-31', ht: 43000,  net: 41280,  tva: 20, fournisseur: 'GammaFour' },
  ])

  const [search,      setSearch]      = useState('')
  const [typeFilter,  setTypeFilter]  = useState('Tous')
  const [fournFilter, setFournFilter] = useState('Tous')
  const [dateDebut,   setDateDebut]   = useState('')
  const [dateFin,     setDateFin]     = useState('')
  const [detailId,    setDetailId]    = useState(null)   // null = liste, number = detail
  const [showModal,   setShowModal]   = useState(false)

  const types       = ['Tous', ...new Set(rapports.map(r => r.type))]
  const fournisseurs = ['Tous', ...new Set(rapports.map(r => r.fournisseur))]

  const filtered = rapports.filter(r => {
    const matchType   = typeFilter  === 'Tous' || r.type        === typeFilter
    const matchFourn  = fournFilter === 'Tous' || r.fournisseur === fournFilter
    const matchSearch = r.type.toLowerCase().includes(search.toLowerCase()) ||
                        r.fournisseur.toLowerCase().includes(search.toLowerCase())
    const matchDebut  = !dateDebut || r.debut >= dateDebut
    const matchFin    = !dateFin   || r.fin   <= dateFin
    return matchType && matchFourn && matchSearch && matchDebut && matchFin
  })

  const totalHT  = filtered.reduce((s, r) => s + Number(r.ht),  0)
  const totalNet = filtered.reduce((s, r) => s + Number(r.net), 0)
  const avgTVA   = filtered.length
    ? filtered.reduce((s, r) => s + Number(r.tva), 0) / filtered.length
    : 0

  const handleAdd = (newRapport) => {
    const id = Date.now()
    setRapports(prev => [...prev, { ...newRapport, id }])
    setShowModal(false)
    setDetailId(id)   // ouvre directement la page du nouveau rapport
  }

  const handleDelete = (id) => {
    setRapports(prev => prev.filter(r => r.id !== id))
    if (detailId === id) setDetailId(null)
  }

  // ── Vue détail ──
  if (detailId !== null) {
    const rapport = rapports.find(r => r.id === detailId)
    if (!rapport) { setDetailId(null); return null }
    return (
      <div className="app-wrapper">
        <Sidebar />
        <div className="Home">
          <Header />
          <div className="content-row">
            <RapportDetail
              rapport={rapport}
              typeColors={typeColors}
              fmt={fmt}
              onBack={() => setDetailId(null)}
              onDelete={() => handleDelete(rapport.id)}
            />
          </div>
        </div>
      </div>
    )
  }

  // ── Vue liste ──
  return (
    <div className="app-wrapper">
      <Sidebar />
      <div className="Home">
        <Header />
        <div className="content-row">
          <div className="rapport-page">

            {/* Toolbar */}
            <div className="rapport-toolbar">
              <div className="search-box">
                <BiSearch className="icon" />
                <input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="rapport-filters">
                <BiFilter className="icon" style={{ color: '#123456' }} />
                <select value={typeFilter}  onChange={e => setTypeFilter(e.target.value)}>
                  {types.map(t => <option key={t}>{t}</option>)}
                </select>
                <select value={fournFilter} onChange={e => setFournFilter(e.target.value)}>
                  {fournisseurs.map(f => <option key={f}>{f}</option>)}
                </select>
                <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} />
                <span className="date-sep">→</span>
                <input type="date" value={dateFin}   onChange={e => setDateFin(e.target.value)} />
              </div>
              <button className="btn-primary" onClick={() => setShowModal(true)}>
                <BiPlus /> Nouveau rapport
              </button>
            </div>

            {/* Cards */}
            <div className="rapport-cards">
              <div className="rcard">
                <span className="rcard-label">Total HT</span>
                <span className="rcard-value">{fmt(totalHT)}</span>
                <span className="rcard-sub">{filtered.length} rapport(s)</span>
              </div>
              <div className="rcard">
                <span className="rcard-label">Total Net</span>
                <span className="rcard-value">{fmt(totalNet)}</span>
                <span className="rcard-sub">après déductions</span>
              </div>
              <div className="rcard">
                <span className="rcard-label">TVA moyenne</span>
                <span className="rcard-value">{avgTVA.toFixed(0)} %</span>
                <span className="rcard-sub">taux appliqué</span>
              </div>
              <div className="rcard">
                <span className="rcard-label">Économies</span>
                <span className="rcard-value">{fmt(totalHT - totalNet)}</span>
                <span className="rcard-sub">déductions totales</span>
              </div>
            </div>

            {/* Tableau */}
            <div className="rapport-table-wrap">
              <table className="rapport-table">
                <thead>
                  <tr>
                    <th>#</th><th>Type</th><th>Fournisseur</th>
                    <th>Période</th><th>Montant HT</th><th>Montant Net</th>
                    <th>TVA</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="no-data">Aucun rapport trouvé</td></tr>
                  )}
                  {filtered.map(r => (
                    <tr key={r.id}>
                      <td className="td-id">R-{String(r.id).toString().slice(-3).padStart(3,'0')}</td>
                      <td>
                        <span className="type-badge"
                          style={{ background: typeColors[r.type]?.bg, color: typeColors[r.type]?.color }}>
                          {r.type}
                        </span>
                      </td>
                      <td>{r.fournisseur}</td>
                      <td className="td-period">{r.debut} → {r.fin}</td>
                      <td className="td-num">{fmt(r.ht)}</td>
                      <td className="td-num td-net">{fmt(r.net)}</td>
                      <td className="td-tva">{r.tva} %</td>
                      <td>
                        <div className="action-btns">
                          <button className="act-btn" title="Voir" onClick={() => setDetailId(r.id)}>
                            <BiShow />
                          </button>
                          <button className="act-btn" title="PDF"><BiFile /></button>
                          <button className="act-btn act-danger" title="Supprimer"
                            onClick={() => handleDelete(r.id)}>
                            <BiTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rapport-footer">
              <span className="footer-info">{filtered.length} rapport(s) affiché(s)</span>
              <button className="btn-export"><BiDownload /> Exporter tout en PDF</button>
            </div>

          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <NouveauRapport
          onClose={() => setShowModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  )
}

export default Rapport;
