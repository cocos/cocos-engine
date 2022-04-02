

const fs = require('fs');


function all_eql(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    const l = a.length;
    for (let i = 0; i < l; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

function equals_ignore_spaces(a, b) {
    const lines_a = a.split('\n').map(x => x.trim());
    const lines_b = b.split('\n').map(x => x.trim());
    return all_eql(lines_a, lines_b);
}


function writeIfDifferent(file, data, args) {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, args).toString(args.encoding);
        if (equals_ignore_spaces(content, data)) {
            console.log(`Skip update ${file}`);
            return;
        }
    }
    fs.writeFileSync(file, data, args);
    console.log(` write to file ${file}`);
}

exports.writeIfDifferent = writeIfDifferent;