import ibgeService from '../services/ibgeService';

/**
 * LocalidadeController
 * Orquestra o carregamento de estados e municípios via IBGE.
 * Centraliza esta lógica que estava duplicada em Cadastro e CadastroMunicipio.
 */
const LocalidadeController = {
  /**
   * Busca a lista de estados brasileiros ordenada por nome.
   */
  async carregarEstados() {
    const response = await ibgeService.buscarEstados();
    return response.data;
  },

  /**
   * Busca os municípios de uma UF específica.
   */
  async carregarMunicipios(uf) {
    if (!uf) return [];
    const response = await ibgeService.buscarMunicipiosPorUF(uf);
    return response.data;
  }
};

export default LocalidadeController;
