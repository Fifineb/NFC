import { useEffect, useState } from "react";
import { getRegions } from "./services/api/regionApi";

function App() {
  const [regions, setRegions] = useState([]);

 useEffect(() => {
  getRegions()
    .then(res => {
      console.log(res.data); 
      setRegions(res.data);
    })
    .catch(err => console.error(err));
}, []);

  return (
    <div>
      <h1>Liste des régions</h1>

      {regions.map((r) => (
        <div key={r.id}>
          <h3>{r.nomR}</h3>
          <p>{r.description}</p>
          <p>{r.adresseR}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
