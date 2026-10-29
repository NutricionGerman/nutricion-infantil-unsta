import os, csv, json
from PIL import Image, ImageDraw, ImageFont

def get_fonts():
    try:
        font_title = ImageFont.truetype('arialbd.ttf', 20)
        font_sub = ImageFont.truetype('arialbd.ttf', 16)
        font_score = ImageFont.truetype('arialbd.ttf', 18)
    except:
        try:
            font_title = ImageFont.truetype('arial.ttf', 20)
            font_sub = ImageFont.truetype('arial.ttf', 16)
            font_score = ImageFont.truetype('arial.ttf', 18)
        except:
            font_title = font_sub = font_score = ImageFont.load_default()
    return font_title, font_sub, font_score

def get_score_color(score):
    try:
        val = float(score)
        if val >= 10:
            return '#fbbf24' # gold
        elif val >= 8:
            return '#4ade80' # emerald
        elif val >= 6:
            return '#38bdf8' # sky blue
        elif val >= 4:
            return '#f59e0b' # amber
        else:
            return '#ef4444' # red
    except:
        return '#38bdf8'

def process_tema(base_dir, manifest_rel, csv_rel, crops_rel, sheets_rel, frame_dir_rel):
    manifest_p = os.path.join(base_dir, manifest_rel)
    csv_p = os.path.join(base_dir, csv_rel)
    crops_dir = os.path.join(base_dir, crops_rel)
    sheets_dir = os.path.join(base_dir, sheets_rel)
    frame_dir = os.path.join(base_dir, frame_dir_rel)
    
    os.makedirs(crops_dir, exist_ok=True)
    os.makedirs(sheets_dir, exist_ok=True)
    
    with open(manifest_p, encoding='utf-8') as f:
        manifest = json.load(f)
    with open(csv_p, encoding='utf-8-sig') as f:
        csv_rows = list(csv.DictReader(f))
    
    csv_by_up = {r['UP'].strip(): r for r in csv_rows}
    
    font_title, font_sub, font_score = get_fonts()
    processed_crops = []
    
    print(f"\nProcessing {len(manifest)} exams in {base_dir}...")
    for idx, ex in enumerate(manifest, start=1):
        num = int(ex['num'])
        up = str(ex['up']).strip()
        r = csv_by_up.get(up)
        if not r:
            print(f"Warning: UP {up} not found in CSV!")
            continue
            
        student_name = r['Apellido y Nombre'].strip()
        group = r['Comisión / Grupo'].strip()
        base_score = r['Puntaje Base (/10)'].strip()
        bonus = r['Puntos Comprados (Tienda)'].strip()
        total_score = r['Puntaje Total Obtenido (Max 10)'].strip()
        
        # Frame path
        frame_num = ex['frame']
        src_frame = os.path.join(frame_dir, f"frame_{frame_num:03d}.jpg")
        if not os.path.exists(src_frame):
            print(f"Warning: Frame {src_frame} not found!")
            continue
            
        with Image.open(src_frame) as im:
            w, h = im.size
            # Option 1 Crop: Left 58.5% of width, y from 0.20 to 0.685
            crop = im.crop((int(w * 0.03), int(h * 0.20), int(w * 0.585), int(h * 0.685)))
            cw, ch = crop.size
            
            banner_h = 62
            final_img = Image.new('RGB', (cw, ch + banner_h), '#0f172a')
            final_img.paste(crop, (0, banner_h))
            
            draw = ImageDraw.Draw(final_img)
            
            # Accent line on top
            score_color = get_score_color(total_score)
            draw.line([(0, 0), (cw, 0)], fill=score_color, width=3)
            
            # Row 1: Student info
            badge_text = f"#{num:02d} | {student_name} — UP: {up}"
            if group and group != '-':
                badge_text += f" ({group})"
            draw.text((15, 8), badge_text, fill='#ffffff', font=font_title)
            
            # Row 2: Scores
            score_prefix = f"Base: {base_score}/10   |   Tienda: {bonus} pts   |   "
            draw.text((15, 34), score_prefix, fill='#94a3b8', font=font_sub)
            
            # Draw score text right after
            # Measure prefix width using draw.textlength if available
            try:
                prefix_w = int(draw.textlength(score_prefix, font=font_sub))
            except:
                prefix_w = len(score_prefix) * 9
            
            score_str = f"NOTA FINAL: {total_score} / 10"
            draw.text((15 + prefix_w, 32), score_str, fill=score_color, font=font_score)
            
            out_path = os.path.join(crops_dir, f"crop_{num:02d}.jpg")
            final_img.save(out_path, quality=95)
            processed_crops.append(out_path)
            
    print(f"Generated {len(processed_crops)} clean crops in {crops_dir}")
    
    # Generate Contact Sheets (3 columns x 2 rows per sheet = 6 per sheet)
    batch_size = 6
    target_w, target_h = 560, 920
    for b_idx in range(0, len(processed_crops), batch_size):
        batch = processed_crops[b_idx:b_idx+batch_size]
        sheet_w = target_w * 3
        sheet_h = target_h * 2
        sheet = Image.new('RGB', (sheet_w, sheet_h), '#0f172a')
        
        for i, cp in enumerate(batch):
            with Image.open(cp) as im:
                im_res = im.resize((target_w, target_h), Image.Resampling.LANCZOS)
                col = i % 3
                row = i // 3
                sheet.paste(im_res, (col * target_w, row * target_h))
                
        sheet_fname = f"hoja_{b_idx // batch_size:02d}.jpg"
        sheet.save(os.path.join(sheets_dir, sheet_fname), quality=90)
        
    print(f"Generated {(len(processed_crops) + batch_size - 1) // batch_size} composite sheets in {sheets_dir}")

if __name__ == '__main__':
    # Tema 1
    process_tema(
        base_dir=r"2° parcial practica\correccion",
        manifest_rel=r"parciales_alumnos\exam_manifest.json",
        csv_rel=r"resultados_parcial2_practica.csv",
        crops_rel=r"parciales_alumnos\recortes_grilla",
        sheets_rel=r"parciales_alumnos\hojas_inspeccion",
        frame_dir_rel=r"muestras_1s"
    )
    
    # Tema 2
    process_tema(
        base_dir=r"2° parcial practica\correccion\tema2",
        manifest_rel=r"parciales_alumnos\exam_manifest.json",
        csv_rel=r"resultados_parcial2_practica_tema2.csv",
        crops_rel=r"parciales_alumnos\recortes_grilla",
        sheets_rel=r"parciales_alumnos\hojas_inspeccion",
        frame_dir_rel=r"muestras_1s"
    )
    print("\nALL 77 EXAMS PROCESSED AND POLISHED!")
