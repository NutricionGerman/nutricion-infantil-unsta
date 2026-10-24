/**
 * MOTOR DE AUDIO Y VOZ NATIVO (Web Speech API)
 * Nutrición Infantil UNSTA - Modo Audio-Podcast y Lectura en Voz Alta
 */

class AudioEngine {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.voice = null;
    this.rate = 1.0;
    this.isSpeaking = false;
    this.isPodcastRunning = false;
    this.podcastIndex = 0;
    this.podcastTimer = null;
    this.onStateChange = null;
    this.onPodcastTick = null;

    if (this.synth) {
      this.initVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  isSupported() {
    return 'speechSynthesis' in window;
  }

  initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Priorizamos voces en español
    const preferredLang = ['es-AR', 'es-US', 'es-MX', 'es-ES', 'es'];
    for (const lang of preferredLang) {
      const found = voices.find(v => v.lang.startsWith(lang));
      if (found) {
        this.voice = found;
        break;
      }
    }
    if (!this.voice && voices.length > 0) {
      this.voice = voices.find(v => v.lang.toLowerCase().includes('es')) || voices[0];
    }
  }

  speak(text, onStart, onEnd) {
    if (!this.synth) {
      alert("Tu navegador no soporta síntesis de voz en esta plataforma.");
      return;
    }

    this.stop();

    // Limpiamos formato markdown
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (this.voice) utterance.voice = this.voice;
    utterance.rate = this.rate;
    utterance.pitch = 1.0;
    utterance.lang = this.voice ? this.voice.lang : 'es-AR';

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
      if (this.onStateChange) this.onStateChange(true);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
      if (this.onStateChange) this.onStateChange(false);
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
      if (this.onStateChange) this.onStateChange(false);
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (!this.synth) return;
    this.isSpeaking = false;
    if (this.synth.speaking || this.synth.pending) {
      this.synth.cancel();
    }
    if (this.onStateChange) this.onStateChange(false);
  }

  setRate(newRate) {
    this.rate = Math.max(0.7, Math.min(1.5, newRate));
  }

  /**
   * MODO AUDIO-PODCAST MANOS LIBRES:
   * 1. Lee la pregunta.
   * 2. Cuenta 5 segundos para que el alumno intente responder mentalmente.
   * 3. Lee la respuesta oficial de cátedra.
   * 4. Pausa de 2 segundos y pasa a la siguiente tarjeta.
   */
  startPodcast(cards, startIndex = 0, onCardChange, onFinish) {
    if (!cards || cards.length === 0) return;
    this.isPodcastRunning = true;
    this.podcastCards = cards;
    this.podcastIndex = startIndex;
    this.onPodcastCardChange = onCardChange;
    this.onPodcastFinish = onFinish;

    this.playPodcastStep();
  }

  stopPodcast() {
    this.isPodcastRunning = false;
    if (this.podcastTimer) {
      clearInterval(this.podcastTimer);
      this.podcastTimer = null;
    }
    this.stop();
  }

  playPodcastStep() {
    if (!this.isPodcastRunning) return;

    if (this.podcastIndex >= this.podcastCards.length) {
      this.isPodcastRunning = false;
      this.speak("Has completado este mazo de repaso. ¡Excelente trabajo!", null, () => {
        if (this.onPodcastFinish) this.onPodcastFinish();
      });
      return;
    }

    const card = this.podcastCards[this.podcastIndex];
    if (this.onPodcastCardChange) {
      this.onPodcastCardChange(card, this.podcastIndex, "question");
    }

    // Paso 1: Leer la pregunta
    const questionSpeech = `Pregunta número ${this.podcastIndex + 1}: ${card.question}`;
    this.speak(questionSpeech, null, () => {
      if (!this.isPodcastRunning) return;

      // Paso 2: Cuenta regresiva de 5 segundos de silencio para pensar
      let secondsLeft = 5;
      if (this.onPodcastTick) this.onPodcastTick(secondsLeft);

      this.podcastTimer = setInterval(() => {
        if (!this.isPodcastRunning) {
          clearInterval(this.podcastTimer);
          return;
        }
        secondsLeft--;
        if (this.onPodcastTick) this.onPodcastTick(secondsLeft);

        if (secondsLeft <= 0) {
          clearInterval(this.podcastTimer);
          this.podcastTimer = null;

          // Paso 3: Revelar y leer la respuesta
          if (this.onPodcastCardChange) {
            this.onPodcastCardChange(card, this.podcastIndex, "answer");
          }
          const answerSpeech = `Respuesta oficial: ${card.answer}`;
          this.speak(answerSpeech, null, () => {
            if (!this.isPodcastRunning) return;

            // Paso 4: Pequeña pausa de 2.5 seg antes de la siguiente
            setTimeout(() => {
              if (!this.isPodcastRunning) return;
              this.podcastIndex++;
              this.playPodcastStep();
            }, 2500);
          });
        }
      }, 1000);
    });
  }
}

window.audioEngine = new AudioEngine();
