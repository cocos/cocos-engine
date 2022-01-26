const zlib = require('zlib');
const fs = require('fs');
const process = require('process');
const writeIfDifferent = require('./utils').writeIfDifferent;

const VERBOSE = false;

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

if(VERBOSE) {
    console.log(`--processing ${inputFile} : ${exportVar}`);
}

const shaders = require(inputFile)[exportVar];

let newShaders = shaders.map((eff)=> '{' + eff.map(s => {
    let o = {...s};
    let arr = ['{\n'];
    let shaders = [];
    for(let i in o) {
        let gziped = zlib.gzipSync(o[i]).toString("base64");
        shaders.push(`  {"${i}", GzipedString("${gziped}")}`);
    }
    arr.push(shaders.join(",\n"));
    arr.push('\n}');
    return arr.join("");
}).join("\n,") + '}');

let encoded = newShaders.join(',\n');


if(VERBOSE) {
    console.log(`--gen ${outputFile} : ${exportVar}`);
}

let replaceData = fs.readFileSync(template).toString('utf-8').replace("${PLACE_HOLDER}", encoded);
writeIfDifferent(outputFile, replaceData, {encoding: 'utf-8'});

if(VERBOSE) {
    console.log(`--done ${outputFile} : ${exportVar}`);
}

process.exit(0);