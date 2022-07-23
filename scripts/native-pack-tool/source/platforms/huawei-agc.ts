import * as fs from 'fs-extra';
import * as ps from 'path';

import { AndroidPackTool } from "./android";

export class HuaweiAGCPackTool extends AndroidPackTool {
    /**
     * 共用 android 平台的流程
     * copyPlatformTemplate 拷贝平台模板倒 native/engine 目录下时，重写为从 android 平台的模板拷贝 agc
     */
    protected async copyPlatformTemplate() {
        // 原生工程不重复拷贝 TODO 复用前需要做版本检测
        if (!fs.existsSync(this.paths.nativePrjDir)) {
            // 拷贝 lite 仓库的 templates/android/build 文件到构建输出目录
            await fs.copy(ps.join(this.paths.nativeTemplateDirInCocos, 'android', 'build'), this.paths.nativePrjDir, { overwrite: false });
        }
        // 原生工程不重复拷贝 TODO 复用前需要做版本检测
        if (!fs.existsSync(this.paths.platformTemplateDirInPrj)) {
            // 拷贝 lite 仓库的 templates/android/template 文件到构建输出目录
            await fs.copy(ps.join(this.paths.nativeTemplateDirInCocos, 'android', 'template'), this.paths.platformTemplateDirInPrj, { overwrite: false });
            this.writeEngineVersion();
        } else {
            this.validateNativeDir();
        }
    }
}
