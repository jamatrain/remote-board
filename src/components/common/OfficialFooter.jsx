import React from 'react';

export function OfficialFooter({ textColor = "text-white/90" }) {
  return (
    <div className={`w-full text-[11px] sm:text-xs select-none ${textColor} flex flex-col gap-1 tracking-wider`}>
      <div className="flex items-center gap-2">
        <span className="font-black text-yellow-300 uppercase tracking-widest">🏪 Kiosko Belvedere</span>
        <span className="opacity-90 font-medium">| Resultados Informativos</span>
      </div>
      <div className="flex items-center gap-2 text-[10px] sm:text-[11px] opacity-80">
        <span>Cartelería Digital Kiosko Belvedere • ¡Tu lugar de confianza en el barrio!</span>
      </div>
    </div>
  );
}
