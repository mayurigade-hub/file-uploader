const path = require('path');
const fs = require('fs');

const UPLOADS_DIR = path.join(__dirname, 'uploads');
const filename = 'SingleThread_Presentation.pdf';
const uploadId = '5024c08c-385a-4719-a2bf-1977a5f4b16a';

const expectedPath = path.join(UPLOADS_DIR, `${uploadId}-${filename}`);
console.log('Expected path:', expectedPath);
console.log('Exists:', fs.existsSync(expectedPath));

const dirContents = fs.readdirSync(UPLOADS_DIR);
const match = dirContents.find(f => f.includes('SingleThread_Presentation'));
console.log('Found in dir:', match);

