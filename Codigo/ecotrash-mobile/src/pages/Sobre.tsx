import React from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { checkmarkCircleOutline } from 'ionicons/icons';
import EcoHeader from '../components/EcoHeader';

const Sobre: React.FC = () => (
  <IonPage>
    <EcoHeader backTo="/" />
    <IonContent>
      <div className="page-wrapper" style={{ padding: '20px 16px' }}>
        <div style={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(92,184,92,0.25)', borderRadius: 16, padding: '24px 20px', backdropFilter: 'blur(8px)', color: '#fff' }}>
          <h2 style={{ color: '#5cb85c', fontWeight: 700, marginBottom: 12 }}>Sobre o Projeto</h2>
          <h3 style={{ color: '#5cb85c', fontSize: 16, marginTop: 20 }}>O que é a EcoTrash?</h3>
          <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>A EcoTrash é um projeto voltado para sustentabilidade que tem como objetivo levar a coleta de lixo em lugares onde geralmente esse serviço não chega.</p>
          <h3 style={{ color: '#5cb85c', fontSize: 16, marginTop: 20 }}>Como funciona?</h3>
          <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>Em parceria com os municípios e autoridades locais, a EcoTrash age como canal de comunicação entre os moradores e as autoridades competentes.</p>
          <h3 style={{ color: '#5cb85c', fontSize: 16, marginTop: 20 }}>Benefícios</h3>
          {['Descartar o lixo adequadamente evitando poluição e descarte a céu aberto','Evitar a queima de lixo que gera emissão de gases poluentes','Prevenir que animais silvestres sejam atraídos pelo lixo irregular','Reciclar materiais que possam ser reutilizáveis'].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 12 }}>
              <IonIcon icon={checkmarkCircleOutline} style={{ color: '#5cb85c', fontSize: 20, flexShrink: 0, marginTop: 2 }} />
              <p style={{ color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.5 }}>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </IonContent>
  </IonPage>
);

export default Sobre;
