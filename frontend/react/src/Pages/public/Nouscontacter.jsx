import { useState } from "react";

export default function Nouscontacter() {

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    message: ""
  });

  const [errors, setErrors] = useState({});

  // gérer les changements
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
 return ( 
    <form>
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
            <label>Message :</label>
            <textarea name="message" onChange={handleChange} />
            <span>{errors.message}</span>
          </div>

            <button type="submit">Envoyer</button>

        </fieldset>
 </form>
  );
}

