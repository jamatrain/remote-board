import React from 'react';
import { QuinielaLogo } from '../common/Logos';
import { OfficialFooter } from '../common/OfficialFooter';

export function QuinielaSlide({ turno = 'VESPERTINA', fecha = '19/11/26', numeros = [] }) {
  // 10 items in Left Column (01-10) and 10 in Right Column (11-20)
  const leftCol = Array.from({ length: 10 }, (_, i) => ({
    pos: String(i + 1).padStart(2, '0'),
    num: numeros[i] || '---'
  }));

  const rightCol = Array.from({ length: 10 }, (_, i) => ({
    pos: String(i + 11).padStart(2, '0'),
    num: numeros[i + 10] || '---'
  }));

  return (
    <div className="w-full h-full relative overflow-hidden flex bg-gradient-to-br from-[#009e2e] via-[#007e24] to-[#005518] text-white select-none">
      
      {/* LEFT SECTION: 33% width */}
      <div className="w-[33%] h-full flex flex-col justify-between p-6 sm:p-8 border-r border-white/20 shadow-2xl z-10 flex-shrink-0">
        <div className="flex flex-col items-start gap-4">
          <QuinielaLogo />

          {/* Turno badge */}
          <div className="w-full max-w-[260px] bg-white text-[#007e24] rounded-lg py-1 px-4 shadow-xl text-center">
            <span className="text-2xl sm:text-3xl font-black tracking-widest uppercase">
              {turno}
            </span>
          </div>

          {/* Sorteo Del & Fecha */}
          <div className="flex flex-col mt-2">
            <span className="text-xs sm:text-sm font-bold text-white/90 tracking-widest uppercase text-shadow-sm">
              SORTEO DEL
            </span>
            <span className="text-3xl sm:text-4xl font-black text-white tracking-wider text-shadow-lg">
              {fecha || '--/--/--'}
            </span>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="w-full border-t border-white/20 pt-3">
          <OfficialFooter />
        </div>
      </div>

      {/* RIGHT SECTION: 67% width - TWO FLEX COLUMNS (No CSS Grid) */}
      <div className="w-[67%] h-full flex flex-row items-center justify-between p-4 sm:p-6 gap-4 z-10">
        
        {/* Column 1: Pos 01 to 10 */}
        <div className="w-[48%] h-full flex flex-col justify-between py-1">
          {leftCol.map(item => (
            <div key={item.pos} className="flex flex-row items-center gap-2 w-full my-0.5">
              <span className="text-cyan-200 font-black text-lg sm:text-xl md:text-2xl w-10 text-right flex-shrink-0">
                {item.pos} <span className="text-cyan-300 font-light opacity-60">|</span>
              </span>
              <div className="quiniela-pill flex-1 py-0.5 sm:py-1 px-2 text-xl sm:text-2xl md:text-3xl font-black tracking-widest text-center">
                {item.num}
              </div>
            </div>
          ))}
        </div>

        {/* Column 2: Pos 11 to 20 */}
        <div className="w-[48%] h-full flex flex-col justify-between py-1">
          {rightCol.map(item => (
            <div key={item.pos} className="flex flex-row items-center gap-2 w-full my-0.5">
              <span className="text-cyan-200 font-black text-lg sm:text-xl md:text-2xl w-10 text-right flex-shrink-0">
                {item.pos} <span className="text-cyan-300 font-light opacity-60">|</span>
              </span>
              <div className="quiniela-pill flex-1 py-0.5 sm:py-1 px-2 text-xl sm:text-2xl md:text-3xl font-black tracking-widest text-center">
                {item.num}
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
