const { spawnSync } = require('child_process');
const { join, extname, basename, dirname } = require('path');
const { copyFileSync, existsSync, readFileSync, unlinkSync, writeFileSync, ensureDirSync } = require('fs-extra');
const ts = require('typescript');

const tscExecutableName = process.platform === 'win32' ? 'tsc.cmd' : 'tsc';
const tscExecutablePath = join(__dirname, '..', '..', 'node_modules', '.bin', tscExecutableName);
const tsConfigDir = join(__dirname, '..', '..');
const tsConfigPath = join(tsConfigDir, 'tsconfig.json');
const tempTsConfigPath = join(tsConfigDir, '__tsconfig-gendecls.json');
const extraDestFiles = [
    join(__dirname, 'embedded-cocos-3d.d.ts'),
];

function generate (options) {
    const tsConfig = ts.readConfigFile(tsConfigPath, (path) => readFileSync(path).toString());
    if (tsConfig.error) {
        console.error(`Bad tsconfig.json: ${tsConfig.error.messageText}`);
        return undefined;
    }

    const { outDir } = options;
    ensureDirSync(outDir);

    tsConfig.config.compilerOptions.declaration = true;
    tsConfig.config.compilerOptions.emitDeclarationOnly = true;
    tsConfig.config.compilerOptions.outFile = join(outDir, `index.js`);

    const outputJSPath = join(tsConfigDir, tsConfig.config.compilerOptions.outFile);
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
    for (const destExtension of destExtensions) {
        const destFile = join(dirName, baseName + destExtension);
        if (existsSync(destFile)) {
            console.log(`Delete old ${destFile}.`);
            unlinkSync(destFile);
        }
    }

    console.log(`Make temp config file ${tempTsConfigPath}.`);

    writeFileSync(tempTsConfigPath, JSON.stringify(tsConfig.config, undefined, 4));

    console.log(`Generating...`);

    const tscResult = spawnSync(tscExecutablePath, [
        '-p',
        tempTsConfigPath,
    ], {
        stdio: [process.stdin, process.stdout, process.stderr],
    });
    if (tscResult.error) {
        console.error(`Failed to compile engine: \n${tscResult.error}.`);
        return false;
    }

    console.log(`Delete temp config file ${tempTsConfigPath}.`);

    unlinkSync(tempTsConfigPath);

    const types = tsConfig.config.compilerOptions.types.map((typeFile) => `${typeFile}.d.ts`);
    (types.concat(extraDestFiles)).forEach((file) => {
        copyFileSync(file, join(outDir, basename(file)));
    });
    return true;
}

module.exports = { generate };
