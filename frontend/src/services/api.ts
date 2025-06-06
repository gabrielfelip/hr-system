import axios from 'axios';

// Cria uma instância do Axios com a URL base da sua API backend
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Aponte para a URL do seu backend
});

// Adiciona um interceptor de requisições para incluir o token JWT em cada chamada
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Obtém o token do localStorage
    if (token) {
      // Se o token existe, adiciona-o ao cabeçalho 'Authorization'
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Retorna a configuração da requisição modificada
  },
  (error) => {
    // Lida com erros de requisição
    return Promise.reject(error);
  }
);

export default api;
