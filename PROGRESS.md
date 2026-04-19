# 📋 Resumen de Progreso - Nutrición Infantil UNSTA

Este documento sirve como memoria para el asistente de IA sobre los cambios y configuraciones realizadas en el proyecto.

## 🛠️ Configuración Core
- **Tecnología**: HTML5, Vanilla CSS, JS Nativo.
- **Base de Datos**: Firebase Firestore (Proyecto: `nutricion-gamificada`).
- **Repositorio**: GitHub (`master`).

## 🔐 Sistema de Acceso a Grupos
- **Lógica de Claves**: Las claves se gestionan en la colección `group_keys`.
- **Regla Estándar**: Si no existe una clave personalizada para un grupo `N`, la clave por defecto es `gN` (ej: Grupo 4 -> `g4`).
- **Claves Personalizadas**: 
  - El Grupo 17 tiene la clave `g_17` configurada manualmente.

## 👨‍🏫 Panel Docente (Mejoras Recientes)
- **Consistencia Visual**: La pestaña de "Entregas de Grupos" (`loadAdminGroupContents`) ahora muestra siempre los **18 grupos estándar** (ID `g_1` al `g_18`), sin importar si tienen datos cargados o no.
- **Gestión de IDs**: El sistema ahora busca datos tanto por ID numérico (`1`) como con prefijo (`g_1`) para evitar inconsistencias.
- **Grupos Extras**: El sistema detecta y muestra grupos fuera del rango estándar si existen en la base de datos.
- **Gestión de Alumnos (Claves y Fotos)**: En la pestaña "Sistema" del panel docente, se agregó un modal de "Gestión de Alumnos". Permite visualizar y borrar las **contraseñas personales** para forzarlos a iniciar con el código general, y también permite **eliminar sus fotos de perfil** directamente desde el panel sin tocar la base de datos a mano.

## 🧼 Limpieza de Datos
- **Grupo 22**: Se eliminó completamente de Firestore (colección `grupos`) ya que correspondía a una cohorte anterior, dejando el panel limpio para este año.

## 🗄️ Infraestructura de Base de Datos (Nuevo)
- **Migración de Alumnos**: Se extrajo el enorme bloque de alumnos que residía en `app_state/main` y se los migró a su propia colección `students` asignando como clave de documento su DNI/UP. Las reglas de seguridad y lecturas de App fueron actualizadas (`firestore.rules`).
- **Resiliencia UI**: Se ajustó `index.html` para contemplar de manera robusta estructuras (`sessions`, `attendanceRecords`) que estén momentáneamente vacías y así evitar fallos del dashboard (TypeError de listados undefined).

## 🔧 Herramientas (Nuevo)
- **Sección Herramientas activa**: Se incrustó directamente en el HTML la tarjeta de **ValoraGest** con enlace externo a `https://nutriciongerman.github.io/valora-gest/`.
- **Sin dependencia de JSON**: La tarjeta es HTML estático, funciona siempre sin necesitar el `fetch` a `herramientas.json`.

## 🔔 Sistema de Detección de Nueva Versión (Nuevo)
- **Archivo `version.json`**: Controla la versión actual de la app. El docente actualiza la fecha antes de cada deploy.
- **Banner automático**: Cuando el docente hace deploy y actualiza `version.json`, los alumnos que tengan la página abierta ven un banner naranja-ámbar animado con botón "Actualizar ahora".
- **Chequeo inteligente**: Verifica cada 5 minutos y también al volver a la pestaña (útil para celulares).
- **Flujo del docente**: Modificar `index.html` → cambiar fecha en `version.json` → commit + push → alumnos son notificados automáticamente.

## 🔐 Auth Wall y Acceso (Nuevo)
- **Muro de Autenticación (Auth Wall)**: Implementado obligando a registro/ingreso (con código o UP/Pass) antes de ver la página web. Utiliza `sessionStorage` para autologuear.
- **Acceso Docente Protegido**: El link "Ingresar como docente" ahora abre un sub-panel dentro del muro y requiere login real con Firebase Auth para recién descartar el muro y entrar.

