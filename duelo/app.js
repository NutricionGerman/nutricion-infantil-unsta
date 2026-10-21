/**
 * DUELO ANTROPOMÉTRICO: GEOGUESSR ANATÓMICO
 * Cátedra de Nutrición Infantil - UNSTA
 * Calibración Quirúrgica: Acromion, Olécranon, Mesobraquial y Cintura (CDC y OMS con cálculo de Punto Medio en cualquier orden)
 */

// --- BASE DE DATOS DE HITOS CLÍNICOS CALIBRADOS POR GERMÁN ---
const ANATOMICAL_LANDMARKS = [
  {
    id: 'acromion',
    name: 'Punto Acromial (Acromion)',
    category: 'Extremidad Superior',
    questionTitle: 'Punto Acromial (Acromion)',
    desc: 'Ubica el Punto Acromial en el esqueleto.',
    clinicalUse: 'Punto de partida proximal obligatorio para medir la longitud del brazo con cinta métrica.',
    image: 'img/acromion.png',
    inspectorColor: '#06b6d4',
    mode: 'single_point',
    targets: [
      { side: 'Hombro Derecho (Pantalla Izq)', x: 113.4, y: 154.8 },
      { side: 'Hombro Izquierdo (Pantalla Der)', x: 293.2, y: 157.4 }
    ],
    toleranceRadius: 14
  },
  {
    id: 'olecranon',
    name: 'Olécranon (Codo a 90°)',
    category: 'Extremidad Superior',
    questionTitle: 'Olécranon (Codo a 90°)',
    desc: 'Ubica el Olécranon en el esqueleto con el codo flexionado a 90°.',
    clinicalUse: 'Hito distal para delimitar la distancia acromion-olécranon con cinta métrica.',
    image: null,
    inspectorColor: '#f59e0b',
    mode: 'single_point',
    targets: [
      { side: 'Codo Derecho (Pantalla Izq)', x: 70.9, y: 296.5 },
      { side: 'Codo Izquierdo (Pantalla Der)', x: 320.6, y: 298.0 }
    ],
    toleranceRadius: 14
  },
  {
    id: 'mesobraquial',
    name: '2 Puntos de Referencia para Marca Mesobraquial',
    category: 'Extremidad Superior',
    questionTitle: '2 Puntos de Referencia para Marca Mesobraquial',
    desc: 'Marca los 2 puntos anatómicos de referencia (en cualquier orden) para calcular la marca mesobraquial al 50%.',
    clinicalUse: 'Nivel anatómico estricto donde se mide el Perímetro Braquial (PB) y el Pliegue Tricipital (PCT) para estimar masa muscular y grasa (Frisancho).',
    image: 'img/marca mesobraquial.png',
    inspectorColor: '#10b981',
    mode: 'two_points_midpoint',
    type: 'arm',
    targets: [
      {
        side: 'Brazo Derecho (Pantalla Izq)',
        topRef: { name: 'Acromion', x: 113.4, y: 154.8 },
        bottomRef: { name: 'Olécranon', x: 70.9, y: 296.5 },
        midpoint: { x: 92.2, y: 225.7 }
      },
      {
        side: 'Brazo Izquierdo (Pantalla Der)',
        topRef: { name: 'Acromion', x: 293.2, y: 157.4 },
        bottomRef: { name: 'Olécranon', x: 320.6, y: 298.0 },
        midpoint: { x: 306.9, y: 227.7 }
      }
    ],
    toleranceRadius: 15
  },
  {
    id: 'cintura_cdc',
    name: 'Punto de Referencia: Cintura CDC',
    category: 'Tronco / Cintura',
    questionTitle: 'Punto de Referencia: Cintura CDC',
    desc: 'Ubica el punto anatómico de referencia para la cintura según el protocolo CDC.',
    clinicalUse: 'Protocolo estándar de EE.UU. / CDC utilizado en los percentiles de la cátedra para evaluar riesgo cardiometabólico (RCE >= 0.5).',
    image: 'img/Cresta ileaca.png',
    inspectorColor: '#ec4899',
    mode: 'waist_cdc',
    targetY: 330.0,
    referenceTargets: [
      { side: 'Cresta Derecha (Pantalla Izq)', x: 144.2, y: 332.1 },
      { side: 'Cresta Izquierda (Pantalla Der)', x: 253.4, y: 326.9 }
    ],
    torsoMinX: 135,
    torsoMaxX: 275,
    toleranceY: 6
  },
  {
    id: 'cintura_oms',
    name: '2 Puntos de Referencia para Cintura OMS',
    category: 'Tronco / Cintura',
    questionTitle: '2 Puntos de Referencia para Cintura OMS',
    desc: 'Marca los 2 puntos anatómicos de referencia (en cualquier orden) para proyectar el plano de cintura OMS.',
    clinicalUse: 'Protocolo de la Organización Mundial de la Salud (OMS): se ubica en el espacio intercosto-ilíaco de la cintura natural (aprox. 2.5 cm por encima de la cresta ilíaca).',
    image: null,
    inspectorColor: '#8b5cf6',
    mode: 'two_points_midpoint',
    type: 'waist_oms',
    targetY: 310.2,
    torsoMinX: 135,
    torsoMaxX: 275,
    targets: [
      {
        side: 'Flanco Derecho (Pantalla Izq)',
        topRef: { name: 'Última Costilla Flotante', x: 193.8, y: 297.4 },
        bottomRef: { name: 'Cresta Ilíaca', x: 144.2, y: 332.1 },
        midpoint: { x: 141.7, y: 310.2 }
      },
      {
        side: 'Flanco Izquierdo (Pantalla Der)',
        topRef: { name: 'Última Costilla Flotante', x: 241.8, y: 297.4 },
        bottomRef: { name: 'Cresta Ilíaca', x: 253.4, y: 326.9 },
        midpoint: { x: 247.6, y: 310.2 }
      }
    ],
    toleranceY: 6
  }
];

// --- SINTETIZADOR DE AUDIO WEB ---
class SoundFx {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }
  
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playTone(freq, type = 'sine', duration = 0.15, vol = 0.2) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio not initialized yet', e);
    }
  }

  clickPin() {
    this.playTone(600, 'triangle', 0.08, 0.15);
  }

  hitSuccess() {
    this.playTone(523.25, 'sine', 0.1, 0.2); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.12, 0.2), 90); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.25, 0.25), 180); // G5
  }

  hitMiss() {
    this.playTone(330, 'sawtooth', 0.12, 0.15);
    setTimeout(() => this.playTone(260, 'sawtooth', 0.2, 0.15), 110);
  }

  victory() {
    const notes = [440, 554, 659, 880];
    notes.forEach((n, idx) => {
      setTimeout(() => this.playTone(n, 'triangle', 0.2, 0.25), idx * 120);
    });
  }
}

const sfx = new SoundFx();

// --- ESTADO GENERAL DEL JUEGO ---
const state = {
  mode: 'duel',
  roundsCount: 2,
  currentRoundIndex: 0,
  activeLandmarks: [],
  currentTurn: 'p1',
  p1Name: 'Jugador 1',
  p2Name: 'Jugador 2',
  
  roundStartTime: 0,
  timerInterval: null,
  
  // Puntos clicados en la ronda actual
  candidatePoint1: null,
  candidatePoint2: null,
  candidateDerivedMidpoint: null,
  
  inspectorActive: false,
  currentMatchId: null,
  selectedTriviaOptionIndex: null
};
window.state = state;

// --- ELEMENTOS DEL DOM ---
const dom = {
  svg: null,
  overlay: null,
  inspectorGroup: null,
  dynamicPinsGroup: null,
  activePinGroup: null,
  
  viewportInstructions: document.getElementById('viewportInstructions'),
  skeletonWrapper: document.getElementById('skeletonWrapper'),
  triviaViewport: document.getElementById('triviaViewport'),
  triviaQuestionTitle: document.getElementById('triviaQuestionTitle'),
  triviaQuestionDesc: document.getElementById('triviaQuestionDesc'),
  triviaOptionsGrid: document.getElementById('triviaOptionsGrid'),
  
  // HUD Superior y Banner Pedagógico
  arenaInstructionBanner: document.getElementById('arenaInstructionBanner'),
  hudPlayerAvatar: document.getElementById('hudPlayerAvatar'),
  hudPlayerName: document.getElementById('hudPlayerName'),
  rulesModal: document.getElementById('rulesModal'),
  btnOpenRulesModal: document.getElementById('btnOpenRulesModal'),
  btnCloseRulesModal: document.getElementById('btnCloseRulesModal'),
  btnDismissRulesModal: document.getElementById('btnDismissRulesModal'),
  
  turnTag: document.getElementById('turnTag'),
  missionCategory: document.getElementById('missionCategory'),
  missionTitle: document.getElementById('missionTitle'),
  missionDesc: document.getElementById('missionDesc'),
  clinicalNote: document.getElementById('clinicalNote'),
  
  timerDisplay: document.getElementById('timerDisplay'),
  roundIndicator: document.getElementById('roundIndicator'),
  arenaInstructionTitle: document.getElementById('arenaInstructionTitle'),
  arenaInstructionType: document.getElementById('arenaInstructionType'),
  
  btnConfirm: document.getElementById('btnConfirm'),
  btnResetClicks: document.getElementById('btnResetClicks'),
  btnNext: document.getElementById('btnNext'),
  revealBox: document.getElementById('revealBox'),
  
  // Modales Centrales de Pregunta y Resultado
  modalQuestionPrompt: document.getElementById('modalQuestionPrompt'),
  modalQBadge: document.getElementById('modalQBadge'),
  modalQTitle: document.getElementById('modalQTitle'),
  modalQInstruction: document.getElementById('modalQInstruction'),
  modalQPointsType: document.getElementById('modalQPointsType'),
  btnModalStartQuestion: document.getElementById('btnModalStartQuestion'),

  modalRoundResult: document.getElementById('modalRoundResult'),
  modalResultIcon: document.getElementById('modalResultIcon'),
  modalResultScore: document.getElementById('modalResultScore'),
  modalResultMetrics: document.getElementById('modalResultMetrics'),
  modalResultFeedback: document.getElementById('modalResultFeedback'),
  modalResultDetails: document.getElementById('modalResultDetails'),
  btnModalNextRound: document.getElementById('btnModalNextRound'),
  
  btnToggleInspector: document.getElementById('btnToggleInspector'),
  btnMute: document.getElementById('btnMute'),
  btnRounds2: document.getElementById('btnRounds2'),
  btnRounds5: document.getElementById('btnRounds5'),
  
  transitionModal: document.getElementById('transitionModal'),
  transitionTitle: document.getElementById('transitionTitle'),
  transitionDesc: document.getElementById('transitionDesc'),
  btnStartP2: document.getElementById('btnStartP2'),
  
  podiumModal: document.getElementById('podiumModal'),
  podiumWinnerBadge: document.getElementById('podiumWinnerBadge'),
  podiumTitle: document.getElementById('podiumTitle'),
  podiumSubtitle: document.getElementById('podiumSubtitle'),
  p1ScoreCard: document.getElementById('p1ScoreCard'),
  p2ScoreCard: document.getElementById('p2ScoreCard'),
  p1FinalScore: document.getElementById('p1FinalScore'),
  p2FinalScore: document.getElementById('p2FinalScore'),
  p1FinalDist: document.getElementById('p1FinalDist'),
  p2FinalDist: document.getElementById('p2FinalDist'),
  p1FinalTime: document.getElementById('p1FinalTime'),
  p2FinalTime: document.getElementById('p2FinalTime'),
  podiumDetails: document.getElementById('podiumDetails'),
  btnRematch: document.getElementById('btnRematch')
};

