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

      {/* Société Section */}
      <section id="societe" className="societe">
        <h2 className="societe-title">Notre Société</h2>
        <div className="historique">
         <div className="description"> 
          <div className="description-image">
           <img src={entrer} alt="entreprise"/>
          </div>

          <div className="historique-text" >
            <h4>Description de l'entreprise : </h4> 
            <p>
             BAG (Batna Aluminium Gaz) est une entreprise industrielle algérienne spécialisée dans la fabrication et la commercialisation de récipients à pression, notamment les bouteilles de gaz GPL utilisées dans les secteurs domestiques, industriels et automobiles.
             Créée en 1972, l’entreprise joue aujourd’hui un rôle essentiel dans le marché énergétique algérien, en assurant la production d’équipements fiables et conformes aux normes de qualité et de sécurité.
             BAG est certifiée ISO 9001 (Système de Management de la Qualité), ce qui garantit l’amélioration continue de ses processus de production et la satisfaction de ses clients.
             L’entreprise possède plusieurs unités de production en Algérie, notamment à Alger, Batna et Mascara, et emploie des centaines de collaborateurs spécialisés dans la fabrication industrielle.
            </p>
          </div>
        </div>

      <div className="missions">
          <h3>Notre Mission</h3>

        <div className="missions-grid">
            <div className="mission-card">
              Produire des équipements fiables et sécurisés
            </div>

          <div className="mission-card">
             Répondre aux besoins énergétiques
          </div>

          <div className="mission-card">
            Garantir qualité et normes internationales
          </div>

          <div className="mission-card">
            Assurer sécurité et durabilité
          </div>
        </div>
      </div>

            <div className="missions">
          <h3>Notre Vision</h3>

        <div className="missions-grid">
          <div className="mission-card">
            Renforcer sa position de leader national dans la fabrication de bouteilles de gaz            
          </div>

          <div className="mission-card">
            Développer des solutions industrielles innovantes
          </div>

          <div className="mission-card">
            Contribuer au développement du secteur énergétique en Algérie
          </div>

          <div className="mission-card">
            Maintenir un haut niveau de qualité, sécurité et performance industrielle
          </div>
        </div>
      </div>
 
          <div className="historique-histoire">
           <h3>Historique </h3> 
           <ul>
            <li>1972 : Création de l’entreprise BAG avec une capacité de production de 250 000 bouteilles par an.</li>

            <li>1995 : BAG devient une filiale à 100 % de NAFTAL.</li>

            <li>2003 : Obtention de la certification ISO 9001, garantissant un système de management de la qualité performant.</li>

            <li>Années suivantes : Développement et modernisation des unités de production.</li>

            <li>Aujourd’hui : BAG produit plus de 750 000 bouteilles et 800 000 robinets par an, avec plus de 37 millions de bouteilles fabriquées depuis sa création.</li>
           </ul>
          </div>
          
          <div className="hitorique-patenaire">
           <h3>Partenaires</h3>
            <ul>
            <li>Les principaux partenaires de BAG incluent des entreprises du secteur énergétique et industriel.</li>
            <li>NAFTAL – Distribution de produits pétroliers et gaziers</li>
            <li>SONATRACH – Groupe national énergétique</li>
            <li>Entreprises industrielles et énergétiques nationales</li>
            </ul>
          
            <h4>Conditions Générales d’Utilisation (CGU)</h4>
            Les présentes Conditions Générales d’Utilisation définissent les règles d’utilisation du site web de l’entreprise BAG.
           
            En accédant au site, l’utilisateur accepte les conditions suivantes :
            
            <li>Le site a pour objectif de fournir des informations sur les activités et les produits de l’entreprise.</li>

            <li>L’utilisateur s’engage à utiliser le site de manière légale et responsable.</li>

            <li>Les contenus présents sur le site (textes, images, logos) sont protégés par les droits de propriété intellectuelle.</li>

            <li>Toute reproduction ou utilisation non autorisée des contenus est interdite.</li>

            <li>L’entreprise ne peut être tenue responsable des erreurs techniques ou interruptions du site.</li>

            <h4>Conditions Générales de Vente (CGV)</h4>

            Les présentes Conditions Générales de Vente régissent les relations commerciales entre l’entreprise BAG et ses clients.

            <h5>Principes principaux :</h5>

            Les produits commercialisés respectent les normes de sécurité et de qualité en vigueur.

            Les commandes sont confirmées après validation des conditions commerciales et des disponibilités.

            Les délais de livraison peuvent varier selon la quantité et la localisation du client.

            Les produits sont garantis contre les défauts de fabrication selon les normes applicables.

            Toute réclamation doit être effectuée dans un délai raisonnable après réception du produit.
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
