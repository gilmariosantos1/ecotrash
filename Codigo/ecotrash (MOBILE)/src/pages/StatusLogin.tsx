import React, { useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon, IonItem, IonLabel, IonInput, useIonAlert } from '@ionic/react';
import { searchOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import EcoHeader from '../components/EcoHeader';

const StatusLogin: React.FC = () => {
  const history = useHistory();
  const [cpf, setCpf] = useState('');
  const [presentAlert] = useIonAlert();

  const handleConsultar = () => {
    if (!cpf.trim()) { presentAlert({ header: 'Campo obrigatório', message: 'Informe o CPF para continuar.', buttons: ['Ok'] }); return; }
    history.push('/status/lista', { cpfBusca: cpf });
  };

  return (
    <IonPage>
      <EcoHeader backTo="/" />
      <IonContent>
        <div className="page-wrapper" style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
          <div style={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(92,184,92,0.25)', borderRadius: 16, padding: '28px 20px', backdropFilter: 'blur(8px)' }}>
            <h2 style={{ color: '#5cb85c', fontWeight: 700, marginBottom: 8 }}>Consultar Requerimento</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 24 }}>Informe o seu CPF para consultar suas solicitações de coleta.</p>
            <IonItem>
              <IonLabel position="stacked">CPF</IonLabel>
              <IonInput value={cpf} placeholder="Apenas números" inputmode="numeric" maxlength={11}
                onIonInput={(e) => setCpf(e.detail.value!)} onKeyDown={(e) => e.key === 'Enter' && handleConsultar()} />
            </IonItem>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <IonButton expand="block" fill="outline" style={{ flex: 1, '--border-color': 'rgba(255,255,255,0.4)', '--color': '#fff', textTransform: 'none' }} onClick={() => history.push('/')}>Voltar</IonButton>
              <IonButton expand="block" className="btn-primary" style={{ flex: 1 }} onClick={handleConsultar}>
                <IonIcon icon={searchOutline} slot="start" />Consultar
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default StatusLogin;
