/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

// PREDEFINE

// window may be undefined when first load engine from editor
var _global = typeof window === 'undefined' ? global : window;

/**
 * !#en
 * The main namespace of Cocos2d-JS, all engine core classes, functions, properties and constants are defined in this namespace.
 * !#zh
 * Cocos 引擎的主要命名空间，引擎代码中所有的类，函数，属性和常量都在这个命名空间中定义。
 * @module cc
 * @main cc
 */
_global.cc = _global.cc || {};

// For internal usage
_global._cc = _global._cc || {};

require('./predefine');

// polyfills
require('./polyfill/string');
require('./polyfill/misc');
require('./polyfill/array');
require('./polyfill/object');
require('./polyfill/array-buffer');
require('./polyfill/number');
if (!(CC_EDITOR && Editor.isMainProcess)) {
    require('./polyfill/typescript');
}

require('./cocos2d/core/predefine');

// LOAD COCOS2D ENGINE CODE

if (!(CC_EDITOR && Editor.isMainProcess)) {
    require('./cocos2d');
}

// LOAD EXTENDS

require('./extends');

if (CC_EDITOR) {
    if (Editor.isMainProcess) {
        Editor.versions['cocos2d'] = require('./package').version;
    }
}

module.exports = _global.cc;