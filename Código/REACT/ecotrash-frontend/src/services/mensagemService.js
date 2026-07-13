import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/mensagens';

const mensagemService = {
  criar(dados) {
    return axios.post(BASE_URL, dados);
  }
};

export default mensagemService;
