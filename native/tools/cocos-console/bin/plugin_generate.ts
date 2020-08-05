
import { CCPlugin, pa, cchelper } from "./cocos_cli";

import * as path from "path";
import * as os from "os";
import * as cocos_cfg from "./cocos_config.json";
import * as child_process from "child_process";
import { afs } from "./afs";
const PackageNewConfig = "cocos-project-template.json";

export class CCPluginGENERATE extends CCPlugin {

    depends():string |null {
       // return "new"; // recreate project file will override everything
       return null;
    }

    define_args(): void {
        this.parser.add_required_predefined_argument("build_dir");
        this.parser.add_required_predefined_argument("directory");
        this.parser.add_predefined_argument("cmake_generator");
        this.parser.add_predefined_argument("cmake_path");
        this.parser.add_predefined_argument("ios_simulator");
        this.parser.add_predefined_argument("teamid");
        this.parser.add_predefined_argument_with_default("template_name", "link");
    }
    init(): boolean {
        if (cocos_cfg.platforms.indexOf(this.get_platform()) < 0) {
            console.error(`invalidate platform "${this.get_platform()}"`);
        }
        return true;
    }

    async run(): Promise<boolean> {

        let arg_p = this.parser.get_string("platform");
        if(!arg_p) {
            let ps = (cocos_cfg as any)["defaultGeneratePlatforms"][this.get_current_platform()];
            for(let p of ps){
                await this.generate_platform(p);
            }
        }else{
            await this.generate_platform(arg_p);
        }
        return true;
    }


    async generate_platform(p: string) {
        let c = this.get_current_platform();

        if(p == "ios-simulator") {
            p = "ios";
            this.set_platform("ios");
            this.extend_argv(["--ios-simulator"]);
            this.args.set_bool("ios_simulator", true);
        }

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
            await this.generate_mac();
        } else if (p == "ios") {
            await this.generate_ios();
        } else if (p == "win32") {
            await this.generate_win32();
        } else if (p == "android") {
            await this.generate_android();
        }
    }

    async generate_android() {

    }

    async generate_ios() {
        await (new IOSGenerateCMD(this)).generate();
    }

    async generate_mac() {
        await (new MacGenerateCMD(this)).generate();
    }

    async generate_win32() {
        await (new Win32GenerateCMD(this)).generate();
    }

}

abstract class PlatformGenerateCmd {
    plugin: CCPluginGENERATE;
    constructor(plugin: CCPluginGENERATE) {
        this.plugin = plugin;
    }
    
    abstract async generate(): Promise<boolean>;

    get project_src_dir():string {
        return cchelper.join(this.plugin.project_dir!, "..", `common-${this.plugin.args.get_string("template_name")}`);
    }
}

class IOSGenerateCMD extends PlatformGenerateCmd {
    async generate() {
        let build_dir = this.plugin.get_build_dir();

        if (!(await afs.exists(cchelper.join(this.project_src_dir, "CMakelists.txt")))) {
            throw new Error(`CMakeLists.txt not found in ${this.project_src_dir}`);
        }

        if (!(await afs.exists(build_dir))) {
            cchelper.make_directory_recursive(build_dir);
        }

        let osx_sysroot = "iphoneos";
        let ext:string[] = [];
        if(this.plugin.enable_ios_simulator()){
            osx_sysroot = "iphonesimulator";
            ext.push("-DCMAKE_OSX_ARCHITECTURES=x86_64")
        }else{
            ext.push("-DCMAKE_OSX_ARCHITECTURES=arm64")
        }

        let teamid = this.plugin.get_app_team_id();
        if(teamid) {
            ext.push(`-DDEVELOPMENT_TEAM=${teamid}`);
        }

        const do_build = false;
        if(do_build) {
            if(!this.plugin.enable_ios_simulator() && !teamid) {
                console.error(`can not build ios without teamid`);
                process.exit(1);
            }
        }

        await this.plugin.run_cmake(["-S", `${this.project_src_dir}`, "-GXcode", `-B${build_dir}`, "-DCMAKE_SYSTEM_NAME=iOS", `-DCMAKE_OSX_SYSROOT=${osx_sysroot}`].concat(ext));
        if(do_build) {
            await this.plugin.run_cmake(["--build", `${build_dir}`, "--config", "Debug", "--", "-allowProvisioningUpdates"]);
        }
        return true;
    }
}

