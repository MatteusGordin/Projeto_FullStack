import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { classeBadge } from "../prioridades";

function formatarData(texto) {
  if (texto === null || texto === undefined || texto === "") {
    return "-";
  }
  return String(texto).replace("T", " ").slice(0, 16);
}

function seloPrioridade(item) {
  const nome = item.prioridade ? item.prioridade : "-";
  const cor = item && item.corPrioridade ? String(item.corPrioridade).trim() : "";
  if (cor !== "") {
    return (
      <span className="badge" style={{ borderColor: cor, color: cor }}>{nome}</span>
    );
  }
  return (
    <span className={classeBadge(item.prioridade)}>{nome}</span>
  );
}

function Dashboard() {
  const [metricas, setMetricas] = useState(null);
  const [porPrioridade, setPorPrioridade] = useState([]);
  const [recentes, setRecentes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [erroRecentes, setErroRecentes] = useState("");

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro("");
      setErroRecentes("");
      try {
        const [respostaMetricas, respostaPrioridades] = await Promise.all([
          api.get("/chamados/metricas"),
          api.get("/chamados/metricas/prioridades")
        ]);
        setMetricas(respostaMetricas.data);
        const dados = respostaPrioridades.data;
        const lista = dados && typeof dados === "object" ? Object.entries(dados) : [];
        setPorPrioridade(lista);
      } catch (falha) {
        setErro("Falha ao carregar metricas. Tente novamente.");
      } finally {
        setCarregando(false);
      }
      try {
        const respostaRecentes = await api.get("/chamados", { params: { sort: "dataAbertura,desc", size: 5 } });
        const dadosRecentes = respostaRecentes.data;
        const listaRecentes = Array.isArray(dadosRecentes) ? dadosRecentes : Array.isArray(dadosRecentes.content) ? dadosRecentes.content : [];
        setRecentes(listaRecentes);
      } catch (falhaRecentes) {
        setErroRecentes("Falha ao carregar chamados recentes. Tente novamente.");
      }
    }
    carregar();
  }, []);

  if (carregando === true) {
    return (
      <div className="cartao cartao--lg">
        <h2 className="titulo-pagina">Dashboard</h2>
        <p className="texto-suave">Carregando metricas...</p>
      </div>
    );
  }

  if (erro !== "") {
    return (
      <div className="cartao cartao--lg">
        <h2 className="titulo-pagina">Dashboard</h2>
        <p className="mensagem-erro">{erro}</p>
      </div>
    );
  }

  const abertos = metricas && metricas.abertos ? metricas.abertos : 0;
  const fechados = metricas && metricas.fechados ? metricas.fechados : 0;

  return (
    <div className="cartao cartao--lg">
      <h2 className="titulo-pagina">Dashboard</h2>
      <div className="metricas-grade">
        <div className="metrica">
          <p className="metrica-valor">{abertos}</p>
          <p className="metrica-rotulo">Abertos</p>
        </div>
        <div className="metrica">
          <p className="metrica-valor">{fechados}</p>
          <p className="metrica-rotulo">Fechados</p>
        </div>
        <div className="metrica">
          <p className="metrica-valor">{abertos + fechados}</p>
          <p className="metrica-rotulo">Total</p>
        </div>
      </div>
      <h2 className="titulo-pagina">Chamados Recentes</h2>
      {erroRecentes !== "" ? (
        <p className="mensagem-erro">{erroRecentes}</p>
      ) : recentes.length === 0 ? (
        <p className="texto-suave">Nenhum chamado registrado.</p>
      ) : (
        <div className="tabela-responsiva">
          <table className="tabela">
            <thead>
              <tr>
                <th>Titulo</th>
                <th>Status</th>
                <th>Prioridade</th>
                <th>Abertura</th>
                <th>Ver</th>
              </tr>
            </thead>
            <tbody>
              {recentes.map((item) => (
                <tr key={item.id}>
                  <td>{item.titulo}</td>
                  <td>{item.status}</td>
                  <td>
                    {seloPrioridade(item)}
                  </td>
                  <td>{formatarData(item.dataAbertura)}</td>
                  <td>
                    <Link to={"/chamado/" + item.id}>Detalhes</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <h2 className="titulo-pagina">Por Prioridade</h2>
      {porPrioridade.length === 0 ? (
        <p className="texto-suave">Nenhum chamado registrado.</p>
      ) : (
        <div className="metricas-grade">
          {porPrioridade.map(([nome, total]) => (
            <div className="metrica" key={nome}>
              <p className="metrica-valor">{total}</p>
              <p className="metrica-rotulo">{nome === "" ? "Sem prioridade" : nome}</p>
            </div>
          ))}
        </div>
      )}
      <Link to="/chamados" className="elo-voltar">Ver chamados</Link>
    </div>
  );
}

export default Dashboard;
