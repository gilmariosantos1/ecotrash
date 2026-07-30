import { Link } from 'react-router-dom';

export default function Confirmacao() {
  return (
    <>
      <div className="slogan">
        LIXO seguro,<br/>PLANETA feliz!
      </div>
      
      <div className="panel-municipio">
        <div className="icon">✅</div>
        <p>Os seus dados foram enviados com sucesso</p>
        <p>Verifique o status do requerimento no painel de controle</p>
        <br />
        <Link to="/" className="btn btn-aceitar">Ok</Link>
      </div>
    </>
  );
}