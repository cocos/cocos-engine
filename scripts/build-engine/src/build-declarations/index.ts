import ps from 'path';
import fs from 'fs-extra';
import ts from 'typescript';
import * as gift from 'tfig';
import { StatsQuery } from '../stats-query';

const DEBUG = false;
const REMOVE_TMP = true;
const REMOVE_OLD = !DEBUG;
const RECOMPILE = !DEBUG;
const REMOVE_UNBUNDLED_CACHE = !DEBUG;

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

    const unbundledOutDir = ps.join(outDir, '__before_bundle');
    const parsedCommandLine = ts.getParsedCommandLineOfConfigFile(
        tsConfigPath, {
            declaration: true,
            noEmit: false,
            emitDeclarationOnly: true,
            outFile: undefined,
            outDir: unbundledOutDir,
            allowJs: true,
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

    const unbundledOutDirNormalized = ps.resolve(engine, parsedCommandLine.options.outDir!);
    console.debug(`Unbundled will write to: ${unbundledOutDirNormalized}`);

    await fs.ensureDir(unbundledOutDirNormalized);
    if (REMOVE_OLD) {
        await fs.emptyDir(unbundledOutDirNormalized);
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

    const patchSpineCoreDtsSource = ps.join(engine, 'cocos', 'spine', 'lib', 'spine-core.d.ts');
    const patchSpineCoreDtsTarget = ps.join(unbundledOutDirNormalized, 'cocos', 'spine', 'lib', 'spine-core.d.ts');
    if (!await fs.pathExists(patchSpineCoreDtsSource)) {
        console.debug(`Does 'cocos/spine/lib/spine-core.d.ts' no longer existed? I have a patch for it.`);
    } else {
        console.debug(`It's ${new Date().toLocaleString()}, we're still doing the hack for spine-core.d.ts`);
        await fs.ensureDir(ps.dirname(patchSpineCoreDtsTarget));
        await fs.copyFile(
            patchSpineCoreDtsSource,
            patchSpineCoreDtsTarget,
        );
    }

    const types = parsedCommandLine.options.types?.map((typeFile) => `${typeFile}.d.ts`);
    if (types) {
        for (const file of types) {
            const destPath = ps.join(unbundledOutDirNormalized, ps.isAbsolute(file) ? ps.basename(file) : file);
            await fs.ensureDir(ps.dirname(destPath));
            await fs.copyFile(file, destPath);
        }
    }

    const giftInputs: string[] = [];
    const listGiftInputs = async (dir: string) => {
        for (const file of await fs.readdir(dir)) {
            const path = ps.join(dir, file);
            // eslint-disable-next-line no-await-in-loop
            const stats = await fs.stat(path);
            if (stats.isFile()) {
                giftInputs.push(path);
            } else if (stats.isDirectory()) {
                // eslint-disable-next-line no-await-in-loop
                await listGiftInputs(path);
            }
        }
    };
    await listGiftInputs(unbundledOutDirNormalized);

    const giftEntries: Record<string, string> = { };

    const cleanupFiles: string[] = [];

    const getModuleNameInTsOutFile = (moduleFile: string) => {
        const path = ps.relative(statsQuery.path, moduleFile);
        const pathDts = path.replace(/\.ts$/, '.d.ts');
        return ps.join(unbundledOutDirNormalized, pathDts);
    };

    if (withExports) {
        for (const exportEntry of featureUnits) {
            giftEntries[exportEntry] = getModuleNameInTsOutFile(
                statsQuery.getFeatureUnitFile(exportEntry),
            );
        }
    }

    if (withEditorExports) {
        for (const editorExportModule of editorExportModules) {
            giftEntries[editorExportModule] = getModuleNameInTsOutFile(
                statsQuery.getEditorPublicModuleFile(editorExportModule),
            );
        }
    }

    let ccDtsFile: string | undefined;
    if (withIndex && !withExports) {
        ccDtsFile = ps.join(unbundledOutDirNormalized, 'virtual-cc.d.ts');
        giftEntries.cc = ccDtsFile;
        giftInputs.push(ccDtsFile);
        cleanupFiles.push(ccDtsFile);
        const code = `${
            statsQuery.evaluateIndexModuleSource(featureUnits,
                (featureUnit) => getModuleNameInTsOutFile(statsQuery.getFeatureUnitFile(featureUnit)).replace(/\\/g, '/').replace(/\.d.ts$/, ''))
        }\n`;
        await fs.writeFile(ccDtsFile, code, { encoding: 'utf8' });
    }

    console.log(`Bundling...`);
    try {
        const indexOutputPath = ps.join(outDir, 'cc.d.ts');
        const giftResult = gift.bundle({
            input: giftInputs,
            rootDir: unbundledOutDirNormalized,
            name: 'cc',
            rootModule: 'index',
            entries: giftEntries,
            priority: [
                ...(ccDtsFile ? [ccDtsFile] : []), // Things should be exported to 'cc' as far as possible.
            ],
            groups: [
                { test: /^cc\/editor.*$/, path: ps.join(outDir, 'cc.editor.d.ts') },
                { test: /^cc\/.*$/, path: ps.join(outDir, 'index.d.ts') },
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

        if (REMOVE_UNBUNDLED_CACHE) {
            await fs.remove(unbundledOutDirNormalized);
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
