const utils = require('./utils');

window.__globalAdapter = window.__globalAdapter || {};
if (window.__globalAdapter) {
    let globalAdapter = window.__globalAdapter;
    let isLandscape = false;  // getSystemInfoSync not supported in sub context
    // SystemInfo
    if (swan.getSystemInfoSync) {
        let systemInfo = swan.getSystemInfoSync();
        let windowWidth = systemInfo.windowWidth;
        let windowHeight = systemInfo.windowHeight;
        isLandscape = windowWidth > windowHeight;
        globalAdapter.isDevTool = systemInfo.platform === 'devtools';
    }
    else {
        // can't define window in devtool
        let descriptor = Object.getOwnPropertyDescriptor(global, 'window');
        globalAdapter.isDevTool = !(!descriptor || descriptor.configurable === true);

    }
    globalAdapter.isSubContext = (swan.getOpenDataContext === undefined);
    utils.cloneMethod(globalAdapter, swan, 'getSystemInfoSync');

    // TouchEvent
    utils.cloneMethod(globalAdapter, swan, 'onTouchStart');
    utils.cloneMethod(globalAdapter, swan, 'onTouchMove');
    utils.cloneMethod(globalAdapter, swan, 'onTouchEnd');
    utils.cloneMethod(globalAdapter, swan, 'onTouchCancel');

    // Audio
    utils.cloneMethod(globalAdapter, swan, 'createInnerAudioContext');

    // FrameRate
    utils.cloneMethod(globalAdapter, swan, 'setPreferredFramesPerSecond');

    // Keyboard
    utils.cloneMethod(globalAdapter, swan, 'showKeyboard');
    utils.cloneMethod(globalAdapter, swan, 'hideKeyboard');
    utils.cloneMethod(globalAdapter, swan, 'updateKeyboard');
    utils.cloneMethod(globalAdapter, swan, 'onKeyboardInput');
    utils.cloneMethod(globalAdapter, swan, 'onKeyboardConfirm');
    utils.cloneMethod(globalAdapter, swan, 'onKeyboardComplete');
    utils.cloneMethod(globalAdapter, swan, 'offKeyboardInput');
    utils.cloneMethod(globalAdapter, swan, 'offKeyboardConfirm');
    utils.cloneMethod(globalAdapter, swan, 'offKeyboardComplete');

    // Message
    utils.cloneMethod(globalAdapter, swan, 'getOpenDataContext');
    utils.cloneMethod(globalAdapter, swan, 'onMessage');

    // Subpackage
    utils.cloneMethod(globalAdapter, swan, 'loadSubpackage');

    // SharedCanvas
    utils.cloneMethod(globalAdapter, swan, 'getSharedCanvas');

    // Font
    utils.cloneMethod(globalAdapter, swan, 'loadFont');

    // hide show Event
    utils.cloneMethod(globalAdapter, swan, 'onShow');
    utils.cloneMethod(globalAdapter, swan, 'onHide');

    // Accelerometer
    let isAccelerometerInit = false;
    let deviceOrientation = 1;
    if (swan.onDeviceOrientationChange) {
        swan.onDeviceOrientationChange(function (res) {
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
                swan.onAccelerometerChange && swan.onAccelerometerChange(function (res) {
                    let resClone = {};
                    let x = res.x;
                    let y = res.y;
                    if (isLandscape) {
                        let tmp = x;
                        x = -y;
                        y = tmp;
                    }

                    resClone.x = x * deviceOrientation;
                    resClone.y = y * deviceOrientation;
                    resClone.z = res.z;
                    cb && cb(resClone);
                });
            }
            else {
                swan.startAccelerometer && swan.startAccelerometer({
                    fail (err) {
                        console.error('start accelerometer failed', err);
                    },
                    // success () {},
                    // complete () {},
                });
            }
        },

        stopAccelerometer () {
            swan.stopAccelerometer && swan.stopAccelerometer({
                fail (err) {
                    console.error('stop accelerometer failed', err);
                },
                // success () {},
                // complete () {},
            });
        },
    });
}