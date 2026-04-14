import Accueil from "../../assets/images/Accueil.jpeg";
import entrer from "../../assets/images/entrer.jpg";
import Navbar from "../../composantes/common/NavBar";
import Footer from "../../composantes/common/Footer"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt, faBoxes, faChartBar, faBell } from '@fortawesome/free-solid-svg-icons'

function Home() {
  return (
    <>
      <Navbar/>
      
      {/* Hero Section */}
      <section id="top" className="home">
        <div className="home-text">
          <h1>Make Your Stock Smarter</h1>
          <p>
            Application de gestion des stocks de matières premières
            destinée aux entreprises, permettant un suivi sécurisé
            et efficace des entrées et sorties.
          </p>
        </div>
        <div className="home-image">
          <img src={Accueil} alt="stock management"/>
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
{/* Société Section - Version améliorée */}
<section id="societe" className="societe">
  <h2 className="societe-title">Notre Société</h2>
  
  {/* Description avec image */}
  <div className="societe-description">
    <div className="societe-description-image">
      <img src={entrer} alt="Entreprise BAG" />
    </div>
    <div className="societe-description-text">
      <h3>BAG - Batna Aluminium Gaz</h3>
      <p>
        BAG est une entreprise industrielle algérienne spécialisée dans la fabrication 
        et la commercialisation de récipients à pression, notamment les bouteilles de 
        gaz GPL utilisées dans les secteurs domestiques, industriels et automobiles.
      </p>
      <p>
        Créée en 1972, l'entreprise joue aujourd'hui un rôle essentiel dans le marché 
        énergétique algérien, en assurant la production d'équipements fiables et 
        conformes aux normes de qualité et de sécurité.
      </p>
      <p>
        BAG est certifiée <strong>ISO 9001</strong> (Système de Management de la Qualité), 
        ce qui garantit l'amélioration continue de ses processus de production et la 
        satisfaction de ses clients.
      </p>
      <p>
        L'entreprise possède plusieurs unités de production en Algérie, notamment à 
        <strong> Alger, Batna et Mascara</strong>, et emploie des centaines de 
        collaborateurs spécialisés dans la fabrication industrielle.
      </p>
    </div>
  </div>

  {/* Mission */}
  <div className="societe-mission">
    <h3>Notre Mission</h3>
    <div className="mission-grid">
      <div className="mission-card">
        <div className="mission-icon">🎯</div>
        <p>Produire des équipements fiables et sécurisés</p>
      </div>
      <div className="mission-card">
        <div className="mission-icon">⚡</div>
        <p>Répondre aux besoins énergétiques</p>
      </div>
      <div className="mission-card">
        <div className="mission-icon">✅</div>
        <p>Garantir qualité et normes internationales</p>
      </div>
      <div className="mission-card">
        <div className="mission-icon">🔒</div>
        <p>Assurer sécurité et durabilité</p>
      </div>
    </div>
  </div>

  {/* Vision */}
  <div className="societe-vision">
    <h3>Notre Vision</h3>
    <div className="vision-grid">
      <div className="vision-card">
        <div className="vision-icon">🏆</div>
        <p>Renforcer sa position de leader national</p>
      </div>
      <div className="vision-card">
        <div className="vision-icon">💡</div>
        <p>Développer des solutions industrielles innovantes</p>
      </div>
      <div className="vision-card">
        <div className="vision-icon">🌍</div>
        <p>Contribuer au développement du secteur énergétique</p>
      </div>
      <div className="vision-card">
        <div className="vision-icon">📈</div>
        <p>Maintenir qualité, sécurité et performance</p>
      </div>
    </div>
  </div>

  {/* Historique */}
  <div className="societe-historique">
    <h3>Historique</h3>
    <div className="timeline">
      <div className="timeline-item">
        <div className="timeline-year">1972</div>
        <div className="timeline-content">
          Création de l'entreprise BAG avec une capacité de production de 250 000 bouteilles par an.
        </div>
      </div>
      <div className="timeline-item">
        <div className="timeline-year">1995</div>
        <div className="timeline-content">
          BAG devient une filiale à 100% de NAFTAL.
        </div>
      </div>
      <div className="timeline-item">
        <div className="timeline-year">2003</div>
        <div className="timeline-content">
          Obtention de la certification ISO 9001, garantissant un système de management de la qualité performant.
        </div>
      </div>
      <div className="timeline-item">
        <div className="timeline-year">Aujourd'hui</div>
        <div className="timeline-content">
          BAG produit plus de 750 000 bouteilles et 800 000 robinets par an, avec plus de 37 millions de bouteilles fabriquées depuis sa création.
        </div>
      </div>
    </div>
  </div>

  {/* Partenaires */}
  <div className="societe-partenaires">
    <h3>Nos Partenaires</h3>
    <div className="partenaires-grid">
      <div className="partenaire-card">NAFTAL</div>
      <div className="partenaire-card">SONATRACH</div>
      <div className="partenaire-card">Entreprises industrielles nationales</div>
    </div>
  </div>

  {/* CGU & CGV */}
  <div className="societe-legal">
    <div className="legal-card">
      <h4>Conditions Générales d'Utilisation (CGU)</h4>
      <p>Les présentes Conditions Générales d'Utilisation définissent les règles d'utilisation du site web de l'entreprise BAG.</p>
      <p>En accédant au site, l'utilisateur accepte les conditions suivantes :</p>
      <ul>
        <li>Le site a pour objectif de fournir des informations sur les activités et les produits de l'entreprise.</li>
        <li>L'utilisateur s'engage à utiliser le site de manière légale et responsable.</li>
        <li>Les contenus présents sur le site (textes, images, logos) sont protégés par les droits de propriété intellectuelle.</li>
        <li>Toute reproduction ou utilisation non autorisée des contenus est interdite.</li>
        <li>L'entreprise ne peut être tenue responsable des erreurs techniques ou interruptions du site.</li>
      </ul>
    </div>

    <div className="legal-card">
      <h4>Conditions Générales de Vente (CGV)</h4>
      <p>Les présentes Conditions Générales de Vente régissent les relations commerciales entre l'entreprise BAG et ses clients.</p>
      <h5>Principes principaux :</h5>
      <ul>
        <li>Les produits commercialisés respectent les normes de sécurité et de qualité en vigueur.</li>
        <li>Les commandes sont confirmées après validation des conditions commerciales et des disponibilités.</li>
        <li>Les délais de livraison peuvent varier selon la quantité et la localisation du client.</li>
        <li>Les produits sont garantis contre les défauts de fabrication selon les normes applicables.</li>
        <li>Toute réclamation doit être effectuée dans un délai raisonnable après réception du produit.</li>
      </ul>
    </div>
  </div>
</section>

      {/* Prix Section */}
      <section id="prix" className="prix">  
        <h2 className="services-title">Nos Abonnements</h2>
        
        <div className="services-grid">
          {/* Service 1 */}
          <div className="service-card">
            <div className="service-icon">
              <FontAwesomeIcon icon={faBolt} />
            </div>
            <h3>Abonnement Gratuit</h3>
            <p>Accès limité aux fonctionnalités de base</p>
            00 DZD / mois
          </div>

          {/* Service 2 */}
          <div className="service-card">
            <div className="service-icon">
              <FontAwesomeIcon icon={faBoxes} />
            </div>
            <h3>Abonnement Pro</h3>
            <p>Accès complet avec des rapports détaillés et des alertes avancées</p>
            750 DZD/mois
          </div>

          {/* Service 3 */}
          <div className="service-card">
            <div className="service-icon">
              <FontAwesomeIcon icon={faChartBar} />
            </div>
            <h3>Abonnement Enterprise</h3>
            <p>Plan personnalisé pour les besoins spécifiques</p>
            2000 DZD/mois
          </div> 
        </div>
      </section>
      
      





      <Footer />
    </>
  )
}

export default Home
