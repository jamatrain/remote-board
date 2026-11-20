import React from 'react';
import { Sparkles, ShoppingBag, Flame, Tag } from 'lucide-react';

export function PromoSlide({ promo = {} }) {
  const {
    tag = 'SUPER OFERTA',
    titulo = '¡Aprovechá Nuestras Promos!',
    subtitulo = 'Los mejores precios del barrio',
    precio = '',
    nota = 'Kiosko Belvedere | ¡Te esperamos!',
    tema = 'orange'
  } = promo;

  // Theme gradient configurations
  const themes = {
    orange: {
      bg: 'from-[#ff512f] via-[#dd2476] to-[#b71c1c]',
      badge: 'bg-yellow-400 text-black',
      priceBg: 'bg-yellow-300 text-black border-yellow-400',
      tagColor: 'text-yellow-200'
    },
    yellow: {
      bg: 'from-[#f7971e] via-[#ffd200] to-[#f7971e]',
      badge: 'bg-black text-yellow-300',
      priceBg: 'bg-red-600 text-white border-yellow-300',
      tagColor: 'text-black'
    },
    purple: {
      bg: 'from-[#8e2de2] via-[#4a00e0] to-[#1e085a]',
      badge: 'bg-pink-500 text-white',
      priceBg: 'bg-gradient-to-r from-yellow-400 to-amber-400 text-black border-pink-400',
      tagColor: 'text-pink-300'
    },
    red: {
      bg: 'from-[#eb3349] via-[#f45c43] to-[#870000]',
      badge: 'bg-white text-red-700',
      priceBg: 'bg-yellow-400 text-black border-white',
      tagColor: 'text-yellow-200'
    },
    blue: {
      bg: 'from-[#00c6ff] via-[#0072ff] to-[#001e80]',
      badge: 'bg-yellow-400 text-black',
      priceBg: 'bg-yellow-300 text-black border-cyan-300',
      tagColor: 'text-cyan-200'
    },
    emerald: {
      bg: 'from-[#11998e] via-[#38ef7d] to-[#0a5228]',
      badge: 'bg-black text-white',
      priceBg: 'bg-yellow-300 text-black border-white',
      tagColor: 'text-emerald-100'
    }
  };

  const currentTheme = themes[tema] || themes.orange;

  return (
    <div className={`w-full h-full relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 bg-gradient-to-br ${currentTheme.bg} text-white select-none`}>
      
      {/* Background Animated Bokeh / Particles */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/30 pointer-events-none" />
      <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-50px] left-[-50px] w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* TOP: Store Brand & Offer Tag */}
      <div className="w-full flex items-center justify-between z-10 border-b border-white/20 pb-4">
        {/* Kiosko Belvedere Badge */}
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-2 rounded-2xl border border-white/20 shadow-xl">
          <ShoppingBag className="w-8 h-8 text-yellow-400 animate-bounce" />
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-yellow-300 font-extrabold">
              Ofertas Exclusivas
            </span>
            <span className="text-2xl sm:text-3xl font-black tracking-wider text-white drop-shadow-md">
              KIOSKO BELVEDERE
            </span>
          </div>
        </div>

        {/* Animated Promo Tag */}
        {tag && (
          <div className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-lg sm:text-xl tracking-widest uppercase shadow-2xl animate-pulse ${currentTheme.badge}`}>
            <Flame className="w-6 h-6" />
            <span>{tag}</span>
            <Sparkles className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* CENTER: Main Product & Giant Price Callout */}
      <div className="w-full max-w-6xl mx-auto my-auto z-10 flex flex-col items-center text-center gap-6 py-4">
        
        {/* Product Title */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] uppercase leading-none max-w-5xl">
          {titulo}
        </h1>

        {/* Subtitle / Description */}
        {subtitulo && (
          <p className="text-2xl sm:text-4xl font-extrabold text-white/95 max-w-4xl text-shadow-lg tracking-wide">
            {subtitulo}
          </p>
        )}

        {/* Giant Price Box (if provided) */}
        {precio && (
          <div className="mt-2 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
            <div className={`px-10 sm:px-14 py-4 sm:py-6 rounded-3xl border-4 shadow-[0_15px_35px_rgba(0,0,0,0.6)] ${currentTheme.priceBg}`}>
              <span className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none">
                {precio}
              </span>
            </div>
          </div>
        )}

      </div>

      {/* BOTTOM: Footer / Call to action */}
      <div className="w-full z-10 border-t border-white/20 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/90 text-sm sm:text-base font-bold">
          <Tag className="w-5 h-5 text-yellow-300" />
          <span>{nota}</span>
        </div>

        <div className="bg-black/30 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs sm:text-sm font-black text-yellow-300 tracking-wider uppercase">
          ¡Aprovechá hoy en Kiosko Belvedere!
        </div>
      </div>

    </div>
  );
}
