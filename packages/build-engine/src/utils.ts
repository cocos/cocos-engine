
export function filePathToModuleRequest (path: string) {
    return path.replace(/\\/g, '\\\\');
}
