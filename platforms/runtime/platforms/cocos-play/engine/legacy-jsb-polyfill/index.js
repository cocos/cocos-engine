// fsUtils
require('./fs-utils');

// sys
let sysInfo = jsb.getSystemInfoSync();
jsb.platform = sysInfo.platform;
jsb.model = sysInfo.model;
jsb.system = sysInfo.system;
jsb.height = sysInfo.windowHeight;
jsb.width = sysInfo.windowWidth;
jsb.language = sysInfo.language;
jsb.pixelRatio = sysInfo.pixelRatio;

// createCanvas
let originalCreateCanvas = jsb.createCanvas.bind(jsb);
jsb.createCanvas = function () {
    let canvas = originalCreateCanvas();
    canvas.style = {};
    return canvas;
};

// accelerometer
// KNOW_ISSUE: on COCOS_PLAY, systemInfo can't provide with accurate screenWidth or screenHeight
// so we need to read game config to access the screen orientation
let fs = jsb.getFileSystemManager();
let gameConfig = JSON.parse(fs.readFileSync('./game.config.json', 'utf8'));
let isLandscape = gameConfig.deviceOrientation === 'landscape';
let originalStartAccelerometer = jsb.startAccelerometer.bind(jsb);
let originalStopAccelerometer = jsb.stopAccelerometer.bind(jsb);
Object.assign(jsb, {
    startAccelerometer (cb) {
        jsb.onAccelerometerChange(function (event) {
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
        });
        originalStartAccelerometer({
            fail (err) {
                console.error('start accelerometer failed', err);
            },
            // success () {},
            // complete () {},
        });
    },

    stopAccelerometer () {
        jsb.offAccelerometerChange();
        originalStopAccelerometer({
            fail (err) {
                console.error('stop accelerometer failed', err);
            },
            // success () {},
            // complete () {},
        });
    },
});