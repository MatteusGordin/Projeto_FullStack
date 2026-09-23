import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { classeBadge } from "../prioridades";

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
      <div className="cartao cartao--md">
        <h2 className="titulo-pagina">Ver Chamado</h2>
        <p className="texto-suave">Carregando...</p>
      </div>
    );
  }

  if (erro !== "" && chamado === null) {
    return (
      <div className="cartao cartao--md">
        <h2 className="titulo-pagina">Ver Chamado</h2>
        <p className="mensagem-erro">{erro}</p>
      </div>
    );
  }

  if (chamado === null) {
    return (
      <div className="cartao cartao--md">
        <h2 className="titulo-pagina">Ver Chamado</h2>
        <p className="texto-suave">Chamado nao encontrado.</p>
      </div>
    );
  }

  return (
    <div className="cartao cartao--md">
      <h2 className="titulo-pagina">Ver Chamado</h2>
      <div className="detalhe">
        <p>Titulo: {chamado.titulo}</p>
        <p>Descricao: {chamado.descricao}</p>
        <p>Status: {chamado.status}</p>
        <p>Prioridade: <span className={classeBadge(chamado.prioridade)}>{chamado.prioridade ? chamado.prioridade : "-"}</span></p>
      </div>
      <button className="botao" onClick={fechar} disabled={fechando}>
        {fechando ? "Fechando..." : "Fechar Chamado"}
      </button>
      {erro !== "" && <p className="mensagem-erro">{erro}</p>}
    </div>
  );
}

export default VerChamado;
