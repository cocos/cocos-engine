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
import { Asset, Prefab, SceneAsset } from '../assets';
import { legacyCC } from '../global-exports';
import { error } from '../platform/debug';
import { js } from '../utils/js';
import { callInNextTick } from '../utils/misc';
import Config from './config';
import dependUtil from './depend-util';
import { IDependProp } from './deserialize';
import { isScene } from './helper';
import RequestItem from './request-item';
import { assets, AssetType, CompleteCallback, CompleteCallbackNoData, IOptions, ProgressCallback, references } from './shared';
import Task from './task';

let defaultProgressCallback: ProgressCallback | null = null;

export function setDefaultProgressCallback (onProgress: ProgressCallback) {
    defaultProgressCallback = onProgress;
}

export function clear (task: Task, clearRef: boolean) {
    for (let i = 0, l = task.input.length; i < l; i++) {
        const item = task.input[i] as RequestItem;
        if (clearRef) {
            if (!item.isNative && item.content instanceof Asset) {
                item.content.decRef(false);
            }
        }
        item.recycle();
    }
    task.input = null;
}

export function urlAppendTimestamp (url: string, append: boolean): string {
    if (append) {
        if (/\?/.test(url)) {
            return `${url}&_t=${Date.now()}`;
        }
        else {
            return `${url}?_t=${Date.now()}`;
        }
    }
    return url;
}

export type RetryFunction = (times: number, done: CompleteCallback) => void;

export function retry (process: RetryFunction, times: number, wait: number, onComplete: CompleteCallback, index: number = 0) {
    process(index, (err, result) => {
        index++;
        if (!err || index > times) {
            if (onComplete) {
                onComplete(err, result);
            }
        }
        else {
            setTimeout(() => {
                retry(process, times, wait, onComplete, index);
            }, wait);
        }
    });
}

export function getDepends (uuid: string, data: Asset | Record<string, any>, exclude: Record<string, any>,
                            depends: any[], preload: boolean, asyncLoadAssets: boolean, config: Config): void {
    try {
        const info = dependUtil.parse(uuid, data);
        let includeNative = true;
        // @ts-expect-error
        if (data instanceof Asset && (!data.__nativeDepend__)) { includeNative = false; }
        if (!preload) {
            asyncLoadAssets = !EDITOR && (!!(data as SceneAsset|Prefab).asyncLoadAssets || (asyncLoadAssets && !info.preventDeferredLoadDependents));
            for (let i = 0, l = info.deps.length; i < l; i++) {
                const dep = info.deps[i];
                if (!(dep in exclude)) {
                    exclude[dep] = true;
                    depends.push({ uuid: dep, __asyncLoadAssets__: asyncLoadAssets, bundle: config && config.name });
                }
            }

            if (includeNative && !asyncLoadAssets && !info.preventPreloadNativeObject && info.nativeDep) {
                if (config) {
                    info.nativeDep.bundle = config.name;
                }
                depends.push(Object.assign({}, info.nativeDep));
            }

        } else {
            for (let i = 0, l = info.deps.length; i < l; i++) {
                const dep = info.deps[i];
                if (!(dep in exclude)) {
                    exclude[dep] = true;
                    depends.push({ uuid: dep, bundle: config && config.name });
                }
            }
            if (includeNative && info.nativeDep) {
                if (config) {
                    info.nativeDep.bundle = config.name;
                }
                depends.push(Object.assign({}, info.nativeDep));
            }
        }
    }
    catch (e) {
        error(e.message, e.stack);
    }
}

export function cache (id: string, asset: Asset, cacheAsset?: boolean) {
    if (!asset) { return; }
    cacheAsset = cacheAsset !== undefined ? cacheAsset : legacyCC.assetManager.cacheAsset;
    if (!isScene(asset) && cacheAsset) {
        assets.add(id, asset);
    }
}

export function setProperties (uuid: string, asset: Asset, assetsMap: Record<string, any>) {

    let missingAsset = false;
    // @ts-expect-error
    const depends = asset.__depends__ as IDependProp[];
    if (depends) {
        let missingAssetReporter: any = null;
        for (let i = 0, l = depends.length; i < l; i++) {
            const depend = depends[i];
            const dependAsset = assetsMap[depend.uuid + '@import'];
            if (!dependAsset) {
                if (EDITOR) {
                    if (!missingAssetReporter) {
                        missingAssetReporter = new EditorExtends.MissingReporter.object(asset);
                    }
                    missingAssetReporter.stashByOwner(depend.owner, depend.prop, EditorExtends.serialize.asAsset(depend.uuid));
                }
                else {
                    error('The asset ' + depend.uuid + ' is missing!');
                }
                missingAsset = true;
            }
            else {
                depend.owner[depend.prop] = dependAsset.addRef();
                if (EDITOR) {
                    let reference = references!.get(dependAsset);
                    if (!reference || isScene(asset)) {
                        reference = [];
                        references!.add(depend.uuid, reference);
                    }
                    reference.push([asset, depend.owner, depend.prop]);
                }
            }
        }

        if (missingAssetReporter) {
            missingAssetReporter.reportByOwner();
        }
        // @ts-expect-error
        asset.__depends__ = null;
    }

    // @ts-expect-error
    if (asset.__nativeDepend__) {
        if (assetsMap[uuid + '@native']) {
            asset._nativeAsset = assetsMap[uuid + '@native'];
        }
        else {
            missingAsset = true;
            if (EDITOR) {
                console.error(`the native asset of ${uuid} is missing!`);
            }
        }
        // @ts-expect-error
        asset.__nativeDepend__ = false;
    }
    return missingAsset;
}

