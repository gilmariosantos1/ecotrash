import ibgeService from '../services/ibgeService';
import { Estado, Cidade } from '../types';

const LocalidadeController = {
  async carregarEstados(): Promise<Estado[]> {
    const response = await ibgeService.buscarEstados();
    return response.data as Estado[];
  },

  async carregarMunicipios(uf: string): Promise<Cidade[]> {
    if (!uf) return [];
    const response = await ibgeService.buscarMunicipiosPorUF(uf);
    return response.data as Cidade[];
  },
};

export default LocalidadeController;
