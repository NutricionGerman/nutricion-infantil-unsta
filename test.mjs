import fs from 'fs';

async function testFetch() {
    const url = `https://firestore.googleapis.com/v1/projects/nutricion-gamificada/databases/(default)/documents/students?pageSize=1`;
    try {
        const resp = await fetch(url);
        const data = await resp.json();
        fs.writeFileSync('scratch/test.json', JSON.stringify(data, null, 2));
        console.log("Written to scratch/test.json");
    } catch (err) {
        console.error(err);
    }
}
testFetch().then(() => process.exit(0));
