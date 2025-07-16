const utils = require('./utils');

window.__globalAdapter = window.__globalAdapter || {};
if (window.__globalAdapter) {
    let globalAdapter = window.__globalAdapter;
    // SystemInfo
    globalAdapter.isSubContext = false;  // sub context not supported
    globalAdapter.isDevTool = false;
    utils.cloneMethod(globalAdapter, qg, 'getSystemInfoSync');

    // TouchEvent
    globalAdapter.onTouchStart = function (cb) {
        window.canvas.ontouchstart = cb;
    };
    globalAdapter.onTouchMove = function (cb) {
        window.canvas.ontouchmove = cb;
    };
    globalAdapter.onTouchEnd = function (cb) {
        window.canvas.ontouchend = cb;
    };
    globalAdapter.onTouchCancel = function (cb) {
        window.canvas.ontouchcancel = cb;
    };

    // Audio
    utils.cloneMethod(globalAdapter, qg, 'createInnerAudioContext');

    // FrameRate
    utils.cloneMethod(globalAdapter, qg, 'setPreferredFramesPerSecond');

    // Keyboard
    globalAdapter.showKeyboard = function (res) {
        res.confirmHold = true;  // HACK: confirmHold not working on Xiaomi platform
        qg.showKeyboard(res);
    };
    utils.cloneMethod(globalAdapter, qg, 'hideKeyboard');
    utils.cloneMethod(globalAdapter, qg, 'updateKeyboard');
    utils.cloneMethod(globalAdapter, qg, 'onKeyboardInput');
    utils.cloneMethod(globalAdapter, qg, 'onKeyboardConfirm');
    utils.cloneMethod(globalAdapter, qg, 'onKeyboardComplete');
    utils.cloneMethod(globalAdapter, qg, 'offKeyboardInput');
    utils.cloneMethod(globalAdapter, qg, 'offKeyboardConfirm');
    utils.cloneMethod(globalAdapter, qg, 'offKeyboardComplete');

    // Message
    utils.cloneMethod(globalAdapter, qg, 'getOpenDataContext');
    utils.cloneMethod(globalAdapter, qg, 'onMessage');

    // Subpackage
    utils.cloneMethod(globalAdapter, qg, 'loadSubpackage');

    // SharedCanvas
    utils.cloneMethod(globalAdapter, qg, 'getSharedCanvas');

    // Font
    utils.cloneMethod(globalAdapter, qg, 'loadFont');

    // hide show Event
    utils.cloneMethod(globalAdapter, qg, 'onShow');
    utils.cloneMethod(globalAdapter, qg, 'onHide');

    // Accelerometer
    // NOTE: There is no LANDSCAPE_LEFT on Xiaomi platform
    // const LANDSCAPE_LEFT = -90;
    const LANDSCAPE_RIGHT = 90;
    // NOTE: the data in callback registered on onAccelerometerChange is 10 times than the standard data
    // Need to be scaled by 0.1
    const accelerometerFactor = -0.1;
    let isAccelerometerInit = false;
    let deviceOrientation = 1;
    let isLandscape = window.orientation === LANDSCAPE_RIGHT;
    if (qg.onDeviceOrientationChange) {
        qg.onDeviceOrientationChange(function (res) {
            if (res.value === 'landscape') {
            deviceOrientation = 1;
            }
            else if (res.value === 'landscapeReverse') {
            deviceOrientation = -1;
            }
        });
    }
    Object.assign(globalAdapter, {
        startAccelerometer (cb) {
            if (!isAccelerometerInit) {
                isAccelerometerInit = true;
                qg.onAccelerometerChange && qg.onAccelerometerChange(function (res) {
                    let resClone = {};
                    let x = res.x;
                    let y = res.y;
                    if (isLandscape) {
                        let tmp = x;
                        x = -y;
                        y = tmp;
                    }
                    
                    resClone.x = x * accelerometerFactor;
                    resClone.y = y * accelerometerFactor;
                    resClone.z = res.z;
                    cb && cb(resClone);
                });
            }
            else {
                qg.startAccelerometer && qg.startAccelerometer({
                    fail (err) {
                        console.error('start accelerometer failed', err);
                    },
                    // success () {},
                    // complete () {},
                });
            }
        },

        stopAccelerometer () {
            qg.stopAccelerometer && qg.stopAccelerometer({
                fail (err) {
                    console.error('stop accelerometer failed', err);
                },
                // success () {},
                // complete () {},
            });
        },
    });
}