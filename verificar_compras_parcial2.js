// Script para verificar en vivo los alumnos que canjearon puntos para el 2° Parcial Práctico
// Ejecución: node verificar_compras_parcial2.js

async function verificarCompras() {
    try {
        console.log("🔍 Consultando Firebase Firestore (Colección 'students')...\n");
        const res = await fetch('https://firestore.googleapis.com/v1/projects/nutricion-gamificada/databases/(default)/documents/students?pageSize=300');
        const data = await res.json();
        const docs = data.documents || [];

        const compradores = [];

        docs.forEach(doc => {
            const f = doc.fields || {};
            const up = doc.name.split('/').pop();
            const name = f.name?.stringValue || f.nombre?.stringValue || 'Sin nombre';
            const group = f.group?.stringValue || f.group?.integerValue || '-';
            const xp = f.xp?.integerValue || f.xp?.doubleValue || 0;
            const puntosDirectos = Number(f.puntosParcialPractico2?.integerValue || f.puntosParcialPractico2?.doubleValue || 0);
            
            // Buscar en inventario
            const invValues = f.inventory?.arrayValue?.values || [];
            let puntosInv = 0;
            const itemsDetalle = [];

            invValues.forEach(v => {
                const map = v.mapValue?.fields || {};
                const id = map.id?.stringValue || '';
                const cat = map.category?.stringValue || '';
                const itemName = map.name?.stringValue || '';
                const itemPts = Number(map.points?.integerValue || map.points?.doubleValue || 0);
                const purchasedAt = map.purchasedAt?.stringValue || '';

                if (cat === 'parcial_practico' || id.startsWith('item_practico_') || itemName.includes('Parcial Práctico')) {
                    puntosInv += (itemPts || 1);
                    itemsDetalle.push({
                        name: itemName,
                        points: itemPts || 1,
                        date: purchasedAt ? new Date(purchasedAt).toLocaleString('es-AR') : '-'
                    });
                }
            });

            const totalPuntos = Math.max(puntosDirectos, puntosInv);

            // Nota teórica / oral
            let notaTeorica = null;
            if (f.parcial2) {
                notaTeorica = Number(f.parcial2.doubleValue || f.parcial2.integerValue || f.parcial2.stringValue);
            } else if (f.parcial2_teoria) {
                notaTeorica = Number(f.parcial2_teoria.doubleValue || f.parcial2_teoria.integerValue || f.parcial2_teoria.stringValue);
            } else if (f.oralExams?.mapValue?.fields?.average) {
                notaTeorica = Number(f.oralExams.mapValue.fields.average.doubleValue || f.oralExams.mapValue.fields.average.integerValue);
            }

            if (totalPuntos > 0) {
                compradores.push({
                    up,
                    name,
                    group,
                    totalPuntos,
                    notaTeorica: notaTeorica !== null ? notaTeorica.toFixed(1) : 'Sin rendir',
                    xp,
                    itemsDetalle
                });
            }
        });

        console.log("===============================================================================");
        console.log("📊 INFORME EN VIVO: BONIFICACIONES DEL 2° PARCIAL PRÁCTICO (UNSTA)");
        console.log("⏰ Cierre oficial de tienda: Hoy 27/10/2026 a las 23:59:59 (GMT-3)");
        console.log("===============================================================================\n");

        if (compradores.length === 0) {
            console.log("ℹ️  Aún no se han registrado compras de puntos para el 2° Parcial Práctico.");
            console.log("   Los estudiantes tienen habilitado el canje hasta hoy a las 23:59 hs.\n");
        } else {
            console.log(`Total de alumnos con bonificación: ${compradores.length}\n`);
            compradores.forEach((c, idx) => {
                console.log(`${idx + 1}. [UP ${c.up}] ${c.name} (Grupo ${c.group})`);
                console.log(`   🎯 Puntos Prácticos: +${c.totalPuntos} pts | Nota Examen Oral/Teórico: ${c.notaTeorica} | XP Restante: ${c.xp}`);
                if (c.itemsDetalle.length > 0) {
                    console.log(`   📦 Detalle: ${c.itemsDetalle.map(it => `${it.name} (+${it.points}pt el ${it.date})`).join(' | ')}`);
                }
                console.log("-------------------------------------------------------------------------------");
            });
        }
    } catch(err) {
        console.error("Error al consultar Firestore:", err);
    }
}

verificarCompras();
