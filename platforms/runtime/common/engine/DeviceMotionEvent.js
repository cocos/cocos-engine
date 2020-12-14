const inputManager = cc.internal.inputManager;
const jsb = window.jsb;

Object.assign(inputManager, {
    setAccelerometerEnabled (isEnable) {
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
    },

    setAccelerometerInterval (interval) {
        // TODO
    },

    _registerAccelerometerEvent () {
        this._accelCurTime = 0;
        let self = this;
        this._acceleration = new cc.internal.Acceleration();
        jsb.startAccelerometer(function (res) {
            self._acceleration.x = res.x;
            self._acceleration.y = res.y;
            self._acceleration.z = res.y;
        });
    },

    _unregisterAccelerometerEvent () {
        this._accelCurTime = 0;
        jsb.stopAccelerometer();
    },
});
