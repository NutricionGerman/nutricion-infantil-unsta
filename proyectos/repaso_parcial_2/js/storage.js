/**
 * GESTOR DE ALMACENAMIENTO Y PROGRESIÓN (LocalStorage)
 * Cátedra de Nutrición Infantil UNSTA - 2° Parcial Teórico
 */

const STORAGE_KEY = "unsta_repaso_parcial_2_state";

class StorageManager {
  constructor() {
    this.state = this.loadState();
  }

  getDefaultState() {
    return {
      studentName: "",
      up: "",
      xp: 0,
      currentLevel: 1, // 1 a 4
      cardStates: {}, // cardId: 'box1' (no sé), 'box2' (dudo), 'box3' (dominada)
      partialGrades: {
        u5_p1: null,
        u5_p2: null,
        u6_p1: null,
        u6_p2: null,
        u7_p1: null,
        u7_p2: null
      },
      partialXpAwarded: {
        u5_p1: 0,
        u5_p2: 0,
        u6_p1: 0,
        u6_p2: 0,
        u7_p1: 0,
        u7_p2: 0
      },
      honorBonusAwarded: false,
      examHistory: [],
      novaScore: 0,
      etapasScore: 0,
      triadaScore: 0,
      certificateCode: null,
      passedExam: false,
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
    this.state.xp += amount;
    this.checkLevelUnlocks();
    this.saveState();
    return this.state.xp;
  }

  checkLevelUnlocks() {
    // Niveles: 1 (0 XP), 2 (100 XP), 3 (250 XP), 4 (450 XP)
    let unlocked = 1;
    if (this.state.xp >= 450) unlocked = 4;
    else if (this.state.xp >= 250) unlocked = 3;
    else if (this.state.xp >= 100) unlocked = 2;

    if (unlocked > this.state.currentLevel) {
      this.state.currentLevel = unlocked;
      return true; // Hubo un nuevo nivel desbloqueado
    }
    return false;
  }

  setCardBox(cardId, box) {
    this.state.cardStates[cardId] = box; // 'box1', 'box2', 'box3'
    if (box === 'box3') {
      this.addXP(10); // +10 XP por dominar tarjeta
    } else if (box === 'box2') {
      this.addXP(3);
    }
    this.saveState();
  }

  getCardBox(cardId) {
    return this.state.cardStates[cardId] || 'box1';
  }

  getMasteredCardsCount() {
    return Object.values(this.state.cardStates).filter(b => b === 'box3').length;
  }

  recordPartialGrade(partialKey, grade, maxGrade = 10) {
    if (!this.state.partialGrades) this.state.partialGrades = {};
    if (!this.state.partialXpAwarded) this.state.partialXpAwarded = {};

    const roundedGrade = Math.round(grade * 10) / 10;
    const passed = roundedGrade >= 7.0;
    this.state.partialGrades[partialKey] = {
      grade: roundedGrade,
      maxGrade,
      passed,
      date: new Date().toLocaleDateString()
    };

    // Recompensa de XP oficial cátedra UNSTA:
    // Nota >= 9.0 -> 2 XP
    // Nota >= 8.5 -> 1 XP (o >= 8.0 según criterio cátedra)
    let moduleTargetXp = 0;
    if (roundedGrade >= 9.0) {
      moduleTargetXp = 2;
    } else if (roundedGrade >= 8.5) {
      moduleTargetXp = 1;
    }

    const previousModuleXp = Number(this.state.partialXpAwarded[partialKey]) || 0;
    const deltaXp = Math.max(0, moduleTargetXp - previousModuleXp);
    if (deltaXp > 0) {
      this.state.partialXpAwarded[partialKey] = moduleTargetXp;
      this.addXP(deltaXp);
    }

    // Cuadro de Honor (+10 XP) si completó los 6 parciales con promedio >= 9.0
    const summary = this.getOverallAverage();
    let honorXpAwarded = 0;
    if (summary.isHonor && !this.state.honorBonusAwarded) {
      honorXpAwarded = 10;
      this.state.honorBonusAwarded = true;
      this.addXP(10);
    }

    const totalXpGained = deltaXp + honorXpAwarded;
    this.saveState();

    return {
      summary,
      totalXpGained,
      deltaXp,
      moduleTargetXp,
      previousModuleXp,
      honorXpAwarded
    };
  }

  recordPartialSubmission(partialKey, submissionData) {
    if (!this.state.partialSubmissions) this.state.partialSubmissions = {};
    this.state.partialSubmissions[partialKey] = submissionData;
    this.saveState();
  }

  getOverallAverage() {
    const keys = ['u5_p1', 'u5_p2', 'u6_p1', 'u6_p2', 'u7_p1', 'u7_p2'];
    const grades = this.state.partialGrades || {};
    let completedCount = 0;
    let sum = 0;
    let allPassed = true;

    keys.forEach(k => {
      if (grades[k] && typeof grades[k].grade === 'number') {
        completedCount++;
        sum += grades[k].grade;
        if (grades[k].grade < 7.0) allPassed = false;
      } else {
        allPassed = false;
      }
    });

    const average = completedCount > 0 ? Math.round((sum / completedCount) * 10) / 10 : null;
    const isComplete = completedCount === 6;
    const isHonor = isComplete && allPassed && average >= 9.0;
    const isDistinguished = isComplete && allPassed && average >= 8.0 && average < 9.0;
    const isRegular = isComplete && allPassed && average >= 7.0 && average < 8.0;

    let distinctionLevel = 'none';
    if (isHonor) distinctionLevel = 'honor';
    else if (isDistinguished) distinctionLevel = 'distinguished';
    else if (isRegular) distinctionLevel = 'regular';

    return {
      average,
      completedCount,
      totalPartials: 6,
      isComplete,
      allPassed,
      isHonor,
      isDistinguished,
      isRegular,
      distinctionLevel,
      grades
    };
  }

  getStudentOverallStats() {
    return this.getOverallAverage();
  }

  recordExamResult(score, maxScore, timeTakenSecs) {
    const passed = score >= 7; // Aprueba con 7/10
    const examEntry = {
      id: "exam_" + Date.now(),
      date: new Date().toLocaleString(),
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      timeTakenSecs,
      passed
    };
    this.state.examHistory.unshift(examEntry);

    if (passed) {
      this.state.passedExam = true;
      this.addXP(score * 25); // Hasta +250 XP
      if (score >= 8 && !this.state.certificateCode) {
        this.generateCertificate();
      }
    } else {
      this.addXP(score * 10);
    }

    this.saveState();
    return examEntry;
  }

  generateCertificate() {
    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
    this.state.certificateCode = `UNSTA-NUTRI2P-${randomHex}`;
    this.saveState();
    return this.state.certificateCode;
  }

  setStudentInfo(name, up) {
    this.state.studentName = name.trim();
    this.state.up = up.trim();
    this.saveState();
  }

  calculateTotalReadiness(totalCardsCount = 33) {
    // Cálculo ponderado hacia el 100% de preparación:
    // 50% = Tarjetas dominadas (Box 3)
    // 30% = Mejor puntaje de Simulacro de Examen
    // 20% = Minijuegos NOVA y Etapas
    const mastered = this.getMasteredCardsCount();
    const cardFactor = Math.min(1, mastered / (totalCardsCount * 0.75)) * 50;

    const bestExam = this.state.examHistory.length > 0
      ? Math.max(...this.state.examHistory.map(e => (e.score / e.maxScore) * 100))
      : 0;
    const examFactor = (bestExam / 100) * 30;

    const miniFactor = Math.min(20, (this.state.novaScore + this.state.etapasScore) / 2);

    const total = Math.min(100, Math.round(cardFactor + examFactor + miniFactor));
    return total;
  }

  resetProgress() {
    if (confirm("¿Estás seguro de reiniciar todo tu progreso de estudio?")) {
      this.state = this.getDefaultState();
      this.saveState();
      window.location.reload();
    }
  }
}

window.storageManager = new StorageManager();
