import os
import sys
import shutil

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def build_recuperatorio_pdf(output_path, is_teacher_key=False):
    # A4: 595.27 x 841.89 pt
    # Clean academic margins: left 38, right 38, top 30, bottom 30
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=38,
        rightMargin=38,
        topMargin=30,
        bottomMargin=30
    )

    styles = getSampleStyleSheet()

    style_header_left = ParagraphStyle(
        'HeaderLeft',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.2,
        textColor=colors.black
    )

    style_header_right = ParagraphStyle(
        'HeaderRight',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12.5,
        leading=15.0,
        alignment=TA_RIGHT,
        textColor=colors.black
    )

    style_field = ParagraphStyle(
        'StudentField',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.8,
        leading=12.5,
        textColor=colors.black
    )

    style_grid_th = ParagraphStyle(
        'GridTH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.0,
        leading=10.0,
        alignment=TA_CENTER,
        textColor=colors.black
    )

    style_grid_td_q = ParagraphStyle(
        'GridTDQ',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=9.5,
        alignment=TA_CENTER,
        textColor=colors.black
    )

    style_grid_td_opt = ParagraphStyle(
        'GridTDOpt',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=9.5,
        alignment=TA_CENTER,
        textColor=colors.black
    )

    style_grid_td_opt_marked = ParagraphStyle(
        'GridTDOptMarked',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.0,
        leading=9.5,
        alignment=TA_CENTER,
        textColor=colors.black
    )

    style_instructions_title = ParagraphStyle(
        'InstTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.2,
        leading=10.5,
        alignment=TA_CENTER,
        textColor=colors.black
    )

    style_instructions = ParagraphStyle(
        'InstText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.4,
        leading=9.8,
        textColor=colors.black
    )

    style_score_title = ParagraphStyle(
        'ScoreTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.2,
        leading=10.5,
        alignment=TA_CENTER,
        textColor=colors.black
    )

    style_score_sub = ParagraphStyle(
        'ScoreSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=9.5,
        alignment=TA_CENTER,
        textColor=colors.black
    )

    style_score_sub_note = ParagraphStyle(
        'ScoreSubNote',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=6.8,
        leading=8.5,
        alignment=TA_CENTER,
        textColor=colors.black
    )

    style_q_num = ParagraphStyle(
        'QText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.8,
        leading=12.0,
        textColor=colors.black
    )

    style_opt_letter = ParagraphStyle(
        'OptLetter',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.4,
        leading=11.2,
        textColor=colors.black
    )

    style_opt_text = ParagraphStyle(
        'OptText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.4,
        leading=11.2,
        textColor=colors.black
    )

    style_opt_text_bold = ParagraphStyle(
        'OptTextBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.4,
        leading=11.2,
        textColor=colors.black
    )

    story = []

    # 1. TOP HEADER (Exact as reference screenshot)
    header_title_right = "RECUPERATORIO 2° PARCIAL"
    if is_teacher_key:
        header_title_right += "<br/><font size='8'>CLAVE DOCENTE</font>"

    header_data = [
        [
            Paragraph("""<b>UNIVERSIDAD DEL NORTE SANTO TOMÁS DE AQUINO</b><br/>
            <font size="7.8">Facultad de Ciencias de la Salud — Licenciatura en Nutrición</font><br/>
            <b>CÁTEDRA DE NUTRICIÓN INFANTIL — EVALUACIÓN PARCIAL</b>""", style_header_left),
            Paragraph(f"<b>{header_title_right}</b>", style_header_right)
        ]
    ]
    header_table = Table(header_data, colWidths=[330, 189])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 4))

    # 2. STUDENT FIELDS
    field_data = [
        [Paragraph("<b>Apellido y Nombre:</b> __________________________________________________________________ &nbsp;&nbsp;&nbsp;&nbsp; <b>UP :</b> _____________", style_field)]
    ]
    field_table = Table(field_data, colWidths=[519])
    field_table.setStyle(TableStyle([
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(field_table)
    story.append(Spacer(1, 4))

    # 3. CORRECTION GRID & INSTRUCTIONS AT THE TOP
    correct_answers = {1: 'C', 2: 'C', 3: 'C', 4: 'B', 5: 'B'}

    grid_inner_data = [
        [
            Paragraph("<b>Pregunta</b>", style_grid_th),
            Paragraph("<b>A</b>", style_grid_th),
            Paragraph("<b>B</b>", style_grid_th),
            Paragraph("<b>C</b>", style_grid_th),
            Paragraph("<b>D</b>", style_grid_th)
        ]
    ]

    for qnum in range(1, 6):
        row = [Paragraph(f"Pregunta {qnum}", style_grid_td_q)]
        for opt in ['A', 'B', 'C', 'D']:
            if is_teacher_key and correct_answers[qnum] == opt:
                cell_text = f"<b>[X] {opt}</b>"
                row.append(Paragraph(cell_text, style_grid_td_opt_marked))
            else:
                cell_text = f"[ &nbsp; ] {opt}"
                row.append(Paragraph(cell_text, style_grid_td_opt))
        grid_inner_data.append(row)

    grid_inner_table = Table(grid_inner_data, colWidths=[76, 36, 36, 36, 36])
    grid_inner_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 1.0, colors.black),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 3.0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.0),
    ]))

    # Real bordered box for NOTA FINAL
    nota_box_cell = [
        [Paragraph("", styles['Normal'])]
    ]
    nota_box = Table(nota_box_cell, colWidths=[52], rowHeights=[24])
    nota_box.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 1.0, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ]))

    # Right side: Instructions + NOTA FINAL box
    right_box_data = [
        [
            Paragraph("<b>INSTRUCCIONES</b>", style_instructions_title),
            Paragraph("<b>NOTA FINAL</b>", style_score_title)
        ],
        [
            Paragraph("""• Marque con una X una sola opción por pregunta.<br/>
            • Las respuestas con más de una marca se considerarán incorrectas.<br/>
            • No se aceptan tachaduras ni uso de corrector.""", style_instructions),
            Table([
                [nota_box],
                [Paragraph("<b>/ 10 PUNTOS</b>", style_score_sub)],
                [Paragraph("<i>(Cada pregunta vale 2 puntos)</i>", style_score_sub_note)]
            ], colWidths=[105])
        ]
    ]

    right_box_table = Table(right_box_data, colWidths=[185, 110])
    right_box_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 1),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ]))

    # Master top table
    master_top_data = [
        [grid_inner_table, right_box_table]
    ]
    master_top_table = Table(master_top_data, colWidths=[224, 295])
    master_top_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(master_top_table)
    story.append(Spacer(1, 4))

    # 4. HORIZONTAL LINE
    story.append(HRFlowable(width="100%", thickness=0.8, color=colors.black, spaceBefore=2, spaceAfter=8))

    # 5. FIVE QUESTIONS COMBINED
    questions = [
        {
            "num": "1",
            "source": "Tema 2 (Q4)",
            "question": "De acuerdo con el protocolo estandarizado de la Organización Mundial de la Salud (OMS), ¿cuál es el sitio anatómico exacto de referencia para la medición de la circunferencia de cintura?",
            "correct": "c",
            "options": [
                ("a", "Inmediatamente por encima de la espina ilíaca anterosuperior derecha."),
                ("b", "Tres centímetros por debajo del centro de la cicatriz umbilical."),
                ("c", "En el punto medio equidistante entre el borde inferior de la última costilla palpable y la cresta ilíaca."),
                ("d", "Sobre el reborde costal anterior a nivel de la apófisis xifoides del esternón.")
            ]
        },
        {
            "num": "2",
            "source": "Tema 1 (Q3) / Tema 2 (Q10)",
            "question": "Para ubicar y marcar el punto mesobraquial (punto medio del brazo), ¿cuáles son los dos puntos óseos de referencia anatómica que se deben palpar con el codo flexionado a 90°?",
            "correct": "c",
            "options": [
                ("a", "El extremo distal de la clavícula y la apófisis estiloides del radio en la muñeca."),
                ("b", "El ángulo inferior de la escápula y la fosa antecubital del pliegue del codo."),
                ("c", "El borde superolateral del acromion y el punto más distal del olécranon."),
                ("d", "La tuberosidad mayor del húmero y la apófisis coronoides del cúbito.")
            ]
        },
        {
            "num": "3",
            "source": "Tema 1 (Q4) / Tema 2 (Q2)",
            "question": "En la evaluación antropométrica de la circunferencia de cintura (sea por protocolo CDC u OMS), ¿en qué momento del ciclo respiratorio debe efectuarse la lectura de la cinta métrica?",
            "correct": "c",
            "options": [
                ("a", "En el momento de máxima inspiración pulmonar conteniendo el aire durante tres segundos."),
                ("b", "En cualquier instante indistinto mientras el paciente conversa activamente con el evaluador."),
                ("c", "Al final de una espiración normal y no forzada, con el abdomen suave y relajado."),
                ("d", "Inmediatamente después de pedirle al niño que hunda y contraiga activamente la pared abdominal.")
            ]
        },
        {
            "num": "4",
            "source": "Tema 1 (Q6) / Tema 2 (Q5)",
            "question": "¿Por qué las algas como la espirulina, nori o chlorella NO deben utilizarse como fuente de Vitamina B12 en la alimentación de niños y adolescentes?",
            "correct": "b",
            "options": [
                ("a", "Porque aportan concentraciones tóxicas de cobalamina que sobrecargan la función renal pediátrica."),
                ("b", "Porque contienen pseudovitamina B12 (análogos inactivos que bloquean los receptores ileales y falsean los análisis en sangre)."),
                ("c", "Porque requieren hervirse durante un período continuo de más de 8 horas para activarse biológicamente."),
                ("d", "Porque inhiben la proliferación de glóbulos blancos durante el proceso digestivo entérico.")
            ]
        },
        {
            "num": "5",
            "source": "Tema 1 (Q10) / Tema 2 (Q9)",
            "question": "¿Qué combinación alimentaria en el almuerzo permite optimizar y hasta triplicar la absorción del hierro vegetal (no hemínico) aportado por las legumbres?",
            "correct": "b",
            "options": [
                ("a", "Consumir el plato junto con un vaso de leche entera de vaca o yogur bebible."),
                ("b", "Acompañar la comida con una fuente de Vitamina C fresca (como pimiento morrón crudo, tomate fresco o frutas cítricas)."),
                ("c", "Tomar una taza de té negro concentrado o mate cocido caliente junto con la comida."),
                ("d", "Espolvorear salvado de trigo seco sin remojar sobre la preparación caliente.")
            ]
        }
    ]

    for i, q in enumerate(questions):
        q_p = Paragraph(f"<b>{q['num']}.</b> {q['question']}", style_q_num)
        story.append(q_p)
        story.append(Spacer(1, 3))

        opt_table_data = []
        for opt_letter, opt_text in q["options"]:
            is_correct = (is_teacher_key and opt_letter == q["correct"])
            txt_style = style_opt_text_bold if is_correct else style_opt_text
            mark = "<b>[X] </b>" if is_correct else ""
            opt_table_data.append([
                Paragraph(f"<b>{opt_letter})</b>", style_opt_letter),
                Paragraph(f"{mark}{opt_text}", txt_style)
            ])

        opt_table = Table(opt_table_data, colWidths=[18, 501])
        opt_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 1.5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 1.5),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ]))
        story.append(opt_table)

        if i < len(questions) - 1:
            story.append(Spacer(1, 14))

    doc.build(story)
    print(f"Build complete: {output_path}")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.abspath(os.path.join(base_dir, "../../"))
    p2_dir = os.path.join(root_dir, "proyectos/repaso_parcial_2")

    # 1. Alumno
    pdf_alumno_catedra = os.path.join(base_dir, "recuperatorio_2_parcial_practica.pdf")
    pdf_alumno_root = os.path.join(root_dir, "recuperatorio_2_parcial_practica.pdf")
    pdf_alumno_p2 = os.path.join(p2_dir, "recuperatorio_2_parcial_practica.pdf")

    build_recuperatorio_pdf(pdf_alumno_catedra, is_teacher_key=False)
    shutil.copyfile(pdf_alumno_catedra, pdf_alumno_root)
    if os.path.exists(p2_dir):
        shutil.copyfile(pdf_alumno_catedra, pdf_alumno_p2)
    print(f"Generado PDF Alumno")

    # 2. Clave Docente
    pdf_docente_catedra = os.path.join(base_dir, "recuperatorio_2_parcial_practica_CLAVE_DOCENTE.pdf")
    pdf_docente_root = os.path.join(root_dir, "recuperatorio_2_parcial_practica_CLAVE_DOCENTE.pdf")
    pdf_docente_p2 = os.path.join(p2_dir, "recuperatorio_2_parcial_practica_CLAVE_DOCENTE.pdf")

    build_recuperatorio_pdf(pdf_docente_catedra, is_teacher_key=True)
    shutil.copyfile(pdf_docente_catedra, pdf_docente_root)
    if os.path.exists(p2_dir):
        shutil.copyfile(pdf_docente_catedra, pdf_docente_p2)
    print(f"Generado PDF Clave Docente")
