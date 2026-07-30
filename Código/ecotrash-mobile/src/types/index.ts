/* ============================================
   EcoTrash - Interfaces TypeScript
   ============================================ */

/** Representa uma solicitação de coleta */
export interface Coleta {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  tipoLixo: string;
  status: StatusColeta;
  dataRequisicao: string;
  dataColeta: string;
}

/** Status possíveis de uma coleta */
export type StatusColeta =
  | 'Em análise'
  | 'Aguardando Data'
  | 'Agendado'
  | 'Recusado'
  | 'Coletado';

/** Dados do formulário de solicitação de coleta */
export interface FormColeta {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  tipoLixo: string;
}

/** Dados do formulário de cadastro de município */
export interface FormMunicipio {
  emailOficial: string;
  senha: string;
  telefone: string;
  estado: string;
  cidade: string;
}

/** Dados do formulário de mensagem/contato */
export interface FormMensagem {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}

/** Sessão do município logado */
export interface SessaoMunicipio {
  cidade: string;
  estado: string;
}

/** Estado (UF) da API do IBGE */
export interface Estado {
  sigla: string;
  nome: string;
}

/** Município da API do IBGE */
export interface Cidade {
  id: number;
  nome: string;
}

/** State passado via navegação para PainelMunicipioLista */
export interface PainelMunicipioState {
  cidade: string;
  estado: string;
}

/** State passado via navegação para StatusLista */
export interface StatusListaState {
  cpfBusca: string;
}
