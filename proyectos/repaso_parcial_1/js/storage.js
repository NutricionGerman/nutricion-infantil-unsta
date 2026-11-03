/**
 * GESTOR DE ALMACENAMIENTO Y PROGRESIÓN (LocalStorage)
 * Cátedra de Nutrición Infantil UNSTA - 1° Parcial Teórico
 * Módulos: 5 Unidades y 10 Parciales de Dominio
 */

const STORAGE_KEY = "unsta_repaso_parcial_1_state";

class StorageManager {
  constructor() {
    this.state = this.loadState();
  }

  getDefaultState() {
    return {
      studentName: "",
      up: "",
      xp: 0,
      currentLevel: 1, // 1 a 5
      cardStates: {}, // cardId: 'box1' (no sé), 'box2' (en repaso), 'box3' (dominada)
      partialGrades: {
        u1_p1: null,
        u1_p2: null,
        u2_p1: null,
        u2_p2: null,
        u3_p1: null,
        u3_p2: null,
        u4_p1: null,
        u4_p2: null,
        u5_p1: null,
        u5_p2: null,
        pract_1: null
      },
      partialXpAwarded: {
        u1_p1: 0,
        u1_p2: 0,
        u2_p1: 0,
        u2_p2: 0,
        u3_p1: 0,
        u3_p2: 0,
        u4_p1: 0,
        u4_p2: 0,
        u5_p1: 0,
        u5_p2: 0,
        pract_1: 0
      },
      honorBonusAwarded: false,
      examHistory: [],
      lastActiveDate: new Date().toISOString().split("T")[0],
      streakDays: 1
    };
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.checkStreak(parsed);
        return { ...this.getDefaultState(), ...parsed };
      }
    } catch (e) {
      console.warn("Error cargando LocalStorage:", e);
    }
    return this.getDefaultState();
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn("Error guardando LocalStorage:", e);
    }
  }

  checkStreak(state) {
    const today = new Date().toISOString().split("T")[0];
    if (state.lastActiveDate !== today) {
      const last = new Date(state.lastActiveDate);
      const curr = new Date(today);
      const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        state.streakDays = (state.streakDays || 1) + 1;
      } else if (diffDays > 1) {
        state.streakDays = 1;
      }
      state.lastActiveDate = today;
    }
  }

  addXP(amount) {
    this.state.xp = (this.state.xp || 0) + amount;
    this.checkLevelUnlocks();
    this.saveState();
    return this.state.xp;
  }

  checkLevelUnlocks() {
    let unlocked = 1;
    if (this.state.xp >= 600) unlocked = 5;
    else if (this.state.xp >= 400) unlocked = 4;
    else if (this.state.xp >= 250) unlocked = 3;
    else if (this.state.xp >= 100) unlocked = 2;

    if (unlocked > this.state.currentLevel) {
      this.state.currentLevel = unlocked;
      return true;
    }
    return false;
  }

  setStudentInfo(name, up) {
    this.state.studentName = name;
    this.state.up = up;
    this.saveState();
  }

  setCardState(cardId, box) {
    if (!this.state.cardStates) this.state.cardStates = {};
    this.state.cardStates[cardId] = box;
    this.saveState();
  }

  getCardState(cardId) {
    return (this.state.cardStates && this.state.cardStates[cardId]) || "box1";
  }

  saveExamAttempt(attempt) {
    if (!this.state.examHistory) this.state.examHistory = [];
    this.state.examHistory.push(attempt);

    // Actualizar mejor nota del parcial
    const pKey = attempt.partialKey;
    if (pKey && this.state.partialGrades) {
      const currBest = this.state.partialGrades[pKey] || 0;
      if (attempt.finalGrade > currBest) {
        this.state.partialGrades[pKey] = attempt.finalGrade;
      }
    }

    this.saveState();
  }

  getOverallAverage() {
    const keys = Object.keys(this.state.partialGrades);
    let sum = 0;
    let count = 0;
    keys.forEach(k => {
      const g = this.state.partialGrades[k];
      if (g !== null && !isNaN(g)) {
        sum += g;
        count++;
      }
    });
    return count > 0 ? (sum / count).toFixed(1) : "-";
  }

  getCompletedPartialsCount() {
    const keys = Object.keys(this.state.partialGrades);
    return keys.filter(k => this.state.partialGrades[k] !== null && this.state.partialGrades[k] >= 7.0).length;
  }

  resetAll() {
    this.state = this.getDefaultState();
    this.saveState();
  }
}

window.storageManager = new StorageManager();
