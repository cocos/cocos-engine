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
function EventTarget() {
    this._listeners = new Map();
}

// Should be enumerable, but class methods are not enumerable.
EventTarget.prototype = {
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
        return true
    },

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
                return true
            }

            prev = node
            node = node.next
        }

        return false
    },

    /**
     * Dispatch a given event.
     * @param {Event|{type:string}} event The event to dispatch.
     * @returns {boolean} `false` if canceled.
     */
    dispatchEvent(event) {
        if (!event || typeof event.type !== "string") {
            throw new TypeError("\"event.type\" should be a string.")
        }

        // If listeners aren't registered, terminate.
        const listeners = this._listeners
        const eventName = event.type
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
            else if (node.listenerType !== ATTRIBUTE && typeof node.listener.handleEvent === "function") {
                node.listener.handleEvent(event)
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
    },
}

// `constructor` is not enumerable.
Object.defineProperty(EventTarget.prototype, "constructor", { value: EventTarget, configurable: true, writable: true })

// Ensure `eventTarget instanceof window.EventTarget` is `true`.
if (typeof window !== "undefined" && typeof window.EventTarget !== "undefined") {
    Object.setPrototypeOf(EventTarget.prototype, window.EventTarget.prototype)
}

// export { defineEventAttribute, EventTarget }
// export default EventTarget
module.exports = EventTarget

