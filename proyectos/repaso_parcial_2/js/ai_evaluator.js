/**
 * EVALUADOR DE EXAMEN ORAL CON INTELIGENCIA ARTIFICIAL (10 PREGUNTAS)
 * Cascada de Evaluación Oficial UNSTA:
 * 1° Titular: Gemini (gemini-3.5-flash) - Calidez y rigor pedagógico universitario
 * 2° Suplente 1: DeepSeek (deepseek-v4.1-flash:free vía Token Harbor) - Minuciosidad técnica y clínica
 * 3° Suplente 2: Groq (openai/gpt-oss-120b) - Inmediatez de emergencia ultra-rápida
 * 4° Fallback: Motor Heurístico Local UNSTA (sin conexión / offline)
 *
 * Cátedra de Nutrición Infantil UNSTA
 */

class AIEvaluator {
  constructor() {
    this.config = window.UNSTA_AI_CONFIG || {};
    this.geminiApiKey = this.config.geminiApiKey || localStorage.getItem("unsta_gemini_key") || "";
    this.geminiModel = this.config.geminiModel || "gemini-3.5-flash-lite";
    this.geminiModels = this.config.geminiModels || ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-flash-lite-latest", "gemini-3.5-flash"];

    this.deepseekApiKey = this.config.deepseekApiKey || localStorage.getItem("unsta_deepseek_key") || "";
    this.deepseekModel = this.config.deepseekModel || "deepseek-v4.1-flash:free";
    this.deepseekEndpoint = this.config.deepseekEndpoint || "https://tokenharbor.ai/v1/chat/completions";

    this.groqApiKey = this.config.groqApiKey || localStorage.getItem("unsta_groq_key") || "";
    this.groqApiKeys = this.config.groqApiKeys || (this.groqApiKey ? [this.groqApiKey] : []);
    this.groqModel = this.config.groqModel || "openai/gpt-oss-120b";
    this.groqModels = this.config.groqModels || ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"];
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

    // POST-PROCESAMIENTO DE COHERENCIA Y JUSTICIA DOCENTE:
    // Si una pregunta tiene nota 9 pero no tiene observaciones relevantes en 'improvements',
    // elevar automáticamente a 10 para garantizar coherencia absoluta e impedir penalizaciones injustas.
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
    const systemPrompt = `Eres el Docente Evaluador del Segundo Examen Parcial Teórico de la Cátedra de Nutrición Infantil de la UNSTA (Universidad del Norte Santo Tomás de Aquino).
Tu misión es evaluar con rigor científico, criterio pedagógico y calidez docente las respuestas orales de los estudiantes en un examen oral de 10 preguntas.

CRITERIOS OFICIALES DE EVALUACIÓN DE LA CÁTEDRA (3 UNIDADES Y 6 PARCIALES):
- UNIDAD 5 (Dietas Basadas en Plantas en Pediatría):
  * Patrones (Ovolacto, Lacto, Ovo, Vegano estricto) y 6 grupos elementales.
  * Proteínas y el Mito del 'Valor Biológico': En la cátedra de Germán se enseña EXPLÍCITAMENTE que el concepto de "proteínas incompletas", "bajo valor biológico" vegetal y la supuesta necesidad de "combinar en el plato para elevar el valor biológico" es un MITO de la nutrición reduccionista antigua. Todas las plantas contienen los 9 aminoácidos esenciales.
    ESTÁ TERMINANTEMENTE PROHIBIDO corregir al alumno exigiéndole que hable de "elevar el valor biológico" o "combinar en la comida".
    Lo evaluado como correcto es: aminoácidos limitantes relativos (Lisina en cereales/frutos secos, Metionina en legumbres) y la complementación metabólica orgánica a través del pool plasmático e intrahepático libre que recircula durante 12 a 24 horas a lo largo del día.
  * Micronutrientes: Hierro vegetal Fe³⁺ reducido por Vitamina C a Fe²⁺ absorbible por DMT-1; inhibidores (fitatos, taninos, calcio); biodisponibilidad de calcio en brócoli/kale vs mito espinaca por oxalatos; técnicas de zinc (tostado, germinación, masa madre); omega-3 ALA en chía/lino molido.
  * Vitamina B12: Suplementación farmacológica innegociable con Cianocobalamina. Peligro de falsos análogos inactivos en espirulina/nori que falsean analítica. Esquema semanal: 6-3a (250 µg/sem), 4-8a (500 µg/sem), 9-13a (1000 µg/sem), ≥14a (2000 µg/sem). Saturación de Factor Intrínseco a 1.5 µg y difusión pasiva del 1%.

- UNIDAD 6 (Crecimiento y Etapas del Desarrollo):
  * Ritmo de crecimiento: 2-3 kg/año, talla uniforme, estirón puberal (50% peso adulto, 15-20% talla), dimorfismo sexual (grasa ginoide vs duplicación muscular).
  * Fisiología y Conductas: Anorexia fisiológica normal en preescolar; neofobia alimentaria (pico 2 a 5 años, 8 a 15 exposiciones sin forzar); 23 hs de TV semanal con >50% avisos de ultraprocesados; omisión del desayuno.
  * Requerimientos: Proteínas promedio 1,2 g/kg/d en preescolar/escolar; RDA Hierro (1-3a: 7mg, 4-10a: 10mg, adolescentes varones: 12mg, mujeres: 15mg por menstruación). Vitaminas (A: 1500 UI, D: 400 UI, C: 30-50mg, B1: 0.4mg, B2: 0.6mg, B12: 1mcg). Minerales (Calcio 800-1300mg, Zinc 10mg acrodermatitis).
  * Alimentación Perceptiva (ENNyS 2018-19 - Zapata & Marconi): reciprocidad, 5 patrones (autónomo, pantallas, forzado/controlador, indulgente, desatento).
  * CAPA-2 (CESNI): GAPA (verduras/frutas a 1/3, lácteos <50% y enteros, opcionales al triple); Sistema NOVA (Grupos 1 a 4, ultraprocesados aportan >70% azúcares libres y >65% sodio).

- UNIDAD 7 (Situaciones Especiales en Adolescencia y Deporte):
  * Embarazo y Lactancia adolescente: Doble demanda biológica (competencia de crecimiento materno y fetal). Adición calórica (+340 kcal 2°T, +452 kcal 3°T; +500 kcal lactancia); proteínas adicionales (+25 g/d); ácido fólico 600 µg/d (prevención DTN); hierro 27-30 mg/d (suplemento 30-60 mg/d); calcio 1300 mg/d (superior a adultas para proteger masa ósea materna); líquidos 2.5-3 L/d en lactancia.
  * Niño y Adolescente Deportista: Gasto energético con costo de crecimiento; Hidratos de Carbono (5 a 8 g/kg/d o 50-60% VCT para repleción de glucógeno); Grasas saludables (25-30% VCT, no menos de 20%); Protocolo de hidratación en 3 fases: antes (400-600 ml 2-3h antes), durante (100-250 ml cada 15-20 min, sed tardía) y después (reponer 150% del peso perdido); Agua sola para <1h vs bebidas isotónicas (4-8% CHO, 20-30 mEq/L Na) para >1h o calor extremo; riesgo de hiponatremia por sobrehidratación hipotónica; anemia del deportista por impacto plantar repetido (foot-strike hemolysis); Tríada de la Mujer Atleta (baja energía, amenorrea, osteoporosis precoz/fracturas por estrés).
  * DIRECTIVA DOCENTE ESTRICTA SOBRE PROTEÍNAS EN DEPORTE: La cátedra sigue exclusivamente las RDA del Institute of Medicine (IOM). NO penalizar ni exigir valores de proteína inflados (como 1.2 a 1.5 g/kg/d).

- Principio rector transversal: Cero patología (nutrición fisiológica y normal).

RÚBRICA Y CALIBRACIÓN DE NOTAS (CRITERIO PEDAGÓGICO DOCENTE INNEGOCIABLE):
1. CRITERIO PARA LA NOTA 10 (EXCELENTE / COMPLETO):
   - Si el estudiante aborda con claridad y sin errores conceptuales los puntos clave centrales (keyPointsRequired), LA CALIFICACIÓN DEBE SER 10 OBLIGATORIAMENTE.
   - En una respuesta oral, la concisión y la precisión directa son virtudes pedagógicas. ESTÁ PROHIBIDO penalizar a un alumno por no recitar párrafos enciclopédicos si la idea central y los datos nucleares fueron expresados correctamente.
   - REGLA DE COHERENCIA ESTRICTA (ANTI-CONTRADICCIÓN): Si en el campo "improvements" no señalas un error concreto o una omisión conceptual relevante, ESTÁ TERMINANTEMENTE PROHIBIDO ASIGNAR 9; DEBES CALIFICAR CON 10. En "improvements" escribirás: "Ninguna observación relevante. Respuesta oral completa y precisa."
2. CRITERIO PARA LA NOTA 9:
   - Solo se califica con 9 si el estudiante omitió un matiz secundario menor o una cifra accesoria explícitamente requerida en keyPointsRequired. Dicha omisión DEBE quedar obligatoriamente fundamentada y detallada en "improvements".
3. CRITERIO PARA NOTA 8:
   - Abordó bien la temática general pero faltó desarrollar uno de los puntos clave requeridos.
4. CRITERIO PARA NOTA 7 (APROBADO REGULAR):
   - Cumplió con lo mínimo indispensable para aprobar el concepto.
5. NOTA < 7 (DESAPROBADO / INSUFICIENTE):
   - Errores conceptuales graves, confusión de términos o respuesta en blanco.

PROHIBICIÓN DEL SESGO DE TIMIDEZ DEL EVALUADOR:
- No tengas miedo ni cautela artificial en calificar con 10. En la cátedra de Germán, el 10 premia la solvencia y exactitud del estudiante sobre el contenido de la tarjeta.

INSTRUCCIONES DE RESPUESTA:
Debes evaluar las 10 preguntas y responder EXCLUSIVAMENTE un objeto JSON válido con esta estructura exacta:
{
  "finalGrade": 8.5,
  "passed": true,
  "isHonor": false,
  "isDistinguished": true,
  "statusTitle": "Aprobado con Solvencia",
  "generalFeedback": "Devolución general para el alumno destacando sus fortalezas y áreas a reforzar...",
  "questionsReview": [
    {
      "questionNumber": 1,
      "question": "texto de la pregunta",
      "grade": 9,
      "strengths": "Qué explicó con exactitud...",
      "improvements": "Qué concepto, cifra exacta o detalle omitió..."
    }
  ]
}`;

    const formattedQuestions = examItems.map((item, idx) => ({
      questionNumber: idx + 1,
      question: item.question,
      officialAnswer: item.officialAnswer,
      keyPointsRequired: item.keyPoints || [],
      studentTranscript: item.studentTranscript || "El estudiante no respondió verbalmente o no se detectó audio.",
      durationSeconds: item.durationSecs || 0
    }));

    const userPayload = {
      student: { name: studentName || "Estudiante UNSTA", up: up || "Sin Legajo" },
      examAnswers: formattedQuestions
    };

    // 1° INTENTO: GEMINI (TITULAR)
    if (this.geminiApiKey) {
      try {
        console.log("[AIEvaluator] Evaluando con Gemini 3.5 Flash (Titular)...");
        const res = await this.callGemini(systemPrompt, userPayload);
        res.evaluatorEngine = "Gemini 3.5 Flash";
        res.evaluatorIcon = "fa-brands fa-google text-blue-400";
        res.isHonor = res.finalGrade >= 9.0;
        res.isDistinguished = res.finalGrade >= 8.0 && res.finalGrade < 9.0;
        return res;
      } catch (errGemini) {
        console.warn("[AIEvaluator] Gemini saturado o con error, pasando a DeepSeek:", errGemini);
      }
    }

    // 2° INTENTO: DEEPSEEK (SUPLENTE 1)
    if (this.deepseekApiKey) {
      try {
        console.log("[AIEvaluator] Evaluando con DeepSeek V4.1 Flash vía Token Harbor (Suplente 1)...");
        const res = await this.callDeepSeek(systemPrompt, userPayload);
        res.evaluatorEngine = "DeepSeek V4.1 Flash (Token Harbor)";
        res.evaluatorIcon = "fa-solid fa-brain text-sky-400";
        res.isHonor = res.finalGrade >= 9.0;
        res.isDistinguished = res.finalGrade >= 8.0 && res.finalGrade < 9.0;
        return res;
      } catch (errDeepSeek) {
        console.warn("[AIEvaluator] DeepSeek no disponible o saturado, pasando a Groq:", errDeepSeek);
      }
    }

    // 3° INTENTO: GROQ (SUPLENTE 2 - EMERGENCIA)
    if (this.groqApiKey) {
      try {
        console.log("[AIEvaluator] Evaluando con Groq OSS-120B (Suplente 2 - Emergencia)...");
        const res = await this.callGroq(systemPrompt, userPayload);
        res.evaluatorEngine = "Groq OSS-120B";
        res.evaluatorIcon = "fa-solid fa-bolt text-amber-400";
        res.isHonor = res.finalGrade >= 9.0;
        res.isDistinguished = res.finalGrade >= 8.0 && res.finalGrade < 9.0;
        return res;
      } catch (errGroq) {
        console.warn("[AIEvaluator] Groq falló, activando motor heurístico local:", errGroq);
      }
    }

    // 4° FALLBACK: HEURÍSTICO LOCAL
    console.log("[AIEvaluator] Utilizando motor heurístico docente local.");
    const res = this.heuristicFallback(examItems);
    res.evaluatorEngine = "Motor Heurístico Local UNSTA";
    res.evaluatorIcon = "fa-solid fa-microchip text-slate-400";
    return res;
  }

