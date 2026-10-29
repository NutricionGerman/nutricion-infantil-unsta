import os, csv, json

base_dir = r"2° parcial practica\correccion"

csv_t1 = os.path.join(base_dir, "resultados_parcial2_practica.csv")
csv_t2 = os.path.join(base_dir, "tema2", "resultados_parcial2_practica_tema2.csv")

t1_key = ['B', 'B', 'C', 'C', 'B', 'B', 'C', 'C', 'B', 'B']
t2_key = ['B', 'C', 'B', 'C', 'B', 'C', 'B', 'C', 'B', 'C']

students = []

# Load Tema 1
with open(csv_t1, encoding='utf-8-sig') as f:
    for row in csv.DictReader(f):
        num = int(row.get('N°') or row.get('N') or 0)
        up = row['UP'].strip()
        name = row['Apellido y Nombre'].strip()
        group = row['Comisión / Grupo'].strip()
        base = row['Puntaje Base (/10)'].strip()
        bonus = row['Puntos Comprados (Tienda)'].strip()
        total = row['Puntaje Total Obtenido (Max 10)'].strip()
        ans = [a.strip() for a in row['Respuestas Marcadas (P1-P10)'].split(',')]
        obs = row['Observaciones'].strip()
        
        checks = []
        for i, a in enumerate(ans):
            is_correct = (a == t1_key[i])
            checks.append({"q": i+1, "ans": a, "correct": is_correct, "key": t1_key[i]})
            
        students.append({
            "tema": "Tema 1",
            "tema_code": "T1",
            "video_num": num,
            "up": up,
            "name": name,
            "group": group,
            "base": base,
            "bonus": bonus,
            "total": total,
            "total_num": float(total),
            "answers": ','.join(ans),
            "checks": checks,
            "obs": obs,
            "img_src": f"parciales_alumnos/recortes_grilla/crop_{num:02d}.jpg"
        })

# Load Tema 2
with open(csv_t2, encoding='utf-8-sig') as f:
    for row in csv.DictReader(f):
        num = int(row.get('N°') or row.get('N') or 0)
        up = row['UP'].strip()
        name = row['Apellido y Nombre'].strip()
        group = row['Comisión / Grupo'].strip()
        base = row['Puntaje Base (/10)'].strip()
        bonus = row['Puntos Comprados (Tienda)'].strip()
        total = row['Puntaje Total Obtenido (Max 10)'].strip()
        ans = [a.strip() for a in row['Respuestas Marcadas (P1-P10)'].split(',')]
        obs = row['Observaciones'].strip()
        
        checks = []
        for i, a in enumerate(ans):
            is_correct = (a == t2_key[i])
            checks.append({"q": i+1, "ans": a, "correct": is_correct, "key": t2_key[i]})
            
        students.append({
            "tema": "Tema 2",
            "tema_code": "T2",
            "video_num": num,
            "up": up,
            "name": name,
            "group": group,
            "base": base,
            "bonus": bonus,
            "total": total,
            "total_num": float(total),
            "answers": ','.join(ans),
            "checks": checks,
            "obs": obs,
            "img_src": f"tema2/parciales_alumnos/recortes_grilla/crop_{num:02d}.jpg"
        })

print(f"Loaded {len(students)} total students")

