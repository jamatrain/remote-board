import React from 'react';
import { OfficialFooter } from '../common/OfficialFooter';

export function CincoDeOroSlide({ pozoOro = '$ 17.400.000', pozoRevancha = '$ 26.600.000', proximoSorteo = 'Jueves 5' }) {
  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 bg-gradient-to-b from-[#001ae6] via-[#0013b8] to-[#000a78] text-white select-none">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-black/30 pointer-events-none" />

      {/* TOP: "POZOS APROXIMADOS !!!" */}
      <div className="w-full text-center mt-2 sm:mt-4 z-10">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#facc15] glow-yellow tracking-wider uppercase">
          POZOS APROXIMADOS !!!
        </h1>
      </div>

      {/* MIDDLE: 2 Columns for Pozo de Oro and Pozo Revancha */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-2 gap-8 sm:gap-14 my-auto z-10 items-center">
        {/* Left: Pozo de Oro */}
        <div className="flex flex-col items-center text-center">
          <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-widest text-white/95 uppercase mb-3 text-shadow-sm">
            POZO DE ORO
          </span>
          <div className="flex items-center justify-center">
            <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
              {pozoOro || '$ 0'}
            </span>
          </div>
        </div>

        {/* Right: Pozo Revancha */}
        <div className="flex flex-col items-center text-center">
          <span className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-widest text-white/95 uppercase mb-3 text-shadow-sm">
            POZO REVANCHA
          </span>
          <div className="flex items-center justify-center">
            <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]">
              {pozoRevancha || '$ 0'}
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM INFO: PRÓXIMO SORTEO & FOOTER */}
      <div className="w-full flex flex-col items-center gap-6 z-10">
        <div className="flex flex-col items-center text-center">
          <span className="text-lg sm:text-2xl font-bold tracking-widest text-white/90 uppercase text-shadow-sm">
            PRÓXIMO SORTEO
          </span>
          <span className="text-2xl sm:text-4xl font-black text-white tracking-wide text-shadow-lg mt-1">
            {proximoSorteo || 'Próximamente'}
          </span>
        </div>

        {/* Legal footer spanning full width */}
        <div className="w-full border-t border-white/20 pt-3">
          <OfficialFooter textColor="text-white/80" />
        </div>
      </div>
    </div>
  );
}
