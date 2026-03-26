import { Link, useNavigate } from 'react-router-dom';

export default function PainelMunicipioLista() {
  const navigate = useNavigate();

  return (
    <>
      <div className="slogan">LIXO seguro,<br/>PLANETA feliz!</div>
      <div className="panel-municipio">
        <h2>Painel Município</h2>
        <p><strong>Requisições enviadas:</strong></p>
        <p>Rua A, Bairro B, Nossa Senhora da Glória - 20/06/2026</p>
        
        <div className="btn-group">
          <button className="btn btn-voltar" onClick={() => navigate(-1)}>Voltar</button>
          <Link to="/municipio/detalhes/1" className="btn btn-aceitar">Ver mais</Link>
        </div>
      </div>
    </>
  );
}