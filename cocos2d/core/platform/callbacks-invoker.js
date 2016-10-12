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

var JS = require('./js');

/**
 * @example
 * var array = [0, 1, 2, 3, 4];
 * var iterator = new ForwardIterator(array);
 * iterator.length = list.length;
 * for (iterator.i = 0; iterator.i < iterator.length;) {
 *     var item = array[iterator.i];
 *     ++iterator.i;    // or iterator.i += x
 *     process(item);   // This may change i
 * }
 */
function ForwardIterator (array) {
    // the next index to iterate, not current iterating index
    this.i = 0;
    this.array = array;
    // original length of the array before iteration, should manually sync with array.length before each iteration.
    this.length = 0;
}
var proto = ForwardIterator.prototype;
proto.removeAt = function (i, count) {
    var next = this.i;
    if (typeof count === 'undefined') {
        this.array.splice(i, 1);
        --this.length;
        if (i < next) {
            this.i = next - 1;
        }
    }
    else {
        this.array.splice(i, count);
        // assume that both i and count are valid value
        this.length -= count;

        if (i >= next) {
            return;
        }
        if (i + count > next) {
            this.i = i;
        }
        else {
            this.i = next - count;
        }
    }
};

/**
 * The CallbacksHandler is an abstract class that can register and unregister callbacks by key.
 * Subclasses should implement their own methods about how to invoke the callbacks.
 * @class _CallbacksHandler
 *
 * @private
 */
var CallbacksHandler = (function () {
    this._callbackTable = {};
    this._invoking = {};
    this._toRemove = {};
    this._toRemoveAll = null;
});

/**
 * @method add
 * @param {String} key
 * @param {Function} callback
 * @param {Object} [target] - can be null
 * @return {Boolean} whether the key is new
 */
CallbacksHandler.prototype.add = function (key, callback, target) {
    var iterator = this._callbackTable[key];
    if (typeof iterator !== 'undefined') {
        if (typeof target === 'object') {
            // append the target after callback
            iterator.array.push(callback, target);
        }
        else {
            iterator.array.push(callback);
        }
        return false;
    }
    else {
        // new key
        if (typeof target === 'object') {
            // Just append the target after callback
            iterator = new ForwardIterator([callback, target]);
        }
        else {
            iterator = new ForwardIterator([callback]);
        }
        this._callbackTable[key] = iterator;
        return true;
    }
};

/**
 * Check if the specified key has any registered callback. If a callback is also specified,
 * it will only return true if the callback is registered.
 * @method has
 * @param {String} key
 * @param {Function} [callback]
 * @param {Object} [target]
 * @return {Boolean}
 */
CallbacksHandler.prototype.has = function (key, callback, target) {
    if (this._toRemoveAll === key) {
        return false;
    }
    var iterator = this._callbackTable[key], callbackTarget, index, list;
    if (!iterator) {
        return false;
    }
    // callback not given, but key found
    if (!callback) {
        if (this._toRemove[key]) {
            for (index = 0; index < list.length; index++) {
                if (list[index] !== REMOVE_PLACEHOLDER) {
                    return true;
                }
            }
            return false;
        }
        else {
            return list.length > 0;
        }
    }
    // wrong callback type, can't found anything
    else if (typeof callback !== 'function')
        return false;

    // Search callback, target pair in the list
    list = iterator.array;
    index = list.indexOf(callback);
    while (index !== -1) {
        callbackTarget = list[index+1];
        if (typeof callbackTarget !== 'object') {
            callbackTarget = undefined;
        }
        if (callbackTarget === target) {
            return true;
        }
        index = cc.js.array.indexOf.call(list, callback, index + 1);
    }
    // callback given but not found
    return false;
};

/**
 * Removes all callbacks registered in a certain event type or all callbacks registered with a certain target
 * @method removeAll
 * @param {String|Object} key - The event key to be removed or the target to be removed
 */
