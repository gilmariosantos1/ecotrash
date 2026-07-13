import { Link } from 'react-router-dom';

export default function Sobre() {
  return (
    <>
      <section className="intro">
        <h2>O que é a EcoTrash?</h2>
        <p>A EcoTrash é um projeto voltado para sustentabilidade que tem como objetivo levar a coleta de lixo em lugares onde geralmente esse serviço não chega.</p>

        <h2>Como funciona?</h2>
        <p>Em parceria com os municípios e autoridades locais a EcoTrash age como canal de comunicação entre os moradores e as autoridades competentes.</p>
      </section>

      <section className="beneficios">
        <h2>Quais são os benefícios desse projeto?</h2>
        <ul>
          <li>Descartar o lixo adequadamente evitando poluição e descarte a céu aberto</li>
          <li>Evitar a queima de lixo que gera emissão de gases poluentes</li>
          <li>Prevenir que animais silvestres sejam atraídos pelo lixo descartado de forma irregular</li>
          <li>Reciclar materiais que possam ser reutilizáveis</li>
        </ul>
      </section>

      <section className="solicitar">
        <h2>Como pedir que a coleta chegue até mim?</h2>
        <ol>
          <li>Vá em <Link to="/cadastro">Solicitar coleta</Link> na página inicial</li>
          <li>Verifique se o projeto está presente em sua cidade</li>
          <li>Preencha e envie o formulário</li>
          <li>Aguarde o contato das autoridades regionais para mais instruções</li>
        </ol>
      </section>
    </>
  );
}