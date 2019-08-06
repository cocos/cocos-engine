/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

// MACROS

/**
 * !#zh
 * 这里是一些用来判断执行环境的宏，这些宏都是全局变量，直接访问即可。<br>
 * 在项目构建时，这些宏将会被预处理并根据构建的平台剔除不需要的代码，例如
 *
 *     if (CC_DEBUG) {
 *         cc.log('debug');
 *     }
 *     else {
 *         cc.log('release');
 *     }
 *
 * 在构建后会只剩下
 *
 *     cc.log('release');
 *
 * <br>
 * 如需判断脚本是否运行于指定平台，可以用如下表达式：
 *
 *     {
 *         "编辑器":  CC_EDITOR,
 *         "编辑器 或 预览":  CC_DEV,
 *         "编辑器 或 预览 或 构建调试":  CC_DEBUG,
 *         "网页预览":  CC_PREVIEW && !CC_JSB,
 *         "模拟器预览":  CC_PREVIEW && CC_JSB,
 *         "构建调试":  CC_BUILD && CC_DEBUG,
 *         "构建发行":  CC_BUILD && !CC_DEBUG,
 *     }
 *
 * !#en
 * Here are some of the macro used to determine the execution environment, these macros are global variables, can be accessed directly.<br>
 * When the project is built, these macros will be preprocessed and discard unreachable code based on the built platform, for example:
 *
 *     if (CC_DEBUG) {
 *         cc.log('debug');
 *     }
 *     else {
 *         cc.log('release');
 *     }
 *
 * After build will become:
 *
 *     cc.log('release');
 *
 * <br>
 * To determine whether the script is running on the specified platform, you can use the following expression:
 *
 *     {
 *         "editor":  CC_EDITOR,
 *         "editor or preview":  CC_DEV,
 *         "editor or preview or build in debug mode":  CC_DEBUG,
 *         "web preview":  CC_PREVIEW && !CC_JSB,
 *         "simulator preview":  CC_PREVIEW && CC_JSB,
 *         "build in debug mode":  CC_BUILD && CC_DEBUG,
 *         "build in release mode":  CC_BUILD && !CC_DEBUG,
 *     }
 *
 * @module GLOBAL-MACROS
 */
/**
 * @property {Boolean} CC_EDITOR - Running in the editor.
 */
/**
 * @property {Boolean} CC_PREVIEW - Preview in browser or simulator.
 */
/**
 * @property {Boolean} CC_DEV - Running in the editor or preview.
 */
/**
 * @property {Boolean} CC_DEBUG - Running in the editor or preview, or build in debug mode.
 */
/**
 * @property {Boolean} CC_BUILD - Running in published project.
 */
/**
 * @property {Boolean} CC_JSB - Running in native platform (mobile app, desktop app, or simulator).
 */
/**
 * @property {Boolean} CC_TEST - Running in the engine's unit test.
 */
/**
 * @property {Boolean} CC_RUNTIME - Running in runtime environments.
 */

// window may be undefined when first load engine from editor
var _global = typeof window === 'undefined' ? global : window;

/*
 * @param defaultValue - The default value is only used in the editor or preview.
 */
function defineMacro (name, defaultValue) {
    // if "global_defs" not preprocessed by uglify, just declare them globally,
    // this may happened in release version's preview page.
    if (typeof _global[name] === 'undefined') {
        _global[name] = defaultValue;
    }
}

function defineDeprecatedMacroGetter (name, defaultValue) {
    if (typeof _global[name] === 'undefined') {
        Object.defineProperty(_global, name, {
            get: function () {
                let recommandedUsage;
                if (name === 'CC_WECHATGAMESUB') {
                    recommandedUsage = 'cc.sys.platform === cc.sys.WECHAT_GAME_SUB';
                }
                else if (name === 'CC_WECHATGAME') {
                    recommandedUsage = 'cc.sys.platform === cc.sys.WECHAT_GAME';                    
                }
                else if (name === 'CC_QQPLAY') {
                    recommandedUsage = 'cc.sys.platform === cc.sys.QQ_PLAY';
                }
                cc.warnID(1400, name, recommandedUsage);
                return defaultValue;
            }
        });
    }
}

function defined (name) {
    return typeof _global[name] === 'object';
}

// ensure CC_BUILD is defined
// should not use window.CC_BUILD because we need get global_defs defined in uglify
defineMacro('CC_BUILD', false);

// These default values can only be defined after building
// If you need to modify them
// please modify the `global_defs` in the option returned by `gulp/util/utils.js: getUglifyOptions`.
if (CC_BUILD) {
    _global.CC_BUILD = CC_BUILD;
    _global.CC_DEV = CC_DEV;
    _global.CC_DEBUG = CC_DEBUG;
    _global.CC_JSB = CC_JSB;
    _global.CC_NATIVERENDERER = CC_NATIVERENDERER;
    _global.CC_SUPPORT_JIT = CC_SUPPORT_JIT;
}
else {
    defineMacro('CC_DEV', true);    // (CC_EDITOR && !CC_BUILD) || CC_PREVIEW || CC_TEST
    defineMacro('CC_DEBUG', true);  // CC_DEV || Debug Build
    defineMacro('CC_JSB', defined('jsb'));
    defineMacro('CC_NATIVERENDERER', defined('jsb'));
    defineMacro('CC_SUPPORT_JIT', true);
}
// defined in the runtime
defineMacro('CC_TEST', defined('tap') || defined('QUnit'));
defineMacro('CC_EDITOR', defined('Editor') && defined('process') && ('electron' in process.versions));
defineMacro('CC_PREVIEW', !CC_EDITOR);
defineMacro('CC_RUNTIME', 'function' === typeof loadRuntime);
defineMacro('CC_JSB', defined('jsb') && !CC_RUNTIME);
// deprecated 
const WECHATGAMESUB = !!(defined('wx') && wx.getSharedCanvas);
const WECHATGAME = !!(defined('wx') && (wx.getSystemInfoSync || wx.getSharedCanvas));
const QQPLAY = defined('bk');
defineDeprecatedMacroGetter('CC_WECHATGAMESUB', WECHATGAMESUB);
defineDeprecatedMacroGetter('CC_WECHATGAME', WECHATGAME);
defineDeprecatedMacroGetter('CC_QQPLAY', QQPLAY);

if (CC_DEV) {
    /**
     * contains internal apis for unit tests
     * @expose
     */
    cc._Test = {};
}

/**
 * @module cc
 */

/**
 * The current version of Cocos2d being used.<br/>
 * Please DO NOT remove this String, it is an important flag for bug tracking.<br/>
 * If you post a bug to forum, please attach this flag.
 * @property {String} ENGINE_VERSION
 */
const engineVersion = '2.0.0 alpha';
_global['CocosEngine'] = cc.ENGINE_VERSION = engineVersion;
