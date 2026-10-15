/**
 * MOTOR DEL TORNEO DE SUPERVIVENCIA ANTROPOMÉTRICA
 * Cátedra de Nutrición Infantil - UNSTA
 * Eliminación Simple: 100 Jugadores -> 18 Grupos -> 7 Días -> 1 Campeón Supremo
 */

// --- 1. BANCO OFICIAL DE LOS 15 JUEGOS (2 POR DÍA / 3 EN LA GRAN FINAL) ---
const TOURNAMENT_DAYS_GAMES = {
  1: {
    day: 1,
    title: 'Día 1: Hitos Óseos Superiores (Ronda de 100)',
    desc: 'Localización anatómica directa de los dos relieves óseos de referencia para el miembro superior.',
    category: 'ANTROPOMETRÍA BÁSICA',
    games: [
      {
        id: 'acromion',
        name: 'Punto Acromial (Acromion)',
        questionTitle: 'Punto Acromial (Acromion)',
        category: 'Extremidad Superior',
        mode: 'single_point',
        type: 'acromion',
        desc: 'Borde superior y más externo del acromion de la escápula.',
        clinicalUse: 'Punto de partida proximal obligatorio para medir la longitud del brazo con cinta métrica.',
        toleranceRadius: 14,
        targets: [
          { side: 'Hombro Derecho', x: 113.4, y: 154.8 },
          { side: 'Hombro Izquierdo', x: 293.2, y: 157.4 }
        ]
      },
      {
        id: 'olecranon',
        name: 'Olécranon (Codo a 90°)',
        questionTitle: 'Olécranon (Codo a 90°)',
        category: 'Extremidad Superior',
        mode: 'single_point',
        type: 'olecranon',
        desc: 'Vértice posterior del olécranon (saliente del cúbito en el codo flexionado a 90°).',
        clinicalUse: 'Hito distal para delimitar la distancia acromion-olécranon.',
        toleranceRadius: 14,
        targets: [
          { side: 'Codo Derecho', x: 70.9, y: 296.5 },
          { side: 'Codo Izquierdo', x: 320.6, y: 298.0 }
        ]
      }
    ]
  },
  2: {
    day: 2,
    title: 'Día 2: Marca Mesobraquial y Cintura CDC (Ronda de 50)',
    desc: 'Cálculo de punto medio al 50% y localización de la cresta ilíaca para perímetro de cintura CDC.',
    category: 'DERIVACIÓN Y TRONCO',
    games: [
      {
        id: 'mesobraquial',
        name: 'Marca Mesobraquial (Punto Medio)',
        questionTitle: 'Marca Mesobraquial (Punto Medio)',
        category: 'Extremidad Superior',
        mode: 'two_points_midpoint',
        type: 'arm',
        subType: 'arm',
        desc: 'Marca los 2 extremos (Acromion y Olécranon) en cualquier orden para proyectar el 50%.',
        clinicalUse: 'Nivel donde se mide Perímetro Braquial y Pliegue Tricipital (Frisancho).',
        toleranceRadius: 15,
        targets: [
          {
            side: 'Brazo Derecho',
            topRef: { name: 'Acromion', x: 113.4, y: 154.8 },
            bottomRef: { name: 'Olécranon', x: 70.9, y: 296.5 },
            midpoint: { x: 92.2, y: 225.7 }
          },
          {
            side: 'Brazo Izquierdo',
            topRef: { name: 'Acromion', x: 293.2, y: 157.4 },
            bottomRef: { name: 'Olécranon', x: 320.6, y: 298.0 },
            midpoint: { x: 306.9, y: 227.7 }
          }
        ]
      },
      {
        id: 'cintura_cdc',
        name: 'Circunferencia de Cintura: Protocolo CDC',
        questionTitle: 'Cintura: Protocolo CDC (Cresta Ilíaca)',
        category: 'Tronco / Cintura',
        mode: 'waist_cdc',
        type: 'waist_cdc',
        desc: 'Marca la cresta ilíaca para proyectar la cinta métrica horizontal (CDC).',
        clinicalUse: 'Protocolo estándar CDC para percentilar riesgo cardiometabólico.',
        targetY: 330.0,
        torsoMinX: 135,
        torsoMaxX: 275,
        toleranceY: 6,
        referenceTargets: [
          { side: 'Cresta Derecha', x: 144.2, y: 332.1 },
          { side: 'Cresta Izquierda', x: 253.4, y: 326.9 }
        ]
      }
    ]
  },
  3: {
    day: 3,
    title: 'Día 3: Cintura OMS y Relieve Escapular (Ronda de 25)',
    desc: 'Localización del espacio intercosto-ilíaco y borde inferior de la escápula.',
    category: 'CLÍNICA DE TRONCO',
    games: [
      {
        id: 'cintura_oms',
        name: 'Circunferencia de Cintura: Protocolo OMS',
        questionTitle: 'Cintura: Protocolo OMS (2 Puntos de Referencia)',
        category: 'Tronco / Cintura',
        mode: 'two_points_midpoint',
        type: 'waist_oms',
        subType: 'waist_oms',
        desc: 'Marca la 10ª costilla y cresta ilíaca en cualquier orden para proyectar el punto medio OMS.',
        clinicalUse: 'Cintura natural según la OMS (aprox. 2.5 cm sobre la cresta ilíaca).',
        targetY: 310.2,
        torsoMinX: 135,
        torsoMaxX: 275,
        toleranceY: 6,
        targets: [
          {
            side: 'Flanco Derecho',
            topRef: { name: '10ª Costilla', x: 160.0, y: 297.4 },
            bottomRef: { name: 'Cresta Ilíaca', x: 144.2, y: 332.1 },
            midpoint: { x: 141.7, y: 310.2 }
          },
          {
            side: 'Flanco Izquierdo',
            topRef: { name: '10ª Costilla', x: 241.8, y: 297.4 },
            bottomRef: { name: 'Cresta Ilíaca', x: 253.4, y: 326.9 },
            midpoint: { x: 247.6, y: 310.2 }
          }
        ]
      },
      {
        id: 'subescapular',
        name: 'Punto Subescapular (PSE)',
        questionTitle: 'Punto Subescapular (PSE)',
        category: 'Tronco / Escápula',
        mode: 'single_point',
        type: 'subescapular',
        desc: 'Ángulo inferior y más bajo de la escápula.',
        clinicalUse: 'Hito anatómico de referencia para la toma del Pliegue Subescapular a 45° oblicuo.',
        toleranceRadius: 14,
        targets: [
          { side: 'Escápula Derecha', x: 158.5, y: 236.4 },
          { side: 'Escápula Izquierda', x: 247.5, y: 236.4 }
        ]
      }
    ]
  },
  4: {
    day: 4,
    title: 'Día 4: Pliegues Cutáneos y Riesgo Cardiometabólico (Cuartos de Final)',
    desc: 'Evaluación del compartimento graso y punto de corte de Relación Cintura-Estatura.',
    category: 'COMPOSICIÓN Y RIESGO',
    games: [
      {
        id: 'pct_relief',
        name: 'Toma del Pliegue Tricipital (PCT)',
        questionTitle: 'Pliegue Cutáneo Tricipital (PCT)',
        category: 'Composición Corporal',
        mode: 'single_point',
        type: 'pct_relief',
        desc: 'Cara posterior del brazo a nivel de la marca mesobraquial media.',
        clinicalUse: 'Estimación de la reserva calórica y masa grasa en tablas de Frisancho.',
        toleranceRadius: 15,
        targets: [
          { side: 'Tríceps Derecho', x: 80.5, y: 225.7 },
          { side: 'Tríceps Izquierdo', x: 318.5, y: 227.7 }
        ]
      },
      {
        id: 'rce_risk',
        name: 'Riesgo Cardiometabólico: Punto de Corte RCE',
        questionTitle: 'Riesgo Cardiometabólico: RCE',
        category: 'Riesgo Cardiometabólico',
        mode: 'trivia_choice',
        type: 'trivia_choice',
        desc: 'Un niño de 10 años tiene 72 cm de cintura y 140 cm de estatura. ¿Presenta riesgo?',
        clinicalUse: 'El índice Cintura/Estatura (RCE) >= 0.5 define adiposidad abdominal y riesgo metabólico.',
        options: [
          { text: 'Sí, RCE = 0.51 (Riesgo cardiovascular aumentado >= 0.5)', correct: true },
          { text: 'No, el corte de riesgo en pediatría es RCE >= 0.65', correct: false },
          { text: 'No, solo se evalúa con el IMC para la edad', correct: false },
          { text: 'Sí, pero solo si supera el percentil 97 de peso', correct: false }
        ]
      }
    ]
  },
  5: {
    day: 5,
    title: 'Día 5: Nutrición Pediátrica en Vegetarianismo (Semifinales)',
    desc: 'Micronutrientes críticos y complementación de aminoácidos esenciales.',
    category: 'VEGETARIANISMO PEDIÁTRICO',
    games: [
      {
        id: 'b12_mandatory',
        name: 'Suplementación Crítica Obligatoria',
        questionTitle: 'Suplementación Crítica Obligatoria',
        category: 'Vegetarianismo Pediátrico',
        mode: 'trivia_choice',
        type: 'trivia_choice',
        desc: '¿Qué micronutriente debe suplementarse obligatoriamente de por vida en una dieta vegana o vegetariana en pediatría?',
        clinicalUse: 'Previene anemia megaloblástica y secuelas neurológicas irreversibles del desarrollo.',
        options: [
          { text: 'Vitamina B12 (Cianocobalamina)', correct: true },
          { text: 'Vitamina C (Ácido ascórbico)', correct: false },
          { text: 'Vitamina B1 (Tiamina)', correct: false },
          { text: 'Ácido Fólico exclusivamente', correct: false }
        ]
      },
      {
        id: 'protein_complementation',
        name: 'Pareja de Complementación Proteica',
        questionTitle: 'Complementación Proteica',
        category: 'Vegetarianismo Pediátrico',
        mode: 'trivia_choice',
        type: 'trivia_choice',
        desc: '¿Cuál es la combinación clásica que compensa mutuamente la lisina (limitante en cereales) y la metionina (limitante en legumbres)?',
        clinicalUse: 'Permite alcanzar un cómputo químico del 100% (proteína de alto valor biológico de origen vegetal).',
        options: [
          { text: 'Lentejas (legumbre) + Arroz integral (cereal)', correct: true },
          { text: 'Avena con leche de almendras', correct: false },
          { text: 'Espinaca con acelga salteada', correct: false },
          { text: 'Manzana con nueces', correct: false }
        ]
      }
    ]
  },
  6: {
    day: 6,
    title: 'Día 6: Biodisponibilidad de Hierro y Kiosco Saludable (Final Triangular)',
    desc: 'Absorción de hierro no hemínico y pautas de alimentación escolar.',
    category: 'EDAD ESCOLAR Y NUTRIENTES',
    games: [
      {
        id: 'iron_enhancer',
        name: 'Facilitador de Absorción del Hierro',
        questionTitle: 'Biodisponibilidad del Hierro',
        category: 'Nutrientes y Biodisponibilidad',
        mode: 'trivia_choice',
        type: 'trivia_choice',
        desc: 'Para maximizar la absorción del hierro no hemínico de las legumbres en un niño, ¿qué debe acompañar la comida?',
        clinicalUse: 'El ácido ascórbico reduce el hierro férrico a ferroso aumentando su solubilidad.',
        options: [
          { text: 'Cítricos o fuentes de Vitamina C (ej. jugo de naranja o limón)', correct: true },
          { text: 'Infusión de té negro o café (taninos)', correct: false },
          { text: 'Suplemento de calcio en la misma comida', correct: false },
          { text: 'Alimentos con alto contenido de salvado y fitatos', correct: false }
        ]
      },
      {
        id: 'school_snack',
        name: 'Colación para el Kiosco Saludable',
        questionTitle: 'Colación Kiosco Saludable',
        category: 'Kiosco Saludable',
        mode: 'trivia_choice',
        type: 'trivia_choice',
        desc: 'Según la Ley de Promoción de la Alimentación Saludable, ¿cuál de estas opciones califica como colación recomendada para el recreo?',
        clinicalUse: 'Fomenta el consumo de alimentos frescos sin sellos de advertencia nutricional.',
        options: [
          { text: 'Fruta fresca de estación trozada o mix de frutos secos sin sal', correct: true },
          { text: 'Barrita de cereal comercial con baño de repostería', correct: false },
          { text: 'Jugo envasado en cartón con 0% grasas pero 25g de azúcar', correct: false },
          { text: 'Galletitas dulces rellenas reducidas en sodio', correct: false }
        ]
      }
    ]
  },
  7: {
    day: 7,
    title: 'Día 7: La Gran Final — Batalla de Campeones (Duelo Supremo)',
    desc: 'Los 3 desafíos integradores para coronar al Gran Maestro de la Cátedra.',
    category: 'GRAN FINAL SUPREMA',
    games: [
      {
        id: 'final_meso',
        name: 'Desafío 1: Marca Mesobraquial Quirúrgica',
        questionTitle: 'Desafío 1: Marca Mesobraquial',
        category: 'Gran Final - Brazo',
        mode: 'two_points_midpoint',
        type: 'arm',
        subType: 'arm',
        desc: 'Marca Acromion y Olécranon con máxima precisión contra reloj.',
        clinicalUse: 'Determinación clave de la antropometría de miembro superior.',
        toleranceRadius: 10,
        targets: [
          {
            side: 'Brazo Derecho',
            topRef: { name: 'Acromion', x: 113.4, y: 154.8 },
            bottomRef: { name: 'Olécranon', x: 70.9, y: 296.5 },
            midpoint: { x: 92.2, y: 225.7 }
          },
          {
            side: 'Brazo Izquierdo',
            topRef: { name: 'Acromion', x: 293.2, y: 157.4 },
            bottomRef: { name: 'Olécranon', x: 320.6, y: 298.0 },
            midpoint: { x: 306.9, y: 227.7 }
          }
        ]
      },
      {
        id: 'final_oms',
        name: 'Desafío 2: Cintura OMS Milimétrica',
        questionTitle: 'Desafío 2: Cintura OMS',
        category: 'Gran Final - Tronco',
        mode: 'two_points_midpoint',
        type: 'waist_oms',
        subType: 'waist_oms',
        desc: 'Marca la 10ª costilla y cresta ilíaca para trazar el plano de cintura OMS.',
        clinicalUse: 'Perímetro de cintura en el punto medio intercosto-ilíaco.',
        targetY: 310.2,
        torsoMinX: 135,
        torsoMaxX: 275,
        toleranceY: 5,
        targets: [
          {
            side: 'Flanco Derecho',
            topRef: { name: '10ª Costilla', x: 160.0, y: 297.4 },
            bottomRef: { name: 'Cresta Ilíaca', x: 144.2, y: 332.1 },
            midpoint: { x: 141.7, y: 310.2 }
          },
          {
            side: 'Flanco Izquierdo',
            topRef: { name: '10ª Costilla', x: 241.8, y: 297.4 },
            bottomRef: { name: 'Cresta Ilíaca', x: 253.4, y: 326.9 },
            midpoint: { x: 247.6, y: 310.2 }
          }
        ]
      },
      {
        id: 'final_frisancho',
        name: 'Desafío 3: Área Muscular del Brazo (AMB)',
        questionTitle: 'Desafío 3: Área Muscular (AMB)',
        category: 'Gran Final - Frisancho',
        mode: 'trivia_choice',
        type: 'trivia_choice',
        desc: '¿Qué fórmula clínica de Frisancho estima el compartimento proteico muscular corrigiendo el hueso?',
        clinicalUse: 'Área Muscular del Brazo corregida (AMBc) para evaluar desnutrición o sarcopenia.',
        options: [
          { text: 'AMB = [PB (cm) - (π x PCT (cm))]² / (4π) - 6.5 (varones) o 5.0 (mujeres)', correct: true },
          { text: 'AMB = Peso (kg) / Talla² x PCT (mm)', correct: false },
          { text: 'AMB = Perímetro Braquial / Perímetro Cefálico x 100', correct: false },
          { text: 'AMB = Sumatoria de 4 pliegues x factor de densidad de Durnin', correct: false }
        ]
      }
    ]
  }
};

