import os
import sys
import shutil
import pymupdf

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

# ---------------------------------------------------------------------------
# DEFINICIÓN DE PREGUNTAS (TODAS CON RESPUESTA CORRECTA EN OPCIÓN 'c')
# ---------------------------------------------------------------------------

QUESTIONS_P1 = [
    {
        "num": "1",
        "question": "¿Por qué las directrices internacionales (OMS/FAO) y de la cátedra exigen que el agua esté a aproximadamente 70 °C al momento de disolver la fórmula infantil en polvo?",
        "correct": "c",
        "options": [
            ("a", "Porque a esa temperatura se disuelven mejor los carbohidratos y se previene que la preparación tome sabor amargo."),
            ("b", "Porque temperaturas menores a 70 °C desnaturalizan las proteínas del suero lácteo e inactivan la lactoferrina agregada."),
            ("c", "Porque las fórmulas en polvo no son estériles; el agua a ~70 °C actúa como tratamiento térmico bactericida que inactiva patógenos letales como Cronobacter sakazakii y Salmonella."),
            ("d", "Porque a 100 °C se altera la matriz plástica del biberón pero a 70 °C se maximiza la densidad calórica de los lípidos.")
        ]
    },
    {
        "num": "2",
        "question": "Durante el armado del biberón, ¿por qué es mandatorio verter el agua caliente SIEMPRE ANTES que el polvo y qué riesgo pediátrico grave previene?",
        "correct": "c",
        "options": [
            ("a", "Previene que los sólidos se aglutinen en la rosca del biberón e impidan el sellado hermético de la tetina."),
            ("b", "Verter el agua caliente antes permite la solubilización inicial del hierro aumentando su absorción yeyunal."),
            ("c", "Si se coloca el polvo primero, el volumen ocupado por los sólidos desplaza solvente, generando una fórmula hiperconcentrada con sobrecarga osmolar renal y deshidratación hipernatrémica grave."),
            ("d", "Evita que el agua a 70 °C hidrolice anticipadamente las micelas de caseína provocando meteorismo por sobrecarga de lactosa.")
        ]
    },
    {
        "num": "3",
        "question": "Respecto a la técnica reglamentaria de dosificación y enrase del polvo: ¿Cuál es el procedimiento estandarizado y la relación de dilución establecida?",
        "correct": "c",
        "options": [
            ("a", "Llenar la medida provista, compactar firmemente con el pulgar contra la lata y disolver a razón de 2 medidas por cada 50 ml de agua potable."),
            ("b", "Llenar el cacito en forma colmada y diluir 1 medida por cada 60 ml de agua para facilitar el vaciamiento gástrico en lactantes sanos."),
            ("c", "Llenar la cuchara medidora de la lata sin presionar ni apisonar, enrasar al ras con el reborde nivelador o el lomo de un cuchillo limpio, respetando la relación de 1 medida al ras cada 30 ml de agua potable."),
            ("d", "Pesar el polvo en balanza de cocina a razón de exactamente 15 g de polvo disueltos en 50 ml de agua a temperatura ambiente.")
        ]
    },
    {
        "num": "4",
        "question": "¿Por qué está expresamente contraindicado agitar la mamadera verticalmente con fuerza ('estilo coctelera') y cuál es la técnica indicada de reconstitución?",
        "correct": "c",
        "options": [
            ("a", "Porque la agitación vigorosa descalibra la válvula anticólicos de silicona; debe homogeneizarse exclusivamente con varilla estéril."),
            ("b", "Porque el batido vertical desnaturaliza los ácidos grasos poliinsaturados precipitando como cristales lipídicos insolubles."),
            ("c", "Porque la agitación vigorosa incorpora abundante aire en forma de microburbujas y espuma que provocan aerofagia severa, distensión y cólicos; debe mezclarse haciendo rodar suavemente el biberón entre las palmas de las manos."),
            ("d", "Porque la agitación vigorosa incrementa la presión hidrostática dentro del envase expulsando componentes termolábiles de la fórmula.")
        ]
    },
    {
        "num": "5",
        "question": "¿Cuál es la principal ventaja clínica de la Gráfica de Calvo et al. (2009) para el nutricionista durante la consulta prenatal?",
        "correct": "c",
        "options": [
            ("a", "Permite calcular con precisión milimétrica la ganancia neta de tejido adiposo materno diferenciada del peso fetal y de la placenta."),
            ("b", "Reemplaza por completo el cálculo del Valor Calórico Total diario estableciendo incrementos fijos de 500 kcal/día por cada desvío estándar."),
            ("c", "Permite formular un diagnóstico nutricional puntual en cualquier consulta prenatal (incluso en captaciones tardías del 2° o 3° trimestre) relacionando IMC materno y edad gestacional sin depender del peso pregestacional de la paciente."),
            ("d", "Automatiza la detección de diabetes gestacional y prescribe los gramos de carbohidratos complejos según semanas de amenorrea.")
        ]
    }
]

