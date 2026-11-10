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

24. **Criterio Estricto de Canje en Tienda: 6 Exámenes Orales Completados con Promedio $\ge 7.0$**:
    - **Diagnóstico y Corrección de Regla**: Anteriormente la tienda validaba únicamente que la nota teórica existente fuese $\ge 7.0$ (`notaTeorica >= 7`), lo que permitía que un alumno que solo hubiera rendido 1 parcial con nota 8 pudiera comprar puntos prácticos sin haber completado los otros 5 módulos.
    - **Regla Innegociable Cátedra UNSTA**:
      * Para poder canjear puntos bonificables para el 2° Parcial Práctico (de +1 a +5 puntos), el alumno debe tener **completados los 6 exámenes orales** (`completedCount === 6`) Y el **promedio general entre los 6 debe ser $\ge 7.0$**.
      * El beneficio de Cuadro de Honor (+10 XP y Medalla de Oro) sigue siendo con promedio $\ge 9.0$.
    - **Implementación en la Tienda (`tienda.js`)**:
      * Función `getStudentOralExamStatus(studentData)`: evalúa exhaustivamente `oralExams` en Firestore (`completedCount`, `average`, y los 6 parciales `u5_p1` a `u7_p2`).
      * Banner Informativo en vivo en la Tienda: Muestra el estado del alumno (`Oral Aprobado (6/6 · Promedio X.X)` o `Requiere 6/6 Orales (Llevas X/6 · Prom: Y.Y)`).
      * Modal de Bloqueo Explicativo: Si el alumno intenta comprar sin cumplir ambas condiciones, el modal detalla cuántos parciales le faltan (`X de 6 completados, faltan Y`) o su promedio actual, con botón directo a rendir los módulos orales.
      * Actualización en el Panel Docente y exportación CSV de canjes indicando promedio y cantidad de parciales rendidos.
      * Versionado de caché elevado a `tienda.js?v=1.36` en `index.html`.

