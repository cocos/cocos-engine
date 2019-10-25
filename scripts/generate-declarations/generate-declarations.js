/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */

const { join, extname, basename, dirname, isAbsolute } = require('path');
const { copyFileSync, existsSync, readFileSync, unlinkSync, writeFileSync, ensureDirSync } = require('fs-extra');
const ts = require('typescript');
const gift = require('tfig');

const tsConfigDir = join(__dirname, '..', '..');
const tsConfigPath = join(tsConfigDir, 'tsconfig.json');

async function generate (options) {
    console.log(`Typescript version: ${ts.version}`);

    const { outDir } = options;
    ensureDirSync(outDir);

    const unbundledOutFile = join(outDir, `cc-before-rollup.js`);
    const parsedCommandLine = ts.getParsedCommandLineOfConfigFile(
        tsConfigPath, {
            declaration: true,
            emitDeclarationOnly: true,
            outFile: unbundledOutFile,
            outDir: undefined,
        }, {
            onUnRecoverableConfigFileDiagnostic: () => {},
            useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
            readDirectory: ts.sys.readDirectory,
            getCurrentDirectory: ts.sys.getCurrentDirectory,
            fileExists: ts.sys.fileExists,
            readFile: ts.sys.readFile,
        }
    );

    const outputJSPath = join(tsConfigDir, unbundledOutFile);
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

    console.log(`Generating...`);

    const program = ts.createProgram(parsedCommandLine.fileNames, parsedCommandLine.options);
    const emitResult = program.emit(
        undefined, // targetSourceFile
        undefined, // writeFile
        undefined, // cancellationToken,
        true, // emitOnlyDtsFiles
        undefined, // customTransformers
    );
    
    let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
    for (const diagnostic of allDiagnostics) {
        let printer;
        switch (diagnostic.category) {
            case ts.DiagnosticCategory.Error:
                printer = console.error;
                break;
            case ts.DiagnosticCategory.Warning:
                printer = console.warn;
                break;
            case ts.DiagnosticCategory.Message:
            case ts.DiagnosticCategory.Suggestion:
            default:
                printer = console.log;
                break;
        }
        if (!printer) {
            continue;
        }
        if (diagnostic.file) {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText);
            printer(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        } else {
            printer(`${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
        }
    }

    const tscOutputDtsFile = join(dirName, baseName + '.d.ts');
    if (!existsSync(tscOutputDtsFile)) {
        console.error(`Failed to compile.`);
        return false;
    }

    const types = parsedCommandLine.options.types.map((typeFile) => `${typeFile}.d.ts`);
    types.forEach((file) => {
        const destPath = join(outDir, isAbsolute(file) ? basename(file) : file);
        ensureDirSync(dirname(destPath));
        copyFileSync(file, destPath);
    });

    console.log(`Bundling...`);
    const giftInputPath = tscOutputDtsFile;
    const giftOutputPath = join(dirName,'cc.d.ts' );
    const giftResult = gift.bundle({
        input: giftInputPath,
        output: giftOutputPath,
        name: 'cc',
        rootModule: 'index',
    });
    if (giftResult.error !== gift.GiftErrors.Ok) {
        console.error(`Failed to bundle declaration files because of gift error: ${gift.GiftErrors[giftResult.error]}.`);
        return false;
    }
    writeFileSync(giftOutputPath, giftResult.code);
    unlinkSync(giftInputPath);

    return true;
}

module.exports = { generate };
