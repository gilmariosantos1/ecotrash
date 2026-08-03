import axios from 'axios';

/**
 * Instância central do axios usada por todos os serviços que falam
 * com o backend do EcoTrash (coletas, municípios, mensagens).
 *
 * A URL base vem de VITE_API_URL (definida em .env). Assim, para testar
 * em outro endereço (ex.: emulador Android, dispositivo físico na mesma
 * rede, ou produção), basta trocar o .env — sem tocar em nenhum service.
 */
const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
