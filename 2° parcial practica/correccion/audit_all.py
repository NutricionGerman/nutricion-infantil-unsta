import csv

def audit(csv_p):
    print("Auditing:", csv_p)
    with open(csv_p, encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for r in reader:
            base = int(r['Puntaje Base (/10)'])
            comp_str = r['Puntos Comprados (Tienda)'].replace('+', '').strip()
            comp = int(comp_str) if comp_str != '-' and comp_str != '0' else 0
            final = int(r['Puntaje Total Obtenido (Max 10)'])
            expected = min(10, base + comp)
            if final != expected:
                print(f"MISMATCH in #{r['N°']} {r['Apellido y Nombre']}: Base {base} + Comp {comp} = {expected}, but Final is {final}")

audit(r"2° parcial practica\correccion\resultados_parcial2_practica.csv")
audit(r"2° parcial practica\correccion\tema2\resultados_parcial2_practica_tema2.csv")
