var JS = cc.js;
var CallbacksHandler = require('../platform/callbacks-invoker').CallbacksHandler;

// Extends CallbacksHandler to handle and invoke event callbacks.
function EventListeners () {
    CallbacksHandler.call(this);
    this._invoking = null;
    this._toRemove = [];
    this._toRemoveAll = null;
}
JS.extend(EventListeners, CallbacksHandler);

EventListeners.prototype.invoke = function (event) {
    var key = event.type,
        list = this._callbackTable[key],
        i, endIndex,
        callingFunc, target, hasTarget;
    this._toRemove.length = 0;
    this._invoking = key;

    if (list) {
        if (list.length === 1) {
            list[0].call(event.currentTarget, event);
        }
        else {
            endIndex = list.length - 1;
            for (i = 0; i <= endIndex;) {
                callingFunc = list[i];
                target = list[i+1];
                hasTarget = target && typeof target === 'object';
                var increment;
                if (hasTarget) {
                    callingFunc.call(target, event);
                    increment = 2;
                }
                else {
                    callingFunc.call(event.currentTarget, event);
                    increment = 1;
                }

                if (event._propagationImmediateStopped || i + increment > endIndex) {
                    break;
                }

                i += increment;
            }
        }
    }
    this._invoking = null;

    // Delay removing
    for (i = 0; i < this._toRemove.length; ++i) {
        var toRemove = this._toRemove[i];
        this.remove(key, toRemove[0], toRemove[1]);
    }
    this._toRemove.length = 0;
    if (this._toRemoveAll) {
        this.removeAll(this._toRemoveAll);
        this._toRemoveAll = null;
    }
};

module.exports = EventListeners;
