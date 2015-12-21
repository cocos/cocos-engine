var JS = cc.js;
var CallbacksHandler = require('../platform/callbacks-invoker').CallbacksHandler;

// Extends CallbacksHandler to handle and invoke event callbacks.
function EventListeners () {
    CallbacksHandler.call(this);
}
JS.extend(EventListeners, CallbacksHandler);

EventListeners.prototype.invoke = function (event) {
    var list = this._callbackTable[event.type],
        i, endIndex, lastItem,
        callingFunc, target, hasTarget;
    if (list) {
        if (list.length === 1) {
            list[0].call(event.currentTarget, event);
            return;
        }
        endIndex = list.length - 1;
        lastItem = list[endIndex];
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
            // 为了不每次触发消息时都创建一份回调数组的拷贝，这里需要对消息的反注册做检查和限制
            // check last one to see if any one removed
            if (list[endIndex] !== lastItem) {          // 如果变短
                if (list[endIndex - 1] === lastItem) {
                    // 只支持删一个
                    endIndex -= 1;
                }
                else if (list[endIndex - 2] === lastItem) {
                    // 只支持删一个 + target
                    endIndex -= 2;
                }
                else {
                    // 只允许在一个回调里面移除一个回调。如果要移除很多，只能用 event.stopPropagationImmediate()
                    return cc.error('Call event.stopPropagationImmediate() when you remove more than one callbacks in a event callback.');
                }
                if (list[i] !== callingFunc) {      // 如果删了前面的回调，索引不加
                    continue;
                }
            }

            i += increment;
        }
    }
};

module.exports = EventListeners;
