import * as fs from 'fs-extra';
import * as ps from 'path';

import { AndroidPackTool } from "./android";

export class HuaweiAGCPackTool extends AndroidPackTool {

    // 模板复用 android 平台的
    private readonly _platform: string = 'android';

    /**
     * 拷贝 android 平台模板到 project/native/engine/huawei-agc 目录下
     */
    protected async copyPlatformTemplate() {
        // 原生工程不重复拷贝 TODO 复用前需要做版本检测
        if (!fs.existsSync(this.paths.nativePrjDir)) {
            // 拷贝 lite 仓库的 templates/android/build 文件到构建输出目录
            await fs.copy(ps.join(this.paths.nativeTemplateDirInCocos, this._platform, 'build'), this.paths.nativePrjDir, { overwrite: false });
        }
        // 原生工程不重复拷贝 TODO 复用前需要做版本检测
        if (!fs.existsSync(this.paths.platformTemplateDirInPrj)) {
            // 拷贝 lite 仓库的 templates/android/template 文件到构建输出目录
            await fs.copy(ps.join(this.paths.nativeTemplateDirInCocos, this._platform, 'template'), this.paths.platformTemplateDirInPrj, { overwrite: false });
            this.writeEngineVersion();
            super.firstTimeBuild = true;
        } else {
            this.validateNativeDir();
            super.firstTimeBuild = false;
        }
    }

    /**
     * 校验 engine/template/android 和 project/native/engine/huawei-agc 下的模板文件
     */
    protected validatePlatformDirectory(missing: string[]): void {
        const srcDir = ps.join(this.paths.nativeTemplateDirInCocos, this._platform, 'template');
        const dstDir = this.paths.platformTemplateDirInPrj;
        this.validateDirectory(srcDir, dstDir, missing);
    }
}
