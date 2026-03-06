import images from "../../assets/images/Accueil.jpeg"
import Navbar from "../../composantes/common/Navbar"

function Home() {
  return (
    <><Navbar/>
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
    </>

  )
}
export default Home

