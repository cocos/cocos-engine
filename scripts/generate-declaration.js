const { spawnSync } = require('child_process');
const { join, extname, basename, dirname } = require('path');
const { readFileSync, existsSync } = require('fs');
const ts = require('typescript');

const tscExecutableName = process.platform === 'win32' ? 'tsc.cmd' : 'tsc';
const tscExecutablePath = join(__dirname, '..', 'node_modules', '.bin', tscExecutableName);
const tssConfigDir = join(__dirname, '..');
const tscConfigPath = join(tssConfigDir, 'tsconfig-gendecls.json');

function generate () {
    const tscConfig = ts.readConfigFile(tscConfigPath, (path) => readFileSync(path).toString());
    if (tscConfig.error) {
        console.error(`Bad tsconfig.json: ${tscConfig.error.messageText}`);
        return undefined;
    }

    const outputJSPath = join(tssConfigDir, tscConfig.config.compilerOptions.outFile);
    console.log(outputJSPath);

    const extName = extname(outputJSPath);
    if (extName !== '.js') {
        console.error(`Unexpected output extension ${extName}, please check it.`);
        return undefined;
    }

    const dirName = dirname(outputJSPath);
    const baseName = basename(outputJSPath, extName);
    const destExtensions = [
        '.d.ts',
        '.d.ts.map',
    ];

    const destFiles = destExtensions.map((destExtension) => {
        const destFile = join(dirName, baseName + destExtension);
        if (existsSync(destFile)) {
            console.log(`Delete old ${destFile}.`);
        }
        return destFile;
    });

    console.log(`Generating...`);

    spawnSync(tscExecutablePath, [
        '-p',
        tscConfigPath,
    ], {
        stdio: [ null, process.stdout, process.stderr ]
    });

    return destFiles;
}

module.exports = { generate };
