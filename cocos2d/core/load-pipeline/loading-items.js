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
var JS = require('../platform/js');

/**
 * LoadingItems is the manager of items in pipeline.
 * It hold a map of items, each entry in the map is a url to object key value pair.
 * Each item always contains the following property:
 * - id: The identification of the item, usually it's identical to url
 * - url: The url
 * - type: The type, it's the extension name of the url by default, could be specified manually too
 * - error: The error happened in pipeline will be stored in this property
 * - content: The content processed by the pipeline, the final result will also be stored in this property
 * - complete: The flag indicate whether the item is completed by the pipeline
 * - states: An object stores the states of each pipe the item go through, the state can be: Pipeline.ItemState.WORKING | Pipeline.ItemState.ERROR | Pipeline.ItemState.COMPLETE
 *
 * Item can hold other custom properties
 * 
 * @class LoadingItems
 * @extends CallbacksInvoker
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
     * The map of completed items
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
        var list = [];
        for (var i = 0; i < items.length; ++i) {
            var item = items[i];
            var id = item.id;
            // No duplicated url
            if (!this.map[id]) {
                this.map[item.id] = item;
                list.push(item);
            }
        }
        this.totalCount += list.length;
        return list;
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
     * @param {String} id The item's id.
     * @return {Boolean}
     */
    isItemCompleted: function (id) {
        return !!this.completed[id];
    },

    /**
     * Check whether an item exists
     * @param {String} id The item's id.
     * @return {Boolean}
     */
    exists: function (id) {
        return !!this.map[id];
    },

    /**
     * Returns the content of an internal item
     * @param {String} id The item's id.
     * @return {Object}
     */
    getContent: function (id) {
        var item = this.map[id];
        return item ? item.content : null;
    },

    /**
     * Returns the error of an internal item
     * @param {String} id The item's id.
     * @return {Object}
     */
    getError: function (id) {
        var item = this.map[id];
        return item ? item.error : null;
    },

    /**
     * Add a listener for an item, the callback will be invoked when the item is completed.
     * @method addListener
     * @param {String} key
     * @param {Function} callback - can be null
     * @param {Object} target - can be null
     * @return {Boolean} whether the key is new
     */
    addListener: CallbacksInvoker.prototype.add,

    /**
     * Check if the specified key has any registered callback. 
     * If a callback is also specified, it will only return true if the callback is registered.
     * @method hasListener
     * @param {String} key
     * @param {Function} [callback]
     * @param {Object} [target]
     * @return {Boolean}
     */
    hasListener: CallbacksInvoker.prototype.has,

    /**
     * Removes a listener. 
     * It will only remove when key, callback, target all match correctly.
     * @method remove
     * @param {String} key
     * @param {Function} callback
     * @param {Object} target
     * @return {Boolean} removed
     */
    removeListener: CallbacksInvoker.prototype.remove,

    /**
     * Removes all callbacks registered in a certain event type or all callbacks registered with a certain target
     * @method removeAllListeners
     * @param {String|Object} key - The event key to be removed or the target to be removed
     */
    removeAllListeners: CallbacksInvoker.prototype.removeAll,

    /**
     * Remove an item, can only remove completed item, ongoing item can not be removed
     * @param {String} url
     */
    removeItem: function (url) {
        if (this.completed[url]) {
            delete this.completed[url];
            delete this.map[url];
            this.completedCount--;
            this.totalCount--;
        }
    },

    complete: function (url) {
        if (this.map[url] && !this.completed[url]) {
            var item = this.map[url];
            item.complete = true;
            this.completed[url] = item;
            this.completedCount++;
        }
    }
});

module.exports = LoadingItems;