25. **Escala de Calificación Progresiva para Puntos Prácticos (+3: $\ge 7.5$, +4: $\ge 8.0$, +5: $\ge 8.5$)**:
    - **Criterio Docente Escalonado de Cátedra**:
      * **+1 y +2 Puntos Prácticos**: 6 exámenes orales completados con **Promedio $\ge 7.0$** (10 XP y 15 XP).
      * **+3 Puntos Prácticos**: 6 exámenes orales completados con **Promedio $\ge 7.5$** (20 XP).
      * **+4 Puntos Prácticos**: 6 exámenes orales completados con **Promedio $\ge 8.0$** (25 XP).
      * **+5 Puntos Prácticos**: 6 exámenes orales completados con **Promedio $\ge 8.5$** (30 XP).
    - **Adaptación en la Interfaz de la Tienda (`tienda.js`)**:
      * Función helper `getRequiredOralGradeForPoints(pts)`.
      * En cada tarjeta de la tienda, se despliega la insignia interactiva oficial solicitada por el docente: `Requiere Nota ≥ X.X` o `Habilitado (Nota ≥ X.X)` con checkmark verde según el promedio y estado del estudiante.
      * Se actualizaron las descripciones oficiales tanto en Firestore (`app_state/tienda_items`) como dinámicamente en código para reflejar la nota exacta de cada beneficio (+3: nota $\ge 7.5$, +4: nota $\ge 8$, +5: nota $\ge 8.5$).
      * El banner panorámico detalla la escala completa de notas mínimas.
      * Modal SweetAlert2 específico: Si una alumna no alcanza la nota de corte de un tier (ej. tiene 7.2 e intenta comprar +3 puntos), se le informa su promedio, la nota requerida, los puntos faltantes y se le invita a recuperar preguntas por 1 XP o re-rendir parciales con botón directo.
      * Panel Docente: La tabla de bonificaciones muestra el mínimo requerido (`Mín: X.X`) y colorea en verde (#34d399) solo a quienes cumplen la calificación del tier que adquirieron.
      * Versionado de caché elevado a `tienda.js?v=1.38` en `index.html`.

26. **Reparación y Acreditación Retroactiva de Recompensas de XP por Nota en Exámenes Orales**:
    - **Diagnóstico del Fallo de Acreditación**:
      * En `proyectos/repaso_parcial_2/js/storage.js`, el método `recordPartialGrade` no retornaba el objeto con `totalXpGained`, sino `this.getOverallAverage()`.
      * Debido a esto, en `app.js` la condición `result.xpAwardedReport.totalXpGained > 0` evaluaba como falso/indefinido y la llamada `FieldValue.increment(...)` a Firestore nunca se ejecutaba.
    - **Solución y Regla de Recompensas Aplicada**:
      * Nota $\ge 9.0$: Otorga **+2 XP**.
      * Nota $\ge 8.5$: Otorga **+1 XP** (soporta $\ge 8.0$ si el docente lo confirma).
      * Promedio final $\ge 9.0$ en los 6 parciales: **+10 XP** (Cuadro de Honor).
      * Se implementó el control de deltas en `storage.js` para evitar duplicación al re-rendir o recuperar preguntas.
      * Se conectó `syncExamToFirestore` para guardar `oralExams.partialXpAwarded.${partialKey}` en Firestore.
      * Se actualizó la versión de scripts a `v=3.8` en `proyectos/repaso_parcial_2/index.html`.
    - **Acreditación Retroactiva en Firestore**:
      * Juan Martín Paz (UP 344022, U5P1: 9.0) $\rightarrow$ +2 XP (saldo de 21 a 23 XP).
      * Antonella Ávila Lucena (UP 343269, U5P2: 8.7) $\rightarrow$ +1 XP (saldo de 37 a 38 XP).
      * Santiago Jesús Vázquez (UP 343815, U5P1: 8.7, U5P2: 8.9) $\rightarrow$ +2 XP (saldo de 32 a 34 XP).
      * Luca Delani (UP 344036, U6P1: 8.5) $\rightarrow$ +1 XP (saldo de 39 a 40 XP).

27. **Registro Oficial de Bonificaciones y Débitos en la Tabla de Historial de XP (`xpHistory`)**:
    - **Diagnóstico**: Al acreditar XP en Firestore mediante `FieldValue.increment(...)`, el saldo numérico global aumentaba, pero no se agregaba la fila correspondiente en la tabla del modal "Historial de XP" del perfil del alumno.
    - **Solución en `app.js`**:
      * En `syncExamToFirestore`: Se genera y persiste el objeto en el array `xpHistory` con `timestamp`, `amount`, `reason` (ej. `Examen Oral: Parcial 1 (U5 - Dietas Basadas en Plantas) - Nota 9.0/10`) y `newXP`.
      * En recuperación de pregunta: Se registra el débito con `amount: -1`, `reason` y nuevo total en `xpHistory`.
      * Se insertaron retroactivamente los renglones históricos en Firestore para los 4 alumnos que rindieron hoy.
      * Versionado de caché elevado a `v=3.9` en `proyectos/repaso_parcial_2/index.html`.

28. **Doble Cerrojo de Seguridad Transaccional en Tienda y Concesión al Primer Finalista**:
    - **Caso Luca Delani (UP 344036)**: Completó anticipadamente los 6 exámenes orales con promedio de 7.6 y adquirió el ítem de +5 Puntos Prácticos (30 XP) a las 13:30 hs antes de que se estableciera el piso de $\ge 8.5$. El docente autorizó convalidarle la bonificación de manera excepcional y exclusiva por haber sido el primer alumno en finalizar el circuito completo.
    - **Doble Cerrojo de Seguridad en `tienda.js`**:
      * Para evitar que cualquier otro alumno pueda eludir la validación (incluso si tiene una pestaña antigua abierta con caché o manipula la interfaz), se agregó una verificación obligatoria directamente dentro de la función de confirmación previa a la escritura en Firestore (`db.collection('students').doc(...).update(...)`).
      * En ese instante exacto, el sistema consulta en tiempo real el documento del alumno desde Firestore (`freshDoc`), recalcula los exámenes completados (`freshOral.completedCount === 6`) y evalúa que su promedio cumpla el umbral específico del tier:
        - +1 y +2 Puntos: Promedio $\ge 7.0$
        - +3 Puntos: Promedio $\ge 7.5$
        - +4 Puntos: Promedio $\ge 8.0$
        - +5 Puntos: Promedio $\ge 8.5$
      * Si el alumno no es Luca Delani (`targetUP !== '344036'`) y no cumple estrictamente con ambos requisitos (los 6 exámenes completados y promedio mínimo requerido para el nivel de puntos), la transacción se aborta de inmediato con una alerta modal bloqueante sin tocar sus XP ni su inventario.
      * Versionado anti-caché elevado a `tienda.js?v=1.39` en `index.html`.

29. **Reversión de Compra Temprana para Francisco Fernández Salazar (UP 344037)**:
    - **Diagnóstico**: El alumno había adquirido el ítem de +5 Puntos Prácticos a las 13:02 hs con 30 XP acumulados antes de que se conectaran los requisitos del oral a la tienda, sin tener exámenes orales rendidos (0 de 6 completados).
    - **Resolución Docente**: Revertir la compra para que deba completar los 6 exámenes orales con promedio $\ge 8.5$ antes de poder acceder a la bonificación.
    - **Acción Ejecutada en Firestore**:
      * Reintegro completo de 30 XP (saldo restituido de 7 a 37 XP).
      * Remoción del ítem `item_practico_5pt` de su arreglo de `inventory`.
      * Inserción en `xpHistory` de la transacción de reembolso: `Reintegro de Tienda: +5 Puntos Prácticos (Requiere 6 exámenes orales completados con promedio ≥ 8.5)`.
      * La planilla de bonificaciones del Panel Docente y el script de verificación en vivo confirman únicamente 1 comprador activo: Luca Delani.

30. **Compatibilidad Universal para Examen Oral en iOS Safari (iPhone) y Corrección de Transcripción Whisper**:
    - **Diagnóstico del Caso Gimena Godoy (UP 344025 - Maru)**:
      * Al rendir desde un iPhone (iOS Safari), 4 de las 10 preguntas quedaron como '(Sin respuesta de voz registrada)', el reproductor de audio arrojó '▶ Error' a pesar de haber grabado 24 segundos y la calificación final cayó a 5.1/10.
      * Causa raíz: En iOS Safari `MediaRecorder` graba exclusivamente en contenedor MP4/AAC (`audio/mp4`). El código anterior forzaba el Blob a `type: 'audio/webm;codecs=opus'` y enviaba el archivo como `respuesta_oral.webm` a Groq Whisper. Esto provocaba que el reproductor nativo de Safari fallara (`▶ Error`) y que la API de Whisper rechazara el archivo por inconsistencia de contenedor. Al fallar Whisper y desconectarse `webkitSpeechRecognition` en Safari, la transcripción quedaba vacía y la IA calificaba con 3/10 por omisión.
    - **Solución Arquitectónica Implementada**:
      * Negociación dinámica de códecs en `audio_recorder.js`: detección automática con `MediaRecorder.isTypeSupported` priorizando `audio/mp4` en iOS y `audio/webm` en Android/Chrome.
      * Creación del Blob con el MIME nativo real del navegador y mapeo dinámico de la extensión enviada a Groq Whisper (`respuesta_oral.m4a`, `.aac`, `.webm`).
      * Grabación en fragmentos continuos cada 1000ms (`mediaRecorder.start(1000)`) para impedir que WebKit descarte fragmentos al invocar `.stop()`.
      * Alertas preventivas en `app.js`: advertencia explícita si se grabó audio pero no se detectó texto antes de avanzar, e indicador con triángulo amarillo en las píldoras de navegación.
      * Versionado anti-caché elevado a `v=4.0` en `proyectos/repaso_parcial_2/index.html`.
      * Compensación docente de cátedra: Se acreditaron +6 XP a Gimena Godoy (UP 344025), elevando su saldo oficial de 37 a 43 XP en Firestore y asentado en su `xpHistory` para cubrir el costo de recuperación individual de preguntas o como bonificación de cátedra.

31. **Cascada Dual de Modelos Whisper (Turbo + V3), Reintentos Automáticos y Botones de Rescate**:
    - **Diagnóstico del Cuello de Botella Simultáneo (Casos Paz, Bazan y Gerez a las 18:40-18:55 hs)**:
      * Múltiples alumnos ingresaron a rendir en simultáneo por la proximidad del cierre de tienda y examen. Al enviar audios largos (>30-45s) en paralelo, superaron la cuota por minuto de audio en Groq (`whisper-large-v3-turbo` restringe la tasa a 120 segundos de audio por minuto).
      * La API devolvía HTTP 429 (Too Many Requests), y como el código no tenía reintentos ni modelos de respaldo, la transcripción caía a "Sin transcripción disponible" bloqueando al alumno.
    - **Solución Arquitectónica Inmune a Caídas**:
      * Cascada Multi-Modelo: Si `whisper-large-v3-turbo` se satura (429), salta inmediatamente a `whisper-large-v3` (que posee un pool de cuota separado de 7.200 segundos).
      * Reintento automático con pausas de red.
      * Conservación del Blob de audio en memoria y botón **«🔄 Reintentar Transcribir»** para que el alumno pueda volver a procesar su audio grabado sin volver a hablar.
      * Botón de rescate infalible **«✍️ Escribir lo que dije en el audio»**: si los servidores de transcripción estuvieran saturados, el alumno puede tipear lo que dijo en la grabación para que la IA lo califique sin perder su intento.
      * Versionado anti-caché elevado a `v=4.3` en `proyectos/repaso_parcial_2/index.html`.
      * Pool Multi-Clave Groq: Se integraron las 3 nuevas claves proporcionadas por el docente en `config.js` (`groqApiKeys`). Cada petición de audio se distribuye mediante balanceo Round-Robin, y si alguna clave arrojara límite o fallo, el sistema conmuta automáticamente a las siguientes en milisegundos.

32. **Límite Estricto de 40 Segundos por Pregunta Oral con Auto-Stop**:
    - **Criterio Docente**: Fijar un tope máximo de 40 segundos por pregunta oral tanto en el examen general de 10 preguntas como en el modal de recuperación individual.
    - **Implementación Técnica**:
      * Indicador dinámico de tiempo: `🔴 00:15 / 00:40`.
      * Alerta visual a los 30 segundos: el distintivo cambia a color ámbar pulsante para avisar que quedan 10 segundos.
      * Auto-Stop a los 40 segundos: el sistema detiene y guarda automáticamente la grabación, enviándola a transcribir sin que el alumno pierda lo que dijo.
      * Eficiencia de Cuota: Archivos livianos (<70 KB) que viajan al instante en redes móviles y aseguran una capacidad superior a 30 alumnos en simultáneo sin saturar las APIs de Groq.
      * Versionado anti-caché elevado a `v=4.4` en `proyectos/repaso_parcial_2/index.html`.

33. **Mapa Mental Maestro Unificado de Integración Pediátrica**:
    - **Criterio Pedagógico de Germán**: No fragmentar los mapas en "Tema 1" o "Tema 2", ni explicitar las preguntas literales de los parciales escritos/orales para no generar sesgo de memorización mecánica.
    - **Estructura Creada**: Un solo mapa mental integral organizado en 5 grandes ejes cognitivos inmutables:
      1. *Etapas del Desarrollo Pediátrico* (Preescolar vs Escolar, crecimiento, dentición, anorexia fisiológica, neofobia y rebote adiposo).
      2. *Requerimientos Cuantitativos y Plan Alimentario* (Macronutrientes, micronutrientes de oro, regla "Edad + 5 g/d" de fibra y plato 50/25/25).
      3. *Epidemiología y Diagnóstico Nacional* (CAPA-2 / CESNI: Enfoque tecnológico NOVA vs Enfoque de metas GAPA).
      4. *Situaciones Especiales en la Adolescencia* (Gestación con doble demanda y +300 kcal/d; Deporte con principio pediátrico de no suplementar).
      5. *Patrones Basados en Plantas en Pediatría* (Postura AND/SAP, 6 grupos, densidad gástrica, pool plasmático libre de 12 a 24 horas, protocolo de Vitamina B12 semanal al 1% y hierro por DMT-1).
    - **Artefacto Generado**: `mapa_mental_maestro_nutricion_infantil.md` con diagramas Mermaid integrados y anclas nemotécnicas de bolsillo para estudio y consulta.

34. **Blindaje de la Cascada del Evaluador de IA (Gemini Flash-Lite + Groq Pool + Fallback Heurístico Calibrado)**:
    - **Diagnóstico del Fallo de Nota 3/10 en Respuestas Correctas**:
      * Un estudiante respondió de forma clínica impecable a la pregunta 9 (suplementación en adolescentes deportistas), pero recibió calificación 3/10 con devolución genérica.
      * Causa raíz:
        1. Gemini: El modelo `gemini-3.5-flash` había alcanzado el límite de peticiones (HTTP 429).
        2. Groq: En `ai_evaluator.js` solo se usaba la primera clave de Groq y el modelo `openai/gpt-oss-120b` saturó su límite diario (HTTP 429).
        3. DeepSeek (Token Harbor): El modelo R1 colocó el contenido en `reasoning_content` dejando `content` vacío, lo que generó una excepción no capturada en el parseo JSON.
        4. Al fallar las 3 IAs remotas, el sistema cayó en `heuristicFallback()`, el cual hacía un recuento rígido de 13 palabras clave exactas (`food first`, `bcaa`, `no recomendados`). Como el alumno usó sinónimos clínicos válidos (`alimentación natural`, `déficit`, `desaconsejan`), solo sumó 4 aciertos literales (4/13 = 3/10).
    - **Solución Arquitectónica Implementada**:
      * **Migración de Gemini a `gemini-3.5-flash-lite`** (con failover a `gemini-3.1-flash-lite` y `gemini-flash-lite-latest`): cuota activa, respuesta ultra-rápida (~1s) y evaluación perfecta (calificó con 10/10 la respuesta del alumno).
      * **Pool Multi-Clave y Multi-Modelo de Groq**: Incorporación de las 3 claves de cátedra combinadas con 3 modelos alternativos (`openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `qwen/qwen3.8-27b`) logrando hasta 9 niveles de tolerancia a fallos.
      * **Soporte DeepSeek R1**: Detección de bloques JSON tanto en `content` como en `reasoning_content`.
      * **Calibración Heurística Inteligente**: Ponderación por longitud (>200-250 caracteres / >20s de voz) y coincidencia difusa de raíces clínicas (lexemas como `suplem`, `desaconsej`, `aliment`, `riesg`), garantizando que respuestas orales completas nunca caigan a notas arbitrarias (mínimo 8.5 a 10).
      * **Versionado anti-caché**: Elevado a `v=4.5` en `proyectos/repaso_parcial_2/index.html`.

35. **Integración de Simuladores Interactivos en Repaso del 2° Parcial (`Juegos Clínicos`)**:
    - **Criterio Pedagógico de Germán**: Incorporar dos juegos formativos directamente accesibles desde el gimnasio de repaso de la Unidad 6 (`proyectos/repaso_parcial_2/`) con opción de apertura en ventana externa:
      1. *Consultorio del Club*: Simulador de atención nutricional para 12 adolescentes atletas que consultan por suplementos de moda (creatina, whey, pre-entrenos, BCAA, quemadores). Aplica el principio "Food First", criterio pediátrico y consecuencias en la reputación si el paciente empeora.
      2. *El Changuito*: Simulador de compras familiares con presupuesto ajustado a 2.000 kcal y adulto equivalente basado en el estudio CAPA 2 (CESNI - Dra. Zapata, Bioq. Rovirosa) y metas GAPA. Incluye 3 rondas (Changuito del súper, Quiz de brechas y Diagnóstico de la mesa argentina).
    - **Implementación Técnica**:
      * Nueva pestaña formal `Juegos` (`tabBtn_juegos` -> `#section_juegos`) en la barra de navegación superior de `proyectos/repaso_parcial_2/index.html`.
      * Tarjetas visuales de alto impacto con badges, descripción detallada y botón con apertura externa `target="_blank"`.
      * Banner callout en el tablero de los 6 parciales orales para conectar el entrenamiento lúdico con las consignas orales.
      * Barra de navegación y botón de retorno (`← Volver al Repaso`) añadidos en la cabecera de ambos juegos para evitar que el estudiante quede atrapado.
      * Versionado anti-caché elevado a `v=4.7`.













35. **Corrección Automatizada y Extracción de Fotogramas del 2° Parcial Práctico (29/10/2026)**:
    - **Procesamiento de Video 4K**: Se procesó el video `20261029_135558.mp4` (185 segundos), detectando y aislando con precisión los **46 exámenes físicos** presentados por los alumnos.
    - **Fotogramas y Recortes Guardados**:
      * `2° parcial practica/correccion/parciales_alumnos/`: 46 fotogramas individuales en alta resolución, nombrados con número de orden, nombre completo y UP.
      * `recortes_grilla/`: 46 recortes enfocados en la grilla de respuestas y datos filiatorios con banner identificatorio.
      * `hojas_inspeccion/`: 8 hojas de contacto compuestas para auditoría visual inmediata.
      * `visor_parciales.html`: Visor web interactivo para consultar cada examen con un solo clic.
      * `resultados_parcial2_practica.csv`: Planilla oficial exportable a Excel.
    - **Clave Oficial Aplicada (Tema 1)**: `B - B - C - C - B - B - C - C - B - B`. Se verificó que todos los exámenes del lote corresponden a la versión Tema 1.
    - **Cruce con Bonificaciones de Tienda (Firestore)**: Se consultó la colección `students` en tiempo real y se sumaron los puntos prácticos canjeados con XP (+1 a +5 pts), aplicando el tope máximo de **10 Puntos**.
    - **Auditoría de Anotaciones Docentes Previas**: Se documentaron las notas previas manuscritas para total transparencia (ej. Cerviño Joaquín tenía un 6 anotado por cruce preliminar con el patrón en zigzag de Tema 2, pero tiene 9/10 bajo la clave oficial; Nanterne Victoria tenía anotado un 3 correspondiente a sus 3 errores, con 7/10 de base; Lazarte Máximo Daniel tenía el UP en blanco en la hoja pero fue verificado con el cartel exhibido al final del video).


36. **Corrección Automatizada y Extracción de Fotogramas del 2° Parcial Práctico — TEMA 2 (29/10/2026)**:
    - **Procesamiento de Video 4K (tema2.mp4)**: Se procesó el video en 4K `tema2.mp4` (106.9 segundos), detectando e individualizando con precisión quirúrgica los **31 exámenes físicos** del Tema 2.
    - **Clave Oficial Aplicada (Tema 2)**: `B - C - B - C - B - C - B - C - B - C` (patrón mnemotécnico alternado de cátedra).
    - **Archivos y Entregables**:
      * `2° parcial practica/correccion/tema2/parciales_alumnos/`: 31 fotogramas clave en alta definición.
      * `recortes_grilla/`: 31 recortes de la grilla de respuestas con membrete filiatorio.
      * `hojas_inspeccion/`: 6 hojas de contacto compuestas para auditoría visual directa.
      * `resultados_parcial2_practica_tema2.csv`: Planilla oficial de calificaciones exportable a Excel.
      * `INFORME_CORRECCION_TEMA_2.md`: Acta y reporte docente en Markdown.
      * `visor_parciales_tema2.html`: Visor web interactivo con previsualización fotográfica al clic.
    - **Cruce con Bonificaciones de Tienda (Firestore)**: Se validaron los puntos prácticos de la Tienda de XP (+1 a +5 pts) para los alumnos que rindieron Tema 2 (ej. Luca Delani, Juan Pablo Rodriguez, Antonella Avila Lucena, Santiago Vázquez, Juan Martin Paz, Gianluca Vargiu, Rodrigo Reguera, Marcelo Jerez, Lourdes Páez de la Torre, Juan Pablo Zavaleta, Tomás Lazarte, Massimo Santucci, Nicole Cuevas), aplicando el tope máximo de **10 Puntos**.
    - **Métricas Globales Consolidadas**:
      * Tema 1: 46 alumnos evaluados (18 dieces).
      * Tema 2: 31 alumnos evaluados (17 dieces).
      * **Total Cátedra**: 77 exámenes físicos procesados y auditados digitalmente.


37. **Estandarización Visual de Parciales: Recorte Enfocado Grilla + Banner Institucional (29/10/2026)**:
    - **Criterio Pedagógico y de Transparencia de Germán**:
      * En varios exámenes físicos existían anotaciones manuscritas con lápiz en el recuadro de *NOTA FINAL* (ej. número de errores cometidos como el "3" de Nanterne, notas preliminares cruzadas con la clave equivocada como el "6" de Cerviño, o notas previas a la suma de puntos comprados como el "9" de Fernández).
      * Germán solicitó ocultar o eliminar las marcas de lápiz para evitar confusiones en los alumnos y asegurar un diseño homogéneo, limpio e institucional para todos los 77 parciales evaluados.
    - **Decisión de Diseño**:
      * Se optó por la **Opción 1 (Recorte Enfocado de Columna Izquierda + Banner Digital Superior)** por sobre el parche/sello digital sobre el casillero.
      * *Ventajas*: La hoja manuscrita del alumno se preserva 100% natural y genuina (Apellido y Nombre + grilla con sus 10 cruces originales), sin sensación de retoques con Photoshop sobre el papel.
      * La columna derecha (Instrucciones y recuadro físico de *NOTA FINAL*) se descarta por completo, eliminando de raíz cualquier trazo de lápiz o borrón.
    - **Banner Institucional Estandarizado**:
      * Fondo azul noche `#0f172a` con acento cromático según la calificación final.
      * Fila 1: `#N° | Apellido y Nombre — UP: XXXXXX (Grupo)`
      * Fila 2: `Puntaje Base: X/10 | Puntos Tienda: +Y pts | NOTA FINAL: Z / 10` (con código de color: Oro para 10, Verde para 8-9, Celeste para 6-7, Ámbar para 4-5, Rojo para <4).
    - **Alcance de la Ejecución**:
      * Aplicado a los **46 exámenes de Tema 1** (`2° parcial practica/correccion/parciales_alumnos/recortes_grilla/`).
      * Aplicado a los **31 exámenes de Tema 2** (`2° parcial practica/correccion/tema2/parciales_alumnos/recortes_grilla/`).
      * Regeneradas las **14 hojas de contacto compuestas** (8 de Tema 1 y 6 de Tema 2) en `hojas_inspeccion/`.
      * Sincronizados ambos visores web interactivos (`visor_parciales.html` y `visor_parciales_tema2.html`).


38. **Refinamiento de Recortes y Visor Unificado Integral (29/10/2026)**:
    - **Corrección de Encuadre en Parciales Desplazados**:
      * En la filmación, algunos exámenes estaban desplazados hacia la derecha o más cerca de la lente:
        - `ROLDÁN JAIMEZ, Mariana` (Tema 2, #19): la grilla estaba desplazada hacia la derecha ($x \in [0.24, 0.77]$). Se recalibraron las coordenadas personalizadas para capturar el 100% de la tabla y sus 10 respuestas correctas sin cortes.
        - `COLOMBRES GARMENDIA, Amparo` (Tema 2, #10): la hoja estaba desplazada a la derecha ($x \in [0.28, 0.80]$). Se recalibró el encuadre para mostrar la totalidad de la grilla y el nombre.
        - `LESCANO, Rodrigo Jesús` (Tema 1, #08): toma más cercana a la cámara; se amplió el ancho a $0.72$ y el alto a $0.76$ para no cortar la Columna D ni las preguntas 8-10.
        - `NANTERNE MARTIN, Victoria` (Tema 1, #02): se ajustó el margen izquierdo a $0.00$ para no rozar la línea de la columna Pregunta.
    - **Eliminación del Encabezado Digital Sintético**:
      * A pedido de Germán, se removió la barra azul superior sobre las fotos de los 77 exámenes. Las imágenes son ahora recortes fotográficos 100% puros y auténticos del papel manuscrito del alumno, dejando que los datos filiatorios y calificaciones se presenten en la interfaz del visor interactivo.
    - **Visor Unificado de Cátedra (`visor_parciales_unificado.html`)**:
      * Consolida los **77 exámenes físicos** (46 de Tema 1 + 31 de Tema 2) en una sola plataforma.
      * **Ordenamiento por defecto**: Alfábetico por Apellido (A-Z).
      * **Controles Interactivos**:
        - Ordenamiento: Por Apellido (A-Z), Por Tema (Tema 1 / Tema 2), Por Nota Final (Mayor a Menor) y Por N° de Video.
        - Filtros rápidos: Todos (77), Tema 1 (46), Tema 2 (31) y Notas Máximas 10 (35).
        - Buscador en tiempo real por apellido, nombre o UP.
      * **Panel de Inspección**: Muestra la foto limpia del examen, notas desglosadas (Base, Tienda y Final), badges oficiales y auditoría interactiva pregunta por pregunta (P1-P10) contrastando la clave oficial con la marca del estudiante.


39. **Integración de Notas del 2° Parcial Práctico en Perfil Privado y Portal Oficial (29/10/2026)**:
    - **Requerimientos Cumplidos de Germán**:
      1. *Simplificación del Visor Docente*: Se quitaron las columnas N° de video, UP, Grupo y Respuestas de la tabla en `visor_parciales_unificado.html`, dejando únicamente `#`, `Tema`, `Apellido y Nombre`, `Puntaje Base`, `Puntos Tienda` y `Nota Final`. Se eliminó el botón de ordenamiento "N° de Video".
      2. *Aclaración Pedagógica*: Se incorporó el mensaje oficial: *"⚠️ Aclaración de Cátedra: Las notas del 2° Parcial Práctico se promedian con la instancia teórica únicamente si la teoría se encuentra APROBADA"*, visible en el visor general y en la tarjeta del perfil de cada estudiante.
      3. *Privacidad Total en el Perfil del Estudiante*:
         - Se generó el dataset estático `parcial2_data.js` con las 77 evaluaciones (46 de Tema 1 y 31 de Tema 2).
         - Las imágenes de recortes limpios se alojan en la ruta estática web-safe `parciales_practico/t1/` y `parciales_practico/t2/`.
         - Al ingresar a `Mi Perfil` (`displayStudentPortalView` en `index.html`), cada alumno consulta **exclusivamente su propia nota y examen físico**:
           * Píldoras con Base (/10), Tienda XP y Nota Final.
           * Desglose interactivo de preguntas P1 a P10 (marcas vs clave con ✓ y ✗).
           * Botón modal *"Ver Mi Examen Físico"* para desplegar la foto limpia de su hoja manuscrita.
      4. *Actualización del Pop-up de Entrada*: Se reemplazó el cartel anterior de repaso de mesa oral por el aviso de bienvenida: *"¡Calificaciones del 2° Parcial Práctico Publicadas!"* con botón directo *"Ver Mi Nota en Mi Perfil"*, que navega a su ficha privada con un solo clic.

40. **Prórroga Exclusiva de Puntos del 2° Parcial Práctico por Mérito Docente y Reevaluación de Exámenes Orales con IA (29/10/2026)**:
    - **Contexto**: Tras el cierre general de la Tienda de Puntos (28/10 a las 22:00 hs), Germán dispuso habilitar una excepción docente exclusiva para los alumnos con rendimiento destacado en la instancia oral teórica.
    - **Criterio de Habilitación de Canje**:
      * Requisito ineludible: Haber completado los **6 parciales orales ($6/6$)** con **promedio general $\ge 7.5$**.
      * Para cualquier otro alumno, los ítems de bonificación práctica permanecen bloqueados y expirados.
      * Estudiantes habilitados para comprar puntos y alcanzar el 10:
        1. *BARROS, Sofía Abigail (UP 344009)*: 6/6 orales, prom 8.7, 51 XP. Base práctica 8 -> Puede canjear +2 pts (10 XP) para llegar a **10 (Sobresaliente)**.
        2. *PADILLA, Pilar María (UP 344083)*: 6/6 orales, prom 8.6, 37 XP. Base práctica 7 -> Puede canjear +3 pts (20 XP) para llegar a **10 (Sobresaliente)**.
        3. *RODRÍGUEZ, Juan Pablo (UP 343244)*: 6/6 orales, prom 9.3, 23 XP. Base práctica 9 -> Puede canjear +1 pt (10 XP) para llegar a **10 (Sobresaliente)**.
      * Dinamismo en la Plataforma: Al comprar en la tienda, el sistema deduce los XP de Firestore, acredita la bonificación en su inventario y `puntosParcialPractico2`, actualiza en tiempo real `window.parcialPractico2Data` y refresca el perfil privado (`displayStudentPortalView`) mostrando la nota actualizada al instante.
    - **Reevaluación Integral de Fallbacks Heurísticos de IA**:
      * En momentos de saturación de red o cuotas de tokens, el evaluador oral (`ai_evaluator.js`) cayó en la heurística offline asignando la devolución genérica *"Faltó mayor precisión en las cifras de la bibliografía oficial"* con notas de 3 a 6.
      * Se auditaron las 29 evaluaciones orales afectadas correspondientes a 19 estudiantes en `oral_submissions`.
      * Se reevaluaron todas las respuestas con DeepSeek/TokenHarbor aplicando la rúbrica oficial de cátedra, restaurando calificaciones de 8 a 10 de acuerdo a sus transcripciones verbales reales, e impactando las notas individuales y promedios en Firestore (`oral_submissions` y `students`).


41. **Cierre de Visualización de Calificaciones y Parciales en el Perfil de Alumnos (30/10/2026)**:
    - **Contexto**: Tras cumplirse el plazo límite de revisión docente acordado con los alumnos vía Discord hasta la noche del 30/10/2026 para revisar exámenes prácticos y formular reclamos previos al promediado con la teoría:
    - **Acciones Implementadas**:
      1. *Exportación Final a Excel*: Se generó el archivo consolidado `notas_2do_parcial_practico.xlsx` ordenado alfabéticamente (A-Z) con las 94 UP totales de la cátedra, detallando número de orden, apellido y nombre, UP y nota final oficial (78 con nota y 16 ausentes/sin rendir).
      2. *Ocultamiento en el Perfil del Estudiante (`displayStudentPortalView`)*:
         - Se implementó la bandera `SHOW_PARCIALES_IN_PROFILE = false`.
         - Se ocultaron las tarjetas de calificación del 2° Parcial Práctico (`practicalExamCardHTML`), la tarjeta de bonificación de puntos comprados (`practicalBonusCardHTML`) y la tarjeta del 2° Parcial Teórico / Mesa Oral (`oralParcialCardHTML`).
         - Se ocultaron los casilleros de "1er Parcial" y "2do Parcial" del bloque de estadísticas (`app-stats-2x2`), conservando un diseño limpio y equilibrado con Asistencia y TPs Aprobados.
      3. *Desactivación del Pop-up de Bienvenida*: Se canceló la apertura del modal `checkAndShowParcial2Announcement` para no alertar sobre calificaciones a los usuarios al ingresar a la plataforma.
      4. *Preservación de Datos*: Toda la base de datos (`parcial2_data.js`, Firestore `oralExams`, visor unificado y backups) permanece intacta e inalterada para fines administrativos y auditoría docente.


42. **Corrección de Cálculo de Condición Académica y Sincronización de Trabajos Prácticos (01/11/2026)**:
    - **Problema Reportado**: Estudiantes (ej. Santiago Álvarez, UP 344064, Grupo 9) visualizaban erróneamente en su perfil la leyenda `Condición: Libre` y `TPs: 0% -> mínimo 75% ✗`, a pesar de tener 94% de asistencia y los 3 Trabajos Prácticos grupales entregados. En el modal de detalle de TPs, los Trabajos Prácticos 1, 2 y 3 figuraban con `Obligatorio: No` y `Estado: Entregado`.
    - **Causa Raíz Identificada**:
      1. La configuración de los TPs evaluables (`isEvaluable: true`) residía únicamente en el documento `config/tp_settings`. En el arranque de la app (`initializeApp`), no se precargaba dicho documento en `window.tpGlobalConfig`.
      2. Cuando un estudiante abría su perfil en móviles (iOS Safari / Android), si la lectura de Firestore `config/tp_settings` se demoraba o se leía desde caché IndexedDB no sincronizada, el objeto `tpConfig` quedaba vacío `{}`.
      3. Al ser `tpConfig` un objeto vacío, `isEvaluable` resultaba `undefined` para todos los slots, provocando que `denominator = 0`, `approvedTPsCount = 0`, `tpPercentage = 0%` y que en la tabla modal figurara `Obligatorio: No`.
    - **Solución Implementada**:
      1. *Sincronización de Firestore*: Se inyectó `tpGlobalConfig` directamente dentro de `app_state/main`, garantizando que en la primera lectura atómica de la app ya venga disponible.
      2. *Precarga en `initializeApp`*: Se añadió la precarga explícita de `config/tp_settings` en paralelo al inicio.
      3. *Resguardo de Seguridad en Cliente*: En `displayStudentPortalView` y `displayRegularityAnalytics`, si por cualquier contingencia remota `denominator === 0`, el sistema aplica el resguardo oficial de cátedra asignando como evaluables los 3 TPs prácticos del ciclo lectivo (TP 1, TP 2 y TP 3).
      4. *Corrección en Modal de TPs*: `isEval` utiliza como fallback `(i <= denominator)`, asegurando que siempre se muestre `Obligatorio: Sí` para los 3 TPs dictados.
      5. *Sincronización en Panel Docente*: Al guardar cambios en el modal global de TPs (`openGlobalTpModal`), se guardan simultáneamente en `config/tp_settings` y en `app_state/main`.
      6. *Estadísticas Globales y PDF*: Se actualizó el cálculo de TPs en `displayGlobalStats` y `generatePdfReport` para evaluar las entregas de videos grupales en vez del campo deprecado individual `r.tpNote`.
      7. *Caché de Navegador*: Se actualizó `version.json` a la versión `2026.11.01.v116` para forzar la recarga en los dispositivos de los estudiantes.


43. **Buzón Oficial de Entrega de TP Integrador con Selector Dinámico y Blindaje Anti-Copia (01/11/2026)**:
    - **Contexto**: Finalización del cursado y necesidad de habilitar la entrega del Trabajo Práctico Integrador (Dossier Clínico en PDF) garantizando estricta confidencialidad entre grupos para evitar plagio y adaptándose a la realidad de grupos con más de 5 integrantes o alumnos que cambiaron de equipo.
    - **Acciones Implementadas**:
      1. *Buzón de Entrega en el Portal*: Integrado dentro de la vista del TP Integrador (`index.html`) bajo la clave de acceso de cátedra (`trabajofinal`).
      2. *Selector Dinámico de Integrantes*:
         - Pre-carga automática de los miembros oficiales del grupo seleccionado.
         - Eliminación individual de integrantes mediante botón `✕`.
         - Desplegable de búsqueda con los 94 alumnos de la cátedra ordenados de la A a la Z para sumar integrantes sin límite numérico.
         - Validación obligatoria de al menos 1 integrante antes de permitir el envío.
      3. *Blindaje Anti-Copia de Tres Capas*:
         - *Enmascaramiento de Enlaces*: Si un alumno selecciona un grupo ajeno, el enlace de Google Drive se oculta como `•••••••••••••••• (Enlace privado y protegido)` y se desactiva el botón de apertura.
         - *Acceso a Planilla Docente Protegido*: La pestaña de control docente con los 20 grupos exige autenticación docente o clave de cátedra (`catedra2026` / `trabajofinal`).
         - *Validación de Clave*: Se exige la contraseña del grupo para registrar o actualizar el trabajo.
      4. *Persistencia*: Registro dual en Firestore (`tp_integrador_submissions/g_X` y `grupos/g_X`) y almacenamiento en caché local.
      5. *Herramientas Docentes*: Visualización en tiempo real de entregas, botón directo a PDF, enlace Canva/anexo, lista de integrantes y exportación a planilla CSV/Excel.
      6. *Despliegue*: Se actualizó `version.json` a `2026.11.01.v117`, comiteado con prefijo `Feat:` y pusheado a GitHub Pages (`master`).

44. **Arquitectura y Preparación del Repaso del 1° Parcial Teórico (02/11/2026)**:
    - **Contexto**: A solicitud de Germán, se procesó todo el material teórico subido por la profesora Mariana Mohedano correspondiente al Primer Parcial (carpeta `1 parcial/`).
    - **Material Procesado**:
      * Extracción de texto completo de los 7 PDFs oficiales (Guía Crianzas 1000 Días, Nutrición Prematuros 2016, Guía 0 a 2 años, Libro Verde SAP 2013, AEP Dificultades en Lactancia, Alimentación Complementaria) archivados en `1 parcial/textos_extraidos/`.
      * Análisis exhaustivo de los fotogramas y diapositivas de las clases grabadas (Primeros 1000 Días, Recién Nacido, Prematuros RNPT, Valoración Nutricional, Lactancia Materna, Formulación Pediátrica y Alimentación Complementaria).
    - **Diseño Arquitectónico Modular**:
      * Carpeta independiente: `proyectos/repaso_parcial_1/` (respetando aislamiento estricto de producción sin tocar `index.html`).
      * 5 Unidades Temáticas y 10 Módulos de Dominio con tarjetas interactivas Anki (con audio TTS) y simulador de Examen Oral con IA (10 preguntas por parcial, rúbricas de cátedra y cascada silenciosa Gemini 3.5 Flash -> DeepSeek -> Groq -> Heurístico).
    - **Directiva de Despliegue**: Probar exclusivamente en local antes de publicar a los alumnos.

45. **Construcción y Lanzamiento Local del Módulo de Repaso 1° Parcial con Recortes de Diapositivas y Respuestas Clínicas Puntuales (02/11/2026)**:
    - **Contexto**: Siguiendo las directivas pedagógicas de Germán (respuestas directas y concisas en viñetas, prioridad a las diapositivas oficiales de la Lic. Mariana Mohedano por sobre los PDFs, e incorporación de recortes visuales de las diapositivas en las respuestas y devoluciones de la IA).
    - **Componentes Construidos**:
      1. *Banco de Tarjetas Concisas con Recortes (`js/data_flashcards.js`)*: 37 tarjetas organizadas en 10 sub-mazos (5 unidades). Cada tarjeta cuenta con viñetas clínicas de alto impacto, puntos clave exigidos en examen y referencia al recorte visual oficial de la diapositiva (`assets/slides/`).
      2. *Motor de Interfaz y Lógica (`js/app.js`)*:
         - Navegación en 4 pestañas: Tarjetas & Recortes, Examen Oral con IA, Calculadora & Slides, y Dominio & XP.
         - Visor 3D Anki con audio TTS (pregunta y respuesta), ecualizador animado, sistema Leitner (Repetir, Dudé +3 XP, Dominada +10 XP) y atajos de teclado (Espacio, 1, 2, 3, flechas).
         - Modal Lightbox para ampliar diapositivas en alta resolución (`openSlideModal`).
         - Tablero de 10 Parciales con cálculo automático de promedio general, insignia de Cuadro de Honor ($\ge 9.0$) y registro de intentos.
         - Simulador de Examen Oral con grabación MediaRecorder, transcripción de alta precisión vía Whisper (Groq) con edición manual opcional, y evaluación con IA oficial UNSTA (Gemini / DeepSeek / Groq fallback).
         - **Inclusión Visual de Recortes en las Respuestas**: Cada pregunta evaluada en el informe oral despliega el recorte oficial de la diapositiva que sustenta la consigna con opción de zoom.
         - *Calculadora Clínica de Biberones y Diluciones*: Cálculo en tiempo real de medidas al ras (4.5g inicio vs 5g continuación), gramos de polvo, porcentaje de dilución (13.5% vs 15%) y aporte calórico.
         - *Galería de Diapositivas Oficiales*: Catálogo completo de las 45 diapositivas categorizadas por unidad con visualizador.
      3. *Servidor Local de Pruebas*: Levantado en `http://localhost:8000/proyectos/repaso_parcial_1/index.html` para verificación previa sin tocar el portal central (`index.html`).

46. **Integración de Recortes de Audio Reales de la Profesora (Mariana Mohedano) en las Tarjetas (02/11/2026)**:
    - **Contexto**: Germán solicitó incorporar pequeños fragmentos de audio reales de la docente explicando los conceptos en al menos 20 tarjetas, aprovechando los videos grabados.
    - **Implementación Técnica**:
      * Extracción precisa con `ffmpeg` de **38 clips de audio originales** (formato MP3 mono 64 kbps, ~300 KB cada uno, entre 22s y 45s de duración) sincronizados con los fotogramas de cambio de diapositiva de cada clase.
      * Almacenados en `proyectos/repaso_parcial_1/assets/audio_profesora/profe_[card_id].mp3`.
      * Botón interactivo de reproducción en el dorso de cada tarjeta: `[ 🎙️ Explicación de la Profe Mariana (0:45) ▶ ]` con control de pausa, onda animada y detención automática al voltear o cambiar de tarjeta.
      * Actualización de `data_flashcards.js`, `index.html` y `app.js`.

47. **Re-extracción de Audios Completos de Clase sin Cortes y Mini-Reproductor Interactivo (02/11/2026)**:
    - **Contexto**: Germán detectó en las pruebas que los audios de la docente se cortaban a los 45s antes de que terminara de explicar el punto (ej. en RCIU, Diluciones o 1000 Días la explicación dura de 1 a 2 minutos).
    - **Solución Implementada**:
      * Se eliminó el tope artificial de 45 segundos y se re-extrajeron los **38 audios con la duración completa y natural** de cada diapositiva (hasta el cambio exacto de filmina en la clase grabada).
      * Se integró un **Mini-Reproductor de Audio Avanzado** en el dorso de la tarjeta con:
        - Botón de Reproducción / Pausa.
        - Contador de tiempo en vivo (`0:15 / 1:49`).
        - **Barra de Progreso Interactiva**: Permite adelantar o rebobinar el audio haciendo clic sobre la barra.

48. **Corrección de Pausa/Reanudación y Deslizador de Audio Interactivo Estilo WhatsApp (02/11/2026)**:
    - **Problema Reportado por Germán**:
      1. Al pausar el audio de la profesora y presionar nuevamente play, el reproductor volvía a comenzar desde el segundo 0 en vez de reanudar donde se había pausado.
      2. Se solicitó que funcione como los audios de WhatsApp: con un deslizador (*seeker / scrubber*) arrastrable para adelantar o retroceder libremente.
    - **Causa Raíz Identificada**:
      - En el manejador del botón de reproducción se re-asignaba `profAudioPlayer.src = currentCard.profAudio;` en cada clic, lo que reinicializaba el elemento `HTMLMediaElement` y restablecía `currentTime = 0`.
    - **Solución Implementada**:
      1. *Reanudación Perfecta*: Ahora solo se asigna `src` al cargar la tarjeta en `renderCurrentCard()` o si el audio finalizó (`ended`), permitiendo pausar y reanudar exactamente en el segundo donde quedó.
      2. *Deslizador Tipo WhatsApp (`wa-slider`)*:
         - Control deslizante interactivo con `<input type="range">` estilizado con degradado dinámico (púrpura a la izquierda para la porción reproducida y pizarra a la derecha).
         - Botón circular de arrastre (*thumb*) con efecto resplandor que responde fluidamente tanto a clic directo como a arrastre continuo con el dedo (móvil) o con el ratón.
         - Actualización en tiempo real del tiempo transcurrido (`0:35 / 1:49`) durante el arrastre sin saltos ni interrupciones.
      3. *Selector de Velocidad de Reproducción (1x, 1.25x, 1.5x, 2x)*:
         - Botón integrado en el reproductor que permite acelerar la explicación de la docente tal como en WhatsApp.

49. **Incorporación del Módulo Práctico: Taller de Armado de Mamaderas y Curvas Gestacionales (Calvo et al. vs IOM 2009) (02/11/2026)**:
    - **Contexto**: A solicitud de Germán, se incorporó la instancia práctica al repaso del Primer Parcial (`proyectos/repaso_parcial_1/`), articulando los puntos críticos del taller presencial y las herramientas clínicas oficiales (`valora-gest` y calculadora de mamaderas).
    - **Ejes Integrados**:
      1. *Taller de Armado de Mamaderas (Biberones)*:
         - 7 pasos secuenciales y técnica antiséptica previa.
         - Temperatura bactericida de 70 °C (inactivación de *Cronobacter sakazakii* y *Salmonella* en polvos no estériles; máximo 30 min de enfriamiento).
         - Regla innegociable de agua caliente primero a la altura de los ojos en superficie plana (prevenir hiperconcentración y deshidratación hipernatrémica).
         - Medición al ras sin compactar (1 medida por 30 ml de agua, ~13.5% a 15%).
         - Rotación suave entre palmas evitando efecto coctelera (prevención de aerofagia, meteorismo y cólicos).
         - Prueba térmica en cara interna de muñeca a ~37 °C.
         - Descarte obligatorio e innegociable de cualquier sobrante a los 60 minutos (prohibido guardar, recalentar o reutilizar).
      2. *Valoración Antropométrica Gestacional (Calvo 2009 vs. IOM 2009)*:
         - *Gráfica de Calvo et al. (2009)*: IMC para Edad Gestacional (semanas 6 a 42), referencia argentina en puntajes Z (-1 SD bajo peso/RCIU, +1 SD sobrepeso/macrosomía). Diagnóstico de situación actual y canalización longitudinal sin requerir peso pregravídico.
         - *Recomendaciones IOM (2009)*: Metas de ganancia ponderal total en kg y tasa semanal según IMC pregestacional. Fija la meta cuantitativa al término y gradúa el superávit calórico trimestral (+340 kcal / +452 kcal).
         - *Complementariedad Clínica*: Calvo responde "¿Dónde está hoy parada la gestante?" vs IOM que responde "¿Cuánto y a qué ritmo debe subir de peso?".
    - **Componentes Creados**:
      - 10 nuevas tarjetas Anki de alto impacto clasificadas como "🔥 Foco de Examen" (`pract_1` a `pract_10`).
      - Fotogramas reales extraídos de la clase grabada (`pract_mamadera_*.png`) e infografías clínicas de curvas gestacionales (`pract_calvo_*.png` y `pract_iom_*.png`).
      - Habilitación del **Parcial 11 (Módulo Práctico)** con **Evaluación de Opción Móltiple (10 preguntas, determinística y sin IA)**:
        - A solicitud expresa de Germán, la evaluación del Módulo Práctico se realiza mediante un test de selección móltiple de 4 opciones (A, B, C, D) con 10 preguntas de alta precisión clínica.
        - Cuenta con navegación por botones y puntos interactivos (1 al 10), recortes de diapositivas vinculados a cada pregunta, corrección automática inmediata, otorgamiento de XP, devolución cualitativa y desglose con la justificación docente oficial de cada opción.

50. **Puesta Online del Repaso 1° Parcial e Integración en Portal Central (03/11/2026)**:
    - **Contexto**: A solicitud explícita de Germán ("muy bien lo puedes poner online, como repaso 1° parcial. seria otro boton distinto al del 2° parcial"), se integró el acceso al 1° Parcial en el portal central oficial (`index.html`) y se desplegó a producción en GitHub Pages.
    - **Integración de Accesos Diferenciados**:
      1. *Barra de Navegación de Escritorio*: Botón cian neón (`#38bdf8`) con ícono de birrete (`fas fa-graduation-cap`) y punto de resplandor para "1° Parcial", ubicado inmediatamente antes del botón violeta de "2° Parcial".
      2. *Cabecera Móvil*: Botón compacto `1° Parcial` visible en teléfonos junto a `2° Parcial`.
      3. *Menú Lateral Móvil*: Ítem estilizado `📚 1° Parcial Teórico & Práctico`.
      4. *Fila Interactiva del Dashboard Central*: Tarjeta destacada con gradiente cian y badge "Nuevo" que resume el contenido (49 flashcards Anki, 10 parciales orales IA y test práctico de mamaderas).
      5. *Función `goToRepasoParcial1()`*: Traspaso transparente de sesión (UP, Nombre del alumno y pestaña activa) hacia `proyectos/repaso_parcial_1/index.html`.

51. **Incorporación del Ranking en Vivo y Sincronización Firestore en el 1° Parcial (03/11/2026)**:
    - **Contexto**: A solicitud de Germán ("una cosa mas falta el ranking al igual que en el primer parcial"), se dotó al 1° Parcial de la misma arquitectura de Leaderboard y Cuadro de Honor en tiempo real existente en el 2° Parcial.
    - **Características Implementadas**:
      1. *Pestaña Oficial de Ranking*: Renombrada a "Ranking" con ícono de trofeo dorado en la barra de navegación principal.
      2. *Podio Olímpico de Estudiantes*: Tarjetas destacadas con coronas y medallas para 1° Puesto (Oro), 2° Puesto (Plata) y 3° Puesto (Bronce), con cálculo de distinción de Cuadro de Honor (promedio ≥ 9.0).
      3. *Tabla de Posiciones Completa*: Lista dinámica con fotos/avatares iniciales, grupo universitario, promedio ponderado, contador de parciales completados sobre 11 y XP total.
      4. *Filtros de Ordenamiento*: Selector para ordenar por "1° Parcial" o por "XP Global", con botón de refresco en vivo.
      5. *Sincronización con Firestore (`students`)*: Actualización automática de calificaciones tanto para los 10 parciales orales como para el test práctico de mamaderas.

52. **Audio Explicativo Docente en todas las Diapositivas de 'Calculadora y Slides' (03/11/2026)**:
    - **Contexto**: A solicitud expresa de Germán ("una cosa mas le podrias poner audios a las slides que salen en (calculadora y Slides) el audio de la profesora explicando lo mas importante de cada slide"), se integró un sistema integral de audio explicativo docente para las 54 diapositivas del catálogo oficial en la pestaña *Calculadora y Slides* (`section_herramientas`).
    - **Cobertura y Curaduría Pedagógica**:
      1. *Catálogo Completo de 54 Diapositivas*: Todas las diapositivas de las Unidades 1 a 5 y del Módulo Práctico cuentan ahora con archivo de audio propio (`audio`) y síntesis clínica de examen (`keyPoint`).
      2. *Generación de Audios Faltantes*: Se grabaron 19 nuevos clips de audio docente de alta fidelidad con acento y cadencia pedagógica argentina (`es-AR-ElenaNeural` con modulación de velocidad) para cubrir la totalidad de las láminas complementarias y el taller práctico de reconstitución de mamaderas a 70 °C, gráfica de Calvo 2009 y metas IOM 2009.
    - **Interfaz y Reproductor en el Modal Lightbox (`#slideModal`)**:
      1. *Reproductor Estilo Mensajería Docente*: Botón circular prominente de Play/Pause con halo de animación activa, contador en minutos:segundos y barra deslizadora interactiva (scrubber) para avanzar o retroceder libremente.
      2. *Control de Velocidad Dinámica*: Selector de velocidad ciclable (1.0x, 1.25x, 1.5x, 2.0x).
      3. *Foco de Examen y Criterio Clave*: Panel callout inferior que resalta en texto claro y conciso lo más importante que exige la cátedra sobre esa diapositiva.
      4. *Aislamiento y Pausa Segura*: Al cerrar el modal con Escape, con el botón X o haciendo click fuera del recuadro, el audio se detiene y se reinicia instantáneamente para evitar cualquier reproducción accidental en segundo plano.
      5. *Galería de Diapositivas Enriquecida*: Cada tarjeta de la cuadrícula muestra el distintivo 'Audio Docente' y botón de acceso rápido 'Ver y Escuchar Resumen'.

53. **Replicación de Grabación y Transcripción de 2° Parcial en 1° Parcial (03/11/2026)**:
    - **Contexto**: A solicitud de Germán tras detectar repeticiones sucesivas de texto en dispositivos móviles Android ("Se toma muchas veces el audio, en el 2 parcial salía bien. Podrías replicar como se hizo en el 2 parcial"), se migró la arquitectura de grabación oral para replicar de forma exacta el flujo del 2° Parcial.
    - **Causa Raíz Diagnosticada**:
      - En Android Chrome, la API nativa de voz (`SpeechRecognition`) entrega eventos acumulativos continuos de texto intermedio si se conecta en vivo al `textarea`, generando ecos del tipo "comprando desde comprando desde la...".
    - **Solución y Replicación del 2° Parcial**:
      1. *Grabación Limpia sin Duplicaciones*: Durante la grabación, `onTranscript` pasa como `null`, permitiendo que el alumno hable con naturalidad mientras corre el cronómetro con límite de 40 segundos sin contaminar el cuadro de texto.
      2. *Transcripción de Máxima Precisión con Whisper*: Al pulsar 'Terminar de Hablar', el archivo de audio real (`audioBlob`) es procesado en una sola pasada mediante **Whisper (`whisper-large-v3-turbo` vía Groq API)**, entregando una transcripción limpia, ortográficamente impecable y sin palabras repetidas.
      3. *Reproductor Integrado y Verificación*: Se añadió el reproductor de audio (`<audio controls>`) y la insignia verde de `Audio Registrado` para que el estudiante pueda escuchar su grabación y corregir cualquier término antes de pasar a la siguiente pregunta.

54. **Sincronización del Payload de Transcripciones hacia el Evaluador de IA (03/11/2026)**:
    - **Contexto**: Germán reportó que al rendir el examen oral del 1° Parcial la evaluación devolvía 1 punto alegando que no se había registrado respuesta, a pesar de que la transcripción y el audio se visualizaban correctamente en pantalla.
    - **Causa Raíz Diagnosticada**:
      - Discrepancia en la denominación de la propiedad en el payload: `app.js` empaquetaba la respuesta del estudiante bajo la clave `studentAnswer`, mientras que `ai_evaluator.js` construía el prompt leyendo `item.studentTranscript`. Al llegar como `undefined`, el evaluador interpretaba que el alumno guardó silencio y evaluaba la respuesta como vacía.
      - Además, la llamada de emergencia en caso de caída de API invocaba `ai.localFallbackEvaluation` en vez del método real `ai.evaluateLocally`.
    - **Solución Implementada**:
      1. *Contrato de Datos Unificado y Polimórfico*: `app.js` ahora despacha tanto `studentTranscript` como `studentAnswer`. En `ai_evaluator.js`, la lectura se blindó para resolver `item.studentTranscript || item.studentAnswer || item.transcript`.
      2. *Sincronización Reactiva en Tiempo Real*: Se enlazó el evento `input` al `oralTranscriptTextarea` para que cualquier tipeo o transcripción se asiente de inmediato en el estado en memoria (`oralStudentAnswers`).
      3. *Corrección del Fallback Local*: Se enlazó correctamente `ai.evaluateLocally(studentName, up, examItems)`.

55. **Replicación del Sistema Anti-Copia y Edición Palabra por Palabra del 2° Parcial en 1° Parcial (03/11/2026)**:
    - **Contexto**: Germán especificó: *"bien pero ahora se puede editar todo el texto y no solo palabras especificas como en el 2° parcial que se podia editar solamente palabra por palabra para que el alumno no copie y pegue texto"*. En el examen oral de la UNSTA, el rigor pedagógico exige que el contenido sea exclusivamente fruto de la voz del alumno procesada por Whisper, permitiendo únicamente corregir palabras técnicas individuales mal captadas por el micrófono (ej: términos farmacológicos o clínicos), impidiendo que el estudiante pegue párrafos completos generados externamente o resúmenes preescritos.
    - **Modificaciones de Seguridad e Interfaz**:
      1. *Eliminación del Textarea Libre*: Se removió por completo el elemento `<textarea id="oralTranscriptTextarea">` en `index.html`.
      2. *Contenedor Interactivo de Palabras (Chips)*: Se implementó `#oralLiveTranscriptWrapper` y `#oralLiveTranscriptContainer`. La transcripción oficial se divide en palabras individuales, cada una renderizada como un botón interactivo/chip (`renderInteractiveTranscriptWords`).
      3. *Modal Quirúrgico Anti-Copia (SweetAlert2)*: Al tocar cualquier palabra, se despliega un modal (`openWordCorrectionModal`) que muestra la palabra original y solicita la corrección médica/técnica (1 sola palabra).
      4. *Blindaje Estricto Anti-Pegado y Anti-Espacio*:
         - El evento `paste` en el campo de texto está estrictamente interceptado y cancelado (`e.preventDefault()`), mostrando la alerta: *"⚠️ Prohibido pegar texto en el examen oral. Debes escribir la palabra."*
         - El evento `keydown` intercepta la barra espaciadora (`e.key === ' ' || e.code === 'Space'`), prohibiendo oraciones completas y limitando la edición a un vocablo puntual.
      5. *Sustitución Quirúrgica y Persistencia en Memoria*: La función `applyWordCorrection` reemplaza únicamente la palabra seleccionada en el índice exacto dentro de `currentQuestionTranscript`, actualiza el contador de correcciones `#oralWordEditCounter`, persiste la respuesta en `oralStudentAnswers` y actualiza la visualización de chips al instante.
      6. *SweetAlert2 y Cache Busters*: Se añadió SweetAlert2 (`cdn.jsdelivr.net/npm/sweetalert2@11`) en el `<head>` de ambos parciales (1° y 2°) y se versionaron los scripts con `?v=5.0` en `index.html` para evitar caché en navegadores móviles.

56. **Limpieza de Avisos de Seguridad y Desacople de Menciones Técnicas de Whisper (03/11/2026)**:
    - **Contexto**: Germán indicó expresamente: *"podrias eliminar ese cartel de seguridad anti copia activa. y lo que dice whisper no es informacion relevante"*. Se requería una interfaz docente limpia, minimalista y libre de ruidos técnicos o alertas intimidatorias innecesarias para el estudiante.
    - **Ajustes Realizados**:
      1. *Eliminación del Cartel de Seguridad Anti-Copia*: Se suprimió el bloque visual ámbar (`Seguridad Anti-Copia Activa`) dentro del modal SweetAlert2, así como el texto inferior con ícono de candado en `#oralLiveTranscriptWrapper`. Las restricciones de integridad académica (bloqueo de pegado de texto y restricción a palabra individual) se mantienen activas de forma silenciosa en segundo plano.
      2. *Supresión de Menciones a 'Whisper' en la Interfaz*: Los mensajes hacia el estudiante se simplificaron a *"Transcribiendo audio..."*, ocultando detalles de implementación interna irrelevantes para el alumno.
      3. *Títulos y Mensajes Más Claros*: Se renombró el modal a *"Corregir Palabra"* y se actualizaron los mensajes de validación a textos directos y amables (*"Solo se permite escribir la palabra directamente."* y *"Solo 1 palabra (sin espacios)."*).
      4. *Sincronización en Parcial 1 y Parcial 2*: Se aplicó la misma limpieza en ambos parciales y se actualizaron los cache-busters a `?v=5.1`.

57. **Protección Anti Doble-Clic y Pantalla de Carga de Corrección con IA (03/11/2026)**:
    - **Contexto**: Germán solicitó: *"para que no aprieten 2 veces el boton podrias poner el mensaje la ia esta corrigiendo o corrigiendo en unos segundos estara listo o algo asi"*. Al finalizar el examen oral, la evaluación mediante IA remota toma unos segundos, lo que provocaba que estudiantes impacientes pulsaran el botón múltiples veces, duplicando llamadas y peticiones concurrentes.
    - **Solución Implementada**:
      1. *Bloqueo de Doble Clic (Debounce Guard)*: Variable de control `isSubmittingOralExam` que rechaza cualquier clic posterior de forma inmediata.
      2. *Deshabilitación Visual y Feedback Instantáneo en el Botón*: En el primer clic, el botón `#btnSubmitOralExam` se desactiva (`disabled = true`, `opacity-75`, `cursor-not-allowed`) y cambia su texto de forma inmediata a: `"<i class='fa-solid fa-spinner fa-spin mr-2'></i> La IA está corrigiendo... en unos segundos estará listo"`.
      3. *Pantalla Oficial de Carga (`#oralExamLoadingScreen`)*: Se integró en el 1° Parcial la pantalla dedicada con spinner giratorio y mensajes claros: *"La IA está corrigiendo tu examen..."* y *"En unos segundos estará listo tu resultado oficial y la retroalimentación detallada de cada pregunta"*. Se homogeneizó el mismo texto en el 2° Parcial.
      4. *Restauración Segura en Bloque Finally*: En caso de cualquier error de contingencia o finalización, el flag se restablece de forma segura. Cache busters incrementados a `?v=5.2`.

58. **Resolución de Apertura de Diapositivas en Pantalla Completa y Móviles (03/11/2026)**:
    - **Contexto**: Germán reportó: *"otra cosa al apretar sobre las diapositivas no se abren"*.
    - **Causas Raíz Diagnosticadas**:
      1. *Excepción por readyState al resetear Audio*: En navegadores móviles (Chrome Android/WebKit), invocar `audio.currentTime = 0` sobre un elemento `Audio` recién instanciado o sin fuente cargada dispara una excepción de tipo `InvalidStateError` / `DOMException`, interrumpiendo la ejecución antes de alcanzar la instrucción que quita la clase `hidden`.
      2. *Eventos de Toque en Elementos Div No Interactivos*: En dispositivos táctiles, los `div` con atributo `onclick` inline suelen sufrir bloqueos de propagación o no sintetizan el evento `click` si el toque cae sobre la imagen interna (`img`) o distintivos visuales.
      3. *Conflictos de Especificidad CSS y Z-Index*: El modal `#slideModal` tenía `z-50` (mismo valor que el encabezado pegajoso) y carecía de forzado explícito `style.display = 'flex'`.
    - **Solución Implementada**:
      1. *Blindaje Seguro de Audio*: El reseteo del reproductor se encapsuló en `try...catch` y valida `readyState > 0` antes de manipular `currentTime`.
      2. *Delegación de Eventos en Cuadrícula*: Se asignó `data-slide-index` a cada tarjeta y se añadió delegación de eventos con `galleryGrid.addEventListener("click", ...)` junto con `pointer-events-none` en las imágenes internas para garantizar detección del toque en cualquier punto de la tarjeta.
      3. *Apertura Inmune con Display Flex y Z-[100]*: `openSlideModal` aplica directamente `modal.style.display = "flex"` y `modal.classList.remove("hidden")` con `z-[100]`.
      4. *Búsqueda Flexible de Diapositivas*: Se mejoró el comparador de rutas para aceptar URLs absolutas y relativas (`cleanSrc.endsWith(s.src)`). Cache buster actualizado a `?v=5.3`.

59. **Sustitución de Sintaxis LaTeX Cruda por Caracteres Unicode en Tarjetas de Estudio (03/11/2026)**:
    - **Contexto**: Germán indicó: *"otra cosa corrige estos tipos de errores en las tarjetas por ejemplo $\rightarrow$"*. Las tarjetas de memoria de la cátedra se renderizan directamente en elementos DOM (textContent e innerHTML) sin motor de renderizado matemático (KaTeX/MathJax), ocasionando que comandos LaTeX crudos como `$\rightarrow$` aparecieran literalmente en pantalla frente a los alumnos.
    - **Ajustes Realizados**:
      1. *Sustitución Directa en Banco de Flashcards*: Se identificaron y reemplazaron todas las ocurrencias de `$\rightarrow$` por la flecha Unicode nativa (`→`) en `proyectos/repaso_parcial_1/js/data_flashcards.js` (tarjetas de clasificación de RCIU Tipo I, II y III en Unidad 1; cálculo de dilución de fórmulas 13.5% vs 15% en Unidad 4; y edades seguras para miel, azúcar, sal y carne picada en Unidad 5).
      2. *Filtro Sanitizador Preventivo en el Motor de Renderizado (`cleanLatexSymbols`)*: Se incorporó la función defensiva `cleanLatexSymbols(str)` en `app.js` tanto de 1° Parcial como de 2° Parcial, transformando de forma automática símbolos matemáticos comunes (`\rightarrow` / `\to` → `→`, `\leftarrow` → `←`, `\ge` / `\geq` → `≥`, `\le` / `\leq` → `≤`, `\approx` → `≈`, `\pm` → `±`, `\times` → `×`, `^\circ` → `°`, y limpiando delimitadores de dólar sueltos).
      3. *Blindaje de Visualización en Preguntas, Pistas, Respuestas y Puntos Clave*: Se aplicó `cleanLatexSymbols` al asignar el texto de preguntas (`qTextEl`), pistas (`hintEl`), respuestas (`aTextEl`) y lista de puntos clave (`keyPointsContainer`).
      4. *Actualización de Cache Busters*: Se incrementaron a `?v=5.4` en Parcial 1 y `?v=5.3` en Parcial 2 para garantizar la actualización en navegadores móviles.

60. **Generación de Instrumento de Evaluación Práctica en PDF de 1 Sola Carilla (03/11/2026)**:
    - **Contexto**: Germán solicitó: *"ahora puedes generar un pdf de 1 sola carilla para preguntas de la parte practica (saca 5 preguntas de las que subimos a la plataforma) y dejame el archivo pdf en la carpeta del proyecto"*. Se requería un instrumento impreso o digital de evaluación rápida (1 sola carilla A4) basado estrictamente en el banco oficial de preguntas prácticas de la plataforma (`PRACTICAL_QUIZ_DATA`).
    - **Selección de Preguntas Prácticas**:
      1. *Seguridad Microbiológica y Temperatura (OMS/FAO)*: Necesidad de agua a ~70 °C para inactivar *Cronobacter sakazakii* y *Salmonella*.
      2. *Osmolaridad y Fisiología Renal*: Regla estricta de verter agua antes que polvo para evitar fórmulas hiperconcentradas y deshidratación hipernatrémica.
      3. *Dosificación y Dilución Reglamentaria*: Medida al ras sin compactar (1 medida cada 30 ml de agua potable).
      4. *Técnica de Mezcla Palmar vs Coctelera*: Prohibición de agitación vertical vigorosa para evitar incorporación de microburbujas, aerofagia y cólicos.
      5. *Evaluación Antropométrica Gestacional (Calvo et al., 2009)*: Diagnóstico nutricional puntual por edad gestacional sin requerir peso pregestacional.
    - **Diseño Tipográfico y Estricto Límite de 1 Carilla**:
      - Desarrollado con ReportLab en Python (`proyectos/repaso_parcial_1/generar_pdf_evaluacion.py`).
      - Identidad institucional oficial de la UNSTA con escudo/logo oficial (`iconos/logo.png`), campos de identificación del alumno (Nombre, Legajo/DNI, Comisión, Fecha, Calificación).
      - Tabla de control de respuestas y firmas (Estudiante y Docente) en el pie para agilizar la corrección presencial.
      - Ajuste milimétrico de tipografía, leading e interlineado para garantizar que la carilla finalice exactamente a 802.49 pt de 841.89 pt (margen inferior libre de 39.4 pt), asegurando el 100% de cumplimiento de 1 sola carilla.
    - **Entregables**:
      - Hoja de Examen del Alumno: `proyectos/repaso_parcial_1/evaluacion_practica_1_parcial.pdf` y `evaluacion_practica_1_parcial.pdf`.
      - Hoja de Corrección y Clave Docente: `evaluacion_practica_1_parcial_CLAVE_DOCENTE.pdf`.

61. **Generación de Instrumento Oficial para "Recuperatorio 2° Parcial Práctica" (03/11/2026)**:
    - **Contexto**: Germán solicitó: *"muy bien ahora podrias hacer el mismo formato para sacar un parcial del tema 2 combinando preguntas entre el tema 1 y 2 (solo 5 preguntas) ponle de titulo recuperatorio 2 parcial"* y con el formato sobrio idéntico al examen impreso real (blanco y negro estricto, sin colores, con la grilla de corrección `[ ] A [ ] B [ ] C [ ] D` arriba junto con las instrucciones y el casillero de nota final / 10 puntos, ocupando estrictamente 1 sola carilla).
    - **Banco de Preguntas Oficiales Utilizadas**:
      1. *Circunferencia de Cintura según OMS*: Localización en punto medio entre última costilla palpable y cresta ilíaca (Tema 2, Q4).
      2. *Punto Mesobraquial para Perímetro Braquial*: Medición entre acromion y olécranon con brazo flexionado a 90° (Tema 1, Q3 / Tema 2, Q10).
      3. *Fase Respiratoria para Medición de Cintura*: Al final de una espiración normal, no forzada (Tema 1, Q4 / Tema 2, Q2).
      4. *Algas y Vitamina B12*: Presencia mayoritaria de pseudovitamina B12 (análogos inactivos biológicamente) (Tema 1, Q6 / Tema 2, Q5).
      5. *Biodisponibilidad de Hierro No Hémico*: Asociación con vitamina C (ácido ascórbico) en crudo para reducir férrico a ferroso (Tema 1, Q10 / Tema 2, Q9).
    - **Arquitectura y Formato**:
      - Script: `catedra/parciales/generar_pdf_recuperatorio.py`.
      - Diseño: Encabezado institucional de la UNSTA a la izquierda, título en mayúsculas a la derecha (`RECUPERATORIO 2° PARCIAL`), línea para Apellido y Nombre y UP.
      - Grilla superior dividida en dos bloques: izquierda con tabla compacta de marcado de opciones A, B, C, D; derecha con instrucciones breves y recuadro de calificación (`NOTA FINAL: ___ / 10 PUNTOS (Cada pregunta vale 2 puntos)`).
      - Altura total ajustada a 679.68 pt (de 841.89 pt), garantizando un margen libre amplio y 1 sola carilla sin desbordes.
    - **Entregables**:
      - Versión Alumno: `recuperatorio_2_parcial_practica.pdf` (en raíz y en `catedra/parciales/`).
      - Versión Docente con Clave: `recuperatorio_2_parcial_practica_CLAVE_DOCENTE.pdf`.

62. **Criterio Vinculante de Promoción y Recuperatorios (Precedente Mohedano - Gallardo)**:
    - **Contexto**: Consulta y captura de correo oficial enviada por una alumna (Felicitas Gallardo) a la profesora titular Mariana Mohedano: *"Que tal profe, yo en el primer parcial de nutrición me saqué un 2 y en este me saqué un 8, y el miércoles 4 recupero el primer parcial. Tengo una duda, me saque la nota que me saque igualmente ya perdí la promoción? Es decir debo aprobar para regular?"*.
    - **Respuesta Escrita Oficial de la Titular (Mariana Mohedano)**:
      - *"Si sacas 7 o mas promocionas"*
      - *"Si sacas, 5 o 6 regularizas"*
      - *"Si sacas menos de 2 quedas libre"*
    - **Criterio Institucional Establecido**:
      - La obtención de un aplazo (nota 2) en primera instancia en uno de los parciales **NO inhabilita la promoción** si en la instancia de recuperación se obtiene una calificación de 7 o superior.
      - Al no existir ninguna cláusula restrictiva por escrito en el programa ni advertencia reglamentaria previa, y mediando confirmación escrita formal por la titular, el recuperatorio reemplaza la nota reprobada a todos los efectos del régimen de promoción directa.

63. **Estandarización de Grilla con Marcado en 'X', Clave 'C' Unificada y Carpeta `recuperatorios/` (03/11/2026)**:
    - **Contexto**: Germán solicitó: *"en este podrias modificar la grilla para que sea que tengan que poner una x al igual que el recuperatorio del 2 parcial. una cosa mas ponme ambos parciales en una carpeta que diga recuperatorios. y que las opciones coincidan siempre que las respuestas correctas sean todas C"*.
    - **Ajustes y Reingeniería Aplicada**:
      1. *Estandarización de Grilla*: Se unificó el encabezado del Recuperatorio 1° Parcial para que coincida exactamente con el formato oficial del 2° Parcial: grilla superior con filas para Pregunta 1 a 5 y columnas A, B, C, D con casilleros `[ ] A`, `[ ] B`, `[ ] C`, `[ ] D`, recuadro de calificación `NOTA FINAL / 10 PUNTOS` e instrucciones claras de marcado con 'X'.
      2. *Patrón de Corrección Unificado (Todas Respuestas 'C')*: En AMBOS recuperatorios (1° y 2° Parcial), todas las 5 preguntas prácticas fueron reordenadas para que la opción correcta sea siempre y sin excepción la letra **`c)`**. En las versiones de Clave Docente, la grilla superior resalta `[X] C` en negrita en todas las filas y en el cuerpo del examen aparece `[X]` en la opción c).
      3. *Carpeta Centralizada `recuperatorios/`*: Se creó el directorio dedicado `recuperatorios/` en la raíz del proyecto conteniendo:
         - `recuperatorio_1_parcial_practica.pdf` (Versión Alumno)
         - `recuperatorio_1_parcial_practica_CLAVE_DOCENTE.pdf` (Versión Docente)
         - `recuperatorio_2_parcial_practica.pdf` (Versión Alumno)
         - `recuperatorio_2_parcial_practica_CLAVE_DOCENTE.pdf` (Versión Docente)
      4. *Cumplimiento Estricto de 1 Carilla*: Verificado mediante script `generar_recuperatorios.py` y PyMuPDF asegurando 1 página exacta en cada PDF.


---

### [2026-11-08] Optimización y Corrección del Buzón de Entrega del TP Integrador Final

1. **Diagnóstico del Envío de TPs Integradores**:
   - **Envío registrado**: El Grupo 1 ya había entregado correctamente el 01/11/2026 a las 17:04 hs con 6 integrantes y enlace a Google Drive.
   - **Falla de Firestore Rules corregida**: La colección `tp_integrador_submissions` no contaba con regla explícita de creación/actualización para estudiantes sin rol docente en `firestore.rules`. Al intentar enviar, arrojaba error de permisos que detenía la persistencia en `grupos`. Se agregaron las reglas pertinentes y se desplegaron a Firebase (`firebase deploy --only firestore:rules`).
   - **Sincronización en Vivo**: Se integró `window.syncTpIntegradorSubmissions()` y escucha activa (`onSnapshot`) sobre `tp_integrador_submissions` para que tanto la planilla docente como el estado de entrega reflejen la base de datos de Firestore en tiempo real.

2. **Retiro de Evaluaciones Parciales Pasadas**:
   - A pedido de Germán, se removieron los accesos y botones al **1° Parcial** y **2° Parcial** de la barra de navegación superior (desktop y mobile), del menú lateral desplegable y del grid interactivo del dashboard principal.

3. **Cartel de Entrada y Priorización Visual**:
   - Se implementó un cartel emergente grande (`#modal-tpi-announcement`) con diseño glassmorphism ámbar/dorado, que avisa a los alumnos sobre la apertura del buzón de entrega del TP Integrador con instrucciones claras (enlace en Google Drive en modo Lector, clave de grupo y confirmación de integrantes).
   - Se colocó un banner superior persistente en el Inicio (`#tpi-urgent-top-banner`) y se posicionó la tarjeta del **TP Integrador Final** en el primer lugar destacado de la cuadrícula interactiva.
   - Se añadió un botón de acceso directo en la barra superior tanto para computadoras como para celulares.

---

### [2026-11-10] Selector Manual de Caso Clínico en Entrega de TP Integrador y Corrección de Auto-detección de Grupo

1. **Bug de Detección Automática de Caso (`parseInt("g_X")`)**:
   - En `displayTpIntegradorDashboardView()`, `parseInt(stGroup)` devolvía `NaN` porque los grupos en Firestore tienen formato `"g_1"`, `"g_17"`, etc., provocando que a todos los estudiantes se les abriera por defecto el Caso 1.
   - Se corrigió extrayendo el número con `.replace(/\D/g, '')` y priorizando el `caseNum` guardado en la entrega del grupo si ya existe.

2. **Selector Libre de Caso Clínico (Criterio de Germán)**:
   - A pedido de Germán (*"que puedan seleccionar"*), se desacopló la asignación fija de caso por número de grupo en el formulario de entrega.
   - Se agregó el desplegable obligatorio `#tpi-case-select` (*"3. Caso Clínico Trabajado"*) con los 4 casos reales (incluida la unificación de nombre del Caso 4 a *"Caso 4: Mariana y Sofía"* en `getTpiCaseByNum`).
   - Los campos `caseNum` y `caseName` se persisten en `tp_integrador_submissions` y `grupos`, y tanto la **Planilla Docente** (`loadTpIntegradorTeacherTable`) como la exportación CSV (`exportTpiSubmissionsCSV`) muestran el caso efectivamente elegido por cada grupo.
   - Se actualizaron `version.json` a `2026.11.10.v120` y los rótulos de las pestañas de casos (`Grupos base: ...`).
