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
    - **Regla Innegociable de Validación Pedagógica y Flujo Amigable**:
      * Los productos se presentan de manera abierta y atractiva en la Tienda sin candados de bloqueo previo ni carteles prohibitivos.
      * Cuando el estudiante presiona "Canjear", el sistema valida en tiempo real si tiene aprobado el **Examen Oral con nota $\ge 7.0$**.
      * Si aún no lo rindió o tiene nota $< 7$, se dispara el cartel modal indicándole que debe aprobar el examen oral, mostrando su nota actual e incorporando el botón de acción directa **«🎙️ Ir a Rendir Examen Oral Ahora»**.
      * Al pulsar el botón de rendir, la aplicación navega directamente a la pestaña de Examen Oral (`proyectos/repaso_parcial_2/index.html?tab=evaluacion&up=...&name=...`) mostrando de inmediato el tablero de los 6 parciales con grabación de voz por IA.
    - **Horario de Cierre y Verificación Docente**:
      * **Cierre Automático**: Configurado para hoy **27 de octubre de 2026 a las 23:59:59 (11:59 PM)** (`expiresAt: 2026-10-27T23:59:59-03:00`). Al expirar, los ítems se ocultan automáticamente en la tienda y cualquier intento de compra queda rechazado.
      * **Panel Docente & Descarga de Lista**: En `index.html` (Pestaña "Panel Docente" -> "Gestión Tienda XP") se incorporó una **Tabla en Vivo de Bonificaciones** y el botón **«Descargar Planilla 2° Parcial Práctico (CSV / Excel)»** que exporta Legajo, Alumno, Grupo, Puntos Bonificados (+1 a +5), Nota Teórica/Oral, Fecha y Saldo XP.
      * **Script de Consulta Inmediata**: Archivo `verificar_compras_parcial2.js` para auditoría instantánea desde la consola.
    - **Impacto y Persistencia**:
      * Los ítems fueron actualizados en la colección `app_state/tienda_items` de Firestore con la fecha de expiración límite fijada para hoy a las 23:59:59.
      * Se crearon 5 distintivos vectoriales SVG optimizados en `tienda/badges/`.
      * Se actualizó `tienda.js` y `proyectos/repaso_parcial_2/js/app.js` con soporte para el parámetro `tab=evaluacion`.
      * Se agregó la tarjeta de acreditación de bonificación práctica en el perfil del alumno en `index.html` (v=1.35).

16. **Integración del Motor de Transcripción de Voz Whisper Large v3 (OpenAI / Groq)**:
    - **Diagnóstico del Problema**: La API nativa del navegador (`webkitSpeechRecognition`) presentaba desconexiones prematuras, incompatibilidad en navegadores móviles (iOS/Safari/Firefox) y deformación grave de terminología médica y pediátrica (ej: anorexia fisiológica, rebote adiposo, CAPA 2, fitatos, B12).
    - **Solución Arquitectónica con Whisper**:
      * Se integró el modelo de código abierto líder mundial de GitHub: **Whisper de OpenAI** (`whisper-large-v3-turbo` vía hardware LPU de Groq).
      * Al detener la grabación, el `audioBlob` capturado por `MediaRecorder` se envía directamente a la API de Whisper, devolviendo la transcripción precisa en menos de 0.8 segundos.
      * Se inyectó un `prompt` especializado con la nomenclatura técnica de Nutrición Infantil UNSTA para garantizar reconocimiento fonético exacto.
      * Se añadió la interfaz de corrección interactiva: el estudiante puede visualizar el texto transcribido por Whisper y presionar **«Corregir texto»** para editar cualquier detalle antes de que sea evaluado por el modelo calificador.
      * Se actualizó el versionado de caché a `v=3.0` en `proyectos/repaso_parcial_2/index.html`.


