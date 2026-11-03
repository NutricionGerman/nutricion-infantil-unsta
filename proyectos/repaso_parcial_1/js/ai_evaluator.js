/**
 * EVALUADOR DE EXAMEN ORAL CON INTELIGENCIA ARTIFICIAL (1° PARCIAL TEÓRICO)
 * Cascada Silenciosa Oficial UNSTA:
 * 1° Titular: Gemini (gemini-3.5-flash) - Calidez y rigor pedagógico universitario
 * 2° Suplente 1: DeepSeek (deepseek-v4.1-flash:free vía Token Harbor) - Minuciosidad técnica y clínica
 * 3° Suplente 2: Groq (openai/gpt-oss-120b o llama-3.3-70b-versatile) - Inmediatez de emergencia ultra-rápida
 * 4° Fallback: Motor Heurístico Local UNSTA (sin conexión / offline)
 *
 * Cátedra de Nutrición Infantil UNSTA - Docentes: Lic. Mariana Mohedano & Lic. Germán
 */

class AIEvaluator {
  constructor() {
    this.config = window.UNSTA_AI_CONFIG || {};
    this.geminiApiKey = this.config.geminiApiKey || localStorage.getItem("unsta_gemini_key") || "";
    this.geminiModel = this.config.geminiModel || "gemini-3.5-flash-lite";
    this.geminiModels = this.config.geminiModels || ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-flash-lite-latest", "gemini-3.5-flash"];

    this.deepseekApiKey = this.config.deepseekApiKey || localStorage.getItem("unsta_deepseek_key") || "";
    this.deepseekApiKeys = this.config.deepseekApiKeys || (this.deepseekApiKey ? [this.deepseekApiKey] : []);
    this.deepseekModel = this.config.deepseekModel || "deepseek-v4.1-flash:free";
    this.deepseekEndpoint = this.config.deepseekEndpoint || "https://tokenharbor.ai/v1/chat/completions";

    this.groqApiKey = this.config.groqApiKey || localStorage.getItem("unsta_groq_key") || "";
    this.groqApiKeys = this.config.groqApiKeys || (this.groqApiKey ? [this.groqApiKey] : []);
    this.groqModel = this.config.groqModel || "openai/gpt-oss-120b";
    this.groqModels = this.config.groqModels || ["openai/gpt-oss-120b", "llama-3.3-70b-versatile", "qwen/qwen3.8-27b"];
    this.groqEndpoint = this.config.groqEndpoint || "https://api.groq.com/openai/v1/chat/completions";
  }

  cleanAndParseJSON(text) {
    if (typeof text !== "string") return text;
    let cleaned = text.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }
    const parsed = JSON.parse(cleaned);

    // POST-PROCESAMIENTO DE COHERENCIA Y JUSTICIA DOCENTE
    if (parsed && Array.isArray(parsed.questionsReview)) {
      let scoreModified = false;
      parsed.questionsReview.forEach(q => {
        const imp = (q.improvements || "").toLowerCase().trim();
        const noRelevantObservations = 
          !imp || 
          imp.includes("ninguna") || 
          imp.includes("sin observaci") || 
          imp.includes("no se detectaron") || 
          imp.includes("completa y precisa") || 
          imp.includes("excelente") ||
          imp.includes("no hay observaciones") ||
          imp.includes("no omitió") ||
          imp.includes("correcta") ||
          imp === "-";

        if (Number(q.grade) === 9 && noRelevantObservations) {
          console.log(`[AIEvaluator] Coherencia docente: Pregunta ${q.questionNumber} elevada de 9 a 10 por ausencia de observaciones relevantes.`);
          q.grade = 10;
          scoreModified = true;
        }
      });

      if (scoreModified) {
        const sum = parsed.questionsReview.reduce((acc, curr) => acc + (Number(curr.grade) || 0), 0);
        parsed.finalGrade = Math.round((sum / parsed.questionsReview.length) * 10) / 10;
        parsed.passed = parsed.finalGrade >= 7.0;
        parsed.isHonor = parsed.finalGrade >= 9.0;
        parsed.isDistinguished = parsed.finalGrade >= 8.0 && parsed.finalGrade < 9.0;
      }
    }

