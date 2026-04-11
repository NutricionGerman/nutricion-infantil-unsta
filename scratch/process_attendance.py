import json
import re

# File paths
attendance_file = r'c:\Users\germa\OneDrive\Desktop\ARCHIVOS\UNSTA\pagina nutricion infantil\asistencias\asistencia clase 1.txt'
app_state_file = r'C:\Users\germa\.gemini\antigravity\brain\b1423293-3feb-4485-9d28-daffcfff317c\.system_generated\steps\5512\output.txt'

# Constants
SESSION_ID = "sess_1775863780415"
SESSION_NAME = "CLASE 1"
XP_REWARD = 2

# Helper to normalize UP
def normalize_up(raw_up):
    # Remove all non-digits
    digits = re.sub(r'\D', '', raw_up)
    return digits

# 1. Read attendance file
ups_to_add = []
with open(attendance_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for line in lines[1:]: # Skip header
        parts = line.split('\t')
        if len(parts) >= 2:
            up = normalize_up(parts[1])
            if up:
                ups_to_add.append(up)

print(f"Total UPs found in file: {len(ups_to_add)}")

# 2. Read current app_state
with open(app_state_file, 'r', encoding='utf-8') as f:
    app_state = json.load(f)

# Helper for Firestore JSON structure
def get_val(field):
    if 'stringValue' in field: return field['stringValue']
    if 'integerValue' in field: return int(field['integerValue'])
    if 'booleanValue' in field: return field['booleanValue']
    if 'arrayValue' in field: return field['arrayValue'].get('values', [])
    if 'mapValue' in field: return field['mapValue'].get('fields', {})
    if 'nullValue' in field: return None
    return field

def set_val(val):
    if isinstance(val, bool): return {'booleanValue': val}
    if isinstance(val, int): return {'integerValue': str(val)}
    if isinstance(val, str): return {'stringValue': val}
    if isinstance(val, list): return {'arrayValue': {'values': [set_val(v) for v in val]}}
    if isinstance(val, dict): return {'mapValue': {'fields': {k: set_val(v) for k, v in val.items()}}}
    return {'nullValue': None}

fields = app_state['fields']
attendance_records = fields['attendanceRecords']['arrayValue'].get('values', [])
students = fields['students']['arrayValue'].get('values', [])

# Map of existing attendance to avoid duplicates
existing_attendance = set()
for rec in attendance_records:
    r_fields = rec['mapValue']['fields']
    if r_fields.get('sessionId', {}).get('stringValue') == SESSION_ID:
        existing_attendance.add(r_fields.get('up', {}).get('stringValue'))

# Update internal structures
timestamp = "2026-04-11T12:00:00Z" # Using a generic timestamp
ok_count = 0
updated_students = []

for up in ups_to_add:
    if up not in existing_attendance:
        # Add to attendanceRecords
        attendance_records.append({
            'mapValue': {
                'fields': {
                    'sessionId': {'stringValue': SESSION_ID},
                    'up': {'stringValue': up},
                    'status': {'stringValue': 'onTime'},
                    'timestamp': {'stringValue': timestamp}
                }
            }
        })
        
        # Update student in app_state
        for s in students:
            s_fields = s['mapValue']['fields']
            if s_fields.get('up', {}).get('stringValue') == up:
                # Update XP
                current_xp = int(s_fields.get('xp', {}).get('integerValue', '0'))
                s_fields['xp'] = {'integerValue': str(current_xp + XP_REWARD)}
                
                # Update xpHistory
                history = s_fields.get('xpHistory', {}).get('arrayValue', {}).get('values', [])
                history.append({
                    'mapValue': {
                        'fields': {
                            'timestamp': {'stringValue': timestamp},
                            'amount': {'integerValue': str(XP_REWARD)},
                            'reason': {'stringValue': f"Asistencia: {SESSION_NAME}"},
                            'sessionId': {'stringValue': SESSION_ID}
                        }
                    }
                })
                s_fields['xpHistory'] = {'arrayValue': {'values': history}}
                updated_students.append(up)
                ok_count += 1
                break

fields['attendanceRecords']['arrayValue']['values'] = attendance_records
fields['students']['arrayValue']['values'] = students

# 3. Save modified app_state
output_app_state = r'c:\Users\germa\OneDrive\Desktop\ARCHIVOS\UNSTA\pagina nutricion infantil\scratch\updated_app_state.json'
with open(output_app_state, 'w', encoding='utf-8') as f:
    json.dump(app_state, f, indent=2)

print(f"Successfully processed {ok_count} new attendances.")
print(f"Students updated: {updated_students}")
