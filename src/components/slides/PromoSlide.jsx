import React from 'react';
import { ShoppingBag, Flame, Tag, Star, Zap, Sparkles } from 'lucide-react';

export function PromoSlide({ promo = {} }) {
  const {
    tag = 'SUPER OFERTA',
    titulo = '¡Aprovechá Nuestras Promos!',
    subtitulo = 'Los mejores precios del barrio',
    precio = '',
    nota = 'Hasta agotar stock',
    tema = 'orange'
  } = promo;

  // Ultra-vibrant, high-energy retail color themes (Bright, eye-catching, zero dark tones)
  const themes = {
    orange: {
      bg: 'from-[#ff3b00] via-[#ff6600] to-[#e62600]',
      badgeBg: 'bg-yellow-300 text-black border-white',
      priceBg: 'bg-yellow-300 text-black border-white',
      accentColor: '#ffea00'
    },
    yellow: {
      bg: 'from-[#ff9900] via-[#ffcc00] to-[#e68800]',
      badgeBg: 'bg-black text-yellow-300 border-white',
      priceBg: 'bg-red-600 text-white border-yellow-300',
      accentColor: '#ffffff'
    },
    purple: {
      bg: 'from-[#7928ca] via-[#9333ea] to-[#581c87]',
      badgeBg: 'bg-yellow-300 text-black border-white',
      priceBg: 'bg-yellow-300 text-black border-white',
      accentColor: '#f43f5e'
    },
    red: {
      bg: 'from-[#e10613] via-[#ff1a2b] to-[#b3000d]',
      badgeBg: 'bg-yellow-300 text-black border-white',
      priceBg: 'bg-yellow-300 text-black border-white',
      accentColor: '#ffea00'
    },
    blue: {
      bg: 'from-[#0055ff] via-[#0088ff] to-[#003cd6]',
      badgeBg: 'bg-yellow-300 text-black border-white',
      priceBg: 'bg-yellow-300 text-black border-white',
      accentColor: '#00ffff'
    },
    emerald: {
      bg: 'from-[#009b4d] via-[#00c862] to-[#007a3d]',
      badgeBg: 'bg-yellow-300 text-black border-white',
      priceBg: 'bg-yellow-300 text-black border-white',
      accentColor: '#ffea00'
    }
  };

  const currentTheme = themes[tema] || themes.orange;

  return (
    <div className={`w-full h-full relative overflow-hidden flex flex-col justify-between p-4 sm:p-7 bg-gradient-to-br ${currentTheme.bg} text-white select-none`}>
      
      {/* Background static sunburst pattern */}
      <div className="absolute inset-0 sunburst-pattern opacity-20 pointer-events-none" />

      {/* TOP BAR: Store Brand (SUPER BRIGHT YELLOW & VISIBLE) & Offer Tag */}
      <div className="w-full flex items-center justify-between z-10 gap-4">
        
        {/* KIOSKO BELVEDERE - Bright High-Contrast Gold Banner (Impossible to miss!) */}
        <div className="bg-[#ffea00] text-black px-5 py-2.5 rounded-2xl border-[3px] border-white shadow-[0_6px_20px_rgba(0,0,0,0.4)] flex items-center gap-3">
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
          <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-lg sm:text-2xl tracking-widest uppercase border-[3px] shadow-2xl animate-pulse-glow ${currentTheme.badgeBg}`}>
            <Flame className="w-6 h-6 text-red-600 fill-red-600 animate-pulse" />
            <span>{tag}</span>
            <Sparkles className="w-6 h-6 text-amber-600 fill-amber-500 animate-spin-slow" />
          </div>
        )}
      </div>

      {/* CENTER: Main Title & Big Pulsing Price Callout */}
      <div className="w-full max-w-5xl mx-auto my-auto z-10 flex flex-col items-center text-center gap-3 sm:gap-5 py-1">
        
        {/* Product Title (Bright White with Dark Drop Shadow) */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white drop-shadow-[0_6px_14px_rgba(0,0,0,0.9)] uppercase leading-[1.05] max-w-4xl">
          {titulo}
        </h1>

        {/* Subtitle / Description */}
        {subtitulo && (
          <div className="inline-block bg-black/75 px-7 py-2 rounded-full border-2 border-white/60 shadow-xl">
            <p className="text-2xl sm:text-4xl font-extrabold text-[#ffea00] tracking-wide">
              {subtitulo}
            </p>
          </div>
        )}

        {/* GIANT LIVELY PULSING PRICE CALLOUT */}
        {precio && (
          <div className="relative mt-3 animate-float-price">
            {/* Price Card */}
            <div className={`px-12 sm:px-16 py-3 sm:py-5 rounded-3xl border-4 shadow-[0_12px_30px_rgba(0,0,0,0.6)] ${currentTheme.priceBg}`}>
              <span className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-none">
                {precio}
              </span>
            </div>

            {/* Corner Starburst Sticker */}
            <div className="absolute -top-4 -right-6 bg-red-600 text-white font-black text-xs sm:text-sm px-4 py-1.5 rounded-full uppercase tracking-wider border-2 border-white shadow-xl transform rotate-12">
              ¡LLEVATELO!
            </div>
          </div>
        )}

      </div>

      {/* BOTTOM TICKER / MARQUEE (Continuous animated scrolling ribbon) */}
      <div className="w-full z-10 flex flex-col gap-1.5">
        <div className="w-full flex items-center justify-between text-xs sm:text-sm font-black text-white px-2 drop-shadow">
          <span className="flex items-center gap-1.5 text-yellow-300">
            <Tag className="w-4 h-4 fill-yellow-300" />
            {nota || 'Hasta agotar stock'}
          </span>
          <span className="text-yellow-300 tracking-wider uppercase font-black">
            ⚡ ¡Consultá en nuestro mostrador!
          </span>
        </div>

        {/* Continuous Animated Marquee Banner */}
        <div className="w-full bg-black/90 border-t-[3px] border-yellow-300 py-2 overflow-hidden rounded-xl shadow-2xl">
          <div className="animate-marquee whitespace-nowrap text-xs sm:text-sm font-black text-yellow-300 tracking-widest uppercase">
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
            {/* Loop copy */}
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
