import React, { useRef } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonPopover,
  IonButtons,
} from '@ionic/react';
import {
  ellipsisVertical,
  trashOutline,
  businessOutline,
  addCircleOutline,
  searchOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import MenuPopover from '../components/MenuPopover';

const Home: React.FC = () => {
  const history = useHistory();
  const popoverRef = useRef<HTMLIonPopoverElement>(null);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ecotrash</IonTitle>
          <IonButtons slot="end">
            <IonButton id="menu-trigger">
              <IonIcon icon={ellipsisVertical} style={{ color: '#fff' }} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonPopover trigger="menu-trigger" dismissOnSelect ref={popoverRef}
        style={{ '--background': 'rgba(20,40,20,0.97)' }}>
        <MenuPopover onDismiss={() => popoverRef.current?.dismiss()} />
      </IonPopover>

      <IonContent>
        <div className="page-wrapper" style={{ padding: '20px 16px', minHeight: '100%' }}>
          {/* Slogan */}
          <div className="eco-slogan">
            LIXO seguro,<br />PLANETA feliz!
          </div>

          {/* Painel de controle */}
          <div style={{
            background: 'rgba(0,0,0,0.68)',
            border: '1px solid rgba(92,184,92,0.25)',
            borderRadius: 16,
            padding: '24px 20px',
            marginTop: 20,
            backdropFilter: 'blur(8px)',
          }}>
            <h2 style={{
              color: '#5cb85c',
              fontWeight: 700,
              fontSize: 20,
              textAlign: 'center',
              marginBottom: 24,
            }}>
              Painel de Controle
            </h2>

            <IonButton
              expand="block"
              className="btn-primary"
              style={{ marginBottom: 12 }}
              onClick={() => history.push('/municipio/login')}
            >
              <IonIcon icon={businessOutline} slot="start" />
              Painel Município
            </IonButton>

            <IonButton
              expand="block"
              fill="outline"
              style={{
                marginBottom: 12,
                '--border-color': 'rgba(92,184,92,0.6)',
                '--color': '#fff',
                textTransform: 'none',
              }}
              onClick={() => history.push('/municipio/cadastro')}
            >
              <IonIcon icon={addCircleOutline} slot="start" />
              Cadastrar Município
            </IonButton>

            <IonButton
              expand="block"
              fill="outline"
              style={{
                marginBottom: 12,
                '--border-color': 'rgba(92,184,92,0.6)',
                '--color': '#fff',
                textTransform: 'none',
              }}
              onClick={() => history.push('/cadastro')}
            >
              <IonIcon icon={trashOutline} slot="start" />
              Solicitar Coleta
            </IonButton>

            <IonButton
              expand="block"
              fill="outline"
              style={{
                '--border-color': 'rgba(92,184,92,0.6)',
                '--color': '#fff',
                textTransform: 'none',
              }}
              onClick={() => history.push('/status/login')}
            >
              <IonIcon icon={searchOutline} slot="start" />
              Status do Requerimento
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
