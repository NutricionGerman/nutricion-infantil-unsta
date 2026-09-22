// URL DEL GOOGLE APPS SCRIPT DE ASISTENCIAS
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxi3lgWj_MFPYhsl3UTjnaT0gVA8UJIbvfbUvL10B4QX0xhCXWKdONR9oiRvZSCW2h2XA/exec";

// Duración en segundos por cada enfrentamiento
const DUEL_TIME_LIMIT = 10;
const TOTAL_REGULAR_DUELS = 20;

// Variables de estado del Alumno
let studentName = "";
let studentUp = "";
let cheatCount = 0;
let isGameActive = false;
let isCheatingRecently = false;
let globalStartTime = null;
let globalTimerInterval = null;

// Variables de los Duelos y Clasificación
let allFoods = [];
let regularDuelCount = 0;
let currentDuel = null;
let gamePhase = "regular"; // "regular", "playoff3_4", "grandFinal"

// Resultados del Podio y Respuestas de Paradigmas
let finalPodium = []; // [Top 1, Top 2, Top 3, Top 4, Top 5]
let paradigmAnswers = { p1: null, p2: null };

// Temporizador del enfrentamiento individual (10s)
let duelTimeRemaining = DUEL_TIME_LIMIT;
let duelTimerInterval = null;
let isDuelResolving = false;

// Elementos DOM
const screenStart = document.getElementById('start-screen');
const screenDuel = document.getElementById('duel-screen');
const screenParadigm1 = document.getElementById('paradigm-screen-1');
const screenParadigm2 = document.getElementById('paradigm-screen-2');
const screenEnd = document.getElementById('end-screen');
const overlay = document.getElementById('loading-overlay');

const inputStudentName = document.getElementById('student-name');
const datalistStudents = document.getElementById('student-list');
const btnStartGame = document.getElementById('btn-start-game');
const btnDownloadPdf = document.getElementById('btn-download-pdf');

const linkManual = document.getElementById('link-manual-entry');
const linkSearch = document.getElementById('link-search-entry');
const groupSearch = document.getElementById('search-group');
const groupManual = document.getElementById('manual-group');
const manualUp = document.getElementById('manual-up');
const manualName = document.getElementById('manual-name');

const roundBadge = document.getElementById('round-badge');
const secondsLeftDisplay = document.getElementById('seconds-left');
const duelTimerBar = document.getElementById('duel-timer-bar');
const globalTimeDisplay = document.getElementById('global-time-display');
const displayPlayerName = document.getElementById('display-player-name');

const cardFoodA = document.getElementById('card-food-a');
const cardFoodB = document.getElementById('card-food-b');

const emojiA = document.getElementById('emoji-a');
const nameA = document.getElementById('name-a');
const emojiB = document.getElementById('emoji-b');
const nameB = document.getElementById('name-b');

let isManualEntry = false;

// ----------------------------------------------------
// 1. INICIALIZACIÓN Y AUTOCOMPLETADO DE ALUMNOS
// ----------------------------------------------------
if (typeof studentsData !== 'undefined' && datalistStudents) {
    studentsData.forEach(student => {
        const option = document.createElement('option');
        option.value = `${student.up} - ${student.name}`;
        datalistStudents.appendChild(option);
    });
}

// Conmutar entre búsqueda en lista y entrada manual
if (linkManual && linkSearch) {
    linkManual.addEventListener('click', (e) => {
        e.preventDefault();
        isManualEntry = true;
        groupSearch.style.display = 'none';
        groupManual.style.display = 'block';
    });

    linkSearch.addEventListener('click', (e) => {
        e.preventDefault();
        isManualEntry = false;
        groupManual.style.display = 'none';
        groupSearch.style.display = 'block';
    });
}

