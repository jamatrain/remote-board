import React from 'react';

// Exact style replica of "la Tómbola" logo
export function TombolaLogo({ className = "w-72" }) {
  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 400 130" className="w-full h-auto drop-shadow-lg">
        {/* Stylized rounded ribbon container */}
        <path
          d="M 35 25 Q 200 10 365 25 Q 380 70 365 110 Q 200 120 35 110 Q 20 70 35 25 Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Small "la" */}
        <text
          x="75"
          y="42"
          fontFamily="'Brush Script MT', cursive, sans-serif"
          fontSize="36"
          fontStyle="italic"
          fill="#ffffff"
          stroke="#d4141d"
          strokeWidth="1.5"
          fontWeight="bold"
        >
          la
        </text>
        {/* Main "Tómbola" script */}
        <text
          x="100"
          y="85"
          fontFamily="'Impact', 'Montserrat', sans-serif"
          fontSize="68"
          letterSpacing="1"
          fill="#ffffff"
          fontWeight="900"
          className="drop-shadow-md"
        >
          TÓMBOLA
        </text>
        {/* Underline loop */}
        <path
          d="M 60 98 Q 200 115 340 96"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// Exact style replica of "Quiniela" logo with lottery ball icon
export function QuinielaLogo({ className = "w-72" }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Yellow/Green Lottery Ball */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="46" fill="#facc15" stroke="#15803d" strokeWidth="3" />
          {/* Latitude lines */}
          <ellipse cx="50" cy="50" rx="42" ry="18" fill="none" stroke="#16a34a" strokeWidth="2.5" />
          <ellipse cx="50" cy="50" rx="42" ry="34" fill="none" stroke="#16a34a" strokeWidth="2" />
          <line x1="50" y1="4" x2="50" y2="96" stroke="#16a34a" strokeWidth="2.5" />
          <line x1="15" y1="22" x2="85" y2="78" stroke="#16a34a" strokeWidth="2" />
          <line x1="15" y1="78" x2="85" y2="22" stroke="#16a34a" strokeWidth="2" />
        </svg>
      </div>

      {/* Quiniela Typography */}
      <div className="flex flex-col">
        <span
          className="text-4xl sm:text-5xl font-black italic tracking-wide text-white drop-shadow-md"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Quiniela
        </span>
      </div>
    </div>
  );
}