// Actualiza el avatar e identidad del jugador en el HUD superior
function updateHudPlayerProfile(name, photo, turn) {
  if (dom.hudPlayerName) dom.hudPlayerName.textContent = name || (turn === 'p2' ? 'Jugador 2' : 'Jugador 1');
  if (dom.hudPlayerAvatar) {
    if (photo) {
      dom.hudPlayerAvatar.innerHTML = `<img src="${photo}" alt="${name}" class="hud-avatar-img">`;
    } else {
      const initial = (name && name.length > 0) ? name.charAt(0).toUpperCase() : (turn === 'p2' ? 'P2' : 'P1');
      const color = (turn === 'p2') ? 'var(--p2-color)' : 'var(--p1-color)';
      dom.hudPlayerAvatar.innerHTML = `<div class="hud-avatar-initial" style="border-color: ${color}; color: ${color};">${initial}</div>`;
    }
  }
}

// --- INICIALIZACIÓN ---
function initDuelApp() {
  setupSvgElements();
  setupEventListeners();
  // startNewGame() NO se ejecuta al cargar la página para no mostrar carteles de pregunta.
  // Solo se inicia cuando el docente o alumno hace clic en "Jugar este Duelo".
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.style.display = 'none';
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDuelApp);
} else {
  initDuelApp();
}

function setupSvgElements() {
  dom.svg = document.querySelector('.skeleton-wrapper svg');
  if (!dom.svg) {
    console.error('SVG not found!');
    return;
  }
  
  dom.overlay = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  dom.overlay.setAttribute('id', 'gameInteractiveLayer');
  
  dom.inspectorGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  dom.inspectorGroup.setAttribute('id', 'inspectorLayer');
  dom.inspectorGroup.style.display = 'none';
  
  dom.dynamicPinsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  dom.dynamicPinsGroup.setAttribute('id', 'dynamicPinsLayer');
  
  dom.activePinGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  dom.activePinGroup.setAttribute('id', 'activePinLayer');
  
  dom.overlay.appendChild(dom.inspectorGroup);
  dom.overlay.appendChild(dom.dynamicPinsGroup);
  dom.overlay.appendChild(dom.activePinGroup);
  dom.svg.appendChild(dom.overlay);
  
  buildInspectorElements();
}

function setupEventListeners() {
  if (dom.svg) {
    dom.svg.addEventListener('click', handleSkeletonClick);
    dom.svg.addEventListener('touchstart', handleSkeletonTouch, { passive: false });
  }
  
  if (dom.btnConfirm) dom.btnConfirm.addEventListener('click', handleConfirmPin);
  if (dom.btnResetClicks) dom.btnResetClicks.addEventListener('click', resetCurrentClicks);
  if (dom.btnNext) dom.btnNext.addEventListener('click', handleNextRoundOrTurn);
  
  if (dom.btnToggleInspector) dom.btnToggleInspector.addEventListener('click', toggleInspectorMode);
  if (dom.btnMute) dom.btnMute.addEventListener('click', toggleMute);
  
  // Reglas Modal
  if (dom.btnOpenRulesModal) {
    dom.btnOpenRulesModal.addEventListener('click', () => {
      if (dom.rulesModal) dom.rulesModal.style.display = 'flex';
    });
  }
  if (dom.btnCloseRulesModal) {
    dom.btnCloseRulesModal.addEventListener('click', () => {
      if (dom.rulesModal) dom.rulesModal.style.display = 'none';
    });
  }
  if (dom.btnDismissRulesModal) {
    dom.btnDismissRulesModal.addEventListener('click', () => {
      if (dom.rulesModal) dom.rulesModal.style.display = 'none';
    });
  }
  
  if (dom.btnRounds2) dom.btnRounds2.addEventListener('click', () => setRoundsCount(2));
  if (dom.btnRounds5) dom.btnRounds5.addEventListener('click', () => setRoundsCount(5));
  
  // Botones de los Carteles Centrales (Consigna y Resultado)
  if (dom.btnModalStartQuestion) {
    dom.btnModalStartQuestion.addEventListener('click', handleStartQuestionFromModal);
  }
  if (dom.btnModalNextRound) {
    dom.btnModalNextRound.addEventListener('click', handleNextRoundOrTurn);
  }

  if (dom.btnStartP2) dom.btnStartP2.addEventListener('click', startPlayer2Turn);
  if (dom.btnRematch) dom.btnRematch.addEventListener('click', startNewGame);
}

function setRoundsCount(count) {
  state.roundsCount = count;
  if (dom.btnRounds2) dom.btnRounds2.classList.toggle('active', count === 2);
  if (dom.btnRounds5) dom.btnRounds5.classList.toggle('active', count === 5);
  startNewGame();
}

// --- INICIO DE NUEVA PARTIDA / ENTRENAMIENTO ---
function startNewGame() {
  clearInterval(state.timerInterval);
  state.currentTurn = 'p1';
  state.currentRoundIndex = 0;
  state.p1History = [];
  state.p2History = [];
  state.candidatePoint1 = null;
  state.candidatePoint2 = null;
  state.candidateDerivedMidpoint = null;
  state.selectedTriviaOptionIndex = null;
  
  // Selección de hitos (si no fueron preconfigurados por el torneo)
  if (!state.activeLandmarks || state.activeLandmarks.length === 0) {
    if (state.roundsCount >= ANATOMICAL_LANDMARKS.length) {
      state.activeLandmarks = [...ANATOMICAL_LANDMARKS];
    } else if (state.roundsCount === 2) {
      const meso = ANATOMICAL_LANDMARKS.find(l => l.id === 'mesobraquial') || ANATOMICAL_LANDMARKS[2];
      const oms = ANATOMICAL_LANDMARKS.find(l => l.id === 'cintura_oms') || ANATOMICAL_LANDMARKS[4];
      state.activeLandmarks = [meso, oms];
    } else {
      state.activeLandmarks = ANATOMICAL_LANDMARKS.slice(0, state.roundsCount);
    }
  }
  
  // Limpiar capas SVG de juego
  if (dom.activePinGroup) dom.activePinGroup.innerHTML = '';
  if (dom.dynamicPinsGroup) dom.dynamicPinsGroup.innerHTML = '';
  
  // Ocultar modales y paneles de feedback
  if (dom.transitionModal) dom.transitionModal.style.display = 'none';
  if (dom.podiumModal) dom.podiumModal.style.display = 'none';
  if (dom.revealBox) dom.revealBox.style.display = 'none';
  if (dom.btnNext) dom.btnNext.style.display = 'none';
  if (dom.btnResetClicks) dom.btnResetClicks.style.display = 'none';
  
  if (dom.btnConfirm) {
    dom.btnConfirm.style.display = 'flex';
    dom.btnConfirm.disabled = true;
    dom.btnConfirm.classList.remove('p2-btn');
  }
  
  const missionCard = document.querySelector('.mission-card');
  if (missionCard) missionCard.classList.remove('p2-turn');
  
  if (dom.turnTag) {
    dom.turnTag.className = 'mission-turn-tag tag-p1';
    dom.turnTag.textContent = `⚔️ Turno: ${state.p1Name}`;
  }
  
  prepareAndShowQuestionModal();
}

window.startNewGame = startNewGame;

// --- CONVERSIÓN DE COORDENADAS SCREEN -> SVG ---
function getSvgPoint(event) {
  const pt = dom.svg.createSVGPoint();
  if (event.touches && event.touches.length > 0) {
    pt.x = event.touches[0].clientX;
    pt.y = event.touches[0].clientY;
  } else {
    pt.x = event.clientX;
    pt.y = event.clientY;
  }
  const ctm = dom.svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const transformed = pt.matrixTransform(ctm.inverse());
  return { 
    x: Math.round(transformed.x * 10) / 10, 
    y: Math.round(transformed.y * 10) / 10 
  };
}

function handleSkeletonTouch(e) {
  e.preventDefault();
  handleSkeletonClick(e);
}

// --- GESTIÓN CENTRAL DEL CLIC EN EL ESQUELETO ---
function handleSkeletonClick(e) {
  const coords = getSvgPoint(e);
  if (coords.x < 5 || coords.x > 430 || coords.y < 5 || coords.y > 835) return;
  
  // Si ya se confirmó el hito y se muestra la revelación, ignorar clics hasta pasar al siguiente
  const isResultOpen = (dom.modalRoundResult && dom.modalRoundResult.style.display === 'flex') || (dom.revealBox && dom.revealBox.style.display === 'block');
  if (dom.btnConfirm.disabled && isResultOpen) {
    return;
  }
  
  const currentLandmark = state.activeLandmarks[state.currentRoundIndex];
  if (!currentLandmark) return;

  const isTwoPoints = currentLandmark.mode === 'two_points_midpoint' || currentLandmark.type === 'skeleton_two_points' || currentLandmark.type === 'arm' || currentLandmark.type === 'waist_oms';
  const isCdc = currentLandmark.mode === 'waist_cdc' || currentLandmark.type === 'skeleton_waist_cdc' || currentLandmark.type === 'waist_cdc';
  const isTrivia = currentLandmark.mode === 'trivia_choice' || currentLandmark.type === 'trivia_choice';

  // Si es un desafío teórico de trivia, ignorar clics en el esqueleto
  if (isTrivia) return;
  
  // CASO A: HITO DE 2 PUNTOS (MESOBRAQUIAL O CINTURA OMS)
  if (isTwoPoints) {
    handleTwoPointsClick(coords, currentLandmark);
    return;
  }
  
  // CASO B: CINTURA CDC (PLANO HORIZONTAL CON 1 PUNTO EN CRESTA)
  if (isCdc) {
    handleCdcWaistClick(coords, currentLandmark);
    return;
  }
  
  // CASO C: HITO PUNTUAL ESTÁNDAR (ACROMION U OLÉCRANON)
  state.candidatePoint1 = coords;
  renderCandidatePin(coords.x, coords.y);
  sfx.clickPin();
  
  dom.btnConfirm.disabled = false;
  dom.btnConfirm.textContent = `📍 Confirmar Marcación (X: ${coords.x}, Y: ${coords.y})`;
}

