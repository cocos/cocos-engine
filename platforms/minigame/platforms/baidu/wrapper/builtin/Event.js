/* eslint-disable */
import { noop } from './util/index.js'

export default class Event {
    constructor(type) {

        this.cancelBubble = false
        this.cancelable = false
        this.target = null
        this.currentTarget = null
        this.preventDefault = noop
        this.stopPropagation = noop

        this.type = type
        this.timeStamp = Date.now()
    }
}
