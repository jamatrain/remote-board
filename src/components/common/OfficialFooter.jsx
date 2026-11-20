import React from 'react';

export function OfficialFooter({ textColor = "text-white/80" }) {
  return (
    <div className={`w-full text-[11px] sm:text-xs select-none ${textColor} flex flex-col gap-1 tracking-wider`}>
      <div className="flex items-center gap-2">
        <span className="font-semibold">Seguinos en:</span>
        <span className="inline-flex gap-1.5 items-center">
          <span className="bg-white/20 px-1 py-0.2 rounded font-bold text-[10px]">f</span>
          <span className="bg-white/20 px-1 py-0.2 rounded font-bold text-[10px]">𝕏</span>
          <span className="bg-white/20 px-1 py-0.2 rounded font-bold text-[10px]">ig</span>
        </span>
        <span className="opacity-90 font-medium">/LaBanca.JuegosOficiales</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-bold text-white tracking-wide">📞 0800-2000</span>
        <span>Prevención y ayuda al juego problemático</span>
        <span className="hidden sm:inline font-semibold opacity-75">| Juegue responsablemente</span>
      </div>
    </div>
  );
}
