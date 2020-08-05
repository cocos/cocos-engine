

import * as fs from "fs";
import * as path from "path";
import * as ml from "./multi_language";
import * as cocos_cfg from "./cocos_config.json";
import * as os from "os";
import { afs } from "./afs";
import * as child_process from "child_process";

enum ArgumentItemType {
    BOOL_FLAG,
    STRING_VALUE,
    ACTION,
    ENUM,
}

interface ArgumentConfig {
    short: string;
    long: string;
    field?: string;
    help: string;
    arg_type: ArgumentItemType;
    action?: () => void;
    enum_values?: string[];
    required: boolean;
    default_value?: string;
}

/** pre-defined arguments */
export const pa = {
    help: { short: "-h", long: "--help", help: "show this message", arg_type: ArgumentItemType.ACTION },
    src_dir: { short: "-s", long: "--src", help: ml.get_string("COCOS_HELP_ARG_SRC"), arg_type: ArgumentItemType.STRING_VALUE },
    quiet: { short: '-q', long: "--quiet", help: ml.get_string("COCOS_HELP_ARG_PLATFORM"), arg_type: ArgumentItemType.BOOL_FLAG },
    platform: { short: "-p", long: "--platform", help: ml.get_string("COCOS_HELP_ARG_PLATFORM"), arg_type: ArgumentItemType.ENUM, enum_values: cocos_cfg.platforms },
    do_list_platforms: { short: "", long: "--list-platforms", help: "list available platforms", arg_type: ArgumentItemType.ACTION },
    proj_dir: { short: "", long: "--proj-dir", help: ml.get_string("COCOS_HELP_ARG_PROJ_DIR"), arg_type: ArgumentItemType.STRING_VALUE },
    build_dir: { short: "", long: "--build-dir", help: "specify directory where to build project", arg_type: ArgumentItemType.STRING_VALUE },
    package_name: { short: "-p", long: "--package", help: ml.get_string("NEW_ARG_PACKAGE"), arg_type: ArgumentItemType.STRING_VALUE },
    directory: { short: "-d", long: "--directory", help: ml.get_string("NEW_ARG_DIR"), arg_type: ArgumentItemType.STRING_VALUE },
    ios_bundleid: { short: "", long: "--ios-bundleid", help: ml.get_string("NEW_ARG_IOS_BUNDLEID"), arg_type: ArgumentItemType.STRING_VALUE },
    mac_bundleid: { short: "", long: "--mac-bundleid", help: ml.get_string("NEW_ARG_MAC_BUNDLEID"), arg_type: ArgumentItemType.STRING_VALUE },
    engine_path: { short: "-e", long: "--engine-path", help: ml.get_string("NEW_ARG_ENGINE_PATH"), arg_type: ArgumentItemType.STRING_VALUE },
    portrait: { short: "", long: "--portrait", help: ml.get_string("NEW_ARG_PORTRAIT"), arg_type: ArgumentItemType.BOOL_FLAG },
    no_native: { short: "", long: "--no-native", help: ml.get_string("NEW_ARG_NO_NATIVE"), arg_type: ArgumentItemType.BOOL_FLAG },
    language: { short: "-l", long: "--language", help: ml.get_string("NEW_ARG_LANG"), arg_type: ArgumentItemType.ENUM, enum_values: cocos_cfg.languages },
    do_list_templates: { short: "", long: "--list-templates", help: "List available templates. To be used with --template option.", arg_type: ArgumentItemType.ACTION },
    template_name: { short: "-k", long: "--template-name", help: 'Name of the template to be used to create the game. To list available names, use --list-templates.', arg_type: ArgumentItemType.STRING_VALUE },
    cmake_generator: { short: "-G", long: "--cmake-generator", help: "Set cmake generator", arg_type: ArgumentItemType.STRING_VALUE },
    cmake_path: { short: "", long: "--cmake-path", help: "path to cmake.exe or cmake", arg_type: ArgumentItemType.STRING_VALUE },
    ios_simulator: { short: "", long: "--ios-simulator", help: "enable iOS simulator support", arg_type: ArgumentItemType.BOOL_FLAG },
    teamid: { short: "", long: "--team-id", help: "Apple developer team id", arg_type: ArgumentItemType.STRING_VALUE },
    shared_dir: { short: "", long: "--shared-dir", help: "Shared source directory", arg_type: ArgumentItemType.STRING_VALUE },
};




