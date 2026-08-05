import React, { useEffect, useState } from 'react';

interface Props { onDone: () => void; }

/* Logo EcoTrash como SVG inline — não depende de nenhum arquivo em public/ */
const LogoSVG = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Folha grande (esquerda) */}
    <path d="M28 62 C18 50 14 32 22 14 C30 24 32 46 28 62Z" fill="#5cb85c" opacity="0.95"/>
    <path d="M28 62 C24 46 20 28 22 14" stroke="#2d6a2d" strokeWidth="1.5" fill="none" opacity="0.5"/>
    {/* Tronco da árvore */}
    <rect x="38" y="34" width="5" height="20" rx="2" fill="#8B5E3C"/>
    {/* Galhos */}
    <path d="M40 40 C37 36 32 30 27 26" stroke="#8B5E3C" strokeWidth="3" strokeLinecap="round" fill="none"/>
    <path d="M40 40 C43 35 49 29 54 26" stroke="#8B5E3C" strokeWidth="3" strokeLinecap="round" fill="none"/>
    {/* Folhinhas da árvore */}
    <circle cx="25" cy="24" r="7" fill="#5cb85c"/>
    <circle cx="17" cy="19" r="5" fill="#4aaa4a"/>
    <circle cx="55" cy="23" r="6" fill="#5cb85c"/>
    <circle cx="63" cy="18" r="5" fill="#4aaa4a"/>
    <circle cx="40" cy="18" r="7" fill="#6dd06d"/>
    <circle cx="32" cy="16" r="4" fill="#5cb85c"/>
    <circle cx="48" cy="16" r="4" fill="#5cb85c"/>
    {/* Lixeira — corpo */}
    <path d="M24 54 L27 72 L53 72 L56 54 Z" fill="#1e4d30"/>
    {/* Lixeira — borda superior */}
    <rect x="22" y="51" width="36" height="5" rx="2.5" fill="#5cb85c"/>
    {/* Símbolo reciclagem */}
    <text x="40" y="68" textAnchor="middle" fontSize="13" fill="rgba(255,255,255,0.9)" fontFamily="Arial">♻</text>
  </svg>
);

const SplashOverlay: React.FC<Props> = ({ onDone }) => {
  const [saindo, setSaindo] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setSaindo(true), 2300);
    const doneTimer = setTimeout(() => onDone(), 2800);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  const skip = () => { setSaindo(true); setTimeout(onDone, 400); };

  return (
    <>
      <style>{`
        @keyframes ecoFadeIn {
          from { opacity: 0; transform: scale(0.75) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ecoFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-9px); }
        }
        @keyframes ecoUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ecoBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>

      <div onClick={skip} style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: `url('/img/fundo.jpg') center center / cover no-repeat`,
        opacity: saindo ? 0 : 1,
        transition: 'opacity 0.5s ease',
        cursor: 'pointer', userSelect: 'none',
      }}>
        {/* Overlay escuro */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.88) 0%, rgba(5,20,5,0.92) 60%, rgba(0,0,0,0.88) 100%)' }} />

        {/* Conteúdo */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 32px' }}>

          {/* Ícone com animação */}
          <div style={{
            width: 110, height: 110,
            borderRadius: 26,
            background: 'rgba(255,255,255,0.06)',
            border: '1.5px solid rgba(92,184,92,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
            boxShadow: '0 0 40px rgba(92,184,92,0.15)',
            animation: 'ecoFadeIn 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards, ecoFloat 3s ease-in-out 0.7s infinite',
          }}>
            <LogoSVG />
          </div>

          {/* Nome */}
          <h1 style={{
            color: '#ffffff', fontSize: 42, fontWeight: 900,
            margin: '0 0 8px', letterSpacing: 3,
            fontFamily: "'Arial Black', Impact, Arial, sans-serif",
            animation: 'ecoUp 0.55s ease 0.4s both',
          }}>
            Eco<span style={{ color: '#5cb85c' }}>Trash</span>
          </h1>

          {/* Tagline */}
          <p style={{
            color: 'rgba(255,255,255,0.5)', fontSize: 12,
            letterSpacing: 3, margin: '0 0 52px', textTransform: 'uppercase',
            animation: 'ecoUp 0.55s ease 0.65s both',
          }}>
            Lixo seguro · Planeta feliz
          </p>

          {/* Barra de progresso */}
          <div style={{
            width: 140, height: 1.5,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 4, overflow: 'hidden', margin: '0 auto',
            animation: 'ecoUp 0.4s ease 0.9s both',
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #2d6a2d, #5cb85c)',
              animation: 'ecoBar 2.1s ease 0.2s both',
            }} />
          </div>

          <p style={{
            color: 'rgba(255,255,255,0.18)', fontSize: 11,
            marginTop: 24, letterSpacing: 1,
            animation: 'ecoUp 0.4s ease 1.2s both',
          }}>
            toque para continuar
          </p>
        </div>
      </div>
    </>
  );
};

export default SplashOverlay;
