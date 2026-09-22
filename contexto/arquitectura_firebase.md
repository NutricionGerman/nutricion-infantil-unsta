# 🔥 Arquitectura de Firebase Firestore

> **Proyecto**: `nutricion-gamificada`  
> **Servicio de Hosting y Base de Datos**: Firebase Firestore (Google Cloud)  
> **Acceso Administrativo**: `cristian.auad@unsta.edu.ar`

---

## 🗄️ Colecciones de Firestore

La aplicación organiza sus datos en las siguientes colecciones principales:

### 1. `students`
Es la colección central de alumnos. Cada documento tiene como ID el **legajo o UP (DNI)** del estudiante:
* **Campos clave**:
  * `up` *(string)*: Identificador único del alumno.
  * `nombre` *(string)* y `apellido` *(string)*.
  * `grupo` *(string)*: Grupo asignado (ej. `"g_4"` o `"4"`).
  * `xp` *(number)*: Puntos de experiencia acumulados.
  * `rango` *(string)*: Nombre del rango actual alcanzado.
  * `attendance` *(map/array)*: Historial de presentes y ausentes por sesión.
  * `tps` *(map)*: Estado de entrega y notas de Trabajos Prácticos.
  * `parciales` *(map)*: Calificaciones de parciales y recuperatorios.
  * `password` *(string, opcional)*: Clave personal creada en su primer inicio de sesión.

### 2. `app_state` (Documento: `main`)
Documento único que almacena el estado global de la cátedra y la configuración del curso:
* `sessions` *(array)*: Lista de clases dictadas (fecha, título, tema, ID).
* `tps` *(array)*: Lista de Trabajos Prácticos habilitados, pautas, fecha límite y ponderación.
* `invite_code` *(string)*: Código de invitación general para saltar el *Auth Wall* inicial.
* `attendanceRecords` *(map)*: Matriz consolidada de asistencia por clase.

### 3. `grupos`
Un documento por cada uno de los 18 grupos (`g_1` a `g_18`):
* `logo` *(string)*: URL o imagen del escudo/logo elegido por el grupo.
* `lema` *(string)*: Lema o frase de identidad grupal.
* `tps` *(map)*: Entregas grupales con enlaces de videos embebidos (YouTube, TikTok o archivos directos).

### 4. `group_keys`
Colección de control de acceso por grupo:
* Cada documento tiene el ID del grupo (ej. `g_4`).
* Campo `key` *(string)*: La contraseña de acceso grupal (por defecto `gN`, salvo Grupo 17 que es `g_17`).
* Existe una función de *bypass* en el panel docente para restablecer claves si los alumnos las olvidan.

### 5. Colecciones Auxiliares
* **`student_photos`**: Documento por UP con la foto de perfil en base64 o URL para no sobrecargar el documento principal de `students`.
* **`student_profiles`**: Metadatos extendidos del perfil.
* **`video_ratings`**: Calificaciones de estrellas (1 a 5) y votos de los alumnos sobre los videos de TPs de otros grupos.

---

## 🔐 Muro de Acceso (Auth Wall) y Roles

El sitio oficial cuenta con un muro de seguridad inicial que exige autenticación antes de visualizar el panel:

| Rol | Método de Identificación | Permisos |
| :--- | :--- | :--- |
| **Alumno** | UP + contraseña personal (o código general `invite_code`) | Ver su perfil, su XP, sus notas, votar videos de TPs y subir foto. |
| **Grupo** | Clave grupal (`gN`) | Subir entregas de TPs, cambiar logo y lema del grupo. |
| **Docente** | Email y contraseña en Firebase Auth (`cristian.auad@unsta.edu.ar`) | Gestión total: editar notas, cambiar XP, cargar asistencias, borrar claves y configurar TPs. |

---

## 🛡️ Reglas de Seguridad y Resiliencia (`firestore.rules`)

1. **Lectura pública/alumnos**: Los alumnos pueden leer datos de la cátedra y sus propios documentos.
2. **Escritura controlada**: Solo el docente autenticado o funciones explícitas (calificar video, cambiar clave de su grupo) pueden modificar colecciones críticas.
3. **Resiliencia en el Frontend**: `index.html` debe manejar siempre posibles estructuras `undefined` o arreglos vacíos (`sessions || []`) para evitar que el dashboard se cuelgue si una colección no tiene datos en el inicio de cuatrimestre.
