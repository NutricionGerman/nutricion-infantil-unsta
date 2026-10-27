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

> **Estado a las 13:00 (01/10/2026)**: A solicitud de Germán, la rama master de alora-gest fue restablecida exactamente a su estado de las 11:20 (commit d9ad4c8). Todas las modificaciones de la auditoría y exportación modular quedaron archivadas de forma segura en la rama local ackup-auditoria-octubre.

9. **Actualización del Catálogo Nutricional del Taller de Dietas (572 alimentos)**:
   - Se actualizó la base de datos de dieta/alimentos.json y su réplica local PROYECTO_AISLADO/alimentos.json utilizando la base curada de BACKUP_BASE_DATOS_NUTRICIONAL (572 alimentos, 46 columnas).
   - Se optimizó el motor de búsqueda en dieta/index.html con tokenización multitérmino e insensibilidad a tildes/mayúsculas, sincronizando los 16 alias semánticos con la nomenclatura exacta de productos nacionales (Casancrem, Finlandia, manteca, etc.).
   - Se verificó con una suite de estrés de 4 niveles (mantenimiento/stress_test_dieta.py): integridad 46/46 campos, búsqueda difusa (500 queries), cálculo dietético simultáneo de 572 ítems (122.828 kcal) y navegación end-to-end con Microsoft Edge headless sin errores JS.

10. **Módulo de Torneo Gamificado y Duelo Antropométrico (`/duelo/`)**:
    - **Aislamiento Estricto (Sandbox)**: El simulador reside en la carpeta `/duelo/` para testeo docente sin alterar la base de datos de producción (`students`) ni tocar `index.html` del portal oficial.
    - **Lectura Segura de Firestore**: Mapea alumnos reales leyendo `data.name`, `data.firstName`, `data.lastName` y parsea el grupo real desde `data.group` (ej. `"g_4"` -> 4). Extrae fotos desde `student_photos` y `student_profiles`.
    - **Algoritmo de Matchmaking Anti-Colisión**: Ordena por grupos con mayor cantidad de sobrevivientes y garantiza matemáticamente 0 cruces entre compañeros del mismo grupo escolar.
    - **UX Celular Cero Scroll y Header de 2 Filas**: Pantalla de Arena a `100dvh` exactos con clase `body.in-arena`. Se reestructuró la cabecera en 2 filas: fila superior con píldoras de hito y reloj (`⏱️ 45.0s`), y fila inferior con el título de la consigna a ancho completo (100% width) con `white-space: normal` para evitar truncamiento por elipsis (`...`) en pantallas angostas de teléfonos.
    - **Cartel de Preparación Anti-Trampas (Reloj Pausado)**: Previo a cada pregunta se presenta un cartel central de enfoque (*«¿Estás listo/a?»*) con el reloj de 45.0s en pausa. Se oculta el nombre del hito y toda pista anatómica para evitar que el alumno busque la respuesta antes de iniciar el tiempo.
    - **Consignas Anatómicas Sin Spoilers y Rigor de Cátedra**: Al pulsar *«¡ESTOY LISTO, EMPEZAR!»* el cronómetro arranca de inmediato y se revela el nombre formal sin spoilers orientativos. Se ajustó la nomenclatura para solicitar con exactitud los relieves óseos de referencia: *«2 Puntos de Referencia para Marca Mesobraquial»* (Acromion y Olécranon para proyectar el punto medio al 50%) y *«2 Puntos de Referencia para Cintura OMS»* (10ª costilla y cresta ilíaca).
    - **Flujo de Duelo Asincrónico sin Bucles**: En el torneo cada alumno compite desde su propio móvil. Al culminar el 5º hito del día, se elimina la transición de "entrega el dispositivo a tu compañero" y se avanza directamente al podio con el benchmark de puntuación del rival, evitando que se reinicien las 5 preguntas.
    - **Higiene Total de Modales y Versionado Anti-Caché**: Al entrar a la página (`initDuelApp`) y al pulsar *«🏆 Volver al Cuadro del Torneo»* (`switchView('tournament')`), se fuerza `display: none` en todos los `.modal-overlay` y se cancelan los temporizadores. Se agregaron parámetros de versión (`?v=2.3`) en los `<script>` y `<link>` para impedir que la caché del navegador retenga código obsoleto.

