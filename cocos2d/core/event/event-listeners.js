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

var js = cc.js;
var CallbacksHandler = require('../platform/callbacks-invoker').CallbacksHandler;

// Extends CallbacksHandler to handle and invoke event callbacks.
function EventListeners () {
    CallbacksHandler.call(this);
}
js.extend(EventListeners, CallbacksHandler);

EventListeners.prototype.invoke = function (event, captureListeners) {
    var key = event.type;
    var list = this._callbackTable[key];
    if (list) {
        var rootInvoker = !list.isInvoking;
        list.isInvoking = true;

        var callbacks = list.callbacks;
        var targets = list.targets;
        for (var i = 0, len = callbacks.length; i < len; ++i) {
            var callback = callbacks[i];
            if (callback) {
                var target = targets[i] || event.currentTarget;
                callback.call(target, event, captureListeners);
                if (event._propagationImmediateStopped) {
                    break;
                }
            }
        }

        if (rootInvoker) {
            list.isInvoking = false;
            if (list.containCanceled) {
                list.purgeCanceled();
            }
        }
    }
};

module.exports = EventListeners;
if (CC_TEST) {
    cc._Test.EventListeners = EventListeners;
}
