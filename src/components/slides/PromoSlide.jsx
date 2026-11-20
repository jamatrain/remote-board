import React from 'react';
import { Sparkles, ShoppingBag, Flame, Tag, Star, Zap } from 'lucide-react';

export function PromoSlide({ promo = {} }) {
  const {
    tag = 'SUPER OFERTA',
    titulo = '¡Aprovechá Nuestras Promos!',
    subtitulo = 'Los mejores precios del barrio',
    precio = '',
    nota = 'Hasta agotar stock',
    tema = 'orange'
  } = promo;

  // Theme gradient configurations
  const themes = {
    orange: {
      bg: 'from-[#ff2a00] via-[#ea004b] to-[#7a001a]',
      badge: 'bg-yellow-400 text-black border-yellow-300',
      priceBg: 'bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-300 text-black border-yellow-200',
      tagColor: 'text-yellow-300',
      rayOpacity: 'opacity-20'
    },
    yellow: {
      bg: 'from-[#e65c00] via-[#f9d423] to-[#e65c00]',
      badge: 'bg-black text-yellow-300 border-yellow-400',
      priceBg: 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white border-yellow-400',
      tagColor: 'text-black',
      rayOpacity: 'opacity-25'
    },
    purple: {
      bg: 'from-[#9b00e8] via-[#5b00c9] to-[#1c0066]',
      badge: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-300',
      priceBg: 'bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 text-black border-yellow-200',
      tagColor: 'text-pink-300',
      rayOpacity: 'opacity-25'
    },
    red: {
      bg: 'from-[#ff0844] via-[#ff4e50] to-[#800018]',
      badge: 'bg-white text-red-700 border-white',
      priceBg: 'bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 text-black border-white',
      tagColor: 'text-yellow-200',
      rayOpacity: 'opacity-20'
    },
    blue: {
      bg: 'from-[#0052d4] via-[#4364f7] to-[#001050]',
      badge: 'bg-yellow-400 text-black border-yellow-300',
      priceBg: 'bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 text-black border-cyan-300',
      tagColor: 'text-cyan-200',
      rayOpacity: 'opacity-20'
    },
    emerald: {
      bg: 'from-[#00b09b] via-[#96c93d] to-[#004d20]',
      badge: 'bg-black text-white border-emerald-300',
      priceBg: 'bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-300 text-black border-white',
      tagColor: 'text-emerald-100',
      rayOpacity: 'opacity-25'
    }
  };

  const currentTheme = themes[tema] || themes.orange;

  return (
    <div className={`w-full h-full relative overflow-hidden flex flex-col justify-between p-6 sm:p-10 bg-gradient-to-br ${currentTheme.bg} text-white select-none`}>
      
      {/* 1. ROTATING SUNBURST BACKGROUND (Carnival / Retail Attention-Grabber) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className={`w-[220vh] h-[220vh] rounded-full sunburst-rays animate-spin-slow ${currentTheme.rayOpacity}`} />
      </div>

      {/* 2. Floating Ambient Glow Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-400/25 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* TOP BAR: Store Brand & Animated Tag */}
      <div className="w-full flex items-center justify-between z-10">
        
        {/* KIOSKO BELVEDERE Animated Neon Badge */}
        <div className="relative group overflow-hidden bg-black/60 backdrop-blur-md px-6 py-2.5 rounded-2xl border-2 border-yellow-400/80 shadow-[0_0_20px_rgba(250,204,21,0.5)] flex items-center gap-3">
          {/* Shimmer light sweep */}
          <div className="absolute inset-0 w-1/3 bg-white/25 skew-x-12 animate-shimmer pointer-events-none" />
          
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-black shadow-md flex-shrink-0 animate-bounce">
            <ShoppingBag className="w-6 h-6" />
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-widest text-yellow-300 font-black flex items-center gap-1">
              <Zap className="w-3 h-3 fill-yellow-300" />
              Ofertas Especiales
            </span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wider text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              KIOSKO BELVEDERE
            </span>
          </div>
        </div>

        {/* Pulsing Offer Tag */}
        {tag && (
          <div className={`relative overflow-hidden flex items-center gap-2.5 px-6 py-3 rounded-full font-black text-lg sm:text-2xl tracking-widest uppercase border-2 shadow-2xl animate-pulse-glow ${currentTheme.badge}`}>
            <Flame className="w-7 h-7 text-amber-500 fill-amber-500 animate-pulse" />
            <span className="drop-shadow">{tag}</span>
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-spin-slow" />
          </div>
        )}
      </div>

      {/* CENTER: Main Title & Floating Price Callout */}
      <div className="w-full max-w-6xl mx-auto my-auto z-10 flex flex-col items-center text-center gap-5 sm:gap-7 py-3">
        
        {/* Product Title */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] uppercase leading-[1.05] max-w-5xl">
          {titulo}
        </h1>

        {/* Subtitle / Description */}
        {subtitulo && (
          <div className="inline-block bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-lg">
            <p className="text-2xl sm:text-4xl font-extrabold text-yellow-300 drop-shadow-md tracking-wide">
              {subtitulo}
            </p>
          </div>
        )}

        {/* GIANT FLOATING PRICE CALLOUT */}
        {precio && (
          <div className="relative mt-2 animate-float-price">
            {/* Price Card with Shimmer */}
            <div className={`relative overflow-hidden px-12 sm:px-16 py-4 sm:py-6 rounded-3xl border-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] ${currentTheme.priceBg}`}>
              {/* Shimmer sweep effect across the price */}
              <div className="absolute inset-0 w-1/2 bg-white/30 skew-x-[-20deg] animate-shimmer pointer-events-none" />
              
              <span className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-none drop-shadow-md">
                {precio}
              </span>
            </div>

            {/* Corner Starburst Sticker */}
            <div className="absolute -top-4 -right-6 sm:-right-8 bg-red-600 text-white font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-full uppercase tracking-widest border-2 border-white shadow-xl transform rotate-12 animate-pulse">
              ¡LLEVATELO!
            </div>
          </div>
        )}

      </div>

      {/* BOTTOM TICKER / MARQUEE (Continuous animated scrolling ribbon) */}
      <div className="w-full z-10 flex flex-col gap-2">
        <div className="w-full flex items-center justify-between text-xs sm:text-sm font-extrabold text-white/90 px-2">
          <span className="flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-yellow-300" />
            {nota || 'Hasta agotar stock'}
          </span>
          <span className="text-yellow-300 tracking-wider uppercase">
            ⚡ ¡Consultá en el mostrador!
          </span>
        </div>

        {/* Continuous Animated Marquee Banner */}
        <div className="w-full bg-black/70 backdrop-blur-md border-t-2 border-yellow-400/60 py-2 overflow-hidden rounded-xl shadow-2xl">
          <div className="animate-marquee whitespace-nowrap text-xs sm:text-sm font-black text-yellow-300 tracking-widest uppercase">
            <span className="mx-6">🔥 KIOSKO BELVEDERE</span>
            <span className="mx-6 text-white">•</span>
            <span className="mx-6 text-white">BEBIDAS BIEN FRÍAS</span>
            <span className="mx-6 text-white">•</span>
            <span className="mx-6">GOLOSINAS & ALFAJORES</span>
            <span className="mx-6 text-white">•</span>
            <span className="mx-6 text-white">CIGARRILLOS & RECARGAS</span>
            <span className="mx-6 text-white">•</span>
            <span className="mx-6">TODOS LOS JUEGOS DE LA BANCA</span>
            <span className="mx-6 text-white">•</span>
            <span className="mx-6 text-white">¡LOS MEJORES PRECIOS DEL BARRIO!</span>
            <span className="mx-6 text-white">•</span>
            {/* Repeated for smooth infinite seamless loop */}
            <span className="mx-6">🔥 KIOSKO BELVEDERE</span>
            <span className="mx-6 text-white">•</span>
            <span className="mx-6 text-white">BEBIDAS BIEN FRÍAS</span>
            <span className="mx-6 text-white">•</span>
            <span className="mx-6">GOLOSINAS & ALFAJORES</span>
            <span className="mx-6 text-white">•</span>
            <span className="mx-6 text-white">CIGARRILLOS & RECARGAS</span>
            <span className="mx-6 text-white">•</span>
            <span className="mx-6">TODOS LOS JUEGOS DE LA BANCA</span>
            <span className="mx-6 text-white">•</span>
            <span className="mx-6 text-white">¡LOS MEJORES PRECIOS DEL BARRIO!</span>
          </div>
        </div>
      </div>

    </div>
  );
}
