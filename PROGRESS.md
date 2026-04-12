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
- **Perfil Integrado**: Al hacer clic en la pestaña "Mi Perfil" estando logueado, ya no se usa el sub-panel antiguo, sino que redirige automáticamente a la pestaña Inicio (`panel-honor`) pero desplegando la vista detallada de "Panel Estudiantil" que antes era exclusiva del ranking.
- **Selector de Grupos**: Ya no desaparecen de las opciones de "Seleccionar O Cambiar Grupo" los grupos vacíos. Modificado para rellenar forzadamente y que siempre muestre desde "Grupo 1" hasta "Grupo 18".

## 🎯 Último Checkpoint (GitHub)
- **Mensaje**: `Mejora: Panel estudiantil integrado en Mi Perfil y selector de grupos completo` + Commits previos de Auth Wall.
- **Archivos Modificados**: `index.html`, `PROGRESS.md`.
- **Fecha**: `12 de abril de 2026`.
- **Estado**: Subido exitosamente a `origin master` (hash `fda2997`).


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
