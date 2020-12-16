/* eslint-disable */
import { noop } from '../util/index.js'
import Event from '../Event'

export default class TouchEvent extends Event {

    constructor(type) {
        super(type)

        this.touches = []
        this.targetTouches = []
        this.changedTouches = []

        this.target = window.canvas
        this.currentTarget = window.canvas
    }
}

function eventHandlerFactory(type) {
    return (rawEvent) => {
        const event = new TouchEvent(type)

        event.changedTouches = rawEvent.changedTouches
        event.touches = rawEvent.touches
        event.targetTouches = Array.prototype.slice.call(rawEvent.touches)
        event.timeStamp = rawEvent.timeStamp

        document.dispatchEvent(event)
    }
}
if (swan.onTouchStart) {
    swan.onTouchStart(eventHandlerFactory('touchstart'))
    swan.onTouchMove(eventHandlerFactory('touchmove'))
    swan.onTouchEnd(eventHandlerFactory('touchend'))
    swan.onTouchCancel(eventHandlerFactory('touchcancel'))
}
