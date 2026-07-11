import React from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect, Switch } from 'react-router-dom';

import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Sobre from './pages/Sobre';
import Contato from './pages/Contato';
import Confirmacao from './pages/Confirmacao';
import PainelMunicipioLogin from './pages/PainelMunicipioLogin';
import PainelMunicipioLista from './pages/PainelMunicipioLista';
import PainelMunicipioDetalhes from './pages/PainelMunicipioDetalhes';
import RecuperarSenha from './pages/RecuperarSenha';
import StatusLogin from './pages/StatusLogin';
import StatusLista from './pages/StatusLista';
import StatusDetalhes from './pages/StatusDetalhes';
import CadastroMunicipio from './pages/CadastroMunicipio';

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Switch>
            {/* Rota raiz */}
            <Route exact path="/" component={Home} />

            {/* Rotas do cidadão */}
            <Route exact path="/cadastro" component={Cadastro} />
            <Route exact path="/confirmacao" component={Confirmacao} />
            <Route exact path="/sobre" component={Sobre} />
            <Route exact path="/contato" component={Contato} />

            {/* Rotas de status do requerimento (cidadão) */}
            <Route exact path="/status/login" component={StatusLogin} />
            <Route exact path="/status/lista" component={StatusLista} />
            <Route exact path="/status/detalhes/:id" component={StatusDetalhes} />

            {/* Rotas do painel do município */}
            <Route exact path="/municipio/login" component={PainelMunicipioLogin} />
            <Route exact path="/municipio/recuperar-senha" component={RecuperarSenha} />
            <Route exact path="/municipio/cadastro" component={CadastroMunicipio} />
            <Route exact path="/municipio/lista" component={PainelMunicipioLista} />
            <Route exact path="/municipio/detalhes/:id" component={PainelMunicipioDetalhes} />

            {/* Redireciona qualquer rota desconhecida para home */}
            <Redirect to="/" />
          </Switch>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
