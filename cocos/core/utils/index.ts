/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

import * as js from './js';

/**
 * 杂项工具函数
 */
import * as misc from './misc';

/**
 * 用于处理文件与目录的路径的模块
 */
import * as path from './path';
import { deprecatedWrapper } from '../../deprecated';
import * as math from '../math';

deprecatedWrapper({
    oldTarget: misc,
    oldPrefix: 'misc',
    newTarget: math,
    newPrefix: 'math',
    pairs: [
        ['clampf', 'clamp'],
        ['clamp01', 'clamp01'],
        ['lerp', 'lerp'],
        ['degreesToRadians', 'toRadian'],
        ['radiansToDegrees', 'toDegree'],
    ],
});

export * from './text-utils';
export * from './html-text-parser';

export * from './prefab-helper';
export {
    js,
    misc,
    path,
};

// export const js = cc.js;
// export const path = cc.path;
