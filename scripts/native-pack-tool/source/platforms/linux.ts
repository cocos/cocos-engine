import { NativePackTool } from "../base/default";
import * as fs from 'fs-extra';
import * as ps from 'path';
import { Paths } from "../utils";

export class LinuxPackTool extends NativePackTool {
    async create() {
        await fs.copy(ps.join(this.paths.platformTemplateDirInPrj, 'CMakeLists.txt'), ps.join(Paths.projectDir, 'proj', 'CMakeLists.txt'));
        this.generateCMakeConfig();
        return true;
    }
}