import logoapp from "../../assets/images/logoapp.png"

function Navbar(){
  return(

    <nav className="navbar">

      <div className="logo">
        <img src={logoapp} alt="SmartStock"/>
        <span>Smart Stock</span>
      </div>

      <ul className="nav-links">

        <li>Accueil</li>
        <li>Service</li>
        <li>Société</li>
        <li>Prix</li>
        <li>Contact</li>

      </ul>

    </nav>

  )
}

export default Navbar