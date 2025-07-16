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
import Task from './task';

/**
 * @en
 * The loading pipeline can complete the loading task by executing a series of phases. [[AssetManager]] uses it to load all assets.
 *
 * @zh
 * 加载管线能通过执行一系列阶段来完成加载任务。[[AssetManager]] 使用其来加载所有资源。
 *
 */
export class Pipeline {
    private static _pipelineId = 0;

    /**
     * @en
     * The unique id of this pipeline.
     *
     * @zh
     * 管线的唯一 id。
     *
     */
    public id: number = Pipeline._pipelineId++;

    /**
     * @en
     * The name of this pipeline.
     *
     * @zh
     * 此管线的名称。
     *
     */
    public name = '';

    /**
     * @en
     * All pipes of this pipeline.
     *
     * @zh
     * 此管线的所有管道。
     *
     */
    public pipes: Array<((task: Task, done: ((err?: Error | null) => void)) => void) | ((task: Task) => Error | void)> = [];

    /**
     * @en
     * Creates a new pipeline.
     *
     * @zh
     * 创建一个管线。
     *
     * @param name - @en The name of pipeline. @zh 管线的名称。
     * @param funcs
     * @en The array of pipes to create pipeline, every pipe must be function which take two parameters,
     * the first is a `Task` flowed in pipeline, the second is complete callback.
     * @zh 用于创建管线的管道数组，每个管道必须是一个接受两个参数的方法，第一个参数为任务 [[Task]], 第二个参数为完成回调。
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
    constructor (name: string, funcs: Array<((task: Task, done: ((err?: Error | null) => void)) => void) | ((task: Task) => Error | void)>) {
        this.name = name;
        for (let i = 0, l = funcs.length; i < l; i++) {
            this.pipes.push(funcs[i]);
        }
    }

    /**
     * @en
     * Inserts a new pipe to pipeline at specific point .
     *
     * @zh
     * 在某个特定的点为管线插入一个新的 pipe。
     *
     * @param func @en The new pipe to be inserted. @zh 待插入的管道。
     * @param func.task @en The task handled with pipeline will be transferred to this function. @zh 正在被此管线处理的任务。
     * @param func.done
     * @en Callback you need to invoke manually when this pipe is finished. if the pipeline is synchronous, callback is unnecessary.
     * @zh 当这个管道完成时，你需要手动调用回调。如果管道是同步的，回调就没有必要。
     * @param index @en The specific point you want to insert at. @zh 要插入进的位置。
     * @return @en Returns the Pipeline itself, which can be used to make chain calls. @zh 返回 Pipeline 本身，可以用于做链式调用。
     *
     * @example
     * var pipeline = new Pipeline('test', []);
     * pipeline.insert((task, done) => {
     *      // do something
     *      done();
     * }, 0);
     *
     */
    public insert (func: ((task: Task, done: ((err?: Error | null) => void)) => void) | ((task: Task) => Error | void), index: number): Pipeline {
        if (index > this.pipes.length) {
            warnID(4921);
            return this;
        }

        this.pipes.splice(index, 0, func);
        return this;
    }

    /**
     * @en
     * Appends a new pipe to the pipeline.
     *
     * @zh
     * 添加一个管道到管线中。
     *
     * @param func @en The new pipe to be appended. @zh 要追加的新管道。
     * @param func.task
     * @en The task handled with pipeline will be transferred to this function.
     * @zh 正在被此管线处理的任务。
     * @param func.done
     * @en Callback you need to invoke manually when this pipe is finished. if the pipeline is synchronous, callback is unnecessary.
     * @zh 当这个管道完成时，你需要手动调用回调。如果管道是同步的，回调就没有必要。
     * @return @en Returns the Pipeline itself, which can be used to make chain calls. @zh 返回 Pipeline 本身，可以用于做链式调用。
     *
     * @example
     * var pipeline = new Pipeline('test', []);
     * pipeline.append((task, done) => {
     *      // do something
     *      done();
     * });
     *
     */
    public append (func: ((task: Task, done: ((err?: Error | null) => void)) => void) | ((task: Task) => Error | void)): Pipeline {
        this.pipes.push(func);
        return this;
    }

    /**
     * @en
     * Removes pipe which at specific point.
     *
     * @zh
     * 移除特定位置的管道。
     *
     * @param index @en The specific point. @zh 指定位置的索引。
     * @return @en Returns the Pipeline itself, which can be used to make chain calls. @zh 返回 Pipeline 本身，可以用于做链式调用。
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
     * Executes task synchronously.
     *
     * @zh
     * 同步执行任务。
     *
     * @param task @en The task will be executed. @zh 要执行的任务。
     * @returns @en The execution result. @zh 执行结果。
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
        task.isFinished = false;
        for (let i = 0, l = pipes.length; i < l;) {
            const pipe = pipes[i] as ((task: Task) => Error | void);
            const result = pipe(task);
            if (result) {
                task.isFinished = true;
                return result;
            }
            i++;
            if (i !== l) {
                task.input = task.output;
                task.output = null;
            }
        }
        task.isFinished = true;
        return task.output as unknown;
    }

    /**
     * @en
     * Executes task asynchronously.
     *
     * @zh
     * 异步执行任务。
     *
     * @param task @en The task will be executed. @zh 待执行的任务。
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
        task.isFinished = false;
        this._flow(0, task);
    }

    private _flow (index: number, task: Task): void {
        const pipe = this.pipes[index];
        pipe(task, (result) => {
            if (result) {
                task.isFinished = true;
                task.dispatch('complete', result);
            } else {
                index++;
                if (index < this.pipes.length) {
                    // move output to input
                    task.input = task.output;
                    task.output = null;
                    this._flow(index, task);
                } else {
                    task.isFinished = true;
                    task.dispatch('complete', result, task.output);
                }
            }
        });
    }
}
