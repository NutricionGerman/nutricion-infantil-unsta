# 🗺️ Mapa Arquitectónico: Nutrición Infantil UNSTA
> Última actualización: 2026-04-11 | Proyecto: `nutricion-gamificada` (Firebase)

---

## 🏗️ Estructura de Directorios (Raíz)

```
pagina nutricion infantil/
├── index.html              ← App completa (HTML + CSS + JS, ~8460 líneas)
├── seed.html               ← Herramienta de carga masiva inicial de datos
├── GUIA_ALUMNOS_2026.html  ← Página informativa para los alumnos
├── import_data.js          ← Script de importación de datos a Firestore
├── generate_seed.py        ← Script Python para generar datos semilla
├── firebase.json           ← Configuración de Firebase Hosting
├── firestore.rules         ← Reglas de seguridad de Firestore
├── firestore.indexes.json  ← Índices compuestos de Firestore
├── .firebaserc             ← Proyecto Firebase activo (nutricion-gamificada)
├── PROJECT_MAP.md          ← Este archivo
├── PROGRESS.md             ← Historial de cambios y configuraciones clave
├── FUTURE_IMPROVEMENTS.md ← Hoja de ruta técnica a largo plazo
│
├── asistencias/            ← Archivos .txt con listas de asistencia por clase
│   └── asistencia clase 1.txt  (55 alumnos presentes)
│
├── scratch/                ← Scripts de trabajo temporal (NO van al deploy)
│   ├── process_attendance.py   ← Sincroniza asistencia .txt → Firestore
│   ├── export_fields.py        ← Exporta campos de Firestore a JSON
│   ├── map_project.py          ← Script que generó el mapa de index.html
│   ├── students_update.json    ← Snapshot de alumnos exportado
│   ├── updated_app_state.json  ← Snapshot de app_state exportado
│   ├── fields_only.json        ← Campos simplificados de alumnos
│   └── remaining_students.json ← Alumnos sin procesar en batch anterior
│
├── iconos/                 ← Favicons, logo, íconos PWA
├── bibliografia/           ← Material bibliográfico de la cátedra
├── proyectos/              ← Proyectos especiales de alumnos
└── nuevo programa/         ← Material del nuevo programa de estudios
```

> **Nota**: Las carpetas `CLASES/` y `HERRAMIENTAS/` pueden existir en el servidor
> de producción (GitHub Pages) pero no necesariamente en local.

---

## 📄 Mapa de `index.html` por Secciones

### ZONA 1 — CSS / Estilos (líneas 1 – 2625)
| Rango | Contenido |
|-------|-----------|
| 1 – 22 | `<head>`: meta tags, título, SEO |
| 23 – 2611 | Bloque `<style>` principal: variables de color, tipografía, componentes |
| 2612 – 2624 | Links externos: FontAwesome, Google Fonts (Poppins), Favicons |
| 2625 | Cierre de `</head>` |

### ZONA 2 — HTML / Estructura (líneas 2627 – 3486)
| Línea | Elemento |
|-------|----------|
| 2627 | `<body>` |
| 2629 | `<header>` → Barra de navegación del sitio |
| 2631 | `<nav class="main-navbar">` con 6 tabs |
| 2644 | `<main>` → Contenedor principal |
| 2645 | `<div id="tab-content-container">` |
| **2647** | **Panel: `#panel-perfil`** → Mi Perfil (login por UP + contraseña) |
| **2695** | **Panel: `#panel-clases`** → Material de clase (dinámico) |
| **2704** | **Panel: `#panel-honor`** → Salón de la Fama (Rankings XP) |
| **2793** | **Panel: `#panel-herramientas`** → Calculadoras (desde JSON) |
| **2801** | **Panel: `#panel-proyectos`** → Proyectos / Kiosco Saludable |
| **2824** | **Panel: `#panel-contacto`** → Panel Docente (acceso con email+pass Firebase) |
| 2960 | Cierre de `<main>` |
| 2966 | `#kiosco-saludable-container` → Vista del Kiosco (se muestra/oculta) |
| 2975 – 3152 | **Modales del Kiosco**: receta, video, fundamentos científicos (fibra, azúcar, trans, sodio, grasa sat., colesterol) |
| 3154 – 3195 | Modal: Cambiar clave de grupo (`#change-group-key-modal`) |
| 3198 – 3215 | Modal: Confirmar cambio de grupo (`#confirm-group-switch-modal`) |
| 3217 – 3234 | Modal: Acceso grupal (`#group-access-modal`) |
| 3236 – 3310 | Modal: Editor de perfil de grupo (`#group-editor-modal`) |
| 3313 – 3330 | Modal: Acceso de alumno (`#student-access-modal`) |
| 3332 – 3368 | Modal: Editor de foto de alumno (`#student-photo-editor-modal`) |
| 3373 – 3381 | `<footer>` |
| 3383 – 3486 | Modales adicionales: gráfico de asistencia global, desglose de regularidad |

