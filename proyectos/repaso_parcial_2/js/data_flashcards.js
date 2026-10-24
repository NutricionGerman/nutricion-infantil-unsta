/**
 * BANCO INTEGRAL DE FLASHCARDS & EXÁMENES ORALES
 * Cátedra de Nutrición Infantil UNSTA - 2° Parcial Teórico
 * Organizado en 3 Unidades y 6 Parciales Oficiales (2 por Unidad):
 * - UNIDAD 5: Dietas Basadas en Plantas en Pediatría (Parcial 1 y Parcial 2)
 * - UNIDAD 6: Crecimiento y Alimentación en Etapas del Desarrollo (Parcial 3 y Parcial 4)
 * - UNIDAD 7: Situaciones Especiales en Adolescencia y Deporte (Parcial 5 y Parcial 6)
 */

const FLASHCARDS_DECKS = {
  // ==========================================================================
  // UNIDAD 5: DIETAS BASADAS EN PLANTAS EN PEDIATRÍA
  // ==========================================================================
  u5_p1: {
    id: "u5_p1",
    unidad: 5,
    parcial: 1,
    unitTitle: "UNIDAD 5: Dietas Basadas en Plantas",
    title: "Parcial 1 · Patrones, Grupos y Complementación Proteica",
    subtitle: "Definiciones, 6 grupos elementales, mito proteico y pool de aminoácidos",
    badge: "Unidad 5 · Nivel 1",
    icon: "fa-seedling",
    cards: [
      {
        id: "u5_1",
        deck: "u5_p1",
        question: "¿Cómo se definen y diferencian los 4 patrones principales basados en plantas en pediatría (Ovolactovegetariano, Lactovegetariano, Ovovegetariano y Vegano)?",
        hint: "Identifica qué alimentos de origen animal incluye o excluye cada uno.",
        answer: "Ovolactovegetariano: Excluye carnes y pescados, pero incluye huevos y lácteos.\nLactovegetariano: Incluye lácteos; no consume huevo ni carnes.\nOvovegetariano: Incluye huevos; no consume lácteos ni carnes.\nVegetariano Estricto o Vegano: 100% de origen vegetal (excluye carnes, lácteos, huevos y miel).",
        source: "Documento Cátedra: Planificación y Manejo de Dietas Basadas en Plantas en Pediatría",
        tags: ["patrones", "definición", "vegetariano", "vegano"],
        keyPoints: [
          "Ovolactovegetariano: incluye huevo y lácteos",
          "Lactovegetariano: incluye lácteos, sin huevo",
          "Ovovegetariano: incluye huevo, sin lácteos",
          "Vegano/Estricto: 100% vegetal (sin carnes, lácteos, huevos ni miel)"
        ],
        keywords: ["ovolactovegetariano", "lactovegetariano", "ovovegetariano", "vegano", "estricto", "huevos", "lácteos", "carnes", "miel", "origen vegetal"]
      },
      {
        id: "u5_2",
        deck: "u5_p1",
        question: "¿Cuáles son los 6 grupos alimentarios elementales que deben rotar a diario en una dieta pediátrica basada en plantas para evitar el vegetarianismo chatarra?",
        hint: "Son 6 pilares de alimentos enteros y nutritivos.",
        answer: "Los 6 grupos elementales son:\n1. Legumbres y derivados (lentejas, garbanzos, porotos, arvejas, soja, tofu).\n2. Cereales y granos enteros (avena, maíz, quinoa, arroz integral, mijo).\n3. Frutos secos y semillas molidas (nueces, almendras, maní, calabaza, sésamo).\n4. Semillas fuente de omega-3 (chía molida y lino molido).\n5. Verduras y hortalizas (hojas verdes oscuras, brócoli, zanahoria, tomate).\n6. Frutas frescas y secas (cítricos, kiwi, banana, higos, ciruelas desecadas).",
        source: "Documento Cátedra: Planificación y Manejo de Dietas Basadas en Plantas en Pediatría",
        tags: ["grupos alimentarios", "rotación", "variedad"],
        keyPoints: [
          "1. Legumbres y derivados",
          "2. Cereales y granos enteros",
          "3. Frutos secos y semillas",
          "4. Semillas de lino y chía molidas",
          "5. Verduras y hortalizas",
          "6. Frutas frescas y desecadas"
        ],
        keywords: ["legumbres", "cereales", "frutos secos", "semillas", "chía", "lino", "verduras", "frutas", "6 grupos"]
      },
      {
        id: "u5_3",
        deck: "u5_p1",
        question: "¿Por qué es un mito la supuesta deficiencia proteica en niños vegetarianos cuando se cubren las calorías totales?",
        hint: "Relación entre suficiencia energética de alimentos enteros y gramos de proteína.",
        answer: "La evidencia demuestra que cuando un niño cubre sus requerimientos calóricos totales consumiendo una variedad de alimentos enteros (legumbres, cereales integrales, semillas y frutos secos), los requerimientos proteicos cuantitativos se cubren con holgura. Las proteínas vegetales contienen todos los aminoácidos esenciales.",
        source: "Documento Cátedra: Planificación y Manejo de Dietas Basadas en Plantas en Pediatría",
        tags: ["proteínas", "mito", "calorías"],
        keyPoints: [
          "Al cubrir las calorías totales se cubren las proteínas cuantitativas",
          "Los vegetales contienen todos los aminoácidos esenciales",
          "La variedad de alimentos enteros asegura suficiencia"
        ],
        keywords: ["mito", "calorías", "requerimientos proteicos", "variedad", "alimentos enteros", "aminoácidos esenciales"]
      },
      {
        id: "u5_4",
        deck: "u5_p1",
        question: "¿Cuáles son los aminoácidos limitantes en cereales y en legumbres, y cómo se complementan metabólicamente?",
        hint: "Piensa en lisina y metionina, y en el pool de aminoácidos circulante.",
        answer: "En los cereales (arroz, trigo, maíz, avena), el aminoácido limitante es la LISINA (son ricos en metionina y cisteína).\nEn las legumbres (lentejas, garbanzos, porotos, arvejas), el aminoácido limitante es la METIONINA (son ricas en lisina).\nAmbos grupos se complementan metabólicamente a lo largo del día a través del pool plasmático de 12 a 24 horas, desterrando el mito de que se deben combinar en el mismo plato para 'elevar el valor biológico'.",
        source: "Documento Cátedra: Planificación y Manejo de Dietas Basadas en Plantas en Pediatría",
        tags: ["aminoácidos limitantes", "lisina", "metionina", "complementación", "pool"],
        keyPoints: [
          "Cereales: aminoácido limitante Lisina (ricos en Metionina y Cisteína)",
          "Legumbres: aminoácido limitante Metionina (ricas en Lisina)",
          "Complementación metabólica a lo largo del día vía pool plasmático de 12-24h (el concepto de 'elevar el valor biológico' en el plato es un mito superado)"
        ],
        keywords: ["lisina", "metionina", "limitante", "cereales", "legumbres", "cisteína", "complementación", "pool", "mito"]
      },
      {
        id: "u5_5",
        deck: "u5_p1",
        question: "¿Qué establece la 'Regla de Oro Clínica' respecto a la complementación proteica en el mismo plato o comida?",
        hint: "Tiene que ver con el pool de aminoácidos y el tiempo biológico de recirculación.",
        answer: "Establece que NO es necesario combinar legumbres y cereales en el mismo plato ni en la misma comida. El organismo humano mantiene un pool plasmático e intrahepático de aminoácidos libres que recircula y permanece disponible durante 12 a 24 horas, permitiendo la complementación metabólica a lo largo del día.",
        source: "Documento Cátedra: Planificación y Manejo de Dietas Basadas en Plantas en Pediatría",
        tags: ["pool aminoácidos", "regla de oro", "metabolismo"],
        keyPoints: [
          "No es necesario combinarlos en la misma comida ni plato",
          "Existe un pool plasmático y hepático de aminoácidos libres",
          "El pool recircula durante 12 a 24 horas"
        ],
        keywords: ["mismo plato", "pool", "plasmático", "12 a 24 horas", "hepático", "recircula", "aminoácidos libres"]
      },
      {
        id: "u5_6",
        deck: "u5_p1",
        question: "¿Cuál es la postura oficial de la Academy of Nutrition and Dietetics (AND) y la Sociedad Argentina de Pediatría (SAP) sobre las dietas vegetarianas en la infancia?",
        hint: "Revisar viabilidad en todas las etapas y el rol de la planificación y la B12.",
        answer: "Tanto la AND como la SAP sostienen que las dietas vegetarianas y veganas adecuadamente planificadas son nutricionalmente completas, seguras y saludables para todas las etapas del ciclo vital (incluyendo embarazo, lactancia, infancia y adolescencia), sosteniendo un crecimiento y desarrollo normales siempre que cuenten con la suplementación oportuna y obligatoria de Vitamina B12.",
        source: "Consensos AND (EE.UU.) y SAP (Comité de Nutrición)",
        tags: ["posturas oficiales", "AND", "SAP", "consenso"],
        keyPoints: [
          "Son saludables y nutricionalmente completas si están bien planificadas",
          "Aptas en todas las etapas del ciclo vital (embarazo, lactancia, infancia)",
          "Sostienen crecimiento normal",
          "Suplementación obligatoria de Vitamina B12"
        ],
        keywords: ["AND", "SAP", "adecuadamente planificadas", "ciclo vital", "crecimiento normal", "suplementación obligatoria", "vitamina B12"]
      },
      {
        id: "u5_7",
        deck: "u5_p1",
        question: "¿Cuál debe ser el rol del Licenciado en Nutrición ante una familia que decide adoptar un patrón basado en plantas para su hijo?",
        hint: "Acompañamiento profesional vs juzgar o disuadir.",
        answer: "El rol profesional es acompañar y asesorar a la familia con respeto y fundamentación científica, sin juzgar ni crear temores infundados. Debe optimizar la densidad calórica y de nutrientes, educar en técnicas culinarias facilitadoras, vigilar el crecimiento pediátrico y asegurar la suplementación farmacológica obligatoria de Vitamina B12.",
        source: "Documento Cátedra: Planificación y Manejo de Dietas Basadas en Plantas en Pediatría",
        tags: ["rol profesional", "ética", "consulta"],
        keyPoints: [
          "Acompañar y respetar la decisión de la familia",
          "No juzgar ni infundir temores sin evidencia",
          "Optimizar densidad de nutrientes y técnicas culinarias",
          "Garantizar la suplementación de Vitamina B12"
        ],
        keywords: ["acompañar", "no juzgar", "densidad calórica", "técnicas culinarias", "suplementación", "temores"]
      },
      {
        id: "u5_8",
        deck: "u5_p1",
        question: "¿Qué riesgo presenta el exceso de fibra dietaria insoluble en niños pequeños que inician una dieta basada en plantas y cómo se previene?",
        hint: "Saciedad precoz, volumen gástrico pequeño y desplazamiento calórico.",
        answer: "El exceso de fibra de difícil digestión puede provocar saciedad precoz debido a la pequeña capacidad gástrica del niño, desplazando energía y causando déficit calórico. Se previene seleccionando alimentos con alta densidad energética (palta, frutos secos y semillas molidas, pastas de legumbres, aceites en crudo) y procesando o descascarillando legumbres.",
        source: "Documento Cátedra: Planificación y Manejo de Dietas Basadas en Plantas en Pediatría",
        tags: ["fibra", "densidad calórica", "saciedad precoz"],
        keyPoints: [
          "Capacidad gástrica pequeña y saciedad precoz",
          "Riesgo de desplazamiento calórico",
          "Aportar alimentos de alta densidad energética (semillas molidas, palta, aceites crudos)",
          "Descascarillar o procesar legumbres"
        ],
        keywords: ["fibra", "saciedad precoz", "densidad energética", "capacidad gástrica", "palta", "frutos secos molidos"]
      },
      {
        id: "u5_9",
        deck: "u5_p1",
        question: "¿Por qué los frutos secos y semillas deben ofrecerse exclusivamente molidos o en pastas en niños menores de 4 a 5 años?",
        hint: "Riesgo mecánico respiratorio pediátrico.",
        answer: "Deben ofrecerse molidos, triturados o como mantecas/pastas 100% (ej. pasta de maní o tahini) para prevenir el riesgo de atragantamiento y aspiración pulmonar por cuerpo extraño, que es una causa mayor de asfixia en la primera infancia.",
        source: "SAP y Documento Cátedra",
        tags: ["seguridad pediátrica", "atragantamiento", "frutos secos molidos"],
        keyPoints: [
          "Riesgo severo de atragantamiento y aspiración pulmonar",
          "Obligatorio molerlos, triturarlos o usarlos en pastas",
          "Pauta estricta en menores de 4 a 5 años"
        ],
        keywords: ["atragantamiento", "aspiración", "pulmonar", "molidos", "pastas", "maní", "asfixia", "4", "5 años"]
      },
      {
        id: "u5_10",
        deck: "u5_p1",
        question: "¿Cuáles son las ventajas en salud demostradas por la American Academy of Pediatrics (AAP) en niños con dietas vegetarianas bien planificadas?",
        hint: "Hábitos a largo plazo, composición corporal y factores de riesgo cardiovascular.",
        answer: "La AAP destaca que los niños con dietas basadas en plantas bien estructuradas desarrollan hábitos saludables perdurables, con mayor ingesta de frutas, verduras y fibra, menor consumo de grasas saturadas, menor prevalencia de sobrepeso/obesidad infantil y perfiles lipídicos más saludables con menor riesgo de dislipidemia futura.",
        source: "American Academy of Pediatrics (AAP)",
        tags: ["AAP", "beneficios", "prevención"],
        keyPoints: [
          "Hábitos saludables a largo plazo",
          "Mayor consumo de fibra, frutas y verduras",
          "Menor consumo de grasas saturadas",
          "Menor tasa de sobrepeso y mejores perfiles lipídicos"
        ],
        keywords: ["AAP", "hábitos saludables", "fibra", "grasas saturadas", "sobrepeso", "obesidad", "dislipidemia"]
      },
      {
        id: "u5_11",
        deck: "u5_p1",
        question: "¿Qué aminoácidos esenciales son limitantes en los frutos secos y semillas, y cuál es su aminoácido destacado?",
        hint: "Revisar la tabla de complementación aminoacídica.",
        answer: "En frutos secos y semillas, el aminoácido limitante principal suele ser la Lisina, mientras que son ricos en Metionina y Triptófano.",
        source: "Documento Cátedra: Planificación y Manejo de Dietas Basadas en Plantas en Pediatría",
        tags: ["frutos secos", "aminoácidos", "triptófano"],
        keyPoints: [
          "Limitante: Lisina",
          "Ricos en: Metionina y Triptófano"
        ],
        keywords: ["frutos secos", "semillas", "lisina", "metionina", "triptófano", "limitante"]
      }
    ]
  },

  u5_p2: {
    id: "u5_p2",
    unidad: 5,
    parcial: 2,
    unitTitle: "UNIDAD 5: Dietas Basadas en Plantas",
    title: "Parcial 2 · Micronutrientes Críticos y Suplementación de B12",
    subtitle: "Hierro férrico, facilitadores/inhibidores, zinc, calcio vegetal y protocolo B12",
    badge: "Unidad 5 · Nivel 2",
    icon: "fa-pills",
    cards: [
      {
        id: "u5_12",
        deck: "u5_p2",
        question: "¿En qué estado químico se encuentra el hierro vegetal y cómo actúa el ácido ascórbico (Vitamina C) para triplicar su absorción?",
        hint: "Férrico Fe3+ a Ferroso Fe2+ y el transportador DMT-1.",
        answer: "El hierro de origen vegetal se encuentra en estado férrico (Fe³⁺), de baja solubilidad. La Vitamina C (ácido ascórbico) actúa como un potente agente reductor, convirtiendo el Fe³⁺ a hierro ferroso (Fe²⁺), el cual es altamente soluble y absorbido eficientemente por el transportador intestinal DMT-1, triplicando su biodisponibilidad.",
        source: "Documento Cátedra: Planificación y Manejo de Dietas Basadas en Plantas en Pediatría",
        tags: ["hierro", "férrico", "ferroso", "vitamina C", "DMT-1"],
        keyPoints: [
          "Hierro vegetal está en estado férrico (Fe3+)",
          "Vitamina C lo reduce a ferroso (Fe2+)",
          "Fe2+ es soluble y se absorbe por el transportador DMT-1",
          "Triplica la absorción de hierro vegetal"
        ],
        keywords: ["férrico", "fe3+", "ferroso", "fe2+", "vitamina c", "ascórbico", "dmt-1", "reductor", "triplica"]
      },
      {
        id: "u5_13",
        deck: "u5_p2",
        question: "¿Cuáles son los 3 principales inhibidores de la absorción de hierro vegetal y qué pauta culinaria o de horario se debe aplicar para cada uno?",
        hint: "Fitatos, taninos/polifenoles y calcio.",
        answer: "1. Fitatos (en legumbres y cereales): Quelan el hierro. Pauta: remojo prolongado de 12 a 24 horas descartando el agua, y cocción adecuada.\n2. Taninos y Polifenoles (en té negro, café, mate cebado): Pauta: separarlos al menos 1,5 a 2 horas de las comidas principales.\n3. Calcio concentrado (suplementos o lácteos): Compite por el transportador DMT-1. Pauta: no consumir suplementos de calcio junto con comidas ricas en hierro vegetal.",
        source: "Documento Cátedra: Planificación y Manejo de Dietas Basadas en Plantas en Pediatría",
        tags: ["inhibidores", "fitatos", "taninos", "mate", "calcio"],
        keyPoints: [
          "Fitatos: remojo 12-24 hs descartando el agua y cocción",
          "Taninos (té, café, mate): distanciar 1.5 a 2 horas",
          "Calcio en altas concentraciones: no dar suplementos de Ca en la misma comida"
        ],
        keywords: ["fitatos", "taninos", "polifenoles", "mate", "remojo", "12 a 24 horas", "calcio", "separar", "inhibidores"]
      },
      {
        id: "u5_14",
        deck: "u5_p2",
        question: "¿Por qué la espinaca y la acelga son consideradas 'falsas fuentes de calcio' a pesar de su alto contenido en las tablas bromatológicas?",
        hint: "Oxalatos insolubles y biodisponibilidad menor al 5%.",
        answer: "Porque poseen elevadísimas concentraciones de ácido oxálico (oxalatos). Los oxalatos se unen al calcio formando cristales de oxalato de calcio insolubles que no pueden absorberse en el intestino (< 5% de absorción) y se eliminan en las heces. En cambio, verduras bajas en oxalatos como brócoli, repollo y kale tienen absorciones superiores al 50%.",
        source: "Documento Cátedra: Planificación y Manejo de Dietas Basadas en Plantas en Pediatría",
        tags: ["calcio", "oxalatos", "espinaca", "biodisponibilidad"],
        keyPoints: [
          "Alto contenido de ácido oxálico (oxalatos)",
          "Forman cristales de oxalato de calcio insolubles",
          "Absorción menor al 5%",
          "Brócoli y kale absorben > 50% por ser bajos en oxalatos"
        ],
        keywords: ["oxalatos", "espinaca", "acelga", "cristales", "insolubles", "menos de 5%", "brócoli", "biodisponibilidad"]
      },
      {
        id: "u5_15",
        deck: "u5_p2",
        question: "¿Cuáles son las técnicas culinarias recomendadas para optimizar la biodisponibilidad de Zinc en dietas basadas en plantas?",
        hint: "Tostado, germinación y masa madre.",
        answer: "El zinc es fuertemente quelado por fitatos. Para optimizar su absorción se recomienda:\n1. Tostado suave de semillas (calabaza, sésamo, girasol) antes de consumirlas.\n2. Germinación y brotado de legumbres y granos (activa fitasas endógenas).\n3. Fermentación biológica lenta o uso de masa madre en panes integrales, lo que degrada los fitatos.",
        source: "Documento Cátedra: Planificación y Manejo de Dietas Basadas en Plantas en Pediatría",
        tags: ["zinc", "fitatos", "tostado", "germinación", "masa madre"],
        keyPoints: [
          "Tostado suave de semillas",
          "Germinación y brotado de legumbres",
          "Fermentación lenta o masa madre (degrada fitatos)",
          "Activa fitasas endógenas"
        ],
        keywords: ["zinc", "tostado", "germinación", "masa madre", "fitasas", "semillas de calabaza", "degradación"]
      },
      {
        id: "u5_16",
        deck: "u5_p2",
        question: "¿Por qué las semillas de chía y lino deben consumirse trituradas o molidas en el momento para obtener Ácido Alfa-Linolénico (ALA / Omega-3)?",
        hint: "Mucílago, cáscara de celulosa y lipasas pancreáticas.",
        answer: "Las semillas de chía y lino poseen una cáscara externa dura e indigerible recubierta de mucílago. Si se consumen enteras, atraviesan el tracto gastrointestinal intactas sin que las enzimas lipasas pancreáticas puedan acceder a los lípidos internos. Al molerlas en el momento, se rompe la cutícula y se liberan los ácidos grasos omega-3.",
        source: "Documento Cátedra: Planificación y Manejo de Dietas Basadas en Plantas en Pediatría",
        tags: ["omega-3", "ALA", "chía molida", "lino"],
        keyPoints: [
          "Cáscara externa dura e indigerible (mucílago)",
          "Si están enteras atraviesan intactas el tubo digestivo",
          "Las lipasas pancreáticas no pueden acceder",
          "Al molerlas en el momento se libera el ácido alfa-linolénico (ALA)"
        ],
        keywords: ["chía", "lino", "molidas", "trituradas", "cáscara", "mucílago", "lipasas", "ala", "omega-3"]
      },
      {
        id: "u5_17",
        deck: "u5_p2",
        question: "¿Por qué la espirulina, el nori y los alimentos fermentados NO sirven como fuente de Vitamina B12 y resultan peligrosos?",
        hint: "Falsos análogos inactivos (pseudo-B12) y bloqueo de receptores.",
        answer: "Porque contienen 'análogos inactivos' o pseudo-vitamina B12 (moléculas corrinoides sin actividad biológica en humanos). Son peligrosos porque compiten y bloquean los receptores ileales de absorción de la B12 activa y, además, falsean los análisis de sangre arrojando niveles falsamente normales o elevados mientras el tejido neurológico sufre deficiencia.",
        source: "Documento Cátedra: Planificación y Manejo de Dietas Basadas en Plantas en Pediatría",
        tags: ["vitamina B12", "pseudo-B12", "espirulina", "falsos análogos"],
        keyPoints: [
          "Contienen análogos inactivos o pseudo-B12 sin actividad biológica",
          "Compiten y bloquean los receptores ileales de absorción",
          "Falsean los análisis de sangre con cifras normales ficticias",
          "No previenen el daño neurológico ni hematológico"
        ],
        keywords: ["espirulina", "nori", "pseudo-b12", "análogos inactivos", "bloquean receptores", "falsean análisis", "peligro"]
      },
      {
        id: "u5_18",
        deck: "u5_p2",
        question: "¿Cuál es la forma química de elección para la suplementación de Vitamina B12 y por qué?",
        hint: "Cianocobalamina vs metilcobalamina.",
        answer: "La forma de elección es la CIANOCOBALAMINA. Es la molécula más estable frente a la luz y temperatura, la más económica, la más ampliamente estudiada en ensayos clínicos a largo plazo y la única con posología de dosis semanal preventiva rigurosamente probada.",
        source: "Documento Cátedra: Planificación y Manejo de Dietas Basadas en Plantas en Pediatría",
        tags: ["cianocobalamina", "vitamina B12", "estabilidad"],
        keyPoints: [
          "Cianocobalamina es la molécula de elección",
          "Máxima estabilidad a la luz y calor",
          "Mayor evidencia científica y menor costo",
          "Eficacia demostrada en esquemas semanales preventivos"
        ],
        keywords: ["cianocobalamina", "elección", "estable", "económica", "semanal", "evidencia"]
      },
      {
        id: "u5_19",
        deck: "u5_p2",
        question: "¿Cuál es el esquema pediátrico de suplementación semanal preventiva de Vitamina B12 (Cianocobalamina) según grupo de edad?",
        hint: "6-12m: 250 mcg; 1-3a: 250 mcg; 4-8a: 500 mcg; 9-13a: 1000 mcg; >=14a: 2000 mcg.",
        answer: "Esquema semanal con Cianocobalamina:\n- Lactantes 6 a 12 meses: 250 µg / semana.\n- Niños de 1 a 3 años: 250 µg / semana.\n- Niños de 4 a 8 años: 500 µg / semana.\n- Niños de 9 a 13 años: 1000 µg / semana.\n- Adolescentes ≥ 14 años y Adultos: 2000 µg / semana (o 1000 µg dos veces por semana).",
        source: "Documento Cátedra: Planificación y Manejo de Dietas Basadas en Plantas en Pediatría",
        tags: ["dosis B12", "pediatría", "cianocobalamina", "semanal"],
        keyPoints: [
          "6 a 3 años: 250 µg / semana",
          "4 a 8 años: 500 µg / semana",
          "9 a 13 años: 1000 µg / semana",
          "≥ 14 años y adultos: 2000 µg / semana"
        ],
        keywords: ["250", "500", "1000", "2000", "semana", "semanal", "microgramos", "µg", "dosis", "edad"]
      },
      {
        id: "u5_20",
        deck: "u5_p2",
        question: "¿Por qué las dosis semanales de Vitamina B12 son matemáticamente mucho mayores a los requerimientos diarios?",
        hint: "Factor Intrínseco saturable (1.5 mcg) y difusión pasiva (1%).",
        answer: "Porque el Factor Intrínseco gástrico tiene un transporte saturable de solo ~1,5 µg por toma. Toda dosis superior a ese umbral se absorbe exclusivamente por difusión pasiva a lo largo del intestino delgado, la cual tiene una tasa de absorción de apenas el 1%. Por eso se requiere una megadosis semanal para asegurar que el 1% cubra los requerimientos acumulados de los 7 días.",
        source: "Documento Cátedra: Planificación y Manejo de Dietas Basadas en Plantas en Pediatría",
        tags: ["factor intrínseco", "difusión pasiva", "fisiología B12"],
        keyPoints: [
          "Factor Intrínseco se satura a ~1.5 µg por ingesta",
          "El resto se absorbe por difusión pasiva simple",
          "Tasa de difusión pasiva es de solo el 1%",
          "La dosis semanal compensa matemáticamente ese 1%"
        ],
        keywords: ["factor intrínseco", "saturable", "1.5", "difusión pasiva", "1%", "megadosis", "semanal"]
      },
      {
        id: "u5_21",
        deck: "u5_p2",
        question: "¿Existe riesgo de toxicidad o sobredosis por cianocobalamina en niños?",
        hint: "Vitamina hidrosoluble y excreción urinaria.",
        answer: "No existe riesgo de toxicidad. La cianocobalamina es una vitamina hidrosoluble con un perfil de seguridad extremadamente amplio, sin Dosis Máxima Tolerable (UL) establecida por el Institute of Medicine. Cualquier excedente no absorbido o no retenido en depósitos hepáticos se excreta rápidamente por vía urinaria.",
        source: "Documento Cátedra e IOM",
        tags: ["seguridad", "toxicidad", "excreción urinaria"],
        keyPoints: [
          "No tiene toxicidad documentada ni UL establecida",
          "Es una vitamina hidrosoluble",
          "El excedente se elimina por orina"
        ],
        keywords: ["toxicidad", "seguridad", "hidrosoluble", "orina", "excreción", "sin dosis máxima"]
      },
      {
        id: "u5_22",
        deck: "u5_p2",
        question: "¿Cuáles son las manifestaciones clínicas tempranas del déficit de Vitamina B12 en un lactante o niño pequeño?",
        hint: "Síntomas neurológicos, detención del desarrollo y anemia megaloblástica.",
        answer: "Las manifestaciones iniciales incluyen letargia, irritabilidad, pérdida de pautas motoras ya adquiridas (regresión en el desarrollo), hipotonía, anorexia y desaceleración del crecimiento cefálico y ponderal, pudiendo acompañarse de anemia megaloblástica. Si no se trata con urgencia, el daño neurológico puede volverse irreversible.",
        source: "SAP (Comité de Nutrición)",
        tags: ["déficit B12", "clínica", "daño neurológico", "lactante"],
        keyPoints: [
          "Irritabilidad, letargia y anorexia",
          "Pérdida o regresión de pautas motoras e hipotonía",
          "Detención del crecimiento y anemia megaloblástica",
          "Riesgo de daño neurológico permanente si no se corrige"
        ],
        keywords: ["neurológico", "regresión", "pautas motoras", "hipotonía", "letargia", "anemia megaloblástica", "irreversible"]
      }
    ]
  },

  // ==========================================================================
  // UNIDAD 6: CRECIMIENTO Y ETAPAS DEL DESARROLLO
  // ==========================================================================
  u6_p1: {
    id: "u6_p1",
    unidad: 6,
    parcial: 3,
    unitTitle: "UNIDAD 6: Etapas del Desarrollo",
    title: "Parcial 3 · Crecimiento Fisiológico, Apetito y Conductas",
    subtitle: "Aumento de peso/talla, anorexia fisiológica, neofobia y pantallas",
    badge: "Unidad 6 · Nivel 1",
    icon: "fa-child-reaching",
    cards: [
      {
        id: "c1",
        deck: "u6_p1",
        question: "¿Cuál es el ritmo promedio de aumento de peso y talla en el niño preescolar y escolar?",
        hint: "Revisa la diapositiva de la Lic. Mariana Mohedano sobre crecimiento.",
        answer: "El peso aumenta en promedio de 2 a 3 kg por año hasta los 9 o 10 años. El crecimiento en talla es uniforme y constante hasta llegar al estirón puberal.",
        source: "Clase Lic. Mariana Mohedano",
        tags: ["preescolar", "escolar", "crecimiento"],
        keyPoints: [
          "Aumento de peso de 2 a 3 kg por año",
          "Hasta los 9 o 10 años",
          "Crecimiento en talla uniforme hasta la pubertad"
        ],
        keywords: ["2 a 3", "2", "3", "kilos", "kg", "año", "talla", "uniforme", "pubertad", "9", "10"]
      },
      {
        id: "c2",
        deck: "u6_p1",
        question: "¿Qué ocurre con el apetito y la composición corporal en la etapa preescolar?",
        hint: "Cambios fisiológicos normales entre los 2 y 5 años.",
        answer: "Hay cambios y desaceleración del apetito (anorexia fisiológica normal por menor velocidad de crecimiento). La composición corporal se mantiene relativamente constante en esta fase previa al rebote adiposo.",
        source: "Clase Lic. Mariana Mohedano",
        tags: ["preescolar", "apetito", "fisiologia"],
        keyPoints: [
          "Desaceleración fisiológica del apetito (anorexia fisiológica)",
          "Debido a la menor velocidad de crecimiento",
          "Composición corporal se mantiene constante"
        ],
        keywords: ["anorexia", "fisiológica", "fisiologica", "apetito", "desaceleración", "constante", "composición", "velocidad", "crecimiento"]
      },
      {
        id: "c3",
        deck: "u6_p1",
        question: "¿En qué consiste la neofobia alimentaria, a qué edad tiene su pico y cómo se resuelve según la evidencia?",
        hint: "Rechazo a probar alimentos nuevos y número de exposiciones necesarias.",
        answer: "La neofobia es el rechazo a probar alimentos nuevos o desconocidos. Es un fenómeno evolutivo normal con pico entre los 2 y 5 años. Se resuelve mediante la exposición repetida y neutral (ofrecer entre 8 y 15 veces el alimento en preparaciones variadas y en un clima distendido, sin forzar ni premiar).",
        source: "Clase Lic. Mariana Mohedano y Guía de Estudio",
        tags: ["neofobia", "conducta", "preescolar"],
        keyPoints: [
          "Rechazo a probar alimentos nuevos",
          "Pico entre los 2 y 5 años",
          "Requiere entre 8 y 15 exposiciones",
          "Sin forzar, castigar ni premiar"
        ],
        keywords: ["neofobia", "nuevos", "rechazo", "2 y 5", "8 a 15", "8", "15", "exposiciones", "sin forzar", "premio", "castigo"]
      },
      {
        id: "c4",
        deck: "u6_p1",
        question: "¿Qué cambios biológicos y de maduración caracterizan al estirón puberal en la adolescencia?",
        hint: "Porcentaje de peso y talla adulta, y diferencias entre varones y mujeres.",
        answer: "Durante el estirón puberal se adquiere el 50% del peso adulto y entre el 15% y 20% de la talla adulta final. Existe un marcado dimorfismo sexual: las mujeres acumulan mayor porcentaje de masa grasa (patrón ginoide) y los varones duplican su masa muscular y experimentan un mayor ensanchamiento esquelético.",
        source: "Clase Lic. Mariana Mohedano",
        tags: ["adolescencia", "estiron", "pubertad"],
        keyPoints: [
          "50% del peso adulto adquirido",
          "15 a 20% de la talla adulta final",
          "Dimorfismo sexual (grasa ginoide en mujeres, músculo en varones)"
        ],
        keywords: ["50%", "15", "20", "talla", "peso", "adulto", "estirón", "dimorfismo", "muscular", "grasa", "ginoide"]
      },
      {
        id: "c5",
        deck: "u6_p1",
        question: "¿Cómo influye la televisión y las pantallas en la alimentación del escolar según las diapositivas de cátedra?",
        hint: "Horas promedio de exposición semanal y tipo de publicidad alimentaria.",
        answer: "Los niños escolares pasan en promedio 23 horas semanales frente al televisor o pantallas. Más del 50% de las publicidades emitidas en horarios infantiles corresponden a alimentos ultraprocesados de alta densidad calórica y bajo valor nutricional (snacks, bebidas azucaradas, golosinas), estimulando preferencias perjudiciales y conductas sedentarias.",
        source: "Clase Lic. Mariana Mohedano",
        tags: ["escolar", "pantallas", "publicidad"],
        keyPoints: [
          "23 horas semanales promedio frente a pantallas",
          "Más del 50% de las publicidades son de ultraprocesados",
          "Estimula preferencias por alimentos densos en azúcar y grasa"
        ],
        keywords: ["23 horas", "23", "pantallas", "televisión", "50%", "publicidad", "ultraprocesados", "comerciales", "snacks"]
      },
      {
        id: "c6",
        deck: "u6_p1",
        question: "¿Por qué la omisión del desayuno es frecuente en escolares y qué consecuencias nutricionales acarrea?",
        hint: "Falta de tiempo, apetito matinal y rendimiento cognitivo.",
        answer: "Se produce frecuentemente por falta de tiempo matinal, acostarse tarde o falta de hábito familiar. Ocasiona menor rendimiento escolar, dificultades en la atención y concentración, y un posterior picoteo compensatorio de alimentos de baja calidad nutricional a media mañana.",
        source: "Clase Lic. Mariana Mohedano",
        tags: ["escolar", "desayuno", "conducta"],
        keyPoints: [
          "Causada por falta de tiempo, desorganización o trasnochar",
          "Disminuye la concentración y rendimiento escolar",
          "Genera picoteo compensatorio de ultraprocesados"
        ],
        keywords: ["desayuno", "omisión", "rendimiento", "concentración", "tiempo", "picoteo", "atención"]
      },
      {
        id: "c7",
        deck: "u6_p1",
        question: "¿Cuál es el rol de la familia y los comensales en la conformación de los hábitos alimentarios del niño?",
        hint: "Modelado parental, clima de la comida y disponibilidad en el hogar.",
        answer: "La familia ejerce el rol de modelado principal: los niños imitan las conductas, preferencias y aversiones de los adultos cuidadores. Es fundamental compartir comidas en familia, en un clima afectivo positivo y sin pantallas, garantizando la disponibilidad cotidiana de alimentos saludables en el hogar.",
        source: "Clase Lic. Mariana Mohedano",
        tags: ["familia", "habitos", "modelado"],
        keyPoints: [
          "Modelado parental por imitación",
          "Clima afectivo positivo en la mesa",
          "Disponibilidad real de alimentos saludables en el hogar",
          "Evitar distracciones de pantallas"
        ],
        keywords: ["familia", "modelado", "imitación", "clima", "disponibilidad", "hogar", "pantallas"]
      },
      {
        id: "cd1",
        deck: "u6_p1",
        question: "¿Qué características sensoriales y de presentación de las comidas prefieren los preescolares y escolares?",
        hint: "Texturas, temperaturas, sabores y separación de ingredientes.",
        answer: "Prefieren sabores suaves o ligeramente dulces, temperaturas tibias o templadas (rechazan lo excesivamente caliente) y alimentos servidos por separado en el plato donde puedan identificar visualmente cada ingrediente, rechazando preparaciones pastosas, excesivamente mezcladas o muy condimentadas.",
        source: "Clase Lic. Mariana Mohedano",
        tags: ["preescolar", "texturas", "sensorial"],
        keyPoints: [
          "Sabores suaves y temperaturas tibias",
          "Ingredientes separados e identificables en el plato",
          "Rechazo a texturas pastosas o preparaciones muy mezcladas"
        ],
        keywords: ["separados", "tibio", "suave", "pastoso", "mezclado", "visual", "temperatura"]
      },
      {
        id: "cd2",
        deck: "u6_p1",
        question: "¿Qué es el 'kiosco escolar saludable' y por qué suele fracasar si no hay una política integral?",
        hint: "Disponibilidad competitiva, precios y entorno escolar.",
        answer: "Es la oferta de opciones nutritivas (frutas, yogures, frutos secos, barras de cereal sin sellos) dentro del ámbito escolar. Fracasa si coexiste con la oferta dominante de ultraprocesados más baratos y publicitados, o si el personal y las familias no están integrados en la educación alimentaria.",
        source: "Clase Lic. Mariana Mohedano",
        tags: ["escolar", "kiosco", "entorno"],
        keyPoints: [
          "Oferta de alimentos nutritivos en la escuela",
          "Fracasa si compite contra ultraprocesados más económicos",
          "Requiere regulación del entorno y participación comunitaria"
        ],
        keywords: ["kiosco", "saludable", "ultraprocesados", "competencia", "precios", "escuela"]
      },
      {
        id: "cd3",
        deck: "u6_p1",
        question: "¿Qué factores psicosociales condicionan fuertemente la elección alimentaria en los adolescentes?",
        hint: "Pertenencia de grupo, imagen corporal e independencia.",
        answer: "La búsqueda de identidad, la presión del grupo de pares, la preocupación por la imagen corporal y el deseo de autonomía frente a las pautas familiares. Esto suele traducirse en comidas fuera de casa, consumo de comida rápida y dietas restrictivas sin supervisión.",
        source: "Clase Lic. Mariana Mohedano",
        tags: ["adolescencia", "psicosocial", "pares"],
        keyPoints: [
          "Influencia del grupo de pares y búsqueda de identidad",
          "Preocupación por la imagen corporal",
          "Comidas fuera del hogar y comida rápida"
        ],
        keywords: ["pares", "imagen corporal", "identidad", "autonomía", "comida rápida", "adolescente"]
      },
      {
        id: "cd4",
        deck: "u6_p1",
        question: "¿Cómo se debe actuar ante los llamados 'días de inapetencia' en el preescolar?",
        hint: "Respeto a las señales de saciedad y no forzar.",
        answer: "Se debe mantener una actitud tranquila y respetuosa, recordando que el niño autorregula su balance energético semanal. No se debe forzar a comer, perseguir con la cuchara ni ofrecer premios alternativos (como postres dulces), manteniendo horarios regulares para la siguiente comida.",
        source: "Clase Lic. Mariana Mohedano",
        tags: ["preescolar", "inapetencia", "autorregulacion"],
        keyPoints: [
          "Respetar la autorregulación del niño",
          "No forzar ni insistir con la cuchara",
          "No sustituir la comida por golosinas o lácteos azucarados",
          "Esperar al siguiente horario pautado"
        ],
        keywords: ["inapetencia", "autorregulación", "no forzar", "calma", "siguiente comida", "postres"]
      }
    ]
  },

  u6_p2: {
    id: "u6_p2",
    unidad: 6,
    parcial: 4,
    unitTitle: "UNIDAD 6: Etapas del Desarrollo",
    title: "Parcial 4 · Requerimientos Cuantitativos, Perceptiva y CAPA-2",
    subtitle: "RDA de hierro por edad, calcio, vitaminas, ENNyS 2018-19 y Sistema NOVA",
    badge: "Unidad 6 · Nivel 2",
    icon: "fa-scale-balanced",
    cards: [
      {
        id: "r1",
        deck: "u6_p2",
        question: "¿Cuál es la recomendación proteica promedio en g/kg/día para la etapa preescolar y escolar?",
        hint: "Cifra citada en la diapositiva de requerimientos de la Lic. Mohedano.",
        answer: "El promedio recomendado es de aproximadamente 1,2 g/kg/día para asegurar el mantenimiento tisular y la síntesis de nuevos tejidos por crecimiento.",
        source: "Clase Lic. Mariana Mohedano",
        tags: ["proteinas", "requerimientos", "g/kg"],
        keyPoints: [
          "1,2 g/kg/día en promedio",
          "Cubre crecimiento y mantenimiento tisular"
        ],
        keywords: ["1.2", "1,2", "g/kg", "proteína", "proteina", "requerimiento"]
      },
      {
        id: "r2",
        deck: "u6_p2",
        question: "¿Cuáles son las RDA de Hierro para niños de 1 a 3 años, de 4 a 10 años, y para adolescentes varones y mujeres?",
        hint: "1-3a: 7mg; 4-10a: 10mg; adolescentes: varón 12mg, mujer 15mg.",
        answer: "RDA de Hierro:\n- 1 a 3 años: 7 mg/día\n- 4 a 10 años: 10 mg/día\n- Adolescentes varones: 12 mg/día (expansión muscular y volemia)\n- Adolescentes mujeres: 15 mg/día (debido a las pérdidas menstruales).",
        source: "Clase Lic. Mariana Mohedano e IOM",
        tags: ["hierro", "RDA", "adolescencia"],
        keyPoints: [
          "1 a 3 años: 7 mg/día",
          "4 a 10 años: 10 mg/día",
          "Adolescentes varones: 12 mg/día",
          "Adolescentes mujeres: 15 mg/día"
        ],
        keywords: ["7 mg", "10 mg", "12 mg", "15 mg", "menstruación", "adolescente", "hierro", "RDA"]
      },
      {
        id: "r3",
        deck: "u6_p2",
        question: "¿Cuáles son las recomendaciones de Vitamina A, Vitamina D y Vitamina C según las diapositivas de cátedra?",
        hint: "Vitamina A en UI, Vitamina D en UI y Vitamina C en mg.",
        answer: "Vitamina A: 1500 UI/día\nVitamina D: 400 UI/día\nVitamina C: 30 a 50 mg/día.",
        source: "Clase Lic. Mariana Mohedano",
        tags: ["vitaminas", "RDA", "micronutrientes"],
        keyPoints: [
          "Vitamina A: 1500 UI/día",
          "Vitamina D: 400 UI/día",
          "Vitamina C: 30 a 50 mg/día"
        ],
        keywords: ["1500", "400", "30", "50", "vitamina A", "vitamina D", "vitamina C", "UI", "mg"]
      },
      {
        id: "r4",
        deck: "u6_p2",
        question: "¿Cuáles son los requerimientos de Tiamina (B1), Riboflavina (B2) y Vitamina B12 presentados en la clase?",
        hint: "B1: 0.4mg; B2: 0.6mg; B12: 1mcg.",
        answer: "Tiamina (B1): 0,4 mg/día\nRiboflavina (B2): 0,6 mg/día\nVitamina B12: 1 mcg/día (en niños preescolares/escolares con dieta omnívora).",
        source: "Clase Lic. Mariana Mohedano",
        tags: ["vitaminas B", "tiamina", "riboflavina", "B12"],
        keyPoints: [
          "B1: 0,4 mg/día",
          "B2: 0,6 mg/día",
          "B12: 1 mcg/día"
        ],
        keywords: ["0.4", "0,4", "0.6", "0,6", "1 mcg", "tiamina", "riboflavina", "b12"]
      },
      {
        id: "r5",
        deck: "u6_p2",
        question: "¿Cuál es la recomendación de Calcio y Zinc en las diapositivas de la cátedra, y qué patología se asocia al déficit severo de Zinc?",
        hint: "Calcio 800mg y Zinc 10mg. Patología: acrodermatitis enteropática.",
        answer: "Calcio: 800 mg/día en escolares (aumentando a 1300 mg/día en adolescentes).\nZinc: 10 mg/día.\nPatología por déficit severo: Acrodermatitis enteropática (lesiones cutáneas periorificiales y acrales, diarrea y alopecia).",
        source: "Clase Lic. Mariana Mohedano",
        tags: ["calcio", "zinc", "acrodermatitis"],
        keyPoints: [
          "Calcio: 800 mg/día en escolares",
          "Zinc: 10 mg/día",
          "Patología asociada al déficit severo de zinc: Acrodermatitis enteropática"
        ],
        keywords: ["800 mg", "10 mg", "calcio", "zinc", "acrodermatitis enteropática", "acrodermatitis"]
      },
      {
        id: "p1",
        deck: "u6_p2",
        question: "¿Cómo define la Dra. Zapata (ENNyS 2018-19) la Alimentación Perceptiva y cuál es su principio rector?",
        hint: "Reciprocidad entre el niño y su cuidador.",
        answer: "Se define como un estilo de crianza alimentaria basado en la reciprocidad: el niño emite señales claras de hambre y saciedad mediante conductas verbales o no verbales, y el cuidador responde de manera cálida, oportuna y contingente, fomentando la autorregulación.",
        source: "Zapata & Marconi (ENNyS 2018-19)",
        tags: ["perceptiva", "ENNyS", "reciprocidad"],
        keyPoints: [
          "Estilo basado en la reciprocidad",
          "El niño emite señales de hambre y saciedad",
          "El cuidador responde de forma oportuna, cálida y contingente",
          "Favorece la autorregulación interna"
        ],
        keywords: ["reciprocidad", "señales", "hambre", "saciedad", "contingente", "cálida", "autorregulación"]
      },
      {
        id: "p2",
        deck: "u6_p2",
        question: "¿Cuáles son los 5 patrones de alimentación perceptiva identificados en los niños argentinos según la ENNyS 2018-19?",
        hint: "Autónomo, pantallas, forzado, indulgente y desatento.",
        answer: "Los 5 patrones son:\n1. Autónomo o autorregulado (positivo: come solo guiado por sus señales).\n2. Alimentación mediada por pantallas (uso de celular/TV como distractor).\n3. Controlador o forzado (presión externa para terminar el plato).\n4. Indulgente o permisivo (se complace cualquier capricho para que coma algo).\n5. Desatento o negligente (falta de supervisión y horarios).",
        source: "Zapata & Marconi (ENNyS 2018-19)",
        tags: ["perceptiva", "patrones", "ENNyS"],
        keyPoints: [
          "1. Autónomo",
          "2. Mediado por pantallas",
          "3. Forzado o controlador",
          "4. Indulgente o permisivo",
          "5. Desatento"
        ],
        keywords: ["autónomo", "pantallas", "forzado", "controlador", "indulgente", "permisivo", "desatento", "5 patrones"]
      },
      {
        id: "p3",
        deck: "u6_p2",
        question: "¿Qué impacto negativo tiene el uso de pantallas como distractor durante la comida según Zapata y Marconi?",
        hint: "Desconexión de las señales internas de saciedad e hiperalimentación pasiva.",
        answer: "El niño come en modo 'piloto automático' desconectado de sus señales biológicas de saciedad. Esto altera el control homeostático del apetito, predispone a la hiperalimentación pasiva y consolida el riesgo de sobrepeso infantil a largo plazo.",
        source: "Zapata & Marconi (ENNyS 2018-19)",
        tags: ["pantallas", "saciedad", "sobrepeso"],
        keyPoints: [
          "Come en piloto automático sin registrar sensaciones internas",
          "Desconexión de la saciedad y hambre",
          "Favorece la hiperalimentación pasiva",
          "Aumenta riesgo de sobrepeso"
        ],
        keywords: ["piloto automático", "desconexión", "saciedad", "hiperalimentación", "sobrepeso", "pantallas"]
      },
      {
        id: "cp1",
        deck: "u6_p2",
        question: "¿Cuáles son los 4 grupos de alimentos según la clasificación NOVA adoptada en el documento CAPA-2 (CESNI)?",
        hint: "Grupo 1 a Grupo 4 (sin procesar hasta ultraprocesados).",
        answer: "Grupo 1: Alimentos sin procesar o mínimamente procesados (frutas, verduras, legumbres, carnes frescas).\nGrupo 2: Ingredientes culinarios procesados (aceites, manteca, azúcar, sal).\nGrupo 3: Alimentos procesados (pan artesanal, conservas simples, quesos simples).\nGrupo 4: Productos ultraprocesados (formulaciones industriales con colorantes, saborizantes y aditivos cosméticos).",
        source: "CAPA-2 (CESNI) y Sistema NOVA",
        tags: ["NOVA", "CAPA-2", "ultraprocesados"],
        keyPoints: [
          "Grupo 1: Sin procesar o mínimamente procesados",
          "Grupo 2: Ingredientes culinarios procesados",
          "Grupo 3: Alimentos procesados",
          "Grupo 4: Productos ultraprocesados (con aditivos cosméticos)"
        ],
        keywords: ["grupo 1", "grupo 2", "grupo 3", "grupo 4", "mínimamente procesados", "ingredientes culinarios", "procesados", "ultraprocesados", "nova"]
      },
      {
        id: "cp2",
        deck: "u6_p2",
        question: "¿Cuáles son las 3 grandes brechas entre la dieta real de los niños argentinos y las Guías Alimentarias (GAPA) reveladas en CAPA-2?",
        hint: "Frutas/verduras, lácteos y alimentos opcionales/azúcares.",
        answer: "1. Frutas y Verduras: El consumo real cubre apenas un tercio de la meta GAPA.\n2. Lácteos: Consumo por debajo del 50% de la recomendación, con predominio de lácteos enteros en lugar de descremados.\n3. Alimentos Opcionales: El consumo triplica el límite máximo recomendado, aportando exceso de azúcares libres, sodio y grasas saturadas.",
        source: "CAPA-2 (CESNI - Dra. Zapata, Bioq. Rovirosa)",
        tags: ["CAPA-2", "GAPA", "brechas"],
        keyPoints: [
          "Frutas y verduras a 1/3 de la recomendación",
          "Lácteos por debajo del 50% de la meta",
          "Opcionales al triple del límite tolerado (azúcares, sodio, grasas saturadas)"
        ],
        keywords: ["un tercio", "1/3", "50%", "triple", "frutas", "verduras", "lácteos", "opcionales", "azúcares libres"]
      },
      {
        id: "cp3",
        deck: "u6_p2",
        question: "¿Qué porcentaje aproximado de los azúcares libres y sodio en la dieta de los niños argentinos proviene de los productos ultraprocesados (Grupo 4 NOVA)?",
        hint: "Supera el 60-70% según CAPA-2.",
        answer: "Los productos ultraprocesados aportan más del 70% de los azúcares libres agregados y más del 65% del sodio consumido por la población pediátrica escolar según el estudio CAPA-2 del CESNI.",
        source: "CAPA-2 (CESNI)",
        tags: ["ultraprocesados", "azucar", "sodio"],
        keyPoints: [
          "Más del 70% de los azúcares libres",
          "Más del 65% del sodio",
          "Dominado por bebidas azucaradas, galletitas y snacks"
        ],
        keywords: ["70%", "65%", "azúcares libres", "sodio", "ultraprocesados", "capa-2"]
      }
    ]
  },

  // ==========================================================================
  // UNIDAD 7: SITUACIONES ESPECIALES EN LA ADOLESCENCIA Y DEPORTE
  // ==========================================================================
  u7_p1: {
    id: "u7_p1",
    unidad: 7,
    parcial: 5,
    unitTitle: "UNIDAD 7: Situaciones Especiales y Deporte",
    title: "Parcial 5 · Embarazo y Lactancia en la Adolescencia",
    subtitle: "Doble demanda biológica, incremento calórico, hierro, ácido fólico y calcio",
    badge: "Unidad 7 · Nivel 1",
    icon: "fa-person-breastfeeding",
    cards: [
      {
        id: "u7_1",
        deck: "u7_p1",
        question: "¿Por qué el embarazo en la adolescencia representa una 'doble demanda biológica y nutricional' única?",
        hint: "Crecimiento materno incompleto vs crecimiento fetal acelerado.",
        answer: "Porque la madre adolescente aún no ha completado su propio crecimiento somático, estirón puberal ni mineralización esquelética, produciéndose una competencia biológica directa por nutrientes entre el cuerpo materno en desarrollo y el feto en rápido crecimiento, lo que eleva el riesgo de bajo peso al nacer y parto pretérmino.",
        source: "Ruiz Herrero & Jiménez Ortega (Adolescere 2016)",
        tags: ["embarazo", "adolescencia", "doble demanda"],
        keyPoints: [
          "Competencia biológica entre madre y feto",
          "Madre aún en crecimiento somático y mineralización ósea",
          "Mayor riesgo de restricción de crecimiento intrauterino y bajo peso al nacer"
        ],
        keywords: ["doble demanda", "crecimiento materno", "crecimiento fetal", "competencia", "bajo peso", "pretérmino"]
      },
      {
        id: "u7_2",
        deck: "u7_p1",
        question: "¿Cuál es la adición calórica recomendada en el 2° y 3° trimestre de gestación en una adolescente embarazada según la bibliografía?",
        hint: "+340 kcal/d en 2°T y +452 kcal/d en 3°T.",
        answer: "En el 1° trimestre no se requiere adición calórica significativa. En el 2° trimestre se adicionan +340 kcal/día y en el 3° trimestre se adicionan +452 kcal/día por sobre el gasto basal y de actividad física de la adolescente.",
        source: "Ruiz Herrero & Jiménez Ortega (Adolescere 2016)",
        tags: ["calorías", "embarazo", "trimestres"],
        keyPoints: [
          "1° Trimestre: sin adición significativa",
          "2° Trimestre: +340 kcal/día",
          "3° Trimestre: +452 kcal/día"
        ],
        keywords: ["340", "452", "kcal", "trimestre", "adición", "calorías", "segundo", "tercero"]
      },
      {
        id: "u7_3",
        deck: "u7_p1",
        question: "¿Cuál es el incremento cuantitativo de proteínas recomendado durante el embarazo y la lactancia en adolescentes?",
        hint: "+25 gramos de proteína al día.",
        answer: "Se recomienda un aporte proteico adicional de +25 g/día (o alcanzar aproximadamente 1,1 g/kg/día) para cubrir la síntesis de tejidos maternos (expansión uterina, mamas, placenta) y el rápido crecimiento tisular fetal, manteniéndose ese incremento adicional de +25 g/d durante la lactancia materna.",
        source: "Ruiz Herrero & Jiménez Ortega (Adolescere 2016) e IOM",
        tags: ["proteínas", "embarazo", "lactancia"],
        keyPoints: [
          "+25 g/día adicionales de proteína en 2° y 3° trimestre",
          "+25 g/día adicionales durante la lactancia materna",
          "Sostiene expansión de tejidos maternos, placenta y producción láctea"
        ],
        keywords: ["25 g", "+25", "proteínas", "adicional", "embarazo", "lactancia", "placenta"]
      },
      {
        id: "u7_4",
        deck: "u7_p1",
        question: "¿Cuál es la recomendación de Ácido Fólico en el embarazo adolescente y cuál es el objetivo de su suplementación preconcepcional?",
        hint: "600 mcg/d y prevención de defectos del tubo neural.",
        answer: "La recomendación total es de 600 µg/día. La suplementación farmacológica con 400 a 800 µg/día desde el período preconcepcional (o diagnóstico temprano) hasta el final del primer trimestre tiene como objetivo innegociable prevenir los Defectos del Tubo Neural (DTN), como espina bífida y anencefalia.",
        source: "Ruiz Herrero & Jiménez Ortega (Adolescere 2016)",
        tags: ["ácido fólico", "DTN", "espina bífida"],
        keyPoints: [
          "Recomendación: 600 µg/día",
          "Suplementación de 400 a 800 µg/día",
          "Prevención de Defectos del Tubo Neural (DTN)",
          "Fundamental en etapa preconcepcional y 1° trimestre"
        ],
        keywords: ["600", "400", "fólico", "tubo neural", "DTN", "espina bífida", "anencefalia", "preconcepcional"]
      },
      {
        id: "u7_5",
        deck: "u7_p1",
        question: "¿Por qué el requerimiento de Hierro se eleva a 27-30 mg/día en la gestante y qué dosis de suplementación profiláctica se indica?",
        hint: "Expansión de la volemia, reserva fetal y suplemento de 30 a 60 mg/día de hierro elemental.",
        answer: "Se eleva debido a la intensa expansión del volumen plasmático materno (~50%), la formación de hemoglobina fetal y la constitución del depósito hepático de hierro del feto para sus primeros 6 meses de vida. Se indica una suplementación preventiva universal de 30 a 60 mg/día de hierro elemental.",
        source: "Ruiz Herrero & Jiménez Ortega (Adolescere 2016)",
        tags: ["hierro", "embarazo", "anemia", "volemia"],
        keyPoints: [
          "Requerimiento: 27 a 30 mg/día",
          "Expansión del 50% de la masa eritrocitaria y volumen plasmático",
          "Depósito hepático de hierro en el feto",
          "Suplementación profiláctica de 30 a 60 mg/día de hierro elemental"
        ],
        keywords: ["27", "30 mg", "60 mg", "hierro elemental", "volemia", "depósito fetal", "anemia"]
      },
      {
        id: "u7_6",
        deck: "u7_p1",
        question: "¿Cuál es la recomendación de Calcio en la adolescente embarazada o en período de lactancia y por qué es superior a la de la mujer adulta?",
        hint: "1300 mg/día (frente a 1000 mg/d en adultas) para proteger la masa ósea materna.",
        answer: "Se recomiendan 1300 mg/día (frente a 1000 mg/día de la gestante adulta). Es superior porque la madre adolescente aún se encuentra consolidando su propio pico de masa ósea; si el aporte de calcio es insuficiente, los mecanismos paratiroideos desmineralizarán el esqueleto materno para transferir calcio al feto.",
        source: "Ruiz Herrero & Jiménez Ortega (Adolescere 2016)",
        tags: ["calcio", "1300 mg", "pico óseo", "mineralización"],
        keyPoints: [
          "1300 mg/día en adolescentes (vs 1000 mg en adultas)",
          "Protege la masa ósea materna aún en formación",
          "Asegura la mineralización del esqueleto fetal",
          "Previene osteopenia materna prematura"
        ],
        keywords: ["1300 mg", "1300", "calcio", "pico de masa ósea", "desmineralización", "esqueleto", "adulta 1000"]
      },
      {
        id: "u7_7",
        deck: "u7_p1",
        question: "¿Cuál es el costo energético y el aporte calórico adicional necesario durante los primeros 6 meses de lactancia materna exclusiva?",
        hint: "Producción de ~750 ml de leche al día y adición de +500 kcal/día.",
        answer: "La producción de leche materna demanda aproximadamente 650 a 700 kcal/día para sintetizar unos 750 a 800 ml de leche. Se recomienda un aporte calórico adicional de +500 kcal/día en la dieta de la madre adolescente, cubriéndose el resto con la movilización fisiológica de las reservas grasas acumuladas durante el embarazo.",
        source: "Ruiz Herrero & Jiménez Ortega (Adolescere 2016)",
        tags: ["lactancia", "calorías", "+500 kcal", "leche materna"],
        keyPoints: [
          "Producción de ~750-800 ml de leche al día",
          "Adición recomendada de +500 kcal/día en la dieta",
          "El resto se cubre con la grasa de reserva gestacional",
          "Garantiza producción láctea sin desnutrir a la madre"
        ],
        keywords: ["500 kcal", "+500", "lactancia", "750 ml", "producción láctea", "reservas grasas"]
      },
      {
        id: "u7_8",
        deck: "u7_p1",
        question: "¿Por qué están contraindicadas las dietas hipocalóricas restrictivas para 'recuperar la figura' en el puerperio de una madre adolescente?",
        hint: "Afectación del volumen de leche materna y desnutrición de una madre en desarrollo.",
        answer: "Están terminantemente contraindicadas porque una restricción calórica severa (< 1500-1800 kcal/d) reduce el volumen lácteo producido, compromete el aporte de micronutrientes al lactante y detiene la propia recuperación biológica y crecimiento de la adolescente.",
        source: "Ruiz Herrero & Jiménez Ortega (Adolescere 2016)",
        tags: ["dietas restrictivas", "puerperio", "contraindicación"],
        keyPoints: [
          "Disminuyen el volumen de producción de leche",
          "Afectan el contenido de micronutrientes de la leche",
          "Comprometen el estado nutricional y desarrollo de la madre adolescente"
        ],
        keywords: ["dietas hipocalóricas", "restrictivas", "puerperio", "volumen lácteo", "contraindicadas", "desnutrición"]
      },
      {
        id: "u7_9",
        deck: "u7_p1",
        question: "¿Cuál es la meta de ingesta hídrica para una adolescente durante el período de lactancia materna?",
        hint: "Reposición del agua de la leche: al menos 2.5 a 3 litros al día.",
        answer: "Debe asegurar al menos 2,5 a 3 litros de líquidos al día (priorizando agua potable segura), bebiendo un vaso de agua cada vez que amamanta para compensar los ~800 ml de agua excretados en la leche materna.",
        source: "Ruiz Herrero & Jiménez Ortega (Adolescere 2016)",
        tags: ["hidratación", "lactancia", "líquidos"],
        keyPoints: [
          "2,5 a 3 litros de agua al día",
          "Compensa los ~800 ml de leche secretados",
          "Beber guiada por la sed y un vaso en cada toma"
        ],
        keywords: ["2.5", "3 litros", "líquidos", "agua", "lactancia", "hidratación"]
      },
      {
        id: "u7_10",
        deck: "u7_p1",
        question: "¿Cómo se orienta la ganancia de peso gestacional en una adolescente según su IMC pregestacional?",
        hint: "Rango superior de las tablas del IOM para proteger el peso del recién nacido.",
        answer: "Se recomienda situarse en el límite superior del rango recomendado por el IOM para adultas: si inició con bajo peso o normopeso, se busca una ganancia de entre 12,5 y 18 kg, ya que ganancias subóptimas se asocian de forma directa con bajo peso al nacer y prematurez.",
        source: "Ruiz Herrero & Jiménez Ortega (Adolescere 2016)",
        tags: ["ganancia de peso", "embarazo", "IMC pregestacional"],
        keyPoints: [
          "Alinearse con el límite superior de ganancia",
          "12,5 a 18 kg si inició con peso normal o bajo",
          "Previene bajo peso de nacimiento y prematurez"
        ],
        keywords: ["ganancia de peso", "12.5", "18 kg", "límite superior", "bajo peso", "normopeso", "IOM"]
      },
      {
        id: "u7_11",
        deck: "u7_p1",
        question: "¿Por qué el Yodo es un micronutriente crítico en el embarazo y qué dosis diaria se recomienda?",
        hint: "220-250 mcg/día para síntesis de hormonas tiroideas y desarrollo cerebral.",
        answer: "Se recomiendan entre 220 y 250 µg/día. El yodo es esencial para la síntesis de hormonas tiroideas maternas y fetales, indispensables para la mielinización neuronal, migración celular y desarrollo cognitivo normal del feto.",
        source: "Ruiz Herrero & Jiménez Ortega (Adolescere 2016)",
        tags: ["yodo", "neurodesarrollo", "tiroides"],
        keyPoints: [
          "Recomendación: 220 a 250 µg/día",
          "Síntesis de hormonas tiroideas maternas y fetales",
          "Crucial para la mielinización y neurodesarrollo fetal"
        ],
        keywords: ["yodo", "220", "250 µg", "tiroideas", "neurodesarrollo", "cognitivo", "cerebro"]
      }
    ]
  },

  u7_p2: {
    id: "u7_p2",
    unidad: 7,
    parcial: 6,
    unitTitle: "UNIDAD 7: Situaciones Especiales y Deporte",
    title: "Parcial 6 · Nutrición e Hidratación en el Niño Deportista",
    subtitle: "Gasto energético, hidratos de carbono, protocolo de hidratación y Tríada de la Atleta",
    badge: "Unidad 7 · Nivel 2",
    icon: "fa-person-running",
    cards: [
      {
        id: "u7_12",
        deck: "u7_p2",
        question: "¿Cómo se compone el Gasto Energético Total (GET) en un niño deportista y por qué no debe recortarse la energía?",
        hint: "TMB, efecto térmico, actividad física y el costo irrenunciable del crecimiento.",
        answer: "El GET se compone de: Tasa Metabólica Basal (TMB) + Efecto Térmico de los Alimentos + Gasto por Actividad Física/Ejercicio + Costo Energético del Crecimiento. No debe recortarse porque el crecimiento somático y la maduración puberal son prioritarios; un déficit calórico detiene el crecimiento y causa hipogonadismo.",
        source: "Comité de Nutrición AEP 2014",
        tags: ["deporte", "GET", "gasto energético", "crecimiento"],
        keyPoints: [
          "GET = TMB + Efecto térmico + Ejercicio + Crecimiento",
          "El crecimiento somático demanda alta energía",
          "El déficit detiene el crecimiento y altera la maduración ósea"
        ],
        keywords: ["GET", "TMB", "gasto energético", "crecimiento", "actividad física", "déficit"]
      },
      {
        id: "u7_13",
        deck: "u7_p2",
        question: "¿Cuál es la recomendación cuantitativa de Hidratos de Carbono (en g/kg/día) para el niño y adolescente deportista?",
        hint: "5 a 8 g/kg/día según intensidad y duración del entrenamiento.",
        answer: "Se recomiendan entre 5 y 8 g/kg/día (aportando entre el 50% y 60% del VCT), variando según la intensidad, frecuencia y volumen del deporte para asegurar la repleción continua del glucógeno muscular y hepático.",
        source: "Comité de Nutrición AEP 2014",
        tags: ["hidratos de carbono", "glucógeno", "g/kg"],
        keyPoints: [
          "5 a 8 g/kg/día",
          "50% a 60% del Valor Calórico Total",
          "Mantiene reservas de glucógeno muscular y hepático"
        ],
        keywords: ["5 a 8", "5", "8 g/kg", "hidratos de carbono", "glucógeno", "50-60%"]
      },
      {
        id: "u7_14",
        deck: "u7_p2",
        question: "¿Qué porcentaje del VCT deben aportar las Grasas en la dieta del niño deportista y por qué no deben restringirse a menos del 20%?",
        hint: "25% a 30% del VCT; ácidos grasos esenciales y absorción de vitaminas liposolubles.",
        answer: "Deben aportar entre el 25% y el 30% del VCT (priorizando ácidos grasos mono y poliinsaturados). No deben reducirse por debajo del 20% porque comprometen el aporte de ácidos grasos esenciales, la absorción de vitaminas liposolubles (A, D, E, K) y la síntesis hormonal esteroidea.",
        source: "Comité de Nutrición AEP 2014",
        tags: ["lípidos", "grasas", "25-30%"],
        keyPoints: [
          "25% a 30% del VCT",
          "No descender del 20%",
          "Asegura ácidos grasos esenciales y vitaminas liposolubles (A, D, E, K)"
        ],
        keywords: ["25 a 30%", "25%", "30%", "grasas", "lípidos", "liposolubles", "menos de 20%"]
      },
      {
        id: "u7_15",
        deck: "u7_p2",
        question: "¿Cuál es el protocolo de hidratación en la fase previa (ANTES) del ejercicio en niños y adolescentes?",
        hint: "400 a 600 ml unas 2 a 3 horas antes del inicio.",
        answer: "Se recomienda ingerir entre 400 y 600 ml de agua fresca o líquido adecuado unas 2 a 3 horas antes del inicio de la actividad deportiva para iniciar la práctica en estado de euhidratación y permitir la eliminación del exceso por orina antes de comenzar.",
        source: "Comité de Nutrición AEP 2014",
        tags: ["hidratación", "antes", "400-600 ml"],
        keyPoints: [
          "400 a 600 ml de agua fresca",
          "2 a 3 horas antes del ejercicio",
          "Asegura euhidratación y micción previa"
        ],
        keywords: ["400 a 600 ml", "400", "600", "2 a 3 horas", "antes", "euhidratación", "previo"]
      },
      {
        id: "u7_16",
        deck: "u7_p2",
        question: "¿Cuál es el protocolo de hidratación DURANTE el ejercicio en niños y por qué no se debe esperar a sentir sed?",
        hint: "100 a 250 ml cada 15 a 20 minutos; la sed es un síntoma tardío de deshidratación.",
        answer: "Se debe beber entre 100 y 250 ml cada 15 a 20 minutos en sorbos regulares. No debe esperarse a tener sed porque en niños el mecanismo de la sed es tardío e insensible, apareciendo recién cuando ya existe una pérdida del 1% al 2% del peso corporal, lo que ya disminuye el rendimiento y la termorregulación.",
        source: "Comité de Nutrición AEP 2014",
        tags: ["hidratación", "durante", "sed tardía"],
        keyPoints: [
          "100 a 250 ml cada 15 a 20 minutos",
          "Sorbos regulares programados",
          "La sed es un síntoma tardío (indica 1-2% de peso perdido)",
          "Afecta la termorregulación y rendimiento físico"
        ],
        keywords: ["100 a 250 ml", "15 a 20 minutos", "sed tardía", "durante", "1%", "2%", "termorregulación"]
      },
      {
        id: "u7_17",
        deck: "u7_p2",
        question: "¿Cómo se realiza la reposición de líquidos en la fase posterior (DESPUÉS) del ejercicio?",
        hint: "Pesar antes y después; reponer el 150% del peso perdido.",
        answer: "Se pesa al deportista antes y después de la sesión. Se debe reponer el 150% del peso corporal perdido en las primeras 2 a 4 horas posteriores (por ejemplo, si perdió 1 kg de peso, debe ingerir 1,5 litros de líquido), para compensar la sudoración y las pérdidas continuas por diuresis.",
        source: "Comité de Nutrición AEP 2014",
        tags: ["hidratación", "después", "150% peso"],
        keyPoints: [
          "Pesar al niño antes y después del entrenamiento",
          "Reponer el 150% del peso perdido",
          "Administrar en las primeras 2 a 4 horas posteriores"
        ],
        keywords: ["150%", "peso perdido", "pesar", "después", "primeras 2 a 4 horas", "reposición"]
      },
      {
        id: "u7_18",
        deck: "u7_p2",
        question: "¿Cuándo es suficiente el agua sola y cuándo está indicada una bebida isotónica deportiva en niños?",
        hint: "Menos de 1 hora de ejercicio vs más de 1 hora con calor/humedad.",
        answer: "El agua sola es suficiente para actividades deportivas habituales de intensidad moderada con duración inferior a 1 hora.\nLas bebidas isotónicas (con 4% a 8% de hidratos de carbono y 20 a 30 mEq/L de sodio) están indicadas cuando el ejercicio supera los 60 minutos de alta intensidad, en jornadas continuas o en ambientes calurosos y húmedos.",
        source: "Comité de Nutrición AEP 2014",
        tags: ["bebidas isotónicas", "agua", "duración"],
        keyPoints: [
          "Agua sola: deportes < 1 hora de intensidad moderada",
          "Bebida isotónica: deportes > 1 hora de alta intensidad o calor extremo",
          "Composición: 4-8% hidratos de carbono y 20-30 mEq/L de sodio"
        ],
        keywords: ["agua sola", "1 hora", "60 minutos", "isotónica", "4 a 8%", "sodio", "20 a 30 mEq"]
      },
      {
        id: "u7_19",
        deck: "u7_p2",
        question: "¿Qué es la 'anemia del deportista' o hemólisis por impacto mecánico en niños y adolescentes?",
        hint: "Destrucción mecánica de glóbulos rojos por impacto plantar repetido.",
        answer: "Es una disminución de hemoglobina provocada por varios factores: hemodilución por expansión fisiológica del plasma, pérdidas microscópicas gastrointestinales y la 'hemólisis por impacto plantar' (foot-strike hemolysis), donde el golpeteo repetitivo del pie contra superficies duras fragmenta mecánicamente los eritrocitos en los capilares plantares.",
        source: "Comité de Nutrición AEP 2014",
        tags: ["anemia del deportista", "hemólisis", "hierro"],
        keyPoints: [
          "Hemólisis mecánica por impacto plantar repetitivo",
          "Hemodilución fisiológica por expansión del volumen plasmático",
          "Pérdidas de hierro en sudor y heces",
          "Exige vigilar reservas de ferritina"
        ],
        keywords: ["anemia del deportista", "hemólisis", "impacto plantar", "foot-strike", "eritrocitos", "volemia"]
      },
      {
        id: "u7_20",
        deck: "u7_p2",
        question: "¿En qué consiste la 'Tríada de la Mujer Atleta' y cuáles son sus tres componentes clínicos?",
        hint: "Baja disponibilidad energética, disfunción menstrual y baja densidad mineral ósea.",
        answer: "Es un síndrome clínico grave compuesto por la interrelación de 3 componentes:\n1. Baja disponibilidad de energía (con o sin trastorno de la conducta alimentaria).\n2. Disfunción menstrual (amenorrea u oligomenorrea de causa hipotalámica funcional).\n3. Disminución de la densidad mineral ósea (osteopenia / osteoporosis precoz con alto riesgo de fracturas por estrés).",
        source: "Comité de Nutrición AEP 2014",
        tags: ["tríada de la mujer atleta", "amenorrea", "osteoporosis"],
        keyPoints: [
          "1. Baja disponibilidad energética",
          "2. Disfunción menstrual (amenorrea funcional)",
          "3. Baja densidad mineral ósea (osteopenia/osteoporosis precoz)"
        ],
        keywords: ["tríada", "mujer atleta", "baja disponibilidad energética", "amenorrea", "oligomenorrea", "osteopenia", "osteoporosis", "fracturas por estrés"]
      },
      {
        id: "u7_21",
        deck: "u7_p2",
        question: "¿Por qué el Calcio (1300 mg/d) y la Vitamina D (600 UI/d) son cruciales en el niño deportista?",
        hint: "Pico de masa ósea, remodelado por impacto y prevención de fracturas por sobrecarga.",
        answer: "Porque durante la pubertad se adquiere cerca del 40-50% de la masa ósea del esqueleto adulto. El ejercicio de impacto mecánico actúa como un potente estímulo osteogénico, pero requiere de un sustrato de 1300 mg de calcio y 600 UI de vitamina D para consolidar la matriz ósea y evitar fracturas por estrés.",
        source: "Comité de Nutrición AEP 2014",
        tags: ["calcio", "vitamina D", "pico óseo", "fracturas"],
        keyPoints: [
          "Calcio: 1300 mg/día en adolescentes",
          "Vitamina D: 600 UI/día",
          "Consolida el pico de masa ósea durante el estímulo osteogénico",
          "Previene fracturas por estrés"
        ],
        keywords: ["1300 mg", "600 UI", "calcio", "vitamina D", "pico de masa ósea", "osteogénico", "fracturas por estrés"]
      },
      {
        id: "u7_22",
        deck: "u7_p2",
        question: "¿Cuál es el riesgo de la sobrehidratación exclusiva con agua pura en actividades de resistencia extrema y qué cuadro clínico produce?",
        hint: "Hiponatremia dilucional (< 135 mEq/L) por intoxicación hídrica.",
        answer: "Provoca hiponatremia dilucional (< 135 mEq/L de sodio plasmático). Al sudar se pierde agua y sodio; si solo se repone abundante agua sin electrolitos, se diluye el espacio extracelular, causando edema celular cerebral con cefalea, confusión, náuseas y, en casos severos, convulsiones y coma.",
        source: "Comité de Nutrición AEP 2014",
        tags: ["hiponatremia", "sobrehidratación", "sodio"],
        keyPoints: [
          "Riesgo de hiponatremia dilucional (< 135 mEq/L)",
          "Ocurre al reponer solo agua sin sodio en pérdidas masivas",
          "Causa edema celular cerebral, cefalea y convulsiones"
        ],
        keywords: ["hiponatremia", "135", "dilucional", "sobrehidratación", "sodio", "edema cerebral", "electrolitos"]
      }
    ]
  }
};

// Exportar globalmente
if (typeof window !== "undefined") {
  window.FLASHCARDS_DECKS = FLASHCARDS_DECKS;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = FLASHCARDS_DECKS;
}
