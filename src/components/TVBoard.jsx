import React, { useState, useEffect, useRef } from 'react';
import { TombolaSlide } from './slides/TombolaSlide';
import { QuinielaSlide } from './slides/QuinielaSlide';
import { CincoDeOroSlide } from './slides/CincoDeOroSlide';

export function TVBoard() {
  const [data, setData] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [connected, setConnected] = useState(true);

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
      eventSource = new EventSource('/api/events');

      eventSource.onopen = () => {
        setConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const updated = JSON.parse(event.data);
          setData(updated);
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
        // Retry connection after 5 seconds
        setTimeout(connectSSE, 5000);
      };
    };

    connectSSE();

    // Safety fallback polling every 30 seconds in case SSE is blocked by proxy/hotspot
    fallbackInterval = setInterval(fetchData, 30000);

    return () => {
      if (eventSource) eventSource.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, []);

  // Determine active slides from data
  const slides = [];
  if (data) {
    const active = data.activeScreens || {};
    const fecha = data.fechaGeneral || '';

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
  }

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

  // Adjust current index if slides array changes
  useEffect(() => {
    if (currentSlideIndex >= slides.length && slides.length > 0) {
      setCurrentSlideIndex(0);
    }
  }, [slides.length, currentSlideIndex]);

  // Keyboard controls for testing or TV remote (Arrows, Space, F)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        setCurrentSlideIndex((prev) => (prev + 1) % (slides.length || 1));
        setProgress(0);
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % (slides.length || 1));
        setProgress(0);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((p) => !p);
      } else if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  if (!data) {
    return (
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-2xl font-bold tracking-widest uppercase">Cargando Tablero...</h2>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="w-screen h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-8 text-center">
        <h2 className="text-3xl font-black text-yellow-400 mb-2">No hay pantallas activas</h2>
        <p className="text-gray-300">Activa al menos una pantalla desde el panel de control (/admin).</p>
      </div>
    );
  }

  const activeSlide = slides[currentSlideIndex] || slides[0];

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden select-none">
      {/* 16:9 Display Container that fits cleanly on 32" TV */}
      <div className="relative w-full h-full max-w-[177.78vh] max-h-[56.25vw] flex flex-col">
        
        {/* Subtle Progress Bar on top showing rotation countdown */}
        {slides.length > 1 && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/40 z-50">
            <div
              className="h-full bg-yellow-400/80 transition-all duration-200 ease-linear shadow-[0_0_8px_rgba(250,204,21,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Status Indicator (only shown if connection drops or paused) */}
        {(!connected || isPaused) && (
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold">
            {!connected && (
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Sin conexión - Mostrando datos locales
              </span>
            )}
            {isPaused && (
              <span className="text-yellow-400 ml-2">⏸ Pausado</span>
            )}
          </div>
        )}

        {/* Current Active Slide with Smooth Fade Transition */}
        <div key={activeSlide.id} className="w-full h-full animate-fadeIn transition-opacity duration-500">
          {activeSlide.component}
        </div>
      </div>
    </div>
  );
}
