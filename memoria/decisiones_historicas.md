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
   - El análisis del huevo se encapsula en la sección práctica como un **Caso de Estudio Clínico y Forense Regulatorio** (*«El Expediente del Huevo»*).
   - **Formato de la Teoría**: Se organiza en un **visor interactivo de diapositivas (slide deck)** de 17 slides en lugar de un scroll vertical continuo largo. Cada slide aborda una unidad conceptual específica, con navegación por píldoras de módulo, teclado (flechas), swipe y botones anterior/siguiente. Las tablas clínicas (B12), consensos y bibliografía se presentan en formato de **filas compactas y sobrias con acciones a la par**, evitando cajas o badges sobredimensionados.

6. **Integración Condicional de Herramientas Docentes en Herramientas (`index.html`)**:
   - Se incorpora la sección `#seccion-docente-herramientas` al inicio de la pestaña "Herramientas" con estilo dorado (`Espacio Exclusivo Docente`).
   - **Aislamiento Estricto**: Tiene `display: none` por defecto en el HTML estático. Los alumnos nunca la ven.
   - **Desbloqueo**: Se activa automáticamente cuando el docente inicia sesión (Firebase Auth o Auth Wall), o mediante un doble clic discreto en el logo inferior de UNSTA de esa pestaña introduciendo la clave de cátedra (`nutri2026`, `unsta`, `docente`).

7. **Arquitectura de Reportes de ValoraGest (`valora-gest`)**:
   - **Doble Modalidad de Reportes**:
     a) *Informe Clínico Integral* (académico/médico): Filiación completa, Antropometría con curvas de Calvo et al. (2009) y metas IOM (2009), Valoración Clínica (PA y deficiencias), Laboratorio Bioquímico completo, Evaluación Dietética R24H con adecuación sintética y micronutrientes, Diagnóstico PES y Prescripción.
     b) *Plan y Pautas para la Gestante* (educativo para la paciente): Lenguaje amigable, metas de peso saludable, esquema diario de comidas (menú modelo), recomendaciones de suplementación, pautas para síntomas digestivos y seguridad alimentaria.
   - **Corrección de Bugs y Consistencia**:
     - En `Antropometria.jsx` se persiste `currentWeight`, `currentWeek` y `currentBmi` en la raíz para evitar lecturas vacías.
     - En `Dashboard.jsx` se corrigió la ruta de acceso de `/clinica` a `/anamnesis`.
     - En `IntervencionNutricional.jsx` se agregó el formulario completo de Prescripción y Plan de Alimentación con autocompletado inteligente de metas IOM/EFSA.
   - **Generación de PDF**: Soporte dual con impresión nativa `@media print` (`window.print()`) de calidad vectorial sin cortes en renglones, y descarga directa mediante `html2canvas` + `jsPDF`.


8. **Exportación Modular e Impresión por Secciones en ValoraGest**:
   - En Reportes.jsx se introdujo un selector modular con **Presets Rápidos**:
     * 📑 Todo el Informe Completo: Proceso de Atención Nutricional integral.
     * 📏 Solo Antropometría (Calvo/IOM): Aísla tabla de controles, IMC pre/actual, ganancia neta acumulada y canal de Calvo et al.
     * 🍎 Solo Registro Dietético (R24H): Aísla macros (% VCT), tabla de micronutrientes vs RDA con semáforo y detalle de alimentos.
     * 🍽️ Solo Plan de Alimentación y Menú: Aísla prescripción VCT, fórmula sintética, menú de 5 comidas y suplementación.
     * 🩺 Solo Clínica y Laboratorio: Aísla examen físico, PA clasificada y parámetros bioquímicos.
     * ⚙️ Personalizado a Medida: Permite combinar checkboxes independientes manteniendo siempre membrete, filiación y firma profesional.
   - Cada vista modular actualiza dinámicamente el título del reporte (ej. «INFORME DE VALORACIÓN ANTROPOMÉTRICA GESTACIONAL (CALVO / IOM)») y su subtítulo de módulo A4.
