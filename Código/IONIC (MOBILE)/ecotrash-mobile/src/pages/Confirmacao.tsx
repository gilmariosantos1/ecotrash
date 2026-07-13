import React from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon,
} from '@ionic/react';
import { checkmarkCircle, homeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const Confirmacao: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ecotrash</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="page-wrapper" style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <div style={{
            background: 'rgba(0,0,0,0.68)',
            border: '1px solid rgba(92,184,92,0.25)',
            borderRadius: 16,
            padding: '40px 24px',
            backdropFilter: 'blur(8px)',
            textAlign: 'center',
            color: '#fff',
            width: '100%',
          }}>
            <IonIcon icon={checkmarkCircle} style={{ fontSize: 72, color: '#5cb85c', marginBottom: 16 }} />
            <h2 style={{ color: '#5cb85c', fontWeight: 700, marginBottom: 12 }}>
              Solicitação Enviada!
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>
              Seus dados foram enviados com sucesso.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 32 }}>
              Acompanhe o status do seu requerimento no painel de controle.
            </p>

            <IonButton
              expand="block"
              className="btn-primary"
              onClick={() => history.push('/')}
            >
              <IonIcon icon={homeOutline} slot="start" />
              Voltar ao Início
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Confirmacao;
