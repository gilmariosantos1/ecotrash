import React, { useRef, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon, IonBackButton, IonPopover,
  IonItem, IonLabel, IonInput, IonSpinner, useIonAlert,
} from '@ionic/react';
import { ellipsisVertical, keyOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import MenuPopover from '../components/MenuPopover';
import MunicipioController from '../controllers/MunicipioController';

const logoEcotrash = '/img/Logo minimalista 2.png';

const PainelMunicipioLogin: React.FC = () => {
  const history = useHistory();
  const popoverRef = useRef<HTMLIonPopoverElement>(null);
  const [presentAlert] = useIonAlert();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      presentAlert({
        header: 'Campos obrigatórios',
        message: 'Preencha e-mail e senha.',
        buttons: ['Ok'],
      });
      return;
    }

    setCarregando(true);

    try {
      const sessao = await MunicipioController.login(email, senha);

      history.push('/municipio/lista', {
        cidade: sessao.cidade,
        estado: sessao.estado,
      });
    } catch (error: any) {
      presentAlert({
        header: 'Erro de login',
        message:
          error?.response?.data?.erro ||
          'Credenciais inválidas ou servidor indisponível.',
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
            <IonBackButton
              defaultHref="/"
              text="Voltar"
              color="light"
            />
          </IonButtons>

          <IonTitle
            style={{
              textAlign: 'center',
              color: '#ffffff',
            }}
          >
            Ecotrash
          </IonTitle>

          <IonButtons slot="end">
            <IonButton id="menu-pml">
              <IonIcon
                icon={ellipsisVertical}
                style={{ color: '#fff' }}
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonPopover
        trigger="menu-pml"
        dismissOnSelect
        ref={popoverRef}
      >
        <MenuPopover
          onDismiss={() => popoverRef.current?.dismiss()}
        />
      </IonPopover>

      <IonContent>
        <div
          className="page-wrapper"
          style={{
            padding: '20px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '85vh',
          }}
        >
          {/* Logo + título */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: 32,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '-65px auto -75px',
              }}
            >
              <img
                src={logoEcotrash}
                alt="EcoTrash"
                style={{
                  width: 250,
                  height: 250,
                  objectFit: 'contain',
                }}
              />
            </div>

            <h2
              style={{
                color: '#fff',
                fontWeight: 700,
                fontSize: 26,
                margin: 0,
              }}
            >
              Entrar
            </h2>

            <p
              style={{
                color: 'rgb(255, 255, 255)',
                marginTop: 6,
              }}
            >
              Bem-vindo de volta
            </p>
          </div>

          {/* Card de login */}
          <div
            style={{
              background: 'rgba(0,0,0,0.68)',
              border: '1px solid rgba(92,184,92,0.25)',
              borderRadius: 16,
              padding: '24px 20px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <IonItem>
              <IonLabel position="stacked">
                E-mail
              </IonLabel>

              <IonInput
                type="email"
                value={email}
                placeholder="exemplo@cidade.se.gov.br"
                onIonInput={(e) =>
                  setEmail(e.detail.value!)
                }
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">
                Senha
              </IonLabel>

              <IonInput
                type="password"
                value={senha}
                placeholder="••••••••"
                onIonInput={(e) =>
                  setSenha(e.detail.value!)
                }
              />
            </IonItem>

            <div
              style={{
                textAlign: 'right',
                marginTop: 8,
                marginBottom: 8,
              }}
            >
              <IonButton
                fill="clear"
                size="small"
                style={{
                  '--color': '#5cb85c',
                  textTransform: 'none',
                  fontSize: 13,
                } as React.CSSProperties}
                onClick={() =>
                  history.push('/municipio/recuperar-senha')
                }
              >
                Esqueci minha senha
              </IonButton>
            </div>

            <IonButton
              expand="block"
              className="btn-primary"
              style={{ marginTop: 8 }}
              onClick={handleLogin}
              disabled={carregando}
            >
              {carregando ? (
                <IonSpinner name="crescent" />
              ) : (
                <>
                  <IonIcon
                    icon={keyOutline}
                    slot="start"
                  />
                  Entrar
                </>
              )}
            </IonButton>

            <div
              className="eco-separator"
              style={{ margin: '16px 0' }}
            >
              ou
            </div>

            <IonButton
              expand="block"
              fill="outline"
              style={{
                '--border-color':
                  'rgba(255,255,255,0.35)',
                '--color': '#fff',
                textTransform: 'none',
              } as React.CSSProperties}
              onClick={() =>
                history.push('/municipio/cadastro')
              }
            >
              Não tem conta? Cadastre-se
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PainelMunicipioLogin;