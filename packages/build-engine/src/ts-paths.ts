
import * as rollup from 'rollup';
import ts from 'typescript';
import ps from 'path';

export default function ({
    configFileName,
}: {
    configFileName: string;
}): rollup.Plugin {
    const parsedCommandLine = ts.getParsedCommandLineOfConfigFile(configFileName, {}, {
        onUnRecoverableConfigFileDiagnostic: () => {},
        useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
        readDirectory: ts.sys.readDirectory,
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
    });
    if (!parsedCommandLine) {
        throw new Error(`Failed to read tsconfig`);
    }
    const { baseUrl, paths } = parsedCommandLine.options;
    let resolveId: rollup.ResolveIdHook | undefined;
    if (paths) {
        const baseUrlNormalized = ps.resolve(configFileName, baseUrl ?? '.');
        const simpleMap: Record<string, string> = {};
        for (const [key, mapped] of Object.entries(paths)) {
            simpleMap[key] = ps.resolve(baseUrlNormalized, mapped[0]);
        }
        resolveId = function (this, source, importer) {
            if (!(source in simpleMap)) {
                return null;
            } else {
                return simpleMap[source];
            }
        };
    }
    return {
        name: 'ts-paths',
        resolveId,
    };
}