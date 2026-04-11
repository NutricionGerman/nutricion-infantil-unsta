import re

file_path = r'c:\Users\germa\OneDrive\Desktop\ARCHIVOS\UNSTA\pagina nutricion infantil\index.html'

markers = {
    "Styles Start (<style>)": r"<style>",
    "Styles End (</style>)": r"</style>",
    "App Container": r'id="app"',
    "Navbar Navigation": r'<nav class="main-navbar">',
    "Tab Panels Start": r'<!-- 3\. CONTENIDO PRINCIPAL',
    "Section - Ranking": r'id="ranking"',
    "Section - Kiosco": r'id="kiosco"',
    "Section - Clases": r'id="clases"',
    "Section - Portal Alumno": r'id="portal-alumno"',
    "Section - Portal Grupo": r'id="portal-grupo"',
    "Scripts Start (<script>)": r"<script>",
    "Firebase Config": r"const firebaseConfig",
    "Firebase Initialization": r"firebase\.initializeApp",
    "DOMContentLoaded Event": r"DOMContentLoaded",
    "Function - initApp": r"function initApp",
    "Function - loadData": r"function loadData",
    "Function - renderRankings": r"function renderRankings",
    "Function - switchTab": r"function switchTab",
    "Firestore DB Instance": r"const db = firebase\.firestore\(\)"
}

print(f"{'Sección':<35} | {'Línea':<10}")
print("-" * 50)

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()
    for label, pattern in markers.items():
        found = False
        for i, line in enumerate(lines):
            if re.search(pattern, line, re.IGNORECASE):
                print(f"{label:<35} | {i+1:<10}")
                found = True
                break
        if not found:
            print(f"{label:<35} | No encontrado")