export function gatherAsset (task: Task) {
    const source = task.source;
    if (!task.options!.__outputAsArray__ && source.length === 1) {
        task.output = source[0].content;
    }
    else {
        const output: any[] = task.output = [];
        for (let i = 0, l = source.length; i < l; i++) {
            output.push(source[i].content);
        }
    }
}

type ForEachFunction<T> = (item: T, done: CompleteCallbackNoData) => void;

export function forEach<T = any> (array: T[], process: ForEachFunction<T>, onComplete: (errs: Error[]) => void) {
    let count = 0;
    const errs: Error[] = [];
    if (array.length === 0 && onComplete) {
        onComplete(errs);
    }
    for (let i = 0, l = array.length; i < l; i++) {
        process(array[i], (err) => {
            if (err) {
                errs.push(err);
            }
            count ++;
            if (count === l) {
                if (onComplete) {
                    onComplete(errs);
                }
            }
        });
    }
}

interface IParameters<T> {
    options: IOptions;
    onProgress: ProgressCallback | null;
    onComplete: CompleteCallback<T> | null;
}

interface ILoadResArgs<T> {
    type: AssetType | null;
    onProgress: ProgressCallback | null;
    onComplete: CompleteCallback<T> | null;
}

export function parseParameters<T = any> (options: IOptions | ProgressCallback | CompleteCallback<T> | null | undefined,
                                          onProgress: ProgressCallback | CompleteCallback<T> | null | undefined,
                                          onComplete: CompleteCallback<T> | null | undefined): IParameters<T> {
    let optionsOut: any = options;
    let onProgressOut: any = onProgress;
    let onCompleteOut: any = onComplete;
    if (onComplete === undefined) {
        const isCallback = typeof options === 'function';
        if (onProgress) {
            onCompleteOut = onProgress as CompleteCallback;
            if (!isCallback) {
                onProgressOut = null;
            }
        }
        else if (onProgress === undefined && isCallback) {
            onCompleteOut = options as CompleteCallback;
            optionsOut = null;
            onProgressOut = null;
        }
        if (onProgress !== undefined && isCallback) {
            onProgressOut = options as ProgressCallback;
            optionsOut = null;
        }
    }

    return { options: optionsOut || Object.create(null), onProgress: onProgressOut, onComplete: onCompleteOut };
}

export function parseLoadResArgs<T = any> (type: AssetType | ProgressCallback | CompleteCallback<T> | null | undefined,
                                           onProgress: ProgressCallback | CompleteCallback<T> | null | undefined,
                                           onComplete: CompleteCallback<T> | null | undefined): ILoadResArgs<T> {

    let typeOut: any = type;
    let onProgressOut: any = onProgress;
    let onCompleteOut: any = onComplete;
    if (onComplete === undefined) {
        const isValidType = js.isChildClassOf(type as AssetType, Asset);
        if (onProgress) {
            onCompleteOut = onProgress as CompleteCallback;
            if (isValidType) {
                onProgressOut = null;
            }
        }
        else if (onProgress === undefined && !isValidType) {
            onCompleteOut = type as CompleteCallback;
            onProgressOut = null;
            typeOut = null;
        }
        if (onProgress !== undefined && !isValidType) {
            onProgressOut = type as ProgressCallback;
            typeOut = null;
        }
    }

    return { type: typeOut, onProgress: onProgressOut || defaultProgressCallback, onComplete: onCompleteOut };
}

export function checkCircleReference (owner: string, uuid: string, map: Record<string, any>, checked: Record<string, boolean> = {}): boolean {
    const item = map[uuid];
    if (!item || checked[uuid]) {
        return false;
    }
    checked[uuid] = true;
    let result = false;
    const deps = dependUtil.getDeps(uuid);
    if (deps) {
        for (let i = 0, l = deps.length; i < l; i++) {
            const dep = deps[i];
            if (dep === owner || checkCircleReference(owner, dep, map, checked)) {
                result = true;
                break;
            }
        }
    }
    return result;
}

export function asyncify (cb: ((p1?: any, p2?: any) => void) | null): (p1?: any, p2?: any) => void {
    return (p1, p2) => {
        if (!cb) { return; }
        const refs: Asset[] = [];
        if (Array.isArray(p2)) {
            p2.forEach((x) => x instanceof Asset && refs.push(x.addRef()));
        } else {
            if (p2 instanceof Asset) {
                refs.push(p2.addRef());
            }
        }
        callInNextTick(() => {
            refs.forEach((x) => x.decRef(false));
            cb(p1, p2);
        });
    };
}