// ----------------------------------------------------
// 2. INICIO DEL JUEGO
// ----------------------------------------------------
btnStartGame.addEventListener('click', () => {
    if (isManualEntry) {
        studentUp = manualUp.value.trim();
        studentName = manualName.value.trim();
        if (!studentUp || !studentName) {
            alert("Por favor completa tu UP/DNI y tu Nombre y Apellido.");
            return;
        }
    } else {
        const rawValue = inputStudentName.value.trim();
        if (!rawValue) {
            alert("Por favor selecciona tu nombre del listado.");
            return;
        }

        const match = rawValue.match(/^(\d+)\s*-\s*(.+)$/);
        if (match) {
            studentUp = match[1];
            studentName = match[2];
        } else {
            studentUp = "S/D";
            studentName = rawValue;
        }
    }

    displayPlayerName.textContent = studentName;
    iniciarLigaDeDuelos();
});

// Función utilitaria para mezclar arrays
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ----------------------------------------------------
// 3. MECÁNICA DE LIGA: DUELOS DINÁMICOS CON RECUPERACIÓN
// ----------------------------------------------------
function iniciarLigaDeDuelos() {
    screenStart.classList.remove('active');
    screenDuel.classList.add('active');
    isGameActive = true;

    startGlobalTimer();

    // Inicializamos todos los 25 alimentos con puntuación 0
    allFoods = alimentosDatabase.map(f => ({
        ...f,
        wins: 0,
        matches: 0,
        lastOpponentId: null
    }));

    regularDuelCount = 1;
    gamePhase = "regular";
    finalPodium = [];

    generarSiguienteDueloRegular();
}

// Genera un enfrentamiento de 2 alimentos aleatorios distintos que no acaben de enfrentarse
function generarSiguienteDueloRegular() {
    isDuelResolving = false;
    cardFoodA.className = "food-card";
    cardFoodB.className = "food-card";

    // Ordenar con ligera prioridad a alimentos con menos partidos disputados
    const sortedByMatches = shuffle([...allFoods]).sort((a, b) => a.matches - b.matches);
    const foodA = sortedByMatches[0];

    // Buscar rival que no sea el mismo
    const possibleOpponents = sortedByMatches.slice(1).filter(f => f.id !== foodA.lastOpponentId);
    const foodB = possibleOpponents.length > 0 ? possibleOpponents[0] : sortedByMatches[1];

    currentDuel = { foodA, foodB };

    roundBadge.textContent = `Duelo ${regularDuelCount} de ${TOTAL_REGULAR_DUELS}`;

    // Renderizar tarjetas limpias (solo emoji y nombre)
    emojiA.textContent = foodA.emoji;
    nameA.textContent = foodA.nombre;

    emojiB.textContent = foodB.emoji;
    nameB.textContent = foodB.nombre;

    startDuelTimer();
}

// ----------------------------------------------------
// 4. TEMPORIZADOR DE 10 SEGUNDOS POR DUELO
// ----------------------------------------------------
function startDuelTimer() {
    clearInterval(duelTimerInterval);
    duelTimeRemaining = DUEL_TIME_LIMIT;
    updateDuelTimerUI();

    const intervalMs = 100;
    duelTimerInterval = setInterval(() => {
        duelTimeRemaining -= intervalMs / 1000;
        if (duelTimeRemaining <= 0) {
            duelTimeRemaining = 0;
            updateDuelTimerUI();
            clearInterval(duelTimerInterval);
            handleTimeExpired();
        } else {
            updateDuelTimerUI();
        }
    }, intervalMs);
}

function updateDuelTimerUI() {
    const wholeSecs = Math.ceil(duelTimeRemaining);
    secondsLeftDisplay.textContent = wholeSecs;

    const percent = (duelTimeRemaining / DUEL_TIME_LIMIT) * 100;
    duelTimerBar.style.width = `${percent}%`;

    if (duelTimeRemaining <= 3.2) {
        duelTimerBar.className = "timer-bar danger";
    } else if (duelTimeRemaining <= 5.5) {
        duelTimerBar.className = "timer-bar warning";
    } else {
        duelTimerBar.className = "timer-bar";
    }
}

