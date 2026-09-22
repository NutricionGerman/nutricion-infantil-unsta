# 🥗 Skill: Mantenimiento y Deploy del Taller de Dietas & Sheets

> **Objetivo**: Administrar el ciclo de vida del taller de dietas independiente (`/dieta/`), mantener sincronizado el código en GitHub Pages y asegurar la correcta recepción de las 48 columnas en Google Sheets.

---

## 🛑 Regla de Seguridad
**NUNCA enlaces esta aplicación al menú principal del portal oficial (`index.html`)** salvo que Germán lo solicite de manera expresa. El taller debe permanecer como una herramienta satélite e independiente para uso en clase.

---

## 📂 Componentes del Sistema

1. **Aplicación Web Estática**:
   * Directorio en producción: `dieta/` (`index.html`, `alimentos.json`, `keys.js`).
   * Directorio local original: `Asistencia Nutricion 2° Cuatrimestre/clases/clase_duelo_alimentos/PROYECTO_AISLADO/`.
   * Enlace online público: `https://nutriciongerman.github.io/nutricion-infantil-unsta/dieta/`.
2. **Backend Serverless (Google Apps Script)**:
   * Script maestro: `dieta/GoogleAppsScript_Dieta.gs.txt`.
   * Recibe peticiones POST vía `no-cors` con el JSON de la dieta calculada.
3. **Hoja de Destino (Google Sheets)**:
   * Pestaña oficial: `Dietas_Registradas`.
   * **48 Columnas** (rango de la `A` a la `AV`).

---

## 📊 Estructura de las 48 Columnas en Google Sheets

| Columna | Nombre del Encabezado | Datos registrados |
| :--- | :--- | :--- |
| **A** | Fecha y Hora | Timestamp de la entrega (`es-AR`) |
| **B** | Alumno / Identificación | Apellido, Nombre y Legajo |
| **C** | **Tipo de Dieta** | `Omnívora`, `Vegetariana` o `Vegana` |
| **D** | Calorías Totales (kcal) | Sumatoria energética de la pauta |
| **E** | Meta Calórica (kcal) | 2500 kcal estándar |
| **F** | % Adecuación Calórica | Adecuación respecto a la meta |
| **G - L** | Macronutrientes y Fibra | Proteínas (g, % VCT), Carbs (g, % VCT), Grasas (g, % VCT), Fibra (g) |
| **M - S** | Perfil Lipídico Avanzado | Grasas Saturadas, Mono, Poli, Omega-3, Omega-6 y Colesterol (mg) |
| **T - AO** | **Los 22 Micronutrientes** | Calcio, Hierro, Magnesio, Fósforo, Potasio, Sodio, Zinc, Selenio, Manganeso, Cobre, Vitaminas A, C, D, E, K, B1, B2, B3, B6, B9, B12 y Colina (% RDA) |
| **AP - AQ** | Conteos Clínicos | Nutrientes Óptimos ($\ge 100\%$) y Nutrientes Deficientes ($< 70\%$) |
| **AR - AV** | Desglose por Comidas | Detalle de alimentos en Desayuno, Almuerzo, Merienda, Cena y Colación |

---

## 🔄 Protocolo de Modificación y Deploy

### Paso 1: Edición y Sincronización Local
1. Si se edita `dieta/index.html`, **siempre copiar los cambios a `PROYECTO_AISLADO/index.html`** para mantener consistencia:
   ```powershell
   Copy-Item 'dieta\index.html' -Destination 'Asistencia Nutricion 2° Cuatrimestre\clases\clase_duelo_alimentos\PROYECTO_AISLADO\index.html' -Force
   ```

### Paso 2: Publicación en GitHub Pages
1. Verificar estado de Git:
   ```bash
   git status
   ```
2. Realizar commit con prefijo claro y subir a producción:
   ```bash
   git add dieta/
   git commit -m "Feat(dieta): Descripción del cambio realizado"
   git push origin master
   ```

### Paso 3: Actualización de Google Apps Script (Si cambia el esquema de columnas)
Para evitar que cambie la URL del endpoint y se rompa la conexión web:
1. En Google Sheets, ir a **Extensiones > Apps Script**.
2. Pegar el código actualizado en `Código.gs`.
3. Guardar con **`Ctrl + S`** (el disquete 💾).
4. Ir a **Implementar > Administrar implementaciones**:
   * Hacer clic en el **Lápiz (Editar)** de la implementación activa.
   * En "Versión", elegir **"Nueva versión"**.
   * Hacer clic en **Implementar**.
   *(De este modo la URL de la Web App se mantiene exactamente igual).*

### Paso 4: Verificación con Test Automatizado
Probar el endpoint con un envío simulado desde consola para asegurar respuesta `{"result":"success"}`:
```bash
node -e "fetch('URL_DEL_SCRIPT', {method:'POST', body:JSON.stringify({alumno:'TEST', tipo_dieta:'Omnívora'})}).then(r=>r.text()).then(console.log)"
```
