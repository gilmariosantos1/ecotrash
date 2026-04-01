import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import coletaService from '../services/coletaService';

export default function PainelMunicipioLista() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pedidos, setPedidos] = useState([]);
  const [datasTemporarias, setDatasTemporarias] = useState({});

  const cidadeLogada = location.state?.cidade;
  const estadoLogado = location.state?.estado;

  useEffect(() => {
    if (!cidadeLogada || !estadoLogado) {
      alert("Acesso negado. Por favor, faça o login.");
      navigate('/municipio/login');
    }
  }, [cidadeLogada, estadoLogado, navigate]);

  const carregarPedidos = () => {
    if (cidadeLogada && estadoLogado) {
      coletaService.buscarPorMunicipio(estadoLogado, cidadeLogada)
        .then(response => setPedidos(response.data))
        .catch(() => alert("Erro ao carregar dados."));
    }
  };

  useEffect(() => {
    carregarPedidos();
  }, [cidadeLogada, estadoLogado]);

  const alterarStatus = async (id, novoStatus) => {
    try {
      await coletaService.atualizar(id, novoStatus, 'Aguardando prefeitura');
      carregarPedidos();
    } catch (error) {
      alert("Erro ao atualizar o pedido.");
    }
  };

  const confirmarData = async (id) => {
    const dataEscolhida = datasTemporarias[id];
    if (!dataEscolhida) {
      alert("Por favor, selecione uma data para a coleta.");
      return;
    }
    try {
      const dataFormatada = dataEscolhida.split('-').reverse().join('/');
      await coletaService.atualizar(id, 'Agendado', dataFormatada);
      carregarPedidos();
    } catch (error) {
      alert("Erro ao agendar a coleta.");
    }
  };

  if (!cidadeLogada) return null;

  return (
    <>
      <div className="slogan">LIXO seguro,<br/>PLANETA feliz!</div>
      <div className="panel-table-container">
        <h2>Gestão de Requerimentos - {cidadeLogada}/{estadoLogado}</h2>
        
        {pedidos.length === 0 ? (
          <p style={{ marginTop: '20px' }}>Nenhum requerimento recebido para a sua cidade até o momento.</p>
        ) : (
          <div className="table-responsive">
            <table className="tabela-pedidos">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Endereço</th>
                  <th>Telefone</th>
                  <th>Email</th>
                  <th>Tipo de Lixo</th>
                  <th>Data Registo</th>
                  <th>Situação / Ação</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>{pedido.nome}</td>
                    <td>{pedido.rua}, {pedido.bairro}</td>
                    <td>{pedido.telefone}</td>
                    <td>{pedido.email}</td>
                    <td><span className="badge-lixo">{pedido.tipoLixo}</span></td>
                    <td>{pedido.dataRequisicao}</td>
                    <td className="acao-celula">
                      
                      {pedido.status === 'Em análise' && (
                        <div className="botoes-acao">
                          <button className="btn-aceitar-sm" onClick={() => alterarStatus(pedido.id, 'Aguardando Data')}>Aceitar</button>
                          <button className="btn-recusar-sm" onClick={() => alterarStatus(pedido.id, 'Recusado')}>Recusar</button>
                        </div>
                      )}

                      {pedido.status === 'Aguardando Data' && (
                        <div className="data-agendamento">
                          <input type="date" onChange={(e) => setDatasTemporarias({ ...datasTemporarias, [pedido.id]: e.target.value })} />
                          <button className="btn-confirmar-sm" onClick={() => confirmarData(pedido.id)}>Confirmar</button>
                        </div>
                      )}

                      {pedido.status === 'Agendado' && (
                        <span className="status-agendado">📅 Agendado: {pedido.dataColeta}</span>
                      )}

                      {pedido.status === 'Recusado' && (
                        <span className="status-recusado">❌ Recusado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button className="btn btn-voltar" onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>Sair</button>
      </div>
    </>
  );
}