// LÓGICA DE 2 PUNTOS EN CUALQUIER ORDEN (MESOBRAQUIAL Y OMS)
function handleTwoPointsClick(coords, landmark) {
  sfx.clickPin();
  const isOms = landmark.type === 'waist_oms' || landmark.subType === 'waist_oms';
  
  // Si ya estaban marcados los 2 puntos y hace un 3er clic, reiniciar para permitir nuevo intento
  if (state.candidatePoint1 && state.candidatePoint2) {
    state.candidatePoint1 = coords;
    state.candidatePoint2 = null;
    state.candidateDerivedMidpoint = null;
    dom.btnConfirm.disabled = true;
    dom.btnResetClicks.style.display = 'block';
    renderTwoPointsActivePins(landmark);
    dom.btnConfirm.textContent = '📍 Ahora toca el 2º punto (en cualquier orden)';
    if (dom.arenaInstructionType) dom.arenaInstructionType.textContent = '📍 1º MARCADO • TOCA EL 2º';
    return;
  }
  
  if (!state.candidatePoint1) {
    // Primer clic (puede ser cualquiera de los dos puntos)
    state.candidatePoint1 = coords;
    dom.btnResetClicks.style.display = 'block';
    dom.btnConfirm.disabled = true;
    dom.btnConfirm.textContent = '📍 Ahora toca el 2º punto (en cualquier orden)';
    if (dom.arenaInstructionBanner) {
      dom.arenaInstructionBanner.textContent = '✅ 1º punto fijado. Toca el 2º punto de referencia óseo en cualquier orden';
    }
    if (dom.arenaInstructionType) dom.arenaInstructionType.textContent = '📍 1º MARCADO • TOCA EL 2º';
    renderTwoPointsActivePins(landmark);
  } else {
    // Segundo clic
    state.candidatePoint2 = coords;
    
    // Ordenar automáticamente: el punto superior (menor Y) vs el punto inferior (mayor Y)
    let pTop, pBottom;
    if (state.candidatePoint1.y <= state.candidatePoint2.y) {
      pTop = state.candidatePoint1;
      pBottom = state.candidatePoint2;
    } else {
      pTop = state.candidatePoint2;
      pBottom = state.candidatePoint1;
    }
    
    // Calcular el punto medio exacto (50%)
    const midX = Math.round(((pTop.x + pBottom.x) / 2) * 10) / 10;
    const midY = Math.round(((pTop.y + pBottom.y) / 2) * 10) / 10;
    state.candidateDerivedMidpoint = { x: midX, y: midY, pTop, pBottom };
    
    renderTwoPointsActivePins(landmark);
    
    dom.btnConfirm.disabled = false;
    if (isOms) {
      dom.btnConfirm.textContent = `📍 Confirmar Cintura OMS (Punto Medio Y: ${midY})`;
      if (dom.arenaInstructionBanner) dom.arenaInstructionBanner.textContent = `🎯 Ambos puntos fijados. Confirma el plano de cintura OMS (Y: ${midY})`;
      if (dom.arenaInstructionType) dom.arenaInstructionType.textContent = '✅ 2 PUNTOS LISTOS';
    } else {
      dom.btnConfirm.textContent = `📍 Confirmar Marca Mesobraquial (50% en Y: ${midY})`;
      if (dom.arenaInstructionBanner) dom.arenaInstructionBanner.textContent = `🎯 Ambos extremos fijados. Confirma la marca mesobraquial (50% en Y: ${midY})`;
      if (dom.arenaInstructionType) dom.arenaInstructionType.textContent = '✅ 2 PUNTOS LISTOS';
    }
  }
}

// Renderiza los pines activos, línea conectora y línea de punto medio en tiempo real
function renderTwoPointsActivePins(landmark) {
  dom.activePinGroup.innerHTML = '';
  const isP2 = state.currentTurn === 'p2';
  const color = isP2 ? 'var(--p2-color)' : 'var(--p1-color)';
  const isOms = landmark.type === 'waist_oms' || landmark.subType === 'waist_oms';
  
  if (state.candidatePoint1 && !state.candidatePoint2) {
    drawInteractivePin(state.candidatePoint1.x, state.candidatePoint1.y, '1º Punto fijado', color);
    return;
  }
  
  if (state.candidateDerivedMidpoint) {
    const { pTop, pBottom, x: midX, y: midY } = state.candidateDerivedMidpoint;
    
    if (isOms) {
      // 1. Pines de referencia identificados
      drawInteractivePin(pTop.x, pTop.y, '10ª Costilla', color);
      drawInteractivePin(pBottom.x, pBottom.y, 'Cresta Ilíaca', color);
      
      // 2. Línea guía vertical entre ambos puntos
      const lineGuide = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      lineGuide.setAttribute('x1', pTop.x);
      lineGuide.setAttribute('y1', pTop.y);
      lineGuide.setAttribute('x2', pBottom.x);
      lineGuide.setAttribute('y2', pBottom.y);
      lineGuide.setAttribute('stroke', color);
      lineGuide.setAttribute('stroke-width', '1.8');
      lineGuide.setAttribute('stroke-dasharray', '3,3');
      dom.activePinGroup.appendChild(lineGuide);
      
      // 3. ¡LÍNEA HORIZONTAL DEL PUNTO MEDIO (CINTURA OMS)!
      const waistLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      waistLine.setAttribute('x1', landmark.torsoMinX || 135);
      waistLine.setAttribute('y1', midY);
      waistLine.setAttribute('x2', landmark.torsoMaxX || 275);
      waistLine.setAttribute('y2', midY);
      waistLine.setAttribute('stroke', '#a855f7');
      waistLine.setAttribute('stroke-width', '2.5');
      dom.activePinGroup.appendChild(waistLine);
      
      // 4. Etiqueta del punto medio
      drawLabelBadge(205, midY - 6, `📏 Tu Punto Medio OMS (Y: ${midY})`, '#a855f7');
    } else {
      // CASO MESOBRAQUIAL
      drawInteractivePin(pTop.x, pTop.y, 'Acromion', color);
      drawInteractivePin(pBottom.x, pBottom.y, 'Olécranon', color);
      
      // Línea de cinta métrica en el brazo
      const armTape = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      armTape.setAttribute('x1', pTop.x);
      armTape.setAttribute('y1', pTop.y);
      armTape.setAttribute('x2', pBottom.x);
      armTape.setAttribute('y2', pBottom.y);
      armTape.setAttribute('stroke', color);
      armTape.setAttribute('stroke-width', '2');
      dom.activePinGroup.appendChild(armTape);
      
      // Marcador del Punto Medio (50%)
      const midMarker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      midMarker.setAttribute('cx', midX);
      midMarker.setAttribute('cy', midY);
      midMarker.setAttribute('r', '6');
      midMarker.setAttribute('fill', '#10b981');
      midMarker.setAttribute('stroke', '#ffffff');
      midMarker.setAttribute('stroke-width', '1.5');
      dom.activePinGroup.appendChild(midMarker);
      
      // Línea horizontal pequeña en la marca mesobraquial (como el trazo de dermográfico)
      const dermMark = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      dermMark.setAttribute('x1', midX - 9);
      dermMark.setAttribute('y1', midY);
      dermMark.setAttribute('x2', midX + 9);
      dermMark.setAttribute('y2', midY);
      dermMark.setAttribute('stroke', '#10b981');
      dermMark.setAttribute('stroke-width', '2.5');
      dom.activePinGroup.appendChild(dermMark);
      
      drawLabelBadge(midX + 22, midY + 3, `📍 50% Mesobraquial (Y: ${midY})`, '#10b981');
    }
  }
}

// LÓGICA DE CINTURA CDC: PROYECTA LA LÍNEA HORIZONTAL DESDE LA CRESTA
function handleCdcWaistClick(coords, landmark) {
  state.candidatePoint1 = coords;
  sfx.clickPin();
  dom.btnResetClicks.style.display = 'block';
  
  dom.activePinGroup.innerHTML = '';
  const isP2 = state.currentTurn === 'p2';
  const color = isP2 ? 'var(--p2-color)' : 'var(--p1-color)';
  
  // 1. Pin en el punto cliqueado de la cresta
  drawInteractivePin(coords.x, coords.y, 'Cresta Ilíaca', color);
  
  // 2. Línea horizontal de la cintura que atraviesa el abdomen a esa altura
  const waistLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  waistLine.setAttribute('x1', landmark.torsoMinX);
  waistLine.setAttribute('y1', coords.y);
  waistLine.setAttribute('x2', landmark.torsoMaxX);
  waistLine.setAttribute('y2', coords.y);
  waistLine.setAttribute('stroke', '#ec4899');
  waistLine.setAttribute('stroke-width', '2.5');
  waistLine.setAttribute('stroke-dasharray', '4,3');
  dom.activePinGroup.appendChild(waistLine);
  
  drawLabelBadge(205, coords.y - 6, `📏 Tu Cintura CDC (Y: ${coords.y})`, '#ec4899');
  
  dom.btnConfirm.disabled = false;
  dom.btnConfirm.textContent = `📍 Confirmar Cintura CDC (Plano Y: ${coords.y})`;
}

function resetCurrentClicks() {
  state.candidatePoint1 = null;
  state.candidatePoint2 = null;
  state.candidateDerivedMidpoint = null;
  dom.activePinGroup.innerHTML = '';
  dom.btnConfirm.disabled = true;
  dom.btnResetClicks.style.display = 'none';
  
  const currentLandmark = state.activeLandmarks[state.currentRoundIndex];
  if (!currentLandmark) return;
  
  const isTwoPoints = currentLandmark.mode === 'two_points_midpoint' || currentLandmark.type === 'skeleton_two_points' || currentLandmark.type === 'arm' || currentLandmark.type === 'waist_oms';
  const isCdc = currentLandmark.mode === 'waist_cdc' || currentLandmark.type === 'skeleton_waist_cdc' || currentLandmark.type === 'waist_cdc';
  
  if (isTwoPoints) {
    dom.btnConfirm.textContent = '📍 Toca el 1º punto (en cualquier orden)';
  } else if (isCdc) {
    dom.btnConfirm.textContent = '📍 Marca la Cresta Ilíaca CDC';
  } else {
    dom.btnConfirm.textContent = '📍 Toca el Esqueleto para Marcar';
  }
}

