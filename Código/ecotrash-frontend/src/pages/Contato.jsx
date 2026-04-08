import { useState } from 'react';
import MensagemController from '../controllers/MensagemController';

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: '', email: '', assunto: '', mensagem: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await MensagemController.enviar(formData);
      alert(`Obrigado pelo contacto, ${formData.nome}! A sua mensagem sobre "${formData.assunto}" foi enviada com sucesso para a nossa equipa.`);
      setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
    } catch {
      alert('Erro ao enviar a mensagem. Verifique se o servidor está ligado.');
    }
  };

  return (
    <>
      <header className="contact-header">
        <h1>Entre em contacto connosco</h1>
      </header>

      <main>
        <section className="mensagem">
          <h3>🌱 EcoTrash</h3>
          <p>
            Se quer trazer o projeto para a sua cidade, ser voluntário ou ajudar com ideias, 
            fale connosco pelos contactos abaixo ou utilize o nosso formulário. Toda a ajuda e sugestão é bem-vinda! 
          </p>
          <p>
            Juntos podemos cuidar da Terra e trazer mais qualidade de vida à população.
          </p>
          
          <hr style={{ margin: '25px 0', border: 'none', borderTop: '1px solid #ddd' }} />

          <ul style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', fontWeight: 'bold', listStyle: 'none', padding: 0, margin: 0, color: '#333' }}>
            <li>✉️ contacto@ecotrash.com.br</li>
            <li>📞 (79) 9999-9999</li>
            <li>📸 @Eco_Trash</li>
          </ul>
        </section>

        <section className="form-container" style={{ marginTop: '30px' }}>
          <h2>Envie uma Mensagem</h2>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend>Formulário de Contacto</legend>
              
              <label>Nome Completo:</label>
              <input type="text" name="nome" value={formData.nome} onChange={handleChange} required placeholder="Como podemos tratá-lo?" />

              <label>E-mail:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="O seu melhor e-mail" />

              <label>Assunto:</label>
              <select name="assunto" value={formData.assunto} onChange={handleChange} required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #bbb' }}>
                <option value="">Selecione um assunto...</option>
                <option value="Dúvida">Dúvida</option>
                <option value="Sugestão">Sugestão de Melhoria</option>
                <option value="Reclamação">Reclamação</option>
                <option value="Parceria">Quero ser Parceiro / Voluntário</option>
                <option value="Prefeitura">Sou da Prefeitura e quero o projeto</option>
              </select>

              <label>Mensagem:</label>
              <textarea name="mensagem" value={formData.mensagem} onChange={handleChange} required rows="5" placeholder="Escreva os detalhes aqui..." style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '6px', border: '1px solid #bbb', resize: 'vertical', fontFamily: 'inherit' }}></textarea>
            </fieldset>
            
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button type="submit" className="btn-submit" style={{ width: '100%', fontSize: '16px', padding: '12px' }}>Enviar Mensagem</button>
            </div>
          </form>
        </section>
      </main>

      <footer style={{ textAlign: 'center', padding: '30px', color: '#fff', background: '#2e7d32', marginTop: '60px' }}>
        <p>&copy; 2026 EcoTrash - Nossa Senhora da Glória, SE</p>
      </footer>
    </>
  );
}
