const inputManager = cc.internal.inputManager;

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
        jsb.startAccelerometer(res => {
            if (!this._accelEnabled) {
                return;
            }
            const mAcceleration = this._acceleration;
            mAcceleration.x = res.x;
            mAcceleration.y = res.y;
            mAcceleration.z = res.z;
            mAcceleration.timestamp = res.timestamp;
        });
    },

    _unregisterAccelerometerEvent () {
        this._accelCurTime = 0;
        jsb.stopAccelerometer();
    },
});
