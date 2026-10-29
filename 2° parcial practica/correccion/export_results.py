import json, csv

KEY = ['B', 'B', 'C', 'C', 'B', 'B', 'C', 'C', 'B', 'B']

results = [
    {"num": 1, "up": "344092", "name": "ZUMAETA, Rocio", "group": "g_7", "answers": "B,B,C,C,B,B,C,C,B,B", "pts_comp": 0, "obs": ""},
    {"num": 2, "up": "343959", "name": "NANTERNE MARTIN, Victoria", "group": "-", "answers": "B,D,C,A,B,B,A,C,B,B", "pts_comp": 0, "obs": "Recuadro docente con 3 (cantidad de errores)"},
    {"num": 3, "up": "344003", "name": "CERVIÑO, Joaquín", "group": "g_15", "answers": "B,C,C,C,B,B,C,C,B,B", "pts_comp": 0, "obs": "Tenía anotación 6 por corrección preliminar con clave de Tema 2; con clave oficial Tema 1 son 9 aciertos"},
    {"num": 4, "up": "344159", "name": "LAZARTE, Maximo Daniel", "group": "g_9", "answers": "A,B,C,A,B,B,C,A,B,B", "pts_comp": 0, "obs": "UP confirmado por cartel al final del video"},
    {"num": 5, "up": "344126", "name": "VIAÑA, Amparo", "group": "g_12", "answers": "B,C,C,C,B,B,C,C,B,B", "pts_comp": 0, "obs": ""},
    {"num": 6, "up": "344027", "name": "SANTOS, Camila Alejandra", "group": "g_7", "answers": "B,B,C,C,B,B,C,C,B,B", "pts_comp": 0, "obs": "En hoja figuraba 7 preliminar; todas las respuestas coinciden exactamente con la clave (10)"},
    {"num": 7, "up": "344037", "name": "FERNÁNDEZ SALAZAR, Francisco", "group": "g_10", "answers": "A,B,C,C,B,A,B,C,A,B", "pts_comp": 5, "obs": "Base 6 + 5 comprados = 11 -> Tope 10"},
    {"num": 8, "up": "343872", "name": "LESCANO, Rodrigo Jesús", "group": "g_1", "answers": "A,B,C,C,B,B,A,C,B,B", "pts_comp": 0, "obs": "P2 corrigió tachando A y marcando B"},
    {"num": 9, "up": "344057", "name": "GALLARDO ELHALL, Felicitas", "group": "g_6", "answers": "B,B,C,C,B,B,C,C,B,B", "pts_comp": 4, "obs": "Base 10 + 4 comprados -> Tope 10"},
    {"num": 10, "up": "344160", "name": "PEREZ MARTINEZ, Luciana Micaela", "group": "g_5", "answers": "B,B,C,C,B,B,C,C,B,B", "pts_comp": 0, "obs": "Examen perfecto (10/10)"},
    {"num": 11, "up": "344115", "name": "VILLARREAL, Martina", "group": "g_12", "answers": "A,B,C,B,B,B,C,A,A,B", "pts_comp": 0, "obs": ""},
    {"num": 12, "up": "344052", "name": "BAZÁN, Thiara Agostina", "group": "g_6", "answers": "A,B,C,C,B,B,C,C,A,B", "pts_comp": 5, "obs": "Base 8 + 5 comprados = 13 -> Tope 10"},
    {"num": 13, "up": "343997", "name": "ARGAÑARAZ, Maria Florencia", "group": "g_18", "answers": "B,A,B,A,B,B,C,A,D,B", "pts_comp": 0, "obs": ""},
    {"num": 14, "up": "344054", "name": "AVILA, Guadalupe", "group": "g_6", "answers": "A,A,C,C,B,B,C,C,B,B", "pts_comp": 0, "obs": ""},
    {"num": 15, "up": "344094", "name": "GEREZ, Ana Belén", "group": "g_4", "answers": "A,B,C,C,B,B,C,C,B,B", "pts_comp": 4, "obs": "Base 9 + 4 comprados = 13 -> Tope 10"},
    {"num": 16, "up": "343240", "name": "BELLIDO, Camila Rocío", "group": "g_16", "answers": "A,B,B,C,B,B,C,D,A,B", "pts_comp": 0, "obs": ""},
    {"num": 17, "up": "344341", "name": "MORANDINI, Sol", "group": "g_12", "answers": "B,B,C,C,B,B,C,C,B,B", "pts_comp": 0, "obs": "Examen perfecto (10/10)"},
    {"num": 18, "up": "344083", "name": "PADILLA, Pilar Maria", "group": "g_12", "answers": "B,B,C,C,A,A,B,C,B,B", "pts_comp": 0, "obs": ""},
    {"num": 19, "up": "344073", "name": "CONDORI NUÑEZ, Luz Milagro", "group": "g_16", "answers": "D,A,C,C,B,B,B,C,B,B", "pts_comp": 0, "obs": ""},
    {"num": 20, "up": "344014", "name": "ROSSI COLOMBRES, Lucia", "group": "g_3", "answers": "A,B,C,C,B,B,C,C,B,B", "pts_comp": 0, "obs": ""},
    {"num": 21, "up": "344117", "name": "ALBORNOZ MARTOS, Juan Ignacio", "group": "g_4", "answers": "A,A,C,C,B,B,A,C,C,B", "pts_comp": 0, "obs": "Firmó Albano Moya / Albornoz Martos"},
    {"num": 22, "up": "344031", "name": "LINARES GONZALEZ, Agustín Octavio", "group": "g_13", "answers": "A,A,C,C,B,B,C,C,B,B", "pts_comp": 0, "obs": ""},
    {"num": 23, "up": "343813", "name": "MERCADO, Augusto", "group": "g_15", "answers": "B,B,C,C,B,B,C,C,A,C", "pts_comp": 0, "obs": ""},
    {"num": 24, "up": "344017", "name": "USANDIVARAS, Constanza Mercedes", "group": "g_5", "answers": "B,B,C,C,B,B,C,C,B,B", "pts_comp": 0, "obs": "Examen perfecto (10/10)"},
    {"num": 25, "up": "343943", "name": "ALBORNOZ, Lisandro Geronimo", "group": "g_17", "answers": "A,B,C,C,B,B,C,C,B,B", "pts_comp": 5, "obs": "Base 9 + 5 comprados = 14 -> Tope 10"},
    {"num": 26, "up": "344015", "name": "IBAÑEZ, Tomas", "group": "g_9", "answers": "B,A,C,C,B,B,C,C,B,B", "pts_comp": 4, "obs": "Base 9 + 4 comprados = 13 -> Tope 10"},
    {"num": 27, "up": "344064", "name": "ALVAREZ ROMANO, Santiago Leonel", "group": "g_9", "answers": "A,A,C,C,B,B,C,C,A,B", "pts_comp": 5, "obs": "Base 7 + 5 comprados = 12 -> Tope 10"},
    {"num": 28, "up": "343891", "name": "IBAÑEZ, Ana Virginia", "group": "g_18", "answers": "B,B,C,C,B,B,C,C,B,B", "pts_comp": 0, "obs": "Examen perfecto (10/10)"},
    {"num": 29, "up": "343512", "name": "SICA BUSTAMANTE, Fabricio Ricardo", "group": "-", "answers": "A,B,B,C,B,C,C,B,A,B", "pts_comp": 0, "obs": ""},
    {"num": 30, "up": "344024", "name": "WAUNOUS, Milagros", "group": "g_3", "answers": "A,B,C,C,B,B,B,C,A,B", "pts_comp": 0, "obs": ""},
    {"num": 31, "up": "344085", "name": "ALCORTA VIZUR, Luisana", "group": "g_16", "answers": "B,C,C,C,B,A,C,D,B,B", "pts_comp": 0, "obs": ""},
    {"num": 32, "up": "343746", "name": "VIDAL, Tomas", "group": "g_8", "answers": "B,B,C,C,B,B,C,C,B,B", "pts_comp": 5, "obs": "Examen perfecto (10/10) + 5 comprados -> Tope 10"},
    {"num": 33, "up": "344165", "name": "FERJANCIC MARINO, Abril Martina", "group": "g_10", "answers": "D,B,C,C,B,B,C,C,B,B", "pts_comp": 5, "obs": "Base 9 + 5 comprados = 14 -> Tope 10"},
    {"num": 34, "up": "343649", "name": "SALAZAR, Agustina Abigail", "group": "g_2", "answers": "B,B,B,B,B,B,C,D,B,B", "pts_comp": 0, "obs": ""},
    {"num": 35, "up": "344040", "name": "GENTILE, Juliana", "group": "g_3", "answers": "A,B,C,C,B,B,C,C,B,B", "pts_comp": 0, "obs": ""},
    {"num": 36, "up": "344025", "name": "GODOY, Gimena Mariana", "group": "g_4", "answers": "A,B,C,C,B,B,C,B,B,B", "pts_comp": 0, "obs": ""},
    {"num": 37, "up": "343003", "name": "GOMEZ, Maria Sol", "group": "g_4", "answers": "B,B,A,C,B,B,C,C,B,B", "pts_comp": 5, "obs": "Base 9 + 5 comprados = 14 -> Tope 10"},
    {"num": 38, "up": "343583", "name": "LAI, FRANCO", "group": "g_11", "answers": "A,B,C,C,B,A,B,B,A,B", "pts_comp": 3, "obs": "Base 5 + 3 comprados = 8"},
    {"num": 39, "up": "344033", "name": "FERNANDEZ MURGA, Luz", "group": "g_3", "answers": "B,A,C,C,B,B,C,C,B,B", "pts_comp": 0, "obs": ""},
    {"num": 40, "up": "344032", "name": "FORTE, Guadalupe", "group": "g_13", "answers": "A,A,C,B,B,B,C,C,B,B", "pts_comp": 0, "obs": ""},
    {"num": 41, "up": "343832", "name": "VELARDEZ, David Nicolás", "group": "g_17", "answers": "A,B,C,C,B,B,C,A,B,B", "pts_comp": 0, "obs": ""},
    {"num": 42, "up": "343952", "name": "ADORNI HARDOY, Sofia", "group": "g_17", "answers": "B,B,C,C,B,A,C,C,B,D", "pts_comp": 0, "obs": ""},
    {"num": 43, "up": "344105", "name": "MUSTAFA, Florencia Belen", "group": "g_16", "answers": "B,B,C,C,B,B,C,C,B,B", "pts_comp": 0, "obs": "Examen perfecto (10/10)"},
    {"num": 44, "up": "343850", "name": "BRANDÁN, Ana Paula", "group": "g_18", "answers": "A,B,C,C,A,D,B,A,C,B", "pts_comp": 0, "obs": ""},
    {"num": 45, "up": "344021", "name": "GIULIANO AVELLANEDA, Marianella", "group": "g_6", "answers": "B,B,C,C,B,B,C,C,B,B", "pts_comp": 5, "obs": "Examen perfecto (10/10) + 5 comprados -> Tope 10"},
    {"num": 46, "up": "343743", "name": "SALÓN, FLORENCIA ARIANA", "group": "g_2", "answers": "C,D,D,A,B,D,A,B,A,B", "pts_comp": 0, "obs": ""}
]

