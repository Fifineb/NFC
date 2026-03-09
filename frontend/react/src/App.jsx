import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./Pages/public/Home"
import "./assets/styles/global.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
