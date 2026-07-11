import axios from 'axios';
import { FormMensagem } from '../types';

const BASE_URL = 'http://localhost:5000/api/mensagens';

const mensagemService = {
  criar(dados: FormMensagem) {
    return axios.post(BASE_URL, dados);
  },
};

export default mensagemService;
