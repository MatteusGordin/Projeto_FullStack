import { useState, useEffect } from "react";
import api from "../services/api";
import { lerPerfil, cabecalho } from "../auth";

const todosPerfis = ["ADMIN", "TECNICO", "USUARIO"];

function extrairLista(dados) {
  if (Array.isArray(dados)) {
    return dados;
  }
  if (dados !== null && typeof dados === "object" && Array.isArray(dados.content)) {
    return dados.content;
  }
  return [];
}

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [setores, setSetores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [idEdicao, setIdEdicao] = useState(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("USUARIO");
  const [idSetor, setIdSetor] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [perfilLogado, setPerfilLogado] = useState("");

  const souTecnico = perfilLogado === "TECNICO";
  const perfis = souTecnico === true ? ["TECNICO", "USUARIO"] : todosPerfis;

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const [respostaUsuarios, respostaSetores, dadosPerfil] = await Promise.all([
        api.get("/usuarios", { params: { size: 200, sort: "nome" }, headers: cabecalho().headers }),
        api.get("/setores/opcoes", cabecalho()),
        lerPerfil()
      ]);
      setUsuarios(extrairLista(respostaUsuarios.data));
      setSetores(extrairLista(respostaSetores.data));
      const papel = dadosPerfil && dadosPerfil.perfil ? String(dadosPerfil.perfil).trim().toUpperCase() : "";
      setPerfilLogado(papel);
      if (papel === "TECNICO" && perfil === "ADMIN") {
        setPerfil("USUARIO");
      }
    } catch (falha) {
      const status = falha && falha.response ? falha.response.status : 0;
      if (status === 403) {
        setErro("Acesso negado. Apenas administradores e tecnicos acessam usuarios.");
      } else {
        setErro("Falha ao carregar usuarios. Tente novamente.");
      }
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
    setEmail("");
    setSenha("");
    setPerfil("USUARIO");
    setIdSetor("");
    setAtivo(true);
  }

  function editar(item) {
    const papelAlvo = item.perfil ? String(item.perfil).trim().toUpperCase() : "";
    if (souTecnico === true && papelAlvo === "ADMIN") {
      setErro("Apenas administradores podem gerenciar acessos de nivel ADMIN.");
      return;
    }
    setIdEdicao(item.id);
    setNome(item.nome);
    setEmail(item.email);
    setSenha("");
    setPerfil(papelAlvo === "" ? "USUARIO" : papelAlvo);
    setIdSetor(String(item.idSetor));
    setAtivo(item.ativo === null || item.ativo === undefined ? true : item.ativo);
    setMensagem("");
    setErro("");
  }

  async function salvar(e) {
    e.preventDefault();
    setMensagem("");
    setErro("");
    const setorNumero = Number(idSetor);
    if (nome.trim() === "" || email.trim() === "") {
      setErro("Informe nome e email do usuario.");
      return;
    }
    if (idEdicao === null && senha.trim() === "") {
      setErro("Informe a senha do usuario.");
      return;
    }
    if (perfis.includes(perfil) === false) {
      setErro("Selecione um perfil valido.");
      return;
    }
    if (souTecnico === true && perfil === "ADMIN") {
      setErro("Apenas administradores podem gerenciar acessos de nivel ADMIN.");
      return;
    }
    if (idSetor === "" || Number.isNaN(setorNumero) || setorNumero <= 0) {
      setErro("Selecione o setor do usuario.");
      return;
    }
    if (salvando === true) {
      return;
    }
    setSalvando(true);
    try {
      const dados = { nome: nome.trim(), email: email.trim(), senha: senha, perfil: perfil, idSetor: setorNumero, ativo: ativo };
      if (idEdicao === null) {
        dados.senha = senha.trim();
        await api.post("/usuarios", dados, cabecalho());
        setMensagem("Usuario criado com sucesso.");
      } else {
        await api.put("/usuarios/" + idEdicao, dados, cabecalho());
        setMensagem("Usuario atualizado com sucesso.");
      }
      limpar();
      await carregar();
    } catch (falha) {
      const status = falha && falha.response ? falha.response.status : 0;
      const detalhe = falha && falha.response && falha.response.data ? falha.response.data : null;
      if (status === 403) {
        setErro("Apenas administradores podem gerenciar acessos de nivel ADMIN.");
      } else if (detalhe && detalhe.mensagem) {
        setErro(detalhe.mensagem);
      } else {
        setErro("Falha ao salvar usuario. Tente novamente.");
      }
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(item) {
    setMensagem("");
    setErro("");
    const papelAlvo = item.perfil ? String(item.perfil).trim().toUpperCase() : "";
    if (souTecnico === true && papelAlvo === "ADMIN") {
      setErro("Apenas administradores podem gerenciar acessos de nivel ADMIN.");
      return;
    }
    if (window.confirm("Excluir o usuario " + item.nome + "?") === false) {
      return;
    }
    try {
      await api.delete("/usuarios/" + item.id, cabecalho());
      if (idEdicao === item.id) {
        limpar();
      }
      setMensagem("Usuario excluido com sucesso.");
      await carregar();
    } catch (falha) {
      const status = falha && falha.response ? falha.response.status : 0;
      if (status === 403) {
        setErro("Apenas administradores podem gerenciar acessos de nivel ADMIN.");
      } else {
        setErro("Falha ao excluir usuario. Tente novamente.");
      }
    }
  }

  function acaoBloqueada(item) {
    const papelAlvo = item.perfil ? String(item.perfil).trim().toUpperCase() : "";
    return souTecnico === true && papelAlvo === "ADMIN";
  }

  return (
    <div className="cartao cartao--lg">
      <h2 className="titulo-pagina">Usuarios</h2>
      {souTecnico === true && (
        <p className="texto-suave">Voce esta logado como TECNICO. Acoes sobre acessos ADMIN estao bloqueadas.</p>
      )}
      <form onSubmit={salvar} className="formulario">
        <div className="bloco">
          <label className="rotulo">Nome</label>
          <input className="campo" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do usuario" />
        </div>
        <div className="bloco">
          <label className="rotulo">Email</label>
          <input className="campo" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@exemplo.com" inputMode="email" />
        </div>
        <div className="bloco">
          <label className="rotulo">{idEdicao === null ? "Senha" : "Nova senha (vazio mantem a atual)"}</label>
          <input className="campo" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha do usuario" type="password" />
        </div>
        <div className="bloco">
          <label className="rotulo">Perfil</label>
          <select className="campo" value={perfil} onChange={(e) => setPerfil(e.target.value)}>
            {perfis.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
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
        <div className="bloco">
          <label className="rotulo">Situacao</label>
          <select className="campo" value={ativo === true ? "ativo" : "inativo"} onChange={(e) => setAtivo(e.target.value === "ativo")}>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
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
        <p className="texto-suave">Carregando usuarios...</p>
      ) : usuarios.length === 0 ? (
        <p className="texto-suave">Nenhum usuario cadastrado.</p>
      ) : (
        <div className="tabela-responsiva">
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Perfil</th>
                <th>Situacao</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((item) => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{item.email}</td>
                  <td>{item.perfil}</td>
                  <td>{item.ativo === false ? "Inativo" : "Ativo"}</td>
                  <td>
                    <div className="linha-acoes">
                      <button type="button" className="botao" onClick={() => editar(item)} disabled={acaoBloqueada(item)} title={acaoBloqueada(item) ? "Apenas administradores podem gerenciar ADMIN" : "Editar"}>Editar</button>
                      <button type="button" className="botao botao--perigo" onClick={() => excluir(item)} disabled={acaoBloqueada(item)} title={acaoBloqueada(item) ? "Apenas administradores podem gerenciar ADMIN" : "Excluir"}>Excluir</button>
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

export default AdminUsuarios;
