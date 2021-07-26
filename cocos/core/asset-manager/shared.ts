/*
 Copyright (c) 2019-2020 Xiamen Yaji Software Co., Ltd.

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
/**
 * @packageDocumentation
 * @hidden
 */
import { EDITOR } from 'internal:constants';
import { Asset } from '../assets/asset';
import Bundle from './bundle';
import Cache from './cache';
import { Pipeline } from './pipeline';
import RequestItem from './request-item';
import WeakCache from './weak-cache';

export type CompleteCallback<T = any> = (err: Error | null, data?: T | null) => void;
export type CompleteCallbackNoData = (err?: Error | null) => void;
export type CompleteCallbackWithData<T = any> = (err: Error | null, data: T) => void;
export type ProgressCallback = (finished: number, total: number, item: RequestItem) => void;
export type Request = string | string[] | IRequest | Array<IRequest>;

export interface IRequest extends IOptions {
    uuid?: string;
    url?: string;
    path?: string;
    dir?: string;
    scene?: string;
}

export interface IOptions extends IBundleOptions, IRemoteOptions {
    type?: typeof Asset;
    bundle?: string;
}

export interface IRemoteOptions extends IAssetOptions {
    ext?: string;
}

export interface IXHROptions extends Record<string, any> {
    xhrResponseType?: XMLHttpRequestResponseType;
    xhrWithCredentials?: boolean;
    xhrTimeout?: number;
    xhrHeader?: Record<string, string>;
    xhrMimeType?: string;
}

export interface IAssetOptions extends INativeAssetOptions {
    reloadAsset?: boolean;
    cacheAsset?: boolean;
}

export interface IJsonAssetOptions extends IAssetOptions {
    assetId?: string;
}

export interface IDownloadParseOptions extends IXHROptions {
    priority?: number;
    audioLoadMode?: number;
    onFileProgress?: (loaded: number, total: number) => void;
    maxConcurrency?: number;
    maxRequestsPerFrame?: number;
    maxRetryCount?: number;
    cacheEnabled?: boolean;
}

export interface IBundleOptions extends INativeAssetOptions {
    version?: string;
    scriptAsyncLoading?: boolean;
}

export interface INativeAssetOptions extends IDownloadParseOptions {
    preset?: string;
}

export type AssetType<T = Asset> = Constructor<T>;

export const assets = EDITOR ? new WeakCache<Asset>() : new Cache<Asset>();
export const files = new Cache();
export const parsed = new Cache();
export const bundles = new Cache<Bundle>();
export const pipeline = new Pipeline('normal load', []);
export const fetchPipeline = new Pipeline('fetch', []);
export const transformPipeline = new Pipeline('transform url', []);
export const references = EDITOR ? new Cache<any[]>() : null;

export enum RequestType {

    UUID = 'uuid',

    PATH = 'path',

    DIR = 'dir',

    URL = 'url',

    SCENE = 'scene',
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
