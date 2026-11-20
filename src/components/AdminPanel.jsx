import React, { useState, useEffect, useRef } from 'react';
import { 
  Tv, 
  Save, 
  RotateCw, 
  Copy, 
  Check, 
  AlertCircle, 
  Sparkles, 
  ArrowUpDown, 
  ClipboardPaste,
  Calendar,
  Layers,
  Settings,
  RefreshCw,
  Clock,
  Info,
  Plus,
  Trash2,
  ShoppingBag,
  Flame,
  Tag,
  SkipForward,
  SkipBack,
  Play,
  Pause
} from 'lucide-react';

export function AdminPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);
  const [activeTab, setActiveTab] = useState('quinielaVesp');
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [pasteTarget, setPasteTarget] = useState(null);
  const [pasteText, setPasteText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // References for auto-jumping inputs
  const inputsRef = useRef({});

  const loadData = () => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      alert('Error guardando datos: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Trigger sync with official La Banca API
  const handleSyncLaBanca = async () => {
    setSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setSyncFeedback({
          updated: json.updated,
          details: json.details
        });
      } else {
        alert('Error al sincronizar con La Banca: ' + (json.error || 'Error desconocido'));
      }
    } catch (err) {
      alert('Error de red al consultar La Banca: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const [tvControlStatus, setTvControlStatus] = useState(null);

  const sendTvControl = async (action, slideIndex = null) => {
    try {
      const res = await fetch('/api/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, slideIndex })
      });
      if (res.ok) {
        setTvControlStatus(action === 'next' ? 'Siguiente enviado' : action === 'prev' ? 'Anterior enviado' : 'Comando enviado');
        setTimeout(() => setTvControlStatus(null), 1500);
      }
    } catch (e) {
      console.error('Error enviando comando a TV:', e);
    }
  };

  const handleNumberChange = (section, index, value, maxLen = 3) => {
    const clean = value.replace(/\D/g, '').slice(0, maxLen);
    const updatedNumbers = [...(data[section]?.numeros || Array(20).fill(''))];
    updatedNumbers[index] = clean;

    setData({
      ...data,
      [section]: {
        ...data[section],
        numeros: updatedNumbers
      }
    });

    if (clean.length === maxLen && index < 19) {
      const nextKey = `${section}-${index + 1}`;
      if (inputsRef.current[nextKey]) {
        inputsRef.current[nextKey].focus();
      }
    }
  };

  const generateTombolaFromQuiniela = (quinielaKey, tombolaKey) => {
    const quinielaNums = data[quinielaKey]?.numeros || [];
    const extracted = quinielaNums
      .map(n => n ? n.slice(-2).padStart(2, '0') : '')
      .filter(n => n !== '');

    const unique = Array.from(new Set(extracted)).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    
    while (unique.length < 20) {
      unique.push('');
    }

    setData({
      ...data,
      [tombolaKey]: {
        ...data[tombolaKey],
        fecha: data[quinielaKey]?.fecha || data.fechaGeneral,
        numeros: unique.slice(0, 20)
      }
    });

    alert(`¡Tómbola generada con ${extracted.length} terminaciones ordenadas de menor a mayor!`);
  };

  const sortTombola = (tombolaKey) => {
    const nums = [...(data[tombolaKey]?.numeros || [])];
    const filled = nums.filter(n => n.trim() !== '');
    filled.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    while (filled.length < 20) {
      filled.push('');
    }

    setData({
      ...data,
      [tombolaKey]: {
        ...data[tombolaKey],
        numeros: filled
      }
    });
  };

  const handleBulkPaste = () => {
    if (!pasteTarget || !pasteText.trim()) return;

    const maxLen = pasteTarget.startsWith('quiniela') ? 3 : 2;
    const regex = new RegExp(`\\b\\d{${maxLen}}\\b`, 'g');
    const matches = pasteText.match(regex) || [];

    if (matches.length === 0) {
      alert(`No se encontraron números válidos de ${maxLen} cifras en el texto pegado.`);
      return;
    }

    const newNums = Array(20).fill('');
    matches.slice(0, 20).forEach((num, idx) => {
      newNums[idx] = num;
    });

    setData({
      ...data,
      [pasteTarget]: {
        ...data[pasteTarget],
        numeros: newNums
      }
    });

    setPasteModalOpen(false);
    setPasteText('');
    alert(`Se cargaron ${Math.min(matches.length, 20)} números correctamente.`);
  };

  const formatCurrency = (val) => {
    const raw = val.replace(/\D/g, '');
    if (!raw) return '$ 0';
    const num = parseInt(raw, 10);
    return '$ ' + num.toLocaleString('es-UY');
  };

  // Kiosko Belvedere Promotions management
  const addPromoSlide = () => {
    const newPromo = {
      id: `promo-${Date.now()}`,
      active: true,
      tag: 'SUPER PROMO',
      titulo: 'Nueva Oferta',
      subtitulo: 'Aprovechá hoy en Kiosko Belvedere',
      precio: '$ 100',
      nota: 'Hasta agotar stock | Kiosko Belvedere',
      tema: 'orange'
    };
    setData({
      ...data,
      promociones: [...(data.promociones || []), newPromo]
    });
  };

  const updatePromoSlide = (index, field, value) => {
    const list = [...(data.promociones || [])];
    list[index] = { ...list[index], [field]: value };
    setData({ ...data, promociones: list });
  };

  const removePromoSlide = (index) => {
    if (confirm('¿Seguro que deseas eliminar esta oferta?')) {
      const list = [...(data.promociones || [])];
      list.splice(index, 1);
      setData({ ...data, promociones: list });
    }
  };

  const copyTvLink = () => {
    const url = window.location.origin + '/tv';
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="font-semibold text-lg text-gray-300">Cargando panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col pb-28">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center justify-between shadow-lg">
        <div>
          <h1 className="text-lg font-black text-white tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            PANEL DE CONTROL
          </h1>
          <p className="text-xs text-gray-400">Cartelería Digital Remota</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyTvLink}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-yellow-400 rounded-lg text-xs font-bold transition shadow"
            title="Copiar URL para el TV"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedLink ? 'Copiado!' : 'Link TV'}
          </button>

          <a
            href="/tv"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow"
          >
            <Tv className="w-3.5 h-3.5" />
            Ver TV
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 flex flex-col gap-5">
        
        {/* CONTROL REMOTO DE TV (Desde el Celular) */}
        <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-2 border-emerald-500/50 rounded-2xl p-4 shadow-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                CONTROL REMOTO EN VIVO
              </span>
              <h2 className="text-base font-black text-white">Cambiar Pantallas en la Tele</h2>
            </div>
            {tvControlStatus && (
              <span className="text-xs bg-emerald-500 text-black font-black px-2.5 py-1 rounded-full animate-bounce">
                {tvControlStatus}
              </span>
            )}
          </div>

          {/* Botones de acción directa para avanzar / retroceder */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => sendTvControl('prev')}
              className="flex items-center justify-center gap-1.5 py-3 px-3 bg-gray-800 active:bg-gray-700 hover:bg-gray-750 text-white rounded-xl font-black text-sm shadow-md border border-gray-700 transition"
            >
              <SkipBack className="w-4 h-4 text-gray-300" />
              Anterior
            </button>
            <button
              type="button"
              onClick={() => sendTvControl('togglePause')}
              className="flex items-center justify-center gap-1.5 py-3 px-3 bg-amber-600 active:bg-amber-700 text-white rounded-xl font-black text-sm shadow-md transition"
            >
              <Play className="w-4 h-4 text-white" />
              Pausar / Play
            </button>
            <button
              type="button"
              onClick={() => sendTvControl('next')}
              className="flex items-center justify-center gap-1.5 py-3 px-3 bg-emerald-600 active:bg-emerald-700 text-white rounded-xl font-black text-sm shadow-md transition"
            >
              Siguiente
              <SkipForward className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Accesos rápidos a sorteos específicos */}
          <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Mostrar sorteo específico ahora:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                type="button"
                onClick={() => sendTvControl('goto', 0)}
                className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 active:bg-emerald-600 text-xs font-bold text-gray-200 rounded-lg whitespace-nowrap border border-gray-700 shadow-sm"
              >
                Quiniela Vesp
              </button>
              <button
                type="button"
                onClick={() => sendTvControl('goto', 1)}
                className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 active:bg-red-600 text-xs font-bold text-gray-200 rounded-lg whitespace-nowrap border border-gray-700 shadow-sm"
              >
                Tómbola Vesp
              </button>
              <button
                type="button"
                onClick={() => sendTvControl('goto', 2)}
                className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 active:bg-emerald-600 text-xs font-bold text-gray-200 rounded-lg whitespace-nowrap border border-gray-700 shadow-sm"
              >
                Quiniela Noct
              </button>
              <button
                type="button"
                onClick={() => sendTvControl('goto', 3)}
                className="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 active:bg-red-600 text-xs font-bold text-gray-200 rounded-lg whitespace-nowrap border border-gray-700 shadow-sm"
              >
                Tómbola Noct
              </button>
              <button
                type="button"
                onClick={() => sendTvControl('goto', 4)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-xs font-black text-white rounded-lg whitespace-nowrap border border-blue-400 shadow-md"
              >
                🪙 5 de Oro
              </button>
              <button
                type="button"
                onClick={() => sendTvControl('goto', 5)}
                className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 text-xs font-black text-black rounded-lg whitespace-nowrap shadow-md"
              >
                ★ Ofertas Kiosko
              </button>
            </div>
          </div>
        </section>

        {/* LA BANCA LIVE SYNC CARD */}
        <section className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border border-blue-600/40 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                Conexión Oficial
              </span>
              <h2 className="text-base font-black text-white">LA BANCA URUGUAY</h2>
            </div>

            <button
              onClick={handleSyncLaBanca}
              disabled={syncing}
              className="py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black tracking-wider flex items-center gap-2 shadow-lg transition active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Consultando...' : 'SINCRONIZAR AHORA'}
            </button>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            Consulta los resultados oficiales. 
            <span className="text-yellow-300 font-semibold ml-1">
              Si los primeros 10 resultados coinciden con lo anterior, no se reenvía a la TV.
            </span>
          </p>

          {/* Sync Feedback Message */}
          {syncFeedback && (
            <div className={`p-3 rounded-xl text-xs font-medium border flex flex-col gap-1.5 ${
              syncFeedback.updated
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                : 'bg-amber-950/70 border-amber-500/50 text-amber-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {syncFeedback.updated ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>¡Nuevos resultados detectados y emitidos al TV!</span>
                  </>
                ) : (
                  <>
                    <Info className="w-4 h-4 text-amber-400" />
                    <span>Sin cambios en los primeros 10 resultados (no se reenvía)</span>
                  </>
                )}
              </div>
              <ul className="list-disc list-inside space-y-0.5 opacity-90 pl-1 text-[11px]">
                {syncFeedback.details && Object.entries(syncFeedback.details).map(([k, msg]) => (
                  <li key={k}><strong className="capitalize">{k}:</strong> {msg}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Section Navigation Tabs */}
        <nav className="flex overflow-x-auto gap-2 py-1 no-scrollbar select-none">
          {[
            { id: 'quinielaVesp', label: 'Quiniela Vesp.', color: 'border-emerald-500 text-emerald-400' },
            { id: 'tombolaVesp', label: 'Tómbola Vesp.', color: 'border-red-500 text-red-400' },
            { id: 'quinielaNoct', label: 'Quiniela Noct.', color: 'border-emerald-500 text-emerald-400' },
            { id: 'tombolaNoct', label: 'Tómbola Noct.', color: 'border-red-500 text-red-400' },
            { id: 'cincoDeOro', label: '5 de Oro', color: 'border-blue-500 text-blue-400' },
            { id: 'kiosko', label: '🛍️ Kiosko Belvedere', color: 'border-amber-500 text-amber-400' },
            { id: 'config', label: 'Ajustes TV', color: 'border-yellow-500 text-yellow-400' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                activeTab === tab.id
                  ? `bg-gray-800 ${tab.color} shadow-md`
                  : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* TAB 1: QUINIELA VESPERTINA */}
        {activeTab === 'quinielaVesp' && (
          <div className="bg-gray-900 border border-emerald-900/40 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div>
                <h2 className="text-base font-black text-emerald-400 uppercase tracking-wide">
                  Quiniela Vespertina
                </h2>
                <p className="text-xs text-gray-400">
                  Fecha del sorteo: <strong className="text-white">{data.quinielaVespertina?.fecha || 'Pendiente'}</strong>
                </p>
              </div>
              <button
                onClick={() => {
                  setPasteTarget('quinielaVespertina');
                  setPasteModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-bold text-emerald-300 rounded-lg transition"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                Pegar Lista
              </button>
            </div>

            <button
              onClick={() => generateTombolaFromQuiniela('quinielaVespertina', 'tombolaVespertina')}
              className="w-full py-2 px-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-xl text-xs font-black tracking-wider flex items-center justify-center gap-2 shadow-md transition"
            >
              <Sparkles className="w-4 h-4" />
              COPIAR Y ORDENAR A TÓMBOLA VESPERTINA
            </button>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {Array.from({ length: 20 }, (_, i) => {
                const pos = String(i + 1).padStart(2, '0');
                const val = data.quinielaVespertina?.numeros?.[i] || '';
                const key = `quinielaVespertina-${i}`;
                return (
                  <div key={pos} className="flex items-center gap-2 bg-gray-950/60 p-1.5 rounded-lg border border-gray-800">
                    <span className="text-xs font-bold text-emerald-400 w-6 text-right font-mono">{pos}</span>
                    <input
                      ref={(el) => (inputsRef.current[key] = el)}
                      type="tel"
                      pattern="[0-9]*"
                      maxLength={3}
                      value={val}
                      onChange={(e) => handleNumberChange('quinielaVespertina', i, e.target.value, 3)}
                      placeholder="---"
                      className="w-full bg-gray-900 text-white font-mono font-bold text-center py-1.5 px-2 rounded border border-gray-700 text-base focus:border-emerald-400 focus:bg-gray-800 outline-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: TÓMBOLA VESPERTINA */}
        {activeTab === 'tombolaVesp' && (
          <div className="bg-gray-900 border border-red-900/40 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div>
                <h2 className="text-base font-black text-red-400 uppercase tracking-wide">
                  Tómbola Vespertina
                </h2>
                <p className="text-xs text-gray-400">
                  Fecha del sorteo: <strong className="text-white">{data.tombolaVespertina?.fecha || 'Pendiente'}</strong>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => sortTombola('tombolaVespertina')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-bold text-yellow-400 rounded-lg transition"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Ordenar
                </button>
                <button
                  onClick={() => {
                    setPasteTarget('tombolaVespertina');
                    setPasteModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-bold text-red-300 rounded-lg transition"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  Pegar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {Array.from({ length: 20 }, (_, i) => {
                const val = data.tombolaVespertina?.numeros?.[i] || '';
                const key = `tombolaVespertina-${i}`;
                return (
                  <div key={i} className="flex flex-col items-center bg-gray-950/60 p-2 rounded-xl border border-gray-800">
                    <span className="text-[10px] font-bold text-gray-400 mb-1">#{i + 1}</span>
                    <input
                      ref={(el) => (inputsRef.current[key] = el)}
                      type="tel"
                      pattern="[0-9]*"
                      maxLength={2}
                      value={val}
                      onChange={(e) => handleNumberChange('tombolaVespertina', i, e.target.value, 2)}
                      placeholder="--"
                      className="w-full bg-gray-900 text-cyan-300 font-mono font-black text-center py-2 px-1 rounded-lg border border-gray-700 text-lg focus:border-red-400 focus:bg-gray-800 outline-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: QUINIELA NOCTURNA */}
        {activeTab === 'quinielaNoct' && (
          <div className="bg-gray-900 border border-emerald-900/40 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div>
                <h2 className="text-base font-black text-emerald-400 uppercase tracking-wide">
                  Quiniela Nocturna
                </h2>
                <p className="text-xs text-gray-400">
                  Fecha del sorteo: <strong className="text-white">{data.quinielaNocturna?.fecha || 'Pendiente'}</strong>
                </p>
              </div>
              <button
                onClick={() => {
                  setPasteTarget('quinielaNocturna');
                  setPasteModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-bold text-emerald-300 rounded-lg transition"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                Pegar Lista
              </button>
            </div>

            <button
              onClick={() => generateTombolaFromQuiniela('quinielaNocturna', 'tombolaNocturna')}
              className="w-full py-2 px-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-xl text-xs font-black tracking-wider flex items-center justify-center gap-2 shadow-md transition"
            >
              <Sparkles className="w-4 h-4" />
              COPIAR Y ORDENAR A TÓMBOLA NOCTURNA
            </button>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {Array.from({ length: 20 }, (_, i) => {
                const pos = String(i + 1).padStart(2, '0');
                const val = data.quinielaNocturna?.numeros?.[i] || '';
                const key = `quinielaNocturna-${i}`;
                return (
                  <div key={pos} className="flex items-center gap-2 bg-gray-950/60 p-1.5 rounded-lg border border-gray-800">
                    <span className="text-xs font-bold text-emerald-400 w-6 text-right font-mono">{pos}</span>
                    <input
                      ref={(el) => (inputsRef.current[key] = el)}
                      type="tel"
                      pattern="[0-9]*"
                      maxLength={3}
                      value={val}
                      onChange={(e) => handleNumberChange('quinielaNocturna', i, e.target.value, 3)}
                      placeholder="---"
                      className="w-full bg-gray-900 text-white font-mono font-bold text-center py-1.5 px-2 rounded border border-gray-700 text-base focus:border-emerald-400 focus:bg-gray-800 outline-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: TÓMBOLA NOCTURNA */}
        {activeTab === 'tombolaNoct' && (
          <div className="bg-gray-900 border border-red-900/40 rounded-2xl p-4 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div>
                <h2 className="text-base font-black text-red-400 uppercase tracking-wide">
                  Tómbola Nocturna
                </h2>
                <p className="text-xs text-gray-400">
                  Fecha del sorteo: <strong className="text-white">{data.tombolaNocturna?.fecha || 'Pendiente'}</strong>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => sortTombola('tombolaNocturna')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-bold text-yellow-400 rounded-lg transition"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Ordenar
                </button>
                <button
                  onClick={() => {
                    setPasteTarget('tombolaNocturna');
                    setPasteModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-bold text-red-300 rounded-lg transition"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  Pegar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {Array.from({ length: 20 }, (_, i) => {
                const val = data.tombolaNocturna?.numeros?.[i] || '';
                const key = `tombolaNocturna-${i}`;
                return (
                  <div key={i} className="flex flex-col items-center bg-gray-950/60 p-2 rounded-xl border border-gray-800">
                    <span className="text-[10px] font-bold text-gray-400 mb-1">#{i + 1}</span>
                    <input
                      ref={(el) => (inputsRef.current[key] = el)}
                      type="tel"
                      pattern="[0-9]*"
                      maxLength={2}
                      value={val}
                      onChange={(e) => handleNumberChange('tombolaNocturna', i, e.target.value, 2)}
                      placeholder="--"
                      className="w-full bg-gray-900 text-cyan-300 font-mono font-black text-center py-2 px-1 rounded-lg border border-gray-700 text-lg focus:border-red-400 focus:bg-gray-800 outline-none"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: 5 DE ORO */}
        {activeTab === 'cincoDeOro' && (
          <div className="bg-gray-900 border border-blue-900/40 rounded-2xl p-4 flex flex-col gap-5 shadow-xl">
            <div className="border-b border-gray-800 pb-3">
              <h2 className="text-base font-black text-blue-400 uppercase tracking-wide">
                5 de Oro - Pozos Aproximados
              </h2>
              <p className="text-xs text-gray-400">Montos y fecha del próximo sorteo oficial</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                Pozo de Oro ($)
              </label>
              <input
                type="text"
                value={data.cincoDeOro?.pozoOro || ''}
                onChange={(e) => {
                  setData({
                    ...data,
                    cincoDeOro: {
                      ...data.cincoDeOro,
                      pozoOro: formatCurrency(e.target.value)
                    }
                  });
                }}
                placeholder="$ 17.400.000"
                className="w-full bg-gray-950 text-white font-mono font-black text-2xl py-3 px-4 rounded-xl border border-gray-700 focus:border-blue-400 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                Pozo Revancha ($)
              </label>
              <input
                type="text"
                value={data.cincoDeOro?.pozoRevancha || ''}
                onChange={(e) => {
                  setData({
                    ...data,
                    cincoDeOro: {
                      ...data.cincoDeOro,
                      pozoRevancha: formatCurrency(e.target.value)
                    }
                  });
                }}
                placeholder="$ 26.600.000"
                className="w-full bg-gray-950 text-white font-mono font-black text-2xl py-3 px-4 rounded-xl border border-gray-700 focus:border-blue-400 outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Leyenda Próximo Sorteo
              </label>
              <input
                type="text"
                value={data.cincoDeOro?.proximoSorteo || ''}
                onChange={(e) => {
                  setData({
                    ...data,
                    cincoDeOro: {
                      ...data.cincoDeOro,
                      proximoSorteo: e.target.value
                    }
                  });
                }}
                placeholder="Ej: Jueves 5, Lunes 23"
                className="w-full bg-gray-950 text-white font-bold text-lg py-2.5 px-4 rounded-xl border border-gray-700 focus:border-blue-400 outline-none"
              />
            </div>
          </div>
        )}

        {/* TAB 6: OFERTAS KIOSKO BELVEDERE */}
        {activeTab === 'kiosko' && (
          <div className="bg-gray-900 border border-amber-900/40 rounded-2xl p-4 flex flex-col gap-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div>
                <h2 className="text-base font-black text-amber-400 uppercase tracking-wide flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                  Kiosko Belvedere
                </h2>
                <p className="text-xs text-gray-400">Pantallas de ofertas y promociones para el TV</p>
              </div>

              <button
                onClick={addPromoSlide}
                className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs rounded-xl transition shadow"
              >
                <Plus className="w-4 h-4" />
                Nueva Oferta
              </button>
            </div>

            {(!data.promociones || data.promociones.length === 0) ? (
              <div className="p-8 text-center bg-gray-950/60 rounded-xl border border-dashed border-gray-800">
                <Flame className="w-10 h-10 text-amber-500 mx-auto mb-2 opacity-60" />
                <p className="text-sm font-bold text-gray-300">No hay ofertas de Kiosko creadas</p>
                <p className="text-xs text-gray-500 mt-1">Presiona "Nueva Oferta" para agregar productos destacados al ciclo del televisor.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {data.promociones.map((promo, idx) => (
                  <div key={promo.id || idx} className="bg-gray-950/80 border border-gray-800 rounded-2xl p-4 flex flex-col gap-3 shadow-md">
                    {/* Header of each promo item */}
                    <div className="flex items-center justify-between border-b border-gray-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-black uppercase text-gray-300">
                          {promo.titulo || 'Oferta'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Active toggle */}
                        <button
                          onClick={() => updatePromoSlide(idx, 'active', !promo.active)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                            promo.active !== false
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-gray-800 text-gray-500 border border-gray-700'
                          }`}
                        >
                          {promo.active !== false ? 'Activa' : 'Pausada'}
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => removePromoSlide(idx)}
                          className="p-1.5 bg-red-950/50 hover:bg-red-900/70 text-red-400 rounded-lg transition"
                          title="Eliminar oferta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                          Etiqueta (Badge)
                        </label>
                        <input
                          type="text"
                          value={promo.tag || ''}
                          onChange={(e) => updatePromoSlide(idx, 'tag', e.target.value)}
                          placeholder="SUPER PROMO, OFERTA, COMBO"
                          className="w-full bg-gray-900 text-white text-xs font-bold py-1.5 px-2.5 rounded-lg border border-gray-700 focus:border-amber-400 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                          Tema Visual
                        </label>
                        <select
                          value={promo.tema || 'orange'}
                          onChange={(e) => updatePromoSlide(idx, 'tema', e.target.value)}
                          className="w-full bg-gray-900 text-white text-xs font-bold py-1.5 px-2 rounded-lg border border-gray-700 focus:border-amber-400 outline-none"
                        >
                          <option value="orange">🔥 Naranja Fuego</option>
                          <option value="yellow">⭐ Amarillo Impacto</option>
                          <option value="purple">⚡ Violeta Neón</option>
                          <option value="red">💥 Rojo Explosivo</option>
                          <option value="blue">❄️ Azul Real</option>
                          <option value="emerald">🌿 Verde Fresco</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                        Título del Producto (Grande)
                      </label>
                      <input
                        type="text"
                        value={promo.titulo || ''}
                        onChange={(e) => updatePromoSlide(idx, 'titulo', e.target.value)}
                        placeholder="Ej: Coca Cola 600ml + Alfajor Marley"
                        className="w-full bg-gray-900 text-white font-extrabold text-sm py-2 px-3 rounded-lg border border-gray-700 focus:border-amber-400 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                          Precio o Combo
                        </label>
                        <input
                          type="text"
                          value={promo.precio || ''}
                          onChange={(e) => updatePromoSlide(idx, 'precio', e.target.value)}
                          placeholder="Ej: $ 140 o 2 x $ 200"
                          className="w-full bg-gray-900 text-yellow-300 font-mono font-black text-base py-1.5 px-2.5 rounded-lg border border-gray-700 focus:border-amber-400 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                          Detalle / Subtítulo
                        </label>
                        <input
                          type="text"
                          value={promo.subtitulo || ''}
                          onChange={(e) => updatePromoSlide(idx, 'subtitulo', e.target.value)}
                          placeholder="Ej: ¡Ideal para la tarde!"
                          className="w-full bg-gray-900 text-white text-xs py-1.5 px-2.5 rounded-lg border border-gray-700 focus:border-amber-400 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                        Pie de oferta (Condiciones)
                      </label>
                      <input
                        type="text"
                        value={promo.nota || ''}
                        onChange={(e) => updatePromoSlide(idx, 'nota', e.target.value)}
                        placeholder="Ej: Hasta agotar stock | Kiosko Belvedere"
                        className="w-full bg-gray-900 text-gray-300 text-xs py-1.5 px-2.5 rounded-lg border border-gray-700 focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: CONFIGURACIÓN / PANTALLAS ACTIVAS */}
        {activeTab === 'config' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col gap-5 shadow-xl">
            <div className="border-b border-gray-800 pb-3">
              <h2 className="text-base font-black text-yellow-400 uppercase tracking-wide flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuración del TV
              </h2>
              <p className="text-xs text-gray-400">Control de rotación y pantallas activas</p>
            </div>

            {/* Rotation Duration */}
            <div className="flex items-center justify-between bg-gray-950/60 p-3 rounded-xl border border-gray-800">
              <div>
                <label className="text-sm font-bold text-white block">Tiempo por pantalla</label>
                <span className="text-xs text-gray-400">Duración del ciclo (1 minuto = 60 seg)</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={data.rotationSeconds || 60}
                  onChange={(e) => {
                    setData({
                      ...data,
                      rotationSeconds: parseInt(e.target.value, 10) || 60
                    });
                  }}
                  className="w-20 bg-gray-900 text-yellow-400 font-mono font-bold text-center py-1.5 px-2 rounded-lg border border-gray-700 text-base"
                />
                <span className="text-xs font-semibold text-gray-400">seg</span>
              </div>
            </div>

            {/* Toggle individual screens */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Pantallas de Lotería en el ciclo del TV
              </span>

              {[
                { key: 'quinielaVespertina', label: 'Quiniela Vespertina', badge: 'Verde' },
                { key: 'tombolaVespertina', label: 'Tómbola Vespertina', badge: 'Roja' },
                { key: 'quinielaNocturna', label: 'Quiniela Nocturna', badge: 'Verde' },
                { key: 'tombolaNocturna', label: 'Tómbola Nocturna', badge: 'Roja' },
                { key: 'cincoDeOro', label: '5 de Oro (Pozos)', badge: 'Azul' }
              ].map((item) => {
                const isActive = data.activeScreens?.[item.key] !== false;
                return (
                  <div
                    key={item.key}
                    onClick={() => {
                      setData({
                        ...data,
                        activeScreens: {
                          ...data.activeScreens,
                          [item.key]: !isActive
                        }
                      });
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer select-none ${
                      isActive
                        ? 'bg-gray-800/80 border-yellow-400/50 shadow-sm'
                        : 'bg-gray-950/40 border-gray-800 opacity-60'
                    }`}
                  >
                    <span className="text-sm font-bold text-white">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-gray-400">{item.badge}</span>
                      <div className={`w-9 h-5 rounded-full p-0.5 transition ${isActive ? 'bg-emerald-500' : 'bg-gray-700'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition transform ${isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* Floating Save Button Bar at Bottom */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-gray-950/90 backdrop-blur-lg border-t border-gray-800 p-3 sm:p-4">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex-1 py-3.5 px-4 rounded-xl font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl transition transform active:scale-[0.98] ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black'
            }`}
          >
            {saving ? (
              <>
                <RotateCw className="w-5 h-5 animate-spin" />
                Guardando...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-5 h-5" />
                ¡Pantalla Actualizada!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Guardar y Actualizar TV
              </>
            )}
          </button>
        </div>
      </footer>

      {/* Modal for Bulk Text Paste */}
      {pasteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-5 flex flex-col gap-4 shadow-2xl">
            <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              <ClipboardPaste className="w-5 h-5 text-yellow-400" />
              Pegar Bloque de Números
            </h3>
            <p className="text-xs text-gray-400">
              Pega aquí la lista completa de números. El sistema extraerá automáticamente los 20 premios.
            </p>
            <textarea
              rows={6}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Ejemplo: 016 362 312 058 682 907 395 838 697 760 282 651..."
              className="w-full bg-gray-900 text-white font-mono text-sm p-3 rounded-xl border border-gray-700 focus:border-yellow-400 outline-none"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setPasteModalOpen(false);
                  setPasteText('');
                }}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleBulkPaste}
                className="px-4 py-2 bg-yellow-400 text-black font-black rounded-xl text-xs hover:bg-yellow-300 shadow"
              >
                Cargar Números
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
