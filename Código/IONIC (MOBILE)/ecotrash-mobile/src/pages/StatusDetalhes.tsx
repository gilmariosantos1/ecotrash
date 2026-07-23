import React, { useEffect, useRef, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon, IonBackButton, IonPopover,
  IonSpinner, useIonAlert,
} from '@ionic/react';
import { ellipsisVertical, locationOutline } from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import MenuPopover from '../components/MenuPopover';
import ColetaController from '../controllers/ColetaController';
import { Coleta } from '../types';

const StatusDetalhes: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const popoverRef = useRef<HTMLIonPopoverElement>(null);
  const [presentAlert] = useIonAlert();
  const [pedido, setPedido] = useState<Coleta | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    ColetaController.buscarPorId(id)
      .then(setPedido)
      .catch(() => presentAlert({ header: 'Erro', message: 'Não foi possível carregar o requerimento.', buttons: ['Ok'] }))
      .finally(() => setCarregando(false));
  }, [id]);

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
            <IonBackButton defaultHref="/status/lista" text="Voltar" color="light" />
          </IonButtons>
<IonTitle style={{ textAlign: 'center', color: '#ffffff' }}>Ecotrash</IonTitle>
          <IonButtons slot="end">
            <IonButton id="menu-sd">
              <IonIcon icon={ellipsisVertical} style={{ color: '#fff' }} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonPopover trigger="menu-sd" dismissOnSelect ref={popoverRef}>
        <MenuPopover onDismiss={() => popoverRef.current?.dismiss()} />
      </IonPopover>

      <IonContent>
        <div className="page-wrapper" style={{ padding: '16px' }}>
          <div style={{
            background: 'rgba(0,0,0,0.68)',
            border: '1px solid rgba(92,184,92,0.25)',
            borderRadius: 16,
            padding: '24px 20px',
            backdropFilter: 'blur(8px)',
          }}>
            <h2 style={{ color: '#5cb85c', fontWeight: 700, marginBottom: 20 }}>
              Detalhe do Requerimento
            </h2>

            {carregando ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <IonSpinner color="primary" />
              </div>
            ) : !pedido ? (
              <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
                Requerimento não encontrado.
              </p>
            ) : (
              <>
                {/* Grid de informações */}
                {[
                  { label: 'Data do Pedido', value: pedido.dataRequisicao },
                  { label: 'Tipo de Lixo', value: pedido.tipoLixo },
                  { label: 'Data da Coleta', value: pedido.dataColeta || 'Aguardando prefeitura' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12, marginBottom: 12 }}>
                    <p className="req-item-label">{label}</p>
                    <p className="req-item-value">{value}</p>
                  </div>
                ))}

                {/* Endereço */}
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 12, marginBottom: 12 }}>
                  <p className="req-item-label">Endereço</p>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 4 }}>
                    <IonIcon icon={locationOutline} style={{ color: '#5cb85c', fontSize: 18, flexShrink: 0, marginTop: 2 }} />
                    <p className="req-item-value" style={{ margin: 0 }}>
                      {pedido.rua}, {pedido.bairro}, {pedido.cidade}/{pedido.estado}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div style={{ marginBottom: 24 }}>
                  <p className="req-item-label">Status</p>
                  <span className={badgeStatus(pedido.status)} style={{ display: 'inline-block', marginTop: 4 }}>
                    {pedido.status}
                  </span>
                </div>

                {/* Botão entrar em contato */}
                <IonButton
                  expand="block"
                  className="btn-primary"
                  onClick={() => history.push('/contato')}
                >
                  Entrar em Contato
                </IonButton>

                <IonButton
                  expand="block"
                  fill="outline"
                  style={{ marginTop: 12, '--border-color': 'rgba(255,255,255,0.4)', '--color': '#fff', textTransform: 'none' }}
                  onClick={() => history.goBack()}
                >
                  Voltar
                </IonButton>
              </>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default StatusDetalhes;
