import axios from 'axios';
import { FormColeta } from '../types';

const BASE_URL = 'http://localhost:5000/api/coletas';

const coletaService = {
  criar(dados: FormColeta) {
    return axios.post(BASE_URL, dados);
  },

  buscarPorId(id: string | number) {
    return axios.get(`${BASE_URL}/${id}`);
  },

  buscarPorCpf(cpf: string) {
    return axios.get(`${BASE_URL}/cidadao/${cpf}`);
  },

  buscarPorMunicipio(estado: string, cidade: string) {
    return axios.get(`${BASE_URL}/municipio/${estado}/${cidade}`);
  },

  atualizar(id: string | number, status: string, dataColeta: string) {
    return axios.put(`${BASE_URL}/${id}`, { status, dataColeta });
  },
};

export default coletaService;
