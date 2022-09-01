import type * as rollup from 'rollup';
import fs from 'fs-extra';
import ps, { join } from 'path';

interface IOptions {
    externalRoot: string;
    useWebGPU?: boolean;
}
const PREFIX = '\0external:';
const EXTERNAL = 'external:';

export function externalAsset ({
    externalRoot,
    useWebGPU = false,
}: IOptions): rollup.Plugin {
    const files = new Set<string>();
    return {
        name: '@cocos/build-engine|external-asset',

        async resolveId (this, source, importer) {
            if (source.startsWith(EXTERNAL) && importer) {
                const subPath = source.substring(EXTERNAL.length);
                const externalAssetPath = join(externalRoot, subPath);
                return PREFIX + externalAssetPath;
            }

            return null;
        },

        async load (id) {
            if (id.startsWith(PREFIX)) {
                const path = id.substring(PREFIX.length);
                if (!useWebGPU) {
                    return `export const url = '';`;
                }
                const referenceId = this.emitFile({
                    type: 'asset',
                    name: ps.basename(path),
                    source: await fs.readFile(path),
                });
                files.add(referenceId);
                return `export const url = import.meta.ROLLUP_FILE_URL_${referenceId};`;
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