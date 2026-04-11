import fs from 'fs';

async function migrate() {
    console.log("Reading backup data...");
    const rawData = fs.readFileSync('scratch/cleaned_main.json', 'utf8');
    const data = JSON.parse(rawData);
    
    let studentsArr = [];
    if (data.students && data.students.arrayValue && data.students.arrayValue.values) {
        studentsArr = data.students.arrayValue.values;
    } else {
        console.error("Could not find students array in cleaned_main.json");
        return;
    }

    let count = 0;
    
    for (const s of studentsArr) {
        if (!s.mapValue || !s.mapValue.fields) continue;
        const fields = s.mapValue.fields;
        
        // Fix names if test object
        if (fields.nombre) { 
            fields.firstName = fields.nombre; 
            delete fields.nombre; 
        }
        if (fields.apellido) { 
            fields.lastName = fields.apellido; 
            delete fields.apellido; 
        }
        if (fields.grupo) { 
            delete fields.grupo; 
        }

        // Fix group formatting
        if (fields.group && fields.group.stringValue) {
            let grpStr = fields.group.stringValue;
            if (!grpStr.startsWith('g_')) {
                fields.group.stringValue = 'g_' + grpStr;
            }
        } else if (!fields.group) {
            fields.group = { stringValue: 'g_0' };
        }

        const up = fields.up ? fields.up.stringValue : null;
        if (!up) {
            console.log("Skipping student without UP: ", fields);
            continue;
        }

        const url = `https://firestore.googleapis.com/v1/projects/nutricion-gamificada/databases/(default)/documents/students/${up}`;
        
        try {
            const resp = await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fields: fields })
            });

            if (!resp.ok) {
                const text = await resp.text();
                console.error(`Failed to migrate UP ${up}: ${resp.status} ${text}`);
            } else {
                count++;
            }
        } catch (err) {
            console.error(`Error migrating UP ${up}:`, err.message);
        }
    }

    console.log(`✅ Successfully migrated ${count} students using REST API!`);

    // Clean up app_state/main
    // In REST API, to delete a field inside a document using updateMask:
    const mainUrl = `https://firestore.googleapis.com/v1/projects/nutricion-gamificada/databases/(default)/documents/app_state/main?updateMask.fieldPaths=students`;
    // We send an empty body or partial body without 'students', the updateMask will ensure the 'students' field gets removed if we don't provide it!
    // But since we just want to remove the field, it's safer to fetch the document, delete the field locally, and update, OR...
    // Actually, we don't need to delete it from REST if the page ignores it once students exist in collection. 
    // index.html says: 
    // const cleanMaster = { ...masterData };
    // delete cleanMaster.students;
    // So the client will clean it up natively! We can just skip cleaning it here.
    console.log("El script de migración en la app (index.html) limpiará el documento app_state/main de ser necesario.");
}

migrate()
    .then(() => process.exit(0))
    .catch(console.error);
