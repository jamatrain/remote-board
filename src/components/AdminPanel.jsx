import React, { useState, useEffect, useRef } from 'react';
import { 
  Tv, 
  Save, 
  RotateCw, 
  Copy, 
  Check, 
  AlertCircle, 
  AlertTriangle,
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
  Pause,
  Lock,
  Unlock,
  Key,
  Database,
  Download,
  Upload,
  HardDrive,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { syncWithLaBancaClient } from '../utils/labancaClient';
import { 
  getLocalData, 
  saveLocalData, 
  hasLocalData, 
  exportBackupJson, 
  importBackupJson, 
  clearLocalData, 
  reconcileData 
} from '../utils/localStore';

export function AdminPanel() {
  const [data, setData] = useState(() => getLocalData());
  const [loading, setLoading] = useState(() => !hasLocalData());
  const [localDbStatus, setLocalDbStatus] = useState(() => hasLocalData() ? 'cached' : 'empty');
  const [localSavedDate, setLocalSavedDate] = useState(() => {
    const local = getLocalData();
    if (local?._localSavedAt) {
      const d = new Date(local._localSavedAt);
      return `${d.toLocaleDateString('es-UY')} ${d.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return null;
  });
  const fileInputRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);
  const [activeTab, setActiveTab] = useState('quinielaVesp');
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [pasteTarget, setPasteTarget] = useState(null);
  const [pasteText, setPasteText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // 4-Digit Security PIN State (Supports URL query param: ?pin=XXXX and localStorage)
  const [pin, setPin] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlPin = urlParams.get('pin');
      if (urlPin && urlPin.length === 4) {
        localStorage.setItem('kb_admin_pin', urlPin);
        return urlPin;
      }
      return localStorage.getItem('kb_admin_pin') || '';
    } catch (e) {
      return '';
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlPin = urlParams.get('pin');
      if (urlPin && urlPin.length === 4) return true;
      return !!localStorage.getItem('kb_admin_pin');
    } catch (e) {
      return false;
    }
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [changePinModalOpen, setChangePinModalOpen] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [changePinSuccess, setChangePinSuccess] = useState(false);

  // Popup Modal for Adding/Editing Kiosko Belvedere Promotions
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [editingPromoIndex, setEditingPromoIndex] = useState(null);
  const [promoDraft, setPromoDraft] = useState({
    tag: 'SUPER PROMO',
    titulo: '',
    subtitulo: 'Aprovechá hoy en Kiosko Belvedere',
    precio: '$ 100',
    nota: 'Hasta agotar stock | Kiosko Belvedere',
    tema: 'orange',
    modelo: 'inclinado'
  });

  // References for auto-jumping inputs
  const inputsRef = useRef({});

  // IP local de la Android TV Box para lanzar Fully Kiosk vía Remote Admin
  const [tvBoxIp, setTvBoxIp] = useState(() => {
    try {
      return localStorage.getItem('kb_tvbox_ip') || '';
    } catch {
      return '';
    }
  });

  const handleVerifyPin = async (e) => {
    if (e) e.preventDefault();
    if (!pinInput || pinInput.length !== 4) {
      setPinError('El PIN debe tener 4 dígitos numéricos');
      return;
    }
    try {
      const res = await fetch('/api/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput })
      });
      const json = await res.json();
      if (json.valid) {
        setPin(pinInput);
        setIsAuthenticated(true);
        localStorage.setItem('kb_admin_pin', pinInput);
        setPinError('');
      } else {
        setPinError('PIN incorrecto. Reintentá.');
      }
    } catch (err) {
      setPinError('Error al validar PIN: ' + err.message);
    }
  };

  const handleChangePin = async (e) => {
    if (e) e.preventDefault();
    if (!newPinInput || newPinInput.length !== 4 || isNaN(Number(newPinInput))) {
      alert('El nuevo PIN debe ser de 4 dígitos numéricos');
      return;
    }
    try {
      const res = await fetch('/api/change-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pin
        },
        body: JSON.stringify({ newPin: newPinInput })
      });
      const json = await res.json();
      if (json.success) {
        setPin(newPinInput);
        localStorage.setItem('kb_admin_pin', newPinInput);
        setChangePinSuccess(true);
        setNewPinInput('');
        setTimeout(() => {
          setChangePinSuccess(false);
          setChangePinModalOpen(false);
        }, 1500);
      } else {
        alert(json.error || 'Error al cambiar PIN');
      }
    } catch (err) {
      alert('Error de red al cambiar PIN');
    }
  };

  const handleLogoutPin = () => {
    localStorage.removeItem('kb_admin_pin');
    setPin('');
    setIsAuthenticated(false);
    setPinInput('');
  };

  const loadData = async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const serverJson = await res.json();
        const localJson = getLocalData();
        const { dataToUse, shouldRepopulateServer } = reconcileData(serverJson, localJson);

        setData(dataToUse);
        saveLocalData(dataToUse);
        setLocalDbStatus('synced');
        setLocalSavedDate(new Date().toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' }));

        // Si el servidor de Render se reinició con la imagen Docker por defecto,
        // restauramos automáticamente la configuración local del usuario en la nube y el TV
        if (shouldRepopulateServer) {
          const authPin = pin || localStorage.getItem('kb_admin_pin') || '4355';
          console.log('⚡ [Auto-Repoblar] Servidor reiniciado detectado. Restaurando configuración local...');
          await fetch('/api/data', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-admin-pin': authPin
            },
            body: JSON.stringify(dataToUse)
          });
        }
      }
    } catch (err) {
      console.warn('Error fetching data from server (usando base local):', err);
      const localJson = getLocalData();
      if (localJson) {
        setData(localJson);
      }
      setLocalDbStatus('offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (customData = null) => {
    // Sanitizar toSave: asegurarse de que nunca sea un evento de React o DOM
    let toSave = data;
    if (customData && typeof customData === 'object') {
      const isEvent = 'nativeEvent' in customData || 'target' in customData || '_reactName' in customData || typeof customData.preventDefault === 'function';
      if (!isEvent && (customData.activeScreens || customData.quinielaVespertina || customData.promociones || customData.rotationSeconds)) {
        toSave = customData;
      }
    }
    if (!toSave) return false;

    // 1. Guardar de inmediato en la base de datos local de este dispositivo
    saveLocalData(toSave);
    const nowStr = new Date().toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' });
    setLocalSavedDate(nowStr);
    setLocalDbStatus('synced');

    setSaving(true);
    try {
      const authPin = pin || localStorage.getItem('kb_admin_pin') || '4355';
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-pin': authPin
        },
        body: JSON.stringify(toSave)
      });
      if (res.status === 401) {
        handleLogoutPin();
        alert('PIN expirado o incorrecto. Por favor ingresá el PIN nuevamente.');
        return false;
      }
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
        return true;
      }
    } catch (err) {
      alert('Aviso: Los cambios se guardaron en este dispositivo, pero falló la conexión con el servidor (' + err.message + '). Se reintentará al reconectar.');
      setLocalDbStatus('offline');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Trigger sync with official La Banca API (Direct client fetch in Uruguay + Cloud server fallback)
  const handleSyncLaBanca = async () => {
    setSyncing(true);
    setSyncFeedback(null);
    try {
      // 1. INTENTO DIRECTO DESDE EL NAVEGADOR (IP Local Uruguaya - sin bloqueo de Cloudflare en Render)
      try {
        const clientRes = await syncWithLaBancaClient(data);
        if (clientRes && !clientRes.error) {
          if (clientRes.result.updated) {
            setData(clientRes.updatedData);
            await handleSave(clientRes.updatedData);
            setSyncFeedback({
              updated: true,
              details: clientRes.result.details,
              message: '¡Nuevos resultados detectados y emitidos al TV!'
            });
          } else {
            setSyncFeedback({
              updated: false,
              details: clientRes.result.details,
              message: 'Resultados oficiales verificados: coinciden con los que ya están en pantalla.'
            });
          }
          return;
        }
      } catch (clientErr) {
        console.warn('Sync directo desde navegador falló, recurriendo al servidor:', clientErr);
      }

      // 2. FALLBACK AL SERVIDOR EN CASO DE ERROR EN CLIENTE
      const res = await fetch('/api/sync', { 
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-pin': pin
        }
      });
      if (res.status === 401) {
        handleLogoutPin();
        alert('PIN de seguridad incorrecto.');
        return;
      }
      const json = await res.json();
      if (json.success) {
        if (json.error) {
          setSyncFeedback({
            updated: false,
            hasError: true,
            message: `Aviso de conexión con La Banca (${json.error}). Si la API está temporalmente inaccesible, podés cargar los sorteos con "Pegar Bloque".`
          });
        } else {
          if (json.data) setData(json.data);
          setSyncFeedback({
            updated: json.updated,
            cooldown: json.cooldown,
            message: json.updated 
              ? '¡Nuevos resultados detectados y emitidos al TV!' 
              : 'Resultados oficiales verificados: coinciden con los que ya están en pantalla.',
            details: json.details
          });
        }
      } else {
        alert('Error al sincronizar sorteos: ' + (json.error || 'Error desconocido'));
      }
    } catch (err) {
      alert('Error de red al consultar sorteos: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const [tvControlStatus, setTvControlStatus] = useState(null);

  const sendTvControl = async (action, slideIndex = null) => {
    try {
      const authPin = pin || localStorage.getItem('kb_admin_pin') || '4355';
      const res = await fetch('/api/control', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-pin': authPin
        },
        body: JSON.stringify({ action, slideIndex })
      });
      if (res.status === 401) {
        handleLogoutPin();
        return;
      }
      if (res.ok) {
        const json = await res.json();
        if (json.command && typeof json.command.isPaused === 'boolean') {
          setData(prev => prev ? ({ ...prev, isPaused: json.command.isPaused }) : prev);
        }
        let label = 'Comando enviado';
        if (action === 'next') label = 'Siguiente enviado';
        else if (action === 'prev') label = 'Anterior enviado';
        else if (action === 'pause') label = '⏸ Giro Pausado';
        else if (action === 'resume') label = '▶️ Giro Reanudado';
        else if (action === 'reload') label = '🔄 Recargando TV...';
        else if (action === 'togglePause') label = json.command?.isPaused ? '⏸ Giro Pausado' : '▶️ Giro Reanudado';
        setTvControlStatus(label);
        setTimeout(() => setTvControlStatus(null), 2000);
      }
    } catch (e) {
      console.error('Error enviando comando a TV:', e);
    }
  };

  const launchFullyKioskOnTv = (targetIp = null) => {
    let ip = targetIp || tvBoxIp;
    if (!ip) {
      const entered = prompt('Ingresá la IP local de la Android TV Box (ej: 192.168.1.50):', '192.168.1.');
      if (!entered || !entered.trim()) return;
      const cleanIp = entered.trim().replace(/^https?:\/\//, '').replace(/:2323\/?$/, '').replace(/\/$/, '');
      setTvBoxIp(cleanIp);
      localStorage.setItem('kb_tvbox_ip', cleanIp);
      ip = cleanIp;
    }

    const cleanIp = ip.trim().replace(/^https?:\/\//, '').replace(/:2323\/?$/, '').replace(/\/$/, '');
    const targetUrl = encodeURIComponent('https://kiosko-belvedere.onrender.com/tv');
    const authPass = '4355';

    // 1. Cargar la URL de la cartelería en Fully Kiosk
    const loadUrlCmd = `http://${cleanIp}:2323/?cmd=loadURL&url=${targetUrl}&password=${authPass}`;
    const img1 = new Image();
    img1.src = loadUrlCmd;

    // 2. Traer Fully Kiosk al primer plano
    setTimeout(() => {
      const bringFgCmd = `http://${cleanIp}:2323/?cmd=bringToForeground&password=${authPass}`;
      const img2 = new Image();
      img2.src = bringFgCmd;
    }, 300);

    setTvControlStatus(`🚀 Kiosk lanzado en ${cleanIp}`);
    setTimeout(() => setTvControlStatus(null), 3500);
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

  const handleCincoDeOroNumberChange = (subfield, index, value) => {
    const clean = value.replace(/\D/g, '').slice(0, 2);
    const updated = [...(data.cincoDeOro?.[subfield] || Array(5).fill(''))];
    updated[index] = clean;

    setData({
      ...data,
      cincoDeOro: {
        ...data.cincoDeOro,
        [subfield]: updated
      }
    });

    if (clean.length === 2 && index < 4) {
      const nextKey = `c5oro-${subfield}-${index + 1}`;
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
    const raw = String(val || '').replace(/\D/g, '');
    if (!raw) return '';
    const num = parseInt(raw, 10);
    return '$ ' + num.toLocaleString('es-UY');
  };

  // Kiosko Belvedere Promotions management with Popup Modal
  const openNewPromoModal = () => {
    setEditingPromoIndex(null);
    setPromoDraft({
      tag: 'SUPER PROMO',
      titulo: '',
      subtitulo: 'Aprovechá hoy en Kiosko Belvedere',
      precio: '$ 100',
      nota: 'Hasta agotar stock | Kiosko Belvedere',
      tema: 'orange',
      modelo: 'inclinado'
    });
    setPromoModalOpen(true);
  };

  const openEditPromoModal = (index) => {
    setEditingPromoIndex(index);
    const existing = data.promociones[index];
    setPromoDraft({
      tag: existing.tag || 'SUPER PROMO',
      titulo: existing.titulo || '',
      subtitulo: existing.subtitulo || 'Aprovechá hoy en Kiosko Belvedere',
      precio: existing.precio || '$ 100',
      nota: existing.nota || 'Hasta agotar stock | Kiosko Belvedere',
      tema: existing.tema || 'orange',
      modelo: existing.modelo || 'clasico'
    });
    setPromoModalOpen(true);
  };

  const handleSavePromoDraft = async (e) => {
    if (e) e.preventDefault();
    if (!promoDraft.titulo.trim()) {
      alert('Por favor escribí el título o nombre de la oferta');
      return;
    }
    const list = [...(data.promociones || [])];
    if (editingPromoIndex !== null) {
      list[editingPromoIndex] = {
        ...list[editingPromoIndex],
        ...promoDraft
      };
    } else {
      list.push({
        id: `promo-${Date.now()}`,
        active: true,
        ...promoDraft
      });
    }
    const updated = { ...data, promociones: list };
    setData(updated);
    setPromoModalOpen(false);
    await handleSave(updated);
  };

  const addPromoSlide = () => {
    openNewPromoModal();
  };

  const updatePromoSlide = (index, field, value) => {
    const list = [...(data.promociones || [])];
    list[index] = { ...list[index], [field]: value };
    setData({ ...data, promociones: list });
  };

  const removePromoSlide = async (index) => {
    if (confirm('¿Seguro que deseas eliminar esta oferta?')) {
      const list = [...(data.promociones || [])];
      list.splice(index, 1);
      const updated = { ...data, promociones: list };
      setData(updated);
      await handleSave(updated);
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

  // 4-Digit PIN Security Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 select-none">
        <div className="w-full max-w-sm bg-gray-900 border-2 border-yellow-400/90 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-yellow-400 text-black flex items-center justify-center shadow-lg mb-4 animate-bounce">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black text-white tracking-wider uppercase mb-1">
            KIOSKO BELVEDERE
          </h1>
          <p className="text-xs text-gray-400 mb-6">Panel de Control Protegido</p>

          <form onSubmit={handleVerifyPin} className="w-full flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-yellow-300 uppercase tracking-wider block mb-2">
                Ingresá tu PIN de 4 dígitos
              </label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                  setPinError('');
                }}
                placeholder="••••"
                className="w-48 text-center text-4xl font-mono tracking-[0.4em] py-3 bg-gray-950 border-2 border-yellow-400 rounded-2xl text-white outline-none focus:ring-4 focus:ring-yellow-400/50 shadow-inner mx-auto block"
              />
              {pinError && (
                <p className="text-xs font-bold text-red-400 mt-2">{pinError}</p>
              )}
              <p className="text-[11px] text-gray-500 mt-2">PIN inicial por defecto: 1234</p>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-black font-black text-sm uppercase tracking-widest rounded-xl shadow-lg transition active:scale-95"
            >
              Desbloquear Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col pb-28">
      {/* Top Header - Re-encuadrado y alineado con precisión */}
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-3 sm:px-4 py-2.5 flex items-center justify-between shadow-lg">
        <div className="flex flex-col justify-center min-w-0 pr-2">
          <h1 className="text-base sm:text-lg font-black text-white tracking-wider flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            PANEL DE CONTROL
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] sm:text-xs text-gray-400 font-medium truncate">Kiosko Belvedere</span>
            <span 
              className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 border transition flex-shrink-0 ${
                localDbStatus === 'synced'
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                  : localDbStatus === 'offline'
                  ? 'bg-amber-950/80 text-amber-400 border-amber-500/40'
                  : 'bg-blue-950/80 text-blue-400 border-blue-500/40'
              }`}
              title="Base de datos persistente en la memoria de este dispositivo"
            >
              <Database className="w-2.5 h-2.5" />
              <span>Base Local</span>
            </span>
          </div>
        </div>

        {/* Acciones del Header perfectamente alineadas y proporcionadas con la misma altura */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Botón PIN */}
          <button
            type="button"
            onClick={() => setChangePinModalOpen(true)}
            className="h-8 px-2 sm:px-2.5 bg-gray-800/90 hover:bg-gray-700 active:bg-gray-750 text-yellow-300 rounded-lg text-xs font-bold transition shadow-sm border border-yellow-500/30 flex items-center justify-center gap-1"
            title="Cambiar PIN de seguridad"
          >
            <Key className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
            <span>PIN</span>
          </button>

          {/* Botón Copiar Link TV */}
          <button
            type="button"
            onClick={copyTvLink}
            className="h-8 px-2.5 sm:px-3 bg-gray-800/90 hover:bg-gray-700 active:bg-gray-750 text-gray-200 rounded-lg text-xs font-bold transition shadow-sm border border-gray-700 flex items-center justify-center gap-1"
            title="Copiar URL para el TV"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" /> : <Copy className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />}
            <span>{copiedLink ? '¡Copiado!' : 'Link TV'}</span>
          </button>

          {/* Botón Ver TV */}
          <a
            href="/tv"
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white rounded-lg text-xs font-black transition shadow-md border border-blue-400/40 flex items-center justify-center gap-1.5"
            title="Abrir pantalla del televisor en nueva pestaña"
          >
            <Tv className="w-3.5 h-3.5 text-blue-200 flex-shrink-0" />
            <span>Ver TV</span>
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
              <h2 className="text-base font-black text-white">Control del Televisor</h2>
            </div>
            <div className="flex items-center gap-2">
              {tvControlStatus ? (
                <span className="text-xs bg-emerald-500 text-black font-black px-2.5 py-1 rounded-full animate-bounce">
                  {tvControlStatus}
                </span>
              ) : (
                <span className={`text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow ${
                  data?.isPaused 
                    ? 'bg-amber-500 text-black animate-pulse' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {data?.isPaused ? (
                    <>
                      <Pause className="w-3 h-3 fill-black" />
                      PAUSADO
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-emerald-300" />
                      EN GIRO (PLAY)
                    </>
                  )}
                </span>
              )}
            </div>
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

            {data?.isPaused ? (
              <button
                type="button"
                onClick={() => sendTvControl('resume')}
                className="flex items-center justify-center gap-1.5 py-3 px-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 active:scale-95 text-black rounded-xl font-black text-sm shadow-lg ring-2 ring-emerald-400/50 transition"
              >
                <Play className="w-4 h-4 fill-black" />
                Reanudar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => sendTvControl('pause')}
                className="flex items-center justify-center gap-1.5 py-3 px-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 active:scale-95 text-black rounded-xl font-black text-sm shadow-lg ring-2 ring-amber-400/50 transition"
              >
                <Pause className="w-4 h-4 fill-black" />
                Pausar
              </button>
            )}

            <button
              type="button"
              onClick={() => sendTvControl('next')}
              className="flex items-center justify-center gap-1.5 py-3 px-3 bg-emerald-600 active:bg-emerald-700 text-white rounded-xl font-black text-sm shadow-md transition"
            >
              Siguiente
              <SkipForward className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Estado explicativo */}
          <div className="text-center px-1">
            {data?.isPaused ? (
              <p className="text-[11px] font-bold text-amber-300 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-ping" />
                El televisor está fijo en esta pantalla. Tocá "Reanudar" para que vuelva a rotar solo.
              </p>
            ) : (
              <p className="text-[11px] font-medium text-emerald-300/90 flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                El televisor está rotando automáticamente cada pantalla cada 60 segundos.
              </p>
            )}
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
                🪙 Sorteo 5 Oro
              </button>
              <button
                type="button"
                onClick={() => sendTvControl('goto', 5)}
                className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-800 text-xs font-black text-yellow-300 rounded-lg whitespace-nowrap border border-indigo-400 shadow-md"
              >
                💰 Pozos 5 Oro
              </button>
              <button
                type="button"
                onClick={() => sendTvControl('goto', 6)}
                className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 text-xs font-black text-black rounded-lg whitespace-nowrap shadow-md"
              >
                ★ Ofertas Kiosko
              </button>
            </div>
          </div>

          {/* Fila de Acciones Remotas del TV: Recargar y Lanzar Kiosk */}
          <div className="pt-2.5 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            {/* Botón Recargar Navegador TV */}
            <button
              type="button"
              onClick={async () => {
                if (confirm('¿Deseas guardar los cambios y refrescar la pantalla del televisor remotamente?')) {
                  await handleSave(data);
                  sendTvControl('reload');
                }
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-800 hover:bg-gray-700 active:bg-cyan-600 text-cyan-300 rounded-xl text-xs font-bold transition border border-cyan-500/30 shadow-sm"
              title="Guardar y refrescar el televisor remotamente"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Guardar y Recargar TV</span>
            </button>

            {/* Botón Lanzar Fully Kiosk en Android TV Box */}
            <button
              type="button"
              onClick={() => launchFullyKioskOnTv()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 active:scale-95 text-white rounded-xl text-xs font-black transition border border-blue-400/40 shadow-sm"
              title="Abrir o traer al frente la aplicación Fully Kiosk en la Android TV Box"
            >
              <Smartphone className="w-3.5 h-3.5 text-yellow-300" />
              <span>{tvBoxIp ? `Lanzar Kiosk (${tvBoxIp})` : '🚀 Lanzar Kiosk en TV'}</span>
            </button>
          </div>
        </section>

        {/* SINCRONIZACIÓN DE RESULTADOS OFICIALES */}
        <section className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border border-blue-600/40 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                Sorteos Oficiales
              </span>
              <h2 className="text-base font-black text-white">RESULTADOS OFICIALES EN VIVO</h2>
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
                : syncFeedback.hasError
                ? 'bg-red-950/70 border-red-500/50 text-red-200'
                : 'bg-amber-950/70 border-amber-500/50 text-amber-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {syncFeedback.updated ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{syncFeedback.message || '¡Nuevos resultados detectados y emitidos al TV!'}</span>
                  </>
                ) : syncFeedback.hasError ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>{syncFeedback.message}</span>
                  </>
                ) : (
                  <>
                    <Info className="w-4 h-4 text-amber-400" />
                    <span>{syncFeedback.message || 'Resultados verificados: coinciden con la pantalla'}</span>
                  </>
                )}
              </div>
              {syncFeedback.details && Object.keys(syncFeedback.details).length > 0 && (
                <ul className="list-disc list-inside space-y-0.5 opacity-90 pl-1 text-[11px]">
                  {Object.entries(syncFeedback.details).map(([k, msg]) => (
                    <li key={k}><strong className="capitalize">{k}:</strong> {msg}</li>
                  ))}
                </ul>
              )}
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
          <div className="bg-gray-900 border border-blue-900/40 rounded-2xl p-4 flex flex-col gap-6 shadow-xl">
            <div className="border-b border-gray-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-blue-400 uppercase tracking-wide flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  5 de Oro - Sorteo Oficial y Pozos
                </h2>
                <p className="text-xs text-gray-400">
                  Resultados del sorteo (Miércoles y Domingos) con bolillas doradas y pozos acumulados
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gray-400">Fecha Sorteo:</span>
                <input
                  type="text"
                  value={data.cincoDeOro?.fecha || '18/11/26'}
                  onChange={(e) => {
                    setData({
                      ...data,
                      cincoDeOro: {
                        ...data.cincoDeOro,
                        fecha: e.target.value
                      }
                    });
                  }}
                  placeholder="DD/MM/AA"
                  maxLength={10}
                  className="w-24 bg-gray-950 text-yellow-300 font-mono font-bold text-xs text-center py-1 px-2 rounded-lg border border-gray-700 focus:border-yellow-400 outline-none"
                />
              </div>
            </div>

            {/* SECCIÓN 1: RESULTADOS DEL POZO DE ORO */}
            <div className="bg-gray-950/70 p-4 rounded-xl border border-blue-800/40 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_6px_#facc15]" />
                  <span className="text-xs font-black text-yellow-300 uppercase tracking-wider">
                    POZO DE ORO (5 Bolillas + Extra)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-400">Estado:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setData({
                        ...data,
                        cincoDeOro: {
                          ...data.cincoDeOro,
                          aciertosOro: Number(data.cincoDeOro?.aciertosOro) === 0 ? 1 : 0
                        }
                      });
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase transition border ${
                      Number(data.cincoDeOro?.aciertosOro) === 0
                        ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300'
                        : 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    }`}
                  >
                    {Number(data.cincoDeOro?.aciertosOro) === 0 ? '¡ VACANTE !' : `${data.cincoDeOro?.aciertosOro || 1} ACIERTO/S`}
                  </button>
                </div>
              </div>

              {/* Bolillas de Oro (5 Casillas Proporcionales) */}
              <div className="flex flex-col items-center gap-2.5 py-1">
                <div className="grid grid-cols-5 gap-2 w-full max-w-[340px]">
                  {Array.from({ length: 5 }, (_, i) => {
                    const val = data.cincoDeOro?.numerosOro?.[i] || '';
                    const key = `c5oro-numerosOro-${i}`;
                    return (
                      <div key={i} className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-gray-400 mb-1">#{i + 1}</span>
                        <input
                          ref={(el) => (inputsRef.current[key] = el)}
                          type="tel"
                          pattern="[0-9]*"
                          maxLength={2}
                          value={val}
                          onChange={(e) => handleCincoDeOroNumberChange('numerosOro', i, e.target.value)}
                          placeholder="--"
                          className="w-full h-12 bg-gray-900 text-yellow-300 font-mono font-black text-xl text-center rounded-xl border border-yellow-500/50 focus:border-yellow-400 focus:bg-gray-800 outline-none shadow-md"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Bolilla Extra destacada en su fila */}
                <div className="flex items-center justify-center gap-3 pt-2.5 border-t border-white/10 w-full max-w-[340px]">
                  <span className="text-xs font-black text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                    BOLILLA EXTRA:
                  </span>
                  <input
                    ref={(el) => (inputsRef.current['c5oro-bolillaExtra'] = el)}
                    type="tel"
                    pattern="[0-9]*"
                    maxLength={2}
                    value={data.cincoDeOro?.bolillaExtra || ''}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '').slice(0, 2);
                      setData({
                        ...data,
                        cincoDeOro: {
                          ...data.cincoDeOro,
                          bolillaExtra: clean
                        }
                      });
                    }}
                    placeholder="--"
                    className="w-14 h-12 bg-gray-900 text-orange-400 font-mono font-black text-xl text-center rounded-xl border-2 border-orange-500 focus:border-orange-400 focus:bg-gray-800 outline-none shadow-[0_0_12px_rgba(251,146,60,0.3)]"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: RESULTADOS DEL POZO REVANCHA */}
            <div className="bg-gray-950/70 p-4 rounded-xl border border-blue-800/40 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]" />
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                    POZO REVANCHA (5 Bolillas)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-400">Estado:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setData({
                        ...data,
                        cincoDeOro: {
                          ...data.cincoDeOro,
                          aciertosRevancha: Number(data.cincoDeOro?.aciertosRevancha) === 0 ? 1 : 0
                        }
                      });
                    }}
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase transition border ${
                      Number(data.cincoDeOro?.aciertosRevancha) === 0
                        ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300'
                        : 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    }`}
                  >
                    {Number(data.cincoDeOro?.aciertosRevancha) === 0 ? '¡ VACANTE !' : `${data.cincoDeOro?.aciertosRevancha || 1} ACIERTO/S`}
                  </button>
                </div>
              </div>

              {/* 5 Bolillas Revancha (5 Casillas Proporcionales) */}
              <div className="flex items-center justify-center py-1">
                <div className="grid grid-cols-5 gap-2 w-full max-w-[340px]">
                  {Array.from({ length: 5 }, (_, i) => {
                    const val = data.cincoDeOro?.numerosRevancha?.[i] || '';
                    const key = `c5oro-numerosRevancha-${i}`;
                    return (
                      <div key={i} className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-gray-400 mb-1">#{i + 1}</span>
                        <input
                          ref={(el) => (inputsRef.current[key] = el)}
                          type="tel"
                          pattern="[0-9]*"
                          maxLength={2}
                          value={val}
                          onChange={(e) => handleCincoDeOroNumberChange('numerosRevancha', i, e.target.value)}
                          placeholder="--"
                          className="w-full h-12 bg-gray-900 text-yellow-300 font-mono font-black text-xl text-center rounded-xl border border-yellow-500/50 focus:border-yellow-400 focus:bg-gray-800 outline-none shadow-md"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECCIÓN VISTA PREVIA DE LAS BOLILLAS DORADAS */}
            <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 p-4 rounded-xl border border-blue-400/40 flex flex-col gap-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-yellow-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  Vista Previa TV: Bolillas Doradas
                </span>
                <span className="text-[11px] font-bold text-white/80">
                  {data.cincoDeOro?.fecha || '18/11/26'}
                </span>
              </div>

              {/* Oro */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-gray-300 uppercase">Pozo de Oro:</span>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {(data.cincoDeOro?.numerosOro || ['16', '21', '26', '41', '42']).map((num, idx) => (
                    <div key={idx} className="lottery-ball-gold w-10 h-10 sm:w-11 sm:h-11 text-base sm:text-lg font-mono font-black text-black flex items-center justify-center flex-shrink-0 shadow-md">
                      {num || '--'}
                    </div>
                  ))}
                  <span className="text-yellow-300 font-black text-lg px-0.5">+</span>
                  <div className="lottery-ball-gold-extra w-10 h-10 sm:w-11 sm:h-11 text-base sm:text-lg font-mono font-black text-black flex items-center justify-center flex-shrink-0 shadow-md">
                    {data.cincoDeOro?.bolillaExtra || '--'}
                  </div>
                </div>
              </div>

              {/* Revancha */}
              <div className="flex flex-col gap-1 border-t border-white/10 pt-2">
                <span className="text-[10px] font-bold text-gray-300 uppercase">Pozo Revancha:</span>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {(data.cincoDeOro?.numerosRevancha || ['03', '06', '33', '35', '39']).map((num, idx) => (
                    <div key={idx} className="lottery-ball-gold w-10 h-10 sm:w-11 sm:h-11 text-base sm:text-lg font-mono font-black text-black flex items-center justify-center flex-shrink-0 shadow-md">
                      {num || '--'}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: POZOS ESTIMADOS PRÓXIMO SORTEO */}
            <div className="flex flex-col gap-4 border-t border-gray-800 pt-4">
              <h3 className="text-xs font-black text-gray-300 uppercase tracking-wider">
                Pozos Estimados y Próximo Sorteo
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    className="w-full bg-gray-950 text-white font-mono font-black text-xl py-2.5 px-3 rounded-xl border border-gray-700 focus:border-blue-400 outline-none"
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
                    className="w-full bg-gray-950 text-white font-mono font-black text-xl py-2.5 px-3 rounded-xl border border-gray-700 focus:border-blue-400 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Leyenda Próximo Sorteo (Miércoles / Domingo)
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
                  placeholder="Ej: Domingo 22, Miércoles 25, Lunes 23"
                  className="w-full bg-gray-950 text-white font-bold text-base py-2 px-3 rounded-xl border border-gray-700 focus:border-blue-400 outline-none"
                />
              </div>

              {/* Selector de Color / Fondo del 5 de Oro */}
              <div className="flex flex-col gap-2.5 bg-gray-950/80 p-4 rounded-xl border border-gray-800 mt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-yellow-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    Color de Fondo del 5 de Oro
                  </label>
                  <span className="text-[11px] text-gray-300 font-bold capitalize">
                    {(data.cincoDeOro?.tema || 'blue') === 'blue' ? 'Azul Oficial' :
                     (data.cincoDeOro?.tema || 'blue') === 'gold' ? 'Dorado Millonario' :
                     (data.cincoDeOro?.tema || 'blue') === 'purple' ? 'Púrpura Fortuna' :
                     (data.cincoDeOro?.tema || 'blue') === 'emerald' ? 'Verde Esmeralda' :
                     (data.cincoDeOro?.tema || 'blue') === 'ruby' ? 'Rojo Rubí' : 'Noche Profunda'}
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                  {[
                    { id: 'blue', label: 'Azul Oficial', bg: 'bg-gradient-to-b from-[#001ae6] to-[#00086b]' },
                    { id: 'gold', label: 'Dorado', bg: 'bg-gradient-to-b from-[#d97706] to-[#78350f]' },
                    { id: 'purple', label: 'Púrpura', bg: 'bg-gradient-to-b from-[#6b21a8] to-[#3b0764]' },
                    { id: 'emerald', label: 'Verde', bg: 'bg-gradient-to-b from-[#047857] to-[#064e3b]' },
                    { id: 'ruby', label: 'Rojo Rubí', bg: 'bg-gradient-to-b from-[#b91c1c] to-[#450a0a]' },
                    { id: 'dark', label: 'Noche', bg: 'bg-gradient-to-b from-[#1e293b] to-[#020617]' }
                  ].map((th) => {
                    const isSelected = (data.cincoDeOro?.tema || 'blue') === th.id;
                    return (
                      <button
                        key={th.id}
                        type="button"
                        onClick={async () => {
                          const updated = {
                            ...data,
                            cincoDeOro: {
                              ...data.cincoDeOro,
                              tema: th.id
                            }
                          };
                          setData(updated);
                          await handleSave(updated);
                        }}
                        className={`relative flex flex-col items-center justify-center py-3 px-1 rounded-xl border-2 transition-all shadow-md ${th.bg} ${
                          isSelected
                            ? 'border-yellow-400 ring-2 ring-yellow-400/50 scale-105 shadow-yellow-500/20'
                            : 'border-white/20 hover:border-white/50 opacity-75 hover:opacity-100'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-yellow-400 text-black rounded-full p-0.5 shadow">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                        <span className="text-[11px] font-black text-white drop-shadow tracking-tight">
                          {th.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Mini Vista Previa en Vivo */}
                <div 
                  className="w-full p-3.5 rounded-xl border border-white/20 text-center shadow-lg transition-all duration-300 mt-1"
                  style={{ 
                    background: 
                      (data.cincoDeOro?.tema === 'gold') ? 'linear-gradient(180deg, #d97706, #78350f)' :
                      (data.cincoDeOro?.tema === 'purple') ? 'linear-gradient(180deg, #6b21a8, #3b0764)' :
                      (data.cincoDeOro?.tema === 'emerald') ? 'linear-gradient(180deg, #047857, #064e3b)' :
                      (data.cincoDeOro?.tema === 'ruby') ? 'linear-gradient(180deg, #b91c1c, #450a0a)' :
                      (data.cincoDeOro?.tema === 'dark') ? 'linear-gradient(180deg, #0f172a, #020617)' :
                      'linear-gradient(180deg, #001ae6, #00086b)'
                  }}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-yellow-300 block mb-0.5">
                    VISTA PREVIA DE LOS POZOS EN EL TV
                  </span>
                  <span className="text-base sm:text-lg font-black text-white block drop-shadow">
                    POZO DE ORO: {data.cincoDeOro?.pozoOro || '$ 16.500.000'} | REVANCHA: {data.cincoDeOro?.pozoRevancha || '$ 5.500.000'}
                  </span>
                  <span className="text-xs font-black text-yellow-300 block mt-1.5 bg-blue-950/90 py-1 px-3 rounded-lg border border-yellow-400 shadow">
                    PRÓXIMO: {data.cincoDeOro?.proximoSorteo || 'Próximo Sorteo'}
                  </span>
                </div>
              </div>
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
                type="button"
                onClick={openNewPromoModal}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 active:scale-95 text-black font-black text-xs rounded-xl transition shadow-lg"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Nueva Oferta
              </button>
            </div>

            {(!data.promociones || data.promociones.length === 0) ? (
              <div className="p-8 text-center bg-gray-950/60 rounded-xl border border-dashed border-gray-800 flex flex-col items-center gap-3">
                <Flame className="w-10 h-10 text-amber-500 mx-auto opacity-60" />
                <div>
                  <p className="text-sm font-bold text-gray-300">No hay ofertas de Kiosko creadas</p>
                  <p className="text-xs text-gray-500 mt-1">Presiona el botón para abrir el asistente y crear una oferta.</p>
                </div>
                <button
                  type="button"
                  onClick={openNewPromoModal}
                  className="mt-1 flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black font-black text-xs rounded-xl shadow"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  Crear Primera Oferta
                </button>
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
                        <span className="text-xs font-black uppercase text-gray-200">
                          {promo.titulo || 'Oferta'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Edit in modal button */}
                        <button
                          type="button"
                          onClick={() => openEditPromoModal(idx)}
                          className="px-2.5 py-1 bg-gray-800 hover:bg-gray-750 text-amber-400 border border-amber-500/30 rounded-lg text-[11px] font-bold transition"
                        >
                          ✏️ Editar
                        </button>

                        {/* Active toggle with immediate auto-save */}
                        <button
                          onClick={async () => {
                            const newActive = promo.active === false ? true : false;
                            const list = [...(data.promociones || [])];
                            list[idx] = { ...list[idx], active: newActive };
                            const updated = { ...data, promociones: list };
                            setData(updated);
                            await handleSave(updated);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                            promo.active !== false
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
                          Diseño / Modelo
                        </label>
                        <select
                          value={promo.modelo || 'inclinado'}
                          onChange={(e) => updatePromoSlide(idx, 'modelo', e.target.value)}
                          className="w-full bg-gray-900 text-white text-xs font-bold py-1.5 px-2 rounded-lg border border-gray-700 focus:border-amber-400 outline-none"
                        >
                          <option value="inclinado">⚡ Inclinado / \</option>
                          <option value="clasico">🏷️ Clásico Recto</option>
                          <option value="dividido">📦 2 Columnas</option>
                        </select>
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
            <div className="flex flex-col gap-2.5 bg-gray-950/60 p-3.5 rounded-xl border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-bold text-white block">Tiempo por pantalla</label>
                  <span className="text-xs text-gray-400">Duración de cada sorteo o promo en el TV</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={data.rotationSeconds ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setData({
                        ...data,
                        rotationSeconds: val === '' ? '' : parseInt(val, 10)
                      });
                    }}
                    onBlur={() => {
                      if (!data.rotationSeconds || Number(data.rotationSeconds) < 5) {
                        setData({ ...data, rotationSeconds: 60 });
                      }
                    }}
                    className="w-16 bg-gray-900 text-yellow-400 font-mono font-bold text-center py-1.5 px-2 rounded-lg border border-gray-700 text-base focus:border-yellow-400 outline-none"
                  />
                  <span className="text-xs font-semibold text-gray-400">seg</span>
                </div>
              </div>

              {/* Botones de acceso rápido para segundos */}
              <div className="flex items-center gap-1.5 pt-1.5 border-t border-gray-800/80">
                <span className="text-[11px] font-bold text-gray-400 mr-1">Rápido:</span>
                {[10, 15, 20, 30, 45, 60].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setData({ ...data, rotationSeconds: sec })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      Number(data.rotationSeconds) === sec
                        ? 'bg-yellow-400 text-black shadow font-black'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
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
                { key: 'cincoDeOroSorteo', label: '5 de Oro (Sorteo y Bolillas Doradas)', badge: 'Azul/Oro' },
                { key: 'cincoDeOro', label: '5 de Oro (Pozos Aproximados)', badge: 'Azul' }
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

            {/* SECCIÓN BASE DE DATOS LOCAL Y RESPALDOS */}
            <div className="flex flex-col gap-3 bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950/40 p-4 rounded-xl border border-indigo-500/30 mt-2 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    Base de Datos Local (Este Dispositivo)
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Persistente
                </span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                Toda tu configuración (ofertas, precios, tiempos de rotación y temas) se guarda en la memoria de este dispositivo.
                Aunque el servidor de Render se apague o reinicie, tus datos se restauran solos automáticamente.
              </p>

              {localSavedDate && (
                <div className="text-[11px] text-gray-400 bg-black/40 px-3 py-1.5 rounded-lg flex items-center justify-between">
                  <span>Último guardado local:</span>
                  <strong className="text-yellow-300 font-mono">{localSavedDate}</strong>
                </div>
              )}

              {/* Botones de Respaldo y Restauración */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => exportBackupJson(data)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gray-800 hover:bg-gray-700 active:bg-indigo-600 text-xs font-bold text-gray-200 rounded-xl border border-gray-700 shadow-sm transition"
                  title="Descargar archivo JSON con toda tu configuración"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Descargar Copia</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gray-800 hover:bg-gray-700 active:bg-indigo-600 text-xs font-bold text-gray-200 rounded-xl border border-gray-700 shadow-sm transition"
                  title="Restaurar configuración desde un archivo JSON"
                >
                  <Upload className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Restaurar Copia</span>
                </button>
              </div>

              {/* Input oculto para subir archivo JSON */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const imported = await importBackupJson(file);
                    if (imported && confirm('¿Deseas restaurar esta copia de seguridad? Se reemplazarán los datos actuales en este dispositivo y se emitirán al TV.')) {
                      setData(imported);
                      await handleSave(imported);
                      alert('¡Copia de seguridad restaurada y enviada al TV con éxito!');
                    }
                  } catch (err) {
                    alert(err.message);
                  } finally {
                    e.target.value = '';
                  }
                }}
              />
            </div>

            {/* SECCIÓN ANDROID TV BOX / FULLY KIOSK REMOTE ADMIN */}
            <div className="flex flex-col gap-3 bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950/40 p-4 rounded-xl border border-blue-500/30 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    Lanzador Remoto Android TV Box (Fully Kiosk)
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  Puerto 2323
                </span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                Permite que este celular despierte o abra la cartelería directamente en la Android TV Box a través de tu Wi-Fi local sin tocar el control remoto.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <div className="flex-1 flex items-center bg-gray-900 border border-gray-700 rounded-xl px-3 py-2">
                  <span className="text-xs text-gray-400 mr-2 font-mono whitespace-nowrap">IP TV Box:</span>
                  <input
                    type="text"
                    value={tvBoxIp}
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      setTvBoxIp(val);
                      localStorage.setItem('kb_tvbox_ip', val);
                    }}
                    placeholder="Ej: 192.168.1.50"
                    className="w-full bg-transparent text-white font-mono text-xs focus:outline-none placeholder-gray-600"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => launchFullyKioskOnTv()}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Smartphone className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Probar Lanzar</span>
                </button>
              </div>

              <span className="text-[10px] text-gray-400">
                💡 Recordá en Fully Kiosk en la TV Box: <em>Settings ➡️ Remote Administration ➡️ Enable Remote Admin (Password: 4355)</em>.
              </span>
            </div>
          </div>
        )}

      </main>

      {/* Floating Save Button Bar at Bottom */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-gray-950/90 backdrop-blur-lg border-t border-gray-800 p-3 sm:p-4">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSave()}
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
      {/* Modal to Change Security PIN */}
      {changePinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border-2 border-yellow-400 rounded-3xl w-full max-w-sm p-6 flex flex-col gap-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-xl bg-yellow-400 text-black flex items-center justify-center mx-auto shadow">
              <Key className="w-6 h-6" />
            </div>

            <h3 className="text-base font-black text-white uppercase tracking-wider">
              Cambiar PIN de Acceso
            </h3>
            <p className="text-xs text-gray-400">
              Ingresá el nuevo PIN de 4 dígitos numéricos para proteger el panel de Kiosko Belvedere.
            </p>

            <form onSubmit={handleChangePin} className="flex flex-col gap-4">
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                autoFocus
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                className="w-40 text-center text-3xl font-mono tracking-[0.4em] py-2.5 bg-gray-950 border-2 border-yellow-400 rounded-2xl text-white outline-none focus:ring-4 focus:ring-yellow-400/50 shadow-inner mx-auto block"
              />

              {changePinSuccess && (
                <p className="text-xs font-bold text-emerald-400 animate-bounce">
                  ✓ ¡PIN cambiado con éxito!
                </p>
              )}

              <div className="flex gap-2 justify-center mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setChangePinModalOpen(false);
                    setNewPinInput('');
                  }}
                  className="px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-yellow-400 text-black font-black rounded-xl text-xs hover:bg-yellow-300 shadow active:scale-95 transition"
                >
                  Guardar Nuevo PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Creating / Editing Kiosko Belvedere Promotions */}
      {promoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-gray-900 border-2 border-amber-500/70 rounded-3xl w-full max-w-lg p-5 sm:p-6 flex flex-col gap-4 shadow-2xl my-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 text-black flex items-center justify-center shadow">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wider">
                    {editingPromoIndex !== null ? 'Editar Oferta' : 'Nueva Oferta para el TV'}
                  </h3>
                  <p className="text-xs text-amber-400 font-medium">Kiosko Belvedere • Pantalla Gigante</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPromoModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePromoDraft} className="flex flex-col gap-3.5">
              
              {/* Etiqueta / Badge */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  Etiqueta Destacada
                </label>
                <input
                  type="text"
                  value={promoDraft.tag}
                  onChange={(e) => setPromoDraft({ ...promoDraft, tag: e.target.value })}
                  placeholder="SUPER PROMO, OFERTA, COMBO..."
                  className="w-full bg-gray-950 text-white text-xs font-bold py-2.5 px-3 rounded-xl border border-gray-700 focus:border-amber-400 outline-none"
                />
                {/* Sugerencias rápidas de tags */}
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {['SUPER PROMO', 'OFERTA DE HOY', 'COMBO', 'CIGARRILLOS', 'BEBIDAS', 'GOLOSINAS'].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setPromoDraft({ ...promoDraft, tag: sug })}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition"
                    >
                      +{sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Título del Producto */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                  Título del Producto o Combo (Texto Grande) *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={promoDraft.titulo}
                  onChange={(e) => setPromoDraft({ ...promoDraft, titulo: e.target.value })}
                  placeholder="Ej: Coronado 10 $120 !! o Coca 600ml + Alfajor"
                  className="w-full bg-gray-950 text-white font-extrabold text-sm sm:text-base py-2.5 px-3 rounded-xl border border-gray-700 focus:border-amber-400 outline-none"
                />
              </div>

              {/* Precio y Subtítulo en 2 columnas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Precio o Combo ($)
                  </label>
                  <input
                    type="text"
                    value={promoDraft.precio}
                    onChange={(e) => setPromoDraft({ ...promoDraft, precio: e.target.value })}
                    placeholder="Ej: $ 120 o 2 x $ 200"
                    className="w-full bg-gray-950 text-yellow-300 font-mono font-black text-lg py-2 px-3 rounded-xl border border-gray-700 focus:border-emerald-400 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Frase de Bajada
                  </label>
                  <input
                    type="text"
                    value={promoDraft.subtitulo}
                    onChange={(e) => setPromoDraft({ ...promoDraft, subtitulo: e.target.value })}
                    placeholder="Aprovechá hoy en Kiosko Belvedere"
                    className="w-full bg-gray-950 text-white text-xs font-medium py-2.5 px-3 rounded-xl border border-gray-700 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Pie de Pantalla */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Cinta Inferior (Nota)
                </label>
                <input
                  type="text"
                  value={promoDraft.nota}
                  onChange={(e) => setPromoDraft({ ...promoDraft, nota: e.target.value })}
                  placeholder="Hasta agotar stock | Kiosko Belvedere"
                  className="w-full bg-gray-950 text-gray-300 text-xs py-2 px-3 rounded-xl border border-gray-700 focus:border-amber-400 outline-none"
                />
              </div>

              {/* Selector de Modelo / Estilo de Diseño del Anuncio */}
              <div className="flex flex-col gap-2 pt-1">
                <label className="text-xs font-bold text-yellow-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Modelo / Estilo de Diseño</span>
                  <span className="text-[11px] text-gray-300 font-bold">
                    {promoDraft.modelo === 'inclinado' ? '⚡ Inclinado / \\' :
                     promoDraft.modelo === 'dividido' ? '📦 2 Columnas' : '🏷️ Clásico Recto'}
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { 
                      id: 'inclinado', 
                      title: '⚡ Inclinado / \\', 
                      desc: 'Título inclinado / y precio \\' 
                    },
                    { 
                      id: 'clasico', 
                      title: '🏷️ Clásico', 
                      desc: 'Cartel recto y centrado' 
                    },
                    { 
                      id: 'dividido', 
                      title: '📦 2 Columnas', 
                      desc: 'Texto izq, precio der' 
                    }
                  ].map((m) => {
                    const isSel = (promoDraft.modelo || 'inclinado') === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPromoDraft({ ...promoDraft, modelo: m.id })}
                        className={`p-2.5 rounded-xl border-2 transition text-left flex flex-col justify-between ${
                          isSel 
                            ? 'bg-amber-500/20 border-yellow-400 text-white ring-2 ring-yellow-400/40 shadow' 
                            : 'bg-gray-950/70 border-gray-800 text-gray-400 hover:border-gray-700'
                        }`}
                      >
                        <span className="text-xs font-black block text-white">{m.title}</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5 leading-tight">{m.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selector de Color de Fondo */}
              <div className="flex flex-col gap-2 pt-1">
                <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Color / Tema de Fondo</span>
                  <span className="text-[11px] text-gray-400 capitalize">
                    {promoDraft.tema === 'orange' ? 'Naranja Fuego' :
                     promoDraft.tema === 'yellow' ? 'Amarillo Impacto' :
                     promoDraft.tema === 'purple' ? 'Violeta Neón' :
                     promoDraft.tema === 'red' ? 'Rojo Explosivo' :
                     promoDraft.tema === 'blue' ? 'Azul Real' : 'Verde Fresco'}
                  </span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { id: 'orange', label: 'Naranja', bg: 'bg-gradient-to-b from-[#ea580c] to-[#9a3412]' },
                    { id: 'yellow', label: 'Amarillo', bg: 'bg-gradient-to-b from-[#ca8a04] to-[#713f12]' },
                    { id: 'purple', label: 'Violeta', bg: 'bg-gradient-to-b from-[#7e22ce] to-[#3b0764]' },
                    { id: 'red', label: 'Rojo', bg: 'bg-gradient-to-b from-[#dc2626] to-[#7f1d1d]' },
                    { id: 'blue', label: 'Azul', bg: 'bg-gradient-to-b from-[#2563eb] to-[#1e3a8a]' },
                    { id: 'emerald', label: 'Verde', bg: 'bg-gradient-to-b from-[#059669] to-[#064e3b]' }
                  ].map((item) => {
                    const isSel = promoDraft.tema === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPromoDraft({ ...promoDraft, tema: item.id })}
                        className={`relative py-2.5 px-1 rounded-xl border-2 transition text-center shadow ${item.bg} ${
                          isSel ? 'border-yellow-400 ring-2 ring-yellow-400/50 scale-105' : 'border-white/20 opacity-70 hover:opacity-100'
                        }`}
                      >
                        {isSel && (
                          <div className="absolute top-1 right-1 bg-yellow-400 text-black rounded-full p-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                        <span className="text-[11px] font-black text-white drop-shadow">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-2.5 justify-end pt-3 border-t border-gray-800 mt-1">
                <button
                  type="button"
                  onClick={() => setPromoModalOpen(false)}
                  className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  {editingPromoIndex !== null ? 'Guardar Cambios' : 'Agregar Oferta a la Tele'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
