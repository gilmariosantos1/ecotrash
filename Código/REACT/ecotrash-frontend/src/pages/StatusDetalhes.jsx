import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ColetaController from '../controllers/ColetaController';

export default function StatusDetalhes() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    ColetaController.buscarPorId(id)
      .then(setPedido)
      .catch(() => alert('Erro ao carregar o requerimento.'))
      .finally(() => setCarregando(false));
  }, [id]);

  if (carregando) {
    return <div className="panel-status"><p>Carregando...</p></div>;
  }

  if (!pedido) {
    return (
      <div className="panel-status">
        <p>Requerimento não encontrado.</p>
        <button className="btn btn-voltar" onClick={() => navigate(-1)}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="panel-status">
      <h2>Detalhes do Requerimento</h2>
      <p><strong>Nome:</strong> {pedido.nome}</p>
      <p><strong>Endereço:</strong> {pedido.rua}, {pedido.bairro}, {pedido.cidade}/{pedido.estado}</p>
      <p><strong>Tipo de Lixo:</strong> {pedido.tipoLixo}</p>
      <p><strong>Status:</strong> {pedido.status}</p>
      <p><strong>Data de requisição:</strong> {pedido.dataRequisicao}</p>
      <p><strong>Data prevista de coleta:</strong> {pedido.dataColeta}</p>
      <button className="btn btn-voltar" onClick={() => navigate(-1)}>Voltar</button>
    </div>
  );
}
