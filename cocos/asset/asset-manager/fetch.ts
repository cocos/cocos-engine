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

import { Asset } from '../assets';
import { error, cclegacy } from '../../core';
import packManager from './pack-manager';
import RequestItem from './request-item';
import { assets, fetchPipeline } from './shared';
import Task from './task';
import { clear, forEach, getDepends } from './utilities';

export default function fetch (task: Task, done: ((err?: Error | null) => void)): void {
    let firstTask = false;
    if (!task.progress) {
        task.progress = { finish: 0, total: task.input.length, canInvoke: true };
        firstTask = true;
    }

    const { options, progress } = task;
    const depends = [];
    const total = progress.total as number;
    const exclude = options!.__exclude__ = options!.__exclude__ || Object.create(null);

    task.output = [];

    forEach(task.input as RequestItem[], (item, cb): void => {
        if (!item.isNative && assets.has(item.uuid)) {
            const asset = assets.get(item.uuid);
            item.content = asset!.addRef();
            task.output.push(item);
            if (progress.canInvoke) {
                task.dispatch('progress', ++progress.finish, progress.total, item);
            }
            cb();
            return;
        }

        packManager.load(item, task.options, (err, data): void => {
            if (err) {
                if (!task.isFinished) {
                    if (!cclegacy.assetManager.force || firstTask) {
                        error(err.message, err.stack);
                        progress.canInvoke = false;
                        done(err);
                    } else {
                        task.output.push(item);
                        if (progress.canInvoke) {
                            task.dispatch('progress', ++progress.finish, progress.total, item);
                        }
                    }
                }
            } else if (!task.isFinished) {
                item.file = data;
                task.output.push(item);
                if (!item.isNative) {
                    exclude[item.uuid] = true;
                    getDepends(item.uuid, data, exclude, depends, item.config!);
                    progress.total = total + depends.length;
                }
                if (progress.canInvoke) {
                    task.dispatch('progress', ++progress.finish, progress.total, item);
                }
            }
            cb();
        });
    }, (): void => {
        if (task.isFinished) {
            clear(task, true);
            task.dispatch('error');
            return;
        }
        if (depends.length > 0) {
            // stage 2 , download depend asset
            const subTask = Task.create({
                input: depends,
                progress,
                options,
                onProgress: task.onProgress,
                onError: Task.prototype.recycle,
                onComplete: (err): void => {
                    if (!err) {
                        task.output.push(...subTask.output);
                        subTask.recycle();
                    }
                    if (firstTask) { decreaseRef(task); }
                    done(err);
                },
            });
            fetchPipeline.async(subTask);
            return;
        }
        if (firstTask) { decreaseRef(task); }
        done();
    });
}

function decreaseRef (task: Task): void {
    const output = task.output as RequestItem[];
    for (let i = 0, l = output.length; i < l; i++) {
        if (output[i].content) {
            (output[i].content as Asset).decRef(false);
        }
    }
}
