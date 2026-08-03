import React, { useEffect, useState } from 'react';
import {
  IonPage, IonContent, IonButton, IonIcon,
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonSpinner, useIonAlert,
} from '@ionic/react';
import { lockClosedOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import EcoHeader from '../components/EcoHeader';
import MunicipioController from '../controllers/MunicipioController';
import LocalidadeController from '../controllers/LocalidadeController';
import { FormMunicipio, Estado, Cidade } from '../types';

const CadastroMunicipio: React.FC = () => {
  const history = useHistory();
  const [presentAlert] = useIonAlert();
  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [listaEstados, setListaEstados] = useState<Estado[]>([]);
  const [listaCidades, setListaCidades] = useState<Cidade[]>([]);

  const [form, setForm] = useState<FormMunicipio>({
    emailOficial: '', senha: '', telefone: '',
    estado: '', cidade: '',
    codigoAdmin: '', // campo obrigatório — apenas municípios autorizados têm o código
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
    const { emailOficial, senha, telefone, estado, cidade, codigoAdmin } = form;
    if (!emailOficial || !senha || !telefone || !estado || !cidade || !codigoAdmin) {
      presentAlert({ header: 'Campos obrigatórios', message: 'Preencha todos os campos, incluindo o Código de Autorização.', buttons: ['Ok'] });
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
      const msg = error?.response?.data?.erro || 'Não foi possível cadastrar.';
      presentAlert({ header: 'Erro', message: msg, buttons: ['Ok'] });
    } finally {
      setEnviando(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.75)',
    border: '1px solid rgba(92,184,92,0.25)',
    borderRadius: 16,
    padding: '24px 20px',
    backdropFilter: 'blur(8px)',
    marginBottom: 16,
  };

  return (
    <IonPage>
      <EcoHeader backTo="/municipio/login" />

      <IonContent>
        <div className="page-wrapper" style={{ padding: '20px 16px' }}>
          <div style={{ ...cardStyle, marginTop: 16 }}>
            <h2 style={{ color: '#5cb85c', fontWeight: 700, marginBottom: 8 }}>
              Cadastro Novo Município
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, marginBottom: 20 }}>
              Apenas prefeituras parceiras autorizadas pela equipe EcoTrash podem se cadastrar.
              Entre em contato pelo Fale Conosco para obter o código de autorização.
            </p>

            {carregando ? (
              <div style={{ textAlign: 'center', padding: 20 }}><IonSpinner color="primary" /></div>
            ) : (
              <>
                {/* --- CÓDIGO DE AUTORIZAÇÃO --- */}
                <div style={{ background: 'rgba(92,184,92,0.08)', border: '1px solid rgba(92,184,92,0.3)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <IonIcon icon={lockClosedOutline} style={{ color: '#5cb85c', fontSize: 18 }} />
                    <span style={{ color: '#5cb85c', fontWeight: 600, fontSize: 14 }}>Código de Autorização</span>
                  </div>
                  <IonItem style={{ '--background': 'rgba(0,0,0,0.3)', '--border-radius': '8px' }}>
                    <IonInput
                      type="password"
                      value={form.codigoAdmin}
                      placeholder="Código fornecido pela equipe EcoTrash"
                      onIonInput={(e) => setForm({ ...form, codigoAdmin: e.detail.value! })}
                    />
                  </IonItem>
                </div>

                {/* --- LOCALIDADE --- */}
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Localidade</p>

                <IonItem>
                  <IonLabel position="stacked">Estado (UF)</IonLabel>
                  <IonSelect interfaceOptions={{ cssClass: 'meu-select-branco' }}
                    value={form.estado} placeholder="Selecione o estado..."
                    onIonChange={(e) => handleEstadoChange(e.detail.value)}>
                    {listaEstados.map((uf) => (
                      <IonSelectOption key={uf.sigla} value={uf.sigla}>{uf.nome}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Município</IonLabel>
                  <IonSelect interfaceOptions={{ cssClass: 'meu-select-branco' }}
                    value={form.cidade}
                    placeholder={form.estado ? 'Selecione a cidade...' : 'Escolha o estado primeiro'}
                    disabled={!form.estado}
                    onIonChange={(e) => setForm({ ...form, cidade: e.detail.value })}>
                    {listaCidades.map((c) => (
                      <IonSelectOption key={c.id} value={c.nome}>{c.nome}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>

                {/* --- DADOS DE ACESSO --- */}
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 20, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Dados de Acesso</p>

                <IonItem>
                  <IonLabel position="stacked">Login (E-mail da Prefeitura)</IonLabel>
                  <IonInput type="email" value={form.emailOficial} placeholder="exemplo@cidade.se.gov.br"
                    onIonInput={(e) => setForm({ ...form, emailOficial: e.detail.value! })} />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Senha</IonLabel>
                  <IonInput type="password" value={form.senha} placeholder="Crie uma senha segura"
                    onIonInput={(e) => setForm({ ...form, senha: e.detail.value! })} />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Telefone / WhatsApp (DDD)</IonLabel>
                  <IonInput type="tel" value={form.telefone} placeholder="(00) 00000-0000"
                    onIonInput={(e) => setForm({ ...form, telefone: e.detail.value! })} />
                </IonItem>

                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  <IonButton expand="block" fill="outline"
                    style={{ flex: 1, '--border-color': 'rgba(255,255,255,0.4)', '--color': '#fff', textTransform: 'none' }}
                    onClick={() => history.push('/municipio/login')}>
                    Voltar
                  </IonButton>
                  <IonButton expand="block" className="btn-primary" style={{ flex: 1 }}
                    onClick={handleSubmit} disabled={enviando}>
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
