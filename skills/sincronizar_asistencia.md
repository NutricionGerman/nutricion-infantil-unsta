# 📋 Skill: Sincronización de Asistencias a Firestore

> **Objetivo**: Procesar listas de asistencia físicas en formato `.txt`, emparejar alumnos con su número de UP, otorgar +2 XP y registrar la sesión en Firebase Firestore de forma atómica y sin errores.

---

## 🛑 Regla de Oro Previa
**NUNCA inventes o asumas la identidad de un alumno.** Si un nombre en el `.txt` tiene errores tipográficos, solo contiene un nombre de pila o no coincide con la base de datos de Firestore, detén el proceso y **solicita confirmación a Germán** antes de guardar datos.

---

## 📂 Fuentes de Datos

* **Ubicación de archivos de texto**: Carpeta `asistencias/` en la raíz del proyecto.
  * Ejemplos: `asistencia 19-08 Evaluacion Antropometrica.txt`, `asistencia 10-09.txt`, etc.
* **Colección de destino en Firestore**:
  * Colección `students`: Actualizar `xp` (+2 XP) y el mapa/array `attendance` del alumno.
  * Documento `app_state/main`: Agregar la clase a la lista `sessions` y registrar los presentes en `attendanceRecords`.

---

## 🔄 Protocolo Paso a Paso

### Paso 1: Lectura y Normalización del Archivo `.txt`
1. Abrir el archivo `.txt` correspondiente a la fecha.
2. Limpiar caracteres especiales, tabulaciones y espacios dobles.
3. Extraer la lista de nombres y apellidos de los alumnos presentes.
4. Identificar la fecha de la clase y el tema específico (ej. "Evaluación Antropométrica").

### Paso 2: Validación contra la Base de Datos (`students`)
1. Consultar la colección `students` en Firestore.
2. Para cada alumno de la lista:
   * Buscar coincidencia exacta o por coincidencia fonética clara (Apellido + Nombre).
   * Obtener su **UP (DNI)** y su valor de **XP actual**.
3. **Manejo de Discrepancias**:
   * Si un alumno no se encuentra o hay ambigüedad (ej. dos alumnos con mismo apellido):
   * Generar una tabla de discrepancias y mostrársela a Germán:
     ```markdown
     ⚠️ Alumnos sin coincidencia exacta en asistencia del DD/MM:
     - "Juan Pérez" → ¿Corresponde a UP 12345 (PÉREZ, Juan Manuel)?
     ```
   * Esperar respuesta antes de impactar en la base de datos.

### Paso 3: Impacto Atómico en Firestore
1. Utilizar siempre operaciones por lote (`db.batch()`) para garantizar que la escritura sea atómica (o se guardan todos o no se guarda ninguno).
2. Para cada alumno presente confirmado:
   * Sumar **+2 XP** a su campo `xp`.
   * Evaluar si el nuevo puntaje de XP lo hace subir de **Rango** (consultar lista de 23 rangos en `contexto/catedra_unsta.md`). Si sube de rango, actualizar el campo `rango`.
   * Agregar el ID de la sesión a su historial de asistencia con estado `"presente"`.
3. Actualizar `app_state/main`:
   * Agregar la sesión al arreglo `sessions`: `{ id: "sesion_DD_MM", fecha: "AAAA-MM-DD", titulo: "Tema de la clase", totalPresentes: N }`.
   * Registrar la matriz en `attendanceRecords`.

### Paso 4: Notificación y Commit
1. Presentar a Germán el resumen final:
   * Total de presentes procesados.
   * Alumnos que subieron de rango.
2. Realizar el commit estandarizado:
   ```bash
   git add asistencias/
   git commit -m "Feat: Sincronización de asistencia clase DD-MM (+2 XP y actualización de rangos)"
   ```
