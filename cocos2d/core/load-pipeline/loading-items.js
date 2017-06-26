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

var _queueDeps = {};
var _parseUrl = function (url) {
    var result = {};
    if (!url)
        return result;

    var split = url.split('?');
    if (!split || !split[0]) {
        return result;
    }
    result.url = split[0];
    if (!split[1]) {
        return result;
    }
    result.param = {};
    split = split[1].split('&');
    split.forEach(function (item) {
        var itemSplit = item.split('=');
        result.param[itemSplit[0]] = itemSplit[1];
    });
    return result;
};

function isIdValid (id) {
    var realId = id.url || id;
    return (typeof realId === 'string');
}
function createItem (id, queueId) {
    var result, urlItem;
    if (typeof id === 'object') {
        if (id.url && !id.type) {
            id.type = Path.extname(id.url).toLowerCase().substr(1);
        }
        urlItem = _parseUrl(id.url);
        result = {
            queueId: queueId,
            id: id.url,
            url: urlItem.url,
            urlParam: urlItem.param,
            error: null,
            content: null,
            complete: false,
            states: {},
            deps: null
        };
        JS.mixin(result, id);
    }
    else if (typeof id === 'string') {
        urlItem = _parseUrl(id);
        result = {
            queueId: queueId,
            id: id,
            url: urlItem.url,
            urlParam: urlItem.param,
            type: Path.extname(id).toLowerCase().substr(1),
            error: null,
            content: null,
            complete: false,
            states: {},
            deps: null
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

var checkedIds = [];
function checkCircleReference(owner, item, recursiveCall) {
    if (!owner || !item) {
        return false;
    }
    var result = false;
    checkedIds.push(item.id);
    if (item.deps) {
        var i, deps = item.deps, subDep;
        for (i = 0; i < deps.length; i++) {
            subDep = deps[i];
            if (subDep.id === owner.id) {
                result = true;
                break;
            }
            else if (checkedIds.indexOf(subDep.id) >= 0) {
                continue;
            }
            else if (subDep.deps && checkCircleReference(owner, subDep, true)) {
                result = true;
                break;
            }
        }
    }
    if (!recursiveCall) {
        checkedIds.length = 0;
    }
    return result;
}

/**
 * !#en
 * LoadingItems is the queue of items which can flow them into the loading pipeline.</br>
 * Please don't construct it directly, use {{#crossLink "LoadingItems.create"}}LoadingItems.create{{/crossLink}} instead, because we use an internal pool to recycle the queues.</br>
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
 * Item can hold other custom properties.</br>
 * Each LoadingItems object will be destroyed for recycle after onComplete callback</br>
 * So please don't hold its reference for later usage, you can copy properties in it though.
 * !#zh
 * LoadingItems 是一个加载对象队列，可以用来输送加载对象到加载管线中。</br>
 * 请不要直接使用 new 构造这个类的对象，你可以使用 {{#crossLink "LoadingItems.create"}}LoadingItems.create{{/crossLink}} 来创建一个新的加载队列，这样可以允许我们的内部对象池回收并重利用加载队列。
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
 * 对象可容纳其他自定义属性。</br>
 * 每个 LoadingItems 对象都会在 onComplete 回调之后被销毁，所以请不要持有它的引用并在结束回调之后依赖它的内容执行任何逻辑，有这种需求的话你可以提前复制它的内容。
 *
 * @class LoadingItems
 * @extends CallbacksInvoker
 */
var LoadingItems = function (pipeline, urlList, onProgress, onComplete) {
    CallbacksInvoker.call(this);

    this._id = ++_qid;

    _queues[this._id] = this;

    this._pipeline = pipeline;

    this._errorUrls = [];

    this._appending = false;

    this._ownerQueue = null;

    /**
     * !#en This is a callback which will be invoked while an item flow out the pipeline.
     * You can pass the callback function in LoadingItems.create or set it later.
     * !#zh 这个回调函数将在 item 加载结束后被调用。你可以在构造时传递这个回调函数或者是在构造之后直接设置。
     * @method onProgress
     * @param {Number} completedCount The number of the items that are already completed.
     * @param {Number} totalCount The total number of the items.
     * @param {Object} item The latest item which flow out the pipeline.
     * @example
     *  loadingItems.onProgress = function (completedCount, totalCount, item) {
     *      var progress = (100 * completedCount / totalCount).toFixed(2);
     *      cc.log(progress + '%');
     *  }
     */
    this.onProgress = onProgress;

    /**
     * !#en This is a callback which will be invoked while all items is completed,
     * You can pass the callback function in LoadingItems.create or set it later.
     * !#zh 该函数将在加载队列全部完成时被调用。你可以在构造时传递这个回调函数或者是在构造之后直接设置。
     * @method onComplete
     * @param {Array} errors All errored urls will be stored in this array, if no error happened, then it will be null
     * @param {LoadingItems} items All items.
     * @example
     *  loadingItems.onComplete = function (errors, items) {
     *      if (error)
     *          cc.log('Completed with ' + errors.length + ' errors');
     *      else
     *          cc.log('Completed ' + items.totalCount + ' items');
     *  }
     */
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

    if (urlList) {
        if (urlList.length > 0) {
            this.append(urlList);
        }
        else {
            this.allComplete();
        }
    }
};

/**
 * !#en The item states of the LoadingItems, its value could be LoadingItems.ItemState.WORKING | LoadingItems.ItemState.COMPLETET | LoadingItems.ItemState.ERROR
 * !#zh LoadingItems 队列中的加载项状态，状态的值可能是 LoadingItems.ItemState.WORKING | LoadingItems.ItemState.COMPLETET | LoadingItems.ItemState.ERROR
 * @enum LoadingItems.ItemState
 */

/**
 * @property {Number} WORKING
 */

/**
 * @property {Number} COMPLETET
 */

/**
 * @property {Number} ERROR
 */

LoadingItems.ItemState = new cc.Enum(ItemState);

/**
 * @class LoadingItems
 * @extends CallbacksInvoker
*/

/**
 * !#en The constructor function of LoadingItems, this will use recycled LoadingItems in the internal pool if possible.
 * You can pass onProgress and onComplete callbacks to visualize the loading process.
 * !#zh LoadingItems 的构造函数，这种构造方式会重用内部对象缓冲池中的 LoadingItems 队列，以尽量避免对象创建。
 * 你可以传递 onProgress 和 onComplete 回调函数来获知加载进度信息。
 * @method create
 * @static
 * @param {Pipeline} pipeline The pipeline to process the queue.
 * @param {Array} urlList The items array.
 * @param {Function} onProgress The progression callback, refer to {{#crossLink "LoadingItems.onProgress"}}{{/crossLink}}
 * @param {Function} onComplete The completion callback, refer to {{#crossLink "LoadingItems.onComplete"}}{{/crossLink}}
 * @return {LoadingItems} The LoadingItems queue obejct
 * @example
 *  LoadingItems.create(cc.loader, ['a.png', 'b.plist'], function (completedCount, totalCount, item) {
 *      var progress = (100 * completedCount / totalCount).toFixed(2);
 *      cc.log(progress + '%');
 *  }, function (errors, items) {
 *      if (errors) {
 *          for (var i = 0; i < errors.length; ++i) {
 *              cc.log('Error url: ' + errors[i] + ', error: ' + items.getError(errors[i]));
 *          }
 *      }
 *      else {
 *          var result_a = items.getContent('a.png');
 *          // ...
 *      }
 *  })
 */
LoadingItems.create = function (pipeline, urlList, onProgress, onComplete) {
    if (onProgress === undefined) {
        if (typeof urlList === 'function') {
            onComplete = urlList;
            urlList = onProgress = null;
        }
    }
    else if (onComplete === undefined) {
        if (typeof urlList === 'function') {
            onComplete = onProgress;
            onProgress = urlList;
            urlList = null;
        }
        else {
            onComplete = onProgress;
            onProgress = null;
        }
    }

    var queue = _pool.pop();
    if (queue) {
        queue._pipeline = pipeline;
        queue.onProgress = onProgress;
        queue.onComplete = onComplete;
        _queues[queue._id] = queue;
        if (queue._pipeline) {
            queue.active = true;
        }
        if (urlList) {
            queue.append(urlList);
        }
    }
    else {
        queue = new LoadingItems(pipeline, urlList, onProgress, onComplete);
    }

    return queue;
};

/**
 * !#en Retrieve the LoadingItems queue object for an item.
 * !#zh 通过 item 对象获取它的 LoadingItems 队列。
 * @method getQueue
 * @static
 * @param {Object} item The item to query
 * @return {LoadingItems} The LoadingItems queue obejct
 */
LoadingItems.getQueue = function (item) {
    return item.queueId ? _queues[item.queueId] : null;
};

/**
 * !#en Complete an item in the LoadingItems queue, please do not call this method unless you know what's happening.
 * !#zh 通知 LoadingItems 队列一个 item 对象已完成，请不要调用这个函数，除非你知道自己在做什么。
 * @method itemComplete
 * @static
 * @param {Object} item The item which has completed
 */
LoadingItems.itemComplete = function (item) {
    var queue = _queues[item.queueId];
    if (queue) {
        // console.log('----- Completed by pipeline ' + item.id + ', rest: ' + (queue.totalCount - queue.completedCount-1));
        queue.itemComplete(item.id);
    }
};

LoadingItems.initQueueDeps = function (queue) {
    var dep = _queueDeps[queue._id];
    if (!dep) {
        dep = _queueDeps[queue._id] = {
            completed: [],
            deps: []
        };
    }
    else {
        dep.completed.length = 0;
        dep.deps.length = 0;
    }
};

LoadingItems.registerQueueDep = function (owner, depId) {
    var queueId = owner.queueId || owner;
    if (!queueId) {
        return false;
    }
    var queueDepList = _queueDeps[queueId];
    // Owner is root queue
    if (queueDepList) {
        if (queueDepList.deps.indexOf(depId) === -1) {
            queueDepList.deps.push(depId);
        }
    }
    // Owner is an item in the intermediate queue
    else if (owner.id) {
        for (var id in _queueDeps) {
            var queue = _queueDeps[id];
            // Found root queue
            if (queue.deps.indexOf(owner.id) !== -1) {
                if (queue.deps.indexOf(depId) === -1) {
                    queue.deps.push(depId);
                }
            }
        }
    }
};

LoadingItems.finishDep = function (depId) {
    for (var id in _queueDeps) {
        var queue = _queueDeps[id];
        // Found root queue
        if (queue.deps.indexOf(depId) !== -1 && queue.completed.indexOf(depId) === -1) {
            queue.completed.push(depId);
        }
    }
};

var proto = LoadingItems.prototype;
JS.mixin(proto, CallbacksInvoker.prototype);

/**
 * !#en Add urls to the LoadingItems queue.
 * !#zh 向一个 LoadingItems 队列添加加载项。
 * @method append
 * @param {Array} urlList The url list to be appended, the url can be object or string
 * @return {Array} The accepted url list, some invalid items could be refused.
 */
proto.append = function (urlList, owner) {
    if (!this.active) {
        return [];
    }
    if (owner && !owner.deps) {
        owner.deps = [];
    }

    this._appending = true;
    var accepted = [], i, url, item;
    for (i = 0; i < urlList.length; ++i) {
        url = urlList[i];

        // Already queued in another items queue, url is actually the item
        if (url.queueId && !this.map[url.id]) {
            this.map[url.id] = url;
            // Register item deps for circle reference check
            owner && owner.deps.push(url);
            // Queued and completed or Owner circle referenced by dependency
            if (url.complete || checkCircleReference(owner, url)) {
                this.totalCount++;
                // console.log('----- Completed already or circle referenced ' + url.id + ', rest: ' + (this.totalCount - this.completedCount-1));
                this.itemComplete(url.id);
                continue;
            }
            // Not completed yet, should wait it
            else {
                var self = this;
                var queue = _queues[url.queueId];
                if (queue) {
                    this.totalCount++;
                    LoadingItems.registerQueueDep(owner || this._id, url.id);
                    // console.log('+++++ Waited ' + url.id);
                    queue.addListener(url.id, function (item) {
                        // console.log('----- Completed by waiting ' + item.id + ', rest: ' + (self.totalCount - self.completedCount-1));
                        self.itemComplete(item.id);
                    });
                }
                continue;
            }
        }
        // Queue new items
        if (isIdValid(url)) {
            item = createItem(url, this._id);
            var key = item.id;
            // No duplicated url
            if (!this.map[key]) {
                this.map[key] = item;
                this.totalCount++;
                // Register item deps for circle reference check
                owner && owner.deps.push(item);
                LoadingItems.registerQueueDep(owner || this._id, key);
                accepted.push(item);
                // console.log('+++++ Appended ' + item.id);
            }
        }
    }
    this._appending = false;

    // Manually complete
    if (this.completedCount === this.totalCount) {
        // console.log('===== All Completed ');
        this.allComplete();
    }
    else {
        this._pipeline.flowIn(accepted);
    }
    return accepted;
};

proto._childOnProgress = function (item) {
    if (this.onProgress) {
        var dep = _queueDeps[this._id];
        this.onProgress(dep ? dep.completed.length : this.completedCount, dep ? dep.deps.length : this.totalCount, item);
    }
};

/**
 * !#en Complete a LoadingItems queue, please do not call this method unless you know what's happening.
 * !#zh 完成一个 LoadingItems 队列，请不要调用这个函数，除非你知道自己在做什么。
 * @method allComplete
 */
proto.allComplete = function () {
    var errors = this._errorUrls.length === 0 ? null : this._errorUrls;
    if (this.onComplete) {
        this.onComplete(errors, this);
    }
};

/**
 * !#en Check whether all items are completed.
 * !#zh 检查是否所有加载项都已经完成。
 * @method isCompleted
 * @return {Boolean}
 */
proto.isCompleted = function () {
    return this.completedCount >= this.totalCount;
};

/**
 * !#en Check whether an item is completed.
 * !#zh 通过 id 检查指定加载项是否已经加载完成。
 * @method isItemCompleted
 * @param {String} id The item's id.
 * @return {Boolean}
 */
proto.isItemCompleted = function (id) {
    return !!this.completed[id];
};

/**
 * !#en Check whether an item exists.
 * !#zh 通过 id 检查加载项是否存在。
 * @method exists
 * @param {String} id The item's id.
 * @return {Boolean}
 */
proto.exists = function (id) {
    return !!this.map[id];
};

/**
 * !#en Returns the content of an internal item.
 * !#zh 通过 id 获取指定对象的内容。
 * @method getContent
 * @param {String} id The item's id.
 * @return {Object}
 */
proto.getContent = function (id) {
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
};

/**
 * !#en Returns the error of an internal item.
 * !#zh 通过 id 获取指定对象的错误信息。
 * @method getError
 * @param {String} id The item's id.
 * @return {Object}
 */
proto.getError = function (id) {
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
};

/**
 * !#en Add a listener for an item, the callback will be invoked when the item is completed.
 * !#zh 监听加载项（通过 key 指定）的完成事件。
 * @method addListener
 * @param {String} key
 * @param {Function} callback - can be null
 * @param {Object} target - can be null
 * @return {Boolean} whether the key is new
 */
proto.addListener = CallbacksInvoker.prototype.add;

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
proto.hasListener = CallbacksInvoker.prototype.has;

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
proto.removeListener = CallbacksInvoker.prototype.remove;

/**
 * !#en
 * Removes all callbacks registered in a certain event
 * type or all callbacks registered with a certain target.
 * !#zh 删除指定目标的所有完成事件监听器。
 * @method removeAllListeners
 * @param {String|Object} key - The event key to be removed or the target to be removed
 */
proto.removeAllListeners = CallbacksInvoker.prototype.removeAll;

/**
 * !#en Remove an item, can only remove completed item, ongoing item can not be removed.
 * !#zh 移除加载项，这里只会移除已经完成的加载项，正在进行的加载项将不能被删除。
 * @param {String} url
 */
proto.removeItem = function (url) {
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
};

/**
 * !#en Complete an item in the LoadingItems queue, please do not call this method unless you know what's happening.
 * !#zh 通知 LoadingItems 队列一个 item 对象已完成，请不要调用这个函数，除非你知道自己在做什么。
 * @method itemComplete
 * @param {String} id The item url
 */
proto.itemComplete = function (id) {
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

    this.completed[id] = item;
    this.completedCount++;

    LoadingItems.finishDep(item.id);
    if (this.onProgress) {
        var dep = _queueDeps[this._id];
        this.onProgress(dep ? dep.completed.length : this.completedCount, dep ? dep.deps.length : this.totalCount, item);
    }

    this.invokeAndRemove(id, item);

    // All completed
    if (!this._appending && this.completedCount >= this.totalCount) {
        // console.log('===== All Completed ');
        this.allComplete();
    }
};

/**
 * !#en Destroy the LoadingItems queue, the queue object won't be garbage collected, it will be recycled, so every after destroy is not reliable.
 * !#zh 销毁一个 LoadingItems 队列，这个队列对象会被内部缓冲池回收，所以销毁后的所有内部信息都是不可依赖的。
 * @method destroy
 */
proto.destroy = function () {
    this.active = false;
    this._appending = false;
    this._pipeline = null;
    this._ownerQueue = null;
    this._errorUrls.length = 0;
    this.onProgress = null;
    this.onComplete = null;

    this.map = {};
    this.completed = {};

    this.totalCount = 0;
    this.completedCount = 0;

    // Reinitialize CallbacksInvoker, generate three new objects, could be improved
    CallbacksInvoker.call(this);

    _queues[this._id] = null;
    if (_queueDeps[this._id]) {
        _queueDeps[this._id].completed.length = 0;
        _queueDeps[this._id].deps.length = 0;
    }
    if (_pool.indexOf(this) === -1 && _pool.length < _POOL_MAX_LENGTH) {
        _pool.push(this);
    }
};

cc.LoadingItems = module.exports = LoadingItems;
