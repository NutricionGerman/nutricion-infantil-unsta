# 📜 Bitácora de Decisiones Arquitectónicas

Registro breve de decisiones técnicas del sistema para evitar romper configuraciones en sesiones futuras.

---

1. **Clave de acceso del Grupo 17**:
   - Tiene asignada la clave manual `g_17` en la colección `group_keys` (no cambiarla a `g17`).
   - El sistema busca grupos tanto por ID numérico (`"4"`) como con prefijo (`"g_4"`).

2. **Colección `students` en Firestore**:
   - Cada alumno tiene como clave de documento su número de **UP (DNI)**.
   - Se migró a su propia colección para evitar saturar el tamaño máximo de `app_state/main`.

3. **Notificación de nueva versión**:
   - Al modificar el portal central (`index.html`), se actualiza la fecha en `version.json` para que los alumnos reciban el banner de actualización en sus teléfonos.

4. **Estructura modular y autocontenida de clases (`clases/`)**:
   - Cada clase reside en su propia subcarpeta dedicada (`clase_01_antropometria_19_08/`, `clase_02_antropometria_26_08/`, `clase_03_vegetarianismo/`, etc.) con sus propios archivos, imágenes (`img/`), videos (`videos/`), herramientas y PDFs.
   - Cada clase incluye una subcarpeta `asistencia/` donde vive el formulario interactivo de toma de lista / registro de ese día, manteniendo separados y claros el material didáctico de la toma de asistencia.
   - En la raíz de cada clase y en la raíz de `clases/` se conservan archivos HTML de redirección rápida para mantener compatibilidad absoluta con tarjetas o marcadores previos sin que nada se rompa.

5. **Estructura Pedagógica de la Clase 3 (Vegetarianismo y Sustitución Proteica)**:
   - El eje temático central de la clase es el **Vegetarianismo en Pediatría y Población General** y la **Triangulación de la Evidencia** (reemplazo isocalórico de proteína animal por vegetal, combinando RCTs, Aleatorización Mendeliana y Cohortes Prospectivas).
   - El análisis del huevo se encapsula como un **Caso de Estudio Clínico y Forense Regulatorio** (*«El Expediente del Huevo»* en el Eje 4) para evitar que monopolice la clase y asegurar que los consensos oficiales pediátricos (SAP, AAP, AEP) y globales (OMS, AND, MinSal, SAN) ocupen el primer plano institucional.
