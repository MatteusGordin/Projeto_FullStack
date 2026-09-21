import { useState } from "react";
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
  }
};

function AbrirChamado() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [idSolicitante, setIdSolicitante] = useState("");
  const [idEquipamento, setIdEquipamento] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function salvar(e) {
    e.preventDefault();
    setMensagem("");
    setErro("");
    const tituloNormalizado = titulo.trim();
    const descricaoNormalizada = descricao.trim();
    const solicitanteNormalizado = idSolicitante.trim();
    const equipamentoNormalizado = idEquipamento.trim();
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
    const solicitanteNumero = Number(solicitanteNormalizado);
    const equipamentoNumero = Number(equipamentoNormalizado);
    if (solicitanteNormalizado === "" || Number.isNaN(solicitanteNumero) || solicitanteNumero <= 0) {
      setErro("Informe um ID de solicitante valido maior que zero.");
      return;
    }
    if (equipamentoNormalizado === "" || Number.isNaN(equipamentoNumero) || equipamentoNumero <= 0) {
      setErro("Informe um ID de equipamento valido maior que zero.");
      return;
    }
    if (carregando === true) {
      return;
    }
    setCarregando(true);
    const dados = {
      titulo: tituloNormalizado,
      descricao: descricaoNormalizada,
      prioridade: "MEDIA",
      idSolicitante: solicitanteNumero,
      idEquipamento: equipamentoNumero
    };
    try {
      await api.post("/chamados", dados);
      setMensagem("Chamado salvo com sucesso.");
      setTitulo("");
      setDescricao("");
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
          <label style={estilos.rotulo}>ID do solicitante</label>
          <input style={estilos.campo} value={idSolicitante} onChange={(e) => setIdSolicitante(e.target.value)} placeholder="Exemplo: 1" inputMode="numeric" />
        </div>
        <div style={estilos.bloco}>
          <label style={estilos.rotulo}>ID do equipamento</label>
          <input style={estilos.campo} value={idEquipamento} onChange={(e) => setIdEquipamento(e.target.value)} placeholder="Exemplo: 1" inputMode="numeric" />
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
