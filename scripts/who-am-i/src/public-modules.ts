import fs from 'fs-extra';
import ps from 'path';

/**
 * Gets the public modules of the engine.
 * @param root Engine root directory.
 * @returns Keys are module id. Values are module file path.
 */
export async function getPublicModules (root: string) {
    const moduleFiles = await getPublicModuleFiles(ps.join(root, 'exports'));
    return moduleFiles.reduce((result, file) => {
        const baseNameNoExt = ps.basename(file, ps.extname(file));
        // 1:1 mapping now.
        // 'base' -> 'core' in future?
        const moduleId = `cc.${baseNameNoExt}`;
        result[moduleId] = file;
        return result;
    }, {} as Record<string, string>);
}

/**
 * Gets the modules of the engine that public to editor.
 * @param root Engine root directory.
 * @returns Keys are module id. Values are module file path.
 */
export async function getEditorPublicModules (root: string) {
    const moduleFiles = await getPublicModuleFiles(ps.join(root, 'exports'));
    return moduleFiles.reduce((result, file) => {
        const baseNameNoExt = ps.basename(file, ps.extname(file));
        const moduleId = `cce.${baseNameNoExt}`;
        result[moduleId] = file;
        return result;
    }, {} as Record<string, string>);
}

/**
 * Gets the modules that force to be a single module file when building.
 */
export function getForceStandaloneModules (): readonly string[] {
    return [
        'cc.wait-for-ammo-instantiation',
        'cc.decorator',
    ];
}

async function getPublicModuleFiles (exportsHome: string) {
    const files = await fs.readdir(exportsHome);
    return files.filter((file) => file.toLowerCase().endsWith('.ts')).map((file) => ps.join(exportsHome, file));
}
