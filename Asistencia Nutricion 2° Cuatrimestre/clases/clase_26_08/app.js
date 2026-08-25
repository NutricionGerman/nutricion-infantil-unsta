const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzOxUYe6QJehfXRehv4Rr8xrlJ63SmfPE3rccACnmtYnlRXAWezUrDWa4aDpRsnkdsDPA/exec";

// Elementos DOM
const datalist = document.getElementById('student-list');
const inputEvaluator = document.getElementById('evaluator-input');
const inputEvaluated = document.getElementById('evaluated-input');

const inputPeso = document.getElementById('med-peso');
const inputTalla = document.getElementById('med-talla');
const inputPB = document.getElementById('med-pb');
const inputCC = document.getElementById('med-cc');
const inputPT = document.getElementById('med-pt');
const inputHGS = document.getElementById('med-hgs');

const dispIMC = document.getElementById('disp-imc');
const dispRCE = document.getElementById('disp-rce');
const dispCAMB = document.getElementById('disp-camb');
const dispMQI = document.getElementById('disp-mqi');

const formScreen = document.getElementById('form-screen');
const successModal = document.getElementById('success-modal');
const loadingOverlay = document.getElementById('loading-overlay');

let sessionRecords = [];

// 1. Cargar lista de estudiantes en el autocompletado
if (typeof studentsData !== 'undefined' && datalist) {
    studentsData.forEach(student => {
        const option = document.createElement('option');
        option.value = `${student.up} - ${student.name}`;
        datalist.appendChild(option);
    });
}

// 2. Cálculos automáticos en vivo
function updateLiveCalculations() {
    const peso = parseFloat(inputPeso.value) || 0;
    const talla = parseFloat(inputTalla.value) || 0;
    const pb = parseFloat(inputPB.value) || 0;
    const cc = parseFloat(inputCC.value) || 0;
    const pt = parseFloat(inputPT.value) || 0;
    const hgs = parseFloat(inputHGS.value) || 0;

    // IMC
    if (peso > 0 && talla > 0) {
        const tallaM = talla / 100;
        const imc = peso / (tallaM * tallaM);
        dispIMC.innerText = `${imc.toFixed(1)}`;
    } else {
        dispIMC.innerText = '--';
    }

    // RCE (Razón Cintura / Talla)
    if (cc > 0 && talla > 0) {
        const rce = cc / talla;
        dispRCE.innerText = `${rce.toFixed(2)} ${rce >= 0.5 ? '⚠️' : '✅'}`;
    } else {
        dispRCE.innerText = '--';
    }

    // AMB y cAMB
    let camb = 0;
    if (pb > 0 && pt > 0) {
        const ptCm = pt / 10;
        const amb = Math.pow(pb - (Math.PI * ptCm), 2) / (4 * Math.PI);
        camb = Math.max(0, amb - 6.5); // Promedio de corrección
        dispCAMB.innerText = `${camb.toFixed(1)} cm²`;
    } else {
        dispCAMB.innerText = '--';
    }

    // MQI (Fuerza / cAMB)
    if (hgs > 0 && camb > 0) {
        const mqi = hgs / camb;
        dispMQI.innerText = `${mqi.toFixed(2)}`;
    } else {
        dispMQI.innerText = '--';
    }
}

// 3. Parsear campo de estudiante (UP y Nombre)
function parseStudentInput(val) {
    if (!val) return null;
    if (val.includes(" - ")) {
        const parts = val.split(" - ");
        return { up: parts[0].trim(), name: parts[1].trim() };
    }
    return { up: "MANUAL", name: val.trim() };
}

