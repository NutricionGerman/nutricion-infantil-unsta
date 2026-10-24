/**
 * CONTROLADOR PRINCIPAL - 2° PARCIAL TEÓRICO (UNSTA)
 * Arquitectura de 3 Unidades y 6 Parciales de Dominio:
 * - Sección 1: Mazo de Repaso Activo (Repetición Espaciada)
 * - Sección 2: Tablero de Dominio de 6 Parciales & Examen Oral con IA (10 Preguntas por Parcial)
 */

document.addEventListener("DOMContentLoaded", () => {
  const sm = window.storageManager;
  const audio = window.audioEngine;
  const recorder = window.audioRecorderEngine;
  const ai = window.aiEvaluator;

  // ESTADO GLOBAL
  let currentSection = "repaso"; // "repaso" o "evaluacion"

  // ESTADO: SECCIÓN 1 - MAZO DE REPASO ACTIVO
  let activeDeckKey = "all";
  let studyQueue = [];
  let currentCard = null;
  let isCardFlipped = false;
  let sessionSeenCardIds = new Set();

  // ESTADO: SECCIÓN 2 - EXÁMENES ORALES (6 PARCIALES)
  const TOTAL_ORAL_QUESTIONS = 10;
  let currentOralPartialKey = "u5_p1"; // Parcial activo
  let oralExamActive = false;
  let oralExamQuestions = [];
  let oralExamCurrentIndex = 0;
  let oralStudentAnswers = []; // [ { question, officialAnswer, keyPoints, keywords, studentTranscript, audioUrl, durationSecs } ]
  let currentQuestionAudioUrl = null;
  let currentQuestionTranscript = "";
  let currentQuestionDuration = 0;

  // Inicialización Segura de Firebase Firestore
  let db = null;
  if (typeof firebase !== 'undefined') {
    try {
      if (!firebase.apps.length) {
        firebase.initializeApp({
          projectId: "nutricion-gamificada",
          appId: "1:811386131905:web:130318ef481274efc1cb40",
          storageBucket: "nutricion-gamificada.firebasestorage.app",
          apiKey: "AIzaSyBgt8rf4v_gYbNll7qf8ZRwZonge-8Tty0",
          authDomain: "nutricion-gamificada.firebaseapp.com",
          messagingSenderId: "811386131905",
          projectNumber: "811386131905"
        });
      }
      db = firebase.firestore();
      console.log("[Firebase] Conectado a nutricion-gamificada para sincronización.");
    } catch(err) {
      console.warn("[Firebase] No se pudo inicializar Firebase:", err);
    }
  }

  // Leer parámetros de URL para auto-login (desde el portal principal)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const paramUp = urlParams.get('up');
    const paramName = urlParams.get('name');
    if (paramUp && paramUp !== 'undefined' && paramUp !== 'null') {
      const studentName = (paramName && paramName !== 'undefined' && paramName !== 'null') ? decodeURIComponent(paramName) : (sm.state.studentName || "Estudiante UNSTA");
      sm.setStudentInfo(studentName, paramUp);
    }
  } catch(e) {
    console.warn("Error leyendo parámetros de URL:", e);
  }

  // Inicialización
  initHeaderStats();
  setupSectionNavigation();
  setupRepasoDeck();
  setupOralExamDashboard();

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
     1. ENCABEZADO Y NAVEGACIÓN EN 2 SECCIONES
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

    // Guardar cambios directos en los inputs del tablero
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
    const secRepaso = document.getElementById("section_repaso");
    const secEvaluacion = document.getElementById("section_evaluacion");

    btnRepaso.addEventListener("click", () => {
      currentSection = "repaso";
      secRepaso.classList.remove("hidden");
      secEvaluacion.classList.add("hidden");

      btnRepaso.className = "flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-2 transition shadow-md bg-indigo-600 text-white";
      btnEvaluacion.className = "flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-2 transition text-slate-400 hover:bg-slate-800";
    });

    btnEvaluacion.addEventListener("click", () => {
      currentSection = "evaluacion";
      secEvaluacion.classList.remove("hidden");
      secRepaso.classList.add("hidden");

      btnEvaluacion.className = "flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-2 transition shadow-md bg-indigo-600 text-white";
      btnRepaso.className = "flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-2 transition text-slate-400 hover:bg-slate-800";

      // Si no hay examen activo, asegurar vista del tablero
      if (!oralExamActive) {
        showDashboardScreen();
      }
      updateOralDashboardUI();
    });
  }

  /* ==========================================================================
     2. SECCIÓN 1: MAZO DE REPASO ACTIVO (REPETICIÓN ESPACIADA)
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

    const speakQBtn = document.getElementById("speakCardBtn");
    const speakABtn = document.getElementById("speakAnswerBtn");

    if (speakQBtn) {
      speakQBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (currentCard) audio.speak(`Pregunta: ${currentCard.question}`);
      });
    }
    if (speakABtn) {
      speakABtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (currentCard) audio.speak(`Respuesta oficial: ${currentCard.answer}`);
      });
    }

    loadStudyQueue();
    renderCurrentCard();
  }

  function getDeckCards(deckKey) {
    let cards = [];
    if (deckKey === "all") {
      Object.values(FLASHCARDS_DECKS).forEach(d => cards.push(...d.cards));
    } else if (deckKey === "u5_all") {
      cards.push(...(FLASHCARDS_DECKS.u5_p1?.cards || []), ...(FLASHCARDS_DECKS.u5_p2?.cards || []));
    } else if (deckKey === "u6_all") {
      cards.push(...(FLASHCARDS_DECKS.u6_p1?.cards || []), ...(FLASHCARDS_DECKS.u6_p2?.cards || []));
    } else if (deckKey === "u7_all") {
      cards.push(...(FLASHCARDS_DECKS.u7_p1?.cards || []), ...(FLASHCARDS_DECKS.u7_p2?.cards || []));
    } else if (FLASHCARDS_DECKS[deckKey]) {
      cards = [...FLASHCARDS_DECKS[deckKey].cards];
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
      badgeEl.textContent = currentCard.tags ? currentCard.tags.join(" • ") : "Nutrición Infantil";
    }
    if (counterEl) {
      counterEl.textContent = `${studyQueue.length} restantes`;
    }
    if (qTextEl) {
      qTextEl.textContent = currentCard.question;
    }
    if (hintEl) {
      hintEl.textContent = currentCard.hint || "Piensa en los criterios oficiales de cátedra antes de voltear.";
    }

    const aTextEl = document.getElementById("flashcardAnswerText");
    const keyPointsContainer = document.getElementById("flashcardKeyPointsList");

    if (aTextEl) {
      aTextEl.textContent = currentCard.answer;
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
      studyQueue.shift();
      const insertIdx = Math.min(4, studyQueue.length);
      studyQueue.splice(insertIdx, 0, card);
    } else if (gradeType === "good") {
      sm.setCardBox(card.id, "box3");
      studyQueue.shift();
    }

    initHeaderStats();

    const cardEl = document.getElementById("flashcardInner");
    if (cardEl) {
      cardEl.classList.add("scale-95");
      setTimeout(() => {
        cardEl.classList.remove("scale-95");
        renderCurrentCard();
      }, 180);
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
     3. SECCIÓN 2: TABLERO DE LOS 6 PARCIALES & EXAMEN ORAL CON IA
     ========================================================================== */
  function setupOralExamDashboard() {
    // Botones de inicio para cada uno de los 6 parciales
    const startBtns = document.querySelectorAll(".btn-start-partial");
    startBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const partialKey = btn.dataset.partial;
        if (partialKey) {
          startOralExamForPartial(partialKey);
        }
      });
    });

    // Botón Volver al Tablero desde la pantalla de examen activo
    const backBtn = document.getElementById("btnBackToDashboard");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        if (recorder && recorder.isRecording) recorder.stopRecording();
        if (confirm("¿Deseas salir al Tablero de Calificaciones? El progreso de este parcial en curso se pausará.")) {
          oralExamActive = false;
          showDashboardScreen();
          updateOralDashboardUI();
        }
      });
    }

    // Botón Volver al Tablero desde la pantalla de resultados
    const retBtn = document.getElementById("btnReturnToDashboardFromResult");
    if (retBtn) {
      retBtn.addEventListener("click", () => {
        oralExamActive = false;
        showDashboardScreen();
        updateOralDashboardUI();
      });
    }

    // Botones de grabación y navegación del examen
    const btnRecord = document.getElementById("btnRecordOralAnswer");
    const btnNext = document.getElementById("btnOralNextQuestion");
    const btnPrev = document.getElementById("btnOralPrevQuestion");
    const btnRetry = document.getElementById("btnRetryOralExam");
    const btnPrintCert = document.getElementById("btnPrintOralDiploma");
    const btnPrintBoard = document.getElementById("btnPrintConsolidatedReport");
    const speakQBtn = document.getElementById("oralExamSpeakQuestionBtn");

    if (btnRecord) btnRecord.addEventListener("click", toggleOralExamRecording);
    if (btnNext) btnNext.addEventListener("click", handleOralNextQuestion);
    if (btnPrev) btnPrev.addEventListener("click", handleOralPrevQuestion);
    if (btnRetry) btnRetry.addEventListener("click", () => startOralExamForPartial(currentOralPartialKey));
    if (btnPrintCert) btnPrintCert.addEventListener("click", () => window.print());
    if (btnPrintBoard) btnPrintBoard.addEventListener("click", () => window.print());

    if (speakQBtn) {
      speakQBtn.addEventListener("click", () => {
        if (oralExamQuestions.length > 0) {
          const q = oralExamQuestions[oralExamCurrentIndex];
          audio.speak(`Pregunta ${oralExamCurrentIndex + 1}: ${q.question}`);
        }
      });
    }

    updateOralDashboardUI();
  }

  function showDashboardScreen() {
    const dash = document.getElementById("oralDashboardScreen");
    const active = document.getElementById("oralExamActiveScreen");
    const loading = document.getElementById("oralExamLoadingScreen");
    const results = document.getElementById("oralExamResultScreen");

    if (dash) dash.classList.remove("hidden");
    if (active) active.classList.add("hidden");
    if (loading) loading.classList.add("hidden");
    if (results) results.classList.add("hidden");
  }

  function updateOralDashboardUI() {
    const summary = sm.getOverallAverage();
    const boardAvgEl = document.getElementById("boardOverallAverage");
    const boardCountEl = document.getElementById("boardCompletedCount");
    
    // Banner exclusivo de Cuadro de Honor (Solo >= 9.0 con 6 parciales)
    const boardHonorEl = document.getElementById("boardHonorBanner");
    const boardHonorGradeText = document.getElementById("boardHonorGradeText");

    if (boardAvgEl) {
      boardAvgEl.textContent = summary.average !== null ? `${summary.average} / 10` : "-- / 10";
      if (summary.average !== null) {
        boardAvgEl.className = summary.average >= 7.0
          ? "text-4xl font-black text-emerald-400 font-mono tracking-tight"
          : "text-4xl font-black text-rose-400 font-mono tracking-tight";
      }
    }

    if (boardCountEl) {
      boardCountEl.textContent = `${summary.completedCount} de 6 Completados`;
    }

    // Banner de Cuadro de Honor (EXCLUSIVO >= 9.0)
    if (boardHonorEl) {
      if (summary.isHonor) {
        boardHonorEl.classList.remove("hidden");
        if (boardHonorGradeText) boardHonorGradeText.textContent = `${summary.average} / 10`;
      } else {
        boardHonorEl.classList.add("hidden");
      }
    }

    // Vitrina de Honor: Medalla de Oro (EXCLUSIVA >= 9.0)
    const cardGold = document.getElementById("medalCard_gold");
    const iconGold = document.getElementById("medalGoldIconWrapper");
    const titleGold = document.getElementById("medalGoldTitle");
    const statusGold = document.getElementById("medalStatus_gold");
    const medalsSummaryEl = document.getElementById("boardMedalsSummaryText");

    if (cardGold && statusGold) {
      if (summary.isHonor) {
        cardGold.className = "bg-gradient-to-r from-amber-950/60 via-yellow-950/40 to-amber-950/60 border-2 border-amber-400 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 transition opacity-100 shadow-2xl shadow-amber-500/25 animate-pulse";
        if (iconGold) iconGold.className = "w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/50 flex items-center justify-center text-3xl shrink-0";
        if (titleGold) titleGold.innerHTML = "👑 ¡Medalla de Oro Desbloqueada! · Cuadro de Honor";
        statusGold.textContent = "✓ ¡Otorgada por la Cátedra de Nutrición Infantil UNSTA!";
        statusGold.className = "text-[11px] font-bold text-amber-300 block mt-1";
        if (medalsSummaryEl) {
          medalsSummaryEl.textContent = "1 de 1 Desbloqueada · ¡Cuadro de Honor!";
          medalsSummaryEl.className = "text-[11px] font-mono font-bold text-amber-400";
        }
      } else {
        cardGold.className = "bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 transition opacity-50";
        if (iconGold) iconGold.className = "w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center text-3xl shrink-0";
        if (titleGold) titleGold.innerHTML = "Medalla de Oro Laureada · Cuadro de Honor";
        statusGold.textContent = summary.completedCount === 6
          ? `🔒 Bloqueada (Promedio obtenido: ${summary.average || 0} / Requisito: ≥ 9.0)`
          : `🔒 Bloqueada (Rinde los 6 parciales con promedio ≥ 9.0)`;
        statusGold.className = "text-[11px] font-bold text-slate-500 block mt-1";
        if (medalsSummaryEl) {
          medalsSummaryEl.textContent = "Requisito: Promedio ≥ 9.0";
          medalsSummaryEl.className = "text-[11px] font-mono text-slate-400";
        }
      }
    }

    // Actualizar badges de los 6 parciales
    const partialKeys = ["u5_p1", "u5_p2", "u6_p1", "u6_p2", "u7_p1", "u7_p2"];
    partialKeys.forEach(k => {
      const badge = document.getElementById(`gradeBadge_${k}`);
      const btn = document.querySelector(`.btn-start-partial[data-partial="${k}"]`);
      const record = summary.grades ? summary.grades[k] : null;

      if (badge) {
        if (record && typeof record.grade === "number") {
          const isPassed = record.grade >= 7.0;
          badge.textContent = `Nota: ${record.grade} / 10`;
          badge.className = isPassed
            ? "text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            : "text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30";
        } else {
          badge.textContent = "Pendiente";
          badge.className = "text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700";
        }
      }

      if (btn) {
        if (record && typeof record.grade === "number") {
          btn.innerHTML = `<i class="fa-solid fa-rotate text-xs"></i> <span>Reintentar Parcial (${record.grade}/10)</span>`;
        } else {
          btn.innerHTML = `<i class="fa-solid fa-microphone text-xs"></i> <span>Rendir Parcial (10 Preguntas)</span>`;
        }
      }
    });
  }

  function startOralExamForPartial(partialKey) {
    const nameInput = document.getElementById("oralStudentNameInput");
    const upInput = document.getElementById("oralStudentUpInput");

    const name = nameInput ? nameInput.value.trim() : "";
    const up = upInput ? upInput.value.trim() : "";

    if (!name) {
      alert("Por favor ingresa tu Nombre y Apellido antes de comenzar.");
      if (nameInput) nameInput.focus();
      return;
    }

    sm.setStudentInfo(name, up);
    initHeaderStats();

    currentOralPartialKey = partialKey;
    const partialData = FLASHCARDS_DECKS[partialKey];
    if (!partialData || !partialData.cards || partialData.cards.length === 0) {
      alert("No se encontraron tarjetas para este parcial.");
      return;
    }

    // Seleccionar EXACTAMENTE 10 preguntas aleatorias de este parcial
    const shuffled = [...partialData.cards].sort(() => Math.random() - 0.5);
    oralExamQuestions = shuffled.slice(0, TOTAL_ORAL_QUESTIONS);

    oralExamCurrentIndex = 0;
    oralStudentAnswers = new Array(TOTAL_ORAL_QUESTIONS).fill(null);
    currentQuestionAudioUrl = null;
    currentQuestionTranscript = "";
    currentQuestionDuration = 0;
    oralExamActive = true;

    // Actualizar encabezado del parcial en la mesa de examen
    const titleEl = document.getElementById("oralExamPartialTitle");
    if (titleEl) {
      titleEl.textContent = `${partialData.title}`;
    }

    // Cambiar de pantalla
    document.getElementById("oralDashboardScreen").classList.add("hidden");
    document.getElementById("oralExamResultScreen").classList.add("hidden");
    document.getElementById("oralExamLoadingScreen").classList.add("hidden");
    document.getElementById("oralExamActiveScreen").classList.remove("hidden");

    renderOralPillsNavigation();
    renderOralExamQuestion();
  }

  function renderOralPillsNavigation() {
    const container = document.getElementById("oralPillsContainer");
    if (!container) return;

    container.innerHTML = "";
    for (let i = 0; i < TOTAL_ORAL_QUESTIONS; i++) {
      const pillBtn = document.createElement("button");
      pillBtn.type = "button";
      pillBtn.id = `oralPill_${i}`;

      const hasAudio = oralStudentAnswers[i] && oralStudentAnswers[i].audioUrl;
      const isCurrent = (i === oralExamCurrentIndex);

      let classes = "w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ";
      if (isCurrent) {
        classes += "bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-md scale-105";
      } else if (hasAudio) {
        classes += "bg-emerald-950/70 text-emerald-300 border border-emerald-500/50";
      } else {
        classes += "bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700";
      }

      pillBtn.className = classes;
      pillBtn.innerHTML = hasAudio
        ? `<i class="fa-solid fa-check text-[10px]"></i>`
        : `${i + 1}`;
      pillBtn.title = `Ir a Pregunta ${i + 1}`;

      pillBtn.addEventListener("click", async () => {
        if (recorder.isRecording) {
          await recorder.stopRecording();
        }
        saveCurrentQuestionAnswer();
        oralExamCurrentIndex = i;
        renderOralExamQuestion();
      });

      container.appendChild(pillBtn);
    }
  }

  function renderOralExamQuestion() {
    const q = oralExamQuestions[oralExamCurrentIndex];

    const topicEl = document.getElementById("oralExamTopicBadge");
    const counterEl = document.getElementById("oralExamQuestionCounter");
    const qTextEl = document.getElementById("oralExamQuestionText");

    if (topicEl) {
      topicEl.textContent = q.tags ? q.tags.join(" • ") : "EXAMEN ORAL";
    }
    if (counterEl) {
      counterEl.textContent = `Pregunta ${oralExamCurrentIndex + 1} de ${TOTAL_ORAL_QUESTIONS}`;
    }
    if (qTextEl) {
      qTextEl.textContent = q.question;
    }

    renderOralPillsNavigation();
    resetOralRecordUI();

    const existing = oralStudentAnswers[oralExamCurrentIndex];
    if (existing && existing.audioUrl) {
      currentQuestionAudioUrl = existing.audioUrl;
      currentQuestionTranscript = existing.studentTranscript;
      currentQuestionDuration = existing.durationSecs;

      const playerWrapper = document.getElementById("oralPlaybackWrapper");
      const player = document.getElementById("oralRecordedPlayer");
      const transcriptWrapper = document.getElementById("oralLiveTranscriptWrapper");
      const transcriptText = document.getElementById("oralLiveTranscriptText");
      const savedBadge = document.getElementById("oralAudioSavedBadge");

      if (playerWrapper && player && existing.audioUrl) {
        player.src = existing.audioUrl;
        playerWrapper.classList.remove("hidden");
      }
      if (transcriptWrapper && transcriptText && existing.studentTranscript) {
        transcriptText.textContent = existing.studentTranscript;
        transcriptWrapper.classList.remove("hidden");
      }
      if (savedBadge) savedBadge.classList.remove("hidden");
    } else {
      currentQuestionAudioUrl = null;
      currentQuestionTranscript = "";
      currentQuestionDuration = 0;
    }

    const btnNext = document.getElementById("btnOralNextQuestion");
    if (btnNext) {
      if (oralExamCurrentIndex === TOTAL_ORAL_QUESTIONS - 1) {
        btnNext.innerHTML = `<span>✨ Entregar y Calificar con IA</span> <i class="fa-solid fa-graduation-cap ml-1"></i>`;
        btnNext.className = "px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black rounded-xl shadow-lg transition";
      } else {
        btnNext.innerHTML = `<span>Siguiente Pregunta</span> <i class="fa-solid fa-chevron-right ml-1"></i>`;
        btnNext.className = "px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-lg transition";
      }
    }

    const btnPrev = document.getElementById("btnOralPrevQuestion");
    if (btnPrev) {
      if (oralExamCurrentIndex === 0) {
        btnPrev.classList.add("invisible");
      } else {
        btnPrev.classList.remove("invisible");
      }
    }
  }

  async function toggleOralExamRecording() {
    const btn = document.getElementById("btnRecordOralAnswer");
    const btnText = document.getElementById("btnRecordOralAnswerText");
    const timerBadge = document.getElementById("oralRecordingBadge");
    const timerText = document.getElementById("oralRecordTimerText");
    const transcriptWrapper = document.getElementById("oralLiveTranscriptWrapper");
    const transcriptText = document.getElementById("oralLiveTranscriptText");
    const savedBadge = document.getElementById("oralAudioSavedBadge");
    const playerWrapper = document.getElementById("oralPlaybackWrapper");
    const player = document.getElementById("oralRecordedPlayer");

    if (!recorder.isRecording) {
      if (savedBadge) savedBadge.classList.add("hidden");
      if (playerWrapper) playerWrapper.classList.add("hidden");
      if (transcriptWrapper) transcriptWrapper.classList.remove("hidden");
      if (timerBadge) timerBadge.classList.remove("hidden");
      if (transcriptText) transcriptText.textContent = "Te escucho con atención... habla con claridad.";

      if (btn) {
        btn.className = "px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm flex items-center space-x-2 mx-auto recording-pulse shadow-lg transition active:scale-95";
      }
      if (btnText) btnText.textContent = "⏹️ Detener y Guardar Audio";

      await recorder.startRecording(
        (secs) => {
          const m = Math.floor(secs / 60).toString().padStart(2, "0");
          const s = (secs % 60).toString().padStart(2, "0");
          if (timerText) timerText.textContent = `${m}:${s}`;
        },
        (liveText) => {
          if (transcriptText) transcriptText.textContent = liveText || "...";
        },
        (err) => {
          alert("No se pudo iniciar el micrófono. Revisa los permisos en tu navegador.");
          resetOralRecordUI();
        }
      );

    } else {
      const result = await recorder.stopRecording();
      resetOralRecordUI();

      if (result) {
        currentQuestionAudioUrl = result.audioUrl;
        currentQuestionTranscript = result.transcript;
        currentQuestionDuration = result.durationSecs;

        if (playerWrapper && player && result.audioUrl) {
          player.src = result.audioUrl;
          playerWrapper.classList.remove("hidden");
        }
        if (transcriptWrapper && transcriptText) {
          transcriptText.textContent = result.transcript || "(Audio registrado con éxito)";
          transcriptWrapper.classList.remove("hidden");
        }
        if (savedBadge) savedBadge.classList.remove("hidden");

        saveCurrentQuestionAnswer();
        renderOralPillsNavigation();
      }
    }
  }

  function resetOralRecordUI() {
    const btn = document.getElementById("btnRecordOralAnswer");
    const btnText = document.getElementById("btnRecordOralAnswerText");
    const timerBadge = document.getElementById("oralRecordingBadge");
    const transcriptWrapper = document.getElementById("oralLiveTranscriptWrapper");
    const savedBadge = document.getElementById("oralAudioSavedBadge");
    const playerWrapper = document.getElementById("oralPlaybackWrapper");

    if (btn) {
      btn.className = "px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center space-x-2 mx-auto shadow-lg shadow-rose-600/30 transition active:scale-95";
    }
    if (btnText) btnText.textContent = "Grabar mi Respuesta";
    if (timerBadge) timerBadge.classList.add("hidden");
    if (transcriptWrapper) transcriptWrapper.classList.add("hidden");
    if (savedBadge) savedBadge.classList.add("hidden");
    if (playerWrapper) playerWrapper.classList.add("hidden");
  }

  function saveCurrentQuestionAnswer() {
    const q = oralExamQuestions[oralExamCurrentIndex];
    if (!q) return;

    oralStudentAnswers[oralExamCurrentIndex] = {
      question: q.question,
      officialAnswer: q.answer,
      keyPoints: q.keyPoints || [],
      keywords: q.keywords || [],
      studentTranscript: currentQuestionTranscript || "El estudiante no respondió verbalmente o no se detectó audio.",
      audioUrl: currentQuestionAudioUrl,
      durationSecs: currentQuestionDuration || 0
    };
  }

  async function handleOralNextQuestion() {
    if (recorder.isRecording) {
      await recorder.stopRecording();
    }
    saveCurrentQuestionAnswer();

    if (!currentQuestionAudioUrl && !currentQuestionTranscript) {
      const confirmSkip = confirm(`No has grabado tu respuesta oral para la Pregunta ${oralExamCurrentIndex + 1}. ¿Deseas continuar de todos modos sin responder?`);
      if (!confirmSkip) return;
    }

    if (oralExamCurrentIndex < TOTAL_ORAL_QUESTIONS - 1) {
      oralExamCurrentIndex++;
      currentQuestionAudioUrl = null;
      currentQuestionTranscript = "";
      currentQuestionDuration = 0;
      renderOralExamQuestion();
    } else {
      const missingCount = oralStudentAnswers.filter(a => !a || (!a.audioUrl && a.studentTranscript.startsWith("El estudiante no"))).length;
      let promptMsg = `¿Deseas finalizar tu examen oral y enviar las 10 respuestas de este parcial a calificar con la Inteligencia Artificial?`;
      if (missingCount > 0) {
        promptMsg = `Tienes ${missingCount} de las 10 preguntas sin audio grabado. ¿Deseas entregar el examen de todos modos?`;
      }
      if (confirm(promptMsg)) {
        submitOralExamToAI();
      }
    }
  }

  function handleOralPrevQuestion() {
    if (recorder.isRecording) recorder.stopRecording();
    saveCurrentQuestionAnswer();

    if (oralExamCurrentIndex > 0) {
      oralExamCurrentIndex--;
      renderOralExamQuestion();
    }
  }

  async function submitOralExamToAI() {
    oralExamActive = false;

    document.getElementById("oralExamActiveScreen").classList.add("hidden");
    document.getElementById("oralExamLoadingScreen").classList.remove("hidden");

    const studentName = sm.state.studentName || "Estudiante UNSTA";
    const up = sm.state.up || "UNSTA";

    for (let i = 0; i < TOTAL_ORAL_QUESTIONS; i++) {
      if (!oralStudentAnswers[i]) {
        const q = oralExamQuestions[i];
        oralStudentAnswers[i] = {
          question: q.question,
          officialAnswer: q.answer,
          keyPoints: q.keyPoints || [],
          keywords: q.keywords || [],
          studentTranscript: "El estudiante omitió responder esta pregunta.",
          audioUrl: null,
          durationSecs: 0
        };
      }
    }

    try {
      const evaluation = await ai.evaluateExam(studentName, up, oralStudentAnswers);
      renderOralExamResults(evaluation);
    } catch (err) {
      console.warn("Error en evaluación con IA remota, activando respaldo heurístico:", err);
      const fallback = ai.heuristicFallback(oralStudentAnswers);
      renderOralExamResults(fallback);
    }
  }

  function renderOralExamResults(result) {
    document.getElementById("oralExamLoadingScreen").classList.add("hidden");
    document.getElementById("oralExamResultScreen").classList.remove("hidden");

    // Guardar la nota oficial de este parcial específico en Storage
    sm.recordPartialGrade(currentOralPartialKey, result.finalGrade);
    initHeaderStats();

    // Banner de Honor EXCLUSIVO si nota >= 9 en este parcial
    const honorBanner = document.getElementById("oralHonorDistinctionBanner");
    const isHonor = result.finalGrade >= 9.0 || result.isHonor;
    if (honorBanner) {
      if (isHonor) {
        honorBanner.classList.remove("hidden");
      } else {
        honorBanner.classList.add("hidden");
      }
    }

    // Sincronización oficial con Firebase Firestore
    syncExamToFirestore(currentOralPartialKey, result, oralStudentAnswers);

    // Nota Grande y Estado
    const gradeBadge = document.getElementById("oralFinalGradeBadge");
    const statusTitle = document.getElementById("oralStatusTitle");
    const feedbackText = document.getElementById("oralGeneralFeedbackText");

    if (gradeBadge) {
      gradeBadge.textContent = `${result.finalGrade} / 10`;
      gradeBadge.className = result.passed
        ? "text-6xl font-black text-emerald-400 font-mono tracking-tight"
        : "text-6xl font-black text-rose-400 font-mono tracking-tight";
    }

    if (statusTitle) {
      statusTitle.textContent = result.statusTitle || (result.passed ? "¡Aprobado con Solvencia!" : "A Recuperar");
      statusTitle.className = result.passed
        ? "text-lg sm:text-xl font-bold text-emerald-400"
        : "text-lg sm:text-xl font-bold text-rose-400";
    }

    if (feedbackText) {
      feedbackText.textContent = result.generalFeedback;
    }

    // Desglose de las 10 Preguntas con feedback de la IA, transcripción y reproductor
    const listEl = document.getElementById("oralQuestionsBreakdownList");
    if (listEl && result.questionsReview) {
      listEl.innerHTML = result.questionsReview.map((rev, idx) => {
        const studentAns = oralStudentAnswers[idx];
        const rawTranscript = studentAns ? (studentAns.studentTranscript || "") : "";
        const isSkipped = !rawTranscript || rawTranscript.startsWith("El estudiante no") || rawTranscript.startsWith("El estudiante omitió");
        const transcriptDisplay = isSkipped
          ? `<span class="text-slate-400 italic font-sans">(Sin respuesta de voz registrada)</span>`
          : `"${rawTranscript}"`;

        const audioPlayerHtml = studentAns && studentAns.audioUrl
          ? `<div class="pt-2 border-t border-slate-800/80">
               <span class="text-[10px] text-slate-400 block mb-1"><i class="fa-solid fa-volume-high mr-1"></i> Escuchar tu grabación de audio:</span>
               <audio controls src="${studentAns.audioUrl}" class="w-full h-8 rounded-lg"></audio>
             </div>`
          : "";

        return `
          <div class="bg-slate-900 border ${rev.grade >= 7 ? "border-emerald-500/30" : "border-rose-500/30"} rounded-2xl p-4 sm:p-5 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-400">Pregunta ${idx + 1} de 10</span>
              <span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${rev.grade >= 7 ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/20 text-rose-300 border border-rose-500/30"}">
                Nota: ${rev.grade} / 10
              </span>
            </div>

            <h5 class="text-sm font-bold text-slate-100">${rev.question}</h5>

            <!-- Transcripción del Alumno -->
            <div class="bg-slate-950/80 border border-indigo-500/30 p-3 rounded-xl space-y-1">
              <span class="text-[10px] uppercase font-extrabold tracking-wider text-indigo-400 flex items-center space-x-1.5">
                <i class="fa-solid fa-microphone-lines"></i>
                <span>Tu Respuesta Grabada (Transcripción de tu voz):</span>
              </span>
              <p class="text-xs text-slate-200 italic leading-relaxed pl-2.5 border-l-2 border-indigo-500/60 font-sans">
                ${transcriptDisplay}
              </p>
            </div>

            <!-- Aciertos y A reforzar de la IA -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5 text-xs">
              <div class="bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-xl">
                <strong class="text-emerald-400 block mb-0.5"><i class="fa-solid fa-check mr-1"></i> Aciertos:</strong>
                <p class="text-slate-300">${rev.strengths}</p>
              </div>
              <div class="bg-amber-950/20 border border-amber-500/20 p-2.5 rounded-xl">
                <strong class="text-amber-400 block mb-0.5"><i class="fa-solid fa-triangle-exclamation mr-1"></i> A reforzar:</strong>
                <p class="text-slate-300">${rev.improvements}</p>
              </div>
            </div>

            <!-- Reproductor de Audio -->
            ${audioPlayerHtml}
          </div>
        `;
      }).join("");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function syncExamToFirestore(partialKey, result, answers) {
    if (!db) return;
    const up = String(sm.state.up || "").trim();
    const studentName = sm.state.studentName || "Estudiante UNSTA";
    if (!up || up === "Sin Legajo" || up === "UNSTA") {
      console.log("[Firestore] Sin UP válido para sincronizar.");
      return;
    }

    try {
      const summary = sm.getOverallAverage();
      const studentRef = db.collection('students').doc(up);
      const studentDoc = await studentRef.get();

      if (studentDoc.exists) {
        const updateData = {
          "oralExams.completedCount": summary.completedCount,
          "oralExams.average": summary.average,
          "oralExams.isHonor": summary.isHonor,
          "oralExams.lastUpdated": new Date().toISOString(),
          [`oralExams.partials.${partialKey}`]: {
            grade: result.finalGrade,
            passed: result.passed,
            date: new Date().toLocaleDateString()
          }
        };

        // Si completa los 6 y alcanza Cuadro de Honor (>= 9.0), acreditar +10 XP y distinción
        if (summary.isHonor) {
          updateData["xp"] = firebase.firestore.FieldValue.increment(10);
          updateData["honorDistinction"] = {
            style: "gold",
            title: "CUADRO DE HONOR",
            icon: "fa-crown",
            earnedAt: new Date().toISOString()
          };
        }

        await studentRef.update(updateData);
        console.log(`[Firestore] Calificación del parcial ${partialKey} guardada en students/${up}.`);
      }

      // Guardar entrega detallada con transcripciones para el visor de respuestas
      const formattedAnswers = (answers || []).map((ans, i) => {
        const review = result.questionsReview?.[i] || {};
        return {
          questionNumber: i + 1,
          question: ans.question,
          officialAnswer: ans.officialAnswer,
          keyPoints: ans.keyPoints || [],
          studentTranscript: ans.studentTranscript || "",
          grade: review.grade || 0,
          strengths: review.strengths || "",
          improvements: review.improvements || ""
        };
      });

      // Guardar localmente de inmediato en LocalStorage
      if (typeof sm.recordPartialSubmission === 'function') {
        sm.recordPartialSubmission(partialKey, {
          up,
          studentName,
          partialKey,
          grade: result.finalGrade,
          passed: result.passed,
          generalFeedback: result.generalFeedback || "",
          timestamp: new Date().toISOString(),
          answers: formattedAnswers
        });
      }

      await db.collection('oral_submissions').doc(`${up}_${partialKey}`).set({
        up,
        studentName,
        partialKey,
        grade: result.finalGrade,
        passed: result.passed,
        generalFeedback: result.generalFeedback || "",
        timestamp: new Date().toISOString(),
        answers: formattedAnswers
      }, { merge: true });

      console.log(`[Firestore] Respuestas detalladas guardadas en oral_submissions/${up}_${partialKey}.`);
    } catch(err) {
      console.warn("[Firestore] Error al sincronizar con Firebase:", err);
    }
  }

});
