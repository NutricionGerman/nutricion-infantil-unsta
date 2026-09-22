# 🏛️ Cátedra de Nutrición Infantil — UNSTA

> **Universidad**: Universidad del Norte Santo Tomás de Aquino (UNSTA)  
> **Asignatura**: Nutrición Infantil (2° Cuatrimestre)  
> **Docente Titular / A Cargo**: Germán  
> **Docente Administrador Firebase**: Cristian Auad (`cristian.auad@unsta.edu.ar`)

---

## 🎯 Objetivos y Dinámica Pedagógica

La cátedra combina la enseñanza teórica y clínica de la nutrición pediátrica con herramientas tecnológicas interactivas y un sistema de gamificación. Los alumnos aprenden requerimientos nutricionales, evaluación antropométrica, diseño de pautas alimentarias y análisis crítico de productos alimenticios.

---

## 👥 Sistema de Grupos de la Cátedra

- **Cantidad estándar**: Exactamente **18 grupos** oficiales.
- **Formato de identificadores**: Se identifican internamente como `g_1`, `g_2`, ..., `g_18` (y también pueden figurar como `1` al `18`).
- **Sistema de claves de acceso por defecto**:
  - Cada grupo accede con una clave automática `gN` donde `N` es su número de grupo.
  - *Ejemplo*: Grupo 4 accede con la clave `g4`.
- **Excepciones conocidas y documentadas**:
  - **Grupo 17**: Tiene configurada la clave manual `g_17` en la colección `group_keys`.
- **Panel Docente**: La vista administrativa siempre muestra los 18 grupos completos, tengan o no entregas cargadas, permitiendo editar lemas, logos y cambiar claves si un alumno las olvida.

---

## 🎮 Sistema de Gamificación (XP y Rangos)

Para incentivar la asistencia, la participación y el cumplimiento de tareas, la cátedra utiliza un sistema de puntos de experiencia (XP):

### 1. Ganancia de XP
- **Asistencia a clase presencial**: **+2 XP** por clase.
- **Entregas de Trabajos Prácticos (TPs)**: Otorga bonificaciones de XP y desbloquea insignias grupales.
- **Participación y actividades especiales**: Bonificaciones puntuales asignadas por el docente.

### 2. Tienda de Artículos (Shop)
- Los alumnos y grupos pueden canjear sus XP acumulados por beneficios académicos (ej. prórroga de entrega, bonus en TP grupal, comodines).

### 3. Los 23 Rangos de la Cátedra
El sistema escala desde los rangos iniciales de bronce hasta rangos legendarios:
1. Sin Rango (0 XP)
2. Bronce I (10 XP)
3. Bronce II (15 XP)
4. Bronce III (20 XP)
5. Plata I (25 XP)
6. Plata II (30 XP)
7. Plata III (35 XP)
8. Oro I (40 XP)
9. Oro II (45 XP)
10. Oro III (50 XP)
11. Platino I (55 XP)
12. Platino II (60 XP)
13. Diamante I (65 XP)
14. Diamante II (70 XP)
15. Diamante III (75 XP)
16. Maestro (80 XP)
17. Gran Maestro (85 XP)
18. Campeón (90 XP)
19. Leyenda I (95 XP)
20. Leyenda II (100 XP)
21. Leyenda Mítica (105 XP)
22. Leyenda Cósmica (110 XP)
23. Leyenda Supersónica (120 XP)

Cada rango tiene su insignia gráfica correspondiente en la carpeta `iconos/` (ej. `45.png` para Oro I).

---

## 📋 Régimen de Asistencia y Regularidad

- Las asistencias oficiales se toman clase a clase y se guardan como archivos de texto en la carpeta `catedra/asistencias/` (ej: `asistencia 19-08 Evaluacion Antropometrica.txt`, `asistencia 10-09.txt`).
- Estos archivos son la **fuente de verdad indiscutible** para sincronizar con Firestore.
- El panel de control calcula el porcentaje de asistencia de cada alumno respecto al total de clases dictadas para determinar la condición de regularidad.
