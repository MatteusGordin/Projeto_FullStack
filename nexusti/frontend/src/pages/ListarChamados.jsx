import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { cabecalho } from "../auth";
import { classeBadge } from "../prioridades";

const ordenacoes = [
  { valor: "status,asc", rotulo: "Abertos primeiro" },
  { valor: "dataAbertura,desc", rotulo: "Mais recentes" },
  { valor: "dataAbertura,asc", rotulo: "Mais antigos" },
  { valor: "nivel,desc", rotulo: "Nivel de Prioridade (Urgentes primeiro)" }
];

const PESO_PRIORIDADE = {
  URGENTE: 0,
  ALTA: 1,
  MEDIA: 2,
  BAIXA: 3
};

function formatarData(texto) {
  if (texto === null || texto === undefined || texto === "") {
    return "-";
  }
  return String(texto).replace("T", " ").slice(0, 16);
}

function textoOuTraco(texto) {
  if (texto === null || texto === undefined || String(texto).trim() === "") {
    return "-";
  }
  return String(texto);
}

function ehFechado(item) {
  return item && item.status ? String(item.status).trim().toUpperCase() === "FECHADO" : false;
}

function corPrioridade(item) {
  const cor = item && item.corPrioridade ? String(item.corPrioridade).trim() : "";
  return cor === "" ? "" : cor;
}

function pesoNivel(item) {
  const nome = item && item.prioridade ? String(item.prioridade).trim().toUpperCase() : "";
  return PESO_PRIORIDADE[nome] === undefined ? 4 : PESO_PRIORIDADE[nome];
}

function ordenarParaExibicao(lista, ordenacao) {
  if (ordenacao !== "status,asc" && ordenacao !== "nivel,desc") {
    return lista;
  }
  return [...lista].sort((a, b) => {
    if (ordenacao === "nivel,desc") {
      const pesoA = pesoNivel(a);
      const pesoB = pesoNivel(b);
      if (pesoA !== pesoB) {
        return pesoA - pesoB;
      }
    } else {
      const pesoA = ehFechado(a) ? 1 : 0;
      const pesoB = ehFechado(b) ? 1 : 0;
      if (pesoA !== pesoB) {
        return pesoA - pesoB;
      }
    }
    const dataA = a && a.dataAbertura ? String(a.dataAbertura) : "";
    const dataB = b && b.dataAbertura ? String(b.dataAbertura) : "";
    if (dataA === dataB) {
      return 0;
    }
    return dataA < dataB ? 1 : -1;
  });
}

function seloPrioridade(item) {
  const nome = item.prioridade ? item.prioridade : "-";
  const cor = corPrioridade(item);
  if (cor !== "") {
    return (
      <span className="badge" style={{ borderColor: cor, color: cor }}>{nome}</span>
    );
  }
  return (
    <span className={classeBadge(item.prioridade)}>{nome}</span>
  );
}

function seloStatus(item) {
  if (ehFechado(item)) {
    return (
      <span className="badge" style={{ borderColor: "var(--borda)", color: "var(--tinta-suave)" }}>{item.status}</span>
    );
  }
  return (
    <span className="badge" style={{ borderColor: "var(--neon)", color: "var(--neon)" }}>{item.status}</span>
  );
}

function extrairLista(dados) {
  if (Array.isArray(dados)) {
    return dados;
  }
  if (dados !== null && typeof dados === "object" && Array.isArray(dados.content)) {
    return dados.content;
  }
  return [];
}

