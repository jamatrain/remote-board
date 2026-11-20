# Remote Board 📺🎰
### Sistema de Cartelería Digital Remota para Resultados de Quiniela, Tómbola y 5 de Oro

Sistema web desarrollado para visualizar resultados de sorteos de lotería (diseño oficial de La Banca, Uruguay) en una pantalla o TV LED de 32" vía Chromecast / Google TV, controlado de forma remota desde un iPhone.

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
  * **Sincronización en tiempo real**: Utiliza Server-Sent Events (SSE) para actualizar los números en el televisor al instante apenas se guardan desde el celular.
* **URL de Administración (`/admin` o `/`)**:
  * Diseñada para **iPhone**: rápida, táctil y cómoda.
  * Salto automático de casilla al escribir (3 cifras en Quiniela, 2 cifras en Tómbola).
  * Botón **"Copiar y Ordenar a Tómbola"**: toma las terminaciones de la quiniela, las ordena de menor a mayor y genera la tómbola en 1 segundo.
  * Función **"Pegar Lista"**: permite pegar un mensaje de WhatsApp o texto completo y carga los 20 números automáticamente.
  * Formateo automático de moneda en 5 de Oro (`$ 17.400.000`).
  * Selector de pantallas activas en el ciclo.

---

## 📱 Conexión con el Hardware (iPhone + TV + Chromecast)

### Caso 1: Chromecast con Google TV (Control remoto físico dañado)
1. **Activar Zona Wi-Fi en el iPhone**:
   * Ve a **Ajustes > Compartir Internet** y actívalo.
   * Marca la opción **"Maximizar compatibilidad"** (activa 2.4 GHz).
2. **Conectar el Google TV al Wi-Fi del iPhone sin el control remoto**:
   * **Método A (Control de la TV por HDMI-CEC)**: Conecta el Chromecast al puerto HDMI del TV. Con las flechas y el botón OK del propio control del televisor podrás moverte por el menú del Google TV para ir a Ajustes > Red y elegir el Wi-Fi de tu iPhone.
   * **Método B (El truco del nombre idéntico)**: Ponle a tu iPhone temporalmente el mismo nombre y contraseña del Wi-Fi donde el Google TV ya estaba conectado antes. Al encenderlo, se conectará solo automáticamente.
   * **Método C (Mouse USB)**: Conecta un mouse USB común al puerto USB-C del Chromecast (usando un adaptador USB-C) y podrás hacer clic en la pantalla para ingresar la clave.
3. **Mostrar en la TV**:
   * En el Google TV, abre un navegador (como **TV Bro** u **OpenTV Browser**) y pon la dirección `https://tu-app.com/tv` a pantalla completa. ¡Queda funcionando solo sin gastar batería de tu celular!

### Caso 2: Chromecast clásico (Dongle sin control)
1. Conecta el Chromecast a la red de tu iPhone.
2. En tu iPhone descarga la app gratuita **Web Video Caster** (o **Replica / DoCast**).
3. Abre en la app la dirección `https://tu-app.com/tv` y toca el botón de **Transmitir al Chromecast**.

---

## 🛠️ Instalación y Uso Local

```bash
# Instalar dependencias
npm install

# Compilar frontend
npm run build

# Iniciar servidor
npm start
```

* Panel de control: [http://localhost:3000](http://localhost:3000)
* Pantalla para el TV: [http://localhost:3000/tv](http://localhost:3000/tv)

---

## ☁️ Despliegue Gratuito en la Nube (1 Clic)

Para que la app esté accesible desde cualquier lugar con una URL pública:

### En Render.com (Recomendado - 100% Gratis):
1. Crea una cuenta gratuita en [Render.com](https://render.com).
2. Haz clic en **New > Web Service** y conecta este repositorio (`remote-board`).
3. Configuración:
   * **Runtime**: `Node`
   * **Build Command**: `npm install && npm run build`
   * **Start Command**: `npm start`
4. Render te dará una URL HTTPS como: `https://remote-board.onrender.com`.
   * En tu iPhone abres: `https://remote-board.onrender.com`
   * En la TV abres: `https://remote-board.onrender.com/tv`
