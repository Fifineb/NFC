import logoapp from "../../assets/images/logoapp.png"
import { Link } from 'react-router-dom'  

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
      <div className="logo">
        <img src={logoapp} alt="SmartStock"/>
        <span>Smart Stock</span>
      </div>

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
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('services');
            }}
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
          <a href="#contact" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
