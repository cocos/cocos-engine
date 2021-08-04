#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const ARGS = process.argv.slice(2);

const excludes = [
    'cocos/renderer/gfx-vulkan/volk',
    'cocos/bindings/auto',
];

let result = [];

const cdbFile = path.join(__dirname, '../../build/compile_commands.json');
if (fs.existsSync(cdbFile)) {
    const db = JSON.parse(fs.readFileSync(cdbFile, { encoding: 'utf8' }));
    for (let f of ARGS) {
        const name = f.endsWith('.h') ? f.slice(0, -2) : f; // ignore .h extension name
        if (excludes.some((e) => name.includes(e))) continue;
        if (db.some((info) => info.file.includes(name))) {
            result.push(f);
        }
    }
    console.log(result.join(' '));
} else {
    console.log(ARGS.join(' '));
}
