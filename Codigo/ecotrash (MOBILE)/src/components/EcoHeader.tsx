import React, { useRef } from 'react';
import {
  IonHeader, IonToolbar, IonTitle,
  IonButtons, IonButton, IonIcon, IonPopover,
} from '@ionic/react';
import { arrowBackOutline, ellipsisVertical } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import MenuPopover from './MenuPopover';

interface EcoHeaderProps {
  backTo?: string;
  showBack?: boolean;
  onBack?: () => void;
}

const EcoHeader: React.FC<EcoHeaderProps> = ({
  backTo = '/',
  showBack = true,
  onBack,
}) => {
  const history = useHistory();
  const popoverRef = useRef<HTMLIonPopoverElement>(null);
  const menuId = useRef(`eco-menu-${Math.random().toString(36).slice(2, 7)}`).current;

  const handleBack = () => {
    if (onBack) { onBack(); } else { history.push(backTo); }
  };

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          {showBack ? (
            <IonButton onClick={handleBack} style={{ '--color': '#ffffff', textTransform: 'none' }}>
              <IonIcon icon={arrowBackOutline} slot="start" style={{ color: '#fff' }} />
              Voltar
            </IonButton>
          ) : (
            <IonButton style={{ opacity: 0, pointerEvents: 'none' }}>
              <IonIcon icon={ellipsisVertical} />
            </IonButton>
          )}
        </IonButtons>

        <IonTitle
          style={{ textAlign: 'center', color: '#ffffff', cursor: 'pointer' }}
          onClick={() => history.push('/')}
        >
          Ecotrash
        </IonTitle>

        <IonButtons slot="end">
          <IonButton id={menuId}>
            <IonIcon icon={ellipsisVertical} style={{ color: '#fff' }} />
          </IonButton>
        </IonButtons>
      </IonToolbar>

      <IonPopover trigger={menuId} dismissOnSelect ref={popoverRef}
        style={{ '--background': 'rgba(20,40,20,0.97)' }}>
        <MenuPopover onDismiss={() => popoverRef.current?.dismiss()} />
      </IonPopover>
    </IonHeader>
  );
};

export default EcoHeader;
