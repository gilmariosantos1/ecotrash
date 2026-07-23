import municipioService from '../services/municipioService';
import { FormMunicipio, SessaoMunicipio } from '../types';

const MunicipioController = {
  async cadastrar(formData: FormMunicipio): Promise<void> {
    await municipioService.criar(formData);
  },

  async login(email: string, senha: string): Promise<SessaoMunicipio> {
    const response = await municipioService.login(email, senha);
    return {
      cidade: response.data.cidade as string,
      estado: response.data.estado as string,
    };
  },

  async recuperarSenha(email: string): Promise<string> {
    const response = await municipioService.recuperarSenha(email);
    return response.data.mensagem as string;
  },

  async atualizarSenha(email: string, novaSenha: string): Promise<void> {
    await municipioService.atualizarSenha(email, novaSenha);
  },
};

export default MunicipioController;
