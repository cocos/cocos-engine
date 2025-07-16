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
        this._target = null
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
        return this._target
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
