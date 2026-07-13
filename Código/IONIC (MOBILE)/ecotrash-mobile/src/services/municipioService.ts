import axios from 'axios';
import { FormMunicipio } from '../types';

const BASE_URL = 'http://localhost:5000/api/municipios';

const municipioService = {
  criar(dados: FormMunicipio) {
    return axios.post(BASE_URL, dados);
  },

  login(email: string, senha: string) {
    return axios.post(`${BASE_URL}/login`, { email, senha });
  },

  atualizarSenha(email: string, novaSenha: string) {
    return axios.put(`${BASE_URL}/senha`, { email, novaSenha });
  },

  recuperarSenha(email: string) {
    return axios.post(`${BASE_URL}/recuperar-senha`, { email });
  },
};

export default municipioService;