function handleTimeExpired() {
    if (isDuelResolving) return;
    showToast("⏰ ¡Tiempo agotado! Se seleccionó por descarte.");
    const randomPick = Math.random() < 0.5 ? 'A' : 'B';
    selectFood(randomPick, true);
}

// ----------------------------------------------------
// 5. SELECCIÓN DE ALIMENTO Y AVANCE
// ----------------------------------------------------
function selectFood(choice, autoPicked = false) {
    if (isDuelResolving) return;
    isDuelResolving = true;
    clearInterval(duelTimerInterval);

    const winner = (choice === 'A') ? currentDuel.foodA : currentDuel.foodB;
    const loser = (choice === 'A') ? currentDuel.foodB : currentDuel.foodA;

    // Feedback táctil visual
    if (choice === 'A') {
        cardFoodA.classList.add('selected');
        cardFoodB.classList.add('eliminated');
    } else {
        cardFoodB.classList.add('selected');
        cardFoodA.classList.add('eliminated');
    }

    setTimeout(() => {
        procesarResultadoDuelo(winner, loser);
    }, 380);
}

function procesarResultadoDuelo(winner, loser) {
    if (gamePhase === "regular") {
        winner.wins++;
        winner.matches++;
        loser.matches++;

        winner.lastOpponentId = loser.id;
        loser.lastOpponentId = winner.id;

        regularDuelCount++;

        if (regularDuelCount <= TOTAL_REGULAR_DUELS) {
            generarSiguienteDueloRegular();
        } else {
            // Fin de la fase regular. Determinamos los mejores para la Gran Final y Podio
            prepararFaseFinal();
        }

    } else if (gamePhase === "playoff3_4") {
        // Definición de 3° y 4° puesto
        finalPodium[2] = winner; // 3° Puesto
        finalPodium[3] = loser;  // 4° Puesto

        // Ahora disputar la Gran Final por el 1° y 2° Puesto
        gamePhase = "grandFinal";
        currentDuel = { foodA: topContenders[0], foodB: topContenders[1] };

        isDuelResolving = false;
        cardFoodA.className = "food-card";
        cardFoodB.className = "food-card";

        roundBadge.innerHTML = `🏆 Gran Final: Alimento Campeón (1° vs 2° Puesto)`;
        emojiA.textContent = currentDuel.foodA.emoji;
        nameA.textContent = currentDuel.foodA.nombre;
        emojiB.textContent = currentDuel.foodB.emoji;
        nameB.textContent = currentDuel.foodB.nombre;

        startDuelTimer();

    } else if (gamePhase === "grandFinal") {
        // Gran Final concluida
        finalPodium[0] = winner; // 1° Puesto (Campeón)
        finalPodium[1] = loser;  // 2° Puesto (Subcampeón)

        // Ir a las pantallas de reflexión sobre Paradigmas
        iniciarModuloParadigmas();
    }
}

let topContenders = [];

function prepararFaseFinal() {
    // Ordenar los alimentos por cantidad de victorias
    const sorted = [...allFoods].sort((a, b) => b.wins - a.wins);
    topContenders = sorted.slice(0, 4);

    // El 5° puesto queda asignado al 5to alimento con mejor puntaje
    finalPodium[4] = sorted[4];

    // Primero disputamos el 3° y 4° puesto entre los contendientes 3 y 4
    gamePhase = "playoff3_4";
    currentDuel = { foodA: topContenders[2], foodB: topContenders[3] };

    isDuelResolving = false;
    cardFoodA.className = "food-card";
    cardFoodB.className = "food-card";

    roundBadge.innerHTML = `🥉 Duelo por el 3° y 4° Puesto (Medalla de Bronce)`;
    emojiA.textContent = currentDuel.foodA.emoji;
    nameA.textContent = currentDuel.foodA.nombre;
    emojiB.textContent = currentDuel.foodB.emoji;
    nameB.textContent = currentDuel.foodB.nombre;

    startDuelTimer();
}

