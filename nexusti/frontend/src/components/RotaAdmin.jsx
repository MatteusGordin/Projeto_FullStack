import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { lerPerfil } from "../auth";

function RotaAdmin({ elemento }) {
  const [estado, setEstado] = useState("carregando");

  useEffect(() => {
    async function verificar() {
      try {
        const dados = await lerPerfil();
        const papel = dados && dados.perfil ? String(dados.perfil).trim().toUpperCase() : "";
        if (papel === "ADMIN" || papel === "TECNICO") {
          setEstado("ok");
        } else {
          setEstado("negado");
        }
      } catch {
        setEstado("negado");
      }
    }
    verificar();
  }, []);

  if (estado === "carregando") {
    return (
      <div className="cartao cartao--md">
        <p className="texto-suave">Verificando acesso...</p>
      </div>
    );
  }

  if (estado === "negado") {
    return <Navigate to="/" replace />;
  }

  return elemento;
}

export default RotaAdmin;
