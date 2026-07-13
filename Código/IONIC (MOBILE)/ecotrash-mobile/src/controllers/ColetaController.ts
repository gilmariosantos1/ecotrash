import coletaService from '../services/coletaService';
import { FormColeta, Coleta } from '../types';

/**
 * ColetaController
 * Camada de controle — orquestra a lógica de negócio das coletas.
 * As páginas (views) não devem conter esta lógica diretamente.
 */
const ColetaController = {
  /**
   * Formata uma string de data no formato ISO (YYYY-MM-DD)
   * para o formato brasileiro (DD/MM/YYYY).
   */
  formatarData(dataIso: string): string {
    if (!dataIso) return 'Aguardando prefeitura';
    return dataIso.split('-').reverse().join('/');
  },

  /**
   * Envia uma nova solicitação de coleta para a API.
   */
  async criarColeta(formData: FormColeta): Promise<void> {
    await coletaService.criar(formData);
  },

  /**
   * Busca um único requerimento pelo ID.
   */
  async buscarPorId(id: string | number): Promise<Coleta> {
    const response = await coletaService.buscarPorId(id);
    return response.data as Coleta;
  },

  /**
   * Busca todas as coletas de um cidadão pelo CPF.
   */
  async buscarPorCpf(cpf: string): Promise<Coleta[]> {
    const response = await coletaService.buscarPorCpf(cpf);
    return response.data as Coleta[];
  },

  /**
   * Busca todas as coletas de um município.
   */
  async buscarPorMunicipio(estado: string, cidade: string): Promise<Coleta[]> {
    const response = await coletaService.buscarPorMunicipio(estado, cidade);
    return response.data as Coleta[];
  },

  /**
   * Altera o status de um pedido (aceitar / recusar).
   */
  async alterarStatus(id: string | number, novoStatus: string): Promise<void> {
    await coletaService.atualizar(id, novoStatus, 'Aguardando prefeitura');
  },

  /**
   * Agenda uma coleta para uma data específica.
   */
  async agendarColeta(id: string | number, dataIso: string): Promise<void> {
    if (!dataIso) {
      throw new Error('Por favor, selecione uma data para a coleta.');
    }
    const dataFormatada = this.formatarData(dataIso);
    await coletaService.atualizar(id, 'Agendado', dataFormatada);
  },
};

export default ColetaController;
