/**
 * BANCO INTEGRAL DE FLASHCARDS CON RECORTES DE DIAPOSITIVAS
 * Cátedra de Nutrición Infantil UNSTA - 1° Parcial Teórico
 * Docentes: Mariana Mohedano & Germán
 * Estructura: 5 Unidades Temáticas · 10 Parciales de Dominio
 * Respuestas concisas, de alto impacto clínico y basadas en las diapositivas oficiales.
 */

const FLASHCARDS_DECKS = {
  // ==========================================================================
  // UNIDAD 1: PRIMEROS 1000 DÍAS Y RECIÉN NACIDO
  // ==========================================================================
  u1_p1: {
    id: "u1_p1",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
    unidad: 1,
    parcial: 1,
    unitTitle: "UNIDAD 1: Primeros 1000 Días y Recién Nacido",
    title: "Parcial 1 · Primeros 1000 Días y RNT",
    subtitle: "Ventana crítica, programación epigenética, RNT y adaptación fisiológica",
    badge: "Unidad 1 · Módulo 1",
    icon: "fa-baby",
    cards: [
      {
        id: "u1_1",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u1_1.mp3",
        profAudioDuration: "1:41",
        deck: "u1_p1",
        question: "¿Qué comprende el concepto biológico de los 'Primeros 1000 Días' y por qué es una ventana de oportunidad única?",
        hint: "Suma los días de gestación más los primeros dos años de vida.",
        answer: "• Abarca 1000 días: 270 días de gestación + 365 días del 1° año + 365 días del 2° año.\n• Ventana crítica de máxima plasticidad biológica y neurodesarrollo acelerado.\n• Periodo clave de programación epigenética: previene enfermedades crónicas del adulto (obesidad, DBT2, hipertensión).",
        slideImage: "assets/slides/u1_1000dias_concepto.png",
        slideCaption: "Diapositiva Oficial: Concepto y Periodos de los Primeros 1000 Días de Vida",
        keyPoints: [
          "270 días de embarazo + 365 del 1° año + 365 del 2° año",
          "Ventana de plasticidad biológica y neurodesarrollo",
          "Programación epigenética y prevención de ENT en la adultez"
        ],
        keywords: ["1000 días", "270 días", "embarazo", "primer año", "segundo año", "plasticidad", "epigenética", "programación", "neurodesarrollo"]
      },
      {
        id: "u1_2",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u1_2.mp3",
        profAudioDuration: "0:31",
        deck: "u1_p1",
        question: "¿Cómo se clasifica a un Recién Nacido según su Edad Gestacional (EG) al nacer?",
        hint: "Semana 37 y semana 42 son los puntos de corte.",
        answer: "• Pretérmino (Prematuro): menos de 37 semanas completas (<259 días).\n• A Término (RNT): entre 37 y 41 semanas y 6 días (37 a 41.6 sem).\n• Postérmino: 42 semanas o más (≥294 días).",
        slideImage: "assets/slides/u1_prematuro_definicion.png",
        slideCaption: "Diapositiva Oficial: Definición de Recién Nacido y Límites Gestacionales",
        keyPoints: [
          "Pretérmino: menor a 37 semanas de gestación",
          "A término: 37 a 41 semanas y 6 días",
          "Postérmino: 42 semanas o más"
        ],
        keywords: ["edad gestacional", "pretérmino", "37 semanas", "a término", "postérmino", "42 semanas"]
      },
      {
        id: "u1_3",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u1_3.mp3",
        profAudioDuration: "1:00",
        deck: "u1_p1",
        question: "¿Cuál es el descenso de peso fisiológico normal en el recién nacido a término y en cuánto tiempo debe recuperarse?",
        hint: "Ocurre en los primeros 3 a 5 días por redistribución hídrica y meconio.",
        answer: "• Descenso normal: hasta un 10% del peso de nacimiento en los primeros 3 a 5 días.\n• Causa fisiológica: excreción de meconio, pérdida insensible y eliminación del exceso de agua extracelular.\n• Recuperación: debe recuperar el peso de nacimiento entre el día 10 y 14 de vida.",
        slideImage: "assets/slides/u1_rn_caracteristicas_fisiologicas.png",
        slideCaption: "Diapositiva Oficial: Características Fisiológicas y Peso Neonatal",
        keyPoints: [
          "Pérdida fisiológica de hasta el 10% del peso al nacer",
          "Causado por orina, meconio y pérdida hídrica",
          "Recuperación del peso al nacer a los 10 a 14 días"
        ],
        keywords: ["descenso de peso", "10%", "fisiológico", "meconio", "10 a 14 días", "recuperación"]
      },
      {
        id: "u1_4",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
        profAudio: "assets/audio_profesora/profe_u1_4.mp3",
        profAudioDuration: "1:00",
        deck: "u1_p1",
        question: "¿Cuál es la evolución de la capacidad gástrica del recién nacido en los primeros días de vida?",
        hint: "Compara el volumen con frutos: cereza, nuez, huevo de gallina.",
        answer: "• Día 1: 5 a 7 ml (tamaño de una cereza; se satura con el calostro).\n• Día 3: 22 a 27 ml (tamaño de una nuez).\n• Día 7: 45 a 60 ml (tamaño de un huevo de gallina chico).\n• 1 Mes: 80 a 150 ml (tamaño de un huevo grande).",
        slideImage: "assets/slides/u1_rn_caracteristicas_fisiologicas.png",
        slideCaption: "Diapositiva Oficial: Capacidad Gástrica y Volúmenes de Ingesta Neonatal",
        keyPoints: [
          "Día 1: 5 a 7 ml por toma",
          "Día 3: 20 a 30 ml por toma",
          "Día 7: 45 a 60 ml por toma",
          "1 mes: 80 a 150 ml"
        ],
        keywords: ["capacidad gástrica", "5 a 7 ml", "cereza", "22 ml", "60 ml", "estómago", "volumen"]
      },
      {
        id: "u1_5",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u1_5.mp3",
        profAudioDuration: "1:49",
        deck: "u1_p1",
        question: "Complete la clasificación de RCIU (Retraso del Crecimiento Intrauterino): ¿Cuáles son los parámetros antropométricos afectados y en qué trimestre actúa la noxa en Tipo I, II y III?",
        hint: "Tipo I: 1° trim; Tipo II: 2° trim; Tipo III: 3° trim. Observa qué parámetros se van sumando o preservando.",
        answer: "• TIPO I (Armónico): Afecta Peso, Talla y Perímetro Cefálico (PC) $\\rightarrow$ La noxa actúa en el 1° TRIMESTRE (causas genéticas, cromosomopatías, infecciones congénitas TORCH).\n• TIPO II: Afecta Peso y Talla (preserva Perímetro Cefálico) $\\rightarrow$ La noxa actúa en el 2° TRIMESTRE.\n• TIPO III (Disarmónico): Afecta únicamente el Peso (preserva Talla y Perímetro Cefálico) $\\rightarrow$ La noxa actúa en el 3° TRIMESTRE (insuficiencia placentaria vascular, preeclampsia, desnutrición materna tardía).",
        slideImage: "assets/slides/u1_rci_tipos_armonico_disarmonico.png",
        slideCaption: "Diapositiva Oficial: Crecimiento Intrauterino y Tipos de Retraso (RCI - Tipo I, II y III)",
        keyPoints: [
          "Tipo I (Armónico): Peso, Talla y PC afectados en el 1° Trimestre",
          "Tipo II: Peso y Talla afectados en el 2° Trimestre (PC preservado)",
          "Tipo III (Disarmónico): Solo Peso afectado en el 3° Trimestre"
        ],
        keywords: ["RCI", "RCIU", "armónico", "disarmónico", "tipo I", "tipo II", "tipo III", "peso", "talla", "perímetro cefálico", "primer trimestre", "segundo trimestre", "tercer trimestre"]
      },
      {
        id: "u1_6",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u1_6.mp3",
        profAudioDuration: "0:50",
        deck: "u1_p1",
        question: "¿Qué es la Pesquisa Neonatal ('Prueba del Talón'), cuándo se realiza obligatoriamente y qué permite detectar?",
        hint: "Muestra de sangre del talón en papel de filtro entre las 48 y 72 hs de vida.",
        answer: "• Qué es: Prueba de tamizaje poblacional obligatoria y gratuita (Ley Nacional 26.279) a partir de gotas de sangre obtenidas del talón del recién nacido en papel de filtro (NO es de orina).\n• Momento oportuno: Debe realizarse entre las 48 y 72 horas de vida, siempre después de haber iniciado la ingesta láctea y previo al alta de la maternidad (NUNCA al mes de vida).\n• Objetivo: Permite detectar de manera precoz enfermedades genéticas y metabólicas congénitas antes de que generen secuelas o daño neurológico irreversible (Hipotiroidismo congénito, Fenilcetonuria, Fibrosis Quística, Hiperplasia Suprarrenal Congénita, Galactosemia y Déficit de Biotinidasa).",
        slideImage: "assets/slides/u1_rn_definicion_vital.png",
        slideCaption: "Guía Oficial 1000 Días / Ley 26.279: Pesquisa Neonatal de Enfermedades Congénitas y Genéticas",
        keyPoints: [
          "Prueba de sangre del talón en papel de filtro (no de orina)",
          "Se realiza entre las 48 y 72 horas de vida previo al alta (no al mes)",
          "Detecta precozmente enfermedades genéticas y metabólicas (PKU, hipotiroidismo, fibrosis quística)"
        ],
        keywords: ["pesquisa neonatal", "prueba del talón", "sangre", "enfermedades genéticas", "48 a 72 horas", "hipotiroidismo", "fenilcetonuria"]
      }
    ]
  },

  u1_p2: {
    id: "u1_p2",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
    unidad: 1,
    parcial: 2,
    unitTitle: "UNIDAD 1: Primeros 1000 Días y Recién Nacido",
    title: "Parcial 2 · Prematuros (RNPT) y Edad Corregida",
    subtitle: "Clasificación por semanas/peso, cálculo de EC y nutrición del prematuro",
    badge: "Unidad 1 · Módulo 2",
    icon: "fa-heart-pulse",
    cards: [
      {
        id: "u1_6_prem",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
        profAudio: "assets/audio_profesora/profe_u1_6.mp3",
        profAudioDuration: "0:50",
        deck: "u1_p2",
        question: "¿Cómo se subclasifica al recién nacido prematuro según sus semanas de gestación y según su peso de nacimiento?",
        hint: "Puntos de corte gestacionales: 28, 32 y 37 semanas. Puntos de peso: 2500g, 1500g y 1000g.",
        answer: "• Según Semanas:\n  - Prematuro extremo: menos de 28 semanas.\n  - Muy prematuro: 28 a 31.6 semanas.\n  - Prematuro moderado a tardío: 32 a 36.6 semanas.\n• Según Peso:\n  - Bajo Peso (BPN): < 2500 gramos.\n  - Muy Bajo Peso (MBPN): < 1500 gramos.\n  - Prematuro extremo bajo peso (EBPN): < 1000 gramos.",
        slideImage: "assets/slides/u1_prematuro_semanas_clasificacion.png",
        slideCaption: "Diapositiva Oficial: Clasificación de Prematurez por Semanas y Peso",
        keyPoints: [
          "Extremo: <28 sem | Muy prematuro: 28-32 sem | Tardío: 32-37 sem",
          "BPN: <2500g | MBPN: <1500g | EBPN: <1000g"
        ],
        keywords: ["prematuro extremo", "28 semanas", "muy prematuro", "32 semanas", "tardío", "2500g", "1500g", "1000g", "MBPN"]
      },
      {
        id: "u1_7",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u1_7.mp3",
        profAudioDuration: "0:31",
        deck: "u1_p2",
        question: "¿Cuál es la fórmula para calcular la Edad Corregida (EC) en prematuros y hasta qué edad debe utilizarse?",
        hint: "Resta a la edad cronológica las semanas que le faltaron para llegar a las 40 semanas.",
        answer: "• Fórmula: Edad Corregida (EC) = Edad Cronológica - (40 semanas - Semanas de gestación al nacer).\n• Ejemplo: Bebé de 24 semanas cronológicas nacido a las 32 semanas:\n  Faltaron 8 semanas (40 - 32 = 8). Su EC es: 24 - 8 = 16 semanas (4 meses corregidos).\n• Aplicación: Se utiliza obligatoriamente para evaluar crecimiento físico y desarrollo madurativo hasta los 2 años de vida.",
        slideImage: "assets/slides/u1_prematuro_definicion.png",
        slideCaption: "Diapositiva Oficial: Marco Clínico de la Edad Corregida",
        keyPoints: [
          "EC = Edad Cronológica - (40 - EG al nacer)",
          "Se resta el tiempo gestacional faltante",
          "Se aplica rigurosamente hasta los 2 años de vida"
        ],
        keywords: ["edad corregida", "edad cronológica", "40 semanas", "gestacional", "2 años", "maduración", "crecimiento"]
      },
      {
        id: "u1_8",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
        profAudio: "assets/audio_profesora/profe_u1_8.mp3",
        profAudioDuration: "2:15",
        deck: "u1_p2",
        question: "¿Qué características particulares tiene la 'Leche de Madre Pretérmino' durante las primeras semanas de vida del bebé?",
        hint: "La naturaleza la adapta con mayores proteínas y electrolitos, pero menos de un azúcar.",
        answer: "• MAYOR contenido de: Proteínas, Sodio, Lactoferrina, IgA secretoria y Ácidos Grasos Libres.\n• MENOR contenido de: Lactosa (adaptada a la menor actividad de lactasa intestinal del prematuro).\n• Función: Satisface la elevada demanda plástica e inmunitaria del recién nacido de pretérmino.",
        slideImage: "assets/slides/u3_leche_transicion_pretermino.png",
        slideCaption: "Diapositiva Oficial: Composición y Adaptación de la Leche Pretérmino",
        keyPoints: [
          "Mayor cantidad de proteínas y sodio",
          "Mayor concentración de IgA y lactoferrina",
          "Menor contenido de lactosa por inmadurez enzimática"
        ],
        keywords: ["leche pretérmino", "proteínas", "sodio", "lactoferrina", "IgA", "menos lactosa", "inmadurez"]
      },
      {
        id: "u1_9",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
        profAudio: "assets/audio_profesora/profe_u1_9.mp3",
        profAudioDuration: "0:47",
        deck: "u1_p2",
        question: "¿Cuándo y por qué está indicada la fortificación de la leche materna (FLM) en un recién nacido prematuro?",
        hint: "En menores de 1500g o 32 semanas, la leche humana sola no cubre calcio, fósforo ni proteínas.",
        answer: "• Indicación: Prematuros con MBPN (<1500 gramos) o menores de 32 semanas de gestación.\n• Motivo clínico: La leche materna pura no alcanza a cubrir las elevadas tasas de aposición de Calcio, Fósforo y Proteínas del 3° trimestre intrauterino.\n• Beneficio: Previene la osteopenia de la prematurez y asegura un crecimiento ponderoestatural armónico.",
        slideImage: "assets/slides/u1_prematuro_peso_nacimiento.png",
        slideCaption: "Diapositiva Oficial: Nutrición y Requerimientos Críticos en Prematuros",
        keyPoints: [
          "Indicado en <1500g o <32 semanas de gestación",
          "Aporta proteínas, calcio y fósforo indispensables",
          "Previene osteopenia de la prematurez"
        ],
        keywords: ["fortificador", "FLM", "1500g", "32 semanas", "calcio", "fósforo", "osteopenia", "proteínas"]
      }
    ]
  },

  // ==========================================================================
  // UNIDAD 2: EVALUACIÓN DEL ESTADO NUTRICIONAL Y REQUERIMIENTOS
  // ==========================================================================
  u2_p1: {
    id: "u2_p1",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
    unidad: 2,
    parcial: 3,
    unitTitle: "UNIDAD 2: Valoración Antropométrica y Requerimientos",
    title: "Parcial 3 · Curvas OMS, Diagnóstico y Puntuación Z",
    subtitle: "Poblaciones de referencia, transversal vs longitudinal y puntos de corte Z",
    badge: "Unidad 2 · Módulo 1",
    icon: "fa-chart-line",
    cards: [
      {
        id: "u2_1",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
        profAudio: "assets/audio_profesora/profe_u2_1.mp3",
        profAudioDuration: "2:07",
        deck: "u2_p1",
        question: "¿Cuál es la diferencia conceptual entre la valoración antropométrica transversal y la longitudinal?",
        hint: "Una es una fotografía instantánea, la otra es una película del crecimiento en el tiempo.",
        answer: "• Transversal: Medición puntual en un momento determinado. Compara al niño con los puntos de corte de normalidad de la población de referencia.\n• Longitudinal: Mediciones sucesivas a lo largo del tiempo. Permite evaluar la velocidad de crecimiento, si es paralela a los percentilos y si asciende o desciende de canal.",
        slideImage: "assets/slides/u2_tipos_valoracion_transversal_longitudinal.png",
        slideCaption: "Diapositiva Oficial: Tipos de Valoración Antropométrica",
        keyPoints: [
          "Transversal: evaluación en un momento puntual vs población",
          "Longitudinal: controles sucesivos, canal y velocidad de crecimiento"
        ],
        keywords: ["transversal", "longitudinal", "puntual", "canal de crecimiento", "velocidad", "controles"]
      },
      {
        id: "u2_2",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
        profAudio: "assets/audio_profesora/profe_u2_2.mp3",
        profAudioDuration: "1:41",
        deck: "u2_p1",
        question: "¿Qué estándares de crecimiento adoptó oficialmente Argentina (Ministerio de Salud / SAP) según la edad del niño?",
        hint: "Hasta los 6 años se usa una referencia internacional; luego se complementa con tablas nacionales.",
        answer: "• Desde el nacimiento hasta los 6 años: Curvas de crecimiento de la OMS (2006), basadas en niños amamantados sanos.\n• A partir de los 6 años hasta el final del crecimiento: Curvas Nacionales Argentinas (Lejarraga / SAP) complementadas con gráficas de IMC/Edad de la OMS.",
        slideImage: "assets/slides/u2_poblacion_referencia_oms_sap.png",
        slideCaption: "Diapositiva Oficial: Población de Referencia Oficial SAP / OMS",
        keyPoints: [
          "0 a 6 años: Curvas OMS 2006 obligatorias",
          "> 6 años: Curvas Argentinas (Lejarraga / SAP) + IMC/E OMS"
        ],
        keywords: ["OMS", "SAP", "0 a 6 años", "Lejarraga", "argentinas", "población de referencia"]
      },
      {
        id: "u2_3",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u2_3.mp3",
        profAudioDuration: "0:34",
        deck: "u2_p1",
        question: "¿Cuáles son los diagnósticos nutricionales según la OMS al utilizar la Puntuación Z (Puntaje Z)?",
        hint: "Puntos de corte: Mediana (0), por debajo de -1, debajo de -2 y debajo de -3.",
        answer: "• 0 a -1 Z: Normal.\n• Debajo de -2 Z:\n  - Longitud-Talla / Edad: Baja Talla.\n  - Peso / Edad: Bajo Peso.\n  - Peso / Talla o IMC / Edad: Emaciado (Desnutrición aguda).\n• Debajo de -3 Z: Severo (Baja Talla severa, Bajo Peso severo, Emaciación severa).",
        slideImage: "assets/slides/u2_diagnostico_zscore_oms.png",
        slideCaption: "Diapositiva Oficial: Diagnóstico Nutricional según Puntaje Z (OMS)",
        keyPoints: [
          "0 a -1: Normal",
          "< -2 Z: Baja Talla (T/E), Bajo Peso (P/E), Emaciado (P/T e IMC/E)",
          "< -3 Z: Grado Severo en todos los indicadores"
        ],
        keywords: ["puntaje Z", "Z-score", "baja talla", "bajo peso", "emaciado", "-2 Z", "-3 Z", "severo"]
      },
      {
        id: "u2_4",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u2_4.mp3",
        profAudioDuration: "0:22",
        deck: "u2_p1",
        question: "¿Cuáles son los puntos de corte en Percentilos del indicador IMC/Edad para valorar Adiposidad según la cátedra?",
        hint: "Percentilo 85 y percentilo 97.",
        answer: "• Percentilo 10 a < 85: Peso Normal (seguimiento habitual).\n• Percentilo ≥ 85 a < 97: Sobrepeso (evaluar factores de riesgo alimentarios y familiares).\n• Percentilo ≥ 97: Obesidad (derivar a equipos interdisciplinarios especializados).",
        slideImage: "assets/slides/u2_adiposidad_percentilos.png",
        slideCaption: "Diapositiva Oficial: Puntos de Corte para Valorar Adiposidad (IMC/Edad)",
        keyPoints: [
          "Pc 10 a <85: Normal",
          "Pc ≥85 a <97: Sobrepeso",
          "Pc ≥97: Obesidad"
        ],
        keywords: ["adiposidad", "IMC/edad", "percentilos", "sobrepeso", "obesidad", "Pc 85", "Pc 97"]
      }
    ]
  },

  u2_p2: {
    id: "u2_p2",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
    unidad: 2,
    parcial: 4,
    unitTitle: "UNIDAD 2: Valoración Antropométrica y Requerimientos",
    title: "Parcial 4 · Cálculo de Requerimientos Energéticos y Proteicos",
    subtitle: "Tablas FAO/OMS 2004, kcal/kg/d y distribución armónica de nutrientes",
    badge: "Unidad 2 · Módulo 2",
    icon: "fa-calculator",
    cards: [
      {
        id: "u2_5",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
        profAudio: "assets/audio_profesora/profe_u2_5.mp3",
        profAudioDuration: "1:30",
        deck: "u2_p2",
        question: "¿Cómo varían las necesidades calóricas por kilo de peso (kcal/kg/día) a medida que el niño crece según FAO/OMS?",
        hint: "La mayor tasa calórica por kilo ocurre en los primeros meses y va descendiendo progresivamente.",
        answer: "• Los requerimientos calóricos por kilo descienden con la edad:\n  - Lactante pequeño (0-3 meses): 100 a 115 kcal/kg/d.\n  - 1 a 2 años: ~82 kcal/kg/d (varones) y ~80 kcal/kg/d (niñas).\n  - 5 a 6 años: ~74.5 kcal/kg/d (varones) y ~71.5 kcal/kg/d (niñas).\n  - 10 a 11 años: ~64.6 kcal/kg/d.\n• Causa: Fuerte desaceleración de la velocidad de crecimiento respecto al primer año.",
        slideImage: "assets/slides/u2_requerimientos_caloricos_fao.png",
        slideCaption: "Diapositiva Oficial: Tabla de Requerimientos Calóricos Diarios FAO/WHO/UNU",
        keyPoints: [
          "Primer semestre: 100-115 kcal/kg/d",
          "1 a 2 años: ~80-82 kcal/kg/d",
          "Disminuye continuamente por desaceleración del crecimiento"
        ],
        keywords: ["FAO", "necesidades calóricas", "kcal/kg/día", "82 kcal", "80 kcal", "desaceleración", "energía"]
      },
      {
        id: "u2_6",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
        profAudio: "assets/audio_profesora/profe_u2_6.mp3",
        profAudioDuration: "1:30",
        deck: "u2_p2",
        question: "¿Cuáles son las metas cuantitativas de proteínas recomendadas en las distintas etapas pediátricas?",
        hint: "Rango de 1.5-2.0 g/kg en primeros meses bajando a 1.0-1.2 g/kg en preescolares.",
        answer: "• 0 a 6 meses: 1.5 a 1.8 g/kg/día (aportadas perfectamente por la leche materna).\n• 6 a 12 meses: 1.2 a 1.5 g/kg/día.\n• 1 a 3 años (preescolar): 1.0 a 1.2 g/kg/día (promedio ~13 g/día totales).\n• Regla clínica: Nunca sobrecargar proteínas para no elevar la carga renal de solutos.",
        slideImage: "assets/slides/u2_requerimientos_caloricos_fao.png",
        slideCaption: "Diapositiva Oficial: Metabolismo y Requerimientos de Crecimiento",
        keyPoints: [
          "Lactante menor: 1.5-1.8 g/kg/d",
          "Preescolar: 1.0-1.2 g/kg/d (~13 g/d)",
          "Evitar sobrecarga renal de solutos"
        ],
        keywords: ["proteínas", "g/kg/día", "1.5 g", "1.2 g", "1.0 g", "preescolar", "carga renal"]
      }
    ]
  },

  // ==========================================================================
  // UNIDAD 3: LACTANCIA MATERNA
  // ==========================================================================
  u3_p1: {
    id: "u3_p1",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
    unidad: 3,
    parcial: 5,
    unitTitle: "UNIDAD 3: Fisiología de la Lactancia Materna",
    title: "Parcial 5 · Endocrinología, Fisiología y Fases",
    subtitle: "Prolactina, Oxitocina, Lactogénesis 1, 2 y 3 (Control Autócrino / FIL)",
    badge: "Unidad 3 · Módulo 1",
    icon: "fa-person-breastfeeding",
    cards: [
      {
        id: "u3_1",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u3_1.mp3",
        profAudioDuration: "1:22",
        deck: "u3_p1",
        question: "¿Qué funciones endocrinas diferenciales cumplen la Prolactina y la Oxitocina en la lactancia materna?",
        hint: "Una produce la leche en los alvéolos y la otra la eyecta contrayendo las células mioepiteliales.",
        answer: "• Prolactina (Adenohipófisis / Hipófisis Anterior):\n  - Estimulada por la succión del pezón.\n  - Actúa sobre las células epiteliales alveolares para la SÍNTESIS y producción de leche.\n• Oxitocina (Neurohipófisis / Hipófisis Posterior):\n  - Provoca la contracción de las células MIOEPITELIALES que rodean los alvéolos.\n  - Responsable del REFLEJO DE EYECCIÓN ('bajada de la leche') y del apego afectivo.",
        slideImage: "assets/slides/u3_control_endocrino_prolactina_oxitocina.png",
        slideCaption: "Diapositiva Oficial: Control Endocrino de la Lactogénesis (Cerebro y Lactancia)",
        keyPoints: [
          "Prolactina: hipófisis anterior, síntesis de leche en alvéolos",
          "Oxitocina: hipófisis posterior, contracción mioepitelial y eyección"
        ],
        keywords: ["prolactina", "oxitocina", "adenohipófisis", "neurohipófisis", "síntesis", "eyección", "células mioepiteliales"]
      },
      {
        id: "u3_2",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u3_2.mp3",
        profAudioDuration: "0:39",
        deck: "u3_p1",
        question: "¿Cómo se define la Lactogénesis 3 (Galactopoyesis) y qué rol cumple el Factor Inhibidor de la Lactancia (FIL)?",
        hint: "Pasa de un control hormonal a un control local o autócrino dependiente del vaciamiento.",
        answer: "• Control Autócrino Local: La producción deja de depender solo de hormonas y pasa a ser regulada por el vaciamiento mamario.\n• FIL (Factor Inhibidor Lácteo):\n  - Es una proteína presente en la propia leche.\n  - Si la mama permanece llena, el FIL inhibe a las células secretoras.\n  - Al vaciar completamente la glándula mamaria, se elimina el FIL y se reanuda la síntesis activa de leche.",
        slideImage: "assets/slides/u3_mantenimiento_fil.png",
        slideCaption: "Diapositiva Oficial: Lactogénesis 3 y Regulación por FIL",
        keyPoints: [
          "Control autócrino: la mama se autorregula según el vaciamiento",
          "FIL: péptido que frena la síntesis cuando la glándula está llena",
          "Vaciamiento completo = estímulo máximo de producción"
        ],
        keywords: ["lactogénesis 3", "galactopoyesis", "autócrino", "FIL", "factor inhibidor lácteo", "vaciamiento"]
      },
      {
        id: "u3_3",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
        profAudio: "assets/audio_profesora/profe_u3_3.mp3",
        profAudioDuration: "0:42",
        deck: "u3_p1",
        question: "¿Cuáles son las 3 etapas cronológicas de la leche materna según el tiempo postparto?",
        hint: "Calostro, leche intermedia y leche final.",
        answer: "• 1. Calostro: Desde el parto hasta el 3° o 4° día postparto.\n• 2. Leche de Transición (intermedia): Desde el día 4 hasta aproximadamente el día 15 postparto (aumenta volumen a 600-700 ml/d).\n• 3. Leche Madura: A partir del día 15 postparto y durante todo el resto del amamantamiento.",
        slideImage: "assets/slides/u3_cronologia_leches.png",
        slideCaption: "Diapositiva Oficial: Cronología y Fases de la Secreción Láctea",
        keyPoints: [
          "Calostro: parto a 3°-4° día",
          "Transición: día 4 al 15",
          "Madura: a partir del día 15"
        ],
        keywords: ["calostro", "leche de transición", "leche madura", "día 4", "día 15", "cronología"]
      }
    ]
  },

  u3_p2: {
    id: "u3_p2",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
    unidad: 3,
    parcial: 6,
    unitTitle: "UNIDAD 3: Fisiología de la Lactancia Materna",
    title: "Parcial 6 · Calostro, Leche Madura vs Vaca y Contraindicaciones",
    subtitle: "Composición bioquímica, biodisponibilidad de hierro y contraindicaciones formales",
    badge: "Unidad 3 · Módulo 2",
    icon: "fa-shield-halved",
    cards: [
      {
        id: "u3_4",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u3_4.mp3",
        profAudioDuration: "0:49",
        deck: "u3_p2",
        question: "¿Cuáles son las características nutricionales e inmunológicas distintivas del Calostro?",
        hint: "Líquido espeso amarillento, bajo volumen por mamada y rico en proteínas protectoras.",
        answer: "• Físico: Líquido amarillento (rico en betacarotenos), volumen de 2 a 20 ml por mamada.\n• Bioquímica vs Leche Madura:\n  - MAYOR: Proteínas, Vitaminas liposolubles (A, E, K), Minerales (Zinc, Sodio) e Inmunoglobulina A secretoria (IgA).\n  - MENOR: Lactosa, grasas y calorías totales.\n• Función: Propiedades laxantes (facilita expulsión de meconio) y siembra de flora bifidógena.",
        slideImage: "assets/slides/u3_calostro_composicion.png",
        slideCaption: "Diapositiva Oficial: Composición y Ventajas del Calostro",
        keyPoints: [
          "Volumen: 2 a 20 ml por mamada",
          "Mayor cantidad de proteínas, IgA, zinc, sodio y betacarotenos",
          "Menos grasa y lactosa; acción laxante sobre el meconio"
        ],
        keywords: ["calostro", "2 a 20 ml", "amarillento", "IgA", "proteínas", "zinc", "laxante", "meconio", "bifidobacterias"]
      },
      {
        id: "u3_5",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u3_5.mp3",
        profAudioDuration: "1:02",
        deck: "u3_p2",
        question: "¿Cómo se comparan la Leche Humana Madura y la Leche de Vaca Entera según la tabla oficial de cátedra?",
        hint: "Revisa proteínas, calorías, calcio y relación caseína/suero en 100g.",
        answer: "• Proteínas: Humana 1.03 g vs Vaca 3.3 g (¡el triple en vaca, sobrecarga renal!).\n• Relación Caseína / Suero: Humana 40/60 (coágulo blando) vs Vaca 80/20 (coágulo duro y difícil digestión).\n• Hidratos de Carbono: Humana 7.0 g vs Vaca 5.4 g (más lactosa y oligosacáridos HMO en humana).\n• Energía: Humana 70 kcal vs Vaca 61 kcal.\n• Calcio: Humana 30 mg vs Vaca 119 mg.",
        slideImage: "assets/slides/u3_comparacion_humana_vaca.png",
        slideCaption: "Diapositiva Oficial: Comparación de Nutrientes Leche Humana vs Leche de Vaca (100g)",
        keyPoints: [
          "Proteínas: 1.03g (humana) vs 3.3g (vaca)",
          "Caseína/Suero: 40/60 humana vs 80/20 vaca",
          "Calorías: 70 kcal/100ml humana vs 61 vaca"
        ],
        keywords: ["leche de vaca", "leche humana", "1.03g", "3.3g", "caseína suero", "40/60", "80/20", "70 kcal", "calcio"]
      },
      {
        id: "u3_6",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u3_6.mp3",
        profAudioDuration: "1:42",
        deck: "u3_p2",
        question: "¿Por qué el hierro de la leche materna tiene una biodisponibilidad tan elevada (50%) a pesar de su baja concentración?",
        hint: "Intervienen la lactoferrina, la vitamina C, la lactosa y el bajo fósforo.",
        answer: "• Biodisponibilidad del 50% (vs 10% en leche de vaca y 4% en fórmulas).\n• Factores facilitadores en leche materna:\n  - Proteína transportadora específica (Lactoferrina).\n  - Alto contenido de Lactosa y Ácido Ascórbico (Vitamina C).\n  - Muy bajo contenido de fósforo y calcio iónico competitivo.",
        slideImage: "assets/slides/u3_hierro_biodisponibilidad.png",
        slideCaption: "Diapositiva Oficial: Biodisponibilidad de Minerales y Hierro",
        keyPoints: [
          "Biodisponibilidad del 50% en leche materna",
          "Facilitado por lactoferrina, lactosa y vitamina C",
          "Bajo fósforo impide precipitados insolubles"
        ],
        keywords: ["hierro", "50%", "biodisponibilidad", "lactoferrina", "lactosa", "fósforo", "leche materna"]
      },
      {
        id: "u3_7",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u3_7.mp3",
        profAudioDuration: "1:43",
        deck: "u3_p2",
        question: "¿Cuáles son las contraindicaciones médicas formales de la lactancia materna presentadas en clase?",
        hint: "Menciona patologías infecciosas maternas, metabólicas del lactante y toxicología.",
        answer: "• Del Lactante: Galactosemia clásica (error congénito del metabolismo).\n• De la Madre:\n  - Infección por VIH (en lugares con acceso a fórmulas seguras).\n  - Virus Linfotrópico T Humano (HTLV-1 y 2).\n  - Tratamiento activo con quimioterapia o radiofármacos (Cáncer).\n  - Consumo activo de drogas ilícitas o alcoholismo grave.\n  - Psicosis puerperal o enfermedad mental severa no controlada.",
        slideImage: "assets/slides/u3_contraindicaciones_lactancia.png",
        slideCaption: "Diapositiva Oficial: Contraindicaciones Médicas de la Lactancia",
        keyPoints: [
          "Galactosemia en el recién nacido",
          "VIH materno y HTLV",
          "Quimioterapia y radiofármacos",
          "Drogadicción activa y enfermedad mental severa"
        ],
        keywords: ["contraindicaciones", "VIH", "galactosemia", "quimioterapia", "drogadicción", "cáncer", "alcoholismo"]
      }
    ]
  },

  // ==========================================================================
  // UNIDAD 4: FORMULACIÓN PEDIÁTRICA Y SOPORTE ENTERAL
  // ==========================================================================
  u4_p1: {
    id: "u4_p1",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
    unidad: 4,
    parcial: 7,
    unitTitle: "UNIDAD 4: Fórmulas Infantiles y Soporte Enteral",
    title: "Parcial 7 · Fórmulas Estándar y Reconstitución Exacta",
    subtitle: "Inicio vs Continuación, peso de medidas al ras, dilución 13.5% vs 15% y tomas",
    badge: "Unidad 4 · Módulo 1",
    icon: "fa-bottle-droplet",
    cards: [
      {
        id: "u4_1",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u4_1.mp3",
        profAudioDuration: "2:02",
        deck: "u4_p1",
        question: "¿Cuánto pesa 1 medida al ras de Fórmula de Inicio vs Fórmula de Continuación y cómo debe medirse?",
        hint: "Inicio pesa 4.5g y continuación 5g; la cuchara debe estar al ras.",
        answer: "• Fórmula de Inicio (0 a 6 meses): 1 medida al ras = 4,5 gramos.\n• Fórmula de Continuación (6 a 12 meses): 1 medida al ras = 5 gramos.\n• Técnica obligatoria: La medida debe ser 'al ras' (enrasada con cuchillo o pestaña del envase). Nunca colmada ni comprimida, para evitar hiperconcentración y sobrecarga renal.",
        slideImage: "assets/slides/u4_peso_medidas_enrase.png",
        slideCaption: "Diapositiva Oficial: Peso de las Medidas y Técnica de Enrase Correcta (✓ al ras vs ✗ colmada)",
        keyPoints: [
          "Fórmula de Inicio: 1 medida = 4.5 g",
          "Fórmula de Continuación: 1 medida = 5 g",
          "Siempre cuchara al ras, nunca colmada"
        ],
        keywords: ["4.5 gramos", "5 gramos", "medida al ras", "enrasada", "inicio", "continuación", "colmada"]
      },
      {
        id: "u4_2",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u4_2.mp3",
        profAudioDuration: "1:48",
        deck: "u4_p1",
        question: "¿Cómo se calcula la Dilución Estándar para una Fórmula de Inicio (13.5%) vs Continuación (15%)?",
        hint: "La regla es 3 medidas por cada 100 cc de agua.",
        answer: "• Regla estándar: Se usan 3 medidas cada 100 cc de agua.\n• Fórmula de Inicio: 4,5 g × 3 medidas = 13,5 g de polvo en 100 cc $\\rightarrow$ Dilución al 13,5%.\n• Fórmula de Continuación: 5 g × 3 medidas = 15 g de polvo en 100 cc $\\rightarrow$ Dilución al 15%.\n• Ambas aportan ~70 kcal / 100 ml en dilución estándar.",
        slideImage: "assets/slides/u4_calculo_dilucion_13_15.png",
        slideCaption: "Diapositiva Oficial: Cálculo Matemático de Diluciones Estándar (13.5% y 15%)",
        keyPoints: [
          "3 medidas en 100 cc de agua para ambas fórmulas",
          "Inicio: 4.5 × 3 = 13.5 g en 100 cc (13.5%)",
          "Continuación: 5 × 3 = 15 g en 100 cc (15%)",
          "Aporte calórico: ~70 kcal por 100 ml"
        ],
        keywords: ["dilución estándar", "3 medidas", "100 cc", "13.5%", "15%", "4.5", "5", "70 kcal"]
      },
      {
        id: "u4_3",
        importance: "low",
        importanceLabel: "📖 Detalle Complementario",
        profAudio: "assets/audio_profesora/profe_u4_3.mp3",
        profAudioDuration: "0:59",
        deck: "u4_p1",
        question: "¿Qué número de tomas y biberones se recomiendan según la edad (<6 meses, >6 meses y 1 año)?",
        hint: "Va de 7-8 tomas al inicio hasta 2-3 tomas al año.",
        answer: "• Menores de 6 meses: 7 a 8 tomas al día (cada 3 horas aprox.).\n• Mayores de 6 meses (con alimentación complementaria): 4 a 5 tomas al día.\n• Al año de vida (12 meses): 2 a 3 tomas al día (aprox. 500 ml diarios de leche).",
        slideImage: "assets/slides/u5_biberones_datos_clave.png",
        slideCaption: "Diapositiva Oficial: Frecuencia de Biberones por Etapa Etaria",
        keyPoints: [
          "< 6 meses: 7 a 8 tomas diarias",
          "> 6 meses: 4 a 5 tomas diarias",
          "1 año: 2 a 3 tomas diarias (~500 ml)"
        ],
        keywords: ["tomas", "biberones", "7 a 8 tomas", "4 a 5 tomas", "2 a 3 tomas", "frecuencia"]
      },
      {
        id: "u4_4",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
        profAudio: "assets/audio_profesora/profe_u4_4.mp3",
        profAudioDuration: "2:15",
        deck: "u4_p1",
        question: "¿Cómo se define la Dilución Concentrada vs Dilución Tope y cuándo se indican?",
        hint: "Pasan de 3 medidas a 4 y a 5 medidas en 100 cc.",
        answer: "• Dilución Concentrada: 4 medidas en 100 cc de agua (Inicio: 18% / Continuación: 20%). Aporta ~100 kcal / 100 ml.\n• Dilución Tope: 5 medidas en 100 cc de agua (máxima densidad tolerada antes de diarrea osmótica).\n• Usos clínicos: Cardiopatías congénitas y nefropatías (restricción hídrica severa) o recuperación nutricional de desnutrición.",
        slideImage: "assets/slides/u4_dilucion_biberones.png",
        slideCaption: "Diapositiva Oficial: Esquema de Biberones (Estándar 3 med, Concentrada 4 med, Tope 5 med)",
        keyPoints: [
          "Concentrada: 4 medidas en 100 cc (~100 kcal/100ml)",
          "Tope: 5 medidas en 100 cc",
          "Indicadas en restricción de líquidos y recuperación nutricional"
        ],
        keywords: ["concentrada", "4 medidas", "dilución tope", "5 medidas", "100 kcal", "restricción hídrica", "cardiopatías"]
      },
      {
        id: "u4_std_def",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u4_std_def.mp3",
        profAudioDuration: "3:00",
        deck: "u4_p1",
        question: "¿Qué es una 'Fórmula Estándar' en nutrición pediátrica y qué condición del tracto digestivo exige para su uso?",
        hint: "Es nutricionalmente completa y los tres macronutrientes están en forma compleja.",
        answer: "• Definición oficial: Es una fórmula nutricionalmente completa en la que los tres macronutrientes (proteínas, hidratos de carbono y lípidos) se encuentran en FORMA COMPLEJA (enteros / intactos).\n• Capacidad digestiva requerida: Exige que el lactante tenga una capacidad digestiva y absortiva COMPLETAMENTE INTACTA.\n• Diferenciación clínica: Si la capacidad digestiva NO está intacta (ej. APLV, malabsorción, diarrea crónica intratable), NO se utiliza fórmula estándar sino fórmulas modificadas/especiales (extensamente hidrolizadas o elementales).",
        slideImage: "assets/slides/u4_tabla_comparativa_marcas.png",
        slideCaption: "Diapositiva Oficial: Definición de Fórmulas Lácteas Estándar y Clasificación",
        keyPoints: [
          "Nutricionalmente completa",
          "Tres macronutrientes en forma compleja",
          "Requiere capacidad digestiva intacta (no alterada)",
          "Diferente de fórmulas modificadas para patologías específicas"
        ],
        keywords: ["fórmula estándar", "forma compleja", "nutricionalmente completa", "capacidad digestiva", "intacta", "polimérica"]
      }
    ]
  },

  u4_p2: {
    id: "u4_p2",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
    unidad: 4,
    parcial: 8,
    unitTitle: "UNIDAD 4: Fórmulas Infantiles y Soporte Enteral",
    title: "Parcial 8 · Fórmulas Especiales y Módulos de Nutrientes",
    subtitle: "APLV (hidrolizadas vs aminoácidos), TCM, contraindicación de AR en SNG y módulos",
    badge: "Unidad 4 · Módulo 2",
    icon: "fa-prescription-bottle-medical",
    cards: [
      {
        id: "u4_5",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u4_5.mp3",
        profAudioDuration: "3:00",
        deck: "u4_p2",
        question: "¿Qué fórmulas se indican en Alergia a la Proteína de Leche de Vaca (APLV) según su gravedad?",
        hint: "Distingue hidrolizados extensos de fórmulas monoméricas de aminoácidos libres.",
        answer: "• 1° Línea (APLV moderada o severa): Fórmulas Extensamente Hidrolizadas (EH) de suero o caseína, sin lactosa (ej. Nutrilon Pepti Junior HE, Alfaré).\n• 2° Línea (APLV anafiláctica, refractaria o fallo de medro grave): Fórmulas de Aminoácidos Libres / Elementales (ej. Neocate Gold, Neocate Junior, Aminomed).",
        slideImage: "assets/slides/u4_formulas_especiales_aplv.png",
        slideCaption: "Diapositiva Oficial: Clasificación de Fórmulas Especiales Pediátricas",
        keyPoints: [
          "APLV 1° línea: Proteínas extensamente hidrolizadas sin lactosa (Pepti Junior, Alfaré)",
          "APLV refractaria/grave: Aminoácidos libres (Neocate, Aminomed)"
        ],
        keywords: ["APLV", "extensamente hidrolizadas", "aminoácidos libres", "Neocate", "Pepti Junior", "Alfaré", "anafilaxia"]
      },
      {
        id: "u4_6",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u4_6.mp3",
        profAudioDuration: "1:48",
        deck: "u4_p2",
        question: "¿Por qué las Fórmulas Antirreflujo (AR) están TERMINANTEMENTE CONTRAINDICADAS a través de Sonda Nasogástrica (SNG)?",
        hint: "Tiene que ver con los espesantes y el diámetro de la sonda.",
        answer: "• Causa mecánica: Las fórmulas AR contienen espesantes (almidón precocido o goma de semilla de algarrobo) que aumentan rápidamente su viscosidad al contacto con líquidos.\n• Peligro: Obstruyen irreversiblemente la luz delgada de la sonda nasogástrica, impidiendo la alimentación y obligando al recambio traumático de la sonda.",
        slideImage: "assets/slides/u4_formulas_especiales_monogen_ar.png",
        slideCaption: "Diapositiva Oficial: Fórmulas para Situaciones Especiales (Regla AR: ¡NO en SNG!)",
        keyPoints: [
          "Fórmulas AR espesadas obstruyen la luz de la sonda nasogástrica",
          "Contraindicación absoluta por vía SNG",
          "Requieren administración exclusivamente por vía oral"
        ],
        keywords: ["antirreflujo", "AR", "SNG", "sonda nasogástrica", "obstrucción", "espesante", "algarrobo"]
      },
      {
        id: "u4_7",
        importance: "low",
        importanceLabel: "📖 Detalle Complementario",
        profAudio: "assets/audio_profesora/profe_u4_7.mp3",
        profAudioDuration: "2:34",
        deck: "u4_p2",
        question: "¿Cuáles son las concentraciones máximas toleradas para módulos de Hidratos de Carbono, Proteínas y Grasas por vía oral vs sonda?",
        hint: "Maltodextrina 10% vs 7%; Caseinato 5-10% vs 3%; Grasas 3-5%.",
        answer: "• Hidratos de Carbono (Maltodextrina / Polimerosa 1 med = 5g):\n  - Vía oral: hasta 10% | Vía sonda: hasta 7%.\n• Proteínas (Caseinato de calcio / Secalbum 1 med = 3g):\n  - Vía oral: 5 a 10% | Vía sonda: hasta 3%.\n• Grasas (Aceite maíz/girasol / TCM):\n  - Vía oral: 3 a 5% | Vía sonda: 3 a 5%.\n• Glucosa / Mono y disacáridos por sonda: Estómago 20%, Duodeno 10%, Yeyuno 6%.",
        slideImage: "assets/slides/u4_concentraciones_modulos_sonda.png",
        slideCaption: "Diapositiva Oficial: Tabla de Concentraciones Máximas de Módulos (Vía Oral vs Sonda)",
        keyPoints: [
          "Maltodextrina: 10% oral / 7% sonda",
          "Caseinato de calcio: 5-10% oral / 3% sonda",
          "Grasas y TCM: 3-5% oral y sonda",
          "Mono/disacáridos en yeyuno: máximo 6%"
        ],
        keywords: ["módulos", "maltodextrina", "caseinato", "10%", "7%", "3%", "5%", "sonda", "vía oral", "TCM"]
      }
    ]
  },

  // ==========================================================================
  // UNIDAD 5: ALIMENTACIÓN COMPLEMENTARIA OPORTUNA
  // ==========================================================================
  u5_p1: {
    id: "u5_p1",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
    unidad: 5,
    parcial: 9,
    unitTitle: "UNIDAD 5: Alimentación Complementaria",
    title: "Parcial 9 · Inicio Oportuno, Texturas y Cronograma",
    subtitle: "Por qué a los 6 meses, 5 etapas de texturas y cronograma de alimentos",
    badge: "Unidad 5 · Módulo 1",
    icon: "fa-utensils",
    cards: [
      {
        id: "u5_1",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u5_1.mp3",
        profAudioDuration: "0:59",
        deck: "u5_p1",
        question: "¿Cuáles son las 4 razones fisiológicas y madurativas por las que la Alimentación Complementaria debe iniciarse a los 6 meses?",
        hint: "Madurez digestiva, renal, neuromuscular y reservas de hierro.",
        answer: "• 1. Madurez Renal: El riñón ya filtra la mayor carga osmolar de solutos sin deshidratación.\n• 2. Madurez Gastrointestinal: Barrera mucosa madura y secreción enzimática adecuada (amilasa pancreática, sales biliares).\n• 3. Madurez Neuromuscular: Desaparición del reflejo de extrusión, sostén cefálico firme y capacidad de sentarse erguido.\n• 4. Requerimientos Nutricionales: Las reservas hepáticas neonatales de Hierro y Zinc se agotan hacia el 6° mes.",
        slideImage: "assets/slides/u5_biberones_datos_clave.png",
        slideCaption: "Diapositiva Oficial: Fundamentos del Inicio Oportuno a los 6 Meses",
        keyPoints: [
          "Madurez renal para carga de solutos",
          "Madurez gastrointestinal y enzimática",
          "Pérdida del reflejo de extrusión y sedestación",
          "Agotamiento de reservas de hierro y zinc"
        ],
        keywords: ["6 meses", "madurez renal", "reflejo de extrusión", "hierro", "zinc", "sostén cefálico", "maduración"]
      },
      {
        id: "u5_2",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
        profAudio: "assets/audio_profesora/profe_u5_2.mp3",
        profAudioDuration: "1:26",
        deck: "u5_p1",
        question: "¿Cuál es la proporción calórica aportada por Leche Materna vs Alimentos Sólidos en las 3 etapas de la AC?",
        hint: "6-8 meses: 70/30; 9-11 meses: 45/55; 12-23 meses: 30/70.",
        answer: "• 6 a 8 meses: Leche materna 60-70% | Alimentos 30-40%.\n• 9 a 11 meses: Leche materna 40-45% | Alimentos 55-60%.\n• 12 a 23 meses: Leche materna 30% | Alimentos 70%.\n• Regla de oro: Hasta el año de vida, la leche sigue siendo la fuente calórica y de nutrientes principal o equivalente.",
        slideImage: "assets/slides/u5_proporcion_leche_alimentos.png",
        slideCaption: "Diapositiva Oficial: Tabla de Proporción Calórica (Leche Materna vs Alimentos)",
        keyPoints: [
          "6-8 meses: 60-70% leche / 30-40% alimentos",
          "9-11 meses: 40-45% leche / 55-60% alimentos",
          "12-23 meses: 30% leche / 70% alimentos"
        ],
        keywords: ["proporción", "leche materna", "alimentos", "70%", "30%", "60%", "40%", "porcentajes"]
      },
      {
        id: "u5_3",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u5_3.mp3",
        profAudioDuration: "1:35",
        deck: "u5_p1",
        question: "¿Cuáles son las 5 etapas progresivas de consistencia de los alimentos según el cuadro de la cátedra?",
        hint: "Puré procesado a los 6m hasta comida familiar al año.",
        answer: "• 1. Semisólidos 1 (6 meses): Puré procesado / pisado suave sin grumos.\n• 2. Semisólidos 2 (7 a 8 meses): Alimentos desmenuzados o picados finitos.\n• 3. Finger Foods (8 a 9 meses): Bastoncitos blandos que el bebé toma con la mano.\n• 4. Alimentos cortados y servidos en el plato (9 a 10 meses): Trozos blandos pequeños.\n• 5. Consistencia Familiar (desde el año / 12 meses): Mesa familiar.",
        slideImage: "assets/slides/u5_consistencias_5_etapas.png",
        slideCaption: "Diapositiva Oficial: Las 5 Etapas de Consistencia de los Alimentos",
        keyPoints: [
          "1. Semisólidos 1 (6m): puré procesado",
          "2. Semisólidos 2 (7-8m): desmenuzados",
          "3. Finger Foods (8-9m): bastones blandos",
          "4. Trozos en plato (9-10m)",
          "5. Mesa familiar (desde 12m)"
        ],
        keywords: ["consistencias", "semisólidos", "puré", "desmenuzados", "finger foods", "familiar", "etapas"]
      },
      {
        id: "u5_4",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
        profAudio: "assets/audio_profesora/profe_u5_4.mp3",
        profAudioDuration: "2:12",
        deck: "u5_p1",
        question: "¿Qué alimentos se incorporan a los 6 meses vs a los 7 meses según la tabla oficial de la cátedra?",
        hint: "A los 6m frutas y verduras básicas, aceite crudo y yema; carnes rojas y pollo entran a los 7m.",
        answer: "• A los 6 meses:\n  - Frutas: Manzana, pera, banana madura (sin centro).\n  - Vegetales: Zapallo, coreano, zanahoria (sin centro), papa, batata, palta.\n  - Cereales sin TACC: Almidón de maíz, harina de arroz.\n  - Grasas y proteínas: Aceite crudo (maíz/girasol), quesos untables, yema de huevo cocida.\n• A los 7 meses:\n  - Carnes: Vaca y pollo bien cocidos y desmenuzados (hierro hemo).\n  - Verduras verdes: Acelga, espinaca, zapallito verde sin semillas.\n  - Frutas: Durazno, damasco; quesos blandos.",
        slideImage: "assets/slides/u5_cronograma_introduccion.png",
        slideCaption: "Diapositiva Oficial: Tabla de Introducción Progresiva de Alimentos",
        keyPoints: [
          "6 meses: manzana, pera, banana, zapallo, papa, palta, aceite, yema cocida",
          "7 meses: carnes de vaca y pollo, acelga, espinaca, zapallito, durazno"
        ],
        keywords: ["introducción", "6 meses", "7 meses", "carnes", "yema", "banana", "zapallo", "pollo"]
      }
    ]
  },

  u5_p2: {
    id: "u5_p2",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
    unidad: 5,
    parcial: 10,
    unitTitle: "UNIDAD 5: Alimentación Complementaria",
    title: "Parcial 10 · BLW, Seguridad, Alimentos Prohibidos y Asfixia",
    subtitle: "Reglas BLW, prohibición de miel/azúcar/sal, SUH por carne picada y alimentos esféricos",
    badge: "Unidad 5 · Módulo 2",
    icon: "fa-triangle-exclamation",
    cards: [
      {
        id: "u5_5",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u5_5.mp3",
        profAudioDuration: "1:13",
        deck: "u5_p2",
        question: "¿A partir de qué edad se permiten la Miel, el Azúcar, la Sal y la Carne Picada y cuál es la justificación de cada una?",
        hint: "Miel >2 años (o >1), Azúcar >2 años, Sal >1 año, Carne molida >5 años.",
        answer: "• Miel: Después de los 2 años (mínimo 1 año) $\\rightarrow$ Riesgo letal de BOTULISMO del lactante (*Clostridium botulinum*).\n• Azúcar agregada: Después de los 2 años $\\rightarrow$ Previene alteración del umbral del dulzor, caries y síndrome metabólico.\n• Sal agregada: Después del año $\\rightarrow$ Protege la función renal inmadura de la sobrecarga de sodio.\n• Carne Molida / Picada: A partir de los 5 AÑOS $\\rightarrow$ Prevención estricta de SÍNDROME URÉMICO HEMOLÍTICO (SUH) por *E. coli* productora de toxina Shiga.",
        slideImage: "assets/slides/u5_alimentos_atencion_prohibidos.png",
        slideCaption: "Diapositiva Oficial: Tabla de 'Atención' — Alimentos Prohibidos y Edades de Seguridad",
        keyPoints: [
          "Miel: > 2 años por riesgo de botulismo",
          "Azúcar: > 2 años (umbral del dulzor y caries)",
          "Sal: > 1 año por sobrecarga renal",
          "Carne picada: a partir de los 5 AÑOS por prevención de SUH"
        ],
        keywords: ["miel", "botulismo", "azúcar", "sal", "carne molida", "5 años", "SUH", "síndrome urémico hemolítico"]
      },
      {
        id: "u5_6",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u5_6.mp3",
        profAudioDuration: "1:21",
        deck: "u5_p2",
        question: "¿Cuáles son los 'Alimentos Esféricos' de máximo riesgo de atragantamiento y cómo deben ofrecerse con seguridad?",
        hint: "Uvas, tomates cherry, aceitunas, frutos secos; deben cortarse longitudinalmente.",
        answer: "• Alimentos esféricos de riesgo: Uvas, arándanos, aceitunas, tutucas, pochoclos, frutos secos enteros, trozos duros de zanahoria cruda, caramelos duros.\n• Por qué son peligrosos: Tienen el diámetro exacto de la vía aérea del lactante, actuando como un 'tapón' asfíctico hermético.\n• Adaptación segura: Deben cortarse SIEMPRE longitudinalmente (a lo largo) en cuartos (no en rodajas transversales) y los frutos secos ofrecerse únicamente molidos o en pastas.",
        slideImage: "assets/slides/u5_alimentos_esfericos_asfixia.png",
        slideCaption: "Diapositiva Oficial: Lista Crítica de Alimentos Esféricos con Riesgo de Asfixia",
        keyPoints: [
          "Uvas, aceitunas, pochoclos, frutos secos, zanahoria cruda",
          "Taponan herméticamente la vía aérea",
          "Cortar siempre longitudinalmente en 4; frutos secos molidos"
        ],
        keywords: ["esféricos", "uvas", "aceitunas", "asfixia", "atragantamiento", "pochoclos", "longitudinal"]
      },
      {
        id: "u5_7",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        profAudio: "assets/audio_profesora/profe_u5_7.mp3",
        profAudioDuration: "0:57",
        deck: "u5_p2",
        question: "¿Qué es el método BLW (Baby-Led Weaning) y cuáles son las 6 pautas de seguridad obligatorias?",
        hint: "Autorregulación del bebé, postura erguida, arcada normal vs ahogo.",
        answer: "• Definición: Alimentación autorregulada guiada por el bebé mediante trozos blandos que toma con sus manos.\n• 6 Pautas de Seguridad:\n  1. Bebé sentado a 90° y erguido (nunca recostado).\n  2. Nunca forzar ni meter comida en su boca (él decide).\n  3. Textura blanda (que se aplaste entre pulgar e índice).\n  4. Sin distracciones (cero pantallas, tablets o TV).\n  5. Mantener la calma ante arcadas fisiológicas (reflejo de extrusión protector; no intervenir con pánico).\n  6. NUNCA dejar al bebé solo mientras come.",
        slideImage: "assets/slides/u5_blw_seguridad_pautas.png",
        slideCaption: "Diapositiva Oficial: Recomendaciones para Practicar BLW de Manera Segura",
        keyPoints: [
          "Bebé sentado y erguido",
          "Nunca forzar ni introducir comida por él",
          "Textura que se deshaga con los dedos",
          "Diferenciar arcada fisiológica de atragantamiento",
          "Supervisión adulta constante e ininterrumpida"
        ],
        keywords: ["BLW", "Baby-Led Weaning", "seguridad", "erguido", "arcadas", "supervisión", "autonomía"]
      },
      {
        id: "u5_8",
        importance: "medium",
        importanceLabel: "⭐ Concepto Clínico",
        profAudio: "assets/audio_profesora/profe_u5_8.mp3",
        profAudioDuration: "1:16",
        deck: "u5_p2",
        question: "¿Qué es la 'Alimentación Perceptiva' y cuáles son sus 3 pasos fundamentales?",
        hint: "Reciprocidad entre las señales del niño y la respuesta predecible del cuidador.",
        answer: "• Definición: Práctica que fomenta que el niño coma de manera autónoma respondiendo a sus señales fisiológicas de hambre y saciedad en un marco de reciprocidad y apoyo emocional.\n• Los 3 Pasos:\n  1. El niño emite señales claras de hambre o saciedad (gestos motores, expresiones, vocalizaciones).\n  2. El cuidador reconoce esas señales y responde oportunamente y con calidez.\n  3. El niño experimenta una respuesta afectiva predecible a sus señales, fortaleciendo la autorregulación.",
        slideImage: "assets/slides/u5_alimentacion_perceptiva_3pasos.png",
        slideCaption: "Diapositiva Oficial: Los 3 Pasos de la Alimentación Perceptiva",
        keyPoints: [
          "Reciprocidad y respeto por señales de saciedad",
          "Paso 1: niño emite señales",
          "Paso 2: cuidador reconoce y responde cálidamente",
          "Paso 3: niño experimenta respuesta predecible"
        ],
        keywords: ["alimentación perceptiva", "3 pasos", "reciprocidad", "señales", "hambre", "saciedad", "autorregulación"]
      }
    ]
  }
,
  // ==========================================================================
  // MÓDULO PRÁCTICO: TALLER DE MAMADERAS & GRÁFICAS GESTACIONALES (CALVO / IOM)
  // ==========================================================================
  pract_1: {
    id: "pract_1",
    importance: "high",
    importanceLabel: "🔥 Foco de Examen",
    unidad: "P",
    parcial: 11,
    unitTitle: "MÓDULO PRÁCTICO: Taller de Mamaderas y Curvas Gestacionales",
    title: "Parcial 11 · Taller de Mamaderas y Curvas Calvo / IOM",
    subtitle: "Puntos críticos de reconstitución de biberones y valoración antropométrica gestacional",
    badge: "Módulo Práctico · Taller Clínico",
    icon: "fa-bottle-droplet",
    cards: [
      {
        id: "pract_1",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        deck: "pract_1",
        question: "¿Cuáles son los 7 pasos secuenciales para preparar correctamente una mamadera de fórmula infantil según el taller de la cátedra?",
        hint: "Desde hervir el agua hasta alimentar y desechar sobrantes.",
        answer: "• Paso 1: Hervir agua potable fresca durante al menos 1 minuto (nunca re-hervida).\n• Paso 2: Enfriar a ~70 °C (no más de 30 minutos enfriándose).\n• Paso 3: Verter el agua caliente PRIMERO en la mamadera sobre superficie plana a la altura de los ojos.\n• Paso 4: Añadir el polvo con la cuchara de la lata, siempre al ras sin compactar (1 medida / 30 ml).\n• Paso 5: Mezclar con suavidad rotando entre las palmas (nunca agitar como coctelera).\n• Paso 6: Enfriar bajo canilla a temperatura corporal (~37 °C) y probar en cara interna de muñeca.\n• Paso 7: Ofrecer de inmediato y descartar cualquier sobrante a los 60 minutos de iniciada la toma.",
        slideImage: "assets/slides/pract_mamadera_agua_primero.png",
        slideCaption: "Taller Práctico: Protocolo y Paso a Paso para la Preparación Segura de Mamaderas",
        keyPoints: [
          "7 pasos secuenciales y estandarizados",
          "Agua a 70 °C colocada SIEMPRE PRIMERO",
          "1 cacito al ras por cada 30 ml de agua sin compactar",
          "Rotar entre palmas (evitar espuma/aerofagia)",
          "Regla de la 1 hora para descarte del sobrante"
        ],
        keywords: ["7 pasos", "mamadera", "70 grados", "agua primero", "cacito al ras", "rotar", "descarte 1 hora"]
      },
      {
        id: "pract_2",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        deck: "pract_1",
        question: "¿Por qué el agua debe estar a aproximadamente 70 °C al momento de disolver la fórmula en polvo y qué riesgo tiene esperar más de 30 minutos?",
        hint: "Las fórmulas en polvo no son estériles; recuerda la bacteria patógena Cronobacter.",
        answer: "• Fundamento bactericida: La leche en polvo NO es estéril. El agua a 70 °C destruye bacterias patógenas oportunistas graves como Cronobacter sakazakii y Salmonella enterica sin dañar los nutrientes.\n• Límite de 30 minutos: Si el agua hervida se deja enfriar más de 30 min, la temperatura cae por debajo de 70 °C y pierde su capacidad bactericida, permitiendo la proliferación bacteriana.",
        slideImage: "assets/slides/pract_mamadera_agua_70c.png",
        slideCaption: "Taller Práctico: Temperatura Bactericida de 70 °C para Reconstitución de Fórmulas",
        keyPoints: [
          "Fórmulas en polvo no son estériles",
          "70 °C destruye Cronobacter sakazakii y Salmonella",
          "Máximo 30 minutos de enfriamiento para no perder eficacia térmica"
        ],
        keywords: ["70 grados", "Cronobacter sakazakii", "Salmonella", "no estéril", "30 minutos", "bactericida"]
      },
      {
        id: "pract_3",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        deck: "pract_1",
        question: "¿Por qué el agua debe colocarse SIEMPRE PRIMERO en la mamadera y qué consecuencia clínica grave tiene colocar el polvo antes?",
        hint: "Principio de desplazamiento de volumen e hiperosmolaridad renal.",
        answer: "• Regla innegociable: El agua se coloca primero sobre superficie plana y leída a la altura de los ojos para garantizar el volumen exacto.\n• Consecuencia clínica de poner el polvo antes:\n  1. El polvo desplaza volumen y falsea la lectura, ingresando menos agua de la requerida.\n  2. Genera una fórmula hiperconcentrada con elevadísima osmolaridad.\n  3. Conduce a deshidratación hipernatrémica grave, sobrecarga renal de solutos (falla renal aguda) y constipación.",
        slideImage: "assets/slides/pract_mamadera_agua_primero.png",
        slideCaption: "Taller Práctico: Regla de Oro del Agua Primero y Lectura del Menisco a la Altura de los Ojos",
        keyPoints: [
          "Agua siempre primero sobre superficie plana a la altura de los ojos",
          "Polvo antes genera fórmula hiperconcentrada",
          "Riesgo de deshidratación hipernatrémica y sobrecarga renal de solutos"
        ],
        keywords: ["agua primero", "superficie plana", "ojos", "hiperconcentrada", "deshidratación hipernatrémica", "sobrecarga renal"]
      },
      {
        id: "pract_4",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        deck: "pract_1",
        question: "¿Cómo debe realizarse la medición del polvo con el cacito y cuál es la proporción estándar de dilución?",
        hint: "Medidas al ras, enrase sin comprimir, 1 medida por onza.",
        answer: "• Medición: Utilizar exclusivamente la cuchara de la lata. Cargar y enrasar al ras con el lomo de un cuchillo limpio o reborde, sin presionar ni compactar el polvo.\n• Proporción estándar: 1 medida (cacito) al ras por cada 30 ml (1 onza) de agua.\n• Dilución resultante: ~13.5% a 15% según el gramaje del cacito (4.5g a 5g de polvo por medida).",
        slideImage: "assets/slides/pract_mamadera_medida_polvo.png",
        slideCaption: "Taller Práctico: Técnica de Medida al Ras sin Compactar (1 medida / 30 ml de agua)",
        keyPoints: [
          "Cuchara dosificadora de la lata",
          "Medidas al ras sin compactar ni comprimir",
          "1 medida por cada 30 ml de agua (dilución estándar ~13.5%)"
        ],
        keywords: ["cacito", "al ras", "sin presionar", "1 medida por 30 ml", "13.5%", "cuchara medidora"]
      },
      {
        id: "pract_5",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        deck: "pract_1",
        question: "¿Por qué está terminantemente prohibido agitar la mamadera con violencia como una coctelera y cuál es el movimiento correcto?",
        hint: "Incorporación de aire, microburbujas y sintomatología digestiva del lactante.",
        answer: "• Prohibido agitar como coctelera: El batido violento atrapa aire y genera una densa espuma con microburbujas que el lactante deglute junto a la leche.\n• Consecuencia clínica: Produce aerofagia severa, meteorismo, distensión abdominal y cólicos intensos del lactante.\n• Movimiento correcto: Cerrar y hacer rotar la mamadera suavemente entre las palmas de las manos o con giros circulares suaves hasta disolver los grumos.",
        slideImage: "assets/slides/pract_mamadera_agua_primero.png",
        slideCaption: "Taller Práctico: Mezclado Suave por Rotación Palmar para Evitar Aerofagia y Cólicos",
        keyPoints: [
          "Prohibido agitar vigorosamente como coctelera",
          "Genera microburbujas y espuma que causan aerofagia y cólicos",
          "Movimiento correcto: rotación suave entre las palmas de las manos"
        ],
        keywords: ["coctelera", "burbujas", "espuma", "aerofagia", "cólicos", "rotar entre palmas"]
      },
      {
        id: "pract_6",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        deck: "pract_1",
        question: "¿Cuál es la regla obligatoria respecto al sobrante de leche en la mamadera una vez iniciada la toma?",
        hint: "Tiempo máximo de seguridad biológica y riesgo de contaminación salival.",
        answer: "• Regla de los 60 minutos: Cualquier resto de leche que quede en la mamadera 1 hora después de haber comenzado la toma debe ser DESECHADO de inmediato.\n• Prohibición absoluta: NUNCA se guarda en la heladera, NUNCA se recalienta, NUNCA se completa con fórmula fresca y NUNCA se ofrece en la siguiente toma.\n• Fundamento microbiológico: Al succionar, la saliva del bebé ingresa a la mamadera colonizando la leche tibia, que actúa como un caldo de cultivo ideal para la proliferación acelerada de bacterias.",
        slideImage: "assets/slides/pract_mamadera_descarte.png",
        slideCaption: "Taller Práctico: Regla de Oro del Descarte a los 60 Minutos sin Reutilización",
        keyPoints: [
          "Descartar sobrante a la hora (60 min) de iniciada la toma",
          "Prohibido guardar, recalentar o reutilizar",
          "Contaminación salival convierte la leche tibia en caldo de cultivo bacteriano"
        ],
        keywords: ["descarte", "sobrante", "1 hora", "60 minutos", "saliva", "caldo de cultivo", "no reutilizar"]
      },
      {
        id: "pract_7",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        deck: "pract_1",
        question: "¿Qué evalúa la Gráfica de Calvo et al. (2009) en la mujer embarazada y cuáles son sus puntos de corte en desvíos estándar (SD)?",
        hint: "Referencia nacional argentina, semanas 6 a 42, puntajes Z.",
        answer: "• Qué evalúa: El Índice de Masa Corporal (IMC) materno en relación directa con la Edad Gestacional (semanas 6 a 42), basado en población sana de Argentina.\n• Puntos de corte en Desvíos Estándar (SD):\n  • < -1 SD: Bajo peso / Desnutrición gestacional.\n  • -1 SD a +1 SD: Eunutrición / Rango normal saludable.\n  • > +1 SD a +2 SD: Sobrepeso gestacional.\n  • > +2 SD: Obesidad gestacional.",
        slideImage: "assets/slides/pract_calvo_curva_imc.png",
        slideCaption: "Gráfica Oficial de Calvo et al. (2009): IMC materno según Edad Gestacional (Semanas 6 a 42)",
        keyPoints: [
          "Evalúa IMC para la Edad Gestacional (semanas 6 a 42)",
          "Referencia nacional argentina (Calvo et al., 2009)",
          "Puntos de corte: < -1 SD (Bajo peso), -1 a +1 SD (Normal), > +1 SD (Sobrepeso), > +2 SD (Obesidad)"
        ],
        keywords: ["Calvo", "IMC gestacional", "semanas 6 a 42", "argentina", "-1 SD", "+1 SD", "+2 SD", "desnutrición"]
      },
      {
        id: "pract_8",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        deck: "pract_1",
        question: "¿Para qué le sirve al Licenciado en Nutrición utilizar la Gráfica de Calvo et al. en la consulta clínica prenatal?",
        hint: "Diagnóstico actual transversal, canal de crecimiento longitudinal y predicción de riesgo perinatal.",
        answer: "• 1. Diagnóstico puntual en cualquier momento: Clasifica el estado nutricional de la gestante aun si se desconoce el peso pregestacional exacto o en captaciones tardías.\n• 2. Evaluación de trayectoria longitudinal: Permite monitorear si la paciente mantiene su canal de crecimiento armónico o si cruza percentiles.\n• 3. Predicción de riesgos perinatales:\n  • < -1 SD: Alerta de RCIU, bajo peso al nacer (<2500 g) y prematurez.\n  • > +1 SD: Alerta de macrosomía (>4000 g), diabetes gestacional, preeclampsia y cesáreas.",
        slideImage: "assets/slides/pract_calvo_utilidad_clinica.png",
        slideCaption: "Utilidad Clínica de Calvo: Diagnóstico en Cualquier Semana y Predicción Perinatal",
        keyPoints: [
          "Diagnóstico sin requerir peso pregestacional exacto",
          "Seguimiento longitudinal del canal de crecimiento",
          "Predice RCIU (< -1 SD) y macrosomía/preeclampsia (> +1 SD)"
        ],
        keywords: ["utilidad Calvo", "diagnóstico puntual", "trayectoria", "canal", "RCIU", "macrosomía", "riesgo perinatal"]
      },
      {
        id: "pract_9",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        deck: "pract_1",
        question: "¿Qué evalúan las pautas del IOM (2009) y cuáles son las metas de ganancia de peso total y semanal según el IMC pregestacional?",
        hint: "Kilos totales y g/semana en 2° y 3° trimestre según normopeso, bajo peso, sobrepeso u obesidad previa.",
        answer: "• Qué evalúa: La meta de ganancia ponderal en kilogramos (total y semanal en 2°-3°T) según el IMC previo al embarazo:\n  • Bajo peso (< 18.5): 12.5 a 18 kg totales (0.44 - 0.58 kg/sem).\n  • Normal (18.5 - 24.9): 11.5 a 16 kg totales (0.35 - 0.50 kg/sem).\n  • Sobrepeso (25.0 - 29.9): 7 a 11.5 kg totales (0.23 - 0.33 kg/sem).\n  • Obesidad (≥ 30.0): 5 a 9 kg totales (0.17 - 0.27 kg/sem).\n• 1° Trimestre para todas: Ganancia leve de 0.5 a 2.0 kg.",
        slideImage: "assets/slides/pract_iom_metas_peso.png",
        slideCaption: "Pautas IOM (2009): Ganancia de Peso Gestacional Total y Semanal según IMC Previo",
        keyPoints: [
          "Metas en kg según IMC pregestacional",
          "Bajo peso: 12.5-18 kg; Normal: 11.5-16 kg; Sobrepeso: 7-11.5 kg; Obesidad: 5-9 kg",
          "Tasa semanal 2°-3°T: Normal ~0.4 kg/sem, Bajo ~0.5 kg/sem, Obeso ~0.22 kg/sem"
        ],
        keywords: ["IOM", "ganancia de peso", "IMC pregestacional", "11.5 a 16 kg", "tasa semanal", "segundo trimestre", "tercer trimestre"]
      },
      {
        id: "pract_10",
        importance: "high",
        importanceLabel: "🔥 Foco de Examen",
        deck: "pract_1",
        question: "¿Para qué le sirve al nutricionista el IOM y cómo se complementa clínicamente con la Gráfica de Calvo?",
        hint: "¿Dónde está hoy vs cuánto y a qué ritmo debe subir?",
        answer: "• Utilidad del IOM: Permite fijar la meta terapéutica en kilogramos a alcanzar al parto, vigilar la tasa de aumento semanal y calcular el superávit energético (+340 kcal/d en 2°T, +452 kcal/d en 3°T).\n• Complementariedad clínica:\n  • Calvo responde: '¿DÓNDE ESTÁ HOY LA EMBARAZADA?' (Diagnóstico de situación nutricional actual según su edad gestacional).\n  • IOM responde: '¿CUÁNTO Y A QUÉ RITMO DEBE SUBIR DE PESO HASTA EL PARTO?' (Meta cuantitativa y velocidad ponderal según su punto de partida).",
        slideImage: "assets/slides/pract_calvo_vs_iom_cuadro.png",
        slideCaption: "Cuadro de Complementariedad Clínica: Calvo (Diagnóstico Actual) vs. IOM (Meta y Ritmo)",
        keyPoints: [
          "IOM fija la meta en kg y velocidad semanal para graduar el superávit de kcal",
          "Calvo define la situación nutricional actual y canal de percentiles",
          "Calvo = ¿Dónde está hoy? | IOM = ¿Cuánto y cómo debe subir?"
        ],
        keywords: ["complementariedad", "Calvo vs IOM", "dónde está hoy", "cuánto debe subir", "meta en kg", "superávit calórico"]
      }
    ]
  }
};

window.FLASHCARDS_DECKS = FLASHCARDS_DECKS;

