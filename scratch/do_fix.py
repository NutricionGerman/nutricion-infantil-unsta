import json
import re

input_path = r'C:/Users/germa/.gemini/antigravity/brain/b1423293-3feb-4485-9d28-daffcfff317c/.system_generated/steps/6095/output.txt'
output_path = r'c:\Users\germa\OneDrive\Desktop\ARCHIVOS\UNSTA\pagina nutricion infantil\scratch\cleaned_main.json'

try:
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Limpiar todos los g_ en los stringValue
    json_str = json.dumps(data['fields'])
    cleaned_str = re.sub(r'\"stringValue\":\s*\"g_([0-9]+)\"', r'"stringValue": "\1"', json_str)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(cleaned_str)
    
    print("SUCCESS")
except Exception as e:
    print(f"ERROR: {e}")
