/**
 * DATOS PARA LOS MINIJUEGOS INTERACTIVOS (NIVEL 3: CLÍNICO PEDIÁTRICO)
 * 1. Clasificador Sistema NOVA (NOVA 1, 2, 3, 4)
 * 2. Clasificador de Etapas del Desarrollo (Preescolar, Escolar, Adolescente)
 * 3. Tríada de Nutrientes (Nutriente ↔ Fuente ↔ Deficiencia)
 */

const NOVA_GAME_ITEMS = [
  { id: "nv1", name: "Zanahorias y manzanas frescas", group: 1, icon: "🥕", detail: "Alimento natural sin agregados de sustancias industriales." },
  { id: "nv2", name: "Leche fluida pasteurizada entera", group: 1, icon: "🥛", detail: "Mínimamente procesado físico (pasteurización) sin aditivos." },
  { id: "nv3", name: "Huevos de gallina", group: 1, icon: "🥚", detail: "Alimento natural sin procesar." },
  { id: "nv4", name: "Lentejas y garbanzos secos", group: 1, icon: "🍲", detail: "Alimento natural vegetal deshidratado." },
  { id: "nv5", name: "Carne fresca vacuna o de pollo", group: 1, icon: "🥩", detail: "Corte fresco sin salmuera ni aditivos." },

  { id: "nv6", name: "Aceite de girasol / oliva", group: 2, icon: "🫒", detail: "Ingrediente culinario obtenido por extracción/prensado." },
  { id: "nv7", name: "Azúcar de mesa (sacarosa)", group: 2, icon: "🍬", detail: "Ingrediente culinario procesado para cocinar o sazonar." },
  { id: "nv8", name: "Sal de mesa yodada", group: 2, icon: "🧂", detail: "Mineral extraído utilizado como ingrediente en la cocina." },
  { id: "nv9", name: "Manteca tradicional", group: 2, icon: "🧈", detail: "Ingrediente graso extraído de la leche." },

  { id: "nv10", name: "Atún en lata con agua y sal", group: 3, icon: "🐟", detail: "Alimento procesado: pescado natural + ingrediente culinario (agua y sal)." },
  { id: "nv11", name: "Queso tybo tradicional", group: 3, icon: "🧀", detail: "Alimento procesado elaborado con leche, fermentos y sal." },
  { id: "nv12", name: "Pan francés artesanal de panadería", group: 3, icon: "🥖", detail: "Elaborado con harina, agua, levadura y sal (pocos ingredientes simples)." },
  { id: "nv13", name: "Arvejas y choclo en lata", group: 3, icon: "🥫", detail: "Vegetal fresco en conserva simple con salmuera." },

  { id: "nv14", name: "Gaseosas colas y jugos en polvo", group: 4, icon: "🥤", detail: "Ultraprocesado: agua, azúcar, colorante caramelo, acidulantes y saborizantes." },
  { id: "nv15", name: "Galletitas dulces rellenas con crema", group: 4, icon: "🍪", detail: "Ultraprocesado: harinas refinadas, grasas interesterificadas, jarabe de maíz y emulsionantes." },
  { id: "nv16", name: "Nuggets de pollo congelados", group: 4, icon: "🍗", detail: "Ultraprocesado: pasta de pollo, almidones modificados, fosfatos y aromatizantes." },
  { id: "nv17", name: "Postrecitos lácteos sabor vainilla", group: 4, icon: "🍮", detail: "Ultraprocesado: leche modificada, almidón, carragenina, azúcar y saborizantes sintéticos." },
  { id: "nv18", name: "Cereales de desayuno azucarados", group: 4, icon: "🥣", detail: "Ultraprocesado: harinas extrusionadas, azúcar añadido, colorantes y vitaminas agregadas." },
  { id: "nv19", name: "Salchichas tipo viena", group: 4, icon: "🌭", detail: "Ultraprocesado: carne mecánicamente recuperada, nitritos, fosfatos y glutamato." }
];