function drawInteractivePin(x, y, label, color) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('class', 'marker-pin');
  
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', '7');
  circle.setAttribute('fill', 'rgba(255, 255, 255, 0.2)');
  circle.setAttribute('stroke', color);
  circle.setAttribute('stroke-width', '2');
  
  const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  dot.setAttribute('cx', x);
  dot.setAttribute('cy', y);
  dot.setAttribute('r', '2.5');
  dot.setAttribute('fill', '#ffffff');
  
  g.appendChild(circle);
  g.appendChild(dot);
  
  if (label) {
    const textBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    textBg.setAttribute('x', x - 32);
    textBg.setAttribute('y', y - 20);
    textBg.setAttribute('width', '64');
    textBg.setAttribute('height', '13');
    textBg.setAttribute('rx', '3');
    textBg.setAttribute('fill', '#000000');
    textBg.setAttribute('opacity', '0.75');
    
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y - 10);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#ffffff');
    text.setAttribute('font-size', '8px');
    text.setAttribute('font-weight', 'bold');
    text.textContent = label;
    
    g.appendChild(textBg);
    g.appendChild(text);
  }
  
  dom.activePinGroup.appendChild(g);
}

function drawLabelBadge(x, y, label, color, parentGroup = null) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', x);
  text.setAttribute('y', y);
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('fill', color);
  text.setAttribute('font-size', '9px');
  text.setAttribute('font-weight', 'bold');
  text.setAttribute('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.9))');
  text.textContent = label;
  g.appendChild(text);
  (parentGroup || dom.activePinGroup).appendChild(g);
}

function renderCandidatePin(x, y) {
  dom.activePinGroup.innerHTML = '';
  const isP2 = state.currentTurn === 'p2';
  const color = isP2 ? 'var(--p2-color)' : 'var(--p1-color)';
  drawInteractivePin(x, y, null, color);
}

// --- CONFIRMACIÓN Y CÁLCULO DE PROXIMIDAD ---
function handleConfirmPin() {
  clearInterval(state.timerInterval);
  const elapsedMs = performance.now() - state.roundStartTime;
  const currentLandmark = state.activeLandmarks[state.currentRoundIndex];
  if (!currentLandmark) return;
  
  const isTwoPoints = currentLandmark.mode === 'two_points_midpoint' || currentLandmark.type === 'skeleton_two_points' || currentLandmark.type === 'arm' || currentLandmark.type === 'waist_oms';
  const isCdc = currentLandmark.mode === 'waist_cdc' || currentLandmark.type === 'skeleton_waist_cdc' || currentLandmark.type === 'waist_cdc';
  const isTrivia = currentLandmark.mode === 'trivia_choice' || currentLandmark.type === 'trivia_choice';

  let playData = null;
  
  // 0. EVALUACIÓN DE DESAFÍO TEÓRICO / TRIVIA
  if (isTrivia) {
    if (state.selectedTriviaOptionIndex === null) return;
    const opt = currentLandmark.options[state.selectedTriviaOptionIndex];
    const isCorrect = !!opt.correct;
    const timePenalty = Math.max(0, Math.floor((elapsedMs - 2500) / 250) * 15);
    const roundScore = isCorrect ? Math.max(650, 1000 - timePenalty) : 0;
    
    playData = {
      landmark: currentLandmark,
      isTrivia: true,
      isCorrect: isCorrect,
      selectedOption: opt.text,
      score: roundScore,
      dist: isCorrect ? 0 : 50,
      timeMs: Math.round(elapsedMs)
    };
    
    revealTriviaResult(currentLandmark, state.selectedTriviaOptionIndex);
  }
  // 1. EVALUACIÓN DE HITOS DE 2 PUNTOS (MESOBRAQUIAL Y CINTURA OMS)
  else if (isTwoPoints) {
    if (!state.candidateDerivedMidpoint) return;
    const { pTop, pBottom, x: midX, y: midY } = state.candidateDerivedMidpoint;
    
    // Buscar el lado del cuerpo más cercano según la posición del usuario
    let bestSide = currentLandmark.targets[0];
    let minSideDist = Infinity;
    
    currentLandmark.targets.forEach(side => {
      const dSide = calcDist({ x: midX, y: midY }, side.midpoint);
      if (dSide < minSideDist) {
        minSideDist = dSide;
        bestSide = side;
      }
    });
    
    // Evaluar desvíos
    const dTop = calcDist(pTop, bestSide.topRef);
    const dBottom = calcDist(pBottom, bestSide.bottomRef);
    const isOms = currentLandmark.type === 'waist_oms' || currentLandmark.subType === 'waist_oms';
    const dMidpoint = isOms
      ? Math.abs(midY - (currentLandmark.targetY || 310.2))
      : calcDist({ x: midX, y: midY }, bestSide.midpoint);
    
    let totalScore;
    if (isOms) {
      // Evaluación OMS en el eje horizontal (altura Y del plano de cintura)
      totalScore = scoreFromDistance(dMidpoint, currentLandmark.toleranceY || 6);
    } else {
      // Evaluación Mesobraquial (60% punto medio, 40% extremos óseos)
      const scoreMid = scoreFromDistance(dMidpoint, currentLandmark.toleranceRadius || 15);
      const scoreRefs = (scoreFromDistance(dTop, 15) + scoreFromDistance(dBottom, 15)) / 2;
      totalScore = Math.round(scoreMid * 0.6 + scoreRefs * 0.4);
    }
    
    playData = {
      landmark: currentLandmark,
      isTwoPoints: true,
      pTop: { clicked: { ...pTop }, target: { ...bestSide.topRef }, dist: Math.round(dTop * 10) / 10 },
      pBottom: { clicked: { ...pBottom }, target: { ...bestSide.bottomRef }, dist: Math.round(dBottom * 10) / 10 },
      midpoint: { clicked: { x: midX, y: midY }, target: { ...bestSide.midpoint }, dist: Math.round(dMidpoint * 10) / 10 },
      targetSide: bestSide.side,
      dist: Math.round(dMidpoint * 10) / 10,
      score: totalScore,
      timeMs: Math.round(elapsedMs)
    };
    
    renderTwoPointsReveal(playData);
  }
  // 2. EVALUACIÓN DE CINTURA CDC
  else if (isCdc) {
    if (!state.candidatePoint1) return;
    const clicked = state.candidatePoint1;
    
    // Desvío en el eje horizontal (altura Y) respecto al nivel oficial de la cresta (Y = 330)
    const errorY = Math.abs(clicked.y - (currentLandmark.targetY || 330.0));
    
    let penaltyX = 0;
    if (clicked.x < 120) penaltyX = (120 - clicked.x) * 0.25;
    if (clicked.x > 290) penaltyX = (clicked.x - 290) * 0.25;
    
    const totalDist = Math.round((errorY + penaltyX) * 10) / 10;
    const roundScore = scoreFromDistance(errorY, currentLandmark.toleranceY || 6);
    
    playData = {
      landmark: currentLandmark,
      isCdc: true,
      clickedY: clicked.y,
      targetY: currentLandmark.targetY || 330.0,
      clickedX: clicked.x,
      dist: totalDist,
      errorY: Math.round(errorY * 10) / 10,
      score: roundScore,
      timeMs: Math.round(elapsedMs)
    };
    
    renderCdcWaistReveal(clicked, currentLandmark);
  }
  // 3. EVALUACIÓN DE HITO PUNTUAL (ACROMION U OLÉCRANON)
  else {
    if (!state.candidatePoint1) return;
    const clicked = state.candidatePoint1;
    
    let bestTarget = currentLandmark.targets ? currentLandmark.targets[0] : { x: clicked.x, y: clicked.y };
    let minDistance = Infinity;
    
    if (currentLandmark.targets) {
      currentLandmark.targets.forEach(t => {
        const dist = calcDist(clicked, t);
        if (dist < minDistance) {
          minDistance = dist;
          bestTarget = t;
        }
      });
    }
    
    const roundScore = scoreFromDistance(minDistance, currentLandmark.toleranceRadius || 14);
    
    playData = {
      landmark: currentLandmark,
      isPoint: true,
      clicked: { ...clicked },
      target: { ...bestTarget },
      dist: Math.round(minDistance * 10) / 10,
      score: roundScore,
      timeMs: Math.round(elapsedMs)
    };
    
    renderTargetReveal(clicked, bestTarget, minDistance);
  }
  
  if (state.currentTurn === 'p1') {
    state.p1History.push(playData);
  } else {
    state.p2History.push(playData);
  }
  
  if (playData.score >= 700) {
    sfx.hitSuccess();
  } else {
    sfx.hitMiss();
  }
  
  showRoundRevealCard(playData);
  
  dom.btnConfirm.disabled = true;
  dom.btnConfirm.style.display = 'none';
  dom.btnResetClicks.style.display = 'none';
  if (dom.btnNext) dom.btnNext.style.display = 'none';
}

