import React, { useRef, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon, IonBackButton, IonPopover,
  IonItem, IonLabel, IonInput, IonSpinner, useIonAlert,
} from '@ionic/react';
import { ellipsisVertical, mailOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import MenuPopover from '../components/MenuPopover';
import MunicipioController from '../controllers/MunicipioController';

const RecuperarSenha: React.FC = () => {
  const history = useHistory();
  const popoverRef = useRef<HTMLIonPopoverElement>(null);
  const [presentAlert] = useIonAlert();
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      presentAlert({ header: 'Campo obrigatório', message: 'Informe o e-mail oficial cadastrado.', buttons: ['Ok'] });
      return;
    }
    setCarregando(true);
    try {
      const mensagem = await MunicipioController.recuperarSenha(email);
      presentAlert({
        header: 'E-mail enviado!',
        message: mensagem || 'Verifique sua caixa de entrada com a nova senha de acesso.',
        buttons: [{ text: 'Ok', handler: () => history.push('/municipio/login') }],
      });
    } catch (error: any) {
      presentAlert({
        header: 'Erro',
        message: error?.response?.data?.erro || 'Não foi possível recuperar a senha.',
        buttons: ['Ok'],
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/municipio/login" text="Voltar" color="light" />
          </IonButtons>
<IonTitle style={{ textAlign: 'center', color: '#ffffff' }}>Ecotrash</IonTitle>
          <IonButtons slot="end">
            <IonButton id="menu-rs">
              <IonIcon icon={ellipsisVertical} style={{ color: '#fff' }} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonPopover trigger="menu-rs" dismissOnSelect ref={popoverRef}>
        <MenuPopover onDismiss={() => popoverRef.current?.dismiss()} />
      </IonPopover>

      <IonContent>
        <div className="page-wrapper" style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
          <div style={{
            background: 'rgba(0,0,0,0.68)',
            border: '1px solid rgba(92,184,92,0.25)',
            borderRadius: 16,
            padding: '28px 20px',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(92,184,92,0.15)',
                border: '2px solid rgba(92,184,92,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
              }}>
                <IonIcon icon={mailOutline} style={{ fontSize: 28, color: '#5cb85c' }} />
              </div>
              <h2 style={{ color: '#5cb85c', fontWeight: 700, margin: 0 }}>Recuperar Senha</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginTop: 8 }}>
                Digite o e-mail oficial cadastrado. Enviaremos uma nova senha de acesso para você.
              </p>
            </div>

            <IonItem>
              <IonLabel position="stacked">E-mail Oficial</IonLabel>
              <IonInput
                type="email"
                value={email}
                placeholder="exemplo@cidade.se.gov.br"
                onIonInput={(e) => setEmail(e.detail.value!)}
              />
            </IonItem>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <IonButton
                expand="block"
                fill="outline"
                style={{ flex: 1, '--border-color': 'rgba(255,255,255,0.4)', '--color': '#fff', textTransform: 'none' }}
                onClick={() => history.goBack()}
                disabled={carregando}
              >
                Voltar
              </IonButton>
              <IonButton
                expand="block"
                className="btn-primary"
                style={{ flex: 1 }}
                onClick={handleSubmit}
                disabled={carregando}
              >
                {carregando ? <IonSpinner name="crescent" /> : 'Receber Nova Senha'}
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RecuperarSenha;
