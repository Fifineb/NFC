import React, { useState, useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import Header  from '../components/Header'
import {
  BiError, BiInfoCircle, BiCheckCircle, BiTrash,
  BiFilter, BiSearch, BiRefresh, BiBell, BiTime
} from 'react-icons/bi'
import '../styles/notifications.css'

// ── Données simulées (à remplacer par API) ──────────────────────
const alertesInit = [
  {
    id: 1, type: 'rupture', produit: 'Laiton', unite: 'Mascara',
    taille: '1mm', stock: 0, seuil: 6000, unite_mesure: 'kg',
    date: '2026-05-16T08:30:00', lu: false,
    message: 'Stock épuisé — réapprovisionnement urgent requis.',
  },
  {
    id: 2, type: 'rupture', produit: 'Laiton', unite: 'Alger',
    taille: '1.2mm', stock: 0, seuil: 6000, unite_mesure: 'kg',
    date: '2026-05-16T07:15:00', lu: false,
    message: 'Stock épuisé — réapprovisionnement urgent requis.',
  },
  {
    id: 3, type: 'risque', produit: 'Fil de zinc', unite: 'Mascara',
    taille: '1mm', stock: 450, seuil: 6000, unite_mesure: 'kg',
    date: '2026-05-15T14:00:00', lu: false,
    message: 'Stock en dessous du seuil minimal défini.',
  },
  {
    id: 4, type: 'risque', produit: 'Fil de soudure', unite: 'Batna',
    taille: '1.2mm', stock: 3200, seuil: 6000, unite_mesure: 'kg',
    date: '2026-05-15T09:45:00', lu: true,
    message: 'Stock en dessous du seuil minimal défini.',
  },
  {
    id: 5, type: 'risque', produit: 'Huile', unite: 'Alger',
    taille: null, stock: 40, seuil: 500, unite_mesure: 'L',
    date: '2026-05-14T16:20:00', lu: true,
    message: 'Niveau d\'huile critique, vérifier les réserves.',
  },
  {
    id: 6, type: 'rupture', produit: 'Fil de zinc', unite: 'Batna',
    taille: '1mm', stock: 0, seuil: 6000, unite_mesure: 'kg',
    date: '2026-05-13T11:00:00', lu: true,
    message: 'Stock épuisé — réapprovisionnement urgent requis.',
  },
]

// ── Helpers ─────────────────────────────────────────────────────
const formatDate = (iso) => {
  const d = new Date(iso)
  const now = new Date()
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60)   return 'À l\'instant'
  if (diff < 3600) return `Il y a ${Math.floor(diff/60)} min`
  if (diff < 86400) return `Il y a ${Math.floor(diff/3600)}h`
  return d.toLocaleDateString('fr-DZ', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
}

const pct = (stock, seuil) =>
  Math.min(100, Math.max(0, (stock / seuil) * 100))

// ── Composant alerte ────────────────────────────────────────────
const AlerteCard = ({ alerte, onLire, onSupprimer }) => {
  const isRupture = alerte.type === 'rupture'
  const p = pct(alerte.stock, alerte.seuil)

  return (
    <div className={`notif-card ${isRupture ? 'notif-rupture' : 'notif-risque'} ${alerte.lu ? 'notif-lu' : ''}`}>

      {/* Bande latérale colorée */}
      <div className={`notif-strip ${isRupture ? 'strip-rupture' : 'strip-risque'}`} />

      {/* Icône */}
      <div className={`notif-icon-wrap ${isRupture ? 'icon-rupture' : 'icon-risque'}`}>
        {isRupture ? <BiError /> : <BiInfoCircle />}
      </div>

      {/* Contenu */}
      <div className="notif-body">
        <div className="notif-top">
          <div className="notif-title-row">
            <span className={`notif-type-badge ${isRupture ? 'nbadge-rupture' : 'nbadge-risque'}`}>
              {isRupture ? '⛔ Rupture' : '⚠ Risque'}
            </span>
            {!alerte.lu && <span className="notif-new">Nouveau</span>}
          </div>
          <div className="notif-meta">
            <BiTime className="meta-icon" />
            <span>{formatDate(alerte.date)}</span>
          </div>
        </div>

        <div className="notif-produit">
          <strong>{alerte.produit}</strong>
          {alerte.taille && <span className="notif-taille">{alerte.taille}</span>}
          <span className="notif-unite-loc">— {alerte.unite}</span>
        </div>

        <p className="notif-message">{alerte.message}</p>

        {/* Barre de stock */}
        <div className="notif-bar-wrap">
          <div className="notif-bar-labels">
            <span>Stock actuel : <strong>{alerte.stock.toLocaleString()} {alerte.unite_mesure}</strong></span>
            <span>Seuil : <strong>{alerte.seuil.toLocaleString()} {alerte.unite_mesure}</strong></span>
          </div>
          <div className="notif-bar">
            <div
              className={`notif-fill ${isRupture ? 'nfill-rupture' : 'nfill-risque'}`}
              style={{ width: `${p}%` }}
            />
            {!isRupture && (
              <div className="notif-seuil-mark" title="Seuil minimal" />
            )}
          </div>
          <div className="notif-bar-pct">
            {isRupture ? 'Épuisé' : `${p.toFixed(0)}% du seuil`}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="notif-actions">
        {!alerte.lu && (
          <button className="nact-btn nact-lire" onClick={() => onLire(alerte.id)} title="Marquer comme lu">
            <BiCheckCircle />
          </button>
        )}
        <button className="nact-btn nact-del" onClick={() => onSupprimer(alerte.id)} title="Supprimer">
          <BiTrash />
        </button>
      </div>

    </div>
  )
}

// ── Page principale ─────────────────────────────────────────────
const Notifications = () => {
  const [alertes,    setAlertes]    = useState(alertesInit)
  const [filtre,     setFiltre]     = useState('Tous')       // Tous | rupture | risque | non-lu
  const [search,     setSearch]     = useState('')
  const [uniteF,     setUniteF]     = useState('Tous')

  const UNITES = ['Tous', 'Alger', 'Mascara', 'Batna']

  const onLire       = (id) => setAlertes(a => a.map(x => x.id===id ? {...x, lu:true} : x))
  const onSupprimer  = (id) => setAlertes(a => a.filter(x => x.id!==id))
  const toutLire     = ()   => setAlertes(a => a.map(x => ({...x, lu:true})))
  const toutSupprLus = ()   => setAlertes(a => a.filter(x => !x.lu))

  const filtered = useMemo(() => {
    let list = [...alertes]
    if (filtre === 'rupture') list = list.filter(x => x.type === 'rupture')
    if (filtre === 'risque')  list = list.filter(x => x.type === 'risque')
    if (filtre === 'non-lu')  list = list.filter(x => !x.lu)
    if (uniteF !== 'Tous')    list = list.filter(x => x.unite === uniteF)
    if (search.trim())
      list = list.filter(x =>
        x.produit.toLowerCase().includes(search.toLowerCase()) ||
        x.message.toLowerCase().includes(search.toLowerCase())
      )
    // Plus récentes en premier
    list.sort((a,b) => new Date(b.date) - new Date(a.date))
    return list
  }, [alertes, filtre, search, uniteF])

  const nbNonLus  = alertes.filter(x => !x.lu).length
  const nbRupture = alertes.filter(x => x.type === 'rupture').length
  const nbRisque  = alertes.filter(x => x.type === 'risque').length

  return (
    <div className="app-wrapper">
      <Sidebar />
      <div className="Home">
        <Header />
        <div className="content-row">
          <div className="notif-page">

            {/* ── Titre + actions globales ── */}
            <div className="notif-header">
              <div className="notif-header-left">
                <div className="notif-title-icon"><BiBell /></div>
                <div>
                  <h1 className="notif-page-title">Notifications</h1>
                  <p className="notif-page-sub">
                    {nbNonLus > 0
                      ? `${nbNonLus} notification(s) non lue(s)`
                      : 'Tout est à jour'}
                  </p>
                </div>
              </div>
              <div className="notif-header-actions">
                {nbNonLus > 0 && (
                  <button className="nhead-btn" onClick={toutLire}>
                    <BiCheckCircle /> Tout marquer lu
                  </button>
                )}
                <button className="nhead-btn nhead-danger" onClick={toutSupprLus}>
                  <BiTrash /> Supprimer les lus
                </button>
              </div>
            </div>

            {/* ── Cards résumé ── */}
            <div className="notif-summary">
              <div className="ns-card ns-total">
                <span className="ns-val">{alertes.length}</span>
                <span className="ns-label">Total</span>
              </div>
              <div className="ns-card ns-rupture">
                <BiError />
                <span className="ns-val">{nbRupture}</span>
                <span className="ns-label">Ruptures</span>
              </div>
              <div className="ns-card ns-risque">
                <BiInfoCircle />
                <span className="ns-val">{nbRisque}</span>
                <span className="ns-label">Risques</span>
              </div>
              <div className="ns-card ns-nonlu">
                <BiBell />
                <span className="ns-val">{nbNonLus}</span>
                <span className="ns-label">Non lus</span>
              </div>
            </div>

            {/* ── Toolbar filtres ── */}
            <div className="notif-toolbar">

              {/* Search */}
              <div className="search-box">
                <BiSearch className="icon" />
                <input
                  placeholder="Rechercher un produit..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="toolbar-sep" />

              {/* Type */}
              <div className="nfiltre-tabs">
                {[
                  { key: 'Tous',   label: '🔘 Tous'     },
                  { key: 'rupture',label: '⛔ Ruptures'  },
                  { key: 'risque', label: '⚠ Risques'   },
                  { key: 'non-lu', label: '🔔 Non lus'  },
                ].map(f => (
                  <button
                    key={f.key}
                    className={`nfiltre-tab ${filtre === f.key ? 'active' : ''}`}
                    onClick={() => setFiltre(f.key)}
                  >
                    {f.label}
                    {f.key === 'non-lu' && nbNonLus > 0 &&
                      <span className="nfiltre-count">{nbNonLus}</span>}
                  </button>
                ))}
              </div>

              <div className="toolbar-sep" />

              {/* Unité */}
              <div className="unite-tabs">
                {UNITES.map(u => (
                  <button key={u}
                    className={`unite-tab ${uniteF === u ? 'active' : ''}`}
                    onClick={() => setUniteF(u)}>
                    {u}
                  </button>
                ))}
              </div>

            </div>

            {/* ── Liste notifications ── */}
            <div className="notif-list">
              {filtered.length === 0 ? (
                <div className="notif-empty">
                  <BiRefresh className="empty-icon" />
                  <span>Aucune notification correspondante</span>
                </div>
              ) : (
                filtered.map(a => (
                  <AlerteCard
                    key={a.id}
                    alerte={a}
                    onLire={onLire}
                    onSupprimer={onSupprimer}
                  />
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications