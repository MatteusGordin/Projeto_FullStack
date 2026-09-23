import api from "./services/api";

export function temToken() {
  const token = localStorage.getItem("token");
  return token !== null && token !== "";
}

export function sair() {
  localStorage.removeItem("token");
}

export async function lerPerfil() {
  const resposta = await api.get("/auth/perfil");
  return resposta.data;
}

export function lerEmailToken() {
  try {
    const token = localStorage.getItem("token");
    if (token === null || token === "") {
      return "";
    }
    const partes = token.split(".");
    if (partes.length < 2) {
      return "";
    }
    const texto = JSON.parse(window.atob(partes[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (texto && texto.sub) {
      return String(texto.sub);
    }
    return "";
  } catch {
    return "";
  }
}
