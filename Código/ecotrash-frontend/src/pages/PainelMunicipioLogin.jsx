import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function PainelMunicipioLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/municipios/login', { email, senha });
      navigate('/municipio/lista', { 
        state: { cidade: response.data.cidade, estado: response.data.estado } 
      });
    } catch (error) {
      alert(error.response?.data?.erro || "Erro ao conectar com o servidor.");
    }
  };

  return (
    <>
      <div className="slogan">LIXO seguro,<br/>PLANETA feliz!</div>
      <div className="panel-municipio">
        <h2>Login Município</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label htmlFor="email" style={{ textAlign: 'left' }}>E-mail Oficial:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="exemplo@cidade.se.gov.br" required />

          <label htmlFor="senha" style={{ textAlign: 'left' }}>Senha:</label>
          <input type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Digite sua senha" required />

          {/* 👇 OLHA O LINK DE ESQUECI A SENHA AQUI 👇 */}
          <div style={{ textAlign: 'right', marginTop: '-5px' }}>
            <Link to="/municipio/recuperar-senha" style={{ fontSize: '14px', color: '#2e7d32', textDecoration: 'none', fontWeight: 'bold' }}>
              Esqueci minha senha
            </Link>
          </div>

          <div className="btn-group" style={{ marginTop: '10px' }}>
            <button type="button" className="btn btn-voltar" onClick={() => navigate('/')}>Voltar</button>
            <button type="submit" className="btn btn-aceitar">Entrar</button>
          </div>
        </form>
      </div>
    </>
  );
}