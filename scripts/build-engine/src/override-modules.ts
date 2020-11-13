import * as rollup from 'rollup';
import ps from 'path';
import { filePathToModuleRequest } from './utils';

export default function overrideModules (
    engineRoot: string,
    moduleOverrides: Record<string, string>,
): rollup.Plugin {
    const moduleRedirects: Record<string, string> = {};

    for (const [source, override] of Object.entries(moduleOverrides)) {
        const normalizedSource = makePathEqualityKey(ps.resolve(engineRoot, source));
        const normalizedOverride = ps.resolve(engineRoot, override);
        moduleRedirects[normalizedSource] = normalizedOverride;
    }

    return {
        name: '@cocos/build-engine|module-overrides',
        load (this, id: string) {
            const key = makePathEqualityKey(id);
            if (!(key in moduleRedirects)) {
                return null;
            }
            const replacement = moduleRedirects[key];
            console.debug(`Redirect module ${id} to ${replacement}`);
            return `export * from '${filePathToModuleRequest(replacement)}';`;
        },
    };
}

function makePathEqualityKey (path: string) {
    return process.platform === 'win32' ? path.toLocaleLowerCase() : path;
}
