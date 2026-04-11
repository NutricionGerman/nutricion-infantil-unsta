# 🚀 Hoja de Ruta - Futuras Mejoras

> ⚠️ **INSTRUCCIÓN PARA EL AGENTE**: Este archivo es de **solo lectura y referencia futura**.
> **NO implementar nada de este documento** a menos que el usuario lo solicite explícitamente en el chat.
> Estas son ideas a largo plazo, no tareas activas.

Este documento contiene sugerencias técnicas y funcionales para escalar la plataforma de Nutrición Infantil UNSTA. **No son tareas pendientes inmediatas**, sino guías para mejorar el sistema a largo plazo.

---

### 1. Modularización del Proyecto (Arquitectura) 🧱
Actualmente, el archivo `index.html` centraliza toda la lógica, estilos y estructura.
- **Sugerencia**: Extraer el CSS a `styles.css` y el JavaScript a archivos según su responsabilidad (ej: `auth.js`, `admin.js`, `kiosco.js`).
- **Por qué**: Facilitará enormemente la edición, reducirá errores accidentales y el navegador trabajará de forma más fluida.

### 2. Fortalecimiento de Seguridad Firestore 🔐
Las reglas de base de datos (`firestore.rules`) son la última línea de defensa.
- **Sugerencia**: Implementar reglas basadas en el "Rol" del usuario o validaciones más estrictas para que solo los miembros de un grupo puedan escribir en su propio documento de la colección `grupos`.
- **Por qué**: Protege la integridad de los datos frente a usuarios malintencionados o errores de otros grupos.

### 3. Dashboard Docente Inteligente 📊
Convertir el panel de administración en una herramienta de seguimiento pedagógico.
- **Sugerencia**: Visualizar métricas simples como "Última actividad del grupo", "Número de recetas guardadas" o "Interacciones con el Kiosco".
- **Por qué**: Permite al docente saber qué grupos están trabajando realmente antes de la corrección final.

### 4. Experiencia Móvil (PWA) 📱
Permitir que la web se comporte como una aplicación nativa.
- **Sugerencia**: Implementar un `manifest.json` y un *Service Worker* básico.
- **Por qué**: Los alumnos podrán instalar la página en su pantalla de inicio, recibir notificaciones y tener un acceso mucho más directo desde sus teléfonos.

### 5. Optimización de Imágenes y Carga ⚡
Reducir el peso de la página inicial.
- **Sugerencia**: Implementar *Lazy Loading* para las imágenes de las recetas y fotos de grupos.
- **Por qué**: Hará que la página principal se sienta instantánea, incluso en conexiones de datos móviles lentas.

---
*Generado por Antigravity el 2026-04-10 para consulta futura.*
