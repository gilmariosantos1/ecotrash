import React, { useEffect, useRef, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon, IonPopover,
  IonSpinner, IonInput, IonAlert, useIonAlert,
} from '@ionic/react';
import {
  ellipsisVertical, arrowForwardOutline,
  checkmarkOutline, closeOutline, calendarOutline, logOutOutline,
} from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import MenuPopover from '../components/MenuPopover';
import ColetaController from '../controllers/ColetaController';
import { Coleta, PainelMunicipioState } from '../types';

const PainelMunicipioLista: React.FC = () => {
  const history = useHistory();
  const location = useLocation<PainelMunicipioState>();
  const popoverRef = useRef<HTMLIonPopoverElement>(null);
  const [presentAlert] = useIonAlert();

  const [pedidos, setPedidos] = useState<Coleta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [datasTemporarias, setDatasTemporarias] = useState<Record<number, string>>({});

  const cidadeLogada = location.state?.cidade;
  const estadoLogado = location.state?.estado;

  useEffect(() => {
    if (!cidadeLogada || !estadoLogado) {
      presentAlert({
        header: 'Acesso negado',
        message: 'Por favor, faça o login para acessar o painel.',
        buttons: [{ text: 'Ok', handler: () => history.push('/municipio/login') }],
      });
      return;
    }
    carregarPedidos();
  }, [cidadeLogada, estadoLogado]);

  const carregarPedidos = () => {
    if (!cidadeLogada || !estadoLogado) return;
    setCarregando(true);
    ColetaController.buscarPorMunicipio(estadoLogado, cidadeLogada)
      .then(setPedidos)
      .catch(() => presentAlert({ header: 'Erro', message: 'Não foi possível carregar os requerimentos.', buttons: ['Ok'] }))
      .finally(() => setCarregando(false));
  };

  const alterarStatus = async (id: number, novoStatus: string) => {
    try {
      await ColetaController.alterarStatus(id, novoStatus);
      carregarPedidos();
    } catch {
      presentAlert({ header: 'Erro', message: 'Não foi possível atualizar o pedido.', buttons: ['Ok'] });
    }
  };

  const confirmarData = async (id: number) => {
    try {
      await ColetaController.agendarColeta(id, datasTemporarias[id]);
      carregarPedidos();
    } catch (error: any) {
      presentAlert({ header: 'Erro', message: error.message || 'Erro ao agendar.', buttons: ['Ok'] });
    }
  };

  const badgePorStatus = (status: string) => {
    const map: Record<string, string> = {
      'Em análise': 'badge-pendente',
      'Aguardando Data': 'badge-pendente',
      'Agendado': 'badge-processado',
      'Coletado': 'badge-coletado',
      'Recusado': 'badge-recusado',
    };
    return map[status] || 'badge-pendente';
  };

  const labelPorStatus: Record<string, string> = {
    'Em análise': 'Pendente',
    'Aguardando Data': 'Pendente',
    'Agendado': 'Processado',
    'Coletado': 'Coletado',
    'Recusado': 'Recusado',
  };

  if (!cidadeLogada) return null;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ecotrash</IonTitle>
          <IonButtons slot="end">
            <IonButton id="menu-pml-lista">
              <IonIcon icon={ellipsisVertical} style={{ color: '#fff' }} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonPopover trigger="menu-pml-lista" dismissOnSelect ref={popoverRef}>
        <MenuPopover onDismiss={() => popoverRef.current?.dismiss()} />
      </IonPopover>

      <IonContent>
        <div className="page-wrapper" style={{ padding: '16px' }}>
          <div style={{
            background: 'rgba(0,0,0,0.68)',
            border: '1px solid rgba(92,184,92,0.25)',
            borderRadius: 16,
            padding: '20px',
            backdropFilter: 'blur(8px)',
          }}>
            <h2 style={{ color: '#5cb85c', fontWeight: 700, fontSize: 17, marginBottom: 4 }}>
              Gestão de Requerimentos
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 20 }}>
              {cidadeLogada}/{estadoLogado}
            </p>

            {carregando ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <IonSpinner color="primary" />
              </div>
            ) : pedidos.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '20px 0' }}>
                Nenhum requerimento recebido para a sua cidade.
              </p>
            ) : (
              pedidos.map((pedido) => (
                <div key={pedido.id} style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(92,184,92,0.15)',
                  borderRadius: 12,
                  padding: '14px',
                  marginBottom: 12,
                }}>
                  {/* Cabeçalho do item */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#fff', fontWeight: 600, margin: 0, fontSize: 15 }}>{pedido.nome}</p>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '2px 0 0' }}>
                        {pedido.rua}, {pedido.bairro}
                      </p>
                    </div>
                    <span className={badgePorStatus(pedido.status)}>
                      {labelPorStatus[pedido.status] ?? pedido.status}
                    </span>
                  </div>

                  {/* Informações rápidas */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', marginBottom: 12 }}>
                    <div>
                      <p className="req-item-label">Lixo</p>
                      <p className="req-item-value" style={{ fontSize: 13 }}>{pedido.tipoLixo}</p>
                    </div>
                    <div>
                      <p className="req-item-label">Data do pedido</p>
                      <p className="req-item-value" style={{ fontSize: 13 }}>{pedido.dataRequisicao}</p>
                    </div>
                  </div>

                  {/* Ações por status */}
                  {pedido.status === 'Em análise' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <IonButton
                        expand="block"
                        size="small"
                        style={{ flex: 1, '--background': '#5cb85c', '--color': '#fff', textTransform: 'none' }}
                        onClick={() => alterarStatus(pedido.id, 'Aguardando Data')}
                      >
                        <IonIcon icon={checkmarkOutline} slot="start" />
                        Marcar como Coletado
                      </IonButton>
                      <IonButton
                        size="small"
                        fill="outline"
                        style={{ '--border-color': '#eb445a', '--color': '#eb445a', textTransform: 'none' }}
                        onClick={() => alterarStatus(pedido.id, 'Recusado')}
                      >
                        <IonIcon icon={closeOutline} />
                        Reporter
                      </IonButton>
                    </div>
                  )}

                  {pedido.status === 'Aguardando Data' && (
                    <div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div style={{
                          flex: 1,
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(92,184,92,0.4)',
                          borderRadius: 8,
                          padding: '4px 10px',
                        }}>
                          <input
                            type="date"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#fff',
                              width: '100%',
                              outline: 'none',
                              fontSize: 14,
                              colorScheme: 'dark',
                            }}
                            onChange={(e) => setDatasTemporarias((prev) => ({ ...prev, [pedido.id]: e.target.value }))}
                          />
                        </div>
                        <IonButton
                          size="small"
                          style={{ '--background': '#5cb85c', '--color': '#fff', textTransform: 'none' }}
                          onClick={() => confirmarData(pedido.id)}
                          disabled={!datasTemporarias[pedido.id]}
                        >
                          <IonIcon icon={calendarOutline} slot="start" />
                          Confirmar
                        </IonButton>
                      </div>
                    </div>
                  )}

                  {pedido.status === 'Agendado' && (
                    <p style={{ color: '#5cb85c', fontSize: 13, margin: '4px 0 0', fontWeight: 600 }}>
                      📅 Agendado para: {pedido.dataColeta}
                    </p>
                  )}

                  {pedido.status === 'Recusado' && (
                    <p style={{ color: '#eb445a', fontSize: 13, margin: '4px 0 0', fontWeight: 600 }}>
                      ❌ Pedido recusado
                    </p>
                  )}

                  {/* Botão detalhes */}
                  <IonButton
                    expand="block"
                    size="small"
                    fill="clear"
                    style={{ '--color': 'rgba(255,255,255,0.5)', textTransform: 'none', marginTop: 8, fontSize: 13 }}
                    onClick={() => history.push(`/municipio/detalhes/${pedido.id}`, { cidade: cidadeLogada, estado: estadoLogado })}
                  >
                    Ver detalhes
                    <IonIcon icon={arrowForwardOutline} slot="end" />
                  </IonButton>
                </div>
              ))
            )}

            {/* Botão sair */}
            <IonButton
              expand="block"
              fill="outline"
              style={{ marginTop: 8, '--border-color': 'rgba(255,255,255,0.3)', '--color': '#fff', textTransform: 'none' }}
              onClick={() => history.push('/municipio/login')}
            >
              <IonIcon icon={logOutOutline} slot="start" />
              Sair
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PainelMunicipioLista;
