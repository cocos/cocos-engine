const Event = require('./Event')

class MouseEvent extends Event {
    constructor(type, initArgs) {
        super(type)
        this._button = initArgs.button;
        this._which = initArgs.which;
        this._wheelDelta = initArgs.wheelDelta;
        this._clientX = initArgs.clientX;
        this._clientY = initArgs.clientY;
        this._screenX = initArgs.screenX;
        this._screenY = initArgs.screenY;
        this._pageX = initArgs.pageX;
        this._pageY = initArgs.pageY;
    }

    get button() {
        return this._button;
    }

    get which() {
        return this._which;
    }

    get wheelDelta() {
        return this._wheelDelta;
    }

    get clientX() {
        return this._clientX;
    }

    get clientY() {
        return this._clientY;
    }

    get screenX() {
        return this._screenX;
    }

    get screenY() {
        return this._screenY;
    }

    get pageX() {
        return this._pageX;
    }

    get pageY() {
        return this._pageY;
    }
}

module.exports = MouseEvent
