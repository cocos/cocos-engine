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
    EXPORT_TO_GLOBAL,
} from 'internal:constants';

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

if (EXPORT_TO_GLOBAL) {
    // Supports dynamically access from external scripts such as adapters and debugger.
    // So macros should still defined in global even if inlined in engine.
    /**
     * @en The pre-compilation constant for code tree shaking: CC_BUILD (Available for built package)
     * @zh 预编译宏变量，通常用来做平台或环境相关自动代码剔除：CC_BUILD（在构建后生效）
     */
    _global.CC_BUILD = BUILD;
    /**
     * @en The pre-compilation constant for code tree shaking: CC_TEST (Available for ci test environment)
     * @zh 预编译宏变量，通常用来做平台或环境相关自动代码剔除：CC_TEST（在 CI 测试环境下生效）
     */
    _global.CC_TEST = TEST;
    /**
     * @en The pre-compilation constant for code tree shaking: CC_EDITOR (Available for editor environment)
     * @zh 预编译宏变量，通常用来做平台或环境相关自动代码剔除：CC_EDITOR（在编辑器环境下生效）
     */
    _global.CC_EDITOR = EDITOR;
    /**
     * @en The pre-compilation constant for code tree shaking: CC_PREVIEW (Available for preview)
     * @zh 预编译宏变量，通常用来做平台或环境相关自动代码剔除：CC_PREVIEW（预览时生效）
     */
    _global.CC_PREVIEW = PREVIEW;
    /**
     * @en The pre-compilation constant for code tree shaking: CC_DEV (Internal)
     * @zh 预编译宏变量，通常用来做平台或环境相关自动代码剔除：CC_DEV（内部使用）
     */
    _global.CC_DEV = DEV;
    /**
     * @en The pre-compilation constant for code tree shaking: CC_DEBUG (Available for debug environment)
     * @zh 预编译宏变量，通常用来做平台或环境相关自动代码剔除：CC_DEBUG（在调试模式下生效）
     */
    _global.CC_DEBUG = DEBUG;
    /**
     * @en The pre-compilation constant for code tree shaking: CC_JSB (Available for native application environment)
     * @zh 预编译宏变量，通常用来做平台或环境相关自动代码剔除：CC_JSB（在原生应用环境下生效）
     */
    _global.CC_JSB = JSB;
    /**
     * @en The pre-compilation constant for code tree shaking: CC_BYTEDANCE (Available for Bytedance platform)
     * @zh 预编译宏变量，通常用来做平台或环境相关自动代码剔除：CC_BYTEDANCE（在字节平台上生效）
     */
    _global.CC_BYTEDANCE = BYTEDANCE;
    /**
     * @en The pre-compilation constant for code tree shaking: CC_WECHAT (Available for Wechat mini game platform)
     * @zh 预编译宏变量，通常用来做平台或环境相关自动代码剔除：CC_WECHAT（在微信小游戏平台上生效）
     */
    _global.CC_WECHAT = WECHAT;
    /**
     * @en The pre-compilation constant for code tree shaking: CC_ALIPAY (Available for Alipay mini game platform)
     * @zh 预编译宏变量，通常用来做平台或环境相关自动代码剔除：CC_ALIPAY（在支付宝小游戏平台上生效）
     */
    _global.CC_ALIPAY = ALIPAY;
    /**
     * @en The pre-compilation constant for code tree shaking: CC_XIAOMI (Available for MI mini game platform)
     * @zh 预编译宏变量，通常用来做平台或环境相关自动代码剔除：CC_XIAOMI（在小米小游戏平台上生效）
     */
    _global.CC_XIAOMI = XIAOMI;
    /**
     * @en The pre-compilation constant for code tree shaking: CC_BAIDU (Available for Baidu mini game platform)
     * @zh 预编译宏变量，通常用来做平台或环境相关自动代码剔除：CC_BAIDU（在百度小游戏平台上生效）
     */
    _global.CC_BAIDU = BAIDU;
    /**
     * @en The pre-compilation constant for code tree shaking: CC_COCOSPLAY (Available for Cocos Play platform)
     * @zh 预编译宏变量，通常用来做平台或环境相关自动代码剔除：CC_COCOSPLAY（在 CocosPlay 小游戏平台上生效）
     */
    _global.CC_COCOSPLAY = COCOSPLAY;
    /**
     * @en The pre-compilation constant for code tree shaking: CC_HUAWEI (Available for Huawei mini game platform)
     * @zh 预编译宏变量，通常用来做平台或环境相关自动代码剔除：CC_HUAWEI（在华为快游戏平台上生效）
     */
    _global.CC_HUAWEI = HUAWEI;
    /**
     * @en The pre-compilation constant for code tree shaking: CC_OPPO (Available for OPPO mini game platform)
     * @zh 预编译宏变量，通常用来做平台或环境相关自动代码剔除：CC_OPPO（在 OPPO 小游戏平台上生效）
     */
    _global.CC_OPPO = OPPO;
    /**
     * @en The pre-compilation constant for code tree shaking: CC_VIVO (Available for Vivo mini game platform)
     * @zh 预编译宏变量，通常用来做平台或环境相关自动代码剔除：CC_VIVO（在 Vivo 小游戏平台上生效）
     */
    _global.CC_VIVO = VIVO;
    /**
     * @en The pre-compilation constant for code tree shaking: CC_MINIGAME (Available for general mini game platforms)
     * @zh 预编译宏变量，通常用来做平台或环境相关自动代码剔除：CC_MINIGAME（在各个小游戏平台上生效）
     */
    _global.CC_MINIGAME = MINIGAME;
    /**
     * @en The pre-compilation constant for code tree shaking: CC_RUNTIME_BASED (Available for Huawei, OPPO, Vivo and Cocos Play)
     * @zh 预编译宏变量，通常用来做平台或环境相关自动代码剔除：CC_RUNTIME_BASED（在华为、OPPO、Vivo 和 CocosPlay 平台上生效）
     */
    _global.CC_RUNTIME_BASED = RUNTIME_BASED;
    /**
     * @en The pre-compilation constant for code tree shaking: CC_SUPPORT_JIT (Available for platforms support JIT)
     * @zh 预编译宏变量，通常用来做平台或环境相关自动代码剔除：CC_SUPPORT_JIT（在支持 JIT 的平台上生效）
     */
    _global.CC_SUPPORT_JIT = SUPPORT_JIT;
}

if (DEV) {
    legacyCC._Test = {};
}

const engineVersion = '3.3.1';
/**
 * The current version of Cocos2d being used.<br/>
 * Please DO NOT remove this String, it is an important flag for bug tracking.<br/>
 * If you post a bug to forum, please attach this flag.
 */
_global.CocosEngine = legacyCC.ENGINE_VERSION = engineVersion;

_global.cc = legacyCC;

export { engineVersion as VERSION };
