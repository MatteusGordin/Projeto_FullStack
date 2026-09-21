import { useState } from "react";
import api from "../services/api";

function AbrirChamado() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [mensagem, setMensagem] = useState("");

  function salvar(e) {
    e.preventDefault();
    const dados = {
      titulo: titulo,
      descricao: descricao,
      prioridade: "MEDIA",
      idSolicitante: 1,
      idEquipamento: 1
    };
    api.post("/chamados", dados).then(() => {
      setMensagem("Chamado salvo");
      setTitulo("");
      setDescricao("");
    });
  }

  return (
    <div>
      <h2>Abrir Chamado</h2>
      <form onSubmit={salvar}>
        <div>
          <label>Titulo</label>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </div>
        <div>
          <label>Descricao</label>
          <input value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        </div>
        <button type="submit">Salvar</button>
      </form>
      <p>{mensagem}</p>
    </div>
  );
}

export default AbrirChamado;
