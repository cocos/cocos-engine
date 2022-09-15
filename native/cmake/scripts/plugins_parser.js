const fs = require('fs');
const path = require('path');
const version_parser = require('./plugin_support/plugin_cfg');

const MAX_SEARCH_LEVEL = 7;
const CC_PLUGIN_JSON_STR = 'cc_plugin.json';

const node_path = process.argv.shift();
const script_path = process.argv.shift();
const search_path_input_file = process.argv.shift();
const plugin_cmake_output_file = process.argv.shift();
const PLATFORM_NAME_FROM_CMAKE = process.argv.shift();

const PROJ_SEARCH_PATHS = fs.readFileSync(search_path_input_file, 'utf8').
    split('\n').
    map(x => x.trim()).
    filter(x => x.length > 0 && !x.startsWith("#"));

const cc_config_json_list = [];

function search_cc_config_json_levels(dir, depth) {
    // console.log(`[searching plugins] search dir ${dir}`);
    if (depth > MAX_SEARCH_LEVEL) return;
    const st = fs.statSync(dir);
    if (!st.isDirectory()) return;

    let subfiles = fs.readdirSync(dir);
    let subdirs = [];
    for (let item of subfiles) {
        if (item === "." || item === "..") continue;
        let fp = path.join(dir, item);
        const subst = fs.statSync(fp);
        if (subst.isFile() && item === CC_PLUGIN_JSON_STR) {
            cc_config_json_list.push(dir);
            return;
        }
        if (subst.isDirectory()) {
            subdirs.push(fp);
        }
    }
    for (let sd of subdirs) {
        search_cc_config_json_levels(sd, depth + 1);
    }
}

for (let searchPath of PROJ_SEARCH_PATHS) {
    if (!fs.existsSync(searchPath)) {
        console.log(`[searching plugins] directory ${searchPath} does not exist`);
        continue;
    }
    search_cc_config_json_levels(searchPath, 1);
}


if (cc_config_json_list.length === 0) {
    console.log("[searching plugins] no plugins found!");
    process.exit(0)
}

for (let dir of cc_config_json_list) {
    console.log(`[searching plugins]   plugin dir found: ${dir}`)
}

function read_engine_version() {
    const pkg = path.join(__dirname, '../../../package.json');
    return require(pkg).version;
}

function parse_package_dependency(info) {
    let pkgs = [];
    for (let m of info.modules) {
        if (m.platforms && m.platforms.indexOf(PLATFORM_NAME_FROM_CMAKE) < 0) {
            continue;
        }
        pkgs.push({ target: m.target, depends: typeof m.depends === 'string' ? [m.depends] : (m.depends || []) });
    }
    return pkgs;
}

function get_property_variants(obj, ...names) {
    for (let n of names) {
        if (obj.hasOwnProperty(n)) {
            return obj[n];
        }
        if (n.indexOf('_') >= 0) {
            const k = n.replace(/_/g, '-');
            if (obj.hasOwnProperty(k)) {
                return obj[k];
            }
        }
        if (n.indexOf('-') >= 0) {
            const k = n.replace(/-/g, '_');
            if (obj.hasOwnProperty(k)) {
                return obj[k];
            }
        }
    }
    return undefined;
}


function test_enable_by_configurations(config) {
    const support_platforms = get_property_variants(config, "platforms") || [];
    const enabled_default = get_property_variants(config, "enable", "enabled");
    const enable_all = enabled_default === undefined ? true : enabled_default;
    const disable_all = (get_property_variants(config, "disable", "disabled") || false) || !enable_all;
    const disabled_platforms = get_property_variants(config, "disable-by-platforms", "disabled-by-platforms") || [];
    const engine_version_value = get_property_variants(config, "engine-version");
    if (disable_all) {
        // all disabled 
        console.log(` plugin is disabled.`);
        return false;
    }
    if (support_platforms.length > 0 && support_platforms.indexOf(PLATFORM_NAME_FROM_CMAKE) < 0) {
        // unsupported platform
        console.log(` plugin is not supported by current platform ${PLATFORM_NAME_FROM_CMAKE}.`);
        return false;
    }
    if (disabled_platforms.indexOf(PLATFORM_NAME_FROM_CMAKE) > -1) {
        // disable by user settings
        console.log(` plugin is disabled by setting.`);
        return false;
    }

    const ENGINE_VERSION = read_engine_version().replace(/^(v|V)/, '');
    try {
        const version_filter = version_parser.parse(engine_version_value);
        const version_valid = version_filter.match(ENGINE_VERSION);
        if (!version_valid) {
            console.warn(` Engine version '${ENGINE_VERSION}' mismatch '${engine_version_value}'`);
        }
    } catch (e) {
        console.error(` Failed to parse 'engine-version', value: '${engine_version_value}'`);
        console.error(e);
        return false;
    }
    return true;
}

function validate_cc_plugin_json_format(tag, content) {
    const field_required = (obj, field_name) => {
        if (Object.hasOwnProperty(obj, field_name)) {
            console.warn(`${tag} field '${field_name}' is not set`);
            return false;
        }
        return true;
    }
    const required_fields = ["name", "version", "engine-version", "author", "description", "modules", "platforms"];
    for (const f of required_fields) {
        if (!field_required(content, f)) {
            return false;
        }
    }
    const modules = content["modules"];
    if (modules.length == 0) {
        console.warn(`${tag} modules field is empty`);
        return false;
    }

    for (let m of modules) {
        const mod_fields = ["target"];
        for (const f of mod_fields) {
            if (!field_required(m, f)) {
                console.warn(`${tag} module field ${f} is not set`);
                return false;
            }
        }
    }
    return true;
}


