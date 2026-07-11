import React, { useState, useEffect, useRef } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon, IonBackButton, IonPopover,
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  useIonAlert, IonSpinner,
} from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import MenuPopover from '../components/MenuPopover';
import ColetaController from '../controllers/ColetaController';
import LocalidadeController from '../controllers/LocalidadeController';
import { FormColeta, Estado, Cidade } from '../types';

const Cadastro: React.FC = () => {
  const history = useHistory();
  const popoverRef = useRef<HTMLIonPopoverElement>(null);
  const [presentAlert] = useIonAlert();
  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [listaEstados, setListaEstados] = useState<Estado[]>([]);
  const [listaCidades, setListaCidades] = useState<Cidade[]>([]);

  const [form, setForm] = useState<FormColeta>({
    nome: '', cpf: '', email: '', telefone: '',
    estado: '', cidade: '', bairro: '', rua: '', tipoLixo: '',
  });

  useEffect(() => {
    setCarregando(true);
    LocalidadeController.carregarEstados()
      .then(setListaEstados)
      .catch(() => presentAlert({ header: 'Erro', message: 'Erro ao carregar estados.', buttons: ['Ok'] }))
      .finally(() => setCarregando(false));
  }, []);

  const handleEstadoChange = async (uf: string) => {
    setForm((prev) => ({ ...prev, estado: uf, cidade: '' }));
    if (uf) {
      const cidades = await LocalidadeController.carregarMunicipios(uf);
      setListaCidades(cidades);
    } else {
      setListaCidades([]);
    }
  };

  const handleSubmit = async () => {
    const { nome, cpf, email, telefone, estado, cidade, bairro, rua, tipoLixo } = form;
    if (!nome || !cpf || !email || !telefone || !estado || !cidade || !bairro || !rua || !tipoLixo) {
      presentAlert({ header: 'Campos obrigatórios', message: 'Preencha todos os campos.', buttons: ['Ok'] });
      return;
    }
    setEnviando(true);
    try {
      await ColetaController.criarColeta(form);
      history.push('/confirmacao');
    } catch {
      presentAlert({ header: 'Erro', message: 'Não foi possível enviar. Verifique o servidor backend.', buttons: ['Ok'] });
    } finally {
      setEnviando(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.68)',
    border: '1px solid rgba(92,184,92,0.25)',
    borderRadius: 16,
    padding: '20px',
    backdropFilter: 'blur(8px)',
    marginBottom: 16,
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="Voltar" color="light" />
          </IonButtons>
          <IonTitle>Ecotrash</IonTitle>
          <IonButtons slot="end">
            <IonButton id="menu-cad">
              <IonIcon icon={ellipsisVertical} style={{ color: '#fff' }} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonPopover trigger="menu-cad" dismissOnSelect ref={popoverRef}>
        <MenuPopover onDismiss={() => popoverRef.current?.dismiss()} />
      </IonPopover>

      <IonContent>
        <div className="page-wrapper" style={{ padding: '20px 16px' }}>
          <div className="eco-slogan">LIXO seguro,<br />PLANETA feliz!</div>

          <div style={{ ...cardStyle, marginTop: 16 }}>
            <h2 style={{ color: '#5cb85c', fontWeight: 700, marginBottom: 16 }}>
              Solicitar Coleta — Dados Pessoais
            </h2>

            {carregando ? (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <IonSpinner color="primary" />
              </div>
            ) : (
              <>
                <IonItem>
                  <IonLabel position="stacked">Nome Completo</IonLabel>
                  <IonInput value={form.nome} placeholder="Seu nome completo"
                    onIonInput={(e) => setForm({ ...form, nome: e.detail.value! })} />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">CPF</IonLabel>
                  <IonInput value={form.cpf} placeholder="Apenas números" inputmode="numeric"
                    onIonInput={(e) => setForm({ ...form, cpf: e.detail.value! })} />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">E-mail</IonLabel>
                  <IonInput type="email" value={form.email} placeholder="seu@email.com"
                    onIonInput={(e) => setForm({ ...form, email: e.detail.value! })} />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Telefone</IonLabel>
                  <IonInput type="tel" value={form.telefone} placeholder="(79) 99999-9999"
                    onIonInput={(e) => setForm({ ...form, telefone: e.detail.value! })} />
                </IonItem>

                <div style={{ borderTop: '1px solid rgba(92,184,92,0.2)', margin: '16px 0', paddingTop: 16 }}>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 8 }}>
                    DETALHES DA COLETA
                  </p>
                </div>

                <IonItem>
                  <IonLabel position="stacked">Estado (UF)</IonLabel>
                  <IonSelect value={form.estado} placeholder="Selecione o estado..."
                    onIonChange={(e) => handleEstadoChange(e.detail.value)}>
                    {listaEstados.map((uf) => (
                      <IonSelectOption key={uf.sigla} value={uf.sigla}>{uf.nome}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Município</IonLabel>
                  <IonSelect value={form.cidade} placeholder={form.estado ? 'Selecione a cidade...' : 'Escolha o estado primeiro'}
                    disabled={!form.estado}
                    onIonChange={(e) => setForm({ ...form, cidade: e.detail.value })}>
                    {listaCidades.map((cidade) => (
                      <IonSelectOption key={cidade.id} value={cidade.nome}>{cidade.nome}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Bairro</IonLabel>
                  <IonInput value={form.bairro} placeholder="Nome do bairro"
                    onIonInput={(e) => setForm({ ...form, bairro: e.detail.value! })} />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Rua / Endereço</IonLabel>
                  <IonInput value={form.rua} placeholder="Rua e número"
                    onIonInput={(e) => setForm({ ...form, rua: e.detail.value! })} />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Tipo de Lixo</IonLabel>
                  <IonSelect value={form.tipoLixo} placeholder="Selecione o tipo..."
                    onIonChange={(e) => setForm({ ...form, tipoLixo: e.detail.value })}>
                    <IonSelectOption value="Lixo Comum">Lixo Comum</IonSelectOption>
                    <IonSelectOption value="Entulho">Entulho / Resto de Obra</IonSelectOption>
                    <IonSelectOption value="Reciclável">Reciclável (Plástico, Papel, Vidro)</IonSelectOption>
                    <IonSelectOption value="Eletrônico">Lixo Eletrônico (TVs, Pilhas, etc)</IonSelectOption>
                    <IonSelectOption value="Orgânico">Resíduos Orgânicos</IonSelectOption>
                    <IonSelectOption value="Móveis">Móveis Antigos / Sofás</IonSelectOption>
                  </IonSelect>
                </IonItem>

                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <IonButton expand="block" fill="outline" style={{ flex: 1, '--border-color': 'rgba(255,255,255,0.4)', '--color': '#fff', textTransform: 'none' }}
                    onClick={() => history.goBack()}>
                    Voltar
                  </IonButton>
                  <IonButton expand="block" className="btn-primary" style={{ flex: 1 }}
                    onClick={handleSubmit} disabled={enviando}>
                    {enviando ? <IonSpinner name="crescent" /> : 'Confirmar'}
                  </IonButton>
                </div>
              </>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Cadastro;
