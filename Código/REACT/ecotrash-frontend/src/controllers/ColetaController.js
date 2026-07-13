import coletaService from '../services/coletaService';

/**
 * ColetaController
 * Camada de controle responsável por orquestrar a lógica de negócio
 * relacionada às coletas. As Views (pages) não devem conter esta lógica.
 */
const ColetaController = {
  /**
   * Formata uma string de data no formato ISO (YYYY-MM-DD)
   * para o formato brasileiro (DD/MM/YYYY).
   */
  formatarData(dataIso) {
    if (!dataIso) return 'Aguardando prefeitura';
    return dataIso.split('-').reverse().join('/');
  },

  /**
   * Envia uma nova solicitação de coleta para a API.
   * Retorna a resposta para que a View possa reagir (ex: redirecionar).
   */
  async criarColeta(formData) {
    return coletaService.criar(formData);
  },

  /**
   * Busca um único requerimento pelo seu ID.
   */
  async buscarPorId(id) {
    const response = await coletaService.buscarPorId(id);
    return response.data;
  },

  /**
   * Busca todas as coletas associadas a um CPF.
   */
  async buscarPorCpf(cpf) {
    const response = await coletaService.buscarPorCpf(cpf);
    return response.data;
  },

  /**
   * Busca todas as coletas de um município específico.
   */
  async buscarPorMunicipio(estado, cidade) {
    const response = await coletaService.buscarPorMunicipio(estado, cidade);
    return response.data;
  },

  /**
   * Altera o status de um pedido sem agendar data.
   * Usado para aceitar ou recusar na análise inicial.
   */
  async alterarStatus(id, novoStatus) {
    return coletaService.atualizar(id, novoStatus, 'Aguardando prefeitura');
  },

  /**
   * Agenda uma coleta para uma data específica.
   * Recebe a data no formato ISO e formata antes de enviar.
   */
  async agendarColeta(id, dataIso) {
    if (!dataIso) {
      throw new Error('Por favor, selecione uma data para a coleta.');
    }
    const dataFormatada = this.formatarData(dataIso);
    return coletaService.atualizar(id, 'Agendado', dataFormatada);
  }
};

export default ColetaController;
