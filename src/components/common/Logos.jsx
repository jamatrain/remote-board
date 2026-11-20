import React from 'react';

// Robust, cross-browser "la Tómbola" logo using clean HTML/CSS
export function TombolaLogo({ className = "" }) {
  return (
    <div className={`flex flex-col items-start select-none ${className}`}>
      <div className="relative border-4 border-white rounded-3xl px-6 py-2 bg-black/20 shadow-lg">
        <div className="flex items-baseline gap-2">
          <span
            className="text-white text-3xl font-serif italic font-bold"
            style={{ fontFamily: "'Brush Script MT', 'Times New Roman', cursive, serif" }}
          >
            la
          </span>
          <span
            className="text-white text-4xl sm:text-5xl font-black tracking-wider uppercase"
            style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}
          >
            TÓMBOLA
          </span>
        </div>
      </div>
    </div>
  );
}

// Robust, cross-browser "Quiniela" logo with lottery ball icon
export function QuinielaLogo({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Yellow/Green Lottery Ball */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
          <circle cx="50" cy="50" r="46" fill="#facc15" stroke="#15803d" strokeWidth="4" />
          <ellipse cx="50" cy="50" rx="42" ry="18" fill="none" stroke="#16a34a" strokeWidth="3" />
          <ellipse cx="50" cy="50" rx="42" ry="34" fill="none" stroke="#16a34a" strokeWidth="3" />
          <line x1="50" y1="4" x2="50" y2="96" stroke="#16a34a" strokeWidth="3" />
          <line x1="15" y1="25" x2="85" y2="75" stroke="#16a34a" strokeWidth="3" />
          <line x1="15" y1="75" x2="85" y2="25" stroke="#16a34a" strokeWidth="3" />
        </svg>
      </div>

      <span
        className="text-4xl sm:text-5xl font-black italic tracking-wide text-white drop-shadow-md"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Quiniela
      </span>
    </div>
  );
}
