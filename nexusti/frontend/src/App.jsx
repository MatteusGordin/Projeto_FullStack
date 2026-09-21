import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ListarChamados from "./pages/ListarChamados";
import AbrirChamado from "./pages/AbrirChamado";
import VerChamado from "./pages/VerChamado";

function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>Nexus TI</h1>
        <nav>
          <Link to="/">Lista</Link>
          <span> | </span>
          <Link to="/novo">Abrir</Link>
        </nav>
        <Routes>
          <Route path="/" element={<ListarChamados />} />
          <Route path="/novo" element={<AbrirChamado />} />
          <Route path="/chamado/:id" element={<VerChamado />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
