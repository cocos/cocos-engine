import ps from 'path';
import fs from 'fs-extra';
import ts from 'typescript';
import * as gift from 'tfig';
import { StatsQuery } from '../stats-query';

const DEBUG = false;
const REMOVE_TMP = true;
const REMOVE_OLD = !DEBUG;
const RECOMPILE = !DEBUG;

export async function build (options: {
    engine: string;
    outDir: string;
    withIndex: boolean;
    withExports: boolean;
    withEditorExports: boolean;
}) {
    console.log(`Typescript version: ${ts.version}`);

    const {
        engine,
        outDir,
        withIndex = true,
        withExports = false,
        withEditorExports = false,
    } = options;
    await fs.ensureDir(outDir);

    console.debug(`With index: ${withIndex}`);
    console.debug(`With exports: ${withExports}`);
    console.debug(`With editor exports: ${withEditorExports}`);

    const statsQuery = await StatsQuery.create(engine);

    const tsConfigPath = statsQuery.tsConfigPath;

    const unbundledOutFile = ps.join(outDir, `cc-before-rollup.js`);
    const parsedCommandLine = ts.getParsedCommandLineOfConfigFile(
        tsConfigPath, {
            declaration: true,
            noEmit: false,
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
        },
    );
    if (!parsedCommandLine) {
        throw new Error(`Can not get 'parsedCommandLine'.`);
    }

    const outputJSPath = ps.join(ps.dirname(tsConfigPath), unbundledOutFile);
    // console.log(outputJSPath);

    const extName = ps.extname(outputJSPath);
    if (extName !== '.js') {
        console.error(`Unexpected output extension ${extName}, please check it.`);
        return undefined;
    }
    const dirName = ps.dirname(outputJSPath);
    const baseName = ps.basename(outputJSPath, extName);
    const destExtensions = [
        '.d.ts',
        '.d.ts.map',
    ];
    if (REMOVE_OLD) {
        for (const destExtension of destExtensions) {
            const destFile = ps.join(dirName, baseName + destExtension);
            if (await fs.pathExists(destFile)) {
                console.log(`Delete old ${destFile}.`);
                await fs.unlink(destFile);
            }
        }
    }

    console.log(`Generating...`);

    const featureUnits = statsQuery.getFeatureUnits().filter((m) => m !== 'wait-for-ammo-instantiation');

    const editorExportModules = statsQuery.getEditorPublicModules();

    if (RECOMPILE) {
        let fileNames = parsedCommandLine.fileNames;
        if (withEditorExports) {
            fileNames = fileNames.concat(editorExportModules.map((e) => statsQuery.getEditorPublicModuleFile(e)));
        }

        const program = ts.createProgram(fileNames, parsedCommandLine.options);
        const emitResult = program.emit(
            undefined, // targetSourceFile
            undefined, // writeFile
            undefined, // cancellationToken,
            true, // emitOnlyDtsFiles
            undefined, // customTransformers
        );

        const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
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
            if (diagnostic.file && diagnostic.start !== undefined) {
                const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, ts.sys.newLine);
                printer(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
            } else {
                printer(`${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
            }
        }
    }

    const tscOutputDtsFile = ps.join(dirName, `${baseName}.d.ts`);
    if (!await fs.pathExists(tscOutputDtsFile)) {
        console.error(`Failed to compile.`);
        return false;
    }

    const types = parsedCommandLine.options.types?.map((typeFile) => `${typeFile}.d.ts`);
    if (types) {
        for (const file of types) {
            const destPath = ps.join(outDir, ps.isAbsolute(file) ? ps.basename(file) : file);
            await fs.ensureDir(ps.dirname(destPath));
            await fs.copyFile(file, destPath);
        }
    }

    const giftInputs = [tscOutputDtsFile];

    const giftEntries: Record<string, string> = { };

    const cleanupFiles = [tscOutputDtsFile];

    if (withExports) {
        for (const exportEntry of featureUnits) {
            giftEntries[exportEntry] = getModuleNameInTsOutFile(
                statsQuery.getFeatureUnitFile(exportEntry), statsQuery,
            );
        }
    }

    if (withEditorExports) {
        for (const editorExportModule of editorExportModules) {
            giftEntries[editorExportModule] = getModuleNameInTsOutFile(
                statsQuery.getEditorPublicModuleFile(editorExportModule), statsQuery,
            );
        }
    }

    if (withIndex && !withExports) {
        giftEntries.cc = 'cc';
        const ccDtsFile = ps.join(dirName, 'virtual-cc.d.ts');
        giftInputs.push(ccDtsFile);
        cleanupFiles.push(ccDtsFile);
        const code = `declare module "cc" {\n${
            statsQuery.evaluateIndexModuleSource(featureUnits,
                (featureUnit) => getModuleNameInTsOutFile(statsQuery.getFeatureUnitFile(featureUnit), statsQuery))
        }\n}`;
        await fs.writeFile(ccDtsFile, code, { encoding: 'utf8' });
    }

    console.log(`Bundling...`);
    try {
        const indexOutputPath = ps.join(dirName, 'cc.d.ts');
        const giftResult = gift.bundle({
            input: giftInputs,
            name: 'cc',
            rootModule: 'index',
            entries: giftEntries,
            priority: [
                'cc', // Things should be exported to 'cc' as far as possible.
            ],
            groups: [
                { test: /^cc\/editor.*$/, path: ps.join(dirName, 'cc.editor.d.ts') },
                { test: /^cc\/.*$/, path: ps.join(dirName, 'index.d.ts') },
                { test: /^cc.*$/, path: indexOutputPath },
            ],
            nonExportedSymbolDistribution: [{
                sourceModule: /cocos\/core\/animation\/marionette/,
                targetModule: 'cc/editor/new-gen-anim',
            }, {
                sourceModule: /.*/, // Put everything non-exported that 'cc' encountered into 'cc'
                targetModule: 'cc',
            }],
        });

        await Promise.all(giftResult.groups.map(async (group) => {
            await fs.outputFile(group.path, group.code, { encoding: 'utf8' });
        }));

        if (withIndex && withExports) {
            await fs.outputFile(
                indexOutputPath,
                buildIndexModule(featureUnits, statsQuery),
                { encoding: 'utf8' },
            );
        }
    } catch (error) {
        console.error(error);
        return false;
    } finally {
        if (REMOVE_TMP) {
            await Promise.all((cleanupFiles.map(async (file) => fs.unlink(file))));
        }
    }

    return true;
}

export function buildIndexModule (featureUnits: string[], statsQuery: StatsQuery) {
    return `declare module "cc" {\n${
        statsQuery.evaluateIndexModuleSource(featureUnits)
            .split('\n')
            .map((line) => `    ${line}`)
            .join('\n')
    }\n}`;
}

function getModuleNameInTsOutFile (moduleFile: string, statsQuery: StatsQuery) {
    const path = ps.relative(statsQuery.path, moduleFile);
    const tsOutFileModuleName = ps.join(ps.dirname(path), ps.basename(path, ps.extname(path))).replace(/\\/g, '/');
    return tsOutFileModuleName;
}
