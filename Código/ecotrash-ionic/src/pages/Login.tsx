import React from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonIcon, IonText, IonItem } from '@ionic/react';
import { leaf, logoGoogle } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const history = useHistory();

  const handleLogin = () => {
    history.push('/dashboard');
  };

  return (
    <IonPage>
      <IonContent className="dark-background ion-padding">
        <div className="login-container">
          <div className="logo-section">
            <div className="icon-wrapper">
              <IonIcon icon={leaf} className="leaf-icon" />
            </div>
            <IonText color="light">
              <h1 className="title">Entrar</h1>
              <p className="subtitle">Bem-vindo de volta</p>
            </IonText>
          </div>

          <div className="form-section">
            <IonText color="light"><p className="input-label">E-mail</p></IonText>
            <IonItem className="custom-input" lines="none">
              <IonInput type="email" placeholder="joso@email.com" />
            </IonItem>

            <IonText color="light"><p className="input-label">Senha</p></IonText>
            <IonItem className="custom-input" lines="none">
              <IonInput type="password" placeholder="********" />
            </IonItem>

            <div className="forgot-password">
              <IonText color="medium"><small>Esqueci minha senha</small></IonText>
            </div>

            <IonButton expand="block" className="primary-btn" onClick={handleLogin}>
              Entrar
            </IonButton>

            <div className="divider">
              <span className="line"></span>
              <span className="text">ou</span>
              <span className="line"></span>
            </div>

            <IonButton expand="block" fill="outline" className="google-btn">
              <IonIcon slot="start" icon={logoGoogle} />
              Continuar com Google
            </IonButton>

            <div className="register-link">
              <IonText color="medium">Não tem conta? </IonText>
              <IonText color="success">Cadastre-se</IonText>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;