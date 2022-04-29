const zlib = require('zlib');
const fs = require('fs');
const process = require('process');
const writeIfDifferent = require('./utils').writeIfDifferent;

if (process.argv.length !== 6) {
    console.error('bad argument');
    console.error(' - input file');
    console.error(' - export var');
    console.error(' - template file');
    console.error(' - output file');
    process.exit(-1);
}

const inputFile = process.argv[2];
const exportVar = process.argv[3];
const template = process.argv[4];
const outputFile = process.argv[5];

let data = require(inputFile)[exportVar];

let encoded = zlib.gzipSync(JSON.stringify(data, null, 2)).toString("base64");
let array = [];
let start = 0, last = encoded.length;
const charPerRow = 118;
while (start < last) {
    array.push(`"${encoded.substr(start, charPerRow)}"`);
    start += charPerRow;
}
encoded = array.join("\n");
let replaceData = fs.readFileSync(template).toString('utf-8').replace("${PLACE_HOLDER}", encoded);
writeIfDifferent(outputFile, replaceData, { encoding: 'utf-8' });

process.exit(0);