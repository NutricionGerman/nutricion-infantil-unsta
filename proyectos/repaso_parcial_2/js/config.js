/**
 * CONFIGURACIÓN DE IA - CÁTEDRA DE NUTRICIÓN INFANTIL UNSTA
 * Cadena de Evaluación Oral en Cascada Silenciosa:
 * 1. Titular: Gemini (gemini-3.5-flash) - Calidez pedagógica y precisión académica.
 * 2. Suplente 1: DeepSeek (deepseek-v4.1-flash:free vía Token Harbor) - Minuciosidad clínica.
 * 3. Suplente 2: Groq (openai/gpt-oss-120b) - Inmediatez de emergencia.
 * 4. Pool de Transcripción Whisper en Paralelo: 3 Claves de Groq con Balanceo de Carga.
 * 5. Fallback Local: Algoritmo heurístico docente (offline).
 */

(function() {
  function _decode(arr, key) {
    return arr.map(function(c) { return String.fromCharCode(c ^ key); }).join('');
  }

  const _g = [120, 104, 23, 120, 91, 1, 107, 119, 15, 117, 88, 88, 125, 87, 92, 110, 74, 104, 93, 1, 75, 96, 117, 77, 65, 96, 92, 127, 0, 80, 72, 109, 122, 14, 95, 114, 91, 88, 122, 104, 65, 10, 80, 64, 87, 99, 88, 1, 94, 11, 84, 92, 94];
  const _d = [77, 81, 82, 102, 85, 80, 79, 92, 102, 115, 88, 109, 93, 108, 14, 107, 83, 111, 9, 10, 113, 67, 10, 93, 14, 97, 20, 73, 11, 72, 92, 119, 97, 83, 14, 108, 95, 112, 96, 102, 85, 124, 84, 96, 86, 81, 124, 119, 125, 20, 83, 106, 119, 104, 9, 73, 102, 119, 126, 95, 83, 116, 76, 87, 87, 90, 20, 96, 114, 12, 122, 104, 13];

  // 3 Claves de Groq Activas para Pool y Balanceo de Carga Multi-Alumno
  const _q1 = [94,74,82,102,85,119,74,126,81,97,99,108,82,80,119,115,67,99,73,77,119,113,95,97,110,126,93,64,91,10,127,96,97,120,73,14,118,87,75,109,86,118,12,11,90,99,10,126,1,84,111,82,74,67,125,92];
  const _q2 = [94,74,82,102,82,64,122,14,96,84,104,73,114,13,78,65,72,93,120,91,88,9,95,106,110,126,93,64,91,10,127,96,112,67,97,93,99,0,78,0,104,126,14,104,84,77,115,83,77,124,117,112,1,122,112,87];
  const _q3 = [94,74,82,102,105,81,118,78,72,116,91,86,106,76,119,94,67,99,77,1,92,87,64,105,110,126,93,64,91,10,127,96,122,8,14,111,87,107,124,8,1,9,75,105,122,113,13,84,106,73,67,104,75,77,127,107];

  const groqPool = [
    _decode(_q1, 57),
    _decode(_q2, 57),
    _decode(_q3, 57)
  ];

  window.UNSTA_AI_CONFIG = {
    geminiApiKey: _decode(_g, 57),
    geminiModel: "gemini-3.5-flash-lite",
    geminiModels: ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-flash-lite-latest", "gemini-3.5-flash"],

    deepseekApiKey: _decode(_d, 57),
    deepseekModel: "deepseek-v4.1-flash:free",
    deepseekEndpoint: "https://tokenharbor.ai/v1/chat/completions",

    groqApiKey: groqPool[0],
    groqApiKeys: groqPool,
    groqModel: "openai/gpt-oss-120b",
    groqModels: ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"],
    groqEndpoint: "https://api.groq.com/openai/v1/chat/completions",

    cascadeOrder: ["gemini", "groq", "deepseek"]
  };
})();
