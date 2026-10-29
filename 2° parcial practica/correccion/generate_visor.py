import json, csv, os

# Create HTML visualizer
html = """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Corrección 2° Parcial Práctico — Nutrición Infantil UNSTA</title>
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
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        header {
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--border);
        }
        h1 { margin: 0 0 8px 0; font-size: 24px; color: var(--primary); }
        .meta { color: var(--text-muted); font-size: 14px; }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 25px;
        }
        .stat-card {
            background: var(--surface);
            padding: 15px 20px;
            border-radius: 10px;
            border: 1px solid var(--border);
        }
        .stat-val { font-size: 28px; font-weight: bold; color: var(--text); }
        .stat-lbl { color: var(--text-muted); font-size: 13px; text-transform: uppercase; margin-top: 4px; }
        
        .main-layout {
            display: grid;
            grid-template-columns: 1fr 480px;
            gap: 20px;
        }
        @media (max-width: 1000px) {
            .main-layout { grid-template-columns: 1fr; }
        }
        
        .table-wrap {
            background: var(--surface);
            border-radius: 10px;
            border: 1px solid var(--border);
            overflow-x: auto;
            max-height: 80vh;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }
        th, td {
            padding: 10px 14px;
            text-align: left;
            border-bottom: 1px solid var(--border);
        }
        th {
            background: #1e293b;
            position: sticky;
            top: 0;
            color: var(--primary);
            font-weight: 600;
        }
        tr:hover { background: rgba(56, 189, 248, 0.08); cursor: pointer; }
        tr.active { background: rgba(56, 189, 248, 0.18); font-weight: bold; }
        .badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: bold;
        }
        .badge-10 { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid #22c55e; }
        .badge-bonus { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid #f59e0b; }
        .badge-regular { background: rgba(56, 189, 248, 0.15); color: #7dd3fc; }
        .badge-low { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid #ef4444; }
        
        .preview-pane {
            position: sticky;
            top: 20px;
            background: var(--surface);
            border-radius: 10px;
            border: 1px solid var(--border);
            padding: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            max-height: 80vh;
            overflow-y: auto;
        }
        .preview-pane img {
            max-width: 100%;
            border-radius: 8px;
            border: 1px solid var(--border);
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }
        .preview-info {
            width: 100%;
            margin-top: 12px;
            font-size: 14px;
        }
    </style>
</head>
<body>
<div class="container">
    <header>
        <h1>📋 Auditoría y Calificaciones — 2° Parcial Práctico</h1>
        <div class="meta">Cátedra Nutrición Infantil — UNSTA | Clave Oficial: <b>B - B - C - C - B - B - C - C - B - B</b></div>
    </header>
    
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-val">46</div>
            <div class="stat-lbl">Exámenes Evaluados</div>
        </div>
        <div class="stat-card">
            <div class="stat-val" style="color: #4ade80;">45 (97.8%)</div>
            <div class="stat-lbl">Aprobados (&ge; 4 pts)</div>
        </div>
        <div class="stat-card">
            <div class="stat-val" style="color: #38bdf8;">31 (67.4%)</div>
            <div class="stat-lbl">Sobresalientes (&ge; 8 pts)</div>
        </div>
        <div class="stat-card">
            <div class="stat-val" style="color: #fbbf24;">18</div>
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

with open(r"2° parcial practica\correccion\resultados_parcial2_practica.csv", encoding='utf-8-sig') as f:
    reader = csv.DictReader(f)
    for r in reader:
        badge_class = "badge-10" if float(r['Puntaje Total Obtenido (Max 10)']) == 10 else ("badge-low" if float(r['Puntaje Total Obtenido (Max 10)']) < 4 else "badge-regular")
        bonus_badge = f"<span class='badge badge-bonus'>{r['Puntos Comprados (Tienda)']}</span>" if r['Puntos Comprados (Tienda)'] != '0' else "<span style='color:gray;'>0</span>"
        
        clean_name = r['Apellido y Nombre'].replace(' ', '_').replace('ñ', 'n').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace(',', '').replace('__', '_')
        img_name = f"parciales_alumnos/{int(r['N°']):02d}_{clean_name}_{r['UP']}.jpg"
        
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
// Show first by default
window.onload = function() {
    const firstRow = document.querySelector('tbody tr');
    if (firstRow) firstRow.click();
}
</script>
</body>
</html>
"""

with open(r"2° parcial practica\correccion\visor_parciales.html", "w", encoding="utf-8") as f:
    f.write(html)

print("HTML visor created successfully.")