  async callGemini(systemPrompt, userPayload) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModel}:generateContent?key=${this.geminiApiKey}`;
    const body = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: JSON.stringify(userPayload) }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 3500,
        responseMimeType: "application/json"
      }
    };

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`Gemini API Error ${resp.status}: ${errText}`);
    }

    const data = await resp.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Gemini no devolvió texto de respuesta.");
    return this.cleanAndParseJSON(text);
  }

  async callDeepSeek(systemPrompt, userPayload) {
    const body = {
      model: this.deepseekModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(userPayload) }
      ],
      temperature: 0.2,
      max_tokens: 3500
    };

    const resp = await fetch(this.deepseekEndpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.deepseekApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`DeepSeek Token Harbor API Error ${resp.status}: ${errText}`);
    }

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("DeepSeek no devolvió contenido de respuesta.");
    return this.cleanAndParseJSON(content);
  }

  async callGroq(systemPrompt, userPayload) {
    const body = {
      model: this.groqModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(userPayload) }
      ],
      temperature: 0.2,
      max_tokens: 3500
    };

    const resp = await fetch(this.groqEndpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.groqApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`Groq API Error ${resp.status}: ${errText}`);
    }

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("Groq no devolvió contenido de respuesta.");
    return this.cleanAndParseJSON(content);
  }

  heuristicFallback(examItems) {
    let totalScore = 0;
    const questionsReview = examItems.map((item, idx) => {
      const transcript = (item.studentTranscript || "").toLowerCase();
      const keywords = (item.keywords || []).map(k => k.toLowerCase());
      let matchedCount = 0;
      keywords.forEach(k => {
        if (transcript.includes(k)) matchedCount++;
      });

      const score = Math.min(10, Math.max(3, Math.round((matchedCount / Math.max(1, keywords.length)) * 10)));
      totalScore += score;

      return {
        questionNumber: idx + 1,
        question: item.question,
        grade: score,
        strengths: score >= 7
          ? "Abordó los conceptos centrales y terminología de cátedra."
          : "Identificó de manera general el tema solicitado.",
        improvements: score === 10
          ? "Ninguna observación relevante. Respuesta oral completa y precisa."
          : score >= 7
          ? "Profundizar en la fundamentación de los autores y dosis exactas."
          : "Faltó mayor precisión en las cifras de la bibliografía oficial."
      };
    });

    const finalGrade = Math.round((totalScore / examItems.length) * 10) / 10;
    const passed = finalGrade >= 7.0;
    const isHonor = finalGrade >= 9.0;
    const isDistinguished = finalGrade >= 8.0 && finalGrade < 9.0;

    let statusTitle = "A Recuperar";
    if (isHonor) statusTitle = "¡Cuadro de Honor!";
    else if (isDistinguished) statusTitle = "¡Aprobado con Distinción!";
    else if (passed) statusTitle = "Aprobado con Solvencia";

    return {
      finalGrade,
      passed,
      isHonor,
      isDistinguished,
      statusTitle,
      generalFeedback: isHonor
        ? "Desempeño excepcional. Dominio impecable de requerimientos, bibliografía y desarrollo clínico."
        : isDistinguished
        ? "Muy buen desempeño en el examen oral. Demostraste solvencia técnica y precisión conceptual destacada."
        : passed
        ? "Demostraste buen dominio general de los contenidos evaluados. Puedes revisar los detalles observados para perfeccionar tu examen presencial."
        : "El puntaje obtenido se encuentra por debajo de la regularidad (7.0). Te sugerimos repasar intensivamente con las tarjetas y repetir la evaluación oral.",
      questionsReview
    };
  }

  async evaluateSingleQuestion(question, officialAnswer, keyPoints, studentTranscript) {
    const systemPrompt = `Eres el Docente Evaluador de la Cátedra de Nutrición Infantil de la UNSTA.