## 🛠️ Panel de Administración (Gestión Interna)
- **Añadir Alumno Excepcional**: Botón para que el docente pueda registrar alumnos manualmente saltándose el Auth Wall, si tuvieran complicaciones.
- **Eliminación Total de Alumno**: Desde la lista de claves, ahora se muestran íconos más prolijos, y se integró la función para borrar alumno completamente (clave, foto, y tabla principal), previniendo errores undefined en nombres.
- **Gestión Manual de Asistencia**: Ahora al darle clic en "Importar Asistencia" en cada clase generada, el sistema despliega un buscador en tiempo real de todos los alumnos, junto con *checkboxes/switches* que permiten de forma manual darle "Presente" a un alumno o "Ausente", otorgándole/descontándole su puntaje de experiencia correspondiente (+2 XP) de manera instantánea y transparente al tocar el botón.
- **Historial de Trabajos Prácticos Inteligente (Alumnos)**: El panel de los estudiantes ahora muestra estados dinámicos precisos para cada TP: "Entregado" (verde), "No habilitado" (gris, si no cuenta para porcentaje), "Vence el dd/mm/aa" (naranja, si está activo pero en plazo), y "No entregado" (rojo, si ya pasó la fecha configurada sin entregar).

- **Estado**: Subido exitosamente a `origin master`.

## 🔒 Gestión de Grupos y Seguridad (Finalizado)
- **Cambio de Clave desde Editor**: Se implementó una función `bypass` (`changeGroupKeyFromEditor`) para permitir que docentes o integrantes con acceso al editor de grupo cambien la clave grupal sin depender de una sesión de alumno cargada.
- **UI de Clave**: Se reemplazó el modal complejo de alumnos por un prompt de sistema nativo más rápido y eficiente para perfiles administrativos.
- **Persistencia Firestore**: El sistema ahora actualiza en paralelo tanto la colección `group_keys` (para el login) como el campo `code` en `grupos` (para la gestión interna).
- **Security Rules**: Se actualizaron las reglas de Firestore para permitir que usuarios con el rol adecuado escriban en `group_keys`.

## 📌 Último Checkpoint (Actual)
- **Commit**: `6a6d4e7`
- **Mensaje**: `Fix: Bypass de sesión de alumno para cambio de clave grupal y actualización de reglas Firestore`
- **Descripción**:
  - Implementada función global `changeGroupKeyFromEditor` vinculada al botón de edición.
  - Corregido bug de "Primero debes tener un grupo asignado" al editar desde el panel administrativo.
  - Actualizadas `firestore.rules` para habilitar escritura en `group_keys`.
  - Mejorada estética de botones de edición (Save/Upload Logo).
- **Archivos Modificados**: `index.html`, `firestore.rules`, `PROGRESS.md`.
- **Fecha**: `13 de abril de 2026`.
- **Estado**: Subido exitosamente a `origin master`.

## 📌 Último Checkpoint (Actual)
- **Commit**: `EMBED_VIDEO_$(date +%s)`
- **Mensaje**: `Feat: Visualización de videos embebidos en el detalle de TPs del alumno`
- **Descripción**:
  - Se reemplazó la miniatura estática y el botón flotante por un `iframe` nativo de YouTube dentro de la tarjeta de entrega del portal de alumnos (`tp-main-display`).
  - Ahora el alumno puede reproducir su video directamente desde la misma pantalla sin abrir ventanas modales.
  - La lógica de la Galería principal se mantiene intacta.
- **Validación de Identidad**: Se corrigió un bug en `initializeApp` que impedía calificar videos. Ahora el sistema sincroniza correctamente los datos del alumno (`currentStudentData`) al iniciar la sesión, permitiendo el sistema de votos.
- **Archivos Modificados**: `index.html`, `PROGRESS.md`.
- **Fecha**: `13 de abril de 2026`.
- **Estado**: Subido exitosamente a `origin master`.

