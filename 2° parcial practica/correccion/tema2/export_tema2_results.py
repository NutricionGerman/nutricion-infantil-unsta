import json, csv, os

KEY_T2 = ['B', 'C', 'B', 'C', 'B', 'C', 'B', 'C', 'B', 'C']

results_t2 = [
    {"num": 1, "up": "343725", "name": "DIP, Luciano Ivan", "group": "g_2", "answers": "B,C,B,D,B,C,B,C,B,B", "pts_comp": 0, "obs": "P4 marcó D y P10 marcó B"},
    {"num": 2, "up": "340602", "name": "CASTELLANOS, PAULA", "group": "g_10", "answers": "B,C,B,A,B,C,A,C,B,B", "pts_comp": 0, "obs": "Nota docente en hoja: 7"},
    {"num": 3, "up": "344050", "name": "RUIZ, Lucia Emilia", "group": "g_8", "answers": "B,C,B,C,B,C,A,C,B,B", "pts_comp": 0, "obs": "Nota docente en hoja: 7 u 8 (P7 A, P10 B)"},
    {"num": 4, "up": "344036", "name": "DELANI, Luca", "group": "g_1", "answers": "A,C,A,C,B,C,A,C,B,B", "pts_comp": 5, "obs": "Base 6 + 5 comprados = 11 -> Tope 10 (convalidado en hoja como 10)"},
    {"num": 5, "up": "343690", "name": "CORTEZ, Florencia del Pilar", "group": "g_2", "answers": "B,C,B,A,B,B,B,C,B,B", "pts_comp": 0, "obs": "P4 marcó A, P6 B y P10 B"},
    {"num": 6, "up": "343950", "name": "DIAZ Romero, María Sofía", "group": "g_14", "answers": "A,C,A,C,B,C,B,C,B,B", "pts_comp": 0, "obs": "Nota docente en hoja: 7"},
    {"num": 7, "up": "343911", "name": "CORDOBA DIAZ, Román Augusto", "group": "g_14", "answers": "B,C,B,B,B,B,B,A,B,C", "pts_comp": 0, "obs": "Nota docente en hoja: 7"},
    {"num": 8, "up": "343783", "name": "ORTIZ, Anna Lucia", "group": "g_16", "answers": "A,C,A,C,B,C,B,C,B,B", "pts_comp": 0, "obs": "Nota docente en hoja: 7"},
    {"num": 9, "up": "343962", "name": "GUZMAN SINER, Joaquin Emiliano", "group": "g_14", "answers": "A,C,A,C,A,C,B,C,B,B", "pts_comp": 0, "obs": "Nota docente en hoja: 6"},
    {"num": 10, "up": "344134", "name": "COLOMBRES GARMENDIA, Amparo", "group": "g_12", "answers": "B,C,B,C,B,C,B,C,B,C", "pts_comp": 0, "obs": "Examen perfecto (10/10)"},
    {"num": 11, "up": "343244", "name": "RODRIGUEZ, Juan Pablo", "group": "g_11", "answers": "B,C,A,C,B,C,B,C,B,C", "pts_comp": 5, "obs": "Base 9 + 5 comprados = 14 -> Tope 10 (convalidado en hoja como 10)"},
    {"num": 12, "up": "343269", "name": "AVILA LUCENA, Antonella", "group": "g_11", "answers": "A,C,B,C,A,A,B,C,B,B", "pts_comp": 5, "obs": "Base 6 + 5 comprados = 11 -> Tope 10 (convalidado en hoja como 10)"},
    {"num": 13, "up": "343815", "name": "VAZQUEZ, Santiago Jesús", "group": "g_1", "answers": "B,C,A,C,B,B,A,C,B,C", "pts_comp": 5, "obs": "Base 7 + 5 comprados = 12 -> Tope 10 (convalidado en hoja como 10)"},
    {"num": 14, "up": "344130", "name": "RIVAS, Mirta Yolanda", "group": "g_5", "answers": "B,C,B,C,B,C,B,C,B,C", "pts_comp": 0, "obs": "Examen perfecto (10/10 - convalidado en hoja como 10)"},
    {"num": 15, "up": "344022", "name": "PAZ, Juan Martin", "group": "g_6", "answers": "B,C,A,C,B,B,A,C,A,C", "pts_comp": 5, "obs": "Base 6 + 5 comprados = 11 -> Tope 10 (convalidado en hoja como 10)"},
    {"num": 16, "up": "344026", "name": "DHAIBES MÚKDISE, Agostina", "group": "g_3", "answers": "B,C,A,B,B,C,A,C,B,C", "pts_comp": 0, "obs": "Nota docente en hoja: 7"},
    {"num": 17, "up": "344056", "name": "VARGIU, Gianluca", "group": "g_1", "answers": "B,C,A,B,B,A,A,B,B,C", "pts_comp": 5, "obs": "Base 5 + 5 comprados = 10 -> Tope 10 (convalidado en hoja como 10)"},
    {"num": 18, "up": "343896", "name": "MOVANE, SOFIA", "group": "g_17", "answers": "B,C,B,C,D,A,D,D,A,C", "pts_comp": 0, "obs": "Nota docente en hoja: 5"},
    {"num": 19, "up": "344012", "name": "ROLDÁN JAIMEZ, Mariana", "group": "g_13", "answers": "B,C,B,C,B,C,B,C,B,C", "pts_comp": 0, "obs": "Examen perfecto (10/10)"},
    {"num": 20, "up": "344048", "name": "REGUERA, Rodrigo Leonel", "group": "g_10", "answers": "B,C,B,C,B,A,B,C,B,C", "pts_comp": 5, "obs": "Base 9 + 5 comprados = 14 -> Tope 10 (convalidado en hoja como 10)"},
    {"num": 21, "up": "343270", "name": "JEREZ, Marcelo Matias", "group": "g_11", "answers": "B,C,B,C,B,C,B,C,B,B", "pts_comp": 5, "obs": "Base 9 + 5 comprados = 14 -> Tope 10 (convalidado en hoja como 10)"},
    {"num": 22, "up": "344144", "name": "CARRIZO, FABRICIO EZEQUIEL", "group": "g_9", "answers": "B,C,A,C,B,C,A,C,B,C", "pts_comp": 0, "obs": "Nota docente en hoja: 8"},
    {"num": 23, "up": "344074", "name": "PAEZ DE LA TORRE, Lourdes", "group": "g_8", "answers": "B,C,B,C,B,C,B,C,B,C", "pts_comp": 5, "obs": "Examen perfecto (10/10) + 5 comprados -> Tope 10"},
    {"num": 24, "up": "343940", "name": "Zavaleta, Juan Pablo", "group": "g_15", "answers": "B,C,B,C,B,C,A,C,B,C", "pts_comp": 5, "obs": "Base 9 + 5 comprados = 14 -> Tope 10 (convalidado en hoja como 10)"},
    {"num": 25, "up": "344058", "name": "OCARANZA, Laureana", "group": "g_7", "answers": "B,C,B,C,B,C,B,C,B,C", "pts_comp": 0, "obs": "Examen perfecto (10/10 - convalidado en hoja como 10)"},
    {"num": 26, "up": "343300", "name": "LAZARTE, Tomás Benjamin", "group": "g_11", "answers": "B,C,B,C,B,C,B,C,B,C", "pts_comp": 5, "obs": "Examen perfecto (10/10) + 5 comprados -> Tope 10"},
    {"num": 27, "up": "344077", "name": "FERNANDEZ, Ignacio", "group": "g_10", "answers": "B,C,B,A,B,C,B,C,B,C", "pts_comp": 0, "obs": "Base 9 (P4 marcó A; en la hoja figuraba un 10 manuscrito, nota estricta es 9)"},
    {"num": 28, "up": "344098", "name": "SANTUCCI, Massimo", "group": "g_1", "answers": "B,C,A,C,B,C,B,C,B,C", "pts_comp": 5, "obs": "Base 9 + 5 comprados = 14 -> Tope 10 (convalidado en hoja como 10)"},
    {"num": 29, "up": "343870", "name": "OJEDA, Yamila Dayana", "group": "g_18", "answers": "B,C,A,C,B,A,B,C,A,C", "pts_comp": 0, "obs": "Base 7 (errores en P3, P6 y P9; aciertos: P1, P2, P4, P5, P7, P8, P10)"},
    {"num": 30, "up": "344055", "name": "CUEVAS, Nicole Jennifer", "group": "g_8", "answers": "B,C,B,C,B,C,B,C,B,B", "pts_comp": 2, "obs": "Base 9 + 2 comprados = 11 -> Tope 10 (convalidado en hoja como 10)"},
    {"num": 31, "up": "344009", "name": "BARROS, Sofia Abigail", "group": "g_8", "answers": "B,B,B,C,B,C,A,C,B,C", "pts_comp": 0, "obs": "Nota docente en hoja: 8"}
]

