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

var JS = cc.js;
var CallbacksHandler = require('../platform/callbacks-invoker').CallbacksHandler;

var REMOVE_PLACEHOLDER = CallbacksHandler.REMOVE_PLACEHOLDER;

// Extends CallbacksHandler to handle and invoke event callbacks.
function EventListeners () {
    CallbacksHandler.call(this);
}
JS.extend(EventListeners, CallbacksHandler);

EventListeners.prototype.invoke = function (event, captureListeners) {
    var key = event.type,
        list = this._callbackTable[key],
        i, endIndex,
        callingFunc, target, hasTarget;

    this._invoking[key] = true;

    if (list) {
        if (list.length === 1) {
            callingFunc = list[0];
            if (callingFunc !== REMOVE_PLACEHOLDER) {
                callingFunc.call(event.currentTarget, event, captureListeners);
            }
        }
        else {
            endIndex = list.length - 1;
            for (i = 0; i <= endIndex;) {
                callingFunc = list[i];
                var increment = 1;
                // cheap detection for function
                if (callingFunc !== REMOVE_PLACEHOLDER) {
                    target = list[i+1];
                    hasTarget = target && typeof target === 'object';
                    if (hasTarget) {
                        callingFunc.call(target, event, captureListeners);
                        increment = 2;
                    }
                    else {
                        callingFunc.call(event.currentTarget, event, captureListeners);
                    }

                    if (event._propagationImmediateStopped || i + increment > endIndex) {
                        break;
                    }
                }

                i += increment;
            }
        }
    }
    this._invoking[key] = false;

    // Delay removing
    this._clearToRemove(key);
};

module.exports = EventListeners;
if (CC_TEST) {
    cc._Test.EventListeners = EventListeners;
}
