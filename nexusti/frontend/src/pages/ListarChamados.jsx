import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const estilos = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "24px",
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px"
  },
  tabela: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#F9FAFB",
    borderRadius: "12px"
  },
  celula: {
    padding: "12px",
    fontSize: "14px",
    color: "#111827",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#D1D5DB"
  },
  centro: {
    fontSize: "14px",
    color: "#4B5563",
    textAlign: "center",
    padding: "16px"
  },
  erro: {
    fontSize: "14px",
    color: "#B91C1C",
    textAlign: "center",
    padding: "16px"
  }
};

function ListarChamados() {
  const [chamados, setChamados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        const resposta = await api.get("/chamados");
        const dados = resposta.data;
        const lista = Array.isArray(dados) ? dados : Array.isArray(dados.content) ? dados.content : [];
        setChamados(lista);
      } catch (falha) {
        setErro("Falha ao carregar chamados. Tente novamente.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  if (carregando === true) {
    return (
      <div style={estilos.container}>
        <h2>Lista de Chamados</h2>
        <p style={estilos.centro}>Carregando chamados...</p>
      </div>
    );
  }

  if (erro !== "") {
    return (
      <div style={estilos.container}>
        <h2>Lista de Chamados</h2>
        <p style={estilos.erro}>{erro}</p>
      </div>
    );
  }

  if (chamados.length === 0) {
    return (
      <div style={estilos.container}>
        <h2>Lista de Chamados</h2>
        <p style={estilos.centro}>Nenhum chamado encontrado.</p>
      </div>
    );
  }

  return (
    <div style={estilos.container}>
      <h2>Lista de Chamados</h2>
      <table style={estilos.tabela} border="1">
        <thead>
          <tr>
            <th style={estilos.celula}>Titulo</th>
            <th style={estilos.celula}>Status</th>
            <th style={estilos.celula}>Ver</th>
          </tr>
        </thead>
        <tbody>
          {chamados.map((item) => (
            <tr key={item.id}>
              <td style={estilos.celula}>{item.titulo}</td>
              <td style={estilos.celula}>{item.status}</td>
              <td style={estilos.celula}>
                <Link to={"/chamado/" + item.id}>Detalhes</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListarChamados;
