import React, { useState } from 'react'
import { BiUser, BiMapPin, BiUserCheck, BiEnvelope,
  BiPhone, BiEdit, BiLock, BiPackage,
  BiTransfer, BiBarChartAlt2, BiCalendar, BiCheckCircle
} from 'react-icons/bi'
import '../../assets/styles/dashboard.css'


const typeColors = {
  'Actif':     { bg: '#e6f4ea', color: '#1b5e20' },
  'Inactif':   { bg: '#e8f0fe', color: '#1a3a6b' },
  'Suspendu':  { bg: '#fce8e6', color: '#6b1a1a' },
}

const stats = [
  { icon: <BiPackage />,        label: 'Matières gérées',  value: '142' },
  { icon: <BiTransfer />,       label: 'Mouvements',       value: '38'  },
  { icon: <BiBarChartAlt2 />,   label: 'Rapports générés', value: '12'  },
  { icon: <BiCalendar />,       label: 'Jours actif',      value: '487' },
]

const UserProfile = () => {
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName:  user.lastName,
    email:     user.email,
    phone:     user.phone,
  })

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <div className="dashboard">

      {/* ── Bannière hero ── */}
      <div className="banner">

        <div className="banner-content">
          <div className="banner-avatar">
             {user.firstName?.charAt(0).toUpperCase()}
             {user.lastName?.charAt(0).toUpperCase()}
           </div>

          <div className="banner-info">
            <h1 className="banner-name">
              {user.firstName} {user.lastName}
            </h1>
            <p className="banner-tagline">Make Your Stock Smarter.</p>
            <div className="banner-badges">
              <span className="badge">
                <BiUserCheck /> {user.role}
              </span>
              <span className="badge">
                <BiMapPin /> {user.unite}
              </span>
              <span className="badge badge-green">
                <BiCheckCircle /> {user.statut}
              </span>
            </div>
          </div>

          <div className="banner-since">
            <span className="since-label">Membre depuis</span>
            <span className="since-value">{user.since}</span>
          </div>
        </div>
      </div>

      {/* ── Stats rapides ── */}
      <div className="stats-row">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-body">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Infos personnelles ── */}
      <div className="per--info">
        <div className="section-header">
          <h2 className="section-title">
            <BiUser /> Informations personnelles
          </h2>
          <button
            className="btn-edit"
            onClick={() => setEditMode(!editMode)}
          >
            <BiEdit /> {editMode ? 'Annuler' : 'Modifier'}
          </button>
        </div>

        <div className="info-grid">
          {[
            { label: 'Prénom',    name: 'firstName', icon: <BiUser />,     type: 'text'  },
            { label: 'Nom',       name: 'lastName',  icon: <BiUser />,     type: 'text'  },
            { label: 'Email',     name: 'email',     icon: <BiEnvelope />, type: 'email' },
            { label: 'Téléphone', name: 'phone',     icon: <BiPhone />,    type: 'tel'   },
          ].map(({ label, name, icon, type }) => (
            <div className="info-field" key={name}>
              <span className="field-label">
                {icon} {label}
              </span>
              {editMode ? (
                <input
                  className="field-input"
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                />
              ) : (
                <span className="field-value">{form[name]}</span>
              )}
            </div>
          ))}
        </div>

        {editMode && (
          <div className="edit-actions">
            <button className="btn-save" onClick={() => setEditMode(false)}>
              <BiCheckCircle /> Enregistrer
            </button>
          </div>
        )}
      </div>

      {/* ── Sécurité ── */}
      <div className="per--info">
        <div className="section-header">
          <h2 className="section-title">
            <BiLock /> Sécurité
          </h2>
        </div>
        <div className="security-row">
          <div className="security-item">
            <span className="sec-label">Mot de passe</span>
            <span className="sec-value">••••••••••</span>
          </div>
          <button className="btn-change-pwd">
            <BiLock /> Changer le mot de passe
          </button>
        </div>
      </div>

    </div>
  )
}

export default UserProfile;