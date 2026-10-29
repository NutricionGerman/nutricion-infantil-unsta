import csv, os

base_dir = r"2° parcial practica\correccion\tema2"
csv_path = os.path.join(base_dir, "resultados_parcial2_practica_tema2.csv")

rows = []
with open(csv_path, encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for r in reader:
        rows.append(r)

# Generate Markdown Report
md_lines = [
    "# 📋 Acta y Planilla de Calificaciones — 2° Parcial Práctico (TEMA 2)",
    "",
    "> **Cátedra**: Nutrición Infantil — Universidad del Norte Santo Tomás de Aquino (UNSTA)  ",
    "> **Docente a Cargo**: Germán  ",
    "> **Fecha de Evaluación**: 29 de Octubre de 2026  ",
    "> **Instrumento**: Evaluación Escrita de Selección Múltiple (10 Preguntas - Tema 2)  ",
    "> **Clave Oficial de Corrección (Tema 2)**: `B - C - B - C - B - C - B - C - B - C` (Patrón alternado)  ",
    "> **Tope Máximo de Calificación**: 10 Puntos  ",
    "",
    "---",
    "",
    "## 📊 Resumen Ejecutivo — Tema 2",
    "",
    f"- **Total de Evaluaciones Procesadas**: {len(rows)} exámenes.",
    f"- **Alumnos Aprobados (Nota $\\ge$ 4)**: {sum(1 for r in rows if float(r['Puntaje Total Obtenido (Max 10)']) >= 4)} ({sum(1 for r in rows if float(r['Puntaje Total Obtenido (Max 10)']) >= 4)/len(rows)*100:.1f}%).",
    f"- **Calificaciones Sobresalientes / Promoción (Nota $\\ge$ 8)**: {sum(1 for r in rows if float(r['Puntaje Total Obtenido (Max 10)']) >= 8)} alumnos.",
    f"- **Calificación Máxima (10 Puntos)**: {sum(1 for r in rows if float(r['Puntaje Total Obtenido (Max 10)']) == 10)} alumnos.",
    f"- **Alumnos que aplicaron Bonificación de Tienda (+Pts Comprados)**: {sum(1 for r in rows if r['Puntos Comprados (Tienda)'] != '0')} alumnos.",
    "",
    "---",
    "",
    "## 📝 Tabla Completa de Calificaciones — Tema 2",
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
    "## 📁 Archivos y Fotogramas Generados",
    "",
    "- Fotogramas individuales: `2° parcial practica/correccion/tema2/parciales_alumnos/`",
    "- Recortes de grilla: `2° parcial practica/correccion/tema2/parciales_alumnos/recortes_grilla/`",
    "- Hojas de inspección: `2° parcial practica/correccion/tema2/parciales_alumnos/hojas_inspeccion/`",
    "- Planilla CSV: `2° parcial practica/correccion/tema2/resultados_parcial2_practica_tema2.csv`",
    "- Visor web interactivo: `2° parcial practica/correccion/tema2/visor_parciales_tema2.html`"
])

