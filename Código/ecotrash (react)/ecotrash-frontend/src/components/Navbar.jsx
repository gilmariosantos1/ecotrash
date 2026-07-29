import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav>
      {/* Transformamos a logo em um Link clicável. O style tira o sublinhado padrão de links */}
      <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
        EcoTrash
      </Link>
      
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/sobre">Sobre o projeto</Link></li>
        <li><Link to="/contato">Fale Conosco</Link></li>
      </ul>
    </nav>
  );
}