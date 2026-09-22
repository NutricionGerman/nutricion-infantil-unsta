// Lista oficial de los 25 alimentos de la cátedra para el Duelo Nutricional
// Emojis universales 100% compatibles con todas las versiones de Windows, iOS y Android
const alimentosDatabase = [
    // ----------------------------------------------------
    // PROTEÍNAS Y CARNES
    // ----------------------------------------------------
    { 
        id: 1, 
        nombre: "Huevo", 
        emoji: "🥚", 
        categoria: "Proteína de alto valor"
    },
    { 
        id: 2, 
        nombre: "Carne magra", 
        emoji: "🥩", 
        categoria: "Carne magra"
    },
    { 
        id: 3, 
        nombre: "Pechuga de pollo", 
        emoji: "🍗", 
        categoria: "Carne magra"
    },
    { 
        id: 4, 
        nombre: "Salmón / Pescado azul", 
        emoji: "🐟", 
        categoria: "Pescado azul"
    },

    // ----------------------------------------------------
    // LÁCTEOS, BEBIDAS VEGETALES Y CALDOS
    // ----------------------------------------------------
    { 
        id: 5, 
        nombre: "Queso magro", 
        emoji: "🧀", 
        categoria: "Lácteo magro"
    },
    { 
        id: 6, 
        nombre: "Leche descremada", 
        emoji: "🥛", 
        categoria: "Lácteo descremado"
    },
    { 
        id: 7, 
        nombre: "Bebida de soja", 
        emoji: "🌱", 
        categoria: "Bebida vegetal"
    },
    { 
        id: 8, 
        nombre: "Yogur natural sin azúcar", 
        emoji: "🥛", 
        categoria: "Lácteo fermentado"
    },
    { 
        id: 9, 
        nombre: "Caldo de huesos", 
        emoji: "🥣", 
        categoria: "Caldo nutricional"
    },

    // ----------------------------------------------------
    // LEGUMBRES Y CEREALES INTEGRALES
    // ----------------------------------------------------
    { 
        id: 10, 
        nombre: "Lentejas", 
        emoji: "🍲", 
        categoria: "Legumbre"
    },
    { 
        id: 11, 
        nombre: "Garbanzos", 
        emoji: "🧆", 
        categoria: "Legumbre"
    },
    { 
        id: 12, 
        nombre: "Avena integral", 
        emoji: "🥣", 
        categoria: "Cereal integral"
    },

    // ----------------------------------------------------
    // FRUTAS FRESCAS
    // ----------------------------------------------------
    { 
        id: 13, 
        nombre: "Arándanos", 
        emoji: "🍇", // Baya/uva universal compatible con cualquier sistema
        categoria: "Fruta fresca"
    },
    { 
        id: 14, 
        nombre: "Naranja", 
        emoji: "🍊", 
        categoria: "Fruta fresca"
    },
    { 
        id: 15, 
        nombre: "Manzana fresca", 
        emoji: "🍎", 
        categoria: "Fruta fresca"
    },
    { 
        id: 16, 
        nombre: "Banana madura", 
        emoji: "🍌", 
        categoria: "Fruta fresca"
    },

    // ----------------------------------------------------
    // VERDURAS Y HORTALIZAS
    // ----------------------------------------------------
    { 
        id: 17, 
        nombre: "Brócoli al vapor", 
        emoji: "🥦", 
        categoria: "Verdura"
    },
    { 
        id: 18, 
        nombre: "Espinaca fresca", 
        emoji: "🥬", 
        categoria: "Verdura de hoja"
    },

    // ----------------------------------------------------
    // GRASAS SALUDABLES, FRUTOS SECOS Y SEMILLAS
    // ----------------------------------------------------
    { 
        id: 19, 
        nombre: "Palta", 
        emoji: "🥑", 
        categoria: "Grasa cardiosaludable"
    },
    { 
        id: 20, 
        nombre: "Nueces", 
        emoji: "🥜", 
        categoria: "Fruto seco"
    },
    { 
        id: 21, 
        nombre: "Semillas de lino", 
        emoji: "🌱", 
        categoria: "Semilla oleaginosa"
    },
    { 
        id: 22, 
        nombre: "Aceite de oliva virgen extra", 
        emoji: "🍶", // Botella/jarra tradicional 100% visible en Windows
        categoria: "Aceite virgen"
    },

    // ----------------------------------------------------
    // ALIMENTOS ULTRAPROCESADOS (CONTRASTE NUTRICIONAL)
    // ----------------------------------------------------
    { 
        id: 23, 
        nombre: "Gaseosa cola regular", 
        emoji: "🥤", 
        categoria: "Bebida azucarada"
    },
    { 
        id: 24, 
        nombre: "Papas fritas en paquete", 
        emoji: "🍟", 
        categoria: "Snack ultraprocesado"
    },
    { 
        id: 25, 
        nombre: "Galletitas dulces rellenas", 
        emoji: "🍪", 
        categoria: "Ultraprocesado dulce"
    }
];
