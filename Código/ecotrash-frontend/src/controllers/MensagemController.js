import mensagemService from '../services/mensagemService';

/**
 * MensagemController
 * Camada de controle responsável pelo envio de mensagens de contato.
 */
const MensagemController = {
  /**
   * Envia uma mensagem de contato para a API.
   */
  async enviar(formData) {
    return mensagemService.criar(formData);
  }
};

export default MensagemController;