class ArgumentParser {
    private definations: ArgumentConfig[] = [];

    private values: { [key: string]: (string | boolean | { (): void }) } = {};
    private other_values: string[] = [];

    add_argument(short: string, long: string, field: string, arg_type: ArgumentItemType, help: string, enum_values: string[], required: boolean, action?: () => void, default_value?: string): ArgumentConfig {
        if (short.length != 0 && (!short.startsWith("-") || short.length != 2)) {
            console.error(`short argument ${short} format incorrect!`);
        }
        if (!long.startsWith("--")) {
            console.error(`long argument ${long} format incorrect!`);
        }
        let item = { short, long, help, arg_type, field, enum_values, action, required, default_value };
        this.definations.push(item);
        return item;
    }

    add_predefined_argument(field: string, action?: () => void): ArgumentConfig | undefined {
        let item = (pa as any)[field];
        if (item) {
            return this.add_argument(item.short, item.long, field, item.arg_type, item.help, item.enum_values, false, action);
        } else {
            console.error(`Predefiend argument "${field}" is not found!`)
        }
    }

    add_predefined_argument_with_default(field: string, default_value: string): ArgumentConfig | undefined {
        let item = (pa as any)[field];
        if (item) {
            return this.add_argument(item.short, item.long, field, item.arg_type, item.help, item.enum_values, false, undefined, default_value);
        } else {
            console.error(`Predefiend argument "${field}" is not found!`)
        }
    }

    add_required_predefined_argument(field: string, action?: () => void): ArgumentConfig | undefined {
        let item = (pa as any)[field];
        if (item) {
            return this.add_argument(item.short, item.long, field, item.arg_type, item.help, item.enum_values, true, action);
        } else {
            console.error(`Predefiend argument "${field}" is not found!`)
        }
    }

    parse(list: string[]) {

        let cfgs: ArgumentConfig[] = [];
        for (let i = 0; i < list.length; i++) {
            let line = list[i];
            cfgs.length = 0;
            let prefix: string;
            if (line.startsWith("--")) {
                let p1: string = line;
                if (line.match(/^--[-_a-z]+=/)) { // contains `=` --template-name=
                    p1 = line.split("=")[0];
                }
                cfgs = this.definations.filter(x => x.long == p1).sort((a, b) => a.long.length - b.long.length);
                if (cfgs.length > 0) prefix = cfgs[0].long;
            } else if (line.startsWith("-")) {
                cfgs = this.definations.filter(x => x.short.length > 0 && line == x.short);
                if (cfgs.length > 0) prefix = cfgs[0].short;
            } else {
                this.other_values.push(line);
                continue;
            }


            if (cfgs.length > 0) {
                if (cfgs.length > 1) {
                    console.error(`multiple argument match ${line}`);
                    break;
                }
                const cfg = cfgs[0];
                if (cfg.arg_type == ArgumentItemType.BOOL_FLAG) {
                    this.values[cfg.field!] = true;
                    if (line.length > prefix!.length) {
                        console.warn(`argument ${line} too long?`)
                    }
                } else if (cfg.arg_type == ArgumentItemType.STRING_VALUE || cfg.arg_type == ArgumentItemType.ENUM) {

                    if (line.length == prefix!.length) {
                        if (list[i + 1] == undefined || list[i + 1].startsWith("-")) {
                            console.warn(`argument "${prefix!}" is not provided with value?`)
                        }
                        this.values[cfg.field!] = list[i + 1];
                        i++;
                        continue;
                    }
                    if (line.length > prefix!.length) {
                        let value = line.substr(prefix!.length);
                        this.values[cfg.field!] = value[0] === "=" ? value.substr(1) : value;
                        continue;
                    }
                } else if (cfg.arg_type == ArgumentItemType.ACTION) {
                    this.values[cfg.field!] = cfg.action!;
                }
            } else {
                console.warn(`unknown argument: ${line}`)
            }
        }
    }

