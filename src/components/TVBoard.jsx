import React, { useState, useEffect, useRef } from 'react';
import { TombolaSlide } from './slides/TombolaSlide';
import { QuinielaSlide } from './slides/QuinielaSlide';
import { CincoDeOroSlide } from './slides/CincoDeOroSlide';
import { PromoSlide } from './slides/PromoSlide';
import { Maximize, Minimize, SkipForward, SkipBack, Pause, Play, ChevronRight, ChevronLeft } from 'lucide-react';

export function TVBoard() {
  const [data, setData] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [connected, setConnected] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slidesCountRef = useRef(1);

  // Load initial data and connect to SSE
  useEffect(() => {
    let eventSource = null;
    let fallbackInterval = null;

    const fetchData = async () => {
      try {
        const res = await fetch('/api/data');
        if (res.ok) {
          const json = await res.json();
          setData(json);
          setConnected(true);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setConnected(false);
      }
    };

    fetchData();

    // Connect to Server-Sent Events (SSE)
    const connectSSE = () => {
      if (typeof window === 'undefined' || !('EventSource' in window)) {
        return;
      }

      try {
        eventSource = new EventSource('/api/events');

        eventSource.onopen = () => {
          setConnected(true);
        };

        eventSource.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);
            
            // Check if this is a remote control command from iPhone
            if (payload && payload._type === 'control') {
              const count = slidesCountRef.current || 1;
              if (payload.action === 'next') {
                setCurrentSlideIndex(prev => (prev + 1) % count);
                setProgress(0);
              } else if (payload.action === 'prev') {
                setCurrentSlideIndex(prev => (prev - 1 + count) % count);
                setProgress(0);
              } else if (payload.action === 'pause') {
                setIsPaused(true);
              } else if (payload.action === 'resume') {
                setIsPaused(false);
              } else if (payload.action === 'togglePause') {
                setIsPaused(p => !p);
              } else if (payload.action === 'goto' && typeof payload.slideIndex === 'number') {
                setCurrentSlideIndex(payload.slideIndex % count);
                setProgress(0);
              }
              return;
            }

            // Normal data update
            setData(payload);
            setConnected(true);
          } catch (e) {
            console.error('Error parsing SSE event:', e);
          }
        };

        eventSource.onerror = () => {
          setConnected(false);
          if (eventSource) {
            eventSource.close();
          }
          setTimeout(connectSSE, 5000);
        };
      } catch (e) {
        console.warn('Error iniciando EventSource:', e);
      }
    };

    connectSSE();

    // Fallback polling
    fallbackInterval = setInterval(fetchData, 10000);

    return () => {
      if (eventSource) eventSource.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, []);

  // Build the list of active slides
  const slides = [];
  if (data) {
    const active = data.activeScreens || {};
    const fecha = data.fechaGeneral || '';

    // 1. Quiniela Vespertina
    if (active.quinielaVespertina !== false) {
      slides.push({
        id: 'quinielaVespertina',
        title: 'Quiniela Vespertina',
        component: (
          <QuinielaSlide
            turno="VESPERTINA"
            fecha={data.quinielaVespertina?.fecha || fecha}
            numeros={data.quinielaVespertina?.numeros || []}
          />
        )
      });
    }

    // 2. Tómbola Vespertina
    if (active.tombolaVespertina !== false) {
      slides.push({
        id: 'tombolaVespertina',
        title: 'Tómbola Vespertina',
        component: (
          <TombolaSlide
            turno="VESPERTINA"
            fecha={data.tombolaVespertina?.fecha || fecha}
            numeros={data.tombolaVespertina?.numeros || []}
          />
        )
      });
    }

    // 3. Quiniela Nocturna
    if (active.quinielaNocturna !== false) {
      slides.push({
        id: 'quinielaNocturna',
        title: 'Quiniela Nocturna',
        component: (
          <QuinielaSlide
            turno="NOCTURNA"
            fecha={data.quinielaNocturna?.fecha || fecha}
            numeros={data.quinielaNocturna?.numeros || []}
          />
        )
      });
    }

    // 4. Tómbola Nocturna
    if (active.tombolaNocturna !== false) {
      slides.push({
        id: 'tombolaNocturna',
        title: 'Tómbola Nocturna',
        component: (
          <TombolaSlide
            turno="NOCTURNA"
            fecha={data.tombolaNocturna?.fecha || fecha}
            numeros={data.tombolaNocturna?.numeros || []}
          />
        )
      });
    }

    // 5. 5 de Oro Pozos
    if (active.cincoDeOro !== false) {
      slides.push({
        id: 'cincoDeOro',
        title: '5 de Oro',
        component: (
          <CincoDeOroSlide
            pozoOro={data.cincoDeOro?.pozoOro}
            pozoRevancha={data.cincoDeOro?.pozoRevancha}
            proximoSorteo={data.cincoDeOro?.proximoSorteo}
          />
        )
      });
    }

    // 6. Promotional Slides for "Kiosko Belvedere"
    if (Array.isArray(data.promociones)) {
      data.promociones.forEach((promo, idx) => {
        if (promo && promo.active !== false) {
          slides.push({
            id: promo.id || `promo-${idx}`,
            title: `Kiosko: ${promo.titulo || 'Oferta'}`,
            component: <PromoSlide promo={promo} />
          });
        }
      });
    }
  }

  slidesCountRef.current = Math.max(1, slides.length);

  const durationSec = (data?.rotationSeconds || 60);

  // Rotation Timer
  useEffect(() => {
    if (slides.length <= 1 || isPaused) {
      setProgress(0);
      return;
    }

    const intervalMs = 200;
    const stepIncrement = (intervalMs / (durationSec * 1000)) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + stepIncrement >= 100) {
          setCurrentSlideIndex((old) => (old + 1) % slides.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [slides.length, durationSec, isPaused]);

  useEffect(() => {
    if (currentSlideIndex >= slides.length && slides.length > 0) {
      setCurrentSlideIndex(0);
    }
  }, [slides.length, currentSlideIndex]);

  // Safe manual navigation controls
  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % (slides.length || 1));
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % (slides.length || 1));
    setProgress(0);
  };

  // 100% resilient cross-browser Fullscreen toggle (never throws)
  const toggleFullscreen = () => {
    try {
      const doc = window.document;
      if (!doc) return;
      const el = doc.documentElement;

      const isFS = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);

      if (!isFS) {
        const fn = el && (el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen);
        if (typeof fn === 'function') {
          try {
            const res = fn.call(el);
            if (res && typeof res.catch === 'function') {
              res.catch(() => {});
            }
          } catch (e) {
            console.warn('Native requestFullscreen caught:', e);
          }
        }
        setIsFullscreen(true);
      } else {
        const exitFn = doc.exitFullscreen || doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen;
        if (typeof exitFn === 'function') {
          try {
            const res = exitFn.call(doc);
            if (res && typeof res.catch === 'function') {
              res.catch(() => {});
            }
          } catch (e) {
            console.warn('Native exitFullscreen caught:', e);
          }
        }
        setIsFullscreen(false);
      }
    } catch (e) {
      console.warn('Fullscreen toggle failed safely:', e);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((p) => !p);
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  if (!data) {
    return (
      <div className="w-screen h-screen bg-[#050b14] flex flex-col items-center justify-center text-white font-sans">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-2xl font-bold tracking-widest uppercase">Cargando Tablero...</h2>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="w-screen h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-8 text-center font-sans">
        <h2 className="text-3xl font-black text-yellow-400 mb-2">No hay pantallas activas</h2>
        <p className="text-gray-300">Activa al menos una pantalla de sorteo o una oferta desde el panel de control (/admin).</p>
      </div>
    );
  }

  const activeSlide = slides[currentSlideIndex] || slides[0];

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden select-none">
      
      <div className="relative w-full h-full flex flex-col overflow-hidden">
        
        {/* Subtle Progress Bar on top showing countdown to next slide */}
        {slides.length > 1 && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/40 z-50">
            <div
              className="h-full bg-yellow-400 transition-all duration-200 ease-linear shadow-[0_0_10px_rgba(250,204,21,0.9)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Floating Quick On-Screen TV Controls */}
        <div className="absolute top-3 right-3 z-50 flex items-center gap-2 bg-black/85 px-3 py-1.5 rounded-xl border border-white/30 shadow-2xl">
          {(!connected || isPaused) && (
            <span className="text-[11px] font-black text-amber-400 mr-1 uppercase">
              {!connected ? '⚠️ Desconectado' : '⏸ Pausado'}
            </span>
          )}

          <span className="text-xs font-bold text-yellow-300 mr-1 whitespace-nowrap">
            {activeSlide.title} ({currentSlideIndex + 1}/{slides.length})
          </span>

          {/* Botón manual Anterior */}
          <button
            onClick={handlePrev}
            className="p-1.5 hover:bg-white/20 active:bg-white/30 text-white rounded-lg transition"
            title="Pantalla Anterior"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Botón manual Pausar / Reanudar */}
          <button
            onClick={() => setIsPaused(p => !p)}
            className="p-1.5 hover:bg-white/20 active:bg-white/30 text-yellow-400 rounded-lg transition"
            title={isPaused ? "Reanudar giro automático" : "Pausar giro"}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Botón manual Siguiente */}
          <button
            onClick={handleNext}
            className="flex items-center gap-1 py-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-lg text-xs font-black shadow transition"
            title="Siguiente Pantalla"
          >
            <span>Siguiente</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Botón Pantalla Completa seguro */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 hover:bg-white/20 active:bg-white/30 text-cyan-300 rounded-lg transition ml-1"
            title="Pantalla Completa"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>

        {/* Big On-Screen Next/Prev Arrows for easy mouse/remote click */}
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-40 p-2.5 bg-black/40 hover:bg-black/80 active:scale-95 text-yellow-300 rounded-full border border-yellow-400/50 shadow-xl transition"
          title="Avanzar a la siguiente pantalla"
        >
          <ChevronRight className="w-7 h-7" />
        </button>

        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-40 p-2.5 bg-black/40 hover:bg-black/80 active:scale-95 text-yellow-300 rounded-full border border-yellow-400/50 shadow-xl transition"
          title="Volver a la pantalla anterior"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>

        {/* Current Active Slide */}
        <div key={activeSlide.id} className="w-full h-full">
          {activeSlide.component}
        </div>
      </div>
    </div>
  );
}