function calcDist(p1, p2) {
  if (!p1 || !p2 || p1.x === undefined || p2.x === undefined) return 999;
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function scoreFromDistance(dist, tol) {
  if (dist <= tol) return 1000;
  if (dist <= 25) return Math.max(650, Math.round(1000 - (dist - tol) * 25));
  if (dist <= 60) return Math.max(200, Math.round(650 - (dist - 25) * 12));
  return Math.max(0, Math.round(200 - (dist - 60) * 3));
}

// Revela el resultado para Mesobraquial y Cintura OMS (con línea real y punto medio oficial)
function renderTwoPointsReveal(play) {
  const { landmark, pTop, pBottom, midpoint } = play;
  const isOms = landmark.type === 'waist_oms' || landmark.subType === 'waist_oms';
  
  // 1. Dianas reales de referencia
  drawTargetBullseye(pTop.target.x, pTop.target.y);
  drawTargetBullseye(pBottom.target.x, pBottom.target.y);
  
  // 2. Línea oficial entre los hitos reales
  const realLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  realLine.setAttribute('x1', pTop.target.x);
  realLine.setAttribute('y1', pTop.target.y);
  realLine.setAttribute('x2', pBottom.target.x);
  realLine.setAttribute('y2', pBottom.target.y);
  realLine.setAttribute('stroke', '#10b981');
  realLine.setAttribute('stroke-width', '2');
  dom.dynamicPinsGroup.appendChild(realLine);
  
  if (isOms) {
    // Cinta oficial OMS en el punto medio exacto (Y = 310.2)
    const realWaist = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    realWaist.setAttribute('x1', landmark.torsoMinX || 135);
    realWaist.setAttribute('y1', landmark.targetY || 310.2);
    realWaist.setAttribute('x2', landmark.torsoMaxX || 275);
    realWaist.setAttribute('y2', landmark.targetY || 310.2);
    realWaist.setAttribute('stroke', '#8b5cf6');
    realWaist.setAttribute('stroke-width', '3');
    dom.dynamicPinsGroup.appendChild(realWaist);
    
    drawLabelBadge(205, (landmark.targetY || 310.2) - 5, `📏 Nivel Oficial Cintura OMS (Y: ${landmark.targetY || 310.2})`, '#8b5cf6', dom.dynamicPinsGroup);
  } else {
    // Marcador oficial del 50% Mesobraquial
    const realMid = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    realMid.setAttribute('cx', midpoint.target.x);
    realMid.setAttribute('cy', midpoint.target.y);
    realMid.setAttribute('r', '7');
    realMid.setAttribute('fill', '#10b981');
    realMid.setAttribute('stroke', '#ffffff');
    realMid.setAttribute('stroke-width', '2');
    dom.dynamicPinsGroup.appendChild(realMid);
    
    drawLabelBadge(midpoint.target.x + 24, midpoint.target.y + 3, `📍 50% Oficial (Y: ${midpoint.target.y})`, '#10b981', dom.dynamicPinsGroup);
  }
}

// Revela la cintura CDC
function renderCdcWaistReveal(clicked, landmark) {
  // Cinta oficial CDC a Y = 330.0
  const realTape = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  realTape.setAttribute('x1', landmark.torsoMinX || 135);
  realTape.setAttribute('y1', landmark.targetY || 330.0);
  realTape.setAttribute('x2', landmark.torsoMaxX || 275);
  realTape.setAttribute('y2', landmark.targetY || 330.0);
  realTape.setAttribute('stroke', landmark.inspectorColor || '#ec4899');
  realTape.setAttribute('stroke-width', '3');
  dom.dynamicPinsGroup.appendChild(realTape);
  
  // Flecha de error
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  arrow.setAttribute('x1', clicked.x);
  arrow.setAttribute('y1', clicked.y);
  arrow.setAttribute('x2', clicked.x);
  arrow.setAttribute('y2', landmark.targetY || 330.0);
  arrow.setAttribute('stroke', '#ffffff');
  arrow.setAttribute('stroke-width', '1.8');
  dom.dynamicPinsGroup.appendChild(arrow);
  
  drawLabelBadge(205, (landmark.targetY || 330.0) - 6, `📏 Nivel Oficial Cintura CDC (Cresta Y: ${landmark.targetY || 330.0})`, landmark.inspectorColor || '#ec4899', dom.dynamicPinsGroup);
}

function renderTargetReveal(clicked, target, dist) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', clicked.x);
  line.setAttribute('y1', clicked.y);
  line.setAttribute('x2', target.x);
  line.setAttribute('y2', target.y);
  line.setAttribute('stroke', '#ffffff');
  line.setAttribute('stroke-width', '1.8');
  line.setAttribute('class', 'dashed-line');
  dom.dynamicPinsGroup.appendChild(line);
  
  drawTargetBullseye(target.x, target.y);
  
  const midX = (clicked.x + target.x) / 2;
  const midY = (clicked.y + target.y) / 2 - 6;
  drawLabelBadge(midX, midY, `${Math.round(dist)} px`, '#fbbf24', dom.dynamicPinsGroup);
}

function drawTargetBullseye(x, y) {
  const pulseCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  pulseCircle.setAttribute('cx', x);
  pulseCircle.setAttribute('cy', y);
  pulseCircle.setAttribute('r', '8');
  pulseCircle.setAttribute('fill', 'none');
  pulseCircle.setAttribute('stroke', '#10b981');
  pulseCircle.setAttribute('class', 'pulse-target');
  dom.dynamicPinsGroup.appendChild(pulseCircle);
  
  const bullseye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  bullseye.setAttribute('cx', x);
  bullseye.setAttribute('cy', y);
  bullseye.setAttribute('r', '5.5');
  bullseye.setAttribute('fill', '#10b981');
  bullseye.setAttribute('stroke', '#ffffff');
  bullseye.setAttribute('stroke-width', '1.5');
  dom.dynamicPinsGroup.appendChild(bullseye);
}

function showRoundRevealCard(play) {
  if (!dom.modalRoundResult) return;

  const isMiss = play.score < 400 || play.timeout;

  // 1. Icono representativo
  if (dom.modalResultIcon) {
    if (play.timeout) dom.modalResultIcon.textContent = '⏰';
    else if (play.score >= 950) dom.modalResultIcon.textContent = '🎯';
    else if (play.score >= 700) dom.modalResultIcon.textContent = '👍';
    else if (play.score >= 400) dom.modalResultIcon.textContent = '⚠️';
    else dom.modalResultIcon.textContent = '❌';
  }

  // 2. Puntaje
  if (dom.modalResultScore) {
    dom.modalResultScore.textContent = play.timeout ? '0 pts' : `+${play.score} pts`;
    dom.modalResultScore.className = `modal-result-score ${isMiss ? 'score-miss' : ''}`;
  }

  // 3. Métricas de Precisión y Tiempo
  if (dom.modalResultMetrics) {
    if (play.timeout) {
      dom.modalResultMetrics.textContent = '⏱️ Tiempo Límite Agotado (45.0s)';
    } else if (play.isTrivia) {
      dom.modalResultMetrics.textContent = `Tiempo: ${(play.timeMs / 1000).toFixed(2)}s • ${play.isCorrect ? '✅ Criterio Correcto' : '❌ Criterio Erróneo'}`;
    } else if (play.isCdc) {
      dom.modalResultMetrics.textContent = `Desvío de Plano: ${play.dist || play.errorY} px • Tiempo: ${(play.timeMs / 1000).toFixed(2)}s`;
    } else {
      dom.modalResultMetrics.textContent = `Desvío: ${play.dist} px • Tiempo: ${(play.timeMs / 1000).toFixed(2)}s`;
    }
  }

  // 4. Feedback Pedagógico
  let feedback = '';
  if (play.timeout) {
    feedback = `⏰ <strong>¡Tiempo Límite Agotado!</strong> Se cumplieron los 45.0 segundos sin confirmar respuesta. Esta pregunta suma 0 puntos.`;
  } else if (play.isTrivia) {
    feedback = play.isCorrect
      ? `🎯 <strong>¡Criterio Clínico Impecable!</strong> Has seleccionado la fundamentación oficial de la cátedra.`
      : `❌ <strong>Criterio Erróneo.</strong> Revisa las guías clínicas oficiales de la cátedra.`;
  } else if (play.score >= 950) {
    feedback = `🎯 <strong>¡Precisión Quirúrgica!</strong> Has fijado las referencias con exactitud milimétrica de cátedra.`;
  } else if (play.score >= 700) {
    feedback = `👍 <strong>¡Muy buen cálculo!</strong> Desvío leve respecto a las coordenadas anatómicas oficiales.`;
  } else if (play.score >= 400) {
    feedback = `⚠️ <strong>Desvío Intermedio:</strong> Revisa la ubicación anatómica exacta de los relieves óseos.`;
  } else {
    feedback = `❌ <strong>Desvío Significativo:</strong> Observa la posición oficial señalada en el esqueleto.`;
  }

  let details = '';
  if (play.isTwoPoints && play.pTop && play.pBottom) {
    details = `
      <div style="background: rgba(255, 255, 255, 0.04); border-left: 3px solid #10b981; padding: 6px 10px; border-radius: 6px; margin-top: 8px; font-size: 11px;">
        <strong>Desglose del Cálculo (${play.targetSide || ''}):</strong><br>
        • Extremo superior: error de ${play.pTop.dist} px<br>
        • Extremo inferior: error de ${play.pBottom.dist} px<br>
        • <strong>Punto Medio al 50%:</strong> error de ${play.dist} px
      </div>
    `;
  } else if (play.isTrivia) {
    details = `
      <div style="background: rgba(255, 255, 255, 0.04); border-left: 3px solid ${play.isCorrect ? '#10b981' : '#ef4444'}; padding: 6px 10px; border-radius: 6px; margin-top: 8px; font-size: 11px;">
        <strong>Opción seleccionada:</strong> ${play.selectedOption}
      </div>
    `;
  }

  if (dom.modalResultFeedback) {
    dom.modalResultFeedback.innerHTML = feedback + details;
  }

  if (dom.modalResultDetails) {
    dom.modalResultDetails.innerHTML = `<div style="margin-top: 6px; font-size: 11.5px; color: #94a3b8;"><strong>🩺 Relevancia Clínica:</strong> ${play.landmark.clinicalUse}</div>`;
  }

  // 5. Botón Único de Acción
  if (dom.btnModalNextRound) {
    const isLastRound = (state.currentRoundIndex + 1) >= state.roundsCount;
    if (isLastRound) {
      dom.btnModalNextRound.textContent = 'Ver Veredicto del Duelo 🏆';
    } else {
      dom.btnModalNextRound.textContent = `Siguiente Pregunta (${state.currentRoundIndex + 2}/${state.roundsCount}) →`;
    }
  }

  dom.modalRoundResult.style.display = 'flex';
}

// --- NAVEGACIÓN DE RONDAS Y TURNOS ---
function handleNextRoundOrTurn() {
  if (dom.modalRoundResult) {
    dom.modalRoundResult.style.display = 'none';
  }
  
  state.currentRoundIndex++;
  
  dom.activePinGroup.innerHTML = '';
  dom.dynamicPinsGroup.innerHTML = '';
  if (dom.btnResetClicks) dom.btnResetClicks.style.display = 'none';
  if (dom.btnConfirm) {
    dom.btnConfirm.style.display = 'flex';
    dom.btnConfirm.disabled = true;
    dom.btnConfirm.textContent = '📍 Toca el Esqueleto para Marcar';
  }
  
  state.candidatePoint1 = null;
  state.candidatePoint2 = null;
  state.candidateDerivedMidpoint = null;
  state.selectedTriviaOptionIndex = null;
  
  // Al completar todos los hitos (ej. los 5 hitos del día), concluir directamente en el podio
  if (state.currentRoundIndex >= state.roundsCount) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
    if (dom.timerDisplay) dom.timerDisplay.textContent = '0.0s';
    
    // Si el rival (P2) no tiene registro en esta sesión (duelo asincrónico del torneo / prueba), generar benchmark realista
    if (!state.p2History || state.p2History.length === 0) {
      state.p2History = [];
      for (let i = 0; i < state.roundsCount; i++) {
        const simScore = Math.floor(Math.random() * 260) + 700;
        const simTime = Math.floor(Math.random() * 10000) + 12000;
        const simDist = Math.round((Math.random() * 6 + 4) * 10) / 10;
        state.p2History.push({
          landmark: state.activeLandmarks[i],
          score: simScore,
          dist: simDist,
          timeMs: simTime
        });
      }
    }
    showPodiumModal();
    return;
  } else {
    prepareAndShowQuestionModal();
  }
}

