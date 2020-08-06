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
exports.TemplateCreator = exports.CCPluginNEW = void 0;
const cocos_cli_1 = require("./cocos_cli");
const path = require("path");
const fs = require("fs");
const cocos_project = require("./cocos_project_types");
const cocos2dx_files = require("../../../templates/cocos2dx_files.json");
const cocos_cfg = require("./cocos_config.json");
const afs_1 = require("./afs");
const PackageNewConfig = "cocos-project-template.json";
let project_CONFIG = {
    project_type: "js",
    has_native: true,
    engine_version: "",
    custom_step_script: null /* script path*/
};
class CCPluginNEW extends cocos_cli_1.CCPlugin {
    depends() {
        return null;
    }
    define_args() {
        let parser = this.parser;
        parser.add_predefined_argument_with_default("package_name", "CocosGame");
        parser.add_required_predefined_argument("directory");
        parser.add_predefined_argument_with_default("ios_bundleid", "org.cocos2dx.ios");
        parser.add_predefined_argument_with_default("mac_bundleid", "org.cocos2dx.mac");
        parser.add_predefined_argument("engine_path");
        parser.add_predefined_argument("portrait");
        parser.add_predefined_argument("no_native");
        parser.add_predefined_argument("build_dir");
        parser.add_predefined_argument_with_default("language", "js");
        parser.add_predefined_argument("do_list_templates", this.do_list_templates.bind(this));
        parser.add_predefined_argument_with_default("template_name", "link");
        parser.add_predefined_argument("shared_dir");
    }
    init() {
        this.set_env("PROJECT_NAME", this.project_name);
        this.set_env("COMMON_DIR", cocos_cli_1.cchelper.join(this.shared_dir, this.common_dir));
        let parser = this.parser;
        // console.log(`PROJECT_NAME name ${this.project_name}`);
        let cocos_dir = this.get_cocos_root();
        if (!fs.existsSync(cocos_cli_1.cchelper.join(cocos_dir, "cocos/cocos2d.h"))) {
            console.error(`cocos2d.h not found in ${cocos_dir}, path incorrect!`);
            return false;
        }
        if (this.project_dir && !fs.existsSync(this.project_dir)) {
            cocos_cli_1.cchelper.make_directory_recursive(this.project_dir);
        }
        return true;
    }
    get common_dir() {
        return `common-${this.args.get_string("template_name")}`;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let tp = new TemplateCreator(this);
            yield tp.run(); // async
            return true;
        });
    }
    /* override */
    get_engine_path() {
        return this.args.get_path("engine_path");
    }
    do_list_templates() {
        console.log(`templates:`);
        let dirs = this.get_templates_dir_names();
        for (let d of dirs) {
            console.log(` - ${d}/`);
        }
    }
    get project_name() {
        if (this.args.get_otherargs().length == 0) {
            console.error(`argument project name is not set!`);
        }
        let pname = this.args.get_otherargs()[0];
        if (!pname.match(/^[a-zA-Z0-9-_]+$/)) {
            console.error(`project name "${pname}" seems to be a bad argument!`);
        }
        return pname;
    }
    get project_dir() {
        let dir = this.args.get_path("directory");
        if (!dir || !this.project_name)
            return;
        return cocos_cli_1.cchelper.join(dir, this.project_name);
    }
    get shared_dir() {
        let dir = this.args.get_path("shared_dir");
        if (!dir)
            return cocos_cli_1.cchelper.join(this.project_dir, "..");
        return dir;
    }
    get engine_path() {
        return this.args.get_path("engine_path");
    }
    get selected_template_dir_name() {
        let tpn = this.args.get_path("template_name");
        let template_names = this.get_templates_dir_names();
        if (template_names.length == 1) {
            return template_names[0];
        }
        let dirs = template_names.filter(x => x.indexOf(tpn) >= 0);
        if (dirs.length == 0) {
            console.error(`can not find template ${tpn} in ${template_names.join(",")}`);
        }
        if (dirs.length > 1) {
            console.error(`find multiple template dirs in for ${tpn}`);
        }
        return dirs[0];
    }
    get selected_template_path() {
        if (!this.selected_template_dir_name)
            return null;
        let dir = cocos_cli_1.cchelper.join(this.get_templates_root_path(), this.selected_template_dir_name);
        if (!fs.existsSync(dir)) {
            console.error(`selected template path not exists: ${dir}`);
        }
        let st = fs.statSync(dir);
        if (!st.isDirectory()) {
            console.error(`selected template path is not directory: ${dir}`);
        }
        let check_files = ["main.js", "project.json", PackageNewConfig, "frameworks"];
        for (let f of check_files) {
            if (!fs.existsSync(cocos_cli_1.cchelper.join(dir, f))) {
                console.warn(`warning: file "${f}" does not exists in ${dir}, template path can be incorrect setting!`);
            }
        }
        return dir;
    }
}
exports.CCPluginNEW = CCPluginNEW;
class TemplateCreator {
    constructor(plugin) {
        this.excludes = [];
        this.plugin = plugin;
        let args = plugin.args;
        let template_dir = cocos_cli_1.cchelper.join(plugin.get_templates_root_path(), plugin.selected_template_dir_name);
        this.lang = args.get_path("language");
        this.cocos_root = plugin.get_cocos_root();
        this.project_name = plugin.project_name;
        this.project_dir = plugin.project_dir;
        this.package_name = args.get_string("package_name");
        this.mac_bundleid = args.get_string("mac_bundleid");
        this.ios_bundleid = args.get_string("ios_bundleid");
        this.tp_name = args.get_path("template_name");
        this.tp_dir = template_dir;
        if (cocos_cfg.support_templates.indexOf(this.tp_name) < 0) {
            console.error(`template name "${this.tp_name}" is not supported!`);
        }
        if (!fs.existsSync(cocos_cli_1.cchelper.join(this.tp_dir, PackageNewConfig))) {
            console.error(`can not find ${PackageNewConfig} in ${this.tp_dir}`);
            return;
        }
        this.template_info = JSON.parse(fs.readFileSync(cocos_cli_1.cchelper.join(this.tp_dir, PackageNewConfig)).toString("utf8"));
        if (!("do_default" in this.template_info)) {
            console.error(`can not find "do_default" in ${PackageNewConfig}`);
            return;
        }
    }
    do_post_steps() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.set_orientation();
            yield this.update_android_gradle_values();
        });
    }
    get_config_path() {
        return cocos_cli_1.cchelper.join(this.project_dir, cocos_project.CONFIG);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let shared_dir = this.plugin.shared_dir;
            {
                let dir = cocos_cli_1.cchelper.join(shared_dir, this.plugin.common_dir);
                if (!fs.existsSync(dir)) {
                    yield cocos_cli_1.cchelper.copy_files_with_config({
                        from: cocos_cli_1.cchelper.join(this.tp_dir, "common"),
                        to: dir,
                    }, this.tp_dir, this.project_dir);
                }
            }
            cocos_cli_1.cchelper.copy_file_sync(this.tp_dir, "project.json", this.project_dir, "project.json");
            // copy by platform
            let plat = this.plugin.args.get_string("platform");
            {
                let dir = cocos_cli_1.cchelper.join(this.project_dir, "proj");
                if (plat && !fs.existsSync(dir)) {
                    yield cocos_cli_1.cchelper.copy_files_with_config({
                        from: cocos_cli_1.cchelper.join(this.tp_dir, "platforms", plat),
                        to: dir,
                    }, this.tp_dir, this.project_dir);
                }
            }
            delete this.template_info.do_default;
            for (let key in this.template_info) {
                // console.log(`other commands ${key}`)
                yield this.execute(this.template_info[key]);
            }
            yield this.do_post_steps();
            project_CONFIG.engine_version = this.get_cocos_version();
            let cfg = {};
            let cfgPath = this.get_config_path();
            if (fs.existsSync(cfgPath)) {
                cfg = JSON.parse(fs.readFileSync(cfgPath).toString("utf-8"));
            }
            cfg = Object.assign(cfg, project_CONFIG);
            fs.writeFileSync(cfgPath, JSON.stringify(cfg, undefined, 2));
        });
    }
    get_cocos_version() {
        const cocos2d_h = cocos_cli_1.cchelper.join(this.cocos_root, "cocos/cocos2d.h");
        if (!fs.existsSync(cocos2d_h)) {
            return "unknown";
        }
        else {
            let lines = fs.readFileSync(cocos2d_h).toString("utf-8").split("\n").filter(x => x.indexOf("COCOS2D_VERSION") >= 0);
            if (lines.length > 0) {
                let ps = lines[0].split(" ");
                let v = parseInt(ps[ps.length - 1]);
                return `${v >> 16}.${(v & 0x0000FF00) >> 8}.${v & 0x000000FF}`;
            }
        }
        return "unknown";
    }
    get_project_pkg_config(platform) {
        if (!fs.existsSync(this.get_config_path())) {
            return undefined;
        }
        let p = JSON.parse(fs.readFileSync(this.get_config_path()).toString("utf-8"));
        if (!p.packages) {
            return undefined;
        }
        return p.packages[platform];
    }
    set_orientation() {
        return __awaiter(this, void 0, void 0, function* () {
            let cfgPath = this.get_config_path();
            if (fs.existsSync(cfgPath)) {
                let json = JSON.parse(fs.readFileSync(cfgPath).toString("utf-8"));
                if (json.ios) {
                    let cfg = json.ios.orientation;
                    let infoPlist = cocos_cli_1.cchelper.join(this.project_dir, 'proj/Info.plist');
                    if (fs.existsSync(infoPlist)) {
                        let orientations = [];
                        if (cfg.landscapeRight) {
                            orientations.push('UIInterfaceOrientationLandscapeRight');
                        }
                        if (cfg.landscapeLeft) {
                            orientations.push('UIInterfaceOrientationLandscapeLeft');
                        }
                        if (cfg.portrait) {
                            orientations.push('UIInterfaceOrientationPortrait');
                        }
                        if (cfg.upsideDown) {
                            orientations.push('UIInterfaceOrientationPortraitUpsideDown');
                        }
                        let replacement = `\t<key>UISupportedInterfaceOrientations</key>\t<array>${orientations.map(x => `\t\t<string>${x}</string>`)}\t</array>`;
                        let newlines = [];
                        let lines = fs.readFileSync(infoPlist).toString("utf-8").split("\n");
                        let found_key = 0;
                        let found_values = 0;
                        for (let i = 0; i < lines.length; i++) {
                            if (lines[i].indexOf("UISupportedInterfaceOrientations") >= 0) {
                                found_key += 1;
                                newlines.push(lines[i]);
                                i++;
                                while (i < lines.length && lines[i].indexOf("</array>") < 0) {
                                    i++;
                                }
                                if (lines[i].indexOf("</array>") >= 0) {
                                    found_values += 1;
                                }
                                i++;
                                newlines.push(replacement);
                            }
                            else {
                                newlines.push(lines[i]);
                            }
                        }
                        if (found_key != 1 || found_values != 1) {
                            console.error(`error occurs while setting orientations for iOS`);
                        }
                        else {
                            yield afs_1.afs.writeFile(infoPlist, newlines.join("\n"));
                        }
                    }
                    else {
                        console.error(`file ${infoPlist} not exist!`);
                    }
                }
                if (json.android) {
                    let cfg = json.android.orientation;
                    let manifestPath = cocos_cli_1.cchelper.join(this.project_dir, 'proj/app/AndroidManifest.xml');
                    if (fs.existsSync(manifestPath)) {
                        let pattern = /android:screenOrientation=\"[^"]*\"/;
                        let replaceString = 'android:screenOrientation="unspecified"';
                        if (cfg.landscapeRight && cfg.landscapeLeft && cfg.portrait && cfg.upsideDown) {
                            replaceString = 'android:screenOrientation="fullSensor"';
                        }
                        else if (cfg.landscapeRight && !cfg.landscapeLeft) {
                            replaceString = 'android:screenOrientation="landscape"';
                        }
                        else if (!cfg.landscapeRight && cfg.landscapeLeft) {
                            replaceString = 'android:screenOrientation="reverseLandscape"';
                        }
                        else if (cfg.landscapeRight && cfg.landscapeLeft) {
                            replaceString = 'android:screenOrientation="sensorLandscape"';
                        }
                        else if (cfg.portrait && !cfg.upsideDown) {
                            replaceString = 'android:screenOrientation="portrait"';
                        }
                        else if (!cfg.portrait && cfg.upsideDown) {
                            let oriValue = 'reversePortrait';
                            replaceString = `android:screenOrientation="${oriValue}"`;
                        }
                        else if (cfg.portrait && cfg.upsideDown) {
                            let oriValue = 'sensorPortrait';
                            replaceString = `android:screenOrientation="${oriValue}"`;
                        }
                        let content = yield afs_1.afs.readFile(manifestPath, 'utf8');
                        content = content.replace(pattern, replaceString);
                        yield afs_1.afs.writeFile(manifestPath, content);
                    }
                    else {
                        console.error(`file ${manifestPath} not exist!`);
                    }
                }
            }
            else {
                console.error(`file ${cfgPath} not found!`);
            }
        });
    }
    update_android_gradle_values() {
        return __awaiter(this, void 0, void 0, function* () {
            let cfg = this.get_project_pkg_config("android");
            if (!cfg)
                return;
            // android-studio gradle.properties
            console.log(`update gradle.prperties`);
            let gradlePropertyPath = cocos_cli_1.cchelper.join(this.project_dir, 'proj/gradle.properties');
            if (fs.existsSync(gradlePropertyPath)) {
                let keystorePath = cfg.keystorePath;
                if (this.plugin.get_current_platform() == "win32") {
                    keystorePath = cocos_cli_1.cchelper.fix_path(keystorePath);
                }
                let apiLevel = cfg.apiLevel;
                if (!apiLevel) {
                    apiLevel = 27;
                }
                console.log(`AndroidAPI level ${apiLevel}`);
                let content = fs.readFileSync(gradlePropertyPath, 'utf-8');
                if (keystorePath) {
                    content = content.replace(/.*RELEASE_STORE_FILE=.*/, `RELEASE_STORE_FILE=${keystorePath}`);
                    content = content.replace(/.*RELEASE_STORE_PASSWORD=.*/, `RELEASE_STORE_PASSWORD=${cfg.keystorePassword}`);
                    content = content.replace(/.*RELEASE_KEY_ALIAS=.*/, `RELEASE_KEY_ALIAS=${cfg.keystoreAlias}`);
                    content = content.replace(/.*RELEASE_KEY_PASSWORD=.*/, `RELEASE_KEY_PASSWORD=${cfg.keystoreAliasPassword}`);
                }
                else {
                    content = content.replace(/.*RELEASE_STORE_FILE=.*/, `# RELEASE_STORE_FILE=${keystorePath}`);
                    content = content.replace(/.*RELEASE_STORE_PASSWORD=.*/, `# RELEASE_STORE_PASSWORD=${cfg.keystorePassword}`);
                    content = content.replace(/.*RELEASE_KEY_ALIAS=.*/, `# RELEASE_KEY_ALIAS=${cfg.keystoreAlias}`);
                    content = content.replace(/.*RELEASE_KEY_PASSWORD=.*/, `# RELEASE_KEY_PASSWORD=${cfg.keystoreAliasPassword}`);
                }
                let SDK_VERSION = typeof apiLevel === "string" ? apiLevel.match(/\d+/)[0] : apiLevel;
                content = content.replace(/PROP_TARGET_SDK_VERSION=.*/, `PROP_TARGET_SDK_VERSION=${SDK_VERSION}`);
                content = content.replace(/PROP_COMPILE_SDK_VERSION=.*/, `PROP_COMPILE_SDK_VERSION=${SDK_VERSION}`);
                let abis = (cfg.appABIs && cfg.appABIs.length > 0) ? cfg.appABIs.join(':') : 'armeabi-v7a';
                //todo:新的template里面有个注释也是这个字段，所以要加个g
                content = content.replace(/PROP_APP_ABI=.*/g, `PROP_APP_ABI=${abis}`);
                fs.writeFileSync(gradlePropertyPath, content);
                // generate local.properties
                content = '';
                content += `ndk.dir=${process.env.NDK_ROOT}\n`;
                content += `sdk.dir=${process.env.ANDROID_SDK_ROOT}`;
                //windows 需要使用的这样的格式 e\:\\aa\\bb\\cc
                if (process.platform === 'win32') {
                    content = content.replace(/\\/g, '\\\\');
                    content = content.replace(/:/g, '\\:');
                }
                fs.writeFileSync(cocos_cli_1.cchelper.join(path.dirname(gradlePropertyPath), 'local.properties'), content);
            }
            else {
                console.log(`warning: ${gradlePropertyPath} not found!`);
            }
        });
    }
    execute(cmds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (cmds.append_file) {
                cmds.append_file.forEach(cmd => {
                    cocos_cli_1.cchelper.copy_file_sync(this.cocos_root, cmd.from, this.project_dir, cmd.to);
                });
                delete cmds.append_file;
            }
            if (cmds.exclude_from_template) {
                // do nothing
                delete cmds.exclude_from_template;
            }
            /// only in link mode
            let project_x_root = cmds.append_x_engine;
            if (cmds.append_x_engine && this.tp_name != "link") {
                let common = cocos2dx_files.common;
                let engine_to = cocos_cli_1.cchelper.replace_env_variables(cmds.append_x_engine.to);
                let to = path.isAbsolute(engine_to) ? engine_to : cocos_cli_1.cchelper.join(this.project_dir, engine_to);
                yield cocos_cli_1.cchelper.parallel_copy_files(20, this.cocos_root, common, to);
                if (this.lang == "js") {
                    let fileList = cocos2dx_files.js;
                    yield cocos_cli_1.cchelper.parallel_copy_files(20, this.cocos_root, fileList, to);
                }
            }
            delete cmds.append_x_engine;
            if (cmds.append_from_template) {
                let cmd = cmds.append_from_template;
                // console.log(`append-from-template ${JSON.stringify(cmd)}`);
                yield cocos_cli_1.cchelper.copy_files_with_config({
                    from: cmd.from,
                    to: cmd.to,
                    exclude: cmd.exclude
                }, this.tp_dir, this.project_dir);
                delete cmds.append_from_template;
            }
            let replace_files_delay = {};
            ;
            if (cmds.project_replace_project_name) {
                let cmd = cmds.project_replace_project_name;
                cmd.files.forEach(file => {
                    let fp = cocos_cli_1.cchelper.join(this.project_dir, file);
                    replace_files_delay[fp] = replace_files_delay[fp] || [];
                    replace_files_delay[fp].push({
                        reg: cmd.src_project_name,
                        content: this.project_name
                    });
                });
                delete cmds.project_replace_project_name;
            }
            if (cmds.project_replace_package_name) {
                let cmd = cmds.project_replace_package_name;
                let name = cmd.src_package_name.replace(/\./g, "\\.");
                cmd.files.forEach(file => {
                    let fp = cocos_cli_1.cchelper.join(this.project_dir, file);
                    replace_files_delay[fp] = replace_files_delay[fp] || [];
                    replace_files_delay[fp].push({
                        reg: name,
                        content: this.package_name
                    });
                });
                delete cmds.project_replace_package_name;
            }
            if (cmds.project_replace_mac_bundleid) {
                let cmd = cmds.project_replace_mac_bundleid;
                let bundle_id = cmd.src_bundle_id.replace(/\./g, "\\.");
                cmd.files.forEach(file => {
                    let fp = cocos_cli_1.cchelper.join(this.project_dir, file);
                    replace_files_delay[fp] = replace_files_delay[fp] || [];
                    replace_files_delay[fp].push({
                        reg: bundle_id,
                        content: this.mac_bundleid
                    });
                });
                delete cmds.project_replace_mac_bundleid;
            }
            if (cmds.project_replace_ios_bundleid) {
                let cmd = cmds.project_replace_ios_bundleid;
                let bundle_id = cmd.src_bundle_id.replace(/\./g, "\\.");
                cmd.files.forEach(file => {
                    let fp = cocos_cli_1.cchelper.join(this.project_dir, file);
                    replace_files_delay[fp] = replace_files_delay[fp] || [];
                    replace_files_delay[fp].push({
                        reg: bundle_id,
                        content: this.ios_bundleid
                    });
                });
                delete cmds.project_replace_ios_bundleid;
            }
            if (cmds.project_replace_cocos_x_root) {
                let cmd = cmds.project_replace_cocos_x_root;
                let cocos_x_root = path.normalize(this.cocos_root);
                let proj_cocos_path = path.normalize(cocos_cli_1.cchelper.join(this.project_dir, project_x_root.to));
                for (let f of cmd.files) {
                    let p = typeof (f) == "string" ? f : f.file;
                    // console.log(`warning: project dir ${this.project_dir!} + ${p}`);
                    let fp = cocos_cli_1.cchelper.join(this.project_dir, p);
                    let list = replace_files_delay[fp] = replace_files_delay[fp] || [];
                    if (this.tp_name == "link") {
                        let v = typeof f.link == "string" ? f.link : cocos_x_root;
                        v = cocos_cli_1.cchelper.fix_path(v);
                        list.push({
                            reg: cmd.pattern,
                            content: v
                        });
                    }
                    else {
                        // use relative path
                        let rel_path = path.relative(fp, proj_cocos_path);
                        let v = !!f.default ? f.default : rel_path;
                        v = cocos_cli_1.cchelper.fix_path(v);
                        list.push({
                            reg: cmd.pattern,
                            content: v
                        });
                    }
                }
                delete cmds.project_replace_cocos_x_root;
            }
            if (cmds.project_replace_projec_common) {
                let cmd = cmds.project_replace_projec_common;
                let cocos_x_root = path.normalize(this.cocos_root);
                let proj_common_dir = cocos_cli_1.cchelper.join(this.project_dir, this.plugin.common_dir);
                for (let f of cmd.files) {
                    let p = typeof (f) == "string" ? f : f.file;
                    let fp = cocos_cli_1.cchelper.join(this.project_dir, p);
                    let list = replace_files_delay[fp] = replace_files_delay[fp] || [];
                    let rel_path = path.relative(fp, proj_common_dir);
                    list.push({
                        reg: cmd.pattern,
                        content: cocos_cli_1.cchelper.fix_path(rel_path)
                    });
                }
                delete cmds.project_replace_projec_common;
            }
            if (cmds.common_replace) {
                for (let cmd of cmds.common_replace) {
                    for (let f of cmd.files) {
                        let fp = cocos_cli_1.cchelper.join(this.project_dir, f);
                        replace_files_delay[fp] = replace_files_delay[fp] || [];
                        replace_files_delay[fp].push({
                            reg: cmd.pattern,
                            content: cmd.value
                        });
                    }
                }
                delete cmds.common_replace;
            }
            for (let fullpath in replace_files_delay) {
                let cfg = replace_files_delay[fullpath];
                yield cocos_cli_1.cchelper.replace_in_file(cfg.map(x => {
                    return { reg: x.reg, text: x.content };
                }), fullpath);
            }
            if (Object.keys(cmds).length > 0) {
                for (let f in cmds) {
                    console.error(`command "${f}" is not parsed in ${PackageNewConfig}`);
                }
            }
        });
    }
}
exports.TemplateCreator = TemplateCreator;
//# sourceMappingURL=plugin_new.js.map