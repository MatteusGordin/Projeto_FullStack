import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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
    <div className="login-pagina">
      <div className="cartao cartao--sm">
        <p className="marca-login">Nexus TI</p>
        <h2 className="titulo-pagina texto-centro">Entrar</h2>
        <form onSubmit={entrar} className="formulario">
          <div className="bloco">
            <label className="rotulo">Email</label>
            <input className="campo" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@exemplo.com" inputMode="email" />
          </div>
          <div className="bloco">
            <label className="rotulo">Senha</label>
            <input className="campo" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Sua senha" type="password" />
          </div>
          <button type="submit" className="botao" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
        {erro !== "" && <p className="mensagem-erro">{erro}</p>}
      </div>
    </div>
  );
}

export default Login;
