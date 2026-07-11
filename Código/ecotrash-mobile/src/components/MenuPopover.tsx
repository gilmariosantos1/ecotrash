import React from 'react';
import {
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  homeOutline,
  informationCircleOutline,
  chatbubblesOutline,
  trashOutline,
  businessOutline,
} from 'ionicons/icons';

interface MenuPopoverProps {
  onDismiss: () => void;
}

const MenuPopover: React.FC<MenuPopoverProps> = ({ onDismiss }) => {
  const history = useHistory();

  const navegar = (rota: string) => {
    history.push(rota);
    onDismiss();
  };

  return (
    <IonList style={{ background: 'rgba(20,40,20,0.97)', minWidth: 220 }}>
      <IonItem button onClick={() => navegar('/')} lines="full"
        style={{ '--color': '#fff', '--background': 'transparent' }}>
        <IonIcon icon={homeOutline} slot="start" color="primary" />
        <IonLabel>Início</IonLabel>
      </IonItem>
      <IonItem button onClick={() => navegar('/sobre')} lines="full"
        style={{ '--color': '#fff', '--background': 'transparent' }}>
        <IonIcon icon={informationCircleOutline} slot="start" color="primary" />
        <IonLabel>Sobre o Projeto</IonLabel>
      </IonItem>
      <IonItem button onClick={() => navegar('/contato')} lines="full"
        style={{ '--color': '#fff', '--background': 'transparent' }}>
        <IonIcon icon={chatbubblesOutline} slot="start" color="primary" />
        <IonLabel>Fale Conosco</IonLabel>
      </IonItem>
      <IonItem button onClick={() => navegar('/cadastro')} lines="full"
        style={{ '--color': '#fff', '--background': 'transparent' }}>
        <IonIcon icon={trashOutline} slot="start" color="primary" />
        <IonLabel>Solicitar Coleta</IonLabel>
      </IonItem>
      <IonItem button onClick={() => navegar('/status/login')} lines="none"
        style={{ '--color': '#fff', '--background': 'transparent' }}>
        <IonIcon icon={businessOutline} slot="start" color="primary" />
        <IonLabel>Status do Requerimento</IonLabel>
      </IonItem>
    </IonList>
  );
};

export default MenuPopover;
