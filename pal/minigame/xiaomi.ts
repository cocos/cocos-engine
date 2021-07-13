import { IMiniGame } from 'pal/minigame';
import { Orientation } from '../screen-adapter/enum-type';
import { cloneObject, createInnerAudioContextPolyfill } from '../utils';

declare let qg: any;

// @ts-expect-error can't init minigame when it's declared
const minigame: IMiniGame = {};
cloneObject(minigame, qg);

// #region SystemInfo
const systemInfo = minigame.getSystemInfoSync();
minigame.isDevTool = false;

minigame.isLandscape = systemInfo.screenWidth > systemInfo.screenHeight;
// init landscapeOrientation as LANDSCAPE_RIGHT
const landscapeOrientation = Orientation.LANDSCAPE_RIGHT;
// NOTE: onDeviceOrientationChange is not supported on this platform
// qg.onDeviceOrientationChange((res) => {
//     if (res.value === 'landscape') {
//         landscapeOrientation = Orientation.LANDSCAPE_RIGHT;
//     } else if (res.value === 'landscapeReverse') {
//         landscapeOrientation = Orientation.LANDSCAPE_LEFT;
//     }
// });
Object.defineProperty(minigame, 'orientation', {
    get () {
        return minigame.isLandscape ? landscapeOrientation : Orientation.PORTRAIT;
    },
});
// #endregion SystemInfo

// #region TouchEvent
minigame.onTouchStart = function (cb) {
    window.canvas.ontouchstart = cb;
};
minigame.onTouchMove = function (cb) {
    window.canvas.ontouchmove = cb;
};
minigame.onTouchEnd = function (cb) {
    window.canvas.ontouchend = cb;
};
minigame.onTouchCancel = function (cb) {
    window.canvas.ontouchcancel = cb;
};
// #endregion TouchEvent

// // Keyboard
// globalAdapter.showKeyboard = function (res) {
//     res.confirmHold = true;  // HACK: confirmHold not working on Xiaomi platform
//     qg.showKeyboard(res);
// };

// #region Accelerometer
let _customAccelerometerCb: AccelerometerChangeCallback | undefined;
let _innerAccelerometerCb: AccelerometerChangeCallback | undefined;
minigame.onAccelerometerChange = function (cb: AccelerometerChangeCallback) {
    // qg.offAccelerometerChange() is not supported.
    // so we can only register AccelerometerChange callback, but can't unregister.
    if (!_innerAccelerometerCb) {
        _innerAccelerometerCb = (res: any) => {
            let x = res.x;
            let y = res.y;
            if (minigame.isLandscape) {
                const orientationFactor = (landscapeOrientation === Orientation.LANDSCAPE_RIGHT ? 1 : -1);
                const tmp = x;
                x = -y * orientationFactor;
                y = tmp * orientationFactor;
            }

            const standardFactor = -0.1;
            x *= standardFactor;
            y *= standardFactor;
            const resClone = {
                x,
                y,
                z: res.z,
            };
            _customAccelerometerCb?.(resClone);
        };
        qg.onAccelerometerChange(_innerAccelerometerCb);
    }
    _customAccelerometerCb = cb;
};
minigame.offAccelerometerChange = function (cb?: AccelerometerChangeCallback) {
    // qg.offAccelerometerChange() is not supported.
    _customAccelerometerCb = undefined;
};
// #endregion Accelerometer

// #region InnerAudioContext
minigame.createInnerAudioContext = createInnerAudioContextPolyfill(qg, {
    onPlay: true,
    onPause: true,
    onStop: true,
    onSeek: false,
});
const originalCreateInnerAudioContext = minigame.createInnerAudioContext;
minigame.createInnerAudioContext = function () {
    const audioContext = originalCreateInnerAudioContext.call(minigame);
    const originalStop = audioContext.stop;
    Object.defineProperty(audioContext, 'stop', {
        configurable: true,
        value () {
            // NOTE: stop won't seek to 0 when audio is paused on Xiaomi platform.
            audioContext.seek(0);
            originalStop.call(audioContext);
        },
    });
    return audioContext;
};
// #endregion InnerAudioContext

// #region SafeArea
minigame.getSafeArea = function () {
    console.warn('getSafeArea is not supported on this platform');
    const systemInfo =  minigame.getSystemInfoSync();
    return {
        top: 0,
        left: 0,
        bottom: systemInfo.screenHeight,
        right: systemInfo.screenWidth,
        width: systemInfo.screenWidth,
        height: systemInfo.screenHeight,
    };
};
// #endregion SafeArea

export { minigame };
