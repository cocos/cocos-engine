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

var _taskId = 0;
var MAX_DEAD_NUM = 50;
var _deadPool = [];

/**
 * !#en
 * Create a new task, pipeline can execute the task for some effect
 * 
 * !#zh
 * 创建一个任务，管线能执行任务达到某种效果
 * 
 * @class Task
 * 
 * @typescript
 * Task(options: any): typeof cc.AssetManager.Task
 */
function Task () {
    this.id = _taskId++;
    this._isFinish = true;
    this.set.apply(this, arguments);
};

Task.prototype = {
    
    constructor: Task,

    /**
     * !#en
     * Set paramters of this task
     * 
     * !#zh
     * 设置任务的参数
     * 
     * @method set
     * @param {Object} options - Some optional paramters
     * @param {Function} [options.onComplete] - Callback when the task complete, if the pipeline is synchronous, onComplete is unnecessary.
     * @param {Function} [options.onProgress] - Continuously callback when the task is runing, if the pipeline is synchronous, onProgress is unnecessary.
     * @param {*} options.input - Something will be handled with pipeline
     * @param {*} [options.progress] - Progress information, you may need to assign it manually when multiple pipeline share one progress
     * @param {Object} [options.options] - Custom parameters
     * 
     * @example 
     * var task = new Task();
     * task.set({input: ['test'], onComplete: (err, result) => console.log(err), onProgress: (finish, total) => console.log(finish / total)});
     * 
     * @typescript
     * set(options: {onComplete?: (err: Error, result: any) => void, onError?: () => void, onProgress?: Function, input: any, progress?: any, options?: any}): void
     */
    set (options) {
        options = options || Object.create(null);
        this.onComplete = options.onComplete;
        this.onProgress = options.onProgress;
        this.onError = options.onError;
        this.source = this.input = options.input;
        this.output = null;
        this.progress = options.progress;
        // custom data
        this.options = options.options || Object.create(null);
    },

    /**
     * !#en
     * Dispatch event
     * 
     * !#zh
     * 发布事件
     * 
     * @method dispatch
     * @param {string} event - The event name
     * @param {*} param1 - Parameter 1
     * @param {*} param2 - Parameter 2
     * @param {*} param3 - Parameter 3
     * @param {*} param4 - Parameter 4
     * 
     * @example
     * var task = Task.create();
     * Task.onComplete = (msg) => console.log(msg);
     * Task.dispatch('complete', 'hello world');
     * 
     * @typescript
     * dispatch(event: string, param1?: any, param2?: any, param3?: any, param4?: any): void
     */
    dispatch (event, param1, param2, param3, param4) {
        switch (event) {
            case 'complete' :
                this.onComplete && this.onComplete(param1, param2, param3, param4);
                break; 
            case 'progress': 
                this.onProgress && this.onProgress(param1, param2, param3, param4);
                break;
            case 'error': 
                this.onError && this.onError(param1, param2, param3, param4);
                break;
            default:
                var str = 'on' + event[0].toUpperCase() + event.substr(1);
                if (typeof this[str] === 'function') {
                    this[str](param1, param2, param3, param4);
                }
                break;
        }
    },

    /**
     * !#en
     * Recycle this for reuse
     * 
     * !#zh
     * 回收 task 用于复用
     * 
     * @method recycle
     * 
     * @typescript
     * recycle(): void
     */
    recycle () {
        this.onComplete = null;
        this.onProgress = null;
        this.onError = null;
        this.source = this.output = this.input = null;
        this.progress = null;
        this.options = null;
        _deadPool.length < MAX_DEAD_NUM && _deadPool.push(this);
    },

    /**
     * !#en
     * Whether or not this task is completed
     * 
     * !#zh
     * 此任务是否已经完成
     * 
     * @property isFinish
     */
    get isFinish () {
        return this._isFinish;
    }
};

/**
 * !#en
 * Create a new task from pool
 * 
 * !#zh
 * 从对象池中创建 task
 * 
 * @function create
 * @param {Object} options - Some optional paramters
 * @param {Function} [options.onComplete] - Callback when the task complete, if the pipeline is synchronous, onComplete is unnecessary.
 * @param {Function} [options.onProgress] - Continuously callback when the task is runing, if the pipeline is synchronous, onProgress is unnecessary.
 * @param {*} options.input - Something will be handled with pipeline
 * @param {*} [options.progress] - Progress information, you may need to assign it manually when multiple pipeline share one progress
 * @param {Object} [options.options] - Custom parameters
 * @returns {Task} task
 * 
 * @typescript 
 * create(options: {onComplete?: ((err: Error, result: any) => void)|null, onError?: () => void, onProgress?: Function|null, input: any, progress?: any, options?: any}): cc.AssetManager.Task
 */
Task.create = function (options) {
    var out = null;
    if (_deadPool.length !== 0) {
        out = _deadPool.pop();
        out.set(options);
    }
    else {
        out = new Task(options);
    }

    return out;
};

module.exports = Task;