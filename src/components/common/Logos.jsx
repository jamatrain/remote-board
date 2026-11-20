import React from 'react';

// Exact replica of the official "la Tómbola" logo
export function TombolaLogo({ className = "" }) {
  return (
    <div className={`flex flex-col items-start select-none ${className}`}>
      {/* Official styled contour with cursive 'la' and 'Tómbola' */}
      <div className="relative border-[3px] border-white rounded-[28px] px-5 py-2 bg-white/10 shadow-md">
        <div className="flex items-baseline gap-2">
          <span
            className="text-white text-3xl font-bold italic"
            style={{ fontFamily: "'Brush Script MT', 'Segoe Script', cursive, sans-serif" }}
          >
            la
          </span>
          <span
            className="text-white text-3xl sm:text-4xl font-black tracking-tight"
            style={{ fontFamily: "'Montserrat', 'Arial Black', sans-serif" }}
          >
            TÓMBOLA
          </span>
        </div>
      </div>
    </div>
  );
}

// Exact replica of the official "Quiniela" logo with lottery ball icon
export function QuinielaLogo({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Yellow Lottery Ball with green latitude/longitude grid */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          {/* Yellow sphere */}
          <circle cx="50" cy="50" r="46" fill="#facc15" stroke="#16a34a" strokeWidth="4" />
          {/* Grid lines */}
          <ellipse cx="50" cy="50" rx="42" ry="16" fill="none" stroke="#15803d" strokeWidth="3" />
          <ellipse cx="50" cy="50" rx="42" ry="32" fill="none" stroke="#15803d" strokeWidth="3" />
          <line x1="50" y1="4" x2="50" y2="96" stroke="#15803d" strokeWidth="3" />
          <line x1="16" y1="24" x2="84" y2="76" stroke="#15803d" strokeWidth="2.5" />
          <line x1="16" y1="76" x2="84" y2="24" stroke="#15803d" strokeWidth="2.5" />
        </svg>
      </div>

      <span
        className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Quiniela
      </span>
    </div>
  );
}

// Exact replica of the official "5 de ORO" logo
export function CincoDeOroLogo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Official Golden Ball with number 5 */}
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-full flex items-center justify-center bg-gradient-to-tr from-amber-600 via-yellow-400 to-yellow-100 shadow-[0_4px_12px_rgba(0,0,0,0.5)] border-2 border-amber-300">
        <span className="text-black font-black text-2xl sm:text-3xl font-mono tracking-tight drop-shadow-sm">
          5
        </span>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[11px] sm:text-xs font-black italic tracking-widest text-yellow-300 uppercase">
          de
        </span>
        <span 
          className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          ORO
        </span>
      </div>
    </div>
  );
}
