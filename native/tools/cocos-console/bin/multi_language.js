"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_current_string = exports.has_key = exports.get_string = exports.set_current_language = void 0;
const path = require("path");
const fs = require("fs");
const cfg_info = require("./strings.json");
// const CONFIG_FILE_NAME = "strings.json";
const DEFAULT_LANGUAGE = "en";
let locale = null;
let cur_lang_string = null;
let default_lang_string = null;
function get_env_locale() {
    const default_ret = { lang: "en" };
    let env = process.env;
    let lang_encoding = env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE || Intl.DateTimeFormat().resolvedOptions().locale;
    if (!lang_encoding) {
        return default_ret;
    }
    let p2 = lang_encoding.split(".");
    return { lang: p2[0] || default_ret.lang };
}
function get_avaiable_langs() {
    if (!!cfg_info) {
        return Object.keys(cfg_info);
    }
    return [];
}
function get_lang_key(lang) {
    let p2 = lang.split("_");
    if (p2[0] == "zh")
        return (p2.length == 1 || p2[1] == "cn") ? "zh" : "zh_tr";
    return p2[0];
}
function do_init() {
    locale = get_env_locale();
    cur_lang_string = cfg_info[get_lang_key(locale.lang)];
    if (!cur_lang_string) {
        cur_lang_string = cfg_info[DEFAULT_LANGUAGE];
    }
    default_lang_string = cfg_info[DEFAULT_LANGUAGE];
}
do_init();
function set_current_language(lang) {
    let lang_key = get_lang_key(lang);
    if (lang in cfg_info) {
        cur_lang_string = cfg_info[lang];
        locale.lang = lang;
    }
    else if (lang_key in cfg_info) {
        cur_lang_string = cfg_info[lang_key];
        locale.lang = lang_key;
    }
    else {
        console.warn();
    }
}
exports.set_current_language = set_current_language;
function get_string(key, ...fmts) {
    if (cur_lang_string) {
        let fmt = cur_lang_string[key];
        if (!fmt) {
            return `[KEY "${key}" is not found! lang: ${locale.lang}]`;
        }
        if (fmts.length == 0) {
            return fmt;
        }
        let chars = Array.from(fmt);
        let ret = [];
        let len = chars.length;
        let p = 0;
        let ai = 0;
        let place_holders = 0;
        while (p < len) {
            if (chars[p] == "%") {
                if (chars[p + 1] == "d" || chars[p + 1] == "f") {
                    ret.push(fmts[ai++] + ""); // %d | %f
                    place_holders++;
                }
                else if (chars[p + 1] == "s") {
                    ret.push(fmts[ai++] + ""); // %s 
                    place_holders++;
                }
                else if (chars[p + 1] == "%") {
                    ret.push("%"); // %%
                }
                else {
                    // unknown formatter?
                    ret.push(fmts[ai++] + ""); // %?
                    place_holders++;
                }
                p += 2;
            }
            else {
                ret.push(chars[p]);
                p += 1;
            }
        }
        if (place_holders != fmts.length) {
            console.error(`format argument mismatch: ${fmt} & ${fmts.join(", ")}`);
        }
        return ret.join("");
    }
    return `[language ${locale.lang} not set, key ${key}]`;
}
exports.get_string = get_string;
function has_key(key, data) {
    return !!data && (key in data);
}
exports.has_key = has_key;
function get_current_string(key) {
    let ret;
    if (has_key(key, cur_lang_string)) {
        ret = cur_lang_string[key];
    }
    else if (has_key(key, default_lang_string)) {
        ret = default_lang_string[key];
    }
    return ret || key;
}
exports.get_current_string = get_current_string;
//# sourceMappingURL=multi_language.js.map