import { useNavigate } from 'react-router-dom';

export default function StatusDetalhes() {
  const navigate = useNavigate();

  return (
    <div className="panel-status">
      <h2>Status de Requerimento</h2>
      <p><strong>Endereço:</strong> Rua A, Bairro B, Nossa Senhora da Glória</p>
      <p><strong>Status:</strong> Em análise</p>
      <p><strong>Data de requisição:</strong> 04/07/2026</p>

      <button className="btn btn-voltar" onClick={() => navigate(-1)}>Voltar</button>
    </div>
  );
}