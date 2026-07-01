import axios from 'axios';

const BASE_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades';

const ibgeService = {
  buscarEstados() {
    return axios.get(`${BASE_URL}/estados?orderBy=nome`);
  },

  buscarMunicipiosPorUF(uf) {
    return axios.get(`${BASE_URL}/estados/${uf}/municipios`);
  }
};

export default ibgeService;
