import json
import re

input_path = r'C:/Users/germa/.gemini/antigravity/brain/b1423293-3feb-4485-9d28-daffcfff317c/.system_generated/steps/5989/output.txt'
output_path = 'scratch/fixed_state.json'

with open(input_path, 'r', encoding='utf-8') as f:
    data = f.read()

# Buscamos patrones como "stringValue": "g_11" y los cambiamos a "stringValue": "11"
fixed = re.sub(r'\"stringValue\":\s*\"g_([0-9]+)\"', r'"stringValue": "\1"', data)

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(fixed)

print("Archivo central procesado y limpiado localmente.")
