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
      
      {/* LEFT SIDEBAR: 26% width - EXACT REPLICA OF ABITAB/LA BANCA */}
      <div className="w-[26%] h-full flex flex-col justify-between p-4 sm:p-6 pl-6 sm:pl-8 border-r border-white/20 flex-shrink-0">
        <div className="flex flex-col items-center w-full">
          <div className="w-full flex justify-center">
            <TombolaLogo />
          </div>

          {/* Top Divider */}
          <div className="w-full h-[2px] bg-white my-3 opacity-90" />

          {/* Turno text: Vespertina / Nocturna between white lines */}
          <div className="w-full py-1 text-center">
            <span className="text-2xl sm:text-3xl font-black tracking-widest text-white uppercase">
              {turno}
            </span>
          </div>

          {/* Bottom Divider */}
          <div className="w-full h-[2px] bg-white my-3 opacity-90" />

          {/* Sorteo Del & Fecha: Centrado con el mismo margen que Turno */}
          <div className="w-full text-center flex flex-col items-center mt-3">
            <span className="text-xs sm:text-sm font-bold text-white/90 tracking-widest uppercase">
              SORTEO DEL
            </span>
            <span className="text-3xl sm:text-4xl font-black text-white tracking-wider mt-0.5">
              {fecha || '--/--/--'}
            </span>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="w-full border-t border-white/20 pt-2">
          <OfficialFooter />
        </div>
      </div>

      {/* RIGHT SECTION: 74% width - 4 ROWS of 5 BALLS in a Calibrated Table */}
      <div className="w-[74%] h-full flex items-center justify-center p-2 sm:p-4">
        <table className="w-full h-[85%] max-h-[580px] border-collapse">
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((ballNum, cIdx) => (
                  <td key={cIdx} align="center" valign="middle" className="p-1 sm:p-2">
                    <div className="lottery-ball w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-2xl sm:text-3xl md:text-4xl font-mono font-black text-black rounded-full flex items-center justify-center shadow-lg">
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
