import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { sair, lerPerfil, lerEmailToken } from "../auth";

function classeElo(ativo) {
  return ativo === true ? "elo elo--ativo" : "elo";
}

function LayoutAutenticado() {
  const navegar = useNavigate();
  const [aberta, setAberta] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await lerPerfil();
        setUsuario(dados);
      } catch {
        setUsuario({ nome: "", email: lerEmailToken(), perfil: "" });
      }
    }
    carregar();
  }, []);

  function aoSair() {
    sair();
    navegar("/login", { replace: true });
  }

  function alternar() {
    setAberta(!aberta);
  }

  function fechar() {
    setAberta(false);
  }

  const papel = usuario && usuario.perfil ? String(usuario.perfil).trim().toUpperCase() : "";
  const equipe = papel === "ADMIN" || papel === "TECNICO";
  const nomeExibido = usuario && usuario.nome ? usuario.nome : (usuario && usuario.email ? usuario.email : lerEmailToken());

  return (
    <div className="layout">
      <aside className={aberta === true ? "sidebar sidebar--aberta" : "sidebar"}>
        <p className="marca">Nexus <span>TI</span></p>
        <nav className="navegacao">
          <NavLink to="/" end onClick={fechar} className={({ isActive }) => classeElo(isActive)}>Dashboard</NavLink>
          <NavLink to="/chamados" onClick={fechar} className={({ isActive }) => classeElo(isActive)}>Meus Chamados</NavLink>
          <NavLink to="/novo" onClick={fechar} className={({ isActive }) => classeElo(isActive)}>Novo Chamado</NavLink>
          {equipe === true && <p className="nav-secao">Administracao</p>}
          {equipe === true && <NavLink to="/admin/setores" onClick={fechar} className={({ isActive }) => classeElo(isActive)}>Setores</NavLink>}
          {equipe === true && <NavLink to="/admin/equipamentos" onClick={fechar} className={({ isActive }) => classeElo(isActive)}>Equipamentos</NavLink>}
          {equipe === true && <NavLink to="/admin/usuarios" onClick={fechar} className={({ isActive }) => classeElo(isActive)}>Usuarios</NavLink>}
          {equipe === true && <NavLink to="/admin/prioridades" onClick={fechar} className={({ isActive }) => classeElo(isActive)}>Prioridades</NavLink>}
        </nav>
      </aside>
      {aberta === true && <button type="button" aria-label="Fechar menu" className="menu-fundo" onClick={fechar} />}
      <div className="area">
        <header className="topbar">
          <button type="button" aria-label="Abrir menu" className="menu-botao" onClick={alternar}>&#9776;</button>
          <div className="usuario-topo">
            <p className="usuario-nome">{nomeExibido}</p>
            <p className="usuario-perfil">{papel}</p>
          </div>
          <button type="button" className="botao-sair" onClick={aoSair}>Sair</button>
        </header>
        <main className="conteudo">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default LayoutAutenticado;
