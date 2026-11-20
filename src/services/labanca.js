import fs from 'fs';

const NUMBER_KEYS = [
  'firstNumber', 'secondNumber', 'thirdNumber', 'fourthNumber', 'fifthNumber',
  'sixthNumber', 'seventhNumber', 'eighthNumber', 'ninthNumber', 'tenthNumber',
  'eleventhNumber', 'twelfthNumber', 'thirteenthNumber', 'fourteenthNumber', 'fifteenthNumber',
  'sixteenthNumber', 'seventeenthNumber', 'eighteenthNumber', 'nineteenthNumber', 'twentiethNumber'
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  // e.g. "2026-11-19-15:00" or "2026-11-18-22:00"
  const parts = dateStr.split('-');
  if (parts.length >= 3) {
    const y = parts[0].slice(-2);
    const m = parts[1];
    const d = parts[2].slice(0, 2);
    return `${d}/${m}/${y}`;
  }
  return dateStr;
}

function formatProximoSorteo(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length >= 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2].slice(0, 2), 10);
    const dt = new Date(y, m, d);
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return `${days[dt.getDay()]} ${d}`;
  }
  return dateStr;
}

function formatCurrency(val) {
  if (!val && val !== 0) return '$ 0';
  return '$ ' + Number(val).toLocaleString('es-UY');
}

export async function syncWithLaBanca(currentData) {
  const result = {
    updated: false,
    details: {}
  };

  const updatedData = { ...currentData };

  // Fetch all 5 games with realistic browser headers
  const fetchGame = async (id) => {
    const res = await fetch(`https://info-api.labanca.com.uy/info-api/v1/game/result/${id}/last/1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'es-UY,es;q=0.9,es-419;q=0.8,en;q=0.7',
        'Referer': 'https://www.labanca.com.uy/',
        'Origin': 'https://www.labanca.com.uy',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json?.data?.[0];
  };

  try {
    const [qVesp, qNoct, tVesp, tNoct, cOro] = await Promise.all([
      fetchGame(1),
      fetchGame(2),
      fetchGame(3),
      fetchGame(4),
      fetchGame(5)
    ]);

    // 1. Quiniela Vespertina
    if (qVesp) {
      const nums = NUMBER_KEYS.map(k => String(qVesp[k] || '').padStart(3, '0'));
      const oldNums = currentData.quinielaVespertina?.numeros || [];
      const first10Same = nums.slice(0, 10).every((n, i) => n === oldNums[i]);

      if (!first10Same) {
        updatedData.quinielaVespertina = {
          fecha: formatDate(qVesp.drawDate),
          numeros: nums
        };
        result.updated = true;
        result.details.quinielaVespertina = 'Actualizada con nuevo sorteo';
      } else {
        result.details.quinielaVespertina = 'Primeros 10 coinciden con lo anterior. No se reenvía.';
      }
    }

    // 2. Quiniela Nocturna
    if (qNoct) {
      const nums = NUMBER_KEYS.map(k => String(qNoct[k] || '').padStart(3, '0'));
      const oldNums = currentData.quinielaNocturna?.numeros || [];
      const first10Same = nums.slice(0, 10).every((n, i) => n === oldNums[i]);

      if (!first10Same) {
        updatedData.quinielaNocturna = {
          fecha: formatDate(qNoct.drawDate),
          numeros: nums
        };
        result.updated = true;
        result.details.quinielaNocturna = 'Actualizada con nuevo sorteo';
      } else {
        result.details.quinielaNocturna = 'Primeros 10 coinciden con lo anterior. No se reenvía.';
      }
    }

    // 3. Tómbola Vespertina
    if (tVesp) {
      const nums = NUMBER_KEYS.map(k => String(tVesp[k] || '').padStart(2, '0'));
      const oldNums = currentData.tombolaVespertina?.numeros || [];
      const first10Same = nums.slice(0, 10).every((n, i) => n === oldNums[i]);

      if (!first10Same) {
        updatedData.tombolaVespertina = {
          fecha: formatDate(tVesp.drawDate || qVesp?.drawDate),
          numeros: nums
        };
        result.updated = true;
        result.details.tombolaVespertina = 'Actualizada con nuevo sorteo';
      } else {
        result.details.tombolaVespertina = 'Primeros 10 coinciden con lo anterior. No se reenvía.';
      }
    }

    // 4. Tómbola Nocturna
    if (tNoct) {
      const nums = NUMBER_KEYS.map(k => String(tNoct[k] || '').padStart(2, '0'));
      const oldNums = currentData.tombolaNocturna?.numeros || [];
      const first10Same = nums.slice(0, 10).every((n, i) => n === oldNums[i]);

      if (!first10Same) {
        updatedData.tombolaNocturna = {
          fecha: formatDate(tNoct.drawDate || qNoct?.drawDate),
          numeros: nums
        };
        result.updated = true;
        result.details.tombolaNocturna = 'Actualizada con nuevo sorteo';
      } else {
        result.details.tombolaNocturna = 'Primeros 10 coinciden con lo anterior. No se reenvía.';
      }
    }

    // 5. 5 de Oro
    if (cOro) {
      const pozoOro = formatCurrency(cOro.estimadoOro || cOro.pozoOro);
      const pozoRevancha = formatCurrency(cOro.estimadoRevancha || cOro.pozoRevancha);
      const proximoSorteo = formatProximoSorteo(cOro.fechaProxima);

      const oldOro = currentData.cincoDeOro?.pozoOro;
      const oldRev = currentData.cincoDeOro?.pozoRevancha;
      const oldSorteo = currentData.cincoDeOro?.proximoSorteo;

      if (pozoOro !== oldOro || pozoRevancha !== oldRev || proximoSorteo !== oldSorteo) {
        updatedData.cincoDeOro = {
          ...currentData.cincoDeOro,
          pozoOro,
          pozoRevancha,
          proximoSorteo
        };
        result.updated = true;
        result.details.cincoDeOro = 'Pozos actualizados';
      } else {
        result.details.cincoDeOro = 'Pozos coinciden con lo emitido previamente.';
      }
    }

    if (result.updated) {
      updatedData.updatedAt = new Date().toISOString();
    }

    return { result, updatedData };
  } catch (err) {
    console.warn(`[La Banca Sync] Aviso: No se pudo conectar con la API (${err.message}). Se mantienen los datos locales.`);
    result.error = err.message;
    return { result, updatedData: currentData };
  }
}
