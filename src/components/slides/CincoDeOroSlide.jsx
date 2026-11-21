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
      
      {/* TOP: "POZOS APROXIMADOS !!!" (Centered, bright gold bold, sin filtros drop-shadow que causan texto negro en Android TV) */}
      <div className="w-full text-center mt-3 z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-yellow-300 tracking-wider uppercase">
          POZOS APROXIMADOS !!!
        </h1>
      </div>

      {/* MIDDLE: 2 Columns Side-by-Side (Exact official La Banca proportion) */}
      <div className="w-full max-w-5xl mx-auto flex flex-row items-center justify-around my-auto z-10 px-4">
        
        {/* Left Column: Pozo de Oro */}
        <div className="w-[48%] flex flex-col items-center text-center bg-blue-950/80 border-2 border-yellow-400 rounded-3xl py-6 px-4 shadow-2xl">
          <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-widest text-yellow-300 uppercase mb-2">
            POZO DE ORO
          </span>
          <span className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
            {pozoOro || '$ 0'}
          </span>
        </div>

        {/* Right Column: Pozo Revancha */}
        <div className="w-[48%] flex flex-col items-center text-center bg-blue-950/80 border-2 border-amber-400 rounded-3xl py-6 px-4 shadow-2xl">
          <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-widest text-amber-300 uppercase mb-2">
            POZO REVANCHA
          </span>
          <span className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight">
            {pozoRevancha || '$ 0'}
          </span>
        </div>

      </div>

      {/* BOTTOM: Próximo Sorteo & Footer (Banner Luminoso de Alto Contraste) */}
      <div className="w-full flex flex-col items-center gap-3 z-10">
        <div className="flex flex-col items-center text-center bg-gradient-to-r from-blue-950 via-indigo-900 to-blue-950 border-2 border-yellow-400 px-10 py-3.5 rounded-2xl shadow-2xl">
          <span className="text-sm sm:text-base font-black tracking-widest text-yellow-300 uppercase flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_#facc15]" />
            PRÓXIMO SORTEO
          </span>
          <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-wide mt-0.5">
            {proximoSorteo || 'Próximamente'}
          </span>
        </div>

        <div className="w-full border-t border-white/20 pt-2">
          <OfficialFooter textColor="text-white" />
        </div>
      </div>

    </div>
  );
}
