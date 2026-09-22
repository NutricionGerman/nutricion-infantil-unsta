# 🎓 Skill: Creación y Publicación de una Nueva Clase

> **Objetivo**: Estructurar, registrar y publicar una nueva clase interactiva en el portal de Nutrición Infantil, asegurando la notificación automática a los dispositivos de los alumnos mediante el sistema de versiones.

---

## 📂 Estructura de Archivos de una Clase

Cada nueva clase puede contener material bibliográfico, diapositivas o una actividad interactiva:
```text
clases/
├── clase_XX_nombre_DD_MM/       ← Carpeta autocontenida por clase
│   ├── index.html               ← Interfaz didáctica o visor de la clase
│   ├── img/                     ← Imágenes y esquemas de la clase
│   ├── videos/                  ← Videos demostrativos (mp4)
│   ├── docs/                    ← Manuales o PDFs de lectura
│   ├── herramientas/            ← Calculadoras o herramientas interactivas
│   └── asistencia/              ← 📲 Formulario de asistencia y registro en vivo
│       ├── index.html           ← Formulario de toma de lista / registro
│       └── app.js               ← Lógica de validación y conexión
```

---

## 🔄 Protocolo Paso a Paso

### Paso 1: Preparación del Contenido
1. Crear la carpeta en `clases/clase_DD_MM/`.
2. Si la clase incluye archivos PDF, colocarlos en `bibliografia/clases/` o dentro de la carpeta de la clase.
3. Si la clase incluye un interactivo (HTML/JS), asegurar que sea responsivo (óptimo para celulares) y que use la misma estética oscura/médica del portal.

### Paso 2: Registro en Firestore (`app_state/main`)
Para que la clase aparezca en la lista del `#panel-clases`:
1. Abrir el documento `app_state/main` en Firestore.
2. Añadir un objeto al arreglo `sessions`:
   ```json
   {
     "id": "clase_DD_MM",
     "numero": N,
     "fecha": "AAAA-MM-DD",
     "titulo": "Título Pedagógico de la Clase",
     "descripcion": "Breve resumen de los contenidos abordados.",
     "enlace": "clases/clase_DD_MM/index.html",
     "habilitada": true
   }
   ```

### Paso 3: Activación del Banner de Nueva Versión (`version.json`)
El sitio cuenta con un detector automático que avisa a los alumnos en sus celulares cuando hay material nuevo sin que tengan que adivinar:
1. Abrir el archivo `version.json` en la raíz del proyecto.
2. Actualizar la fecha y hora con el timestamp actual:
   ```json
   {
     "version": "2026.09.22-clase-X",
     "updated_at": "2026-09-22T11:45:00-03:00",
     "message": "¡Nueva clase disponible en el portal!"
   }
   ```
3. Esto hará que todos los alumnos que tengan la página abierta vean el banner ámbar animado con el botón *"Actualizar ahora"*.

### Paso 4: Deploy y Commit
1. Ejecutar el commit estandarizado:
   ```bash
   git add clases/ version.json
   git commit -m "Feat(clases): Alta de Clase N - [Título de la Clase]"
   git push origin master
   ```
2. Verificar en el portal en vivo que la tarjeta de la clase aparezca correctamente renderizada en `#panel-clases`.