// ----------------------------------------------------
// 6. MÓDULO PEDAGÓGICO: PARADIGMAS NUTRICIONALES
// ----------------------------------------------------
function iniciarModuloParadigmas() {
    screenDuel.classList.remove('active');
    screenParadigm1.classList.add('active');

    // Conectar con el alimento campeón elegido por el alumno
    const champ = finalPodium[0];
    document.getElementById('chosen-food-emoji').textContent = champ.emoji;
    document.getElementById('chosen-food-name').textContent = champ.nombre;
}

function answerParadigmQuestion(questionNum, choice, isCorrect) {
    const feedbackBox = document.getElementById(`feedback-p${questionNum}`);
    const choiceA = document.getElementById(`choice-p${questionNum}-a`);
    const choiceB = document.getElementById(`choice-p${questionNum}-b`);
    const btnNext = (questionNum === 1) 
        ? document.getElementById('btn-next-paradigm-1') 
        : document.getElementById('btn-finish-paradigm');

    // Deshabilitar clics posteriores
    choiceA.style.pointerEvents = "none";
    choiceB.style.pointerEvents = "none";

    paradigmAnswers[`p${questionNum}`] = { choice, isCorrect };

    if (choice === 'A') {
        choiceA.className = isCorrect ? "quiz-choice-btn correct" : "quiz-choice-btn incorrect";
    } else {
        choiceB.className = isCorrect ? "quiz-choice-btn correct" : "quiz-choice-btn incorrect";
    }

    feedbackBox.style.display = "block";

    if (questionNum === 1) {
        if (isCorrect) {
            feedbackBox.style.background = "#ecfdf5";
            feedbackBox.style.border = "1px solid #a7f3d0";
            feedbackBox.style.color = "#065f46";
            feedbackBox.innerHTML = `
                ✅ <strong>¡Exacto!</strong> Un paradigma es el marco mental y modelo dominante que establece cómo una comunidad científica interpreta la realidad en una época dada. Tu elección de <em>${finalPodium[0].nombre}</em> funcionó como tu propio lente o paradigma en esta actividad.
            `;
        } else {
            feedbackBox.style.background = "#fef2f2";
            feedbackBox.style.border = "1px solid #fecaca";
            feedbackBox.style.color = "#991b1b";
            feedbackBox.innerHTML = `
                💡 <strong>Aclaración epistemológica:</strong> Los paradigmas nunca son verdades absolutas ni dogmas inmutables. Son marcos teóricos temporales que la ciencia somete continuamente a prueba.
            `;
        }
        btnNext.disabled = false;

    } else if (questionNum === 2) {
        if (isCorrect) {
            feedbackBox.style.background = "#ecfdf5";
            feedbackBox.style.border = "1px solid #a7f3d0";
            feedbackBox.style.color = "#065f46";
            feedbackBox.innerHTML = `
                ✅ <strong>¡Brillante!</strong> El cambio de paradigma (*Paradigm Shift*) ocurre cuando la evidencia empírica rigurosa y las relaciones causales comprobadas derriban los viejos modelos, tal como ocurrió cuando la ciencia demostró que fumar causaba cáncer y derribó el paradigma de que era inofensivo.
            `;
        } else {
            feedbackBox.style.background = "#fef2f2";
            feedbackBox.style.border = "1px solid #fecaca";
            feedbackBox.style.color = "#991b1b";
            feedbackBox.innerHTML = `
                💡 <strong>Concepto clave:</strong> En ciencia, los cambios de paradigma no responden a modas sociales ni a opiniones populares, sino a la acumulación sistemática de evidencia científica irrefutable.
            `;
        }
        btnNext.disabled = false;
    }
}

function goToParadigmScreen2() {
    screenParadigm1.classList.remove('active');
    screenParadigm2.classList.add('active');
}

