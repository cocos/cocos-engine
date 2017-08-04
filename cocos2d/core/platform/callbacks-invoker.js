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

// Avoid to equal to user set target (null for example)
var REMOVE_PLACEHOLDER = {};
CallbacksHandler.REMOVE_PLACEHOLDER = REMOVE_PLACEHOLDER;

CallbacksHandler.prototype._clearToRemove = function (key) {
    var list = this._callbackTable[key];
    if (this._toRemove[key] && list) {
        // filter all REMOVE_PLACEHOLDER and compact array
        var firstRemovedIndex = list.indexOf(REMOVE_PLACEHOLDER);
        var nextIndex = firstRemovedIndex;
        for (var i = firstRemovedIndex + 1; i < list.length; ++i) {
            var item = list[i];
            if (item !== REMOVE_PLACEHOLDER) {
                list[nextIndex] = item;
                ++nextIndex;
            }
        }
        list.length = nextIndex;
        this._toRemove[key] = false;
    }
    if (this._toRemoveAll) {
        this.removeAll(this._toRemoveAll);
        this._toRemoveAll = null;
    }
};

/**
 * @method add
 * @param {String} key
 * @param {Function} callback
 * @param {Object} [target] - can be null
 * @return {Boolean} whether the key is new
 */
CallbacksHandler.prototype.add = function (key, callback, target) {
    var list = this._callbackTable[key];
    if (typeof list !== 'undefined') {
        if (typeof target === 'object') {
            // append the target after callback
            list.push(callback, target);
        }
        else {
            list.push(callback);
        }
        return false;
    }
    else {
        // new key
        if (typeof target === 'object') {
            // Just append the target after callback
            list = [callback, target];
        }
        else {
            list = [callback];
        }
        this._callbackTable[key] = list;
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
    var list = this._callbackTable[key], callbackTarget, index;
    if (!list) {
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
    // Delay removing
    if (this._invoking[key]) {
        this._toRemoveAll = key;
        return;
    }
    if (typeof key === 'object') {
        var target = key, list, index, callback;
        // loop for all event types
        for (key in this._callbackTable) {
            list = this._callbackTable[key];
            index = list.lastIndexOf(target);
            while (index !== -1) {
                callback = list[index-1];
                if (typeof callback === 'function')
                    list.splice(index-1, 2);
                else
                    list.splice(index, 1);
                index = list.lastIndexOf(target);
            }
        }
    }
    else {
        delete this._callbackTable[key];
        delete this._toRemove[key];
    }
};

/**
 * @method remove
 * @param {String} key
 * @param {Function} callback
 * @param {Object} [target]
 * @return {Boolean} removed
 */
CallbacksHandler.prototype.remove = function (key, callback, target) {
    var list = this._callbackTable[key], index, callbackTarget;
    if (list) {
        index = list.indexOf(callback);
        while (index !== -1) {
            callbackTarget = list[index+1];
            if (typeof callbackTarget !== 'object') {
                callbackTarget = undefined;
            }
            if (callbackTarget === target) {
                // Delay removing
                if (CC_JSB || this._invoking[key]) {
                    list[index] = REMOVE_PLACEHOLDER;
                    callbackTarget && (list[index+1] = REMOVE_PLACEHOLDER);
                    this._toRemove[key] = true;
                }
                else {
                    list.splice(index, callbackTarget ? 2 : 1);
                }
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
    this._invoking[key] = true;
    var list = this._callbackTable[key];
    if (list) {
        var i, endIndex = list.length - 1;
        for (i = 0; i <= endIndex;) {
            var callingFunc = list[i];
            var increment = 1;
            // cheap detection for function
            if (callingFunc !== REMOVE_PLACEHOLDER) {
                var target = list[i + 1];
                var hasTarget = target && typeof target === 'object';
                if (hasTarget) {
                    callingFunc.call(target, p1, p2, p3, p4, p5);
                    increment = 2;
                }
                else {
                    callingFunc(p1, p2, p3, p4, p5);
                }
            }

            i += increment;
        }
    }
    this._invoking[key] = false;

    // Delay removing
    this._clearToRemove(key);
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
    this._invoking[key] = true;
    // this.invoke(key, p1, p2, p3, p4, p5);
    // 这里不直接调用invoke仅仅是为了减少调用堆栈的深度，方便调试
    var list = this._callbackTable[key], i, l, increment, callingFunc, target;
    if (list) {
        for (i = 0, l = list.length; i < l;) {
            callingFunc = list[i];
            increment = 1;
            // cheap detection for function
            if (callingFunc !== REMOVE_PLACEHOLDER) {
                target = list[i+1];
                if (target && typeof target === 'object') {
                    callingFunc.call(target, p1, p2, p3, p4, p5);
                    increment = 2;
                }
                else {
                    callingFunc(p1, p2, p3, p4, p5);
                }
            }

            i += increment;
        }
    }
    this._invoking[key] = false;
    this._toRemove[key] = false;
    this.removeAll(key);
};

/**
 * @method bindKey
 * @param {String} key
 * @param {Boolean} [remove=false] - remove callbacks after invoked
 * @return {Function} the new callback which will invoke all the callbacks binded with the same supplied key
 */
CallbacksInvoker.prototype.bindKey = function (key, remove) {
    var self = this;
    return function bindedInvocation (p1, p2, p3, p4, p5) {
        // this.invoke(key, p1, p2, p3, p4, p5);
        // 这里不直接调用invoke仅仅是为了减少调用堆栈的深度，方便调试
        var list = self._callbackTable[key], i, l, target;
        if (list) {
            for (i = 0, l = list.length; i < l;) {
                target = list[i+1];
                if (target && typeof target === 'object') {
                    list[i].call(target, p1, p2, p3, p4, p5);
                    i += 2;
                }
                else {
                    list[i](p1, p2, p3, p4, p5);
                    ++i;
                }
            }
        }
        if (remove) {
            self.removeAll(key);
        }
    };
};

CallbacksInvoker.CallbacksHandler = CallbacksHandler;
module.exports = CallbacksInvoker;
