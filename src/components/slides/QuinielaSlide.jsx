import React from 'react';
import { QuinielaLogo } from '../common/Logos';
import { OfficialFooter } from '../common/OfficialFooter';

export function QuinielaSlide({ turno = 'VESPERTINA', fecha = '04/11/26', numeros = [] }) {
  // 20 items: 10 on left column (positions 1-10), 10 on right column (positions 11-20)
  const leftCol = Array.from({ length: 10 }, (_, i) => ({
    pos: String(i + 1).padStart(2, '0'),
    num: numeros[i] || '---'
  }));

  const rightCol = Array.from({ length: 10 }, (_, i) => ({
    pos: String(i + 11).padStart(2, '0'),
    num: numeros[i + 10] || '---'
  }));

  return (
    <div className="w-full h-full relative overflow-hidden flex bg-gradient-to-br from-[#00b034] via-[#009228] to-[#006b1d] text-white select-none">
      {/* Background bokeh/glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_var(--tw-gradient-stops))] from-white/15 via-transparent to-black/30 pointer-events-none" />

      {/* LEFT SIDE: Brand, Turno, Fecha, Info */}
      <div className="w-[34%] h-full flex flex-col justify-between p-8 sm:p-10 z-10 border-r border-white/10 shadow-2xl">
        <div className="flex flex-col items-start gap-5">
          <QuinielaLogo className="w-64 sm:w-80" />

          {/* Turno badge */}
          <div className="w-full max-w-[280px] bg-white text-[#008a26] rounded-md py-1.5 px-6 shadow-xl text-center">
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

      {/* RIGHT SIDE: 2 Columns of 10 positions */}
      <div className="w-[66%] h-full flex items-center justify-center p-6 sm:p-10 z-10">
        <div className="w-full h-full max-h-[94%] grid grid-cols-2 gap-x-6 sm:gap-x-10">
          
          {/* Column 1: Pos 01 - 10 */}
          <div className="flex flex-col justify-between h-full gap-1.5">
            {leftCol.map(item => (
              <div key={item.pos} className="flex items-center gap-3 w-full">
                <span className="text-cyan-200 font-black text-xl sm:text-2xl w-10 text-right">
                  {item.pos} <span className="text-cyan-300 font-light opacity-60">|</span>
                </span>
                <div className="quiniela-pill flex-1 py-1 sm:py-1.5 text-2xl sm:text-3xl md:text-4xl font-black tracking-widest">
                  {item.num}
                </div>
              </div>
            ))}
          </div>

          {/* Column 2: Pos 11 - 20 */}
          <div className="flex flex-col justify-between h-full gap-1.5">
            {rightCol.map(item => (
              <div key={item.pos} className="flex items-center gap-3 w-full">
                <span className="text-cyan-200 font-black text-xl sm:text-2xl w-10 text-right">
                  {item.pos} <span className="text-cyan-300 font-light opacity-60">|</span>
                </span>
                <div className="quiniela-pill flex-1 py-1 sm:py-1.5 text-2xl sm:text-3xl md:text-4xl font-black tracking-widest">
                  {item.num}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
