const inputManager = cc.internal.inputManager;
const jsb = window.jsb;

function accelerometerChangeCb (res) {
    let x = res.x;
    let y = res.y;
    if (jsb._isLandscape) {
        let tmp = x;
        x = -y;
        y = tmp;
    }
    
    if (inputManager._acceleration) {
        // NOTE: jsb.onDeviceOrientationChange not supported
        // inputManager._acceleration.x = x * deviceOrientation;
        // inputManager._acceleration.y = y * deviceOrientation;
        inputManager._acceleration.x = x;
        inputManager._acceleration.y = y;
        inputManager._acceleration.z = res.z;
    }
}

Object.assign(inputManager, {
    setAccelerometerEnabled (isEnable) {
        let scheduler = cc.director.getScheduler();
        cc.Scheduler.enableForTarget(this);
        if (isEnable) {
            this._registerAccelerometerEvent();
            scheduler.scheduleUpdate(this);
        }
        else {
            this._unregisterAccelerometerEvent();
            scheduler.unscheduleUpdate(this);
        }
    },

    setAccelerometerInterval (interval) {
        // TODO
    },

    _registerAccelerometerEvent () {
        this._accelCurTime = 0;
        this._acceleration = new cc.internal.Acceleration();
        jsb.onAccelerometerChange(accelerometerChangeCb);
        jsb.startAccelerometer();
    },

    _unregisterAccelerometerEvent () {
        this._accelCurTime = 0;
        jsb.stopAccelerometer();
        jsb.offAccelerometerChange(accelerometerChangeCb);
    },
});