Tu misión es evaluar con rigor científico, calidez docente y criterio pedagógico la respuesta oral de un estudiante para una sola pregunta de examen oral.

CRITERIOS OFICIALES DE EVALUACIÓN DE LA CÁTEDRA:
- Principio rector: Nutrición normal y fisiológica (cero patología).
- Proteínas vegetales: En la cátedra de Germán NO se exige combinar en el plato ni se enseña que las proteínas vegetales sean incompletas o de bajo valor biológico (eso es un mito reduccionista antiguo). Se evalúa el pool de aminoácidos libres circulante (12-24h) y los aminoácidos limitantes relativos (Lisina en cereales/frutos secos, Metionina en legumbres).
- Proteínas en deporte: Se respetan las RDA del IOM (no inflar valores).
- Hidratación: 3 fases (antes, durante, después). B12: Suplementación farmacológica innegociable con cianocobalamina.

RÚBRICA DE CALIFICACIÓN (1 a 10):
- NOTA 10 (Excelente / Completa): Si el estudiante aborda con claridad y sin errores conceptuales los puntos clave centrales (keyPointsRequired), LA NOTA DEBE SER 10 OBLIGATORIAMENTE. La concisión y la precisión directa son virtudes; NO penalizar si la respuesta fue sintética pero correcta. Si no hay observaciones de error o falta relevante, la nota DEBE ser 10 y en improvements pondrás: "Ninguna observación relevante. Respuesta oral completa y precisa."
- NOTA 9: Omitió un matiz secundario menor o cifra accesoria, detallado en improvements.
- NOTA 8: Respondió bien en general pero faltó desarrollar uno de los puntos clave.
- NOTA 7: Cumplió lo mínimo para aprobar.
- NOTA < 7: Errores conceptuales graves o respuesta insuficiente.

