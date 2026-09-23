import { useState, useEffect } from "react";
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
  formulario: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  bloco: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  rotulo: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#111827"
  },
  campo: {
    padding: "14px",
    fontSize: "16px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "#D1D5DB",
    borderRadius: "12px",
    backgroundColor: "#F9FAFB"
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
  mensagem: {
    fontSize: "14px",
    color: "#15803D",
    textAlign: "center",
    marginTop: "16px"
  },
  erro: {
    fontSize: "14px",
    color: "#B91C1C",
    textAlign: "center",
    marginTop: "16px"
  },
  centro: {
    fontSize: "14px",
    color: "#4B5563",
    textAlign: "center"
  }
};

const prioridades = ["BAIXA", "MEDIA", "ALTA", "URGENTE"];

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
  const [carregandoListas, setCarregandoListas] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    async function carregarOpcoes() {
      setCarregandoListas(true);
      setErro("");
      try {
        const [respostaSetores, respostaEquipamentos, respostaUsuarios] = await Promise.all([
          api.get("/setores/opcoes"),
          api.get("/equipamentos/opcoes"),
          api.get("/usuarios", { params: { size: 200, sort: "nome" } })
        ]);
        setSetores(extrairLista(respostaSetores.data));
        setEquipamentos(extrairLista(respostaEquipamentos.data));
        setSolicitantes(extrairLista(respostaUsuarios.data));
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
      setPrioridade("MEDIA");
      setIdSetor("");
      setIdSolicitante("");
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
      <div style={estilos.container}>
        <h2>Abrir Chamado</h2>
        <p style={estilos.centro}>Carregando setores e equipamentos...</p>
      </div>
    );
  }

  return (
    <div style={estilos.container}>
      <h2>Abrir Chamado</h2>
      <form onSubmit={salvar} style={estilos.formulario}>
        <div style={estilos.bloco}>
          <label style={estilos.rotulo}>Titulo</label>
          <input style={estilos.campo} value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Exemplo: PC da recepcao com defeito" />
        </div>
        <div style={estilos.bloco}>
          <label style={estilos.rotulo}>Descricao</label>
          <input style={estilos.campo} value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva o problema" />
        </div>
        <div style={estilos.bloco}>
          <label style={estilos.rotulo}>Prioridade</label>
          <select style={estilos.campo} value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
            {prioridades.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div style={estilos.bloco}>
          <label style={estilos.rotulo}>Setor do equipamento</label>
          <select style={estilos.campo} value={idSetor} onChange={(e) => aoTrocarSetor(e.target.value)}>
            <option value="">Todos os setores</option>
            {setores.map((item) => (
              <option key={item.id} value={item.id}>{item.nome} ({item.sigla})</option>
            ))}
          </select>
        </div>
        <div style={estilos.bloco}>
          <label style={estilos.rotulo}>Solicitante</label>
          <select style={estilos.campo} value={idSolicitante} onChange={(e) => setIdSolicitante(e.target.value)}>
            <option value="">Selecione o solicitante</option>
            {solicitantes.map((item) => (
              <option key={item.id} value={item.id}>{item.nome} ({item.email})</option>
            ))}
          </select>
        </div>
        <div style={estilos.bloco}>
          <label style={estilos.rotulo}>Equipamento</label>
          <select style={estilos.campo} value={idEquipamento} onChange={(e) => setIdEquipamento(e.target.value)}>
            <option value="">Selecione o equipamento</option>
            {equipamentosFiltrados.map((item) => (
              <option key={item.id} value={item.id}>{item.patrimonio} - {item.tipo} {item.marca} {item.modelo}</option>
            ))}
          </select>
        </div>
        <button type="submit" style={estilos.botao} disabled={carregando}>
          {carregando ? "Salvando..." : "Salvar"}
        </button>
      </form>
      {mensagem !== "" && <p style={estilos.mensagem}>{mensagem}</p>}
      {erro !== "" && <p style={estilos.erro}>{erro}</p>}
    </div>
  );
}

export default AbrirChamado;
