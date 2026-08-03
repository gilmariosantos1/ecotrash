import React, { useEffect, useState } from 'react';

interface Props { onDone: () => void; }

const SplashOverlay: React.FC<Props> = ({ onDone }) => {
  const [saindo, setSaindo] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setSaindo(true), 2200);
    const doneTimer = setTimeout(() => onDone(), 2700);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  const skip = () => { setSaindo(true); setTimeout(onDone, 400); };

  return (
    <>
      <style>{`
        @keyframes ecoFadeIn {
          from { opacity: 0; transform: scale(0.8) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ecoFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes ecoUp {
          from { opacity: 0; transform: translateY(20px); }
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

          {/* Logo real do EcoTrash com animação float */}
          <div style={{
            width: 110, height: 110,
            borderRadius: 26,
            background: '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
            animation: 'ecoFadeIn 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards, ecoFloat 3s ease-in-out 0.7s infinite',
          }}>
            <img
              src="/img/logo.png"
              alt="EcoTrash"
              style={{ width: 88, height: 88, objectFit: 'contain' }}
            />
          </div>

          {/* Nome */}
          <h1 style={{
            color: '#ffffff', fontSize: 40, fontWeight: 900,
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
            borderRadius: 4, overflow: 'hidden',
            margin: '0 auto',
            animation: 'ecoUp 0.4s ease 0.9s both',
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, #2d6a2d, #5cb85c)',
              borderRadius: 4,
              animation: 'ecoBar 2s ease 0.2s both',
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
