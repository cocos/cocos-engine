import type * as rollup from 'rollup';
import { URL, fileURLToPath, pathToFileURL } from 'url';
import fs from 'fs-extra';
import ps from 'path';
import * as pluginUtils from '@rollup/pluginutils';

/**
 * Excludes specified modules clearly from rollup bundling.
 * Requests to these modules are remapped as another place holder module specifiers
 * and this plugin will produce a map which records the mapping info.
 *
 * For instance, give that we want to handle `'@cocos/physx'`. Some modules may have:
 * ```ts
 * import X from '@cocos/physx';
 * ```
 * As a result, first, the real `@cocos/physx` module would be wrapped as SystemJS module
 * and emitted to build output as a single code file, without bother to rollup(so that pretty fast).
 * Then, the bundle generates a module ID, let's say: `placeholder:/@cocos/physx`.
 * To use that bundle,
 * you need to properly map the `placeholder:/@cocos/physx` for example, through import map,
 * to the emitted file.
 * The `resultMapping` records which real module the `placeholder:/@cocos/physx` is mapped.
 *
 * The following requirements should be fulfilled:
 * - These modules are all CommonJS modules that only use `exports` and `module.exports`.
 * - The module format of rollup bundling should be SystemJS.
 */
export function codeAsset ({
    include,
    exclude,
    resultMapping,
}: {
    include?: pluginUtils.FilterPattern;
    exclude?: pluginUtils.FilterPattern;
    resultMapping: Record<string, string>;
}): rollup.Plugin {
    const filter = pluginUtils.createFilter(include, exclude);

    const emitMap: Record<string, string> = {};

    return {
        name: '@cocos/build-engine|code-asset',

        resolveId (source, _importer) {
            if (!(source in emitMap)) {
                return null;
            }
            return {
                id: source,
                external: true,
            };
        },

        async load (id) {
            if (!filter(id)) {
                return null;
            }

            const placeholderId = generatePlaceholderId(id);
            if (!placeholderId) {
                this.error(`Can not generate placeholder ID for module ${id}.`);
            }

            const referenceId = this.emitFile({
                type: 'asset',
                name: ps.basename(id),
                // fileName: path,
                source: wrapAsmJs(await fs.readFile(id, 'utf8')),
            });

            const placeholderModuleSpecifier = `split:/${placeholderId}`;
            emitMap[placeholderModuleSpecifier] = referenceId;

            const code = `
            export * from '${placeholderModuleSpecifier}';
            import { default as D } from '${placeholderModuleSpecifier}';
            export { D as default };
            `;

            return code;
        },

        generateBundle (_options, _bundle, _isWrite) {
            for (const [moduleId, rollupFileReferenceId] of Object.entries(emitMap)) {
                resultMapping[moduleId] = this.getFileName(rollupFileReferenceId);
            }
        },
    };
}

function wrapAsmJs (code: string) {
    return `
    System.register([], function (_export) {
        return {
            execute() {
                const _cjsModule = { exports: {} };
                const _cjsExports = _cjsModule.exports;
                (function(module, exports){
                    ${code}
                })(_cjsModule, _cjsExports);
                _export("default", _cjsModule.exports);
            },
        };
    });
    `;
}

function generatePlaceholderId (id: string) {
    const parts = id.split(/[\\\/]/g);
    if (parts.length !== 0) {
        const baseName = parts[parts.length - 1];
        if (baseName) {
            return baseName;
        }
    }
    return '';
}
