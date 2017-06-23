/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

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
 * （好棒棒）<br>
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
 * @module GLOBAL MACROS
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
function defineMacro (name, defaultValue) {
    // if "global_defs" not preprocessed by uglify, just declare them globally,
    // this may happened in release version's preview page.
    // (use evaled code to prevent mangle by uglify)
    return 'if(typeof ' + name +  '=="undefined")' +
            name + '=' + defaultValue + ';';
}
function defined (name) {
    return 'typeof ' + name + '=="object"';
}
Function(
    defineMacro('CC_TEST', defined('tap') + '||' + defined('QUnit')) +
    defineMacro('CC_EDITOR', defined('Editor') + '&&' + defined('process') + '&&"electron" in process.versions') +
    defineMacro('CC_PREVIEW', '!CC_EDITOR') +
    defineMacro('CC_DEV', true) +    // (CC_EDITOR && !CC_BUILD) || CC_PREVIEW || CC_TEST
    defineMacro('CC_DEBUG', true) +  // CC_DEV || Debug Build
    defineMacro('CC_JSB', defined('jsb')) +
    defineMacro('CC_BUILD', false)
)();

// PREDEFINE

/**
 * !#en
 * The main namespace of Cocos2d-JS, all engine core classes, functions, properties and constants are defined in this namespace.
 * !#zh
 * Cocos 引擎的主要命名空间，引擎代码中所有的类，函数，属性和常量都在这个命名空间中定义。
 * @module cc
 * @main cc
 */
cc = {};

// The namespace for original nodes rendering in scene graph.
_ccsg = {};

if (CC_DEV) {
    /**
     * contains internal apis for unit tests
     * @expose
     */
    cc._Test = {};
}

// output all info before initialized
require('./CCDebugger');
cc._initDebugSetting(cc.DebugMode.INFO);
if (CC_DEBUG) {
    require('./DebugInfos');
}

// polyfills
/* require('./polyfill/bind'); */
require('./polyfill/string');
require('./polyfill/misc');
require('./polyfill/array');
if (!(CC_EDITOR && Editor.isMainProcess)) {
    require('./polyfill/typescript');
}

require('./cocos2d/kazmath');
require('./cocos2d/core/predefine');

ccui = {};
ccs = {};
cp = {};

// LOAD COCOS2D ENGINE CODE

if (CC_EDITOR && Editor.isMainProcess) {
    cc._initDebugSetting(1);    // DEBUG_MODE_INFO
}
else {
    require('./cocos2d/shaders');
    require('./CCBoot');
    require('./cocos2d');
}

// LOAD EXTENDS FOR CREATOR

require('./extends');

if (CC_EDITOR) {
    // In editor, in addition to the modules defined in cc scope, you can also access to the internal modules by using _require.
    // var isDomNode = cc._require('./cocos2d/core/platform/utils').isDomNode;
    cc._require = require;

    if (Editor.isMainProcess) {
        Editor.versions['cocos2d'] = require('./package.json').version;
    }
}

module.exports = cc;
