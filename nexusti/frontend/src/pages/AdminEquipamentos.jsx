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

function AdminEquipamentos() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [setores, setSetores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [idEdicao, setIdEdicao] = useState(null);
  const [patrimonio, setPatrimonio] = useState("");
  const [tipo, setTipo] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [idSetor, setIdSetor] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const [respostaEquipamentos, respostaSetores] = await Promise.all([
        api.get("/equipamentos", { params: { size: 200, sort: "patrimonio" } }),
        api.get("/setores/opcoes")
      ]);
      setEquipamentos(extrairLista(respostaEquipamentos.data));
      setSetores(extrairLista(respostaSetores.data));
    } catch (falha) {
      setErro("Falha ao carregar equipamentos. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function limpar() {
    setIdEdicao(null);
    setPatrimonio("");
    setTipo("");
    setMarca("");
    setModelo("");
    setIdSetor("");
  }

  function editar(item) {
    setIdEdicao(item.id);
    setPatrimonio(item.patrimonio);
    setTipo(item.tipo);
    setMarca(item.marca);
    setModelo(item.modelo);
    setIdSetor(String(item.idSetor));
    setMensagem("");
    setErro("");
  }

  async function salvar(e) {
    e.preventDefault();
    setMensagem("");
    setErro("");
    const setorNumero = Number(idSetor);
    if (patrimonio.trim() === "" || tipo.trim() === "" || marca.trim() === "" || modelo.trim() === "") {
      setErro("Preencha todos os campos do equipamento.");
      return;
    }
    if (idSetor === "" || Number.isNaN(setorNumero) || setorNumero <= 0) {
      setErro("Selecione o setor do equipamento.");
      return;
    }
    if (salvando === true) {
      return;
    }
    setSalvando(true);
    try {
      const dados = { patrimonio: patrimonio.trim(), tipo: tipo.trim(), marca: marca.trim(), modelo: modelo.trim(), idSetor: setorNumero };
      if (idEdicao === null) {
        await api.post("/equipamentos", dados);
        setMensagem("Equipamento criado com sucesso.");
      } else {
        await api.put("/equipamentos/" + idEdicao, dados);
        setMensagem("Equipamento atualizado com sucesso.");
      }
      limpar();
      await carregar();
    } catch (falha) {
      const detalhe = falha && falha.response && falha.response.data ? falha.response.data : null;
      if (detalhe && detalhe.mensagem) {
        setErro(detalhe.mensagem);
      } else {
        setErro("Falha ao salvar equipamento. Tente novamente.");
      }
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(item) {
    setMensagem("");
    setErro("");
    if (window.confirm("Excluir o equipamento " + item.patrimonio + "?") === false) {
      return;
    }
    try {
      await api.delete("/equipamentos/" + item.id);
      if (idEdicao === item.id) {
        limpar();
      }
      setMensagem("Equipamento excluido com sucesso.");
      await carregar();
    } catch (falha) {
      setErro("Falha ao excluir equipamento. Tente novamente.");
    }
  }

  return (
    <div className="cartao cartao--lg">
      <h2 className="titulo-pagina">Equipamentos</h2>
      <form onSubmit={salvar} className="formulario">
        <div className="bloco">
          <label className="rotulo">Patrimonio</label>
          <input className="campo" value={patrimonio} onChange={(e) => setPatrimonio(e.target.value)} placeholder="Numero do patrimonio" />
        </div>
        <div className="bloco">
          <label className="rotulo">Tipo</label>
          <input className="campo" value={tipo} onChange={(e) => setTipo(e.target.value)} placeholder="Tipo do equipamento" />
        </div>
        <div className="bloco">
          <label className="rotulo">Marca</label>
          <input className="campo" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Marca do equipamento" />
        </div>
        <div className="bloco">
          <label className="rotulo">Modelo</label>
          <input className="campo" value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="Modelo do equipamento" />
        </div>
        <div className="bloco">
          <label className="rotulo">Setor</label>
          <select className="campo" value={idSetor} onChange={(e) => setIdSetor(e.target.value)}>
            <option value="">Selecione o setor</option>
            {setores.map((item) => (
              <option key={item.id} value={item.id}>{item.nome} ({item.sigla})</option>
            ))}
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
        <p className="texto-suave">Carregando equipamentos...</p>
      ) : equipamentos.length === 0 ? (
        <p className="texto-suave">Nenhum equipamento cadastrado.</p>
      ) : (
        <div className="tabela-responsiva">
          <table className="tabela">
            <thead>
              <tr>
                <th>Patrimonio</th>
                <th>Tipo</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {equipamentos.map((item) => (
                <tr key={item.id}>
                  <td>{item.patrimonio}</td>
                  <td>{item.tipo}</td>
                  <td>{item.marca}</td>
                  <td>{item.modelo}</td>
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

export default AdminEquipamentos;
