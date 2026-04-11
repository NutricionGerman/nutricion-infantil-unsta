import firebase_admin
from firebase_admin import credentials, firestore

def fix_database():
    try:
        cred = credentials.Certificate('config/serviceAccountKey.json')
        firebase_admin.initialize_app(cred)
        db = firestore.client()

        print("--- Iniciando limpieza de base de datos ---")

        # 1. Limpiar colección de estudiantes
        students_ref = db.collection('students')
        docs = students_ref.stream()
        count = 0
        for doc in docs:
            data = doc.to_dict()
            changed = False
            
            # Limpiar campo 'group'
            if 'group' in data and isinstance(data['group'], str) and data['group'].startswith('g_'):
                data['group'] = data['group'].replace('g_', '')
                changed = True
            
            # Limpiar campo 'grupo' (por si acaso)
            if 'grupo' in data and isinstance(data['grupo'], str) and data['grupo'].startswith('g_'):
                data['grupo'] = data['grupo'].replace('g_', '')
                changed = True

            if changed:
                students_ref.document(doc.id).update({
                    'group': data.get('group', ''),
                    'grupo': data.get('grupo', '')
                })
                count += 1

        print(f"Se corrigieron {count} alumnos en la colección 'students'.")

        # 2. Limpiar app_state/main
        main_ref = db.collection('app_state').document('main')
        main_doc = main_ref.get()
        if main_doc.exists:
            main_data = main_doc.to_dict()
            if 'students' in main_data:
                for student in main_data['students']:
                    if 'group' in student and isinstance(student['group'], str) and student['group'].startswith('g_'):
                        student['group'] = student['group'].replace('g_', '')
                    if 'grupo' in student and isinstance(student['grupo'], str) and student['grupo'].startswith('g_'):
                        student['grupo'] = student['grupo'].replace('g_', '')
                
                main_ref.update({'students': main_data['students']})
                print("Se corrigió el documento central app_state/main.")

        print("--- Limpieza completada con éxito ---")

    except Exception as e:
        print(f"Error durante la limpieza: {e}")

if __name__ == "__main__":
    fix_database()
