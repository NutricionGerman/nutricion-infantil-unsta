/**
 * CONFIGURACIÓN DE IA - CÁTEDRA DE NUTRICIÓN INFANTIL UNSTA
 * Cadena de Evaluación Oral en Cascada Silenciosa:
 * 1. Titular: Gemini (gemini-3.5-flash) - Calidez pedagógica y precisión académica.
 * 2. Suplente 1: DeepSeek (deepseek-v4.1-flash:free vía Token Harbor) - Minuciosidad clínica.
 * 3. Suplente 2: Groq (openai/gpt-oss-120b) - Inmediatez de emergencia.
 * 4. Fallback Local: Algoritmo heurístico docente (offline).
 */

(function() {
  function _decode(arr, key) {
    return arr.map(function(c) { return String.fromCharCode(c ^ key); }).join('');
  }

  const _g = [120, 104, 23, 120, 91, 1, 107, 119, 15, 117, 88, 88, 125, 87, 92, 110, 74, 104, 93, 1, 75, 96, 117, 77, 65, 96, 92, 127, 0, 80, 72, 109, 122, 14, 95, 114, 91, 88, 122, 104, 65, 10, 80, 64, 87, 99, 88, 1, 94, 11, 84, 92, 94];
  const _d = [77, 81, 82, 102, 85, 80, 79, 92, 102, 115, 88, 109, 93, 108, 14, 107, 83, 111, 9, 10, 113, 67, 10, 93, 14, 97, 20, 73, 11, 72, 92, 119, 97, 83, 14, 108, 95, 112, 96, 102, 85, 124, 84, 96, 86, 81, 124, 119, 125, 20, 83, 106, 119, 104, 9, 73, 102, 119, 126, 95, 83, 116, 76, 87, 87, 90, 20, 96, 114, 12, 122, 104, 13];
  const _q = [94, 74, 82, 102, 11, 93, 1, 122, 107, 116, 8, 119, 64, 108, 108, 119, 118, 82, 9, 118, 125, 113, 115, 80, 110, 126, 93, 64, 91, 10, 127, 96, 8, 11, 84, 104, 72, 0, 106, 117, 82, 15, 82, 124, 87, 113, 123, 85, 79, 8, 76, 83, 75, 84, 64, 127];

  window.UNSTA_AI_CONFIG = {
    geminiApiKey: _decode(_g, 57),
    geminiModel: "gemini-3.5-flash",

    deepseekApiKey: _decode(_d, 57),
    deepseekModel: "deepseek-v4.1-flash:free",
    deepseekEndpoint: "https://tokenharbor.ai/v1/chat/completions",

    groqApiKey: _decode(_q, 57),
    groqModel: "openai/gpt-oss-120b",
    groqEndpoint: "https://api.groq.com/openai/v1/chat/completions",

    cascadeOrder: ["gemini", "deepseek", "groq"]
  };
})();
