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
const os = require("os");
const cocos_cfg = require("./cocos_config.json");
const child_process = require("child_process");
const afs_1 = require("./afs");
const PackageNewConfig = "cocos-project-template.json";
class CCPluginGENERATE extends cocos_cli_1.CCPlugin {
    depends() {
        // return "new"; // recreate project file will override everything
        return null;
    }
    define_args() {
        this.parser.add_required_predefined_argument("build_dir");
        this.parser.add_required_predefined_argument("directory");
        this.parser.add_predefined_argument("cmake_generator");
        this.parser.add_predefined_argument("cmake_path");
        this.parser.add_predefined_argument("ios_simulator");
        this.parser.add_predefined_argument("teamid");
        this.parser.add_predefined_argument_with_default("template_name", "link");
    }
    init() {
        if (cocos_cfg.platforms.indexOf(this.get_platform()) < 0) {
            console.error(`invalidate platform "${this.get_platform()}"`);
        }
        return true;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let arg_p = this.parser.get_string("platform");
            if (!arg_p) {
                let ps = cocos_cfg["defaultGeneratePlatforms"][this.get_current_platform()];
                for (let p of ps) {
                    yield this.generate_platform(p);
                }
            }
            else {
                yield this.generate_platform(arg_p);
            }
            return true;
        });
    }
    generate_platform(p) {
        return __awaiter(this, void 0, void 0, function* () {
            let c = this.get_current_platform();
            if (p == "ios-simulator") {
                p = "ios";
                this.set_platform("ios");
                this.extend_argv(["--ios-simulator"]);
                this.args.set_bool("ios_simulator", true);
            }
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
                yield this.generate_mac();
            }
            else if (p == "ios") {
                yield this.generate_ios();
            }
            else if (p == "win32") {
                yield this.generate_win32();
            }
            else if (p == "android") {
                yield this.generate_android();
            }
        });
    }
    generate_android() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    generate_ios() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (new IOSGenerateCMD(this)).generate();
        });
    }
    generate_mac() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (new MacGenerateCMD(this)).generate();
        });
    }
    generate_win32() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (new Win32GenerateCMD(this)).generate();
        });
    }
}
exports.CCPluginGENERATE = CCPluginGENERATE;
class PlatformGenerateCmd {
    constructor(plugin) {
        this.plugin = plugin;
    }
    get project_src_dir() {
        return cocos_cli_1.cchelper.join(this.plugin.project_dir, "..", `common-${this.plugin.args.get_string("template_name")}`);
    }
    append_cmake_res_dir_args(args) {
        args.push(`-DRES_DIR="${cocos_cli_1.cchelper.fix_path(this.plugin.project_dir)}"`);
    }
}
class IOSGenerateCMD extends PlatformGenerateCmd {
    generate() {
        return __awaiter(this, void 0, void 0, function* () {
            let build_dir = this.plugin.get_build_dir();
            if (!(yield afs_1.afs.exists(cocos_cli_1.cchelper.join(this.project_src_dir, "CMakelists.txt")))) {
                throw new Error(`CMakeLists.txt not found in ${this.project_src_dir}`);
            }
            if (!(yield afs_1.afs.exists(build_dir))) {
                cocos_cli_1.cchelper.make_directory_recursive(build_dir);
            }
            let osx_sysroot = "iphoneos";
            let ext = [];
            if (this.plugin.enable_ios_simulator()) {
                osx_sysroot = "iphonesimulator";
                ext.push("-DCMAKE_OSX_ARCHITECTURES=x86_64");
            }
            else {
                ext.push("-DCMAKE_OSX_ARCHITECTURES=arm64");
            }
            let teamid = this.plugin.get_app_team_id();
            if (teamid) {
                ext.push(`-DDEVELOPMENT_TEAM=${teamid}`);
            }
            this.append_cmake_res_dir_args(ext);
            const do_build = false;
            if (do_build) {
                if (!this.plugin.enable_ios_simulator() && !teamid) {
                    console.error(`can not build ios without teamid`);
                    process.exit(1);
                }
            }
            yield this.plugin.run_cmake(["-S", `${this.project_src_dir}`, "-GXcode", `-B${build_dir}`, "-DCMAKE_SYSTEM_NAME=iOS", `-DCMAKE_OSX_SYSROOT=${osx_sysroot}`].concat(ext));
            if (do_build) {
                yield this.plugin.run_cmake(["--build", `${build_dir}`, "--config", "Debug", "--", "-allowProvisioningUpdates"]);
            }
            return true;
        });
    }
}
class MacGenerateCMD extends PlatformGenerateCmd {
    generate() {
        return __awaiter(this, void 0, void 0, function* () {
            let build_dir = this.plugin.get_build_dir();
            if (!(yield afs_1.afs.exists(cocos_cli_1.cchelper.join(this.project_src_dir, "CMakelists.txt")))) {
                throw new Error(`CMakeLists.txt not found in ${this.project_src_dir}`);
            }
            if (!(yield afs_1.afs.exists(build_dir))) {
                cocos_cli_1.cchelper.make_directory_recursive(build_dir);
            }
            let cmake_args = ["-S", `${this.project_src_dir}`, "-GXcode", `-B${build_dir}`, "-DCMAKE_SYSTEM_NAME=Darwin"];
            this.append_cmake_res_dir_args(cmake_args);
            yield this.plugin.run_cmake(cmake_args);
            return true;
        });
    }
}
class Win32GenerateCMD extends PlatformGenerateCmd {
    win32_select_cmake_generator_args() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`selecting visual studio generator ...`);
            const visualstudio_generators = cocos_cfg.cmake.win32.generators;
            let test_proj_dir = yield afs_1.afs.mkdtemp(cocos_cli_1.cchelper.join(os.tmpdir(), "cmake_test_"));
            let test_cmake_lists_path = cocos_cli_1.cchelper.join(test_proj_dir, "CMakeLists.txt");
            let test_cpp_file = cocos_cli_1.cchelper.join(test_proj_dir, "test.cpp");
            {
                let cmake_content = `
            cmake_minimum_required(VERSION 3.8)
            set(APP_NAME test-cmake)
            project(\${APP_NAME} CXX)
            add_library(\${APP_NAME} test.cpp)
            `;
                let cpp_src = `
            #include<iostream>
            int main(int argc, char **argv)
            {
                std::cout << "Hello World" << std::endl;
                return 0;
            }
            `;
                yield afs_1.afs.writeFile(test_cmake_lists_path, cmake_content);
                yield afs_1.afs.writeFile(test_cpp_file, cpp_src);
            }
            let try_run_cmake_with_arguments = (args, workdir) => {
                return new Promise((resolve, reject) => {
                    let cp = child_process.spawn(this.plugin.get_cmake_path(), args, {
                        cwd: workdir,
                        env: process.env,
                        shell: true
                    });
                    cp.on("close", (code, sig) => {
                        if (code != 0) {
                            resolve(false);
                            return;
                        }
                        resolve(true);
                    });
                });
            };
            let available_generators = [];
            for (let cfg of visualstudio_generators) {
                let build_dir = cocos_cli_1.cchelper.join(test_proj_dir, `build_${cfg.G.replace(/ /g, "_")}`);
                let args = [`-S"${test_proj_dir}"`, `-G"${cfg.G}"`, `-B"${build_dir}"`];
                if ("A" in cfg) {
                    args.push("-A", cfg.A);
                }
                yield afs_1.afs.mkdir(build_dir);
                if (yield try_run_cmake_with_arguments(args, build_dir)) {
                    available_generators.push(cfg.G);
                    break;
                }
                yield cocos_cli_1.cchelper.remove_directory_recursive(build_dir);
            }
            yield cocos_cli_1.cchelper.remove_directory_recursive(test_proj_dir);
            let ret = [];
            if (available_generators.length == 0) {
                return []; // use cmake default option -G
            }
            let opt = visualstudio_generators.filter(x => x.G == available_generators[0])[0];
            for (let k in opt) {
                ret.push(`-${k}"${opt[k]}"`);
            }
            console.log(` using ${opt.G}`);
            return ret;
        });
    }
    generate() {
        return __awaiter(this, void 0, void 0, function* () {
            let build_dir = this.plugin.get_build_dir();
            if (!(yield afs_1.afs.exists(cocos_cli_1.cchelper.join(this.project_src_dir, "CMakelists.txt")))) {
                throw new Error(`CMakeLists.txt not found in ${this.project_src_dir}`);
            }
            if (!(yield afs_1.afs.exists(build_dir))) {
                cocos_cli_1.cchelper.make_directory_recursive(build_dir);
            }
            let g = this.plugin.get_cmake_generator();
            let generate_args = [];
            if (g) {
                let optlist = cocos_cfg.cmake.win32.generators.filter(x => x.G.toLowerCase() == g.toLowerCase());
                if (optlist.length == 0) {
                    generate_args.push(`-G"${g}"`);
                }
                else {
                    let opt = optlist[0];
                    for (let t of opt) {
                        generate_args.push(`-${t}"${opt[t]}"`);
                    }
                }
            }
            else {
                generate_args = generate_args.concat(yield this.win32_select_cmake_generator_args());
            }
            this.append_cmake_res_dir_args(generate_args);
            yield this.plugin.run_cmake([`-S"${cocos_cli_1.cchelper.fix_path(this.project_src_dir)}"`, `-B"${cocos_cli_1.cchelper.fix_path(build_dir)}"`].concat(generate_args));
            return true;
        });
    }
}
//# sourceMappingURL=plugin_generate.js.map