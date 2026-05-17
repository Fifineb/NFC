import React from 'react'
import Sidebar from '../../composantes/common/Sidebar'
import Header from '../../composantes/common/Header'
import '../../assets/styles/main.css'
import Stock from './Stock'

const Listestock = () => {
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

export default Listestock