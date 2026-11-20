import React from 'react';
import { TombolaLogo } from '../common/Logos';
import { OfficialFooter } from '../common/OfficialFooter';

export function TombolaSlide({ turno = 'VESPERTINA', fecha = '04/11/26', numeros = [] }) {
  // Ensure we have 20 items
  const balls = Array.from({ length: 20 }, (_, idx) => numeros[idx] || '--');

  return (
    <div className="w-full h-full relative overflow-hidden flex bg-gradient-to-br from-[#e0141e] via-[#cf0e17] to-[#b00810] text-white select-none">
      {/* Background subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/25 pointer-events-none" />

      {/* LEFT SIDE: Brand, Turno, Fecha, Info */}
      <div className="w-[34%] h-full flex flex-col justify-between p-8 sm:p-10 z-10 border-r border-white/10 shadow-2xl">
        <div className="flex flex-col items-start gap-5">
          <TombolaLogo className="w-64 sm:w-80" />

          {/* Turno badge */}
          <div className="w-full max-w-[280px] bg-white text-[#d4141d] rounded-md py-1.5 px-6 shadow-xl text-center">
            <span className="text-2xl sm:text-3xl font-black tracking-widest uppercase">
              {turno}
            </span>
          </div>

          {/* Sorteo Del & Fecha */}
          <div className="flex flex-col mt-4">
            <span className="text-sm sm:text-base font-bold text-white/90 tracking-widest uppercase text-shadow-sm">
              SORTEO DEL
            </span>
            <span className="text-3xl sm:text-4xl font-black text-white tracking-wider text-shadow-lg">
              {fecha || '--/--/--'}
            </span>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="w-full border-t border-white/20 pt-4">
          <OfficialFooter />
        </div>
      </div>

      {/* RIGHT SIDE: 4x5 Grid of 20 Lottery Balls */}
      <div className="w-[66%] h-full flex items-center justify-center p-6 sm:p-10 z-10">
        <div className="w-full h-full max-h-[92%] grid grid-cols-5 grid-rows-4 gap-4 sm:gap-6 justify-items-center items-center">
          {balls.map((num, i) => (
            <div
              key={i}
              className="lottery-ball w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 text-2xl sm:text-4xl md:text-5xl font-black tracking-tight"
            >
              {num}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
