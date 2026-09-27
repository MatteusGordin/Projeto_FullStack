import { useState, useEffect } from "react";
import api from "../services/api";
import { lerPerfil } from "../auth";

const prioridadesPadrao = ["BAIXA", "MEDIA", "ALTA", "URGENTE"];

function extrairLista(dados) {
  if (Array.isArray(dados)) {
    return dados;
  }
  if (dados !== null && typeof dados === "object" && Array.isArray(dados.content)) {
    return dados.content;
  }
  return [];
}

function AbrirChamado() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState("MEDIA");
  const [idSetor, setIdSetor] = useState("");
  const [idSolicitante, setIdSolicitante] = useState("");
  const [idEquipamento, setIdEquipamento] = useState("");
  const [setores, setSetores] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [solicitantes, setSolicitantes] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [carregandoListas, setCarregandoListas] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [papel, setPapel] = useState("");

  useEffect(() => {
    async function carregarOpcoes() {
      setCarregandoListas(true);
      setErro("");
      try {
        const dadosPerfil = await lerPerfil().catch(() => null);
        const papelAtual = dadosPerfil && dadosPerfil.perfil ? String(dadosPerfil.perfil).trim().toUpperCase() : "";
        setPapel(papelAtual);
        const idLogado = dadosPerfil && dadosPerfil.id ? String(dadosPerfil.id) : "";
        const [respostaSetores, respostaEquipamentos, respostaPrioridades] = await Promise.all([
          api.get("/setores/opcoes"),
          api.get("/equipamentos/opcoes"),
          api.get("/prioridades/opcoes")
        ]);
        setSetores(extrairLista(respostaSetores.data));
        setEquipamentos(extrairLista(respostaEquipamentos.data));
        const opcoesPrioridade = extrairLista(respostaPrioridades.data).map((item) => item.nome);
        const listaPrioridades = opcoesPrioridade.length > 0 ? opcoesPrioridade : prioridadesPadrao;
        setPrioridades(listaPrioridades);
        if (listaPrioridades.includes(prioridade) === false) {
          setPrioridade(listaPrioridades[0]);
        }
        const equipe = papelAtual === "ADMIN" || papelAtual === "TECNICO";
        if (equipe === true) {
          try {
            const respostaUsuarios = await api.get("/usuarios", { params: { size: 200, sort: "nome" } });
            setSolicitantes(extrairLista(respostaUsuarios.data));
          } catch (falhaUsuarios) {
            setSolicitantes([]);
          }
        } else {
          if (dadosPerfil && dadosPerfil.nome && idLogado !== "") {
            setSolicitantes([{ id: dadosPerfil.id, nome: dadosPerfil.nome, email: dadosPerfil.email }]);
          } else {
            setSolicitantes([]);
          }
          if (idLogado !== "") {
            setIdSolicitante(idLogado);
          }
        }
      } catch (falha) {
        const respostaErro = falha && falha.response ? falha.response : null;
        const detalhe = respostaErro && respostaErro.data ? respostaErro.data : null;
        if (detalhe && detalhe.mensagem) {
          setErro(detalhe.mensagem);
        } else {
          setErro("Falha ao carregar setores e equipamentos. Tente novamente.");
        }
      } finally {
        setCarregandoListas(false);
      }
    }
    carregarOpcoes();
  }, []);

  const equipamentosFiltrados = idSetor === "" ? equipamentos : equipamentos.filter((item) => String(item.idSetor) === String(idSetor));

  function aoTrocarSetor(valor) {
    setIdSetor(valor);
    setIdEquipamento("");
  }

  async function salvar(e) {
    e.preventDefault();
    setMensagem("");
    setErro("");
    const tituloNormalizado = titulo.trim();
    const descricaoNormalizada = descricao.trim();
    if (tituloNormalizado === "") {
      setErro("Informe o titulo do chamado.");
      return;
    }
    if (tituloNormalizado.length < 3) {
      setErro("O titulo deve ter pelo menos 3 caracteres.");
      return;
    }
    if (descricaoNormalizada === "") {
      setErro("Informe a descricao do problema.");
      return;
    }
    if (descricaoNormalizada.length < 5) {
      setErro("A descricao deve ter pelo menos 5 caracteres.");
      return;
    }
    if (prioridades.includes(prioridade) === false) {
      setErro("Selecione uma prioridade valida.");
      return;
    }
    const solicitanteNumero = Number(idSolicitante);
    const equipamentoNumero = Number(idEquipamento);
    if (idSolicitante === "" || Number.isNaN(solicitanteNumero) || solicitanteNumero <= 0) {
      setErro("Selecione o solicitante.");
      return;
    }
    if (idEquipamento === "" || Number.isNaN(equipamentoNumero) || equipamentoNumero <= 0) {
      setErro("Selecione o equipamento.");
      return;
    }
    if (carregando === true) {
      return;
    }
    setCarregando(true);
    const dados = {
      titulo: tituloNormalizado,
      descricao: descricaoNormalizada,
      prioridade: prioridade,
      idSolicitante: solicitanteNumero,
      idEquipamento: equipamentoNumero
    };
    try {
      await api.post("/chamados", dados);
      setMensagem("Chamado salvo com sucesso.");
      setTitulo("");
      setDescricao("");
      setPrioridade(prioridades.length > 0 ? prioridades[0] : "MEDIA");
      setIdSetor("");
      const equipe = papel === "ADMIN" || papel === "TECNICO";
      if (equipe === true) {
        setIdSolicitante("");
      }
      setIdEquipamento("");
    } catch (falha) {
      const respostaErro = falha && falha.response ? falha.response : null;
      const detalhe = respostaErro ? respostaErro.data : null;
      if (detalhe && detalhe.mensagem) {
        setErro(detalhe.mensagem);
      } else {
        setErro("Falha ao salvar chamado. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  }

  if (carregandoListas === true) {
    return (
      <div className="cartao cartao--md">
        <h2 className="titulo-pagina">Abrir Chamado</h2>
        <p className="texto-suave">Carregando setores e equipamentos...</p>
      </div>
    );
  }

  const equipe = papel === "ADMIN" || papel === "TECNICO";

  return (
    <div className="cartao cartao--md">
      <h2 className="titulo-pagina">Abrir Chamado</h2>
      <form onSubmit={salvar} className="formulario">
        <div className="bloco">
          <label className="rotulo">Titulo</label>
          <input className="campo" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Exemplo: PC da recepcao com defeito" />
        </div>
        <div className="bloco">
          <label className="rotulo">Descricao</label>
          <input className="campo" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva o problema" />
        </div>
        <div className="bloco">
          <label className="rotulo">Prioridade</label>
          <select className="campo" value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
            {prioridades.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="bloco">
          <label className="rotulo">Setor do equipamento</label>
          <select className="campo" value={idSetor} onChange={(e) => aoTrocarSetor(e.target.value)}>
            <option value="">Todos os setores</option>
            {setores.map((item) => (
              <option key={item.id} value={item.id}>{item.nome} ({item.sigla})</option>
            ))}
          </select>
        </div>
        <div className="bloco">
          <label className="rotulo">Solicitante</label>
          <select className="campo" value={idSolicitante} onChange={(e) => setIdSolicitante(e.target.value)} disabled={equipe === false}>
            <option value="">Selecione o solicitante</option>
            {solicitantes.map((item) => (
              <option key={item.id} value={item.id}>{item.nome} ({item.email})</option>
            ))}
          </select>
        </div>
        <div className="bloco">
          <label className="rotulo">Equipamento</label>
          <select className="campo" value={idEquipamento} onChange={(e) => setIdEquipamento(e.target.value)}>
            <option value="">Selecione o equipamento</option>
            {equipamentosFiltrados.map((item) => (
              <option key={item.id} value={item.id}>{item.patrimonio} - {item.tipo} {item.marca} {item.modelo}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="botao" disabled={carregando}>
          {carregando ? "Salvando..." : "Salvar"}
        </button>
      </form>
      {mensagem !== "" && <p className="mensagem-sucesso">{mensagem}</p>}
      {erro !== "" && <p className="mensagem-erro">{erro}</p>}
    </div>
  );
}

export default AbrirChamado;
