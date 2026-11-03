/**
 * CONTROLADOR PRINCIPAL - 1° PARCIAL TEÓRICO (UNSTA)
 * Cátedra de Nutrición Infantil - Docentes: Lic. Mariana Mohedano & Lic. Germán
 * 
 * Arquitectura de 5 Unidades y 10 Parciales de Dominio:
 * - Sección 1: Tarjetas & Recortes de Diapositivas (Repetición Espaciada Anki)
 * - Sección 2: Tablero de Dominio de 10 Parciales & Examen Oral con IA
 * - Sección 3: Calculadora Clínica de Biberones & Galería de Diapositivas Oficiales
 * - Sección 4: Dominio Integral & XP
 */

document.addEventListener("DOMContentLoaded", () => {
  const sm = window.storageManager;
  const audio = window.audioEngine;
  const recorder = window.audioRecorderEngine;
  const ai = window.aiEvaluator;

  // Asegurar compatibilidad de métodos en storageManager
  if (sm) {
    if (!sm.getCardBox) sm.getCardBox = sm.getCardState.bind(sm);
    if (!sm.setCardBox) sm.setCardBox = sm.setCardState.bind(sm);
  }

  // ESTADO GLOBAL DE PESTAÑAS
  let currentSection = "repaso";

  // ESTADO: SECCIÓN 1 - MAZO DE REPASO
  let activeDeckKey = "all";
  let studyQueue = [];
  let currentCard = null;
  let isCardFlipped = false;
  let sessionSeenCardIds = new Set();
  let profAudioPlayer = new Audio();
  let isProfAudioPlaying = false;
  let isScrubbingProfAudio = false;
  let profPlaybackSpeed = 1.0;

  // ESTADO: SECCIÓN 2 - EXÁMENES ORALES (10 PARCIALES)
  let currentOralPartialKey = "u1_p1";
  let oralExamActive = false;
  let oralExamQuestions = [];
  let oralExamCurrentIndex = 0;
  let oralStudentAnswers = []; // [ { question, officialAnswer, keyPoints, slideImage, slideCaption, studentTranscript, audioUrl, durationSecs } ]
  let isRecordingCurrent = false;

  // ESTADO: SECCIÓN 2.1 - EVALUACIÓN PRÁCTICA (OPCIÓN MÚLTIPLE - SIN IA)
  let practicalQuizActive = false;
  let practQuizCurrentIndex = 0;
  let practQuizUserAnswers = [];

  // CATÁLOGO DE TODAS LAS DIAPOSITIVAS OFICIALES (45 SLIDES DE CLASE)
  const ALL_SLIDES = [
    // Unidad 1
    { src: "assets/slides/u1_1000dias_concepto.png", title: "Primeros 1000 Días: Concepto y Periodos (270d + 365d + 365d)", unit: "u1", unitName: "Unidad 1" },
    { src: "assets/slides/u1_1000dias_ventana_oportunidad.png", title: "Ventana de Oportunidad Única y Neurodesarrollo", unit: "u1", unitName: "Unidad 1" },
    { src: "assets/slides/u1_rn_definicion_vital.png", title: "Definición de Nacido Vivo y Límites de Viabilidad", unit: "u1", unitName: "Unidad 1" },
    { src: "assets/slides/u1_rn_caracteristicas_fisiologicas.png", title: "RN Fisiología: Descenso de Peso y Capacidad Gástrica", unit: "u1", unitName: "Unidad 1" },
    { src: "assets/slides/u1_prematuro_definicion.png", title: "Clasificación Gestacional del Recién Nacido", unit: "u1", unitName: "Unidad 1" },
    { src: "assets/slides/u1_prematuro_semanas_clasificacion.png", title: "Clasificación de Prematuros por Semanas Gestacionales", unit: "u1", unitName: "Unidad 1" },
    { src: "assets/slides/u1_prematuro_peso_nacimiento.png", title: "Clasificación por Peso al Nacer (BPN, MBPN, EBPN)", unit: "u1", unitName: "Unidad 1" },
    { src: "assets/slides/u1_rci_tipos_armonico_disarmonico.png", title: "RCI: Tipo I Armónico (1°T) vs Tipo III Disarmónico (3°T)", unit: "u1", unitName: "Unidad 1" },

    // Unidad 2
    { src: "assets/slides/u2_poblacion_referencia_oms_sap.png", title: "Poblaciones de Referencia: OMS 0-6a vs SAP >6a", unit: "u2", unitName: "Unidad 2" },
    { src: "assets/slides/u2_tipos_valoracion_transversal_longitudinal.png", title: "Valoración Transversal vs Longitudinal", unit: "u2", unitName: "Unidad 2" },
    { src: "assets/slides/u2_diagnostico_zscore_oms.png", title: "Diagnóstico Nutricional por Puntuación Z (OMS 2006)", unit: "u2", unitName: "Unidad 2" },
    { src: "assets/slides/u2_curva_peso_edad_oms.png", title: "Curvas de Crecimiento OMS (Peso/Edad, Talla/Edad)", unit: "u2", unitName: "Unidad 2" },
    { src: "assets/slides/u2_adiposidad_percentilos.png", title: "Percentilos de Adiposidad e IMC/Edad (Sobrepeso ≥85, Obesidad ≥97)", unit: "u2", unitName: "Unidad 2" },
    { src: "assets/slides/u2_requerimientos_caloricos_fao.png", title: "Requerimientos Energéticos y Proteicos Pediátricos (FAO/OMS)", unit: "u2", unitName: "Unidad 2" },

    // Unidad 3
    { src: "assets/slides/u3_lme_definicion_oms.png", title: "Definición Oficial de Lactancia Materna Exclusiva (OMS)", unit: "u3", unitName: "Unidad 3" },
    { src: "assets/slides/u3_control_endocrino_prolactina_oxitocina.png", title: "Control Endocrino: Prolactina (Síntesis) vs Oxitocina (Eyección)", unit: "u3", unitName: "Unidad 3" },
    { src: "assets/slides/u3_mantenimiento_fil.png", title: "Control Autócrino: Factor Inhibidor de la Lactancia (FIL)", unit: "u3", unitName: "Unidad 3" },
    { src: "assets/slides/u3_cronologia_leches.png", title: "Cronología de la Leche Materna (Calostro, Transición, Madura)", unit: "u3", unitName: "Unidad 3" },
    { src: "assets/slides/u3_calostro_composicion.png", title: "Composición Bioquímica del Calostro (IgA, Sodio, Betacarotenos)", unit: "u3", unitName: "Unidad 3" },
    { src: "assets/slides/u3_calostro_ventajas.png", title: "Ventajas Inmunológicas y Efecto Laxante del Calostro", unit: "u3", unitName: "Unidad 3" },
    { src: "assets/slides/u3_leche_transicion_pretermino.png", title: "Leche Pretérmino y Necesidad de Fortificadores (FLM)", unit: "u3", unitName: "Unidad 3" },
    { src: "assets/slides/u3_leche_madura_propiedades.png", title: "Leche Madura: Fracción Inicial vs Fracción Final (Grasa)", unit: "u3", unitName: "Unidad 3" },
    { src: "assets/slides/u3_comparacion_humana_vaca.png", title: "Comparación Crítica: Leche Humana vs Leche de Vaca (40/60 vs 80/20)", unit: "u3", unitName: "Unidad 3" },
    { src: "assets/slides/u3_hierro_biodisponibilidad.png", title: "Biodisponibilidad de Hierro (50% en leche humana vs 10% en vaca)", unit: "u3", unitName: "Unidad 3" },
    { src: "assets/slides/u3_contraindicaciones_lactancia.png", title: "Contraindicaciones Absolutas de la Lactancia (VIH, HTLV, Galactosemia)", unit: "u3", unitName: "Unidad 3" },

    // Unidad 4
    { src: "assets/slides/u4_peso_medidas_enrase.png", title: "Gramaje por Medida (4.5g vs 5g) y Enrase al Ras Oficial", unit: "u4", unitName: "Unidad 4" },
    { src: "assets/slides/u4_dilucion_biberones.png", title: "Reglas de Reconstitución: 1 medida cada 30 cc de agua", unit: "u4", unitName: "Unidad 4" },
    { src: "assets/slides/u4_calculo_dilucion_13_15.png", title: "Cálculo de Dilución Estándar: Inicio 13.5% vs Continuación 15%", unit: "u4", unitName: "Unidad 4" },
    { src: "assets/slides/u4_concentraciones_modulos_sonda.png", title: "Dilución Concentrada (4 med), Tope (5 med) y Prohibición AR en SNG", unit: "u4", unitName: "Unidad 4" },
    { src: "assets/slides/u4_formulas_especiales_aplv.png", title: "Fórmulas Especiales para APLV (Extensamente Hidrolizadas y Aminoácidos)", unit: "u4", unitName: "Unidad 4" },
    { src: "assets/slides/u4_formulas_especiales_monogen_ar.png", title: "Fórmulas Especiales (Monogen con TCM y Anti-Reflujo)", unit: "u4", unitName: "Unidad 4" },
    { src: "assets/slides/u4_modulos_nutrientes.png", title: "Módulos de Nutrientes (Calóricos, Proteicos y Lipídicos)", unit: "u4", unitName: "Unidad 4" },
    { src: "assets/slides/u4_suplementos_pediatricos.png", title: "Suplementos Pediátricos y Densidad Energética", unit: "u4", unitName: "Unidad 4" },
    { src: "assets/slides/u4_tabla_comparativa_marcas.png", title: "Tabla Comparativa de Fórmulas y Marcas de Mercado", unit: "u4", unitName: "Unidad 4" },

    // Unidad 5
    { src: "assets/slides/u5_proporcion_leche_alimentos.png", title: "Proporción Energética: Leche vs Alimentos Complementarios", unit: "u5", unitName: "Unidad 5" },
    { src: "assets/slides/u5_biberones_datos_clave.png", title: "Datos Clave de Biberones y Densidad Calórica", unit: "u5", unitName: "Unidad 5" },
    { src: "assets/slides/u5_consistencias_5_etapas.png", title: "Las 5 Consistencias Progresivas de los Alimentos", unit: "u5", unitName: "Unidad 5" },
    { src: "assets/slides/u5_cronograma_introduccion.png", title: "Cronograma Oficial de Introducción de Alimentos", unit: "u5", unitName: "Unidad 5" },
    { src: "assets/slides/u5_comida_completa_cuadrantes.png", title: "El Plato Completo y Cuadrantes de Nutrientes", unit: "u5", unitName: "Unidad 5" },
    { src: "assets/slides/u5_diversidad_dietetica_mdd.png", title: "Puntuación de Diversidad Dietética Mínima (MDD: 5 de 8 grupos)", unit: "u5", unitName: "Unidad 5" },
    { src: "assets/slides/u5_alimentos_atencion_prohibidos.png", title: "Tabla de 'Atención': Miel, Sal, Azúcar y Carne Molida <5 años (SUH)", unit: "u5", unitName: "Unidad 5" },
    { src: "assets/slides/u5_alimentos_esfericos_asfixia.png", title: "Alimentos Esféricos Críticos y Prevención de Asfixia", unit: "u5", unitName: "Unidad 5" },
    { src: "assets/slides/u5_blw_definicion.png", title: "Concepto y Beneficios del Método BLW (Baby-Led Weaning)", unit: "u5", unitName: "Unidad 5" },
    { src: "assets/slides/u5_blw_seguridad_pautas.png", title: "6 Pautas de Seguridad Estricta para Práctica de BLW", unit: "u5", unitName: "Unidad 5" },
    { src: "assets/slides/u5_alimentacion_perceptiva_3pasos.png", title: "Los 3 Pasos de la Alimentación Perceptiva", unit: "u5", unitName: "Unidad 5" },

    // Módulo Práctico (Taller de Mamaderas & Curvas Calvo / IOM)
    { src: "assets/slides/pract_mamadera_agua_primero.png", title: "Taller Práctico: Protocolo y Regla del Agua Primero", unit: "pract", unitName: "Módulo Práctico" },
    { src: "assets/slides/pract_mamadera_agua_70c.png", title: "Taller Práctico: Temperatura Bactericida de 70 °C (Cronobacter/Salmonella)", unit: "pract", unitName: "Módulo Práctico" },
    { src: "assets/slides/pract_mamadera_medida_polvo.png", title: "Taller Práctico: Medida al Ras sin Compactar (1 medida / 30 ml)", unit: "pract", unitName: "Módulo Práctico" },
    { src: "assets/slides/pract_mamadera_temperatura.png", title: "Taller Práctico: Comprobación de Temperatura en Muñeca (~37 °C)", unit: "pract", unitName: "Módulo Práctico" },
    { src: "assets/slides/pract_mamadera_descarte.png", title: "Taller Práctico: Descarte Obligatorio del Sobrante a los 60 Minutos", unit: "pract", unitName: "Módulo Práctico" },
    { src: "assets/slides/pract_calvo_curva_imc.png", title: "Gráfica de Calvo et al. (2009): IMC materno según Edad Gestacional (-1 SD a +2 SD)", unit: "pract", unitName: "Módulo Práctico" },
    { src: "assets/slides/pract_calvo_utilidad_clinica.png", title: "Utilidad Clínica de Calvo: Diagnóstico en Cualquier Semana y Riesgo Perinatal", unit: "pract", unitName: "Módulo Práctico" },
    { src: "assets/slides/pract_iom_metas_peso.png", title: "Metas IOM (2009): Ganancia de Peso Gestacional Total y Tasa Semanal", unit: "pract", unitName: "Módulo Práctico" },
    { src: "assets/slides/pract_calvo_vs_iom_cuadro.png", title: "Complementariedad Clínica: Calvo (¿Dónde está?) vs. IOM (¿Cuánto debe subir?)", unit: "pract", unitName: "Módulo Práctico" }
  ];

  // METADATOS DE LAS 5 UNIDADES DIDÁCTICAS
  const UNITS_META = [
    {
      unit: 1,
      title: "UNIDAD 1: Primeros 1000 Días y Recién Nacido",
      desc: "Ventana crítica de los 1000 días, fisiología neonatal, clasificación gestacional, prematuros (RNPT), edad corregida y fortificadores.",
      icon: "fa-baby",
      color: "from-blue-600 to-indigo-700",
      partials: ["u1_p1", "u1_p2"]
    },
    {
      unit: 2,
      title: "UNIDAD 2: Valoración Antropométrica y Requerimientos",
      desc: "Curvas OMS 2006 (0-6a) vs SAP (>6a), diagnóstico por Puntuación Z, percentilos de adiposidad y requerimientos FAO/OMS.",
      icon: "fa-chart-line",
      color: "from-indigo-600 to-purple-700",
      partials: ["u2_p1", "u2_p2"]
    },
    {
      unit: 3,
      title: "UNIDAD 3: Fisiología de la Lactancia Materna",
      desc: "Control endocrino (Prolactina/Oxitocina), control autócrino local (FIL), calostro vs madura vs vaca y contraindicaciones médicas.",
      icon: "fa-person-breastfeeding",
      color: "from-purple-600 to-pink-700",
      partials: ["u3_p1", "u3_p2"]
    },
    {
      unit: 4,
      title: "UNIDAD 4: Formulación Pediátrica y Soporte Enteral",
      desc: "Reconstitución con cuchara al ras (4.5g vs 5g), dilución 13.5% vs 15%, fórmulas especiales (APLV, Monogen, AR en SNG) y módulos.",
      icon: "fa-bottle-droplet",
      color: "from-cyan-600 to-teal-700",
      partials: ["u4_p1", "u4_p2"]
    },
    {
      unit: 5,
      title: "UNIDAD 5: Alimentación Complementaria (AC)",
      desc: "Inicio a los 6 meses, proporciones calóricas, 5 texturas, cronograma, alimentos prohibidos (miel, sal, azúcar, carne picada <5a por SUH) y BLW seguro.",
      icon: "fa-bowl-rice",
      color: "from-emerald-600 to-teal-800",
      partials: ["u5_p1", "u5_p2"]
    },
    {
      unit: "P",
      title: "MÓDULO PRÁCTICO: Taller de Mamaderas & Curvas Calvo / IOM",
      desc: "Puntos críticos de preparación higiénica de biberones (70 °C, agua primero, rotación no coctelera, descarte a los 60 min) y evaluación gestacional con Calvo et al. e IOM.",
      icon: "fa-bottle-droplet",
      color: "from-amber-600 to-rose-700",
      partials: ["pract_1"]
    }
  ];

  // Leer parámetros de URL (autenticación y navegación desde portal central)
  let paramTab = null;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const paramUp = urlParams.get('up');
    const paramName = urlParams.get('name');
    paramTab = urlParams.get('tab');
    if (paramUp && paramUp !== 'undefined' && paramUp !== 'null') {
      const studentName = (paramName && paramName !== 'undefined' && paramName !== 'null') ? decodeURIComponent(paramName) : (sm.state.studentName || "Estudiante UNSTA");
      sm.setStudentInfo(studentName, paramUp);
    }
  } catch(e) {
    console.warn("Error leyendo parametros de URL:", e);
  }

  // INICIALIZACIÓN
  initHeaderStats();
  setupSectionNavigation();
  if (paramTab && (paramTab === 'evaluacion' || paramTab === 'repaso' || paramTab === 'herramientas' || paramTab === 'ranking')) {
    window.switchTab(paramTab);
  }
  setupRepasoDeck();
  setupOralExamDashboard();
  setupPracticalQuiz();
  setupCalculadora();
  setupSlidesGallery();
  setupKeyboardShortcuts();

  // Animación del ecualizador cuando el sintetizador de voz está activo
  if (audio) {
    audio.onStateChange = (speaking) => {
      const waveEl = document.getElementById("audioWaveIndicator");
      if (waveEl) {
        if (speaking) waveEl.classList.remove("hidden");
        else waveEl.classList.add("hidden");
      }
    };
  }

  /* ==========================================================================
     1. ENCABEZADO Y NAVEGACIÓN EN 4 PESTAÑAS
     ========================================================================== */
  function initHeaderStats() {
    const state = sm.state;
    const xpEl = document.getElementById("headerXP");
    const streakEl = document.getElementById("headerStreak");
    const studentNameEl = document.getElementById("headerStudentName");
    const nameInput = document.getElementById("oralStudentNameInput");
    const upInput = document.getElementById("oralStudentUpInput");

    if (xpEl) xpEl.textContent = `${state.xp || 0} XP`;
    if (streakEl) streakEl.textContent = `${state.streakDays || 1} d`;

    if (studentNameEl) {
      studentNameEl.textContent = state.studentName
        ? `${state.studentName} (${state.up || "UNSTA"})`
        : "Estudiante UNSTA";
    }

    if (nameInput && state.studentName) nameInput.value = state.studentName;
    if (upInput && state.up) upInput.value = state.up;

    const editUserBtn = document.getElementById("editStudentInfoBtn");
    if (editUserBtn && !editUserBtn.dataset.bound) {
      editUserBtn.dataset.bound = "true";
      editUserBtn.addEventListener("click", () => {
        const name = prompt("Ingresa tu Nombre y Apellido:", sm.state.studentName || "");
        if (name !== null) {
          const up = prompt("Ingresa tu UP / Legajo:", sm.state.up || "");
          sm.setStudentInfo(name, up || "");
          initHeaderStats();
          updateOralDashboardUI();
        }
      });
    }

    if (nameInput && !nameInput.dataset.bound) {
      nameInput.dataset.bound = "true";
      nameInput.addEventListener("change", () => {
        sm.setStudentInfo(nameInput.value, upInput ? upInput.value : "");
        initHeaderStats();
      });
    }

    if (upInput && !upInput.dataset.bound) {
      upInput.dataset.bound = "true";
      upInput.addEventListener("change", () => {
        sm.setStudentInfo(nameInput ? nameInput.value : "", upInput.value);
        initHeaderStats();
      });
    }
  }

  function setupSectionNavigation() {
    const btnRepaso = document.getElementById("tabBtn_repaso");
    const btnEvaluacion = document.getElementById("tabBtn_evaluacion");
    const btnHerramientas = document.getElementById("tabBtn_herramientas");
    const btnRanking = document.getElementById("tabBtn_ranking");

    const secRepaso = document.getElementById("section_repaso");
    const secEvaluacion = document.getElementById("section_evaluacion");
    const secHerramientas = document.getElementById("section_herramientas");
    const secRanking = document.getElementById("section_ranking");

    const setActiveTab = (tab) => {
      currentSection = tab;
      const activeClass = "flex-1 py-2.5 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-1 sm:space-x-2 transition shadow-md bg-indigo-600 text-white cursor-pointer";
      const inactiveClass = "flex-1 py-2.5 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-1 sm:space-x-2 transition text-slate-400 hover:bg-slate-800 cursor-pointer";

      if (btnRepaso) btnRepaso.className = (tab === 'repaso') ? activeClass : inactiveClass;
      if (btnEvaluacion) btnEvaluacion.className = (tab === 'evaluacion') ? activeClass : inactiveClass;
      if (btnHerramientas) btnHerramientas.className = (tab === 'herramientas') ? activeClass : inactiveClass;
      if (btnRanking) btnRanking.className = (tab === 'ranking') ? activeClass : inactiveClass;

      if (secRepaso) secRepaso.classList.toggle("hidden", tab !== 'repaso');
      if (secEvaluacion) secEvaluacion.classList.toggle("hidden", tab !== 'evaluacion');
      if (secHerramientas) secHerramientas.classList.toggle("hidden", tab !== 'herramientas');
      if (secRanking) secRanking.classList.toggle("hidden", tab !== 'ranking');
    };

    window.switchTab = (tab) => {
      console.log(`[Navigation] Cambiando a pestaña: ${tab}`);
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: "smooth" });

      if (tab === "evaluacion") {
        if (!oralExamActive) {
          showOralDashboardScreen();
        }
        updateOralDashboardUI();
      } else if (tab === "ranking") {
        updateRankingUI();
      }
    };

    if (btnRepaso) btnRepaso.addEventListener("click", () => window.switchTab("repaso"));
    if (btnEvaluacion) btnEvaluacion.addEventListener("click", () => window.switchTab("evaluacion"));
    if (btnHerramientas) btnHerramientas.addEventListener("click", () => window.switchTab("herramientas"));
    if (btnRanking) btnRanking.addEventListener("click", () => window.switchTab("ranking"));
  }

  /* ==========================================================================
     2. SECCIÓN 1: TARJETAS & RECORTES DE DIAPOSITIVAS (ANKI)
     ========================================================================== */
  function setupRepasoDeck() {
    const deckSelect = document.getElementById("deckSelectorSelect");
    if (deckSelect) {
      deckSelect.addEventListener("change", (e) => {
        activeDeckKey = e.target.value;
        loadStudyQueue();
        renderCurrentCard();
      });
    }

    const btnFlipToAnswer = document.getElementById("btnFlipToAnswer");
    const btnFlipBack = document.getElementById("btnFlipBackToQuestion");

    if (btnFlipToAnswer) {
      btnFlipToAnswer.addEventListener("click", () => flipCard(true));
    }
    if (btnFlipBack) {
      btnFlipBack.addEventListener("click", () => flipCard(false));
    }

    const btnAgain = document.getElementById("btnAnkiAgain");
    const btnHard = document.getElementById("btnAnkiHard");
    const btnGood = document.getElementById("btnAnkiGood");

    if (btnAgain) btnAgain.addEventListener("click", () => handleGradeCard("again"));
    if (btnHard) btnHard.addEventListener("click", () => handleGradeCard("hard"));
    if (btnGood) btnGood.addEventListener("click", () => handleGradeCard("good"));

    const btnPrev = document.getElementById("cardPrevBtn");
    const btnNext = document.getElementById("cardNextBtn");
    if (btnPrev) btnPrev.addEventListener("click", () => cycleQueue(-1));
    if (btnNext) btnNext.addEventListener("click", () => cycleQueue(1));

    const btnRestart = document.getElementById("btnRestartDeck");
    if (btnRestart) {
      btnRestart.addEventListener("click", () => {
        sessionSeenCardIds.clear();
        loadStudyQueue(true);
        renderCurrentCard();
      });
    }

    const quickResetBtns = [document.getElementById("btnStudyResetAll"), document.getElementById("btnStudyResetAllBack")];
    quickResetBtns.forEach(btn => {
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          sessionSeenCardIds.clear();
          loadStudyQueue(true);
          renderCurrentCard();
        });
      }
    });

    const speakQBtn = document.getElementById("speakQuestionBtn");
    const speakABtn = document.getElementById("speakAnswerBtn");

    if (speakQBtn) {
      speakQBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (profAudioPlayer) profAudioPlayer.pause();
        if (currentCard && audio) audio.speak(`Pregunta: ${currentCard.question}`);
      });
    }
    if (speakABtn) {
      speakABtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (profAudioPlayer) profAudioPlayer.pause();
        if (currentCard && audio) audio.speak(`Respuesta oficial: ${currentCard.answer}`);
      });
    }

    // Reproductor de Audio Real de la Profesora Mariana Mohedano (Estilo WhatsApp con Deslizador)
    const btnPlayProf = document.getElementById("btnPlayProfAudio");
    const profSlider = document.getElementById("profAudioSlider");
    const btnSpeed = document.getElementById("btnProfAudioSpeed");

    if (btnPlayProf) {
      btnPlayProf.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!currentCard || !currentCard.profAudio) return;

        if (isProfAudioPlaying) {
          profAudioPlayer.pause();
          isProfAudioPlaying = false;
          updateProfAudioUI(false);
        } else {
          if (audio) audio.stop(); // Silenciar TTS
          
          // Si el audio terminó, reiniciar desde el segundo 0
          if (profAudioPlayer.ended) {
            profAudioPlayer.currentTime = 0;
          }
          // Asignar fuente solo si no estaba ya asignada a esta tarjeta
          if (!profAudioPlayer.src || !profAudioPlayer.src.includes(currentCard.profAudio)) {
            profAudioPlayer.src = currentCard.profAudio;
          }
          profAudioPlayer.playbackRate = profPlaybackSpeed;
          profAudioPlayer.play().then(() => {
            isProfAudioPlaying = true;
            updateProfAudioUI(true);
          }).catch(err => {
            console.warn("Error reproduciendo audio de la profesora:", err);
          });
        }
      });
    }

    if (btnSpeed) {
      btnSpeed.addEventListener("click", (e) => {
        e.stopPropagation();
        if (profPlaybackSpeed === 1.0) profPlaybackSpeed = 1.25;
        else if (profPlaybackSpeed === 1.25) profPlaybackSpeed = 1.5;
        else if (profPlaybackSpeed === 1.5) profPlaybackSpeed = 2.0;
        else profPlaybackSpeed = 1.0;

        profAudioPlayer.playbackRate = profPlaybackSpeed;
        btnSpeed.textContent = `${profPlaybackSpeed}x`;
      });
    }

    // Deslizador interactivo estilo WhatsApp (soporta arrastre táctil y mouse fluido)
    if (profSlider) {
      profSlider.addEventListener("input", (e) => {
        isScrubbingProfAudio = true;
        const pct = parseFloat(profSlider.value);
        profSlider.style.background = `linear-gradient(to right, #a855f7 0%, #a855f7 ${pct}%, #334155 ${pct}%, #334155 100%)`;

        const dur = profAudioPlayer.duration || 0;
        if (dur > 0) {
          const targetTime = (pct / 100) * dur;
          profAudioPlayer.currentTime = targetTime;
          const timeDisplay = document.getElementById("profAudioTimeDisplay");
          if (timeDisplay) {
            timeDisplay.innerHTML = `${formatSecs(targetTime)} / <span id="profAudioDurationBadge">${formatSecs(dur)}</span>`;
          }
        }
      });

      const endScrub = () => {
        isScrubbingProfAudio = false;
        if (profAudioPlayer && profAudioPlayer.duration) {
          const pct = parseFloat(profSlider.value);
          profAudioPlayer.currentTime = (pct / 100) * profAudioPlayer.duration;
        }
      };

      profSlider.addEventListener("change", endScrub);
      profSlider.addEventListener("mouseup", endScrub);
      profSlider.addEventListener("touchend", endScrub);
      profSlider.addEventListener("pointerup", endScrub);
    }

    profAudioPlayer.onended = () => {
      isProfAudioPlaying = false;
      updateProfAudioUI(false);
      const slider = document.getElementById("profAudioSlider");
      if (slider) {
        slider.value = 0;
        slider.style.background = `linear-gradient(to right, #a855f7 0%, #334155 0%, #334155 100%)`;
      }
      const timeDisplay = document.getElementById("profAudioTimeDisplay");
      if (timeDisplay && profAudioPlayer.duration) {
        timeDisplay.innerHTML = `0:00 / <span id="profAudioDurationBadge">${formatSecs(profAudioPlayer.duration)}</span>`;
      }
    };

    profAudioPlayer.onpause = () => {
      isProfAudioPlaying = false;
      updateProfAudioUI(false);
    };

    profAudioPlayer.ontimeupdate = () => {
      if (isScrubbingProfAudio) return; // No mover el deslizador mientras el usuario lo arrastra
      const cur = profAudioPlayer.currentTime;
      const dur = profAudioPlayer.duration || 1;
      const pct = Math.min(100, Math.max(0, (cur / dur) * 100));
      const slider = document.getElementById("profAudioSlider");
      const timeDisplay = document.getElementById("profAudioTimeDisplay");
      if (slider) {
        slider.value = pct;
        slider.style.background = `linear-gradient(to right, #a855f7 0%, #a855f7 ${pct}%, #334155 ${pct}%, #334155 100%)`;
      }
      if (timeDisplay) {
        timeDisplay.innerHTML = `${formatSecs(cur)} / <span id="profAudioDurationBadge">${formatSecs(dur)}</span>`;
      }
    };

    profAudioPlayer.onloadedmetadata = () => {
      const dur = profAudioPlayer.duration;
      const timeDisplay = document.getElementById("profAudioTimeDisplay");
      if (timeDisplay && dur && !isNaN(dur)) {
        const cur = profAudioPlayer.currentTime || 0;
        timeDisplay.innerHTML = `${formatSecs(cur)} / <span id="profAudioDurationBadge">${formatSecs(dur)}</span>`;
      }
    };

    loadStudyQueue();
    renderCurrentCard();
  }

  function formatSecs(secs) {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function updateProfAudioUI(playing) {
    const icon = document.getElementById("profAudioPlayIcon");
    const wave = document.getElementById("audioWaveIndicator");
    if (icon) {
      icon.className = playing ? "fa-solid fa-pause text-xs" : "fa-solid fa-play text-xs ml-0.5";
    }
    if (wave) {
      if (playing) wave.classList.remove("hidden");
      else wave.classList.add("hidden");
    }
  }

  function getDeckCards(deckKey) {
    let cards = [];
    if (!window.FLASHCARDS_DECKS) return cards;

    if (deckKey === "all") {
      Object.values(window.FLASHCARDS_DECKS).forEach(d => cards.push(...d.cards));
    } else if (deckKey === "imp_high") {
      Object.values(window.FLASHCARDS_DECKS).forEach(d => {
        cards.push(...d.cards.filter(c => c.importance === "high"));
      });
    } else if (deckKey === "imp_medium") {
      Object.values(window.FLASHCARDS_DECKS).forEach(d => {
        cards.push(...d.cards.filter(c => c.importance === "medium"));
      });
    } else if (deckKey === "u1_all") {
      cards.push(...(window.FLASHCARDS_DECKS.u1_p1?.cards || []), ...(window.FLASHCARDS_DECKS.u1_p2?.cards || []));
    } else if (deckKey === "u2_all") {
      cards.push(...(window.FLASHCARDS_DECKS.u2_p1?.cards || []), ...(window.FLASHCARDS_DECKS.u2_p2?.cards || []));
    } else if (deckKey === "u3_all") {
      cards.push(...(window.FLASHCARDS_DECKS.u3_p1?.cards || []), ...(window.FLASHCARDS_DECKS.u3_p2?.cards || []));
    } else if (deckKey === "u4_all") {
      cards.push(...(window.FLASHCARDS_DECKS.u4_p1?.cards || []), ...(window.FLASHCARDS_DECKS.u4_p2?.cards || []));
    } else if (deckKey === "u5_all") {
      cards.push(...(window.FLASHCARDS_DECKS.u5_p1?.cards || []), ...(window.FLASHCARDS_DECKS.u5_p2?.cards || []));
    } else if (deckKey === "pract_all" || deckKey === "pract_1") {
      cards.push(...(window.FLASHCARDS_DECKS.pract_1?.cards || []));
    } else if (window.FLASHCARDS_DECKS[deckKey]) {
      cards = [...window.FLASHCARDS_DECKS[deckKey].cards];
    }
    return cards;
  }

  function loadStudyQueue(forceResetAll = false) {
    const allCards = getDeckCards(activeDeckKey);
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);

    if (forceResetAll) {
      studyQueue = shuffled;
    } else {
      const unmastered = shuffled.filter(c => sm.getCardBox(c.id) !== "box3");
      const mastered = shuffled.filter(c => sm.getCardBox(c.id) === "box3");

      if (unmastered.length > 0) {
        studyQueue = unmastered;
      } else {
        studyQueue = mastered;
      }
    }

    isCardFlipped = false;
    updateDeckCounters();
  }

  function updateDeckCounters() {
    const allCards = getDeckCards(activeDeckKey);
    const masteredCount = allCards.filter(c => sm.getCardBox(c.id) === "box3").length;
    const reviewCards = studyQueue.filter(c => {
      const box = sm.getCardBox(c.id);
      return box === "box2" || (box === "box1" && sessionSeenCardIds.has(c.id));
    }).length;

    const newCards = Math.max(0, studyQueue.length - reviewCards);

    const elNew = document.getElementById("deckCountNew");
    const elReview = document.getElementById("deckCountReview");
    const elMastered = document.getElementById("deckCountMastered");

    if (elNew) elNew.textContent = newCards;
    if (elReview) elReview.textContent = reviewCards;
    if (elMastered) elMastered.textContent = masteredCount;
  }

  function renderCurrentCard() {
    const cardView = document.getElementById("deckCardViewContainer");
    const finishedScreen = document.getElementById("deckFinishedScreen");

    if (studyQueue.length === 0) {
      if (cardView) cardView.classList.add("hidden");
      if (finishedScreen) finishedScreen.classList.remove("hidden");
      updateDeckCounters();
      return;
    }

    if (cardView) cardView.classList.remove("hidden");
    if (finishedScreen) finishedScreen.classList.add("hidden");

    currentCard = studyQueue[0];
    flipCard(false);

    const badgeEl = document.getElementById("flashcardDeckBadge");
    const counterEl = document.getElementById("flashcardCounter");
    const qTextEl = document.getElementById("flashcardQuestionText");
    const hintEl = document.getElementById("flashcardHintText");

    if (badgeEl) {
      const deckObj = window.FLASHCARDS_DECKS[currentCard.deck];
      badgeEl.textContent = deckObj ? deckObj.badge : "Cátedra Nutrición Infantil";
    }

    // Insignias y bordes según importancia de examen
    const impBadgeFront = document.getElementById("flashcardImportanceBadge");
    const impBadgeBack = document.getElementById("flashcardImportanceBadgeBack");
    const frontFace = document.getElementById("flashcardFaceFront");
    const backFace = document.getElementById("flashcardFaceBack");

    const imp = currentCard.importance || "medium";

    if (frontFace && backFace) {
      frontFace.classList.remove("border-amber-500/80", "shadow-amber-500/20", "border-indigo-500/40", "border-slate-800");
      backFace.classList.remove("border-amber-500/80", "shadow-amber-500/20", "border-indigo-500/40", "border-emerald-500/40", "border-slate-800");

      if (imp === "high") {
        frontFace.classList.add("border-amber-500/80", "shadow-amber-500/20");
        backFace.classList.add("border-amber-500/80", "shadow-amber-500/20");
      } else if (imp === "medium") {
        frontFace.classList.add("border-indigo-500/40");
        backFace.classList.add("border-emerald-500/40");
      } else {
        frontFace.classList.add("border-slate-800");
        backFace.classList.add("border-slate-800");
      }
    }

    let impClass = "text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/20 text-amber-300";
    let impText = currentCard.importanceLabel || "🔥 Foco de Examen";

    if (imp === "medium") {
      impClass = "text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/20 text-indigo-300";
    } else if (imp === "low") {
      impClass = "text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-slate-700 bg-slate-800 text-slate-400";
    }

    if (impBadgeFront) {
      impBadgeFront.className = impClass;
      impBadgeFront.textContent = impText;
    }
    if (impBadgeBack) {
      impBadgeBack.className = impClass;
      impBadgeBack.textContent = impText;
    }
    if (counterEl) {
      counterEl.textContent = `${studyQueue.length} restantes`;
    }
    if (qTextEl) {
      qTextEl.textContent = currentCard.question;
    }
    if (hintEl) {
      hintEl.textContent = currentCard.hint || "Piensa en los criterios oficiales de diapositivas antes de voltear.";
    }

    // Cara posterior
    const aTextEl = document.getElementById("flashcardAnswerText");
    const slideContainer = document.getElementById("flashcardSlideContainer");
    const slideImg = document.getElementById("flashcardSlideImage");
    const slideCap = document.getElementById("flashcardSlideCaption");
    const keyPointsContainer = document.getElementById("flashcardKeyPointsList");

    if (aTextEl) {
      aTextEl.textContent = currentCard.answer;
    }

    // Audio de la profesora
    if (profAudioPlayer) {
      profAudioPlayer.pause();
      isProfAudioPlaying = false;
      updateProfAudioUI(false);
    }

    const profContainer = document.getElementById("profAudioContainer");
    const profDurBadge = document.getElementById("profAudioDurationBadge");
    const profSlider = document.getElementById("profAudioSlider");
    const profTime = document.getElementById("profAudioTimeDisplay");

    if (profSlider) {
      profSlider.value = 0;
      profSlider.style.background = `linear-gradient(to right, #a855f7 0%, #334155 0%, #334155 100%)`;
    }

    if (currentCard.profAudio && profContainer) {
      profContainer.classList.remove("hidden");
      profAudioPlayer.src = currentCard.profAudio;
      profAudioPlayer.currentTime = 0;
      profAudioPlayer.playbackRate = profPlaybackSpeed;

      const durStr = currentCard.profAudioDuration || "0:45";
      if (profDurBadge) profDurBadge.textContent = durStr;
      if (profTime) profTime.innerHTML = `0:00 / <span id="profAudioDurationBadge">${durStr}</span>`;
    } else if (profContainer) {
      profContainer.classList.add("hidden");
    }

    // Renderizado del Recorte de Diapositiva
    if (currentCard.slideImage && slideContainer && slideImg) {
      slideContainer.classList.remove("hidden");
      slideImg.src = currentCard.slideImage;
      slideImg.alt = currentCard.slideCaption || "Recorte de Diapositiva Oficial";
      if (slideCap) slideCap.textContent = currentCard.slideCaption || "";
    } else if (slideContainer) {
      slideContainer.classList.add("hidden");
    }

    if (keyPointsContainer && currentCard.keyPoints) {
      keyPointsContainer.innerHTML = currentCard.keyPoints.map(p => `
        <div class="flex items-start space-x-1.5">
          <span class="text-amber-400 font-bold">•</span>
          <span>${p}</span>
        </div>
      `).join("");
    }

    updateDeckCounters();
  }

  function flipCard(toBack) {
    const cardEl = document.getElementById("flashcardInner");
    if (!cardEl) return;

    isCardFlipped = (typeof toBack === "boolean") ? toBack : !isCardFlipped;
    if (isCardFlipped) {
      cardEl.classList.add("flipped");
    } else {
      cardEl.classList.remove("flipped");
      if (profAudioPlayer && isProfAudioPlaying) {
        profAudioPlayer.pause();
        isProfAudioPlaying = false;
        updateProfAudioUI(false);
      }
    }
  }

  function handleGradeCard(gradeType) {
    if (!currentCard) return;
    const card = currentCard;
    sessionSeenCardIds.add(card.id);

    if (gradeType === "again") {
      sm.setCardBox(card.id, "box1");
      studyQueue.shift();
      const insertIdx = Math.min(2, studyQueue.length);
      studyQueue.splice(insertIdx, 0, card);
    } else if (gradeType === "hard") {
      sm.setCardBox(card.id, "box2");
      sm.addXP(3);
      studyQueue.shift();
      const insertIdx = Math.min(4, studyQueue.length);
      studyQueue.splice(insertIdx, 0, card);
    } else if (gradeType === "good") {
      sm.setCardBox(card.id, "box3");
      sm.addXP(10);
      studyQueue.shift();
    }

    initHeaderStats();

    const cardEl = document.getElementById("flashcardInner");
    if (cardEl) {
      cardEl.classList.add("scale-95");
      setTimeout(() => {
        cardEl.classList.remove("scale-95");
        renderCurrentCard();
      }, 160);
    } else {
      renderCurrentCard();
    }
  }

  function cycleQueue(delta) {
    if (studyQueue.length <= 1) return;
    if (delta > 0) {
      const first = studyQueue.shift();
      studyQueue.push(first);
    } else {
      const last = studyQueue.pop();
      studyQueue.unshift(last);
    }
    renderCurrentCard();
  }

  /* ==========================================================================
     3. SECCIÓN 2: TABLERO DE LOS 10 PARCIALES & EXAMEN ORAL CON IA
     ========================================================================== */
  function setupOralExamDashboard() {
    renderPartialsGrid();
    updateOralDashboardUI();

    // Controles de Examen Activo
    const btnCancel = document.getElementById("btnCancelExam");
    if (btnCancel) {
      btnCancel.addEventListener("click", () => {
        if (recorder && recorder.isRecording) recorder.stopRecording();
        if (confirm("¿Deseas salir del examen en curso? Tu avance en este intento no se guardará.")) {
          oralExamActive = false;
          showOralDashboardScreen();
          updateOralDashboardUI();
        }
      });
    }

    const speakOralQBtn = document.getElementById("speakOralQuestionBtn");
    if (speakOralQBtn) {
      speakOralQBtn.addEventListener("click", () => {
        const q = oralExamQuestions[oralExamCurrentIndex];
        if (q && audio) audio.speak(`Pregunta de examen: ${q.question}`);
      });
    }

    // Botones de Grabación
    const btnStart = document.getElementById("btnStartRecord");
    const btnStop = document.getElementById("btnStopRecord");
    const timerBadge = document.getElementById("oralTimerBadge");
    const transcriptStatus = document.getElementById("transcriptionStatus");
    const transcriptTextarea = document.getElementById("oralTranscriptTextarea");

    if (btnStart && btnStop) {
      btnStart.addEventListener("click", async () => {
        if (!recorder) return;
        isRecordingCurrent = true;
        btnStart.classList.add("hidden");
        btnStop.classList.remove("hidden");
        btnStop.classList.add("recording-pulse");
        if (transcriptStatus) transcriptStatus.textContent = "Grabando tu voz... Habla con claridad.";

        await recorder.startRecording(
          (elapsedSecs) => {
            const mm = String(Math.floor(elapsedSecs / 60)).padStart(2, '0');
            const ss = String(elapsedSecs % 60).padStart(2, '0');
            if (timerBadge) timerBadge.textContent = `${mm}:${ss}`;
          },
          (liveTranscript) => {
            if (transcriptTextarea) transcriptTextarea.value = liveTranscript;
          },
          (err) => {
            console.warn("Error en grabación:", err);
            btnStart.classList.remove("hidden");
            btnStop.classList.add("hidden");
            btnStop.classList.remove("recording-pulse");
            if (transcriptStatus) transcriptStatus.textContent = "Error al acceder al micrófono.";
          }
        );
      });

      btnStop.addEventListener("click", async () => {
        if (!recorder || !recorder.isRecording) return;
        btnStop.classList.remove("recording-pulse");
        if (transcriptStatus) transcriptStatus.textContent = "Procesando audio con Whisper...";

        const recData = await recorder.stopRecording();
        isRecordingCurrent = false;
        btnStart.classList.remove("hidden");
        btnStop.classList.add("hidden");

        if (recData) {
          if (transcriptTextarea) {
            transcriptTextarea.value = recData.transcript || transcriptTextarea.value;
          }
          if (transcriptStatus) {
            transcriptStatus.textContent = "Respuesta registrada. Puedes editarla antes de avanzar.";
          }
          saveCurrentOralAnswer(recData.audioUrl, recData.durationSecs);
        }
      });
    }

    // Navegación entre preguntas de examen
    const btnPrevQ = document.getElementById("btnOralPrevQuestion");
    const btnNextQ = document.getElementById("btnOralNextQuestion");
    const btnSubmit = document.getElementById("btnSubmitOralExam");

    if (btnPrevQ) {
      btnPrevQ.addEventListener("click", () => {
        saveCurrentOralAnswer();
        if (oralExamCurrentIndex > 0) {
          oralExamCurrentIndex--;
          renderOralExamQuestion();
        }
      });
    }

    if (btnNextQ) {
      btnNextQ.addEventListener("click", () => {
        saveCurrentOralAnswer();
        if (oralExamCurrentIndex < oralExamQuestions.length - 1) {
          oralExamCurrentIndex++;
          renderOralExamQuestion();
        }
      });
    }

    if (btnSubmit) {
      btnSubmit.addEventListener("click", () => {
        saveCurrentOralAnswer();
        submitOralExamToAI();
      });
    }

    const btnRetry = document.getElementById("btnRetryPartialExam");
    if (btnRetry) {
      btnRetry.addEventListener("click", () => {
        startOralExamForPartial(currentOralPartialKey);
      });
    }
  }

  function renderPartialsGrid() {
    const gridContainer = document.getElementById("oralPartialsGrid");
    if (!gridContainer) return;

    let html = "";
    UNITS_META.forEach(u => {
      html += `
        <div class="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div class="flex items-center space-x-3 pb-3 border-b border-slate-800">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br ${u.color} flex items-center justify-center text-white text-lg shadow-md">
              <i class="fa-solid ${u.icon}"></i>
            </div>
            <div>
              <h3 class="text-sm sm:text-base font-extrabold text-white tracking-tight">${u.title}</h3>
              <p class="text-xs text-slate-400 line-clamp-1">${u.desc}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${u.partials.map(pKey => renderPartialCard(pKey)).join("")}
          </div>
        </div>
      `;
    });

    gridContainer.innerHTML = html;

    // Vincular botones de inicio
    const startBtns = gridContainer.querySelectorAll(".btn-start-partial");
    startBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const pKey = btn.dataset.partial;
        if (pKey === "pract_1") {
          startPracticalQuiz();
        } else if (pKey) {
          startOralExamForPartial(pKey);
        }
      });
    });
  }

  function renderPartialCard(pKey) {
    const deck = window.FLASHCARDS_DECKS[pKey];
    if (!deck) return "";

    const isPractical = (pKey === "pract_1");
    const bestGrade = sm.state.partialGrades ? sm.state.partialGrades[pKey] : null;
    let badgeHtml = "";
    let btnText = isPractical ? "Rendir Test Práctico" : "Rendir Examen Oral";
    let btnColor = isPractical
      ? "bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-amber-500/20"
      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20";

    if (bestGrade === null || bestGrade === undefined) {
      badgeHtml = `<span class="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 text-[11px] font-bold">Por rendir</span>`;
    } else if (bestGrade >= 9.0) {
      badgeHtml = `<span class="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold">👑 Sobresaliente: ${bestGrade}</span>`;
      btnText = isPractical ? "Reintentar Test" : "Reintentar Parcial";
      btnColor = "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700";
    } else if (bestGrade >= 8.0) {
      badgeHtml = `<span class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">Distinguido: ${bestGrade}</span>`;
      btnText = isPractical ? "Reintentar Test" : "Reintentar Parcial";
      btnColor = "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700";
    } else if (bestGrade >= 7.0) {
      badgeHtml = `<span class="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">Aprobado: ${bestGrade}</span>`;
      btnText = isPractical ? "Mejorar Nota" : "Mejorar Nota";
      btnColor = "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700";
    } else {
      badgeHtml = `<span class="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold">Desaprobado: ${bestGrade}</span>`;
      btnText = isPractical ? "Rendir Recuperatorio" : "Rendir Recuperatorio";
      btnColor = "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20";
    }

    const typeIcon = isPractical ? '<i class="fa-solid fa-list-check text-amber-400 mr-1"></i>' : '<i class="fa-solid fa-microphone text-indigo-400 mr-1"></i>';
    const typeLabel = isPractical ? `${deck.cards.length} preguntas (Opción Múltiple)` : `${deck.cards.length} preguntas`;

    return `
      <div class="bg-slate-950/70 p-4 rounded-2xl border ${isPractical ? 'border-amber-500/30 bg-amber-950/10' : 'border-slate-800'} flex flex-col justify-between space-y-3 hover:border-slate-700 transition">
        <div class="space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-[10px] uppercase font-extrabold ${isPractical ? 'text-amber-400' : 'text-indigo-400'}">${deck.badge}</span>
            ${badgeHtml}
          </div>
          <h4 class="text-sm font-bold text-white leading-tight">${deck.title}</h4>
          <p class="text-xs text-slate-400 leading-snug line-clamp-2">${deck.subtitle}</p>
        </div>

        <div class="pt-2 flex items-center justify-between border-t border-slate-800/80">
          <span class="text-[11px] text-slate-500 font-mono">
            ${typeIcon} ${typeLabel}
          </span>
          <button data-partial="${pKey}" class="btn-start-partial px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer ${btnColor}">
            <span>${btnText}</span>
            <i class="fa-solid fa-chevron-right text-[10px]"></i>
          </button>
        </div>
      </div>
    `;
  }

  function updateOralDashboardUI() {
    const avgEl = document.getElementById("boardOverallAverage");
    const countEl = document.getElementById("boardCompletedCount");
    const honorBanner = document.getElementById("boardHonorBanner");
    const honorGradeText = document.getElementById("boardHonorGradeText");

    const avg = sm.getOverallAverage();
    const completed = sm.getCompletedPartialsCount();

    if (avgEl) {
      avgEl.textContent = (avg !== "-") ? `${avg} / 10` : "-- / 10";
      if (avg !== "-") {
        const numAvg = parseFloat(avg);
        if (numAvg >= 9.0) avgEl.className = "text-4xl font-black text-amber-400 font-mono tracking-tight";
        else if (numAvg >= 7.0) avgEl.className = "text-4xl font-black text-emerald-400 font-mono tracking-tight";
        else avgEl.className = "text-4xl font-black text-rose-400 font-mono tracking-tight";
      }
    }

    const totalPartials = Object.keys(window.FLASHCARDS_DECKS || {}).length || 11;
    if (countEl) {
      countEl.textContent = `${completed} de ${totalPartials} Aprobados`;
    }

    if (honorBanner && honorGradeText) {
      const isHonor = (avg !== "-" && parseFloat(avg) >= 9.0 && completed >= 10);
      honorBanner.classList.toggle("hidden", !isHonor);
      if (isHonor) honorGradeText.textContent = avg;
    }

    renderPartialsGrid();
  }

  function showOralDashboardScreen() {
    oralExamActive = false;
    practicalQuizActive = false;
    document.getElementById("oralDashboardScreen")?.classList.remove("hidden");
    document.getElementById("oralExamActiveScreen")?.classList.add("hidden");
    document.getElementById("oralExamResultsScreen")?.classList.add("hidden");
    document.getElementById("practicalQuizActiveScreen")?.classList.add("hidden");
    document.getElementById("practicalQuizResultsScreen")?.classList.add("hidden");
  }

  function showOralActiveScreen() {
    oralExamActive = true;
    practicalQuizActive = false;
    document.getElementById("oralDashboardScreen")?.classList.add("hidden");
    document.getElementById("oralExamActiveScreen")?.classList.remove("hidden");
    document.getElementById("oralExamResultsScreen")?.classList.add("hidden");
    document.getElementById("practicalQuizActiveScreen")?.classList.add("hidden");
    document.getElementById("practicalQuizResultsScreen")?.classList.add("hidden");
  }

  function showOralResultsScreen() {
    oralExamActive = false;
    practicalQuizActive = false;
    document.getElementById("oralDashboardScreen")?.classList.add("hidden");
    document.getElementById("oralExamActiveScreen")?.classList.add("hidden");
    document.getElementById("oralExamResultsScreen")?.classList.remove("hidden");
    document.getElementById("practicalQuizActiveScreen")?.classList.add("hidden");
    document.getElementById("practicalQuizResultsScreen")?.classList.add("hidden");
  }

  function showPracticalQuizActiveScreen() {
    oralExamActive = false;
    practicalQuizActive = true;
    document.getElementById("oralDashboardScreen")?.classList.add("hidden");
    document.getElementById("oralExamActiveScreen")?.classList.add("hidden");
    document.getElementById("oralExamResultsScreen")?.classList.add("hidden");
    document.getElementById("practicalQuizActiveScreen")?.classList.remove("hidden");
    document.getElementById("practicalQuizResultsScreen")?.classList.add("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showPracticalQuizResultsScreen() {
    oralExamActive = false;
    practicalQuizActive = false;
    document.getElementById("oralDashboardScreen")?.classList.add("hidden");
    document.getElementById("oralExamActiveScreen")?.classList.add("hidden");
    document.getElementById("oralExamResultsScreen")?.classList.add("hidden");
    document.getElementById("practicalQuizActiveScreen")?.classList.add("hidden");
    document.getElementById("practicalQuizResultsScreen")?.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startOralExamForPartial(partialKey) {
    const deck = window.FLASHCARDS_DECKS[partialKey];
    if (!deck || !deck.cards || deck.cards.length === 0) {
      alert("No hay preguntas disponibles para este parcial.");
      return;
    }

    currentOralPartialKey = partialKey;
    oralExamQuestions = [...deck.cards];
    oralExamCurrentIndex = 0;
    oralStudentAnswers = oralExamQuestions.map(q => ({
      question: q.question,
      officialAnswer: q.answer,
      keyPoints: q.keyPoints || [],
      slideImage: q.slideImage || null,
      slideCaption: q.slideCaption || null,
      transcript: "",
      audioUrl: null,
      durationSecs: 0
    }));

    showOralActiveScreen();
    renderOralExamQuestion();
  }

  function renderOralExamQuestion() {
    const q = oralExamQuestions[oralExamCurrentIndex];
    if (!q) return;

    const deck = window.FLASHCARDS_DECKS[currentOralPartialKey];
    const pTitle = document.getElementById("oralExamPartialTitle");
    const qTitle = document.getElementById("oralExamCurrentQuestionTitle");
    const qStatement = document.getElementById("oralQuestionStatement");
    const qHint = document.getElementById("oralQuestionHint");
    const timerBadge = document.getElementById("oralTimerBadge");
    const transcriptTextarea = document.getElementById("oralTranscriptTextarea");
    const transcriptStatus = document.getElementById("transcriptionStatus");

    if (pTitle) pTitle.textContent = deck ? `${deck.title} (${deck.badge})` : "Examen Oral";
    if (qTitle) qTitle.textContent = `Pregunta ${oralExamCurrentIndex + 1} de ${oralExamQuestions.length}`;
    if (qStatement) qStatement.textContent = q.question;
    if (qHint) qHint.textContent = `Pista docente: ${q.hint || "Responde con rigor clínico basado en diapositivas."}`;
    if (timerBadge) timerBadge.textContent = "00:00";

    const saved = oralStudentAnswers[oralExamCurrentIndex];
    if (transcriptTextarea) {
      transcriptTextarea.value = (saved && saved.transcript) ? saved.transcript : "";
    }
    if (transcriptStatus) {
      if (saved && saved.transcript) {
        transcriptStatus.textContent = "Respuesta guardada. Puedes modificarla o volver a grabar.";
      } else {
        transcriptStatus.textContent = 'Presiona "Comenzar a Hablar" y responde con tus palabras.';
      }
    }

    // Navegación
    const btnPrevQ = document.getElementById("btnOralPrevQuestion");
    const btnNextQ = document.getElementById("btnOralNextQuestion");
    const btnSubmit = document.getElementById("btnSubmitOralExam");

    if (btnPrevQ) btnPrevQ.classList.toggle("hidden", oralExamCurrentIndex === 0);

    const isLast = (oralExamCurrentIndex === oralExamQuestions.length - 1);
    if (btnNextQ) btnNextQ.classList.toggle("hidden", isLast);
    if (btnSubmit) btnSubmit.classList.toggle("hidden", !isLast);
  }

  function saveCurrentOralAnswer(audioUrl = null, durationSecs = 0) {
    const transcriptTextarea = document.getElementById("oralTranscriptTextarea");
    if (!transcriptTextarea) return;

    const currentText = transcriptTextarea.value.trim();
    if (oralStudentAnswers[oralExamCurrentIndex]) {
      oralStudentAnswers[oralExamCurrentIndex].transcript = currentText;
      if (audioUrl) oralStudentAnswers[oralExamCurrentIndex].audioUrl = audioUrl;
      if (durationSecs) oralStudentAnswers[oralExamCurrentIndex].durationSecs = durationSecs;
    }
  }

  async function submitOralExamToAI() {
    saveCurrentOralAnswer();

    const emptyAnswers = oralStudentAnswers.filter(a => !a.transcript || a.transcript.trim().length === 0);
    if (emptyAnswers.length === oralStudentAnswers.length) {
      alert("No has respondido ninguna pregunta aún. Graba tu voz o escribe tus respuestas antes de evaluar.");
      return;
    }

    if (emptyAnswers.length > 0) {
      const confirmProceed = confirm(`Tienes ${emptyAnswers.length} pregunta(s) sin responder. ¿Deseas enviar el examen para evaluación docente de todas formas?`);
      if (!confirmProceed) return;
    }

    const studentName = sm.state.studentName || "Estudiante UNSTA";
    const up = sm.state.up || "UNSTA";

    const examItems = oralExamQuestions.map((q, idx) => ({
      questionNumber: idx + 1,
      question: q.question,
      officialAnswer: q.answer,
      keyPoints: q.keyPoints || [],
      studentAnswer: oralStudentAnswers[idx]?.transcript || "Sin respuesta oral registrada."
    }));

    // Pantalla de carga
    const transcriptStatus = document.getElementById("transcriptionStatus");
    if (transcriptStatus) {
      transcriptStatus.innerHTML = `<span class="text-indigo-400 font-bold animate-pulse"><i class="fa-solid fa-brain mr-2"></i>Evaluando respuestas con IA Oficial UNSTA...</span>`;
    }

    try {
      const result = await ai.evaluateExam(studentName, up, examItems);
      displayOralResults(result);
    } catch (err) {
      console.error("Error evaluando examen con IA:", err);
      alert("Ocurrió un inconveniente al conectar con el Evaluador Docente de IA. Se utilizará la evaluación de contingencia.");
      const fallbackResult = ai.localFallbackEvaluation(examItems);
      displayOralResults(fallbackResult);
    }
  }

  function displayOralResults(result) {
    showOralResultsScreen();

    const resGrade = document.getElementById("resFinalGrade");
    const resFeedback = document.getElementById("resGeneralFeedback");
    const resList = document.getElementById("resQuestionsReviewList");

    const finalGrade = Number(result.finalGrade) || 0;
    if (resGrade) {
      resGrade.textContent = finalGrade.toFixed(1);
      if (finalGrade >= 9.0) resGrade.className = "text-amber-400 font-mono font-black";
      else if (finalGrade >= 7.0) resGrade.className = "text-emerald-400 font-mono font-black";
      else resGrade.className = "text-rose-400 font-mono font-black";
    }

    if (resFeedback) {
      resFeedback.textContent = result.generalFeedback || "Evaluación completada según criterios de la cátedra.";
    }

    // Guardar en StorageManager
    sm.saveExamAttempt({
      partialKey: currentOralPartialKey,
      date: new Date().toISOString(),
      finalGrade: finalGrade,
      passed: result.passed,
      isHonor: result.isHonor,
      answers: oralStudentAnswers
    });

    // Otorgar XP
    if (finalGrade >= 9.0) sm.addXP(120);
    else if (finalGrade >= 8.0) sm.addXP(80);
    else if (finalGrade >= 7.0) sm.addXP(50);
    else sm.addXP(15);

    initHeaderStats();
    updateOralDashboardUI();

    // Renderizar desglose con RECORTES DE DIAPOSITIVAS INCLUIDOS EN LA RESPUESTA
    if (resList && Array.isArray(result.questionsReview)) {
      resList.innerHTML = result.questionsReview.map((rev, idx) => {
        const originalQ = oralExamQuestions[idx];
        const studentAns = oralStudentAnswers[idx]?.transcript || "Sin respuesta";
        const gradeNum = Number(rev.grade) || 0;

        let badgeColor = "bg-rose-500/20 text-rose-300 border-rose-500/30";
        if (gradeNum >= 9.0) badgeColor = "bg-amber-500/20 text-amber-300 border-amber-500/30";
        else if (gradeNum >= 7.0) badgeColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";

        // Recorte visual de diapositiva asociado
        let slideSnippetHtml = "";
        if (originalQ && originalQ.slideImage) {
          slideSnippetHtml = `
            <div class="mt-3 bg-slate-950 p-2.5 rounded-xl border border-indigo-500/20 flex flex-wrap items-center gap-3">
              <img src="${originalQ.slideImage}" alt="${originalQ.slideCaption || 'Recorte Oficial'}" class="h-20 w-auto object-cover rounded-lg border border-slate-800 cursor-pointer hover:scale-105 transition shadow" onclick="window.openSlideModal && window.openSlideModal('${originalQ.slideImage}', '${originalQ.slideCaption || 'Diapositiva Oficial'}')">
              <div class="flex-1 min-w-[200px]">
                <span class="text-[10px] uppercase font-bold text-indigo-400 block">Diapositiva de Clase</span>
                <span class="text-xs text-slate-300 font-medium block">${originalQ.slideCaption || 'Diapositiva de respaldo'}</span>
                <span class="text-[10px] text-slate-400 italic">Click para ampliar 🔍</span>
              </div>
            </div>
          `;
        }

        return `
          <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <span class="text-xs font-bold text-white">Pregunta ${rev.questionNumber || (idx + 1)}: ${originalQ ? originalQ.question : ''}</span>
              <span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg border ${badgeColor}">
                Nota: ${gradeNum} / 10 · ${rev.conceptMastery || ''}
              </span>
            </div>

            <div class="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl">
              <strong class="text-slate-300">Tu respuesta oral:</strong> "${studentAns}"
            </div>

            <div class="text-xs text-emerald-300/90 leading-relaxed">
              <strong class="text-emerald-400">Devolución docente:</strong> ${rev.feedback || ''}
            </div>

            ${rev.improvements && rev.improvements !== '-' ? `
              <div class="text-xs text-amber-300/90 leading-relaxed bg-amber-950/20 border border-amber-500/20 p-2.5 rounded-xl">
                <strong class="text-amber-400">Aspectos a precisar:</strong> ${rev.improvements}
              </div>
            ` : ''}

            ${slideSnippetHtml}
          </div>
        `;
      }).join("");
    }
  }

  /* ==========================================================================
     3.1 MÓDULO PRÁCTICO: EVALUACIÓN DE OPCIÓN MÚLTIPLE (10 PREGUNTAS - SIN IA)
     ========================================================================== */
  const PRACTICAL_QUIZ_DATA = [
    {
      id: "pq_1",
      question: "¿Cuál es el orden secuencial correcto de los pasos críticos para preparar higiénica y correctamente un biberón de fórmula infantil en polvo?",
      slideImage: "assets/slides/pract_mamadera_agua_primero.png",
      slideCaption: "Protocolo del Taller: 7 Pasos Estandarizados para el Armado Seguro de Biberones",
      options: [
        "Hervir agua potable fresca -> Enfriar a ~70 °C (máx 30 min) -> Verter agua caliente PRIMERO en la mamadera -> Agregar polvo al ras sin compactar -> Rotar suave entre palmas -> Enfriar a ~37 °C y probar en muñeca -> Ofrecer y descartar sobrante a los 60 min",
        "Hervir agua potable -> Colocar polvo al ras en el fondo del biberón seco -> Agregar agua a 100 °C -> Agitar enérgicamente en forma vertical -> Dejar enfriar a temperatura ambiente",
        "Calentar agua de la canilla en microondas -> Verter agua -> Agregar medidas colmadas compactadas con los dedos -> Mezclar con cuchara metálica -> Guardar sobrante en heladera para la siguiente toma",
        "Hervir agua -> Mezclar polvo y agua dentro de la pava a 90 °C -> Traspasar a la mamadera -> Batir como coctelera para evitar grumos -> Ofrecer inmediatamente"
      ],
      correctIndex: 0,
      explanation: "El protocolo oficial de la cátedra establece 7 pasos estrictos: 1) hervir agua potable fresca (mín. 1 min), 2) enfriar a ~70 °C (máx. 30 min), 3) verter agua caliente SIEMPRE PRIMERO a la altura de los ojos en superficie plana, 4) incorporar el polvo al ras sin compactar, 5) mezclar rodando entre palmas sin batir, 6) enfriar a temperatura corporal (~37 °C) y probar en cara interna de muñeca, 7) alimentar y descartar todo sobrante a los 60 minutos."
    },
    {
      id: "pq_2",
      question: "¿Por qué las directrices internacionales (OMS/FAO) y la cátedra exigen que el agua esté a aproximadamente 70 °C al disolver la fórmula infantil en polvo?",
      slideImage: "assets/slides/pract_mamadera_agua_70c.png",
      slideCaption: "Paso Crítico: Temperatura Bactericida de 70 °C (OMS/FAO)",
      options: [
        "Porque a esa temperatura se disuelven mejor los azúcares y se evita que la fórmula tome un sabor amargo.",
        "Porque las fórmulas infantiles en polvo no son productos estériles; el agua a ~70 °C actúa como tratamiento térmico bactericida que destruye patógenos letales como Cronobacter sakazakii y Salmonella.",
        "Porque temperaturas menores a 70 °C desnaturalizan las proteínas del suero e inactivan la lactoferrina agregada.",
        "Porque a 100 °C se esteriliza el plástico pero a 70 °C se incrementa la densidad calórica de los lípidos."
      ],
      correctIndex: 1,
      explanation: "Las fórmulas en polvo no son estériles por su proceso industrial de secado. El uso de agua a no menos de 70 °C (obtenida tras hervir y dejar reposar no más de 30 minutos) inactiva de manera eficaz bacterias patógenas oportunistas como Cronobacter sakazakii (asociada a sepsis, meningitis neonatal y enterocolitis necrotizante) y Salmonella."
    },
    {
      id: "pq_3",
      question: "Durante el armado de la mamadera, ¿por qué es mandatorio verter el agua caliente SIEMPRE ANTES que el polvo y qué riesgo pediátrico previene?",
      slideImage: "assets/slides/pract_mamadera_agua_primero.png",
      slideCaption: "Regla de Oro: Agua Caliente Siempre Primero (Evitar Desplazamiento de Volumen)",
      options: [
        "Previene que el polvo se adhiera al cuello del biberón y manche la tetina de silicona.",
        "Si se coloca el polvo primero, al agregar agua hasta la marca el volumen de sólidos desplaza solvente, generando una fórmula hiperconcentrada con sobrecarga renal de solutos y riesgo de deshidratación hipernatrémica grave.",
        "Colocar el agua antes permite que el polvo flote libremente, incrementando el coeficiente de absorción de hierro.",
        "Evita que el agua hidrolice precozmente la caseína y ocasione cólicos por sobrecarga de lactosa."
      ],
      correctIndex: 1,
      explanation: "Si se coloca el polvo primero, los sólidos ocupan un volumen considerable en el fondo. Al completar con agua hasta la línea graduada, se agrega menos volumen de agua del necesario. La fórmula resultante queda hiperconcentrada, exponiendo al inmaduro riñón del lactante a una peligrosa sobrecarga osmolar de solutos y deshidratación hipernatrémica."
    },
    {
      id: "pq_4",
      question: "Respecto a la dosificación y enrase del polvo de fórmula: ¿Cuál es la técnica reglamentaria y la relación de dilución estándar?",
      slideImage: "assets/slides/pract_mamadera_medida_polvo.png",
      slideCaption: "Dosificación Reglamentaria: Cacito al Ras Sin Compactar (1 medida / 30 ml)",
      options: [
        "Llenar la cuchara, presionar con el pulgar para compactar y disolver 2 medidas por cada 50 ml de agua.",
        "Llenar la cuchara colmada y verter 1 medida por cada 60 ml de agua para facilitar la digestión gástrica.",
        "Llenar la cuchara medidora de la lata sin presionar, enrasar al ras con el reborde nivelador o el lomo de un cuchillo limpio, respetando la relación de 1 medida cada 30 ml de agua.",
        "Pesar el polvo en una balanza doméstica a razón de 15 gramos de polvo cada 50 ml de agua."
      ],
      correctIndex: 2,
      explanation: "El cacito oficial de la lata debe llenarse holgadamente y enrasarse al ras sin apelmazar ni compactar el polvo. La proporción reglamentaria universal en fórmulas de inicio (13.5%) y continuación (15%) es de 1 medida al ras cada 30 ml de agua (1 onza líquida)."
    },
    {
      id: "pq_5",
      question: "¿Por qué está expresamente contraindicado agitar la mamadera verticalmente con fuerza ('estilo coctelera') para mezclar y cómo debe disolverse?",
      slideImage: "assets/slides/pract_mamadera_temperatura.png",
      slideCaption: "Técnica de Mezcla: Rotación Palmar Suave (Prohibido Agitar como Coctelera)",
      options: [
        "Porque la agitación vigorosa descalibra la rosca plástica del biberón; debe mezclarse con varilla estéril.",
        "Porque agitar verticalmente desnaturaliza las micelas grasas convirtiéndolas en cristales insolubles.",
        "Porque la agitación vigorosa incorpora abundante aire en forma de microburbujas y espuma que causan aerofagia severa, distensión abdominal y cólicos; debe mezclarse rodando el biberón suavemente entre las palmas.",
        "Porque la agitación vigorosa oxigena el preparado provocando rancidez oxidativa inmediata de los ácidos grasos poliinsaturados."
      ],
      correctIndex: 2,
      explanation: "Batir la mamadera de arriba hacia abajo atrapa burbujas microscópicas de aire en la leche formando espuma persistente. Al succionar, el lactante deglute ese aire provocando aerofagia, meteorismo y dolorosas crisis de cólicos. La técnica indicada es hacer rodar el biberón con suavidad entre las palmas de las manos hasta su completa disolución."
    },
    {
      id: "pq_6",
      question: "En cuanto al control térmico antes de alimentar y el destino del sobrante: ¿Cuáles son las directivas clínicas estrictas?",
      slideImage: "assets/slides/pract_mamadera_descarte.png",
      slideCaption: "Control Térmico en Muñeca y Regla Estricta del Descarte a los 60 Minutos",
      options: [
        "Verificar la temperatura vertiendo unas gotas en la cara interna de la muñeca (tibia a ~37 °C) y descartar indefectiblemente cualquier sobrante tras 60 minutos de haber iniciado la toma.",
        "Probar un sorbo directamente de la tetina y guardar el sobrante a temperatura ambiente para la próxima toma dentro de las siguientes 4 horas.",
        "Ofrecer la leche a temperatura ambiente (20 °C) y conservar los restos no consumidos en heladera hasta por 24 horas.",
        "Enfriar la mamadera en el congelador durante 15 minutos y calentar el sobrante a baño María a 60 °C si el bebé vuelve a tener hambre."
      ],
      correctIndex: 0,
      explanation: "La temperatura debe verificarse siempre en la cara interna de la muñeca (sensación tibia agradable, ~37 °C, nunca caliente). Una vez que la saliva del lactante entra en contacto con la leche tibia a través de la tetina, el biberón se convierte en un caldo de cultivo bacteriano óptimo; por ello, la 'Regla de la 1 hora' exige desechar todo residuo tras 60 minutos (prohibido guardar o recalentar)."
    },
    {
      id: "pq_7",
      question: "¿Qué variables antropométricas evalúa la Gráfica de Calvo et al. (2009) y cuáles son sus puntos de corte en desvíos estándar (SD)?",
      slideImage: "assets/slides/pract_calvo_curva_imc.png",
      slideCaption: "Curvas de Calvo et al. (2009): IMC Materno para la Edad Gestacional (Semana 6 a 42)",
      options: [
        "Evalúa Peso / Talla en percentilos P10, P50 y P90 exclusivamente para gestantes a término (37 a 40 semanas).",
        "Evalúa Ganancia de peso en kg según semanas de amenorrea; puntos de corte: < 7 kg bajo peso, > 16 kg obesidad.",
        "Evalúa el Índice de Masa Corporal (IMC) materno en función de la Edad Gestacional (semanas 6 a 42); puntos de corte: < -1 SD bajo peso/emaciación, -1 a +1 SD peso normal, > +1 SD sobrepeso y > +2 SD obesidad.",
        "Evalúa Perímetro Braquial materno en centímetros según trimestre gestacional mediante Puntuación Z de la OMS."
      ],
      correctIndex: 2,
      explanation: "La gráfica nacional de referencia de Calvo et al. (2009) evalúa el IMC materno (kg/m²) específico para la Edad Gestacional (semanas 6 a 42) en población argentina. Sus límites son: < -1 SD (Bajo peso), -1 a +1 SD (Normopeso), > +1 SD (Sobrepeso) y > +2 SD (Obesidad)."
    },
    {
      id: "pq_8",
      question: "¿Cuál es la principal ventaja clínica de la Gráfica de Calvo et al. para el nutricionista durante la consulta prenatal?",
      slideImage: "assets/slides/pract_calvo_utilidad_clinica.png",
      slideCaption: "Utilidad Clínica de Calvo: Diagnóstico de Situación Actual Sin Depender del Peso Pregravídico",
      options: [
        "Permite estimar el volumen exacto en mililitros de líquido amniótico que sintetiza la placenta.",
        "Permite emitir un diagnóstico del estado nutricional materno actual en cualquier consulta (incluso en captaciones tardías del 2° o 3° trimestre) sin necesidad de disponer del peso pregestacional de la paciente.",
        "Establece con exactitud la cantidad fija de kilogramos que la paciente debe aumentar semana a semana.",
        "Indica de forma automatizada las dosis de suplementación de hierro elemental y ácido fólico recomendadas."
      ],
      correctIndex: 1,
      explanation: "En la práctica clínica obstétrica real, un elevado porcentaje de gestantes desconoce su peso previo a la concepción. Calvo et al. resuelve esto permitiendo diagnosticar la situación nutricional en cualquier momento con el peso y talla actuales junto a las semanas de amenorrea, permitiendo además el seguimiento longitudinal de su canal de crecimiento."
    },
    {
      id: "pq_9",
      question: "Según las metas del Institute of Medicine (IOM, 2009), ¿cuál es el rango de ganancia de peso total y la velocidad semanal en 2°/3° trimestre para una gestante con IMC PREGESTACIONAL NORMAL (18.5 a 24.9 kg/m²)?",
      slideImage: "assets/slides/pract_iom_metas_peso.png",
      slideCaption: "Metas Ponderales del IOM (2009): Ganancia Total y Velocidad Semanal por IMC Previo",
      options: [
        "Ganancia total de 5.0 a 9.0 kg y tasa de 0.20 kg/semana.",
        "Ganancia total de 7.0 a 11.5 kg y tasa de 0.28 kg/semana.",
        "Ganancia total de 11.5 a 16.0 kg y tasa semanal promedio de 0.42 kg/semana (rango 0.35 - 0.50 kg/semana).",
        "Ganancia total de 12.5 a 18.0 kg y tasa semanal de 0.60 kg/semana."
      ],
      correctIndex: 2,
      explanation: "El IOM (2009) pauta para mujeres con IMC normal previo (18.5 - 24.9) una meta ponderal total de 11.5 a 16.0 kg hasta el término, con una velocidad de ascenso en el 2° y 3° trimestre de 0.42 kg/sem (0.35 - 0.50 kg/sem). En el primer trimestre la ganancia esperada es baja (0.5 a 2.0 kg en total)."
    },
    {
      id: "pq_10",
      question: "¿Cómo se articulan y complementan clínicamente en la consulta nutricional la Gráfica de Calvo et al. y las metas del IOM (2009)?",
      slideImage: "assets/slides/pract_calvo_vs_iom_cuadro.png",
      slideCaption: "Sinergia Clínica: Calvo (¿Dónde está hoy?) vs. IOM (¿Cuánto y a qué ritmo debe subir?)",
      options: [
        "Calvo reemplaza por completo al IOM en Argentina por ser una curva local, por lo que no es necesario monitorear los kilogramos ganados.",
        "Calvo responde '¿DÓNDE ESTÁ HOY LA EMBARAZADA?' (diagnóstico puntual y percentil actual), mientras que el IOM responde '¿CUÁNTO Y A QUÉ RITMO DEBE SUBIR HASTA EL PARTO?' (meta ponderal y modulación del superávit de kcal/día).",
        "El IOM solo se utiliza durante el primer trimestre y Calvo se reserva con exclusividad para el posparto inmediato.",
        "Calvo calcula el superávit energético (+340 kcal en 2°T) mientras que el IOM mide la altura uterina materna."
      ],
      correctIndex: 1,
      explanation: "Ambas herramientas son sinérgicas y no excluyentes: la Gráfica de Calvo et al. permite diagnosticar el estado nutricional actual según la edad gestacional (¿Dónde está hoy?), mientras que el IOM establece la meta global en kilogramos y el ritmo de incremento semanal necesario para calcular y graduar el plan alimentario y el superávit calórico trimestral (+340 kcal en 2°T, +452 kcal en 3°T)."
    }
  ];

  function setupPracticalQuiz() {
    const btnCancel = document.getElementById("btnCancelPractQuiz");
    if (btnCancel) {
      btnCancel.addEventListener("click", () => {
        if (confirm("¿Deseas salir del test práctico? Tu avance en este intento no se guardará.")) {
          showOralDashboardScreen();
          updateOralDashboardUI();
        }
      });
    }

    const btnPrev = document.getElementById("btnPractQuizPrev");
    if (btnPrev) {
      btnPrev.addEventListener("click", () => {
        if (practQuizCurrentIndex > 0) {
          practQuizCurrentIndex--;
          renderPracticalQuizQuestion();
        }
      });
    }

    const btnNext = document.getElementById("btnPractQuizNext");
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        if (practQuizCurrentIndex < PRACTICAL_QUIZ_DATA.length - 1) {
          practQuizCurrentIndex++;
          renderPracticalQuizQuestion();
        }
      });
    }

    const btnSubmit = document.getElementById("btnPractQuizSubmit");
    if (btnSubmit) {
      btnSubmit.addEventListener("click", () => {
        submitPracticalQuiz();
      });
    }

    const btnRetry = document.getElementById("btnRetryPractQuiz");
    if (btnRetry) {
      btnRetry.addEventListener("click", () => {
        startPracticalQuiz();
      });
    }
  }

  function startPracticalQuiz() {
    practQuizCurrentIndex = 0;
    practQuizUserAnswers = new Array(PRACTICAL_QUIZ_DATA.length).fill(null);
    showPracticalQuizActiveScreen();
    renderPracticalQuizQuestion();
  }

  function renderPracticalQuizQuestion() {
    const q = PRACTICAL_QUIZ_DATA[practQuizCurrentIndex];
    if (!q) return;

    // Contador
    const counterEl = document.getElementById("practQuizQuestionCounter");
    if (counterEl) {
      counterEl.textContent = `Pregunta ${practQuizCurrentIndex + 1} de ${PRACTICAL_QUIZ_DATA.length}`;
    }

    // Dots interactivos
    const dotsContainer = document.getElementById("practQuizProgressDots");
    if (dotsContainer) {
      dotsContainer.innerHTML = PRACTICAL_QUIZ_DATA.map((_, idx) => {
        const isCurrent = idx === practQuizCurrentIndex;
        const isAnswered = practQuizUserAnswers[idx] !== null;

        let dotClass = "bg-slate-800 text-slate-500 border border-slate-700";
        if (isCurrent) {
          dotClass = "bg-amber-500 text-slate-950 font-black ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900";
        } else if (isAnswered) {
          dotClass = "bg-emerald-600 text-white font-bold border border-emerald-500";
        }

        return `
          <button onclick="window.jumpToPractQuestion(${idx})" class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs transition cursor-pointer ${dotClass}" title="Ir a la pregunta ${idx + 1}">
            ${idx + 1}
          </button>
        `;
      }).join("");
    }

    // Imagen / Recorte de apoyo
    const slideImg = document.getElementById("practQuizSlideImage");
    const slideCap = document.getElementById("practQuizSlideCaption");
    if (slideImg && slideCap) {
      slideImg.src = q.slideImage || "assets/slides/pract_mamadera_agua_primero.png";
      slideImg.alt = q.slideCaption || "Referencia Oficial del Taller";
      slideCap.textContent = q.slideCaption || "Referencia Oficial del Taller Práctico";
    }

    // Enunciado
    const statementEl = document.getElementById("practQuizStatement");
    if (statementEl) {
      statementEl.textContent = q.question;
    }

    // Opciones A, B, C, D
    const optionsContainer = document.getElementById("practQuizOptionsContainer") || document.getElementById("practQuizOptionsList");
    if (optionsContainer) {
      const letters = ["A", "B", "C", "D"];
      const selectedOpt = practQuizUserAnswers[practQuizCurrentIndex];

      optionsContainer.innerHTML = q.options.map((optText, optIdx) => {
        const isSelected = (selectedOpt === optIdx);
        const cardStyle = isSelected
          ? "border-amber-400 bg-amber-500/15 text-white shadow-lg ring-1 ring-amber-400/50"
          : "border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/60 text-slate-300";
        const letterStyle = isSelected
          ? "bg-amber-500 text-slate-950 font-black shadow"
          : "bg-slate-800 text-slate-400 font-bold";

        return `
          <button onclick="window.selectPractOption(${optIdx})" class="w-full text-left p-3.5 sm:p-4 rounded-2xl border transition flex items-start gap-3 cursor-pointer ${cardStyle}">
            <span class="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs ${letterStyle}">
              ${letters[optIdx]}
            </span>
            <span class="text-xs sm:text-sm font-medium leading-relaxed pt-0.5">
              ${optText}
            </span>
          </button>
        `;
      }).join("");
    }

    // Botones de navegación
    const btnPrev = document.getElementById("btnPractQuizPrev");
    const btnNext = document.getElementById("btnPractQuizNext");
    const btnSubmit = document.getElementById("btnPractQuizSubmit");

    if (btnPrev) {
      btnPrev.disabled = (practQuizCurrentIndex === 0);
      btnPrev.classList.toggle("opacity-40", practQuizCurrentIndex === 0);
      btnPrev.classList.toggle("cursor-not-allowed", practQuizCurrentIndex === 0);
    }

    const isLast = (practQuizCurrentIndex === PRACTICAL_QUIZ_DATA.length - 1);
    if (btnNext) {
      btnNext.classList.toggle("hidden", isLast);
    }
    if (btnSubmit) {
      btnSubmit.classList.toggle("hidden", !isLast);
    }
  }

  window.jumpToPractQuestion = (idx) => {
    if (idx >= 0 && idx < PRACTICAL_QUIZ_DATA.length) {
      practQuizCurrentIndex = idx;
      renderPracticalQuizQuestion();
    }
  };

  window.selectPractOption = (optIdx) => {
    practQuizUserAnswers[practQuizCurrentIndex] = optIdx;
    renderPracticalQuizQuestion();
  };

  function submitPracticalQuiz() {
    const unanswered = practQuizUserAnswers.filter(a => a === null).length;
    if (unanswered > 0) {
      const ok = confirm(`Tienes ${unanswered} pregunta(s) sin responder. ¿Deseas finalizar y calificar la evaluación de todas formas?`);
      if (!ok) return;
    }

    let correctCount = 0;
    PRACTICAL_QUIZ_DATA.forEach((q, idx) => {
      if (practQuizUserAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const finalGrade = Number(correctCount.toFixed(1)); // Escala 0 a 10
    const passed = (finalGrade >= 7.0);
    const isHonor = (finalGrade >= 9.0);

    // Guardar en StorageManager
    sm.saveExamAttempt({
      partialKey: "pract_1",
      date: new Date().toISOString(),
      finalGrade: finalGrade,
      passed: passed,
      isHonor: isHonor,
      type: "multiple_choice",
      answers: practQuizUserAnswers
    });

    // Otorgar XP
    if (finalGrade >= 9.0) sm.addXP(120);
    else if (finalGrade >= 8.0) sm.addXP(80);
    else if (finalGrade >= 7.0) sm.addXP(50);
    else sm.addXP(15);

    initHeaderStats();
    updateOralDashboardUI();

    // Renderizar Resultados
    const gradeEl = document.getElementById("practResFinalGrade");
    const feedbackEl = document.getElementById("practResGeneralFeedback");
    const reviewList = document.getElementById("practResQuestionsReviewList");

    if (gradeEl) {
      gradeEl.textContent = `${finalGrade}`;
      if (finalGrade >= 9.0) gradeEl.className = "text-amber-400 font-black font-mono";
      else if (finalGrade >= 7.0) gradeEl.className = "text-emerald-400 font-black font-mono";
      else gradeEl.className = "text-rose-400 font-black font-mono";
    }

    if (feedbackEl) {
      if (finalGrade >= 9.0) {
        feedbackEl.innerHTML = `
          <strong class="text-amber-300 block mb-1">👑 ¡Desempeño Práctico Sobresaliente! (${correctCount}/10 correctas)</strong>
          Demuestras un dominio riguroso y absoluto del armado estandarizado de biberones (temperatura bactericida de 70 °C, agua primero, cacito al ras y regla de descarte a los 60 min) y de la articulación diagnóstica entre Calvo et al. e IOM (2009).
        `;
      } else if (finalGrade >= 7.0) {
        feedbackEl.innerHTML = `
          <strong class="text-emerald-300 block mb-1">✅ ¡Test Práctico Aprobado! (${correctCount}/10 correctas)</strong>
          Has superado satisfactoriamente los puntos críticos del taller y las curvas gestacionales. Te sugerimos revisar las justificaciones docentes en las preguntas falladas para llegar al examen presencial con máxima seguridad.
        `;
      } else {
        feedbackEl.innerHTML = `
          <strong class="text-rose-300 block mb-1">⚠️ Calificación Insuficiente (${correctCount}/10 correctas - Nota mínima: 7.0)</strong>
          En la práctica clínica pediátrica y prenatal, los errores en la reconstitución de fórmulas y el mal uso de curvas representan riesgos serios (deshidratación hipernatrémica, infecciones y malnutrición fetal). Repasa el material y reintenta el test.
        `;
      }
    }

    if (reviewList) {
      const letters = ["A", "B", "C", "D"];
      reviewList.innerHTML = PRACTICAL_QUIZ_DATA.map((q, idx) => {
        const studentAnsIdx = practQuizUserAnswers[idx];
        const isCorrect = (studentAnsIdx === q.correctIndex);
        const studentText = (studentAnsIdx !== null && studentAnsIdx !== undefined)
          ? `${letters[studentAnsIdx]}) ${q.options[studentAnsIdx]}`
          : "Sin respuesta marcada";
        const correctText = `${letters[q.correctIndex]}) ${q.options[q.correctIndex]}`;

        let statusBadge = isCorrect
          ? `<span class="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold"><i class="fa-solid fa-check mr-1"></i> Correcta (+1.0)</span>`
          : `<span class="px-2.5 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold"><i class="fa-solid fa-xmark mr-1"></i> Incorrecta (0.0)</span>`;

        return `
          <div class="bg-slate-950 p-4 rounded-2xl border ${isCorrect ? 'border-emerald-500/30' : 'border-rose-500/30'} space-y-2.5">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <span class="text-xs font-bold text-white">Pregunta ${idx + 1}: ${q.question}</span>
              ${statusBadge}
            </div>

            <div class="text-xs ${isCorrect ? 'text-emerald-300' : 'text-rose-300'} bg-slate-900/60 p-2.5 rounded-xl">
              <strong>Tu respuesta:</strong> ${studentText}
            </div>

            ${!isCorrect ? `
              <div class="text-xs text-amber-300 bg-amber-950/20 border border-amber-500/20 p-2.5 rounded-xl">
                <strong>Respuesta correcta:</strong> ${correctText}
              </div>
            ` : ''}

            <div class="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-2.5 rounded-xl border border-slate-800">
              <strong class="text-indigo-400 block mb-0.5"><i class="fa-solid fa-graduation-cap mr-1"></i> Justificación Docente Oficial:</strong>
              ${q.explanation}
            </div>

            <div class="mt-2 bg-slate-950 p-2 rounded-xl border border-slate-800 flex items-center gap-3">
              <img src="${q.slideImage}" alt="${q.slideCaption}" class="h-14 sm:h-16 w-auto object-cover rounded-lg border border-slate-800 cursor-pointer hover:scale-105 transition" onclick="window.openSlideModal && window.openSlideModal('${q.slideImage}', '${q.slideCaption}')">
              <div class="text-[11px] text-slate-400">
                <span class="font-bold text-slate-300 block">${q.slideCaption}</span>
                <span class="italic text-[10px]">Click en la imagen para ampliar 🔍</span>
              </div>
            </div>
          </div>
        `;
      }).join("");
    }

    showPracticalQuizResultsScreen();
  }

  /* ==========================================================================
     4. SECCIÓN 3: CALCULADORA DE BIBERONES & GALERÍA DE DIAPOSITIVAS
     ========================================================================== */
  function setupCalculadora() {
    const fTypeSelect = document.getElementById("calcFormulaType");
    const volInput = document.getElementById("calcVolInput");
    const dTypeSelect = document.getElementById("calcDilutionType");

    const resScoops = document.getElementById("calcResScoops");
    const resGrams = document.getElementById("calcResGrams");
    const resPct = document.getElementById("calcResPct");
    const resKcal = document.getElementById("calcResKcal");

    const calculate = () => {
      const fType = fTypeSelect ? fTypeSelect.value : "inicio";
      const vol = parseFloat(volInput ? volInput.value : 200) || 200;
      const dType = dTypeSelect ? dTypeSelect.value : "estandar";

      // Parámetros oficiales Lic. Mariana Mohedano
      const scoopGrams = (fType === "inicio") ? 4.5 : 5.0; // 4.5g inicio, 5g continuación

      let scoopsPer100 = 3;
      let kcalPer100 = 70;

      if (dType === "estandar") {
        scoopsPer100 = 3; // 1 medida cada 30 cc de agua (3 med en 100 cc)
        kcalPer100 = 70;
      } else if (dType === "concentrada") {
        scoopsPer100 = 4; // 4 medidas en 100 cc
        kcalPer100 = 100;
      } else if (dType === "tope") {
        scoopsPer100 = 5; // 5 medidas en 100 cc (máxima densidad)
        kcalPer100 = 125;
      }

      const totalScoops = Math.round((vol / 100) * scoopsPer100 * 10) / 10;
      const totalGrams = Math.round(totalScoops * scoopGrams * 10) / 10;
      const dilutionPct = Math.round((totalGrams / vol) * 100 * 10) / 10;
      const totalKcal = Math.round((vol / 100) * kcalPer100);

      if (resScoops) resScoops.textContent = `${totalScoops} med. al ras`;
      if (resGrams) resGrams.textContent = `${totalGrams} g`;
      if (resPct) resPct.textContent = `${dilutionPct}%`;
      if (resKcal) resKcal.textContent = `${totalKcal} kcal`;
    };

    if (fTypeSelect) fTypeSelect.addEventListener("change", calculate);
    if (volInput) {
      volInput.addEventListener("input", calculate);
      volInput.addEventListener("change", calculate);
    }
    if (dTypeSelect) dTypeSelect.addEventListener("change", calculate);

    calculate();
  }

  function setupSlidesGallery() {
    const galleryGrid = document.getElementById("slidesGalleryGrid");
    if (!galleryGrid) return;

    galleryGrid.innerHTML = ALL_SLIDES.map(slide => `
      <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition cursor-pointer group shadow-lg flex flex-col justify-between" onclick="window.openSlideModal && window.openSlideModal('${slide.src}', '${slide.title}')">
        <div class="bg-black/40 p-2 overflow-hidden aspect-video flex items-center justify-center">
          <img src="${slide.src}" alt="${slide.title}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300">
        </div>
        <div class="p-3 bg-slate-950/80 border-t border-slate-800/80 space-y-1">
          <span class="text-[9px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">${slide.unitName}</span>
          <h5 class="text-xs font-semibold text-slate-200 line-clamp-2 leading-tight">${slide.title}</h5>
        </div>
      </div>
    `).join("");
  }

  /* ==========================================================================
     5. SECCIÓN 4: DOMINIO & XP
     ========================================================================== */
  function updateRankingUI() {
    const xpBadge = document.getElementById("rankingTotalXpBadge");
    const barsContainer = document.getElementById("masteryProgressBars");

    if (xpBadge) xpBadge.textContent = `${sm.state.xp || 0} XP Acumulados`;

    if (!barsContainer) return;

    let html = "";
    UNITS_META.forEach(u => {
      // Calcular tarjetas dominadas en la unidad
      let totalUnitCards = 0;
      let masteredUnitCards = 0;
      let partialGrades = [];

      u.partials.forEach(pKey => {
        const deck = window.FLASHCARDS_DECKS[pKey];
        if (deck && deck.cards) {
          totalUnitCards += deck.cards.length;
          deck.cards.forEach(c => {
            if (sm.getCardBox(c.id) === "box3") masteredUnitCards++;
          });
        }
        const g = sm.state.partialGrades ? sm.state.partialGrades[pKey] : null;
        if (g !== null && !isNaN(g)) partialGrades.push(g);
      });

      const pctMastered = totalUnitCards > 0 ? Math.round((masteredUnitCards / totalUnitCards) * 100) : 0;
      const avgGrade = partialGrades.length > 0 ? (partialGrades.reduce((a, b) => a + b, 0) / partialGrades.length).toFixed(1) : "-";

      html += `
        <div class="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xs font-bold text-white">${u.title}</span>
            <div class="flex items-center space-x-3 text-xs">
              <span class="text-indigo-400 font-mono font-bold">${masteredUnitCards} / ${totalUnitCards} flashcards (${pctMastered}%)</span>
              <span class="text-slate-600">|</span>
              <span class="text-amber-400 font-mono font-bold">${u.unit === 'P' ? 'Nota Práctica' : 'Prom. Oral'}: ${avgGrade} / 10</span>
            </div>
          </div>

          <div class="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div class="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-500" style="width: ${pctMastered}%"></div>
          </div>
        </div>
      `;
    });

    barsContainer.innerHTML = html;
  }

  /* ==========================================================================
     6. MODAL LIGHTBOX PARA DIAPOSITIVAS & ATAJOS DE TECLADO
     ========================================================================== */
  window.openSlideModal = (src, caption) => {
    const modal = document.getElementById("slideModal");
    const img = document.getElementById("slideModalImage");
    const title = document.getElementById("slideModalTitle");

    if (modal && img) {
      img.src = src;
      img.alt = caption || "Diapositiva Oficial";
      if (title) title.textContent = caption || "Diapositiva Oficial de Cátedra";
      modal.classList.remove("hidden");
    }
  };

  window.closeSlideModal = () => {
    const modal = document.getElementById("slideModal");
    if (modal) modal.classList.add("hidden");
  };

  // Click fuera del modal para cerrar
  const slideModalEl = document.getElementById("slideModal");
  if (slideModalEl) {
    slideModalEl.addEventListener("click", (e) => {
      if (e.target === slideModalEl) window.closeSlideModal();
    });
  }

  function setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Ignorar si el usuario está escribiendo en un textarea o input
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.key === "Escape") {
        window.closeSlideModal();
        return;
      }

      if (currentSection === "repaso") {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          flipCard();
        } else if (e.key === "1") {
          if (isCardFlipped) handleGradeCard("again");
        } else if (e.key === "2") {
          if (isCardFlipped) handleGradeCard("hard");
        } else if (e.key === "3") {
          if (isCardFlipped) handleGradeCard("good");
        } else if (e.key === "ArrowLeft") {
          cycleQueue(-1);
        } else if (e.key === "ArrowRight") {
          cycleQueue(1);
        }
      }
    });
  }
});
