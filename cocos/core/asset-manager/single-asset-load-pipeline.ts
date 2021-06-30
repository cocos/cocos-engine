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
import { Asset } from '../assets/asset';
import SceneAsset from '../assets/scene-asset';
import { error } from '../platform/debug';
import packManager from './pack-manager';
import parser from './parser';
import RequestItem from './request-item';
import { assets, files, parsed, pipeline } from './shared';
import Task from './task';
import { cache, checkCircleReference, getDepends, setProperties } from './utilities';

interface IProgress {
    finish: number;
    total: number;
    canInvoke: boolean;
}

interface ILoadingRequest {
    content: Asset;
    finish: boolean;
    err?: Error | null;
    tasks: Array<SingleAssetTask>;
}

declare class SingleAssetItem extends RequestItem {
    content: Asset | null;
}

export declare class SingleAssetTask extends Task {
    input: SingleAssetItem;
    output: SingleAssetItem;
    progress: IProgress;
    options: { __exclude__: Record<string, ILoadingRequest>, };
    subTask: Task;
}

export function fetch (task: SingleAssetTask) {
    const item = task.output = task.input;
    const { options, isNative, uuid, file } = item;
    const { reloadAsset } = options;

    if (file || (!reloadAsset && !isNative && assets.has(uuid))) {
        task.done();
        return;
    }

    packManager.load(item, task.options, (err, data) => {
        item.file = data;
        task.done(err);
    });
}

export function parse (task: SingleAssetTask) {
    const item = task.output = task.input;
    const progress = task.progress;
    const exclude = task.options.__exclude__;
    const { id, file, options } = item;

    if (item.isNative) {
        parser.parse(id, file, item.ext, options, (err, asset) => {
            if (err) {
                task.done(err);
                return;
            }
            item.content = asset;
            if (progress.canInvoke) {
                task.dispatch('progress', ++progress.finish, progress.total, item);
            }
            files.remove(id);
            parsed.remove(id);
            task.finish();
        });
    } else {
        const { uuid } = item;
        if (uuid in exclude) {
            const { finish, content, err, tasks } = exclude[uuid];
            if (progress.canInvoke) {
                task.dispatch('progress', ++progress.finish, progress.total, item);
            }

            if (finish || checkCircleReference(uuid, uuid, exclude)) {
                item.content = content;
                task.finish(err);
            } else {
                tasks.push(task);
            }
        } else if (!options.reloadAsset && assets.has(uuid)) {
            const asset = assets.get(uuid)!;
            item.content = asset;
            if (progress.canInvoke) {
                task.dispatch('progress', ++progress.finish, progress.total, item);
            }
            task.finish();
        } else {
            options.__uuid__ = uuid;
            parser.parse(id, file, 'import', options, (err, asset: Asset) => {
                if (err) {
                    task.done(err);
                    return;
                }
                item.content = asset;
                task.done();
            });
        }
    }
}

export function loadDepends (task: SingleAssetTask) {
    const { input: item, progress } = task;
    const { uuid, config, content: asset } = item;

    const depends = [];
    getDepends(uuid, asset!, Object.create(null), depends, config!);
    if (progress.canInvoke) {
        task.dispatch('progress', ++progress.finish, progress.total += depends.length, item);
    }

    const repeatItem = task.options.__exclude__[uuid] = { content: asset, finish: false, tasks: [task] } as ILoadingRequest;

    const subTask = Task.create({
        input: depends,
        options: task.options,
        onProgress: task.onProgress,
        onError: Task.prototype.recycle,
        progress,
        onComplete: (err) => {
            if (err) {
                repeatItem.finish = true;
                repeatItem.err = err;
                const tasks = repeatItem.tasks;
                for (let i = 0, l = tasks.length; i < l; i++) {
                    tasks[i].finish(err);
                }
                tasks.length = 0;
            } else {
                task.done();
            }
        },
    });

    task.subTask = subTask;
    pipeline.async(subTask);
}

export function initialize (task: SingleAssetTask) {
    const { input: item, subTask } = task;
    const { uuid, content: asset, id, options } = item;
    const repeatItem = task.options.__exclude__[uuid];
    const output = Array.isArray(subTask.output) ? subTask.output : [subTask.output];
    const map: Record<string, any> = Object.create(null);
    for (const dependAsset of output) {
        if (!dependAsset) { continue; }
        map[dependAsset instanceof Asset ? `${dependAsset._uuid}@import` : `${uuid}@native`] = dependAsset;
    }

    setProperties(uuid, asset!, map);
    try {
        if (typeof asset!.onLoaded === 'function' && !asset!.__onLoadedInvoked__ && !asset!.__nativeDepend__) {
            asset!.onLoaded();
            asset!.__onLoadedInvoked__ = true;
        }
    } catch (e) {
        error(`The asset ${uuid} is invalid for some reason, detail message: ${e.message}, stack: ${e.stack}`);
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
    if (!BUILD && asset!.validate && !asset!.validate()) { asset!.initDefault(); }
    cache(uuid, asset!, options.cacheAsset);
    subTask.recycle();
    repeatItem.finish = true;
    const tasks = repeatItem.tasks;
    for (let i = 0, l = tasks.length; i < l; i++) {
        tasks[i].finish();
    }
    tasks.length = 0;
}
