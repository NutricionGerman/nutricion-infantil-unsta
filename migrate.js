const admin = require('firebase-admin');
const fs = require('fs');

admin.initializeApp({
    projectId: 'nutricion-gamificada'
});

const db = admin.firestore();

async function migrate() {
    console.log("Reading backup data...");
    const rawData = fs.readFileSync('scratch/cleaned_main.json', 'utf8');
    const data = JSON.parse(rawData);
    
    // In cleaned_main.json the data is under {"students": {"arrayValue": {"values": [...]}}}
    let studentsArr = [];
    if (data.students && data.students.arrayValue && data.students.arrayValue.values) {
        studentsArr = data.students.arrayValue.values;
    } else {
        console.error("Could not find students array in cleaned_main.json");
        return;
    }

    const batch = db.batch();
    let count = 0;

    for (const s of studentsArr) {
        if (!s.mapValue || !s.mapValue.fields) continue;
        const fields = s.mapValue.fields;
        
        let stuObj = {};
        for(let key in fields) {
            let valObj = fields[key];
            let valType = Object.keys(valObj)[0];
            
            if (valType === 'arrayValue') {
                if (valObj.arrayValue.values) {
                     stuObj[key] = valObj.arrayValue.values.map(v => {
                         let innerFields = v.mapValue.fields;
                         let obj = {};
                         for(let ik in innerFields) {
                             let ivObj = innerFields[ik];
                             let ivType = Object.keys(ivObj)[0];
                             let iv = ivObj[ivType];
                             if (ivType === 'integerValue') obj[ik] = parseInt(iv);
                             else if (ivType === 'doubleValue') obj[ik] = parseFloat(iv);
                             else if (ivType === 'nullValue') obj[ik] = null;
                             else obj[ik] = iv;
                         }
                         return obj;
                     });
                } else {
                     stuObj[key] = [];
                }
            } else if (valType === 'integerValue') {
                stuObj[key] = parseInt(valObj[valType]);
            } else if (valType === 'doubleValue') {
                stuObj[key] = parseFloat(valObj[valType]);
            } else if (valType === 'nullValue') {
                stuObj[key] = null;
            } else {
                stuObj[key] = valObj[valType];
            }
        }
        
        // Normalize custom properties
        if(stuObj.nombre) { stuObj.firstName = stuObj.nombre; delete stuObj.nombre; }
        if(stuObj.apellido) { stuObj.lastName = stuObj.apellido; delete stuObj.apellido; }
        if(stuObj.grupo) { delete stuObj.grupo; } // The real field should be 'group'

        // Fix group format to be g_X
        if (stuObj.group !== null && stuObj.group !== undefined && stuObj.group !== "") {
            let grpStr = String(stuObj.group);
            if (!grpStr.startsWith('g_')) {
                stuObj.group = 'g_' + grpStr;
            }
        } else {
            stuObj.group = 'g_0'; // fallback
        }

        if (!stuObj.up) {
            console.log("Skipping student without UP: ", stuObj);
            continue;
        }

        const ref = db.collection('students').doc(String(stuObj.up));
        batch.set(ref, stuObj);
        count++;
    }

    console.log(`Committing ${count} students to Firestore...`);
    await batch.commit();
    console.log(`✅ Successfully migrated ${count} students to the 'students' collection!`);

    console.log("Deleting old 'students' field from app_state/main ...");
    const mainRef = db.collection('app_state').doc('main');
    try {
        await mainRef.update({
            students: admin.firestore.FieldValue.delete()
        });
        console.log("✅ Successfully cleaned up app_state/main.");
    } catch(e) {
        console.log("⚠️ Could not delete 'students' from app_state/main. It might already be missing or permissions blocked it. Error: " + e.message);
    }
}

migrate()
    .then(() => {
        console.log("Migration complete.");
        process.exit(0);
    })
    .catch(err => {
        console.error("Migration failed:", err);
        process.exit(1);
    });
