import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((configuracao) => {
  const token = localStorage.getItem("token");
  if (token !== null && token !== "") {
    configuracao.headers.Authorization = "Bearer " + token;
  }
  return configuracao;
});

api.interceptors.response.use(
  (resposta) => resposta,
  (falha) => {
    const status = falha && falha.response ? falha.response.status : 0;
    const url = falha && falha.config && falha.config.url ? String(falha.config.url) : "";
    const rotaPublica = url.indexOf("/auth/login") !== -1 || url.indexOf("/auth/bootstrap") !== -1;
    const token = localStorage.getItem("token");
    const logado = token !== null && token !== "";
    if (status === 401 && rotaPublica === false && logado === true) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(falha);
  }
);

export default api;
