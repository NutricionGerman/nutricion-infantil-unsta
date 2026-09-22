# 📜 Bitácora de Decisiones Arquitectónicas

Registro breve de decisiones técnicas del sistema para evitar romper configuraciones en sesiones futuras.

---

1. **Clave de acceso del Grupo 17**:
   - Tiene asignada la clave manual `g_17` en la colección `group_keys` (no cambiarla a `g17`).
   - El sistema busca grupos tanto por ID numérico (`"4"`) como con prefijo (`"g_4"`).

2. **Colección `students` en Firestore**:
   - Cada alumno tiene como clave de documento su número de **UP (DNI)**.
   - Se migró a su propia colección para evitar saturar el tamaño máximo de `app_state/main`.

3. **Notificación de nueva versión**:
   - Al modificar el portal central (`index.html`), se actualiza la fecha en `version.json` para que los alumnos reciban el banner de actualización en sus teléfonos.

4. **Estructura modular y autocontenida de clases (`clases/`)**:
   - Cada clase reside en su propia subcarpeta dedicada (`clase_01_antropometria_19_08/`, `clase_02_antropometria_26_08/`, `clase_03_duelo_alimentos/`, etc.) con sus propios archivos, imágenes (`img/`), videos (`videos/`), herramientas y PDFs.
   - En la raíz de `clases/` se conservan archivos HTML de redirección rápida y la carpeta `herramientas/` para mantener compatibilidad absoluta con tarjetas o marcadores previos sin que nada se rompa.
