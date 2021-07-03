import { IMiniGame, SystemInfo } from 'pal/minigame';
import { Orientation } from '../system/enum-type/orientation';
import { cloneObject, createInnerAudioContextPolyfill } from '../utils';

declare let tt: any;

// @ts-expect-error can't init minigame when it's declared
const minigame: IMiniGame = {};
cloneObject(minigame, tt);

// #region platform related
minigame.tt = {};
minigame.tt.getAudioContext = tt.getAudioContext?.bind(tt);
// #endregion platform related

// #region SystemInfo
const systemInfo = minigame.getSystemInfoSync();
minigame.isDevTool = (systemInfo.platform === 'devtools');

minigame.isLandscape = systemInfo.screenWidth > systemInfo.screenHeight;
// init landscapeOrientation as LANDSCAPE_RIGHT
let landscapeOrientation = Orientation.LANDSCAPE_RIGHT;
tt.onDeviceOrientationChange((res) => {
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
let _accelerometerCb: AccelerometerChangeCallback | undefined;
minigame.onAccelerometerChange = function (cb: AccelerometerChangeCallback) {
    minigame.offAccelerometerChange();
    // onAccelerometerChange would start accelerometer
    // so we won't call this method here
    _accelerometerCb = (res: any) => {
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
        cb(resClone);
    };
};
minigame.offAccelerometerChange = function (cb?: AccelerometerChangeCallback) {
    if (_accelerometerCb) {
        tt.offAccelerometerChange(_accelerometerCb);
        _accelerometerCb = undefined;
    }
};
minigame.startAccelerometer = function (res: any) {
    if (_accelerometerCb) {
        tt.onAccelerometerChange(_accelerometerCb);
    }
    tt.startAccelerometer(res);
};
// #endregion Accelerometer

minigame.createInnerAudioContext = createInnerAudioContextPolyfill(tt, {
    onPlay: true,
    onPause: true,
    onStop: true,
    onSeek: true,
});

// #region SafeArea
// FIX_ME: wrong safe area when orientation is landscape left
minigame.getSafeArea = function () {
    const locSystemInfo = tt.getSystemInfoSync() as SystemInfo;
    let { top, left, right } = locSystemInfo.safeArea;
    const { bottom, width, height } = locSystemInfo.safeArea;
    // HACK: on iOS device, the orientation should mannually rotate
    if (locSystemInfo.platform === 'ios' && !minigame.isDevTool && minigame.isLandscape) {
        const tmpTop = top; const tmpLeft = left; const tmpBottom = bottom; const tmpRight = right; const tmpWidth = width; const tmpHeight = height;
        top = tmpLeft;
        left = tmpTop;
        right = tmpRight - tmpTop;
    }
    return { top, left, bottom, right, width, height };
};
// #endregion SafeArea

export { minigame };