17. **Corrección Quirúrgica de Palabra Única Anti-Trampas y Solución del Tartamudeo en Examen Oral**:
    - **Diagnóstico del Tartamudeo ('se se se diferencian...')**:
      * En Web Speech API con `continuous: true`, los navegadores basados en Chromium (Chrome/Edge en Windows) acumulan los resultados de la sesión en el arreglo global `event.results`.
      * Al iterar desde `event.resultIndex` y concatenar con operador acumulativo (`+=`) sobre una variable global, cada fragmento intermedio se volvía a agregar sobre el anterior, provocando una avalancha de repeticiones continuas.
      * **Solución**: Se reconstruye el buffer linealmente de 0 a `results.length - 1` en cada evento para el preview en vivo, y se procesa el audio definitivo directamente a través de **Whisper Large v3 Turbo (OpenAI)**.
    - **Regla de Seguridad Anti-Trampas Innegociable para Examen Oral**:
      * Permitir un `<textarea>` de edición libre abría una vulnerabilidad crítica: los estudiantes podían abrir ChatGPT o apuntes, copiar la respuesta completa y pegarla sin haber hablado.
      * Se eliminó totalmente el cuadro de texto libre y se reemplazó por un sistema interactivo de **fichas de palabras (chips)**.
      * El alumno puede hacer clic exclusivamente sobre una palabra específica mal captada.
      * Se abre un modal de SweetAlert2 con restricciones de seguridad de nivel académico:
        1. **Anti-Paste**: Evento `paste` cancelado (`e.preventDefault()`) con advertencia de trampa.
        2. **Anti-Space**: Barra espaciadora bloqueada para impedir oraciones o párrafos.
        3. **Validación Token Único**: No se aceptan espacios en blanco ni cadenas vacías.
        4. **Límite Estricto**: Máximo **3 correcciones de palabras** por cada una de las 10 preguntas.
      * Versionado de scripts elevado a `v=3.1` en `proyectos/repaso_parcial_2/index.html`.

18. **Neutralización de Marcas de IA y Corrección de Metadatos de Duración WebM**:
    - **Neutralización de UI**: Se removieron todas las leyendas visibles de "Whisper AI (OpenAI)" o referencias de proveedores de IA para los alumnos, reemplazándolas por nomenclaturas institucionales y pedagógicas neutras ("Transcripción Oficial de tu Voz", "Procesando transcripción...").
    - **Diagnóstico del Fallo de Duración en Chrome (Audio de 5s marcando 7m 28s)**:
      * `MediaRecorder` en Chromium graba audio en contenedor WebM en modo streaming y no escribe el elemento `Duration` en el encabezado EBML del archivo.
      * El elemento nativo `<audio controls>` de Chrome, al no encontrar la duración, intenta extrapolar la longitud basada en una tasa de bits errónea, produciendo duraciones ficticias (ej. 7 minutos 28 segundos).
      * **Solución Integral**:
        1. Se incorporó `fix-webm-duration.js` localmente para inyectar los milisegundos reales medidos con precisión (`Date.now() - startTime`) directamente en el binario del blob WebM antes de crear su URL.
        2. Se añadió un manejador de seguridad en el evento `loadedmetadata` del `<audio>` para corregir `currentTime` si Chromium reportara `Infinity` o duraciones desproporcionadas.
        3. Se añadieron etiquetas visuales formateadas (`00:05`, etc.) tanto en la mesa de examen como en la pantalla de revisión de las 10 preguntas.
      * Versionado elevado a `v=3.2` en `proyectos/repaso_parcial_2/index.html`.

19. **Correcciones Ilimitadas y Grabación Limpia (Sin Transcripción en Vivo)**:
    - **Correcciones Quirúrgicas Ilimitadas**: Se eliminó el tope artificial de 3 correcciones por respuesta. Los alumnos pueden corregir todas las palabras individuales que hayan sido mal captadas por el micrófono, manteniendo intactas las barreras anti-copia (1 sola palabra, barra espaciadora desactivada, pegado bloqueado).
    - **Grabación Limpia**: Durante la grabación activa, la caja de transcripción se mantiene oculta para evitar distracciones o parpadeos en pantalla. Una vez presionado "Detener y Guardar Audio", se procesa y se despliega la transcripción completa de una sola vez.
    - Versionado actualizado a `v=3.3` en `proyectos/repaso_parcial_2/index.html`.

