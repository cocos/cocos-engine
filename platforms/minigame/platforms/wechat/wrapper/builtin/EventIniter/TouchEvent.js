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
    if (typeof getApp === 'function') {
      // for wechat miniprogram
      GameGlobal.document.dispatchEvent(touchEvent)
    } else {
      // for wechat minigame
      document.dispatchEvent(touchEvent)
    }
  }
}

wx.onTouchStart(touchEventHandlerFactory('touchstart'))
wx.onTouchMove(touchEventHandlerFactory('touchmove'))
wx.onTouchEnd(touchEventHandlerFactory('touchend'))
wx.onTouchCancel(touchEventHandlerFactory('touchcancel'))
