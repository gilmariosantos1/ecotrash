import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StatusLogin() {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Envia o CPF preenchido para o ecrã seguinte
    navigate('/status/lista', { state: { cpfBusca: cpf } });
  };

  return (
    <div className="panel-status">
      <h2>Consultar Requerimento</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="cpf">Introduza o seu CPF:</label>
        <input type="text" id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="Apenas números" required />

        <div className="btn-group">
          <button type="button" className="btn btn-voltar" onClick={() => navigate(-1)}>Voltar</button>
          <button type="submit" className="btn btn-aceitar">Consultar</button>
        </div>
      </form>
    </div>
  );
}