QUESTIONS_P2 = [
    {
        "num": "1",
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
        "question": "¿Por qué las algas como la espirulina, nori o chlorella NO deben utilizarse como fuente de Vitamina B12 en la alimentación de niños y adolescentes?",
        "correct": "c",
        "options": [
            ("a", "Porque aportan concentraciones tóxicas de cobalamina que sobrecargan la función renal pediátrica."),
            ("b", "Porque inhiben la proliferación de glóbulos blancos durante el proceso digestivo entérico."),
            ("c", "Porque contienen pseudovitamina B12 (análogos inactivos que bloquean los receptores ileales y falsean los análisis en sangre)."),
            ("d", "Porque requieren hervirse durante un período continuo de más de 8 horas para activarse biológicamente.")
        ]
    },
    {
        "num": "5",
        "question": "¿Qué combinación alimentaria en el almuerzo permite optimizar y hasta triplicar la absorción del hierro vegetal (no hemínico) aportado por las legumbres?",
        "correct": "c",
        "options": [
            ("a", "Consumir el plato junto con un vaso de leche entera de vaca o yogur bebible."),
            ("b", "Tomar una taza de té negro concentrado o mate cocido caliente junto con la comida."),
            ("c", "Acompañar la comida con una fuente de Vitamina C fresca (como pimiento morrón crudo, tomate fresco o frutas cítricas)."),
            ("d", "Espolvorear salvado de trigo seco sin remojar sobre la preparación caliente.")
        ]
    }
]

