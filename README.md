# Remote Board 📺🎰
### Sistema de Cartelería Digital Oficial con Integración en Vivo a La Banca (Uruguay)

Sistema web con integración a la API oficial de **La Banca** (`info-api.labanca.com.uy`) para proyectar automáticamente en un TV LED de 32" los resultados oficiales de la **Quiniela**, **Tómbola** y **5 de Oro**, con panel de control para iPhone y sincronización en tiempo real vía Server-Sent Events (SSE).

---

## ⚡ Integración Oficial en Vivo (La Banca)

El sistema se conecta directamente a la API oficial de La Banca:
* `QUINIELA_VESPERTINA` (ID 1)
* `QUINIELA_NOCTURNA` (ID 2)
* `TOMBOLA_VESPERTINA` (ID 3)
* `TOMBOLA_NOCTURNA` (ID 4)
* `CINCO_DE_ORO` (ID 5: Pozos estimados y fecha del próximo sorteo)

### 🧠 Reglas de Negocio y Control de Duplicados:
1. **Horarios de sorteos**:
   * **Por la mañana (antes de las 14:00 - 15:00 hs)**: Muestra los sorteos del día anterior (Vespertina y Nocturna del día previo), y el 5 de Oro del miércoles o domingo anterior.
   * **Luego de las 14:30 - 15:30 hs**: Al publicarse el sorteo vespertino de hoy, el sistema lo detecta y actualiza la Vespertina.
   * **Luego de las 21:30 hs**: Se actualiza la Nocturna con el sorteo de la noche de hoy.
2. **Regla de deduplicación (Primeros 10 resultados)**:
   * Antes de emitir cualquier actualización hacia el TV, el sistema compara los **primeros 10 resultados** del sorteo obtenido contra los que ya están en pantalla.
   * **Si los primeros 10 resultados coinciden**: El sistema determina que La Banca aún no ha publicado el sorteo nuevo y **NO lo reenvía al TV**, evitando sobreescrituras innecesarias.
   * **Si los primeros 10 resultados cambian**: Se actualiza inmediatamente la base de datos y se dispara un evento SSE que refresca la TV en el acto.

---

## 📸 Pantallas Incluidas (Réplica Oficial)

1. **Tómbola Vespertina**: Fondo rojo vibrante, logotipo de La Tómbola, 20 bolillas 3D celestes ordenadas, fecha de sorteo y pie legal.
2. **Tómbola Nocturna**: Mismo diseño rojo con identificador "NOCTURNA".
3. **Quiniela Vespertina**: Fondo verde vibrante, bolilla característica, 2 columnas con los 20 premios (posiciones 01 a 20) en pastillas blancas, fecha y pie legal.
4. **Quiniela Nocturna**: Mismo diseño verde con identificador "NOCTURNA".
5. **5 de Oro (Pozos Aproximados)**: Fondo azul eléctrico, título con resplandor dorado, grandes montos para **Pozo de Oro** y **Pozo Revancha**, y leyenda del próximo sorteo.

---

## 🚀 Arquitectura y Funcionamiento

* **URL del TV (`/tv` o `/#tv`)**:
  * Diseñada a pantalla completa (16:9) optimizada para TV de 32" (1366x768 / 1080p).
  * **Rotación automática**: Cambia suavemente de pantalla cada 60 segundos (ajustable).
  * **Sincronización en tiempo real**: Utiliza Server-Sent Events (SSE) para actualizar los números en el televisor al instante.
* **URL de Administración (`/admin` o `/`)**:
  * Botón **"SINCRONIZAR AHORA CON LA BANCA"**: Consulta los últimos sorteos al instante.
  * Auto-salto de casillas en entrada manual.
  * Botón **"Copiar y Ordenar a Tómbola"**.
  * Función **"Pegar Lista"**.
  * Formateo automático de moneda en 5 de Oro.
  * Selector de pantallas activas en el ciclo y temporizador.

---

## 📱 Conexión con el Hardware (iPhone + TV + Chromecast)

### Caso 1: Chromecast con Google TV (Control remoto físico dañado)
1. **Activar Zona Wi-Fi en el iPhone**:
   * Ve a **Ajustes > Compartir Internet** y actívalo con *"Maximizar compatibilidad"*.
2. **Conectar el Google TV al Wi-Fi del iPhone sin control**:
   * **Método A (Control de la TV por HDMI-CEC)**: Conecta el Chromecast al HDMI del TV y usa las flechas y el botón OK del propio control de la tele.
   * **Método B (Mismo nombre de red)**: Ponle a tu iPhone temporalmente el mismo nombre y clave del Wi-Fi donde el Google TV andaba antes. Se conectará solo.
   * **Método C (Mouse USB)**: Conecta un mouse USB al puerto USB-C del Chromecast con un adaptador OTG.
3. **Mostrar en la TV**:
   * Abre en el navegador del Google TV (**TV Bro** u **OpenTV Browser**) la URL `https://tu-app.com/tv` a pantalla completa. ¡Queda funcionando solo sin gastar batería del celular!

### Caso 2: Chromecast clásico (Dongle sin control)
1. Conecta el Chromecast a la red de tu iPhone.
2. En tu iPhone descarga la app gratuita **Web Video Caster** (o **Replica / DoCast**).
3. Abre en la app la dirección `https://tu-app.com/tv` y toca **Transmitir al Chromecast**.

---

## 🛠️ Instalación y Uso Local

```bash
# Iniciar servidor (incluye sincronización automática cada 3 minutos con La Banca)
npm start
```

* Panel de control: [http://localhost:3000](http://localhost:3000)
* Pantalla para el TV: [http://localhost:3000/tv](http://localhost:3000/tv)
