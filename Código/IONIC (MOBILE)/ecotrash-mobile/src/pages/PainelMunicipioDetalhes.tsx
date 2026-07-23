import React, { useEffect, useRef, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon, IonBackButton, IonPopover,
  IonSpinner, useIonAlert,
} from '@ionic/react';
import {
  ellipsisVertical, checkmarkCircleOutline, closeCircleOutline, locationOutline,
} from 'ionicons/icons';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import MenuPopover from '../components/MenuPopover';
import ColetaController from '../controllers/ColetaController';
import { Coleta, PainelMunicipioState } from '../types';

const PainelMunicipioDetalhes: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const location = useLocation<PainelMunicipioState>();
  const sessao = location.state;
  const popoverRef = useRef<HTMLIonPopoverElement>(null);
  const [presentAlert] = useIonAlert();
  const [pedido, setPedido] = useState<Coleta | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    ColetaController.buscarPorId(id)
      .then(setPedido)
      .catch(() => presentAlert({ header: 'Erro', message: 'Não foi possível carregar o requerimento.', buttons: ['Ok'] }))
      .finally(() => setCarregando(false));
  }, [id]);

  const aceitar = async () => {
    try {
      await ColetaController.alterarStatus(id, 'Aguardando Data');
      presentAlert({
        header: 'Pedido aceito!',
        message: 'Acesse a lista para agendar a data de coleta.',
        buttons: [{ text: 'Ok', handler: () => history.push('/municipio/lista', sessao) }],
      });
    } catch {
      presentAlert({ header: 'Erro', message: 'Não foi possível atualizar o pedido.', buttons: ['Ok'] });
    }
  };

  const recusar = () => {
    presentAlert({
      header: 'Confirmar recusa',
      message: 'Tem certeza que deseja recusar este pedido?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Recusar',
          handler: async () => {
            try {
              await ColetaController.alterarStatus(id, 'Recusado');
              presentAlert({
                header: 'Pedido recusado.',
                buttons: [{ text: 'Ok', handler: () => history.push('/municipio/lista', sessao) }],
              });
            } catch {
              presentAlert({ header: 'Erro', message: 'Não foi possível recusar.', buttons: ['Ok'] });
            }
          },
        },
      ],
    });
  };

  const badgeStatus = (status: string) => {
    const map: Record<string, string> = {
      'Agendado': 'badge-processado',
      'Coletado': 'badge-coletado',
      'Em análise': 'badge-pendente',
      'Aguardando Data': 'badge-pendente',
      'Recusado': 'badge-recusado',
    };
    return map[status] || 'badge-pendente';
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/municipio/lista"
              text="Voltar"
              color="light"
              onClick={() => history.push('/municipio/lista', sessao)}
            />
          </IonButtons>
<IonTitle style={{ textAlign: 'center', color: '#ffffff' }}>Ecotrash</IonTitle>
          <IonButtons slot="end">
            <IonButton id="menu-pmd">
              <IonIcon icon={ellipsisVertical} style={{ color: '#fff' }} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonPopover trigger="menu-pmd" dismissOnSelect ref={popoverRef}>
        <MenuPopover onDismiss={() => popoverRef.current?.dismiss()} />
      </IonPopover>

      <IonContent>
        <div className="page-wrapper" style={{ padding: '16px' }}>
          <div style={{
            background: 'rgba(0,0,0,0.68)',
            border: '1px solid rgba(92,184,92,0.25)',
            borderRadius: 16,
            padding: '24px 20px',
            backdropFilter: 'blur(8px)',
          }}>
            <h2 style={{ color: '#5cb85c', fontWeight: 700, marginBottom: 20 }}>
              Detalhe do Requerimento
            </h2>

            {carregando ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <IonSpinner color="primary" />
              </div>
            ) : !pedido ? (
              <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
                Requerimento não encontrado.
              </p>
            ) : (
              <>
                {/* Status em destaque */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 20,
                  paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <div>
                    <p className="req-item-label">Data do pedido</p>
                    <p className="req-item-value">{pedido.dataRequisicao}</p>
                  </div>
                  <span className={badgeStatus(pedido.status)}>{pedido.status}</span>
                </div>

                {/* Grid de dados */}
                {[
                  { label: 'Nome', value: pedido.nome },
                  { label: 'CPF', value: pedido.cpf },
                  { label: 'Telefone', value: pedido.telefone },
                  { label: 'E-mail', value: pedido.email },
                  { label: 'Tipo de Lixo', value: pedido.tipoLixo },
                  { label: 'Data da Coleta', value: pedido.dataColeta || 'Aguardando agendamento' },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    paddingBottom: 10, marginBottom: 10,
                  }}>
                    <p className="req-item-label">{label}</p>
                    <p className="req-item-value">{value}</p>
                  </div>
                ))}

                {/* Endereço com ícone */}
                <div style={{ paddingBottom: 10, marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="req-item-label">Endereço</p>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 4 }}>
                    <IonIcon icon={locationOutline} style={{ color: '#5cb85c', fontSize: 18, flexShrink: 0, marginTop: 2 }} />
                    <p className="req-item-value" style={{ margin: 0 }}>
                      {pedido.rua}, {pedido.bairro}, {pedido.cidade}/{pedido.estado}
                    </p>
                  </div>
                </div>

                {/* Ações — apenas se "Em análise" */}
                {pedido.status === 'Em análise' && (
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                    <IonButton
                      expand="block"
                      style={{ flex: 1, '--background': '#5cb85c', '--color': '#fff', textTransform: 'none' }}
                      onClick={aceitar}
                    >
                      <IonIcon icon={checkmarkCircleOutline} slot="start" />
                      Aceitar
                    </IonButton>
                    <IonButton
                      expand="block"
                      style={{ flex: 1, '--background': '#eb445a', '--color': '#fff', textTransform: 'none' }}
                      onClick={recusar}
                    >
                      <IonIcon icon={closeCircleOutline} slot="start" />
                      Recusar
                    </IonButton>
                  </div>
                )}

                {/* Entrar em Contato */}
                <IonButton
                  expand="block"
                  className="btn-primary"
                  onClick={() => history.push('/contato')}
                >
                  Entrar em Contato
                </IonButton>

                <IonButton
                  expand="block"
                  fill="outline"
                  style={{ marginTop: 12, '--border-color': 'rgba(255,255,255,0.4)', '--color': '#fff', textTransform: 'none' }}
                  onClick={() => history.push('/municipio/lista', sessao)}
                >
                  Voltar
                </IonButton>
              </>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PainelMunicipioDetalhes;