CallbacksHandler.prototype.removeAll = function (key) {
    var iterator;
    if (typeof key === 'object') {
        // remove by target
        var target = key, list, index, callback;
        // loop for all event types
        for (key in this._callbackTable) {
            iterator = this._callbackTable[key];
            list = iterator.array;
            index = list.lastIndexOf(target);
            while (index !== -1) {
                callback = list[index-1];
                if (typeof callback === 'function')
                    iterator.removeAt(index - 1, 2);
                else
                    iterator.removeAt(index);
                index = list.lastIndexOf(target);
            }
        }
    }
    else {
        // remove by key
        iterator = this._callbackTable[key];
        if (iterator) {
            iterator.removeAt(0, iterator.length);
            delete this._callbackTable[key];
        }
    }
};

/**
 * @method remove
 * @param {String} key
 * @param {Function} callback
 * @param {Object} target
 * @return {Boolean} removed
 */
CallbacksHandler.prototype.remove = function (key, callback, target) {
    var iterator = this._callbackTable[key], index, callbackTarget;
    if (iterator) {
        var list = iterator.array;
        index = list.indexOf(callback);
        while (index !== -1) {
            callbackTarget = list[index+1];
            if (typeof callbackTarget !== 'object') {
                callbackTarget = undefined;
            }
            if (callbackTarget === target) {
                iterator.removeAt(index, callbackTarget ? 2 : 1);
                break;
            }

            // indexOf have bug on some mobile browsers
            index = cc.js.array.indexOf.call(list, callback, index + 1);
        }
        return true;
    }
    return false;
};


/**
 * !#en The callbacks invoker to handle and invoke callbacks by key.
 * !#zh CallbacksInvoker 用来根据 Key 管理并调用回调方法。
 * @class CallbacksInvoker
 *
 * @extends _CallbacksHandler
 */
var CallbacksInvoker = function () {
    CallbacksHandler.call(this);
};
JS.extend(CallbacksInvoker, CallbacksHandler);

if (CC_TEST) {
    cc._Test.CallbacksInvoker = CallbacksInvoker;
}

/**
 * @method invoke
 * @param {String} key
 * @param {any} [p1]
 * @param {any} [p2]
 * @param {any} [p3]
 * @param {any} [p4]
 * @param {any} [p5]
 */
CallbacksInvoker.prototype.invoke = function (key, p1, p2, p3, p4, p5) {
    var iterator = this._callbackTable[key];
    if (iterator) {
        var list = iterator.array;
        iterator.length = list.length;
        for (var i = iterator.i = 0; i < iterator.length; i = iterator.i) {
            var callingFunc = list[i];
            var target = list[i + 1];
            var hasTarget = target && typeof target === 'object';
            if (hasTarget) {
                iterator.i = i + 2;
                callingFunc.call(target, p1, p2, p3, p4, p5);
            }
            else {
                iterator.i = i + 1;
                callingFunc(p1, p2, p3, p4, p5);
            }
        }
    }
};

/**
 * @method invokeAndRemove
 * @param {String} key
 * @param {any} [p1]
 * @param {any} [p2]
 * @param {any} [p3]
 * @param {any} [p4]
 * @param {any} [p5]
 */
CallbacksInvoker.prototype.invokeAndRemove = function (key, p1, p2, p3, p4, p5) {
    // this.invoke(key, p1, p2, p3, p4, p5);
    // 这里不直接调用invoke仅仅是为了减少调用堆栈的深度，方便调试
    var iterator = this._callbackTable[key], i, callingFunc, target;
    if (iterator) {
        var list = iterator.array;
        iterator.length = list.length;
        for (i = iterator.i = 0; i < iterator.length; i = iterator.i) {
            callingFunc = list[i];
            // cheap detection for function
            target = list[i + 1];
            if (target && typeof target === 'object') {
                iterator.i = i + 2;
                callingFunc.call(target, p1, p2, p3, p4, p5);
            }
            else {
                iterator.i = i + 1;
                callingFunc(p1, p2, p3, p4, p5);
            }
        }
    }
    this.removeAll(key);
};

CallbacksInvoker.CallbacksHandler = CallbacksHandler;
module.exports = CallbacksInvoker;