class MacGenerateCMD extends PlatformGenerateCmd {
    async generate() {
        let build_dir = this.plugin.get_build_dir();

        if (!(await afs.exists(cchelper.join(this.project_src_dir, "CMakelists.txt")))) {
            throw new Error(`CMakeLists.txt not found in ${this.project_src_dir}`);
        }

        if (!(await afs.exists(build_dir))) {
            cchelper.make_directory_recursive(build_dir);
        }

        await this.plugin.run_cmake(["-S", `${this.project_src_dir}`, "-GXcode", `-B${build_dir}`, "-DCMAKE_SYSTEM_NAME=Darwin"])
        return true;
    }
}


class Win32GenerateCMD extends PlatformGenerateCmd {

    async win32_select_cmake_generator_args(): Promise<string[]> {

        console.log(`selecting visual studio generator ...`);
        const visualstudio_generators = cocos_cfg.cmake.win32.generators;

        let test_proj_dir = await afs.mkdtemp(cchelper.join(os.tmpdir(), "cmake_test_"));
        let test_cmake_lists_path = cchelper.join(test_proj_dir, "CMakeLists.txt");
        let test_cpp_file = cchelper.join(test_proj_dir, "test.cpp");
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
            `
            await afs.writeFile(test_cmake_lists_path, cmake_content);
            await afs.writeFile(test_cpp_file, cpp_src);
        }

        let try_run_cmake_with_arguments = (args: string[], workdir: string) => {
            return new Promise<boolean>((resolve, reject) => {
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
        }
        let available_generators: string[] = [];
        for (let cfg of visualstudio_generators) {
            let build_dir = cchelper.join(test_proj_dir, `build_${cfg.G.replace(/ /g, "_")}`);
            let args: string[] = [`-S"${test_proj_dir}"`, `-G"${cfg.G}"`, `-B"${build_dir}"`];
            if ("A" in cfg) {
                args.push("-A", cfg.A!)
            }
            await afs.mkdir(build_dir);
            if (await try_run_cmake_with_arguments(args, build_dir)) {
                available_generators.push(cfg.G);
                break;
            }
            await cchelper.remove_directory_recursive(build_dir);
        }
        await cchelper.remove_directory_recursive(test_proj_dir);

        let ret: string[] = [];
        if (available_generators.length == 0) {
            return []; // use cmake default option -G
        }
        let opt = visualstudio_generators.filter(x => x.G == available_generators[0])[0];
        for (let k in opt) {
            ret.push(`-${k}"${(opt as any)[k]}"`);
        }
        console.log(` using ${opt.G}`)
        return ret;
    }



    async generate() {
        let build_dir = this.plugin.get_build_dir();

        if (!(await afs.exists(cchelper.join(this.project_src_dir, "CMakelists.txt")))) {
            throw new Error(`CMakeLists.txt not found in ${this.project_src_dir}`);
        }

        if (!(await afs.exists(build_dir))) {
            cchelper.make_directory_recursive(build_dir);
        }

        let g = this.plugin.get_cmake_generator();
        let generate_args: string[] = [];
        if (g) {
            let optlist = cocos_cfg.cmake.win32.generators.filter(x => x.G.toLowerCase() == g!.toLowerCase());
            if (optlist.length == 0) {
                generate_args.push(`-G"${g}"`);
            } else {
                let opt = optlist[0] as any;
                for (let t of opt) {
                    generate_args.push(`-${t}"${opt[t]}"`);
                }
            }
        } else {
            generate_args = generate_args.concat(await this.win32_select_cmake_generator_args());
        }
        await this.plugin.run_cmake([`-S"${cchelper.fix_path(this.project_src_dir)}"`, `-B"${cchelper.fix_path(build_dir)}"`].concat(generate_args));
        return true;
    }
}