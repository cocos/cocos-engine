const { readdirSync, statSync, unlinkSync } = require('fs');
const { join } = require('path');

const { magenta } = require('chalk');

const prefix = ''.padStart(20, '=');
console.log(magenta(`${prefix} Clear file ${prefix}`));

(() => {
    let total = 0;
    let m = 0;

    function step (dir) {
        total++;
        const names = readdirSync(dir);

        names.forEach((name) => {
            const file = join(dir, name);
            const stat = statSync(file);
            if (stat.isDirectory()) {
                step(file);
            } else if (
                /\.d\.ts$/.test(file)
                    || /\.md$/.test(file)
                    || /\.markdown$/.test(file)
            ) {
                m++;
                unlinkSync(file);
            } else {
                total++;
            }
        });
    }

    const root = join(__dirname, '../node_modules');
    step(root);

    const xcode = join(__dirname, './native-pack-tool/xcode/node_modules');
    step(xcode);

    console.log(`${total} - ${m}`);
})();
