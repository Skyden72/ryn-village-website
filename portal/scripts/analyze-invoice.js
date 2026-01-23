const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

const filePath = 'f:\\Websites\\Ryn Village\\202512 RV Invoices & Credit notes (1).PDF';

console.log(`Target: "${filePath}"`);

if (!fs.existsSync(filePath)) {
    console.error('ERROR: File does not exist at path!');
    process.exit(1);
}

try {
    const dataBuffer = fs.readFileSync(filePath);
    pdf(dataBuffer).then(function (data) {
        console.log('\n--- PDF TEXT START ---');
        console.log(data.text);
        console.log('--- PDF TEXT END ---\n');
    }).catch(err => {
        console.error('PDF Parse Error:', err);
    });
} catch (e) {
    console.error('File Read Error:', e);
}
