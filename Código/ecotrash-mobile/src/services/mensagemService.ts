import api from './api';
import { FormMensagem } from '../types';

const mensagemService = {
  criar(dados: FormMensagem) {
    return api.post('/api/mensagens', dados);
  },
};

export default mensagemService;
