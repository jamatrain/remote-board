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
      
      {/* LEFT SIDEBAR: 26% width - EXACT REPLICA OF ABITAB/LA BANCA */}
      <div className="w-[26%] h-full flex flex-col justify-between p-4 sm:p-6 pl-6 sm:pl-8 border-r border-white/20 flex-shrink-0">
        <div className="flex flex-col items-center w-full">
          <div className="w-full flex justify-center">
            <QuinielaLogo />
          </div>

          {/* Top Divider */}
          <div className="w-full h-[2px] bg-white my-3 opacity-90" />

          {/* Turno text: Vespertina / Nocturna */}
          <div className="w-full py-1 text-center">
            <span className="text-2xl sm:text-3xl font-black tracking-widest text-white uppercase drop-shadow-sm">
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
            <span className="text-3xl sm:text-4xl font-black text-white tracking-wider drop-shadow-sm mt-0.5">
              {fecha || '--/--/--'}
            </span>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="w-full border-t border-white/20 pt-2">
          <OfficialFooter />
        </div>
      </div>

      {/* RIGHT SECTION: 74% width - DUAL COLUMNS WITH GIANT CRISP NUMBERS ON WHITE PILLS */}
      <div className="w-[74%] h-full flex flex-row items-center justify-center p-3 sm:p-5 gap-4 sm:gap-8">
        
        {/* Column 1: Pos 01 to 10 */}
        <div className="w-[48%] h-full flex items-center justify-center">
          <table className="w-full h-[88%] max-h-[580px] border-collapse">
            <tbody>
              {leftCol.map(item => (
                <tr key={item.pos}>
                  {/* Position number: 01 | in high-visibility bright yellow */}
                  <td className="w-14 text-right pr-2 whitespace-nowrap align-middle">
                    <span className="font-mono font-black text-xl sm:text-2xl md:text-3xl text-yellow-300">
                      {item.pos}
                    </span>
                    <span className="font-mono font-light text-xl sm:text-2xl text-white/80 ml-1">
                      |
                    </span>
                  </td>
                  {/* Solid White Box with HUGE Bold Black Number */}
                  <td className="py-1 px-1 align-middle">
                    <div 
                      className="w-full rounded bg-white text-black font-mono font-black text-2xl sm:text-3xl md:text-4xl tracking-widest text-center py-1 sm:py-1.5 shadow-md flex items-center justify-center"
                      style={{ backgroundColor: '#ffffff', color: '#000000' }}
                    >
                      {item.num}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Column 2: Pos 11 to 20 */}
        <div className="w-[48%] h-full flex items-center justify-center">
          <table className="w-full h-[88%] max-h-[580px] border-collapse">
            <tbody>
              {rightCol.map(item => (
                <tr key={item.pos}>
                  <td className="w-14 text-right pr-2 whitespace-nowrap align-middle">
                    <span className="font-mono font-black text-xl sm:text-2xl md:text-3xl text-yellow-300">
                      {item.pos}
                    </span>
                    <span className="font-mono font-light text-xl sm:text-2xl text-white/80 ml-1">
                      |
                    </span>
                  </td>
                  <td className="py-1 px-1 align-middle">
                    <div 
                      className="w-full rounded bg-white text-black font-mono font-black text-2xl sm:text-3xl md:text-4xl tracking-widest text-center py-1 sm:py-1.5 shadow-md flex items-center justify-center"
                      style={{ backgroundColor: '#ffffff', color: '#000000' }}
                    >
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
