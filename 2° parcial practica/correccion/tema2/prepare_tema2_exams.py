import os, shutil, json
from PIL import Image, ImageDraw

tema2_list = [
    {"num": 1, "frame": 1, "name": "DIP, Luciano Ivan", "up": "343725", "group": "g_2"},
    {"num": 2, "frame": 5, "name": "CASTELLANOS, PAULA", "up": "340602", "group": "g_10"},
    {"num": 3, "frame": 9, "name": "RUIZ, Lucia Emilia", "up": "344050", "group": "g_8"},
    {"num": 4, "frame": 13, "name": "DELANI, Luca", "up": "344036", "group": "g_1"},
    {"num": 5, "frame": 17, "name": "CORTEZ, Florencia del Pilar", "up": "343690", "group": "g_2"},
    {"num": 6, "frame": 22, "name": "DIAZ Romero, María Sofía", "up": "343950", "group": "g_14"},
    {"num": 7, "frame": 25, "name": "CORDOBA DIAZ, Román Augusto", "up": "343911", "group": "g_14"},
    {"num": 8, "frame": 28, "name": "ORTIZ, Anna Lucia", "up": "343783", "group": "g_16"},
    {"num": 9, "frame": 33, "name": "GUZMAN SINER, Joaquin Emiliano", "up": "343962", "group": "g_14"},
    {"num": 10, "frame": 37, "name": "COLOMBRES GARMENDIA, Amparo", "up": "344134", "group": "g_12"},
    {"num": 11, "frame": 39, "name": "RODRIGUEZ, Juan Pablo", "up": "343244", "group": "g_11"},
    {"num": 12, "frame": 43, "name": "AVILA LUCENA, Antonella", "up": "343269", "group": "g_11"},
    {"num": 13, "frame": 46, "name": "VAZQUEZ, Santiago Jesús", "up": "343815", "group": "g_1"},
    {"num": 14, "frame": 51, "name": "RIVAS, Mirta Yolanda", "up": "344130", "group": "g_5"},
    {"num": 15, "frame": 57, "name": "PAZ, Juan Martin", "up": "344022", "group": "g_6"},
    {"num": 16, "frame": 60, "name": "DHAIBES MÚKDISE, Agostina", "up": "344026", "group": "g_3"},
    {"num": 17, "frame": 62, "name": "VARGIU, Gianluca", "up": "344056", "group": "g_1"},
    {"num": 18, "frame": 65, "name": "MOVANE, SOFIA", "up": "343896", "group": "g_17"},
    {"num": 19, "frame": 68, "name": "ROLDÁN JAIMEZ, Mariana", "up": "344012", "group": "g_13"},
    {"num": 20, "frame": 70, "name": "REGUERA, Rodrigo Leonel", "up": "344048", "group": "g_10"},
    {"num": 21, "frame": 73, "name": "JEREZ, Marcelo Matias", "up": "343270", "group": "g_11"},
    {"num": 22, "frame": 76, "name": "CARRIZO, FABRICIO EZEQUIEL", "up": "344144", "group": "g_9"},
    {"num": 23, "frame": 79, "name": "PAEZ DE LA TORRE, Lourdes", "up": "344074", "group": "g_8"},
    {"num": 24, "frame": 82, "name": "Zavaleta, Juan Pablo", "up": "343940", "group": "g_15"},
    {"num": 25, "frame": 88, "name": "OCARANZA, Laureana", "up": "344058", "group": "g_7"},
    {"num": 26, "frame": 91, "name": "LAZARTE, Tomás Benjamin", "up": "343300", "group": "g_11"},
    {"num": 27, "frame": 93, "name": "FERNANDEZ, Ignacio", "up": "344077", "group": "g_10"},
    {"num": 28, "frame": 96, "name": "SANTUCCI, Massimo", "up": "344098", "group": "g_1"},
    {"num": 29, "frame": 99, "name": "OJEDA, Yamila Dayana", "up": "343870", "group": "g_18"},
    {"num": 30, "frame": 101, "name": "CUEVAS, Nicole Jennifer", "up": "344055", "group": "g_8"},
    {"num": 31, "frame": 104, "name": "BARROS, Sofia Abigail", "up": "344009", "group": "g_8"}
]

base_dir = r"2° parcial practica\correccion\tema2"
out_frames = os.path.join(base_dir, "parciales_alumnos")
out_crops = os.path.join(base_dir, "parciales_alumnos", "recortes_grilla")
out_sheets = os.path.join(base_dir, "parciales_alumnos", "hojas_inspeccion")

os.makedirs(out_frames, exist_ok=True)
os.makedirs(out_crops, exist_ok=True)
os.makedirs(out_sheets, exist_ok=True)

# Load cache
with open('students_cache.json', encoding='utf-8') as f:
    db = {s['up']: s for s in json.load(f)}

for ex in tema2_list:
    up = ex['up']
    s_info = db.get(up, {})
    ex['group'] = s_info.get('group', ex['group'])
    ex['puntosComprados'] = s_info.get('puntosComprados', 0)
    
    src = os.path.join(base_dir, "muestras_1s", f"frame_{ex['frame']:03d}.jpg")
    clean_name = ex['name'].replace(' ', '_').replace('ñ', 'n').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u').replace(',', '').replace('__', '_')
    dst = os.path.join(out_frames, f"{ex['num']:02d}_{clean_name}_{up}.jpg")
    if os.path.exists(src):
        shutil.copy2(src, dst)
        
        # Make crop
        with Image.open(src) as img:
            w, h = img.size
            crop = img.crop((int(w * 0.02), int(h * 0.22), int(w * 0.98), int(h * 0.68)))
            draw = ImageDraw.Draw(crop)
            draw.rectangle([(0,0), (crop.width, 35)], fill='black')
            draw.text((10, 8), f"#{ex['num']:02d} | {ex['name']} | UP: {up} | Pts Comprados: +{ex['puntosComprados']}", fill='yellow')
            crop.save(os.path.join(out_crops, f"crop_{ex['num']:02d}.jpg"))

with open(os.path.join(out_frames, "exam_manifest.json"), "w", encoding="utf-8") as f:
    json.dump(tema2_list, f, indent=2, ensure_ascii=False)

# Make composite inspection sheets (6 per sheet)
batch_size = 6
for b in range(0, len(tema2_list), batch_size):
    batch = tema2_list[b:b+batch_size]
    imgs = []
    for ex in batch:
        cp = os.path.join(out_crops, f"crop_{ex['num']:02d}.jpg")
        if os.path.exists(cp):
            im = Image.open(cp)
            im = im.resize((640, 720), Image.Resampling.LANCZOS)
            imgs.append(im)
    if imgs:
        sheet = Image.new('RGB', (640 * 2, 720 * 3), 'white')
        for idx, im in enumerate(imgs):
            r = idx // 2
            c = idx % 2
            sheet.paste(im, (c * 640, r * 720))
        sheet.save(os.path.join(out_sheets, f"hoja_{b//batch_size:02d}.jpg"))

print(f"Tema 2: {len(tema2_list)} exams prepared and sheets created.")
