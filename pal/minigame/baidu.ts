import { IMiniGame } from 'pal/minigame';
import { Orientation } from '../screen-manager/enum-type';
import { cloneObject, createInnerAudioContextPolyfill } from '../utils';

declare let swan: any;

// @ts-expect-error can't init minigame when it's declared
const minigame: IMiniGame = {};
cloneObject(minigame, swan);

// #region SystemInfo
const systemInfo = minigame.getSystemInfoSync();
minigame.isDevTool = systemInfo.platform === 'devtools';

minigame.isLandscape = systemInfo.screenWidth > systemInfo.screenHeight;
// init landscapeOrientation as LANDSCAPE_RIGHT
let landscapeOrientation = Orientation.LANDSCAPE_RIGHT;
swan.onDeviceOrientationChange((res) => {
    if (res.value === 'landscape') {
        landscapeOrientation = Orientation.LANDSCAPE_RIGHT;
    } else if (res.value === 'landscapeReverse') {
        landscapeOrientation = Orientation.LANDSCAPE_LEFT;
    }
});
Object.defineProperty(minigame, 'orientation', {
    get () {
        return minigame.isLandscape ? landscapeOrientation : Orientation.PORTRAIT;
    },
});
// #endregion SystemInfo

// #region Accelerometer
let _customAccelerometerCb: AccelerometerChangeCallback | undefined;
let _innerAccelerometerCb: AccelerometerChangeCallback | undefined;
minigame.onAccelerometerChange = function (cb: AccelerometerChangeCallback) {
    // swan.offAccelerometerChange() is not supported.
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

            const resClone = {
                x,
                y,
                z: res.z,
            };
            _customAccelerometerCb?.(resClone);
        };
        swan.onAccelerometerChange(_innerAccelerometerCb);
        // onAccelerometerChange would start accelerometer, need to stop it mannually
        swan.stopAccelerometer({});
    }
    _customAccelerometerCb = cb;
};
minigame.offAccelerometerChange = function (cb?: AccelerometerChangeCallback) {
    // swan.offAccelerometerChange() is not supported.
    _customAccelerometerCb = undefined;
};
// #endregion Accelerometer

minigame.createInnerAudioContext = createInnerAudioContextPolyfill(swan, {
    onPlay: true,
    onPause: true,
    onStop: true,
    onSeek: false,
});

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