function showTransitionModal() {
  dom.transitionModal.style.display = 'flex';
  const p1TotalScore = state.p1History.reduce((a, b) => a + b.score, 0);
  const p1AvgTime = (state.p1History.reduce((a, b) => a + b.timeMs, 0) / state.roundsCount / 1000).toFixed(2);
  
  dom.transitionTitle.textContent = `¡Turno de ${state.p1Name} Completado!`;
  dom.transitionDesc.innerHTML = `Puntuación acumulada: <strong style="color: var(--p1-color);">${p1TotalScore} pts</strong> (Promedio: ${p1AvgTime}s por hito).<br><br>Entrega el dispositivo a <strong>${state.p2Name}</strong> para responder los mismos ${state.roundsCount} desafíos bajo idénticas condiciones.`;
}

function startPlayer2Turn() {
  dom.transitionModal.style.display = 'none';
  state.currentTurn = 'p2';
  state.currentRoundIndex = 0;
  state.candidatePoint1 = null;
  state.candidatePoint2 = null;
  state.candidateDerivedMidpoint = null;
  state.selectedTriviaOptionIndex = null;
  
  const missionCard = document.querySelector('.mission-card');
  if (missionCard) missionCard.classList.add('p2-turn');
  if (dom.turnTag) {
    dom.turnTag.className = 'mission-turn-tag tag-p2';
    dom.turnTag.textContent = `⚔️ Turno: ${state.p2Name}`;
  }
  if (dom.btnConfirm) dom.btnConfirm.classList.add('p2-btn');
  
  updateHudPlayerProfile(state.p2Name, state.p2Photo, 'p2');
  prepareAndShowQuestionModal();
}

// --- CARTEL CENTRAL DE CONSIGNA PREVIO A CADA PREGUNTA ---
function prepareAndShowQuestionModal() {
  const currentLandmark = state.activeLandmarks[state.currentRoundIndex];
  if (!currentLandmark) return;

  // Pausar reloj: el tiempo NO corre mientras lee la preparación
  clearInterval(state.timerInterval);
  if (dom.timerDisplay) {
    dom.timerDisplay.classList.remove('warning', 'danger');
    dom.timerDisplay.textContent = '45.0s';
  }

  state.selectedTriviaOptionIndex = null;
  state.candidatePoint1 = null;
  state.candidatePoint2 = null;
  state.candidateDerivedMidpoint = null;

  const isTwoPoints = currentLandmark.mode === 'two_points_midpoint' || currentLandmark.type === 'skeleton_two_points' || currentLandmark.type === 'arm' || currentLandmark.type === 'waist_oms';
  const isCdc = currentLandmark.mode === 'waist_cdc' || currentLandmark.type === 'skeleton_waist_cdc' || currentLandmark.type === 'waist_cdc';
  const isTrivia = currentLandmark.mode === 'trivia_choice' || currentLandmark.type === 'trivia_choice';

  const isP2 = state.currentTurn === 'p2';
  const activeName = isP2 ? state.p2Name : state.p1Name;
  const activePhoto = isP2 ? state.p2Photo : state.p1Photo;
  updateHudPlayerProfile(activeName, activePhoto, state.currentTurn);

  if (dom.roundIndicator) dom.roundIndicator.textContent = `HITO ${state.currentRoundIndex + 1} DE ${state.roundsCount}`;
  if (dom.arenaInstructionTitle) dom.arenaInstructionTitle.textContent = '⏱️ Esperando inicio...';
  if (dom.arenaInstructionType) {
    dom.arenaInstructionType.textContent = isTwoPoints ? '📏 2 PUNTOS' : (isCdc ? '📍 1 PUNTO (CDC)' : '🎯 1 SOLO PUNTO');
  }
  
  // Enmascarar información anatómica en el fondo para evitar trampas mientras el reloj está en pausa
  if (dom.missionCategory) dom.missionCategory.textContent = 'ANTROPOMETRÍA CLÍNICA';
  if (dom.missionTitle) dom.missionTitle.textContent = `Desafío ${state.currentRoundIndex + 1} de ${state.roundsCount}`;
  if (dom.missionDesc) dom.missionDesc.textContent = 'El hito anatómico se revelará en pantalla en cuanto inicie el cronómetro.';
  if (dom.clinicalNote) dom.clinicalNote.innerHTML = `🩺 <strong>Desafío de Velocidad:</strong> Dispondrás de 45.0 segundos para ubicar la referencia.`;

  // Poblar Cartel Central Modal de Preparación Anti-Trampa
  if (dom.modalQuestionPrompt) {
    if (dom.modalQBadge) {
      dom.modalQBadge.textContent = `🎯 DESAFÍO ${state.currentRoundIndex + 1} DE ${state.roundsCount}`;
    }
    if (dom.modalQTitle) {
      dom.modalQTitle.textContent = '¿Estás listo/a?';
    }
    if (dom.modalQInstruction) {
      if (isTwoPoints) {
        dom.modalQInstruction.innerHTML = `
          Al presionar <strong>¡ESTOY LISTO!</strong> comenzará a correr el reloj de <strong>45.0 segundos</strong>.<br><br>
          Deberás marcar en el esqueleto los <strong>2 puntos anatómicos de referencia óseos</strong> (en cualquier orden) para calcular el punto medio al 50%.
        `;
      } else if (isCdc) {
        dom.modalQInstruction.innerHTML = `
          Al presionar <strong>¡ESTOY LISTO!</strong> comenzará a correr el reloj de <strong>45.0 segundos</strong>.<br><br>
          Deberás ubicar el <strong>punto anatómico de referencia</strong> para proyectar la cinta horizontal de cintura según CDC.
        `;
      } else {
        dom.modalQInstruction.innerHTML = `
          Al presionar <strong>¡ESTOY LISTO!</strong> comenzará a correr el reloj de <strong>45.0 segundos</strong>.<br><br>
          Lee atentamente el hito anatómico que aparecerá en pantalla y márcalo rápidamente en el esqueleto.
        `;
      }
    }
    if (dom.modalQPointsType) {
      if (isTwoPoints) {
        dom.modalQPointsType.innerHTML = '📏 Tipo: <strong>2 Puntos de Referencia</strong>';
      } else if (isCdc) {
        dom.modalQPointsType.innerHTML = '📍 Tipo: <strong>1 Punto de Referencia</strong>';
      } else if (isTrivia) {
        dom.modalQPointsType.innerHTML = '🧠 Tipo: <strong>Opción Teórica</strong>';
      } else {
        dom.modalQPointsType.innerHTML = '🎯 Tipo: <strong>1 Solo Punto</strong>';
      }
    }
    if (dom.btnModalStartQuestion) {
      dom.btnModalStartQuestion.textContent = '¡ESTOY LISTO, EMPEZAR! ⏱️';
    }

    if (dom.modalRoundResult) dom.modalRoundResult.style.display = 'none';
    dom.modalQuestionPrompt.style.display = 'flex';
  }
}

// Al pulsar "¡ESTOY LISTO!": se oculta el cartel, se revela el hito en pantalla, se activa el esqueleto y arranca el reloj
function handleStartQuestionFromModal() {
  if (dom.modalQuestionPrompt) {
    dom.modalQuestionPrompt.style.display = 'none';
  }

  const currentLandmark = state.activeLandmarks[state.currentRoundIndex];
  if (!currentLandmark) return;

  const isTwoPoints = currentLandmark.mode === 'two_points_midpoint' || currentLandmark.type === 'skeleton_two_points' || currentLandmark.type === 'arm' || currentLandmark.type === 'waist_oms';
  const isCdc = currentLandmark.mode === 'waist_cdc' || currentLandmark.type === 'skeleton_waist_cdc' || currentLandmark.type === 'waist_cdc';
  const isTrivia = currentLandmark.mode === 'trivia_choice' || currentLandmark.type === 'trivia_choice';

  // Revelar la consigna limpia en el Header Enfocado (sin spoilers de localización ni duplicaciones)
  const landmarkName = currentLandmark.name || currentLandmark.questionTitle;
  if (dom.roundIndicator) {
    dom.roundIndicator.textContent = `HITO ${state.currentRoundIndex + 1} DE ${state.roundsCount}`;
  }
  if (dom.arenaInstructionTitle) {
    dom.arenaInstructionTitle.textContent = landmarkName;
  }
  if (dom.arenaInstructionType) {
    if (isTwoPoints) {
      dom.arenaInstructionType.textContent = '📏 2 PUNTOS DE REFERENCIA';
    } else if (isCdc) {
      dom.arenaInstructionType.textContent = '📍 1 PUNTO (CDC)';
    } else if (isTrivia) {
      dom.arenaInstructionType.textContent = '🧠 TEÓRICO';
    } else {
      dom.arenaInstructionType.textContent = '🎯 1 SOLO PUNTO';
    }
  }

  if (dom.arenaInstructionBanner) {
    dom.arenaInstructionBanner.textContent = landmarkName;
  }
  if (dom.missionTitle) dom.missionTitle.textContent = landmarkName;
  if (dom.missionDesc) dom.missionDesc.textContent = currentLandmark.desc || 'Ubica el hito en el esqueleto.';
  if (dom.clinicalNote) dom.clinicalNote.innerHTML = `🩺 <strong>Relevancia Clínica:</strong> ${currentLandmark.clinicalUse || ''}`;

  if (isTrivia) {
    if (dom.skeletonWrapper) dom.skeletonWrapper.style.display = 'none';
    if (dom.triviaViewport) dom.triviaViewport.style.display = 'flex';
    if (dom.viewportInstructions) dom.viewportInstructions.textContent = '🧠 Selecciona la opción clínica correcta contra reloj (Límite: 45.0s)';
    if (dom.btnConfirm) {
      dom.btnConfirm.disabled = true;
      dom.btnConfirm.textContent = '💡 Selecciona una Opción';
    }
    renderTriviaCards(currentLandmark);
  } else {
    if (dom.skeletonWrapper) dom.skeletonWrapper.style.display = 'flex';
    if (dom.triviaViewport) dom.triviaViewport.style.display = 'none';
    if (dom.viewportInstructions) dom.viewportInstructions.textContent = '💡 Haz clic o toca directamente sobre el hueso correspondiente (Límite: 45.0s)';
    if (dom.btnConfirm) {
      dom.btnConfirm.disabled = true;
      if (isTwoPoints) {
        dom.btnConfirm.textContent = '📍 Toca el 1º punto de referencia (en cualquier orden)';
      } else if (isCdc) {
        dom.btnConfirm.textContent = '📍 Marca el punto de referencia CDC';
      } else {
        dom.btnConfirm.textContent = '📍 Toca el esqueleto para marcar';
      }
    }
  }

  // Ahora sí corre el cronómetro de 45 segundos
  startTimer();
}

