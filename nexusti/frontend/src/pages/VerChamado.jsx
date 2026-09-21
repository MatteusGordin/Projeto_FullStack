import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

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
    borderRadius: "12px"
  },
  cartao: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "16px",
    backgroundColor: "#F9FAFB",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#D1D5DB",
    borderRadius: "12px"
  },
  texto: {
    fontSize: "14px",
    color: "#111827",
    marginTop: "8px",
    marginBottom: "8px"
  },
  botao: {
    padding: "14px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#FFFFFF",
    backgroundColor: "#1D4ED8",
    borderWidth: "0px",
    borderRadius: "12px"
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

function VerChamado() {
  const { id } = useParams();
  const [chamado, setChamado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [fechando, setFechando] = useState(false);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro("");
      const idNormalizado = id ? String(id).trim() : "";
      if (idNormalizado === "") {
        setErro("ID do chamado invalido.");
        setCarregando(false);
        return;
      }
      try {
        const resposta = await api.get("/chamados/" + idNormalizado);
        if (resposta.data) {
          setChamado(resposta.data);
        } else {
          setErro("Chamado nao encontrado.");
        }
      } catch (falha) {
        setErro("Falha ao carregar chamado. Tente novamente.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id]);

  async function fechar() {
    if (chamado === null) {
      setErro("Nenhum chamado carregado para fechar.");
      return;
    }
    if (fechando === true) {
      return;
    }
    setFechando(true);
    setErro("");
    const dados = {
      titulo: chamado.titulo,
      descricao: chamado.descricao,
      status: "FECHADO",
      prioridade: chamado.prioridade,
      dataFechamento: chamado.dataFechamento,
      idSolicitante: chamado.idSolicitante,
      idTecnico: chamado.idTecnico,
      idEquipamento: chamado.idEquipamento
    };
    try {
      const resposta = await api.put("/chamados/" + String(id).trim(), dados);
      setChamado(resposta.data);
    } catch (falha) {
      setErro("Falha ao fechar chamado. Tente novamente.");
    } finally {
      setFechando(false);
    }
  }

  if (carregando === true) {
    return (
      <div style={estilos.container}>
        <h2>Ver Chamado</h2>
        <p style={estilos.centro}>Carregando...</p>
      </div>
    );
  }

  if (erro !== "" && chamado === null) {
    return (
      <div style={estilos.container}>
        <h2>Ver Chamado</h2>
        <p style={estilos.erro}>{erro}</p>
      </div>
    );
  }

  if (chamado === null) {
    return (
      <div style={estilos.container}>
        <h2>Ver Chamado</h2>
        <p style={estilos.centro}>Chamado nao encontrado.</p>
      </div>
    );
  }

  return (
    <div style={estilos.container}>
      <h2>Ver Chamado</h2>
      <div style={estilos.cartao}>
        <p style={estilos.texto}>Titulo: {chamado.titulo}</p>
        <p style={estilos.texto}>Descricao: {chamado.descricao}</p>
        <p style={estilos.texto}>Status: {chamado.status}</p>
        <p style={estilos.texto}>Prioridade: {chamado.prioridade}</p>
      </div>
      <button style={estilos.botao} onClick={fechar} disabled={fechando}>
        {fechando ? "Fechando..." : "Fechar Chamado"}
      </button>
      {erro !== "" && <p style={estilos.erro}>{erro}</p>}
    </div>
  );
}

export default VerChamado;