// --- 2. GENERADOR DE LOS 18 GRUPOS Y 100 ALUMNOS DE PRUEBA ---
const DEMO_NAMES = [
  'Valentina', 'Mateo', 'Lucía', 'Santiago', 'Sofía', 'Joaquín', 'Camila', 'Tomás', 'Martina', 'Nicolás',
  'Florencia', 'Benjamín', 'Julieta', 'Facundo', 'Catalina', 'Agustín', 'Delfina', 'Lucas', 'Pilar', 'Ignacio',
  'Milagros', 'Franco', 'Victoria', 'Felipe', 'Paula', 'Bautista', 'Abril', 'Gonzalo', 'Micaela', 'Ramiro',
  'Bianca', 'Julián', 'Candela', 'Manuel', 'Guadalupe', 'Emiliano', 'Morena', 'Lautaro', 'Zoe', 'Nahuel',
  'Emilia', 'Bruno', 'Clara', 'Thiago', 'Josefina', 'Santino', 'Juana', 'Patricio', 'Alma', 'Sebastián',
  'Malena', 'Mariano', 'Lara', 'Esteban', 'Renata', 'Federico', 'Mía', 'Leandro', 'Paloma', 'Maximiliano',
  'Elena', 'Simón', 'Mercedes', 'Adrián', 'Amparo', 'Ezequiel', 'Iara', 'Matías', 'Celeste', 'Rodrigo',
  'Agatha', 'Gabriel', 'Rocío', 'Iván', 'Brenda', 'Hernán', 'Carla', 'Jerónimo', 'Sol', 'Damián',
  'Constanza', 'Ciro', 'Solana', 'Marcos', 'Ariadna', 'Pablo', 'Kiara', 'Álvaro', 'Brisa', 'Guillermo',
  'Uma', 'Martín', 'Paulina', 'Diego', 'Luciana', 'Daniel', 'Tatiana', 'Cristian', 'Mara', 'Germán'
];

