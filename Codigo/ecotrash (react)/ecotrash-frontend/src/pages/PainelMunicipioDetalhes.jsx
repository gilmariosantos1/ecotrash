import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ColetaController from '../controllers/ColetaController';

export default function PainelMunicipioDetalhes() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const sessao = location.state;

  const [pedido, setPedido] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    ColetaController.buscarPorId(id)
      .then(setPedido)
      .catch(() => alert('Erro ao carregar o requerimento.'))
      .finally(() => setCarregando(false));
  }, [id]);

  const aceitar = async () => {
    try {
      await ColetaController.alterarStatus(id, 'Aguardando Data');
      alert('Pedido aceito! Acesse a lista para agendar a data de coleta.');
      navigate('/municipio/lista', { state: sessao });
    } catch {
      alert('Erro ao atualizar o pedido.');
    }
  };

  const recusar = async () => {
    if (!window.confirm('Tem certeza que deseja recusar este pedido?')) return;
    try {
      await ColetaController.alterarStatus(id, 'Recusado');
      alert('Pedido recusado.');
      navigate('/municipio/lista', { state: sessao });
    } catch {
      alert('Erro ao atualizar o pedido.');
    }
  };

  if (carregando) {
    return (
      <>
        <div className="slogan">LIXO seguro,<br/>PLANETA feliz!</div>
        <div className="panel-municipio"><p>Carregando...</p></div>
      </>
    );
  }

  if (!pedido) {
    return (
      <>
        <div className="slogan">LIXO seguro,<br/>PLANETA feliz!</div>
        <div className="panel-municipio">
          <p>Requerimento não encontrado.</p>
          <button className="btn btn-voltar" onClick={() => navigate(-1)}>Voltar</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="slogan">LIXO seguro,<br/>PLANETA feliz!</div>
      <div className="panel-municipio">
        <h2>Detalhes do Requerimento</h2>
        <p><strong>Nome:</strong> {pedido.nome}</p>
        <p><strong>CPF:</strong> {pedido.cpf}</p>
        <p><strong>Telefone:</strong> {pedido.telefone}</p>
        <p><strong>Email:</strong> {pedido.email}</p>
        <p><strong>Endereço:</strong> {pedido.rua}, {pedido.bairro}, {pedido.cidade}/{pedido.estado}</p>
        <p><strong>Tipo de Lixo:</strong> {pedido.tipoLixo}</p>
        <p><strong>Status atual:</strong> {pedido.status}</p>
        <p><strong>Data de registro:</strong> {pedido.dataRequisicao}</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' }}>
          <button className="btn btn-voltar" onClick={() => navigate(-1)}>Voltar</button>
          {pedido.status === 'Em análise' && (
            <>
              <button className="btn btn-aceitar" onClick={aceitar}>Aceitar</button>
              <button className="btn btn-recusar" onClick={recusar}>Recusar</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
