/**
 * Utilidades para la base de datos local y persistencia en el dispositivo del administrador.
 * Garantiza que la configuración (promociones, ajustes del TV, temas, números)
 * nunca se pierda aunque el contenedor de Render se reinicie o se apague.
 */

const STORAGE_KEY = 'kb_admin_board_data';
const BACKUP_KEY = 'kb_admin_board_backup';

/**
 * Obtiene los datos guardados en el almacenamiento local del dispositivo.
 */
export function getLocalData() {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Error leyendo base de datos local:', err);
    return null;
  }
}

/**
 * Guarda los datos en el almacenamiento local del dispositivo con timestamp.
 */
export function saveLocalData(data) {
  if (typeof window === 'undefined' || !window.localStorage || !data) return false;
  try {
    const toStore = {
      ...data,
      _localSavedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    return true;
  } catch (err) {
    console.warn('Error guardando en base de datos local:', err);
    return false;
  }
}

/**
 * Verifica si existen datos previos guardados en este dispositivo.
 */
export function hasLocalData() {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
}

/**
 * Crea un respaldo de seguridad previo a sobrescrituras.
 */
export function createSafetyBackup(data) {
  if (typeof window === 'undefined' || !window.localStorage || !data) return;
  try {
    localStorage.setItem(BACKUP_KEY, JSON.stringify({
      ...data,
      _backupDate: new Date().toISOString()
    }));
  } catch (e) {
    // Ignore backup failure
  }
}

/**
 * Descarga una copia de seguridad física en formato JSON.
 */
export function exportBackupJson(data) {
  try {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    link.href = url;
    link.download = `kiosko-belvedere-backup-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    alert('Error al exportar copia de seguridad: ' + err.message);
    return false;
  }
}

/**
 * Lee y valida un archivo JSON de respaldo seleccionado por el usuario.
 */
export function importBackupJson(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No se seleccionó ningún archivo'));
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (!json || typeof json !== 'object') {
          throw new Error('El archivo no contiene un formato de configuración válido.');
        }
        resolve(json);
      } catch (err) {
        reject(new Error('Error al leer el archivo JSON: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo desde el dispositivo'));
    reader.readAsText(file);
  });
}

/**
 * Restablece la base de datos local a valores vacíos.
 */
export function clearLocalData() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Error limpiando base local:', e);
  }
}

/**
 * Convierte fechas 'DD/MM/AA' o 'AAAA-MM-DD' a timestamp numérico para compararlas sin errores de cambio de mes.
 */
function parseFechaToTimestamp(fechaStr) {
  if (!fechaStr || typeof fechaStr !== 'string') return 0;
  const trimmed = fechaStr.trim();
  const ddmmyy = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{2,4})$/);
  if (ddmmyy) {
    const day = Number(ddmmyy[1]);
    const month = Number(ddmmyy[2]) - 1;
    const year = ddmmyy[3].length === 2 ? 2000 + Number(ddmmyy[3]) : Number(ddmmyy[3]);
    return new Date(year, month, day).getTime() || 0;
  }
  const parsed = Date.parse(trimmed);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Elige el resultado de sorteo más reciente entre servidor y local.
 */
function pickNewerLotteryGame(serverGame, localGame) {
  const serverTs = parseFechaToTimestamp(serverGame?.fecha);
  const localTs = parseFechaToTimestamp(localGame?.fecha);
  return serverTs >= localTs && serverTs > 0 ? serverGame : (localGame || serverGame);
}

/**
 * Compara y sincroniza inteligentemente los datos del servidor (Render) con la base local (iPhone).
 * Separa el timestamp de configuración/anuncios (`configUpdatedAt`) del de sorteos (`updatedAt`)
 * para que un Boot-Sync o Auto-Sync de La Banca nunca pise las promociones locales.
 */
export function reconcileData(serverData, localData) {
  if (!serverData && !localData) return { dataToUse: null, shouldRepopulateServer: false };
  if (!localData) return { dataToUse: serverData, shouldRepopulateServer: false };
  if (!serverData) return { dataToUse: localData, shouldRepopulateServer: true };

  const serverConfigTime = serverData.configUpdatedAt ? new Date(serverData.configUpdatedAt).getTime() : 0;
  const localTime = localData.updatedAt ? new Date(localData.updatedAt).getTime() : 0;
  const localSavedTime = localData._localSavedAt ? new Date(localData._localSavedAt).getTime() : localTime;
  const localConfigTime = localData.configUpdatedAt
    ? new Date(localData.configUpdatedAt).getTime()
    : localSavedTime;

  // Si la configuración local es más reciente que la del servidor (o el servidor arrancó con el JSON semilla sin configUpdatedAt),
  // la base local del administrador prevalece para promociones, pantallas activas y rotación.
  const isLocalConfigNewer = localConfigTime > serverConfigTime;
  const hasLocalPromos = Array.isArray(localData.promociones) && localData.promociones.length > 0;
  const serverHasNoPromos = !Array.isArray(serverData.promociones) || serverData.promociones.length === 0;

  if (isLocalConfigNewer || (hasLocalPromos && serverHasNoPromos)) {
    const resolvedConfigTimestamp = localData.configUpdatedAt
      || (localConfigTime > 0 ? new Date(localConfigTime).toISOString() : new Date().toISOString());

    const merged = {
      ...serverData,
      ...localData,
      quinielaVespertina: pickNewerLotteryGame(serverData.quinielaVespertina, localData.quinielaVespertina),
      tombolaVespertina: pickNewerLotteryGame(serverData.tombolaVespertina, localData.tombolaVespertina),
      quinielaNocturna: pickNewerLotteryGame(serverData.quinielaNocturna, localData.quinielaNocturna),
      tombolaNocturna: pickNewerLotteryGame(serverData.tombolaNocturna, localData.tombolaNocturna),
      promociones: localData.promociones || serverData.promociones || [],
      rotationSeconds: localData.rotationSeconds || serverData.rotationSeconds || 60,
      activeScreens: localData.activeScreens || serverData.activeScreens,
      cincoDeOro: {
        ...serverData.cincoDeOro,
        ...localData.cincoDeOro
      },
      configUpdatedAt: resolvedConfigTimestamp,
      updatedAt: new Date().toISOString()
    };
    return { dataToUse: merged, shouldRepopulateServer: true };
  }

  // El servidor tiene una configuración explícita igual o más reciente (guardada vía POST /api/data)
  const merged = {
    ...serverData,
    promociones: (Array.isArray(serverData.promociones) && serverData.promociones.length > 0)
      ? serverData.promociones
      : (localData.promociones || []),
    rotationSeconds: serverData.rotationSeconds || localData.rotationSeconds || 60,
    activeScreens: {
      ...localData.activeScreens,
      ...serverData.activeScreens
    }
  };

  return { dataToUse: merged, shouldRepopulateServer: false };
}