def build_exam_pdf(output_path, title_right, questions, is_teacher_key=False):
    # A4: 595.27 x 841.89 pt
    # Strict 1-page margins
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=38,
        rightMargin=38,
        topMargin=28,
        bottomMargin=28
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
        fontSize=12.2,
        leading=14.8,
        alignment=TA_RIGHT,
        textColor=colors.black
    )

    style_field = ParagraphStyle(
        'StudentField',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.8,
        leading=12.0,
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
        fontSize=8.0,
        leading=10.2,
        alignment=TA_CENTER,
        textColor=colors.black
    )

    style_instructions = ParagraphStyle(
        'InstText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.4,
        leading=9.6,
        textColor=colors.black
    )

    style_score_title = ParagraphStyle(
        'ScoreTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.0,
        leading=10.2,
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
        fontSize=8.6,
        leading=11.6,
        textColor=colors.black
    )

    style_opt_letter = ParagraphStyle(
        'OptLetter',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.2,
        leading=11.0,
        textColor=colors.black
    )

    style_opt_text = ParagraphStyle(
        'OptText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.2,
        leading=11.0,
        textColor=colors.black
    )

    style_opt_text_bold = ParagraphStyle(
        'OptTextBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.2,
        leading=11.0,
        textColor=colors.black
    )

    story = []

    # 1. HEADER INSTITUCIONAL Y TÍTULO
    header_right_content = title_right
    if is_teacher_key:
        header_right_content += "<br/><font size='8'>CLAVE DOCENTE</font>"

    header_data = [
        [
            Paragraph("""<b>UNIVERSIDAD DEL NORTE SANTO TOMÁS DE AQUINO</b><br/>
            <font size="7.8">Facultad de Ciencias de la Salud — Licenciatura en Nutrición</font><br/>
            <b>CÁTEDRA DE NUTRICIÓN INFANTIL — EVALUACIÓN PARCIAL</b>""", style_header_left),
            Paragraph(f"<b>{header_right_content}</b>", style_header_right)
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

    # 2. DATOS DEL ALUMNO
    field_data = [
        [Paragraph("<b>Apellido y Nombre:</b> __________________________________________________________________ &nbsp;&nbsp;&nbsp;&nbsp; <b>UP :</b> _____________", style_field)]
    ]
    field_table = Table(field_data, colWidths=[519])
    field_table.setStyle(TableStyle([
        ('TOPPADDING', (0, 0), (-1, -1), 1),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(field_table)
    story.append(Spacer(1, 3))

    # 3. GRILLA DE CORRECCIÓN SUPERIOR (CON MARCADO EN X) E INSTRUCCIONES
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
            # En la clave docente todas las correctas son C
            if is_teacher_key and opt == 'C':
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
        ('TOPPADDING', (0, 0), (-1, -1), 2.8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.8),
    ]))

    # Casillero oficial de calificación
    nota_box_cell = [
        [Paragraph("", styles['Normal'])]
    ]
    nota_box = Table(nota_box_cell, colWidths=[52], rowHeights=[23])
    nota_box.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 1.0, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ]))

    # Bloque derecho: Instrucciones + Casilla de Nota Final
    right_box_data = [
        [
            Paragraph("<b>INSTRUCCIONES</b>", style_instructions_title),
            Paragraph("<b>NOTA FINAL</b>", style_score_title)
        ],
        [
            Paragraph("""• Marque con una <b>X</b> una sola opción por pregunta.<br/>
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

    # Tabla Maestra Superior
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

    # 4. LÍNEA DIVISORIA
    story.append(HRFlowable(width="100%", thickness=0.8, color=colors.black, spaceBefore=2, spaceAfter=7))

    # 5. PREGUNTAS (1 A 5)
    for i, q in enumerate(questions):
        q_p = Paragraph(f"<b>{q['num']}.</b> {q['question']}", style_q_num)
        story.append(q_p)
        story.append(Spacer(1, 2.5))

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
            ('TOPPADDING', (0, 0), (-1, -1), 1.2),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 1.2),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ]))
        story.append(opt_table)

        if i < len(questions) - 1:
            story.append(Spacer(1, 10))

    doc.build(story)

    # Verificación de 1 sola página
    doc_check = pymupdf.open(output_path)
    page_count = len(doc_check)
    doc_check.close()
    if page_count != 1:
        raise ValueError(f"ERROR: {output_path} tiene {page_count} páginas en vez de exactamente 1 carilla!")
    print(f"OK [1 carilla]: {output_path}")

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.abspath(os.path.join(base_dir, "../../"))
    recuperatorios_dir = os.path.join(root_dir, "recuperatorios")
    os.makedirs(recuperatorios_dir, exist_ok=True)

    p1_dir = os.path.join(root_dir, "proyectos/repaso_parcial_1")
    p2_dir = os.path.join(root_dir, "proyectos/repaso_parcial_2")

    print(f"=== GENERANDO RECUPERATORIOS NUTRICIÓN INFANTIL ===")
    print(f"Carpeta destino principal: {recuperatorios_dir}")

    # -------------------------------------------------------------
    # 1. RECUPERATORIO 1° PARCIAL PRÁCTICA
    # -------------------------------------------------------------
    p1_alumno_pdf = os.path.join(recuperatorios_dir, "recuperatorio_1_parcial_practica.pdf")
    p1_docente_pdf = os.path.join(recuperatorios_dir, "recuperatorio_1_parcial_practica_CLAVE_DOCENTE.pdf")

    build_exam_pdf(p1_alumno_pdf, "RECUPERATORIO 1° PARCIAL", QUESTIONS_P1, is_teacher_key=False)
    build_exam_pdf(p1_docente_pdf, "RECUPERATORIO 1° PARCIAL", QUESTIONS_P1, is_teacher_key=True)

    # Copias de conveniencia para 1° Parcial
    shutil.copyfile(p1_alumno_pdf, os.path.join(root_dir, "recuperatorio_1_parcial_practica.pdf"))
    shutil.copyfile(p1_docente_pdf, os.path.join(root_dir, "recuperatorio_1_parcial_practica_CLAVE_DOCENTE.pdf"))
    shutil.copyfile(p1_alumno_pdf, os.path.join(base_dir, "recuperatorio_1_parcial_practica.pdf"))
    shutil.copyfile(p1_docente_pdf, os.path.join(base_dir, "recuperatorio_1_parcial_practica_CLAVE_DOCENTE.pdf"))
    if os.path.exists(p1_dir):
        shutil.copyfile(p1_alumno_pdf, os.path.join(p1_dir, "recuperatorio_1_parcial_practica.pdf"))
        shutil.copyfile(p1_docente_pdf, os.path.join(p1_dir, "recuperatorio_1_parcial_practica_CLAVE_DOCENTE.pdf"))

    # -------------------------------------------------------------
    # 2. RECUPERATORIO 2° PARCIAL PRÁCTICA
    # -------------------------------------------------------------
    p2_alumno_pdf = os.path.join(recuperatorios_dir, "recuperatorio_2_parcial_practica.pdf")
    p2_docente_pdf = os.path.join(recuperatorios_dir, "recuperatorio_2_parcial_practica_CLAVE_DOCENTE.pdf")

    build_exam_pdf(p2_alumno_pdf, "RECUPERATORIO 2° PARCIAL", QUESTIONS_P2, is_teacher_key=False)
    build_exam_pdf(p2_docente_pdf, "RECUPERATORIO 2° PARCIAL", QUESTIONS_P2, is_teacher_key=True)

    # Copias de conveniencia para 2° Parcial
    shutil.copyfile(p2_alumno_pdf, os.path.join(root_dir, "recuperatorio_2_parcial_practica.pdf"))
    shutil.copyfile(p2_docente_pdf, os.path.join(root_dir, "recuperatorio_2_parcial_practica_CLAVE_DOCENTE.pdf"))
    shutil.copyfile(p2_alumno_pdf, os.path.join(base_dir, "recuperatorio_2_parcial_practica.pdf"))
    shutil.copyfile(p2_docente_pdf, os.path.join(base_dir, "recuperatorio_2_parcial_practica_CLAVE_DOCENTE.pdf"))
    if os.path.exists(p2_dir):
        shutil.copyfile(p2_alumno_pdf, os.path.join(p2_dir, "recuperatorio_2_parcial_practica.pdf"))
        shutil.copyfile(p2_docente_pdf, os.path.join(p2_dir, "recuperatorio_2_parcial_practica_CLAVE_DOCENTE.pdf"))

    print("\nTodos los exámenes fueron generados y verificados en 1 sola carilla con éxito.")

if __name__ == '__main__':
    main()