# Calculate scores
for r in results_t2:
    ans = r['answers'].split(',')
    correct_count = sum(1 for a, k in zip(ans, KEY_T2) if a == k)
    r['correct_count'] = correct_count
    pts_c = r['pts_comp']
    total = min(10, correct_count + pts_c)
    r['total_score'] = total

# Export CSV
base_dir = r"2° parcial practica\correccion\tema2"
csv_path = os.path.join(base_dir, "resultados_parcial2_practica_tema2.csv")
with open(csv_path, 'w', newline='', encoding='utf-8-sig') as f:
    writer = csv.writer(f)
    writer.writerow(["N°", "UP", "Apellido y Nombre", "Comisión / Grupo", "Puntaje Base (/10)", "Puntos Comprados (Tienda)", "Puntaje Total Obtenido (Max 10)", "Respuestas Marcadas (P1-P10)", "Observaciones"])
    for r in results_t2:
        writer.writerow([r['num'], r['up'], r['name'], r['group'], r['correct_count'], f"+{r['pts_comp']}" if r['pts_comp'] > 0 else "0", r['total_score'], r['answers'], r['obs']])

print(f"Results exported successfully to {csv_path}")
print(f"Total students evaluated (Tema 2): {len(results_t2)}")
print(f"Aprobados (>= 4): {sum(1 for r in results_t2 if r['total_score'] >= 4)}")
print(f"Sobresalientes (>= 8): {sum(1 for r in results_t2 if r['total_score'] >= 8)}")
print(f"Dieces (10): {sum(1 for r in results_t2 if r['total_score'] == 10)}")
