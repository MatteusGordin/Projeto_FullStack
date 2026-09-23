import { useState, useEffect } from "react";
import api from "../services/api";

function extrairLista(dados) {
  if (Array.isArray(dados)) {
    return dados;
  }
  if (dados !== null && typeof dados === "object" && Array.isArray(dados.content)) {
    return dados.content;
  }
  return [];
}

function AdminSetores() {
  const [setores, setSetores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [idEdicao, setIdEdicao] = useState(null);
  const [nome, setNome] = useState("");
  const [sigla, setSigla] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const resposta = await api.get("/setores", { params: { size: 200, sort: "nome" } });
      setSetores(extrairLista(resposta.data));
    } catch (falha) {
      setErro("Falha ao carregar setores. Tente novamente.");
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
    setSigla("");
  }

  function editar(item) {
    setIdEdicao(item.id);
    setNome(item.nome);
    setSigla(item.sigla);
    setMensagem("");
    setErro("");
  }

  async function salvar(e) {
    e.preventDefault();
    setMensagem("");
    setErro("");
    if (nome.trim() === "" || sigla.trim() === "") {
      setErro("Informe nome e sigla do setor.");
      return;
    }
    if (salvando === true) {
      return;
    }
    setSalvando(true);
    try {
      const dados = { nome: nome.trim(), sigla: sigla.trim() };
      if (idEdicao === null) {
        await api.post("/setores", dados);
        setMensagem("Setor criado com sucesso.");
      } else {
        await api.put("/setores/" + idEdicao, dados);
        setMensagem("Setor atualizado com sucesso.");
      }
      limpar();
      await carregar();
    } catch (falha) {
      const detalhe = falha && falha.response && falha.response.data ? falha.response.data : null;
      if (detalhe && detalhe.mensagem) {
        setErro(detalhe.mensagem);
      } else {
        setErro("Falha ao salvar setor. Tente novamente.");
      }
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(item) {
    setMensagem("");
    setErro("");
    if (window.confirm("Excluir o setor " + item.nome + "?") === false) {
      return;
    }
    try {
      await api.delete("/setores/" + item.id);
      if (idEdicao === item.id) {
        limpar();
      }
      setMensagem("Setor excluido com sucesso.");
      await carregar();
    } catch (falha) {
      setErro("Falha ao excluir setor. Tente novamente.");
    }
  }

  return (
    <div className="cartao cartao--lg">
      <h2 className="titulo-pagina">Setores</h2>
      <form onSubmit={salvar} className="formulario">
        <div className="bloco">
          <label className="rotulo">Nome</label>
          <input className="campo" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do setor" />
        </div>
        <div className="bloco">
          <label className="rotulo">Sigla</label>
          <input className="campo" value={sigla} onChange={(e) => setSigla(e.target.value)} placeholder="Sigla do setor" />
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
        <p className="texto-suave">Carregando setores...</p>
      ) : setores.length === 0 ? (
        <p className="texto-suave">Nenhum setor cadastrado.</p>
      ) : (
        <div className="tabela-responsiva">
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Sigla</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {setores.map((item) => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{item.sigla}</td>
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

export default AdminSetores;
