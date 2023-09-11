import type * as rollup from 'rollup';
import fs from 'fs-extra';
import ps, { join } from 'path';

interface IOptions {
    engineRoot: string,
    useWebGPU?: boolean;
}
const URL_PROTOCOL = 'url:';
const PREFIX = `\0${URL_PROTOCOL}`;

export function assetUrl ({
    engineRoot,
    useWebGPU = false,
}: IOptions): rollup.Plugin {
    const files = new Set<string>();
    return {
        name: '@cocos/build-engine|external-asset',

        async resolveId (this, source, importer) {
            if (source.startsWith(URL_PROTOCOL) && importer) {
                const subPath = source.substring(URL_PROTOCOL.length);
                const externalAssetPath = join(engineRoot, subPath);
                return PREFIX + externalAssetPath;
            }

            return null;
        },

        async load (id) {
            if (id.startsWith(PREFIX)) {
                const path = id.substring(PREFIX.length);
                if (!useWebGPU) {
                    return `export default '';`;
                }
                const referenceId = this.emitFile({
                    type: 'asset',
                    name: ps.basename(path),
                    source: await fs.readFile(path),
                });
                files.add(referenceId);
                return `export default import.meta.ROLLUP_FILE_URL_${referenceId};`;
            }
            return null;
        },

        // Generates the `import.meta.ROLLUP_FILE_URL_referenceId`.
        resolveFileUrl ({
            // > The path and file name of the emitted asset, relative to `output.dir` without a leading `./`.
            fileName,
            // > The path and file name of the emitted file,
            // > relative to the chunk the file is referenced from.
            // > This will path will contain no leading `./` but may contain a leading `../`.
            relativePath,

            referenceId,
        }) {
            if (files.has(referenceId)) {
                return `'${fileName}'`;
            } else {
                return undefined;
            }
        },
    };
}