/**
 * MOTOR DEL TORNEO DE SUPERVIVENCIA ANTROPOMÉTRICA
 * Cátedra de Nutrición Infantil - UNSTA
 * Eliminación Simple: 100 Jugadores -> 18 Grupos -> 7 Días -> 1 Campeón Supremo
 */

// --- 1. BANCO OFICIAL DE LOS 15+ JUEGOS (DÍA 1: LOS 5 HITOS COMPLETOS / DÍAS 2-7: CLÍNICA Y FINAL) ---
const TOURNAMENT_DAYS_GAMES = {
  1: {
    day: 1,
    title: 'Día 1: Evaluación Antropométrica Integral (Ronda de 100 — Los 5 Hitos)',
    desc: 'Localización completa de los 5 hitos oficiales de la cátedra para miembros superiores y cintura.',
    category: 'ANTROPOMETRÍA CLÍNICA TOTAL',
    games: [
      {
        id: 'acromion',
        name: 'Punto Acromial (Acromion)',
        questionTitle: 'Punto Acromial (Acromion)',
        category: 'Hito 1 de 5 • Hombro',
        mode: 'single_point',
        type: 'acromion',
        promptInstruction: 'Punto Acromial (Acromion)',
        desc: 'Ubica el Punto Acromial en el esqueleto.',
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
        category: 'Hito 2 de 5 • Codo',
        mode: 'single_point',
        type: 'olecranon',
        promptInstruction: 'Olécranon (Codo a 90°)',
        desc: 'Ubica el Olécranon en el esqueleto con el codo a 90°.',
        clinicalUse: 'Hito distal para delimitar la distancia acromion-olécranon con cinta métrica.',
        toleranceRadius: 14,
        targets: [
          { side: 'Codo Derecho', x: 70.9, y: 296.5 },
          { side: 'Codo Izquierdo', x: 320.6, y: 298.0 }
        ]
      },
      {
        id: 'mesobraquial',
        name: '2 Puntos de Referencia para Marca Mesobraquial',
        questionTitle: '2 Puntos de Referencia para Marca Mesobraquial',
        category: 'Hito 3 de 5 • Brazo Medio',
        mode: 'two_points_midpoint',
        type: 'arm',
        subType: 'arm',
        promptInstruction: '2 Puntos de Referencia para Marca Mesobraquial',
        desc: 'Marca los 2 puntos anatómicos de referencia (en cualquier orden) para calcular la marca mesobraquial al 50%.',
        clinicalUse: 'Nivel anatómico estricto donde se mide Perímetro Braquial y Pliegue Tricipital (Frisancho).',
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
        name: 'Punto de Referencia: Cintura CDC',
        questionTitle: 'Punto de Referencia: Cintura CDC',
        category: 'Hito 4 de 5 • Cintura CDC',
        mode: 'waist_cdc',
        type: 'waist_cdc',
        promptInstruction: 'Punto de Referencia: Cintura CDC',
        desc: 'Ubica el punto anatómico de referencia para la cintura según el protocolo CDC.',
        clinicalUse: 'Protocolo estándar CDC para percentilar riesgo cardiometabólico.',
        targetY: 330.0,
        torsoMinX: 135,
        torsoMaxX: 275,
        toleranceY: 6,
        referenceTargets: [
          { side: 'Cresta Derecha', x: 144.2, y: 332.1 },
          { side: 'Cresta Izquierda', x: 253.4, y: 326.9 }
        ]
      },
      {
        id: 'cintura_oms',
        name: '2 Puntos de Referencia para Cintura OMS',
        questionTitle: '2 Puntos de Referencia para Cintura OMS',
        category: 'Hito 5 de 5 • Cintura OMS',
        mode: 'two_points_midpoint',
        type: 'waist_oms',
        subType: 'waist_oms',
        promptInstruction: '2 Puntos de Referencia para Cintura OMS',
        desc: 'Marca los 2 puntos anatómicos de referencia (en cualquier orden) para proyectar el plano de cintura OMS.',
        clinicalUse: 'Cintura natural según la OMS (aprox. 2.5 cm sobre la cresta ilíaca en el punto medio intercosto-ilíaco).',
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
      }
    ]
  },
  2: {
    day: 2,
    title: 'Día 2: Composición Corporal y Pliegues Cutáneos (Ronda de 50)',
    desc: 'Evaluación del compartimento graso, pliegue subescapular y caso clínico de corte RCE.',
    category: 'COMPOSICIÓN Y RIESGO',
    games: [
      {
        id: 'pct_relief',
        name: '1/3: Toma del Pliegue Tricipital (PCT)',
        questionTitle: '1/3: Pliegue Tricipital (PCT)',
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
        id: 'subescapular',
        name: '2/3: Punto Subescapular (PSE)',
        questionTitle: '2/3: Punto Subescapular (PSE)',
        category: 'Tronco / Escápula',
        mode: 'single_point',
        type: 'subescapular',
        desc: 'Toca el ángulo inferior y más bajo de la escápula (omóplato).',
        clinicalUse: 'Hito anatómico de referencia para la toma del Pliegue Subescapular a 45° oblicuo.',
        toleranceRadius: 14,
        targets: [
          { side: 'Escápula Derecha', x: 158.5, y: 236.4 },
          { side: 'Escápula Izquierda', x: 247.5, y: 236.4 }
        ]
      },
      {
        id: 'rce_risk',
        name: '3/3: Caso Clínico: Corte de Riesgo RCE',
        questionTitle: '3/3: Riesgo Cardiometabólico: RCE',
        category: 'Riesgo Cardiometabólico',
        mode: 'trivia_choice',
        type: 'trivia_choice',
        desc: 'Un niño de 10 años tiene 72 cm de cintura y 140 cm de estatura. ¿Presenta riesgo cardiometabólico?',
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
  3: {
    day: 3,
    title: 'Día 3: Nutrición Pediátrica en Vegetarianismo (Ronda de 25)',
    desc: 'Micronutrientes críticos y complementación de aminoácidos esenciales.',
    category: 'VEGETARIANISMO PEDIÁTRICO',
    games: [
      {
        id: 'b12_mandatory',
        name: '1/2: Suplementación Crítica Obligatoria',
        questionTitle: '1/2: Suplementación Crítica Obligatoria',
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
        name: '2/2: Pareja de Complementación Proteica',
        questionTitle: '2/2: Complementación Proteica',
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
  4: {
    day: 4,
    title: 'Día 4: Biodisponibilidad de Hierro y Kiosco Saludable (Cuartos de Final)',
    desc: 'Absorción de hierro no hemínico y pautas de alimentación escolar.',
    category: 'EDAD ESCOLAR Y NUTRIENTES',
    games: [
      {
        id: 'iron_enhancer',
        name: '1/2: Facilitador de Absorción del Hierro',
        questionTitle: '1/2: Biodisponibilidad del Hierro',
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
        name: '2/2: Colación para el Kiosco Saludable',
        questionTitle: '2/2: Colación Kiosco Saludable',
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
  5: {
    day: 5,
    title: 'Día 5: Fórmulas Clínicas y Requerimientos Energéticos (Semifinales)',
    desc: 'Cálculo de masa muscular y distribución armónica del Valor Calórico Total.',
    category: 'FÓRMULAS Y REQUERIMIENTOS',
    games: [
      {
        id: 'final_frisancho',
        name: '1/2: Área Muscular del Brazo (Fórmula de Frisancho)',
        questionTitle: '1/2: Área Muscular (AMB)',
        category: 'Fórmulas Clínicas',
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
      },
      {
        id: 'formula_vct',
        name: '2/2: Distribución de Macronutrientes (% VCT)',
        questionTitle: '2/2: Distribución del VCT Pediátrico',
        category: 'Requerimientos Nutricionales',
        mode: 'trivia_choice',
        type: 'trivia_choice',
        desc: '¿Cuál es la distribución calórica (% VCT) estándar recomendada de macronutrientes en pediatría?',
        clinicalUse: 'Pilar para la elaboración armónica de planes de alimentación pediátricos (Escudero).',
        options: [
          { text: 'Carbohidratos: 50-60%, Grasas: 25-35%, Proteínas: 10-15%', correct: true },
          { text: 'Carbohidratos: 30%, Grasas: 50%, Proteínas: 20%', correct: false },
          { text: 'Carbohidratos: 70%, Grasas: 10%, Proteínas: 20%', correct: false },
          { text: 'Carbohidratos: 40%, Grasas: 40%, Proteínas: 20%', correct: false }
        ]
      }
    ]
  },
  6: {
    day: 6,
    title: 'Día 6: Casos Clínicos y Diagnóstico Nutricional (Final Triangular)',
    desc: 'Evaluación del estado nutricional, curvas de crecimiento y lactancia materna.',
    category: 'CLÍNICA PEDIÁTRICA AVANZADA',
    games: [
      {
        id: 'caso_waterlow',
        name: '1/2: Clasificación de Desnutrición Infantil (Waterlow)',
        questionTitle: '1/2: Clasificación de Waterlow',
        category: 'Diagnóstico Nutricional',
        mode: 'trivia_choice',
        type: 'trivia_choice',
        desc: 'Según la clasificación clínica de Waterlow, ¿cómo se define el desmedro o desnutrición crónica?',
        clinicalUse: 'Diferenciación entre emaciación aguda (déficit de peso/talla) y cronicidad (talla baja).',
        options: [
          { text: 'Déficit de Talla para la Edad (T/E disminuido, con P/T conservado o normal)', correct: true },
          { text: 'Déficit severo de Peso para la Talla (P/T < 70%) exclusivamente', correct: false },
          { text: 'Caída de 2 desvíos estándar en el perímetro cefálico', correct: false },
          { text: 'Edema bipedal simétrico con albúmina sérica baja', correct: false }
        ]
      },
      {
        id: 'evaluacion_lactancia',
        name: '2/2: Proteínas de la Leche Humana',
        questionTitle: '2/2: Composición de la Leche Materna',
        category: 'Lactancia y Primeros Años',
        mode: 'trivia_choice',
        type: 'trivia_choice',
        desc: '¿Cuál es la principal proteína del suero en la leche humana madura que facilita su digestión y absorción?',
        clinicalUse: 'Diferencia fundamental con la leche de vaca que contiene beta-lactoglobulina (alérgeno común).',
        options: [
          { text: 'Alfa-lactoalbúmina (con ausencia de beta-lactoglobulina)', correct: true },
          { text: 'Beta-lactoglobulina bovina', correct: false },
          { text: 'Caseína insoluble en proporción 80:20', correct: false },
          { text: 'Gluten hidrolizado', correct: false }
        ]
      }
    ]
  },
  7: {
    day: 7,
    title: 'Día 7: La Gran Final Suprema — Batalla de Campeones (Duelo Supremo)',
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
        id: 'final_caso_clinico',
        name: 'Desafío 3: Caso Pediátrico Integrador (Anemia)',
        questionTitle: 'Desafío 3: Caso Clínico Pediátrico',
        category: 'Gran Final - Conducta Clínica',
        mode: 'trivia_choice',
        type: 'trivia_choice',
        desc: 'Lactante de 8 meses con leche materna exclusiva sin alimentación complementaria ni suplementos. Palidez e irritabilidad. ¿Conducta?',
        clinicalUse: 'Diagnóstico precoz y manejo terapéutico oportuno de la anemia ferropénica infantil.',
        options: [
          { text: 'Anemia ferropénica carencial; indicar hierro terapéutico (3-6 mg/kg/día) e iniciar alimentación complementaria variada.', correct: true },
          { text: 'Indicar exclusivamente suplementación con vitamina D a 400 UI/día.', correct: false },
          { text: 'Suspender lactancia materna e indicar fórmula polimérica estándar.', correct: false },
          { text: 'Indicar infusión de té con miel como aporte energético.', correct: false }
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
    this.storageKey = 'torneo_antropometria_unsta_state_v2';
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
    let matchups = [];
    let success = false;
    let attempts = 0;

    while (!success && attempts < 200) {
      attempts++;
      matchups = [];
      let pool = this.shuffleArray([...alivePlayers]);

      // Priorizar grupos con más jugadores vivos
      const counts = {};
      pool.forEach(p => { counts[p.groupId] = (counts[p.groupId] || 0) + 1; });
      pool.sort((a, b) => counts[b.groupId] - counts[a.groupId]);

      let conflict = false;

      while (pool.length >= 2) {
        const p1 = pool.shift();
        const rivalIdx = pool.findIndex(c => c.groupId !== p1.groupId);
        if (rivalIdx === -1) {
          conflict = true;
          break;
        }
        const p2 = pool.splice(rivalIdx, 1)[0];
        matchups.push({
          id: `m_d${day}_${matchups.length + 1}`,
          day,
          player1: p1,
          player2: p2,
          p1Result: null,
          p2Result: null,
          winnerId: null,
          status: 'pending',
          revealed: false
        });
      }

      if (!conflict) {
        if (pool.length === 1) {
          const byePlayer = pool[0];
          byePlayer.pointsWon += 1;
          const grp = this.state.groups.find(g => g.id === byePlayer.groupId);
          if (grp) grp.xpWon += 1;

          matchups.push({
            id: `m_d${day}_bye`,
            day,
            player1: byePlayer,
            player2: { id: 'bye', name: 'Pase Libre (Sin Rival)', groupId: 'none', groupNum: 0 },
            p1Result: { score: 1000, timeMs: 0, isBye: true },
            p2Result: null,
            winnerId: byePlayer.id,
            status: 'finished',
            revealed: true
          });
        }
        success = true;
      }
    }

    // Red de seguridad: resolver cualquier posible cruce indebido por intercambio
    for (const m of matchups) {
      if (m.player2 && m.player2.id !== 'bye' && m.player1.groupId === m.player2.groupId) {
        for (const other of matchups) {
          if (other.id !== m.id && other.player2 && other.player2.id !== 'bye') {
            if (other.player2.groupId !== m.player1.groupId && other.player1.groupId !== m.player2.groupId) {
              const temp = m.player2;
              m.player2 = other.player2;
              other.player2 = temp;
              break;
            }
          }
        }
      }
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

  // Carga segura y en SOLO LECTURA de los alumnos y fotos reales de Firebase Firestore
  async loadRealStudentsFromFirebase(db) {
    if (!db) throw new Error("Firebase Firestore no está disponible.");

    // 1. Obtener alumnos de la colección 'students'
    const studentsSnap = await db.collection('students').get();
    if (studentsSnap.empty) {
      throw new Error("No se encontraron registros de alumnos en Firestore ('students').");
    }

    // 2. Obtener fotos de 'student_photos' y 'student_profiles'
    const photoMap = {};
    try {
      const photosSnap = await db.collection('student_photos').get();
      photosSnap.forEach(doc => {
        const d = doc.data();
        if (d && d.photo) photoMap[String(doc.id).trim()] = d.photo;
      });
    } catch (e) {
      console.warn("Aviso: no se pudo leer student_photos:", e);
    }

    try {
      const profilesSnap = await db.collection('student_profiles').get();
      profilesSnap.forEach(doc => {
        const d = doc.data();
        const id = String(doc.id).trim();
        if (d && d.photo && !photoMap[id]) photoMap[id] = d.photo;
      });
    } catch (e) {
      console.warn("Aviso: no se pudo leer student_profiles:", e);
    }

    // 3. Crear los 18 Grupos Oficiales de la Cátedra UNSTA
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

    // 4. Mapear alumnos reales sin alterar jamás la base de datos de producción
    const players = [];
    let idx = 0;
    studentsSnap.forEach(doc => {
      const data = doc.data();
      const upStr = String(data.up || doc.id).trim();

      // Parsear Grupo real: data.group ("g_4", "4", 4) o data.grupo
      const rawGroup = data.group !== undefined ? data.group : (data.grupo !== undefined ? data.grupo : '');
      const groupMatch = String(rawGroup).match(/\d+/);
      let gNum = groupMatch ? parseInt(groupMatch[0], 10) : NaN;
      if (isNaN(gNum) || gNum < 1 || gNum > 18) {
        gNum = (idx % 18) + 1; // Fallback armónico solo si no tiene grupo asignado
      }

      // Parsear Nombres reales de estudiantes (compatibilidad con múltiples esquemas)
      const rawFirstName = (data.firstName || data.nombre || '').trim();
      const rawLastName = (data.lastName || data.apellido || '').trim();
      const rawName = (data.name || '').trim();

      let firstName = rawFirstName;
      let lastName = rawLastName;
      let displayName = '';

      if (!firstName && rawName.includes(',')) {
        const parts = rawName.split(',');
        lastName = parts[0].trim();
        firstName = parts[1].trim();
      } else if (!firstName && rawName) {
        firstName = rawName.split(' ')[0].trim();
      }

      if (firstName && lastName) {
        // Ej: Antonella Avila Lucena
        displayName = `${firstName} ${lastName}`;
      } else if (rawName) {
        displayName = rawName;
      } else if (firstName) {
        displayName = firstName;
      } else {
        displayName = `Alumno UP ${upStr}`;
      }

      const photo = data.photo || photoMap[upStr] || null;

      players.push({
        id: `real_${upStr}`,
        up: upStr,
        name: displayName,
        displayName: displayName,
        firstName: firstName || displayName.split(' ')[0],
        lastName: lastName,
        groupId: `g_${gNum}`,
        groupNum: gNum,
        photo: photo,
        alive: true,
        pointsWon: 0,
        roundEliminated: null
      });
      idx++;
    });

    // Actualizar conteos por grupo
    groups.forEach(g => {
      g.activePlayersCount = players.filter(p => p.groupId === g.id && p.alive).length;
    });

    // Guardar torneo en localStorage (Sandbox Local)
    this.state = {
      day: 1,
      isRealFirebase: true,
      isSimulatedMidnight: false,
      history: {},
      groups,
      players,
      currentMatchups: []
    };

    this.generateMatchupsForDay(1);
    this.save();

    return {
      playersCount: players.length,
      photosCount: Object.keys(photoMap).length
    };
  }
}

// Exportar al ámbito global del navegador
window.TOURNAMENT_DAYS_GAMES = TOURNAMENT_DAYS_GAMES;
window.tournamentEngine = new TournamentEngine();

