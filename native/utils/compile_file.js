

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const fp = path.join(__dirname, '..', 'compile_commands.json');

if (!fs.existsSync(fp)) {
    console.error(`File ${fp} is not exists!`);
    process.exit(-1);
}

const db = JSON.parse(fs.readFileSync(fp).toString('utf8'));

let fileName = process.argv[2];
if (!fileName) {
    console.error(`argument: file  not provided!`);
    process.exit(-1);
}

fileName = path.normalize(fileName);

for (let item of db) {
    let up = path.normalize(item.file);
    if (up.indexOf(fileName) > -1) {
        console.log(`compiling file ${up}`);
        console.log("################################################################################");
        console.log("################################################################################");
        console.log("################################################################################");
        console.log(up);
        console.log("################################################################################");
        console.log("################################################################################");
        console.log("################################################################################");
        let result = child_process.execSync(item.command, { cwd: item.directory, shell: true });
        console.log(result.toString('utf-8'));
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        process.exit(-1);
    }
}

console.error(' file not found ' + fileName);