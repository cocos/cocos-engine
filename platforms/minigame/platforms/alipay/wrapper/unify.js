const utils = require('./utils');

window.__globalAdapter = window.__globalAdapter || {};
if (window.__globalAdapter) {
    let globalAdapter = window.__globalAdapter;
    // SystemInfo
    globalAdapter.isSubContext = false; // sub context not supported
    globalAdapter.isDevTool = window.navigator && (/AlipayIDE/.test(window.navigator.userAgent));
    utils.cloneMethod(globalAdapter, my, 'getSystemInfoSync');

    // TouchEvent
    // my.onTouchStart register touch event listner on body
    // need to register on canvas
    globalAdapter.onTouchStart = function (cb) {
        window.canvas.addEventListener('touchstart', function (res) {
            cb && cb(res);
        });
    };
    globalAdapter.onTouchMove = function (cb) {
        window.canvas.addEventListener('touchmove', function (res) {
            cb && cb(res);
        });
    };
    globalAdapter.onTouchEnd = function (cb) {
        window.canvas.addEventListener('touchend', function (res) {
            cb && cb(res);
        });
    };
    globalAdapter.onTouchCancel = function (cb) {
        window.canvas.addEventListener('touchcancel', function (res) {
            cb && cb(res);
        });
    };

    // Audio
    globalAdapter.createInnerAudioContext = function () {
        let audio = my.createInnerAudioContext();
        audio.onCanplay = audio.onCanPlay.bind(audio);
        audio.offCanplay = audio.offCanPlay.bind(audio);
        return audio;
    };

    // FrameRate
    utils.cloneMethod(globalAdapter, my, 'setPreferredFramesPerSecond');

    // Keyboard
    utils.cloneMethod(globalAdapter, my, 'showKeyboard');
    utils.cloneMethod(globalAdapter, my, 'hideKeyboard');
    utils.cloneMethod(globalAdapter, my, 'updateKeyboard');
    utils.cloneMethod(globalAdapter, my, 'onKeyboardInput');
    utils.cloneMethod(globalAdapter, my, 'onKeyboardConfirm');
    utils.cloneMethod(globalAdapter, my, 'onKeyboardComplete');
    utils.cloneMethod(globalAdapter, my, 'offKeyboardInput');
    utils.cloneMethod(globalAdapter, my, 'offKeyboardConfirm');
    utils.cloneMethod(globalAdapter, my, 'offKeyboardComplete');

    // Message
    utils.cloneMethod(globalAdapter, my, 'getOpenDataContext');
    utils.cloneMethod(globalAdapter, my, 'onMessage');

    // Subpackage not supported
    // utils.cloneMethod(globalAdapter, my, 'loadSubpackage');

    // SharedCanvas
    utils.cloneMethod(globalAdapter, my, 'getSharedCanvas');

    // Font
    utils.cloneMethod(globalAdapter, my, 'loadFont');

    // hide show Event
    utils.cloneMethod(globalAdapter, my, 'onShow');
    utils.cloneMethod(globalAdapter, my, 'onHide');

    // Accelerometer
    let accelerometerCallback = null;
    let systemInfo = my.getSystemInfoSync();
    let windowWidth = systemInfo.windowWidth;
    let windowHeight = systemInfo.windowHeight;
    let isLandscape = windowWidth > windowHeight;

    function accelerometerChangeCallback(res, cb) {
        let resClone = {};

        let x = res.x;
        let y = res.y;

        if (isLandscape) {
            let tmp = x;
            x = -y;
            y = tmp;
        }

        resClone.x = x;
        resClone.y = y;
        resClone.z = res.z;
        accelerometerCallback && accelerometerCallback(resClone);
    }
    Object.assign(globalAdapter, {
        startAccelerometer(cb) {
            accelerometerCallback = cb;
            my.onAccelerometerChange && my.onAccelerometerChange(accelerometerChangeCallback);
        },

        stopAccelerometer() {
            my.offAccelerometerChange && my.offAccelerometerChange(accelerometerChangeCallback);
        },
    });
}