class TournamentEngine {
  constructor() {
    this.storageKey = 'torneo_antropometria_unsta_state';
    this.state = null;
    this.init();
  }

  init() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.state = JSON.parse(saved);
        return;
      } catch (e) {
        console.warn('Error reading saved tournament state, initializing new demo', e);
      }
    }
    this.resetToInitialDemo();
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
  }

  resetToInitialDemo() {
    // 18 Grupos Oficiales
    const groups = [];
    for (let i = 1; i <= 18; i++) {
      groups.push({
        id: `g_${i}`,
        num: i,
        name: `Grupo ${i}`,
        xpWon: 0,
        activePlayersCount: 0
      });
    }

    // 100 Jugadores distribuidos equitativamente en los 18 grupos
    const players = [];
    for (let i = 0; i < 100; i++) {
      const groupIdx = i % 18;
      const grp = groups[groupIdx];
      players.push({
        id: `p_${i + 1}`,
        name: `${DEMO_NAMES[i]} (${grp.name})`,
        firstName: DEMO_NAMES[i],
        groupId: grp.id,
        groupNum: grp.num,
        alive: true,
        pointsWon: 0,
        roundEliminated: null
      });
    }

    // Actualizar conteos
    groups.forEach(g => {
      g.activePlayersCount = players.filter(p => p.groupId === g.id && p.alive).length;
    });

    this.state = {
      day: 1,
      isSimulatedMidnight: false,
      history: {},
      groups,
      players,
      currentMatchups: []
    };

    this.generateMatchupsForDay(1);
    this.save();
  }

  // Empareja a los jugadores asegurando que NUNCA se crucen del mismo grupo
  generateMatchupsForDay(day) {
    const alivePlayers = [...this.state.players.filter(p => p.alive)];
    
    // Algoritmo de emparejamiento aleatorio con restricción grupal
    const matchups = [];
    let unassigned = this.shuffleArray(alivePlayers);

    while (unassigned.length >= 2) {
      const p1 = unassigned.shift();
      // Buscar el primer rival que NO sea del mismo grupo
      let rivalIdx = unassigned.findIndex(candidate => candidate.groupId !== p1.groupId);
      
      // En caso extremo (instancias finales si quedaran solo del mismo grupo), permitir cruce
      if (rivalIdx === -1) {
        rivalIdx = 0;
      }

      const p2 = unassigned.splice(rivalIdx, 1)[0];
      matchups.push({
        id: `m_d${day}_${matchups.length + 1}`,
        day,
        player1: p1,
        player2: p2,
        p1Result: null,
        p2Result: null,
        winnerId: null,
        status: 'pending', // 'pending', 'p1_played', 'p2_played', 'finished'
        revealed: false
      });
    }

    // Si queda 1 jugador huérfano (impar), pasa automáticamente por Pase / Bye (+1 punto)
    if (unassigned.length === 1) {
      const byePlayer = unassigned[0];
      byePlayer.pointsWon += 1;
      const grp = this.state.groups.find(g => g.id === byePlayer.groupId);
      if (grp) grp.xpWon += 1;
      
      matchups.push({
        id: `m_d${day}_bye`,
        day,
        player1: byePlayer,
        player2: { id: 'bye', name: 'Pase Libre / Bye', groupId: 'none', groupNum: 0 },
        p1Result: { score: 1000, timeMs: 0, isBye: true },
        p2Result: null,
        winnerId: byePlayer.id,
        status: 'finished',
        revealed: true
      });
    }

    this.state.currentMatchups = matchups;
    this.state.isSimulatedMidnight = false;
    this.save();
  }

  shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Genera un intento realista para bots / rivales simulados
  generateRealisticBotScore(game) {
    // 80% de probabilidad de acierto muy bueno (750 - 990 pts), 20% intermedio (500 - 740)
    const isGood = Math.random() < 0.82;
    const score = isGood ? Math.floor(750 + Math.random() * 245) : Math.floor(450 + Math.random() * 280);
    const timeMs = Math.floor(1800 + Math.random() * 4500); // 1.8s a 6.3s
    const distPx = isGood ? Math.round((Math.random() * 6 + 1) * 10) / 10 : Math.round((Math.random() * 18 + 7) * 10) / 10;
    
    return {
      score,
      timeMs,
      dist: distPx,
      isBot: true
    };
  }

  // Registra el intento de un jugador humano en un cruce
  recordHumanMatchResult(matchId, playerId, resultData) {
    const match = this.state.currentMatchups.find(m => m.id === matchId);
    if (!match) return false;

    if (match.player1.id === playerId) {
      match.p1Result = resultData;
    } else if (match.player2.id === playerId) {
      match.p2Result = resultData;
    } else {
      return false;
    }

    if (match.p1Result && match.p2Result) {
      match.status = 'ready_to_reveal';
    } else {
      match.status = match.p1Result ? 'p1_played' : 'p2_played';
    }

    this.save();
    return true;
  }

  // Simulación del Cierre a las 00:00 hs (Avanzar a medianoche)
  advanceToMidnight() {
    const currentGames = TOURNAMENT_DAYS_GAMES[this.state.day]?.games || [];

    // 1. Resolver todos los cruces pendientes simulando al rival o a ambos si son bots
    this.state.currentMatchups.forEach(m => {
      if (m.player2.id === 'bye') return;

      if (!m.p1Result) {
        m.p1Result = this.generateRealisticBotScore(currentGames[0]);
      }
      if (!m.p2Result) {
        m.p2Result = this.generateRealisticBotScore(currentGames[0]);
      }

      // Comparación transparente: mayor puntaje gana; empate se define por menor tiempo
      let winner = null;
      if (m.p1Result.score > m.p2Result.score) {
        winner = m.player1;
      } else if (m.p2Result.score > m.p1Result.score) {
        winner = m.player2;
      } else {
        // Desempate por velocidad
        winner = (m.p1Result.timeMs <= m.p2Result.timeMs) ? m.player1 : m.player2;
      }

      m.winnerId = winner.id;
      m.status = 'finished';
      m.revealed = true;

      // El ganador suma punto
      const winningPlayer = this.state.players.find(p => p.id === winner.id);
      if (winningPlayer) {
        winningPlayer.pointsWon += 1;
        const winningGroup = this.state.groups.find(g => g.id === winningPlayer.groupId);
        if (winningGroup) winningGroup.xpWon += 1;
      }

      // El perdedor queda eliminado
      const loserId = (winner.id === m.player1.id) ? m.player2.id : m.player1.id;
      const losingPlayer = this.state.players.find(p => p.id === loserId);
      if (losingPlayer) {
        losingPlayer.alive = false;
        losingPlayer.roundEliminated = this.state.day;
      }
    });

    // Actualizar conteos de vivos por grupo
    this.state.groups.forEach(g => {
      g.activePlayersCount = this.state.players.filter(p => p.groupId === g.id && p.alive).length;
    });

    // Guardar historial del día
    this.state.history[this.state.day] = [...this.state.currentMatchups];
    this.state.isSimulatedMidnight = true;
    this.save();
  }

  // Avanzar al día siguiente tras ver los resultados de medianoche
  nextDay() {
    if (this.state.day >= 7) {
      console.log('Torneo concluido. El campeón ha sido coronado.');
      return;
    }
    this.state.day += 1;
    this.generateMatchupsForDay(this.state.day);
    this.save();
  }

  getAlivePlayersCount() {
    return this.state.players.filter(p => p.alive).length;
  }

  getLeaderboardGroups() {
    return [...this.state.groups].sort((a, b) => b.xpWon - a.xpWon || b.activePlayersCount - a.activePlayersCount);
  }
}

// Instancia global
window.tournamentEngine = new TournamentEngine();
