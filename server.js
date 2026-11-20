import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'board-data.json');

app.use(cors());
app.use(express.json());

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
        fechaGeneral: new Date().toLocaleDateString('es-UY', { day: '2-digit', month: '2-digit', year: '2-digit' }),
        quinielaVespertina: { fecha: '', numeros: Array(20).fill('') },
        tombolaVespertina: { fecha: '', numeros: Array(20).fill('') },
        quinielaNocturna: { fecha: '', numeros: Array(20).fill('') },
        tombolaNocturna: { fecha: '', numeros: Array(20).fill('') },
        cincoDeOro: { pozoOro: '$ 0', pozoRevancha: '$ 0', proximoSorteo: '' }
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
      console.error('Error sending SSE:', e);
    }
  });
}

// REST Endpoints
app.get('/api/data', (req, res) => {
  res.json(readData());
});

app.post('/api/data', (req, res) => {
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
