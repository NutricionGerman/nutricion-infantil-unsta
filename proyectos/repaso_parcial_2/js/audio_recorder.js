/**
 * GRABADOR DE VOZ Y EVALUADOR ORAL (MediaRecorder + SpeechRecognition)
 * Nutrición Infantil UNSTA - Modo Examen Oral & Recuperación Activa
 * Compatible con iOS Safari (MP4/AAC) y Chrome/Android/Desktop (WebM/Opus)
 */

class AudioRecorderEngine {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.audioStream = null;
    this.isRecording = false;
    this.recordingStartTime = 0;
    this.recordingTimer = null;
    this.currentTranscript = "";
    this.recognition = null;
    this.latestAudioUrl = null;
    this.currentMimeType = "";

    this.initSpeechRecognition();
  }

  isSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  getBestMimeType() {
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/aac',
      'audio/ogg;codecs=opus',
      'audio/ogg'
    ];
    if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) {
      return '';
    }
    for (const t of candidates) {
      if (MediaRecorder.isTypeSupported(t)) {
        return t;
      }
    }
    return '';
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = "es-AR";
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
    }
  }

  async startRecording(onTick, onTranscript, onError) {
    if (this.isRecording) return;
    this.audioChunks = [];
    this.currentTranscript = "";

    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const bestMime = this.getBestMimeType();
      const options = bestMime ? { mimeType: bestMime } : {};
      
      this.mediaRecorder = new MediaRecorder(this.audioStream, options);
      this.currentMimeType = this.mediaRecorder.mimeType || bestMime || 'audio/webm';

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Chunks cada 1000ms para evitar pérdida de datos en iOS Safari al detener
      this.mediaRecorder.start(1000);
      this.isRecording = true;
      this.recordingStartTime = Date.now();

      // Temporizador de duración
      if (onTick) {
        this.recordingTimer = setInterval(() => {
          const elapsedSecs = Math.floor((Date.now() - this.recordingStartTime) / 1000);
          onTick(elapsedSecs);
        }, 1000);
      }

      // Reconocimiento de voz para transcripción en vivo
      if (this.recognition) {
        this.recognition.onresult = (event) => {
          let finalStr = "";
          let interimStr = "";
          for (let i = 0; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalStr += event.results[i][0].transcript + " ";
            } else {
              interimStr += event.results[i][0].transcript;
            }
          }
          this.currentTranscript = finalStr.trim();
          if (onTranscript) {
            onTranscript((this.currentTranscript + " " + interimStr).trim());
          }
        };

        this.recognition.onerror = (err) => {
          console.warn("Reconocimiento de voz no crítico:", err);
        };

        try {
          this.recognition.start();
        } catch (e) {
          console.warn("SpeechRecognition start error:", e);
        }
      }

    } catch (err) {
      this.isRecording = false;
      if (onError) onError(err);
      else alert("No se pudo acceder al micrófono. Por favor verifica los permisos.");
    }
  }

  stopRecording() {
    return new Promise((resolve) => {
      if (!this.isRecording || !this.mediaRecorder) {
        resolve(null);
        return;
      }

      if (this.recordingTimer) {
        clearInterval(this.recordingTimer);
        this.recordingTimer = null;
      }

      if (this.recognition) {
        try {
          this.recognition.stop();
        } catch (e) {}
      }

      const elapsedSecs = Math.floor((Date.now() - this.recordingStartTime) / 1000);

      this.mediaRecorder.onstop = async () => {
        // Usar el MIME real soportado por el navegador (audio/mp4 en iOS Safari, audio/webm en Chrome/Firefox)
        const mime = this.currentMimeType || (this.mediaRecorder && this.mediaRecorder.mimeType) || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: mime });

        if (this.latestAudioUrl) {
          URL.revokeObjectURL(this.latestAudioUrl);
        }
        this.latestAudioUrl = URL.createObjectURL(audioBlob);

        // Apagar tracks de audio
        if (this.audioStream) {
          this.audioStream.getTracks().forEach(track => track.stop());
          this.audioStream = null;
        }

        this.isRecording = false;

        // Transcripción de Máxima Precisión con Whisper (OpenAI / Groq)
        let finalTranscript = (this.currentTranscript || "").trim();
        try {
          const whisperResult = await this.transcribeWithWhisper(audioBlob);
          if (whisperResult && whisperResult.trim().length > 0) {
            finalTranscript = whisperResult.trim();
          }
        } catch (eW) {
          console.warn("[Whisper] Fallback a SpeechRecognition local:", eW);
        }

        resolve({
          audioBlob,
          audioUrl: this.latestAudioUrl,
          transcript: finalTranscript,
          durationSecs: elapsedSecs,
          mimeType: mime
        });
      };

      this.mediaRecorder.stop();
    });
  }

      async transcribeWithWhisper(audioBlob) {
    try {
      if (!audioBlob || audioBlob.size < 500) {
        console.warn("[Whisper] Audio demasiado corto o vacío.");
        return null;
      }

      const config = window.UNSTA_AI_CONFIG;
      const apiKeys = (config && config.groqApiKeys && config.groqApiKeys.length > 0)
        ? config.groqApiKeys
        : (config && config.groqApiKey ? [config.groqApiKey] : []);

      if (apiKeys.length === 0) {
        console.warn("[Whisper] No hay claves de Groq configuradas, usando fallback.");
        return null;
      }

      const mime = (audioBlob.type || this.currentMimeType || '').toLowerCase();
      let filename = 'respuesta_oral.webm';
      if (mime.includes('mp4') || mime.includes('m4a')) {
        filename = 'respuesta_oral.m4a';
      } else if (mime.includes('aac')) {
        filename = 'respuesta_oral.aac';
      } else if (mime.includes('ogg')) {
        filename = 'respuesta_oral.ogg';
      } else if (mime.includes('wav')) {
        filename = 'respuesta_oral.wav';
      }

      const modelsToTry = ['whisper-large-v3-turbo', 'whisper-large-v3'];

      if (typeof window._groqKeyIdx !== 'number') {
        window._groqKeyIdx = Math.floor(Math.random() * apiKeys.length);
      }

      for (let kStep = 0; kStep < apiKeys.length; kStep++) {
        const keyIndex = (window._groqKeyIdx + kStep) % apiKeys.length;
        const currentKey = apiKeys[keyIndex];

        for (const modelName of modelsToTry) {
          try {
            console.log(`[AudioRecorder] Whisper vía clave #${keyIndex + 1} (${modelName})...`);
            const formData = new FormData();
            formData.append('file', audioBlob, filename);
            formData.append('model', modelName);
            formData.append('language', 'es');
            formData.append('temperature', '0.0');
            formData.append('prompt', 'Examen oral de Nutrición Infantil UNSTA: preescolar, escolar, adolescente, embarazo, CAPA 2, Guías Alimentarias, alimentos ultraprocesados, vegetarianismo, vitamina B12, hierro, cinc, calcio, fitatos, biodisponibilidad, suplementación, deportista, hidratación, triada de la mujer atleta');

            const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
              method: 'POST',
              headers: {
                'Authorization': 'Bearer ' + currentKey
              },
              body: formData
            });

            if (response.ok) {
              const data = await response.json();
              if (data && data.text && data.text.trim().length > 0) {
                console.log(`[Whisper] Transcripción exitosa con clave #${keyIndex + 1} (${modelName}):`, data.text);
                window._groqKeyIdx = (keyIndex + 1) % apiKeys.length;
                return data.text.trim();
              }
            } else {
              const errText = await response.text();
              console.warn(`[Whisper] Error ${response.status} en clave #${keyIndex + 1} (${modelName}):`, errText);
              if (response.status === 401 || response.status === 429) {
                break; // Probar siguiente clave
              }
            }
          } catch (eFetch) {
            console.warn(`[Whisper] Error de red en clave #${keyIndex + 1}:`, eFetch);
          }
        }
      }

      return null;
    } catch (e) {
      console.warn("[Whisper] Error general conectando con Whisper:", e);
      return null;
    }
  }

  evaluateKeywords(transcript, card) {
    if (!card || !card.keywords) {
      return { matched: [], missing: [], scorePercent: 100 };
    }

    const cleanText = transcript.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // quita tildes

    const matched = [];
    const missing = [];

    // Evaluamos los puntos clave
    if (card.keyPoints) {
      card.keyPoints.forEach(point => {
        const pointClean = point.toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const words = pointClean.split(/\s+/).filter(w => w.length > 4);
        const matchesWord = words.some(w => cleanText.includes(w));
        if (matchesWord) {
          matched.push(point);
        } else {
          missing.push(point);
        }
      });
    }

    const total = (card.keyPoints ? card.keyPoints.length : 1);
    const scorePercent = Math.min(100, Math.round((matched.length / total) * 100));

    return {
      matched,
      missing,
      scorePercent,
      transcript
    };
  }
}

window.audioRecorderEngine = new AudioRecorderEngine();
