import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function CadastroMunicipio() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    emailOficial: '', senha: '', telefone: '', estado: '', cidade: ''
  });

  const [listaEstados, setListaEstados] = useState([]);
  const [listaCidades, setListaCidades] = useState([]);

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => setListaEstados(response.data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEstadoChange = async (e) => {
    const uf = e.target.value;
    setFormData({ ...formData, estado: uf, cidade: '' });
    if (uf) {
      const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
      setListaCidades(response.data);
    } else {
      setListaCidades([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/municipios', formData);
      alert("Município cadastrado com sucesso! Já pode fazer o login.");
      navigate('/municipio/login'); 
    } catch (error) {
      alert(error.response?.data?.erro || "Erro ao cadastrar.");
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
                <label>Município:</label>
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