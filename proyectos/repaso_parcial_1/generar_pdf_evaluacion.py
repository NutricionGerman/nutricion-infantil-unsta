import os
import sys
import shutil

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, Image as RLImage
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def generate_evaluacion_pdf(output_path, is_teacher_key=False):
    # Strict A4 single sheet (1 carilla = exactamente 1 página)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=32,
        rightMargin=32,
        topMargin=26,
        bottomMargin=26
    )

    styles = getSampleStyleSheet()

    # Custom typography
    style_student_field = ParagraphStyle(
        'StudentField',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.3,
        leading=11.5,
        textColor=colors.HexColor('#1e293b')
    )

    style_inst = ParagraphStyle(
        'InstructionText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.0,
        leading=10.8,
        textColor=colors.HexColor('#1e3a8a') if not is_teacher_key else colors.HexColor('#065f46')
    )

    style_q_text = ParagraphStyle(
        'QText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.6,
        leading=11.5,
        textColor=colors.HexColor('#0f172a')
    )

    style_opt_letter = ParagraphStyle(
        'OptLetter',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.2,
        leading=11.0,
        textColor=colors.HexColor('#1e293b'),
        alignment=TA_CENTER
    )

    style_opt_text = ParagraphStyle(
        'OptText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.1,
        leading=10.8,
        textColor=colors.HexColor('#1e293b')
    )

    style_opt_text_correct = ParagraphStyle(
        'OptTextCorrect',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.1,
        leading=10.8,
        textColor=colors.HexColor('#065f46')
    )

    style_grid_th = ParagraphStyle(
        'GridTH',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.8,
        leading=10.0,
        textColor=colors.HexColor('#1e3a8a'),
        alignment=TA_CENTER
    )

    style_grid_td = ParagraphStyle(
        'GridTD',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.0,
        leading=10.0,
        alignment=TA_CENTER
    )

    style_grid_td_correct = ParagraphStyle(
        'GridTDCorrect',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=10.5,
        textColor=colors.HexColor('#047857'),
        alignment=TA_CENTER
    )

    style_footer = ParagraphStyle(
        'FooterText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.0,
        leading=9.0,
        textColor=colors.HexColor('#64748b'),
        alignment=TA_CENTER
    )

    story = []

    # 1. HEADER TABLE (With Logo)
    logo_path = "iconos/logo.png"
    if not os.path.exists(logo_path):
        logo_path = os.path.join(os.path.dirname(__file__), "../../iconos/logo.png")

    logo_img = RLImage(logo_path, width=32, height=30) if os.path.exists(logo_path) else Paragraph("🎓", styles['Normal'])

    badge_title = "EVALUACIÓN PRÁCTICA" if not is_teacher_key else "CLAVE DE CORRECCIÓN DOCENTE"
    badge_color = "#1e3a8a" if not is_teacher_key else "#047857"
    subbadge_text = "1° PARCIAL · PROTOCOLOS CLÍNICOS" if not is_teacher_key else "PAUTA OFICIAL DE EVALUACIÓN"
    subbadge_color = "#b45309" if not is_teacher_key else "#065f46"

    header_data = [
        [
            logo_img,
            Paragraph("""<b>UNIVERSIDAD DEL NORTE SANTO TOMÁS DE AQUINO (UNSTA)</b><br/>
            <font size="7.8" color="#475569">Facultad de Ciencias de la Salud · Licenciatura en Nutrición · Ciclo Lectivo 2026<br/>
            <b>Cátedra de Nutrición Infantil</b> · Docente a cargo: Lic. Germán</font>""", styles['Normal']),
            Paragraph(f"""<div align="right">
            <b><font size="9.8" color="{badge_color}">{badge_title}</font></b><br/>
            <b><font size="8.0" color="{subbadge_color}">{subbadge_text}</font></b><br/>
            <font size="7.0" color="#64748b">Banco Oficial de Talleres de la Plataforma</font>
            </div>""", styles['Normal'])
        ]
    ]

    header_table = Table(header_data, colWidths=[38, 320, 173])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 4))

    # 2. STUDENT DATA BOX
    student_box_data = [
        [
            Paragraph("<b>Estudiante:</b> ____________________________________________________", style_student_field),
            Paragraph("<b>Legajo / DNI:</b> ____________________", style_student_field)
        ],
        [
            Paragraph("<b>Comisión / Grupo:</b> ________________________   <b>Fecha:</b> _____ / _____ / 2026", style_student_field),
            Paragraph("<b>Calificación Final:</b> ________ / <b>10 pts</b>", ParagraphStyle('S4', fontName='Helvetica-Bold', fontSize=8.6, leading=11.5, textColor=colors.HexColor('#0f172a')))
        ]
    ]

    student_table = Table(student_box_data, colWidths=[355, 176])
    student_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.75, colors.HexColor('#94a3b8')),
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('TOPPADDING', (0, 0), (-1, -1), 4.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.HexColor('#f1f5f9'))
    ]))
    story.append(student_table)
    story.append(Spacer(1, 4))

    # 3. INSTRUCTION BANNER
    if not is_teacher_key:
        inst_text = "<b>CONSIGNAS DE EVALUACIÓN:</b> Marque con una cruz <b>[ X ]</b> la única opción correcta en cada ítem y vuelque su selección en la grilla inferior de control. Cada consigna respondida correctamente equivale a <b>2.0 puntos</b> (Puntaje Máximo: 10 puntos)."
        banner_bg = '#eff6ff'
        banner_border = '#93c5fd'
    else:
        inst_text = "<b>PAUTA DE CORRECCIÓN:</b> Respuestas correctas marcadas en verde con [ X ] y fundamentación técnica para el docente evaluador. Cada acierto: <b>2.0 puntos</b> (Puntaje Total: 10 puntos)."
        banner_bg = '#ecfdf5'
        banner_border = '#6ee7b7'

    inst_data = [[Paragraph(inst_text, style_inst)]]
    inst_table = Table(inst_data, colWidths=[531])
    inst_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor(banner_border)),
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor(banner_bg)),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(inst_table)
    story.append(Spacer(1, 5))

    # 4. FIVE PRACTICAL QUESTIONS
    questions_data = [
        {
            "num": "1",
            "tag": "Taller de Preparación de Biberones · Seguridad Microbiológica",
            "correct": "B",
            "question": "¿Por qué las directrices internacionales (OMS/FAO) y de la cátedra exigen que el agua esté a aproximadamente 70 °C al momento de disolver la fórmula infantil en polvo?",
            "options": [
                ("A", "Porque a esa temperatura se disuelven mejor los carbohidratos y se previene que la preparación desarrolle sabor amargo."),
                ("B", "Porque las fórmulas en polvo no son estériles; el agua a ~70 °C actúa como tratamiento térmico bactericida que inactiva patógenos oportunistas letales como <i>Cronobacter sakazakii</i> y <i>Salmonella</i>."),
                ("C", "Porque temperaturas inferiores a 70 °C desnaturalizan las proteínas del suero lácteo e inactivan la biodisponibilidad de la lactoferrina agregada."),
                ("D", "Porque a 100 °C se altera la matriz plástica del biberón pero a 70 °C se maximiza la densidad calórica de las grasas lácteas.")
            ]
        },
        {
            "num": "2",
            "tag": "Taller de Preparación de Biberones · Osmolaridad y Fisiología Renal",
            "correct": "B",
            "question": "Durante el armado del biberón, ¿por qué es mandatorio verter el agua caliente SIEMPRE ANTES que el polvo y qué riesgo pediátrico grave previene?",
            "options": [
                ("A", "Previene que los sólidos se aglutinen en la rosca del biberón e impidan el sellado hermético de la tetina de silicona."),
                ("B", "Si se coloca el polvo primero, el volumen ocupado por los sólidos desplaza solvente, generando una fórmula hiperconcentrada que expone al lactante a sobrecarga osmolar renal y deshidratación hipernatrémica grave."),
                ("C", "Verter el agua caliente antes permite la solubilización inicial del hierro iónico aumentando su coeficiente de absorción yeyunal."),
                ("D", "Evita que el agua a 70 °C hidrolice anticipadamente las micelas de caseína provocando meteorismo por sobrecarga de lactosa.")
            ]
        },
        {
            "num": "3",
            "tag": "Taller de Fórmulas Infantiles · Dosificación y Dilución Reglamentaria",
            "correct": "C",
            "question": "Respecto a la técnica reglamentaria de dosificación y enrase del polvo: ¿Cuál es el procedimiento estandarizado y la relación de dilución establecida?",
            "options": [
                ("A", "Llenar la medida provista, compactar firmemente con el pulgar contra la lata y disolver a razón de 2 medidas por cada 50 ml de agua potable."),
                ("B", "Llenar el cacito en forma colmada y diluir 1 medida por cada 60 ml de agua para facilitar el vaciamiento gástrico en lactantes sanos."),
                ("C", "Llenar la cuchara medidora de la lata sin presionar ni apisonar, enrasar al ras con el reborde nivelador o el lomo de un cuchillo limpio, respetando la relación de 1 medida al ras cada 30 ml de agua potable."),
                ("D", "Pesar el polvo en balanza de cocina a razón de exactamente 15 g de polvo disueltos en 50 ml de agua a temperatura ambiente.")
            ]
        },
        {
            "num": "4",
            "tag": "Taller de Preparación de Biberones · Técnica de Homogeneización",
            "correct": "C",
            "question": "¿Por qué está expresamente contraindicado agitar la mamadera verticalmente con fuerza ('estilo coctelera') y cuál es la técnica indicada de reconstitución?",
            "options": [
                ("A", "Porque la agitación vigorosa descalibra la válvula anticólicos de silicona; debe homogeneizarse agitando exclusivamente con varilla estéril."),
                ("B", "Porque el batido vertical desnaturaliza los ácidos grasos poliinsaturados precipitando como cristales lipídicos insolubles."),
                ("C", "Porque la agitación vigorosa incorpora abundante aire en forma de microburbujas y espuma que provocan aerofagia severa, distensión y cólicos; debe mezclarse haciendo rodar suavemente el biberón entre las palmas de las manos."),
                ("D", "Porque la agitación vigorosa incrementa la presión hidrostática dentro del envase expulsando componentes termolábiles de la fórmula.")
            ]
        },
        {
            "num": "5",
            "tag": "Taller de Evaluación Antropométrica Gestacional · Curvas de Calvo et al. (2009)",
            "correct": "B",
            "question": "¿Cuál es la principal ventaja clínica de la Gráfica de Calvo et al. (2009) para el nutricionista durante la consulta prenatal?",
            "options": [
                ("A", "Permite calcular con precisión milimétrica la ganancia neta de tejido adiposo materno diferenciada del peso fetal y de la placenta."),
                ("B", "Permite formular un diagnóstico nutricional puntual en cualquier consulta prenatal (incluso en captaciones tardías del 2° o 3° trimestre) relacionando IMC materno y edad gestacional sin depender del peso pregestacional de la paciente."),
                ("C", "Reemplaza por completo el cálculo del Valor Calórico Total diario estableciendo incrementos fijos de 500 kcal/día por cada desvío estándar."),
                ("D", "Automatiza la detección de diabetes gestacional y prescribe los gramos de carbohidratos complejos según semanas de amenorrea.")
            ]
        }
    ]

    for i, q in enumerate(questions_data):
        q_header = Paragraph(f"<b>{q['num']}. <font color='#1e3a8a'>[{q['tag']}]</font></b> {q['question']}", style_q_text)
        
        opt_rows = []
        for opt_letter, opt_text in q["options"]:
            is_correct = (opt_letter == q["correct"])
            if is_teacher_key and is_correct:
                box_cell = Paragraph(f"<b><font color='#047857'>[ X ] {opt_letter})</font></b>", ParagraphStyle('OLC', parent=style_opt_letter, textColor=colors.HexColor('#047857')))
                text_cell = Paragraph(f"<b><font color='#065f46'>{opt_text} (CORRECTA)</font></b>", style_opt_text_correct)
            else:
                box_cell = Paragraph(f"<b>[&nbsp;&nbsp;] {opt_letter})</b>", style_opt_letter)
                text_cell = Paragraph(opt_text, style_opt_text)
            opt_rows.append([box_cell, text_cell])

        opt_table = Table(opt_rows, colWidths=[38, 487])
        opt_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 1.8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 1.8),
            ('LEFTPADDING', (0, 0), (-1, -1), 1),
            ('RIGHTPADDING', (0, 0), (-1, -1), 2),
        ]))

        q_container_data = [
            [q_header],
            [opt_table]
        ]
        q_container_table = Table(q_container_data, colWidths=[531])
        q_container_table.setStyle(TableStyle([
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f8fafc')),
            ('TOPPADDING', (0, 0), (-1, -1), 2.8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 2.8),
            ('LEFTPADDING', (0, 0), (-1, -1), 5),
            ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ]))

        story.append(q_container_table)
        if i < len(questions_data) - 1:
            story.append(Spacer(1, 5.0))

    # 5. ANSWER GRID & SIGNATURES SECTION
    story.append(Spacer(1, 5.0))
    
    ans1 = Paragraph("<b>B</b>", style_grid_td_correct) if is_teacher_key else Paragraph("", style_grid_td)
    ans2 = Paragraph("<b>B</b>", style_grid_td_correct) if is_teacher_key else Paragraph("", style_grid_td)
    ans3 = Paragraph("<b>C</b>", style_grid_td_correct) if is_teacher_key else Paragraph("", style_grid_td)
    ans4 = Paragraph("<b>C</b>", style_grid_td_correct) if is_teacher_key else Paragraph("", style_grid_td)
    ans5 = Paragraph("<b>B</b>", style_grid_td_correct) if is_teacher_key else Paragraph("", style_grid_td)

    grid_data = [
        [
            Paragraph("<b>Pregunta</b>", style_grid_th),
            Paragraph("<b>1</b>", style_grid_th),
            Paragraph("<b>2</b>", style_grid_th),
            Paragraph("<b>3</b>", style_grid_th),
            Paragraph("<b>4</b>", style_grid_th),
            Paragraph("<b>5</b>", style_grid_th),
            Paragraph("<b>Firma del Estudiante:</b> ___________________________", ParagraphStyle('F1', fontName='Helvetica', fontSize=7.4, leading=9.5)),
            Paragraph("<b>Firma Docente:</b> ___________________________", ParagraphStyle('F2', fontName='Helvetica', fontSize=7.4, leading=9.5))
        ],
        [
            Paragraph("<b>Opción</b>", style_grid_td),
            ans1, ans2, ans3, ans4, ans5,
            Paragraph("<font size='6.8' color='#64748b'>Aclaración: _________________________________</font>", styles['Normal']),
            Paragraph("<font size='6.8' color='#64748b'>Puntaje Total Obtenido: _______ / 10 pts</font>", styles['Normal'])
        ]
    ]

    grid_table = Table(grid_data, colWidths=[55, 26, 26, 26, 26, 26, 173, 173])
    grid_table.setStyle(TableStyle([
        ('BOX', (0, 0), (5, -1), 0.75, colors.HexColor('#94a3b8')),
        ('INNERGRID', (0, 0), (5, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('BACKGROUND', (0, 0), (5, 0), colors.HexColor('#f1f5f9')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 3.0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.0),
        ('LEFTPADDING', (6, 0), (-1, -1), 6),
        ('RIGHTPADDING', (6, 0), (-1, -1), 4),
    ]))
    story.append(grid_table)

    # 6. FOOTER
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cbd5e1'), spaceBefore=1, spaceAfter=2))
    story.append(Paragraph("<b>Cátedra de Nutrición Infantil — Universidad del Norte Santo Tomás de Aquino (UNSTA)</b> · Evaluación Práctica de Taller · <i>Documento Oficial de Examen · Hoja Única (Carilla 1 de 1)</i>", style_footer))

    doc.build(story)
    print(f"Build complete: {output_path}")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.abspath(os.path.join(base_dir, "../../"))
    
    # 1. Alumno
    pdf_alumno_sub = os.path.join(base_dir, "evaluacion_practica_1_parcial.pdf")
    pdf_alumno_root = os.path.join(root_dir, "evaluacion_practica_1_parcial.pdf")
    
    generate_evaluacion_pdf(pdf_alumno_sub, is_teacher_key=False)
    shutil.copyfile(pdf_alumno_sub, pdf_alumno_root)
    print(f"Copiado a raíz: {pdf_alumno_root}")

    # 2. Clave Docente
    pdf_docente_sub = os.path.join(base_dir, "evaluacion_practica_1_parcial_CLAVE_DOCENTE.pdf")
    pdf_docente_root = os.path.join(root_dir, "evaluacion_practica_1_parcial_CLAVE_DOCENTE.pdf")
    
    generate_evaluacion_pdf(pdf_docente_sub, is_teacher_key=True)
    shutil.copyfile(pdf_docente_sub, pdf_docente_root)
    print(f"Copiado a raíz: {pdf_docente_root}")
