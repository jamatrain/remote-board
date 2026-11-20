import React from 'react';
import { TombolaLogo } from '../common/Logos';
import { OfficialFooter } from '../common/OfficialFooter';

export function TombolaSlide({ turno = 'VESPERTINA', fecha = '19/11/26', numeros = [] }) {
  const rawBalls = Array.from({ length: 20 }, (_, idx) => numeros[idx] || '--');

  // Map 20 sorted numbers into 4 rows of 5 columns (sorted vertically column-by-column as La Banca does)
  const rows = [0, 1, 2, 3].map(rowIndex => {
    return [0, 1, 2, 3, 4].map(colIndex => {
      const idx = colIndex * 4 + rowIndex;
      return rawBalls[idx] || '--';
    });
  });

  return (
    <div className="w-full h-full relative overflow-hidden flex flex-row bg-gradient-to-br from-[#d4141d] via-[#b80d15] to-[#8f050c] text-white select-none">
      
      {/* LEFT SECTION: 28% width */}
      <div className="w-[28%] h-full flex flex-col justify-between p-5 border-r border-white/20 shadow-2xl flex-shrink-0">
        <div className="flex flex-col items-start gap-4">
          <TombolaLogo />

          {/* Turno badge */}
          <div className="w-full max-w-[240px] bg-white text-[#d4141d] rounded-lg py-1 px-4 shadow-xl text-center">
            <span className="text-2xl sm:text-3xl font-black tracking-widest uppercase">
              {turno}
            </span>
          </div>

          {/* Sorteo Del & Fecha */}
          <div className="flex flex-col mt-2">
            <span className="text-xs font-bold text-white/90 tracking-widest uppercase text-shadow-sm">
              SORTEO DEL
            </span>
            <span className="text-3xl sm:text-4xl font-black text-white tracking-wider text-shadow-lg">
              {fecha || '--/--/--'}
            </span>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="w-full border-t border-white/20 pt-2">
          <OfficialFooter />
        </div>
      </div>

      {/* RIGHT SECTION: 72% width - 4 ROWS of 5 BALLS in a Table to fit 100% on screen */}
      <div className="w-[72%] h-full flex items-center justify-center p-2 sm:p-4">
        <table className="w-full h-[84%] max-h-[580px] border-collapse">
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((ballNum, cIdx) => (
                  <td key={cIdx} align="center" valign="middle" className="p-1 sm:p-1.5">
                    <div className="lottery-ball w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-xl sm:text-2xl md:text-3xl font-black rounded-full flex items-center justify-center shadow-md">
                      {ballNum}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
