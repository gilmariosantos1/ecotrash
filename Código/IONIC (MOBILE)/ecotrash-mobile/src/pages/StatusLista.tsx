import React, { useEffect, useRef, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon, IonBackButton, IonPopover,
  IonSpinner, useIonAlert,
} from '@ionic/react';
import { ellipsisVertical, arrowForwardOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import MenuPopover from '../components/MenuPopover';
import ColetaController from '../controllers/ColetaController';
import { Coleta, StatusListaState } from '../types';

const StatusLista: React.FC = () => {
  const history = useHistory();
  const location = useLocation<StatusListaState>();
  const popoverRef = useRef<HTMLIonPopoverElement>(null);
  const [presentAlert] = useIonAlert();
  const [pedidos, setPedidos] = useState<Coleta[]>([]);
  const [carregando, setCarregando] = useState(true);

  const cpfBusca = location.state?.cpfBusca || '';

  useEffect(() => {
    if (!cpfBusca) {
      presentAlert({ header: 'Erro', message: 'CPF não informado.', buttons: [{ text: 'Ok', handler: () => history.push('/status/login') }] });
      return;
    }
    ColetaController.buscarPorCpf(cpfBusca)
      .then(setPedidos)
      .catch(() => presentAlert({ header: 'Erro', message: 'Não foi possível buscar os pedidos.', buttons: ['Ok'] }))
      .finally(() => setCarregando(false));
  }, [cpfBusca]);

  const badgeStatus = (status: string) => {
    const map: Record<string, string> = {
      'Agendado': 'badge-coletado',
      'Coletado': 'badge-coletado',
      'Em análise': 'badge-pendente',
      'Aguardando Data': 'badge-pendente',
      'Recusado': 'badge-recusado',
    };
    return map[status] || 'badge-pendente';
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/status/login" text="Voltar" color="light" />
          </IonButtons>
          <IonTitle>Ecotrash</IonTitle>
          <IonButtons slot="end">
            <IonButton id="menu-sl">
              <IonIcon icon={ellipsisVertical} style={{ color: '#fff' }} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonPopover trigger="menu-sl" dismissOnSelect ref={popoverRef}>
        <MenuPopover onDismiss={() => popoverRef.current?.dismiss()} />
      </IonPopover>

      <IonContent>
        <div className="page-wrapper" style={{ padding: '16px' }}>
          <div style={{
            background: 'rgba(0,0,0,0.68)',
            border: '1px solid rgba(92,184,92,0.25)',
            borderRadius: 16,
            padding: '20px',
            backdropFilter: 'blur(8px)',
          }}>
            <h2 style={{ color: '#5cb85c', fontWeight: 700, marginBottom: 16 }}>
              Meus Requerimentos
            </h2>

            {carregando ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <IonSpinner color="primary" />
              </div>
            ) : pedidos.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '20px 0' }}>
                Nenhum pedido encontrado para este CPF.
              </p>
            ) : (
              pedidos.map((pedido) => (
                <div key={pedido.id} className="req-item" style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <p className="req-item-label">Data</p>
                      <p className="req-item-value">{pedido.dataRequisicao}</p>
                    </div>
                    <span className={badgeStatus(pedido.status)}>{pedido.status}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                    <div>
                      <p className="req-item-label">Tipo de Lixo</p>
                      <p className="req-item-value">{pedido.tipoLixo}</p>
                    </div>
                    <div>
                      <p className="req-item-label">Data da Coleta</p>
                      <p className="req-item-value">{pedido.dataColeta || '—'}</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <p className="req-item-label">Endereço</p>
                    <p className="req-item-value" style={{ fontSize: 13 }}>
                      {pedido.rua}, {pedido.bairro}, {pedido.cidade}
                    </p>
                  </div>

                  <IonButton
                    expand="block"
                    size="small"
                    fill="outline"
                    style={{ '--border-color': 'rgba(92,184,92,0.5)', '--color': '#5cb85c', textTransform: 'none' }}
                    onClick={() => history.push(`/status/detalhes/${pedido.id}`)}
                  >
                    Ver Detalhes
                    <IonIcon icon={arrowForwardOutline} slot="end" />
                  </IonButton>
                </div>
              ))
            )}

            <IonButton
              expand="block"
              fill="outline"
              style={{ marginTop: 16, '--border-color': 'rgba(255,255,255,0.4)', '--color': '#fff', textTransform: 'none' }}
              onClick={() => history.goBack()}
            >
              Voltar
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default StatusLista;
