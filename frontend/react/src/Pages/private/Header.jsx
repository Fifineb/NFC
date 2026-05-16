import React from 'react'
import { BiBell, BiCog, BiLogOut } from 'react-icons/bi'
import logo from '../../assets/images/Baggaznaftal.webp'
import { Link } from 'react-router-dom'
import '../../assets/styles/main.css'



const Header = () => {
  return (
    <div className="Header">
      <div className="Header--title">
        <img src={logo} alt="Logo" className="logo" />
        <h2>BAG Spa</h2>
      </div>
      <div className="Header--activity">

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
        <div className="logout">
          <Link to="/logout">
            <BiLogOut className="icon" />
          </Link>
        </div>


      </div>

    </div>
  )
}

export default Header