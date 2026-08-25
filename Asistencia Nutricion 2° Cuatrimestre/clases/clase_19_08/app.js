const questions = [
    {
        question: "Observa la gráfica clínica de la OMS en la imagen adjunta. Considerando que el indicador del paciente muestra un puntaje Z (Z-Score) de +2.27, ¿cuál es el diagnóstico nutricional correcto según las categorías establecidas?",
        image: "imagenes/preg1.png",
        options: [
            "Riesgo de Obesidad",
            "Riesgo de Sobrepeso",
            "Sobrepeso",
            "Obesidad Moderada"
        ],
        correctAnswer: 2
    },
    {
        question: "Si una niña tiene 11 meses de edad. Según las técnicas estandarizadas de la OMS, ¿cómo se debe tomar la medida de longitud/talla en este paciente?",
        image: "",
        options: [
            "Cargada en los brazos de la madre frente al estadiómetro, midiendo a ambas y luego restando la estatura de la madre.",
            "De pie en el estadiómetro.",
            "Acostado en un infantómetro.",
            "Es indiferente; se puede medir acostado o de pie siempre que se registre en el software cuál técnica se utilizó"
        ],
        correctAnswer: 2
    },
    {
        question: "Según la gráfica de ganancia de peso gestacional, la conducta nutricional más adecuada es:",
        image: "imagenes/img preg 3.png",
        options: [
            "Indicar restricción calórica para evitar sobrepeso gestacional.",
            "Recomendar actividad física adicional para optimizar la composición corporal",
            "Aumentar el aporte energético-proteico y monitorizar la evolución",
            "Tanto A como B son correctas"
        ],
        correctAnswer: 2
    },
    {
        question: "Lee detenidamente la viñeta clínica adjunta y responde: ¿Cuál es la formulación diagnóstica PES más exacta para esta paciente?",
        image: "imagenes/imagen preg 4.png",
        options: [
            "Pérdida de peso relacionada con falta de conocimiento sobre los requerimientos aumentados en el embarazo, evidenciada por consumo de 900 kcal/día.",
            "Náuseas y vómitos fisiológicos del embarazo relacionados con elevación hormonal normal, evidenciados por intolerancia a alimentos sólidos.",
            "Ingesta oral inadecuada relacionada con náuseas y vómitos severos del primer trimestre, evidenciada por consumo de solo 900 kcal/día y pérdida de peso de 3.5 kg en 4 semanas.",
            "Requerimientos energéticos aumentados relacionados con embarazo de 10 semanas, evidenciados por consumo de 900 kcal/día."
        ],
        correctAnswer: 2
    },
    {
        question: "Lee la viñeta clínica. Estás realizando un Recordatorio de 24 Horas y te encuentras en el Paso 4 (Ciclo de Detalle). El paciente acaba de mencionar su almuerzo. ¿Qué acción te corresponde hacer exactamente en este paso?",
        image: "imagenes/img preg 5.png",
        options: [
            "Aclararle al paciente que no lo vas a juzgar por lo que haya comido, para generar confianza y evitar que sienta vergüenza.",
            "Preguntarle si además de los fideos no se olvidó de mencionar algún vaso de agua, postre o golosina.",
            "Seguir escuchándola empáticamente para que continúe relatando todas las comidas y horarios del día hasta llegar a la última ingesta.",
            "Usar modelos visuales (réplicas de alimentos) para medir la porción exacta que se sirvió, e indagar cómo preparó la ensalada."
        ],
        correctAnswer: 3
    }
];

// URL DEL SCRIPT ACTUALIZADO
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzOxUYe6QJehfXRehv4Rr8xrlJ63SmfPE3rccACnmtYnlRXAWezUrDWa4aDpRsnkdsDPA/exec";

// Función para aleatorizar arrays
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Preparar y aleatorizar preguntas y opciones manteniendo el rastro original
questions.forEach((q, index) => {
    q.originalIndex = index; 
    const correctText = q.options[q.correctAnswer];
    shuffleArray(q.options); 
    q.correctAnswer = q.options.indexOf(correctText); 
});
shuffleArray(questions);

let currentQuestionIndex = 0;
let studentName = "";
let studentUp = "";
let cheatCount = 0;
let timerInterval;
let startTime;
let selectedOption = null;
let userAnswers = []; 
let isQuizActive = false;
let score = 0;

// DOM Elements
const screenStart = document.getElementById('start-screen');
const screenQuiz = document.getElementById('quiz-screen');
const screenEnd = document.getElementById('end-screen');
const overlay = document.getElementById('loading-overlay');