with open(os.path.join(base_dir, "INFORME_CORRECCION_TEMA_2.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(md_lines))

# Generate HTML Visor
html = """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Corrección 2° Parcial Práctico (TEMA 2) — UNSTA</title>
    <style>
        :root {
            --bg: #0f172a;
            --surface: #1e293b;
            --border: #334155;
            --primary: #38bdf8;
            --accent: #22c55e;
            --warning: #f59e0b;
            --danger: #ef4444;
            --text: #f8fafc;
            --text-muted: #94a3b8;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: var(--bg);
            color: var(--text);
            margin: 0;
            padding: 20px;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        header { margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid var(--border); }
        h1 { margin: 0 0 8px 0; font-size: 24px; color: var(--primary); }
        .meta { color: var(--text-muted); font-size: 14px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px; }
        .stat-card { background: var(--surface); padding: 15px 20px; border-radius: 10px; border: 1px solid var(--border); }
        .stat-val { font-size: 28px; font-weight: bold; color: var(--text); }
        .stat-lbl { color: var(--text-muted); font-size: 13px; text-transform: uppercase; margin-top: 4px; }
        .main-layout { display: grid; grid-template-columns: 1fr 480px; gap: 20px; }
        @media (max-width: 1000px) { .main-layout { grid-template-columns: 1fr; } }
        .table-wrap { background: var(--surface); border-radius: 10px; border: 1px solid var(--border); overflow-x: auto; max-height: 80vh; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th, td { padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--border); }
        th { background: #1e293b; position: sticky; top: 0; color: var(--primary); font-weight: 600; }
        tr:hover { background: rgba(56, 189, 248, 0.08); cursor: pointer; }
        tr.active { background: rgba(56, 189, 248, 0.18); font-weight: bold; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; }
        .badge-10 { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid #22c55e; }
        .badge-bonus { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid #f59e0b; }
        .badge-regular { background: rgba(56, 189, 248, 0.15); color: #7dd3fc; }
        .preview-pane { position: sticky; top: 20px; background: var(--surface); border-radius: 10px; border: 1px solid var(--border); padding: 15px; display: flex; flex-direction: column; align-items: center; max-height: 80vh; overflow-y: auto; }
        .preview-pane img { max-width: 100%; border-radius: 8px; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
        .preview-info { width: 100%; margin-top: 12px; font-size: 14px; }
    </style>
</head>
<body>
<div class="container">
    <header>
        <h1>📋 Auditoría y Calificaciones — 2° Parcial Práctico (TEMA 2)</h1>
        <div class="meta">Cátedra Nutrición Infantil — UNSTA | Clave Oficial: <b>B - C - B - C - B - C - B - C - B - C</b></div>
    </header>
    
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-val">31</div>
            <div class="stat-lbl">Exámenes Evaluados</div>
        </div>
        <div class="stat-card">
            <div class="stat-val" style="color: #4ade80;">31 (100%)</div>
            <div class="stat-lbl">Aprobados (&ge; 4 pts)</div>
        </div>
        <div class="stat-card">
            <div class="stat-val" style="color: #38bdf8;">22 (71.0%)</div>
            <div class="stat-lbl">Sobresalientes (&ge; 8 pts)</div>
        </div>
        <div class="stat-card">
            <div class="stat-val" style="color: #fbbf24;">17</div>
            <div class="stat-lbl">Notas Máximas (10)</div>
        </div>
    </div>
    
    <div class="main-layout">
        <div class="table-wrap">
            <table id="examTable">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>UP</th>
                        <th>Alumno</th>
                        <th>Grupo</th>
                        <th>Base</th>
                        <th>Tienda</th>
                        <th>Total</th>
                        <th>Respuestas</th>
                    </tr>
                </thead>
                <tbody>
"""

for r in rows:
    badge_class = "badge-10" if float(r['Puntaje Total Obtenido (Max 10)']) == 10 else "badge-regular"
    bonus_badge = f"<span class='badge badge-bonus'>{r['Puntos Comprados (Tienda)']}</span>" if r['Puntos Comprados (Tienda)'] != '0' else "<span style='color:gray;'>0</span>"
    
    html += f"""
                    <tr onclick="showPreview('{r['N°']}', '{r['Apellido y Nombre']}', '{r['UP']}', '{r['Puntaje Base (/10)']}', '{r['Puntos Comprados (Tienda)']}', '{r['Puntaje Total Obtenido (Max 10)']}', '{r['Respuestas Marcadas (P1-P10)']}', '{r['Observaciones']}', '{int(r['N°']):02d}')">
                        <td>{r['N°']}</td>
                        <td><code>{r['UP']}</code></td>
                        <td><b>{r['Apellido y Nombre']}</b></td>
                        <td>{r['Comisión / Grupo']}</td>
                        <td>{r['Puntaje Base (/10)']}</td>
                        <td>{bonus_badge}</td>
                        <td><span class="badge {badge_class}">{r['Puntaje Total Obtenido (Max 10)']}</span></td>
                        <td><code>{r['Respuestas Marcadas (P1-P10)']}</code></td>
                    </tr>"""

html += """
                </tbody>
            </table>
        </div>
        
        <div class="preview-pane" id="previewPane">
            <div id="pvTitle" style="font-weight:bold; font-size:16px; margin-bottom:10px; color:var(--primary);">Seleccione un alumno</div>
            <img id="pvImg" src="parciales_alumnos/recortes_grilla/crop_01.jpg" alt="Examen" style="display:none;">
            <div class="preview-info" id="pvInfo"></div>
        </div>
    </div>
</div>

<script>
function showPreview(num, name, up, base, bonus, total, ans, obs, padNum) {
    document.querySelectorAll('tr').forEach(tr => tr.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    document.getElementById('pvTitle').innerText = '#' + num + ' — ' + name;
    const img = document.getElementById('pvImg');
    img.src = 'parciales_alumnos/recortes_grilla/crop_' + padNum + '.jpg';
    img.style.display = 'block';
    
    document.getElementById('pvInfo').innerHTML = `
        <p><b>UP:</b> ${up}</p>
        <p><b>Puntaje Base:</b> ${base} / 10</p>
        <p><b>Puntos Tienda:</b> ${bonus}</p>
        <p><b>Puntaje Total:</b> <span style="font-size:18px; color:#4ade80; font-weight:bold;">${total}</span> / 10</p>
        <p><b>Respuestas:</b> <code>${ans}</code></p>
        ${obs ? `<p style="color:#fbbf24; font-size:12px;"><b>Obs:</b> ${obs}</p>` : ''}
    `;
}
window.onload = function() {
    const firstRow = document.querySelector('tbody tr');
    if (firstRow) firstRow.click();
}
</script>
</body>
</html>
"""

with open(os.path.join(base_dir, "visor_parciales_tema2.html"), "w", encoding="utf-8") as f:
    f.write(html)

print("Tema 2 reports and visualizer generated.")
