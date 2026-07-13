import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const historicoDescartes = [
  {
    id: 1,
    data: '20/06/2026',
    tipo: 'Lixo eletrônico',
    ponto: 'Ponto Central',
    peso: '4,2 kg',
    status: 'Coletado',
    impacto: '1,2 kg reciclado'
  },
  {
    id: 2,
    data: '15/06/2026',
    tipo: 'Papel e papelão',
    ponto: 'EcoPonto Bairro Verde',
    peso: '7,8 kg',
    status: 'Agendado',
    impacto: '5,1 kg reaproveitado'
  },
  {
    id: 3,
    data: '10/06/2026',
    tipo: 'Vidro',
    ponto: 'Coleta Solidária',
    peso: '2,5 kg',
    status: 'Pendente',
    impacto: '2,0 kg destinado ao reciclador'
  }
];

export default function HistoricoDescartes() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Todos');

  const descartesFiltrados = useMemo(() => {
    const termo = busca.toLowerCase();

    return historicoDescartes.filter((item) => {
      const matchBusca =
        item.tipo.toLowerCase().includes(termo) ||
        item.ponto.toLowerCase().includes(termo) ||
        item.status.toLowerCase().includes(termo);

      const matchFiltro = filtro === 'Todos' || item.status === filtro;

      return matchBusca && matchFiltro;
    });
  }, [busca, filtro]);

  const totalPeso = historicoDescartes
    .reduce((acumulador, item) => acumulador + Number(item.peso.replace(',', '.').replace(' kg', '')), 0)
    .toFixed(1);

  return (
    <>
      <div className="slogan">LIXO seguro,<br />PLANETA feliz!</div>

      <div className="page-title-group">
        <h2>Histórico de Descartes</h2>
        <p className="subtitle">
          Acompanhe os resíduos descartados, os pontos utilizados e o impacto positivo gerado em cada visita.
        </p>
      </div>

      <div className="history-page">
        <section className="history-summary">
          <div className="summary-card">
            <span>Descartes registrados</span>
            <strong>{historicoDescartes.length}</strong>
          </div>
          <div className="summary-card">
            <span>Peso total</span>
            <strong>{totalPeso} kg</strong>
          </div>
          <div className="summary-card">
            <span>Último ponto</span>
            <strong>{historicoDescartes[0].ponto}</strong>
          </div>
        </section>

        <section className="history-toolbar">
          <input
            type="search"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar por tipo, ponto ou status"
          />
          <select value={filtro} onChange={(event) => setFiltro(event.target.value)}>
            <option value="Todos">Todos os status</option>
            <option value="Coletado">Coletado</option>
            <option value="Agendado">Agendado</option>
            <option value="Pendente">Pendente</option>
          </select>
        </section>

        <section className="history-list">
          {descartesFiltrados.length > 0 ? (
            descartesFiltrados.map((item) => (
              <article className="history-item" key={item.id}>
                <div className="history-item-main">
                  <div>
                    <p className="history-date">{item.data}</p>
                    <h3>{item.tipo}</h3>
                    <p>{item.ponto}</p>
                  </div>
                  <span className={`history-status ${item.status.toLowerCase()}`}>{item.status}</span>
                </div>

                <div className="history-item-meta">
                  <div>
                    <strong>Peso</strong>
                    <span>{item.peso}</span>
                  </div>
                  <div>
                    <strong>Impacto</strong>
                    <span>{item.impacto}</span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">Nenhum descarte encontrado para os filtros selecionados.</div>
          )}
        </section>
      </div>

      <div className="btns">
        <button type="button" className="btn-back" onClick={() => navigate(-1)}>
          Voltar
        </button>
      </div>
    </>
  );
}
