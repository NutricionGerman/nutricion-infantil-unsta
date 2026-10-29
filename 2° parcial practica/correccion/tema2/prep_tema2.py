import os, glob
from PIL import Image, ImageDraw

base_dir = r"2° parcial practica\correccion\tema2"
in_dir = os.path.join(base_dir, "muestras_1s")
hdr_dir = os.path.join(base_dir, "headers")
strip_dir = os.path.join(base_dir, "header_strips")
montage_dir = os.path.join(base_dir, "montajes")

os.makedirs(hdr_dir, exist_ok=True)
os.makedirs(strip_dir, exist_ok=True)
os.makedirs(montage_dir, exist_ok=True)

files = sorted(glob.glob(os.path.join(in_dir, "frame_*.jpg")))
print(f"Total frames found: {len(files)}")

# 1. Crop headers
for idx, f in enumerate(files, 1):
    with Image.open(f) as img:
        w, h = img.size
        # Crop header area
        crop = img.crop((int(w * 0.05), int(h * 0.24), int(w * 0.95), int(h * 0.32)))
        draw = ImageDraw.Draw(crop)
        draw.rectangle([(0,0), (60, 25)], fill='black')
        draw.text((5, 5), f"{idx}", fill='yellow')
        crop.save(os.path.join(hdr_dir, f"hdr_{idx:03d}.jpg"))

# 2. Generate strips (20 per strip)
strip_len = 20
for s in range(0, len(files), strip_len):
    imgs = []
    max_w = 0
    total_h = 0
    for i in range(s + 1, min(s + strip_len + 1, len(files) + 1)):
        p = os.path.join(hdr_dir, f"hdr_{i:03d}.jpg")
        if os.path.exists(p):
            im = Image.open(p)
            im = im.resize((800, int(im.height * 800 / im.width)), Image.Resampling.LANCZOS)
            imgs.append(im)
            max_w = max(max_w, im.width)
            total_h += im.height
    if imgs:
        strip = Image.new('RGB', (max_w, total_h), 'white')
        curr_y = 0
        for im in imgs:
            strip.paste(im, (0, curr_y))
            curr_y += im.height
        strip.save(os.path.join(strip_dir, f"strip_{s//strip_len:02d}.jpg"))

# 3. Generate montages of every 3 seconds
sampled_frames = files[::3]
batch_size = 6
for b in range(0, len(sampled_frames), batch_size):
    batch = sampled_frames[b:b+batch_size]
    thumbs = []
    for f in batch:
        with Image.open(f) as img:
            t = img.resize((320, 569), Image.Resampling.LANCZOS)
            draw = ImageDraw.Draw(t)
            draw.rectangle([(0,0), (120, 35)], fill='black')
            draw.text((10, 10), os.path.basename(f), fill='yellow')
            thumbs.append(t)
    if thumbs:
        m = Image.new('RGB', (320 * 3, 569 * 2), 'gray')
        for i, t in enumerate(thumbs):
            r = i // 3
            c = i % 3
            m.paste(t, (c * 320, r * 569))
        m.save(os.path.join(montage_dir, f"montage_{b//batch_size:02d}.jpg"))

print("Tema 2 preprocessing complete.")
