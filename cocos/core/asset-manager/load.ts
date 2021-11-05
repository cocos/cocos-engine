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
import { BUILD, EDITOR, PREVIEW } from 'internal:constants';
import { Asset, SceneAsset } from '../assets';
import { error, warn } from '../platform/debug';
import packManager from './pack-manager';
import parser from './parser';
import { Pipeline } from './pipeline';
import RequestItem from './request-item';
import { CompleteCallbackNoData, assets, files, parsed, pipeline } from './shared';
import Task from './task';
import { cache, checkCircleReference, clear, forEach, gatherAsset, getDepends, setProperties } from './utilities';
import { legacyCC } from '../global-exports';
import { nativeDependMap, onLoadedInvokedMap } from './depend-maps';

/**
 * @packageDocumentation
 * @hidden
 */
interface IProgress {
    finish: number;
    total: number;
    canInvoke: boolean;
}

interface ILoadingRequest {
    content: Asset;
    finish: boolean;
    err?: Error | null;
    callbacks: Array<{ done: CompleteCallbackNoData; item: RequestItem }>;
}

export default function load (task: Task, done: CompleteCallbackNoData) {
    let firstTask = false;
    if (!task.progress) {
        task.progress = { finish: 0, total: task.input.length, canInvoke: true };
        firstTask = true;
    }

    const { options, progress } = task;

    options!.__exclude__ = options!.__exclude__ || Object.create(null);

    task.output = [];

    forEach(task.input as RequestItem[], (item, cb) => {
        const subTask = Task.create({
            input: item,
            onProgress: task.onProgress,
            options,
            progress,
            onComplete: (err, result) => {
                if (err && !task.isFinish) {
                    if (!legacyCC.assetManager.force || firstTask) {
                        if (BUILD) {
                            error(err.message, err.stack);
                        }
                        progress.canInvoke = false;
                        done(err);
                    } else if (progress.canInvoke) {
                        task.dispatch('progress', ++progress.finish, progress.total, item);
                    }
                }
                task.output.push(result);
                subTask.recycle();
                cb(null);
            },
        });

        loadOneAssetPipeline.async(subTask);
    }, () => {
        options!.__exclude__ = null;

        if (task.isFinish) {
            clear(task, true);
            task.dispatch('error');
            return;
        }

        gatherAsset(task);
        clear(task, true);
        done();
    });
}

const loadOneAssetPipeline = new Pipeline('loadOneAsset', [

    function fetch (task, done) {
        const item = task.output = task.input as RequestItem;
        const { options, isNative, uuid, file } = item;
        const { reloadAsset } = options;

        if (file || (!reloadAsset && !isNative && assets.has(uuid))) {
            done();
            return;
        }

        packManager.load(item, task.options, (err, data) => {
            item.file = data;
            done(err);
        });
    },

    function parse (task, done) {
        const item: RequestItem = task.output = task.input;
        const progress: IProgress = task.progress;
        const exclude: Record<string, ILoadingRequest> = task.options!.__exclude__;
        const { id, file, options } = item;

        if (item.isNative) {
            parser.parse(id, file, item.ext, options, (err, asset) => {
                if (err) {
                    done(err);
                    return;
                }
                item.content = asset;
                if (progress.canInvoke) {
                    task.dispatch('progress', ++progress.finish, progress.total, item);
                }
                files.remove(id);
                parsed.remove(id);
                done();
            });
        } else {
            const { uuid } = item;
            if (uuid in exclude) {
                const { finish, content, err, callbacks } = exclude[uuid];
                if (progress.canInvoke) {
                    task.dispatch('progress', ++progress.finish, progress.total, item);
                }

                if (finish || checkCircleReference(uuid, uuid, exclude)) {
                    if (content) { content.addRef(); }
                    item.content = content;
                    done(err);
                } else {
                    callbacks.push({ done, item });
                }
            } else if (!options.reloadAsset && assets.has(uuid)) {
                const asset = assets.get(uuid)!;
                item.content = asset.addRef();
                if (progress.canInvoke) {
                    task.dispatch('progress', ++progress.finish, progress.total, item);
                }
                done();
            } else {
                options.__uuid__ = uuid;
                parser.parse(id, file, 'import', options, (err, asset: Asset) => {
                    if (err) {
                        done(err);
                        return;
                    }
                    loadDepends(task, asset, done);
                });
            }
        }
    },
]);

function loadDepends (task: Task, asset: Asset, done: CompleteCallbackNoData) {
    const { input: item, progress } = task;
    const { uuid, id, options, config } = item as RequestItem;
    const { cacheAsset } = options;

    const depends = [];
    // add reference avoid being released during loading dependencies
    if (asset.addRef) {
        asset.addRef();
    }
    getDepends(uuid, asset, Object.create(null), depends, config!);
    if (progress.canInvoke) {
        task.dispatch('progress', ++progress.finish, progress.total += depends.length, item);
    }

    const repeatItem: ILoadingRequest = task.options!.__exclude__[uuid] = { content: asset, finish: false, callbacks: [{ done, item }] };

    const subTask = Task.create({
        input: depends,
        options: task.options,
        onProgress: task.onProgress,
        onError: Task.prototype.recycle,
        progress,
        onComplete: (err) => {
            if (asset.decRef) {
                asset.decRef(false);
            }
            repeatItem.finish = true;
            repeatItem.err = err;

            if (!err) {
                const output = Array.isArray(subTask.output) ? subTask.output : [subTask.output];
                const map: Record<string, any> = Object.create(null);
                for (const dependAsset of output) {
                    if (!dependAsset) { continue; }
                    map[dependAsset instanceof Asset ? `${dependAsset._uuid}@import` : `${uuid}@native`] = dependAsset;
                }

                setProperties(uuid, asset, map);
                try {
                    if (typeof asset.onLoaded === 'function' && !onLoadedInvokedMap.has(asset) && !nativeDependMap.has(asset)) {
                        asset.onLoaded();
                        onLoadedInvokedMap.add(asset);
                    }
                } catch (e) {
                    error(`The asset ${uuid} is invalid for some reason, detail message: ${(e as Error).message}, stack: ${(e as Error).stack!}`);
                    if (EDITOR || PREVIEW) {
                        if (asset instanceof Asset) {
                            asset.initDefault();
                        } else {
                            // TODO: remove it.
                            // scene asset might be a json in editor or preview
                            SceneAsset.prototype.initDefault.call(asset);
                        }
                    }
                }
                files.remove(id);
                parsed.remove(id);
                if (!BUILD && asset.validate && !asset.validate()) {
                    error(`The asset ${uuid} is invalid for some reason and will be reverted to default asset, please check it out!`);
                    asset.initDefault();
                }
                cache(uuid, asset, cacheAsset);
                subTask.recycle();
            }

            const callbacks = repeatItem.callbacks;

            for (let i = 0, l = callbacks.length; i < l; i++) {
                const cb = callbacks[i];
                if (asset.addRef) {
                    asset.addRef();
                }
                cb.item.content = asset;
                cb.done(err);
            }

            callbacks.length = 0;
        },
    });

    pipeline.async(subTask);
}