// ----------------------------------------------------
// 7. CONCLUSIÓN, ENVÍO A SHEETS Y PODIO FINAL
// ----------------------------------------------------
async function finalizarYVerPodio() {
    screenParadigm2.classList.remove('active');
    overlay.classList.add('active');

    isGameActive = false;
    clearInterval(globalTimerInterval);
    const totalTime = globalTimeDisplay.textContent;

    // Payload completo con Top 5 y verificación epistemológica
    const payload = {
        clase: "Duelo_Alimentos",
        tipo: "duelo_alimentos",
        up: studentUp,
        nombre: studentName,
        tiempo: totalTime,
        puntaje: `🥇 ${finalPodium[0].nombre}`,
        trampas: cheatCount,
        top1: finalPodium[0].nombre,
        top2: finalPodium[1].nombre,
        top3: finalPodium[2].nombre,
        top4: finalPodium[3].nombre,
        top5: finalPodium[4].nombre,
        respuestas: [
            { pregunta: "🥇 1° Puesto (Campeón)", respuesta_alumno: `${finalPodium[0].emoji} ${finalPodium[0].nombre}`, es_correcta: "SÍ" },
            { pregunta: "🥈 2° Puesto", respuesta_alumno: `${finalPodium[1].emoji} ${finalPodium[1].nombre}`, es_correcta: "SÍ" },
            { pregunta: "🥉 3° Puesto", respuesta_alumno: `${finalPodium[2].emoji} ${finalPodium[2].nombre}`, es_correcta: "SÍ" },
            { pregunta: "4° Puesto", respuesta_alumno: `${finalPodium[3].emoji} ${finalPodium[3].nombre}`, es_correcta: "SÍ" },
            { pregunta: "5° Puesto", respuesta_alumno: `${finalPodium[4].emoji} ${finalPodium[4].nombre}`, es_correcta: "SÍ" },
            { pregunta: "Paradigma Imperante", respuesta_alumno: paradigmAnswers.p1?.isCorrect ? "Correcto" : "Revisado", es_correcta: paradigmAnswers.p1?.isCorrect ? "SÍ" : "NO" },
            { pregunta: "Cambio de Paradigma", respuesta_alumno: paradigmAnswers.p2?.isCorrect ? "Correcto" : "Revisado", es_correcta: paradigmAnswers.p2?.isCorrect ? "SÍ" : "NO" }
        ]
    };

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (err) {
        console.error("Error al enviar registro a Sheets:", err);
    } finally {
        overlay.classList.remove('active');
        mostrarPantallaFinal(totalTime);
    }
}

function mostrarPantallaFinal(totalTime) {
    screenEnd.classList.add('active');

    document.getElementById('final-student-name').textContent = `${studentUp} - ${studentName}`;
    document.getElementById('final-total-time').textContent = totalTime;

    if (cheatCount > 0) {
        document.getElementById('stat-cheats-container').style.display = 'flex';
        document.getElementById('final-cheats').textContent = cheatCount;
    }

    const podiumContainer = document.getElementById('podium-list');
    podiumContainer.innerHTML = '';

    const rankLabels = [
        { num: "🥇", class: "top-1", label: "1° Lugar (Campeón Nutricional)" },
        { num: "🥈", class: "top-2", label: "2° Lugar (Subcampeón)" },
        { num: "🥉", class: "top-3", label: "3° Lugar (Medalla de Bronce)" },
        { num: "4°", class: "", label: "4° Lugar" },
        { num: "5°", class: "", label: "5° Lugar" }
    ];

    finalPodium.forEach((food, idx) => {
        const item = document.createElement('div');
        item.className = `podium-item ${rankLabels[idx].class}`;
        item.innerHTML = `
            <div class="podium-rank">${rankLabels[idx].num}</div>
            <div class="podium-emoji">${food.emoji}</div>
            <div class="podium-info">
                <div class="podium-title">${food.nombre}</div>
                <div class="podium-sub">${rankLabels[idx].label}</div>
            </div>
        `;
        podiumContainer.appendChild(item);
    });

    if (typeof confetti === 'function') {
        confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.6 }
        });
    }
}

