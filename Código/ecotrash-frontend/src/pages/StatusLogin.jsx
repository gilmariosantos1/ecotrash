import { useNavigate } from 'react-router-dom';

export default function StatusLogin() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/status/lista');
  };

  return (
    <div className="panel-status">
      <h2>Status de Requerimento</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" placeholder="Digite seu email" required />

        <label htmlFor="cpf">CPF:</label>
        <input type="text" id="cpf" placeholder="Digite seu CPF" required />

        <div className="btn-group">
          <button type="button" className="btn btn-voltar" onClick={() => navigate(-1)}>Voltar</button>
          <button type="submit" className="btn btn-aceitar">Enviar</button>
        </div>
      </form>
    </div>
  );
}