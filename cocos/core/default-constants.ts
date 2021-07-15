/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
 */

const _global = typeof window === 'undefined' ? global : window;

function defined (name: string) {
    return typeof _global[name] === 'object';
}

function tryDefineGlobal (name: string, value: boolean): boolean {
    if (typeof _global[name] === 'undefined') {
        return (_global[name] = value);
    } else {
        return _global[name];
    }
}

// No export to global required since we have already done here.
export const EXPORT_TO_GLOBAL = false;
export const BUILD = tryDefineGlobal('CC_BUILD', false);
export const TEST = tryDefineGlobal('CC_TEST', defined('tap') || defined('QUnit'));
export const EDITOR = tryDefineGlobal('CC_EDITOR', defined('Editor') && defined('process') && ('electron' in process.versions));
export const PREVIEW = tryDefineGlobal('CC_PREVIEW', !EDITOR);
export const DEV = tryDefineGlobal('CC_DEV', true); // (CC_EDITOR && !CC_BUILD) || CC_PREVIEW || CC_TEST
export const DEBUG = tryDefineGlobal('CC_DEBUG', true); // CC_DEV || Debug Build
export const JSB = tryDefineGlobal('CC_JSB', defined('jsb'));
export const HTML5 = false;
// @ts-expect-error
export const WECHAT = tryDefineGlobal('CC_WECHAT', !!(defined('wx') && (wx.getSystemInfoSync || wx.getSharedCanvas)));
export const MINIGAME = tryDefineGlobal('CC_MINIGAME', false);
export const RUNTIME_BASED = tryDefineGlobal('CC_RUNTIME_BASED', false);
export const ALIPAY = tryDefineGlobal('CC_ALIPAY', false);
export const XIAOMI = tryDefineGlobal('CC_XIAOMI', false);
export const BYTEDANCE = tryDefineGlobal('CC_BYTEDANCE', false);
export const BAIDU = tryDefineGlobal('CC_BAIDU', false);
export const COCOSPLAY = tryDefineGlobal('CC_COCOSPLAY', false);
export const HUAWEI = tryDefineGlobal('CC_HUAWEI', false);
export const OPPO = tryDefineGlobal('CC_OPPO', false);
export const VIVO = tryDefineGlobal('CC_VIVO', false);
// @ts-expect-error
export const SUPPORT_JIT = tryDefineGlobal('CC_SUPPORT_JIT', ('function' === typeof loadRuntime));
export const SERVER_MODE = false;
