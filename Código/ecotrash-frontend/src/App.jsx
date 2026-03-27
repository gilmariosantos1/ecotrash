import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Cadastro from './pages/Cadastro.jsx';
import Sobre from './pages/Sobre.jsx';
import Contato from './pages/Contato.jsx';
import Confirmacao from './pages/Confirmacao.jsx';

import PainelMunicipioLogin from './pages/PainelMunicipioLogin.jsx';
import PainelMunicipioLista from './pages/PainelMunicipioLista.jsx';
import PainelMunicipioDetalhes from './pages/PainelMunicipioDetalhes.jsx';
import RecuperarSenha from './pages/RecuperarSenha.jsx'; // 👈 AQUI: Importamos a nova página

import StatusLogin from './pages/StatusLogin.jsx';
import StatusLista from './pages/StatusLista.jsx';
import StatusDetalhes from './pages/StatusDetalhes.jsx';
import CadastroMunicipio from './pages/CadastroMunicipio.jsx';

export default function App() {
  return (
    <> 
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/confirmacao" element={<Confirmacao />} />

        <Route path="/municipio/login" element={<PainelMunicipioLogin />} />
        <Route path="/municipio/recuperar-senha" element={<RecuperarSenha />} /> {/* 👈 AQUI: Adicionamos a rota */}
        <Route path="/municipio/lista" element={<PainelMunicipioLista />} />
        <Route path="/municipio/detalhes/:id" element={<PainelMunicipioDetalhes />} />

        <Route path="/status/login" element={<StatusLogin />} />
        <Route path="/status/lista" element={<StatusLista />} />
        <Route path="/status/detalhes/:id" element={<StatusDetalhes />} />
        <Route path="/municipio/cadastro" element={<CadastroMunicipio />} />
      </Routes>
    </>
  );
}