"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cocos_cli_1 = require("./cocos_cli");
const path = require("path");
const cocos_cfg = require("./cocos_config.json");
const fs = require("fs");
const PackageNewConfig = "cocos-project-template.json";
class CCPluginCOMPILE extends cocos_cli_1.CCPlugin {
    depends() {
        return "generate";
    }
    define_args() {
        this.parser.add_predefined_argument("build_dir");
        this.parser.add_predefined_argument("cmake_path");
        this.parser.add_predefined_argument("ios_simulator");
        this.parser.add_predefined_argument("directory");
    }
    init() {
        if (cocos_cfg.platforms.indexOf(this.get_platform()) < 0) {
            console.error(`invalidate platform "${this.get_platform()}"`);
        }
        return true;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.compile_platform(this.get_platform());
            return true;
        });
    }
    compile_platform(p) {
        return __awaiter(this, void 0, void 0, function* () {
            let c = this.get_current_platform();
            let allow_targets = cocos_cfg.availableTargetPlatforms[c];
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
                yield this.compile_mac();
            }
            else if (p == "ios") {
                yield this.compile_ios();
            }
            else if (p == "win32") {
                yield this.compile_win32();
            }
            else if (p == "android") {
                yield this.compile_android();
            }
        });
    }
    compile_android() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (new AndroidCompileCMD(this)).compile();
        });
    }
    compile_ios() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (new IOSCompileCMD(this)).compile();
        });
    }
    compile_mac() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (new MacCompileCMD(this)).compile();
        });
    }
    compile_win32() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (new Win32CompileCMD(this)).compile();
        });
    }
}
exports.CCPluginCOMPILE = CCPluginCOMPILE;
class PlatformCompileCmd {
    constructor(plugin) {
        this.plugin = plugin;
    }
}
class IOSCompileCMD extends PlatformCompileCmd {
    compile() {
        return __awaiter(this, void 0, void 0, function* () {
            let build_dir = this.plugin.get_build_dir();
            yield this.plugin.run_cmake(["--build", `${build_dir}`, "--config", "Debug", "--", "-allowProvisioningUpdates", "-quiet"]);
            return true;
        });
    }
}
class MacCompileCMD extends PlatformCompileCmd {
    compile() {
        return __awaiter(this, void 0, void 0, function* () {
            let build_dir = this.plugin.get_build_dir();
            yield this.plugin.run_cmake(["--build", `${build_dir}`, "--config", "Debug", "--", "-quiet"]);
            return true;
        });
    }
}
class Win32CompileCMD extends PlatformCompileCmd {
    compile() {
        return __awaiter(this, void 0, void 0, function* () {
            let build_dir = this.plugin.get_build_dir();
            yield this.plugin.run_cmake(["--build", `${cocos_cli_1.cchelper.fix_path(build_dir)}`, "--config", "Debug", "--", "-verbosity:quiet"]);
            return true;
        });
    }
}
class AndroidCompileCMD extends PlatformCompileCmd {
    compile() {
        return __awaiter(this, void 0, void 0, function* () {
            let build_dir = this.plugin.get_build_dir();
            let proj_dir = path.join(this.plugin.project_dir, "frameworks/runtime-src/proj.android-studio");
            if (!fs.existsSync(proj_dir)) {
                console.error(`dir ${proj_dir} not exits`);
                return false;
            }
            let gradle = "gradlew";
            if (this.plugin.get_current_platform() == "win32") {
                gradle += ".bat";
            }
            gradle = path.join(proj_dir, gradle);
            yield cocos_cli_1.cchelper.run_cmd(gradle, ["assembleDebug", "--quiet", "--build-cache", "--project-cache-dir", build_dir], false, proj_dir);
            return true;
        });
    }
}
//# sourceMappingURL=plugin_compile.js.map