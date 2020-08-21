import { build } from './index';

/**
 * 获取指定引擎模块依赖的所有 chunk 文件。
 * @param meta 构建引擎的元信息。
 * @param entries 引擎模块。
 */
export function enumerateDependentChunks (meta: build.Result, entries: string[]) {
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
    for (const entry of entries) {
        const chunkName = `cc.${entry}`;
        if (!(chunkName in meta.exports)) {
            console.error(`Engine module ${entry} is not in build result!`);
        }
        const chunkFileName = meta.exports[`cc.${entry}`];
        addChunk(chunkFileName);
    }
    return result;
}