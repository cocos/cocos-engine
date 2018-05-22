/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
 
var __targetID = 0;
var __listenTouchEventMap = {};
var __listenMouseEventMap = {};

const __touchEventNames = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
const __mouseEventNames = ['mousedown', 'mousemove', 'mouseup', 'mousewheel'];

// Listener types
const CAPTURE = 1
const BUBBLE = 2
const ATTRIBUTE = 3

/**
 * Check whether a given value is an object or not.
 * @param {any} x The value to check.
 * @returns {boolean} `true` if the value is an object.
 */
function isObject(x) {
    return x && typeof x === "object" //eslint-disable-line no-restricted-syntax
}

/**
 * EventTarget.
 * 
 * - This is constructor if no arguments.
 * - This is a function which returns a CustomEventTarget constructor if there are arguments.
 * 
 * For example:
 * 
 *     class A extends EventTarget {}
 */
class EventTarget {
    constructor() {
        this._targetID = ++__targetID;
        this._touchListenerCount = 0;
        this._mouseListenerCount = 0;
        this._listeners = new Map();
    }

    _associateSystemEventListener(eventName) {
        if (__touchEventNames.indexOf(eventName) > -1) {
            if (this._touchListenerCount === 0)
                __listenTouchEventMap[this._targetID] = this;
            ++this._touchListenerCount;
        }
        else if (__mouseEventNames.indexOf(eventName) > -1) {
            if (this._mouseListenerCount === 0)
                __listenMouseEventMap[this._targetID] = this;
            ++this._mouseListenerCount;
        }
    }

    _dissociateSystemEventListener(eventName) {
        if (__touchEventNames.indexOf(eventName) > -1) {
            --this._touchListenerCount;
            if (this._touchListenerCount <= 0)
                delete __listenTouchEventMap[this._targetID];
        }
        else if (__mouseEventNames.indexOf(eventName) > -1) {
            --this._mouseListenerCount;
            if (this._mouseListenerCount <= 0)
                delete __listenMouseEventMap[this._targetID];
        }
    }

    /**
     * Add a given listener to this event target.
     * @param {string} eventName The event name to add.
     * @param {Function} listener The listener to add.
     * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
     * @returns {boolean} `true` if the listener was added actually.
     */
    addEventListener(eventName, listener, options) {
        if (!listener) {
            return false
        }
        if (typeof listener !== "function" && !isObject(listener)) {
            throw new TypeError("'listener' should be a function or an object.")
        }

        const listeners = this._listeners
        const optionsIsObj = isObject(options)
        const capture = optionsIsObj ? Boolean(options.capture) : Boolean(options)
        const listenerType = (capture ? CAPTURE : BUBBLE)
        const newNode = {
            listener,
            listenerType,
            passive: optionsIsObj && Boolean(options.passive),
            once: optionsIsObj && Boolean(options.once),
            next: null,
        }

        // Set it as the first node if the first node is null.
        let node = listeners.get(eventName)
        if (node === undefined) {
            listeners.set(eventName, newNode)
            this._associateSystemEventListener(eventName);
            return true
        }

        // Traverse to the tail while checking duplication..
        let prev = null
        while (node) {
            if (node.listener === listener && node.listenerType === listenerType) {
                // Should ignore duplication.
                return false
            }
            prev = node
            node = node.next
        }

        // Add it.
        prev.next = newNode
        this._associateSystemEventListener(eventName);
        return true
    }

    /**
     * Remove a given listener from this event target.
     * @param {string} eventName The event name to remove.
     * @param {Function} listener The listener to remove.
     * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
     * @returns {boolean} `true` if the listener was removed actually.
     */
    removeEventListener(eventName, listener, options) {
        if (!listener) {
            return false
        }

        const listeners = this._listeners
        const capture = isObject(options) ? Boolean(options.capture) : Boolean(options)
        const listenerType = (capture ? CAPTURE : BUBBLE)

        let prev = null
        let node = listeners.get(eventName)
        while (node) {
            if (node.listener === listener && node.listenerType === listenerType) {
                if (prev) {
                    prev.next = node.next
                }
                else if (node.next) {
                    listeners.set(eventName, node.next)
                }
                else {
                    listeners.delete(eventName)
                }

                this._dissociateSystemEventListener(eventName);

                return true
            }

            prev = node
            node = node.next
        }

        return false
    }

