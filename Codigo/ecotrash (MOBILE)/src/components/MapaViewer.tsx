import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/* Ícone verde EcoTrash */
const ecoIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41],
  popupAnchor: [1, -34], shadowSize: [41, 41],
});

interface Props {
  latitude: number;
  longitude: number;
  altura?: number;
}

/**
 * MapaViewer — exibe um mapa estático com o pin do local marcado pelo cidadão.
 * Usado na gestão de requerimentos do município.
 */
const MapaViewer: React.FC<Props> = ({ latitude, longitude, altura = 200 }) => {
  const googleMapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;

  return (
    <div>
      {/* Mini-mapa estático */}
      <div style={{
        height: altura, borderRadius: 10, overflow: 'hidden',
        border: '1px solid rgba(92,184,92,0.35)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        marginBottom: 8,
      }}>
        <MapContainer
          center={[latitude, longitude]}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
          dragging={false}
          zoomControl={false}
          doubleClickZoom={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[latitude, longitude]} icon={ecoIcon} />
        </MapContainer>
      </div>

      {/* Link para abrir no Google Maps / app de mapas nativo */}
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: '#5cb85c', fontSize: 13, fontWeight: 500,
          textDecoration: 'none',
        }}
      >
        📍 Abrir no Google Maps
      </a>
    </div>
  );
};

export default MapaViewer;
