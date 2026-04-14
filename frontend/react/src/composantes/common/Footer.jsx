import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom";

// Icons
import { faLocationDot, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'
import { 
  faFacebook, 
  faLinkedin, 
  faInstagram, 
  faTiktok, 
  faWhatsapp 
} from '@fortawesome/free-brands-svg-icons'

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Section  */}
        <div className="footer-section">
          <h2>Smart Stock</h2>
          <p>
            Solution intelligente pour gérer vos stocks de matières premières 
            facilement et efficacement.
          </p>
        </div>

        {/* Section Liens */}
        <div className="footer-section">
          <h3>Liens utiles</h3>
          <ul>
            <li><a href="#top">Accueil</a></li>
            <li><Link to="/features">Fonctionnalités</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Section Contact */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p><FontAwesomeIcon icon={faLocationDot} /> Entreprise Bouteilles à GAZ (BAG Spa) Siège, M3QQ+HCF, Djasr Kasentina</p>
          <p><FontAwesomeIcon icon={faEnvelope} /> Bagagaz159@gmail.com</p>
          <p><FontAwesomeIcon icon={faPhone} /> +213 65 50 43 45 31 </p>
        </div>

        {/* Section Réseaux sociaux */}
        <div className="footer-section">
          <h3>Suivez-nous</h3>
          <div className="socials">
            <FontAwesomeIcon icon={faFacebook} /> 
            <FontAwesomeIcon icon={faLinkedin} />
            <FontAwesomeIcon icon={faInstagram} />
            <FontAwesomeIcon icon={faTiktok} />
            <FontAwesomeIcon icon={faWhatsapp} />
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2026 Smart Stock. Tous droits réservés.</p>
      </div>

    </footer>
  )
}

export default Footer
