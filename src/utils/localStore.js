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
 * Compara y sincroniza inteligentemente los datos del servidor (Render) con la base local (iPhone).
 * Si el servidor reinició (sus datos son más viejos o por defecto), devuelve que el servidor necesita repoblarse.
 * Si el servidor tiene sorteos más nuevos de La Banca, los incorpora a la base local.
 */
export function reconcileData(serverData, localData) {
  if (!serverData && !localData) return { dataToUse: null, shouldRepopulateServer: false };
  if (!localData) return { dataToUse: serverData, shouldRepopulateServer: false };
  if (!serverData) return { dataToUse: localData, shouldRepopulateServer: true };

  const serverTime = serverData.updatedAt ? new Date(serverData.updatedAt).getTime() : 0;
  const localTime = localData.updatedAt ? new Date(localData.updatedAt).getTime() : 0;
  const localSavedTime = localData._localSavedAt ? new Date(localData._localSavedAt).getTime() : localTime;

  // Si la base local en este dispositivo fue modificada o guardada posteriormente a la del servidor,
  // significa que el servidor de Render se reinició con el archivo por defecto de la imagen Docker.
  const isServerStale = localSavedTime > serverTime || localTime > serverTime;

  // Verificamos si localData tiene promociones o ajustes personalizados que faltan en el servidor
  const hasLocalPromos = Array.isArray(localData.promociones) && localData.promociones.length > 0;
  const serverHasNoPromos = !Array.isArray(serverData.promociones) || serverData.promociones.length === 0;

  if (isServerStale || (hasLocalPromos && serverHasNoPromos)) {
    // La base local es la fuente de la verdad más reciente
    const merged = {
      ...serverData,
      ...localData,
      // Mantenemos sorteos nuevos del servidor si tuvieran fecha más nueva
      quinielaVespertina: serverData.quinielaVespertina?.fecha >= (localData.quinielaVespertina?.fecha || '')
        ? serverData.quinielaVespertina
        : localData.quinielaVespertina,
      tombolaVespertina: serverData.tombolaVespertina?.fecha >= (localData.tombolaVespertina?.fecha || '')
        ? serverData.tombolaVespertina
        : localData.tombolaVespertina,
      quinielaNocturna: serverData.quinielaNocturna?.fecha >= (localData.quinielaNocturna?.fecha || '')
        ? serverData.quinielaNocturna
        : localData.quinielaNocturna,
      tombolaNocturna: serverData.tombolaNocturna?.fecha >= (localData.tombolaNocturna?.fecha || '')
        ? serverData.tombolaNocturna
        : localData.tombolaNocturna,
      // Pero siempre preservamos promociones y ajustes del admin
      promociones: localData.promociones || serverData.promociones || [],
      rotationSeconds: localData.rotationSeconds || serverData.rotationSeconds || 60,
      activeScreens: localData.activeScreens || serverData.activeScreens,
      cincoDeOro: {
        ...serverData.cincoDeOro,
        ...localData.cincoDeOro
      },
      updatedAt: new Date().toISOString()
    };
    return { dataToUse: merged, shouldRepopulateServer: true };
  }

  // Si el servidor es más nuevo (por ejemplo, sync de La Banca durante el día),
  // adoptamos los datos del servidor pero preservando promociones locales si existieran
  const merged = {
    ...serverData,
    promociones: (Array.isArray(serverData.promociones) && serverData.promociones.length > 0)
      ? serverData.promociones
      : (localData.promociones || []),
    rotationSeconds: localData.rotationSeconds || serverData.rotationSeconds || 60,
    activeScreens: {
      ...serverData.activeScreens,
      ...localData.activeScreens
    }
  };

  return { dataToUse: merged, shouldRepopulateServer: false };
}
