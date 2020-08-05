import { CCPlugin, pa, cchelper } from "./cocos_cli";

import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import * as cocos_cfg from "./cocos_config.json";
import * as cocos_project from "./cocos_project_types";
import * as cocos2dx_files from "../../../templates/cocos2dx_files.json";
import * as child_process from "child_process";
import { afs } from "./afs";

const PackageNewConfig = "cocos-project-template.json";

export class CCPluginRUN extends CCPlugin {

    depends(): string | null {
        return "compile";
    }

    define_args(): void {
        this.parser.add_required_predefined_argument("build_dir");
        this.parser.add_predefined_argument("cmake_path");
        this.parser.add_predefined_argument("ios_simulator");
    }
    init(): boolean {
        return true;
    }
    async run(): Promise<boolean> {
        let platform: string = this.get_platform();
        let build_dir: string = this.get_build_dir();
        let project_name: string | undefined = this.get_project_name_from_cmake();
        if (platform == "mac") {
            return (new MacRunCMD(this)).run()
        } else if (platform == "ios") {
            return (new IOSRunCMD(this)).run();
        } else if (platform == "android") {
            return (new AndroidRunCMD(this)).run();
        } else if (platform == "win32") {
            return (new Win32RunCMD(this)).run();
        }
        return true;
    }

    get_project_name_from_cmake(): string | undefined {
        let cmake_cache = path.join(this.get_build_dir(), "CMakeCache.txt");
        if (!fs.existsSync(cmake_cache)) {
            console.error(`can not find "CMakeCache.txt" in ${this.get_build_dir()}, please run "cmake -G" first`);
        }
        let project_name = cchelper.exact_value_from_file(/CMAKE_PROJECT_NAME:\w+=(.*)/, cmake_cache, 1);
        return project_name;
    }
}


abstract class PlatformRunCmd {
    plugin: CCPluginRUN;
    constructor(plugin: CCPluginRUN) {
        this.plugin = plugin;
    }
    abstract async run(): Promise<boolean>;

    get project_name(): string | undefined {
        return this.plugin.get_project_name_from_cmake();
    }
}


class MacRunCMD extends PlatformRunCmd {
    async run(): Promise<boolean> {
        this.mac_run(this.project_name!);
        return true;
    }

    private mac_open(app: string) {
        console.log(`open ${app}`);
        let cp = child_process.spawn(`open`, [app], {
            shell: true,
            env: process.env
        });
        cp.stdout.on("data", (data) => {
            console.log(`[open app] ${data}`);
        });
        cp.stderr.on(`data`, (data) => {
            console.error(`[open app error] ${data}`);
        });
        cp.on("close", (code, sig) => {
            console.log(`${app} exit with ${code}, sig: ${sig}`);
        });
    }

    private mac_run(project_name?: string) {

        let debug_dir = path.join(this.plugin.get_build_dir(), "Debug");
        if (!fs.existsSync(debug_dir)) {
            console.log(`[mac run] ${debug_dir} is not exist!`);
            process.exit(1);
        }
        let app_path: string;
        if (project_name) {
            app_path = path.join(debug_dir, `${project_name}-desktop.app`);
            if (fs.existsSync(app_path)) {
                this.mac_open(app_path);
                return;
            }
        }

        let app_list = fs.readdirSync(debug_dir).filter(x => x.endsWith(".app"));
        if (app_list.length == 1) {
            return this.mac_open(path.join(debug_dir, app_list[0]));
        }
        console.error(`found ${app_list.length} apps, failed to open.`);
        process.exit(1);
    }

}

class IOSRunCMD extends PlatformRunCmd {
    run(): Promise<boolean> {
        if (this.plugin.enable_ios_simulator()) {
            return this.run_ios_simulator();
        } else {
            return this.run_ios_device();
        }
    }

    select_simulator_id(): string {
        let iphones = child_process.execSync("xcrun instruments -s").toString("utf-8").split("\n").filter(x => x.startsWith("iPhone") && x.indexOf("Simulator") >= 0);
        const exact = (l: string) => {
            l = l.split("[")[0].substr(6);
            return parseInt(l) * 100 + l.length;
        }
        let ret = iphones.filter(x => x.indexOf("Apple Watch") < 0).sort((a, b) => {
            return exact(b) - exact(a);
        })[0];
        let m = ret.match(/iPhone\s*[^\[]*\[([^\]]*)\].*/);
        console.log(`selected simualtor ${ret}`);
        return m![1];
    }

