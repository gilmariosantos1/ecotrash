import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import coletaService from '../services/coletaService';

export default function StatusLista() {
  const navigate = useNavigate();
  const location = useLocation();
  const [meusPedidos, setMeusPedidos] = useState([]);
  
  const cpfBusca = location.state?.cpfBusca || '';

  useEffect(() => {
    if (cpfBusca) {
      coletaService.buscarPorCpf(cpfBusca)
        .then(response => setMeusPedidos(response.data))
        .catch(() => alert('Erro ao procurar os pedidos.'));
    }
  }, [cpfBusca]);

  return (
    <>
      <div className="slogan">LIXO seguro,<br/>PLANETA feliz!</div>
      <div className="panel-table-container">
        <h2>Os Meus Requerimentos</h2>
        
        {meusPedidos.length === 0 ? (
          <p style={{ marginTop: '20px' }}>Nenhum pedido encontrado para este CPF.</p>
        ) : (
          <div className="table-responsive">
            <table className="tabela-pedidos">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Endereço</th>
                  <th>Data Prevista da Coleta</th>
                  <th>Situação</th>
                </tr>
              </thead>
              <tbody>
                {meusPedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>{pedido.nome}</td>
                    <td>{pedido.rua}, {pedido.bairro}, {pedido.cidade}</td>
                    <td>{pedido.dataColeta}</td>
                    <td>
                      {pedido.status === 'Agendado' && <span className="status-agendado">✅ {pedido.status}</span>}
                      {pedido.status === 'Em análise' && <span style={{ color: '#f57c00', fontWeight: 'bold' }}>⏳ {pedido.status}</span>}
                      {pedido.status === 'Recusado' && <span className="status-recusado">❌ {pedido.status}</span>}
                      {pedido.status === 'Aguardando Data' && <span style={{ color: '#1976d2', fontWeight: 'bold' }}>📍 Em processamento</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button className="btn btn-voltar" onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>Voltar</button>
      </div>
    </>
  );
}