11. **Gimnasio Cognitivo de Repaso para el 2° Parcial Teórico (Unidad 6)**:
    - **Ubicación Aislada**: Se desarrolla de forma 100% independiente en `proyectos/repaso_parcial_2/`, sin alterar `index.html` del portal principal ni colecciones de producción de Firestore.
    - **Arquitectura Optimizada en 3 Secciones Claras (Nombres Cortos y Móvil-Friendly)**:
      * *Sección 1 — Tarjetas (Repetición Espaciada)*: Interfaz pulida y limpia sin mención comercial de marcas externas. Flujo de mazo barajado con cola dinámica (`studyQueue`) y 3 contadores en tiempo real: *Nuevas* (azul), *Por Repasar* (ámbar) y *Dominadas* (verde). Las tarjetas falladas («Repetir») se reinsertan a 2 posiciones para afianzarlas rápidamente; «Dudé» se reinserta a 4-5 posiciones (+3 XP); y «¡Dominada!» se retira de la cola activa (+10 XP).
      * *Sección 2 — Examen Oral (Active Recall)*: Estructura de 3 Unidades Temáticas con 2 Niveles/Parciales por unidad (total 6 parciales de 10 preguntas orales cada uno). Boletín interactivo con promedio ponderado general, cero spoilers durante el examen, y reporte final con:
        - Nota individual y promedio consolidado.
        - **Visualización de la Transcripción de Voz**: El estudiante puede leer textualmente lo que el reconocedor de voz captó de su respuesta.
        - **Ocultamiento de Solución Oficial**: Por directiva docente de Germán, no se revela el criterio o solución oficial redactada de la cátedra para mantener la integridad pedagógica de las evaluaciones; solo se despliega la transcripción, aciertos y observaciones.
        - **Reproductor de Audio**: Para escuchar su grabación original.
        - **Devolución Docente**: Aciertos específicos y puntos a reforzar.
      * *Sección 3 — Ranking (En Vivo con Podio Olímpico y Fotos)*: Visualización en tiempo real del progreso de todos los estudiantes conectado a Firestore (`students` y `student_photos`). Podio olímpico con oro, plata y bronce, resalte especial para el estudiante logueado («TÚ»), filtros por promedio de examen oral vs XP global, y distintivo de corona para quienes alcancen el Cuadro de Honor ($\ge 9.0$).
    - **Criterio Estricto en Deporte**: Queda terminantemente excluido cualquier requisito de 1.2 a 1.5 g/kg de proteína en deportistas por orden de Germán (alineación con la RDA oficial del IOM). Foco en hidratos (5-8 g/kg), grasas (25-30%), protocolo de hidratación (150% del peso perdido, agua vs isotónicas), anemia por impacto y Tríada de la Mujer Atleta.
    - **Motor de Inteligencia Artificial Dual (Groq + Gemini)**:
      * Evaluación en ~1.5 segundos mediante LPU de Groq (`openai/gpt-oss-120b` / Llama-3) en formato JSON estricto (`temperature: 0.2`, `max_tokens: 3000`). Respaldo heurístico y de Google AI Studio (Gemini 1.5 Flash).
      * Corrección docente rigurosa sobre los 10 audios: nota final sobre 10, devolución cualitativa general y desglose detallado pregunta por pregunta.
    - **Distintivo de Honor (Nota ≥ 9) & Hoja de Ruta Fase 2**:
      * Si la nota es $\ge 9.0$, se activa el banner holográfico de honor en el reporte y se emite constancia imprimible para PDF.
      * *Fase 2*: Conexión directa con Firestore `students/<up>.honorDistinction` asignando el estilo zafiro (`honor-frame-sapphire`) y medalla de mérito en el ranking de la cátedra.
    - **Seguridad de Credenciales**: Claves API almacenadas en `js/config.js` e ignoradas de forma estricta en `.gitignore` para prevenir revocaciones automáticas en GitHub.

