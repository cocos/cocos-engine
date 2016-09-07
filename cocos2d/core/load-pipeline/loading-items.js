/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var CallbacksInvoker = require('../platform/callbacks-invoker');
var Path = require('../utils/CCPath');
var JS = require('../platform/js');

var _qid = (0|(Math.random()*998));
var _queues = {};
var _pool = [];
var _POOL_MAX_LENGTH = 10;

var ItemState = {
    WORKING: 1,
    COMPLETE: 2,
    ERROR: 3
};

function isIdValid (id) {
    var realId = id.id || id;
    return (typeof realId === 'string');
}
function createItem (id, queueId) {
    var result;
    if (typeof id === 'object' && id.id) {
        if (!id.type) {
            id.type = Path.extname(id.id).toLowerCase().substr(1);
        }
        result = {
            queueId: queueId,
            url: id.url || id.id,
            error: null,
            content: null,
            complete: false,
            states: {}
        };
        JS.mixin(result, id);
    }
    else if (typeof id === 'string') {
        result = {
            queueId: queueId,
            id: id,
            url: id,
            type: Path.extname(id).toLowerCase().substr(1),
            error: null,
            content: null,
            complete: false,
            states: {}
        };
    }

    if (result.skips) {
        for (var i = 0, l = result.skips.length; i < l; i++) {
            var skip = result.skips[i];
            result.states[skip] = ItemState.COMPLETE;
        }
    }

    return result;
}

/**
 * !#en
 * LoadingItems is the manager of items in pipeline.</br>
 * It hold a map of items, each entry in the map is a url to object key value pair.</br>
 * Each item always contains the following property:</br>
 * - id: The identification of the item, usually it's identical to url</br>
 * - url: The url </br>
 * - type: The type, it's the extension name of the url by default, could be specified manually too.</br>
 * - error: The error happened in pipeline will be stored in this property.</br>
 * - content: The content processed by the pipeline, the final result will also be stored in this property.</br>
 * - complete: The flag indicate whether the item is completed by the pipeline.</br>
 * - states: An object stores the states of each pipe the item go through, the state can be: Pipeline.ItemState.WORKING | Pipeline.ItemState.ERROR | Pipeline.ItemState.COMPLETE</br>
 * </br>
 * Item can hold other custom properties.
 * !#zh
 * LoadingItems 负责管理 pipeline 中的对象</br>
 * 它有一个 map 属性用来存放加载项，在 map 对象中已 url 为 key 值。</br>
 * 每个对象都会包含下列属性：</br>
 * - id：该对象的标识，通常与 url 相同。</br>
 * - url：路径 </br>
 * - type: 类型，它这是默认的 URL 的扩展名，可以手动指定赋值。</br>
 * - error：pipeline 中发生的错误将被保存在这个属性中。</br>
 * - content: pipeline 中处理的临时结果，最终的结果也将被存储在这个属性中。</br>
 * - complete：该标志表明该对象是否通过 pipeline 完成。</br>
 * - states：该对象存储每个管道中对象经历的状态，状态可以是 Pipeline.ItemState.WORKING | Pipeline.ItemState.ERROR | Pipeline.ItemState.COMPLETE</br>
 * </br>
 * 对象可容纳其他自定义属性。
 *
 * @class LoadingItems
 * @extends CallbacksInvoker
 */
var LoadingItems = function (pipeline, onProgress, onComplete, urlList) {
    CallbacksInvoker.call(this);

    this._id = ++_qid;

    _queues[this._id] = this;

    this._pipeline = pipeline;

    this._errorUrls = [];

    this.onProgress = onProgress;

    this.onComplete = onComplete;

    /**
     * !#en The map of all items.
     * !#zh 存储所有加载项的对象。
     * @property map
     * @type {Object}
     */
    this.map = {};

    /**
     * !#en The map of completed items.
     * !#zh 存储已经完成的加载项。
     * @property completed
     * @type {Object}
     */
    this.completed = {};

    /**
     * !#en Total count of all items.
     * !#zh 所有加载项的总数。
     * @property totalCount
     * @type {Number}
     */
    this.totalCount = 0;

    /**
     * !#en Total count of completed items.
     * !#zh 所有完成加载项的总数。
     * @property completedCount
     * @type {Number}
     */
    this.completedCount = 0;

    /**
     * !#en Activated or not.
     * !#zh 是否启用。
     * @property active
     * @type {Boolean}
     */
    if (this._pipeline) {
        this.active = true;
    }
    else {
        this.active = false;
    }

    if (urlList && urlList.length > 0) {
        this.append(urlList);
    }
};

