import { build } from './index';

/**
 * Enumerates all chunk files that used by specified feature units.
 * @param meta Metadata of build result.
 * @param featureUnits Feature units.
 */
export function enumerateDependentChunks (meta: build.Result, featureUnits: string[]) {
    const result: string[] = [];
    const visited = new Set<string>();
    const addChunk = (chunkFileName: string) => {
        if (visited.has(chunkFileName)) {
            return;
        }
        visited.add(chunkFileName);
        result.push(chunkFileName);
        if (meta.dependencyGraph && chunkFileName in meta.dependencyGraph) {
            for (const dependencyChunk of meta.dependencyGraph[chunkFileName]) {
                addChunk(dependencyChunk);
            }
        }
    };
    for (const featureUnit of featureUnits) {
        const chunkFileName = meta.exports[featureUnit];
        if (!chunkFileName) {
            console.error(`Feature unit ${featureUnit} is not in build result!`);
            continue;
        }
        addChunk(chunkFileName);
    }
    return result;
}