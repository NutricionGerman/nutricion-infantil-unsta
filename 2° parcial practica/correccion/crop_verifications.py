import os
from PIL import Image

out_dir = r"2° parcial practica\correccion\verificaciones"
os.makedirs(out_dir, exist_ok=True)

checks = [
    ("03_Cervino", r"2° parcial practica\correccion\muestras_1s\frame_013.jpg"),
    ("03_Cervino_f14", r"2° parcial practica\correccion\muestras_1s\frame_014.jpg"),
    ("04_Lazarte", r"2° parcial practica\correccion\muestras_1s\frame_018.jpg"),
    ("05_Viana", r"2° parcial practica\correccion\muestras_1s\frame_021.jpg"),
    ("06_Santos", r"2° parcial practica\correccion\muestras_1s\frame_025.jpg"),
    ("07_FernandezSalazar", r"2° parcial practica\correccion\muestras_1s\frame_030.jpg"),
    ("08_Lescano_f34", r"2° parcial practica\correccion\muestras_1s\frame_034.jpg"),
    ("08_Lescano_f37", r"2° parcial practica\correccion\muestras_1s\frame_037.jpg"),
    ("45_Giuliano_f177", r"2° parcial practica\correccion\muestras_1s\frame_177.jpg"),
    ("45_Giuliano_f179", r"2° parcial practica\correccion\muestras_1s\frame_179.jpg")
]

for name, p in checks:
    if os.path.exists(p):
        with Image.open(p) as img:
            w, h = img.size
            # Crop table region: x from 0.02 to 0.75, y from 0.30 to 0.68
            crop = img.crop((int(w * 0.02), int(h * 0.30), int(w * 0.65), int(h * 0.68)))
            crop.save(os.path.join(out_dir, f"{name}.jpg"))

print("Verification crops saved.")
