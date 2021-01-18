/*
 * this platform doesn't provide with the onAccelerometerChange API
 * so we turn to using this HACK but native implementation
*/

window.jsb = window.jsb || {};

// KNOW_ISSUE: on COCOS_PLAY, systemInfo can't provide with accurate screenWidth or screenHeight
// so we need to read game config to access the screen orientation
let _rt = loadRuntime();
let fs = _rt.getFileSystemManager();
let gameConfig = JSON.parse(fs.readFileSync('./game.config.json', 'utf8'));
let isLandscape = gameConfig.deviceOrientation === 'landscape';

// const PORTRAIT = 0;
// const LANDSCAPE_LEFT = -90;
// const PORTRAIT_UPSIDE_DOWN = 180;
// const LANDSCAPE_RIGHT = 90;
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
        
            // KNOWN_ISSUE: don't know LANDSCAPE_RIGHT or LANDSCAPE_LEFT
            // here isLandscape means isLandscapeRight
            if (isLandscape) {
                const tmpX = x;
                x = y;
                y = -tmpX;
            }
            else {
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