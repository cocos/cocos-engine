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
 * - content: pipeline 中处理的内容时，最终的结果也将被存储在这个属性中。</br>
 * - complete：该标志表明该对象是否通过 pipeline 完成。</br>
 * - states：该对象存储每个管道中对象经历的状态，状态可以是 Pipeline.ItemState.WORKING | Pipeline.ItemState.ERROR | Pipeline.ItemState.COMPLETE</br>
 * </br>
 * 对象可容纳其他自定义属性。
 *
 * @class LoadingItems
 * @extends CallbacksInvoker
 */
var LoadingItems = function () {
    CallbacksInvoker.call(this);

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