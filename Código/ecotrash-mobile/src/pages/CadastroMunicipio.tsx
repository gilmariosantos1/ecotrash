import React, { useEffect, useRef, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon, IonBackButton, IonPopover,
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonSpinner, useIonAlert,
} from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import MenuPopover from '../components/MenuPopover';
import MunicipioController from '../controllers/MunicipioController';
import LocalidadeController from '../controllers/LocalidadeController';
import { FormMunicipio, Estado, Cidade } from '../types';

const CadastroMunicipio: React.FC = () => {
  const history = useHistory();
  const popoverRef = useRef<HTMLIonPopoverElement>(null);
  const [presentAlert] = useIonAlert();
  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [listaEstados, setListaEstados] = useState<Estado[]>([]);
  const [listaCidades, setListaCidades] = useState<Cidade[]>([]);

  const [form, setForm] = useState<FormMunicipio>({
    emailOficial: '', senha: '', telefone: '', estado: '', cidade: '',
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
    const { emailOficial, senha, telefone, estado, cidade } = form;
    if (!emailOficial || !senha || !telefone || !estado || !cidade) {
      presentAlert({ header: 'Campos obrigatórios', message: 'Preencha todos os campos.', buttons: ['Ok'] });
      return;
    }
    setEnviando(true);
    try {
      await MunicipioController.cadastrar(form);
      presentAlert({
        header: 'Cadastro realizado!',
        message: 'Município cadastrado com sucesso! Já pode fazer o login.',
        buttons: [{ text: 'Ok', handler: () => history.push('/municipio/login') }],
      });
    } catch (error: any) {
      presentAlert({
        header: 'Erro',
        message: error?.response?.data?.erro || 'Não foi possível cadastrar o município.',
        buttons: ['Ok'],
      });
    } finally {
      setEnviando(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.68)',
    border: '1px solid rgba(92,184,92,0.25)',
    borderRadius: 16,
    padding: '24px 20px',
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
          <IonTitle style={{ textAlign: 'center', color: '#ffffff' }}>Ecotrash</IonTitle>
          <IonButtons slot="end">
            <IonButton id="menu-cm">
              <IonIcon icon={ellipsisVertical} style={{ color: '#fff' }} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonPopover trigger="menu-cm" dismissOnSelect ref={popoverRef}>
        <MenuPopover onDismiss={() => popoverRef.current?.dismiss()} />
      </IonPopover>

      <IonContent>
        <div className="page-wrapper" style={{ padding: '20px 16px' }}>
          {/* <div className="eco-slogan">LIXO seguro,<br />PLANETA feliz!</div>*/}

          {/* Localidade */}
          <div style={{ ...cardStyle, marginTop: 16 }}>
            <h2 style={{ color: '#5cb85c', fontWeight: 700, marginBottom: 16 }}>
              Cadastro Novo Município — Dados de Acesso
            </h2>

            {carregando ? (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <IonSpinner color="primary" />
              </div>
            ) : (
              <>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Localidade
                </p>

                <IonItem>
                  <IonLabel position="stacked">Localidade (Cidade/UF)</IonLabel>
                  <IonSelect
                    interfaceOptions={{ cssClass: 'meu-select-branco' }} /* <--- CLASSE ADICIONADA AQUI */
                    value={form.estado}
                    placeholder="Selecione o estado..."
                    onIonChange={(e) => handleEstadoChange(e.detail.value)}
                  >
                    {listaEstados.map((uf) => (
                      <IonSelectOption key={uf.sigla} value={uf.sigla}>{uf.nome}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Município</IonLabel>
                  <IonSelect
                    interfaceOptions={{ cssClass: 'meu-select-branco' }} /* <--- CLASSE ADICIONADA AQUI */
                    value={form.cidade}
                    placeholder={form.estado ? 'Selecione a cidade...' : 'Escolha o estado primeiro'}
                    disabled={!form.estado}
                    onIonChange={(e) => setForm({ ...form, cidade: e.detail.value })}
                  >
                    {listaCidades.map((cidade) => (
                      <IonSelectOption key={cidade.id} value={cidade.nome}>{cidade.nome}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>

                {/* Separador */}
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 20, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Dados de Acesso
                </p>

                <IonItem>
                  <IonLabel position="stacked">Login (E-mail da Prefeitura)</IonLabel>
                  <IonInput
                    type="email"
                    value={form.emailOficial}
                    placeholder="exemplo@cidade.se.gov.br"
                    onIonInput={(e) => setForm({ ...form, emailOficial: e.detail.value! })}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Senha</IonLabel>
                  <IonInput
                    type="password"
                    value={form.senha}
                    placeholder="Crie uma senha segura"
                    onIonInput={(e) => setForm({ ...form, senha: e.detail.value! })}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Telefone / WhatsApp (DDD)</IonLabel>
                  <IonInput
                    type="tel"
                    value={form.telefone}
                    placeholder="(00) 00000-0000"
                    onIonInput={(e) => setForm({ ...form, telefone: e.detail.value! })}
                  />
                </IonItem>

                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <IonButton
                    expand="block"
                    fill="outline"
                    style={{ flex: 1, '--border-color': 'rgba(255,255,255,0.4)', '--color': '#fff', textTransform: 'none' }}
                    onClick={() => history.goBack()}
                  >
                    Voltar
                  </IonButton>
                  <IonButton
                    expand="block"
                    className="btn-primary"
                    style={{ flex: 1 }}
                    onClick={handleSubmit}
                    disabled={enviando}
                  >
                    {enviando ? <IonSpinner name="crescent" /> : 'Cadastrar'}
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

export default CadastroMunicipio;