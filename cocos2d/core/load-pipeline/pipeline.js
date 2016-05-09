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

var JS = require('../platform/js');
var Path = require('../utils/CCPath');
var LoadingItems = require('./loading-items');

var ItemState = {
    WORKING: 1,
    COMPLETE: 2,
    ERROR: 3
};

function asyncFlow (item) {
    var pipeId = this.id;
    var itemState = item.states[pipeId];
    var next = this.next;

    if (item.error || itemState === ItemState.WORKING || itemState === ItemState.ERROR) {
        return;
    }
    else if (itemState === ItemState.COMPLETE) {
        if (next) {
            next.flowIn(item);
        }
        else {
            this.pipeline.flowOut(item);
        }
    }
    else {
        item.states[pipeId] = ItemState.WORKING;
        var pipe = this;
        this.handle(item, function (err, result) {
            if (err) {
                item.error = err;
                item.states[pipeId] = ItemState.ERROR;
                pipe.pipeline.flowOut(item);
            }
            else {
                // Result can be null, then it means no result for this pipe
                if (result) {
                    item.content = result;
                }
                item.states[pipeId] = ItemState.COMPLETE;
                if (next) {
                    next.flowIn(item);
                }
                else {
                    pipe.pipeline.flowOut(item);
                }
            }
        });
    }
}
function syncFlow (item) {
    var pipeId = this.id;
    var itemState = item.states[pipeId];
    var next = this.next;
    
    if (item.error || itemState === ItemState.WORKING || itemState === ItemState.ERROR) {
        return;
    }
    else if (itemState === ItemState.COMPLETE) {
        if (next) {
            next.flowIn(item);
        }
        else {
            this.pipeline.flowOut(item);
        }
    }
    else {
        item.states[pipeId] = ItemState.WORKING;
        var result = this.handle(item);
        if (result instanceof Error) {
            item.error = result;
            item.states[pipeId] = ItemState.ERROR;
            this.pipeline.flowOut(item);
        }
        else {
            // Result can be null, then it means no result for this pipe
            if (result) {
                item.content = result;
            }
            item.states[pipeId] = ItemState.COMPLETE;
            if (next) {
                next.flowIn(item);
            }
            else {
                this.pipeline.flowOut(item);
            }
        }
    }
}

