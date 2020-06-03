/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
 */

import {
    ALIPAY,
    BAIDU,
    BUILD,
    COCOSPLAY,
    DEBUG,
    DEV,
    EDITOR,
    JSB,
    MINIGAME,
    PHYSICS_AMMO,
    PHYSICS_BUILTIN,
    PHYSICS_CANNON,
    PREVIEW,
    RUNTIME_BASED,
    SUPPORT_JIT,
    TEST,
    WECHAT,
    XIAOMI,
} from 'internal:constants';

/**
 * !#en
 * The main namespace of Cocos2d-JS, all engine core classes, functions, properties and constants are defined in this namespace.
 * !#zh
 * Cocos 引擎的主要命名空间，引擎代码中所有的类，函数，属性和常量都在这个命名空间中定义。
 * @deprecated
 */
export const legacyCC: Record<string, any> = {};

// For internal usage
legacyCC.internal = {};

// @ts-ignore
const _global = typeof window === 'undefined' ? global : window;

legacyCC._global = _global;

if (BUILD) {
    // Supports dynamically access from external scripts such as adapters and debugger.
    // So macros should still defined in global even if inlined in engine.
    _global.CC_BUILD = BUILD;
    _global.CC_TEST = TEST;
    _global.CC_EDITOR = EDITOR;
    _global.CC_PREVIEW = PREVIEW;
    _global.CC_DEV = DEV;
    _global.CC_DEBUG = DEBUG;
    _global.CC_JSB = JSB;
    _global.CC_WECHAT = WECHAT;
    _global.CC_ALIPAY = ALIPAY;
    _global.CC_XIAOMI = XIAOMI;
    _global.CC_BAIDU = BAIDU;
    _global.CC_COCOSPLAY = COCOSPLAY;
    _global.CC_MINIGAME = MINIGAME;
    _global.CC_RUNTIME_BASED = RUNTIME_BASED;
    _global.CC_SUPPORT_JIT = SUPPORT_JIT;
    _global.CC_PHYSICS_BUILTIN = PHYSICS_BUILTIN;
    _global.CC_PHYSICS_CANNON = PHYSICS_CANNON;
    _global.CC_PHYSICS_AMMO = PHYSICS_AMMO;
}

if (DEV) {
    /**
     * contains internal apis for unit tests
     * @expose
     */
    legacyCC._Test = {};
}

/**
 * deprecated
 */
// TODO: ALIPAY and runtime will redefine
if (!(RUNTIME_BASED || ALIPAY)) {
    Object.defineProperty(_global, 'CC_PHYSICS_BUILT_IN', {
        get: () => {
            console.warn('CC_PHYSICS_BUILT_IN is deprecated, please using CC_PHYSICS_BUILTIN instead.');
            return _global.CC_PHYSICS_BUILTIN;
        },
    });
}

/**
 * The current version of Cocos2d being used.<br/>
 * Please DO NOT remove this String, it is an important flag for bug tracking.<br/>
 * If you post a bug to forum, please attach this flag.
 */
const engineVersion = '1.1.0';
_global.CocosEngine = legacyCC.ENGINE_VERSION = engineVersion;

_global.cc = legacyCC;
