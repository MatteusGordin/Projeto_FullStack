import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const estilos = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "24px",
    maxWidth: "480px",
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
  erro: {
    fontSize: "14px",
    color: "#B91C1C",
    textAlign: "center"
  },
  elo: {
    fontSize: "14px",
    color: "#1D4ED8",
    textAlign: "center"
  }
};

function Login() {
  const navegar = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setErro("");
    const emailNormalizado = email.trim();
    const senhaNormalizada = senha.trim();
    if (emailNormalizado === "" || senhaNormalizada === "") {
      setErro("Informe email e senha.");
      return;
    }
    if (carregando === true) {
      return;
    }
    setCarregando(true);
    try {
      const resposta = await api.post("/auth/login", { email: emailNormalizado, senha: senhaNormalizada });
      const token = resposta.data && resposta.data.token ? resposta.data.token : "";
      if (token === "") {
        setErro("Falha na autenticacao. Tente novamente.");
        return;
      }
      localStorage.setItem("token", token);
      navegar("/");
    } catch (falha) {
      const respostaErro = falha && falha.response ? falha.response : null;
      const detalhe = respostaErro && respostaErro.data ? respostaErro.data : null;
      if (detalhe && detalhe.mensagem) {
        setErro(detalhe.mensagem);
      } else if (respostaErro && respostaErro.status === 401) {
        setErro("Email ou senha invalidos.");
      } else {
        setErro("Falha na autenticacao. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={estilos.container}>
      <h2>Entrar</h2>
      <form onSubmit={entrar} style={estilos.formulario}>
        <div style={estilos.bloco}>
          <label style={estilos.rotulo}>Email</label>
          <input style={estilos.campo} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@exemplo.com" inputMode="email" />
        </div>
        <div style={estilos.bloco}>
          <label style={estilos.rotulo}>Senha</label>
          <input style={estilos.campo} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Sua senha" type="password" />
        </div>
        <button type="submit" style={estilos.botao} disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
      {erro !== "" && <p style={estilos.erro}>{erro}</p>}
      <Link to="/" style={estilos.elo}>Voltar</Link>
    </div>
  );
}

export default Login;
