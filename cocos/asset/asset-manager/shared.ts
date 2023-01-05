/*
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { EDITOR } from 'internal:constants';
import { Asset } from '../assets/asset';
import Bundle from './bundle';
import Cache from './cache';
import { Pipeline } from './pipeline';
import WeakCache from './weak-cache';

export const assets = EDITOR ? new WeakCache<Asset>() : new Cache<Asset>();
export const files = new Cache();
export const parsed = new Cache();
export const bundles = new Cache<Bundle>();
export const pipeline = new Pipeline('normal load', []);
export const fetchPipeline = new Pipeline('fetch', []);
export const transformPipeline = new Pipeline('transform url', []);
export const references = EDITOR ? new Cache<any[]>() : null;
export const assetsOverrideMap = new Map<string, string>();

export enum RequestType {

    UUID = 'uuid',

    PATH = 'path',

    DIR = 'dir',

    URL = 'url',

    SCENE = 'scene',
}

export interface IRequest extends Record<string, any> {
    uuid?: string;
    url?: string;
    path?: string;
    dir?: string;
    scene?: string;
}

export const presets: Record<string, Record<string, any>> = {

    default: {
        priority: 0,
    },

    preload: {
        maxConcurrency: 6,
        maxRequestsPerFrame: 2,
        priority: -1,
    },

    scene: {
        maxConcurrency: 20,
        maxRequestsPerFrame: 20,
        priority: 1,
    },

    bundle: {
        maxConcurrency: 20,
        maxRequestsPerFrame: 20,
        priority: 2,
    },

    remote: {
        maxRetryCount: 4,
    },
};

/**
 * @en
 * The builtin bundles
 *
 * @zh
 * 内置 bundle
 *
 */
export enum BuiltinBundleName {
    /**
     * @en
     * The builtin bundle of default asset
     *
     * @zh
     * 内置 bundle, 对应默认资源
     */
    INTERNAL = 'internal',

    /**
     * @en
     * The builtin bundle corresponds to 'assets/resources'.
     *
     * @zh
     * 内置 bundle, 对应 'assets/resources' 目录
     *
     */
    RESOURCES = 'resources',

    /**
     * @en
     * The builtin bundle
     *
     * @zh
     * 内置 bundle
     *
     */
    MAIN = 'main',

    /**
     * @en
     * The builtin bundle, exists when Start Scene asset bundle is checked on the project building panel
     *
     * @zh
     * 内置 bundle, 如果构建面板开启了首场景分包，则会有 START_SCENE bundle
     *
     */
    START_SCENE = 'start-scene',
}
