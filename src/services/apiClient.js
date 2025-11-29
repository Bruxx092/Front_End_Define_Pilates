// @ts-nocheck
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      // localStorage.removeItem("user");
      window.location.href = "/login";
    }

    if (error.response?.status === 403) {
      console.error("Acesso negado");
    }

    if (error.response?.status === 500) {
      console.error("Erro no servidor");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
