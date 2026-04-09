const admin = require('firebase-admin');
const fs = require('fs');

// Initialize with application default credentials
admin.initializeApp({
    projectId: 'nutricion-gamificada'
});

const db = admin.firestore();

async function importData() {
    const data = JSON.parse(fs.readFileSync('respaldo_asistencias (1).json', 'utf8'));
    const groups = {};

    data.students.forEach(student => {
        if (student.group) {
            if (!groups[student.group]) {
                groups[student.group] = {
                    name: `Grupo ${student.group}`,
                    code: `CODE-${student.group}`, // Initial dummy code
                    xp: 0,
                    members: []
                };
            }
            groups[student.group].xp += (student.xp || 0);
            groups[student.group].members.push({
                up: student.up,
                firstName: student.firstName,
                lastName: student.lastName
            });
        }
    });

    const batch = db.batch();
    for (const groupId in groups) {
        const groupRef = db.collection('grupos').doc(groupId);
        batch.set(groupRef, groups[groupId]);
    }

    await batch.commit();
    console.log('Successfully imported groups to Firestore');
}

importData().catch(console.error);
