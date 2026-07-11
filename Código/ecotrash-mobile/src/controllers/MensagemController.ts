import mensagemService from '../services/mensagemService';
import { FormMensagem } from '../types';

const MensagemController = {
  async enviar(formData: FormMensagem): Promise<void> {
    await mensagemService.criar(formData);
  },
};

export default MensagemController;
