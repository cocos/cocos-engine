#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const ARGS = process.argv.slice(2);

let result = [];

const cdbFile = path.join(__dirname, '../../build/compile_commands.json');
if (fs.existsSync(cdbFile)) {
    const db = JSON.parse(fs.readFileSync(cdbFile, { encoding: 'utf8' }));
    for (let f of ARGS) {
        for (let t of db) {
            if (t.file.endsWith(f)) {
                result.push(f);
            }
        }
    }
    console.log(result.join(" "));
} else {
    console.log(ARGS.join(" "));
}