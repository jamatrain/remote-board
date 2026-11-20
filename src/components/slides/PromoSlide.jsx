import React from 'react';
import { ShoppingBag, Flame, Tag, Star, Zap, Sparkles } from 'lucide-react';

export function PromoSlide({ promo = {} }) {
  const {
    tag = 'SUPER OFERTA',
    titulo = '¡Aprovechá Nuestras Promos!',
    subtitulo = 'Los mejores precios del barrio',
    precio = '',
    nota = 'Hasta agotar stock | Kiosko Belvedere',
    tema = 'purple'
  } = promo;

  // Saturated, high-impact retail themes (Pure vibrancy, bright text, ZERO dark or muddy colors)
  const themes = {
    purple: {
      bg: 'from-[#580cb8] via-[#791ef0] to-[#360475]',
      accent: '#ffea00',
      tagBg: 'bg-[#ffea00] text-black border-white',
      priceCard: 'bg-[#ffea00] text-black border-white shadow-[0_0_35px_rgba(255,234,0,0.7)]',
      priceText: 'text-black',
      titleColor: 'text-white'
    },
    orange: {
      bg: 'from-[#e63600] via-[#ff5500] to-[#8f1900]',
      accent: '#ffea00',
      tagBg: 'bg-[#ffea00] text-black border-white',
      priceCard: 'bg-[#ffea00] text-black border-white shadow-[0_0_35px_rgba(255,234,0,0.7)]',
      priceText: 'text-black',
      titleColor: 'text-white'
    },
    yellow: {
      bg: 'from-[#cc7000] via-[#ff9900] to-[#804600]',
      accent: '#ffffff',
      tagBg: 'bg-black text-yellow-300 border-white',
      priceCard: 'bg-red-600 text-white border-yellow-300 shadow-[0_0_35px_rgba(220,38,38,0.8)]',
      priceText: 'text-white',
      titleColor: 'text-white'
    },
    red: {
      bg: 'from-[#c90016] via-[#f0132b] to-[#7a000a]',
      accent: '#ffea00',
      tagBg: 'bg-[#ffea00] text-black border-white',
      priceCard: 'bg-[#ffea00] text-black border-white shadow-[0_0_35px_rgba(255,234,0,0.8)]',
      priceText: 'text-black',
      titleColor: 'text-white'
    },
    blue: {
      bg: 'from-[#0040cc] via-[#0066ff] to-[#002273]',
      accent: '#00ffff',
      tagBg: 'bg-[#ffea00] text-black border-white',
      priceCard: 'bg-[#ffea00] text-black border-white shadow-[0_0_35px_rgba(255,234,0,0.7)]',
      priceText: 'text-black',
      titleColor: 'text-white'
    },
    emerald: {
      bg: 'from-[#00853e] via-[#00b354] to-[#004f24]',
      accent: '#ffea00',
      tagBg: 'bg-[#ffea00] text-black border-white',
      priceCard: 'bg-[#ffea00] text-black border-white shadow-[0_0_35px_rgba(255,234,0,0.7)]',
      priceText: 'text-black',
      titleColor: 'text-white'
    }
  };

  const currentTheme = themes[tema] || themes.purple;

  return (
    <div className={`w-full h-full relative overflow-hidden flex flex-col justify-between p-4 sm:p-7 bg-gradient-to-br ${currentTheme.bg} text-white select-none`}>
      
      {/* 1. HIGH-ENERGY LIGHTWEIGHT SVG SUNBURST (Smooth 60 FPS, GPU-accelerated) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <svg viewBox="0 0 200 200" className="w-[180vh] h-[180vh] animate-spin-slow">
          <g fill="#ffffff">
            <polygon points="100,100 85,0 115,0" />
            <polygon points="100,100 170,30 185,55" />
            <polygon points="100,100 200,85 200,115" />
            <polygon points="100,100 170,170 145,185" />
            <polygon points="100,100 85,200 115,200" />
            <polygon points="100,100 30,170 15,145" />
            <polygon points="100,100 0,85 0,115" />
            <polygon points="100,100 30,30 55,15" />
          </g>
        </svg>
      </div>

      {/* TOP HEADER BAR: KIOSKO BELVEDERE & TAG */}
      <div className="w-full flex items-center justify-between z-10 gap-4">
        
        {/* KIOSKO BELVEDERE BRAND BADGE: Bold, Glowing Yellow, 100% Legible */}
        <div className="bg-[#ffea00] text-black px-6 py-2.5 rounded-2xl border-[3px] border-white shadow-[0_4px_20px_rgba(0,0,0,0.6)] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-yellow-300 shadow flex-shrink-0 animate-bounce">
            <ShoppingBag className="w-6 h-6" />
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-widest text-red-700 font-black flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-red-600 text-red-600" />
              OFERTAS DESTACADAS
            </span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wider text-black">
              KIOSKO BELVEDERE
            </span>
          </div>
        </div>

        {/* Pulsing Offer Tag */}
        {tag && (
          <div className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-lg sm:text-2xl tracking-widest uppercase border-[3px] shadow-2xl animate-pulse ${currentTheme.tagBg}`}>
            <Flame className="w-6 h-6 text-red-600 fill-red-600" />
            <span>{tag}</span>
            <Sparkles className="w-6 h-6 text-amber-600 fill-amber-500 animate-spin-slow" />
          </div>
        )}
      </div>

      {/* CENTER: Massive Product Title & High-Impact Price Callout */}
      <div className="w-full max-w-5xl mx-auto my-auto z-10 flex flex-col items-center text-center gap-4 sm:gap-6 py-2">
        
        {/* Product Title: PURE WHITE WITH DEEP BLACK SHADOW (NO BLACK TEXT ON DARK BACKGROUND) */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.95)] uppercase leading-[1.05] max-w-5xl">
          {titulo}
        </h1>

        {/* Subtitle / Description: HIGH CONTRAST */}
        {subtitulo && (
          <div className="inline-block bg-black/75 px-8 py-2.5 rounded-full border-2 border-yellow-400 shadow-2xl">
            <p className="text-2xl sm:text-4xl font-extrabold text-[#ffea00] tracking-wide drop-shadow">
              {subtitulo}
            </p>
          </div>
        )}

        {/* GIANT HIGH-ENERGY PRICE CALLOUT */}
        {precio && (
          <div className="relative mt-3 animate-float-price">
            {/* Glowing Price Card */}
            <div className={`px-14 sm:px-20 py-4 sm:py-6 rounded-3xl border-4 ${currentTheme.priceCard}`}>
              <span className={`text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-none ${currentTheme.priceText}`}>
                {precio}
              </span>
            </div>

            {/* Corner Starburst Sticker */}
            <div className="absolute -top-5 -right-6 sm:-right-8 bg-red-600 text-white font-black text-sm sm:text-base px-4 py-1.5 rounded-full uppercase tracking-wider border-2 border-white shadow-2xl transform rotate-12 animate-pulse">
              💥 ¡LLEVATELO!
            </div>
          </div>
        )}

      </div>

      {/* BOTTOM TICKER / MARQUEE: Continuous High-Impact Ribbon */}
      <div className="w-full z-10 flex flex-col gap-2">
        <div className="w-full flex items-center justify-between text-xs sm:text-sm font-black text-white px-2 drop-shadow">
          <span className="flex items-center gap-1.5 text-yellow-300">
            <Tag className="w-4 h-4 fill-yellow-300" />
            {nota || 'Hasta agotar stock | Kiosko Belvedere'}
          </span>
          <span className="text-yellow-300 tracking-wider uppercase font-black">
            ⚡ ¡Consultá en nuestro mostrador!
          </span>
        </div>

        {/* Continuous Animated Marquee Banner */}
        <div className="w-full bg-black/95 border-t-[3px] border-yellow-400 py-2.5 overflow-hidden rounded-xl shadow-2xl">
          <div className="animate-marquee whitespace-nowrap text-sm sm:text-base font-black text-yellow-300 tracking-widest uppercase">
            <span className="mx-6 text-white">🔥 KIOSKO BELVEDERE</span>
            <span className="mx-6 text-yellow-400">★</span>
            <span className="mx-6 text-white">BEBIDAS BIEN FRÍAS ❄️</span>
            <span className="mx-6 text-yellow-400">★</span>
            <span className="mx-6 text-white">GOLOSINAS & ALFAJORES 🍫</span>
            <span className="mx-6 text-yellow-400">★</span>
            <span className="mx-6 text-white">CIGARRILLOS & RECARGAS ⚡</span>
            <span className="mx-6 text-yellow-400">★</span>
            <span className="mx-6 text-white">TODOS LOS JUEGOS DE LA BANCA 🍀</span>
            <span className="mx-6 text-yellow-400">★</span>
            <span className="mx-6 text-white">¡LOS MEJORES PRECIOS DEL BARRIO!</span>
            <span className="mx-6 text-yellow-400">★</span>
            {/* Seamless loop */}
            <span className="mx-6 text-white">🔥 KIOSKO BELVEDERE</span>
            <span className="mx-6 text-yellow-400">★</span>
            <span className="mx-6 text-white">BEBIDAS BIEN FRÍAS ❄️</span>
            <span className="mx-6 text-yellow-400">★</span>
            <span className="mx-6 text-white">GOLOSINAS & ALFAJORES 🍫</span>
            <span className="mx-6 text-yellow-400">★</span>
            <span className="mx-6 text-white">CIGARRILLOS & RECARGAS ⚡</span>
            <span className="mx-6 text-yellow-400">★</span>
            <span className="mx-6 text-white">TODOS LOS JUEGOS DE LA BANCA 🍀</span>
            <span className="mx-6 text-yellow-400">★</span>
            <span className="mx-6 text-white">¡LOS MEJORES PRECIOS DEL BARRIO!</span>
          </div>
        </div>
      </div>

    </div>
  );
}