const btnStart = document.getElementById('btn-start');
const btnNext = document.getElementById('btn-next');
const btnDownload = document.getElementById('btn-download');
const inputName = document.getElementById('student-name');
const datalist = document.getElementById('student-list');
const timeDisplay = document.getElementById('time-display');

// Elementos para el registro manual
const linkManual = document.getElementById('link-manual-entry');
const linkSearch = document.getElementById('link-search-entry');
const groupSearch = document.getElementById('search-group');
const groupManual = document.getElementById('manual-group');
const manualUp = document.getElementById('manual-up');
const manualName = document.getElementById('manual-name');

let isManualEntry = false;

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

// Población del datalist
if (typeof studentsData !== 'undefined') {
    studentsData.forEach(student => {
        const option = document.createElement('option');
        option.value = `${student.up} - ${student.name}`;
        datalist.appendChild(option);
    });
}

// Iniciar Cuestionario
btnStart.addEventListener('click', () => {
    // (Removido el bloqueo de dispositivo para permitir múltiples envíos en la revisión)

    if (isManualEntry) {
        const upVal = manualUp.value.trim();
        const nameVal = manualName.value.trim();
        if (!upVal || !nameVal) {
            alert("Por favor, completa ambos campos (UP y Nombre).");
            return;
        }
        studentUp = upVal;
        studentName = nameVal;
    } else {
        const nameInputVal = inputName.value.trim();
        if (!nameInputVal || !nameInputVal.includes(" - ")) {
            alert("Por favor, selecciona obligatoriamente tu nombre desde la lista desplegable.");
            return;
        }
        const parts = nameInputVal.split(" - ");
        studentUp = parts[0];
        studentName = parts[1];
    }

    document.getElementById('display-name').textContent = `${studentUp} - ${studentName}`;
    
    // (Removido el guardado de localStorage para permitir intentos ilimitados)
    
    screenStart.classList.remove('active');
    screenQuiz.classList.add('active');
    
    isQuizActive = true;
    startTimer();
    loadQuestion();
});

function loadQuestion() {
    selectedOption = null;
    btnNext.disabled = true;
    
    if (currentQuestionIndex === questions.length - 1) {
        btnNext.textContent = "Finalizar y Ver Resultados 🏁";
    } else {
        btnNext.textContent = "Siguiente Pregunta ➡";
    }

    const currentQuestion = questions[currentQuestionIndex];
    
    const progressPercent = (currentQuestionIndex / questions.length) * 100;
    document.getElementById('progress-bar').style.width = progressPercent + "%";
    document.getElementById('progress-text').textContent = `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`;

    document.getElementById('question-text').textContent = currentQuestion.question;
    
    const imgContainer = document.getElementById('image-container');
    const imgElement = document.getElementById('question-image');
    if (currentQuestion.image && currentQuestion.image !== "") {
        imgElement.src = currentQuestion.image;
        imgContainer.style.display = "block";
    } else {
        imgContainer.style.display = "none";
    }

    const answerContainer = document.getElementById('answer-container');
    answerContainer.innerHTML = ''; 
    
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'btn answer-btn';
        button.textContent = option;
        button.onclick = () => selectAnswer(index, button);
        answerContainer.appendChild(button);
    });
}

function selectAnswer(index, buttonElement) {
    selectedOption = index;
    const buttons = document.querySelectorAll('.answer-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    buttonElement.classList.add('selected');
    btnNext.disabled = false;
}

btnNext.addEventListener('click', () => {
    // Evaluar la respuesta elegida
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = (selectedOption === currentQuestion.correctAnswer);
    if (isCorrect) score++;

    // Guardar para Excel
    userAnswers.push({
        originalIndex: currentQuestion.originalIndex,
        pregunta: currentQuestion.question,
        respuesta_alumno: currentQuestion.options[selectedOption],
        es_correcta: isCorrect ? "SÍ" : "NO"
    });

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        finishQuiz();
    }
});

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const secs = String(elapsed % 60).padStart(2, '0');
        timeDisplay.textContent = `${mins}:${secs}`;
    }, 1000);
}

// ----------------------------------------------------
// SISTEMA ANTI-TRAMPAS CON TOAST FLOATING ALERTS
// ----------------------------------------------------
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <img src="imagenes/1855c7fa3a5b0bd9095a29e2fd0478fc.gif" class="toast-gif" alt="Alerta">
        <div>
            <span class="toast-icon">🚨</span> <span>${message}</span>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

let isCheatingRecently = false;

