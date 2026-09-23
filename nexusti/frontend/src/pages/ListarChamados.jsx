import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { classeBadge } from "../prioridades";

const ordenacoes = [
  { valor: "dataAbertura,desc", rotulo: "Mais recentes" },
  { valor: "dataAbertura,asc", rotulo: "Mais antigos" },
  { valor: "prioridade,asc", rotulo: "Prioridade A-Z" },
  { valor: "prioridade,desc", rotulo: "Prioridade Z-A" },
  { valor: "status,asc", rotulo: "Status A-Z" }
];

function formatarData(texto) {
  if (texto === null || texto === undefined || texto === "") {
    return "-";
  }
  return String(texto).replace("T", " ").slice(0, 16);
}

function ListarChamados() {
  const [chamados, setChamados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [ordenacao, setOrdenacao] = useState("dataAbertura,desc");

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        const resposta = await api.get("/chamados", { params: { sort: ordenacao, size: 50 } });
        const dados = resposta.data;
        const lista = Array.isArray(dados) ? dados : Array.isArray(dados.content) ? dados.content : [];
        setChamados(lista);
      } catch (falha) {
        setErro("Falha ao carregar chamados. Tente novamente.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [ordenacao]);

  function corpo() {
    if (carregando === true) {
      return <p className="texto-suave">Carregando chamados...</p>;
    }
    if (erro !== "") {
      return <p className="mensagem-erro">{erro}</p>;
    }
    if (chamados.length === 0) {
      return <p className="texto-suave">Nenhum chamado encontrado.</p>;
    }
    return (
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
            {chamados.map((item) => (
              <tr key={item.id}>
                <td>{item.titulo}</td>
                <td>{item.status}</td>
                <td>
                  <span className={classeBadge(item.prioridade)}>{item.prioridade ? item.prioridade : "-"}</span>
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
    );
  }

  return (
    <div className="cartao cartao--lg">
      <h2 className="titulo-pagina">Lista de Chamados</h2>
      <div className="bloco">
        <label className="rotulo">Ordenacao</label>
        <select className="campo" value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)}>
          {ordenacoes.map((item) => (
            <option key={item.valor} value={item.valor}>{item.rotulo}</option>
          ))}
        </select>
      </div>
      {corpo()}
    </div>
  );
}

export default ListarChamados;
