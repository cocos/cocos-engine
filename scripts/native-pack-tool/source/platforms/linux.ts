import { NativePackTool } from "../base/default";
import * as fs from 'fs-extra';
import * as ps from 'path';

export class LinuxPackTool extends NativePackTool {
    async create() {
        await super.create();
        await fs.copy(ps.join(this.paths.platformTemplateDirInPrj, 'CMakeLists.txt'), ps.join(this.paths.buildDir, 'proj', 'CMakeLists.txt'));
        this.generateCMakeConfig();
        await this.encrypteScripts();
        return true;
    }
}