    private defination_for(key: string): ArgumentConfig | null {
        let list = this.definations.filter(x => x.field == key);
        if (list.length > 1) {
            console.warn(`multiply command line argument definations for "${key}"`);
        } else if (list.length == 0) {
            console.error(`no command line argument defination for "${key}" found!`);
            return null;
        }
        return list[0];
    }

    public get_bool(key: string): boolean {
        return (this.values[key] as boolean) === true;
    }

    public set_bool(key:string, value:boolean) {
        this.values[key] = value;
    }

    public get_path(key: string): string {
        if (!(key in this.values)) {
            console.log(`[warn] argument ${key} not set!`);
        }
        return (key in this.values) ? this.values[key] as string : this.defination_for(key)!.default_value!;
    }

    public get_string(key: string): string {
        if (!(key in this.values)) {
            console.log(`[warn] argument ${key} not set!`);
        }
        return this.get_path(key);
    }

    public set_string(key:string, v:string) {
        this.values[key] = v;
    }

    public exist_key(key: string): boolean {
        return key in this.values;
    }

    public call(key: string): void {
        if (typeof this.values[key] === "function") {
            (this.values[key] as any).apply();
        } else {
            console.log(`[warn] argument value of ${key} is not a function`)
        }
    }

    public call_all(): boolean {
        for (let key in this.values) {
            let f = this.values[key];
            if (typeof (f) === "function") {
                (f as any).call();
                return true;
            }
        }
        return false;
    }

    public get_otherargs(): string[] {
        return this.other_values;
    }

    public print() {
        console.log("Usage:")
        for (let i of this.definations) {
            console.log(` ${i.short.length == 0 ? "" : i.short + ", "}${i.long} \t: ${i.help}`);
        }
    }

    public validate() {
        for (let key in this.values) {
            // validate enums
            let v = this.values[key];
            let defs = this.definations.filter(x => x.field == key);
            if (defs.length > 0) {
                if (defs[0].arg_type == ArgumentItemType.ENUM) {
                    if (!defs[0].enum_values!.includes(v as string)) {
                        console.error(` incorrect argument "${defs[0].long} ${v}", expect "${defs[0].enum_values!.join(",")}"`);
                    }
                }
            }
        }

        for (let d of this.definations) {
            if (d.required && !(d.field! in this.values)) {
                console.error(` required argument ${d.long} is not provided!`);
            }
        }
    }
}


export abstract class CCPlugin {
    private _cocos2d_path: string | null = null;
    private _template_path: string | null = null;
    private _plugin_name: string | null = null;
    private ext_args:string[] = [];

    parser: ArgumentParser = new ArgumentParser();

    extend_argv(args:string[]) {
        this.ext_args = this.ext_args.concat(args);
    }

    get_cocos_root(): string | null {

        let engine_path = this.get_engine_path();
        if (!!engine_path) {
            return engine_path;
        }

        if (!this._cocos2d_path) {
            this._cocos2d_path = path.join(__dirname, "../../..");
            if (!fs.existsSync(path.join(this._cocos2d_path, "cocos"))) {
                console.warn(ml.get_string("COCOS_WARNING_ENGINE_NOT_FOUND"));
                this._cocos2d_path = null;
            }
        }
        return this._cocos2d_path;
    }

    get_consle_root(): string {
        let engine_path = this.get_engine_path();
        if (!!engine_path) {
            return path.join(engine_path, "tools/cocos-console");
        }

        return path.join(__dirname, "..");
    }

    get_templates_root_path(): string | null {

        let engine_path = this.get_engine_path();
        if (!!engine_path) {
            return path.join(engine_path, "templates");
        }


        if (!this._template_path) {
            let cocos2d_path = this.get_cocos_root();
            if (cocos2d_path) {
                this._template_path = path.join(cocos2d_path, "templates");
            } else {
                this._template_path = null;
            }
        }
        return this._template_path;
    }


    get project_dir(): string | undefined {
        let dir = this.args.get_path("directory");
        return cchelper.replace_env_variables(dir);
    }

