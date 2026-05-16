import React, { useState } from 'react'
import { BiX, BiPlus } from 'react-icons/bi'
import '../../assets/styles/rapport.css';

const TYPES = ['Consommation', 'Commandes', 'Entrées', 'Sorties', 'Stock']

const NouveauRapport = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    type:        'Consommation',
    fournisseur: '',
    debut:       '',
    fin:         '',
    ht:          '',
    tva:         20,
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    const e = {}
    if (!form.fournisseur.trim()) e.fournisseur = 'Requis'
    if (!form.debut)              e.debut       = 'Requis'
    if (!form.fin)                e.fin         = 'Requis'
    if (!form.ht || isNaN(form.ht) || Number(form.ht) <= 0) e.ht = 'Montant invalide'
    if (form.debut && form.fin && form.debut > form.fin)    e.fin = 'Fin < Début'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    const ht  = Number(form.ht)
    const net = ht - ht * (Number(form.tva) / 100)
    onAdd({ ...form, ht, net, tva: Number(form.tva) })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2 className="modal-title">Nouveau rapport</h2>
          <button className="modal-close" onClick={onClose}><BiX /></button>
        </div>

        <div className="modal-body">

          {/* Type */}
          <div className="modal-field">
            <label>Type de rapport</label>
            <div className="type-pills">
              {TYPES.map(t => (
                <button
                  key={t}
                  className={`type-pill ${form.type === t ? 'active' : ''}`}
                  onClick={() => set('type', t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Fournisseur */}
          <div className="modal-field">
            <label>Fournisseur <span className="req">*</span></label>
            <input
              className={`modal-input ${errors.fournisseur ? 'input-error' : ''}`}
              placeholder="ex: AlphaMat"
              value={form.fournisseur}
              onChange={e => { set('fournisseur', e.target.value); setErrors(er => ({...er, fournisseur: ''})) }}
            />
            {errors.fournisseur && <span className="err-msg">{errors.fournisseur}</span>}
          </div>

          {/* Période */}
          <div className="modal-row">
            <div className="modal-field">
              <label>Date début <span className="req">*</span></label>
              <input
                type="date"
                className={`modal-input ${errors.debut ? 'input-error' : ''}`}
                value={form.debut}
                onChange={e => { set('debut', e.target.value); setErrors(er => ({...er, debut: ''})) }}
              />
              {errors.debut && <span className="err-msg">{errors.debut}</span>}
            </div>
            <div className="modal-field">
              <label>Date fin <span className="req">*</span></label>
              <input
                type="date"
                className={`modal-input ${errors.fin ? 'input-error' : ''}`}
                value={form.fin}
                onChange={e => { set('fin', e.target.value); setErrors(er => ({...er, fin: ''})) }}
              />
              {errors.fin && <span className="err-msg">{errors.fin}</span>}
            </div>
          </div>

          {/* Montants */}
          <div className="modal-row">
            <div className="modal-field">
              <label>Montant HT (DA) <span className="req">*</span></label>
              <input
                type="number"
                className={`modal-input ${errors.ht ? 'input-error' : ''}`}
                placeholder="ex: 120000"
                value={form.ht}
                onChange={e => { set('ht', e.target.value); setErrors(er => ({...er, ht: ''})) }}
              />
              {errors.ht && <span className="err-msg">{errors.ht}</span>}
            </div>
            <div className="modal-field">
              <label>TVA (%)</label>
              <input
                type="number"
                className="modal-input"
                value={form.tva}
                min={0} max={100}
                onChange={e => set('tva', e.target.value)}
              />
            </div>
          </div>

          {/* Preview montant net */}
          {form.ht && !isNaN(form.ht) && (
            <div className="modal-preview">
              <span>Montant net estimé :</span>
              <strong>
                {(Number(form.ht) - Number(form.ht) * (Number(form.tva) / 100))
                  .toLocaleString('fr-DZ')} DA
              </strong>
            </div>
          )}

        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Annuler</button>
          <button className="btn-confirm" onClick={handleSubmit}>
            <BiPlus /> Créer le rapport
          </button>
        </div>

      </div>
    </div>
  )
}

export default NouveauRapport