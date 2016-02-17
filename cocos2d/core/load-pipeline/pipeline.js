/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var JS = require('../platform/js');
var LoadingItems = require('./loading-items');

var ItemState = {
    WORKING: 1,
    COMPLETE: 2,
    ERROR: 3
};

function asyncFlow (item) {
    var pipeId = this.id;
    var itemState = item.states[pipeId];

    if (item.error || itemState === ItemState.WORKING || itemState === ItemState.ERROR) {
        return;
    }
    else if (itemState === ItemState.COMPLETE) {
        if (this.next) {
            this.next.flowIn(item);
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
                if (pipe.next) {
                    pipe.next.flowIn(item);
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
    
    if (item.error || itemState === ItemState.WORKING || itemState === ItemState.ERROR) {
        return;
    }
    else if (itemState === ItemState.COMPLETE) {
        if (this.next) {
            this.next.flowIn(item);
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
            if (this.next) {
                this.next.flowIn(item);
            }
            else {
                this.pipeline.flowOut(item);
            }
        }
    }
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
    this._flowing = false;

    for (var i = 0; i < pipes.length; ++i) {
        var pipe = pipes[i];
        // Must have handle and id, handle for flow, id for state flag
        if (!pipe.handle || !pipe.id) {
            continue;
        }

        pipe.pipeline = this;
        pipe.next = i < pipes.length - 1 ? pipes[i+1] : null;

        if (pipe.async) {
            pipe.flowIn = asyncFlow;
        }
        else {
            pipe.flowIn = syncFlow;
        }
    }
};

Pipeline.ItemState = new cc.Enum(ItemState);

JS.mixin(Pipeline.prototype, {
    /**
     * Let new items flow into the pipeline.
     * Each item can be a simple url string or an object, 
     * if it's an object, it must contain `src` property. 
     * You can also specify its type by `type` property, by default, the type is the extension name in `src`.
     * The object can contain any supplementary property as you want.
     * @example
     *  pipeline.flowIn([
     *      'res/Background.png',
     *      {
     *          src: 'res/scene.json',
     *          type: 'scene',
     *          name: 'scene'
     *      }
     *  ]);
     * 
     * @method flowIn
     * @param {Array} urlList
     */
    flowIn: function (urlList) {
        if (!this._flowing) {
            this._flowing = true;
        }
        
        var appendedUrls = this._items.append(urlList);
        var items = this._items.map;

        if (this._pipes.length > 0) {
            for (var i = 0; i < appendedUrls.length; i++) {
                var url = appendedUrls[i];
                this._pipes[0].flowIn(items[url]);
            }
        }
    },

    flowOut: function (item) {
        this._items.itemDone(item.src);
        this.onProgress && this.onProgress(this._items.completedCount, this._items.totalCount, item);
        // All completed
        if (this._items.isCompleted()) {
            this._flowing = false;
            this.onComplete && this.onComplete(this._items);
        }
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
                }
            }
        }

        this._items = new LoadingItems();
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
    onProgress: function (completedCount, totalCount, item) {},

    /**
     * This is a callback which will be invoked while all items flow out the pipeline, you should overwirte this function.
     * @example
     *  pipeline.onComplete = function (items) {
     *      cc.log('Completed ' + items.totalCount + ' items');
     *  }
     * @method onComplete
     * @param {LoadingItems} items All items.
     */
    onComplete: function (items) {}
});

cc.Pipeline = module.exports = Pipeline;