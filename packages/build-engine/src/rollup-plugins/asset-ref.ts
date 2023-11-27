import type * as rollup from 'rollup';
import { URL, fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs-extra';
import ps from 'path';

/**
 * This plugin enable to locate non-code assets in their path or URLs:
 * ```ts
 * import wasm from `asset-ref-url-to-C:/foo.wasm`;
 * ```
 * is equivalent to, for example:
 * ```ts
 * const wasm = 'path-to-<C:/foo.wasm>-relative-to-<outDir>-after-bundle';
 * ```
 * You can call `pathToAssetRefURL()` to convert file path to asset ref URL.
 */
export function assetRef (options: assetRef.Options): rollup.Plugin {
    return {
        name: '@cocos/build-engine|load-asset',
        // eslint-disable-next-line @typescript-eslint/require-await
        async resolveId (this, source, importer) {
            if (source.startsWith(assetPrefix)) {
                return source;
            }
            return null;
        },

        async load (id) {
            if (id.startsWith(assetPrefix)) {
                const pathname = id.substr(assetPrefix.length);
                const path = fileURLToPath(`file://${pathname}`);
                const referenceId = this.emitFile({
                    type: 'asset',
                    name: ps.basename(path),
                    // fileName: path,
                    source: await fs.readFile(path),
                });
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
        }) {
            switch (options.format) {
            case 'relative-from-chunk':
                return `'${relativePath}'`;
            case 'relative-from-out':
                return `'${fileName}'`;
            case 'runtime-resolved': default:
                return undefined; // return `new URL('${fileName}', import.meta.url).href`;
            }
        },
    };
}

export declare namespace assetRef {
    export interface Options {
        format?: Format;
    }

    /**
     * How to generate the reference to external assets:
     * - `'relative-from-out'`
     * Generate the path relative from `out` directory, does not contain the leading './'.
     *
     * - `'relative-from-chunk'`
     * Generate the path relative from the referencing output chunk.
     *
     * - `'dynamic'`(default)
     * Use runtime `URL` API to resolve the absolute URL.
     * This requires `URL` and `import.meta.url` to be valid.
     */
    export type Format =
        | 'relative-from-out'
        | 'relative-from-chunk'
        | 'runtime-resolved';
}

/**
 * Convert the file path to asset ref URL.
 * @param file File path in absolute.
 */
export function pathToAssetRefURL (file: string) {
    return `${assetPrefix}${pathToFileURL(file).pathname}`;
}

const assetPrefix = 'asset:';
