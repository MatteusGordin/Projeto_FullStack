import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="login-pagina">
      <div className="cartao cartao--sm texto-centro">
        <h2 className="titulo-pagina">Pagina nao encontrada</h2>
        <p className="texto-suave">O endereco acessado nao existe.</p>
        <Link to="/" className="elo-voltar">Voltar para a lista</Link>
      </div>
    </div>
  );
}

export default NotFound;
