import * as fs from 'fs-extra';
import { CocosParams } from '../base/default';
import { cchelper, toolHelper, Paths } from "../utils";
import { MacOSPackTool } from "./mac-os";

export interface IMacParams {
    bundleId: string;
    skipUpdateXcodeProject: boolean;
}

export class MacPackTool extends MacOSPackTool {
    params!: CocosParams<IMacParams>;

    init(params: CocosParams<IMacParams>) {
        this.params = params;
    }

    async create(): Promise<boolean> {
        await super.create();
        await this.encrypteScripts();
        await this.generate();
        return true;
    }

    async generate() {
        const nativePrjDir = this.paths.nativePrjDir;

        if (!fs.existsSync(nativePrjDir)) {
            cchelper.makeDirectoryRecursive(nativePrjDir);
        }

        const ver = toolHelper.getXcodeMajorVerion() >= 12 ? "12" : "1";
        const cmakeArgs = ['-S', `${this.paths.platformTemplateDirInPrj}`, '-GXcode', '-T', `buildsystem=${ver}`,
                           `-B${nativePrjDir}`, '-DCMAKE_SYSTEM_NAME=Darwin'];
        this.appendCmakeResDirArgs(cmakeArgs);

        await toolHelper.runCmake(cmakeArgs);

        this.skipUpdateXcodeProject();
        return true;
    }

    async make() {
        const nativePrjDir = this.paths.nativePrjDir;

        const platform = this.isAppleSilicon() ? `-arch arm64` : `-arch x86_64`;
        await toolHelper.runCmake(["--build", `${nativePrjDir}`, "--config", this.params.debug ? 'Debug' : 'Release', "--", "-quiet", platform]);
        return true;
    }
}