LoadingItems.ItemState = new cc.Enum(ItemState);

LoadingItems.create = function (pipeline, onProgress, onComplete, urlList) {
    var queue = _pool.pop();
    if (queue) {
        queue._pipeline = pipeline;
        queue.onProgress = onProgress;
        queue.onComplete = onComplete;
        _queues[queue._id] = queue;
        if (queue._pipeline) {
            queue.active = true;
        }
        if (urlList && urlList.length > 0) {
            queue.append(urlList);
        }
    }
    else {
        queue = new LoadingItems(pipeline, onProgress, onComplete, urlList);
    }
    return queue;
};

LoadingItems.getQueue = function (id) {
    return _queues[id];
};

LoadingItems.itemComplete = function (item) {
    var queue = _queues[item.queueId];
    if (queue) {
        console.log('----- Completed by pipeline ' + item.id + ', rest: ' + (queue.totalCount - queue.completedCount-1));
        queue.itemComplete(item.id);
    }
};

JS.mixin(LoadingItems.prototype, CallbacksInvoker.prototype, {
    append: function (urlList) {
        if (!this.active) {
            return [];
        }

        var accepted = [], i, url, item;
        for (i = 0; i < urlList.length; ++i) {
            url = urlList[i];

            // Already queued in another items queue, url is actually the item
            if (url.queueId && !this.map[url.id]) {
                this.map[url.id] = url;
                // Queued and has a alias, consider as completed
                if (true) {//url.complete) {
                    this.totalCount++;
                    console.log('----- Completed already ' + url.id + ', rest: ' + (this.totalCount - this.completedCount-1));
                    this.itemComplete(url.id);
                    continue;
                }
                // Not completed yet, should wait it
                else {
                    var self = this;
                    var queue = _queues[url.queueId];
                    if (queue) {
                        this.totalCount++;
                        console.log('+++++ Waited ' + url.id);
                        queue.addListener(url.id, function (item) {
                            console.log('----- Completed by waiting ' + item.id + ', rest: ' + (self.totalCount - self.completedCount-1));
                            self.itemComplete(item.id);
                        });
                        continue;
                    }
                    // if queue not found and it's not completed, then requeue it.
                }
            }
            // Queue new items
            if (isIdValid(url)) {
                item = createItem(url, this._id);
                var id = item.id;
                // No duplicated url
                if (!this.map[id]) {
                    this.map[item.id] = item;
                    this.totalCount++;
                    accepted.push(item);
                    console.log('+++++ Appended ' + item.id);
                }
            }
        }

        // Manually complete
        if (this.completedCount === this.totalCount) {
            this.allComplete();
        }
        else {
            this._pipeline.flowIn(accepted);
        }
        return accepted;
    },

    allComplete: function () {
        var errors = this._errorUrls.length === 0 ? null : this._errorUrls;
        if (this.onComplete) {
            this.onComplete(errors, this);
        }
    },

    /**
     * !#en Check whether all items are completed.
     * !#zh 检查是否所有加载项都已经完成。
     * @method isCompleted
     * @return {Boolean}
     */
    isCompleted: function () {
        return this.completedCount >= this.totalCount;
    },

    /**
     * !#en Check whether an item is completed.
     * !#zh 通过 id 检查指定加载项是否已经加载完成。
     * @method isItemCompleted
     * @param {String} id The item's id.
     * @return {Boolean}
     */
    isItemCompleted: function (id) {
        return !!this.completed[id];
    },

    /**
     * !#en Check whether an item exists.
     * !#zh 通过 id 检查加载项是否存在。
     * @method exists
     * @param {String} id The item's id.
     * @return {Boolean}
     */
    exists: function (id) {
        return !!this.map[id];
    },

    /**
     * !#en Returns the content of an internal item.
     * !#zh 通过 id 获取指定对象的内容。
     * @method getContent
     * @param {String} id The item's id.
     * @return {Object}
     */
    getContent: function (id) {
        var item = this.map[id];
        var ret = null;
        if (item) {
            if (item.content) {
                ret = item.content;
            }
            else if (item.alias) {
                ret = this.getContent(item.alias);
            }
        }

        return ret;
    },

    /**
     * !#en Returns the error of an internal item.
     * !#zh 通过 id 获取指定对象的错误信息。
     * @method getError
     * @param {String} id The item's id.
     * @return {Object}
     */
    getError: function (id) {
        var item = this.map[id];
        var ret = null;
        if (item) {
            if (item.error) {
                ret = item.error;
            } else if (item.alias) {
                ret = this.getError(item.alias);
            }
        }

        return ret;
    },

    /**
     * !#en Add a listener for an item, the callback will be invoked when the item is completed.
     * !#zh 监听加载项（通过 key 指定）的完成事件。
     * @method addListener
     * @param {String} key
     * @param {Function} callback - can be null
     * @param {Object} target - can be null
     * @return {Boolean} whether the key is new
     */
    addListener: CallbacksInvoker.prototype.add,

    /**
     * !#en
     * Check if the specified key has any registered callback. </br>
     * If a callback is also specified, it will only return true if the callback is registered.
     * !#zh
     * 检查指定的加载项是否有完成事件监听器。</br>
     * 如果同时还指定了一个回调方法，并且回调有注册，它只会返回 true。
     * @method hasListener
     * @param {String} key
     * @param {Function} [callback]
     * @param {Object} [target]
     * @return {Boolean}
     */
    hasListener: CallbacksInvoker.prototype.has,

    /**
     * !#en
     * Removes a listener. </br>
     * It will only remove when key, callback, target all match correctly.
     * !#zh
     * 移除指定加载项已经注册的完成事件监听器。</br>
     * 只会删除 key, callback, target 均匹配的监听器。
     * @method remove
     * @param {String} key
     * @param {Function} callback
     * @param {Object} target
     * @return {Boolean} removed
     */
    removeListener: CallbacksInvoker.prototype.remove,

    /**
     * !#en
     * Removes all callbacks registered in a certain event
     * type or all callbacks registered with a certain target.
     * !#zh 删除指定目标的所有完成事件监听器。
     * @method removeAllListeners
     * @param {String|Object} key - The event key to be removed or the target to be removed
     */
    removeAllListeners: CallbacksInvoker.prototype.removeAll,

    /**
     * !#en Remove an item, can only remove completed item, ongoing item can not be removed.
     * !#zh 移除加载项，这里只会移除已经完成的加载项，正在进行的加载项将不能被删除。
     * @param {String} url
     */
    removeItem: function (url) {
        var item = this.map[url];
        if (!item) return;

        if (!this.completed[item.alias || url]) return;

        delete this.completed[url];
        delete this.map[url];
        if (item.alias) {
            delete this.completed[item.alias];
            delete this.map[item.alias];
        }

        this.completedCount--;
        this.totalCount--;
    },

    itemComplete: function (id) {
        var item = this.map[id];
        if (!item) {
            return;
        }

        // Register or unregister errors
        var errorListId = this._errorUrls.indexOf(id);
        if (item.error && errorListId === -1) {
            this._errorUrls.push(id);
        }
        else if (!item.error && errorListId !== -1) {
            this._errorUrls.splice(errorListId, 1);
        }

        item.complete = true;
        this.completed[id] = item;
        this.completedCount++;

        this.onProgress && this.onProgress(this.completedCount, this.totalCount, item);

        // All completed
        if (this.completedCount >= this.totalCount) {
            console.log('===== All Completed ');
            this.allComplete();
        }

        this.invokeAndRemove(id, item);
    },

    destroy: function () {
        this.active = false;
        this._pipeline = null;
        this._errorUrls.length = 0;
        this.onProgress = null;
        this.onComplete = null;

        // Reinitialize CallbacksInvoker, generate three new objects, could be improved
        CallbacksInvoker.call(this);

        for (var key in this.map) {
            delete this.map[key];
        }
        for (key in this.completed) {
            delete this.completed[key];
        }

        this.totalCount = 0;
        this.completedCount = 0;

        _queues[this._id] = null;
        if (_pool.indexOf(this) === -1 && _pool.length < _POOL_MAX_LENGTH) {
            _pool.push(this);
        }
    }
});

module.exports = LoadingItems;