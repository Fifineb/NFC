import "./login.css";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginRegister() {
  const [isChecked, setIsChecked] = useState(false);

  // LOGIN
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  // REGISTER
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  // ================= LOGIN =================
const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !motDePasse) {
        setError("Veuillez remplir tous les champs");
        return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
        const result = await login({
            email,
            password: motDePasse,
        });

        console.log("Résultat login:", result);

        if (result.success) {
            setSuccess("Connexion réussie");
            
            //  Redirection selon le rôle
            const role = result.user?.role;
            setTimeout(() => {
                switch(role) {
                    case 'ADMINISTRATEUR':
                        navigate('/admin/dashboard');
                        break;
                    case 'GESTIONNAIRE':
                        navigate('/manager/dashboard');
                        break;
                    case 'MAGASINIER':
                        navigate('/stocker/dashboard');
                        break;
                    case 'SUPERVISEUR':
                        navigate('/supervisor/dashboard');
                        break;
                    default:
                        navigate('/dashboard');
                }
            }, 1000);
          } else {
            setError(result.error || "Email ou mot de passe incorrect");
        }
    } catch (err) {
        console.error("Erreur login:", err);
        setError("Erreur de connexion au serveur");
    } finally {
        setLoading(false);
    }
};

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();

    console.log({
      nom,
      telephone,
      email: registerEmail,
      motDePasse: registerPassword,
    });

    alert("Inscription à implémenter côté backend");
  };

  return (
    <div className="section">
      <div className="container">
        <div className="full-height">
          <div className="center">


            {/* SWITCH */}
            <input
              type="checkbox"
              id="reg-log"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />

            <label htmlFor="reg-log"></label>

            <div className={`card-3d-wrap ${isChecked ? "active" : ""}`}>
              <div className="card-3d-wrapper">

                {/* ================= LOGIN ================= */}
                <div className="card-front">
                  <div className="center-wrap">

                    <h4>Log In</h4>

                    {error && (
                      <div
                        style={{
                          color: "red",
                          marginBottom: "15px",
                          fontSize: "14px",
                          textAlign: "center",
                        }}
                      >
                        {error}
                      </div>
                    )}

                    {success && (
                      <div
                        style={{
                          color: "green",
                          marginBottom: "15px",
                          fontSize: "14px",
                          textAlign: "center",
                        }}
                      >
                        {success}
                      </div>
                    )}

                    <form onSubmit={handleLogin}>

                      <div className="form-group">
                        <input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <input
                          type="password"
                          placeholder="Mot de passe"
                          value={motDePasse}
                          onChange={(e) => setMotDePasse(e.target.value)}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn"
                        disabled={loading}
                      >
                        {loading ? "Connexion..." : "Login"}
                      </button>

                    </form>

                  </div>
                </div>

                {/* ================= REGISTER ================= */}
                <div className="card-back">
                  <div className="center-wrap">

                    <h4>Sign Up</h4>

                    <form onSubmit={handleRegister}>

                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Nom complet"
                          value={nom}
                          onChange={(e) => setNom(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <input
                          type="tel"
                          placeholder="Téléphone"
                          value={telephone}
                          onChange={(e) => setTelephone(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <input
                          type="email"
                          placeholder="Email"
                          value={registerEmail}
                          onChange={(e) => setRegisterEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <input
                          type="password"
                          placeholder="Mot de passe"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          required
                        />
                      </div>

                      <button type="submit" className="btn">
                        Register
                      </button>

                    </form>

                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
