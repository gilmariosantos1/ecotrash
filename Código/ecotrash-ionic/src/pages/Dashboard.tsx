import React from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="transparent-toolbar">
          <IonTitle className="header-title">Ecotrash</IonTitle>
          <IonButtons slot="end">
            <IonButton color="light">
              <IonIcon icon={ellipsisVertical} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="bg-image-content">
        <div className="overlay-container">
          <div className="glass-card">
            <h2 className="card-title">Painel de Controle</h2>
            <div className="action-buttons">
              <IonButton expand="block" className="menu-btn">Painel Município</IonButton>
              <IonButton expand="block" className="menu-btn">Cadastrar Município</IonButton>
              <IonButton expand="block" className="menu-btn outline-btn" fill="outline">Solicitar Coleta</IonButton>
              <IonButton expand="block" className="menu-btn outline-btn" fill="outline">Status do Requerimento</IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;