import React from 'react';
import { OfficialFooter } from '../common/OfficialFooter';

export function CincoDeOroSlide({ 
  pozoOro = '$ 16.500.000', 
  pozoRevancha = '$ 5.500.000', 
  proximoSorteo = 'Lunes 23',
  tema = 'blue'
}) {
  const themes = {
    blue: {
      gradient: 'linear-gradient(180deg, #001ae6 0%, #0010a3 50%, #00086b 100%)',
      fallback: '#0010a3'
    },
    gold: {
      gradient: 'linear-gradient(180deg, #d97706 0%, #b45309 50%, #78350f 100%)',
      fallback: '#b45309'
    },
    purple: {
      gradient: 'linear-gradient(180deg, #6b21a8 0%, #581c87 50%, #3b0764 100%)',
      fallback: '#581c87'
    },
    emerald: {
      gradient: 'linear-gradient(180deg, #047857 0%, #065f46 50%, #064e3b 100%)',
      fallback: '#065f46'
    },
    dark: {
      gradient: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #020617 100%)',
      fallback: '#0f172a'
    },
    ruby: {
      gradient: 'linear-gradient(180deg, #b91c1c 0%, #991b1b 50%, #450a0a 100%)',
      fallback: '#991b1b'
    }
  };

  const selectedTheme = themes[tema] || themes.blue;

  return (
    <div 
      key={`c5oro-${tema}`}
      className="w-full h-full relative overflow-hidden flex flex-col justify-between p-6 sm:p-10 text-white select-none transition-colors duration-500"
      style={{ 
        background: selectedTheme.gradient,
        backgroundColor: selectedTheme.fallback 
      }}
    >
      
      {/* TOP: "POZOS APROXIMADOS !!!" (Centered, bright gold bold) */}
      <div className="w-full text-center mt-3 z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-yellow-300 tracking-wider uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          POZOS APROXIMADOS !!!
        </h1>
      </div>

      {/* MIDDLE: 2 Columns Side-by-Side (Exact official La Banca proportion) */}
      <div className="w-full max-w-5xl mx-auto flex flex-row items-center justify-around my-auto z-10 px-4">
        
        {/* Left Column: Pozo de Oro */}
        <div className="w-[48%] flex flex-col items-center text-center">
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-widest text-white uppercase mb-2">
            POZO DE ORO
          </span>
          <span className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg">
            {pozoOro || '$ 0'}
          </span>
        </div>

        {/* Right Column: Pozo Revancha */}
        <div className="w-[48%] flex flex-col items-center text-center">
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-widest text-white uppercase mb-2">
            POZO REVANCHA
          </span>
          <span className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg">
            {pozoRevancha || '$ 0'}
          </span>
        </div>

      </div>

      {/* BOTTOM: Próximo Sorteo & Footer */}
      <div className="w-full flex flex-col items-center gap-3 z-10">
        <div className="flex flex-col items-center text-center bg-black/40 border-2 border-yellow-400/40 px-8 py-3 rounded-2xl shadow-2xl backdrop-blur-md">
          <span className="text-sm sm:text-base font-black tracking-widest text-yellow-300 uppercase drop-shadow flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_6px_#facc15]" />
            PRÓXIMO SORTEO
          </span>
          <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-wide mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {proximoSorteo || 'Próximamente'}
          </span>
        </div>

        <div className="w-full border-t border-white/20 pt-2">
          <OfficialFooter textColor="text-white/80" />
        </div>
      </div>

    </div>
  );
}
