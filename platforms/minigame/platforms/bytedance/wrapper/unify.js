const utils = require('./utils');

window.__globalAdapter = window.__globalAdapter || {};
if (window.__globalAdapter) {
    let globalAdapter = window.__globalAdapter;
    // SystemInfo
    let systemInfo = tt.getSystemInfoSync();
    let windowWidth = systemInfo.windowWidth;
    let windowHeight = systemInfo.windowHeight;
    let isLandscape = windowWidth > windowHeight;
    globalAdapter.isSubContext = (tt.getOpenDataContext === undefined);
    globalAdapter.isDevTool = (systemInfo.platform === 'devtools');
    utils.cloneMethod(globalAdapter, tt, 'getSystemInfoSync');

    // TouchEvent
    utils.cloneMethod(globalAdapter, tt, 'onTouchStart');
    utils.cloneMethod(globalAdapter, tt, 'onTouchMove');
    utils.cloneMethod(globalAdapter, tt, 'onTouchEnd');
    utils.cloneMethod(globalAdapter, tt, 'onTouchCancel');

    // Audio
    utils.cloneMethod(globalAdapter, tt, 'createInnerAudioContext');

    // Video
    utils.cloneMethod(globalAdapter, tt, 'createVideo');

    // FrameRate
    utils.cloneMethod(globalAdapter, tt, 'setPreferredFramesPerSecond');

    // Keyboard
    utils.cloneMethod(globalAdapter, tt, 'showKeyboard');
    utils.cloneMethod(globalAdapter, tt, 'hideKeyboard');
    utils.cloneMethod(globalAdapter, tt, 'updateKeyboard');
    utils.cloneMethod(globalAdapter, tt, 'onKeyboardInput');
    utils.cloneMethod(globalAdapter, tt, 'onKeyboardConfirm');
    utils.cloneMethod(globalAdapter, tt, 'onKeyboardComplete');
    utils.cloneMethod(globalAdapter, tt, 'offKeyboardInput');
    utils.cloneMethod(globalAdapter, tt, 'offKeyboardConfirm');
    utils.cloneMethod(globalAdapter, tt, 'offKeyboardComplete');

    // Message
    utils.cloneMethod(globalAdapter, tt, 'getOpenDataContext');
    utils.cloneMethod(globalAdapter, tt, 'onMessage');

    // Subpackage not supported
    // utils.cloneMethod(globalAdapter, tt, 'loadSubpackage');

    // SharedCanvas
    utils.cloneMethod(globalAdapter, tt, 'getSharedCanvas');

    // Font
    utils.cloneMethod(globalAdapter, tt, 'loadFont');

    // hide show Event
    utils.cloneMethod(globalAdapter, tt, 'onShow');
    utils.cloneMethod(globalAdapter, tt, 'onHide');

    // onError
    utils.cloneMethod(globalAdapter, tt, 'onError');
    // offError
    utils.cloneMethod(globalAdapter, tt, 'offError');

    // Accelerometer
    let isAccelerometerInit = false;
    let deviceOrientation = 1;
    if (tt.onDeviceOrientationChange) {
        tt.onDeviceOrientationChange(function (res) {
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
                tt.onAccelerometerChange && tt.onAccelerometerChange(function (res) {
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
                tt.startAccelerometer && tt.startAccelerometer({
                    fail (err) {
                        console.error('start accelerometer failed', err);
                    },
                    // success () {},
                    // complete () {},
                });
            }
        },

        stopAccelerometer () {
            tt.stopAccelerometer && tt.stopAccelerometer({
                fail (err) {
                    console.error('stop accelerometer failed', err);
                },
                // success () {},
                // complete () {},
            });
        },
    });
}