window.handleStartQuestionFromModal = handleStartQuestionFromModal;
window.handleNextRoundOrTurn = handleNextRoundOrTurn;

function loadRoundPrompt() {
  prepareAndShowQuestionModal();
}

function renderTriviaCards(landmark) {
  if (!dom.triviaOptionsGrid) return;
  dom.triviaQuestionTitle.textContent = landmark.name;
  dom.triviaQuestionDesc.textContent = landmark.desc;
  dom.triviaOptionsGrid.innerHTML = '';
  
  const letters = ['A', 'B', 'C', 'D'];
  (landmark.options || []).forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'trivia-option-btn';
    btn.innerHTML = `<span class="trivia-option-letter">${letters[idx] || (idx + 1)}</span><span>${opt.text}</span>`;
    btn.addEventListener('click', () => {
      const isResultOpen = (dom.modalRoundResult && dom.modalRoundResult.style.display === 'flex') || (dom.revealBox && dom.revealBox.style.display === 'block');
      if (dom.btnConfirm.disabled === false && isResultOpen) return;
      sfx.clickPin();
      state.selectedTriviaOptionIndex = idx;
      dom.triviaOptionsGrid.querySelectorAll('.trivia-option-btn').forEach((b, i) => {
        b.classList.toggle('selected', i === idx);
      });
      dom.btnConfirm.disabled = false;
      dom.btnConfirm.textContent = `💡 Confirmar Opción (${letters[idx]})`;
    });
    dom.triviaOptionsGrid.appendChild(btn);
  });
}

function revealTriviaResult(landmark, selectedIdx) {
  if (!dom.triviaOptionsGrid) return;
  const buttons = dom.triviaOptionsGrid.querySelectorAll('.trivia-option-btn');
  (landmark.options || []).forEach((opt, idx) => {
    const btn = buttons[idx];
    if (!btn) return;
    btn.disabled = true;
    if (opt.correct) {
      btn.classList.add('correct');
    } else if (idx === selectedIdx) {
      btn.classList.add('incorrect');
    }
  });
}

// LÍMITE ESTRICTO DE 45 SEGUNDOS POR HITO
const ROUND_TIME_LIMIT_MS = 45000;

function startTimer() {
  clearInterval(state.timerInterval);
  state.roundStartTime = performance.now();
  if (dom.timerDisplay) {
    dom.timerDisplay.classList.remove('warning', 'danger');
    dom.timerDisplay.textContent = '45.0s';
  }
  
  state.timerInterval = setInterval(() => {
    const elapsed = performance.now() - state.roundStartTime;
    const remainingMs = Math.max(0, ROUND_TIME_LIMIT_MS - elapsed);
    const remainingSec = (remainingMs / 1000).toFixed(1);
    
    if (dom.timerDisplay) {
      dom.timerDisplay.textContent = `${remainingSec}s`;
      
      if (remainingMs <= 5000) {
        dom.timerDisplay.classList.remove('warning');
        dom.timerDisplay.classList.add('danger');
      } else if (remainingMs <= 15000) {
        dom.timerDisplay.classList.add('warning');
        dom.timerDisplay.classList.remove('danger');
      } else {
        dom.timerDisplay.classList.remove('warning', 'danger');
      }
    }
    
    if (remainingMs <= 0) {
      clearInterval(state.timerInterval);
      handleTimeOut();
    }
  }, 50);
}

// EXPIRACIÓN DEL TIEMPO (0 PUNTOS)
function handleTimeOut() {
  clearInterval(state.timerInterval);
  sfx.hitMiss();
  
  const currentLandmark = state.activeLandmarks[state.currentRoundIndex];
  if (!currentLandmark) return;
  
  const isTwoPoints = currentLandmark.mode === 'two_points_midpoint' || currentLandmark.type === 'skeleton_two_points' || currentLandmark.type === 'arm' || currentLandmark.type === 'waist_oms';
  const isCdc = currentLandmark.mode === 'waist_cdc' || currentLandmark.type === 'skeleton_waist_cdc' || currentLandmark.type === 'waist_cdc';
  const isTrivia = currentLandmark.mode === 'trivia_choice' || currentLandmark.type === 'trivia_choice';
  
  let playData = {
    landmark: currentLandmark,
    score: 0,
    dist: 999,
    timeMs: ROUND_TIME_LIMIT_MS,
    timeout: true
  };
  
  if (isTrivia) {
    playData.isTrivia = true;
    playData.isCorrect = false;
    playData.selectedOption = 'Sin responder (Tiempo Agotado)';
    if (dom.triviaOptionsGrid) {
      const buttons = dom.triviaOptionsGrid.querySelectorAll('.trivia-option-btn');
      (currentLandmark.options || []).forEach((opt, idx) => {
        const btn = buttons[idx];
        if (btn) {
          btn.disabled = true;
          if (opt.correct) btn.classList.add('correct');
        }
      });
    }
  } else if (isTwoPoints) {
    playData.isTwoPoints = true;
    const bestSide = currentLandmark.targets ? currentLandmark.targets[0] : null;
    if (bestSide) {
      playData.targetSide = bestSide.side;
      playData.pTop = { clicked: { x: 0, y: 0 }, target: { ...bestSide.topRef }, dist: 999 };
      playData.pBottom = { clicked: { x: 0, y: 0 }, target: { ...bestSide.bottomRef }, dist: 999 };
      playData.midpoint = { clicked: { x: 0, y: 0 }, target: { ...bestSide.midpoint }, dist: 999 };
      renderTwoPointsReveal(playData);
    }
  } else if (isCdc) {
    playData.isCdc = true;
    playData.errorY = 999;
    renderCdcReveal(currentLandmark, { x: 200, y: 330 }, 0);
  } else {
    playData.isPoint = true;
    const bestTarget = currentLandmark.targets ? currentLandmark.targets[0] : { x: 113.4, y: 154.8 };
    playData.clicked = { x: 0, y: 0 };
    playData.target = { ...bestTarget };
    drawTargetBullseye(bestTarget.x, bestTarget.y);
  }
  
  if (state.currentTurn === 'p1') {
    state.p1History.push(playData);
  } else {
    state.p2History.push(playData);
  }
  
  showRoundRevealCard(playData);
  
  dom.btnConfirm.disabled = true;
  dom.btnConfirm.style.display = 'none';
  dom.btnResetClicks.style.display = 'none';
  if (dom.btnNext) dom.btnNext.style.display = 'none';
}