// 4. Enviar registro antropométrico a Google Sheets
async function submitAnthropometryRecord() {
    const evaluatorVal = inputEvaluator.value.trim();
    const evaluatedVal = inputEvaluated.value.trim();

    if (!evaluatorVal) {
        alert("⚠️ Por favor selecciona tu nombre en '¿Quién está midiendo? (Evaluador)'.");
        inputEvaluator.focus();
        return;
    }

    if (!evaluatedVal) {
        alert("⚠️ Por favor selecciona a tu compañero en '¿A quién estás evaluando?'.");
        inputEvaluated.focus();
        return;
    }

    const evaluator = parseStudentInput(evaluatorVal);
    const evaluated = parseStudentInput(evaluatedVal);

    if (evaluator.up === evaluated.up && evaluator.up !== "MANUAL") {
        const confirmSelf = confirm("Has seleccionado tu mismo nombre como Evaluador y Evaluado. ¿Estás seguro de continuar con el auto-registro?");
        if (!confirmSelf) return;
    }

    const peso = parseFloat(inputPeso.value) || '';
    const talla = parseFloat(inputTalla.value) || '';
    const pb = parseFloat(inputPB.value) || '';
    const cc = parseFloat(inputCC.value) || '';
    const pt = parseFloat(inputPT.value) || '';
    const hgs = parseFloat(inputHGS.value) || '';

    if (!peso && !talla && !pb && !cc && !pt && !hgs) {
        alert("⚠️ Debes ingresar al menos una medición antropométrica antes de guardar.");
        return;
    }

    // Cálculos derivados
    let imc = '';
    if (peso && talla) {
        const tM = talla / 100;
        imc = (peso / (tM * tM)).toFixed(1);
    }

    let rce = '';
    if (cc && talla) {
        rce = (cc / talla).toFixed(2);
    }

    let amb = '', camb = '', mqi = '';
    if (pb && pt) {
        const ptCm = pt / 10;
        const ambNum = Math.pow(pb - (Math.PI * ptCm), 2) / (4 * Math.PI);
        const cambNum = Math.max(0, ambNum - 6.5);
        amb = ambNum.toFixed(1);
        camb = cambNum.toFixed(1);
        if (hgs && cambNum > 0) {
            mqi = (hgs / cambNum).toFixed(2);
        }
    }

    // Payload optimizado tanto para nuevo script como para el script actual
    const payload = {
        clase: "Taller_26_08",
        tipo: "antropometria",
        up: evaluator.up,
        nombre: evaluator.name,
        up_evaluador: evaluator.up,
        nombre_evaluador: evaluator.name,
        up_evaluado: evaluated.up,
        nombre_evaluado: evaluated.name,
        peso: peso,
        talla: talla,
        imc: imc,
        pb: pb,
        cc: cc,
        rce: rce,
        pt: pt,
        hgs: hgs,
        amb: amb,
        camb: camb,
        mqi: mqi,
        puntaje: "Taller Clínico",
        tiempo: new Date().toLocaleTimeString('es-AR'),
        trampas: 0,
        // Array de respuestas para compatibilidad total con el Google Apps Script existente
        respuestas: [
            { pregunta: "Evaluado", respuesta_alumno: `${evaluated.up} - ${evaluated.name}`, es_correcta: "SÍ" },
            { pregunta: "Peso (kg)", respuesta_alumno: peso ? `${peso} kg` : "N/A", es_correcta: "SÍ" },
            { pregunta: "Talla (cm)", respuesta_alumno: talla ? `${talla} cm` : "N/A", es_correcta: "SÍ" },
            { pregunta: "IMC (kg/m²)", respuesta_alumno: imc ? `${imc} kg/m²` : "N/A", es_correcta: "SÍ" },
            { pregunta: "Perím. Brazo PB (cm)", respuesta_alumno: pb ? `${pb} cm` : "N/A", es_correcta: "SÍ" },
            { pregunta: "Cintura CC (cm)", respuesta_alumno: cc ? `${cc} cm` : "N/A", es_correcta: "SÍ" },
            { pregunta: "Pliegue Tríceps PT (mm)", respuesta_alumno: pt ? `${pt} mm` : "N/A", es_correcta: "SÍ" },
            { pregunta: "Dinamometría HGS (kg)", respuesta_alumno: hgs ? `${hgs} kg` : "N/A", es_correcta: "SÍ" },
            { pregunta: "cAMB (cm²)", respuesta_alumno: camb ? `${camb} cm²` : "N/A", es_correcta: "SÍ" },
            { pregunta: "MQI (kg/cm²)", respuesta_alumno: mqi ? `${mqi} kg/cm²` : "N/A", es_correcta: "SÍ" }
        ]
    };

    loadingOverlay.classList.add('active');

    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // Registrar en historial de sesión
        sessionRecords.push({
            evaluator: evaluator.name,
            evaluated: evaluated.name,
            peso, talla, imc, pb, cc, pt, hgs, mqi,
            time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
        });
        renderSessionHistory();

        // Mostrar modal de éxito
        document.getElementById('summary-evaluator').innerHTML = `<strong>Evaluador:</strong> ${evaluator.name} (${evaluator.up})`;
        document.getElementById('summary-evaluated').innerHTML = `<strong>Evaluado:</strong> ${evaluated.name} (${evaluated.up})`;
        document.getElementById('summary-indices').innerHTML = `IMC: ${imc || '--'} | PB: ${pb || '--'}cm | PT: ${pt || '--'}mm | Fuerza: ${hgs || '--'}kg | MQI: ${mqi || '--'}`;

        loadingOverlay.classList.remove('active');
        formScreen.classList.remove('active');
        successModal.classList.add('active');

    } catch (err) {
        console.error("Error al enviar registro:", err);
        loadingOverlay.classList.remove('active');
        alert("Hubo un error al enviar los datos. Por favor verifica tu conexión e intenta de nuevo.");
    }
}

// 5. Preparar formulario para el siguiente compañero (mantiene al evaluador)
function resetFormForNextPeer() {
    inputEvaluated.value = '';
    inputPeso.value = '';
    inputTalla.value = '';
    inputPB.value = '';
    inputCC.value = '';
    inputPT.value = '';
    inputHGS.value = '';

    dispIMC.innerText = '--';
    dispRCE.innerText = '--';
    dispCAMB.innerText = '--';
    dispMQI.innerText = '--';

    successModal.classList.remove('active');
    formScreen.classList.add('active');
    inputEvaluated.focus();
}

// 6. Renderizar historial de la sesión
function renderSessionHistory() {
    const container = document.getElementById('session-history-container');
    const list = document.getElementById('history-list');
    if (!container || !list) return;

    if (sessionRecords.length > 0) {
        container.style.display = 'block';
        list.innerHTML = '';
        sessionRecords.forEach((rec, idx) => {
            const item = document.createElement('div');
            item.className = 'history-card';
            item.innerHTML = `
                <div>
                    <div><strong>#${idx + 1} Evaluado:</strong> ${rec.evaluated}</div>
                    <div style="font-size: 0.76rem; color: var(--text-muted);">
                        IMC: ${rec.imc || '--'} | PT: ${rec.pt || '--'}mm | Fuerza: ${rec.hgs || '--'}kg | MQI: ${rec.mqi || '--'}
                    </div>
                </div>
                <div style="font-size: 0.75rem; color: var(--secondary-color); font-weight: bold;">
                    ✅ ${rec.time}
                </div>
            `;
            list.appendChild(item);
        });
    }
}
