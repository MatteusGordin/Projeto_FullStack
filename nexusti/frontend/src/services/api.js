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

export default api;
