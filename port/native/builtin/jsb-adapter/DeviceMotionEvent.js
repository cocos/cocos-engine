const Event = require('./Event')

class DeviceMotionEvent extends Event {
    constructor(initArgs) {
        super('devicemotion');
        if (initArgs) {
            this._acceleration = initArgs.acceleration ? initArgs.acceleration : {x: 0, y: 0, z: 0};
            this._accelerationIncludingGravity = initArgs.accelerationIncludingGravity ? initArgs.accelerationIncludingGravity : {x: 0, y: 0, z: 0};
            this._rotationRate = initArgs.rotationRate ? initArgs.rotationRate : {alpha: 0, beta: 0, gamma: 0};
            this._interval = initArgs.interval;
        }
        else {
            this._acceleration = {x: 0, y: 0, z: 0};
            this._accelerationIncludingGravity = {x: 0, y: 0, z: 0};
            this._rotationRate = {alpha: 0, beta: 0, gamma: 0};
            this._interval = 0;
        }
    }

    get acceleration() {
        return this._acceleration;
    }

    get accelerationIncludingGravity() {
        return this._accelerationIncludingGravity;
    }

    get rotationRate() {
        return this._rotationRate;
    }

    get interval() {
        return this._interval;
    }
}

module.exports = DeviceMotionEvent;
