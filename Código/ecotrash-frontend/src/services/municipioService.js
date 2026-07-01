import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/municipios';

const municipioService = {
  criar(dados) {
    return axios.post(BASE_URL, dados);
  },

  login(email, senha) {
    return axios.post(`${BASE_URL}/login`, { email, senha });
  },

  atualizarSenha(email, novaSenha) {
    return axios.put(`${BASE_URL}/senha`, { email, novaSenha });
  },

  recuperarSenha(email) {
    return axios.post(`${BASE_URL}/recuperar-senha`, { email });
  }
};

export default municipioService;
