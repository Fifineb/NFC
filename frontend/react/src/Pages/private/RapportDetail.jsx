import React from 'react'
import { BiArrowBack, BiTrash, BiDownload, BiCalendar,
         BiBuilding, BiMoney, BiFile } from 'react-icons/bi'
import '../../assets/styles/rapport.css';


const RapportDetail = ({ rapport, typeColors, fmt, onBack, onDelete }) => {
  const r      = rapport
  const colors = typeColors[r.type] || { bg: '#f0f0f0', color: '#333' }
  const duree  = r.debut && r.fin
    ? Math.ceil((new Date(r.fin) - new Date(r.debut)) / (1000 * 60 * 60 * 24))
    : '—'

  return (
    <div className="detail-page">

      {/* ── Top bar ── */}
      <div className="detail-topbar">
        <button className="btn-back" onClick={onBack}>
          <BiArrowBack /> Retour aux rapports
        </button>
        <div className="detail-actions">
          <button className="btn-export-detail"><BiDownload /> Exporter PDF</button>
          <button className="btn-delete-detail" onClick={onDelete}>
            <BiTrash /> Supprimer
          </button>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="detail-hero">
        <div className="detail-hero-left">
          <span className="detail-type-badge"
            style={{ background: colors.bg, color: colors.color }}>
            <BiFile /> {r.type}
          </span>
          <h1 className="detail-title">
            Rapport {r.type}
          </h1>
          <p className="detail-ref">
            Réf : R-{String(r.id).slice(-3).padStart(3, '0')}
          </p>
        </div>
        <div className="detail-hero-right">
          <div className="hero-stat">
            <span className="hs-label">Montant Net</span>
            <span className="hs-value">{fmt(r.net)}</span>
          </div>
        </div>
      </div>

      {/* ── Info cards ── */}
      <div className="detail-cards">

        <div className="dcard">
          <div className="dcard-icon"><BiBuilding /></div>
          <div className="dcard-body">
            <span className="dcard-label">Fournisseur</span>
            <span className="dcard-value">{r.fournisseur}</span>
          </div>
        </div>

        <div className="dcard">
          <div className="dcard-icon"><BiCalendar /></div>
          <div className="dcard-body">
            <span className="dcard-label">Période</span>
            <span className="dcard-value">{r.debut} → {r.fin}</span>
            <span className="dcard-sub">{duree} jours</span>
          </div>
        </div>

        <div className="dcard">
          <div className="dcard-icon"><BiMoney /></div>
          <div className="dcard-body">
            <span className="dcard-label">TVA</span>
            <span className="dcard-value">{r.tva} %</span>
          </div>
        </div>

      </div>

      {/* ── Tableau financier ── */}
      <div className="detail-finance">
        <h2 className="detail-section-title">Détail financier</h2>
        <div className="finance-table">
          <div className="finance-row">
            <span className="finance-label">Montant HT</span>
            <span className="finance-value">{fmt(r.ht)}</span>
          </div>
          <div className="finance-row">
            <span className="finance-label">TVA ({r.tva}%)</span>
            <span className="finance-value finance-tva">
              + {fmt(r.ht * r.tva / 100)}
            </span>
          </div>
          <div className="finance-row finance-row-total">
            <span className="finance-label">Montant TTC</span>
            <span className="finance-value">{fmt(r.ht + r.ht * r.tva / 100)}</span>
          </div>
          <div className="finance-row">
            <span className="finance-label">Déductions</span>
            <span className="finance-value finance-deduct">
              - {fmt(r.ht - r.net)}
            </span>
          </div>
          <div className="finance-row finance-row-net">
            <span className="finance-label">Montant Net final</span>
            <span className="finance-value finance-net">{fmt(r.net)}</span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default RapportDetail