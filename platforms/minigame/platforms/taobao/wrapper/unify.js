const utils = require('./utils');

function handleTouchEvent (event) {
	let changedTouches = event.changedTouches;
	if (changedTouches) {
		for (let touch of changedTouches) {
			touch.clientX = touch.x;
			touch.clientY = touch.y;
		}
	}
}

my.onTouchStart = function (cb) {
    $global._touchstartCB = function (event) {
        handleTouchEvent(event);
        cb(event);
    };
};
my.onTouchCancel = function (cb) {
    $global._touchcancelCB = function (event) {
        handleTouchEvent(event);
        cb(event);
    };
};
my.onTouchEnd = function (cb) {
    $global._touchendCB = function (event) {
        handleTouchEvent(event);
        cb(event);
    };
};
my.onTouchMove = function (cb) {
    $global._touchmoveCB = function (event) {
        handleTouchEvent(event);
        cb(event);
    };
};

my.onShow = function (cb) {
    $global._onShowCB = cb;
};
my.onHide = function (cb) {
    $global._onHideCB = cb;
};

window.__globalAdapter = window.__globalAdapter || {};
if (window.__globalAdapter) {
    let globalAdapter = window.__globalAdapter;
    // SystemInfo
    globalAdapter.isSubContext = false;  // sub context not supported
    globalAdapter.isDevTool = my.isIDE;
    utils.cloneMethod(globalAdapter, my, 'getSystemInfoSync');

    // Audio
    globalAdapter.createInnerAudioContext = function () {
        let audio = my.createInnerAudioContext();
        if (my.getSystemInfoSync().platform === 'iOS') {
            let currentTime = 0;
            let originalSeek = audio.seek;
            audio.seek = function (time) {
                // need to access audio.paused in the next tick
                setTimeout(() => {
                    if (audio.paused) {
                        currentTime = time;
                    } else {
                        originalSeek.call(audio, time);
                    }
                }, 50);
            };

            let originalPlay = audio.play;
            audio.play = function () {
                if (currentTime !== 0) {
                    audio.seek(currentTime);
                    currentTime = 0; // clear cached currentTime
                }
                originalPlay.call(audio);
            };
        }
        return audio;
    };

    // FrameRate
    // utils.cloneMethod(globalAdapter, my, 'setPreferredFramesPerSecond');

    // Keyboard
    globalAdapter.showKeyboard = () => console.warn('showKeyboard not supported.');
    globalAdapter.hideKeyboard = () => console.warn('hideKeyboard not supported.');
    globalAdapter.updateKeyboard = () => console.warn('updateKeyboard not supported.');
    globalAdapter.onKeyboardInput = () => console.warn('onKeyboardInput not supported.');
    globalAdapter.onKeyboardConfirm = () => console.warn('onKeyboardConfirm not supported.');
    globalAdapter.onKeyboardComplete = () => console.warn('onKeyboardComplete not supported.');
    globalAdapter.offKeyboardInput = () => console.warn('offKeyboardInput not supported.');
    globalAdapter.offKeyboardConfirm = () => console.warn('offKeyboardConfirm not supported.');
    globalAdapter.offKeyboardComplete = () => console.warn('offKeyboardComplete not supported.');

    // Message
    utils.cloneMethod(globalAdapter, my, 'getOpenDataContext');
    utils.cloneMethod(globalAdapter, my, 'onMessage');

    // Subpackage not supported
    // utils.cloneMethod(globalAdapter, my, 'loadSubpackage');

    // SharedCanvas
    utils.cloneMethod(globalAdapter, my, 'getSharedCanvas');

    // Font
    globalAdapter.loadFont = function (url) {
        // my.loadFont crash when url is not in user data path
        return "Arial";
    };

    // hide show Event
    utils.cloneMethod(globalAdapter, my, 'onShow');
    utils.cloneMethod(globalAdapter, my, 'onHide');

    // Accelerometer
    let accelerometerCallback = null;
    let systemInfo = my.getSystemInfoSync();
    let windowWidth = systemInfo.windowWidth;
    let windowHeight = systemInfo.windowHeight;
    let isLandscape = windowWidth > windowHeight;
    function accelerometerChangeCallback (res, cb) {
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
        startAccelerometer (cb) {
            accelerometerCallback = cb;
            my.onAccelerometerChange && my.onAccelerometerChange(accelerometerChangeCallback);
        },

        stopAccelerometer () {
            my.offAccelerometerChange && my.offAccelerometerChange(accelerometerChangeCallback);
        },
    });
}