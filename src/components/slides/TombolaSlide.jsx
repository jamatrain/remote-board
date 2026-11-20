import React from 'react';
import { TombolaLogo } from '../common/Logos';
import { OfficialFooter } from '../common/OfficialFooter';

export function TombolaSlide({ turno = 'VESPERTINA', fecha = '19/11/26', numeros = [] }) {
  // Ensure we have 20 items padded
  const rawBalls = Array.from({ length: 20 }, (_, idx) => numeros[idx] || '--');

  // Map 20 sorted numbers into 4 rows of 5 columns (sorted vertically column-by-column as La Banca does)
  const rows = [0, 1, 2, 3].map(rowIndex => {
    return [0, 1, 2, 3, 4].map(colIndex => {
      const idx = colIndex * 4 + rowIndex;
      return rawBalls[idx] || '--';
    });
  });

  return (
    <div className="w-full h-full relative overflow-hidden flex bg-gradient-to-br from-[#d4141d] via-[#b80d15] to-[#8f050c] text-white select-none">
      
      {/* LEFT SECTION: 33% width */}
      <div className="w-[33%] h-full flex flex-col justify-between p-6 sm:p-8 border-r border-white/20 shadow-2xl z-10 flex-shrink-0">
        <div className="flex flex-col items-start gap-4">
          <TombolaLogo />

          {/* Turno badge */}
          <div className="w-full max-w-[260px] bg-white text-[#d4141d] rounded-lg py-1 px-4 shadow-xl text-center">
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

      {/* RIGHT SECTION: 67% width - 4 ROWS of 5 BALLS using Pure Flexbox */}
      <div className="w-[67%] h-full flex flex-col justify-around p-4 sm:p-6 z-10">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="w-full flex flex-row items-center justify-around">
            {row.map((ballNum, cIdx) => (
              <div
                key={cIdx}
                className="lottery-ball w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-2xl sm:text-3xl md:text-4xl font-black rounded-full flex items-center justify-center shadow-lg"
              >
                {ballNum}
              </div>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
}