    get_cmake_generator(): string | undefined {
        return this.args.get_string("cmake_generator");
    }

    get_build_dir(): string {
        let dir = this.args.get_string("build_dir");
        let ext = "";
        if (this.enable_ios_simulator()) {
            ext = "-simulator";
        }
        return cchelper.replace_env_variables(path.join(dir, `build-${this.get_platform()}${ext}`));
    }

    get_cmake_path(): string {
        let cp = this.args.get_string("cmake_path");
        return !!cp ? cp : "cmake";
    }

    enable_ios_simulator(): boolean {
        return this.args.get_bool("ios_simulator");
    }

    get_app_team_id(): string | undefined {
        return this.args.get_string("teamid");
    }


    async run_cmake(args: string[]) {
        return new Promise((resolve, reject) => {
            let cp = child_process.spawn(this.get_cmake_path(), args, {
                stdio: ["pipe", "pipe", "pipe"],
                env: process.env,
                shell: true
            });
            cp.stdout.on("data", (data) => {
                console.log(`[cmake] ${data}`);
            });
            cp.stderr.on("data", (data) => {
                console.error(`[cmake-err] ${data}`);
            });
            cp.on("close", (code, sig) => {
                if (code !== 0) {
                    reject(new Error(`run cmake failed "cmake ${args.join(" ")}", code: ${code}, signal: ${sig}`));
                    return;
                }
                resolve();
            });
        });
    }

    private do_list_platforms() {
        console.log("support platforms:");
        for (let p of cocos_cfg.platforms) {
            console.log(` - ${p}`);
        }
    }

    private do_show_help() {
        let parser = this.parser;
        parser.print();
    }

    protected set_env(key: string, value: string) {
        process.env[key] = value;
    }

    protected get_env(key: string): string {
        return process.env[key]!;
    }

    get_current_platform(): string {
        let p = os.platform();
        if (p === "darwin") {
            return "mac";
        } else if (p == "win32") {
            return "win32";
        }
        console.warn(`platform ${p} is not supported!`);
        return p;
    }

    parse_args() {

        let parser = this.parser;

        parser.add_predefined_argument("src_dir");
        parser.add_predefined_argument("quiet");
        parser.add_predefined_argument("platform");
        parser.add_predefined_argument("do_list_platforms", this.do_list_platforms.bind(this));
        parser.add_predefined_argument("proj_dir");
        parser.add_predefined_argument("help", this.do_show_help.bind(this));

        this.define_args();
        let args = process.argv.slice(3);
        this.parser.parse(args.concat(this.ext_args));

        //expose enviroment variables
        this.set_env("COCOS_X_ROOT", this.get_cocos_root()!);
    }

    abstract define_args(): void;

    abstract init(): boolean;

    abstract async run(): Promise<boolean>;

    abstract depends(): string | null;

    get_engine_path(): string | null {
        return null;
    }

    ///////////////// helper methods

    get_templates_dir_names(): string[] {
        let template_dir = this.get_templates_root_path();
        let dirs: string[] = [];
        if (template_dir) {
            dirs = fs.readdirSync(template_dir).filter(x => !x.startsWith("."));
            dirs = dirs.filter(d => {
                let p = path.join(template_dir!, d);
                let stat = fs.statSync(p);
                return stat.isDirectory();
            });
        }
        return dirs;
    }

    get_template_dir_paths(): string[] {
        let template_dir = this.get_templates_root_path();
        return this.get_templates_dir_names().map(x => path.join(template_dir!, x));
    }

    get_platform(): string {
        let p = this.parser.get_string("platform");
        if (!p) {
            p = this.get_current_platform();
            console.log(`platform not specified, use current platform ${p}`);
        }
        return p;
    }

    set_platform(p:string) {
        this.parser.set_string("platform", p);
    }

    get_plugin_name(): string { return this._plugin_name!; }
    set_plugin_name(name: string) { this._plugin_name = name; }

    async exec() {
        this.parse_args();
        if (this.parser.call_all()) return;
        this.parser.validate();
        console.log(`[plugin ${this.get_plugin_name()}]: running ...`);
        this.init();
        await this.run();
        console.log(`  [plugin ${this.get_plugin_name()}]: done!`);
    }


