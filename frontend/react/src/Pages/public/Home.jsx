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
             <h4>Description de l'entreprise : </h4> 
             BAG (Batna Aluminium Gaz) est une entreprise industrielle algérienne spécialisée dans la fabrication et la commercialisation de récipients à pression, notamment les bouteilles de gaz GPL utilisées dans les secteurs domestiques, industriels et automobiles.
             Créée en 1972, l’entreprise joue aujourd’hui un rôle essentiel dans le marché énergétique algérien, en assurant la production d’équipements fiables et conformes aux normes de qualité et de sécurité.
             BAG est certifiée ISO 9001 (Système de Management de la Qualité), ce qui garantit l’amélioration continue de ses processus de production et la satisfaction de ses clients.
             L’entreprise possède plusieurs unités de production en Algérie, notamment à Alger, Batna et Mascara, et emploie des centaines de collaborateurs spécialisés dans la fabrication industrielle.
            </p>
          </div>
          <div className="historique-grid">
            {/*mission */}
            <h3>Notre Mission</h3>
           <div className="historique-card">
            <div className="historique-icon">
            </div>
            
            <p>
             <h4>Mission :</h4> 
              Produire des bouteilles de gaz et équipements sous pression fiables et sécurisés
              Répondre aux besoins énergétiques du marché algérien
              Garantir une qualité élevée et une conformité aux normes internationales
              Assurer la sécurité des utilisateurs et la durabilité des produits

             <h4>Vision :</h4>
              Renforcer sa position de leader national dans la fabrication de bouteilles de gaz
              Développer des solutions industrielles innovantes
              Contribuer au développement du secteur énergétique en Algérie
              Maintenir un haut niveau de qualité, sécurité et performance industrielle
            </p>
          </div>

          <div className="historique-histoire">
            <h4>Historique </h4> 

            1972 : Création de l’entreprise BAG avec une capacité de production de 250 000 bouteilles par an.

            1995 : BAG devient une filiale à 100 % de NAFTAL.

            2003 : Obtention de la certification ISO 9001, garantissant un système de management de la qualité performant.

            Années suivantes : Développement et modernisation des unités de production.

            Aujourd’hui : BAG produit plus de 750 000 bouteilles et 800 000 robinets par an, avec plus de 37 millions de bouteilles fabriquées depuis sa création.

          </div>
          
          <div className="hitorique-patenaire">
           <h4>Partenaires</h4>
            Les principaux partenaires de BAG incluent des entreprises du secteur énergétique et industriel.
            NAFTAL – Distribution de produits pétroliers et gaziers
            SONATRACH – Groupe national énergétique
            Entreprises industrielles et énergétiques nationales

            <h4>Conditions Générales d’Utilisation (CGU)</h4>
            Les présentes Conditions Générales d’Utilisation définissent les règles d’utilisation du site web de l’entreprise BAG.
            En accédant au site, l’utilisateur accepte les conditions suivantes :
            Le site a pour objectif de fournir des informations sur les activités et les produits de l’entreprise.

            L’utilisateur s’engage à utiliser le site de manière légale et responsable.

            Les contenus présents sur le site (textes, images, logos) sont protégés par les droits de propriété intellectuelle.

            Toute reproduction ou utilisation non autorisée des contenus est interdite.

            L’entreprise ne peut être tenue responsable des erreurs techniques ou interruptions du site.

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
        </div>
      </section>






      
    </>
  )
}

export default Home