const ETAPAS_GAME_ITEMS = [
  { id: "et1", text: "Aumento de peso de 2 a 3 kg por año y crecimiento en talla uniforme", stage: "preescolar", rationale: "Característica de crecimiento físico entre los 2 y 5 años (Mohedano)." },
  { id: "et2", text: "Aparición frecuente de neofobia alimentaria y 'food jags' (manías con un solo alimento)", stage: "preescolar", rationale: "Pico de selectividad y rechazo a texturas/olores desconocidos a los 2-5 años." },
  { id: "et3", text: "Necesidad de cucharas y tenedores cortos y gruesos para promover la autonomía", stage: "preescolar", rationale: "Adaptación ergonómica por desarrollo motor fino en preescolares." },
  { id: "et4", text: "Anorexia fisiológica por desaceleración en la velocidad de crecimiento", stage: "preescolar", rationale: "Disminución normal del apetito al finalizar el primer año de vida." },

  { id: "et5", text: "Consumo de televisión de 23 hs semanales y alta exposición a marketing de ultraprocesados", stage: "escolar", rationale: "Patrón de exposición audiovisual destacado en escolares (Mohedano)." },
  { id: "et6", text: "La omisión del desayuno es un error frecuente que perjudica la atención matutina", stage: "escolar", rationale: "Problema habitual en escolares de 6 a 12 años con jornadas escolares." },
  { id: "et7", text: "Mayor influencia del grupo de amigos, maestros e ídolos deportivos como modelos", stage: "escolar", rationale: "Ampliación de la socialización fuera del núcleo familiar primario." },
  { id: "et8", text: "Ampliación de la variedad alimentaria, preferencia por colaciones y comer fuera de casa", stage: "escolar", rationale: "Comportamiento alimentario del escolar de 6 a 12 años." },

  { id: "et9", text: "Estirón puberal con duplicación de la masa muscular magra en varones", stage: "adolescente", rationale: "Efecto anabólico de los andrógenos en la composición corporal puberal." },
  { id: "et10", text: "Aumento relativo de masa grasa con distribución ginoide en caderas y muslos en mujeres", stage: "adolescente", rationale: "Dimorfismo sexual en mujeres mediado por estrógenos." },
  { id: "et11", text: "RDA de hierro elevada a 15 mg/día en mujeres por pérdidas catameniales", stage: "adolescente", rationale: "Requerimiento aumentado post-menarca de 14 a 18 años (Mohedano)." },
  { id: "et12", text: "Alta frecuencia de horarios erráticos, omisión de comidas y elevado consumo de fast food", stage: "adolescente", rationale: "Búsqueda de independencia y hábitos característicos del adolescente." },
  { id: "et13", text: "Situación de doble demanda biológica en caso de embarazo o lactancia temprana", stage: "adolescente", rationale: "Competencia de nutrientes madre-hijo descripta por Ruiz Herrero." }
];

const NUTRI_TRIADAS = [
  {
    nutriente: "Hierro (Fe)",
    dosis: "7 mg/d (1-3a) / 10 mg/d (4-10a) / 15 mg/d (Mujeres 14-18a)",
    fuente: "Carnes rojas, hígado, legumbres, yema de huevo",
    deficiencia: "Anemia microcítica hipocrómica, fatiga, alteración del desarrollo cognitivo"
  },
  {
    nutriente: "Vitamina A",
    dosis: "1500 UI",
    fuente: "Hígado, zanahoria, zapallo, yema de huevo, espinacas",
    deficiencia: "Ceguera nocturna (hemeralopía), hiperqueratosis folicular, retraso en crecimiento"
  },
  {
    nutriente: "Vitamina D",
    dosis: "400 UI",
    fuente: "Pescados grasos, lácteos fortificados, síntesis solar",
    deficiencia: "Raquitismo en niños, tetania por hipocalcemia, debilidad muscular"
  },
  {
    nutriente: "Vitamina C",
    dosis: "30 a 50 mg",
    fuente: "Cítricos, pimientos, frutilla, kiwi, brócoli",
    deficiencia: "Escorbuto, petequias, mala cicatrización, sangrado gingival"
  },
  {
    nutriente: "Tiamina (B1)",
    dosis: "0,4 mg",
    fuente: "Cerdo magro, levaduras, cereales integrales, legumbres",
    deficiencia: "Beri-Beri (afectación cardiovascular o neurológica), inapetencia"
  },
  {
    nutriente: "Zinc (Zn)",
    dosis: "10 mg",
    fuente: "Carnes rojas, vísceras, legumbres, cereales integrales",
    deficiencia: "Acrodermatitis enteropática, retraso en crecimiento, hipogeusia, anemia"
  },
  {
    nutriente: "Calcio (Ca)",
    dosis: "800 mg (escolar) a 1300 mg (adolescente)",
    fuente: "Leche, yogur, quesos, bebidas vegetales fortificadas",
    deficiencia: "Baja densidad mineral ósea, osteopenia, raquitismo hipocalcémico"
  },
  {
    nutriente: "Cobalamina (B12)",
    dosis: "1 mcg",
    fuente: "Carnes, huevos, lácteos (exclusivo origen animal)",
    deficiencia: "Anemia megaloblástica, daño neurológico irreversible en mielina"
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { NOVA_GAME_ITEMS, ETAPAS_GAME_ITEMS, NUTRI_TRIADAS };
}
