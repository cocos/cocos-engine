/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

/**
 * @packageDocumentation
 * @module core
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
    PREVIEW,
    RUNTIME_BASED,
    SUPPORT_JIT,
    TEST,
    BYTEDANCE,
    WECHAT,
    XIAOMI,
    HUAWEI,
    OPPO,
    VIVO,
} from 'internal:constants';

const _global = typeof window === 'undefined' ? global : window;

/**
 * The internal variable to strike some circular reference problem.
 * This also records the content of legacy global variable `cc`(prior to 3.0).
 */
export const legacyCC: Record<string, any> & {
    _global: typeof globalThis;
} = {
    _global,
};

// For internal usage
legacyCC.internal = {};

// These constants are also exported into global namespace for compatible with Creator prior to 3.0.
// Use `'cce.env'` from external, `'internal-constants'` from within internal instead.
_global.CC_BUILD = BUILD;
_global.CC_TEST = TEST;
_global.CC_EDITOR = EDITOR;
_global.CC_PREVIEW = PREVIEW;
_global.CC_DEV = DEV;
_global.CC_DEBUG = DEBUG;
_global.CC_JSB = JSB;
_global.CC_BYTEDANCE = BYTEDANCE;
_global.CC_WECHAT = WECHAT;
_global.CC_ALIPAY = ALIPAY;
_global.CC_XIAOMI = XIAOMI;
_global.CC_BAIDU = BAIDU;
_global.CC_COCOSPLAY = COCOSPLAY;
_global.CC_HUAWEI = HUAWEI;
_global.CC_OPPO = OPPO;
_global.CC_VIVO = VIVO;
_global.CC_MINIGAME = MINIGAME;
_global.CC_RUNTIME_BASED = RUNTIME_BASED;
_global.CC_SUPPORT_JIT = SUPPORT_JIT;

if (DEV) {
    legacyCC._Test = {};
}

const engineVersion = '3.0.0';
/**
 * The current version of Cocos2d being used.<br/>
 * Please DO NOT remove this String, it is an important flag for bug tracking.<br/>
 * If you post a bug to forum, please attach this flag.
 */
_global.CocosEngine = legacyCC.ENGINE_VERSION = engineVersion;

_global.cc = legacyCC;

export { engineVersion as VERSION };
