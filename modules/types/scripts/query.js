const ps = require('path');
const fs = require('fs');

function formatPath (path) {
    return path.replace(/\\/g, '/');
}

/**
 * Query all the type files which are referenced in index.d.ts
 * @returns 
 */
exports.getTypeFiles = function  () {
    const indexFile = ps.join(__dirname, '../src/index.d.ts');
    const indexContent = fs.readFileSync(indexFile, 'utf8');
    const reg = /".*"/g;
    const relativePaths = indexContent.match(reg)

    const result = [];
    for (let path of relativePaths) {
        path = path.slice(1, -1);  // remove "
        path = formatPath(ps.join(ps.dirname(indexFile), path));
        result.push(path);
    }

    return result;
}