import { Link } from "react-router-dom";

const estilos = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "24px",
    maxWidth: "640px",
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    textAlign: "center"
  },
  titulo: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#111827"
  },
  texto: {
    fontSize: "14px",
    color: "#4B5563"
  },
  elo: {
    padding: "12px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#1D4ED8"
  }
};

function NotFound() {
  return (
    <div style={estilos.container}>
      <h2 style={estilos.titulo}>Pagina nao encontrada</h2>
      <p style={estilos.texto}>O endereco acessado nao existe.</p>
      <Link to="/" style={estilos.elo}>Voltar para a lista</Link>
    </div>
  );
}

export default NotFound;
