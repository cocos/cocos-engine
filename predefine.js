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
if (CC_DEV) {
    require('./DebugInfos');
}

// polyfills
/* require('./polyfill/bind'); */
require('./polyfill/string');
require('./polyfill/math');
require('./polyfill/array');
if (!(CC_EDITOR && Editor.isMainProcess)) {
    require('./polyfill/babel');
}


// predefine some modules for cocos
require('./cocos2d/core/platform/js');
require('./cocos2d/core/value-types');
require('./cocos2d/core/utils');
require('./cocos2d/core/platform/CCInputManager');
require('./cocos2d/core/platform/CCInputExtension');
require('./cocos2d/core/event');
require('./cocos2d/core/platform/CCSys');
require('./cocos2d/core/platform/CCMacro');
require('./cocos2d/core/load-pipeline');
require('./cocos2d/core/textures');

if (!CC_JSB) {
    require('./cocos2d/kazmath');
    require('./cocos2d/core/CCDirector');
    require('./cocos2d/core/CCDirectorWebGL');
    require('./cocos2d/core/CCDirectorCanvas');

    if (!(CC_EDITOR && Editor.isMainProcess)) {
        require('./cocos2d/core/platform/CCSAXParser');
        require('./cocos2d/core/platform/CCView');
        require('./cocos2d/core/platform/CCScreen');
        require('./cocos2d/core/CCActionManager');
        require('./cocos2d/core/CCScheduler');
        require('./cocos2d/core/event-manager');
        require('./cocos2d/core/renderer');
        require('./cocos2d/shaders');
        require('./cocos2d/compression');

        require('./CCBoot');
        require('./cocos2d/core/CCGame');
    }
}

ccui = {};
ccs = {};
cp = {};
