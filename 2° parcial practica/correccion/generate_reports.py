import json, os

with open(r"2° parcial practica\correccion\parciales_alumnos\exam_manifest.json", encoding='utf-8') as f:
    manifest = json.load(f)

# Load CSV data or generated results
import csv
rows = []
with open(r"2° parcial practica\correccion\resultados_parcial2_practica.csv", encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for r in reader:
        rows.append(r)

# Generate Markdown Report
md_lines = [
    "# 📋 Acta y Planilla de Calificaciones — 2° Parcial Práctico",
    "",
    "> **Cátedra**: Nutrición Infantil — Universidad del Norte Santo Tomás de Aquino (UNSTA)  ",
    "> **Docente a Cargo**: Germán  ",
    "> **Fecha de Evaluación**: 29 de Octubre de 2026  ",
    "> **Instrumento**: Evaluación Escrita de Selección Múltiple (10 Preguntas - Tema 1)  ",
    "> **Clave Oficial de Corrección**: `B - B - C - C - B - B - C - C - B - B`  ",
    "> **Tope Máximo de Calificación**: 10 Puntos  ",
    "",
    "---",
    "",
    "## 📊 Resumen Ejecutivo del Parcial",
    "",
    f"- **Total de Evaluaciones Procesadas**: {len(rows)} exámenes.",
    f"- **Alumnos Aprobados (Nota $\\ge$ 4)**: {sum(1 for r in rows if float(r['Puntaje Total Obtenido (Max 10)']) >= 4)} ({sum(1 for r in rows if float(r['Puntaje Total Obtenido (Max 10)']) >= 4)/len(rows)*100:.1f}%).",
    f"- **Calificaciones Sobresalientes / Promoción (Nota $\\ge$ 8)**: {sum(1 for r in rows if float(r['Puntaje Total Obtenido (Max 10)']) >= 8)} alumnos.",
    f"- **Calificación Máxima (10 Puntos)**: {sum(1 for r in rows if float(r['Puntaje Total Obtenido (Max 10)']) == 10)} alumnos.",
    f"- **Alumnos que aplicaron Bonificación de Tienda (+Pts Comprados)**: {sum(1 for r in rows if r['Puntos Comprados (Tienda)'] != '0')} alumnos.",
    "",
    "---",
    "",
    "## 📝 Tabla Completa de Calificaciones",
    "",
    "| N° | UP | Apellido y Nombre | Comisión / Grupo | Puntaje Base (/10) | Pts Comprados (Tienda) | Puntaje Final (Max 10) | Respuestas Marcadas | Observaciones |",
    "| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :--- |"
]

for r in rows:
    pts_comp_str = f"**{r['Puntos Comprados (Tienda)']}**" if r['Puntos Comprados (Tienda)'] != '0' else "-"
    nota_final_str = f"**{r['Puntaje Total Obtenido (Max 10)']}**"
    if float(r['Puntaje Total Obtenido (Max 10)']) == 10:
        nota_final_str = f"⭐ **10**"
    elif float(r['Puntaje Total Obtenido (Max 10)']) < 4:
        nota_final_str = f"⚠️ <span style='color:red;'>**{r['Puntaje Total Obtenido (Max 10)']}**</span>"
    
    md_lines.append(f"| {r['N°']} | `{r['UP']}` | {r['Apellido y Nombre']} | {r['Comisión / Grupo']} | {r['Puntaje Base (/10)']} / 10 | {pts_comp_str} | {nota_final_str} | `{r['Respuestas Marcadas (P1-P10)']}` | {r['Observaciones']} |")

md_lines.extend([
    "",
    "---",
    "",
    "## 📁 Fotogramas Separados y Archivos Generados",
    "",
    "Todos los fotogramas clave individuales han sido extraídos del video en alta definición y organizados en:",
    "`2° parcial practica/correccion/parciales_alumnos/`",
    "",
    "Asimismo, se han generado las hojas de inspección visual en alta resolución y la grilla individual recortada de cada alumno para su auditoría inmediata en:",
    "`2° parcial practica/correccion/parciales_alumnos/recortes_grilla/` y `hojas_inspeccion/`."
])

with open(r"2° parcial practica\correccion\INFORME_CORRECCION_2_PARCIAL_PRACTICA.md", "w", encoding="utf-8") as f:
    f.write("\n".join(md_lines))

print("Markdown report written successfully.")
