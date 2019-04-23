const { spawn } = require('child_process');
const { join, extname, basename, dirname, isAbsolute } = require('path');
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

async function generate (options) {
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
    // console.log(outputJSPath);

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

    const tscExitCode = await new Promise((resolve) => {
        const tscProcess = spawn(tscExecutablePath, [
            '-p',
            tempTsConfigPath,
        ], {
            cwd: process.cwd(),
            env: process.env,
        });
        tscProcess.on('exit', (code) => {
            resolve(code);
        });
        tscProcess.stdout.on('data', (data) => {
            console.log(data.toString());
        });
        tscProcess.stderr.on('data', (data) => {
            console.error(data.toString());
        });
    });

    console.log(`Delete temp config file ${tempTsConfigPath}.`);

    unlinkSync(tempTsConfigPath);

    if (tscExitCode !== 0) {
        console.error(`tsc exited with non-zero status code ${tscExitCode}.`);
        // return true;
    }

    const types = tsConfig.config.compilerOptions.types.map((typeFile) => `${typeFile}.d.ts`);
    (types.concat(extraDestFiles)).forEach((file) => {
        const destPath = join(outDir, isAbsolute(file) ? basename(file) : file);
        ensureDirSync(dirname(destPath));
        copyFileSync(file, destPath);
    });
    return true;
}

module.exports = { generate };