html_template = """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visor Unificado 2° Parcial Práctico — Nutrición Infantil UNSTA</title>
    <style>
        :root {
            --bg: #0b1120;
            --surface: #1e293b;
            --surface-hover: #334155;
            --border: #334155;
            --primary: #38bdf8;
            --accent: #22c55e;
            --gold: #fbbf24;
            --danger: #ef4444;
            --t1: #38bdf8;
            --t2: #a855f7;
            --text: #f8fafc;
            --text-muted: #94a3b8;
        }
        * { box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: var(--bg);
            color: var(--text);
            margin: 0;
            padding: 20px;
        }
        .container { max-width: 1550px; margin: 0 auto; }
        header {
            margin-bottom: 16px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            flex-wrap: wrap;
            gap: 15px;
        }
        h1 { margin: 0 0 6px 0; font-size: 24px; color: var(--primary); }
        .meta { color: var(--text-muted); font-size: 14px; }
        .keys-box {
            display: flex;
            gap: 12px;
            background: rgba(30, 41, 59, 0.7);
            padding: 8px 14px;
            border-radius: 8px;
            border: 1px solid var(--border);
            font-size: 13px;
        }
        .key-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .key-badge code {
            background: #0f172a;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
        }

        .alert-banner {
            background: rgba(245, 158, 11, 0.12);
            border: 1px solid rgba(245, 158, 11, 0.45);
            border-radius: 10px;
            padding: 12px 18px;
            margin-bottom: 18px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 13.5px;
            color: #fde68a;
            line-height: 1.45;
        }

        /* KPI stats */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 12px;
            margin-bottom: 20px;
        }
        .stat-card {
            background: var(--surface);
            padding: 12px 18px;
            border-radius: 8px;
            border: 1px solid var(--border);
        }
        .stat-val { font-size: 26px; font-weight: bold; }
        .stat-lbl { color: var(--text-muted); font-size: 12px; text-transform: uppercase; margin-top: 2px; }

        /* Toolbar */
        .toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 16px;
            align-items: center;
            justify-content: space-between;
            background: var(--surface);
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid var(--border);
        }
        .search-box {
            position: relative;
            flex: 1;
            min-width: 250px;
            max-width: 380px;
        }
        .search-box input {
            width: 100%;
            padding: 8px 12px 8px 34px;
            background: #0f172a;
            border: 1px solid var(--border);
            border-radius: 6px;
            color: var(--text);
            font-size: 14px;
        }
        .search-box input:focus {
            outline: none;
            border-color: var(--primary);
        }
        .search-box svg {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
            height: 16px;
            fill: var(--text-muted);
        }
        .filter-group, .sort-group {
            display: flex;
            gap: 6px;
            align-items: center;
        }
        .btn-filter, .btn-sort {
            background: #0f172a;
            border: 1px solid var(--border);
            color: var(--text-muted);
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
        }
        .btn-filter:hover, .btn-sort:hover {
            color: var(--text);
            border-color: var(--text-muted);
        }
        .btn-filter.active, .btn-sort.active {
            background: #1e3a8a;
            color: #ffffff;
            border-color: var(--primary);
            font-weight: bold;
        }

        /* Layout */
        .main-layout {
            display: flex;
            gap: 20px;
            align-items: flex-start;
        }
        .table-wrap {
            flex: 1;
            overflow-x: auto;
            background: var(--surface);
            border-radius: 10px;
            border: 1px solid var(--border);
            max-height: 75vh;
            overflow-y: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13.5px;
            text-align: left;
        }
        th, td {
            padding: 10px 14px;
            border-bottom: 1px solid var(--border);
        }
        th {
            background: #0f172a;
            position: sticky;
            top: 0;
            z-index: 2;
            font-weight: 600;
            color: var(--text-muted);
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
        }
        tbody tr {
            cursor: pointer;
            transition: background 0.15s;
        }
        tbody tr:hover { background: var(--surface-hover); }
        tbody tr.active {
            background: #1e3a8a !important;
        }

        /* Badges */
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
            text-align: center;
        }
        .badge-10 { background: rgba(251, 191, 36, 0.2); color: var(--gold); border: 1px solid var(--gold); }
        .badge-sobresaliente { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid #4ade80; }
        .badge-regular { background: rgba(56, 189, 248, 0.2); color: #38bdf8; }
        .badge-reprobado { background: rgba(239, 68, 68, 0.2); color: var(--danger); }
        .badge-bonus { background: rgba(251, 191, 36, 0.2); color: var(--gold); }

        .tag-t1 { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid #0284c7; padding: 2px 7px; border-radius: 4px; font-weight: bold; font-size: 11px; }
        .tag-t2 { background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid #9333ea; padding: 2px 7px; border-radius: 4px; font-weight: bold; font-size: 11px; }

        /* Preview Pane */
        .preview-pane {
            flex: 0 0 460px;
            position: sticky;
            top: 20px;
            background: var(--surface);
            border-radius: 10px;
            border: 1px solid var(--border);
            padding: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            max-height: 85vh;
            overflow-y: auto;
        }
        .preview-header {
            width: 100%;
            margin-bottom: 12px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--border);
        }
        .preview-title {
            font-size: 18px;
            font-weight: bold;
            color: var(--primary);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .preview-pane img {
            max-width: 100%;
            max-height: 52vh;
            object-fit: contain;
            border-radius: 6px;
            border: 1px solid var(--border);
            box-shadow: 0 4px 14px rgba(0,0,0,0.6);
            background: #fff;
        }
        .preview-info {
            width: 100%;
            margin-top: 14px;
            font-size: 13px;
        }
        .score-pill-box {
            display: flex;
            gap: 10px;
            background: #0f172a;
            padding: 10px;
            border-radius: 8px;
            margin: 10px 0;
            border: 1px solid var(--border);
            align-items: center;
            justify-content: space-around;
        }
        .score-pill-item { text-align: center; }
        .score-pill-lbl { font-size: 11px; color: var(--text-muted); text-transform: uppercase; }
        .score-pill-val { font-size: 18px; font-weight: bold; color: var(--text); }

        .answers-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 6px;
            margin: 10px 0;
        }
        .ans-cell {
            background: #0f172a;
            padding: 6px 4px;
            border-radius: 4px;
            text-align: center;
            font-size: 12px;
            border: 1px solid var(--border);
        }
        .ans-cell.correct { border-color: var(--accent); background: rgba(34, 197, 94, 0.1); }
        .ans-cell.wrong { border-color: var(--danger); background: rgba(239, 68, 68, 0.1); }
        .ans-q { font-size: 10px; color: var(--text-muted); }
        .ans-v { font-weight: bold; margin: 2px 0; }
        .ans-k { font-size: 10px; color: #64748b; }
    </style>
</head>
<body>
<div class="container">
    <header>
        <div>
            <h1>📋 Visor Unificado — 2° Parcial Práctico</h1>
            <div class="meta">Cátedra Nutrición Infantil — UNSTA | 77 Exámenes Físicos Auditados</div>
        </div>
        <div class="keys-box">
            <div class="key-badge">
                <span class="tag-t1">Tema 1</span>
                <code>B-B-C-C-B-B-C-C-B-B</code>
            </div>
            <div class="key-badge">
                <span class="tag-t2">Tema 2</span>
                <code>B-C-B-C-B-C-B-C-B-C</code>
            </div>
        </div>
    </header>

    <div class="alert-banner">
        <span style="font-size: 20px;">⚠️</span>
        <div>
            <strong>Aclaración de Cátedra:</strong> Las calificaciones del 2° Parcial Práctico se promediarán con la instancia teórica únicamente si la teoría se encuentra <strong>APROBADA</strong> (según régimen de regularidad y promoción de la cátedra).
        </div>
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-val" id="kpiTotal">77</div>
            <div class="stat-lbl">Exámenes Totales</div>
        </div>
        <div class="stat-card">
            <div class="stat-val" style="color: #4ade80;">76 (98.7%)</div>
            <div class="stat-lbl">Aprobados (&ge; 4 pts)</div>
        </div>
        <div class="stat-card">
            <div class="stat-val" style="color: #38bdf8;">66 (85.7%)</div>
            <div class="stat-lbl">Sobresalientes (&ge; 8 pts)</div>
        </div>
        <div class="stat-card">
            <div class="stat-val" style="color: #fbbf24;">35 (45.5%)</div>
            <div class="stat-lbl">Notas Máximas (10)</div>
        </div>
    </div>

    <div class="toolbar">
        <div class="search-box">
            <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <input type="text" id="searchInput" placeholder="Buscar por Apellido o Nombre..." oninput="filterAndRender()">
        </div>

        <div class="filter-group">
            <span style="font-size:12px; color:var(--text-muted); margin-right:4px;">Filtrar:</span>
            <button class="btn-filter active" onclick="setFilter('all', this)">Todos (77)</button>
            <button class="btn-filter" onclick="setFilter('T1', this)">Tema 1 (46)</button>
            <button class="btn-filter" onclick="setFilter('T2', this)">Tema 2 (31)</button>
            <button class="btn-filter" onclick="setFilter('10', this)">Dieces (35)</button>
        </div>

        <div class="sort-group">
            <span style="font-size:12px; color:var(--text-muted); margin-right:4px;">Ordenar por:</span>
            <button class="btn-sort active" onclick="setSort('name', this)">🔤 Apellido (A-Z)</button>
            <button class="btn-sort" onclick="setSort('tema', this)">🏷️ Por Tema</button>
            <button class="btn-sort" onclick="setSort('score', this)">⭐ Nota Final</button>
        </div>
    </div>

    <div class="main-layout">
        <div class="table-wrap">
            <table id="examTable">
                <thead>
                    <tr>
                        <th style="width: 45px;">#</th>
                        <th style="width: 75px;">Tema</th>
                        <th>Apellido y Nombre</th>
                        <th style="width: 80px; text-align: center;">Base</th>
                        <th style="width: 80px; text-align: center;">Tienda</th>
                        <th style="width: 95px; text-align: center;">Nota Final</th>
                    </tr>
                </thead>
                <tbody id="tableBody"></tbody>
            </table>
        </div>

        <div class="preview-pane" id="previewPane">
            <div class="preview-header">
                <div class="preview-title">
                    <span id="pvName">Seleccione un alumno</span>
                    <span id="pvTemaBadge"></span>
                </div>
                <div style="font-size:12px; color:var(--text-muted); margin-top:4px;" id="pvSub">Haz clic en cualquier fila para auditar</div>
            </div>

            <img id="pvImg" src="" alt="Examen" style="display:none;">

            <div class="preview-info" id="pvInfo" style="display:none;">
                <div class="score-pill-box">
                    <div class="score-pill-item">
                        <div class="score-pill-lbl">Base</div>
                        <div class="score-pill-val" id="pvBase">-</div>
                    </div>
                    <div class="score-pill-item">
                        <div class="score-pill-lbl">Tienda XP</div>
                        <div class="score-pill-val" id="pvBonus" style="color:var(--gold);">-</div>
                    </div>
                    <div class="score-pill-item">
                        <div class="score-pill-lbl">Nota Final</div>
                        <div class="score-pill-val" id="pvTotal" style="font-size:24px;">-</div>
                    </div>
                </div>

                <div style="font-size:12px; font-weight:bold; margin-top:10px; color:var(--text-muted);">DESGLOSE PREGUNTA POR PREGUNTA (Clave Oficial vs Alumno):</div>
                <div class="answers-grid" id="pvAnswersGrid"></div>

                <div id="pvObs" style="margin-top:10px; font-size:12px; color:#fbbf24; background:rgba(251,191,36,0.1); padding:8px; border-radius:6px; display:none;"></div>
                
                <div style="margin-top:14px; text-align:center;">
                    <a id="pvOpenFull" href="#" target="_blank" style="color:var(--primary); font-size:12px; text-decoration:none;">🔍 Abrir imagen en pestaña nueva</a>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
const rawData = """ + json.dumps(students, ensure_ascii=False) + """;

let currentFilter = 'all';
let currentSort = 'name'; // default: ordered by apellido!
let selectedStudent = null;

function setFilter(f, btn) {
    currentFilter = f;
    document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterAndRender();
}

function setSort(s, btn) {
    currentSort = s;
    document.querySelectorAll('.btn-sort').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterAndRender();
}

function getSortedAndFilteredData() {
    const q = document.getElementById('searchInput').value.toLowerCase().trim();
    
    let list = rawData.filter(s => {
        const matchesQuery = !q || s.name.toLowerCase().includes(q) || s.up.includes(q);
        if (!matchesQuery) return false;
        
        if (currentFilter === 'T1') return s.tema_code === 'T1';
        if (currentFilter === 'T2') return s.tema_code === 'T2';
        if (currentFilter === '10') return s.total_num >= 10;
        return true;
    });

    list.sort((a, b) => {
        if (currentSort === 'name') {
            return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
        } else if (currentSort === 'tema') {
            if (a.tema !== b.tema) return a.tema.localeCompare(b.tema);
            return a.name.localeCompare(b.name, 'es');
        } else if (currentSort === 'score') {
            if (b.total_num !== a.total_num) return b.total_num - a.total_num;
            return a.name.localeCompare(b.name, 'es');
        }
        return 0;
    });

    return list;
}

function filterAndRender() {
    const data = getSortedAndFilteredData();
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    data.forEach((s, idx) => {
        const tr = document.createElement('tr');
        if (selectedStudent && selectedStudent.up === s.up && selectedStudent.tema === s.tema) {
            tr.classList.add('active');
        }
        tr.onclick = (e) => selectStudent(s, tr);
        
        let badgeClass = 'badge-regular';
        if (s.total_num >= 10) badgeClass = 'badge-10';
        else if (s.total_num >= 8) badgeClass = 'badge-sobresaliente';
        else if (s.total_num < 4) badgeClass = 'badge-reprobado';
        
        const temaTag = s.tema_code === 'T1' ? '<span class=\"tag-t1\">Tema 1</span>' : '<span class=\"tag-t2\">Tema 2</span>';
        const bonusDisplay = s.bonus !== '0' && s.bonus !== '' ? `<span class=\"badge badge-bonus\">${s.bonus}</span>` : '<span style=\"color:gray;\">0</span>';
        
        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td>${temaTag}</td>
            <td><b>${s.name}</b></td>
            <td style=\"text-align: center;\">${s.base}</td>
            <td style=\"text-align: center;\">${bonusDisplay}</td>
            <td style=\"text-align: center;\"><span class=\"badge ${badgeClass}\">${s.total}</span></td>
        `;
        tbody.appendChild(tr);
    });

    if (data.length > 0 && (!selectedStudent || !data.some(s => s.up === selectedStudent.up && s.tema === selectedStudent.tema))) {
        const firstTr = tbody.querySelector('tr');
        selectStudent(data[0], firstTr);
    }
}

function selectStudent(s, tr) {
    selectedStudent = s;
    document.querySelectorAll('tbody tr').forEach(r => r.classList.remove('active'));
    if (tr) tr.classList.add('active');
    
    document.getElementById('pvName').innerText = s.name;
    const badgeSpan = document.getElementById('pvTemaBadge');
    badgeSpan.innerHTML = s.tema_code === 'T1' ? '<span class=\"tag-t1\">Tema 1</span>' : '<span class=\"tag-t2\">Tema 2</span>';
    
    document.getElementById('pvSub').innerText = `UP: ${s.up} ${s.group && s.group !== '-' ? '| Grupo: ' + s.group : ''}`;
    
    const img = document.getElementById('pvImg');
    img.src = s.img_src;
    img.style.display = 'block';
    
    document.getElementById('pvOpenFull').href = s.img_src;
    
    document.getElementById('pvBase').innerText = s.base + ' / 10';
    document.getElementById('pvBonus').innerText = s.bonus ? s.bonus : '0';
    
    const totalEl = document.getElementById('pvTotal');
    totalEl.innerText = s.total + ' / 10';
    if (s.total_num >= 10) totalEl.style.color = 'var(--gold)';
    else if (s.total_num >= 8) totalEl.style.color = 'var(--accent)';
    else if (s.total_num >= 6) totalEl.style.color = 'var(--primary)';
    else totalEl.style.color = 'var(--danger)';
    
    const grid = document.getElementById('pvAnswersGrid');
    grid.innerHTML = '';
    s.checks.forEach(c => {
        const cell = document.createElement('div');
        cell.className = 'ans-cell ' + (c.correct ? 'correct' : 'wrong');
        cell.innerHTML = `
            <div class=\"ans-q\">P${c.q}</div>
            <div class=\"ans-v\">${c.ans} ${c.correct ? '✓' : '✗'}</div>
            <div class=\"ans-k\">clave: ${c.key}</div>
        `;
        grid.appendChild(cell);
    });
    
    const obsEl = document.getElementById('pvObs');
    if (s.obs) {
        obsEl.innerHTML = `<b>Observación:</b> ${s.obs}`;
        obsEl.style.display = 'block';
    } else {
        obsEl.style.display = 'none';
    }
    
    document.getElementById('pvInfo').style.display = 'block';
}

window.onload = function() {
    filterAndRender();
};
</script>
</body>
</html>
"""

out_unified = os.path.join(base_dir, "visor_parciales_unificado.html")
out_default = os.path.join(base_dir, "visor_parciales.html")

with open(out_unified, "w", encoding="utf-8") as f:
    f.write(html_template)

with open(out_default, "w", encoding="utf-8") as f:
    f.write(html_template)

print("Updated unified visor successfully!")
