import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ListarChamados() {
  const [chamados, setChamados] = useState([]);

  useEffect(() => {
    api.get("/chamados").then((resposta) => {
      setChamados(resposta.data);
    });
  }, []);

  return (
    <div>
      <h2>Lista de Chamados</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Titulo</th>
            <th>Status</th>
            <th>Ver</th>
          </tr>
        </thead>
        <tbody>
          {chamados.map((item) => (
            <tr key={item.id}>
              <td>{item.titulo}</td>
              <td>{item.status}</td>
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

export default ListarChamados;
