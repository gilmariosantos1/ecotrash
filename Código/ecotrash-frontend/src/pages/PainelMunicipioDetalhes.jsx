import { useNavigate } from 'react-router-dom';

export default function PainelMunicipioDetalhes() {
  const navigate = useNavigate();

  return (
    <>
      <div className="slogan">LIXO seguro,<br/>PLANETA feliz!</div>
      <div className="panel-municipio">
        <h2>Painel Município</h2>
        <p><strong>Nome:</strong> José Maria Silva Santos</p>
        <p><strong>Endereço:</strong> Rua A, Bairro B, Nossa Senhora da Glória</p>
        <p><strong>Telefone:</strong> (79) 99999-9999</p>
        <p><strong>Email:</strong> josemaria@email.com</p>
        <p><strong>Data de registro:</strong> 20/06/2026</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' }}>
          <button className="btn btn-voltar" onClick={() => navigate(-1)}>Voltar</button>
          <button className="btn btn-aceitar" onClick={() => alert('Pedido Aceito!')}>Aceitar</button>
          <button className="btn btn-recusar" onClick={() => alert('Pedido Recusado!')}>Recusar</button>
        </div>
      </div>
    </>
  );
}