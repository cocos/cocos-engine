import { noop } from '../util/index.js'

export default class TouchEvent {
  touches = []
  targetTouches = []
  changedTouches = []
  preventDefault = noop
  stopPropagation = noop

  constructor(type) {
    this.type = type
    this.target = window.canvas
    this.currentTarget = window.canvas
  }
}

function touchEventHandlerFactory(type) {
  return (event) => {
    const touchEvent = new TouchEvent(type)

    touchEvent.touches = event.touches
    touchEvent.targetTouches = Array.prototype.slice.call(event.touches)
    touchEvent.changedTouches = event.changedTouches
    touchEvent.timeStamp = event.timeStamp
    document.dispatchEvent(touchEvent)
  }
}

tt.onTouchStart(touchEventHandlerFactory('touchstart'))
tt.onTouchMove(touchEventHandlerFactory('touchmove'))
tt.onTouchEnd(touchEventHandlerFactory('touchend'))
tt.onTouchCancel(touchEventHandlerFactory('touchcancel'))