    /**
     * Dispatch a given event.
     * @param {Event|{type:string}} event The event to dispatch.
     * @returns {boolean} `false` if canceled.
     */
    dispatchEvent(event) {
        if (!event || typeof event.type !== "string") {
            throw new TypeError("\"event.type\" should be a string.")
        }

        const eventName = event.type
        var onFunc = this['on' + eventName];
        if (onFunc && typeof onFunc === 'function') {
            event._target = event._currentTarget = this;
            onFunc.call(this, event);
            event._target = event._currentTarget = null
            event._eventPhase = 0
            event._passiveListener = null

            if (event.defaultPrevented)
                return false;
        }

        // If listeners aren't registered, terminate.
        const listeners = this._listeners
        
        let node = listeners.get(eventName)
        if (!node) {
            return true
        }

        event._target = event._currentTarget = this;

        // This doesn't process capturing phase and bubbling phase.
        // This isn't participating in a tree.
        let prev = null
        while (node) {
            // Remove this listener if it's once
            if (node.once) {
                if (prev) {
                    prev.next = node.next
                }
                else if (node.next) {
                    listeners.set(eventName, node.next)
                }
                else {
                    listeners.delete(eventName)
                }
            }
            else {
                prev = node
            }

            // Call this listener
            event._passiveListener = node.passive ? node.listener : null
            if (typeof node.listener === "function") {
                node.listener.call(this, event)
            }

            // Break if `event.stopImmediatePropagation` was called.
            if (event._stopped) {
                break
            }

            node = node.next
        }
        event._target = event._currentTarget = null
        event._eventPhase = 0
        event._passiveListener = null

        return !event.defaultPrevented
    }
}

function touchEventHandlerFactory(type) {
    return (touches) => {
        const touchEvent = new TouchEvent(type)

        touchEvent.touches = touches;
        touchEvent.targetTouches = Array.prototype.slice.call(touchEvent.touches)
        touchEvent.changedTouches = touches;//event.changedTouches
        // touchEvent.timeStamp = event.timeStamp

        var i = 0, touchCount = touches.length;
        var target;
        for (let key in __listenTouchEventMap) {
            target = __listenTouchEventMap[key];
            for (i = 0; i < touchCount; ++i) {
                touches[i].target = target;
            }
            target.dispatchEvent(touchEvent);
        }
    }
}

jsb.onTouchStart = touchEventHandlerFactory('touchstart');
jsb.onTouchMove = touchEventHandlerFactory('touchmove');
jsb.onTouchEnd = touchEventHandlerFactory('touchend');
jsb.onTouchCancel = touchEventHandlerFactory('touchcancel');

function mouseEventHandlerFactory(type) {
    return (event) => {
        const mouseEvent = new MouseEvent(type);
        mouseEvent.wheelDelta = event.wheelDeltaY;
        mouseEvent.clientX = mouseEvent.screenX = event.x;
        mouseEvent.clientY = mouseEvent.screenY = event.y;

        var target;
        for (let key in __listenMouseEventMap) {
            target = __listenMouseEventMap[key];
            target.dispatchEvent(mouseEvent);
        }
    }
}

jsb.onMouseDown = mouseEventHandlerFactory('mousedown');
jsb.onMouseMove = mouseEventHandlerFactory('mousemove');
jsb.onMouseUp = mouseEventHandlerFactory('mouseup');
jsb.onMouseWheel = mouseEventHandlerFactory('mousewheel');

module.exports = EventTarget

