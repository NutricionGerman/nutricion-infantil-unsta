import os, json
from PIL import Image

in_dir = r"2° parcial practica\correccion\parciales_alumnos"
out_dir = r"2° parcial practica\correccion\parciales_alumnos\recortes_grilla"
os.makedirs(out_dir, exist_ok=True)

with open(os.path.join(in_dir, 'exam_manifest.json'), encoding='utf-8') as f:
    exams = json.load(f)

for ex in exams:
    up = ex['up']
    clean_name = ex['name'].replace(' ', '_').replace('ñ', 'n').replace('á', 'a').replace('é', 'e').replace('í', 'i').replace('ó', 'o').replace('ú', 'u')
    fname = f"{ex['num']:02d}_{clean_name}_{up}.jpg"
    p = os.path.join(in_dir, fname)
    if os.path.exists(p):
        with Image.open(p) as img:
            w, h = img.size
            # The name + grid is roughly:
            # y from 0.22 to 0.70
            # x from 0.02 to 0.98
            crop = img.crop((int(w * 0.02), int(h * 0.23), int(w * 0.98), int(h * 0.68)))
            
            # Draw student info bar on top
            from PIL import ImageDraw
            draw = ImageDraw.Draw(crop)
            draw.rectangle([(0,0), (crop.width, 35)], fill='black')
            draw.text((10, 8), f"#{ex['num']:02d} | {ex['name']} | UP: {up} | Pts Comprados: +{ex['puntosComprados']}", fill='yellow')
            
            crop.save(os.path.join(out_dir, f"crop_{ex['num']:02d}.jpg"))

# Create 8 inspection sheets of 6 crops each (2 columns x 3 rows)
sheet_dir = r"2° parcial practica\correccion\parciales_alumnos\hojas_inspeccion"
os.makedirs(sheet_dir, exist_ok=True)

batch_size = 6
for b in range(0, len(exams), batch_size):
    batch = exams[b:b+batch_size]
    imgs = []
    for ex in batch:
        cp = os.path.join(out_dir, f"crop_{ex['num']:02d}.jpg")
        if os.path.exists(cp):
            im = Image.open(cp)
            # resize to 700x700 approx
            im = im.resize((640, 720), Image.Resampling.LANCZOS)
            imgs.append(im)
    
    if imgs:
        sheet = Image.new('RGB', (640 * 2, 720 * 3), 'white')
        for idx, im in enumerate(imgs):
            r = idx // 2
            c = idx % 2
            sheet.paste(im, (c * 640, r * 720))
        sheet.save(os.path.join(sheet_dir, f"hoja_{b//batch_size:02d}.jpg"))

print("Inspection sheets and crops generated successfully.")
