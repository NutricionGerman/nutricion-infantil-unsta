import os
import sys
import shutil
import pymupdf

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def generate_bw_exam(output_path, is_teacher_key=False):
    # Strict A4 single sheet (1 carilla = exactamente 1 página)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=42,
        rightMargin=42,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    style_title = ParagraphStyle(
        'ExamTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12.0,
        leading=15.0,
        alignment=TA_CENTER,
        textColor=colors.black
    )

    style_field = ParagraphStyle(
        'StudentField',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.2,
        leading=14.5,
        textColor=colors.black
    )

    style_grid_header = ParagraphStyle(
        'GridHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11.0,
        alignment=TA_CENTER,
        textColor=colors.black
    )

    style_grid_cell = ParagraphStyle(
        'GridCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.0,
        alignment=TA_CENTER,
        textColor=colors.black
    )

    style_grid_cell_correct = ParagraphStyle(
        'GridCellCorrect',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.0,
        leading=11.5,
        alignment=TA_CENTER,
        textColor=colors.black
    )

    style_q_text = ParagraphStyle(
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

    # 1. TITLE
    title_text = "NUTRICION INFANTIL 1° PARCIAL PRACTICO"
    if is_teacher_key:
        title_text += " — CLAVE DE CORRECCIÓN DOCENTE"
    story.append(Paragraph(title_text, style_title))
    story.append(Spacer(1, 14))

    # 2. STUDENT FIELDS
    student_table_data = [
        [Paragraph("<b>NOMBRE Y APELLIDO:</b> ________________________________________________________________", style_field)],
        [Paragraph("<b>UP:</b> ____________________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>FECHA:</b> _____ / _____ / 2026", style_field)]
    ]
    student_table = Table(student_table_data, colWidths=[511])
    student_table.setStyle(TableStyle([
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(student_table)
    story.append(Spacer(1, 10))

    # 3. CORRECTION GRID ARRIBA
    grid_data = [
        [
            Paragraph("<b>Pregunta</b>", style_grid_header),
            Paragraph("<b>1</b>", style_grid_header),
            Paragraph("<b>2</b>", style_grid_header),
            Paragraph("<b>3</b>", style_grid_header),
            Paragraph("<b>4</b>", style_grid_header),
            Paragraph("<b>5</b>", style_grid_header),
            Paragraph("<b>NOTA FINAL</b>", style_grid_header)
        ],
        [
            Paragraph("<b>Opción</b>", style_grid_cell),
            Paragraph("<b>B</b>" if is_teacher_key else "", style_grid_cell_correct),
            Paragraph("<b>B</b>" if is_teacher_key else "", style_grid_cell_correct),
            Paragraph("<b>C</b>" if is_teacher_key else "", style_grid_cell_correct),
            Paragraph("<b>C</b>" if is_teacher_key else "", style_grid_cell_correct),
            Paragraph("<b>B</b>" if is_teacher_key else "", style_grid_cell_correct),
            Paragraph("", style_grid_cell)
        ],
        [
            Paragraph("<b>Puntaje</b>", style_grid_cell),
            Paragraph("2 pts" if is_teacher_key else "", style_grid_cell),
            Paragraph("2 pts" if is_teacher_key else "", style_grid_cell),
            Paragraph("2 pts" if is_teacher_key else "", style_grid_cell),
            Paragraph("2 pts" if is_teacher_key else "", style_grid_cell),
            Paragraph("2 pts" if is_teacher_key else "", style_grid_cell),
            Paragraph("<b>/ 10 PUNTOS</b>", style_grid_header)
        ]
    ]

    grid_table = Table(grid_data, colWidths=[76, 50, 50, 50, 50, 50, 185])
    grid_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 1.0, colors.black),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.black),
        ('SPAN', (6, 1), (6, 2)),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 4.0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4.0),
    ]))
    story.append(grid_table)
    story.append(Spacer(1, 14))

    # 4. FIVE PRACTICAL QUESTIONS
    questions = [
        {
            "num": "1",
            "question": "¿Por qué las directrices internacionales (OMS/FAO) y de la cátedra exigen que el agua esté a aproximadamente 70 °C al momento de disolver la fórmula infantil en polvo?",
            "correct": "b",
            "options": [
                ("a", "Porque a esa temperatura se disuelven mejor los carbohidratos y se previene que la preparación tome sabor amargo."),
                ("b", "Porque las fórmulas en polvo no son estériles; el agua a ~70 °C actúa como tratamiento térmico bactericida que inactiva patógenos letales como <i>Cronobacter sakazakii</i> y <i>Salmonella</i>."),
                ("c", "Porque temperaturas menores a 70 °C desnaturalizan las proteínas del suero lácteo e inactivan la lactoferrina agregada."),
                ("d", "Porque a 100 °C se altera la matriz plástica del biberón pero a 70 °C se maximiza la densidad calórica de los lípidos.")
            ]
        },
        {
            "num": "2",
            "question": "Durante el armado del biberón, ¿por qué es mandatorio verter el agua caliente SIEMPRE ANTES que el polvo y qué riesgo pediátrico grave previene?",
            "correct": "b",
            "options": [
                ("a", "Previene que los sólidos se aglutinen en la rosca del biberón e impidan el sellado hermético de la tetina."),
                ("b", "Si se coloca el polvo primero, el volumen ocupado por los sólidos desplaza solvente, generando una fórmula hiperconcentrada con sobrecarga osmolar renal y deshidratación hipernatrémica grave."),
                ("c", "Verter el agua caliente antes permite la solubilización inicial del hierro aumentando su absorción yeyunal."),
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
            "correct": "b",
            "options": [
                ("a", "Permite calcular con precisión milimétrica la ganancia neta de tejido adiposo materno diferenciada del peso fetal y de la placenta."),
                ("b", "Permite formular un diagnóstico nutricional puntual en cualquier consulta prenatal (incluso en captaciones tardías del 2° o 3° trimestre) relacionando IMC materno y edad gestacional sin depender del peso pregestacional de la paciente."),
                ("c", "Reemplaza por completo el cálculo del Valor Calórico Total diario estableciendo incrementos fijos de 500 kcal/día por cada desvío estándar."),
                ("d", "Automatiza la detección de diabetes gestacional y prescribe los gramos de carbohidratos complejos según semanas de amenorrea.")
            ]
        }
    ]

    for i, q in enumerate(questions):
        q_p = Paragraph(f"<b>{q['num']}.</b> {q['question']}", style_q_text)
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

        opt_table = Table(opt_table_data, colWidths=[20, 491])
        opt_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 1.5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 1.5),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ]))
        story.append(opt_table)

        if i < len(questions) - 1:
            story.append(Spacer(1, 12))

    doc.build(story)
    print(f"Build complete: {output_path}")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.abspath(os.path.join(base_dir, "../../"))
    
    # 1. Alumno
    pdf_alumno_sub = os.path.join(base_dir, "evaluacion_practica_1_parcial.pdf")
    pdf_alumno_root = os.path.join(root_dir, "evaluacion_practica_1_parcial.pdf")
    
    generate_bw_exam(pdf_alumno_sub, is_teacher_key=False)
    shutil.copyfile(pdf_alumno_sub, pdf_alumno_root)
    print(f"Copiado a raíz: {pdf_alumno_root}")

    # 2. Clave Docente
    pdf_docente_sub = os.path.join(base_dir, "evaluacion_practica_1_parcial_CLAVE_DOCENTE.pdf")
    pdf_docente_root = os.path.join(root_dir, "evaluacion_practica_1_parcial_CLAVE_DOCENTE.pdf")
    
    generate_bw_exam(pdf_docente_sub, is_teacher_key=True)
    shutil.copyfile(pdf_docente_sub, pdf_docente_root)
    print(f"Copiado a raíz: {pdf_docente_root}")
