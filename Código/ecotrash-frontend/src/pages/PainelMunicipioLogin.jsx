import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PainelMunicipioLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/municipios/login', { email, senha });
      alert(response.data.mensagem);
      
      // A MÁGICA: Manda a cidade e o estado "escondidos" na bagagem para a próxima página!
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

          <div className="btn-group">
            <button type="button" className="btn btn-voltar" onClick={() => navigate(-1)}>Voltar</button>
            <button type="submit" className="btn btn-aceitar">Entrar</button>
          </div>
        </form>
      </div>
    </>
  );
}