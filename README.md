# 🚗 Don Ramiro - Taller Mecánico

**App de Gestión Táctil & Notificaciones WhatsApp**

Una aplicación web **mobile-first** con estilo retro/arcade diseñada para la gestión operativa en tiempo real de talleres mecánicos. Optimizada para entornos de trabajo exigentes: facilita el control visual del estado de los vehículos y automatiza las comunicaciones con los clientes vía WhatsApp.

> Diseñada originalmente con **Gemini Canvas** y refactorizada con **Grok**.

---

## 🎯 Problema que resuelve

En la operativa diaria de un taller mecánico aparecen tres fricciones principales que afectan la productividad y la relación con los clientes:

1. **Interrupciones constantes por llamadas**  
   Los clientes llaman o escriben reiteradamente para preguntar si su vehículo ya está listo, interrumpiendo el trabajo de los mecánicos.

2. **Discusiones por presupuestos y trabajos extra**  
   Al desarmar un vehículo suelen aparecer fallas adicionales. Cuando no existe un registro claro de la aprobación del cliente, se generan desacuerdos sobre los costos al momento del retiro.

3. **Interfaces poco aptas para el taller**  
   Las pantallas tradicionales con texto pequeño o botones estrechos son difíciles de usar con manos sucias, en movimiento o desde el celular del taller.

---

## 💡 Solución

**Don Ramiro** resuelve estas problemáticas con una plataforma de **un solo toque (one-tap)** pensada específicamente para la dinámica del taller:

| Función | Descripción |
|--------|-------------|
| **Semáforo de estados** | 🔴 En reparación · 🟡 Cotizando / Esperando aprobación · 🟢 Listo para retirar |
| **Aprobación con marca de tiempo** | Al detectar un trabajo extra se registra detalle y monto. La app guarda fecha, hora y segundo exactos de la autorización del cliente → registro auditable. |
| **WhatsApp directo (wa.me)** | Botones de un toque que abren WhatsApp con mensajes preescritos para pedir aprobación o avisar que el auto está listo. |
| **Diseño táctil neobrutalista / arcade** | Botones grandes (mín. 48 px), tipografía bold y alto contraste para toques precisos desde el celular. |
| **Historial y archivado** | Los vehículos entregados se archivan (no se eliminan) para consultar garantías sin saturar el panel diario. |

---

## 🎨 Diseño

- **Estilo**: Neobrutalism / Arcade (bordes negros gruesos, sombras duras, colores vivos)
- **Enfoque**: Mobile-first y táctil
- **Tipografía**: Inter (Google Fonts)
- **Iconografía**: Font Awesome
- **Feedback visual**: Botones con efecto “presión” al tocar + toasts de confirmación
- **Colores semáforo**:
  - 🔴 Rojo → En reparación
  - 🟡 Amarillo → Cotizando / Esperando aprobación
  - 🟢 Verde → Listo para retirar

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|-----------|-----|
| **HTML5** | Estructura semántica |
| **CSS3 + Tailwind CSS** | Estilos y diseño responsive mobile-first |
| **JavaScript ES6+** | Lógica de estado, DOM y marcas de tiempo |
| **LocalStorage API** | Persistencia local sin servidor ni base de datos |
| **Font Awesome** | Iconos |
| **Google Fonts (Inter)** | Tipografía |
| **wa.me** | Enlaces directos a WhatsApp |

> Arquitectura simple de **3 archivos** (HTML + CSS + JS) para máxima velocidad de carga y fácil mantenimiento.

---

## 📁 Estructura del proyecto

```
taller-mecanico-don-ramiro-/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos arcade / neobrutalism
├── js/
│   └── app.js          # Lógica de la aplicación
├── README.md
└── .gitignore
```

---

## 📱 Cómo probar la aplicación

1. Abrí el archivo `index.html` en cualquier navegador o accedé por **GitHub Pages**.
2. Presioná **INGRESAR VEHÍCULO** y completá el formulario.  
   > 💡 Para probar WhatsApp con tu celular, ingresá tu número en formato internacional limpio (sin espacios ni ceros).  
   > Ejemplo Argentina: `5491112345678`
3. Cambiá el estado del auto con los botones del semáforo (🔴 🟡 🟢).
4. Agregá un trabajo adicional con **+ EXTRA** → el auto pasa automáticamente a amarillo.
5. Simulá la aprobación del cliente con **SIMULAR APROBACIÓN DEL CLIENTE** para generar la marca de tiempo.
6. Presioná **WHATSAPP** para abrir la conversación con el mensaje preescrito.
7. Al finalizar, usá **ARCHIVAR EN HISTORIAL** para mover el vehículo a la solapa de historial.

---

## 🚀 Cómo usarlo

### Opción 1 – Abrir directamente
Descargá o cloná el repositorio y abrí `index.html` en el navegador.

### Opción 2 – Servidor local
```bash
# Python
python -m http.server 8000

# o con Node
npx serve .
```
Luego abrí: [http://localhost:8000](http://localhost:8000)

### Opción 3 – GitHub Pages
1. Andá a **Settings → Pages**
2. Source: Deploy from a branch → `main` → `/ (root)`
3. Guardá. En unos minutos estará disponible en:  
   `https://noeliaorsini.github.io/taller-mecanico-don-ramiro-/`

---

## 📌 Notas

- Los datos se guardan únicamente en el navegador (`localStorage`). Si se limpia la caché se pierden.
- El botón “Simular Aprobación del Cliente” es para pruebas. En un entorno real se puede reemplazar por un flujo de confirmación vía WhatsApp o un backend.
- Ideal para usar en una **tablet o celular del taller**.

---

**Hecho con ❤️ para el taller de Don Ramiro**  
Diseñado con Gemini Canvas · Refactorizado con Grok
