import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MunicipioController from '../controllers/MunicipioController';
import LocalidadeController from '../controllers/LocalidadeController';

export default function CadastroMunicipio() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    emailOficial: '', senha: '', telefone: '', estado: '', cidade: ''
  });

  const [listaEstados, setListaEstados] = useState([]);
  const [listaCidades, setListaCidades] = useState([]);

  useEffect(() => {
    LocalidadeController.carregarEstados()
      .then(setListaEstados)
      .catch(() => alert('Erro ao carregar a lista de estados.'));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEstadoChange = async (e) => {
    const uf = e.target.value;
    setFormData({ ...formData, estado: uf, cidade: '' });
    const municipios = await LocalidadeController.carregarMunicipios(uf);
    setListaCidades(municipios);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await MunicipioController.cadastrar(formData);
      alert('Município cadastrado com sucesso! Já pode fazer o login.');
      navigate('/municipio/login');
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao cadastrar.');
    }
  };

  return (
    <>
      <div className="slogan">LIXO seguro,<br/>PLANETA feliz!</div>
      <div className="form-container">
        <h2>Cadastro de Novo Município / Parceiro</h2>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Localidade</legend>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label>Estado (UF):</label>
                <select name="estado" value={formData.estado} onChange={handleEstadoChange} required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #bbb' }}>
                  <option value="">Selecione...</option>
                  {listaEstados.map(uf => (
                    <option key={uf.sigla} value={uf.sigla}>{uf.nome}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 2 }}>
                <select name="cidade" value={formData.cidade} onChange={handleChange} required disabled={!formData.estado} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #bbb' }}>
                  <option value="">{formData.estado ? 'Selecione a cidade...' : 'Escolha o estado primeiro'}</option>
                  {listaCidades.map(cidade => (
                    <option key={cidade.id} value={cidade.nome}>{cidade.nome}</option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Dados de Acesso</legend>
            <label>E-mail Oficial (Prefeitura):</label>
            <input type="email" name="emailOficial" value={formData.emailOficial} onChange={handleChange} required placeholder="exemplo@cidade.se.gov.br" />
            
            <label>Telefone / WhatsApp Setor:</label>
            <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} required placeholder="(00) 00000-0000" />

            <label>Criar Senha de Acesso:</label>
            <input type="password" name="senha" value={formData.senha} onChange={handleChange} required placeholder="Digite uma senha segura" />
          </fieldset>
          
          <div className="btns">
            <button type="button" className="btn-back" onClick={() => navigate(-1)}>Voltar</button>
            <button type="submit" className="btn-submit">Finalizar Cadastro</button>
          </div>
        </form>
      </div>
    </>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MunicipioController from '../controllers/MunicipioController';
import LocalidadeController from '../controllers/LocalidadeController';

export default function CadastroMunicipio() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    emailOficial: '', senha: '', telefone: '', estado: '', cidade: ''
  });

  const [listaEstados, setListaEstados] = useState([]);
  const [listaCidades, setListaCidades] = useState([]);
  const [filteredCidades, setFilteredCidades] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(false);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [buscaCidade, setBuscaCidade] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregarEstados = async () => {
      setLoadingEstados(true);
      setErro('');
      try {
        const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
        setListaEstados(response.data);
      } catch (error) {
        setErro('Erro ao carregar estados. Tente novamente.');
        console.error('Erro ao carregar estados:', error);
      } finally {
        setLoadingEstados(false);
      }
    };
    carregarEstados();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEstadoChange = async (e) => {
    const uf = e.target.value;
    setFormData({ ...formData, estado: uf, cidade: '' });
    setBuscaCidade('');
    setFilteredCidades([]);
    setErro('');
    
    if (uf) {
      setLoadingCidades(true);
      try {
        const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
        setListaCidades(response.data);
        setFilteredCidades(response.data);
      } catch (error) {
        setErro('Erro ao carregar cidades. Tente novamente.');
        console.error('Erro ao carregar cidades:', error);
      } finally {
        setLoadingCidades(false);
      }
    } else {
      setListaCidades([]);
      setFilteredCidades([]);
    }
  };

  // Filtrar cidades conforme o usuário digita
  const handleBuscaCidade = (e) => {
    const texto = e.target.value.toLowerCase();
    setBuscaCidade(texto);
    if (texto) {
      setFilteredCidades(listaCidades.filter(cidade => 
        cidade.nome.toLowerCase().includes(texto)
      ));
    } else {
      setFilteredCidades(listaCidades);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await MunicipioController.cadastrar(formData);
      alert('Município cadastrado com sucesso! Já pode fazer o login.');
      navigate('/municipio/login');
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao cadastrar.');
    }
  };

  return (
    <>
      <div className="slogan">LIXO seguro,<br/>PLANETA feliz!</div>
      <div className="form-container">
        <h2>Cadastro de Novo Município / Parceiro</h2>
        {erro && <div style={{ padding: '10px', marginBottom: '15px', backgroundColor: '#fee', color: '#c00', borderRadius: '6px', border: '1px solid #fcc' }}>{erro}</div>}
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Localidade</legend>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label>Estado (UF):</label>
                <select name="estado" value={formData.estado} onChange={handleEstadoChange} required disabled={loadingEstados} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #bbb' }}>
                  <option value="">{loadingEstados ? 'Carregando...' : 'Selecione...'}</option>
                  {listaEstados.map(uf => (
                    <option key={uf.sigla} value={uf.sigla}>{uf.nome}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 2 }}>
                <label>Município:</label>
                {formData.estado && !loadingCidades && (
                  <input 
                    type="text" 
                    placeholder="Buscar cidade..." 
                    value={buscaCidade}
                    onChange={handleBuscaCidade}
                    style={{ width: '100%', padding: '10px', marginTop: '5px', marginBottom: '8px', borderRadius: '6px', border: '1px solid #bbb' }}
                  />
                )}
                <select name="cidade" value={formData.cidade} onChange={handleChange} required disabled={!formData.estado || loadingCidades} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #bbb' }}>
                  <option value="">{loadingCidades ? 'Carregando cidades...' : formData.estado ? 'Selecione a cidade...' : 'Escolha o estado primeiro'}</option>
                  {filteredCidades.map(cidade => (
                    <option key={cidade.id} value={cidade.nome}>{cidade.nome}</option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Dados de Acesso</legend>
            <label>E-mail Oficial (Prefeitura):</label>
            <input type="email" name="emailOficial" value={formData.emailOficial} onChange={handleChange} required placeholder="exemplo@cidade.se.gov.br" />
            
            <label>Telefone / WhatsApp Setor:</label>
            <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} required placeholder="(00) 00000-0000" />

            <label>Criar Senha de Acesso:</label>
            <input type="password" name="senha" value={formData.senha} onChange={handleChange} required placeholder="Digite uma senha segura" />
          </fieldset>
          
          <div className="btns">
            <button type="button" className="btn-back" onClick={() => navigate(-1)}>Voltar</button>
            <button type="submit" className="btn-submit">Finalizar Cadastro</button>
          </div>
        </form>
      </div>
    </>
  );
}
