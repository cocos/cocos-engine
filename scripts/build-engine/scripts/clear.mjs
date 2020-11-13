
import fs from 'fs-extra';
import { URL, fileURLToPath } from 'url';

await Promise.all([
    fs.remove(fileURLToPath(new URL('../tsconfig.tsbuildinfo', import.meta.url))),
    fs.emptyDir(fileURLToPath(new URL('../dist', import.meta.url)))
])
