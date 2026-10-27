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
  let currentQuestionAudioBlob = null;
  let currentQuestionTranscript = "";
  let currentQuestionDuration = 0;
  let oralWordEditsPerQuestion = {};
  let currentExamResult = null;

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
    console.warn("Error leyendo parámetros de URL:", e);
  }

  // Inicialización
  initHeaderStats();
  setupSectionNavigation();
  setupRepasoDeck();
  setupOralExamDashboard();
  setupRankingSection();

  // Si se solicita directamente la pestaña de Examen Oral o Ranking por URL
  if (paramTab && (paramTab === 'evaluacion' || paramTab === 'oral')) {
    setTimeout(() => {
      if (typeof window.switchTab === 'function') {
        window.switchTab('evaluacion');
      }
    }, 50);
  } else if (paramTab === 'ranking') {
    setTimeout(() => {
      if (typeof window.switchTab === 'function') {
        window.switchTab('ranking');
      }
    }, 50);
  }

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
    const btnRanking = document.getElementById("tabBtn_ranking");
    const secRepaso = document.getElementById("section_repaso");
    const secEvaluacion = document.getElementById("section_evaluacion");
    const secRanking = document.getElementById("section_ranking");

    const setActiveTab = (tab) => {
      currentSection = tab;
      const activeClass = "flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-1.5 sm:space-x-2 transition shadow-md bg-indigo-600 text-white cursor-pointer";
      const inactiveClass = "flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-1.5 sm:space-x-2 transition text-slate-400 hover:bg-slate-800 cursor-pointer";

      if (btnRepaso) btnRepaso.className = (tab === 'repaso') ? activeClass : inactiveClass;
      if (btnEvaluacion) btnEvaluacion.className = (tab === 'evaluacion') ? activeClass : inactiveClass;
      if (btnRanking) btnRanking.className = (tab === 'ranking') ? activeClass : inactiveClass;

      if (secRepaso) secRepaso.classList.toggle("hidden", tab !== 'repaso');
      if (secEvaluacion) secEvaluacion.classList.toggle("hidden", tab !== 'evaluacion');
      if (secRanking) secRanking.classList.toggle("hidden", tab !== 'ranking');
    };

    window.switchTab = (tab) => {
      console.log(`[Navigation] Cambiando a pestaña: ${tab}`);
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (tab === "evaluacion") {
        if (!oralExamActive) {
          showDashboardScreen();
        }
        updateOralDashboardUI();
      } else if (tab === "ranking") {
        loadRankingData();
      }
    };

    if (btnRepaso) {
      btnRepaso.addEventListener("click", () => window.switchTab("repaso"));
    }

    if (btnEvaluacion) {
      btnEvaluacion.addEventListener("click", () => window.switchTab("evaluacion"));
    }

    if (btnRanking) {
      btnRanking.addEventListener("click", () => window.switchTab("ranking"));
    }
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
          let xpTag = "";
          if (record.grade >= 9.0) xpTag = " (+2 XP)";
          else if (record.grade >= 8.0) xpTag = " (+1 XP)";
          badge.textContent = `Nota: ${record.grade} / 10${xpTag}`;
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

    // Verificar si el alumno ya rindió este parcial con anterioridad
    const existingRecord = sm.state.partialGrades ? sm.state.partialGrades[partialKey] : null;
    if (existingRecord && typeof existingRecord.grade === 'number') {
      const isPassed = existingRecord.grade >= 7.0;
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: '¿Rendir este parcial de nuevo?',
          html: `
            <div class="text-left text-xs sm:text-sm space-y-3">
              <p class="text-slate-300">
                Actualmente ya tienes una calificación oficial registrada en este parcial:
              </p>
              <div class="text-center bg-slate-900 border ${isPassed ? 'border-emerald-500/50' : 'border-rose-500/50'} p-3 rounded-2xl">
                <span class="text-3xl font-black ${isPassed ? 'text-emerald-400' : 'text-rose-400'} font-mono">
                  ${existingRecord.grade} / 10
                </span>
                <p class="text-[11px] text-slate-400 mt-1">
                  Estado: <strong class="${isPassed ? 'text-emerald-300' : 'text-rose-300'}">${isPassed ? 'Aprobado' : 'A Recuperar'}</strong> ${existingRecord.date ? `(${existingRecord.date})` : ''}
                </p>
              </div>
              <div class="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl flex items-start gap-2">
                <i class="fa-solid fa-triangle-exclamation text-amber-400 mt-0.5"></i>
                <span>
                  <strong>Atención docente:</strong> Si inicias este intento, responderás 10 nuevas preguntas orales y <strong>tu calificación anterior se actualizará con el nuevo resultado que obtengas</strong> en este parcial.
                </span>
              </div>
            </div>
          `,
          background: '#0f172a',
          color: '#f8fafc',
          showCancelButton: true,
          confirmButtonText: '<i class="fa-solid fa-rotate mr-1.5"></i> Sí, Rendir de Nuevo',
          cancelButtonText: 'Cancelar (Mantener Nota)',
          confirmButtonColor: '#6366f1',
          cancelButtonColor: '#475569',
          customClass: { popup: 'border border-indigo-500/30 rounded-2xl' }
        }).then((res) => {
          if (res.isConfirmed) {
            launchOralExamSession(partialKey, partialData);
          }
        });
        return;
      } else {
        const proceed = confirm(`Ya tienes una nota de ${existingRecord.grade}/10 en este parcial. Si rindes de nuevo, tu calificación se actualizará con el nuevo intento. ¿Deseas continuar?`);
        if (!proceed) return;
      }
    }

    launchOralExamSession(partialKey, partialData);
  }

  function launchOralExamSession(partialKey, partialData) {
    // Seleccionar EXACTAMENTE 10 preguntas aleatorias de este parcial
    const shuffled = [...partialData.cards].sort(() => Math.random() - 0.5);
    oralExamQuestions = shuffled.slice(0, TOTAL_ORAL_QUESTIONS);

    oralExamCurrentIndex = 0;
    oralStudentAnswers = new Array(TOTAL_ORAL_QUESTIONS).fill(null);
    oralWordEditsPerQuestion = {};
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
      const hasTranscript = oralStudentAnswers[i] && oralStudentAnswers[i].studentTranscript && !oralStudentAnswers[i].studentTranscript.startsWith("El estudiante no");
      const isCurrent = (i === oralExamCurrentIndex);

      let classes = "w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ";
      if (isCurrent) {
        classes += "bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-md scale-105";
      } else if (hasAudio && hasTranscript) {
        classes += "bg-emerald-950/70 text-emerald-300 border border-emerald-500/50";
      } else if (hasAudio && !hasTranscript) {
        classes += "bg-amber-950/70 text-amber-300 border border-amber-500/50";
      } else {
        classes += "bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700";
      }

      pillBtn.className = classes;
      if (hasAudio && hasTranscript) {
        pillBtn.innerHTML = `<i class="fa-solid fa-check text-[10px]"></i>`;
      } else if (hasAudio && !hasTranscript) {
        pillBtn.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-[10px] text-amber-400"></i>`;
      } else {
        pillBtn.innerHTML = `${i + 1}`;
      }
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
        const durationEl = document.getElementById("oralPlaybackDurationText");
        if (durationEl) durationEl.textContent = formatDuration(existing.durationSecs || 0);
        playerWrapper.classList.remove("hidden");

        if (!player.dataset.fixedDurationBound) {
          player.dataset.fixedDurationBound = "true";
          player.addEventListener('loadedmetadata', () => {
            if (player.duration === Infinity || player.duration > 3600) {
              player.currentTime = Number.MAX_SAFE_INTEGER;
              player.addEventListener('timeupdate', function onTime() {
                player.currentTime = 0;
                player.removeEventListener('timeupdate', onTime);
              }, { once: true });
            }
          });
        }
      }
      if (transcriptWrapper && existing.studentTranscript) {
        transcriptWrapper.classList.remove("hidden");
        renderInteractiveTranscriptWords();
      }
      if (savedBadge) savedBadge.classList.remove("hidden");
    } else {
      currentQuestionAudioUrl = null;
      currentQuestionAudioBlob = null;
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
    const savedBadge = document.getElementById("oralAudioSavedBadge");
    const playerWrapper = document.getElementById("oralPlaybackWrapper");
    const player = document.getElementById("oralRecordedPlayer");

    if (!recorder.isRecording) {
      if (savedBadge) savedBadge.classList.add("hidden");
      if (playerWrapper) playerWrapper.classList.add("hidden");
      if (transcriptWrapper) transcriptWrapper.classList.add("hidden"); // Oculto durante la grabación
      if (timerBadge) timerBadge.classList.remove("hidden");

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
        null, // Sin transcripción en tiempo real durante la grabación
        (err) => {
          alert("No se pudo iniciar el micrófono. Revisa los permisos en tu navegador.");
          resetOralRecordUI();
        }
      );

    } else {
      if (btnText) btnText.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Transcribiendo audio...';
      const container = document.getElementById("oralLiveTranscriptContainer");
      if (container) {
        container.innerHTML = '<span class="text-indigo-400 font-semibold animate-pulse flex items-center gap-2"><i class="fa-solid fa-wand-magic-sparkles"></i> Procesando audio con alta precisión fonética...</span>';
      }
      if (transcriptWrapper) transcriptWrapper.classList.remove("hidden");
      if (btn) btn.disabled = true;

      const result = await recorder.stopRecording();
      resetOralRecordUI();
      if (btn) btn.disabled = false;

      if (result) {
        currentQuestionAudioUrl = result.audioUrl;
        currentQuestionAudioBlob = result.audioBlob;
        currentQuestionTranscript = result.transcript;
        currentQuestionDuration = result.durationSecs;

        if (playerWrapper && player && result.audioUrl) {
          player.src = result.audioUrl;
          const durationEl = document.getElementById("oralPlaybackDurationText");
          if (durationEl) durationEl.textContent = formatDuration(result.durationSecs || 0);
          playerWrapper.classList.remove("hidden");

          if (!player.dataset.fixedDurationBound) {
            player.dataset.fixedDurationBound = "true";
            player.addEventListener('loadedmetadata', () => {
              if (player.duration === Infinity || player.duration > 3600) {
                player.currentTime = Number.MAX_SAFE_INTEGER;
                player.addEventListener('timeupdate', function onTime() {
                  player.currentTime = 0;
                  player.removeEventListener('timeupdate', onTime);
                }, { once: true });
              }
            });
          }
        }
        if (transcriptWrapper) {
          transcriptWrapper.classList.remove("hidden");
          renderInteractiveTranscriptWords();
        }
        if (savedBadge) savedBadge.classList.remove("hidden");

        saveCurrentQuestionAnswer();
        renderOralPillsNavigation();
      }
    }
  }

  function formatDuration(secs) {
    const s = Math.max(0, Math.round(secs || 0));
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const remS = (s % 60).toString().padStart(2, "0");
    return `${m}:${remS}`;
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderInteractiveTranscriptWords() {
    const container = document.getElementById("oralLiveTranscriptContainer");
    const counterEl = document.getElementById("oralWordEditCounter");
    if (!container) return;

    const transcript = (currentQuestionTranscript || "").trim();
    if (!transcript) {
      container.innerHTML = `
        <div class="space-y-2 py-1 w-full text-left">
          <div class="flex items-center gap-2 text-amber-400 text-xs font-semibold">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>Audio registrado con éxito, pero la transcripción automática tardó o se saturó.</span>
          </div>
          <div class="flex flex-wrap items-center gap-2 pt-1">
            <button id="btnRetryTranscribeNow" type="button" class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer">
              <i class="fa-solid fa-rotate-right"></i> <span>Reintentar Transcribir</span>
            </button>
            <button id="btnManualTypeAudioText" type="button" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition cursor-pointer">
              <i class="fa-solid fa-keyboard text-amber-400"></i> <span>Escribir lo que dije en el audio</span>
            </button>
          </div>
        </div>
      `;
      if (counterEl) counterEl.textContent = "";

      const btnRetry = document.getElementById("btnRetryTranscribeNow");
      if (btnRetry) {
        btnRetry.addEventListener("click", async () => {
          btnRetry.disabled = true;
          btnRetry.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Transcribiendo...';
          try {
            if (currentQuestionAudioBlob) {
              const text = await recorder.transcribeWithWhisper(currentQuestionAudioBlob);
              if (text && text.trim().length > 0) {
                currentQuestionTranscript = text.trim();
                saveCurrentQuestionAnswer();
                renderInteractiveTranscriptWords();
                renderOralPillsNavigation();
                return;
              }
            }
            alert("El servidor de transcripción está saturado por la cantidad de alumnos rindiendo a la vez. Por favor toca el botón 'Escribir lo que dije en el audio' para guardar tu respuesta.");
          } catch(e) {
            console.error(e);
          } finally {
            btnRetry.disabled = false;
            btnRetry.innerHTML = '<i class="fa-solid fa-rotate-right mr-1"></i> Reintentar Transcribir';
          }
        });
      }

      const btnManual = document.getElementById("btnManualTypeAudioText");
      if (btnManual) {
        btnManual.addEventListener("click", () => {
          if (typeof Swal === 'undefined') {
            const manualText = prompt("Escribe lo que respondiste en tu grabación de audio:");
            if (manualText && manualText.trim().length > 5) {
              currentQuestionTranscript = manualText.trim();
              saveCurrentQuestionAnswer();
              renderInteractiveTranscriptWords();
              renderOralPillsNavigation();
            }
            return;
          }

          Swal.fire({
            title: '<span class="text-base font-bold text-white">Ingresar Texto de tu Respuesta de Voz</span>',
            html: `
              <div class="text-left text-xs space-y-2 text-slate-300">
                <p>Tu grabación de audio ya quedó registrada en el sistema. Escribe con tus palabras lo que dijiste para que la IA lo evalúe:</p>
                <textarea id="swalManualAudioText" rows="4" class="w-full p-2.5 bg-slate-900 border border-indigo-500/50 rounded-xl text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Escribe aquí lo que dijiste en el audio..."></textarea>
              </div>
            `,
            background: '#0f172a',
            color: '#f8fafc',
            showCancelButton: true,
            confirmButtonText: 'Guardar Respuesta',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#6366f1',
            cancelButtonColor: '#475569',
            preConfirm: () => {
              const val = document.getElementById("swalManualAudioText")?.value?.trim();
              if (!val || val.length < 5) {
                Swal.showValidationMessage("Por favor escribe tu respuesta completa.");
                return false;
              }
              return val;
            }
          }).then((res) => {
            if (res.isConfirmed && res.value) {
              currentQuestionTranscript = res.value;
              saveCurrentQuestionAnswer();
              renderInteractiveTranscriptWords();
              renderOralPillsNavigation();
            }
          });
        });
      }
      return;
    }

    const usedEdits = oralWordEditsPerQuestion[oralExamCurrentIndex] || 0;

    if (counterEl) {
      if (usedEdits > 0) {
        counterEl.innerHTML = `<span class="text-indigo-300 font-medium">Correcciones realizadas: <b>${usedEdits}</b> (toca cualquier palabra para editar)</span>`;
      } else {
        counterEl.innerHTML = `<span class="text-indigo-300/80 font-medium">Toca cualquier palabra para corregirla</span>`;
      }
    }

    container.innerHTML = "";
    const words = transcript.split(/\s+/);
    words.forEach((word, index) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "inline-flex items-center px-2 py-0.5 m-0.5 rounded-lg bg-slate-800/90 hover:bg-indigo-600 hover:text-white text-slate-200 text-xs sm:text-sm font-medium border border-slate-700/70 hover:border-indigo-400 transition cursor-pointer select-none active:scale-95";
      chip.title = "Toca para corregir esta palabra";
      chip.textContent = word;

      chip.addEventListener("click", () => {
        openWordCorrectionModal(index, word);
      });

      container.appendChild(chip);
    });
  }

  function openWordCorrectionModal(wordIndex, oldWord) {
    if (typeof Swal === 'undefined') {
      const userWord = prompt(`Corregir palabra "${oldWord}" (solo 1 palabra, sin espacios):`, oldWord);
      if (userWord && !/\s/.test(userWord.trim())) {
        applyWordCorrection(wordIndex, userWord.trim());
      }
      return;
    }

    Swal.fire({
      title: '<span class="text-base font-black text-white">Corrección Quirúrgica de Palabra</span>',
      html: `
        <div class="text-left text-xs space-y-3">
          <p class="text-slate-300">
            Palabra captada por el micrófono:
          </p>
          <div class="text-sm font-extrabold text-rose-300 bg-rose-950/40 border border-rose-500/40 p-2.5 rounded-xl text-center font-mono select-none">
            "${escapeHtml(oldWord)}"
          </div>
          <div class="space-y-1">
            <label class="block font-bold text-slate-200">
              Palabra correcta médica / técnica (1 sola palabra):
            </label>
            <input id="swalInputSingleWord" 
                   type="text" 
                   maxlength="30" 
                   autocomplete="off" 
                   spellcheck="false" 
                   placeholder="Ej: bioequivalente" 
                   class="w-full px-3 py-2 bg-slate-900 border border-indigo-500/70 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center">
          </div>
          <div class="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 flex items-start gap-2">
            <i class="fa-solid fa-shield-halved text-amber-400 mt-0.5"></i>
            <div>
              <p class="font-bold">Seguridad Anti-Copia Activa:</p>
              <p class="text-slate-400">Pegar texto (Ctrl+V) y barra espaciadora están estrictamente bloqueados. Solo puedes escribir una palabra concreta.</p>
            </div>
          </div>
        </div>
      `,
      background: '#0f172a',
      color: '#f8fafc',
      showCancelButton: true,
      confirmButtonText: '<i class="fa-solid fa-check mr-1.5"></i> Aplicar Corrección',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#475569',
      customClass: {
        popup: 'border border-indigo-500/30 rounded-2xl'
      },
      didOpen: () => {
        const input = document.getElementById('swalInputSingleWord');
        if (!input) return;
        input.focus();

        // 1. Anti-Paste: Bloquear pegado absoluto
        input.addEventListener('paste', (e) => {
          e.preventDefault();
          Swal.showValidationMessage('⚠️ Prohibido pegar texto en el examen oral. Debes escribir la palabra.');
        });

        // 2. Anti-Space: Bloquear barra espaciadora
        input.addEventListener('keydown', (e) => {
          if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            Swal.showValidationMessage('⚠️ Solo 1 palabra concreta. Los espacios no están permitidos.');
          }
        });

        // Resetear advertencias al teclear
        input.addEventListener('input', () => {
          Swal.resetValidationMessage();
        });
      },
      preConfirm: () => {
        const input = document.getElementById('swalInputSingleWord');
        if (!input) return false;
        const cleanVal = input.value.trim();
        if (!cleanVal) {
          Swal.showValidationMessage('Por favor escribe la palabra corregida.');
          return false;
        }
        if (/\s/.test(cleanVal)) {
          Swal.showValidationMessage('⚠️ Solo puedes ingresar una sola palabra (sin espacios).');
          return false;
        }
        if (cleanVal.length > 35) {
          Swal.showValidationMessage('Palabra demasiado larga.');
          return false;
        }
        return cleanVal;
      }
    }).then((res) => {
      if (res.isConfirmed && res.value) {
        applyWordCorrection(wordIndex, res.value);
      }
    });
  }

  function applyWordCorrection(wordIndex, newWord) {
    const transcript = (currentQuestionTranscript || "").trim();
    if (!transcript) return;

    const words = transcript.split(/\s+/);
    if (words[wordIndex] !== undefined) {
      // Reemplazar quirúrgicamente la palabra
      words[wordIndex] = newWord;
      currentQuestionTranscript = words.join(" ");

      oralWordEditsPerQuestion[oralExamCurrentIndex] = (oralWordEditsPerQuestion[oralExamCurrentIndex] || 0) + 1;
      saveCurrentQuestionAnswer();
      renderInteractiveTranscriptWords();

      if (typeof Swal !== 'undefined') {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Palabra actualizada: "${newWord}"`,
          showConfirmButton: false,
          timer: 1800,
          timerProgressBar: true
        });
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

    const currAns = oralStudentAnswers[oralExamCurrentIndex];
    const hasAudio = !!(currAns && currAns.audioUrl && (currAns.durationSecs || 0) >= 2);
    const hasTranscript = !!(currAns && currAns.studentTranscript && !currAns.studentTranscript.startsWith("El estudiante no"));

    if (!hasAudio && !hasTranscript) {
      const confirmSkip = confirm(`No has grabado tu respuesta oral para la Pregunta ${oralExamCurrentIndex + 1}. ¿Deseas continuar de todos modos sin responder?`);
      if (!confirmSkip) return;
    } else if (hasAudio && !hasTranscript) {
      const confirmAudioOnly = confirm(`Detectamos tu grabación de audio (${formatDuration(currAns.durationSecs)}) pero no se detectó texto en la transcripción. ¿Deseas continuar de todos modos o prefieres re-grabar la respuesta antes de avanzar?`);
      if (!confirmAudioOnly) return;
    }

    if (oralExamCurrentIndex < TOTAL_ORAL_QUESTIONS - 1) {
      oralExamCurrentIndex++;
      currentQuestionAudioUrl = null;
      currentQuestionTranscript = "";
      currentQuestionDuration = 0;
      renderOralExamQuestion();
    } else {
      const missingTranscriptCount = oralStudentAnswers.filter(a => !a || !a.studentTranscript || a.studentTranscript.startsWith("El estudiante no")).length;
      let promptMsg = `¿Deseas finalizar tu examen oral y enviar las 10 respuestas de este parcial a calificar con la Inteligencia Artificial?`;
      if (missingTranscriptCount > 0) {
        promptMsg = `⚠️ Atención: Tienes ${missingTranscriptCount} de las 10 preguntas sin respuesta de voz registrada o transcrita. La IA las calificará como preguntas no respondidas. ¿Deseas entregar el examen de todos modos?`;
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
    currentExamResult = result;
    document.getElementById("oralExamLoadingScreen").classList.add("hidden");
    document.getElementById("oralExamResultScreen").classList.remove("hidden");

    // Guardar la nota oficial de este parcial específico en Storage y computar XP ganado
    const xpReport = sm.recordPartialGrade(currentOralPartialKey, result.finalGrade);
    result.xpAwardedReport = xpReport;
    initHeaderStats();

    // Mostrar banner de XP ganado si hubo bonificación
    const xpBanner = document.getElementById("oralXpGainedBanner");
    const xpText = document.getElementById("oralXpGainedText");
    if (xpBanner && xpText) {
      if (xpReport && xpReport.totalXpGained > 0) {
        let msg = `¡Ganaste +${xpReport.totalXpGained} XP!`;
        if (xpReport.deltaXp > 0 && xpReport.honorXpAwarded > 0) {
          msg = `🎉 ¡Ganaste +${xpReport.totalXpGained} XP! (+${xpReport.deltaXp} XP por tu nota en este módulo y +10 XP por el Cuadro de Honor)`;
        } else if (xpReport.deltaXp > 0) {
          msg = `🎉 ¡Ganaste +${xpReport.deltaXp} XP por tu calificación de ${result.finalGrade} / 10 en este módulo!`;
        } else if (xpReport.honorXpAwarded > 0) {
          msg = `👑 ¡Desbloqueaste el Cuadro de Honor! +10 XP acreditados a tu cuenta.`;
        }
        xpText.innerHTML = `<i class="fa-solid fa-coins text-amber-400 mr-1.5"></i> <span>${msg}</span>`;
        xpBanner.classList.remove("hidden");
      } else {
        xpBanner.classList.add("hidden");
      }
    }

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
               <div class="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                 <span><i class="fa-solid fa-volume-high mr-1 text-indigo-400"></i> Escuchar tu grabación de audio:</span>
                 <span class="font-mono text-[11px] text-indigo-300 font-bold bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                   <i class="fa-regular fa-clock mr-1 text-[10px]"></i>${formatDuration(studentAns.durationSecs || 0)}
                 </span>
               </div>
               <audio controls src="${studentAns.audioUrl}" class="w-full h-8 rounded-lg"></audio>
             </div>`
          : "";

        return `
          <div class="bg-slate-900 border ${rev.grade >= 7 ? "border-emerald-500/30" : "border-rose-500/30"} rounded-2xl p-4 sm:p-5 space-y-3">
            <div class="flex items-center justify-between flex-wrap gap-2">
              <span class="text-xs font-bold text-slate-400">Pregunta ${idx + 1} de 10</span>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${rev.grade >= 7 ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/20 text-rose-300 border border-rose-500/30"}">
                  Nota: ${rev.grade} / 10
                </span>
                ${rev.grade < 10
                  ? `<button type="button" 
                             class="btn-recover-single-q px-2.5 py-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition active:scale-95 cursor-pointer"
                             data-qindex="${idx}"
                             title="Re-grabar solo esta pregunta para subir su nota (Costo: 1 XP)">
                       <i class="fa-solid fa-rotate-right text-xs"></i>
                       <span>Recuperar pregunta</span>
                       <span class="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full font-mono">1 XP</span>
                     </button>`
                  : `<span class="text-[11px] text-emerald-400 font-extrabold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                       <i class="fa-solid fa-circle-check"></i> Máximo (10/10)
                     </span>`
                }
              </div>
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

      document.querySelectorAll(".btn-recover-single-q").forEach(btn => {
        btn.addEventListener("click", () => {
          const qIdx = parseInt(btn.dataset.qindex, 10);
          openSingleQuestionRecoveryModal(qIdx);
        });
      });
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getOralExamTitle(key) {
    const titles = {
      u5_p1: "Parcial 1 (U5 - Dietas Basadas en Plantas)",
      u5_p2: "Parcial 2 (U5 - Micronutrientes y B12)",
      u6_p1: "Parcial 3 (U6 - Crecimiento y Apetito)",
      u6_p2: "Parcial 4 (U6 - Requerimientos y CAPA-2)",
      u7_p1: "Parcial 5 (U7 - Embarazo en Adolescencia)",
      u7_p2: "Parcial 6 (U7 - Niño Deportista)"
    };
    return titles[key] || `Módulo ${key}`;
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

        // Sincronizar bonificaciones de XP acumuladas en Firestore y registrar en xpHistory
        if (result.xpAwardedReport) {
          if (result.xpAwardedReport.moduleTargetXp > 0) {
            updateData[`oralExams.partialXpAwarded.${partialKey}`] = result.xpAwardedReport.moduleTargetXp;
          }
          if (result.xpAwardedReport.totalXpGained > 0) {
            updateData["xp"] = firebase.firestore.FieldValue.increment(result.xpAwardedReport.totalXpGained);

            // Registrar en el Historial Oficial de XP del Alumno (xpHistory)
            let sHistory = studentDoc.data().xpHistory || [];
            const prevXP = Number(studentDoc.data().xp || 0);
            let runningXP = prevXP;
            const pTitle = getOralExamTitle(partialKey);

            if (result.xpAwardedReport.deltaXp > 0) {
              runningXP += result.xpAwardedReport.deltaXp;
              sHistory.push({
                timestamp: new Date().toISOString(),
                amount: result.xpAwardedReport.deltaXp,
                reason: `Examen Oral: ${pTitle} (Nota ${result.finalGrade}/10)`,
                newXP: runningXP
              });
            }

            if (result.xpAwardedReport.honorXpAwarded > 0) {
              runningXP += result.xpAwardedReport.honorXpAwarded;
              sHistory.push({
                timestamp: new Date().toISOString(),
                amount: result.xpAwardedReport.honorXpAwarded,
                reason: `👑 Cuadro de Honor: Promedio ${summary.average}/10 en 6 Parciales Orales`,
                newXP: runningXP
              });
            }

            updateData["xpHistory"] = sHistory;
          }
        }

        // Si completa los 6 y alcanza Cuadro de Honor (>= 9.0), acreditar distinción
        if (summary.isHonor) {
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
      cachedStudentsList = null; // Invalidar caché para refresco del ranking
    } catch(err) {
      console.warn("[Firestore] Error al sincronizar con Firebase:", err);
    }
  }

  /* ==========================================================================
     4. SECCIÓN 3: RANKING EN VIVO & CUADRO DE HONOR
     ========================================================================== */
  let rankingSortMode = "oral"; // "oral" o "xp"
  let cachedStudentsList = null;
  let cachedPhotosMap = {};

  function setupRankingSection() {
    const btnFilterOral = document.getElementById("rankFilterOral");
    const btnFilterXp = document.getElementById("rankFilterXp");
    const btnRefresh = document.getElementById("btnRefreshRanking");

    if (btnFilterOral && btnFilterXp) {
      btnFilterOral.addEventListener("click", () => {
        rankingSortMode = "oral";
        btnFilterOral.className = "px-3 py-1.5 rounded-lg font-bold bg-indigo-600 text-white transition flex items-center space-x-1.5 shadow-sm";
        btnFilterXp.className = "px-3 py-1.5 rounded-lg font-bold text-slate-400 hover:text-white transition flex items-center space-x-1.5";
        if (cachedStudentsList) renderRankingUI(cachedStudentsList);
      });

      btnFilterXp.addEventListener("click", () => {
        rankingSortMode = "xp";
        btnFilterXp.className = "px-3 py-1.5 rounded-lg font-bold bg-indigo-600 text-white transition flex items-center space-x-1.5 shadow-sm";
        btnFilterOral.className = "px-3 py-1.5 rounded-lg font-bold text-slate-400 hover:text-white transition flex items-center space-x-1.5";
        if (cachedStudentsList) renderRankingUI(cachedStudentsList);
      });
    }

    if (btnRefresh) {
      btnRefresh.addEventListener("click", () => {
        const icon = btnRefresh.querySelector("i");
        if (icon) icon.classList.add("fa-spin");
        loadRankingData(true).finally(() => {
          if (icon) icon.classList.remove("fa-spin");
        });
      });
    }
  }

  function getInitials(name) {
    if (!name) return "UN";
    const cleaned = String(name).replace(/[,;]/g, ' ').trim();
    const parts = cleaned.split(/\s+/).filter(p => p.length > 0);
    if (parts.length === 0) return "UN";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function renderInitialsAvatar(name, sizeClass = "w-10 h-10", ringClass = "border border-slate-700") {
    const initials = getInitials(name);
    const colors = [
      "from-indigo-600 to-purple-600",
      "from-emerald-600 to-teal-700",
      "from-blue-600 to-cyan-700",
      "from-rose-600 to-pink-700",
      "from-amber-600 to-orange-700"
    ];
    let hash = 0;
    const str = String(name || "");
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    const color = colors[Math.abs(hash) % colors.length];
    return `<div class="${sizeClass} rounded-full bg-gradient-to-br ${color} ${ringClass} flex items-center justify-center font-bold text-white text-xs sm:text-sm shadow-inner shrink-0 select-none">${initials}</div>`;
  }

  function renderAvatarHtml(student, sizeClass = "w-10 h-10", ringClass = "border border-slate-700") {
    const safeName = (student.name || 'Estudiante').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const initialsDiv = renderInitialsAvatar(student.name, sizeClass, ringClass);

    if (student.photo && typeof student.photo === 'string' && (student.photo.startsWith('http') || student.photo.startsWith('data:image'))) {
      return `
        <div class="relative ${sizeClass} shrink-0 inline-block overflow-hidden rounded-full">
          ${initialsDiv}
          <img src="${student.photo}" alt="${safeName}" class="absolute inset-0 w-full h-full rounded-full object-cover ${ringClass} bg-slate-800" onerror="this.remove();">
        </div>
      `;
    }
    return initialsDiv;
  }

  async function loadRankingData(forceRefresh = false) {
    const container = document.getElementById("rankingContainer");
    if (!container) return;

    if (cachedStudentsList && !forceRefresh) {
      renderRankingUI(cachedStudentsList);
      return;
    }

    container.innerHTML = `
      <div class="py-16 text-center space-y-3">
        <i class="fa-solid fa-circle-notch fa-spin text-3xl text-indigo-400"></i>
        <p class="text-sm text-slate-400 font-medium">Sincronizando notas y estudiantes en vivo...</p>
      </div>
    `;

    try {
      if (!db) {
        container.innerHTML = `<div class="p-8 text-center text-rose-400 bg-slate-900 border border-slate-800 rounded-2xl">No se pudo conectar a la base de datos de la cátedra.</div>`;
        return;
      }

      // 1. Obtener fotos auxiliares si aún no están en memoria
      if (Object.keys(cachedPhotosMap).length === 0 || forceRefresh) {
        try {
          const photosSnap = await db.collection("student_photos").get();
          photosSnap.forEach(doc => {
            const data = doc.data() || {};
            if (data.photo) cachedPhotosMap[doc.id] = data.photo;
          });
          const profilesSnap = await db.collection("student_profiles").get();
          profilesSnap.forEach(doc => {
            const data = doc.data() || {};
            if (data.photo && !cachedPhotosMap[doc.id]) cachedPhotosMap[doc.id] = data.photo;
          });
        } catch(e) {
          console.warn("Carga de fotos auxiliares opcional:", e);
        }
      }

      // 2. Obtener colección de estudiantes
      const studentsSnap = await db.collection("students").get();
      let list = [];

      studentsSnap.forEach(doc => {
        const d = doc.data() || {};
        const up = String(d.up || doc.id).trim();

        // Omitir cuentas administrativas o de prueba si no son estudiantes
        if (d.role === 'admin' || up === 'test' || up === 'docente') return;

        const firstName = d.firstName || d.nombre || "";
        const lastName = d.lastName || d.apellido || "";
        let fullName = d.name || `${firstName} ${lastName}`.trim();
        if (!fullName) fullName = `Estudiante (UP ${up})`;

        const photo = cachedPhotosMap[up] || d.avatar || d.photo || null;
        const xp = Number(d.xp || 0);
        let group = d.group || d.grupo || "UNSTA";
        if (typeof group === 'string' && group.startsWith('g_')) {
          group = `Grupo ${group.replace('g_', '')}`;
        }

        const oralData = d.oralExams || {};
        let oralAverage = null;
        if (typeof oralData.average === 'number') oralAverage = oralData.average;
        else if (oralData.average !== undefined && oralData.average !== null && oralData.average !== '') {
          oralAverage = parseFloat(oralData.average);
        }

        const completedCount = Number(oralData.completedCount || 0);
        const isHonor = Boolean(oralData.isHonor || (oralAverage !== null && oralAverage >= 9.0));

        list.push({
          up,
          name: fullName,
          group,
          photo,
          xp,
          oralAverage,
          completedCount,
          isHonor
        });
      });

      // Si el estudiante actual tiene datos locales en sm que aún no impactaron, fusionar
      const currentUp = String(sm.state.up || "").trim();
      if (currentUp) {
        const localStats = (typeof sm.getOverallAverage === 'function') ? sm.getOverallAverage() : ((typeof sm.getStudentOverallStats === 'function') ? sm.getStudentOverallStats() : null);
        if (localStats && localStats.completedCount > 0) {
          const me = list.find(s => s.up === currentUp);
          if (me) {
            if (me.oralAverage === null || localStats.completedCount >= me.completedCount) {
              me.oralAverage = localStats.average;
              me.completedCount = localStats.completedCount;
              me.isHonor = localStats.isHonor;
            }
          } else {
            list.push({
              up: currentUp,
              name: sm.state.studentName || "Estudiante UNSTA",
              group: "Cátedra",
              photo: cachedPhotosMap[currentUp] || null,
              xp: sm.state.xp || 0,
              oralAverage: localStats.average,
              completedCount: localStats.completedCount,
              isHonor: localStats.isHonor
            });
          }
        }
      }

      cachedStudentsList = list;
      renderRankingUI(list);
    } catch(err) {
      console.error("Error al cargar ranking:", err);
      container.innerHTML = `
        <div class="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 space-y-3">
          <i class="fa-solid fa-triangle-exclamation text-amber-400 text-3xl"></i>
          <p class="text-sm">Ocurrió un inconveniente al cargar el ranking desde Firestore.</p>
          <button id="btnRetryRankLoad" class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500">
            Reintentar Conexión
          </button>
        </div>
      `;
      document.getElementById("btnRetryRankLoad")?.addEventListener("click", () => loadRankingData(true));
    }
  }

  function renderRankingUI(students) {
    const container = document.getElementById("rankingContainer");
    if (!container) return;

    if (!students || students.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-sm">
          No hay estudiantes registrados actualmente.
        </div>
      `;
      return;
    }

    // Ordenar lista según rankingSortMode
    const sorted = [...students].sort((a, b) => {
      if (rankingSortMode === "oral") {
        if (a.oralAverage !== null && b.oralAverage === null) return -1;
        if (a.oralAverage === null && b.oralAverage !== null) return 1;
        if (a.oralAverage !== null && b.oralAverage !== null) {
          if (b.oralAverage !== a.oralAverage) return b.oralAverage - a.oralAverage;
          if (b.completedCount !== a.completedCount) return b.completedCount - a.completedCount;
        }
        return b.xp - a.xp;
      } else {
        // Orden por XP Global
        if (b.xp !== a.xp) return b.xp - a.xp;
        if (a.oralAverage !== null && b.oralAverage !== null) return b.oralAverage - a.oralAverage;
        return 0;
      }
    });

    const currentUp = String(sm.state.up || "").trim();

    // Top 3 (Podio Olímpico)
    const top1 = sorted[0];
    const top2 = sorted[1];
    const top3 = sorted[2];
    const rest = sorted.slice(3);

    // Helper para tarjeta del podio
    const renderPodiumCard = (student, place) => {
      if (!student) {
        const orderCls = place === 1 ? 'order-1 sm:order-2 mt-0 sm:-mt-6' : (place === 2 ? 'order-2 sm:order-1' : 'order-3 sm:order-3');
        return `
          <div class="${orderCls} opacity-40 p-6 border border-dashed border-slate-800 rounded-3xl text-center text-xs text-slate-500 flex flex-col items-center justify-center min-h-[160px] bg-slate-950/30">
            <i class="fa-solid fa-trophy text-slate-600 text-2xl mb-2"></i>
            <span class="font-bold text-slate-400">${place}º Puesto</span>
            <span class="text-[10px] text-slate-600 mt-1">Vacante</span>
          </div>
        `;
      }
      
      const isCurrent = currentUp && student.up === currentUp;
      let placeClass = "";
      let ringClass = "";
      let medalIcon = "";
      let titleBadge = "";
      let glowClass = "";

      if (place === 1) {
        placeClass = "order-1 sm:order-2 mt-0 sm:-mt-6 border-amber-500/50 bg-gradient-to-b from-amber-950/30 via-slate-900 to-slate-900";
        ringClass = "ring-4 ring-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.5)]";
        medalIcon = '<i class="fa-solid fa-crown text-amber-400 text-xl animate-bounce"></i>';
        titleBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950 tracking-wider">1º Puesto</span>';
        glowClass = "shadow-[0_0_35px_rgba(245,158,11,0.15)]";
      } else if (place === 2) {
        placeClass = "order-2 sm:order-1 border-slate-700 bg-gradient-to-b from-slate-800/40 via-slate-900 to-slate-900";
        ringClass = "ring-2 ring-slate-300 shadow-[0_0_15px_rgba(203,213,225,0.3)]";
        medalIcon = '<i class="fa-solid fa-medal text-slate-300 text-lg"></i>';
        titleBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-300 text-slate-950 tracking-wider">2º Puesto</span>';
      } else {
        placeClass = "order-3 sm:order-3 border-amber-800/40 bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-900";
        ringClass = "ring-2 ring-amber-700 shadow-[0_0_15px_rgba(217,119,6,0.3)]";
        medalIcon = '<i class="fa-solid fa-medal text-amber-600 text-lg"></i>';
        titleBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-700 text-amber-100 tracking-wider">3º Puesto</span>';
      }

      const scoreDisplay = rankingSortMode === "oral"
        ? (student.oralAverage !== null ? `${student.oralAverage.toFixed(1)} <span class="text-xs font-normal text-slate-400">/ 10</span>` : '<span class="text-xs text-slate-500">Sin rendir</span>')
        : `${student.xp.toLocaleString()} <span class="text-xs font-normal text-amber-400">XP</span>`;

      return `
        <div class="relative rounded-3xl border ${placeClass} p-4 sm:p-6 text-center flex flex-col items-center justify-between transition hover:scale-[1.02] ${glowClass}">
          <div class="w-full">
            <div class="flex items-center justify-between w-full mb-3">
              ${titleBadge}
              ${medalIcon}
            </div>

            <!-- Avatar -->
            <div class="relative my-2 inline-block">
              ${renderAvatarHtml(student, place === 1 ? "w-16 h-16 sm:w-20 sm:h-20" : "w-14 h-14 sm:w-16 sm:h-16", ringClass)}
              ${student.isHonor ? '<span class="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold ring-2 ring-slate-900" title="Cuadro de Honor">👑</span>' : ''}
            </div>

            <!-- Nombre -->
            <h4 class="font-extrabold text-slate-100 text-xs sm:text-sm mt-1 truncate max-w-full px-1" title="${student.name}">
              ${student.name}
            </h4>
            <span class="text-[11px] text-slate-400 block">${student.group}</span>
            ${isCurrent ? '<span class="inline-block mt-1 text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">TÚ</span>' : ''}
          </div>

          <!-- Métrica -->
          <div class="mt-4 pt-3 border-t border-slate-800/80 w-full">
            <span class="text-[9px] uppercase font-bold text-slate-500 block">
              ${rankingSortMode === "oral" ? "Promedio Parcial" : "Puntaje Total"}
            </span>
            <div class="text-lg sm:text-xl font-black font-mono text-indigo-300 mt-0.5">
              ${scoreDisplay}
            </div>
            ${rankingSortMode === "oral" && student.completedCount > 0 ? `<span class="text-[10px] text-slate-500 block">${student.completedCount}/6 parciales</span>` : ''}
          </div>
        </div>
      `;
    };

    // Renderizado del Podio
    let podiumHtml = `
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-end pt-4">
        ${renderPodiumCard(top2, 2)}
        ${renderPodiumCard(top1, 1)}
        ${renderPodiumCard(top3, 3)}
      </div>
    `;

    // Renderizado de la Lista (Posición 4 en adelante)
    let restListHtml = "";
    if (rest.length > 0) {
      restListHtml = `
        <div class="space-y-2 mt-4">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 mb-2">
            Posiciones Siguientes (${rest.length} estudiantes)
          </h4>
          <div class="space-y-2">
            ${rest.map((student, idx) => {
              const rank = idx + 4;
              const isCurrent = currentUp && student.up === currentUp;
              const gradeColor = (student.oralAverage !== null)
                ? (student.oralAverage >= 9 ? "text-amber-400" : (student.oralAverage >= 7 ? "text-emerald-400" : "text-rose-400"))
                : "text-slate-500";

              return `
                <div class="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-slate-900 border ${isCurrent ? 'border-indigo-500 bg-indigo-950/30 shadow-md' : 'border-slate-800'} hover:border-slate-700 transition">
                  <!-- Izquierda: Puesto, Foto, Nombre, Grupo -->
                  <div class="flex items-center space-x-3 min-w-0">
                    <span class="font-mono font-bold text-xs sm:text-sm text-slate-400 w-6 text-center shrink-0">#${rank}</span>
                    <div class="relative shrink-0">
                      ${renderAvatarHtml(student, "w-10 h-10", "border border-slate-700")}
                      ${student.isHonor ? '<span class="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">👑</span>' : ''}
                    </div>
                    <div class="truncate">
                      <div class="flex items-center space-x-2">
                        <span class="text-xs sm:text-sm font-bold text-slate-100 truncate">${student.name}</span>
                        ${isCurrent ? '<span class="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold shrink-0">TÚ</span>' : ''}
                      </div>
                      <div class="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                        <span>${student.group}</span>
                        ${student.isHonor ? '<span class="text-amber-400 font-semibold flex items-center space-x-1 shrink-0"><i class="fa-solid fa-crown text-[10px]"></i><span>Cuadro de Honor</span></span>' : ''}
                      </div>
                    </div>
                  </div>

                  <!-- Derecha: Promedio Oral y XP -->
                  <div class="flex items-center space-x-4 sm:space-x-6 shrink-0 text-right">
                    <div>
                      <span class="text-[9px] uppercase font-bold text-slate-500 block">Promedio</span>
                      <span class="font-mono font-bold text-xs sm:text-sm ${gradeColor}">
                        ${student.oralAverage !== null ? `${student.oralAverage.toFixed(1)} / 10` : 'Sin rendir'}
                      </span>
                      ${student.completedCount > 0 ? `<span class="text-[10px] text-slate-500 block">${student.completedCount}/6 rendidos</span>` : ''}
                    </div>
                    <div class="min-w-[65px]">
                      <span class="text-[9px] uppercase font-bold text-slate-500 block">XP</span>
                      <span class="font-mono font-bold text-xs sm:text-sm text-indigo-300 flex items-center justify-end space-x-1">
                        <i class="fa-solid fa-bolt text-[10px] text-amber-400"></i>
                        <span>${student.xp.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      ${podiumHtml}
      ${restListHtml}
    `;
  }

});

  async function openSingleQuestionRecoveryModal(qIdx) {
    if (!currentExamResult || !currentExamResult.questionsReview) return;
    const rev = currentExamResult.questionsReview[qIdx];
    const q = oralExamQuestions[qIdx];
    if (!rev || !q) return;

    // Sincronizar XP de Firestore si está disponible
    if (db && sm.state.up) {
      try {
        const stuSnap = await db.collection('students').doc(String(sm.state.up).trim()).get();
        if (stuSnap.exists && typeof stuSnap.data().xp === 'number') {
          sm.state.xp = stuSnap.data().xp;
          sm.saveState();
          initHeaderStats();
        }
      } catch(e) {}
    }

    const currentXP = sm.state.xp || 0;
    const RECOVERY_COST_XP = 1;

    if (currentXP < RECOVERY_COST_XP) {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'warning',
          title: 'Saldo de XP Insuficiente',
          html: `
            <div class="text-left text-xs sm:text-sm space-y-2 text-slate-300">
              <p>Para recuperar esta pregunta necesitas al menos <strong>${RECOVERY_COST_XP} XP</strong>.</p>
              <p>Tu saldo actual es de <strong class="text-amber-400 font-mono">${currentXP} XP</strong>.</p>
              <div class="bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-500/30 text-indigo-300 text-xs">
                💡 <em>Tip: Asiste a las clases de la cátedra (+2 XP cada una) o domina tarjetas flashcards para sumar XP.</em>
              </div>
            </div>
          `,
          background: '#0f172a',
          color: '#f8fafc',
          confirmButtonColor: '#6366f1',
          confirmButtonText: 'Entendido'
        });
      } else {
        alert(`Necesitas al menos ${RECOVERY_COST_XP} XP para recuperar esta pregunta.`);
      }
      return;
    }

    let recoveredAudioUrl = null;
    let recoveredTranscript = "";
    let recoveredDuration = 0;

    Swal.fire({
      title: `<span class="text-base font-black text-white flex items-center justify-center gap-2"><i class="fa-solid fa-rotate-right text-indigo-400"></i> Recuperar Pregunta ${qIdx + 1}</span>`,
      html: `
        <div class="text-left text-xs sm:text-sm space-y-3">
          <!-- Tarjeta de Consigna -->
          <div class="bg-slate-900 border border-indigo-500/30 p-3.5 rounded-2xl space-y-1.5">
            <div class="flex items-center justify-between text-[11px] text-slate-400">
              <span class="font-bold uppercase tracking-wider text-indigo-400">Consigna Oficial</span>
              <span class="font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                Nota actual: ${rev.grade} / 10
              </span>
            </div>
            <p class="text-slate-100 font-semibold leading-relaxed text-xs sm:text-sm">
              ${escapeHtml(q.question)}
            </p>
          </div>

          <!-- Información de Costo & Garantía Pedagógica -->
          <div class="bg-slate-950/70 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs">
            <span class="text-slate-400 flex items-center gap-1.5">
              <i class="fa-solid fa-coins text-amber-400"></i>
              <span>Costo de recuperación:</span>
            </span>
            <span class="font-mono font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/30">
              1 XP (Tu saldo: ${currentXP} XP)
            </span>
          </div>

          <!-- Grabador de Voz en Modal -->
          <div class="text-center py-2 space-y-2">
            <div class="flex items-center justify-center gap-2">
              <button id="modalBtnRecord" type="button" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-rose-600/30 transition active:scale-95 cursor-pointer">
                <i class="fa-solid fa-microphone"></i>
                <span id="modalBtnRecordText">Grabar Nueva Respuesta</span>
              </button>
              <span id="modalRecordTimerBadge" class="hidden text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1.5 rounded-xl border border-rose-500/30 animate-pulse">
                🔴 00:00
              </span>
            </div>

            <!-- Reproductor de la nueva grabación -->
            <div id="modalPlayerWrapper" class="hidden pt-1 max-w-sm mx-auto">
              <div class="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>Escucha tu nuevo audio:</span>
                <span id="modalDurationBadge" class="font-mono text-xs text-indigo-300 font-bold">00:00</span>
              </div>
              <audio id="modalAudioPlayer" controls class="w-full h-8 rounded-lg"></audio>
            </div>

            <!-- Contenedor de Transcripción con Fichas de Palabras -->
            <div id="modalTranscriptWrapper" class="hidden text-left bg-slate-950/90 p-3 rounded-xl border border-indigo-500/30 text-xs text-slate-200 shadow-inner space-y-1.5">
              <div class="flex items-center justify-between flex-wrap gap-1">
                <span class="text-indigo-400 text-[10px] uppercase font-extrabold flex items-center gap-1.5">
                  <i class="fa-solid fa-microphone-lines"></i> Transcripción Oficial:
                </span>
                <span id="modalWordEditCounter" class="text-[10px] text-indigo-300/80 font-medium">
                  Toca cualquier palabra para corregirla
                </span>
              </div>
              <div id="modalTranscriptContainer" class="leading-relaxed font-sans text-xs text-slate-100 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 min-h-[40px] flex flex-wrap gap-1 items-center">
                ...
              </div>
            </div>
          </div>

          <p class="text-[10px] text-slate-400 italic text-center">
            🛡️ <strong>Garantía de Cátedra:</strong> Solo se actualizará tu nota si obtienes una calificación mayor a ${rev.grade}/10. Si fuera menor, conservas tu nota actual.
          </p>
        </div>
      `,
      background: '#0f172a',
      color: '#f8fafc',
      showCancelButton: true,
      confirmButtonText: '<i class="fa-solid fa-graduation-cap mr-1.5"></i> Calificar y Aplicar Mejora (1 XP)',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#475569',
      customClass: { popup: 'border border-indigo-500/30 rounded-3xl max-w-lg w-full' },
      didOpen: () => {
        const btnRec = document.getElementById("modalBtnRecord");
        const btnRecText = document.getElementById("modalBtnRecordText");
        const timerBadge = document.getElementById("modalRecordTimerBadge");
        const playerWrapper = document.getElementById("modalPlayerWrapper");
        const player = document.getElementById("modalAudioPlayer");
        const transcriptWrapper = document.getElementById("modalTranscriptWrapper");
        const transcriptContainer = document.getElementById("modalTranscriptContainer");
        const durationBadge = document.getElementById("modalDurationBadge");

        const confirmBtn = Swal.getConfirmButton();
        if (confirmBtn) confirmBtn.disabled = true;

        if (btnRec) {
          btnRec.addEventListener("click", async () => {
            if (!recorder.isRecording) {
              if (playerWrapper) playerWrapper.classList.add("hidden");
              if (transcriptWrapper) transcriptWrapper.classList.add("hidden");
              if (timerBadge) timerBadge.classList.remove("hidden");
              if (confirmBtn) confirmBtn.disabled = true;

              btnRec.className = "px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center space-x-2 shadow-lg transition active:scale-95 cursor-pointer recording-pulse";
              btnRecText.textContent = "⏹️ Detener Grabación";

              await recorder.startRecording(
                (secs) => {
                  const m = Math.floor(secs / 60).toString().padStart(2, "0");
                  const s = (secs % 60).toString().padStart(2, "0");
                  if (timerBadge) timerBadge.textContent = `🔴 ${m}:${s}`;
                },
                null,
                (err) => {
                  alert("No se pudo iniciar el micrófono.");
                }
              );
            } else {
              btnRecText.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Transcribiendo...';
              btnRec.disabled = true;

              const res = await recorder.stopRecording();
              btnRec.disabled = false;
              btnRec.className = "px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center space-x-2 shadow-lg transition active:scale-95 cursor-pointer";
              btnRecText.textContent = "Volver a Grabar";
              if (timerBadge) timerBadge.classList.add("hidden");

              if (res) {
                recoveredAudioUrl = res.audioUrl;
                recoveredTranscript = res.transcript;
                recoveredDuration = res.durationSecs;

                if (playerWrapper && player && res.audioUrl) {
                  player.src = res.audioUrl;
                  if (durationBadge) durationBadge.textContent = formatDuration(res.durationSecs || 0);
                  playerWrapper.classList.remove("hidden");
                }

                if (transcriptWrapper && transcriptContainer) {
                  transcriptWrapper.classList.remove("hidden");
                  renderModalWords(recoveredTranscript);
                }

                if (confirmBtn) confirmBtn.disabled = false;
              }
            }
          });
        }

        function renderModalWords(text) {
          if (!transcriptContainer) return;
          transcriptContainer.innerHTML = "";
          const words = (text || "").trim().split(/\s+/);
          words.forEach((word, wIdx) => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "inline-flex items-center px-1.5 py-0.5 m-0.5 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-200 text-xs font-medium border border-slate-700 hover:border-indigo-400 transition cursor-pointer select-none active:scale-95";
            chip.textContent = word;
            chip.title = "Toca para corregir esta palabra";
            chip.addEventListener("click", () => {
              openModalWordCorrection(wIdx, word);
            });
            transcriptContainer.appendChild(chip);
          });
        }

        function openModalWordCorrection(wIdx, oldWord) {
          const newW = prompt(`Corregir palabra "${oldWord}" (solo 1 palabra, sin espacios):`, oldWord);
          if (newW && !/\s/.test(newW.trim())) {
            const words = (recoveredTranscript || "").trim().split(/\s+/);
            if (words[wIdx] !== undefined) {
              words[wIdx] = newW.trim();
              recoveredTranscript = words.join(" ");
              renderModalWords(recoveredTranscript);
            }
          }
        }
      },
      preConfirm: () => {
        if (!recoveredTranscript || recoveredTranscript.trim().length === 0) {
          Swal.showValidationMessage('Debes grabar tu respuesta antes de calificar.');
          return false;
        }
        return {
          audioUrl: recoveredAudioUrl,
          transcript: recoveredTranscript.trim(),
          durationSecs: recoveredDuration
        };
      }
    }).then(async (dialogRes) => {
      if (dialogRes.isConfirmed && dialogRes.value) {
        const payload = dialogRes.value;

        Swal.fire({
          title: 'Evaluando con Inteligencia Artificial...',
          html: '<div class="text-xs text-slate-300 space-y-2"><p>La IA está evaluando tu respuesta con rigor docente.</p><i class="fa-solid fa-brain text-indigo-400 text-3xl animate-pulse mt-2"></i></div>',
          background: '#0f172a',
          color: '#f8fafc',
          allowOutsideClick: false,
          showConfirmButton: false,
          didOpen: () => { Swal.showLoading(); }
        });

        try {
          const evalResult = await ai.evaluateSingleQuestion(
            q.question,
            q.answer,
            q.keyPoints || [],
            payload.transcript
          );

          // 1. Debitar 1 XP del alumno
          sm.addXP(-1);
          initHeaderStats();

          // Sincronizar débito de XP en Firestore y registrar en xpHistory
          const up = String(sm.state.up || "").trim();
          if (db && up && up !== "Sin Legajo" && up !== "UNSTA") {
            try {
              const sDoc = await db.collection('students').doc(up).get();
              if (sDoc.exists) {
                const curXP = Number(sDoc.data().xp || 0) - 1;
                const hist = sDoc.data().xpHistory || [];
                const pTitle = getOralExamTitle(currentOralPartialKey);
                hist.push({
                  timestamp: new Date().toISOString(),
                  amount: -1,
                  reason: `Recuperación de pregunta: ${pTitle}`,
                  newXP: curXP
                });
                await db.collection('students').doc(up).update({
                  xp: curXP,
                  xpHistory: hist
                });
              }
            } catch(eXp) {
              console.warn("[Firestore] Error actualizando XP tras recuperación:", eXp);
            }
          }

          // 2. Política de Mejor Nota (Best Score)
          const oldGrade = rev.grade;
          const newGrade = Math.max(oldGrade, evalResult.grade);

          rev.grade = newGrade;
          rev.strengths = evalResult.strengths;
          rev.improvements = evalResult.improvements;

          if (oralStudentAnswers[qIdx]) {
            oralStudentAnswers[qIdx].studentTranscript = payload.transcript;
            if (payload.audioUrl) oralStudentAnswers[qIdx].audioUrl = payload.audioUrl;
            if (payload.durationSecs) oralStudentAnswers[qIdx].durationSecs = payload.durationSecs;
          }

          // 3. Recalcular promedio general del parcial
          const sum = currentExamResult.questionsReview.reduce((acc, curr) => acc + (Number(curr.grade) || 0), 0);
          currentExamResult.finalGrade = Math.round((sum / 10) * 10) / 10;
          currentExamResult.passed = currentExamResult.finalGrade >= 7.0;
          currentExamResult.isHonor = currentExamResult.finalGrade >= 9.0;
          currentExamResult.isDistinguished = currentExamResult.finalGrade >= 8.0 && currentExamResult.finalGrade < 9.0;

          // Actualizar nota en Storage y computar si la mejora en la pregunta le otorgó nuevo delta de XP
          const xpReport = sm.recordPartialGrade(currentOralPartialKey, currentExamResult.finalGrade);
          currentExamResult.xpAwardedReport = xpReport;

          syncExamToFirestore(currentOralPartialKey, currentExamResult, oralStudentAnswers);
          renderOralExamResults(currentExamResult);

          if (evalResult.grade > oldGrade) {
            Swal.fire({
              icon: 'success',
              title: '¡Pregunta Superada con Éxito!',
              html: `
                <div class="text-xs sm:text-sm text-slate-300 space-y-2 text-left">
                  <p>Tu calificación en esta pregunta subió de <strong class="text-rose-400 font-mono">${oldGrade}/10</strong> a <strong class="text-emerald-400 font-mono text-base">${newGrade}/10</strong> 🎉.</p>
                  <p>Tu nuevo promedio en este parcial es de <strong class="text-indigo-300 font-mono text-base">${currentExamResult.finalGrade} / 10</strong>.</p>
                  <p class="text-[11px] text-amber-400/90 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                    Se debitó 1 XP de tu saldo por la recuperación docente.
                  </p>
                </div>
              `,
              background: '#0f172a',
              color: '#f8fafc',
              confirmButtonColor: '#6366f1',
              confirmButtonText: 'Genial, continuar'
            });
          } else {
            Swal.fire({
              icon: 'info',
              title: 'Nota Conservada',
              html: `
                <div class="text-xs sm:text-sm text-slate-300 space-y-2 text-left">
                  <p>En este intento obtuviste <strong class="font-mono text-indigo-300">${evalResult.grade}/10</strong>.</p>
                  <p>Por la <em>Garantía de Cátedra</em>, <strong>se conserva tu mejor nota anterior (${oldGrade}/10)</strong> para proteger tu promedio.</p>
                  <p class="text-[11px] text-amber-400/90 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                    Se debitó 1 XP de tu saldo por la evaluación.
                  </p>
                </div>
              `,
              background: '#0f172a',
              color: '#f8fafc',
              confirmButtonColor: '#6366f1',
              confirmButtonText: 'Entendido'
            });
          }

        } catch (errEval) {
          console.error("Error evaluando pregunta individual:", errEval);
          Swal.fire({
            icon: 'error',
            title: 'Error de Evaluación',
            text: 'Ocurrió un error al contactar al evaluador de IA. No se debitó tu XP.',
            background: '#0f172a',
            color: '#f8fafc',
            confirmButtonColor: '#6366f1'
          });
        }
      }
    });
  }
