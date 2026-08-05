import coletaService from '../services/coletaService';
import { FormColeta, Coleta } from '../types';

const ColetaController = {
  formatarData(dataIso: string): string {
    if (!dataIso) return 'Aguardando prefeitura';
    return dataIso.split('-').reverse().join('/');
  },

  /** Cria coleta, com foto opcional */
  async criarColeta(formData: FormColeta, foto?: File | null): Promise<void> {
    await coletaService.criar(formData, foto);
  },

  async buscarPorId(id: string | number): Promise<Coleta> {
    const response = await coletaService.buscarPorId(id);
    return response.data as Coleta;
  },

  async buscarPorCpf(cpf: string): Promise<Coleta[]> {
    const response = await coletaService.buscarPorCpf(cpf);
    return response.data as Coleta[];
  },

  async buscarPorMunicipio(estado: string, cidade: string): Promise<Coleta[]> {
    const response = await coletaService.buscarPorMunicipio(estado, cidade);
    return response.data as Coleta[];
  },

  async alterarStatus(id: string | number, novoStatus: string): Promise<void> {
    await coletaService.atualizar(id, novoStatus, 'Aguardando prefeitura');
  },

  async agendarColeta(id: string | number, dataIso: string): Promise<void> {
    if (!dataIso) throw new Error('Por favor, selecione uma data para a coleta.');
    const dataFormatada = this.formatarData(dataIso);
    await coletaService.atualizar(id, 'Agendado', dataFormatada);
  },

  /** Exclui um requerimento pelo ID */
  async excluirColeta(id: string | number): Promise<void> {
    await coletaService.excluir(id);
  },
};

export default ColetaController;
