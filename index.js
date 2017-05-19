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
 * 好棒棒
 *
 * !#en
 *
 * TODO
 *
 * @module GLOBAL MACROS
 */
/**
 * @property {Boolean} CC_EDITOR - Running in the editor.
 */
/**
 * @property {Boolean} CC_DEV - Running in the editor or preview.
 */
/**
 * @property {Boolean} CC_JSB - Running in native platform.
 */
/**
 * @property {Boolean} CC_TEST - Running in the engine's unit test.
 */
Function(
    // if "global_defs" not preprocessed by uglify, just declare them globally,
    // this may happened in release version's preview page.
    // (use evaled code to prevent mangle by uglify)
    'var u="undefined",o="object";' +
    'if(typeof CC_TEST==u)' +
        'CC_TEST=typeof tap==o||typeof QUnit==o;' +
    'if(typeof CC_EDITOR==u)' +
        'CC_EDITOR=typeof Editor==o&&typeof process==o&&"electron" in process.versions;' +
    'if(typeof CC_DEV==u)' +
        'CC_DEV=CC_EDITOR||CC_TEST;' + /* CC_DEV contains CC_TEST and CC_EDITOR */
    'if(typeof CC_JSB==u)' +
        'CC_JSB=!1;'
)();

// PREDEFINE

require('./predefine');

// load Cocos2d engine code

if (CC_EDITOR && Editor.isMainProcess) {
    cc._initDebugSetting(1);    // DEBUG_MODE_INFO
}
else {
    require('./cocos2d/index.js');
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
