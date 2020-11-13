const fs = require('fs-extra');
const ps = require('path');
(async () => {
    await Promise.all([
        fs.emptyDir(ps.join(__dirname, '..', 'lib')),
    ]);
})();