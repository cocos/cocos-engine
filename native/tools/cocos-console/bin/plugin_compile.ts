
import { CCPlugin, pa, cchelper } from "./cocos_cli";

import * as path from "path";
import * as os from "os";
import * as cocos_cfg from "./cocos_config.json";
import * as child_process from "child_process";
import { afs } from "./afs";
import * as fs from "fs";
const PackageNewConfig = "cocos-project-template.json";

export class CCPluginCOMPILE extends CCPlugin {


    depends():string |null {
        return "generate";
    }

    define_args(): void {
        this.parser.add_predefined_argument("build_dir");
        this.parser.add_predefined_argument("cmake_path");
        this.parser.add_predefined_argument("ios_simulator");
        this.parser.add_predefined_argument("directory");
    }
    init(): boolean {
        if (cocos_cfg.platforms.indexOf(this.get_platform()) < 0) {
            console.error(`invalidate platform "${this.get_platform()}"`);
        }
        return true;
    }

    async run(): Promise<boolean> {
        await this.compile_platform(this.get_platform()!);
        return true;
    }


    async compile_platform(p: string) {
        let c = this.get_current_platform();

        let allow_targets = (cocos_cfg.availableTargetPlatforms as any)[c];
        if (!!!allow_targets) {
            console.error(`current host platform ${c} is not supported.`);
            process.exit(1);
            return;
        }

        if (allow_targets.indexOf(p) < 0) {
            console.error(`target platform "${p}" is not listed [${allow_targets.join(", ")}]`);
            process.exit(1);
            return;
        }

        if (p === "mac") {
            await this.compile_mac();
        } else if (p == "ios") {
            await this.compile_ios();
        } else if (p == "win32") {
            await this.compile_win32();
        } else if (p == "android") {
            await this.compile_android();
        }
    }


    async compile_android() {
        await (new AndroidCompileCMD(this)).compile();
    }

    async compile_ios() {
        await (new IOSCompileCMD(this)).compile();
    }

    async compile_mac() {
        await (new MacCompileCMD(this)).compile();
    }

    async compile_win32() {
        await (new Win32CompileCMD(this)).compile();
    }

}

abstract class PlatformCompileCmd {
    plugin: CCPluginCOMPILE;
    constructor(plugin: CCPluginCOMPILE) {
        this.plugin = plugin;
    }
    abstract async compile(): Promise<boolean>;
}

class IOSCompileCMD extends PlatformCompileCmd {
    async compile() {
        let build_dir = this.plugin.get_build_dir();
        await this.plugin.run_cmake(["--build", `${build_dir}`, "--config", "Debug", "--", "-allowProvisioningUpdates", "-quiet"]);
        return true;
    }
}

class MacCompileCMD extends PlatformCompileCmd {
    async compile() {
        let build_dir = this.plugin.get_build_dir();
        await this.plugin.run_cmake(["--build", `${build_dir}`, "--config", "Debug", "--", "-quiet"]);
        return true;
    }
}


class Win32CompileCMD extends PlatformCompileCmd {
    async compile() {
        let build_dir = this.plugin.get_build_dir();
        await this.plugin.run_cmake(["--build", `${cchelper.fix_path(build_dir)}`, "--config", "Debug", "--", "-verbosity:quiet"]);
        return true;
    }
}

class AndroidCompileCMD extends PlatformCompileCmd {
    async compile() {
        let build_dir = this.plugin.get_build_dir();
        let proj_dir:string = path.join(this.plugin.project_dir!, "frameworks/runtime-src/proj.android-studio");
        if(!fs.existsSync(proj_dir)) {
            console.error(`dir ${proj_dir} not exits`);
            return false;
        }
        let gradle = "gradlew";
        if(this.plugin.get_current_platform() == "win32") {
            gradle += ".bat";
        }
        gradle = path.join(proj_dir, gradle);
        await cchelper.run_cmd(gradle, ["assembleDebug", "--quiet", "--build-cache", "--project-cache-dir",build_dir], false, proj_dir);
        return true;
    }
}