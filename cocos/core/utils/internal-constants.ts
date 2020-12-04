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

import raw from "internal:raw-constants";

/**
 * Tell if is targeting production build.
 */
export const BUILD = raw.BUILD === true;

/**
 * Tell if is targeting engine's unit test.
 */
export const TEST = raw.TEST === true;

/**
 * Tell if is targeting the editor.
 */
export const EDITOR = raw.EDITOR === true;

/**
 * Tell if is targeting preview(in either browser or simulator).
 */
export const PREVIEW = raw.PREVIEW === true;

/**
 * Tell if is targeting editor or preview.
 */
export const DEV = EDITOR || PREVIEW || TEST;

/**
 * Tell if is targeting the editor or preview, or debug build of production.
 */
export const DEBUG = raw.DEBUG === true || DEV;

/**
 * Tell if is targeting native platforms (mobile app, desktop app, or simulator).
 */
export const JSB = raw.platform === 'NATIVE';

/**
 * Tell if is targeting Wechat mini game.
 */
export const WECHAT = raw.platform === 'WECHAT';

/**
 * Tell if is targeting Alipay mini game.
 */
export const ALIPAY = raw.platform === 'ALIPAY';

/**
 * Tell if is targeting Xiaomi quick game.
 */
export const XIAOMI = raw.platform === 'XIAOMI';

/**
 * Tell if is targeting ByteDance quick game.
 */
export const BYTEDANCE = raw.platform === 'BYTEDANCE';

/**
 * Tell if is targeting Baidu mini game.
 */
export const BAIDU = raw.platform === 'BAIDU';

/**
 * Tell if is targeting CocosPlay.
 */
export const COCOSPLAY = raw.platform === 'COCOSPLAY';

/**
 * Tell if is targeting Huawei quick game.
 */
export const HUAWEI = raw.platform === 'HUAWEI';

/**
 * Tell if is targeting OPPO mini game.
 */
export const OPPO = raw.platform === 'OPPO';

/**
 * Tell if is targeting VIVO mini game.
 */
export const VIVO = raw.platform === 'VIVO';

/**
 * Tell if is targeting QTT quick game.
 */
export const QTT = raw.platform === 'QTT';

/**
 * Tell if is targeting linksure quick game.
 */
export const LINKSURE = raw.platform === 'LINKSURE';

/**
 * Tell if is targeting mini games.
 */
export const MINIGAME = WECHAT || ALIPAY || XIAOMI || BYTEDANCE || BAIDU;

/**
 * Tell if the target platform is Cocos Runtime based.
 */
export const RUNTIME_BASED = OPPO || VIVO || HUAWEI || COCOSPLAY || LINKSURE || QTT;

/**
 * Tell if the target platform supports JIT.
 */
export const SUPPORT_JIT = !(MINIGAME || RUNTIME_BASED);
