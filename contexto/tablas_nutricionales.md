# 🥗 Tablas Nutricionales y Criterios Científicos

> **Ámbito**: Herramientas Clínicas y Pedagógicas de la Cátedra de Nutrición Infantil (UNSTA)  
> **Fuentes Científicas**: USDA FoodData Central, NCCDB Verified, Dietary Reference Intakes (DRI / RDA) del Institute of Medicine (IOM / NASEM), FAO y OMS.

---

## 📌 Diferenciación de Módulos del Proyecto

Para evitar confusiones, el proyecto tiene dos universos nutricionales claramente delimitados:

1. **Módulos del Portal Central (`index.html`)**:
   - **Kiosco Saludable**: Enfocado en recetas escolares y el cumplimiento de la Ley de Etiquetado Frontal (Ley 27.642 de Promoción de la Alimentación Saludable en Argentina) evaluando excesos de azúcares, sodio, grasas saturadas y calorías.
   - **Juego "Duelo Nutricional"**: Utiliza una lista didáctica reducida de **25 alimentos clave** (`alimentos.js`) para comparar densidad de nutrientes en el proyector del aula.

2. **Módulo "Taller de Dietas y Cálculo RDA" (`/dieta/` y `PROYECTO_AISLADO/`)**:
   - Aplicación independiente orientada al cálculo dietético exhaustivo en base al catálogo completo de 560 alimentos (incluyendo fórmulas infantiles estándar e hiperconcentradas).

---

## 🍎 El Catálogo de 560 Alimentos (`alimentos.json`)

* **Ubicación**: `dieta/alimentos.json` y `PROYECTO_AISLADO/alimentos.json`.
* **Fuente**: Base de datos verificada de **USDA FoodData Central (SR Legacy) / NCCDB Verified** (generada el 4 de septiembre de 2026).
* **Estructura por alimento**:
  * Porción de referencia: **100 gramos**.
  * Energía (kcal), Proteínas, Carbohidratos totales, Carbohidratos netos, Fibra total, Fibra soluble e insoluble, Azúcares.
  * Perfil lipídico: Grasas totales, saturadas, monoinsaturadas, poliinsaturadas, colesterol, Omega-3 y Omega-6.
  * 22 Micronutrientes completos (minerales y vitaminas).
  * Antinutrientes: Oxalatos y Fitatos (mg).

---

## 🎯 Perfil Biológico de Referencia del Taller: Adolescente 2500 kcal

Para las prácticas del taller de dietas, el perfil estándar de cálculo es:

* **Población**: Adolescente Masculino (14 a 18 años).
* **Peso corporal estándar**: 70.0 kg.
* **Meta Energética Oficial**: **2500 kcal**.

### 1. Rangos Aceptables de Macronutrientes (AMDR - IOM)
* **Carbohidratos**: 45% a 65% del VCT (281 g a 406 g para 2500 kcal).
* **Grasas**: 20% a 35% del VCT (56 g a 97 g para 2500 kcal).
* **Proteínas**: Mínimo 0.85 g/kg de peso (~60 g base) o 10% a 30% del VCT.
* **Fibra dietética**: Mínimo **38 g/día** para este grupo biológico.

### 2. Metas de Ácidos Grasos y Lípidos
* **Grasas Saturadas**: Menos del 10% del VCT (<28 g).
* **Colesterol**: Menos de 300 mg/día.
* **Balance $\omega 6 / \omega 3$**: Ratio óptimo entre 4:1 y 10:1 (ideal $\le 5:1$).

---

## 🔬 Los 22 Micronutrientes Monitoreados y Metas RDA

| Micronutriente | Meta RDA (Adolescente 14-18a) | Unidad | Tipo / Límite |
| :--- | :--- | :--- | :--- |
| **Calcio** | 1300.0 | mg | Mineral esencial |
| **Hierro** | 11.0 | mg | Mineral esencial |
| **Magnesio** | 410.0 | mg | Mineral |
| **Fósforo** | 1250.0 | mg | Mineral |
| **Potasio** | 3000.0 | mg | Mineral / Electrolito |
| **Sodio** | 2300.0 | mg | Límite superior máximo |
| **Zinc** | 11.0 | mg | Mineral esencial |
| **Selenio** | 55.0 | µg | Oligoelemento |
| **Manganeso** | 2.2 | mg | Oligoelemento |
| **Cobre** | 0.89 | mg | Oligoelemento |
| **Vitamina A** | 900.0 | µg | Vitamina liposoluble |
| **Vitamina C** | 75.0 | mg | Vitamina hidrosoluble |
| **Vitamina D** | 600.0 | IU | Vitamina liposoluble |
| **Vitamina E** | 15.0 | mg | Vitamina liposoluble |
| **Vitamina K** | 75.0 | µg | Vitamina liposoluble |
| **Vitamina B1 (Tiamina)** | 1.2 | mg | Complejo B |
| **Vitamina B2 (Riboflavina)** | 1.3 | mg | Complejo B |
| **Vitamina B3 (Niacina)** | 16.0 | mg | Complejo B |
| **Vitamina B6 (Piridoxina)** | 1.3 | mg | Complejo B |
| **Folatos (Vitamina B9)** | 400.0 | µg | Complejo B |
| **Vitamina B12 (Cobalamina)** | 2.4 | µg | Complejo B |
| **Colina** | 550.0 | mg | Nutriente esencial |

---

## 🚦 Umbrales de Corte Clínico (Semáforo de Adecuación)

Tanto en la web interactiva como en el Google Sheets Canvas se utilizan tres zonas clínicas:
* 🔴 **Deficiente**: Menos del **70%** de la RDA (Riesgo nutricional).
* 🟡 **Moderado / Aceptable**: Entre **70% y 99%** de la RDA.
* 🟢 **Óptimo / En Meta**: **$\ge$ 100%** de la RDA (Requerimiento cubierto).

---

## 🥩🥗🌱 Los 3 Patrones Dietarios del Taller

Para enriquecer la discusión clínica y el análisis en el Dashboard, los estudiantes seleccionan su patrón al enviar la dieta:
1. 🥩 **Omnívora**: Incluye carnes de todo tipo, lácteos y huevos.
2. 🥗 **Vegetariana**: Ovolactovegetariana (sin carnes, pero con derivados lácteos y huevos).
3. 🌱 **Vegana**: 100% vegetal estricta (sin carnes, lácteos, huevos ni derivados animales).

Esta clasificación se guarda en la **Columna C** de Google Sheets y permite al Canvas comparar en vivo cómo fluctúan los nutrientes críticos (como la B12, el Calcio o el Hierro no hemínico) entre los diferentes patrones.
