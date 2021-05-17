import { IMiniGame } from 'pal/minigame';
import { Orientation } from '../system/enum-type/orientation';
import { cloneObject, createInnerAudioContextPolyfill } from '../utils';

declare let wx: any;

// @ts-expect-error can't init minigame when it's declared
const minigame: IMiniGame = {};
cloneObject(minigame, wx);

// #region SystemInfo
const systemInfo = minigame.getSystemInfoSync();
minigame.isDevTool = (systemInfo.platform === 'devtools');
// NOTE: size and orientation info is wrong at the init phase, especially on iOS device
Object.defineProperty(minigame, 'isLandscape', {
    get () {
        return systemInfo.deviceOrientation ? (systemInfo.deviceOrientation === 'landscape') : (systemInfo.screenWidth > systemInfo.screenHeight);
    },
});
// init landscapeOrientation as LANDSCAPE_RIGHT
let landscapeOrientation = Orientation.LANDSCAPE_RIGHT;
if (systemInfo.platform.toLocaleLowerCase() !== 'android') {
    // onDeviceOrientationChange doesn't work well on Android.
    // see this issue: https://developers.weixin.qq.com/community/minigame/doc/000482138dc460e56cfaa5cb15bc00
    wx.onDeviceOrientationChange((res) => {
        if (res.value === 'landscape') {
            landscapeOrientation = Orientation.LANDSCAPE_RIGHT;
        } else if (res.value === 'landscapeReverse') {
            landscapeOrientation = Orientation.LANDSCAPE_LEFT;
        }
    });
}
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
        wx.offAccelerometerChange(_accelerometerCb);
        _accelerometerCb = undefined;
    }
};
minigame.startAccelerometer = function (res: any) {
    if (_accelerometerCb) {
        wx.onAccelerometerChange(_accelerometerCb);
    }
    wx.startAccelerometer(res);
};
// #endregion Accelerometer

minigame.createInnerAudioContext = createInnerAudioContextPolyfill(wx, {
    onPlay: true,
    onPause: true,
    onStop: true,
    onSeek: false,
}, true);

// safeArea
// origin point on the top-left corner
// FIX_ME: wrong safe area when orientation is landscape left
minigame.getSafeArea = function () {
    let { top, left, bottom, right, width, height } = systemInfo.safeArea;
    // HACK: on iOS device, the orientation should mannually rotate
    if (systemInfo.platform === 'ios' && !minigame.isDevTool && minigame.isLandscape) {
        const tempData = [right, top, left, bottom, width, height];
        top = systemInfo.screenHeight - tempData[0];
        left = tempData[1];
        bottom = systemInfo.screenHeight - tempData[2];
        right = tempData[3];
        height = tempData[4];
        width = tempData[5];
    }
    return { top, left, bottom, right, width, height };
};

export { minigame };
