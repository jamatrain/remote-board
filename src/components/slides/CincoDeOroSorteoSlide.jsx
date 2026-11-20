import React from 'react';
import { CincoDeOroLogo } from '../common/Logos';
import { OfficialFooter } from '../common/OfficialFooter';

function getDiaSemanaFromDate(dateStr) {
  if (!dateStr) return '';
  // dateStr could be "18/11/26" or "2026-11-18"
  try {
    let y, m, d;
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length >= 3) {
        d = parseInt(parts[0], 10);
        m = parseInt(parts[1], 10) - 1;
        y = 2000 + parseInt(parts[2], 10);
      }
    } else if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length >= 3) {
        y = parseInt(parts[0], 10);
        m = parseInt(parts[1], 10) - 1;
        d = parseInt(parts[2].slice(0, 2), 10);
      }
    }
    if (y && m !== undefined && d) {
      const dt = new Date(y, m, d);
      const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      return days[dt.getDay()];
    }
  } catch (e) {
    // ignore
  }
  return '';
}

export function CincoDeOroSorteoSlide({
  fecha = '18/11/26',
  numerosOro = ['16', '21', '26', '41', '42'],
  bolillaExtra = '19',
  numerosRevancha = ['03', '06', '33', '35', '39'],
  aciertosOro = 0,
  aciertosPlata = 1,
  aciertosRevancha = 1,
  pozoOro = '$ 16.500.000',
  pozoRevancha = '$ 5.500.000',
  proximoSorteo = 'Lunes 23',
  tema = 'blue'
}) {
  const diaSemana = getDiaSemanaFromDate(fecha);
  const rawOro = Array.from({ length: 5 }, (_, i) => numerosOro[i] || '--');
  const rawRev = Array.from({ length: 5 }, (_, i) => numerosRevancha[i] || '--');

  return (
    <div 
      key={`c5oro-sorteo-${fecha}`}
      className="w-full h-full relative overflow-hidden flex flex-row bg-gradient-to-br from-[#001ae6] via-[#0010a3] to-[#00086b] text-white select-none"
    >
      {/* LEFT SIDEBAR: 26% width - EXACT REPLICA OF ABITAB / LA BANCA FORMAT */}
      <div className="w-[26%] h-full flex flex-col justify-between p-4 sm:p-6 pl-6 sm:pl-8 border-r border-white/20 flex-shrink-0 z-10">
        <div className="flex flex-col items-center w-full">
          {/* Logo 5 de Oro */}
          <div className="w-full flex justify-center mt-2">
            <CincoDeOroLogo />
          </div>

          {/* Top Divider */}
          <div className="w-full h-[2px] bg-white my-3 opacity-90" />

          {/* Turno text: SORTEO between white lines */}
          <div className="w-full py-1 text-center">
            <span className="text-2xl sm:text-3xl font-black tracking-widest text-white uppercase drop-shadow-sm">
              SORTEO
            </span>
          </div>

          {/* Bottom Divider */}
          <div className="w-full h-[2px] bg-white my-3 opacity-90" />

          {/* Sorteo Del & Fecha */}
          <div className="w-full text-center flex flex-col items-center mt-3">
            <span className="text-xs sm:text-sm font-bold text-white/90 tracking-widest uppercase">
              SORTEO DEL
            </span>
            <span className="text-3xl sm:text-4xl font-black text-white tracking-wider drop-shadow-sm mt-0.5">
              {fecha || '--/--/--'}
            </span>
            {diaSemana && (
              <span className="text-xs sm:text-sm font-black text-yellow-300 tracking-wider uppercase mt-1 bg-yellow-400/20 px-3 py-0.5 rounded-full border border-yellow-400/30">
                {diaSemana}
              </span>
            )}
          </div>
        </div>

        {/* Legal Footer */}
        <div className="w-full border-t border-white/20 pt-2">
          <OfficialFooter textColor="text-white/80" />
        </div>
      </div>

      {/* RIGHT SECTION: 74% width - BOLILLAS DORADAS Y RESULTADOS */}
      <div className="w-[74%] h-full flex flex-col justify-between p-4 sm:p-7 z-10">
        
        {/* 1. SECCIÓN POZO DE ORO */}
        <div className="w-full bg-gradient-to-r from-blue-900/60 to-indigo-950/70 border border-blue-400/30 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15]" />
              <h2 className="text-xl sm:text-2xl font-black text-yellow-300 tracking-wider uppercase drop-shadow-md">
                POZO DE ORO
              </h2>
            </div>
            <div>
              {Number(aciertosOro) === 0 ? (
                <span className="px-3.5 py-1 bg-yellow-400/20 border border-yellow-400 text-yellow-300 rounded-full text-xs sm:text-sm font-black tracking-wider uppercase shadow-[0_0_10px_rgba(250,204,21,0.25)]">
                  ¡ POZO VACANTE !
                </span>
              ) : (
                <span className="px-3.5 py-1 bg-emerald-500/20 border border-emerald-400 text-emerald-300 rounded-full text-xs sm:text-sm font-black tracking-wider uppercase">
                  {aciertosOro} {aciertosOro === 1 ? 'ACIERTO' : 'ACIERTOS'}
                </span>
              )}
            </div>
          </div>

          {/* Bolillas Pozo de Oro + Extra */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-6 py-2">
            {/* 5 Bolillas de Oro */}
            {rawOro.map((num, idx) => (
              <div 
                key={`oro-${idx}`}
                className="lottery-ball-gold w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-3xl sm:text-4xl md:text-5xl font-mono font-black text-black flex items-center justify-center shadow-2xl"
              >
                {num}
              </div>
            ))}

            {/* Separador visual */}
            <div className="flex items-center justify-center px-1 text-yellow-300/80 font-black text-2xl sm:text-3xl">
              +
            </div>

            {/* Bolilla Extra */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] sm:text-xs font-black text-orange-300 uppercase tracking-widest mb-1 drop-shadow-sm">
                EXTRA
              </span>
              <div className="lottery-ball-gold-extra w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-3xl sm:text-4xl md:text-5xl font-mono font-black text-black flex items-center justify-center shadow-2xl">
                {bolillaExtra || '--'}
              </div>
            </div>
          </div>
        </div>

        {/* 2. SECCIÓN POZO REVANCHA */}
        <div className="w-full bg-gradient-to-r from-blue-900/60 to-indigo-950/70 border border-blue-400/30 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
              <h2 className="text-xl sm:text-2xl font-black text-amber-300 tracking-wider uppercase drop-shadow-md">
                POZO REVANCHA
              </h2>
            </div>
            <div>
              {Number(aciertosRevancha) === 0 ? (
                <span className="px-3.5 py-1 bg-yellow-400/20 border border-yellow-400 text-yellow-300 rounded-full text-xs sm:text-sm font-black tracking-wider uppercase shadow-[0_0_10px_rgba(250,204,21,0.25)]">
                  ¡ POZO VACANTE !
                </span>
              ) : (
                <span className="px-3.5 py-1 bg-emerald-500/20 border border-emerald-400 text-emerald-300 rounded-full text-xs sm:text-sm font-black tracking-wider uppercase">
                  {aciertosRevancha} {aciertosRevancha === 1 ? 'ACIERTO' : 'ACIERTOS'}
                </span>
              )}
            </div>
          </div>

          {/* 5 Bolillas de Revancha */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-6 py-2">
            {rawRev.map((num, idx) => (
              <div 
                key={`rev-${idx}`}
                className="lottery-ball-gold w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-3xl sm:text-4xl md:text-5xl font-mono font-black text-black flex items-center justify-center shadow-2xl"
              >
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* 3. BANNER INFERIOR: PRÓXIMOS POZOS ESTIMADOS */}
        <div className="w-full bg-black/50 border border-white/20 rounded-xl px-5 py-3 flex items-center justify-between text-white shadow-lg">
          <div className="flex items-center gap-2.5">
            <span className="text-xs sm:text-sm font-black text-yellow-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              PRÓXIMO SORTEO:
            </span>
            <span className="text-sm sm:text-base font-black text-white">
              {proximoSorteo || 'Próximamente'}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-300 uppercase">Pozo de Oro:</span>
              <span className="text-sm sm:text-base font-black text-yellow-300 tracking-tight">
                {pozoOro}
              </span>
            </div>
            <div className="h-4 w-[1px] bg-white/20" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-300 uppercase">Revancha:</span>
              <span className="text-sm sm:text-base font-black text-yellow-300 tracking-tight">
                {pozoRevancha}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
