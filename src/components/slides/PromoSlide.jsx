import React from 'react';
import { ShoppingBag, Flame, Tag, Star, Zap, Sparkles } from 'lucide-react';

export function PromoSlide({ promo = {} }) {
  const {
    tag = 'SUPER OFERTA',
    titulo = '¡Aprovechá Nuestras Promos!',
    subtitulo = 'Los mejores precios del barrio',
    precio = '',
    nota = 'Hasta agotar stock | Kiosko Belvedere',
    tema = 'orange'
  } = promo;

  // Background gradient based on theme
  const bgGradients = {
    orange: 'from-[#e63600] via-[#ff5500] to-[#8f1900]',
    purple: 'from-[#580cb8] via-[#791ef0] to-[#360475]',
    yellow: 'from-[#cc7000] via-[#ff9900] to-[#804600]',
    red: 'from-[#c90016] via-[#f0132b] to-[#7a000a]',
    blue: 'from-[#0040cc] via-[#0066ff] to-[#002273]',
    emerald: 'from-[#00853e] via-[#00b354] to-[#004f24]'
  };

  const bgGradient = bgGradients[tema] || bgGradients.orange;

  return (
    <div className={`w-full h-full relative overflow-hidden flex flex-col justify-between p-5 sm:p-8 pb-5 bg-gradient-to-br ${bgGradient} text-white select-none`}>
      
      {/* 1. LIGHTWEIGHT ANIMATED SVG SUNBURST BACKGROUND */}
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

      {/* TOP HEADER: Store Brand Badge & Tag */}
      <div className="w-full flex items-center justify-between z-10 gap-4">
        
        {/* KIOSKO BELVEDERE - Bright High-Contrast Gold Banner */}
        <div 
          className="px-6 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3"
          style={{ backgroundColor: '#ffea00', color: '#000000', border: '3px solid #ffffff' }}
        >
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
          <div 
            className="flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-lg sm:text-2xl tracking-widest uppercase shadow-2xl animate-pulse"
            style={{ backgroundColor: '#d90429', color: '#ffffff', border: '3px solid #ffea00' }}
          >
            <Flame className="w-6 h-6 text-yellow-300 fill-yellow-300" />
            <span>{tag}</span>
            <Sparkles className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-spin-slow" />
          </div>
        )}
      </div>

      {/* CENTER: Main Title, Subtitle Badge & Giant Price Card */}
      <div className="w-full max-w-5xl mx-auto my-auto z-10 flex flex-col items-center text-center gap-4 sm:gap-6 py-2">
        
        {/* 1. Main Title: PURE WHITE WITH EXPLICIT SHADOW (100% contrast, never black) */}
        <h1 
          className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight uppercase leading-[1.05] max-w-5xl"
          style={{ 
            color: '#ffffff', 
            textShadow: '0 4px 14px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.95)' 
          }}
        >
          {titulo}
        </h1>

        {/* 2. Subtitle: SOLID BLACK BADGE WITH NEON GOLD BORDER & BRIGHT YELLOW TEXT */}
        {subtitulo && (
          <div 
            className="px-8 py-3 rounded-full shadow-2xl inline-block"
            style={{ 
              backgroundColor: '#0a0a0a', 
              color: '#ffea00', 
              border: '3px solid #ffea00',
              boxShadow: '0 8px 24px rgba(0,0,0,0.8)'
            }}
          >
            <p className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wide drop-shadow">
              {subtitulo}
            </p>
          </div>
        )}

        {/* 3. Price Card: SOLID WHITE WITH RED BORDER & VIBRANT PRICE */}
        {precio && (
          <div className="relative mt-2 animate-float-price">
            {/* White card with intense red border */}
            <div 
              className="px-14 sm:px-20 py-3 sm:py-5 rounded-3xl shadow-2xl flex items-center justify-center"
              style={{ 
                backgroundColor: '#ffffff', 
                color: '#d90429', 
                border: '5px solid #ffea00',
                boxShadow: '0 12px 35px rgba(0,0,0,0.6)'
              }}
            >
              <span className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-none" style={{ color: '#d90429' }}>
                {precio}
              </span>
            </div>

            {/* Corner Starburst Sticker */}
            <div 
              className="absolute -top-4 -right-6 sm:-right-8 font-black text-xs sm:text-sm px-4 py-1.5 rounded-full uppercase tracking-wider shadow-2xl transform rotate-12 animate-pulse"
              style={{ backgroundColor: '#ffea00', color: '#000000', border: '2px solid #ffffff' }}
            >
              💥 ¡SUPER PRECIO!
            </div>
          </div>
        )}

      </div>

      {/* BOTTOM TICKER / MARQUEE: ONE SINGLE SOLID HIGH-CONTRAST BANNER (NO OVERLAPPING BARS) */}
      <div className="w-full z-10 mb-1">
        <div 
          className="w-full py-2.5 overflow-hidden rounded-xl shadow-2xl flex items-center"
          style={{ 
            backgroundColor: '#000000', 
            borderTop: '4px solid #ffea00',
            boxShadow: '0 -4px 15px rgba(0,0,0,0.5)'
          }}
        >
          <div className="animate-marquee whitespace-nowrap text-sm sm:text-base font-black tracking-widest uppercase">
            <span style={{ color: '#ffffff' }} className="mx-6">🔥 KIOSKO BELVEDERE</span>
            <span style={{ color: '#ffea00' }} className="mx-6">★</span>
            <span style={{ color: '#ffea00' }} className="mx-6">BEBIDAS BIEN FRÍAS ❄️</span>
            <span style={{ color: '#ffea00' }} className="mx-6">★</span>
            <span style={{ color: '#ffffff' }} className="mx-6">GOLOSINAS & ALFAJORES 🍫</span>
            <span style={{ color: '#ffea00' }} className="mx-6">★</span>
            <span style={{ color: '#ffea00' }} className="mx-6">CIGARRILLOS & RECARGAS ⚡</span>
            <span style={{ color: '#ffea00' }} className="mx-6">★</span>
            <span style={{ color: '#ffffff' }} className="mx-6">TUS JUEGOS DE AZAR EN KIOSKO BELVEDERE 🍀</span>
            <span style={{ color: '#ffea00' }} className="mx-6">★</span>
            <span style={{ color: '#ffea00' }} className="mx-6">¡LOS MEJORES PRECIOS DEL BARRIO!</span>
            <span style={{ color: '#ffea00' }} className="mx-6">★</span>
            {/* Seamless loop copy */}
            <span style={{ color: '#ffffff' }} className="mx-6">🔥 KIOSKO BELVEDERE</span>
            <span style={{ color: '#ffea00' }} className="mx-6">★</span>
            <span style={{ color: '#ffea00' }} className="mx-6">BEBIDAS BIEN FRÍAS ❄️</span>
            <span style={{ color: '#ffea00' }} className="mx-6">★</span>
            <span style={{ color: '#ffffff' }} className="mx-6">GOLOSINAS & ALFAJORES 🍫</span>
            <span style={{ color: '#ffea00' }} className="mx-6">★</span>
            <span style={{ color: '#ffea00' }} className="mx-6">CIGARRILLOS & RECARGAS ⚡</span>
            <span style={{ color: '#ffea00' }} className="mx-6">★</span>
            <span style={{ color: '#ffffff' }} className="mx-6">TUS JUEGOS DE AZAR EN KIOSKO BELVEDERE 🍀</span>
            <span style={{ color: '#ffea00' }} className="mx-6">★</span>
            <span style={{ color: '#ffea00' }} className="mx-6">¡LOS MEJORES PRECIOS DEL BARRIO!</span>
          </div>
        </div>
      </div>

    </div>
  );
}
