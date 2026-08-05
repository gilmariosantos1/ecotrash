import api from './api';
import { FormColeta } from '../types';

const coletaService = {
  /**
   * Cria uma coleta. Aceita foto opcional (File).
   * Quando há foto, envia como multipart/form-data.
   * Sem foto, envia como JSON normal.
   */
  criar(dados: FormColeta, foto?: File | null) {
    if (foto) {
      const fd = new FormData();
      Object.entries(dados).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, String(v));
      });
      fd.append('foto', foto);
      return api.post('/api/coletas', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
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

  excluir(id: string | number) {
    return api.delete(`/api/coletas/${id}`);
  },
};

export default coletaService;
