import React from 'react';
import { ShoppingBag, Flame, Tag, Star, Zap } from 'lucide-react';

export function PromoSlide({ promo = {} }) {
  const {
    tag = 'SUPER OFERTA',
    titulo = '¡Aprovechá Nuestras Promos!',
    subtitulo = 'Los mejores precios del barrio',
    precio = '',
    nota = 'Hasta agotar stock',
    tema = 'orange'
  } = promo;

  // Theme gradient configurations (fast, high-contrast, no heavy blurs)
  const themes = {
    orange: {
      bg: 'from-[#e62a00] via-[#c4003d] to-[#660015]',
      badge: 'bg-yellow-400 text-black border-yellow-300',
      priceBg: 'bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 text-black border-yellow-200',
      tagColor: 'text-yellow-300'
    },
    yellow: {
      bg: 'from-[#cc4d00] via-[#d9a800] to-[#993d00]',
      badge: 'bg-black text-yellow-300 border-yellow-400',
      priceBg: 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white border-yellow-400',
      tagColor: 'text-black'
    },
    purple: {
      bg: 'from-[#7900b8] via-[#48009f] to-[#160052]',
      badge: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-300',
      priceBg: 'bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 text-black border-yellow-200',
      tagColor: 'text-pink-300'
    },
    red: {
      bg: 'from-[#d90429] via-[#b00020] to-[#600010]',
      badge: 'bg-white text-red-700 border-white',
      priceBg: 'bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 text-black border-white',
      tagColor: 'text-yellow-200'
    },
    blue: {
      bg: 'from-[#0047b3] via-[#003087] to-[#001040]',
      badge: 'bg-yellow-400 text-black border-yellow-300',
      priceBg: 'bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 text-black border-cyan-300',
      tagColor: 'text-cyan-200'
    },
    emerald: {
      bg: 'from-[#008f7a] via-[#006657] to-[#003d33]',
      badge: 'bg-black text-white border-emerald-300',
      priceBg: 'bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-300 text-black border-white',
      tagColor: 'text-emerald-100'
    }
  };

  const currentTheme = themes[tema] || themes.orange;

  return (
    <div className={`w-full h-full relative overflow-hidden flex flex-col justify-between p-4 sm:p-8 bg-gradient-to-br ${currentTheme.bg} text-white select-none`}>
      
      {/* Background static radial highlight (lightweight, zero CPU usage) */}
      <div className="absolute inset-0 sunburst-pattern opacity-15 pointer-events-none" />

      {/* TOP BAR: Store Brand & Offer Tag */}
      <div className="w-full flex items-center justify-between z-10">
        
        {/* KIOSKO BELVEDERE Badge */}
        <div className="bg-black/80 px-5 py-2 rounded-2xl border-2 border-yellow-400 shadow-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-black shadow-md flex-shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-yellow-300 font-black flex items-center gap-1">
              <Zap className="w-3 h-3 fill-yellow-300" />
              Ofertas Especiales
            </span>
            <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider text-white">
              KIOSKO BELVEDERE
            </span>
          </div>
        </div>

        {/* Pulsing Offer Tag */}
        {tag && (
          <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-base sm:text-xl tracking-widest uppercase border-2 shadow-xl ${currentTheme.badge}`}>
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>{tag}</span>
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
        )}
      </div>

      {/* CENTER: Main Title & Price Callout */}
      <div className="w-full max-w-5xl mx-auto my-auto z-10 flex flex-col items-center text-center gap-4 sm:gap-6 py-2">
        
        {/* Product Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white drop-shadow-[0_6px_12px_rgba(0,0,0,0.8)] uppercase leading-tight max-w-4xl">
          {titulo}
        </h1>

        {/* Subtitle / Description */}
        {subtitulo && (
          <div className="inline-block bg-black/60 px-6 py-1.5 rounded-full border border-white/20 shadow-lg">
            <p className="text-xl sm:text-3xl font-extrabold text-yellow-300 tracking-wide">
              {subtitulo}
            </p>
          </div>
        )}

        {/* FLOATING PRICE CALLOUT */}
        {precio && (
          <div className="relative mt-2 animate-float-price">
            <div className={`px-10 sm:px-14 py-3 sm:py-5 rounded-3xl border-4 shadow-2xl ${currentTheme.priceBg}`}>
              <span className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none">
                {precio}
              </span>
            </div>

            {/* Corner Sticker */}
            <div className="absolute -top-3 -right-5 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider border-2 border-white shadow-lg transform rotate-6">
              ¡LLEVATELO!
            </div>
          </div>
        )}

      </div>

      {/* BOTTOM TICKER / MARQUEE */}
      <div className="w-full z-10 flex flex-col gap-1.5">
        <div className="w-full flex items-center justify-between text-xs sm:text-sm font-extrabold text-white/90 px-1">
          <span className="flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-yellow-300" />
            {nota || 'Hasta agotar stock'}
          </span>
          <span className="text-yellow-300 tracking-wider uppercase font-bold">
            ⚡ ¡Consultá en el mostrador!
          </span>
        </div>

        {/* Continuous Animated Marquee Banner */}
        <div className="w-full bg-black/85 border-t-2 border-yellow-400 py-1.5 overflow-hidden rounded-xl shadow-lg">
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
            {/* Repeated for smooth loop */}
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
