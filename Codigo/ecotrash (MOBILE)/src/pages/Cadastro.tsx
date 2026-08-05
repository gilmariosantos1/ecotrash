import React, { useState, useEffect, useRef } from 'react';
import {
  IonPage, IonContent, IonButton, IonIcon,
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  useIonAlert, IonSpinner, IonModal, IonHeader, IonToolbar,
  IonTitle, IonButtons,
} from '@ionic/react';
import { cameraOutline, mapOutline, locationOutline, closeOutline, trashOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import EcoHeader from '../components/EcoHeader';
import MapaPicker, { DadosLocalMapa } from '../components/MapaPicker';
import ColetaController from '../controllers/ColetaController';
import LocalidadeController from '../controllers/LocalidadeController';
import { FormColeta, Estado, Cidade } from '../types';

/* Chave para salvar dados pessoais no localStorage */
const STORAGE_KEY = 'ecotrash_cidadao_dados';

const Cadastro: React.FC = () => {
  const history = useHistory();
  const [presentAlert] = useIonAlert();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [listaEstados, setListaEstados] = useState<Estado[]>([]);
  const [listaCidades, setListaCidades] = useState<Cidade[]>([]);
  const [localMarcado, setLocalMarcado] = useState(false);

  /* Estado da foto */
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const [form, setForm] = useState<FormColeta>({
    nome: '', cpf: '', email: '', telefone: '',
    estado: '', cidade: '', bairro: '', rua: '', tipoLixo: '',
  });

  /* ── Carregar dados salvos + estados ao abrir ── */
  useEffect(() => {
    setCarregando(true);

    /* Restaurar dados pessoais salvos */
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (salvo) {
        const parsed: Partial<FormColeta> = JSON.parse(salvo);
        setForm((prev) => ({ ...prev, ...parsed }));
        /* Carregar cidades do estado salvo */
        if (parsed.estado) {
          LocalidadeController.carregarMunicipios(parsed.estado).then(setListaCidades);
        }
      }
    } catch { /* ignora erro de parse */ }

    LocalidadeController.carregarEstados()
      .then(setListaEstados)
      .catch(() => presentAlert({ header: 'Erro', message: 'Erro ao carregar estados.', buttons: ['Ok'] }))
      .finally(() => setCarregando(false));
  }, []);

  /* ── Mudar estado → recarregar cidades ── */
  const handleEstadoChange = async (uf: string) => {
    setForm((prev) => ({ ...prev, estado: uf, cidade: '' }));
    if (uf) {
      const cidades = await LocalidadeController.carregarMunicipios(uf);
      setListaCidades(cidades);
    } else {
      setListaCidades([]);
    }
  };

  /* ── Foto selecionada via input[file] ── */
  const handleFotoSelecionada = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      presentAlert({ header: 'Foto muito grande', message: 'Máximo permitido: 8 MB.', buttons: ['Ok'] });
      return;
    }
    setFotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setFotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removerFoto = () => {
    setFotoFile(null);
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ── Confirmar local no mapa ── */
  const handleMapaConfirmar = (dados: DadosLocalMapa) => {
    setForm((prev) => ({
      ...prev,
      rua:       dados.rua  || prev.rua,
      bairro:    dados.bairro || prev.bairro,
      latitude:  dados.lat,
      longitude: dados.lng,
    }));
    setLocalMarcado(true);
    setMostrarMapa(false);
  };

  /* ── Enviar ── */
  const handleSubmit = async () => {
    const { nome, cpf, email, telefone, estado, cidade, bairro, rua, tipoLixo } = form;
    if (!nome || !cpf || !email || !telefone || !estado || !cidade || !bairro || !rua || !tipoLixo) {
      presentAlert({ header: 'Campos obrigatórios', message: 'Preencha todos os campos antes de enviar.', buttons: ['Ok'] });
      return;
    }

    setEnviando(true);
    try {
      await ColetaController.criarColeta(form, fotoFile);

      /* Salvar dados pessoais para próximo uso */
      const dadosPessoais = { nome, cpf, email, telefone, estado, cidade, bairro, rua };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosPessoais));

      history.push('/confirmacao');
    } catch {
      presentAlert({ header: 'Erro', message: 'Não foi possível enviar. Verifique o servidor backend.', buttons: ['Ok'] });
    } finally {
      setEnviando(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.75)',
    border: '1px solid rgba(92,184,92,0.25)',
    borderRadius: 16, padding: '20px',
    backdropFilter: 'blur(8px)', marginBottom: 16,
  };

  return (
    <IonPage>
      <EcoHeader backTo="/" />

      {/* Modal do Mapa */}
      <IonModal isOpen={mostrarMapa} onDidDismiss={() => setMostrarMapa(false)}>
        <IonHeader>
          <IonToolbar style={{ '--background': 'rgba(10,30,10,0.98)' }}>
            <IonTitle style={{ color: '#5cb85c' }}>Marcar Local no Mapa</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setMostrarMapa(false)}>
                <IonIcon icon={closeOutline} style={{ color: '#fff' }} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <MapaPicker onConfirmar={handleMapaConfirmar} onCancelar={() => setMostrarMapa(false)} />
      </IonModal>

      <IonContent>
        <div className="page-wrapper" style={{ padding: '20px 16px' }}>
          <div style={{ ...cardStyle, marginTop: 16 }}>
            <h2 style={{ color: '#5cb85c', fontWeight: 700, marginBottom: 16 }}>
              Solicitar Coleta
            </h2>

            {carregando ? (
              <div style={{ textAlign: 'center', padding: 20 }}><IonSpinner color="primary" /></div>
            ) : (
              <>
                {/* ── DADOS PESSOAIS ── */}
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Dados Pessoais
                </p>

                <IonItem><IonLabel position="stacked">Nome Completo</IonLabel>
                  <IonInput value={form.nome} placeholder="Seu nome completo"
                    onIonInput={(e) => setForm({ ...form, nome: e.detail.value! })} /></IonItem>

                <IonItem><IonLabel position="stacked">CPF</IonLabel>
                  <IonInput value={form.cpf} placeholder="Apenas números" inputmode="numeric"
                    onIonInput={(e) => setForm({ ...form, cpf: e.detail.value! })} /></IonItem>

                <IonItem><IonLabel position="stacked">E-mail</IonLabel>
                  <IonInput type="email" value={form.email} placeholder="seu@email.com"
                    onIonInput={(e) => setForm({ ...form, email: e.detail.value! })} /></IonItem>

                <IonItem><IonLabel position="stacked">Telefone</IonLabel>
                  <IonInput type="tel" value={form.telefone} placeholder="(79) 99999-9999"
                    onIonInput={(e) => setForm({ ...form, telefone: e.detail.value! })} /></IonItem>

                {/* ── LOCALIZAÇÃO ── */}
                <div style={{ borderTop: '1px solid rgba(92,184,92,0.2)', margin: '16px 0', paddingTop: 16 }}>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Localização
                  </p>

                  {/* Botão Mapa */}
                  <IonButton expand="block" fill="outline" onClick={() => setMostrarMapa(true)}
                    style={{ marginBottom: 12, '--border-color': localMarcado ? '#5cb85c' : 'rgba(92,184,92,0.45)', '--color': localMarcado ? '#5cb85c' : 'rgba(255,255,255,0.7)', textTransform: 'none' }}>
                    <IonIcon icon={localMarcado ? locationOutline : mapOutline} slot="start" />
                    {localMarcado ? ' Local marcado — Alterar' : ' Marcar no Mapa (opcional)'}
                  </IonButton>
                </div>

                <IonItem><IonLabel position="stacked">Estado (UF)</IonLabel>
                  <IonSelect interfaceOptions={{ cssClass: 'meu-select-branco' }}
                    value={form.estado} placeholder="Selecione o estado..."
                    onIonChange={(e) => handleEstadoChange(e.detail.value)}>
                    {listaEstados.map((uf) => (
                      <IonSelectOption key={uf.sigla} value={uf.sigla}>{uf.nome}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>

                <IonItem><IonLabel position="stacked">Município</IonLabel>
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

                <IonItem><IonLabel position="stacked">Bairro</IonLabel>
                  <IonInput value={form.bairro} placeholder="Nome do bairro"
                    onIonInput={(e) => setForm({ ...form, bairro: e.detail.value! })} /></IonItem>

                <IonItem><IonLabel position="stacked">Rua / Endereço</IonLabel>
                  <IonInput value={form.rua} placeholder="Rua e número"
                    onIonInput={(e) => setForm({ ...form, rua: e.detail.value! })} /></IonItem>

                {/* ── TIPO DE LIXO ── */}
                <IonItem><IonLabel position="stacked">Tipo de Lixo / Entulho</IonLabel>
                  <IonSelect interfaceOptions={{ cssClass: 'meu-select-branco' }}
                    value={form.tipoLixo} placeholder="Selecione o tipo..."
                    onIonChange={(e) => setForm({ ...form, tipoLixo: e.detail.value })}>
                    <IonSelectOption value="Lixo Comum">Lixo Comum</IonSelectOption>
                    <IonSelectOption value="Entulho">Entulho / Resto de Obra</IonSelectOption>
                    <IonSelectOption value="Reciclável">Reciclável (Plástico, Papel, Vidro)</IonSelectOption>
                    <IonSelectOption value="Eletrônico">Lixo Eletrônico (TVs, Pilhas)</IonSelectOption>
                    <IonSelectOption value="Orgânico">Resíduos Orgânicos</IonSelectOption>
                    <IonSelectOption value="Móveis">Móveis Antigos / Sofás</IonSelectOption>
                  </IonSelect>
                </IonItem>

                {/* ── FOTO DO LIXO ── */}
                <div style={{ borderTop: '1px solid rgba(92,184,92,0.2)', margin: '16px 0', paddingTop: 16 }}>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    Foto do Lixo / Entulho
                  </p>

                  {/* Input de arquivo oculto */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={handleFotoSelecionada}
                  />

                  {fotoPreview ? (
                    /* Preview da foto */
                    <div style={{ position: 'relative', marginBottom: 8 }}>
                      <img
                        src={fotoPreview}
                        alt="Foto do lixo"
                        style={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 10, border: '1px solid rgba(92,184,92,0.35)' }}
                      />
                      <IonButton
                        size="small" fill="solid"
                        style={{ position: 'absolute', top: 8, right: 8, '--background': 'rgba(235,68,90,0.85)', '--color': '#fff', borderRadius: 8 }}
                        onClick={removerFoto}>
                        <IonIcon icon={trashOutline} />
                      </IonButton>
                      <IonButton expand="block" fill="outline" size="small"
                        style={{ marginTop: 8, '--border-color': 'rgba(92,184,92,0.5)', '--color': '#5cb85c', textTransform: 'none' }}
                        onClick={() => fileInputRef.current?.click()}>
                        <IonIcon icon={cameraOutline} slot="start" />Trocar foto
                      </IonButton>
                    </div>
                  ) : (
                    /* Botão para tirar foto */
                    <IonButton expand="block" fill="outline"
                      style={{ '--border-color': 'rgba(92,184,92,0.45)', '--color': 'rgba(255,255,255,0.7)', textTransform: 'none' }}
                      onClick={() => fileInputRef.current?.click()}>
                      <IonIcon icon={cameraOutline} slot="start" />
                      Tirar Foto / Escolher da Galeria
                    </IonButton>
                  )}

                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginTop: 6, textAlign: 'center' }}>
                    Foto opcional — ajuda a prefeitura a entender o caso (máx. 8 MB)
                  </p>
                </div>

                {/* ── BOTÕES ── */}
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <IonButton expand="block" fill="outline"
                    style={{ flex: 1, '--border-color': 'rgba(255,255,255,0.4)', '--color': '#fff', textTransform: 'none' }}
                    onClick={() => history.push('/')}>Voltar</IonButton>
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
