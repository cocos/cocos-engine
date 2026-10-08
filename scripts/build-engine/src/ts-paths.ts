
import * as rollup from 'rollup';
import ts from 'typescript';
import ps from 'path';

type ResolveTsPath = (source: string) => string | null;

function completePathExtension (file: string): string | undefined {
    if (ps.extname(file) && ts.sys.fileExists(file)) {
        return file;
    }
    for (const extension of ['.ts', '.js', '.json']) {
        const fileWithExtension = `${file}${extension}`;
        if (ts.sys.fileExists(fileWithExtension)) {
            return fileWithExtension;
        }
    }
    for (const extension of ['.ts', '.js', '.json']) {
        const indexWithExtension = ps.join(file, `index${extension}`);
        if (ts.sys.fileExists(indexWithExtension)) {
            return indexWithExtension;
        }
    }
    return undefined;
}

export function createTsPathResolver (configFileName: string): ResolveTsPath {
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
    if (!paths) {
        return () => null;
    }

    const baseUrlNormalized = ps.resolve(ps.dirname(configFileName), baseUrl ?? '.');
    const simpleMap: Record<string, string> = {};
    const wildcardMap: Array<{ prefix: string; suffix: string; target: string }> = [];
    for (const [key, mapped] of Object.entries(paths)) {
        const target = ps.resolve(baseUrlNormalized, mapped[0]);
        const wildcardIndex = key.indexOf('*');
        if (wildcardIndex < 0) {
            simpleMap[key] = target;
        } else {
            wildcardMap.push({
                prefix: key.slice(0, wildcardIndex),
                suffix: key.slice(wildcardIndex + 1),
                target,
            });
        }
    }

    return (source: string): string | null => {
        if (source in simpleMap) {
            return completePathExtension(simpleMap[source]) ?? simpleMap[source];
        }

        for (const { prefix, suffix, target } of wildcardMap) {
            if (source.length < prefix.length + suffix.length
                || !source.startsWith(prefix)
                || !source.endsWith(suffix)) {
                continue;
            }
            const captured = source.slice(prefix.length, source.length - suffix.length);
            const resolved = completePathExtension(ps.normalize(target.replace('*', captured)));
            if (resolved) {
                return resolved;
            }
        }
        return null;
    };
}

export default function ({
    configFileName,
}: {
    configFileName: string;
}): rollup.Plugin {
    const resolveTsPath = createTsPathResolver(configFileName);
    return {
        name: 'ts-paths',
        resolveId (source) {
            return resolveTsPath(source);
        },
    };
}
