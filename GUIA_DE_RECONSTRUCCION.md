# 🗺️ GUÍA DE RECONSTRUCCIÓN DE PROYECTO
**Fecha:** 09 de Abril, 2026
**Ubicación original:** `C:\Users\germa\OneDrive\Desktop\ARCHIVOS\UNSTA\pagina nutricion infantil`

Este documento contiene el "mapa lógico" de las carpetas `CLASES` y `HERRAMIENTAS` antes de su eliminación para alivianar el peso del proyecto. Si a futuro deseas reintegrarlas, solo debes copiar las carpetas de vuelta y el sistema funcionará automáticamente basándose en estas rutas.

---

## 🛠️ CARPETA: HERRAMIENTAS
El sistema de herramientas es dinámico y depende exclusivamente del archivo `HERRAMIENTAS/herramientas.json`.

### Estructura de archivos esperada:
- `HERRAMIENTAS/herramientas.json` (Archivo maestro de configuración)
- `HERRAMIENTAS/postparto.html`
- `HERRAMIENTAS/imcgestacional.html`
- `HERRAMIENTAS/cintura.html`
- `HERRAMIENTAS/AMB.html`
- `HERRAMIENTAS/perimetro-braquial.html`
- `HERRAMIENTAS/pliegue-triceps.html`
- `HERRAMIENTAS/Mapa-de-correlatividades.html`
- **Sub-carpetas:**
  - `mamaderas/` (Contiene `mamaderas.html`)
  - `planificador-nutricional/` (Contiene `planificacion-nutricional.html` y su `js/`)
  - `tablas-oms/` (Contiene archivos `.html` con curvas de la OMS)

### Conexión en `index.html`:
El código busca este archivo mediante `fetch('HERRAMIENTAS/herramientas.json')` para generar las tarjetas de herramientas automáticamente.

---

## 📚 CARPETA: CLASES
Las clases se cargan mediante un escaneo dinámico basado en un rango de fechas de la cursada.

### Archivos de Clase (.html):
El sistema espera archivos con el formato `Clase-DD-MM.html`.
- **Ruta:** `CLASES/Clase-XX-XX.html`

### Multimedia y Videos (.mp4 / .png):
Estos archivos son referenciados internamente por las páginas de cada clase o por la galería de medios.
- `CLASES/1108.mp4`
- `CLASES/cinta metrica.mp4`
- `CLASES/circunferencia braquial.mp4`
- `CLASES/fuerza-prension.mp4`
- `CLASES/marcacion-cdc.mp4`
- `CLASES/plicometro.mp4`
- `CLASES/pliegue triceps.mp4`
- `CLASES/talla-cdc.mp4`
- **Imágenes:** `logo.png`, `marca mesobraquial.png`, `mqi.png`.

---

## 📝 INSTRUCCIONES PARA EL FUTURO AGENTE:
"Si las carpetas `CLASES` o `HERRAMIENTAS` han sido restauradas físicamente, no es necesario modificar el `index.html`. El sistema está programado para verificar la existencia de estos archivos mediante peticiones `fetch`. Si los archivos están en la ruta correcta según este mapa, aparecerán automáticamente en la interfaz del usuario."

---
*Archivo generado por Antigravity para asegurar la integridad lógica del proyecto.*