function isIdValid (id) {
    var realId = id.id || id;
    return (typeof realId === 'string');
}
function createItem (id) {
    var result;
    if (typeof id === 'object' && id.id) {
        if (!id.type) {
            id.type = Path.extname(id.id).toLowerCase().substr(1);
        }
        result = {
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

function getXMLHttpRequest () {
    return window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('MSXML2.XMLHTTP');
}

/**
 * !#en
 * A pipeline describes a sequence of manipulations, each manipulation is called a pipe.</br>
 * It's designed for loading process. so items should be urls, and the url will be the identity of each item during the process.</br>
 * A list of items can flow in the pipeline and it will output the results of all pipes.</br>
 * They flow in the pipeline like water in tubes, they go through pipe by pipe separately.</br>
 * Finally all items will flow out the pipeline and the process is finished.
 *
 * !#zh
 * pipeline 描述了一系列的操作，每个操作都被称为 pipe。</br>
 * 它被设计来做加载过程的流程管理。所以 item 应该是 url，并且该 url 将是在处理中的每个 item 的身份标识。</br>
 * 一个 item 列表可以在 pipeline 中流动，它将输出加载项经过所有 pipe 之后的结果。</br>
 * 它们穿过 pipeline 就像水在管子里流动，将会按顺序流过每个 pipe。</br>
 * 最后当所有加载项都流出 pipeline 时，整个加载流程就结束了。
 * @class Pipeline
 */
/**
 * !#en
 * Constructor, pass an array of pipes to construct a new Pipeline,
 * the pipes will be chained in the given order.</br>
 * A pipe is an object which must contain an `id` in string and a `handle` function,
 * the id must be unique in the pipeline.</br>
 * It can also include `async` property to identify whether it's an asynchronous process.
 * !#zh
 * 构造函数，通过一系列的 pipe 来构造一个新的 pipeline，pipes 将会在给定的顺序中被锁定。</br>
 * 一个 pipe 就是一个对象，它包含了字符串类型的 ‘id’ 和 ‘handle’ 函数，在 pipeline 中 id 必须是唯一的。</br>
 * 它还可以包括 ‘async’ 属性以确定它是否是一个异步过程。
 *
 * @method Pipeline
 * @param {Array} pipes
 * @example
 *  var pipeline = new Pipeline([
 *      {
 *          id: 'Downloader',
 *          handle: function (item, callback) {},
 *          async: true
 *      },
 *      {id: 'Parser', handle: function (item) {}, async: false}
 *  ]);
 */
var Pipeline = function (pipes) {
    this._pipes = pipes;
    this._items = new LoadingItems();
    this._errorUrls = [];
    this._flowing = false;

    for (var i = 0; i < pipes.length; ++i) {
        var pipe = pipes[i];
        // Must have handle and id, handle for flow, id for state flag
        if (!pipe.handle || !pipe.id) {
            continue;
        }

        pipe.pipeline = this;
        pipe.next = i < pipes.length - 1 ? pipes[i+1] : null;
        pipe.flowIn = pipe.async ? asyncFlow : syncFlow;
    }
};

Pipeline.ItemState = new cc.Enum(ItemState);
Pipeline.getXMLHttpRequest = getXMLHttpRequest;

JS.mixin(Pipeline.prototype, {
    /**
     * !#en
     * Insert a new pipe at the given index of the pipeline. </br>
     * A pipe must contain an `id` in string and a `handle` function, the id must be unique in the pipeline.
     * !#zh
     * 在给定的索引位置插入一个新的 pipe。</br>
     * 一个 pipe 必须包含一个字符串类型的 ‘id’ 和 ‘handle’ 函数，该 id 在 pipeline 必须是唯一标识。
     * @method insertPipe
     * @param {Object} pipe The pipe to be inserted
     * @param {Number} index The index to insert
     */
    insertPipe: function (pipe, index) {
        // Must have handle and id, handle for flow, id for state flag
        if (!pipe.handle || !pipe.id) {
            return;
        }

        pipe.pipeline = this;
        pipe.flowIn = pipe.async ? asyncFlow : syncFlow;
        if (index < this._pipes.length) {
            pipe.next = this._pipes[index];
            this._pipes.splice(index, 0, pipe);
        }
        else {
            pipe.next = null;
            this._pipes.push(pipe);
        }
    },

    /**
     * !#en
     * Add a new pipe at the end of the pipeline. </br>
     * A pipe must contain an `id` in string and a `handle` function, the id must be unique in the pipeline.
     * !#zh
     * 添加一个新的 pipe 到 pipeline 尾部。 </br>
     * 该 pipe 必须包含一个字符串类型 ‘id’ 和 ‘handle’ 函数，该 id 在 pipeline 必须是唯一标识。
     * @method appendPipe
     * @param {Object} pipe The pipe to be appended
     */
    appendPipe: function (pipe) {
        // Must have handle and id, handle for flow, id for state flag
        if (!pipe.handle || !pipe.id) {
            return;
        }

        pipe.pipeline = this;
        pipe.next = null;
        pipe.flowIn = pipe.async ? asyncFlow : syncFlow;
        this._pipes.push(pipe);
    },

    /**
     * !#en
     * Let new items flow into the pipeline. </br>
     * Each item can be a simple url string or an object,
     * if it's an object, it must contain `id` property. </br>
     * You can specify its type by `type` property, by default, the type is the extension name in url. </br>
     * By adding a `skips` property including pipe ids, you can skip these pipe. </br>
     * The object can contain any supplementary property as you want. </br>
     * !#zh
     * 让新的 item 流入 pipeline 中。</br>
     * 这里的每个 item 可以是一个简单字符串类型的 url 或者是一个对象,
     * 如果它是一个对象的话，他必须要包含 ‘id’ 属性。</br>
     * 你也可以指定它的 ‘type’ 属性类型，默认情况下，该类型是 ‘url’ 的后缀名。</br>
     * 也通过添加一个 包含 ‘skips’ 属性的 item 对象，你就可以跳过 skips 中包含的 pipe。</br>
     * 该对象可以包含任何附加属性。
     * @method flowIn
     * @param {Array} urlList
     * @return {Array} Items accepted by the pipeline
     * @example
     *  pipeline.flowIn([
     *      'res/Background.png',
     *      {
     *          id: 'res/scene.json',
     *          type: 'scene',
     *          name: 'scene',
     *          skips: ['Downloader']
     *      }
     *  ]);
     */
    flowIn: function (urlList) {
        var items = [], i, url, item;
        for (i = 0; i < urlList.length; ++i) {
            url = urlList[i];
            if (isIdValid(url)) {
                item = createItem(url);
                items.push(item);
            }
            else {
                throw new Error('Pipeline flowIn: Invalid url: ' + (url.id || url));
            }
        }
        var acceptedItems = this._items.append(items);

        // Manually complete
        if (this._pipes.length === 0 || acceptedItems.length === 0) {
            this.complete();
            return acceptedItems;
        }
        
        this._flowing = true;
        
        // Flow in after appended to loading items
        var pipe = this._pipes[0];
        if (pipe) {
            for (i = 0; i < acceptedItems.length; i++) {
                pipe.flowIn(acceptedItems[i]);
            }
        }
        return acceptedItems;
    },

    /**
     * !#en
     * Let new items flow into the pipeline and give a callback when the list of items are all completed. </br>
     * This is for loading dependencies for an existing item in flow, usually used in a pipe logic. </br>
     * For example, we have a loader for scene configuration file in JSON, the scene will only be fully loaded  </br>
     * after all its dependencies are loaded, then you will need to use function to flow in all dependencies  </br>
     * found in the configuration file, and finish the loader pipe only after all dependencies are loaded (in the callback).
     * !#zh
     * 让新 items 流入 pipeline 并且当 item 列表完成时进行回调函数。</br>
     * 这个 API 的使用通常是为了加载依赖项。</br>
     * 例如：</br>
     * 我们需要加载一个场景配置的 JSON 文件，该场景会将所有的依赖项全部都加载完毕以后，进行回调表示加载完毕。
     * @method flowInDeps
     * @param {Array} urlList
     * @param {Function} callback
     * @return {Array} Items accepted by the pipeline
     */
    flowInDeps: function (urlList, callback) {
        var checker = {};
        var count = 0;

        var items = this._items;
        function loadedCheck (item) {
            checker[item.id] = item;

            for (var url in checker) {
                // Not done yet
                if (!checker[url]) {
                    return;
                }
            }
            // All url completed
            callback && callback.call(this, checker);
            callback = null;
        }
        // Add loaded listeners
        for (var i = 0; i < urlList.length; ++i) {
            var url = urlList[i].id || urlList[i];
            if (typeof url !== 'string' || checker[url]) {
                continue;
            }
            var item = items.map[url];
            if ( !item ) {
                items.addListener(url, loadedCheck);
                checker[url] = null;
                count++;
            }
            else {
                checker[url] = item;
            }
        }
        // No new resources, complete directly
        if (count === 0) {
            callback && callback.call(this, checker);
            callback = null;
        }
        return this.flowIn(urlList);
    },

    complete: function () {
        // All completed
        if (this._items.isCompleted()) {
            this._flowing = false;
            var error = this._errorUrls.length === 0 ? null : this._errorUrls;
            if (this.onComplete) {
                this.onComplete(error, this._items);
            }
            // Remove all errored items, so that they can be flowed in again
            for (var i = 0; i < this._errorUrls.length; ++i) {
                var id = this._errorUrls[i];
                this._items.removeItem(id);
            }
            this._errorUrls = [];
        }
    },

    flowOut: function (item) {
        var id = item.id;
        var items = this._items;
        var exists = items.map[id];
        // Not exist or already completed
        if (!exists || exists.complete) {
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

        items.complete(item.id);

        this.onProgress && this.onProgress(items.completedCount, items.totalCount, item);

        this.complete();

        items.invokeAndRemove(id, item);
    },

    /**
     * !#en
     * Copy the item states from one source item to all destination items. </br>
     * It's quite useful when a pipe generate new items from one source item,</br>
     * then you should flowIn these generated items into pipeline, </br>
     * but you probably want them to skip all pipes the source item already go through,</br>
     * you can achieve it with this API. </br>
     * </br>
     * For example, an unzip pipe will generate more items, but you won't want them to pass unzip or download pipe again.
     * !#zh
     * 从一个源 item 向所有目标 item 复制它的 pipe 状态，用于避免重复通过部分 pipe。</br>
     * 当一个源 item 生成了一系列新的 items 时很有用，</br>
     * 你希望让这些新的依赖项进入 pipeline，但是又不希望它们通过源 item 已经经过的 pipe，</br>
     * 但是你可能希望他们源 item 已经通过并跳过所有 pipes，</br>
     * 这个时候就可以使用这个 API。
     * @method copyItemStates
     * @param {Object} srcItem The source item
     * @param {Array|Object} dstItems A single destination item or an array of destination items
     */
    copyItemStates: function (srcItem, dstItems) {
        if (!(dstItems instanceof Array)) {
            dstItems.states = srcItem.states;
            return;
        }
        for (var i = 0; i < dstItems.length; ++i) {
            dstItems[i].states = srcItem.states;
        }
    },

    /**
     * !#en Returns whether the pipeline is flowing (contains item) currently.
     * !#zh 获取 pipeline 当前是否正在处理中。
     * @method isFlowing
     * @return {Boolean}
     */
    isFlowing: function () {
        return this._flowing;
    },

    /**
     * !#en Returns all items in pipeline.
     * !#zh 获取 pipeline 中的所有 items。
     * @method getItems
     * @return {LoadingItems}
     */
    getItems: function () {
        return this._items;
    },

    /**
     * !#en Returns an item in pipeline.
     * !#zh 获取指定 item。
     * @method getItem
     * @return {LoadingItems}
     */
    getItem: function (url) {
        return this._items.map[url];
    },

    /**
     * !#en Removes an item in pipeline, no matter it's in progress or completed.
     * !#zh 移除指定 item，无论是进行时还是已完成。
     * @method removeItem
     * @return {Boolean} succeed or not
     */
    removeItem: function (url) {
        var item = this._items.map[url];
        if (item) {
            if (!item.complete) {
                item.error = new Error('Canceled manually');
                this.flowOut(item);
            }
            this._items.removeItem(url);
        }
        else {
            return false;
        }
    },

    /**
     * !#en Clear the current pipeline, this function will clean up the items.
     * !#zh 清空当前 pipeline，该函数将清理 items。
     * @method clear
     */
    clear: function () {
        if (this._flowing) {
            var items = this._items.map;
            for (var url in items) {
                var item = items[url];
                if (!item.complete) {
                    item.error = new Error('Canceled manually');
                    this.flowOut(item);
                }
            }
        }

        this._items = new LoadingItems();
        this._errorUrls = [];
        this._flowing = false;
    },

    /**
     * !#en This is a callback which will be invoked while an item flow out the pipeline, you should overwrite this function.
     * !#zh 这个回调函数将在 item 流出 pipeline 时被调用，你应该重写该函数。
     * @method onProgress
     * @param {Number} completedCount The number of the items that are already completed.
     * @param {Number} totalCount The total number of the items.
     * @param {Object} item The latest item which flow out the pipeline.
     * @example
     *  pipeline.onProgress = function (completedCount, totalCount, item) {
     *      var progress = (100 * completedCount / totalCount).toFixed(2);
     *      cc.log(progress + '%');
     *  }
     */
    onProgress: null,

    /**
     * !#en This is a callback which will be invoked while all items flow out the pipeline,
     * you should overwirte this function.
     * !#zh 该函数将在所有 item 流出 pipeline 时被调用，你应该重写该函数。
     * @method onComplete
     * @param {Array} error All errored urls will be stored in this array, if no error happened, then it will be null
     * @param {LoadingItems} items All items.
     * @example
     *  pipeline.onComplete = function (error, items) {
     *      if (error)
     *          cc.log('Completed with ' + error.length + ' errors');
     *      else
     *          cc.log('Completed ' + items.totalCount + ' items');
     *  }
     */
    onComplete: null
});

cc.Pipeline = module.exports = Pipeline;