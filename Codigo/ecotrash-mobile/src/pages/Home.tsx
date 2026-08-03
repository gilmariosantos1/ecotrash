import React from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { trashOutline, businessOutline, searchOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import EcoHeader from '../components/EcoHeader';

const Home: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <EcoHeader showBack={false} />

      <IonContent>
        <div className="page-wrapper" style={{ padding: '20px 16px', minHeight: '100%' }}>
          <div style={{
            background: 'rgba(0,0,0,0.75)',
            border: '1px solid rgba(92,184,92,0.25)',
            borderRadius: 16,
            padding: '24px 20px',
            marginTop: 20,
            backdropFilter: 'blur(8px)',
          }}>
            <h2 style={{ color: '#5cb85c', fontWeight: 700, fontSize: 20, textAlign: 'center', marginBottom: 24 }}>
              Painel de Controle
            </h2>

            {/* Painel do Município — só quem tem login acessa */}
            <IonButton expand="block" className="btn-primary" style={{ marginBottom: 12 }}
              onClick={() => history.push('/municipio/login')}>
              <IonIcon icon={businessOutline} slot="start" />
              Painel Município
            </IonButton>

            {/* Solicitar Coleta — cidadão */}
            <IonButton expand="block" fill="outline"
              style={{ marginBottom: 12, '--border-color': 'rgba(92,184,92,0.6)', '--color': '#fff', textTransform: 'none' }}
              onClick={() => history.push('/cadastro')}>
              <IonIcon icon={trashOutline} slot="start" />
              Solicitar Coleta
            </IonButton>

            {/* Status do Requerimento — cidadão */}
            <IonButton expand="block" fill="outline"
              style={{ '--border-color': 'rgba(92,184,92,0.6)', '--color': '#fff', textTransform: 'none' }}
              onClick={() => history.push('/status/login')}>
              <IonIcon icon={searchOutline} slot="start" />
              Status do Requerimento
            </IonButton>

            {/*
              "Cadastrar Município" foi removido do painel público.
              Acesso: Painel Município → "Não tem conta? Cadastre-se"
              + código de administrador obrigatório no formulário.
            */}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
