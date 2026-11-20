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
    <div className="w-full h-full relative overflow-hidden flex flex-row bg-gradient-to-br from-[#009e2e] via-[#007e24] to-[#005518] text-white select-none">
      
      {/* LEFT SECTION: 28% width */}
      <div className="w-[28%] h-full flex flex-col justify-between p-5 border-r border-white/20 shadow-2xl flex-shrink-0">
        <div className="flex flex-col items-start gap-4">
          <QuinielaLogo />

          {/* Turno badge */}
          <div className="w-full max-w-[240px] bg-white text-[#007e24] rounded-lg py-1 px-4 shadow-xl text-center">
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

      {/* RIGHT SECTION: 72% width - TWO INDEPENDENT ROCK-SOLID TABLES */}
      <div className="w-[72%] h-full flex flex-row items-center justify-between p-3 sm:p-5 gap-4 sm:gap-8">
        
        {/* Column 1: Pos 01 to 10 */}
        <div className="w-[48%] h-full flex items-center">
          <table className="w-full h-[88%] max-h-[580px] border-collapse">
            <tbody>
              {leftCol.map(item => (
                <tr key={item.pos}>
                  {/* Position number: clearly separated, high-contrast gold */}
                  <td className="w-14 text-right pr-2 font-mono font-black text-xl sm:text-2xl text-yellow-300 whitespace-nowrap">
                    {item.pos} <span className="text-yellow-400 font-light opacity-60">|</span>
                  </td>
                  {/* White number pill */}
                  <td className="py-0.5 sm:py-1">
                    <div className="w-full bg-white text-gray-950 rounded py-1 px-2 text-center font-mono font-black text-2xl sm:text-3xl tracking-widest shadow-md">
                      {item.num}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Column 2: Pos 11 to 20 */}
        <div className="w-[48%] h-full flex items-center">
          <table className="w-full h-[88%] max-h-[580px] border-collapse">
            <tbody>
              {rightCol.map(item => (
                <tr key={item.pos}>
                  <td className="w-14 text-right pr-2 font-mono font-black text-xl sm:text-2xl text-yellow-300 whitespace-nowrap">
                    {item.pos} <span className="text-yellow-400 font-light opacity-60">|</span>
                  </td>
                  <td className="py-0.5 sm:py-1">
                    <div className="w-full bg-white text-gray-950 rounded py-1 px-2 text-center font-mono font-black text-2xl sm:text-3xl tracking-widest shadow-md">
                      {item.num}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
