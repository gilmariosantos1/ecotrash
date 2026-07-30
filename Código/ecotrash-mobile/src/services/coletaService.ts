import api from './api';
import { FormColeta } from '../types';

const coletaService = {
  criar(dados: FormColeta) {
    return api.post('/api/coletas', dados);
  },

  buscarPorId(id: string | number) {
    return api.get(`/api/coletas/${id}`);
  },

  buscarPorCpf(cpf: string) {
    return api.get(`/api/coletas/cidadao/${cpf}`);
  },

  buscarPorMunicipio(estado: string, cidade: string) {
    return api.get(`/api/coletas/municipio/${estado}/${cidade}`);
  },

  atualizar(id: string | number, status: string, dataColeta: string) {
    return api.put(`/api/coletas/${id}`, { status, dataColeta });
  },
};

export default coletaService;
