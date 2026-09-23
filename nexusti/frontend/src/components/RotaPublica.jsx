import { Navigate } from "react-router-dom";
import { temToken } from "../auth";

function RotaPublica({ elemento }) {
  if (temToken() === true) {
    return <Navigate to="/" replace />;
  }
  return elemento;
}

export default RotaPublica;
