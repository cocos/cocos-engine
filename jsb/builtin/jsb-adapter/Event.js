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
 
/**
 * @see https://dom.spec.whatwg.org/#interface-event
 * @private
 */
/**
 * The event wrapper.
 * @constructor
 * @param {EventTarget} eventTarget The event target of this dispatching.
 * @param {Event|{type:string}} event The original event to wrap.
 */
class Event {

    constructor(type, eventInit) {
        this._type = type
        this._eventTarget = null
        this._eventPhase = 2
        this._currentTarget = null
        this._canceled = false
        this._stopped = false  // The flag to stop propagation immediately.
        this._passiveListener = null
        this._timeStamp = Date.now()
    }

    /**
     * The type of this event.
     * @type {string}
     */
    get type() {
        return this._type
    }

    /**
     * The target of this event.
     * @type {EventTarget}
     */
    get target() {
        return this._eventTarget
    }

    /**
     * The target of this event.
     * @type {EventTarget}
     */
    get currentTarget() {
        return this._currentTarget
    }

    get isTrusted() {
        // https://heycam.github.io/webidl/#Unforgeable
        return false
    }

    get timeStamp() {
        return this._timeStamp
    }

    /**
     * @returns {EventTarget[]} The composed path of this event.
     */
    composedPath() {
        const currentTarget = this._currentTarget
        if (currentTarget === null) {
            return []
        }
        return [currentTarget]
    }

    /**
     * The target of this event.
     * @type {number}
     */
    get eventPhase() {
        return this._eventPhase
    }

    /**
     * Stop event bubbling.
     * @returns {void}
     */
    stopPropagation() {

    }

    /**
     * Stop event bubbling.
     * @returns {void}
     */
    stopImmediatePropagation() {
        this._stopped = true
    }

    /**
     * The flag to be bubbling.
     * @type {boolean}
     */
    get bubbles() {
        return false
    }

    /**
     * The flag to be cancelable.
     * @type {boolean}
     */
    get cancelable() {
        return true
    }

    /**
     * Cancel this event.
     * @returns {void}
     */
    preventDefault() {
        if (this._passiveListener !== null) {
            console.warn("Event#preventDefault() was called from a passive listener:", this._passiveListener)
            return
        }
        if (!this.cancelable) {
            return
        }

        this._canceled = true
    }

    /**
     * The flag to indicate cancellation state.
     * @type {boolean}
     */
    get defaultPrevented() {
        return this._canceled
    }

    /**
     * The flag to be composed.
     * @type {boolean}
     */
    get composed() {
        return false
    }

    /**
     * The unix time of this event.
     * @type {number}
     */
    get timeStamp() {
        return this._timeStamp
    }
}

/**
 * Constant of NONE.
 * @type {number}
 */
Event.NONE = 0

/**
 * Constant of CAPTURING_PHASE.
 * @type {number}
 */
Event.CAPTURING_PHASE = 1

/**
 * Constant of AT_TARGET.
 * @type {number}
 */
Event.AT_TARGET = 2

/**
 * Constant of BUBBLING_PHASE.
 * @type {number}
 */
Event.BUBBLING_PHASE = 3


module.exports = Event
