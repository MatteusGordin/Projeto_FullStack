import { useState, useEffect } from "react";
import api from "../services/api";

const CORES = [
  { rotulo: "Vermelho", valor: "#EF4444" },
  { rotulo: "Laranja", valor: "#F97316" },
  { rotulo: "Amarelo", valor: "#EAB308" },
  { rotulo: "Verde", valor: "#22C55E" },
  { rotulo: "Azul", valor: "#3B82F6" },
  { rotulo: "Cinza", valor: "#64748B" }
];

const ORDEM_OPCOES = [
  { rotulo: "1 (Baixa)", valor: "1" },
  { rotulo: "2 (Media)", valor: "2" },
  { rotulo: "3 (Alta)", valor: "3" },
  { rotulo: "4 (Urgente)", valor: "4" }
];

function extrairLista(dados) {
  if (Array.isArray(dados)) {
    return dados;
  }
  if (dados !== null && typeof dados === "object" && Array.isArray(dados.content)) {
    return dados.content;
  }
  return [];
}

function AdminPrioridades() {
  const [prioridades, setPrioridades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [idEdicao, setIdEdicao] = useState(null);
  const [nome, setNome] = useState("");
  const [cor, setCor] = useState("#64748B");
  const [ordem, setOrdem] = useState("1");
  const [ativa, setAtiva] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const resposta = await api.get("/prioridades", { params: { size: 200, sort: "ordem,asc" } });
      setPrioridades(extrairLista(resposta.data));
    } catch (falha) {
      setErro("Falha ao carregar prioridades. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function limpar() {
    setIdEdicao(null);
    setNome("");
    setCor("#64748B");
    setOrdem("1");
    setAtiva(true);
  }

  function editar(item) {
    setIdEdicao(item.id);
    setNome(item.nome);
    setCor(item.cor ? item.cor : "#64748B");
    const ordemTexto = String(item.ordem === null || item.ordem === undefined ? 1 : item.ordem);
    setOrdem(ORDEM_OPCOES.some((opcao) => opcao.valor === ordemTexto) ? ordemTexto : "1");
    setAtiva(item.ativa === null || item.ativa === undefined ? true : item.ativa);
    setMensagem("");
    setErro("");
  }

  async function salvar(e) {
    e.preventDefault();
    setMensagem("");
    setErro("");
    const ordemNumero = Number(ordem);
    if (nome.trim() === "") {
      setErro("Informe o nome da prioridade.");
      return;
    }
    if (ordem.trim() === "" || Number.isNaN(ordemNumero)) {
      setErro("Informe a ordem da prioridade.");
      return;
    }
    if (ORDEM_OPCOES.some((opcao) => opcao.valor === ordem) === false) {
      setErro("Selecione uma ordem valida.");
      return;
    }
    if (CORES.some((item) => item.valor === cor) === false) {
      setErro("Selecione uma cor valida.");
      return;
    }
    if (salvando === true) {
      return;
    }
    setSalvando(true);
    try {
      const dados = { nome: nome.trim(), cor: cor, ordem: ordemNumero, ativa: ativa };
      if (idEdicao === null) {
        await api.post("/prioridades", dados);
        setMensagem("Prioridade criada com sucesso.");
      } else {
        await api.put("/prioridades/" + idEdicao, dados);
        setMensagem("Prioridade atualizada com sucesso.");
      }
      limpar();
      await carregar();
    } catch (falha) {
      const detalhe = falha && falha.response && falha.response.data ? falha.response.data : null;
      if (detalhe && detalhe.mensagem) {
        setErro(detalhe.mensagem);
      } else {
        setErro("Falha ao salvar prioridade. Tente novamente.");
      }
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(item) {
    setMensagem("");
    setErro("");
    if (window.confirm("Excluir a prioridade " + item.nome + "?") === false) {
      return;
    }
    try {
      await api.delete("/prioridades/" + item.id);
      if (idEdicao === item.id) {
        limpar();
      }
      setMensagem("Prioridade excluida com sucesso.");
      await carregar();
    } catch (falha) {
      setErro("Falha ao excluir prioridade. Tente novamente.");
    }
  }

  return (
    <div className="cartao cartao--lg">
      <h2 className="titulo-pagina">Prioridades</h2>
      <form onSubmit={salvar} className="formulario">
        <div className="bloco">
          <label className="rotulo">Nome</label>
          <input className="campo" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da prioridade" />
        </div>
        <div className="bloco">
          <label className="rotulo">Cor</label>
          <select className="campo" value={cor} onChange={(e) => setCor(e.target.value)}>
            {CORES.map((item) => (
              <option key={item.valor} value={item.valor}>{item.rotulo}</option>
            ))}
          </select>
          <div className="linha-acoes" style={{ marginTop: "8px", alignItems: "center" }}>
            <span className="texto-suave">Previa:</span>
            <span style={{ display: "inline-block", width: "28px", height: "28px", borderRadius: "8px", backgroundColor: cor, border: "1px solid rgba(255,255,255,0.25)" }} />
          </div>
        </div>
        <div className="bloco">
          <label className="rotulo">Ordem</label>
          <select className="campo" value={ordem} onChange={(e) => setOrdem(e.target.value)}>
            {ORDEM_OPCOES.map((opcao) => (
              <option key={opcao.valor} value={opcao.valor}>{opcao.rotulo}</option>
            ))}
          </select>
        </div>
        <div className="bloco">
          <label className="rotulo">Situacao</label>
          <select className="campo" value={ativa === true ? "ativa" : "inativa"} onChange={(e) => setAtiva(e.target.value === "ativa")}>
            <option value="ativa">Ativa</option>
            <option value="inativa">Inativa</option>
          </select>
        </div>
        <div className="linha-acoes">
          <button type="submit" className="botao" disabled={salvando}>
            {idEdicao === null ? "Criar" : "Atualizar"}
          </button>
          {idEdicao !== null && (
            <button type="button" className="botao botao--perigo" onClick={limpar}>Cancelar</button>
          )}
        </div>
      </form>
      {mensagem !== "" && <p className="mensagem-sucesso">{mensagem}</p>}
      {erro !== "" && <p className="mensagem-erro">{erro}</p>}
      {carregando === true ? (
        <p className="texto-suave">Carregando prioridades...</p>
      ) : prioridades.length === 0 ? (
        <p className="texto-suave">Nenhuma prioridade cadastrada.</p>
      ) : (
        <div className="tabela-responsiva">
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cor</th>
                <th>Ordem</th>
                <th>Situacao</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {prioridades.map((item) => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ display: "inline-block", width: "18px", height: "18px", borderRadius: "6px", backgroundColor: item.cor ? item.cor : "#64748B", border: "1px solid rgba(255,255,255,0.25)" }} />
                    </span>
                  </td>
                  <td>{item.ordem}</td>
                  <td>{item.ativa === false ? "Inativa" : "Ativa"}</td>
                  <td>
                    <div className="linha-acoes">
                      <button type="button" className="botao" onClick={() => editar(item)}>Editar</button>
                      <button type="button" className="botao botao--perigo" onClick={() => excluir(item)}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPrioridades;
