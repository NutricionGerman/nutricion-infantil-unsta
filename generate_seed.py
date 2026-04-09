import json

def generate_seed_html():
    try:
        # Try to find the file in root or Papelera
        import os
        filename = 'respaldo_asistencias (1).json'
        if not os.path.exists(filename):
            filename = os.path.join('Papelera', filename)
        
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading JSON: {e}")
        return

    # Prepare groups data separately for the groups collection (for logos/videos)
    groups = {}
    for student in data.get('students', []):
        group_id = student.get('group')
        if group_id:
            if group_id not in groups:
                groups[group_id] = {
                    "name": f"Grupo {group_id}",
                    "code": f"CODE-{group_id}",
                    "xp": 0,
                    "members": []
                }
            groups[group_id]["xp"] += (student.get('xp') or 0)
            groups[group_id]["members"].append({
                "up": student.get('up'),
                "firstName": student.get('firstName'),
                "lastName": student.get('lastName')
            })

    # Firebase Config
    config = {
        "projectId": "nutricion-gamificada",
        "appId": "1:811386131905:web:130318ef481274efc1cb40",
        "storageBucket": "nutricion-gamificada.firebasestorage.app",
        "apiKey": "AIzaSyBgt8rf4v_gYbNll7qf8ZRwZonge-8Tty0",
        "authDomain": "nutricion-gamificada.firebaseapp.com",
        "messagingSenderId": "811386131905"
    }

    html = f"""
<!DOCTYPE html>
<html>
<head>
    <title>Seed Firestore - V2</title>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>
</head>
<body style="background: #1c1d21; color: white; font-family: sans-serif; padding: 50px; text-align: center;">
    <h1>Subiendo datos a Firebase...</h1>
    <div id="status" style="font-size: 1.2rem; margin: 20px; padding: 20px; border: 1px solid #444; border-radius: 10px; background: #2a2c33;">
        Iniciando proceso...
    </div>
    <div id="progress" style="margin-top: 10px; color: #aaa;"></div>
    
    <script>
        const firebaseConfig = {json.dumps(config)};
        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();

        const groups = {json.dumps(groups, ensure_ascii=False)};
        const fullData = {json.dumps(data, ensure_ascii=False)};

        async function seed() {{
            const status = document.getElementById('status');
            const progress = document.getElementById('progress');
            try {{
                // 1. Subir grupos individuales (para gestión de perfiles)
                for (const groupId in groups) {{
                    progress.innerText = `Subiendo Grupo ${{groupId}}...`;
                    await db.collection('grupos').doc(groupId).set(groups[groupId], {{ merge: true }});
                }}

                // 2. Subir el estado completo de la app (Alumnos, Sesiones, Asistencias)
                status.innerText = "Subiendo base de datos principal (Rankings)...";
                await db.collection('app_state').doc('main').set(fullData);

                status.style.color = "#22c55e";
                status.innerText = '✅ ¡Éxito! Todos los datos han sido migrados.';
                progress.innerText = "Ya puedes cerrar esta ventana y refrescar tu sitio en Netlify.";
            }} catch (error) {{
                status.style.color = "#ef4444";
                status.innerText = '❌ Error: ' + error.message;
                progress.innerText = "Asegúrate de tener conexión a internet y que las reglas de Firestore permitan escritura.";
                console.error(error);
            }}
        }}

        seed();
    </script>
</body>
</html>
"""
    with open('seed.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Generated improved seed.html")

if __name__ == "__main__":
    generate_seed_html()