function ListarChamados() {
  const [chamados, setChamados] = useState([]);
  const [setores, setSetores] = useState([]);
  const [prioridades, setPrioridades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [ordenacao, setOrdenacao] = useState("status,asc");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [filtroSetor, setFiltroSetor] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const [respostaSetores, respostaPrioridades] = await Promise.all([
          api.get("/setores/opcoes", cabecalho()),
          api.get("/prioridades/opcoes", cabecalho())
        ]);
        setSetores(extrairLista(respostaSetores.data));
        setPrioridades(extrairLista(respostaPrioridades.data));
      } catch (falha) {
        setSetores([]);
        setPrioridades([]);
      }
    }
    carregarOpcoes();
  }, []);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        const brutos = {
          sort: ordenacao === "nivel,desc" ? "dataAbertura,desc" : ordenacao,
          size: 50,
          status: filtroStatus,
          prioridade: filtroPrioridade,
          idSetor: filtroSetor,
          dataInicio: dataInicio,
          dataFim: dataFim
        };
        const parametros = {};
        Object.keys(brutos).forEach((chave) => {
          const valor = brutos[chave];
          if (valor !== "" && valor !== null && valor !== undefined) {
            parametros[chave] = valor;
          }
        });
        const resposta = await api.get("/chamados", { params: parametros, headers: cabecalho().headers });
        const dados = resposta.data;
        const lista = Array.isArray(dados) ? dados : Array.isArray(dados.content) ? dados.content : [];
        setChamados(ordenarParaExibicao(lista, ordenacao));
      } catch (falha) {
        const detalhe = falha && falha.response && falha.response.data ? falha.response.data : null;
        if (detalhe && detalhe.mensagem) {
          setErro(detalhe.mensagem);
        } else {
          setErro("Falha ao carregar chamados. Tente novamente.");
        }
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [ordenacao, filtroStatus, filtroSetor, filtroPrioridade, dataInicio, dataFim]);

  function limparFiltros() {
    setFiltroStatus("");
    setFiltroSetor("");
    setFiltroPrioridade("");
    setDataInicio("");
    setDataFim("");
  }

  function setorExibido(item) {
    const nome = item.nomeSetorSolicitante ? String(item.nomeSetorSolicitante).trim() : "";
    const sigla = item.siglaSetorSolicitante ? String(item.siglaSetorSolicitante).trim() : "";
    if (nome !== "" && sigla !== "") {
      return nome + " (" + sigla + ")";
    }
    if (nome !== "") {
      return nome;
    }
    if (sigla !== "") {
      return sigla;
    }
    return "-";
  }

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
              <th>Solicitante</th>
              <th>Setor</th>
              <th>Abertura</th>
              <th>Ver</th>
            </tr>
          </thead>
          <tbody>
            {chamados.map((item) => (
              <tr key={item.id} style={ehFechado(item) ? { opacity: 0.62 } : undefined}>
                <td>{item.titulo}</td>
                <td>{seloStatus(item)}</td>
                <td>
                  {seloPrioridade(item)}
                </td>
                <td>{textoOuTraco(item.nomeSolicitante)}</td>
                <td>{setorExibido(item)}</td>
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
      <div className="metricas-grade">
        <div className="bloco">
          <label className="rotulo">Status</label>
          <select className="campo" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}>
            <option value="">Todos</option>
            <option value="ABERTO">Aberto</option>
            <option value="FECHADO">Fechado</option>
          </select>
        </div>
        <div className="bloco">
          <label className="rotulo">Setor</label>
          <select className="campo" value={filtroSetor} onChange={(e) => setFiltroSetor(e.target.value)}>
            <option value="">Todos</option>
            {setores.map((item) => (
              <option key={item.id} value={item.id}>{item.nome} ({item.sigla})</option>
            ))}
          </select>
        </div>
        <div className="bloco">
          <label className="rotulo">Prioridade</label>
          <select className="campo" value={filtroPrioridade} onChange={(e) => setFiltroPrioridade(e.target.value)}>
            <option value="">Todas</option>
            {prioridades.map((item) => (
              <option key={item.id} value={item.nome}>{item.nome}</option>
            ))}
          </select>
        </div>
        <div className="bloco">
          <label className="rotulo">De</label>
          <input className="campo" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        </div>
        <div className="bloco">
          <label className="rotulo">Ate</label>
          <input className="campo" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        </div>
      </div>
      <div className="linha-acoes">
        <button type="button" className="botao botao--perigo" onClick={limparFiltros}>Limpar filtros</button>
      </div>
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
