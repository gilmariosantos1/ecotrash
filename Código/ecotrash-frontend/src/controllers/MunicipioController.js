import municipioService from '../services/municipioService';

/**
 * MunicipioController
 * Camada de controle responsável por orquestrar a lógica de negócio
 * relacionada aos municípios: cadastro, autenticação e gestão de senhas.
 */
const MunicipioController = {
  /**
   * Cadastra um novo município no sistema.
   */
  async cadastrar(formData) {
    return municipioService.criar(formData);
  },

  /**
   * Realiza o login do município e retorna os dados da sessão.
   * Lança erro com mensagem tratada se as credenciais forem inválidas.
   */
  async login(email, senha) {
    const response = await municipioService.login(email, senha);
    return { cidade: response.data.cidade, estado: response.data.estado };
  },

  /**
   * Solicita a recuperação de senha via e-mail.
   */
  async recuperarSenha(email) {
    const response = await municipioService.recuperarSenha(email);
    return response.data.mensagem;
  },

  /**
   * Atualiza a senha do município.
   */
  async atualizarSenha(email, novaSenha) {
    return municipioService.atualizarSenha(email, novaSenha);
  }
};

export default MunicipioController;
