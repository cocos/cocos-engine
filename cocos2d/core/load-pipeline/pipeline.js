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
 * A pipeline describes a sequence of manipulations, each manipulation is called a pipe.
 * It's designed for loading process, so items should be urls, and the url will be the identity of each item during the process.
 * A list of items can flow in the pipeline and it will output the results of all pipes. 
 * They flow in the pipeline like water in tubes, they go through pipe by pipe separately.
 * Finally all items will flow out the pipeline and the process is finished.
 * 
 * @class Pipeline
 */
/**
 * Constructor, pass an array of pipes to construct a new Pipeline, the pipes will be chained in the given order.
 * A pipe is an object which must contain an `id` in string and a `handle` function, the id must be unique in the pipeline.
 * It can also include `async` property to identify whether it's an asynchronous process.
 * @example
 *  var pipeline = new Pipeline([
 *      {
 *          id: 'Downloader', 
 *          handle: function (item, callback) {}, 
 *          async: true
 *      },
 *      {id: 'Parser', handle: function (item) {}, async: false}
 *  ]);
 * 
 * @method Pipeline
 * @param {Array} pipes
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
     * Insert a new pipe at the given index of the pipeline.
     * A pipe must contain an `id` in string and a `handle` function, the id must be unique in the pipeline.
     *
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
     * Add a new pipe at the end of the pipeline.
     * A pipe must contain an `id` in string and a `handle` function, the id must be unique in the pipeline.
     *
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
     * Let new items flow into the pipeline.
     * Each item can be a simple url string or an object, 
     * if it's an object, it must contain `id` property. 
     * You can specify its type by `type` property, by default, the type is the extension name in `src`.
     * By adding a `skips` property including pipe ids, you can skip these pipe.
     * The object can contain any supplementary property as you want.
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
     * 
     * @method flowIn
     * @param {Array} urlList
     * @return {Array} Items accepted by the pipeline
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
     * Let new items flow into the pipeline and give a callback when the list of items are all completed.
     * This is for loading dependencies for an existing item in flow, usually used in a pipe logic.
     * For example, we have a loader for scene configuration file in JSON, the scene will only be fully loaded 
     * after all its dependencies are loaded, then you will need to use function to flow in all dependencies 
     * found in the configuration file, and finish the loader pipe only after all dependencies are loaded (in the callback).
     *
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
     * Copy the item states from one source item to all destination items.
     * It's quite useful when a pipe generate new items from one source item,
     * then you should flowIn these generated items into pipeline, 
     * but you probably want them to skip all pipes the source item already go through,
     * you can achieve it with this API. 
     *
     * For example, an unzip pipe will generate more items, but you won't want them to pass unzip or download pipe again.
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
     * Returns whether the pipeline is flowing (contains item) currently.
     * @method isFlowing
     * @return {Boolean}
     */
    isFlowing: function () {
        return this._flowing;
    },

    /**
     * Returns all items in pipeline.
     * @method getItems
     * @return {LoadingItems}
     */
    getItems: function () {
        return this._items;
    },

    /**
     * Returns an item in pipeline.
     * @method getItems
     * @return {LoadingItems}
     */
    getItem: function (url) {
        return this._items.map[url];
    },

    /**
     * Removes an item in pipeline, no matter it's in progress or completed.
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
     * Clear the current pipeline, this function will clean up the items.
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
     * This is a callback which will be invoked while an item flow out the pipeline, you should overwrite this function.
     * @example
     *  pipeline.onProgress = function (completedCount, totalCount, item) {
     *      var progress = (100 * completedCount / totalCount).toFixed(2);
     *      cc.log(progress + '%');
     *  }
     * @method onProgress
     * @param {Number} completedCount The number of the items that are already completed.
     * @param {Number} totalCount The total number of the items.
     * @param {Object} item The latest item which flow out the pipeline.
     */
    onProgress: null,

    /**
     * This is a callback which will be invoked while all items flow out the pipeline, you should overwirte this function.
     * @example
     *  pipeline.onComplete = function (error, items) {
     *      if (error)
     *          cc.log('Completed with ' + error.length + ' errors');
     *      else
     *          cc.log('Completed ' + items.totalCount + ' items');
     *  }
     * @method onComplete
     * @param {Array} error All errored urls will be stored in this array, if no error happened, then it will be null
     * @param {LoadingItems} items All items.
     */
    onComplete: null
});

cc.Pipeline = module.exports = Pipeline;