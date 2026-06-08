import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { BiHome, BiMessage, BiSolidReport, BiStats, BiTask, BiBookAlt, BiMenu, BiUserPlus, BiStore, BiPackage, BiMap } from 'react-icons/bi'
import '../../assets/styles/menu.css'

const Sidebar = () => {
  const [open, setOpen] = useState(true)

  return (
    <div className={`menu ${open ? "active" : "close"}`}>
      
      <div className='menu--header'>
        <BiMenu className='icon' onClick={() => setOpen(!open)} />
        {open && <h2>Smart Stock</h2>}
      </div>

      <div className="menu--list">
        <Link to="/home" className="item">
          <BiHome className='icon'/> 
          {open && "Home"}
        </Link>

        <Link to="/listeStock" className="item">
          <BiBookAlt className='icon'/> 
          {open && "Stock"}
        </Link>

        <Link to="/adduser" className="item">
          <BiUserPlus className='icon'/> 
          {open && "Add User"}
        </Link>

        <Link to="/fournisseur" className="item">
          <BiStore className='icon'/> 
          {open && "Fournisseur"}
        </Link>

        <Link to="/rapport" className="item">
          <BiSolidReport className='icon'/> 
          {open && "Rapport"}
        </Link>

        <Link to="/stats" className="item">
          <BiStats className='icon'/> 
          {open && "Statistics"}
        </Link>

        <Link to="/produits" className="item">
          <BiPackage className='icon'/> 
          {open && "Produits"}
        </Link>

        <Link to="/regions" className="item">
          <BiMap className='icon'/> 
          {open && "Régions"}
        </Link>

        <Link to="/message" className="item">
          <BiMessage className='icon'/> 
          {open && "Messages"}
        </Link>

        <Link to="/mouvements" className="item">
          <BiTask className='icon'/> 
          {open && "Mouvements"}
        </Link>

        <Link to="/bon-entree" className="item">
          <BiTask className='icon'/> 
          {open && "Bon Entrée"}
        </Link>

        <Link to="/notifications" className="item">
          <BiSolidReport className='icon'/> 
          {open && "Notification"}
        </Link>
      </div>
    </div>
  )
}

export default Sidebar