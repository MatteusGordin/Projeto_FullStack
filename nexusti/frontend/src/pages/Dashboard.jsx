import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [metricas, setMetricas] = useState(null);
  const [porPrioridade, setPorPrioridade] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro("");
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
