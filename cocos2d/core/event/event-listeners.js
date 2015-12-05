var JS = cc.js;
var CallbacksHandler = require('../platform/callbacks-invoker').CallbacksHandler;

// Extends CallbacksHandler to handle and invoke event callbacks.
function EventListeners () {
    CallbacksHandler.call(this);
}
JS.extend(EventListeners, CallbacksHandler);

EventListeners.prototype.invoke = function (event) {
    var list = this._callbackTable[event.type], 
        i, endIndex, offset, valid,
        callingFunc, target, hasTarget;
    if (list && list.length > 0) {
        if (list.length === 1) {
            list[0].call(event.currentTarget, event);
            return;
        }
        endIndex = list.length - 1;
        for (i = 0; i <= endIndex;) {
            callingFunc = list[i];
            target = list[i+1];
            if (target && typeof target === 'object') {
                hasTarget = true;
                callingFunc.call(target, event);
            }
            else {
                hasTarget = false;
                callingFunc.call(event.currentTarget, event);
            }
            if (event._propagationImmediateStopped || i === endIndex) {
                break;
            }
            // 为了不每次触发消息时都创建一份回调数组的拷贝，这里需要对消息的反注册做检查和限制
            // check last one to see if any one removed
            offset = endIndex - (list.length-1);
            valid = true;
            if (offset <= 2) {                  // 只删一个item
                if (list[i] !== callingFunc) {  // 如果删了后面的回调，索引不变
                    i -= offset;
                }
                endIndex -= offset;
            }
            else if (offset !== 0) {
                // 只允许在一个回调里面移除一个回调。如果要移除很多，只能用 event.stopPropagationImmediate()
                cc.error('Call event.stopPropagationImmediate() when you remove more than one callbacks in a event callback.');
                return;
            }
            // Increment i
            hasTarget ? i += 2 : ++i;
        }
    }
};

module.exports = EventListeners;
