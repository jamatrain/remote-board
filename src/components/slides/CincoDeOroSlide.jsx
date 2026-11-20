import React from 'react';
import { OfficialFooter } from '../common/OfficialFooter';

export function CincoDeOroSlide({ pozoOro = '$ 16.500.000', pozoRevancha = '$ 5.500.000', proximoSorteo = 'Lunes 23' }) {
  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col justify-between p-6 sm:p-10 bg-gradient-to-b from-[#001ae6] via-[#0010a3] to-[#00086b] text-white select-none">
      
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
      <div className="w-full flex flex-col items-center gap-4 z-10">
        <div className="flex flex-col items-center text-center">
          <span className="text-base sm:text-xl font-bold tracking-widest text-white/90 uppercase">
            PRÓXIMO SORTEO
          </span>
          <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-wide mt-0.5">
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
