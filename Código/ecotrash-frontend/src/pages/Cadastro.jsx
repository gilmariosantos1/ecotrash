import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Cadastro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '', cpf: '', dataNasc: '', email: '', telefone: '',
    estado: '', cidade: '', rua: '', bairro: '', complemento: '', genero: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envia os dados para o back-end (SQLite)
      await axios.post('http://localhost:5000/api/coletas', formData);
      navigate('/confirmacao'); // Redireciona para a tela de sucesso
    } catch (error) {
      alert("Erro ao enviar. Verifique se o servidor backend está rodando.");
    }
  };

  return (
    <>
      <div className="slogan">LIXO seguro,<br/>PLANETA feliz!</div>
      <div className="form-container">
        <h2>Preencha o formulário</h2>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados pessoais</legend>
            <label>Nome:</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
            <label>CPF:</label>
            <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required />
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </fieldset>
          
          <fieldset>
            <legend>Endereço</legend>
            <label>Cidade:</label>
            <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} required />
            <label>Bairro:</label>
            <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} required />
            <label>Rua:</label>
            <input type="text" name="rua" value={formData.rua} onChange={handleChange} required />
          </fieldset>
          
          <div className="btns">
            <button type="button" className="btn-back" onClick={() => navigate(-1)}>Voltar</button>
            <button type="submit" className="btn-submit">Enviar</button>
          </div>
        </form>
      </div>
    </>
  );
}