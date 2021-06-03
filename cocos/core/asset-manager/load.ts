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
import { BUILD } from 'internal:constants';
import { error } from '../platform/debug';
import RequestItem from './request-item';
import { singleAssetLoadPipeline } from './shared';
import Task from './task';
import { clear, forEach, gatherAsset } from './utilities';
import { legacyCC } from '../global-exports';
import { SingleAssetTask } from './single-asset-load-pipeline';

/**
 * @packageDocumentation
 * @hidden
 */

export default function load (task: Task) {
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
                        task.done(err);
                    } else if (progress.canInvoke) {
                        task.dispatch('progress', ++progress.finish, progress.total, item);
                    }
                }
                task.output.push(result);
                subTask.recycle();
                cb(null);
            },
        });

        singleAssetLoadPipeline.async(subTask as SingleAssetTask);
    }, () => {
        options!.__exclude__ = null;

        if (task.isFinish) {
            clear(task);
            task.dispatch('error');
            return;
        }

        gatherAsset(task);
        clear(task);
        task.done();
    });
}
