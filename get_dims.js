const fs = require('fs');
const buf = fs.readFileSync(process.argv[2]);
if (buf.toString('ascii', 1, 4) === 'PNG') {
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    console.log(`${width}x${height}`);
} else {
    console.log('Not a PNG');
}
