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

import { DEV } from 'internal:constants';

const _global = typeof window === 'undefined' ? global : window;

/**
 * @en
 * The main namespace of Cocos2d-JS, all engine core classes, functions, properties and constants are defined in this namespace.
 * @zh
 * Cocos 引擎的主要命名空间，引擎代码中所有的类，函数，属性和常量都在这个命名空间中定义。
 * @deprecated
 */
export const legacyCC: Record<string, any> & {
    _global: typeof globalThis;
} = {
    _global,
};

// For internal usage
legacyCC.internal = {};

if (DEV) {
    legacyCC._Test = {};
}

const engineVersion = '3.7.0';

/**
 * The current version of Cocos2d being used.<br/>
 * Please DO NOT remove this String, it is an important flag for bug tracking.<br/>
 * If you post a bug to forum, please attach this flag.
 */
_global.CocosEngine = legacyCC.ENGINE_VERSION = engineVersion;

_global.cc = legacyCC;

export { engineVersion as VERSION };

const ccwindow: typeof window = typeof globalThis.jsb !== 'undefined' ? (typeof jsb.window !== 'undefined' ? jsb.window : globalThis) : globalThis;
_global.ccwindow = ccwindow;

/**
 * @en
 * It is jsb.window in native mode, otherwise it is the window object in the web context.
 * @zh
 * 原生环境下为 jsb.window, 引擎为模拟部分 web 环境所提供. Web 环境这个变量是 window 对象.
 */
export { ccwindow };