## 📌 Último Checkpoint (Actual)
- **Commit**: `91afd79`
- **Mensaje**: `Fix: Sincronización de sesión de alumno y reparación de links de YouTube`
- **Descripción**:
  - Reparada la lógica de visualización de YouTube (X-Frame-Options) en Galería y TPs.
  - Corregido el error "No se pudieron validar tus datos de alumno" al calificar videos.
  - Sincronizada la carga global de `currentStudentData` en el arranque.
- **Archivos Modificados**: `index.html`, `PROGRESS.md`.
- **Fecha**: `13 de abril de 2026`.
- **Estado**: Subido exitosamente a `origin master`.

## 📌 Último Checkpoint (Actual)
- **Commit**: `Feat: Soporte multi-plataforma para videos (TikTok/Directo) y mejoras estéticas en Galería`
- **Descripción**:
  - Implementada utilidad `getVideoInfo` para detectar YouTube, TikTok y archivos directos (.mp4, .webm).
  - Actualizado `videoModal` con soporte para etiqueta `<video>` nativa.
  - Aplicado *Glassmorphism* (fondo esmerilado) a las secciones de la galería.
  - Mejorada la barra de desplazamiento (más fina y minimalista).
  - Rediseñado el botón de "Play" con efecto cristal y animaciones de escala.
  - Corregido el chip de "Mejor Calificado" como una píldora flotante integrada en la miniatura.
  - Limpieza de redundancia en nombres de grupos en las tarjetas de galería.
- **Archivos Modificados**: `index.html`, `PROGRESS.md`.
- **Fecha**: `14 de abril de 2026`.
- **Estado**: Subido exitosamente a `origin master`.

## 📌 Último Checkpoint (Actual)
- **Commit**: `Feat: Panel rápido y herramientas grupales de Docente`
- **Mensaje**: `Feat: Herramientas de XP y Asistencia para Docente`
- **Descripción**:
  - Implementado panel de búsqueda rápida en la pestaña Alumnos para docentes.
  - Creadas funciones \`adminModXP\` y \`adminModManualAtt\` para gestionar estudiantes.
  - Implementado \`adminGroupModXP\` expuesto en portales de Grupos para poder sumar/restar XP en lote.
  - Asegurada consistencia y auto-actualización de los paneles al guardar datos usando \`db.batch()\`.
- **Archivos Modificados**: \`index.html\`, \`PROGRESS.md\`.
- **Fecha**: \`19 de abril de 2026\`.
- **Estado**: Subido exitosamente a \`origin master\`.

---

## 🤖 Directivas de Flujo de Trabajo (para el Agente)

**OBLIGATORIO al finalizar cualquier tarea:**

1. Mostrar el **último commit** registrado en el repositorio local.
2. Listar en una tabla los **archivos modificados** durante la tarea con una descripción del cambio.
3. Preguntar al usuario cuál de estas opciones prefiere:
   - **A)** Solo commit local (`git add` + `git commit`)
   - **B)** Commit local + subir a GitHub (`git add` + `git commit` + `git push origin master`)
   - **C)** Saltar por ahora
4. Si el usuario elige A o B, **actualizar la sección `📌 Último Checkpoint`** de este mismo archivo (`PROGRESS.md`) con el mensaje del commit, archivos modificados, fecha y estado (local / subido).

**Formato de mensaje de commit:** usar prefijos descriptivos como:
- `Feat:` → nueva funcionalidad
- `Fix:` → corrección de bug
- `Docs:` → cambios en documentación
- `Checkpoint:` → punto de guardado general
- `Security:` → cambios en reglas o acceso

**Regla de integridad de datos:** Nunca inventar nombres de alumnos, grupos ni datos. Toda información debe provenir de archivos físicos del proyecto (`.txt`, `.json`, `.html`) o de Firestore consultado directamente.

---
*Documento generado el 2026-04-10 para asegurar continuidad en futuras sesiones.*
