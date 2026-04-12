import { useState } from "react";

export default function Register() {

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    age: "",
    motdepasse: "",
    cmotdepasse: ""
  });

  const [errors, setErrors] = useState({});

  // gérer les changements
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // validation
  const validerFormulaire = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!formData.nom) {
      newErrors.nom = "Nom obligatoire";
    }

    if (!formData.motdepasse) {
      newErrors.motdepasse = "Mot de passe obligatoire";
    } else if (formData.motdepasse.length < 6) {
      newErrors.motdepasse = "Minimum 6 caractères";
    }

    if (!formData.cmotdepasse) {
      newErrors.cmotdepasse = "Confirmation obligatoire";
    } else if (formData.cmotdepasse !== formData.motdepasse) {
      newErrors.cmotdepasse = "Mot de passe incompatible";
    }

    if (isNaN(formData.age)) {
      newErrors.age = "L'âge doit être un nombre";
    }

    setErrors(newErrors);

    // si pas d'erreurs
    if (Object.keys(newErrors).length === 0) {
      alert("Formulaire valide !");

      // 🔴 ici on envoie vers Spring Boot
      fetch("http://localhost:8080/api/inscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
    }
  };

  return (
    <div>
      <header>Formulaire d'inscription</header>

      <form onSubmit={validerFormulaire}>
        <fieldset>
          <legend>Nous contacter</legend>

          <div>
            <label>Nom :</label>
            <input type="text" name="nom" onChange={handleChange} />
            <span>{errors.nom}</span>
          </div>

          <div>
            <label>Prénom :</label>
            <input type="text" name="prenom" onChange={handleChange} />
          </div>

          <div>
            <label>Email :</label>
            <input type="email" name="email" onChange={handleChange} />
          </div>

          <div>
            <label>Age :</label>
            <input type="text" name="age" onChange={handleChange} />
            <span>{errors.age}</span>
          </div>

          <div>
            <label>Mot de passe :</label>
            <input type="password" name="motdepasse" onChange={handleChange} />
            <span>{errors.motdepasse}</span>
          </div>

          <div>
            <label>Confirmer :</label>
            <input type="password" name="cmotdepasse" onChange={handleChange} />
            <span>{errors.cmotdepasse}</span>
          </div>

          <button type="submit">S'inscrire</button>
        </fieldset>
      </form>
    </div>
    
  );
}
