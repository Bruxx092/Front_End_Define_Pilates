import axios from "axios";

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && [401, 403].includes(error.response.status)) {
            console.error('Sessão expirada ou não autorizada. Redirecionando para o login em 3 segundos...');
            localStorage.removeItem('accessToken');
            
            if (window.location.pathname !== '/login') {
                setTimeout(() => {
                    window.location.href = '/login'; 
                }, 8000); 
            }
        }
        // O erro ainda é repassado para o componente
        return Promise.reject(error); 
    }
);

export default api;