import api from './api';
import { FormMunicipio } from '../types';

const municipioService = {
  criar(dados: FormMunicipio) {
    return api.post('/api/municipios', dados);
  },

  login(email: string, senha: string) {
    return api.post('/api/municipios/login', { email, senha });
  },

  atualizarSenha(email: string, novaSenha: string) {
    return api.put('/api/municipios/senha', { email, novaSenha });
  },

  recuperarSenha(email: string) {
    return api.post('/api/municipios/recuperar-senha', { email });
  },
};

export default municipioService;
