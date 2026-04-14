// composantes/common/NavBar.jsx
import logoapp from "../../assets/images/logoapp.png"
import { Link } from 'react-router-dom'  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faChartLine } from '@fortawesome/free-solid-svg-icons'

function Navbar() {
  // Fonction pour le défilement 
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <Link to="#top" className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="logo-icon">
          <img src={logoapp} alt="SmartStock"/>
        </div>
        <div className="logo-text">
          <span className="logo-title">
            <FontAwesomeIcon icon={faBox} style={{ marginRight: '5px', fontSize: '1rem' }} />
            Smart Stock
          </span>
          
          <span className="logo-subtitle">Bag à gaz</span>
        </div>
      </Link>

      <ul className="nav-links">
        <li>
          <Link 
            to="/" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="nav-link"
          >
            Accueil
          </Link>
        </li>
        
        <li>
          <a 
            href="#services" 
            onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
            className="nav-link"
          >
            Service
          </a>
        </li>
        
        <li>
          <a href="#societe" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('societe'); }}>Société</a>
        </li>
        
        <li>
          <a href="#prix" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('prix'); }}>Prix</a>
        </li>
        <li>
          <Link to="/contact" className="nav-link nav-link-contact">Contact</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