# Calculate scores
for r in results:
    ans = r['answers'].split(',')
    correct_count = sum(1 for a, k in zip(ans, KEY) if a == k)
    r['correct_count'] = correct_count
    pts_c = r['pts_comp']
    total = min(10, correct_count + pts_c)
    r['total_score'] = total

# Export CSV
csv_path = r"2° parcial practica\correccion\resultados_parcial2_practica.csv"
with open(csv_path, 'w', newline='', encoding='utf-8-sig') as f:
    writer = csv.writer(f)
    writer.writerow(["N°", "UP", "Apellido y Nombre", "Comisión / Grupo", "Puntaje Base (/10)", "Puntos Comprados (Tienda)", "Puntaje Total Obtenido (Max 10)", "Respuestas Marcadas (P1-P10)", "Observaciones"])
    for r in results:
        writer.writerow([r['num'], r['up'], r['name'], r['group'], r['correct_count'], f"+{r['pts_comp']}" if r['pts_comp'] > 0 else "0", r['total_score'], r['answers'], r['obs']])

print(f"Results exported successfully to {csv_path}")
print(f"Total students evaluated: {len(results)}")
print(f"Aprobados (>= 4): {sum(1 for r in results if r['total_score'] >= 4)}")
print(f"Promocionados / Sobresalientes (>= 8): {sum(1 for r in results if r['total_score'] >= 8)}")
print(f"Dieces (10): {sum(1 for r in results if r['total_score'] == 10)}")
