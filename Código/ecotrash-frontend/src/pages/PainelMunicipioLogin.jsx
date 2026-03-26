import { useNavigate } from 'react-router-dom';

export default function PainelMunicipioLogin() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/municipio/lista');
  };

  return (
    <>
      <div className="slogan">LIXO seguro,<br/>PLANETA feliz!</div>
      <div className="panel-municipio">
        <h2>Login Município</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label htmlFor="email" style={{ textAlign: 'left' }}>E-mail:</label>
          <input type="email" id="email" placeholder="Digite o e-mail oficial" required />

          <label htmlFor="senha" style={{ textAlign: 'left' }}>Senha:</label>
          <input type="password" id="senha" placeholder="Digite sua senha" required />

          <div className="btn-group">
            <button type="button" className="btn btn-voltar" onClick={() => navigate(-1)}>Voltar</button>
            <button type="submit" className="btn btn-aceitar">Entrar</button>
          </div>
        </form>
      </div>
    </>
  );
}