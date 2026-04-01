import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/coletas';

const coletaService = {
  criar(dados) {
    return axios.post(BASE_URL, dados);
  },

  buscarPorCpf(cpf) {
    return axios.get(`${BASE_URL}/cidadao/${cpf}`);
  },

  buscarPorMunicipio(estado, cidade) {
    return axios.get(`${BASE_URL}/municipio/${estado}/${cidade}`);
  },

  atualizar(id, status, dataColeta) {
    return axios.put(`${BASE_URL}/${id}`, { status, dataColeta });
  }
};

export default coletaService;
