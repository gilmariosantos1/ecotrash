import React, { useRef } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon, IonBackButton, IonPopover,
} from '@ionic/react';
import { ellipsisVertical, checkmarkCircleOutline } from 'ionicons/icons';
import MenuPopover from '../components/MenuPopover';

const Sobre: React.FC = () => {
  const popoverRef = useRef<HTMLIonPopoverElement>(null);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="Voltar" color="light" />
          </IonButtons>
<IonTitle style={{ textAlign: 'center', color: '#ffffff' }}>Ecotrash</IonTitle>
          <IonButtons slot="end">
            <IonButton id="menu-sobre">
              <IonIcon icon={ellipsisVertical} style={{ color: '#fff' }} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonPopover trigger="menu-sobre" dismissOnSelect ref={popoverRef}>
        <MenuPopover onDismiss={() => popoverRef.current?.dismiss()} />
      </IonPopover>

      <IonContent>
        <div className="page-wrapper" style={{ padding: '20px 16px' }}>
          <div style={{
            background: 'rgba(0,0,0,0.68)',
            border: '1px solid rgba(92,184,92,0.25)',
            borderRadius: 16,
            padding: '24px 20px',
            backdropFilter: 'blur(8px)',
            color: '#fff',
          }}>
            <h2 style={{ color: '#5cb85c', fontWeight: 700, marginBottom: 12 }}>
              Sobre o Projeto
            </h2>

            <h3 style={{ color: '#5cb85c', fontSize: 16, marginTop: 20 }}>
              O que é a EcoTrash?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
              A EcoTrash é um projeto voltado para sustentabilidade que tem como objetivo
              levar a coleta de lixo em lugares onde geralmente esse serviço não chega.
            </p>

            <h3 style={{ color: '#5cb85c', fontSize: 16, marginTop: 20 }}>
              Como funciona?
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
              Em parceria com os municípios e autoridades locais, a EcoTrash age como
              canal de comunicação entre os moradores e as autoridades competentes.
            </p>

            <h3 style={{ color: '#5cb85c', fontSize: 16, marginTop: 20 }}>
              Quais são os benefícios desse projeto?
            </h3>
            {[
              'Descartar o lixo adequadamente evitando poluição e descarte a céu aberto',
              'Evitar a queima de lixo que gera emissão de gases poluentes',
              'Prevenir que animais silvestres sejam atraídos pelo lixo irregular',
              'Reciclar materiais que possam ser reutilizáveis',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 12 }}>
                <IonIcon icon={checkmarkCircleOutline} style={{ color: '#5cb85c', fontSize: 20, flexShrink: 0, marginTop: 2 }} />
                <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Sobre;
