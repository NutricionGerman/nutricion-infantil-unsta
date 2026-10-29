import json

with open('students_cache.json', encoding='utf-8') as f:
    students = json.load(f)

names = [
    'Zumaeta', 'Nanteme', 'Genari', 'Lazarte', 'Viana', 'Santos', 'Fernandez Salazar',
    'Lascano', 'Gallardo', 'Ruiz Martinez', 'Villarreal', 'Bazán', 'Argañaraz',
    'Davila', 'Gerez', 'Padilla', 'Cambieri', 'Albano', 'Linares', 'Mercado',
    'Albornoz', 'Leal', 'Ibañez', 'Diaz', 'Navajas', 'Vidal', 'Ferjancic',
    'Salazar', 'Gentile', 'Godoy', 'Gomez', 'Forte', 'Velardez', 'Abraham',
    'Mustafá', 'Giuliano', 'Soria'
]

print(f'Total students in DB: {len(students)}')
for n in names:
    matches = [s for s in students if n.lower() in s['name'].lower()]
    for m in matches:
        print(f"{m['up']}: {m['name']} (Grupo {m['group']}) - Pts comprados: {m['puntosComprados']}")
