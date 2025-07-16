const fs = require('fs');

// read json from stdin

let buffer = Buffer.alloc(0);
const args = process.argv.slice(2);

function getAttrByPath(object, pathText) {
    const parts = pathText.split('.');
    let curr = object;
    const REG1 = /\["(\w+)"\]/;
    const REG2 = /\[(\w+)\]/;
    const REG3 = /"(\w+)"/;
    const REG4 = /(\w+)/;
    const regList = [REG1, REG2, REG3, REG4];
    for (const p of parts) {
        let mat;
        let field = null;
        for (let r of regList) {
            mat = p.match(r);
            if (mat) {
                field = mat[1];
                break;
            }
        }
        if (!field) {
            console.error(`path component "${p}" is invalidate from ${pathText}`);
            process.exit(1);
        }
        curr = curr[field];
    }
    return curr;
}


process.stdin.resume();

process.stdin.on('data', data => {
    buffer = Buffer.concat([buffer, data]);
}).on('end', () => {
    const data = JSON.parse(buffer.toString('utf8'))
    let value = getAttrByPath(data, args[0]);
    if(args.length >= 2) {
        const mat = value.match(new RegExp(args[1]));
        if(mat) {
            value = mat[args[2]];
        }
    }
    console.log(value);
});
