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

var CallbacksInvoker = require('../platform/callbacks-invoker');
var JS = require('../platform/js');

/**
 * LoadingItems is the manager of items in pipeline.
 * It hold a map of items, each entry in the map is a url to object key value pair.
 * Each item always contains the following property:
 * - src: The url
 * - type: The type, it's the extension name of the url by default, could be specified manually too
 * - error: The error happened in pipeline will be stored in this property
 * - content: The content processed by the pipeline, the final result will also be stored in this property
 * - complete: The flag indicate whether the item is completed by the pipeline
 * - states: An object stores the states of each pipe the item go through, the state can be: Pipeline.ItemState.WORKING | Pipeline.ItemState.ERROR | Pipeline.ItemState.COMPLETE
 *
 * Item can hold other custom properties
 * 
 * @class LoadingItems
 */
var LoadingItems = function () {
    CallbacksInvoker.call(this);

    /**
     * The map of all items
     * @property map
     * @type {Object}
     */
    this.map = {};

    /**
     * The map of all completed items
     * @property completed
     * @type {Object}
     */
    this.completed = {};

    /**
     * Total count of all items
     * @property totalCount
     * @type {Number}
     */
    this.totalCount = 0;

    /**
     * Total count of completed items
     * @property completedCount
     * @type {Number}
     */
    this.completedCount = 0;
};

JS.mixin(LoadingItems.prototype, CallbacksInvoker.prototype, {
    append: function (items) {
        var count = 0;
        for (var i = 0; i < items.length; ++i) {
            var item = items[i];
            var url = item.src;
            // No duplicated url
            if (!this.map[url]) {
                this.map[item.src] = item;
                count++;
            }
        }
        this.totalCount += count;
    },

    /**
     * Check whether all items are completed
     * @return {Boolean}
     */
    isCompleted: function () {
        return this.completedCount >= this.totalCount;
    },

    /**
     * Check whether an item is completed
     * @return {Boolean}
     */
    isItemCompleted: function (url) {
        return !!this.completed[url];
    }
});

module.exports = LoadingItems;