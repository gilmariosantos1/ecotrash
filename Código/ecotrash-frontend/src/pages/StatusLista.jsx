import { Link, useNavigate } from 'react-router-dom';

export default function StatusLista() {
  const navigate = useNavigate();

  return (
    <div className="panel-status">
      <h2>Status de Requerimento</h2>
      <p><strong>Seus requerimentos:</strong></p>
      <ul className="lista-requerimentos">
        <li><Link to="/status/detalhes/1">Rua A, Bairro B, Nossa Senhora da Glória</Link></li>
      </ul>
      <button className="btn btn-voltar" onClick={() => navigate(-1)}>Voltar</button>
    </div>
  );
}