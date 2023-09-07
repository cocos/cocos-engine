const ps = require('path');
const fs = require('fs');

function formatPath (path) {
    return path.replace(/\\/g, '/');
}

exports.getDtsFiles = function () {
    const indexFile = ps.join(__dirname, '../src/index.d.ts');
    const indexContent = fs.readFileSync(indexFile, 'utf8');
    const reg = /".*"/g;
    const dtsFiles = indexContent.match(reg).map(relativePath => formatPath(ps.join(ps.dirname(indexFile), relativePath.slice(1, -1))));
    return dtsFiles;
};