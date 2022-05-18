import * as fs from 'fs-extra';
import { CocosParams } from '../base/default';
import { cchelper, toolHelper, Paths } from "../utils";
import { MacOSPackTool } from "./mac-os";

export interface IMacParams {
    bundleId: string;
    skipUpdateXcodeProject: boolean;
}

export class MacPackTool extends MacOSPackTool {
    params: CocosParams<IMacParams>;

    constructor(params: CocosParams<IMacParams>) {
        super(params);
        this.params = params;
    }

    async generate() {
        await super.generate();
        const buildDir = this.paths.buildDir;

        if (!fs.existsSync(buildDir)) {
            cchelper.makeDirectoryRecursive(buildDir);
        }

        const ver = toolHelper.getXcodeMajorVerion() >= 12 ? "12" : "1";
        const cmakeArgs = ['-S', `${this.paths.platformTemplateDirInPrj}`, '-GXcode', '-T', `buildsystem=${ver}`,
                           `-B${buildDir}`, '-DCMAKE_SYSTEM_NAME=Darwin'];
        this.appendCmakeResDirArgs(cmakeArgs);

        await toolHelper.runCmake(cmakeArgs);

        this.skipUpdateXcodeProject();
        return true;
    }

    async make() {
        const buildDir = this.paths.buildDir;

        const platform = this.isAppleSilicon() ? `-arch arm64` : `-arch x86_64`;
        await toolHelper.runCmake(["--build", `${buildDir}`, "--config", this.params.debug ? 'Debug' : 'Release', "--", "-quiet", platform]);
        return true;
    }
}