// ----------------------------------------------------
// 8. TEMPORIZADOR GLOBAL Y ANTI-TRAMPAS
// ----------------------------------------------------
function startGlobalTimer() {
    globalStartTime = Date.now();
    globalTimerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - globalStartTime) / 1000);
        const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const secs = String(elapsed % 60).padStart(2, '0');
        globalTimeDisplay.textContent = `${mins}:${secs}`;
    }, 1000);
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>⚠️</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

document.addEventListener("visibilitychange", () => {
    if (document.hidden && isGameActive && !isCheatingRecently) {
        registrarInfraccion("Has cambiado de aplicación o minimizado la pantalla");
    }
});

window.addEventListener('blur', () => {
    if (isGameActive && !isCheatingRecently) {
        registrarInfraccion("Has perdido el foco de la pantalla del juego");
    }
});

function registrarInfraccion(motivo) {
    cheatCount++;
    isCheatingRecently = true;
    showToast(`Infracción #${cheatCount}: ${motivo}. Queda registrado en la planilla.`);
    setTimeout(() => {
        isCheatingRecently = false;
    }, 2000);
}

// ----------------------------------------------------
// 9. DESCARGA DEL COMPROBANTE EN PDF
// ----------------------------------------------------
btnDownloadPdf.addEventListener('click', () => {
    const pdfDiv = document.createElement('div');
    pdfDiv.style.padding = '25px';
    pdfDiv.style.fontFamily = 'Helvetica, Arial, sans-serif';
    pdfDiv.style.color = '#1f2937';

    let podiumRows = "";
    finalPodium.forEach((food, idx) => {
        const pos = idx + 1;
        podiumRows += `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; margin-bottom: 8px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 18px; font-weight: bold; width: 30px;">#${pos}</span>
                    <span style="font-size: 26px;">${food.emoji}</span>
                    <strong style="font-size: 16px;">${food.nombre}</strong>
                </div>
            </div>
        `;
    });

    pdfDiv.innerHTML = `
        <div style="border-bottom: 3px solid #10b981; padding-bottom: 12px; margin-bottom: 20px;">
            <h1 style="color: #059669; margin: 0 0 4px 0; font-size: 22px;">Comprobante de Asistencia y Participación</h1>
            <p style="margin: 0; color: #6b7280; font-size: 13px;">Cátedra de Nutrición Clínica / Infantil - UNSTA</p>
        </div>

        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 14px; margin-bottom: 20px; font-size: 13px;">
            <p style="margin: 3px 0;"><strong>Alumno:</strong> ${studentName}</p>
            <p style="margin: 3px 0;"><strong>UP / Legajo:</strong> ${studentUp}</p>
            <p style="margin: 3px 0;"><strong>Fecha y Hora:</strong> ${new Date().toLocaleString('es-AR')}</p>
            <p style="margin: 3px 0;"><strong>Tiempo de Resolución:</strong> ${globalTimeDisplay.textContent}</p>
            ${cheatCount > 0 ? `<p style="margin: 3px 0; color: #dc2626; font-weight: bold;">Infracciones registradas: ${cheatCount}</p>` : ''}
        </div>

        <h3 style="font-size: 16px; margin-bottom: 12px; color: #111827;">Top 5 Alimentos Más Saludables Seleccionados:</h3>
        ${podiumRows}

        <div style="margin-top: 20px; padding: 12px; background: #f3f4f6; border-radius: 8px; font-size: 12px;">
            <strong>Módulo Epistemológico Completado:</strong>
            <p style="margin: 4px 0 0 0; color: #4b5563;">
                Participación en la reflexión de Paradigma Imperante y Cambio de Paradigma en la Ciencia Nutricional.
            </p>
        </div>

        <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 30px;">
            Este documento certifica el registro electrónico de asistencia y participación de la cátedra.
        </p>
    `;

    const opt = {
        margin: 10,
        filename: `Asistencia_Duelo_Alimentos_${studentUp}_${studentName.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (typeof html2pdf === 'function') {
        html2pdf().set(opt).from(pdfDiv).save();
    } else {
        window.print();
    }
});