// --- PODIO FINAL Y VEREDICTO ---
function showPodiumModal() {
  dom.podiumModal.style.display = 'flex';
  sfx.victory();
  renderFinalOverlayReview();
  
  const p1TotalScore = state.p1History.reduce((a, b) => a + b.score, 0);
  const p1TotalDist = state.p1History.reduce((a, b) => a + b.dist, 0);
  const p1TotalTime = state.p1History.reduce((a, b) => a + b.timeMs, 0);
  
  dom.p1FinalScore.textContent = `${p1TotalScore} pts`;
  dom.p1FinalDist.textContent = `${p1TotalDist.toFixed(1)} px`;
  dom.p1FinalTime.textContent = `${(p1TotalTime / 1000).toFixed(2)}s`;
  
  dom.p2ScoreCard.style.display = 'block';
  const p2TotalScore = state.p2History.reduce((a, b) => a + b.score, 0);
  const p2TotalDist = state.p2History.reduce((a, b) => a + b.dist, 0);
  const p2TotalTime = state.p2History.reduce((a, b) => a + b.timeMs, 0);
  
  dom.p2FinalScore.textContent = `${p2TotalScore} pts`;
  dom.p2FinalDist.textContent = `${p2TotalDist.toFixed(1)} px`;
  dom.p2FinalTime.textContent = `${(p2TotalTime / 1000).toFixed(2)}s`;
  
  dom.p1ScoreCard.classList.remove('winner');
  dom.p2ScoreCard.classList.remove('winner');
  
  let winner = null;
  let reason = '';
  
  if (p1TotalScore > p2TotalScore) {
    winner = 'p1';
    reason = `Mayor precisión global (+${p1TotalScore - p2TotalScore} pts).`;
  } else if (p2TotalScore > p1TotalScore) {
    winner = 'p2';
    reason = `Mayor precisión global (+${p2TotalScore - p1TotalScore} pts).`;
  } else {
    if (p1TotalTime < p2TotalTime) {
      winner = 'p1';
      reason = `¡Empate en puntos! Desempate por velocidad: ${((p2TotalTime - p1TotalTime) / 1000).toFixed(2)}s más veloz.`;
    } else if (p2TotalTime < p1TotalTime) {
      winner = 'p2';
      reason = `¡Empate en puntos! Desempate por velocidad: ${((p1TotalTime - p2TotalTime) / 1000).toFixed(2)}s más veloz.`;
    } else {
      winner = 'tie';
      reason = '¡Empate absoluto en precisión y tiempo!';
    }
  }
  
  if (winner === 'p1') {
    dom.podiumWinnerBadge.textContent = '🏆';
    dom.podiumTitle.textContent = `¡VICTORIA DE ${state.p1Name.toUpperCase()}!`;
    dom.p1ScoreCard.classList.add('winner');
  } else if (winner === 'p2') {
    dom.podiumWinnerBadge.textContent = '🏆';
    dom.podiumTitle.textContent = `¡VICTORIA DE ${state.p2Name.toUpperCase()}!`;
    dom.p2ScoreCard.classList.add('winner');
  } else {
    dom.podiumWinnerBadge.textContent = '🤝';
    dom.podiumTitle.textContent = '¡EMPATE TÉCNICO!';
  }
  
  dom.podiumSubtitle.textContent = reason;
  
  // Si este duelo proviene del fixture del torneo, registrar el resultado en el motor
  if (state.currentMatchId && window.tournamentEngine) {
    const match = window.tournamentEngine.state.currentMatchups.find(m => m.id === state.currentMatchId);
    if (match) {
      match.p1Result = {
        score: p1TotalScore,
        timeMs: p1TotalTime,
        dist: Math.round(p1TotalDist * 10) / 10
      };
      match.p2Result = {
        score: p2TotalScore,
        timeMs: p2TotalTime,
        dist: Math.round(p2TotalDist * 10) / 10
      };
      match.winnerId = (winner === 'p2') ? match.player2.id : match.player1.id;
      match.status = 'finished';
      match.revealed = true;
      
      const winningPlayer = window.tournamentEngine.state.players.find(p => p.id === match.winnerId);
      if (winningPlayer) {
        winningPlayer.pointsWon += 1;
        const grp = window.tournamentEngine.state.groups.find(g => g.id === winningPlayer.groupId);
        if (grp) grp.xpWon += 1;
      }
      const loserId = (match.winnerId === match.player1.id) ? match.player2.id : match.player1.id;
      const losingPlayer = window.tournamentEngine.state.players.find(p => p.id === loserId);
      if (losingPlayer) {
        losingPlayer.alive = false;
        losingPlayer.roundEliminated = window.tournamentEngine.state.day;
      }
      window.tournamentEngine.save();
      if (window.tournamentUI) window.tournamentUI.render();
    }
  }
  
  let tableHtml = `
    <table style="width: 100%; font-size: 12px; margin-top: 16px; border-collapse: collapse; text-align: left;">
      <thead>
        <tr style="border-bottom: 1px solid var(--border-card); color: var(--text-muted);">
          <th style="padding: 6px;">Hito</th>
          <th style="padding: 6px; color: var(--p1-color);">${state.p1Name}</th>
          <th style="padding: 6px; color: var(--p2-color);">${state.p2Name}</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  for (let i = 0; i < state.roundsCount; i++) {
    const p1R = state.p1History[i];
    const p2R = state.p2History[i];
    if (!p1R || !p2R) continue;
    const p1Desc = p1R.isTrivia ? (p1R.isCorrect ? '✅ Correcta' : '❌ Incorrecta') : `${p1R.dist} px`;
    const p2Desc = p2R.isTrivia ? (p2R.isCorrect ? '✅ Correcta' : '❌ Incorrecta') : `${p2R.dist} px`;
    tableHtml += `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
        <td style="padding: 8px 6px; font-weight: 600;">${p1R.landmark.name}</td>
        <td style="padding: 8px 6px; color: var(--p1-color);">${p1R.score} pts (${p1Desc} / ${(p1R.timeMs/1000).toFixed(1)}s)</td>
        <td style="padding: 8px 6px; color: var(--p2-color);">${p2R.score} pts (${p2Desc} / ${(p2R.timeMs/1000).toFixed(1)}s)</td>
      </tr>
    `;
  }
  
  tableHtml += '</tbody></table>';
  dom.podiumDetails.innerHTML = tableHtml;
}

function renderFinalOverlayReview() {
  dom.dynamicPinsGroup.innerHTML = '';
  
  for (let i = 0; i < state.roundsCount; i++) {
    const p1 = state.p1History[i];
    if (!p1) continue;
    const p2 = state.p2History ? state.p2History[i] : null;
    
    if (p1.isTrivia) {
      continue;
    } else if (p1.isCdc) {
      // Cinta CDC
      drawStaticWaistTape(p1.targetY, '#ec4899');
      drawStaticPin(p1.clickedX, p1.clickedY, '#06b6d4');
      if (p2 && p2.clickedX !== undefined) drawStaticPin(p2.clickedX, p2.clickedY, '#f59e0b');
    } else if (p1.isTwoPoints) {
      // Línea y punto medio
      drawStaticTarget(p1.pTop.target.x, p1.pTop.target.y);
      drawStaticTarget(p1.pBottom.target.x, p1.pBottom.target.y);
      const isOms = p1.landmark.type === 'waist_oms' || p1.landmark.subType === 'waist_oms';
      if (isOms) {
        drawStaticWaistTape(p1.landmark.targetY || 310.2, '#8b5cf6');
      } else {
        drawStaticTarget(p1.midpoint.target.x, p1.midpoint.target.y);
      }
      drawStaticPin(p1.midpoint.clicked.x, p1.midpoint.clicked.y, '#06b6d4');
      if (p2 && p2.midpoint && p2.midpoint.clicked) drawStaticPin(p2.midpoint.clicked.x, p2.midpoint.clicked.y, '#f59e0b');
    } else {
      if (p1.target) drawStaticTarget(p1.target.x, p1.target.y);
      if (p1.clicked) drawStaticPin(p1.clicked.x, p1.clicked.y, '#06b6d4');
      if (p2 && p2.clicked) drawStaticPin(p2.clicked.x, p2.clicked.y, '#f59e0b');
    }
  }
}

function drawStaticWaistTape(y, color) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', '135');
  line.setAttribute('y1', y);
  line.setAttribute('x2', '275');
  line.setAttribute('y2', y);
  line.setAttribute('stroke', color);
  line.setAttribute('stroke-width', '2.5');
  dom.dynamicPinsGroup.appendChild(line);
}

function drawStaticTarget(x, y) {
  const b = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  b.setAttribute('cx', x);
  b.setAttribute('cy', y);
  b.setAttribute('r', '5.5');
  b.setAttribute('fill', '#10b981');
  b.setAttribute('stroke', '#ffffff');
  b.setAttribute('stroke-width', '1.5');
  dom.dynamicPinsGroup.appendChild(b);
}

function drawStaticPin(x, y, color) {
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  p.setAttribute('cx', x);
  p.setAttribute('cy', y);
  p.setAttribute('r', '4.5');
  p.setAttribute('fill', color);
  p.setAttribute('stroke', '#ffffff');
  p.setAttribute('stroke-width', '1');
  dom.dynamicPinsGroup.appendChild(p);
}

// --- MODO INSPECTOR / VER HITOS CALIBRADOS ---
function buildInspectorElements() {
  dom.inspectorGroup.innerHTML = '';
  
  ANATOMICAL_LANDMARKS.forEach(landmark => {
    if (landmark.mode === 'waist_cdc') {
      // Línea horizontal CDC
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', landmark.torsoMinX);
      line.setAttribute('y1', landmark.targetY);
      line.setAttribute('x2', landmark.torsoMaxX);
      line.setAttribute('y2', landmark.targetY);
      line.setAttribute('stroke', landmark.inspectorColor);
      line.setAttribute('stroke-width', '2.5');
      dom.inspectorGroup.appendChild(line);
      
      drawLabelBadge(205, landmark.targetY - 5, `📏 Cintura CDC (Cresta Y: ${landmark.targetY})`, landmark.inspectorColor, dom.inspectorGroup);
      
      if (landmark.referenceTargets) {
        landmark.referenceTargets.forEach(p => {
          drawSmallReferencePoint(p.x, p.y, p.side.split(' ')[0], landmark.inspectorColor);
        });
      }
    } else if (landmark.mode === 'two_points_midpoint') {
      if (landmark.type === 'waist_oms') {
        // Línea de cintura OMS oficial
        const omsTape = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        omsTape.setAttribute('x1', landmark.torsoMinX);
        omsTape.setAttribute('y1', landmark.targetY);
        omsTape.setAttribute('x2', landmark.torsoMaxX);
        omsTape.setAttribute('y2', landmark.targetY);
        omsTape.setAttribute('stroke', landmark.inspectorColor);
        omsTape.setAttribute('stroke-width', '2.5');
        dom.inspectorGroup.appendChild(omsTape);
        
        drawLabelBadge(205, landmark.targetY - 5, `📏 Cintura OMS (Punto Medio Y: ${landmark.targetY})`, landmark.inspectorColor, dom.inspectorGroup);
      }
      
      if (landmark.targets) {
        landmark.targets.forEach(side => {
          drawInspectorTarget(side.topRef.x, side.topRef.y, side.topRef.name, landmark.inspectorColor);
          drawInspectorTarget(side.bottomRef.x, side.bottomRef.y, side.bottomRef.name, landmark.inspectorColor);
          
          // Línea conectora
          const connLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          connLine.setAttribute('x1', side.topRef.x);
          connLine.setAttribute('y1', side.topRef.y);
          connLine.setAttribute('x2', side.bottomRef.x);
          connLine.setAttribute('y2', side.bottomRef.y);
          connLine.setAttribute('stroke', landmark.inspectorColor);
          connLine.setAttribute('stroke-width', '1.5');
          connLine.setAttribute('stroke-dasharray', '3,3');
          dom.inspectorGroup.appendChild(connLine);
          
          if (landmark.type !== 'waist_oms') {
            // Punto medio mesobraquial
            drawInspectorTarget(side.midpoint.x, side.midpoint.y, `📍 50% Mesobraquial`, '#10b981');
          }
        });
      }
    } else {
      if (landmark.targets) {
        landmark.targets.forEach(t => {
          drawInspectorTarget(t.x, t.y, `${landmark.name.split(' ')[1] || landmark.id} (${t.side.split(' ')[0]})`, landmark.inspectorColor);
        });
      }
    }
  });
}

function drawSmallReferencePoint(x, y, name, color) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  c.setAttribute('cx', x);
  c.setAttribute('cy', y);
  c.setAttribute('r', '4');
  c.setAttribute('fill', color);
  c.setAttribute('stroke', '#ffffff');
  c.setAttribute('stroke-width', '1');
  
  const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t.setAttribute('x', x);
  t.setAttribute('y', y + 12);
  t.setAttribute('text-anchor', 'middle');
  t.setAttribute('fill', color);
  t.setAttribute('font-size', '7px');
  t.textContent = name;
  
  g.appendChild(c);
  g.appendChild(t);
  dom.inspectorGroup.appendChild(g);
}

function drawInspectorTarget(x, y, labelText, color) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', '12');
  circle.setAttribute('fill', `${color}33`);
  circle.setAttribute('stroke', color);
  circle.setAttribute('stroke-width', '1.3');
  
  const centerDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  centerDot.setAttribute('cx', x);
  centerDot.setAttribute('cy', y);
  centerDot.setAttribute('r', '2.5');
  centerDot.setAttribute('fill', '#ffffff');
  
  const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  label.setAttribute('x', x);
  label.setAttribute('y', y - 15);
  label.setAttribute('text-anchor', 'middle');
  label.setAttribute('fill', color);
  label.setAttribute('font-size', '8px');
  label.setAttribute('font-weight', '700');
  label.textContent = labelText;
  
  g.appendChild(circle);
  g.appendChild(centerDot);
  g.appendChild(label);
  dom.inspectorGroup.appendChild(g);
}

function toggleInspectorMode() {
  state.inspectorActive = !state.inspectorActive;
  dom.inspectorGroup.style.display = state.inspectorActive ? 'block' : 'none';
  dom.btnToggleInspector.classList.toggle('active', state.inspectorActive);
}

function toggleMute() {
  sfx.muted = !sfx.muted;
  dom.btnMute.textContent = sfx.muted ? '🔇' : '🔊';
  dom.btnMute.classList.toggle('active', !sfx.muted);
}
