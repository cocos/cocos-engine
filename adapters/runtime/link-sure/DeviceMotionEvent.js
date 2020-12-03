const inputManager = cc.internal.inputManager;

const PORTRAIT = 0;
const LANDSCAPE_LEFT = -90;
const PORTRAIT_UPSIDE_DOWN = 180;
const LANDSCAPE_RIGHT = 90;

let _didAccelerateFun;

Object.assign(inputManager, {
    setAccelerometerEnabled (isEnable) {
        if (this._accelEnabled === isEnable) {
            return;
        }
        let scheduler = cc.director.getScheduler();
        scheduler.enableForTarget(this);
        if (isEnable) {
            this._registerAccelerometerEvent();
            scheduler.scheduleUpdate(this);
        }
        else {
            this._unregisterAccelerometerEvent();
            scheduler.unscheduleUpdate(this);
        }
        this._accelEnabled = isEnable;
        jsb.device.setMotionEnabled(isEnable);
    },

    setAccelerometerInterval (interval) {
        if (this._accelInterval === interval) {
            return;
        }
        this._accelInterval = interval;
        if (jsb.device && jsb.device.setMotionInterval) {
            jsb.device.setMotionInterval(interval);
        }        
    },

    _registerAccelerometerEvent () {
        this._accelCurTime = 0;
        this._acceleration = new cc.internal.Acceleration();
        _didAccelerateFun = event => {
            if (!this._accelEnabled) {
                return;
            }
    
            const mAcceleration = this._acceleration;
            const eventAcceleration = event.accelerationIncludingGravity;
            let x = this._accelMinus * (eventAcceleration.x || 0) * 0.1;
            let y = this._accelMinus * (eventAcceleration.y || 0) * 0.1;
            let z = (eventAcceleration.z || 0) * 0.1;
    
            const tmpX = x;
            if (window.orientation === LANDSCAPE_RIGHT) {
                x = y;
                y = -tmpX;
            }
            else if (window.orientation === LANDSCAPE_LEFT) {
                x = -y;
                y = tmpX;
            }
            else if (window.orientation === PORTRAIT) {
                x = -x;
                y = -y;
            }
            mAcceleration.x = x;
            mAcceleration.y = y;
            mAcceleration.z = z;
            mAcceleration.timestamp = event.timeStamp || Date.now();
        };
        window.addEventListener('devicemotion', _didAccelerateFun, false);
    },

    _unregisterAccelerometerEvent () {
        this._accelCurTime = 0;
        window.removeEventListener('devicemotion', _didAccelerateFun, false);
    },
});
