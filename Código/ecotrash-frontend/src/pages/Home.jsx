import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <div className="slogan">
        LIXO seguro,<br />PLANETA feliz!
      </div>
      <div className="panel">
        <h2>Painel de Controle</h2>
        <div className="options">
          <Link to="/municipio/login" className="panel-btn">Painel Município</Link>
          <Link to="/municipio/cadastro" className="panel-btn">Cadastrar Município</Link>
          <Link to="/cadastro" className="panel-btn">Solicitar coleta</Link>
          <Link to="/status/login" className="panel-btn">Status requerimento</Link>
        </div>
      </div>
    </>
  );
}