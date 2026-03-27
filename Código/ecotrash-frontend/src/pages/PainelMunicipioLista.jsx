import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function PainelMunicipioLista() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pedidos, setPedidos] = useState([]);
  const [datasTemporarias, setDatasTemporarias] = useState({});

  // Abre a bagagem que veio do Login
  const cidadeLogada = location.state?.cidade;
  const estadoLogado = location.state?.estado;

  // Proteção: Se a pessoa tentar acessar o painel pelo link sem fazer login, manda ela voltar!
  useEffect(() => {
    if (!cidadeLogada || !estadoLogado) {
      alert("Acesso negado. Por favor, faça o login.");
      navigate('/municipio/login');
    }
  }, [cidadeLogada, estadoLogado, navigate]);

  const carregarPedidos = () => {
    if (cidadeLogada && estadoLogado) {
      // Busca SÓ os pedidos que batem com a cidade e estado logados
      axios.get(`http://localhost:5000/api/coletas/municipio/${estadoLogado}/${cidadeLogada}`)
        .then(response => setPedidos(response.data))
        .catch(() => alert("Erro ao carregar dados."));
    }
  };

  useEffect(() => {
    carregarPedidos();
  }, [cidadeLogada, estadoLogado]);

  const alterarStatus = async (id, novoStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/coletas/${id}`, { status: novoStatus, dataColeta: 'Aguardando prefeitura' });
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
      await axios.put(`http://localhost:5000/api/coletas/${id}`, { status: 'Agendado', dataColeta: dataFormatada });
      carregarPedidos();
    } catch (error) {
      alert("Erro ao agendar a coleta.");
    }
  };

  // Se não tiver logado ainda, não mostra a tela para não dar erro
  if (!cidadeLogada) return null; 

  return (
    <>
      <div className="slogan">LIXO seguro,<br/>PLANETA feliz!</div>
      <div className="panel-table-container">
        {/* Mostra o nome da cidade no título para confirmar! */}
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