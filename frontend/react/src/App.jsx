import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./Pages/public/Home"
import Contact from "./Pages/public/Contact"
import Register from "./Pages/public/Register";
import Nouscontacter from "./Pages/public/Nouscontacter";

import "./assets/styles/global.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/nouscontacter" element={<Nouscontacter />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
