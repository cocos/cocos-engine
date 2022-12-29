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

import { warnID } from '../../core';
import { CompleteCallbackNoData } from './shared';
import Task from './task';

export type IAsyncPipe = (task: Task, done: CompleteCallbackNoData) => void;
export type ISyncPipe = (task: Task) => Error | void;
export type IPipe = IAsyncPipe | ISyncPipe;

/**
 * @en
 * Pipeline can execute the task for some effect.
 *
 * @zh
 * 管线能执行任务达到某个效果
 *
 */
export class Pipeline {
    private static _pipelineId = 0;

    /**
     * @en
     * The id of pipeline
     *
     * @zh
     * 管线的 id
     *
     */
    public id: number = Pipeline._pipelineId++;

    /**
     * @en
     * The name of pipeline
     *
     * @zh
     * 管线的名字
     *
     */
    public name = '';

    /**
     * @en
     * All pipes of pipeline
     *
     * @zh
     * 所有的管道
     *
     */
    public pipes: IPipe[] = [];

    /**
     * @en
     * Create a new pipeline
     *
     * @zh
     * 创建一个管线
     *
     * @param name - The name of pipeline
     * @param funcs - The array of pipe, every pipe must be function which take two parameters,
     * the first is a `Task` flowed in pipeline, the second is complete callback
     *
     * @example
     * const pipeline = new Pipeline('download', [
     * (task, done) => {
     *      const url = task.input;
     *      assetManager.downloader.downloadFile(url, null, null, (err, result) => {
     *          task.output = result;
     *          done(err);
     *      });
     * },
     * (task, done) => {
     *      const text = task.input;
     *      const json = JSON.stringify(text);
     *      task.output = json;
     *      done();
     * }
     * ]);
     *
     */
    constructor (name: string, funcs: IPipe[]) {
        this.name = name;
        for (let i = 0, l = funcs.length; i < l; i++) {
            this.pipes.push(funcs[i]);
        }
    }

    /**
     * @en
     * At specific point insert a new pipe to pipeline
     *
     * @zh
     * 在某个特定的点为管线插入一个新的 pipe
     *
     * @param func - The new pipe
     * @param func.task - The task handled with pipeline will be transferred to this function
     * @param func.done - Callback you need to invoke manually when this pipe is finished. if the pipeline is synchronous, callback is unnecessary.
     * @param index - The specific point you want to insert at.
     * @return pipeline
     *
     * @example
     * var pipeline = new Pipeline('test', []);
     * pipeline.insert((task, done) => {
     *      // do something
     *      done();
     * }, 0);
     *
     */
    public insert (func: IPipe, index: number): Pipeline {
        if (index > this.pipes.length) {
            warnID(4921);
            return this;
        }

        this.pipes.splice(index, 0, func);
        return this;
    }

    /**
     * @en
     * Append a new pipe to the pipeline
     *
     * @zh
     * 添加一个管道到管线中
     *
     * @param func - The new pipe
     * @param func.task - The task handled with pipeline will be transferred to this function
     * @param func.done - Callback you need to invoke manually when this pipe is finished. if the pipeline is synchronous, callback is unnecessary.
     * @return pipeline
     *
     * @example
     * var pipeline = new Pipeline('test', []);
     * pipeline.append((task, done) => {
     *      // do something
     *      done();
     * });
     *
     */
    public append (func: IPipe): Pipeline {
        this.pipes.push(func);
        return this;
    }

    /**
     * @en
     * Remove pipe which at specific point
     *
     * @zh
     * 移除特定位置的管道
     *
     * @param index - The specific point
     * @return pipeline
     *
     * @example
     * var pipeline = new Pipeline('test', (task, done) => {
     *      // do something
     *      done();
     * });
     * pipeline.remove(0);
     *
     */
    public remove (index: number): Pipeline {
        this.pipes.splice(index, 1);
        return this;
    }

    /**
     * @en
     * Execute task synchronously
     *
     * @zh
     * 同步执行任务
     *
     * @param task - The task will be executed
     * @returns result
     *
     * @example
     * var pipeline = new Pipeline('sync', [(task) => {
     *      let input = task.input;
     *      task.output = doSomething(task.input);
     * }]);
     *
     * var task = new Task({input: 'test'});
     * console.log(pipeline.sync(task));
     *
     */
    public sync (task: Task): any {
        const pipes = this.pipes;
        if (pipes.length === 0) { return null; }
        task.isFinish = false;
        for (let i = 0, l = pipes.length; i < l;) {
            const pipe = pipes[i] as ISyncPipe;
            const result = pipe(task);
            if (result) {
                task.isFinish = true;
                return result;
            }
            i++;
            if (i !== l) {
                task.input = task.output;
                task.output = null;
            }
        }
        task.isFinish = true;
        return task.output as unknown;
    }

    /**
     * @en
     * Execute task asynchronously
     *
     * @zh
     * 异步执行任务
     *
     * @param task - The task will be executed
     *
     * @example
     * var pipeline = new Pipeline('sync', [(task, done) => {
     *      let input = task.input;
     *      task.output = doSomething(task.input);
     *      done();
     * }]);
     * var task = new Task({input: 'test', onComplete: (err, result) => console.log(result)});
     * pipeline.async(task);
     *
     */
    public async (task: Task): void {
        const pipes = this.pipes;
        if (pipes.length === 0) { return; }
        task.isFinish = false;
        this._flow(0, task);
    }

    private _flow (index: number, task: Task): void {
        const pipe = this.pipes[index];
        pipe(task, (result) => {
            if (result) {
                task.isFinish = true;
                task.dispatch('complete', result);
            } else {
                index++;
                if (index < this.pipes.length) {
                    // move output to input
                    task.input = task.output;
                    task.output = null;
                    this._flow(index, task);
                } else {
                    task.isFinish = true;
                    task.dispatch('complete', result, task.output);
                }
            }
        });
    }
}
