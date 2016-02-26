var JS = require('./js');

/**
 * The CallbacksHandler is an abstract class that can register and unregister callbacks by key.
 * Subclasses should implement their own methods about how to invoke the callbacks.
 * @class _CallbacksHandler
 * @constructor
 * @private
 */
var CallbacksHandler = (function () {
    this._callbackTable = {};
});

/**
 * @method add
 * @param {String} key
 * @param {Function} callback - can be null
 * @param {Object} target - can be null
 * @return {Boolean} whether the key is new
 */
CallbacksHandler.prototype.add = function (key, callback, target) {
    var list = this._callbackTable[key];
    if (typeof list !== 'undefined') {
        if (typeof callback === 'function') {
            if (list !== null) {
                list.push(callback);
            }
            else {
                list = [callback];
                this._callbackTable[key] = list;
            }
            // Just append the target after callback
            if (typeof target === 'object') {
                list.push(target);
            }
        }
        return false;
    }
    else {
        // new key
        list = (typeof callback === 'function') ? [callback] : null;
        // Just append the target after callback
        if (list && typeof target === 'object') {
            list.push(target);
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
    var list = this._callbackTable[key], callbackTarget, index;
    if (list && list.length > 0) {
        // callback not given, but key found
        if (!callback) 
            return true;
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
    }
    return false;
};

/**
 * Removes all callbacks registered in a certain event type or all callbacks registered with a certain target
 * @method removeAll
 * @param {String|Object} key - The event key to be removed or the target to be removed
 */
CallbacksHandler.prototype.removeAll = function (key) {
    // Delay removing
    if (this._invoking) {
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
    else 
        delete this._callbackTable[key];
};

/**
 * @method remove
 * @param {String} key
 * @param {Function} callback
 * @param {Object} target
 * @return {Boolean} removed
 */
CallbacksHandler.prototype.remove = function (key, callback, target) {
    var list = this._callbackTable[key], index, callbackTarget;
    if (list) {
        // Delay removing
        if (this._invoking === key) {
            this._toRemove.push([callback, target]);
            return true;
        }

        index = list.indexOf(callback);
        while (index !== -1) {
            callbackTarget = list[index+1];
            if (typeof callbackTarget !== 'object') {
                callbackTarget = undefined;
            }
            if (callbackTarget === target) {
                list.splice(index, callbackTarget ? 2 : 1);
                break;
            }

            index = cc.js.array.indexOf.call(list, callback, index + 1);
        }
        return true;
    }
    return false;
};


/**
 * The callbacks invoker to handle and invoke callbacks by key
 *
 * @class CallbacksInvoker
 * @constructor
 * @extends _CallbacksHandler
 */
var CallbacksInvoker = function () {
    CallbacksHandler.call(this);
    this._invoking = null;
    this._toRemove = [];
    this._toRemoveAll = null;
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
    this._invoking = key;
    var list = this._callbackTable[key], i;
    if (list) {
        var endIndex = list.length - 1;
        for (i = 0; i <= endIndex;) {
            var callingFunc = list[i];
            var target = list[i + 1];
            var hasTarget = target && typeof target === 'object';
            var increment;
            if (hasTarget) {
                list[i].call(target, p1, p2, p3, p4, p5);
                increment = 2;
            }
            else {
                callingFunc(p1, p2, p3, p4, p5);
                increment = 1;
            }

            i += increment;
        }
    }
    this._invoking = null;

    // Delay removing
    for (i = 0; i < this._toRemove.length; ++i) {
        var toRemove = this._toRemove[i];
        this.remove(this._invoking, toRemove[0], toRemove[1]);
    }
    this._toRemove.length = 0;
    if (this._toRemoveAll) {
        this.removeAll(this._toRemoveAll);
        this._toRemoveAll = null;
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
    var list = this._callbackTable[key], i, l, target;
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
