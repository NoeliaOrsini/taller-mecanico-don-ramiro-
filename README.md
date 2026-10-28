# 🛠️ Taller Mecánico Don Ramiro

Aplicación web simple para gestionar el flujo de trabajo de un taller mecánico.

Estilo **Arcade / Neobrutalism**, pensada especialmente para uso táctil en celular y tablet.

![Preview](preview.png)

## ✨ Características

- **Ingreso de vehículos** con datos del cliente, patente, motivo de ingreso y teléfono (WhatsApp)
- **Semáforo de estados**:
  - 🔴 **ROJO** → En reparación
  - 🟡 **AMARILLO** → Cotizando / Esperando aprobación
  - 🟢 **VERDE** → Listo para retirar
  - 📦 **ARCHIVADO** → Historial
- **Trabajos adicionales** con costo y simulación de aprobación del cliente (con marca de tiempo)
- **Botón de WhatsApp** que genera el mensaje según el estado del vehículo
- **Filtros táctiles** por estado
- **Persistencia local** con `localStorage` (no se pierde la información al refrescar)
- Diseño responsive y botones grandes pensados para el taller

## 📁 Estructura del proyecto

```
taller-don-ramiro/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos personalizados (arcade/neobrutalism)
├── js/
│   └── app.js          # Lógica de la aplicación
└── README.md
```

## 🚀 Cómo usarlo

### Opción 1: Abrir directamente
1. Descargá o cloná el repositorio
2. Abrí el archivo `index.html` en cualquier navegador moderno

### Opción 2: Servidor local (recomendado)
```bash
# Con Python
python -m http.server 8000

# Con Node (si tenés npx)
npx serve .
```
Luego abrí: [http://localhost:8000](http://localhost:8000)

### Opción 3: GitHub Pages
1. Subí el repositorio a GitHub
2. Andá a **Settings → Pages**
3. Seleccioná la rama `main` y la carpeta `/ (root)`
4. Guardá. En unos minutos estará disponible en:
   `https://tu-usuario.github.io/taller-don-ramiro/`

## 📱 Uso diario en el taller

1. Presioná **INGRESAR VEHÍCULO** y cargá los datos
2. Usá los botones del semáforo para cambiar el estado
3. Si aparece un trabajo extra → **+ EXTRA**
4. Para avisar al cliente → **WHATSAPP**
5. Cuando se retire el auto → **ARCHIVAR EN HISTORIAL**

## 🛠️ Tecnologías

- HTML5
- Tailwind CSS (CDN)
- Font Awesome
- JavaScript vanilla
- localStorage

## 📌 Notas

- Los datos se guardan solo en el navegador (localStorage). Si limpiás la caché del navegador se borran.
- El botón "Simular Aprobación del Cliente" es para testing. En producción se puede reemplazar por un flujo real de WhatsApp o un backend.
- Ideal para usar en una tablet o celular del taller.

---

Hecho con ❤️ para el taller de **Don Ramiro**
