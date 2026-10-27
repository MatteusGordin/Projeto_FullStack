import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { lerPerfil, cabecalho } from "../auth";
import { classeBadge } from "../prioridades";

function formatarData(texto) {
  if (texto === null || texto === undefined || texto === "") {
    return "-";
  }
  return String(texto).replace("T", " ").slice(0, 16);
}

function VerChamado() {
  const { id } = useParams();
  const [chamado, setChamado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [solucao, setSolucao] = useState("");
  const [concluindo, setConcluindo] = useState(false);
  const [papel, setPapel] = useState("");

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
        const [resposta, dadosPerfil] = await Promise.all([
          api.get("/chamados/" + idNormalizado, cabecalho()),
          lerPerfil().catch(() => null)
        ]);
        if (resposta.data) {
          setChamado(resposta.data);
          if (resposta.data.solucao) {
            setSolucao(resposta.data.solucao);
          }
        } else {
          setErro("Chamado nao encontrado.");
        }
        const papelAtual = dadosPerfil && dadosPerfil.perfil ? String(dadosPerfil.perfil).trim().toUpperCase() : "";
        setPapel(papelAtual);
      } catch (falha) {
        setErro("Falha ao carregar chamado. Tente novamente.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id]);

  async function concluir() {
    if (chamado === null) {
      setErro("Nenhum chamado carregado para concluir.");
      return;
    }
    const texto = solucao.trim();
    if (texto.length < 5) {
      setErro("Informe a solucao com pelo menos 5 caracteres.");
      return;
    }
    if (concluindo === true) {
      return;
    }
    setConcluindo(true);
    setErro("");
    setMensagem("");
    try {
      const resposta = await api.put("/chamados/" + String(id).trim() + "/concluir", { solucao: texto }, cabecalho());
      setChamado(resposta.data);
      setMensagem("Chamado concluido com sucesso.");
    } catch (falha) {
      const status = falha && falha.response ? falha.response.status : 0;
      const detalhe = falha && falha.response && falha.response.data ? falha.response.data : null;
      if (status === 403) {
        setErro("Apenas administradores e tecnicos podem concluir chamados.");
      } else if (detalhe && detalhe.mensagem) {
        setErro(detalhe.mensagem);
      } else {
        setErro("Falha ao concluir chamado. Tente novamente.");
      }
    } finally {
      setConcluindo(false);
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

  const equipe = papel === "ADMIN" || papel === "TECNICO";
  const fechado = chamado.status ? String(chamado.status).trim().toUpperCase() === "FECHADO" : false;
  const nomeSolicitante = chamado.nomeSolicitante && chamado.nomeSolicitante !== "" ? chamado.nomeSolicitante : "-";
  const setorSolicitante = chamado.nomeSetorSolicitante && chamado.nomeSetorSolicitante !== ""
    ? chamado.siglaSetorSolicitante && chamado.siglaSetorSolicitante !== ""
      ? chamado.nomeSetorSolicitante + " (" + chamado.siglaSetorSolicitante + ")"
      : chamado.nomeSetorSolicitante
    : "-";
  const solucaoExibida = chamado.solucao && chamado.solucao !== "" ? chamado.solucao : "-";
  const corPrioridadeAtual = chamado.corPrioridade && String(chamado.corPrioridade).trim() !== "" ? String(chamado.corPrioridade).trim() : "";
  const seloPrioridade = corPrioridadeAtual !== ""
    ? <span className="badge" style={{ borderColor: corPrioridadeAtual, color: corPrioridadeAtual }}>{chamado.prioridade ? chamado.prioridade : "-"}</span>
    : <span className={classeBadge(chamado.prioridade)}>{chamado.prioridade ? chamado.prioridade : "-"}</span>;

  return (
    <div className="cartao cartao--md">
      <h2 className="titulo-pagina">Ver Chamado</h2>
      <div className="detalhe">
        <p>Titulo: {chamado.titulo}</p>
        <p>Descricao: {chamado.descricao}</p>
        <p>Status: {chamado.status}</p>
        <p>Prioridade: {seloPrioridade}</p>
        <p>Solicitante: {nomeSolicitante}</p>
        <p>Setor do solicitante: {setorSolicitante}</p>
        <p>Abertura: {formatarData(chamado.dataAbertura)}</p>
        <p>Fechamento: {formatarData(chamado.dataFechamento)}</p>
        <p>Solucao: {solucaoExibida}</p>
      </div>
      {equipe === true && fechado === false && (
        <div className="formulario">
          <div className="bloco">
            <label className="rotulo">Solucao (obrigatoria para concluir)</label>
            <textarea className="campo" value={solucao} onChange={(e) => setSolucao(e.target.value)} placeholder="Descreva a solucao aplicada" rows={4} />
          </div>
          <button className="botao" onClick={concluir} disabled={concluindo}>
            {concluindo ? "Concluindo..." : "Concluir Chamado"}
          </button>
        </div>
      )}
      {mensagem !== "" && <p className="mensagem-sucesso">{mensagem}</p>}
      {erro !== "" && <p className="mensagem-erro">{erro}</p>}
    </div>
  );
}

export default VerChamado;
