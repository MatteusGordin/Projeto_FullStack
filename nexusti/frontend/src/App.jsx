import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LayoutAutenticado from "./components/LayoutAutenticado";
import RotaPublica from "./components/RotaPublica";
import RotaAdmin from "./components/RotaAdmin";
import { temToken } from "./auth";
import Dashboard from "./pages/Dashboard";
import ListarChamados from "./pages/ListarChamados";
import AbrirChamado from "./pages/AbrirChamado";
import VerChamado from "./pages/VerChamado";
import AdminSetores from "./pages/AdminSetores";
import AdminEquipamentos from "./pages/AdminEquipamentos";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminPrioridades from "./pages/AdminPrioridades";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

function RotaProtegida({ elemento }) {
  if (temToken() === false) {
    return <Navigate to="/login" replace />;
  }
  return elemento;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<RotaPublica elemento={<Login />} />} />
        <Route element={<RotaProtegida elemento={<LayoutAutenticado />} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chamados" element={<ListarChamados />} />
          <Route path="/novo" element={<AbrirChamado />} />
          <Route path="/chamado/:id" element={<VerChamado />} />
          <Route path="/admin/setores" element={<RotaAdmin elemento={<AdminSetores />} />} />
          <Route path="/admin/equipamentos" element={<RotaAdmin elemento={<AdminEquipamentos />} />} />
          <Route path="/admin/usuarios" element={<RotaAdmin elemento={<AdminUsuarios />} />} />
          <Route path="/admin/prioridades" element={<RotaAdmin elemento={<AdminPrioridades />} />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