function add_search_path_suffix(dir, platform) {
    if (platform.match(/^android/i)) {
        return [`${dir}/android/\${ANDROID_ABI}`, `${dir}/android`];
    } else if (platform.match(/^win/i)) {
        return [`${dir}/windows/x86_64`, `${dir}/windows`];
    } else if (platform.match(/^iphonesimulator/i)) {
        return [`${dir}/iphonesimulator`, `${dir}/ios`];
    } else if (platform.match(/^ios/i)) {
        return [`${dir}/ios`];
    } else if (platform.match(/^mac/i) || platform.match(/^darwin/i)) {
        return [`${dir}/mac/\${CMAKE_SYSTEM_PROCESSOR}`, `${dir}/mac`];
    } else {
        console.warn(`Don't knowm suffix for '${platform}`)
        return [];
    }
}

console.log(`Engine version: ${read_engine_version()}`);

/// Generate Pre-AutoLoadPlugins.cmake

let output_lines = ["# plugins found & enabled in search path",
    "# To disable automatic update of this file, set SKIP_SCAN_PLUGINS to ON.",
    ""];
for (let plugin_dir of cc_config_json_list) {
    let load_plugins = [];
    try {
        let maybe_plugin_name = path.basename(plugin_dir);
        console.log(`Parsing plugin directory ${maybe_plugin_name}`);
        let cc_plugin_file = path.join(plugin_dir, CC_PLUGIN_JSON_STR);
        let cc_plugin_content = fs.readFileSync(cc_plugin_file, { encoding: 'utf8' });
        let cc_plugin_json = JSON.parse(cc_plugin_content);
        if (!validate_cc_plugin_json_format(`Parsing module ${maybe_plugin_name}:`, cc_plugin_json)) {
            continue;
        }
        if (!test_enable_by_configurations(cc_plugin_json)) {
            console.log(` ${maybe_plugin_name} disabled by configuration`);
            continue;
        }
        const plugin_name = cc_plugin_json.name;
        const module_type = get_property_variants(cc_plugin_json, "module_type")
        if (module_type !== undefined && module_type !== 'release') {
            console.log(` plugin ${plugin_name} is not a release, should be include or add_subdirectory in dev env.`);
            continue;
        }
        const packages = parse_package_dependency(cc_plugin_json);
        const cc_project_dir = path.dirname(plugin_cmake_output_file);
        let project_to_plugin_dir = path.relative(cc_project_dir, plugin_dir).replace(/\\/g, '/');
        project_to_plugin_dir = `\${CC_PROJECT_DIR}/${project_to_plugin_dir}`;
        const plugin_root_path_for_platform = add_search_path_suffix(project_to_plugin_dir, PLATFORM_NAME_FROM_CMAKE);
        for (let pkg of packages) {
            const [target_name, target_version] = pkg.target.split('@');
            output_lines.push(`set(${target_name}_ROOT\n${plugin_root_path_for_platform.map(x => `   "${x}"`).join("\n")}\n)`, "");
            output_lines.push(`list(APPEND CMAKE_FIND_ROOT_PATH \${${target_name}_ROOT})`)
            load_plugins = load_plugins.concat([...pkg.depends, target_name + (target_version !== undefined ? '@' + target_version : '')]);
            output_lines.push(`list(APPEND CC_REGISTERED_PLUGINS`);
            output_lines = output_lines.concat(`  ${target_name}`);
            output_lines.push(`)`);
        }
        let plugin_names = load_plugins.map(x => x.split(/@/));
        for (let plg of plugin_names) {
            output_lines.push("");
            if (plg[1] && plg.length > 0) {
                output_lines.push(`find_package(${plg[0]} ${plg[1]}`);
            } else {
                output_lines.push(`find_package(${plg[0]}`);
            }
            output_lines.push(`  REQUIRED`);
            output_lines.push(`  NAMES "${plg[0]}"`);
            output_lines.push(`# NO_DEFAULT_PATH`);
            output_lines.push(`)`);
        }
        if (packages.length > 0) {
            console.log(` record plugin ${plugin_name}`);
        } else {
            console.log(` no sub module found`);
        }
    } catch (e) {
        console.error(`Parsing plugin directory: ${plugin_dir}`)
        console.error(e);
    }
}

if (cc_config_json_list.length == 0) {
    console.log(`Try unlink file ${out_file}`)
    if (fs.existsSync(out_file)) {
        fs.unlinkSync(out_file);
    }
} else {
    let old_content = null;
    let new_content = output_lines.join("\n") + "\n";
    if (fs.existsSync(plugin_cmake_output_file)) {
        old_content = fs.readFileSync(plugin_cmake_output_file);
    }
    if (old_content !== new_content) {
        fs.writeFileSync(plugin_cmake_output_file, output_lines.join("\n") + "\n", { encoding: 'utf8' });
    }
}
process.exit(0);
