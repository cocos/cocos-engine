const utils = require('./utils');

window.__globalAdapter = window.__globalAdapter || {};
if (window.__globalAdapter) {
    const globalAdapter = window.__globalAdapter;
    // SystemInfo
    globalAdapter.isSubContext = false;  // sub context not supported
    globalAdapter.isDevTool = my.isIDE;
    utils.cloneMethod(globalAdapter, my, 'getSystemInfoSync');

    // Audio
    globalAdapter.createInnerAudioContext = function () {
        const audio = my.createInnerAudioContext();
        if (my.getSystemInfoSync().platform === 'iOS') {
            let currentTime = 0;
            const originalSeek = audio.seek;
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

            const originalPlay = audio.play;
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

    // TouchEvent
    utils.cloneMethod(globalAdapter, my, 'onTouchStart');
    utils.cloneMethod(globalAdapter, my, 'onTouchMove');
    utils.cloneMethod(globalAdapter, my, 'onTouchEnd');
    utils.cloneMethod(globalAdapter, my, 'onTouchCancel');

    // Audio
    // utils.cloneMethod(globalAdapter, my, 'createInnerAudioContext');

    // AudioInterruption Evnet
    utils.cloneMethod(globalAdapter, my, 'onAudioInterruptionEnd');
    utils.cloneMethod(globalAdapter, my, 'onAudioInterruptionBegin');

    // Video
    utils.cloneMethod(globalAdapter, my, 'createVideo');

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

    // Subpackage
    utils.cloneMethod(globalAdapter, my, 'loadSubpackage');

    // SharedCanvas
    utils.cloneMethod(globalAdapter, my, 'getSharedCanvas');

    // Font
    utils.cloneMethod(globalAdapter, my, 'loadFont');

    // hide show Event
    utils.cloneMethod(globalAdapter, my, 'onShow');
    utils.cloneMethod(globalAdapter, my, 'onHide');

    // onError
    utils.cloneMethod(globalAdapter, my, 'onError');
    // offError
    utils.cloneMethod(globalAdapter, my, 'offError');

    // Font
    globalAdapter.loadFont = function (url) {
        // my.loadFont crash when url is not in user data path
        return 'Arial';
    };

    // Accelerometer
    let accelerometerCallback = null;
    const systemInfo = my.getSystemInfoSync();
    const windowWidth = systemInfo.windowWidth;
    const windowHeight = systemInfo.windowHeight;
    const isLandscape = windowWidth > windowHeight;
    function accelerometerChangeCallback (res, cb) {
        const resClone = {};

        let x = res.x;
        let y = res.y;

        if (isLandscape) {
            const tmp = x;
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
