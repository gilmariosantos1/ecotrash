export default function Contato() {
  return (
    <>
      <header className="contact-header">
        <h1>Entre em contato com a gente</h1>
      </header>

      <main>
        <section className="mensagem">
          <h3>🌱 EcoTrash</h3>
          <p>
            Se você quer trazer o projeto para sua cidade, ser voluntário ou ajudar com ideias, 
            fale conosco pelos contatos abaixo. Toda ajuda e sugestão é bem-vinda! 
          </p>
          <p>
            Juntos podemos cuidar da Terra e trazer mais qualidade de vida à população.
          </p>
        </section>

        <section className="contatos">
          <h2>Contatos</h2>
          <ul>
            <li><i className="fab fa-twitter"></i> @EcoTrash</li>
            <li><i className="fab fa-instagram"></i> @Eco_Trash</li>
            <li><i className="fas fa-envelope"></i> contato@ecotrash.com.br</li>
            <li><i className="fas fa-phone-alt"></i> (79) 9999-9999</li>
          </ul>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 EcoTrash</p>
      </footer>
    </>
  );
}