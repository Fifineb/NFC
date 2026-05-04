import React from 'react'
import { BiBell, BiSearch, BiCog } from 'react-icons/bi'
import logo from '../assets/Baggaznaftal.webp'
import { Link } from 'react-router-dom'
import '../styles/global.css'


const Header = () => {
  return (
    <div className="Header">
      <div className="Header--title">
        <img src={logo} alt="Logo" className="logo" />
        <h2>BAG Spa</h2>
      </div>
      <div className="Header--activity">

        <div className="search-box">
          <input type="text" placeholder="Search..." />
          <BiSearch className="icon" />
        </div>

        <div className="notify">
          <Link to="/notifications">
            <BiBell className="icon" />
          </Link>
        </div>
        <div className="settings">
          <Link to="/settings">
            <BiCog className="icon" />
          </Link>
        </div>

      </div>

    </div>
  )
}

export default Header