20. **Calibración de Rúbrica y Corrección del Sesgo de Timidez del Evaluador IA**:
    - **Diagnóstico del Fallo de Calificación (9 en vez de 10 sin observaciones)**:
      * Los modelos de lenguaje presentan por defecto un sesgo de "aversión a notas extremas" (*regression to the mean*), mostrándose reacios a otorgar el 10 perfecto incluso cuando la respuesta cubre el 100% de los puntos clave.
      * Además, la presencia obligatoria de un campo "improvements" inducía al modelo a restar 1 punto artificialmente para justificar que no era un 10.
    - **Solución Pedagógica y Técnica en Dos Capas**:
      1. **Rúbrica Estricta en el Prompt**: Se instruyó que en un examen oral la concisión y precisión directa son virtudes docentes. Si el alumno cubre los `keyPointsRequired` sin errores y no hay omisiones que señalar, **LA NOTA ES 10 OBLIGATORIAMENTE**.
      2. **Post-Procesador Determinista en Código (`cleanAndParseJSON`)**: Si la IA devolviese un 9 pero el campo de mejoras indica "ninguna", "sin observaciones", "completa y precisa", etc., el código eleva automáticamente la calificación a 10 y recalcula el promedio exacto del examen.
    - Versionado elevado a `v=3.4` en `proyectos/repaso_parcial_2/index.html`.

21. **Cartel de Confirmación y Advertencia al Reintentar Parcial Completado**:
    - Si un estudiante que ya completó un parcial oral presiona "Reintentar Parcial", el sistema despliega un modal SweetAlert2 con su nota actual (ej: 8.5/10 - Aprobado), advirtiéndole que iniciar un nuevo intento generará 10 nuevas preguntas y actualizará su calificación previa.
    - Se ofrecen dos botones: "Sí, Rendir de Nuevo" y "Cancelar (Mantener Nota)".
    - Versionado actualizado a `v=3.5` en `proyectos/repaso_parcial_2/index.html`.

22. **Recuperación Focalizada de Pregunta Individual por 1 XP**:
    - **Mecánica Gamificada y Pedagógica**: En la pantalla de resultados del examen oral (`oralExamResultScreen`), cada una de las 10 preguntas que tenga nota inferior a 10 muestra el botón interactivo **"Recuperar pregunta (1 XP)"**.
    - **Flujo de Ejecución**:
      1. Se valida que el estudiante tenga al menos 1 XP disponible (tanto en memoria local como en Firestore `students/${up}`).
      2. Se abre un modal de grabación donde puede volver a escuchar la consigna y grabar nuevamente solo esa respuesta de voz.
      3. Se procesa con Whisper y se le permite corrección quirúrgica de palabras.
      4. La IA evalúa exclusivamente esa pregunta con la rúbrica oficial de cátedra.
      5. **Garantía de Mejor Nota (*Best Score*)**: La nota de la pregunta solo se actualiza si el nuevo resultado supera al anterior (`Math.max(oldGrade, newGrade)`), protegiendo al alumno de perder puntos.
      6. Se deduce 1 XP del perfil del estudiante y se sincroniza en Firestore.
      7. Se recalcula automáticamente el promedio del parcial, el estatus de Cuadro de Honor ($\ge 9.0$) y se actualiza la planilla y base de datos.
    - Versionado elevado a `v=3.6` en `proyectos/repaso_parcial_2/index.html`.

23. **Sistema de Bonificación de XP por Módulos y Cuadro de Honor**:
    - **Recompensas por Módulo Individual (6 parciales)**:
      * **Nota $\ge 9.0$**: Otorga **+2 XP**.
      * **Nota $\ge 8.0$ y $< 9.0$**: Otorga **+1 XP**.
      * **Nota $< 8.0$**: 0 XP (se aprueba con 7.0 pero sin bono de XP).
      * **Control Anti-Exploit de Deltas**: Se lleva el registro de XP otorgado previamente por módulo (`partialXpAwarded[partialKey]`). Si un estudiante que tenía 8 (+1 XP) mejora a 9 (+2 XP), solo se le acredita la diferencia (+1 XP), impidiendo farmear XP en bucles de reintentos.
    - **Bonificación de Cierre de Cátedra (Cuadro de Honor)**:
      * Al completar los 6 parciales con **promedio general $\ge 9.0$**, se acreditan automáticamente los **+10 XP** del Cuadro de Honor junto a la Medalla de Oro.
      * Se otorga una única vez mediante control de bandera (`honorBonusAwarded: true`).
    - **Sincronización Total con Firestore**: Los puntos acreditados se suman atómicamente a `students/${up}.xp` vía `FieldValue.increment()`.
    - Versionado actualizado a `v=3.7` en `proyectos/repaso_parcial_2/index.html`.
