/* ============================================
   EcoTrash - Interfaces TypeScript
   ============================================ */

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
  latitude?: number;
  longitude?: number;
}

export type StatusColeta =
  | 'Em análise'
  | 'Aguardando Data'
  | 'Agendado'
  | 'Recusado'
  | 'Coletado';

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
  latitude?: number;   // coordenada do mapa (opcional)
  longitude?: number;  // coordenada do mapa (opcional)
}

export interface FormMunicipio {
  emailOficial: string;
  senha: string;
  telefone: string;
  estado: string;
  cidade: string;
  codigoAdmin: string; // código secreto exigido para cadastro
}

export interface FormMensagem {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
}

export interface SessaoMunicipio {
  cidade: string;
  estado: string;
}

export interface Estado {
  sigla: string;
  nome: string;
}

export interface Cidade {
  id: number;
  nome: string;
}

export interface PainelMunicipioState {
  cidade: string;
  estado: string;
}

export interface StatusListaState {
  cpfBusca: string;
}
