/**
 * BANCO DE PREGUNTAS DE OPCIÓN MÚLTIPLE - SIMULADOR 2° PARCIAL TEÓRICO UNSTA
 * Formato oficial: 4 opciones (A, B, C, D) con fundamentación formativa.
 * Cobertura balanceada de los 10 temas de la Guía de Estudio de la Unidad 6.
 */

const EXAM_QUESTIONS_BANK = [
  // TEMA 1 & 2: Crecimiento preescolar y escolar
  {
    id: "q1",
    topic: "Crecimiento Preescolar y Escolar",
    question: "En relación con el crecimiento físico durante la etapa preescolar y escolar, ¿cuál de las siguientes afirmaciones es CORRECTA según lo expuesto en clase?",
    options: [
      { text: "El aumento de peso promedio es de 5 a 6 kg anuales en ambos sexos.", id: "A" },
      { text: "El peso aumenta en promedio de 2 a 3 kg por año hasta los 9 o 10 años.", id: "B" },
      { text: "La talla experimenta su mayor aceleración entre los 3 y 5 años de vida.", id: "C" },
      { text: "La composición corporal sufre oscilaciones impredecibles de masa grasa bimestrales.", id: "D" }
    ],
    correctId: "B",
    rationale: "Según las diapositivas de la Lic. Mariana Mohedano, en la etapa preescolar y escolar el peso aumenta de 2 a 3 kg por año hasta los 9 o 10 años, y el crecimiento en talla es uniforme y constante hasta la pubertad, manteniéndose la composición corporal estable."
  },
  {
    id: "q2",
    topic: "Crecimiento Preescolar y Escolar",
    question: "¿A qué se debe la denominada 'anorexia fisiológica' que suele presentarse en el niño preescolar?",
    options: [
      { text: "A una deficiencia subclínica de zinc en la alimentación familiar.", id: "A" },
      { text: "A una desaceleración fisiológica de la velocidad de crecimiento en comparación con el primer año.", id: "B" },
      { text: "A un rechazo permanente hacia los alimentos de origen animal.", id: "C" },
      { text: "A un trastorno endocrinológico temprano en la regulación de la saciedad.", id: "D" }
    ],
    correctId: "B",
    rationale: "Durante el período preescolar disminuye drásticamente la velocidad de crecimiento respecto al lactante menor, lo que fisiológicamente reduce los requerimientos energéticos por kilo de peso y produce una disminución normal del apetito."
  },

  // TEMA 3: Crecimiento y desarrollo del adolescente
  {
    id: "q3",
    topic: "Crecimiento en la Adolescencia",
    question: "Durante el estirón puberal en la adolescencia, el dimorfismo sexual en la composición corporal se caracteriza por:",
    options: [
      { text: "Una pérdida neta de masa ósea en varones con duplicación de masa grasa.", id: "A" },
      { text: "Un aumento idéntico de masa muscular en varones y mujeres por efecto estrogénico.", id: "B" },
      { text: "Un mayor depósito de masa grasa en mujeres y una duplicación de la masa muscular magra en varones.", id: "C" },
      { text: "Una detención completa del crecimiento en talla previo al pico de ganancia ponderal.", id: "D" }
    ],
    correctId: "C",
    rationale: "En la pubertad, los varones duplican su masa muscular magra por acción de la testosterona, mientras que las mujeres presentan una mayor ganancia relativa de masa grasa en distribución ginoide (caderas y muslos)."
  },
  {
    id: "q4",
    topic: "Adolescencia en Situaciones Especiales",
    question: "En el embarazo adolescente, ¿cuál es el factor determinante del elevado riesgo nutricional según Ruiz Herrero y Jiménez Ortega?",
    options: [
      { text: "La intolerancia gástrica selectiva a los suplementos de calcio.", id: "A" },
      { text: "La competencia biológica por nutrientes entre la madre aún en crecimiento y el feto.", id: "B" },
      { text: "La disminución absoluta de los requerimientos calóricos respecto a la mujer adulta.", id: "C" },
      { text: "La aceleración patológica del vaciamiento vesicular.", id: "D" }
    ],
    correctId: "B",
    rationale: "La gestante adolescente se encuentra aún completando su propio crecimiento esquelético y maduración biológica, por lo que los nutrientes deben sostener simultáneamente el crecimiento materno y el desarrollo fetal."
  },

  // TEMA 4: Hábitos y Neofobia en Preescolares
  {
    id: "q5",
    topic: "Conductas en Preescolares",
    question: "¿Cómo se define la 'neofobia alimentaria' típica de los preescolares y cuál es la estrategia pedagógica recomendada?",
    options: [
      { text: "Alergia cutánea a nuevos alimentos; debe retirarse el alimento de forma definitiva.", id: "A" },
      { text: "Rechazo o miedo a alimentos nuevos; requiere exposición repetida (8 a 15 veces) sin presiones.", id: "B" },
      { text: "Aversión inducida por infecciones virales que precisa suplementación proteica.", id: "C" },
      { text: "Preferencia exclusiva por líquidos que debe corregirse con ayunos forzados.", id: "D" }
    ],
    correctId: "B",
    rationale: "La neofobia es una etapa evolutiva normal entre los 2 y 5 años caracterizada por el recelo ante olores, colores o texturas no familiares. La evidencia señala que ofrecer el alimento entre 8 y 15 veces de forma amable permite su aceptación progresiva."
  },
  {
    id: "q6",
    topic: "Conductas en Preescolares",
    question: "Respecto a los utensilios de alimentación para niños preescolares, la recomendación de la cátedra es:",
    options: [
      { text: "Cuchillos afilados para promover la destreza manual temprana.", id: "A" },
      { text: "Vajilla pesada de porcelana para evitar que se mueva en la mesa.", id: "B" },
      { text: "Cucharas y tenedores cortos y gruesos, de material liviano e irrompible.", id: "C" },
      { text: "Vasos de vidrio delgados para entrenar el reflejo de prensión.", id: "D" }
    ],
    correctId: "C",
    rationale: "Los niños de 2 a 5 años manipulan con mayor seguridad y autonomía cubiertos con mangos cortos y gruesos, en platos y vasos irrompibles y livianos."
  },

  // TEMA 5: Hábitos en Escolares y Pantallas
  {
    id: "q7",
    topic: "Hábitos en Escolares",
    question: "Según los datos analizados en clase, ¿cuántas horas de televisión miran en promedio los escolares y qué caracteriza a los avisos comerciales?",
    options: [
      { text: "5 horas semanales con predominio de avisos de legumbres y frutas.", id: "A" },
      { text: "10 horas semanales con publicidades reguladas de lácteos descremados.", id: "B" },
      { text: "23 horas semanales con más del 50% de avisos de alimentos bajos en fibra y altos en azúcar, grasa y sodio.", id: "C" },
      { text: "40 horas semanales con foco exclusivo en bebidas rehidratantes para deportistas.", id: "D" }
    ],
    correctId: "C",
    rationale: "En las diapositivas de la Lic. Mariana Mohedano se destaca que los escolares miran un promedio de 23 hs semanales de TV, donde más de la mitad de las publicidades promocionan comestibles de pésima calidad nutricional."
  },
  {
    id: "q8",
    topic: "Hábitos en Escolares",
    question: "¿Cuál es una consecuencia directa y comprobada de la omisión frecuente del desayuno en la edad escolar?",
    options: [
      { text: "Aumento inmediato de la velocidad de crecimiento en talla.", id: "A" },
      { text: "Déficit de energía y nutrientes diarios con menor rendimiento y concentración escolar.", id: "B" },
      { text: "Mayor aprovechamiento del hierro vegetal durante el almuerzo.", id: "C" },
      { text: "Reducción permanente de los requerimientos basales de tiamina.", id: "D" }
    ],
    correctId: "B",
    rationale: "Omitir el desayuno disminuye la disponibilidad de glucosa y micronutrientes para el sistema nervioso central a media mañana, impactando negativamente en la atención y la memoria operativa en la escuela."
  },

  // TEMA 6: Requerimientos, Dosis de Hierro y Vitaminas
  {
    id: "q9",
    topic: "Requerimientos de Hierro",
    question: "De acuerdo con la tabla oficial de RDA de Hierro enseñada por la Lic. Mariana Mohedano, ¿cuál es la dosis diaria recomendada para niños de 1 a 3 años y de 4 a 10 años?",
    options: [
      { text: "1-3 años: 15 mg/d; 4-10 años: 20 mg/d.", id: "A" },
      { text: "1-3 años: 7 mg/d; 4-10 años: 10 mg/d.", id: "B" },
      { text: "1-3 años: 2 mg/d; 4-10 años: 5 mg/d.", id: "C" },
      { text: "1-3 años: 12 mg/d; 4-10 años: 12 mg/d.", id: "D" }
    ],
    correctId: "B",
    rationale: "La tabla oficial de la cátedra establece: Lactantes 0-6m: 6 mg/d; 7m-1a: 10 mg/d; Niños 1-3 años: 7 mg/d; Niños 4-6 y 7-10 años: 10 mg/d."
  },
  {
    id: "q10",
    topic: "Requerimientos de Hierro",
    question: "En adolescentes de 14 a 18 años, ¿cuáles son los requerimientos diarios de hierro para varones y mujeres respectivamente?",
    options: [
      { text: "Varones: 12 mg/d; Mujeres: 15 mg/d.", id: "A" },
      { text: "Varones: 18 mg/d; Mujeres: 10 mg/d.", id: "B" },
      { text: "Varones: 7 mg/d; Mujeres: 7 mg/d.", id: "C" },
      { text: "Varones: 15 mg/d; Mujeres: 12 mg/d.", id: "D" }
    ],
    correctId: "A",
    rationale: "En la franja de 14 a 18 años, las mujeres requieren 15 mg/día debido al inicio de las pérdidas menstruales, mientras que los varones necesitan 12 mg/día para expandir su masa eritrocitaria y muscular."
  },
  {
    id: "q11",
    topic: "Vitaminas y Minerales",
    question: "¿Cuál es la dosis diaria y la manifestación clínica clásica de deficiencia de Vitamina A según la tabla oficial?",
    options: [
      { text: "Dosis: 400 UI; Deficiencia: Raquitismo y debilidad muscular.", id: "A" },
      { text: "Dosis: 1500 UI; Deficiencia: Ceguera nocturna, afección cutánea y retraso en el crecimiento.", id: "B" },
      { text: "Dosis: 30-50 mg; Deficiencia: Escorbuto y petequias.", id: "C" },
      { text: "Dosis: 1 mcg; Deficiencia: Anemia megaloblástica.", id: "D" }
    ],
    correctId: "B",
    rationale: "En la tabla de Vitaminas de Mariana Mohedano: Vitamina A tiene un requerimiento de 1500 UI, y su déficit produce ceguera nocturna, queratinización de piel y retraso en el desarrollo."
  },
  {
    id: "q12",
    topic: "Vitaminas y Minerales",
    question: "¿Qué vitamina actúa como coenzima del metabolismo de hidratos de carbono, tiene un requerimiento de 0,4 mg y su deficiencia produce Beri-Beri?",
    options: [
      { text: "Riboflavina (Vitamina B2)", id: "A" },
      { text: "Tiamina (Vitamina B1)", id: "B" },
      { text: "Piridoxina (Vitamina B6)", id: "C" },
      { text: "Ácido Pantoténico", id: "D" }
    ],
    correctId: "B",
    rationale: "La Tiamina (B1) requiere 0,4 mg diarios; sus fuentes son carnes magras, levaduras y cereales integrales, y su deficiencia severa es el Beri-Beri."
  },
  {
    id: "q13",
    topic: "Vitaminas y Minerales",
    question: "En la tabla de Minerales de la cátedra, el Zinc presenta un requerimiento diario de 10 mg. ¿Qué cuadro clínico caracteriza su deficiencia?",
    options: [
      { text: "Bocio y mixedema endémico.", id: "A" },
      { text: "Osteopenia y fracturas patológicas.", id: "B" },
      { text: "Anemia y acrodermatitis enteropática.", id: "C" },
      { text: "Alcalosis metabólica e hipercloremia.", id: "D" }
    ],
    correctId: "C",
    rationale: "En la tabla de Mohedano, la deficiencia de Zinc (10 mg/d) se asocia con anemia, acrodermatitis enteropática y retardo del crecimiento."
  },
  {
    id: "q14",
    topic: "Niño Deportista",
    question: "En la nutrición del niño deportista (Comité de Nutrición AEP), ¿cuál es el porcentaje de deshidratación corporal que comienza a comprometer el rendimiento físico y la termorregulación?",
    options: [
      { text: "Pérdidas de peso superiores al 2%.", id: "A" },
      { text: "Pérdidas de peso superiores al 8%.", id: "B" },
      { text: "Cualquier pérdida superior a 500 gramos.", id: "C" },
      { text: "Únicamente si supera el 10% del peso magro.", id: "D" }
    ],
    correctId: "A",
    rationale: "Una deshidratación tan modesta como el 1-2% del peso corporal deteriora de forma sensible la capacidad aeróbica y la disipación del calor en niños."
  },

  // TEMA 7: Plan de Alimentación y Vianda
  {
    id: "q15",
    topic: "Plan de Alimentación",
    question: "Al estructurar una vianda escolar saludable, ¿cuál de los siguientes esquemas cumple con las recomendaciones de variedad y equilibrio nutricional?",
    options: [
      { text: "Sándwich de fiambre con mayonesa, jugo comercial artificial y alfajor.", id: "A" },
      { text: "Tarta o ensalada con vegetales y huevo/pollo, fruta fresca de postre y agua potable de bebida.", id: "B" },
      { text: "Barra energética para deportistas, bebida azucarada y papas fritas de paquete.", id: "C" },
      { text: "Golosinas y galletitas dulces con jugo saborizado para asegurar glucosa rápida.", id: "D" }
    ],
    correctId: "B",
    rationale: "Una vianda de calidad debe aportar alimentos frescos no procesados: vegetales, legumbres o fuentes proteicas de calidad, fruta de estación como postre natural y agua como única bebida hidratante."
  },

  // TEMA 8: Alimentación Perceptiva (ENNyS 2018-19 - Zapata & Marconi 2024)
  {
    id: "q16",
    topic: "Alimentación Perceptiva",
    question: "En el estudio de Zapata y Marconi (Arch Argent Pediatr 2024) sobre alimentación perceptiva en 4.379 niños de 6 a 23 meses, ¿qué caracteriza al 'Patrón de Distracción con Pantallas'?",
    options: [
      { text: "Aprender recetas interactivas con ayuda de programas educativos de cocina.", id: "A" },
      { text: "El uso habitual del televisor o celular durante las comidas para lograr que el niño ingiera alimento.", id: "B" },
      { text: "El registro fotográfico del plato por parte del nutricionista para evaluar porciones.", id: "C" },
      { text: "La interacción verbal remota con familiares durante la cena familiar.", id: "D" }
    ],
    correctId: "B",
    rationale: "El patrón de distracción se define por mantener pantallas activas (TV/celular) durante la comida, lo que impide que el niño registre la saciedad y fomenta una ingesta pasiva y automática."
  },
  {
    id: "q17",
    topic: "Alimentación Perceptiva",
    question: "¿Qué efecto fisiológico tiene la práctica de presionar y forzar al niño a comer cuando ya manifestó signos de saciedad?",
    options: [
      { text: "Aumenta la capacidad gástrica de forma adaptativa y beneficiosa.", id: "A" },
      { text: "Enseña a ignorar las señales endógenas de autorregulación del apetito y predispone a mayor riesgo de sobrepeso.", id: "B" },
      { text: "Estimula la secreción de enzimas proteolíticas duodenales.", id: "C" },
      { text: "Previene definitivamente los episodios de neofobia alimentaria posterior.", id: "D" }
    ],
    correctId: "B",
    rationale: "La alimentación controladora o forzada interfiere con la autorregulación energética innata del niño, obligándolo a responder a estímulos externos en lugar de a su plenitud interna."
  },
  {
    id: "q18",
    topic: "Alimentación Perceptiva",
    question: "¿Cuál de los siguientes patrones identificados en la ENNyS 2 2018-19 representa una alimentación perceptiva POSITIVA y oportuna?",
    options: [
      { text: "Patrón Indulgente con postrecitos azucarados de reemplazo.", id: "A" },
      { text: "Patrón de Experimentación, Autonomía e Interacción Recíproca.", id: "B" },
      { text: "Patrón Desatento sin contacto visual cuidador-niño.", id: "C" },
      { text: "Patrón de Insistencia con castigos verbales.", id: "D" }
    ],
    correctId: "B",
    rationale: "El patrón donde prevalece la experimentación (tocar y manipular los alimentos), la autonomía (comer con sus propias manos/cubiertos) y la interacción verbal cálida es el óptimo para el desarrollo."
  },

  // TEMA 9: CAPA 2 - Comparación con Guías Alimentarias (GAPA)
  {
    id: "q19",
    topic: "CAPA II - GAPA",
    question: "Según el estudio CAPA II (CESNI - Zapata y Rovirosa), ¿cuál es la brecha en el consumo de Verduras y Frutas en relación con las recomendaciones de las GAPA?",
    options: [
      { text: "Se consume exactamente el 100% de la recomendación oficial.", id: "A" },
      { text: "Se consume una tercera parte (1/3) de la cantidad recomendada, siendo las frutas el grupo con mayor alejamiento histórico.", id: "B" },
      { text: "Se consume el doble de lo recomendado gracias al auge de dietas vegetarianas.", id: "C" },
      { text: "Solo hay déficit de verduras de hoja, pero las frutas se consumen en exceso.", id: "D" }
    ],
    correctId: "B",
    rationale: "El informe de CAPA II documenta que el consumo de verduras y frutas en Argentina alcanza apenas un tercio de las pautas de las GAPA, con una variedad sumamente escasa y una retracción histórica continuada de las frutas."
  },
  {
    id: "q20",
    topic: "CAPA II - GAPA",
    question: "En cuanto al grupo de 'Alimentos de Consumo Opcional' (dulces, grasas y pastelería), ¿qué hallazgo cuantitativo reporta CAPA 2?",
    options: [
      { text: "Se consume menos de la mitad del límite tolerable.", id: "A" },
      { text: "Se consume casi el TRIPLE de la cantidad máxima que indican las guías.", id: "B" },
      { text: "Ha desaparecido prácticamente de los hogares de ingresos medios.", id: "C" },
      { text: "Su ingesta se concentra exclusivamente en manteca y aceites vírgenes.", id: "D" }
    ],
    correctId: "B",
    rationale: "CAPA II demuestra que el consumo aparente de alimentos opcionales triplica el techo prudencial de las GAPA, traccionado por galletitas dulces, bebidas azucaradas, amasados de pastelería y comidas listas para consumir."
  },
  {
    id: "q21",
    topic: "CAPA II - GAPA",
    question: "¿Qué características tiene el consumo aparente del grupo 'Leche, Yogur y Quesos' en la población argentina según CAPA 2?",
    options: [
      { text: "Se consume más del 150% de la recomendación con predominio de descremados.", id: "A" },
      { text: "Se consume menos de la mitad de lo recomendado y predominan las variedades enteras.", id: "B" },
      { text: "El consumo es óptimo en escolares pero nulo en lactantes mayores.", id: "C" },
      { text: "El yogur descremado representa el 80% de las compras lácteas del hogar.", id: "D" }
    ],
    correctId: "B",
    rationale: "El consumo aparente de lácteos es marcadamente deficitario (<50% de las GAPA) y, contrariamente a la recomendación pediátrica de preferir versiones descremadas a partir de los 2 años, predominan ampliamente los lácteos enteros."
  },

  // TEMA 10: CAPA 2 - Sistema NOVA y Ultraprocesados
  {
    id: "q22",
    topic: "CAPA II - Sistema NOVA",
    question: "En el Sistema de Clasificación NOVA adoptado en CAPA 2, ¿a qué grupo pertenecen los alimentos como frutas frescas, verduras, leche fluida fresca y huevos?",
    options: [
      { text: "Grupo 1: Alimentos sin procesar o mínimamente procesados.", id: "A" },
      { text: "Grupo 2: Ingredientes culinarios procesados.", id: "B" },
      { text: "Grupo 3: Alimentos procesados tradicionales.", id: "C" },
      { text: "Grupo 4: Productos ultraprocesados de diseño.", id: "D" }
    ],
    correctId: "A",
    rationale: "El Grupo 1 de NOVA comprende alimentos de origen vegetal o animal obtenidos directamente de la naturaleza sin sustancias añadidas, sometidos a procesos mínimos físicos como lavado, pelado, congelado o pasteurización."
  },
  {
    id: "q23",
    topic: "CAPA II - Sistema NOVA",
    question: "¿Qué distingue a los Productos Ultraprocesados (NOVA Grupo 4) según el informe CAPA 2?",
    options: [
      { text: "Son alimentos conservados en salmuera con dos ingredientes básicos.", id: "A" },
      { text: "Son formulaciones industriales a base de sustancias extraídas o sintetizadas, con aditivos cosméticos y listas para consumir.", id: "B" },
      { text: "Son aceites vegetales obtenidos exclusivamente por prensado en frío.", id: "C" },
      { text: "Son productos con alto contenido de fibra dietética y bajo índice glucémico.", id: "D" }
    ],
    correctId: "B",
    rationale: "Los ultraprocesados son creaciones industriales diseñadas para ser hiperpalatables, duraderas y lucrativas, elaboradas con harinas refinadas, azúcares, aceites interesterificados, colorantes, saborizantes y emulsionantes."
  },
  {
    id: "q24",
    topic: "CAPA II - Sistema NOVA",
    question: "Según los resultados de CAPA 2, ¿cuál es el impacto nutricional del creciente consumo de ultraprocesados en los hogares argentinos?",
    options: [
      { text: "Aumentan significativamente la ingesta de potasio y magnesio biodisponibles.", id: "A" },
      { text: "Aportan más del 70% de los azúcares agregados y un aporte desproporcionado de sodio y grasas saturadas.", id: "B" },
      { text: "Mejoran la adecuación de folatos en madres en edad fértil.", id: "C" },
      { text: "Reducen la densidad energética promedio de la dieta familiar.", id: "D" }
    ],
    correctId: "B",
    rationale: "En CAPA 2 se evidencia que a mayor grado de procesamiento, empeora drásticamente el perfil de nutrientes: los productos NOVA 4 concentran la inmensa mayoría del azúcar libre, las grasas no saludables y el sodio que consumen los hogares."
  },
  {
    id: "q25",
    topic: "CAPA II - Sistema NOVA",
    question: "Si una familia consume: (1) Manzanas frescas, (2) Aceite de girasol para condimentar, (3) Choclo en lata con agua y sal, y (4) Galletitas dulces rellenas; la clasificación NOVA correspondiente en orden es:",
    options: [
      { text: "1: Grupo 1; 2: Grupo 2; 3: Grupo 3; 4: Grupo 4.", id: "A" },
      { text: "1: Grupo 2; 2: Grupo 1; 3: Grupo 4; 4: Grupo 3.", id: "B" },
      { text: "1: Grupo 1; 2: Grupo 3; 3: Grupo 2; 4: Grupo 4.", id: "C" },
      { text: "1: Grupo 4; 2: Grupo 4; 3: Grupo 4; 4: Grupo 4.", id: "D" }
    ],
    correctId: "A",
    rationale: "Manzanas = Grupo 1 (sin procesar); Aceite = Grupo 2 (ingrediente culinario procesado); Choclo en conserva = Grupo 3 (alimento procesado); Galletitas rellenas = Grupo 4 (producto ultraprocesado)."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EXAM_QUESTIONS_BANK };
}
