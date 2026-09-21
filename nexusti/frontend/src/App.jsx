import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import ListarChamados from "./pages/ListarChamados";
import AbrirChamado from "./pages/AbrirChamado";
import VerChamado from "./pages/VerChamado";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const estilos = {
  pagina: {
    minHeight: "100vh",
    backgroundColor: "#F3F4F6",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch"
  },
  quadro: {
    width: "100%",
    maxWidth: "960px",
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  topo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#D1D5DB"
  },
  titulo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#111827",
    marginTop: "8px",
    marginBottom: "8px"
  },
  navegacao: {
    display: "flex",
    flexDirection: "row",
    gap: "16px",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px"
  },
  elo: {
    padding: "12px",
    paddingLeft: "16px",
    paddingRight: "16px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#1D4ED8",
    backgroundColor: "#EFF6FF",
    borderRadius: "12px"
  },
  conteudo: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  }
};

function temToken() {
  const token = localStorage.getItem("token");
  return token !== null && token !== "";
}

function RotaProtegida({ elemento }) {
  if (temToken() === false) {
    return <Navigate to="/login" replace />;
  }
  return elemento;
}

function App() {
  return (
    <BrowserRouter>
      <div style={estilos.pagina}>
        <div style={estilos.quadro}>
          <div style={estilos.topo}>
            <h1 style={estilos.titulo}>Nexus TI</h1>
            <nav style={estilos.navegacao}>
              <Link to="/" style={estilos.elo}>Lista</Link>
              <Link to="/novo" style={estilos.elo}>Abrir</Link>
              <Link to="/login" style={estilos.elo}>Login</Link>
            </nav>
          </div>
          <div style={estilos.conteudo}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<RotaProtegida elemento={<ListarChamados />} />} />
              <Route path="/novo" element={<RotaProtegida elemento={<AbrirChamado />} />} />
              <Route path="/chamado/:id" element={<RotaProtegida elemento={<VerChamado />} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
