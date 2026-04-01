import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import coletaService from '../services/coletaService';

export default function Cadastro() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nome: '', cpf: '', email: '', telefone: '',
    estado: '', cidade: '', bairro: '', rua: '', tipoLixo: ''
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
      await coletaService.criar(formData);
      navigate('/confirmacao'); 
    } catch (error) {
      alert("Erro ao enviar. Verifique se o servidor backend está rodando.");
    }
  };

  return (
    <>
      <div className="slogan">LIXO seguro,<br/>PLANETA feliz!</div>
      <div className="form-container">
        <h2>Solicitar Coleta</h2>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados pessoais</legend>
            <label>Nome:</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
            
            <label>CPF:</label>
            <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required />
            
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label>Telefone:</label>
            <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(79) 99999-9999" required />
          </fieldset>
          
          <fieldset>
            <legend>Detalhes da Coleta</legend>
            
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
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

            <label>Bairro:</label>
            <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} required />
            
            <label>Rua:</label>
            <input type="text" name="rua" value={formData.rua} onChange={handleChange} required />

            <label>Tipo de Lixo:</label>
            <select name="tipoLixo" value={formData.tipoLixo} onChange={handleChange} required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #bbb' }}>
              <option value="">Selecione o tipo...</option>
              <option value="Lixo Comum">Lixo Comum</option>
              <option value="Entulho">Entulho / Resto de Obra</option>
              <option value="Reciclável">Reciclável (Plástico, Papel, Vidro)</option>
              <option value="Eletrônico">Lixo Eletrônico (TVs, Pilhas, etc)</option>
              <option value="Orgânico">Resíduos Orgânicos</option>
              <option value="Móveis">Móveis Antigos / Sofás</option>
            </select>
          </fieldset>
          
          <div className="btns">
            <button type="button" className="btn-back" onClick={() => navigate(-1)}>Voltar</button>
            <button type="submit" className="btn-submit">Enviar Pedido</button>
          </div>
        </form>
      </div>
    </>
  );
}
