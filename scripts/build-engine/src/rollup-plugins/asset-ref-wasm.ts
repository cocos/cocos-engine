import type * as rollup from 'rollup';
import { URL, fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs-extra';
import ps from 'path';
import { nodeResolveAsync } from '..';

const PREFIX = '\0WASM_URL_ASSET_';

export function assetRef (): rollup.Plugin {
    const files = new Set<string>();
    return {
        name: '@cocos/build-engine|asset-ref-wasm',

        async resolveId (this, source, importer) {
            if (source.endsWith('.wasmurl') && importer) {
                const wasmFilePath = await nodeResolveAsync(source.replace(/\.wasmurl$/, '.wasm'), ps.dirname(importer));
                return PREFIX + wasmFilePath;
            }

            return null;
        },

        async load (id) {
            if (id.startsWith(PREFIX)) {
                const pathname = id.substr(PREFIX.length);
                const path = pathname;
                const referenceId = this.emitFile({
                    type: 'asset',
                    name: ps.basename(path),
                    // fileName: path,
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