document.addEventListener("visibilitychange", () => {
    if (document.hidden && isQuizActive && !isCheatingRecently) {
        registerCheat("Has cambiado de aplicación o pantalla");
    }
});

window.addEventListener('blur', () => {
    if (isQuizActive && !isCheatingRecently) {
        registerCheat("Has perdido el foco de la ventana");
    }
});

function registerCheat(reason) {
    cheatCount++;
    isCheatingRecently = true;
    showToast(`¡ADVERTENCIA! ${reason}. Infracción #${cheatCount} registrada.`);
    
    // Bloquear el doble registro por 2 segundos
    setTimeout(() => {
        isCheatingRecently = false;
    }, 2000);
}
// ----------------------------------------------------

async function finishQuiz() {
    isQuizActive = false;
    clearInterval(timerInterval);
    const totalTime = timeDisplay.textContent;
    
    document.getElementById('progress-bar').style.width = "100%";
    screenQuiz.classList.remove('active');
    overlay.classList.add('active');

    // Ordenar las respuestas según el índice original para no mezclar las columnas del Excel
    userAnswers.sort((a, b) => a.originalIndex - b.originalIndex);

    const payload = {
        clase: "19_08",
        up: studentUp,
        nombre: studentName,
        tiempo: totalTime,
        puntaje: `${score}/${questions.length}`,
        trampas: cheatCount,
        respuestas: userAnswers
    };

    try {
        if(GOOGLE_SCRIPT_URL === "URL_DEL_NUEVO_SCRIPT_AQUI") {
             console.log("Simulando envío...", payload);
             await new Promise(r => setTimeout(r, 1500));
        } else {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }
    } catch (error) {
        console.error('Error al enviar:', error);
    } finally {
        overlay.classList.remove('active');
        showEndScreen(totalTime);
    }
}

function showEndScreen(totalTime) {
    screenEnd.classList.add('active');
    document.getElementById('final-name').textContent = `${studentUp} - ${studentName}`;
    document.getElementById('final-time').textContent = totalTime;
    
    // NOTA: Se ha ocultado el puntaje de la pantalla final
    
    if (cheatCount > 0) {
        document.getElementById('cheat-stat').style.display = 'flex';
        document.getElementById('final-cheats').textContent = cheatCount;
    }
}

// Descarga de comprobante en PDF
btnDownload.addEventListener('click', () => {
    // Crear contenedor HTML invisible para el PDF
    const pdfDiv = document.createElement('div');
    pdfDiv.style.padding = '30px';
    pdfDiv.style.fontFamily = 'Helvetica, Arial, sans-serif';
    pdfDiv.style.color = '#1f2937';
    
    let htmlContent = `
        <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Comprobante de Revisión</h1>
        <p><strong>Fecha y Hora:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Alumno:</strong> ${studentName}</p>
        <p><strong>UP / Legajo:</strong> ${studentUp}</p>
        <p><strong>Tiempo de Resolución:</strong> ${timeDisplay.textContent}</p>
        <p style="color: #4b5563; font-style: italic; margin-top: 15px;">* Su revisión ha sido enviada exitosamente al sistema como asistencia.</p>
    `;
    
    if (cheatCount > 0) {
        htmlContent += `<p style="color: #ef4444; font-weight: bold; background-color: #fee2e2; padding: 10px; border-radius: 5px;">⚠️ Infracciones registradas (Anti-Trampas): ${cheatCount}</p>`;
    }
    
    htmlContent += `
        <hr style="margin: 20px 0; border: 1px solid #e5e7eb;">
        <h2>TUS RESPUESTAS ELEGIDAS:</h2>
    `;
    
    userAnswers.forEach((ans, index) => {
        htmlContent += `
            <div style="margin-bottom: 15px; padding: 10px; background: #f9fafb; border-radius: 6px; border-left: 4px solid #9ca3af; page-break-inside: avoid;">
                <p style="margin:0 0 5px 0; font-weight: bold;">Pregunta ${index + 1}</p>
                <p style="margin:0; font-size: 0.95rem;">> Elegiste: ${ans.respuesta_alumno}</p>
            </div>
        `;
    });
    
    pdfDiv.innerHTML = htmlContent;
    
    const opt = {
      margin:       10,
      filename:     `Revision_${studentUp}_${studentName.replace(/ /g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Cambiar botón temporalmente
    btnDownload.textContent = "⏳ Generando PDF...";
    btnDownload.disabled = true;
    
    html2pdf().set(opt).from(pdfDiv).save().then(() => {
        btnDownload.textContent = "📥 Descargar Comprobante PDF/TXT";
        btnDownload.disabled = false;
    });
});
