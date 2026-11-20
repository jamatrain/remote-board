const NUMBER_KEYS = [
  'firstNumber', 'secondNumber', 'thirdNumber', 'fourthNumber', 'fifthNumber',
  'sixthNumber', 'seventhNumber', 'eighthNumber', 'ninthNumber', 'tenthNumber',
  'eleventhNumber', 'twelfthNumber', 'thirteenthNumber', 'fourteenthNumber', 'fifteenthNumber',
  'sixteenthNumber', 'seventeenthNumber', 'eighteenthNumber', 'nineteenthNumber', 'twentiethNumber'
];

function formatDate(dateStr) {
  if (!dateStr) return '';
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

/**
 * Realiza la sincronización directa desde el navegador del usuario (IP uruguaya/local).
 * Bypasea bloqueos de Cloudflare que sufren los datacenters de hosting (Render / AWS).
 */
export async function syncWithLaBancaClient(currentData) {
  const result = {
    updated: false,
    details: {}
  };

  const updatedData = { ...currentData };

  const fetchGame = async (id) => {
    const res = await fetch(`https://info-api.labanca.com.uy/info-api/v1/game/result/${id}/last/1`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*'
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
      const nums = NUMBER_KEYS.map(k => String(qVesp[k] !== undefined && qVesp[k] !== null ? qVesp[k] : '').padStart(3, '0'));
      const oldNums = currentData.quinielaVespertina?.numeros || [];
      const first10Same = nums.slice(0, 10).every((n, i) => n === oldNums[i]);

      if (!first10Same) {
        updatedData.quinielaVespertina = {
          fecha: formatDate(qVesp.drawDate),
          numeros: nums
        };
        result.updated = true;
        result.details.quinielaVespertina = `Actualizada (Sorteo ${qVesp.drawNumber || ''} - 1º: ${nums[0]})`;
      } else {
        result.details.quinielaVespertina = 'Primeros 10 coinciden con lo anterior. No se reenvía.';
      }
    }

    // 2. Quiniela Nocturna
    if (qNoct) {
      const nums = NUMBER_KEYS.map(k => String(qNoct[k] !== undefined && qNoct[k] !== null ? qNoct[k] : '').padStart(3, '0'));
      const oldNums = currentData.quinielaNocturna?.numeros || [];
      const first10Same = nums.slice(0, 10).every((n, i) => n === oldNums[i]);

      if (!first10Same) {
        updatedData.quinielaNocturna = {
          fecha: formatDate(qNoct.drawDate),
          numeros: nums
        };
        result.updated = true;
        result.details.quinielaNocturna = `Actualizada (Sorteo ${qNoct.drawNumber || ''} - 1º: ${nums[0]})`;
      } else {
        result.details.quinielaNocturna = 'Primeros 10 coinciden con lo anterior. No se reenvía.';
      }
    }

    // 3. Tómbola Vespertina
    if (tVesp) {
      const nums = NUMBER_KEYS.map(k => String(tVesp[k] !== undefined && tVesp[k] !== null ? tVesp[k] : '').padStart(2, '0'));
      const oldNums = currentData.tombolaVespertina?.numeros || [];
      const first10Same = nums.slice(0, 10).every((n, i) => n === oldNums[i]);

      if (!first10Same) {
        updatedData.tombolaVespertina = {
          fecha: formatDate(tVesp.drawDate || qVesp?.drawDate),
          numeros: nums
        };
        result.updated = true;
        result.details.tombolaVespertina = `Actualizada (Sorteo ${tVesp.drawNumber || ''})`;
      } else {
        result.details.tombolaVespertina = 'Primeros 10 coinciden con lo anterior. No se reenvía.';
      }
    }

    // 4. Tómbola Nocturna
    if (tNoct) {
      const nums = NUMBER_KEYS.map(k => String(tNoct[k] !== undefined && tNoct[k] !== null ? tNoct[k] : '').padStart(2, '0'));
      const oldNums = currentData.tombolaNocturna?.numeros || [];
      const first10Same = nums.slice(0, 10).every((n, i) => n === oldNums[i]);

      if (!first10Same) {
        updatedData.tombolaNocturna = {
          fecha: formatDate(tNoct.drawDate || qNoct?.drawDate),
          numeros: nums
        };
        result.updated = true;
        result.details.tombolaNocturna = `Actualizada (Sorteo ${tNoct.drawNumber || ''})`;
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
        result.details.cincoDeOro = `Pozos actualizados (Oro: ${pozoOro} | Revancha: ${pozoRevancha})`;
      } else {
        result.details.cincoDeOro = 'Pozos coinciden con lo emitido previamente.';
      }
    }

    if (result.updated) {
      updatedData.updatedAt = new Date().toISOString();
    }

    return { result, updatedData };
  } catch (err) {
    console.warn(`[La Banca Client Sync] Error: ${err.message}`);
    return { result: { updated: false, error: err.message }, updatedData: currentData, error: err.message };
  }
}
