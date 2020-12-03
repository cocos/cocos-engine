import {noop} from './util'

export default class Event {
  cancelBubble = false
  cancelable = false
  target = null
  timestampe = Date.now()
  preventDefault = noop
  stopPropagation = noop

  constructor(type) {
    this.type = type
  }
}