12. **Cadena de Fallback de IA Silenciosa y Sistema de Honor Exclusivo (Promedio ≥ 9.0)**:
    - **Cascada de 3 Motores de IA de Alta Gama**:
      * *1° Titular*: **Gemini** (`gemini-3.5-flash`). Máxima calidad pedagógica y comprensión de voz argentina/pediátrica.
      * *2° Suplente*: **DeepSeek** (`deepseek-v4.1-flash:free` vía Token Harbor `tokenharbor.ai`). Se activa ante cualquier fallo o saturación de Gemini; destaca por su rigor técnico minucioso en pautas de consultorio.
      * *3° Emergencia*: **Groq** (`openai/gpt-oss-120b`). Inmediatez ultra-rápida ante saturación de los dos anteriores.
      * *4° Fallback local*: Heurístico docente por coincidencia de palabras clave.
    - **Discreción Docente Absoluta**: Cero mención de nombres de modelos en la interfaz visual. Se presenta formalmente como «Devolución Docente de la Cátedra de Nutrición Infantil».
    - **Exclusividad Estricta de Medalla y Banner (Únicamente Promedio $\ge 9.0$)**:
      * Para calificaciones de 7 u 8 no se otorga ningún banner ni medalla (solo calificación regular de aprobación).
      * *👑 Medalla de Oro Laureada & Banner Imperial*: Desbloqueados exclusivamente para promedios $\ge 9.0$ en los 6 parciales (+10 XP en Firestore y marco zafiro de honor en el ranking oficial).
    - **Integración con la Plataforma Oficial (`index.html`)**:
      * *Auto-login*: Cartel emergente en el portal al iniciar sesión que redirige con `?up=...&name=...`, precargando datos sin reingreso de nombre/legajo.
      * *Visibilidad Pública de Notas*: Tarjeta del 2° Parcial en el perfil del alumno (`displayStudentPortalView`), accesible tanto para el alumno como para compañeros que visiten su perfil.
      * *Visor de Respuestas*: Modal interactivo que consulta `oral_submissions` y despliega las 10 preguntas con la **transcripción de voz del alumno**, los aciertos y las observaciones del docente, omitiendo intencionalmente la solución oficial de la cátedra por orden docente.
13. **Blindaje de Suplementación en el Niño y Adolescente Deportista (Unidad 7)**:
    - Se integró la tarjeta `u7_23` en `proyectos/repaso_parcial_2/js/data_flashcards.js` en el mazo `u7_p2` para cubrir con rigor el tema oficial del 2° Parcial (Tema 2, Pregunta 4).
    - Alineación estricta con el Comité de Nutrición de la AEP (2014):
      * Principio *Food First*: los suplementos proteicos y ergogénicos no están indicados en menores.
      * Creatina y aminoácidos (BCAA, glutamina, carnitina): formalmente desaconsejados por falta de seguridad y riesgo metabólico.
      * Indicación exclusiva ante deficiencias de micronutrientes comprobadas (hierro, vitamina D, calcio) o bebidas isotónicas en esfuerzos >1 hora.
    - Se actualizaron los selectores en `index.html` (67 tarjetas totales / 23 en Unidad 7) y se incrementó el versionado anti-caché a `?v=2.6`.

14. **Resolución de Conflicto de Credenciales Git (Cuenta NutricionGerman vs Gmtfp)**:
    - La máquina local posee GitHub CLI (`gh.exe`) configurado globalmente en `~/.gitconfig` con el usuario `Gmtfp`, lo que provocaba errores HTTP 403 al intentar hacer push a `NutricionGerman/nutricion-infantil-unsta.git`.
    - Solución arquitectónica persistente: en `.git/config` local del repositorio se configuró:
      ```ini
      [credential "https://github.com"]
          helper =
          helper = manager
          username = NutricionGerman
      ```
      Esto vacía la lista heredada de helpers para `github.com` en este repositorio específico y fuerza el uso directo de Git Credential Manager con la cuenta de `NutricionGerman`.

15. **Apertura de la Tienda Online: Canje de Puntos para el 2° Parcial Práctico**:
    - **Requerimiento Docente**: Habilitar en la Tienda Oficial la compra de puntos bonificables para el 2° Parcial Práctico canjeables con XP de cátedra.
    - **Tabla Oficial de Canje**:
      * 1 punto práctico = 10 XP
      * 2 puntos prácticos = 15 XP
      * 3 puntos prácticos = 20 XP
      * 4 puntos prácticos = 25 XP
      * 5 puntos prácticos = 30 XP
    - **Regla Innegociable de Validación Pedagógica**:
      * El alumno debe tener **aprobado el 2° Parcial Teórico con nota $\ge 7$** (`nota >= 7.0`).
      * Se evalúa `parcial2`, `parcial2_teoria` o el promedio de exámenes orales en `oralExams`.
      * Si la nota es inferior a 7 o el alumno aún no rindió el parcial teórico, la compra se bloquea inmediatamente y se dispara una alerta que informa la restricción.
    - **Impacto y Persistencia**:
      * Los ítems fueron actualizados en la colección `app_state/tienda_items` de Firestore eliminando la fecha de expiración pasada.
      * Se crearon 5 distintivos vectoriales SVG optimizados en `tienda/badges/`.
      * Se actualizó `tienda.js` con validación previa de nota teórica, banner dinámico informativo de estado (habilitado vs condicionado) y deducción segura de XP.
      * Se agregó la tarjeta de acreditación de bonificación práctica en el perfil del alumno en `index.html` (indicando los puntos canjeados en verde esmeralda).

