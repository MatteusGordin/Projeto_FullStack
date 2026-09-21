import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function VerChamado() {
  const { id } = useParams();
  const [chamado, setChamado] = useState(null);

  useEffect(() => {
    api.get("/chamados/" + id).then((resposta) => {
      setChamado(resposta.data);
    });
  }, [id]);

  function fechar() {
    const dados = {
      titulo: chamado.titulo,
      descricao: chamado.descricao,
      status: "FECHADO",
      prioridade: chamado.prioridade,
      dataFechamento: chamado.dataFechamento,
      idSolicitante: chamado.idSolicitante,
      idTecnico: chamado.idTecnico,
      idEquipamento: chamado.idEquipamento
    };
    api.put("/chamados/" + id, dados).then((resposta) => {
      setChamado(resposta.data);
    });
  }

  if (!chamado) {
    return <p>Carregando</p>;
  }

  return (
    <div>
      <h2>Ver Chamado</h2>
      <p>Titulo: {chamado.titulo}</p>
      <p>Descricao: {chamado.descricao}</p>
      <p>Status: {chamado.status}</p>
      <p>Prioridade: {chamado.prioridade}</p>
      <button onClick={fechar}>Fechar Chamado</button>
    </div>
  );
}

export default VerChamado;
