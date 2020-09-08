const Event = require('./Event')

class TouchEvent extends Event {
    constructor(type, touchEventInit) {
        super(type)
        this.touches = []
        this.targetTouches = []
        this.changedTouches = []
    }
}

module.exports = TouchEvent
