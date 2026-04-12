import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Contact() {
    const navigate = useNavigate();
  return (
    <section id="contact" className="contact">
      <div className="contact-container">

        <h2>Prêt à transformer votre gestion de stock ?</h2>

        <p className="contact-subtitle">
          Rejoignez des milliers d’entreprises qui font confiance à Smart Stock 
          pour optimiser leurs opérations
        </p>

    <div className="contact-buttons">
      <button 
        className="btn primary"
        onClick={() => navigate("/register")}
      >
        Démarrer gratuitement
      </button>

      <button 
        className="btn secondary"
        onClick={() => navigate("/nouscontacter")}
      >
        Nous contacter
      </button>
    </div>

        <div className="contact-stats">
          <div>
            <h3>10K+</h3>
            <p>Utilisateurs actifs</p>
          </div>
          <div>
            <h3>99.9%</h3>
            <p>Disponibilité</p>
          </div>
          <div>
            <h3>24/7</h3>
            <p>Support</p>
          </div>
        </div>

      </div>
    </section>

  )
}

export default Contact
