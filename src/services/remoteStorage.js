/**
 * Persistencia remota opcional sobre Upstash Redis REST API (sin dependencias externas).
 * Requiere UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN en variables de entorno.
 */

const DEFAULT_REDIS_KEY = 'kb:board_data';
const REQUEST_TIMEOUT_MS = 5000;

let pendingWrite = Promise.resolve();

function getConfig() {
  const url = (process.env.UPSTASH_REDIS_REST_URL || '').trim().replace(/\/+$/, '');
  const token = (process.env.UPSTASH_REDIS_REST_TOKEN || '').trim();
  const key = (process.env.UPSTASH_REDIS_REST_KEY || DEFAULT_REDIS_KEY).trim() || DEFAULT_REDIS_KEY;
  return { url, token, key };
}

export function isRemoteStorageEnabled() {
  const { url, token } = getConfig();
  return Boolean(url && token);
}

/**
 * Lee el estado completo del tablero desde Upstash Redis.
 * Retorna null si no hay clave guardada o si ocurre un error de red.
 */
export async function loadFromRemoteStorage() {
  if (!isRemoteStorageEnabled()) return null;

  const { url, token, key } = getConfig();
  try {
    const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
    });

    if (!res.ok) {
      console.warn(`⚠️ [Upstash] Error HTTP ${res.status} al leer ${key}`);
      return null;
    }

    const payload = await res.json();
    if (!payload || payload.result == null) {
      return null;
    }

    const parsed = typeof payload.result === 'string'
      ? JSON.parse(payload.result)
      : payload.result;

    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    return parsed;
  } catch (err) {
    console.warn('⚠️ [Upstash] No se pudo leer el estado remoto:', err.message);
    return null;
  }
}

/**
 * Persiste el estado en Upstash Redis serializando escrituras en orden
 * para evitar que un guardado anterior pise a uno más reciente.
 */
export function saveToRemoteStorage(data) {
  if (!isRemoteStorageEnabled() || !data) return Promise.resolve(false);

  const { url, token, key } = getConfig();
  const serialized = JSON.stringify(data);

  pendingWrite = pendingWrite.then(async () => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(['SET', key, serialized]),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      });

      if (!res.ok) {
        console.warn(`⚠️ [Upstash] Error HTTP ${res.status} al guardar ${key}`);
        return false;
      }

      return true;
    } catch (err) {
      console.warn('⚠️ [Upstash] Error guardando estado remoto:', err.message);
      return false;
    }
  });

  return pendingWrite;
}