    get args(): ArgumentParser {
        return this.parser;
    }
}

export class cchelper {

    static replace_env_variables(str: string): string {
        return str.replace(/\$\{([^\}]*)\}/g, (_, n) => process.env[n] == undefined ? _ : process.env[n]!).
            replace(/(\~)/g, (_, n) => process.env["HOME"]!);
    }


    static fix_path(p: string): string {
        p = this.replace_env_variables(p);
        if (os.platform() == "win32") {
            return p.replace(/\\/g, "\\\\");
        }
        return p;
    }

    static async delay<T>(ms: number): Promise<T> {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                resolve();
            }, ms);
        });
    }

    static join(p1:string, ...p2:string[]) :string {

        let l = p2.map(x=> this.replace_env_variables(x));
        if(path.isAbsolute(l[l.length - 1])) return l[l.length -1];
        return path.join(this.replace_env_variables(p1), ...p2);
    }

    static copy_file_sync(src_root: string, src_file: string, dst_root: string, dst_file: string) {
        
        // console.log(`copy_file_sync args: ${JSON.stringify(arguments)}`);
        src_root = this.replace_env_variables(src_root);
        src_file = this.replace_env_variables(src_file);
        dst_root = this.replace_env_variables(dst_root);
        dst_file = this.replace_env_variables(dst_file);
        let src = path.isAbsolute(src_file) ? src_file: path.join(src_root, src_file);
        let dst = path.isAbsolute(dst_file)? dst_file: path.join(dst_root, dst_file);
        // console.error(`copy_file_sync ${src} -> ${dst}`);
        this.make_directory_recursive(path.dirname(dst));
        fs.copyFileSync(src, dst);
    }

    static async copy_file_async(src: string, dst: string) {
        // console.log(`[async] copy_file ${src} -> ${dst}`);
        this.make_directory_recursive(path.parse(dst).dir);
        await afs.copyFile(src, dst);
    }

    static async copy_recursive_async(src_dir: string, dst: string) {
        src_dir = this.replace_env_variables(src_dir);
        dst = this.replace_env_variables(dst);

        let tasks: Promise<any>[] = [];
        let src_stat = await afs.stat(src_dir);

        if (!src_stat) {
            console.error(`failed to stat ${src_dir}`);
            return;
        }
        if (src_stat.isDirectory()) {
            this.make_directory_recursive(dst);
            let files = await afs.readdir(src_dir);
            for (let f of files) {
                if (f == "." || f == "..") continue;
                let fp = path.join(src_dir, f);
                let tsk = this.copy_recursive_async(fp, path.join(dst, f));
                tasks.push(tsk);
            }
            await Promise.all(tasks);
        } else if (src_stat.isFile()) {
            try {
                await this.copy_file_async(src_dir, dst);
            } catch (e) {
                await this.delay(10);
                console.error(`error: retry copying ${src_dir} -> to ${dst} ... ${e}`);
                await this.copy_file_async(src_dir, dst);
            }
        }
    }

    static prepare_dirs_for_files(src_root:string, files: string[], dst_dir:string) {
        let tree: any = {};
        for(let f of files) {
            let parts = f.split("/");
            let p = tree;
            for(let i of parts) {
                if(i in p) {
                    p = p[i];
                }else {
                    p = p[i] = {};
                }
            }
        }

        let mkdirs = ( src_dir:string, attrs:any, dst_dir:string) => {
            let src_stat = fs.statSync(src_dir);
            if(!src_stat.isDirectory()) return;
            if(!fs.existsSync(dst_dir)) {
                // console.log(`prepere_dir ${dst_dir}`);
                fs.mkdirSync(dst_dir);
            }
            for(let i in attrs) {
                if(i !== "." && i !== "..") {
                    mkdirs(path.join(src_dir, i), attrs[i], path.join(dst_dir, i));
                }
            }
        }

        mkdirs(src_root, tree, dst_dir);

    }

    static parallel_copy_files(par: number, src_root: string, files: string[], dst_dir: string) {
        let running_tasks = 0;
        dst_dir = this.replace_env_variables(dst_dir);
        cchelper.prepare_dirs_for_files(src_root, files, dst_dir);
        return new Promise((resolve, reject) => {
            let copy_async = async (src: string, dst: string) => {
                running_tasks += 1;
                await this.copy_recursive_async(src, dst);
                running_tasks -= 1;
                schedule_copy();
            };
            let schedule_copy = () => {
                if (files.length > 0 && running_tasks < par) {
                    let f = files.shift()!;
                    let src_file = path.join(src_root, f);
                    if(fs.existsSync(src_file)){
                        copy_async(src_file, path.join(dst_dir, f))
                    }else{
                        console.warn(`warning: copy_file: ${src_file} not exists!`);
                    }
                }
                if (files.length == 0 && running_tasks == 0) {
                    resolve();
                }
            }
            for (let i = 0; i < par; i++) schedule_copy();
        });
    }

    static make_directory_recursive(dir: string) {
        if (dir.length == 0) return;
        let dirs: string[] = [];
        let p = dir;
        while (!fs.existsSync(p)) {
            dirs.push(p);
            p = path.join(p, "..");
        }
        while (dirs.length > 0) {
            fs.mkdirSync(dirs[dirs.length - 1]);
            dirs.length = dirs.length - 1;
        }
    }

    static async remove_directory_recursive(dir: string) {
        let stat = await afs.stat(dir);
        if (stat.isFile()) {
            await afs.unlink(dir);
        } else if (stat.isDirectory()) {
            let list = await afs.readdir(dir);
            let tasks: Promise<any>[] = [];
            for (let f of list) {
                if (f == "." || f == "..") continue;
                let fp = path.join(dir, f);
                tasks.push(this.remove_directory_recursive(fp));
            }
            await Promise.all(tasks);
            await afs.rmdir(dir);
        }
    }

    static async copy_files_with_config(cfg: { from: string, to: string, include?: string[], exclude?: string[] }, src_root: string, dst_root: string) {

        if (!fs.existsSync(src_root)) {
            console.error(`copy file src_root ${src_root} is not exists!`);
            return;
        }


        src_root = this.replace_env_variables(src_root);
        dst_root = this.replace_env_variables(dst_root);
        let from = this.replace_env_variables(cfg.from)
        let to = this.replace_env_variables(cfg.to);
        if (path.isAbsolute(from)) {
            src_root = from;
            from = ".";
        }
        if (path.isAbsolute(to)) {
            dst_root = to;
            to = ".";
        }

        
        // console.log(`copy ${JSON.stringify(cfg)}, ${from} -> ${to} from ${src_root} -> ${dst_root}`);

        let build_prefix_tree = (list0: string[]) => {
            let tree: any = {};
            let list = list0.map(x => Array.from(x));
            while (list.length > 0) {
                let t = list.shift()!;
                let p = tree;
                while (t.length > 0) {
                    let c = t.shift()!;
                    if (!(c in p)) {
                        p[c] = {};
                    }
                    p = p[c];
                }
            }
            return tree;
        };

        let match_prefix_tree = (str: string, tree: any): boolean => {
            if (tree == null) {
                return false;
            }
            let arr = Array.from(str);
            let i = 0;
            let p = tree;
            while (arr[i] in p) {
                p = p[arr[i]];
                i++;
            }
            return i == arr.length && Object.keys(p).length == 0;
        }

        let include_prefix = cfg.include ? build_prefix_tree(cfg.include) : null;
        let exclude_prefix = cfg.exclude ? build_prefix_tree(cfg.exclude) : null;

        let cp_r_async = async (src_root: string, src_dir: string, dst_root: string) => {
            let curr_full_dir = path.join(src_root, src_dir);
            let stat = await afs.stat(curr_full_dir);
            if (stat.isDirectory()) {
                let files = await afs.readdir(curr_full_dir);
                let subcopies: Promise<any>[] = [];
                for (let f of files) {
                    if (f == "." || f == "..") continue;
                    let path_in_src_root = path.join(src_dir, f);
                    if (exclude_prefix && match_prefix_tree(path_in_src_root, exclude_prefix)) {
                        if (include_prefix && match_prefix_tree(path_in_src_root, include_prefix)) {
                            //include
                        } else {
                            console.log(` - skip copy ${src_root} ${path_in_src_root} to ${dst_root}`);
                            continue;
                        }
                    }
                    subcopies.push(cp_r_async(src_root, path_in_src_root, dst_root));
                }
                await Promise.all(subcopies);
            } else if (stat.isFile()) {
                // let dst_file_abs = path.isAbsolute(src_dir) ? src_dir : path.join(dst_root, src_dir);
                await this.copy_file_async(curr_full_dir, path.join(dst_root, src_dir));
            }
        }

        let copy_from = this.replace_env_variables(path.normalize(path.join(src_root, from)));
        let copy_to = this.replace_env_variables(path.normalize(path.join(dst_root, to)));
        await cp_r_async(src_root, from, copy_to);
    }

    static async replace_in_file(patterns: { reg: string, text: string }[], filepath: string) {
        filepath = this.replace_env_variables(filepath);
        if (!fs.existsSync(filepath)) {
            console.log(`warning: file ${filepath} not exists while replacing content!`);
            return;
        }
        // console.log(`replace ${filepath} with ${JSON.stringify(patterns)}`);
        let lines = (await afs.readFile(filepath)).toString("utf8").split("\n");

        let new_content = lines.map(l => {
            patterns.forEach(p => {
                l = l.replace(new RegExp(p.reg), this.replace_env_variables(p.text));
            });
            return l;
        }).join("\n");

        await afs.writeFile(filepath, new_content);
    }


    static exact_value_from_file(regexp: RegExp, filename: string, idx: number): string | undefined {
        if (!(fs.existsSync(filename))) {
            console.error(`file ${filename} not exist!`);
            return;
        }
        let lines = fs.readFileSync(filename).toString("utf-8").split("\n");
        for (let l of lines) {
            let r = l.match(regexp);
            if (r) {
                return r[idx];
            }
        }
    }

    static async run_cmd(cmd: string, args: string[], slient: boolean, cwd?: string) {
        return new Promise<any>((resolve, reject) => {
            console.log(`[run_cmd]: ${cmd} ${args.join(" ")}`);
            let cp = child_process.spawn(cmd, args, {
                shell: true,
                env: process.env,
                cwd: cwd! || process.cwd()
            });
            if (!slient) {
                cp.stdout.on(`data`, (chunk) => {
                    console.log(`[run_cmd ${cmd}] ${chunk}`);
                });
                cp.stderr.on(`data`, (chunk) => {
                    console.log(`[run_cmd ${cmd} - error] ${chunk}`);
                });
            }
            cp.on("close", (code, signal) => {
                if (code != 0 && !slient) return reject(`faile to exec ${cmd} ${args.join(" ")}`);
                resolve();
            });
        });
    }

}


