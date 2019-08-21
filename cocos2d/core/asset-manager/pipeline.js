/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/
const Task = require('./task');

var _pipelineId = 0;
/**
 * !#en
 * Create a new pipeline, pipeline can execute the task for some effect.
 * 
 * !#zh
 * 创建一个管线，管线能执行任务达到某个效果
 * 
 * @class Pipeline
 * @param {string} name - The name of pipeline
 * @param {Function[]} funcs - The array of pipe, every pipe must be function which take two parameters, the first is a `Task` flowed in pipeline, the second is complete callback
 * 
 * @example
 * var pipeline = new Pipeline('download', [
 * (task, done) => {
 *      var url = task.input;
 *      cc.assetManager.downloader.downloadFile(url, null, null, (err, result) => {
 *          task.output = result;
 *          done(err);
 *      });
 * },
 * (task, done) => {
 *      var text = task.input;
 *      var json = JSON.stringify(text);
 *      task.output = json;
 *      done();
 * }
 * ]);
 * 
 * @typescript
 * Pipeline(name: string, funcs: Array<(task: cc.AssetManager.Task, done: (err: Error) => void) => void)>): typeof Pipeline
 */
function Pipeline (name, funcs) {
    if (!Array.isArray(funcs)) {
        cc.warn('funcs must be an array');
        return;
    } 
    
    this.id = _pipelineId++;
    this.name = name;
    this.pipes = [];

    for (var i = 0, l = funcs.length; i < l; i++) {
        if (typeof funcs[i] === 'function') {
            this.pipes.push(funcs[i]);
        }
    }

};

Pipeline.prototype = {

    constructor: Pipeline,

    /**
     * !#en
     * At specific point insert a new pipe to pipeline
     * 
     * !#zh
     * 在某个特定的点为管线插入一个新的 pipe
     * 
     * @method insert
     * @param {Function} func - The new pipe
     * @param {Task} func.task - The task handled with pipeline will be transferred to this function
     * @param {Function} [func.callback] - Callback you need to invoke manually when this pipe is finished. if the pipeline is synchronous, callback is unnecessary.
     * @param {number} index - The specific point you want to insert at.
     * @return {Pipeline} pipeline
     * 
     * @example
     * var pipeline = new Pipeline('test', []);
     * pipeline.insert((task, done) => {
     *      // do something
     *      done();
     * }, 0);
     * 
     * @typescript
     * insert(func: (task: cc.AssetManager.Task, callback?: (err: Error) => void), index: number): cc.AssetManager.Pipeline
     */
    insert (func, index) {

        if (typeof func !== 'function' || index > this.pipes.length) {
            cc.warnID(4921);
            return;
        }
    
        this.pipes.splice(index, 0, func);
        return this;
    },


    /**
     * !#en
     * Append a new pipe to the pipeline
     * 
     * !#zh
     * 添加一个管道到管线中
     * 
     * @method append
     * @param {Function} func - The new pipe
     * @param {Task} func.task - The task handled with pipeline will be transferred to this function
     * @param {Function} [func.callback] - Callback you need to invoke manually when this pipe is finished. if the pipeline is synchronous, callback is unnecessary.
     * @return {Pipeline} pipeline
     * 
     * @example
     * var pipeline = new Pipeline('test', []);
     * pipeline.append((task, done) => {
     *      // do something
     *      done();
     * });
     * 
     * @typescript
     * append(func: (task: cc.AssetManager.Task, callback?: (err: Error) => void)): cc.AssetManager.Pipeline
     */
    append (func) {
        if (typeof func !== 'function') {
            return;
        }
    
        this.pipes.push(func);
        return this;
    },

    /**
     * !#en
     * Remove pipe which at specific point
     * 
     * !#zh
     * 移除特定位置的管道
     * 
     * @method remove
     * @param {number} index - The specific point
     * @return {Pipeline} pipeline
     * 
     * @example
     * var pipeline = new Pipeline('test', (task, done) => {
     *      // do something
     *      done();  
     * });
     * pipeline.remove(0);
     * 
     * @typescript
     * remove(index: number): cc.AssetManager.Pipeline
     */
    remove (index) {
        if (typeof index !== 'number') {
            return;
        }
    
        this.pipes.splice(index, 1);
        return this;
    },

    /**
     * !#en
     * Execute task synchronously
     * 
     * !#zh
     * 同步执行任务
     * 
     * @method sync
     * @param {Task} task - The task will be executed
     * @returns {*} result
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
     * @typescript
     * sync(task: cc.AssetManager.Task): any 
     */
    sync (task) {
        var pipes = this.pipes;
        if (!(task instanceof Task) || pipes.length === 0) return;
        if (task.output != null) {
            task.input = task.output;
            task.output = null;
        }
        task._isFinish = false;
        for (var i = 0, l = pipes.length; i < l;) {
            var pipe = pipes[i];
            var result = pipe(task);
            if (result) {
                task._isFinish = true;
                return result;
            }
            i++;
            if (i !== l) {
                task.input = task.output;
                task.output = null;
            }
        }
        task._isFinish = true;
        return task.output;
    },

    /**
     * !#en
     * Execute task asynchronously
     * 
     * !#zh
     * 异步执行任务
     * 
     * @method async
     * @param {Task} task - The task will be executed
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
     * @typescript
     * async(task: cc.AssetManager.Task): void
     */
    async (task) {
        var pipes = this.pipes;
        if (!(task instanceof Task) || pipes.length === 0) return;
        if (task.output != null) {
            task.input = task.output;
            task.output = null;
        }
        task._isFinish = false;
        this._flow(0, task);
    },

    _flow (index, task) {
        var self = this;
        var pipe = this.pipes[index];
        pipe(task, function (result) {
            if (result) {
                task._isFinish = true;
                task.onComplete && task.onComplete(result);
            }
            else {
                index++;
                if (index < self.pipes.length) {
                    // move output to input
                    task.input = task.output;
                    task.output = null;
                    self._flow(index, task);
                }
                else {
                    task._isFinish = true;
                    task.onComplete && task.onComplete(result, task.output);
                }
            }
        });
    }
};
module.exports = Pipeline;
