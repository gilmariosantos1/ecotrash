import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const pontosDeColeta = [
  {
    id: 1,
    name: 'Ponto de Coleta Central',
    type: 'Coleta Seletiva',
    address: 'Praça da Bandeira, 120 - Centro',
    city: 'São Paulo',
    hours: 'Seg-Sex 08h-18h',
    available: true,
    description: 'Recebe vidro, plástico, papel e metal. Área coberta e com fácil acesso.'
  },
  {
    id: 2,
    name: 'EcoPonto Bairro Verde',
    type: 'Ponto Verde',
    address: 'Rua das Flores, 88 - Jardim',
    city: 'Guarulhos',
    hours: 'Seg-Sáb 09h-17h',
    available: true,
    description: 'Ponto ideal para pequenas entregas de recicláveis e óleo de cozinha.'
  },
  {
    id: 3,
    name: 'Coleta Solidária',
    type: 'Recolhimento Específico',
    address: 'Avenida Brasil, 555 - Vila Nova',
    city: 'São Paulo',
    hours: 'Ter/Qui 10h-16h',
    available: false,
    description: 'A coleta deste ponto acontece em dias específicos da semana.'
  }
];

export default function MapaPontosColeta() {
  const navigate = useNavigate();
  const [selectedPoint, setSelectedPoint] = useState(pontosDeColeta[0]);
  const [searchCity, setSearchCity] = useState('');
  const [filterType, setFilterType] = useState('Todos');

  const filteredPoints = useMemo(() => {
    const term = searchCity.toLowerCase();

    return pontosDeColeta.filter((ponto) => {
      const matchesCity = ponto.city.toLowerCase().includes(term);
      const matchesType = filterType === 'Todos' || ponto.type === filterType;
      return matchesCity && matchesType;
    });
  }, [filterType, searchCity]);

  const visiblePoint = filteredPoints.find((ponto) => ponto.id === selectedPoint.id) || filteredPoints[0] || null;

  return (
    <>
      <div className="slogan">LIXO seguro,<br/>PLANETA feliz!</div>

      <div className="page-title-group">
        <h2>Mapa de Pontos de Coleta</h2>
        <p className="subtitle">
          Veja os locais de entrega e reciclagem, compare distâncias e escolha o ponto mais próximo de você.
        </p>
      </div>

      <div className="map-page">
        <aside className="map-sidebar">
          <div className="map-sidebar-top">
            <div className="search-group">
              <label htmlFor="search-city">Buscar cidade</label>
              <input id="search-city" type="text" value={searchCity} onChange={(event) => setSearchCity(event.target.value)} placeholder="Ex: São Paulo" />
            </div>

            <div className="search-group">
              <label htmlFor="filter-type">Filtrar por tipo</label>
              <select id="filter-type" value={filterType} onChange={(event) => setFilterType(event.target.value)}>
                <option>Todos</option>
                <option>Coleta Seletiva</option>
                <option>Ponto Verde</option>
                <option>Recolhimento Específico</option>
              </select>
            </div>
          </div>

          <div className="map-card-list">
            {filteredPoints.length > 0 ? filteredPoints.map((ponto) => (
              <button
                type="button"
                key={ponto.id}
                className={`point-card ${visiblePoint?.id === ponto.id ? 'active' : ''}`}
                onClick={() => setSelectedPoint(ponto)}
              >
                <div className="point-card-header">
                  <div>
                    <strong>{ponto.name}</strong>
                    <span className="point-label">{ponto.type}</span>
                  </div>
                  <span className={`point-status ${ponto.available ? 'available' : 'closed'}`}>
                    {ponto.available ? 'Aberto' : 'Fechado'}
                  </span>
                </div>
                <p>{ponto.address}</p>
              </button>
            )) : (
              <div className="empty-state">Nenhum ponto encontrado para a busca atual.</div>
            )}
          </div>
        </aside>

        <section className="map-main">
          <div className="map-placeholder">
            <div className="map-legend">
              <span className="map-legend-item"><span className="legend-dot available" /> Aberto</span>
              <span className="map-legend-item"><span className="legend-dot closed" /> Fechado</span>
            </div>
            <div className="map-route-card">
              <div className="map-route-title">Rota sugerida</div>
              <p>Confira os pontos mais próximos e escolha o que melhor atende à sua rotina.</p>
            </div>
            <div className="map-pins">
              {filteredPoints.length > 0 ? filteredPoints.map((ponto) => (
                <button
                  key={ponto.id}
                  type="button"
                  className={`map-pin ${ponto.available ? 'available' : 'closed'} ${visiblePoint?.id === ponto.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPoint(ponto)}
                >
                  {ponto.id}
                </button>
              )) : null}
            </div>
          </div>

          <div className="map-details">
            <div className="details-card">
              <h3>{visiblePoint ? visiblePoint.name : 'Nenhum ponto disponível'}</h3>
              <p className="details-type">{visiblePoint?.type}</p>
              <p>{visiblePoint?.address}</p>
              <p><strong>Cidade:</strong> {visiblePoint?.city}</p>
              <p><strong>Horário:</strong> {visiblePoint?.hours}</p>
              <p>{visiblePoint?.description}</p>
            </div>
            <div className="details-card details-contact">
              <h4>Como chegar</h4>
              <p>Use o mapa acima para traçar a melhor rota até o ponto de coleta.</p>
              <h4>O que levar</h4>
              <ul>
                <li>Plástico limpo e seco</li>
                <li>Papel e papelão</li>
                <li>Vidros separados</li>
                <li>Metais e eletrônicos</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <div className="btns">
        <button type="button" className="btn-back" onClick={() => navigate(-1)}>Voltar</button>
      </div>
    </>
  );
}