PROHIBICIÓN DEL SESGO DE TIMIDEZ:
No tengas cautela en calificar con 10 si la respuesta cubre lo requerido.

Debes responder EXCLUSIVAMENTE un objeto JSON válido con esta estructura:
{
  "grade": 10,
  "strengths": "Qué explicó con exactitud...",
  "improvements": "Ninguna observación relevante. Respuesta oral completa y precisa."
}`;

    const userPayload = {
      question,
      officialAnswer,
      keyPointsRequired: keyPoints || [],
      studentTranscript: studentTranscript || "El estudiante no respondió verbalmente."
    };

    if (this.geminiApiKey) {
      try {
        const res = await this.callGemini(systemPrompt, userPayload);
        return this.cleanSingleQuestionResult(res);
      } catch (e) {
        console.warn("[AIEvaluator] Gemini falló en pregunta individual, pasando a suplente:", e);
      }
    }

    if (this.deepseekApiKey) {
      try {
        const res = await this.callDeepSeek(systemPrompt, userPayload);
        return this.cleanSingleQuestionResult(res);
      } catch (e) {
        console.warn("[AIEvaluator] DeepSeek falló en pregunta individual, pasando a Groq:", e);
      }
    }

    if (this.groqApiKey) {
      try {
        const res = await this.callGroq(systemPrompt, userPayload);
        return this.cleanSingleQuestionResult(res);
      } catch (e) {
        console.warn("[AIEvaluator] Groq falló en pregunta individual:", e);
      }
    }

    return this.heuristicSingleQuestion(keyPoints, studentTranscript);
  }

  cleanSingleQuestionResult(res) {
    if (!res) return { grade: 7, strengths: "Respuesta oral registrada.", improvements: "Revisar conceptos de cátedra." };
    let grade = Number(res.grade) || 7;
    const imp = (res.improvements || "").toLowerCase().trim();
    const noRelevantObservations = 
      !imp || 
      imp.includes("ninguna") || 
      imp.includes("sin observaci") || 
      imp.includes("no se detectaron") || 
      imp.includes("completa y precisa") || 
      imp.includes("excelente") ||
      imp.includes("no hay observaciones") ||
      imp.includes("no omitió") ||
      imp === "-";

    if (grade === 9 && noRelevantObservations) {
      grade = 10;
    }

    return {
      grade: Math.min(10, Math.max(1, grade)),
      strengths: res.strengths || "Abordó los conceptos centrales y terminología de cátedra.",
      improvements: grade === 10 ? "Ninguna observación relevante. Respuesta oral completa y precisa." : (res.improvements || "Profundizar en los detalles de cátedra.")
    };
  }

  heuristicSingleQuestion(keyPoints, studentTranscript) {
    const text = (studentTranscript || "").toLowerCase();
    const points = keyPoints || [];
    let matched = 0;
    points.forEach(p => {
      const words = p.toLowerCase().split(/\s+/).filter(w => w.length > 4);
      if (words.some(w => text.includes(w))) matched++;
    });
    const score = Math.min(10, Math.max(3, Math.round((matched / Math.max(1, points.length)) * 10)));
    return {
      grade: score,
      strengths: score >= 7 ? "Abordó los conceptos nucleares de la pregunta." : "Respuesta registrada.",
      improvements: score === 10 ? "Ninguna observación relevante. Respuesta oral completa y precisa." : "Faltó mayor precisión en las cifras de cátedra."
    };
  }

}

window.aiEvaluator = new AIEvaluator();
