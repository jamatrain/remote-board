import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { syncWithLaBanca } from './src/services/labanca.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'board-data.json');

app.use(cors());
app.use(express.json());

// Prevent TV browser from caching outdated HTML/JS bundles
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Load initial data
function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const defaultData = {
        updatedAt: new Date().toISOString(),
        rotationSeconds: 60,
        activeScreens: {
          quinielaVespertina: true,
          tombolaVespertina: true,
          quinielaNocturna: true,
          tombolaNocturna: true,
          cincoDeOro: true
        },
        fechaGeneral: '',
        quinielaVespertina: { fecha: '', numeros: Array(20).fill('') },
        tombolaVespertina: { fecha: '', numeros: Array(20).fill('') },
        quinielaNocturna: { fecha: '', numeros: Array(20).fill('') },
        tombolaNocturna: { fecha: '', numeros: Array(20).fill('') },
        cincoDeOro: { pozoOro: '$ 0', pozoRevancha: '$ 0', proximoSorteo: '' },
        promociones: []
      };
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error leyendo data:', err);
    return {};
  }
}

function saveData(data) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Clients connected via Server-Sent Events (SSE)
let sseClients = [];

function broadcastUpdate(data) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(client => {
    try {
      client.res.write(payload);
    } catch (e) {
      console.error('Error enviando SSE al cliente:', e);
    }
  });
}

function broadcastControl(command) {
  const payload = `data: ${JSON.stringify({ _type: 'control', ...command })}\n\n`;
  sseClients.forEach(client => {
    try {
      client.res.write(payload);
    } catch (e) {
      console.error('Error enviando comando SSE:', e);
    }
  });
}

// Security: SHA-256 Hashing for 4-digit Admin PIN
function hashPin(pin) {
  return crypto.createHash('sha256').update(String(pin || '').trim()).digest('hex');
}
const DEFAULT_PIN_HASH = hashPin('1234');

function verifyPinMiddleware(req, res, next) {
  const current = readData();
  const validHash = current.pinHash || DEFAULT_PIN_HASH;
  const providedPin = req.headers['x-admin-pin'] || req.body?.adminPin || req.query?.pin;

  if (!providedPin || hashPin(providedPin) !== validHash) {
    return res.status(401).json({ success: false, error: 'PIN de seguridad incorrecto' });
  }
  next();
}

// Cooldown to protect La Banca API against abuse / DoS
let lastSyncTimestamp = 0;
const SYNC_COOLDOWN_MS = 60 * 1000; // 60s minimum interval

// REST Endpoints
app.get('/api/data', (req, res) => {
  res.json(readData());
});

// Check if a PIN is valid
app.post('/api/verify-pin', (req, res) => {
  const { pin } = req.body;
  const current = readData();
  const validHash = current.pinHash || DEFAULT_PIN_HASH;
  const ok = (hashPin(pin) === validHash);
  res.json({ success: ok, valid: ok });
});

// Change PIN (Requires current valid PIN)
app.post('/api/change-pin', verifyPinMiddleware, (req, res) => {
  const { newPin } = req.body;
  if (!newPin || String(newPin).trim().length !== 4 || isNaN(Number(newPin))) {
    return res.status(400).json({ success: false, error: 'El nuevo PIN debe ser exactamente de 4 dígitos numéricos' });
  }
  const current = readData();
  const updated = {
    ...current,
    pinHash: hashPin(newPin)
  };
  saveData(updated);
  res.json({ success: true, message: 'PIN actualizado exitosamente' });
});

app.post('/api/data', verifyPinMiddleware, (req, res) => {
  try {
    const current = readData();
    const updated = {
      ...current,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    saveData(updated);
    broadcastUpdate(updated);
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Error guardando datos:', err);
    res.status(500).json({ success: false, error: 'Error al guardar los datos' });
  }
});

// TV Remote Control Command (from iPhone to TV)
app.post('/api/control', verifyPinMiddleware, (req, res) => {
  const { action, slideIndex } = req.body;
  broadcastControl({ action, slideIndex, timestamp: Date.now() });
  res.json({ success: true, command: { action, slideIndex } });
});

// Sync directly from official La Banca API (Protected by PIN & 60s Anti-DoS Cooldown)
app.post('/api/sync', verifyPinMiddleware, async (req, res) => {
  try {
    const now = Date.now();
    if (now - lastSyncTimestamp < SYNC_COOLDOWN_MS) {
      const waitSec = Math.ceil((SYNC_COOLDOWN_MS - (now - lastSyncTimestamp)) / 1000);
      return res.json({
        success: true,
        updated: false,
        cooldown: true,
        message: `Cooldown activo: esperá ${waitSec} segundos antes de volver a consultar los sorteos.`,
        data: readData()
      });
    }

    lastSyncTimestamp = now;
    const current = readData();
    const { result, updatedData } = await syncWithLaBanca(current);

    if (result.updated) {
      saveData(updatedData);
      broadcastUpdate(updatedData);
      console.log('⚡ [La Banca] Nuevos resultados guardados y emitidos al TV');
    } else {
      console.log('ℹ️ [La Banca] Resultados idénticos a los vigentes (primeros 10 coinciden). No se reenvía.');
    }

    res.json({
      success: true,
      updated: result.updated,
      details: result.details,
      data: updatedData
    });
  } catch (err) {
    console.error('Error en sync con La Banca:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// SSE endpoint for live updates to the TV screen
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  sseClients.push(newClient);

  // Send initial data immediately
  res.write(`data: ${JSON.stringify(readData())}\n\n`);

  // Keep-alive ping every 25 seconds
  const pingInterval = setInterval(() => {
    res.write(': ping\n\n');
  }, 25000);

  req.on('close', () => {
    clearInterval(pingInterval);
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

// Automatic periodic sync with La Banca (every 3 minutes)
setInterval(async () => {
  try {
    const current = readData();
    const { result, updatedData } = await syncWithLaBanca(current);
    if (result.updated) {
      saveData(updatedData);
      broadcastUpdate(updatedData);
      console.log('⚡ [Auto-Sync] Resultados actualizados automáticamente desde La Banca');
    }
  } catch (e) {
    console.error('Error en auto-sync periódico:', e);
  }
}, 3 * 60 * 1000);

// Initial sync on boot
setTimeout(async () => {
  try {
    const current = readData();
    const { result, updatedData } = await syncWithLaBanca(current);
    if (result.updated) {
      saveData(updatedData);
      broadcastUpdate(updatedData);
      console.log('⚡ [Boot-Sync] Datos iniciales sincronizados con La Banca');
    }
  } catch (e) {
    console.error('Error en boot sync:', e);
  }
}, 2000);

// Serve frontend in production or if dist exists
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Remote-Board corriendo en http://0.0.0.0:${PORT}`);
});
