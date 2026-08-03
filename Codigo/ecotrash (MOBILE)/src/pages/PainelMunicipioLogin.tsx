import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonButton, IonIcon,
  IonItem, IonLabel, IonInput, IonSpinner, useIonAlert,
} from '@ionic/react';
import { keyOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import EcoHeader from '../components/EcoHeader';
import MunicipioController from '../controllers/MunicipioController';

const STORAGE_KEY = 'ecotrash_municipio_email';

const PainelMunicipioLogin: React.FC = () => {
  const history = useHistory();
  const [presentAlert] = useIonAlert();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  /* Carrega o e-mail salvo automaticamente ao abrir a página */
  useEffect(() => {
    const emailSalvo = localStorage.getItem(STORAGE_KEY);
    if (emailSalvo) setEmail(emailSalvo);
  }, []);

  const handleLogin = async () => {
    if (!email || !senha) {
      presentAlert({ header: 'Campos obrigatórios', message: 'Preencha e-mail e senha.', buttons: ['Ok'] });
      return;
    }
    setCarregando(true);
    try {
      const sessao = await MunicipioController.login(email, senha);
      /* Salva o e-mail para pré-preencher no próximo acesso */
      localStorage.setItem(STORAGE_KEY, email);
      history.push('/municipio/lista', { cidade: sessao.cidade, estado: sessao.estado });
    } catch (error: any) {
      presentAlert({
        header: 'Erro de login',
        message: error?.response?.data?.erro || 'Credenciais inválidas ou servidor indisponível.',
        buttons: ['Ok'],
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <IonPage>
      <EcoHeader backTo="/" />
      <IonContent>
        <div className="page-wrapper" style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '85vh' }}>

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 26, margin: 0 }}>Entrar</h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', marginTop: 6 }}>Bem-vindo de volta</p>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(92,184,92,0.25)', borderRadius: 16, padding: '24px 20px', backdropFilter: 'blur(8px)' }}>

            <IonItem>
              <IonLabel position="stacked">E-mail</IonLabel>
              <IonInput
                type="email"
                value={email}
                placeholder="exemplo@cidade.se.gov.br"
                onIonInput={(e) => setEmail(e.detail.value!)}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Senha</IonLabel>
              <IonInput
                type="password"
                value={senha}
                placeholder="••••••••"
                onIonInput={(e) => setSenha(e.detail.value!)}
              />
            </IonItem>

            <div style={{ textAlign: 'right', marginTop: 8, marginBottom: 8 }}>
              <IonButton fill="clear" size="small"
                style={{ '--color': '#5cb85c', textTransform: 'none', fontSize: 13 } as React.CSSProperties}
                onClick={() => history.push('/municipio/recuperar-senha')}>
                Esqueci minha senha
              </IonButton>
            </div>

            <IonButton expand="block" className="btn-primary" style={{ marginTop: 8 }}
              onClick={handleLogin} disabled={carregando}>
              {carregando ? <IonSpinner name="crescent" /> : (
                <><IonIcon icon={keyOutline} slot="start" />Entrar</>
              )}
            </IonButton>

            <div className="eco-separator" style={{ margin: '16px 0' }}>ou</div>

            <IonButton expand="block" fill="outline"
              style={{ '--border-color': 'rgba(255,255,255,0.35)', '--color': '#fff', textTransform: 'none' } as React.CSSProperties}
              onClick={() => history.push('/municipio/cadastro')}>
              Não tem conta? Cadastre-se
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PainelMunicipioLogin;
