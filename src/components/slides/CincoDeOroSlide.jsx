import React from 'react';
import { OfficialFooter } from '../common/OfficialFooter';

export function CincoDeOroSlide({ pozoOro = '$ 16.500.000', pozoRevancha = '$ 5.500.000', proximoSorteo = 'Lunes 23' }) {
  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col justify-between p-6 sm:p-10 bg-gradient-to-b from-[#001ae6] via-[#0010a3] to-[#00086b] text-white select-none">
      
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-black/30 pointer-events-none" />

      {/* TOP: "POZOS APROXIMADOS !!!" */}
      <div className="w-full text-center mt-2 z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#facc15] glow-yellow tracking-wider uppercase">
          POZOS APROXIMADOS !!!
        </h1>
      </div>

      {/* MIDDLE: 2 Columns Side-by-Side (PURE FLEXBOX) */}
      <div className="w-full max-w-5xl mx-auto flex flex-row items-center justify-around my-auto z-10">
        
        {/* Left Column: Pozo de Oro */}
        <div className="w-[48%] flex flex-col items-center text-center">
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-widest text-white/95 uppercase mb-2 text-shadow-sm">
            POZO DE ORO
          </span>
          <span className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]">
            {pozoOro || '$ 0'}
          </span>
        </div>

        {/* Right Column: Pozo Revancha */}
        <div className="w-[48%] flex flex-col items-center text-center">
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-widest text-white/95 uppercase mb-2 text-shadow-sm">
            POZO REVANCHA
          </span>
          <span className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]">
            {pozoRevancha || '$ 0'}
          </span>
        </div>

      </div>

      {/* BOTTOM: Próximo Sorteo & Footer */}
      <div className="w-full flex flex-col items-center gap-4 z-10">
        <div className="flex flex-col items-center text-center">
          <span className="text-base sm:text-xl font-bold tracking-widest text-white/90 uppercase text-shadow-sm">
            PRÓXIMO SORTEO
          </span>
          <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-wide text-shadow-lg mt-0.5">
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
