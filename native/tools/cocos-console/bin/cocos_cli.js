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
exports.cchelper = exports.CCPlugin = exports.pa = void 0;
const fs = require("fs");
const path = require("path");
const ml = require("./multi_language");
const cocos_cfg = require("./cocos_config.json");
const os = require("os");
const afs_1 = require("./afs");
const child_process = require("child_process");
var ArgumentItemType;
(function (ArgumentItemType) {
    ArgumentItemType[ArgumentItemType["BOOL_FLAG"] = 0] = "BOOL_FLAG";
    ArgumentItemType[ArgumentItemType["STRING_VALUE"] = 1] = "STRING_VALUE";
    ArgumentItemType[ArgumentItemType["ACTION"] = 2] = "ACTION";
    ArgumentItemType[ArgumentItemType["ENUM"] = 3] = "ENUM";
})(ArgumentItemType || (ArgumentItemType = {}));
/** pre-defined arguments */
exports.pa = {
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
    constructor() {
        this.definations = [];
        this.values = {};
        this.other_values = [];
    }
    add_argument(short, long, field, arg_type, help, enum_values, required, action, default_value) {
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
    add_predefined_argument(field, action) {
        let item = exports.pa[field];
        if (item) {
            return this.add_argument(item.short, item.long, field, item.arg_type, item.help, item.enum_values, false, action);
        }
        else {
            console.error(`Predefiend argument "${field}" is not found!`);
        }
    }
    add_predefined_argument_with_default(field, default_value) {
        let item = exports.pa[field];
        if (item) {
            return this.add_argument(item.short, item.long, field, item.arg_type, item.help, item.enum_values, false, undefined, default_value);
        }
        else {
            console.error(`Predefiend argument "${field}" is not found!`);
        }
    }
    add_required_predefined_argument(field, action) {
        let item = exports.pa[field];
        if (item) {
            return this.add_argument(item.short, item.long, field, item.arg_type, item.help, item.enum_values, true, action);
        }
        else {
            console.error(`Predefiend argument "${field}" is not found!`);
        }
    }
    parse(list) {
        let cfgs = [];
        for (let i = 0; i < list.length; i++) {
            let line = list[i];
            cfgs.length = 0;
            let prefix;
            if (line.startsWith("--")) {
                let p1 = line;
                if (line.match(/^--[-_a-z]+=/)) { // contains `=` --template-name=
                    p1 = line.split("=")[0];
                }
                cfgs = this.definations.filter(x => x.long == p1).sort((a, b) => a.long.length - b.long.length);
                if (cfgs.length > 0)
                    prefix = cfgs[0].long;
            }
            else if (line.startsWith("-")) {
                cfgs = this.definations.filter(x => x.short.length > 0 && line == x.short);
                if (cfgs.length > 0)
                    prefix = cfgs[0].short;
            }
            else {
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
                    this.values[cfg.field] = true;
                    if (line.length > prefix.length) {
                        console.warn(`argument ${line} too long?`);
                    }
                }
                else if (cfg.arg_type == ArgumentItemType.STRING_VALUE || cfg.arg_type == ArgumentItemType.ENUM) {
                    if (line.length == prefix.length) {
                        if (list[i + 1] == undefined || list[i + 1].startsWith("-")) {
                            console.warn(`argument "${prefix}" is not provided with value?`);
                        }
                        this.values[cfg.field] = list[i + 1];
                        i++;
                        continue;
                    }
                    if (line.length > prefix.length) {
                        let value = line.substr(prefix.length);
                        this.values[cfg.field] = value[0] === "=" ? value.substr(1) : value;
                        continue;
                    }
                }
                else if (cfg.arg_type == ArgumentItemType.ACTION) {
                    this.values[cfg.field] = cfg.action;
                }
            }
            else {
                console.warn(`unknown argument: ${line}`);
            }
        }
    }
    defination_for(key) {
        let list = this.definations.filter(x => x.field == key);
        if (list.length > 1) {
            console.warn(`multiply command line argument definations for "${key}"`);
        }
        else if (list.length == 0) {
            console.error(`no command line argument defination for "${key}" found!`);
            return null;
        }
        return list[0];
    }
    get_bool(key) {
        return this.values[key] === true;
    }
    set_bool(key, value) {
        this.values[key] = value;
    }
    get_path(key) {
        if (!(key in this.values)) {
            console.log(`[warn] argument ${key} not set!`);
        }
        return (key in this.values) ? this.values[key] : this.defination_for(key).default_value;
    }
    get_string(key) {
        if (!(key in this.values)) {
            console.log(`[warn] argument ${key} not set!`);
        }
        return this.get_path(key);
    }
    set_string(key, v) {
        this.values[key] = v;
    }
    exist_key(key) {
        return key in this.values;
    }
    call(key) {
        if (typeof this.values[key] === "function") {
            this.values[key].apply();
        }
        else {
            console.log(`[warn] argument value of ${key} is not a function`);
        }
    }
    call_all() {
        for (let key in this.values) {
            let f = this.values[key];
            if (typeof (f) === "function") {
                f.call();
                return true;
            }
        }
        return false;
    }
    get_otherargs() {
        return this.other_values;
    }
    print() {
        console.log("Usage:");
        for (let i of this.definations) {
            console.log(` ${i.short.length == 0 ? "" : i.short + ", "}${i.long} \t: ${i.help}`);
        }
    }
    validate() {
        for (let key in this.values) {
            // validate enums
            let v = this.values[key];
            let defs = this.definations.filter(x => x.field == key);
            if (defs.length > 0) {
                if (defs[0].arg_type == ArgumentItemType.ENUM) {
                    if (!defs[0].enum_values.includes(v)) {
                        console.error(` incorrect argument "${defs[0].long} ${v}", expect "${defs[0].enum_values.join(",")}"`);
                    }
                }
            }
        }
        for (let d of this.definations) {
            if (d.required && !(d.field in this.values)) {
                console.error(` required argument ${d.long} is not provided!`);
            }
        }
    }
}
class CCPlugin {
    constructor() {
        this._cocos2d_path = null;
        this._template_path = null;
        this._plugin_name = null;
        this.ext_args = [];
        this.parser = new ArgumentParser();
    }
    extend_argv(args) {
        this.ext_args = this.ext_args.concat(args);
    }
    get_cocos_root() {
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
    get_consle_root() {
        let engine_path = this.get_engine_path();
        if (!!engine_path) {
            return path.join(engine_path, "tools/cocos-console");
        }
        return path.join(__dirname, "..");
    }
    get_templates_root_path() {
        let engine_path = this.get_engine_path();
        if (!!engine_path) {
            return path.join(engine_path, "templates");
        }
        if (!this._template_path) {
            let cocos2d_path = this.get_cocos_root();
            if (cocos2d_path) {
                this._template_path = path.join(cocos2d_path, "templates");
            }
            else {
                this._template_path = null;
            }
        }
        return this._template_path;
    }
    get project_dir() {
        let dir = this.args.get_path("directory");
        return cchelper.replace_env_variables(dir);
    }
    get_cmake_generator() {
        return this.args.get_string("cmake_generator");
    }
    get_build_dir() {
        let dir = this.args.get_string("build_dir");
        let ext = "";
        if (this.enable_ios_simulator()) {
            ext = "-simulator";
        }
        return cchelper.replace_env_variables(path.join(dir, `build-${this.get_platform()}${ext}`));
    }
    get_cmake_path() {
        let cp = this.args.get_string("cmake_path");
        return !!cp ? cp : "cmake";
    }
    enable_ios_simulator() {
        return this.args.get_bool("ios_simulator");
    }
    get_app_team_id() {
        return this.args.get_string("teamid");
    }
    run_cmake(args) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    do_list_platforms() {
        console.log("support platforms:");
        for (let p of cocos_cfg.platforms) {
            console.log(` - ${p}`);
        }
    }
    do_show_help() {
        let parser = this.parser;
        parser.print();
    }
    set_env(key, value) {
        process.env[key] = value;
    }
    get_env(key) {
        return process.env[key];
    }
    get_current_platform() {
        let p = os.platform();
        if (p === "darwin") {
            return "mac";
        }
        else if (p == "win32") {
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
        this.set_env("COCOS_X_ROOT", this.get_cocos_root());
    }
    get_engine_path() {
        return null;
    }
    ///////////////// helper methods
    get_templates_dir_names() {
        let template_dir = this.get_templates_root_path();
        let dirs = [];
        if (template_dir) {
            dirs = fs.readdirSync(template_dir).filter(x => !x.startsWith("."));
            dirs = dirs.filter(d => {
                let p = path.join(template_dir, d);
                let stat = fs.statSync(p);
                return stat.isDirectory();
            });
        }
        return dirs;
    }
    get_template_dir_paths() {
        let template_dir = this.get_templates_root_path();
        return this.get_templates_dir_names().map(x => path.join(template_dir, x));
    }
    get_platform() {
        let p = this.parser.get_string("platform");
        if (!p) {
            p = this.get_current_platform();
            console.log(`platform not specified, use current platform ${p}`);
        }
        return p;
    }
    set_platform(p) {
        this.parser.set_string("platform", p);
    }
    get_plugin_name() { return this._plugin_name; }
    set_plugin_name(name) { this._plugin_name = name; }
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            this.parse_args();
            if (this.parser.call_all())
                return;
            this.parser.validate();
            console.log(`[plugin ${this.get_plugin_name()}]: running ...`);
            this.init();
            yield this.run();
            console.log(`  [plugin ${this.get_plugin_name()}]: done!`);
        });
    }
    get args() {
        return this.parser;
    }
}
exports.CCPlugin = CCPlugin;
class cchelper {
    static replace_env_variables(str) {
        return str.replace(/\$\{([^\}]*)\}/g, (_, n) => process.env[n] == undefined ? _ : process.env[n]).
            replace(/(\~)/g, (_, n) => process.env["HOME"]);
    }
    static fix_path(p) {
        p = this.replace_env_variables(p);
        if (os.platform() == "win32") {
            return p.replace(/\\/g, "\\\\");
        }
        return p;
    }
    static delay(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    resolve();
                }), ms);
            });
        });
    }
    static join(p1, ...p2) {
        let l = p2.map(x => this.replace_env_variables(x));
        if (path.isAbsolute(l[l.length - 1]))
            return l[l.length - 1];
        return path.join(this.replace_env_variables(p1), ...p2);
    }
    static copy_file_sync(src_root, src_file, dst_root, dst_file) {
        // console.log(`copy_file_sync args: ${JSON.stringify(arguments)}`);
        src_root = this.replace_env_variables(src_root);
        src_file = this.replace_env_variables(src_file);
        dst_root = this.replace_env_variables(dst_root);
        dst_file = this.replace_env_variables(dst_file);
        let src = path.isAbsolute(src_file) ? src_file : path.join(src_root, src_file);
        let dst = path.isAbsolute(dst_file) ? dst_file : path.join(dst_root, dst_file);
        // console.error(`copy_file_sync ${src} -> ${dst}`);
        this.make_directory_recursive(path.dirname(dst));
        fs.copyFileSync(src, dst);
    }
    static copy_file_async(src, dst) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(`[async] copy_file ${src} -> ${dst}`);
            this.make_directory_recursive(path.parse(dst).dir);
            yield afs_1.afs.copyFile(src, dst);
        });
    }
    static copy_recursive_async(src_dir, dst) {
        return __awaiter(this, void 0, void 0, function* () {
            src_dir = this.replace_env_variables(src_dir);
            dst = this.replace_env_variables(dst);
            let tasks = [];
            let src_stat = yield afs_1.afs.stat(src_dir);
            if (!src_stat) {
                console.error(`failed to stat ${src_dir}`);
                return;
            }
            if (src_stat.isDirectory()) {
                this.make_directory_recursive(dst);
                let files = yield afs_1.afs.readdir(src_dir);
                for (let f of files) {
                    if (f == "." || f == "..")
                        continue;
                    let fp = path.join(src_dir, f);
                    let tsk = this.copy_recursive_async(fp, path.join(dst, f));
                    tasks.push(tsk);
                }
                yield Promise.all(tasks);
            }
            else if (src_stat.isFile()) {
                try {
                    yield this.copy_file_async(src_dir, dst);
                }
                catch (e) {
                    yield this.delay(10);
                    console.error(`error: retry copying ${src_dir} -> to ${dst} ... ${e}`);
                    yield this.copy_file_async(src_dir, dst);
                }
            }
        });
    }
    static prepare_dirs_for_files(src_root, files, dst_dir) {
        let tree = {};
        for (let f of files) {
            let parts = f.split("/");
            let p = tree;
            for (let i of parts) {
                if (i in p) {
                    p = p[i];
                }
                else {
                    p = p[i] = {};
                }
            }
        }
        let mkdirs = (src_dir, attrs, dst_dir) => {
            let src_stat = fs.statSync(src_dir);
            if (!src_stat.isDirectory())
                return;
            if (!fs.existsSync(dst_dir)) {
                // console.log(`prepere_dir ${dst_dir}`);
                fs.mkdirSync(dst_dir);
            }
            for (let i in attrs) {
                if (i !== "." && i !== "..") {
                    mkdirs(path.join(src_dir, i), attrs[i], path.join(dst_dir, i));
                }
            }
        };
        mkdirs(src_root, tree, dst_dir);
    }
    static parallel_copy_files(par, src_root, files, dst_dir) {
        let running_tasks = 0;
        dst_dir = this.replace_env_variables(dst_dir);
        cchelper.prepare_dirs_for_files(src_root, files, dst_dir);
        return new Promise((resolve, reject) => {
            let copy_async = (src, dst) => __awaiter(this, void 0, void 0, function* () {
                running_tasks += 1;
                yield this.copy_recursive_async(src, dst);
                running_tasks -= 1;
                schedule_copy();
            });
            let schedule_copy = () => {
                if (files.length > 0 && running_tasks < par) {
                    let f = files.shift();
                    let src_file = path.join(src_root, f);
                    if (fs.existsSync(src_file)) {
                        copy_async(src_file, path.join(dst_dir, f));
                    }
                    else {
                        console.warn(`warning: copy_file: ${src_file} not exists!`);
                    }
                }
                if (files.length == 0 && running_tasks == 0) {
                    resolve();
                }
            };
            for (let i = 0; i < par; i++)
                schedule_copy();
        });
    }
    static make_directory_recursive(dir) {
        if (dir.length == 0)
            return;
        let dirs = [];
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
    static remove_directory_recursive(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            let stat = yield afs_1.afs.stat(dir);
            if (stat.isFile()) {
                yield afs_1.afs.unlink(dir);
            }
            else if (stat.isDirectory()) {
                let list = yield afs_1.afs.readdir(dir);
                let tasks = [];
                for (let f of list) {
                    if (f == "." || f == "..")
                        continue;
                    let fp = path.join(dir, f);
                    tasks.push(this.remove_directory_recursive(fp));
                }
                yield Promise.all(tasks);
                yield afs_1.afs.rmdir(dir);
            }
        });
    }
    static copy_files_with_config(cfg, src_root, dst_root) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs.existsSync(src_root)) {
                console.error(`copy file src_root ${src_root} is not exists!`);
                return;
            }
            src_root = this.replace_env_variables(src_root);
            dst_root = this.replace_env_variables(dst_root);
            let from = this.replace_env_variables(cfg.from);
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
            let build_prefix_tree = (list0) => {
                let tree = {};
                let list = list0.map(x => Array.from(x));
                while (list.length > 0) {
                    let t = list.shift();
                    let p = tree;
                    while (t.length > 0) {
                        let c = t.shift();
                        if (!(c in p)) {
                            p[c] = {};
                        }
                        p = p[c];
                    }
                }
                return tree;
            };
            let match_prefix_tree = (str, tree) => {
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
            };
            let include_prefix = cfg.include ? build_prefix_tree(cfg.include) : null;
            let exclude_prefix = cfg.exclude ? build_prefix_tree(cfg.exclude) : null;
            let cp_r_async = (src_root, src_dir, dst_root) => __awaiter(this, void 0, void 0, function* () {
                let curr_full_dir = path.join(src_root, src_dir);
                let stat = yield afs_1.afs.stat(curr_full_dir);
                if (stat.isDirectory()) {
                    let files = yield afs_1.afs.readdir(curr_full_dir);
                    let subcopies = [];
                    for (let f of files) {
                        if (f == "." || f == "..")
                            continue;
                        let path_in_src_root = path.join(src_dir, f);
                        if (exclude_prefix && match_prefix_tree(path_in_src_root, exclude_prefix)) {
                            if (include_prefix && match_prefix_tree(path_in_src_root, include_prefix)) {
                                //include
                            }
                            else {
                                console.log(` - skip copy ${src_root} ${path_in_src_root} to ${dst_root}`);
                                continue;
                            }
                        }
                        subcopies.push(cp_r_async(src_root, path_in_src_root, dst_root));
                    }
                    yield Promise.all(subcopies);
                }
                else if (stat.isFile()) {
                    // let dst_file_abs = path.isAbsolute(src_dir) ? src_dir : path.join(dst_root, src_dir);
                    yield this.copy_file_async(curr_full_dir, path.join(dst_root, src_dir));
                }
            });
            let copy_from = this.replace_env_variables(path.normalize(path.join(src_root, from)));
            let copy_to = this.replace_env_variables(path.normalize(path.join(dst_root, to)));
            yield cp_r_async(src_root, from, copy_to);
        });
    }
    static replace_in_file(patterns, filepath) {
        return __awaiter(this, void 0, void 0, function* () {
            filepath = this.replace_env_variables(filepath);
            if (!fs.existsSync(filepath)) {
                console.log(`warning: file ${filepath} not exists while replacing content!`);
                return;
            }
            // console.log(`replace ${filepath} with ${JSON.stringify(patterns)}`);
            let lines = (yield afs_1.afs.readFile(filepath)).toString("utf8").split("\n");
            let new_content = lines.map(l => {
                patterns.forEach(p => {
                    l = l.replace(new RegExp(p.reg), this.replace_env_variables(p.text));
                });
                return l;
            }).join("\n");
            yield afs_1.afs.writeFile(filepath, new_content);
        });
    }
    static exact_value_from_file(regexp, filename, idx) {
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
    static run_cmd(cmd, args, slient, cwd) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                console.log(`[run_cmd]: ${cmd} ${args.join(" ")}`);
                let cp = child_process.spawn(cmd, args, {
                    shell: true,
                    env: process.env,
                    cwd: cwd || process.cwd()
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
                    if (code != 0 && !slient)
                        return reject(`faile to exec ${cmd} ${args.join(" ")}`);
                    resolve();
                });
            });
        });
    }
}
exports.cchelper = cchelper;
class CCPluginRunner {
    load_plugin(plugin_name) {
        let p = null;
        let script_path = path.join(__dirname, `plugin_${plugin_name}.js`);
        if (!fs.existsSync(script_path)) {
            console.error(`Plugin ${plugin_name} is not defined!`);
            process.exit(1);
        }
        let exp = require(script_path);
        let klsName = `CCPlugin${plugin_name.toUpperCase()}`;
        if (klsName in exp) {
            p = new exp[klsName];
        }
        else {
            console.error(`${klsName} not defined in plugin_${plugin_name}.js`);
            process.exit(1);
        }
        p.set_plugin_name(plugin_name);
        return p;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let plugin_name = process.argv[2];
            let task = [];
            let p;
            do {
                p = this.load_plugin(plugin_name);
                task.push(p);
            } while ((plugin_name = p.depends()) !== null);
            for (let i = task.length - 1; i >= 0; i--) {
                yield task[i].exec();
            }
        });
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
//# sourceMappingURL=cocos_cli.js.map