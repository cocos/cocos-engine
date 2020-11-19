
import fs from 'fs-extra';
import { URL, fileURLToPath } from 'url';

await fs.emptyDir(fileURLToPath(new URL('../dist', import.meta.url)));
