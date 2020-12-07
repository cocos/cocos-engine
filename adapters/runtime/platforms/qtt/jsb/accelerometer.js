window.jsb = window.jsb || {};

const PORTRAIT = 0;
const LANDSCAPE_LEFT = -90;
const PORTRAIT_UPSIDE_DOWN = 180;
const LANDSCAPE_RIGHT = 90;
let _didAccelerateFun;

// API for event listner is overwritten on DOM-adapter
let nativeAddEventListener = window.addEventListener.bind(window);
let nativeRemoveEventListener = window.removeEventListener.bind(window);

Object.assign(jsb, {
    startAccelerometer (cb) {
        if (_didAccelerateFun) {
            return;
        }
        _didAccelerateFun = (event) => {
            const eventAcceleration = event.accelerationIncludingGravity;
            let x = (eventAcceleration.x || 0) * 0.1;
            let y = (eventAcceleration.y || 0) * 0.1;
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
        
            let res =  {};
            res.x = x;
            res.y = y;
            res.z = z;
            res.timestamp = event.timeStamp || Date.now();
            cb && cb(res);
        };
        nativeAddEventListener('devicemotion', _didAccelerateFun, false);
        jsb.device.setMotionEnabled(true);
    },

    stopAccelerometer (cb) {
        if (!_didAccelerateFun) {
            return;
        }
        nativeRemoveEventListener('devicemotion', _didAccelerateFun, false);
        _didAccelerateFun = undefined;
        jsb.device.setMotionEnabled(false);
        cb && cb();
    },

    setAccelerometerInterval (interval) {
        jsb.device.setMotionInterval(interval);
    },
});