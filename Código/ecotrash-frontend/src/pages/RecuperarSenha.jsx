import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RecuperarSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    try {
      // Chama a nossa rota nova
      const response = await axios.post('http://localhost:5000/api/municipios/recuperar-senha', { email });
      alert(response.data.mensagem); 
      navigate('/municipio/login'); // Volta pro login para usar a senha nova
    } catch (error) {
      alert(error.response?.data?.erro || "Erro ao tentar recuperar a senha.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <div className="slogan">LIXO seguro,<br/>PLANETA feliz!</div>
      <div className="panel-municipio">
        <h2>Recuperar Senha</h2>
        <p style={{ marginBottom: '20px', fontSize: '14px', color: '#555' }}>
          Digite o e-mail oficial cadastrado. Enviaremos uma nova senha de acesso para você.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label htmlFor="email" style={{ textAlign: 'left', display: 'block' }}>E-mail Oficial:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="exemplo@cidade.se.gov.br" required style={{ width: '100%', boxSizing: 'border-box' }}/>
          </div>

          <div className="btn-group" style={{ marginTop: '10px' }}>
            <button type="button" className="btn btn-voltar" onClick={() => navigate(-1)} disabled={carregando}>Voltar</button>
            <button type="submit" className="btn btn-aceitar" disabled={carregando}>
              {carregando ? 'Enviando...' : 'Receber Nova Senha'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}