### ZONA 3 — JavaScript / Lógica (líneas 3487 – 8460)
| Línea | Función / Bloque |
|-------|-----------------|
| 3487 | `<script>` — Inicio |
| 3488 | `DOMContentLoaded` → Sistema de navegación por tabs |
| 3505 | `fullData` → Estado global en memoria (students, sessions, records) |
| 3510 | `rankList[]` → 23 rangos de XP (Bronce I → Leyenda Supersónica) |
| 3537 | **Configuración Firebase** (`projectId: "nutricion-gamificada"`) |
| 3546 | `firebase.initializeApp()` + `const db = firebase.firestore()` |
| 3552 | `initializeApp()` → Orquestador principal de carga |
| 3605 | `fetchGroupsMetadata()` → Carga logos/lemas de grupos desde Firestore |
| 3608 | `db.collection('students').onSnapshot()` → Listener en tiempo real |
| 3635 | `switchDashboardTab('alumnos')` → Vista inicial del dashboard |
| 3666 | `saveProjectData()` → Guardado atómico con `db.batch()` |
| 3711 | `initializeShop()` → Canje de XP por artículos (TP Bonus Grupal) |
| 3794 | `generatePdfReport()` → Informe PDF con jsPDF + autoTable |
| 3980 | `generateAndDisplayClasses()` → Escanea archivos en `/CLASES/` |
| 4059 | `showHonorPanelView()` → Controla qué vista del panel honor se muestra |
| 4082 | `switchDashboardTab()` → Cambia entre: alumnos/grupos/hitos/asistencia/regularidad |
| 4125 | `displayGlobalStats()` → Tarjetas del dashboard (totales, regularidad) |
| 4192 | `displayTPGallery()` → Galería de videos de TPs por grupo |

---

## 🔥 Colecciones Firestore

| Colección | Descripción |
|-----------|-------------|
| `students` | Documento por alumno (clave: `up`). Contiene: nombre, apellido, grupo, XP, parciales, historial de asistencia/TPs |
| `app_state/main` | Doc único con configuración global: TPs, sesiones, attendance records, invite code |
| `student_photos` | Documento por UP con campo `photo` (base64 o URL) |
| `student_profiles` | Perfiles extendidos de alumnos (pueden contener foto también) |
| `grupos` | Documento por ID de grupo con logo, lema y videos entregados |
| `group_keys` | Claves de acceso por grupo. Default: `gN` (ej: g4). Excepción: Grupo 17 → `g_17` |
| `video_ratings` | Calificaciones de videos (estrellas) por grupo y TP |

---

## 👥 Sistema de Grupos

- **18 grupos estándar**: IDs `g_1` al `g_18` (también pueden aparecer como `1`–`18`)
- **Clave por defecto**: `gN` (Grupo 4 → `g4`)
- **Excepción conocida**: Grupo 17 tiene clave personalizada `g_17`
- El sistema busca documentos por ambos formatos de ID (`1` y `g_1`) para evitar inconsistencias

---

## 🎮 Sistema de XP y Rangos

- **+2 XP** por asistencia a clase
- **23 rangos** desde "Sin Rango" (0 XP) hasta "Leyenda Supersónica" (120 XP)
- Los rangos tienen imágenes asociadas en `iconos/` (ej: `45.png` → Oro I)

---

## 🔐 Sistema de Acceso

| Rol | Método de Acceso |
|-----|-----------------|
| Alumno | UP (legajo) + contraseña personal creada en el primer login |
| Grupo | Clave grupal (`gN` por defecto) |
| Docente | Email Firebase (`cristian.auad@unsta.edu.ar`) + contraseña Firebase |

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|-----------|-----|
| HTML5 + CSS + Vanilla JS | Frontend completo |
| Firebase Firestore | Base de datos en tiempo real |
| Firebase Hosting | Deploy (GitHub Actions → `gh-pages` o Firebase) |
| Firebase Auth | Login del docente |
| Chart.js | Gráficos de asistencia y regularidad |
| jsPDF + autoTable | Generación de informes PDF |
| FontAwesome 6.5.1 | Iconografía |
| Google Fonts (Poppins) | Tipografía |

---

## 📁 Archivos de Referencia para el Agente

| Archivo | Para qué sirve |
|---------|----------------|
| `PROGRESS.md` | Historial de cambios importantes y configuraciones clave |
| `FUTURE_IMPROVEMENTS.md` | Ideas de mejora a largo plazo (no tareas inmediatas) |
| `asistencias/*.txt` | **Fuente de verdad** para sincronizar asistencia. No inventar datos. |
| `scratch/process_attendance.py` | Script para procesar asistencia y subir a Firestore |
| `firestore.rules` | Reglas de seguridad actuales de la base de datos |
