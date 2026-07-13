import React, { useRef, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon, IonBackButton, IonPopover,
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonTextarea,
  useIonAlert,
} from '@ionic/react';
import { ellipsisVertical, mailOutline, callOutline, logoInstagram } from 'ionicons/icons';
import MenuPopover from '../components/MenuPopover';
import MensagemController from '../controllers/MensagemController';
import { FormMensagem } from '../types';

const Contato: React.FC = () => {
  const popoverRef = useRef<HTMLIonPopoverElement>(null);
  const [presentAlert] = useIonAlert();
  const [carregando, setCarregando] = useState(false);
  const [form, setForm] = useState<FormMensagem>({
    nome: '', email: '', assunto: '', mensagem: '',
  });

  const handleSubmit = async () => {
    if (!form.nome || !form.email || !form.assunto || !form.mensagem) {
      presentAlert({ header: 'Campos obrigatórios', message: 'Preencha todos os campos.', buttons: ['Ok'] });
      return;
    }
    setCarregando(true);
    try {
      await MensagemController.enviar(form);
      presentAlert({
        header: 'Mensagem enviada!',
        message: `Obrigado, ${form.nome}! Sua mensagem sobre "${form.assunto}" foi enviada.`,
        buttons: ['Ok'],
      });
      setForm({ nome: '', email: '', assunto: '', mensagem: '' });
    } catch {
      presentAlert({ header: 'Erro', message: 'Não foi possível enviar. Verifique o servidor.', buttons: ['Ok'] });
    } finally {
      setCarregando(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.68)',
    border: '1px solid rgba(92,184,92,0.25)',
    borderRadius: 16,
    padding: '20px',
    backdropFilter: 'blur(8px)',
    color: '#fff',
    marginBottom: 16,
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="Voltar" color="light" />
          </IonButtons>
<IonTitle style={{ textAlign: 'center', color: '#ffffff' }}>Ecotrash</IonTitle>
          <IonButtons slot="end">
            <IonButton id="menu-contato">
              <IonIcon icon={ellipsisVertical} style={{ color: '#fff' }} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonPopover trigger="menu-contato" dismissOnSelect ref={popoverRef}>
        <MenuPopover onDismiss={() => popoverRef.current?.dismiss()} />
      </IonPopover>

      <IonContent>
        <div className="page-wrapper" style={{ padding: '20px 16px' }}>
          {/* Card de informações */}
          <div style={cardStyle}>
            <h2 style={{ color: '#5cb85c', fontWeight: 700, marginBottom: 16 }}>Fale Conosco</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: 16 }}>
              Se quer trazer o projeto para a sua cidade, ser voluntário ou ajudar com ideias,
              entre em contato pelos canais abaixo ou use o formulário.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: mailOutline, label: 'contacto@ecotrash.com.br' },
                { icon: callOutline, label: '(79) 9311-1213' },
                { icon: logoInstagram, label: '@Eco_Trash_SE' },
              ].map(({ icon, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <IonIcon icon={icon} style={{ color: '#5cb85c', fontSize: 20 }} />
                  <span style={{ color: 'rgba(255,255,255,0.85)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formulário */}
          <div style={cardStyle}>
            <h3 style={{ color: '#5cb85c', marginBottom: 16 }}>Envie uma Mensagem</h3>

            <IonItem>
              <IonLabel position="stacked">Nome Completo</IonLabel>
              <IonInput
                value={form.nome}
                placeholder="Como podemos chamá-lo?"
                onIonInput={(e) => setForm({ ...form, nome: e.detail.value! })}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">E-mail</IonLabel>
              <IonInput
                type="email"
                value={form.email}
                placeholder="Seu melhor e-mail"
                onIonInput={(e) => setForm({ ...form, email: e.detail.value! })}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Assunto</IonLabel>
              <IonSelect
                value={form.assunto}
                placeholder="Selecione..."
                onIonChange={(e) => setForm({ ...form, assunto: e.detail.value })}
              >
                <IonSelectOption value="Dúvida">Dúvida</IonSelectOption>
                <IonSelectOption value="Sugestão">Sugestão de Melhoria</IonSelectOption>
                <IonSelectOption value="Reclamação">Reclamação</IonSelectOption>
                <IonSelectOption value="Parceria">Quero ser Parceiro / Voluntário</IonSelectOption>
                <IonSelectOption value="Prefeitura">Sou da Prefeitura e quero o projeto</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Mensagem</IonLabel>
              <IonTextarea
                value={form.mensagem}
                placeholder="Escreva os detalhes aqui..."
                rows={5}
                autoGrow
                onIonInput={(e) => setForm({ ...form, mensagem: e.detail.value! })}
              />
            </IonItem>

            <IonButton
              expand="block"
              className="btn-primary"
              style={{ marginTop: 20 }}
              onClick={handleSubmit}
              disabled={carregando}
            >
              {carregando ? 'Enviando...' : 'Enviar Mensagem'}
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Contato;