    return parsed;
  }

  async evaluateExam(studentName, up, examItems) {
    const systemPrompt = `Eres el Docente Evaluador del Primer Examen Parcial Teórico de la Cátedra de Nutrición Infantil de la UNSTA (Universidad del Norte Santo Tomás de Aquino), a cargo de los docentes Mariana Mohedano y Germán.
Tu misión es evaluar con rigor científico, criterio pedagógico y calidez universitaria las respuestas orales de los estudiantes.

CRITERIOS OFICIALES DE EVALUACIÓN DE CÁTEDRA (PRIMER PARCIAL - 5 UNIDADES):
1. UNIDAD 1 (Primeros 1000 Días, Recién Nacido y Prematuros):
   - Primeros 1000 Días: 270 días gestación + 365 días año 1 + 365 días año 2 = 1000 días. Ventana crítica de máxima plasticidad epigenética y neurodesarrollo.
   - Recién Nacido a Término: 37 a 41.6 semanas. Descenso fisiológico normal hasta 10% del peso en primeros 3-5 días (líquidos, orina, meconio), recuperación al día 10-14. Capacidad gástrica: 5-7 ml al día 1, 22-27 ml día 3, 45-60 ml día 7, 80-150 ml al mes.
   - Prematuro (RNPT): <37 semanas (Extremo <28 sem, Muy Prematuro 28-32 sem, Moderado/Tardío 32-37 sem; Bajo Peso <2500g, Muy Bajo Peso <1500g, Extremo Bajo Peso <1000g).
   - Edad Corregida: EC = Edad Cronológica - (40 - EG al nacer). Uso obligatorio hasta los 2 años.
   - Leche pretérmino: Mayor contenido de proteínas, sodio, lactoferrina, IgA; menor lactosa. Fortificadores (FLM) en <1500g o <32 sem para calcio, fósforo y proteínas (prevención de osteopenia).
   - RCI: Tipo I armónico (1°T, afecta peso, talla y PC), Tipo II (2°T, afecta peso y talla, preserva PC), Tipo III disarmónico (3°T, insuficiencia placentaria, afecta únicamente el peso).
   - Pesquisa Neonatal (Prueba del talón): Obligatoria por Ley 26.279; muestra de sangre del talón en papel de filtro tomada entre las 48 y 72 hs de vida previo al alta (no es de orina ni al mes de vida) para detección precoz de enfermedades genéticas y congénitas (hipotiroidismo congénito, fenilcetonuria, fibrosis quística, hiperplasia suprarrenal, galactosemia, déficit de biotinidasa).

2. UNIDAD 2 (Valoración Antropométrica y Requerimientos):
   - Transversal (puntual vs población de referencia) vs Longitudinal (curva/canal evolutivo en el tiempo y velocidad de crecimiento).
   - Curvas OMS 2006 obligatorias de 0 a 6 años (estándar normativo con lactancia). Curvas Argentinas SAP/Lejarraga a partir de los 6 años + IMC/E OMS.
   - Diagnóstico Z-score OMS: 0 a -1 normal; < -2 Z baja talla (T/E), bajo peso (P/E), emaciado (P/T e IMC/E); < -3 Z grado severo.
   - Percentilos Adiposidad IMC/E: Pc 10 a <85 normal; Pc ≥85 a <97 sobrepeso; Pc ≥97 obesidad.
   - Requerimientos FAO/OMS 2004: Descenso de kcal/kg/d por desaceleración del crecimiento (100-115 kcal/kg/d lactante menor -> ~80-82 kcal/kg/d a 1-2 años). Proteínas 1.5-1.8 g/kg/d en lactante -> 1.0-1.2 g/kg/d en preescolar (~13 g/d).

3. UNIDAD 3 (Fisiología de la Lactancia Materna):
   - Endocrinología: Prolactina (hipófisis anterior, síntesis de leche en alvéolos) vs Oxitocina (hipófisis posterior, contracción de células mioepiteliales y reflejo de eyección/apego).
   - Lactogénesis 3 (Galactopoyesis): Control autócrino local mediado por FIL (Factor Inhibidor de la Lactancia). El vaciamiento mamario completo estimula la síntesis.
   - Cronología de leches: Calostro (parto a día 3-4, 2-20 ml/toma, amarillo por betacarotenos, rico en proteínas, IgA, zinc, sodio, y colesterol laxante para meconio) -> Transición (día 4 al 15, 600-700 ml/d) -> Madura (día 15 en adelante, 70 kcal/100ml, relación caseína/suero 40/60 vs 80/20 vaca, biodisponibilidad de hierro del 50%).
   - Contraindicaciones: VIH, Galactosemia neonatal, quimioterapia/radiofármacos activos, drogadicción/alcoholismo severo.

4. UNIDAD 4 (Formulación Pediátrica y Soporte Enteral):
   - Definición de Fórmula Estándar: Fórmula nutricionalmente completa donde los tres macronutrientes se encuentran en FORMA COMPLEJA (enteros), requiriendo capacidad digestiva y absortiva intacta (a diferencia de fórmulas especiales modificadas para patologías).
   - Dilución Estándar: 3 MEDIDAS en 100 cc de agua para ambas fórmulas.
   - Medida al ras (nunca colmada): Fórmula de Inicio = 4,5 g (4.5 × 3 = 13,5% dilución) | Continuación = 5 g (5 × 3 = 15% dilución). Ambas aportan ~70 kcal / 100 ml.
   - Tomas recomendadas: <6 meses (7-8 tomas), >6 meses (4-5 tomas), 1 año (2-3 tomas).
   - Diluciones especiales: Concentrada 4 medidas (18-20%, ~100 kcal) y Tope 5 medidas para cardiopatías/nefropatías (restricción hídrica) o recuperación.
   - Fórmulas especiales: APLV 1° línea (extensamente hidrolizadas sin lactosa: Pepti Junior, Alfaré) y 2° línea/severa (aminoácidos libres: Neocate, Aminomed); fórmulas con TCM (Monogen, Kas 1000, hepatopatías, quilotórax); sin lactosa (diarreas con déficit transitorio de disacaridasas).
   - REGLA DE ORO AR: ¡Las Fórmulas Antirreflujo (AR) están TERMINANTEMENTE CONTRAINDICADAS por Sonda Nasogástrica (SNG) porque sus espesantes obstruyen la sonda!
   - Módulos calóricos: Maltodextrina (máx 10% oral / 7% sonda); Caseinato (5-10% oral / 3% sonda); Grasas/TCM (3-5% oral y sonda); Mono/disacáridos en yeyuno máx 6%.

5. UNIDAD 5 (Alimentación Complementaria Oportuna):
   - Inicio a los 6 meses: madurez renal (carga de solutos), gastrointestinal (mucosa y enzimas), neuromuscular (pérdida de reflejo de extrusión, sedestación) y agotamiento de depósitos neonatales de hierro/zinc.
   - Proporción calórica: 6-8m (60-70% leche / 30-40% alimentos); 9-11m (40-45% leche / 55-60% alimentos); 12-23m (30% leche / 70% alimentos).
   - Texturas (5 etapas): 1) Puré procesado/pisado (6m) -> 2) Desmenuzados/picados (7-8m) -> 3) Finger foods (8-9m) -> 4) Trozos en plato (9-10m) -> 5) Mesa familiar (12m).
   - Alimentos prohibidos / atención: Miel (>2 años o >1 año por BOTULISMO del lactante); Azúcar (>2 años); Sal (>1 año); Carne picada/molida (>5 AÑOS por SÍNDROME URÉMICO HEMOLÍTICO - SUH por toxina Shiga). Alimentos esféricos con riesgo de asfixia (uvas, aceitunas, cherrys, pochoclos, tutucas, frutos secos; deben cortarse longitudinalmente en 4 partes y frutos secos molidos).
   - BLW (Baby-Led Weaning): Autorregulado por el bebé en trozos blandos, sentado a 90° erguido, sin forzar, no dejarlo solo, diferenciar arcada fisiológica (reflejo de extrusión) de asfixia. Alimentación perceptiva (3 pasos: señales del niño, respuesta oportuna del cuidador, respuesta predecible).

PAUTA DE CALIFICACIÓN:
- Sé justo, constructivo y riguroso. Valora el conocimiento clínico exacto de las cifras y directivas de clase.
- Las respuestas orales de los alumnos provienen de transcripción de voz a texto (Whisper), por lo que pueden tener pequeñas imperfecciones fonéticas ("mililitros" por "ml", "calostro" pronunciado con leves variaciones, etc.). Evalúa el concepto de fondo, no la ortografía.
- Si el alumno responde de forma certera y no omite ningún punto crítico, asígnale nota 9 o 10. No inventes objeciones si la respuesta es correcta.
- La escala es de 1 a 10. Aprobado con ≥ 7.0. Cuadro de Honor con ≥ 9.0.

FORMATO DE SALIDA EXCLUSIVO EN JSON:
{
  "studentName": "${studentName}",
  "up": "${up}",
  "finalGrade": 8.5,
  "passed": true,
  "isHonor": false,
  "isDistinguished": true,
  "generalFeedback": "Devolución global docente cálida, destacando fortalezas y aspectos a repasar.",
  "questionsReview": [
    {
      "questionNumber": 1,
      "grade": 9,
      "strengths": "Aspectos destacados mencionados por el alumno.",
      "improvements": "Omisiones puntuales o conceptos que debió precisar (o 'Ninguna. Respuesta completa y precisa.' si estuvo impecable).",
      "teacherTip": "Consejo clínico o mnemotécnico directo para la práctica profesional."
    }
  ],
  "radarSkills": {
    "fisiologiaNeonatal": 9,
    "valoracionAntropometrica": 8,
    "lactanciaMaterna": 9,
    "formulacionPediatrica": 8,
    "alimentacionComplementaria": 9
  }
}`;

    const userPrompt = `A continuación se presentan las respuestas orales brindadas por el estudiante ${studentName} (UP/Legajo: ${up}):\n\n` +
      examItems.map((item, idx) => `
PREGUNTA ${idx + 1}:
Enunciado: "${item.question}"
Respuesta Oficial de Cátedra: "${item.officialAnswer}"
Criterios Clave Exigidos: ${JSON.stringify(item.keyPoints || [])}
Palabras Clave: ${JSON.stringify(item.keywords || [])}
Respuesta Oral del Estudiante (Transcripción): "${item.studentTranscript || '(Sin respuesta / silencio)'}"
`).join("\n---\n") +
      `\n\nEvalúa rigurosamente cada pregunta y responde ÚNICAMENTE con el bloque JSON solicitado.`;

    // CASCADA SILENCIOSA DE MODELOS
    // 1. Titular: Gemini 3.5 Flash / Flash Lite
    try {
      console.log("[AIEvaluator] Intentando evaluación con 1° Titular: Gemini...");
      const result = await this.evaluateWithGemini(systemPrompt, userPrompt);
      if (result) return this.cleanAndParseJSON(result);
    } catch (errGemini) {
      console.warn("[AIEvaluator] Titular Gemini falló o saturado:", errGemini);
    }

    // 2. Suplente 1: DeepSeek (Token Harbor)
    try {
      console.log("[AIEvaluator] Intentando evaluación con 2° Suplente: DeepSeek...");
      const result = await this.evaluateWithDeepSeek(systemPrompt, userPrompt);
      if (result) return this.cleanAndParseJSON(result);
    } catch (errDeepSeek) {
      console.warn("[AIEvaluator] Suplente DeepSeek falló:", errDeepSeek);
    }

    // 3. Suplente 2: Groq
    try {
      console.log("[AIEvaluator] Intentando evaluación con 3° Suplente: Groq...");
      const result = await this.evaluateWithGroq(systemPrompt, userPrompt);
      if (result) return this.cleanAndParseJSON(result);
    } catch (errGroq) {
      console.warn("[AIEvaluator] Suplente Groq falló:", errGroq);
    }

    // 4. Fallback Local Heurístico
    console.warn("[AIEvaluator] Todos los proveedores de IA fallaron. Activando Evaluador Heurístico Local.");
    return this.evaluateLocally(studentName, up, examItems);
  }

  async evaluateWithGemini(systemPrompt, userPrompt) {
    if (!this.geminiApiKey) throw new Error("No Gemini API Key");
    for (const model of this.geminiModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.geminiApiKey}`;
        const payload = {
          contents: [
            { role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        };
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status} en ${model}`);
        const data = await resp.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } catch (e) {
        console.warn(`[Gemini] Falló modelo ${model}:`, e);
      }
    }
    throw new Error("Todos los modelos de Gemini fallaron.");
  }

  async evaluateWithDeepSeek(systemPrompt, userPrompt) {
    const keys = this.deepseekApiKeys.length ? this.deepseekApiKeys : (this.deepseekApiKey ? [this.deepseekApiKey] : []);
    if (!keys.length) throw new Error("No DeepSeek API Key");

    for (const key of keys) {
      try {
        const resp = await fetch(this.deepseekEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`
          },
          body: JSON.stringify({
            model: this.deepseekModel,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: 0.2,
            response_format: { type: "json_object" }
          })
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) return content;
      } catch (e) {
        console.warn("[DeepSeek] Clave falló:", e);
      }
    }
    throw new Error("Pool DeepSeek agotado.");
  }

  async evaluateWithGroq(systemPrompt, userPrompt) {
    const keys = this.groqApiKeys.length ? this.groqApiKeys : (this.groqApiKey ? [this.groqApiKey] : []);
    if (!keys.length) throw new Error("No Groq API Key");

    for (const key of keys) {
      for (const model of this.groqModels) {
        try {
          const resp = await fetch(this.groqEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${key}`
            },
            body: JSON.stringify({
              model: model,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
              ],
              temperature: 0.2,
              response_format: { type: "json_object" }
            })
          });
          if (!resp.ok) continue;
          const data = await resp.json();
          const content = data?.choices?.[0]?.message?.content;
          if (content) return content;
        } catch (e) {
          console.warn(`[Groq] Modelo ${model} falló:`, e);
        }
      }
    }
    throw new Error("Pool Groq agotado.");
  }

  evaluateLocally(studentName, up, examItems) {
    const reviews = examItems.map((item, idx) => {
      const trans = (item.studentTranscript || "").toLowerCase();
      const keywords = item.keywords || [];
      let matches = 0;
      keywords.forEach(kw => {
        if (trans.includes(kw.toLowerCase())) matches++;
      });
      const ratio = keywords.length > 0 ? (matches / keywords.length) : 0.5;

      let grade = 4;
      if (ratio >= 0.7 || trans.length > 120) grade = 9;
      else if (ratio >= 0.4 || trans.length > 60) grade = 7;
      else if (ratio >= 0.2 || trans.length > 20) grade = 6;

      return {
        questionNumber: idx + 1,
        grade: grade,
        strengths: grade >= 7 ? "Mencionó términos clave de las diapositivas de clase." : "Aproximación general al tema.",
        improvements: grade >= 9 ? "Ninguna relevante. Buen dominio conceptual." : "Precisar cifras y diluciones exactas impartidas por la cátedra.",
        teacherTip: "Revisar la diapositiva oficial asociada a la tarjeta."
      };
    });

    const sum = reviews.reduce((acc, curr) => acc + curr.grade, 0);
    const finalGrade = Math.round((sum / reviews.length) * 10) / 10;

    return {
      studentName: studentName,
      up: up,
      finalGrade: finalGrade,
      passed: finalGrade >= 7.0,
      isHonor: finalGrade >= 9.0,
      isDistinguished: finalGrade >= 8.0 && finalGrade < 9.0,
      generalFeedback: finalGrade >= 7.0 
        ? "¡Excelente desempeño en el examen oral! Demuestras un manejo sólido de los conceptos de las diapositivas oficiales de la cátedra." 
        : "Has completado el examen oral. Te sugerimos repasar las tarjetas de fórmulas, diluciones y alimentación complementaria antes de rendir el parcial definitivo.",
      questionsReview: reviews,
      radarSkills: {
        fisiologiaNeonatal: finalGrade,
        valoracionAntropometrica: finalGrade,
        lactanciaMaterna: finalGrade,
        formulacionPediatrica: finalGrade,
        alimentacionComplementaria: finalGrade
      }
    };
  }
}

window.aiEvaluator = new AIEvaluator();
