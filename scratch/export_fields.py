import json

path = r'c:\Users\germa\OneDrive\Desktop\ARCHIVOS\UNSTA\pagina nutricion infantil\scratch\updated_app_state.json'
out_path = r'c:\Users\germa\OneDrive\Desktop\ARCHIVOS\UNSTA\pagina nutricion infantil\scratch\fields_only.json'

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(data['fields'], f, indent=2)
