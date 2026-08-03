import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IonButton, IonSpinner } from '@ionic/react';

/* -------------------------------------------------------
   Fix dos ícones do Leaflet no Vite (problema conhecido)
   ------------------------------------------------------- */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* Ícone verde temático EcoTrash */
const ecoIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/* -------------------------------------------------------
   Tipos
   ------------------------------------------------------- */
interface Coordenadas { lat: number; lng: number; }

export interface DadosLocalMapa {
  rua: string;
  bairro: string;
  cidade: string;
  estado: string;
  lat: number;
  lng: number;
}

interface Props {
  onConfirmar: (dados: DadosLocalMapa) => void;
  onCancelar: () => void;
}

/* -------------------------------------------------------
   Sub-componente: captura cliques no mapa
   ------------------------------------------------------- */
function CliqueNoMapa({ onClick }: { onClick: (c: Coordenadas) => void }) {
  useMapEvents({ click: (e) => onClick({ lat: e.latlng.lat, lng: e.latlng.lng }) });
  return null;
}

/* -------------------------------------------------------
   Componente principal
   ------------------------------------------------------- */
const MapaPicker: React.FC<Props> = ({ onConfirmar, onCancelar }) => {
  const [posicao, setPosicao] = useState<Coordenadas | null>(null);
  const [centro, setCentro] = useState<[number, number]>([-10.9, -37.07]); // Sergipe
  const [dados, setDados] = useState<DadosLocalMapa | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [localizando, setLocalizando] = useState(true);

  /* Tenta centralizar no GPS do usuário */
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setCentro([pos.coords.latitude, pos.coords.longitude]);
        setLocalizando(false);
      },
      () => setLocalizando(false),
      { timeout: 6000 }
    );
    // Fallback caso o browser não suporte geolocation
    if (!navigator.geolocation) setLocalizando(false);
  }, []);

  /* Geocodificação reversa via Nominatim (OpenStreetMap — gratuito) */
  const buscarEndereco = async (lat: number, lng: number) => {
    setBuscando(true);
    setDados(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
        { headers: { 'Accept-Language': 'pt-BR', 'User-Agent': 'EcoTrashApp/1.0' } }
      );
      const json = await res.json();
      const a = json.address ?? {};
      setDados({
        rua: [a.road, a.house_number].filter(Boolean).join(', '),
        bairro: a.suburb ?? a.neighbourhood ?? a.village ?? '',
        cidade: a.city ?? a.town ?? a.municipality ?? a.county ?? '',
        estado: a.state ?? '',
        lat,
        lng,
      });
    } catch {
      /* Se Nominatim falhar, salva só as coordenadas */
      setDados({ rua: '', bairro: '', cidade: '', estado: '', lat, lng });
    } finally {
      setBuscando(false);
    }
  };

  const handleClick = (coord: Coordenadas) => {
    setPosicao(coord);
    buscarEndereco(coord.lat, coord.lng);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ---- MAPA ---- */}
      {localizando ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360 }}>
          <div style={{ textAlign: 'center' }}>
            <IonSpinner color="primary" />
            <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 10, fontSize: 14 }}>Obtendo sua localização...</p>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 360 }}>
          <MapContainer
            center={centro}
            zoom={15}
            style={{ height: '100%', minHeight: 360, width: '100%', zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CliqueNoMapa onClick={handleClick} />
            {posicao && (
              <Marker
                position={[posicao.lat, posicao.lng]}
                icon={ecoIcon}
                draggable
                eventHandlers={{
                  dragend: (e) => {
                    const latlng = (e.target as L.Marker).getLatLng();
                    handleClick({ lat: latlng.lat, lng: latlng.lng });
                  },
                }}
              />
            )}
          </MapContainer>
        </div>
      )}

      {/* ---- PAINEL INFERIOR ---- */}
      <div style={{
        padding: 16,
        background: 'rgba(5, 20, 8, 0.97)',
        borderTop: '1px solid rgba(92,184,92,0.35)',
        minHeight: 80,
      }}>
        {!posicao && (
          <p style={{ color: 'rgba(255,255,255,0.65)', textAlign: 'center', margin: 0, fontSize: 14 }}>
            📍 Toque no mapa para marcar onde o lixo/entulho está.<br />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              Você também pode arrastar o marcador para ajustar.
            </span>
          </p>
        )}

        {posicao && buscando && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IonSpinner name="dots" color="primary" />
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Identificando o endereço...</span>
          </div>
        )}

        {posicao && !buscando && dados && (
          <>
            <p style={{ color: '#5cb85c', fontWeight: 600, margin: '0 0 4px', fontSize: 13 }}>
              📍 Local selecionado:
            </p>
            <p style={{ color: '#fff', margin: '0 0 14px', fontSize: 13, lineHeight: 1.6 }}>
              {[dados.rua, dados.bairro, dados.cidade, dados.estado]
                .filter(Boolean).join(', ') || `${dados.lat.toFixed(5)}, ${dados.lng.toFixed(5)}`}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <IonButton expand="block" fill="outline"
                style={{ flex: 1, '--border-color': 'rgba(255,255,255,0.3)', '--color': '#fff', textTransform: 'none' }}
                onClick={onCancelar}>
                Cancelar
              </IonButton>
              <IonButton expand="block"
                style={{ flex: 1, '--background': '#5cb85c', '--color': '#fff', textTransform: 'none', fontWeight: 600 }}
                onClick={() => onConfirmar(dados)}>
                ✓ Confirmar Local
              </IonButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MapaPicker;
