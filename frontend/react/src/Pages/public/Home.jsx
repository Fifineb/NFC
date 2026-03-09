import images from "../../assets/images/Accueil.jpeg"
import Navbar from "../../composantes/common/NavBar"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt, faBoxes, faChartBar, faBell } from '@fortawesome/free-solid-svg-icons'

function Home() {
  return (
    <>
      <Navbar/>
      
      {/* Hero Section */}
      <section className="home">
        <div className="home-text">
          <h1>Make Your Stock Smarter</h1>
          <p>
            Application de gestion des stocks de matières premières
            destinée aux entreprises, permettant un suivi sécurisé
            et efficace des entrées et sorties.
          </p>
        </div>
        <div className="home-image">
          <img src={images} alt="stock management"/>
        </div>
      </section>
      
      {/* Services Section */}
      <section id="services" className="services">  
        <h2 className="services-title">Nos Services</h2>
        
        <div className="services-grid">
          {/* Service 1 */}
          <div className="service-card">
            <div className="service-icon">
              <FontAwesomeIcon icon={faBolt} />
            </div>
            <h3>Synchronisation</h3>
            <p>En temps réel (si connexion disponible)</p>
          </div>

          {/* Service 2 */}
          <div className="service-card">
            <div className="service-icon">
              <FontAwesomeIcon icon={faBoxes} />
            </div>
            <h3>Gestion des stocks</h3>
            <p>Ajout, modification, suivi des quantités</p>
          </div>

          {/* Service 3 */}
          <div className="service-card">
            <div className="service-icon">
              <FontAwesomeIcon icon={faChartBar} />
            </div>
            <h3>Rapports et tableaux de bord</h3>
            <p>Détaillés</p>
          </div>

          {/* Service 4 */}
          <div className="service-card">
            <div className="service-icon">
              <FontAwesomeIcon icon={faBell} />
            </div>
            <h3>Alertes automatiques</h3>
            <p>Pour les stocks faibles</p>
          </div>
        </div>

        {/* Citation */}
        <div className="services-quote">
          <p>
            "Nous simplifions la gestion de vos stocks pour un suivi précis et sécurisé."
          </p>
        </div>
      </section>

      {/* Société Section */}
      <section id="societe" className="societe">
        <h2 className="societe-title">Notre Société</h2>
        <div className="historique">
          <div className="historique-text" >
            <p>
             BAG (Batna Aluminium Gaz) est une entreprise industrielle algérienne spécialisée dans la fabrication et la commercialisation de récipients à pression, notamment les bouteilles de gaz GPL utilisées dans les secteurs domestiques, industriels et automobiles.
             Créée en 1972, l’entreprise joue aujourd’hui un rôle essentiel dans le marché énergétique algérien, en assurant la production d’équipements fiables et conformes aux normes de qualité et de sécurité.
             BAG est certifiée ISO 9001 (Système de Management de la Qualité), ce qui garantit l’amélioration continue de ses processus de production et la satisfaction de ses clients.
             L’entreprise possède plusieurs unités de production en Algérie, notamment à Alger, Batna et Mascara, et emploie des centaines de collaborateurs spécialisés dans la fabrication industrielle.
            </p>
          </div>

          
        </div>
      </section>






      
    </>
  )
}

export default Home