class CCPluginRunner {

    private load_plugin(plugin_name: string): CCPlugin {
        let p: CCPlugin | null = null;
        let script_path = path.join(__dirname, `plugin_${plugin_name}.js`);
        if (!fs.existsSync(script_path)) {
            console.error(`Plugin ${plugin_name} is not defined!`);
            process.exit(1);
        }

        let exp = require(script_path);
        let klsName = `CCPlugin${plugin_name.toUpperCase()}`;
        if (klsName in exp) {
            p = new exp[klsName];
        } else {
            console.error(`${klsName} not defined in plugin_${plugin_name}.js`);
            process.exit(1);
        }
        p!.set_plugin_name(plugin_name);
        return p!;
    }

    public async run() {
        let plugin_name = process.argv[2];
        let task: CCPlugin[] = [];
        let p: CCPlugin;
        do {
            p = this.load_plugin(plugin_name);
            task.push(p);
        } while ((plugin_name = p.depends()!) !== null);

        for (let i = task.length - 1; i >= 0; i--) {
            await task[i].exec();
        }
    }
}

process.on("unhandledRejection", (err, promise) => {
    console.error(`----unhandledRejection---`);
    console.error(err);
});

let runner = new CCPluginRunner();

runner.run().then(() => {
    console.log(`[all done!]`);
    process.exit(0);
});