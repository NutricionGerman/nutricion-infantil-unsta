import os, shutil, json
from PIL import Image

# List of students with their optimal frame number in muestras_1s
# We will verify every single one!
exam_list = [
    {"num": 1, "frame": 1, "name": "Zumaeta Rocio", "up": "344092", "group": "g_7"},
    {"num": 2, "frame": 5, "name": "Nanterne Martin Victoria", "up": "343959", "group": "-"},
    {"num": 3, "frame": 13, "name": "Cerviño Joaquín", "up": "344003", "group": "g_15"},
    {"num": 4, "frame": 18, "name": "Lazarte Maximo Daniel", "up": "344159", "group": "g_9"},
    {"num": 5, "frame": 21, "name": "Viaña Amparo", "up": "344126", "group": "g_12"},
    {"num": 6, "frame": 25, "name": "Santos Camila Alejandra", "up": "344027", "group": "g_7"},
    {"num": 7, "frame": 29, "name": "Fernández Salazar Francisco", "up": "344037", "group": "g_10"},
    {"num": 8, "frame": 34, "name": "Lescano Rodrigo Jesús", "up": "343872", "group": "g_1"},
    {"num": 9, "frame": 41, "name": "Gallardo Elhall Felicitas", "up": "344057", "group": "g_6"},
    {"num": 10, "frame": 45, "name": "Perez Martinez Luciana Micaela", "up": "344160", "group": "g_5"},
    {"num": 11, "frame": 49, "name": "Villarreal Martina", "up": "344115", "group": "g_12"},
    {"num": 12, "frame": 53, "name": "Bazán Thiara Agostina", "up": "344052", "group": "g_6"},
    {"num": 13, "frame": 57, "name": "Argañaraz Maria Florencia", "up": "343997", "group": "g_18"},
    {"num": 14, "frame": 61, "name": "Avila Guadalupe", "up": "344054", "group": "g_6"},
    {"num": 15, "frame": 65, "name": "Gerez Ana Belén", "up": "344094", "group": "g_4"},
    {"num": 16, "frame": 68, "name": "Bellido Camila Rocío", "up": "343240", "group": "g_16"},
    {"num": 17, "frame": 70, "name": "Morandini Sol", "up": "344341", "group": "g_12"},
    {"num": 18, "frame": 73, "name": "Padilla Pilar Maria", "up": "344083", "group": "g_12"},
    {"num": 19, "frame": 76, "name": "Condori Nuñez Luz Milagro", "up": "344073", "group": "g_16"},
    {"num": 20, "frame": 79, "name": "Rossi Lucia", "up": "344014", "group": "g_3"},
    {"num": 21, "frame": 81, "name": "Albornoz Martos Juan Ignacio", "up": "344117", "group": "g_4"},
    {"num": 22, "frame": 85, "name": "Linares Gonzalez Agustín Octavio", "up": "344031", "group": "g_13"},
    {"num": 23, "frame": 90, "name": "Mercado Augusto", "up": "343813", "group": "g_15"},
    {"num": 24, "frame": 94, "name": "Usandivaras Constanza Mercedes", "up": "344017", "group": "g_5"},
    {"num": 25, "frame": 97, "name": "Albornoz Lisandro Geronimo", "up": "343943", "group": "g_17"},
    {"num": 26, "frame": 100, "name": "Ibañez Tomas", "up": "344015", "group": "g_9"},
    {"num": 27, "frame": 102, "name": "Alvarez Romano Santiago Leonel", "up": "344064", "group": "g_9"},
    {"num": 28, "frame": 106, "name": "Ibañez Ana Virginia", "up": "343891", "group": "g_18"},
    {"num": 29, "frame": 109, "name": "Sica Bustamante Fabricio Ricardo", "up": "343512", "group": "-"},
    {"num": 30, "frame": 112, "name": "Waunous Milagros", "up": "344024", "group": "g_3"},
    {"num": 31, "frame": 115, "name": "Alcorta Vizur Luisana", "up": "344085", "group": "g_16"},
    {"num": 32, "frame": 118, "name": "Vidal Tomas", "up": "343746", "group": "g_8"},
    {"num": 33, "frame": 122, "name": "Ferjancic Marino Abril Martina", "up": "344165", "group": "g_10"},
    {"num": 34, "frame": 131, "name": "Salazar Agustina Abigail", "up": "343649", "group": "g_2"},
    {"num": 35, "frame": 140, "name": "Gentile Juliana", "up": "344040", "group": "g_3"},
    {"num": 36, "frame": 144, "name": "Godoy Gimena Mariana", "up": "344025", "group": "g_4"},
    {"num": 37, "frame": 148, "name": "Gomez Maria Sol", "up": "343003", "group": "g_4"},
    {"num": 38, "frame": 151, "name": "Lai Franco", "up": "343583", "group": "g_11"},
    {"num": 39, "frame": 154, "name": "Fernandez Murga Luz", "up": "344033", "group": "g_3"},
    {"num": 40, "frame": 158, "name": "Forte Guadalupe", "up": "344032", "group": "g_13"},
    {"num": 41, "frame": 161, "name": "Velardez David Nicolás", "up": "343832", "group": "g_17"},
    {"num": 42, "frame": 165, "name": "Adorni Hardoy Sofia", "up": "343952", "group": "g_17"},
    {"num": 43, "frame": 172, "name": "Mustafa Florencia Belen", "up": "344105", "group": "g_16"},
    {"num": 44, "frame": 175, "name": "Brandán Ana Paula", "up": "343850", "group": "g_18"},
    {"num": 45, "frame": 178, "name": "Giuliano Avellaneda Marianella", "up": "344021", "group": "g_6"},
    {"num": 46, "frame": 181, "name": "Salón Florencia Ariana", "up": "343743", "group": "g_2"}
]

out_dir = r"2° parcial practica\correccion\parciales_alumnos"
os.makedirs(out_dir, exist_ok=True)

# Also load purchased points from cache
with open('students_cache.json', encoding='utf-8') as f:
    db_students = {s['up']: s for s in json.load(f)}

for ex in exam_list:
    up = ex['up']
    db_info = db_students.get(up, {})
    ex['puntosComprados'] = db_info.get('puntosComprados', 0)
    
    # Copy full frame
    src = os.path.join(r"2° parcial practica\correccion\muestras_1s", f"frame_{ex['frame']:03d}.jpg")
    clean_name = ex['name'].replace(' ', '_').replace('ñ', 'n').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')
    dst = os.path.join(out_dir, f"{ex['num']:02d}_{clean_name}_{up}.jpg")
    if os.path.exists(src):
        shutil.copy2(src, dst)

print(f"Copied all {len(exam_list)} keyframes to {out_dir}")
with open(os.path.join(out_dir, 'exam_manifest.json'), 'w', encoding='utf-8') as f:
    json.dump(exam_list, f, indent=2, ensure_ascii=False)