    select_ios_devices(): string[] {
        let lines = child_process.execSync(`xcrun simctl list`).toString("utf-8").split("\n");

        let readDevices = (lines: string[], idx: number): number => {
            while (idx < lines.length && !lines[idx].match(/== Devices ==/)) {
                idx++;
            }
            return idx < lines.length ? idx : -1;
        }

        let readIOSDevices = (list: string[], idx: number): string[] => {
            let ret: string[] = [];
            while (!list[idx].match(/-- iOS [^ ]* --/)) {
                idx++;
            }
            if (list[idx].indexOf("iOS") < 0) {
                console.error(`can not find iOS section!`);
                return ret;
            }
            idx++;
            while (list[idx].startsWith(" ")) {
                ret.push(list[idx++]);
            }
            return ret.map(x => x.trim());
        };

        let idx = readDevices(lines, 0);
        if (idx < 0) {
            console.error(`can not find devices section!`);
            return [];
        }

        let list = readIOSDevices(lines, idx);
        let ret = list.filter(x => x.startsWith("iPhone"));
        return ret;
    }

    read_bundle_id():string|null {
        let prj_name = this.project_name!;
        let cmake_tmp_dir = fs.readdirSync(path.join(this.plugin.get_build_dir(), "CMakeFiles")).filter(x=>x.startsWith(prj_name))[0];

        let infoPlist = path.join(this.plugin.get_build_dir(), "CMakeFiles", cmake_tmp_dir, "Info.plist");
        if(fs.existsSync(infoPlist)) {
            let lines = fs.readFileSync(infoPlist).toString("utf-8").split("\n");
            for(let i = 0;i< lines.length;i++) {
                if (lines[i].match(/CFBundleIdentifier/)) {
                    i++;
                    while(!lines[i].match(/<string>/)){
                        i++;
                    }
                    let m = lines[i].match(/<string>([^<]*)<\/string>/);
                    return m![1];
                } 
            }
        }else{
            console.error(`Info.plist not found ${infoPlist}`);
        }
        return null;
    }

    query_ios_device():string|null {
        let lines = child_process.execSync(`xcrun instruments -s devices`).toString("utf-8").split("\n");
        let ret:string[] = [];
        //skip first line
        for(let i = 1; i< lines.length; i++) {
            if(lines[i].endsWith("(Simulator)")){
                continue;
            }else if(lines[i].match(/iPhone|iPad|iPod/)) {
                ret.push(lines[i]);
            }
        }
        if(ret.length > 0) {
            console.log(`select ios device ${ret[0]}`);
            return ret[0].match(/[^\[]]*\[([^\]]*)\]/)![1];
        }
        return null;
    }

    async run_ios_device(): Promise<boolean> {
        let build_dir = this.plugin.get_build_dir();
        let foudn_aps =  child_process.execSync(`find ${build_dir} -name "*.app"`).toString("utf-8").split("\n").filter(x => x.trim().length > 0);
        let device_id = this.query_ios_device();
        if(!device_id) {
            console.error(`no connected device found!`);
            return false;
        }
        if(foudn_aps.length > 0) {
            let cwd = fs.mkdtempSync(path.join(os.tmpdir(), this.project_name!));
            await cchelper.run_cmd(`xcrun`, ["instruments", "-t", "Blank", "-w", device_id, foudn_aps[0]], false, 
                cwd);
        }
        return true;
    }

    async run_ios_simulator(): Promise<boolean> {
        let sim_id = this.select_simulator_id();
        let build_dir = this.plugin.get_build_dir();
        let bundle_id = this.read_bundle_id();
        console.log(` - build dir ${build_dir} - sim_id ${sim_id}`);
        console.log(` - bundle id ${bundle_id}`);

        let found_apps = child_process.execSync(`find ${build_dir} -name "*.app"`).toString("utf-8").split("\n").filter(x => x.trim().length > 0);

        if (found_apps.length > 0 && bundle_id) {

            await cchelper.run_cmd("xcrun", ["simctl", "boot", sim_id], true);
            await cchelper.run_cmd("open", ["`xcode-select -p`/Applications/Simulator.app"], true);
            await cchelper.run_cmd("xcrun", ["simctl", "boot", sim_id], true);
            await cchelper.run_cmd("xcrun", ["simctl", "install", sim_id, found_apps[0].trim()], false);
            await cchelper.run_cmd("xcrun", ["simctl", "launch", sim_id, `"${bundle_id}"`], false);
        }
        return false;
    }

}
class Win32RunCMD extends PlatformRunCmd {
    run(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}

class AndroidRunCMD extends PlatformRunCmd {
    run(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}