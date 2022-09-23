import { IMiniGame, SystemInfo } from 'pal/minigame';
import { Orientation } from '../screen-adapter/enum-type';
import { cloneObject } from '../utils';
import { Language } from '../system-info/enum-type';

//taobao IDE    (language: "Chinese")
//taobao phone  (language: Andrond: "cn", iPad: 'zh_CN')
const languageMap: Record<string, Language> = {
    Chinese: Language.CHINESE,
    cn: Language.CHINESE,
};

declare let my: any;

// @ts-expect-error can't init minigame when it's declared
const minigame: IMiniGame = {};
cloneObject(minigame, my);

// #region SystemInfo
const systemInfo = minigame.getSystemInfoSync();
systemInfo.language = languageMap[systemInfo.language] || systemInfo.language;
minigame.getSystemInfoSync = () => systemInfo;

minigame.isDevTool = my.isIDE;

minigame.isLandscape = systemInfo.screenWidth > systemInfo.screenHeight;
// init landscapeOrientation as LANDSCAPE_RIGHT
const landscapeOrientation = Orientation.LANDSCAPE_RIGHT;
// NOTE: onDeviceOrientationChange is not supported on this platform
// my.onDeviceOrientationChange((res) => {
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

// #region Audio
// #region Audio

// #region Font
minigame.loadFont = function (url) {
    // my.loadFont crash when url is not in user data path
    return 'Arial';
};
// #endregion Font

// #region Accelerometer
let _accelerometerCb: AccelerometerChangeCallback | undefined;
minigame.onAccelerometerChange = function (cb: AccelerometerChangeCallback) {
    minigame.offAccelerometerChange();
    // onAccelerometerChange would start accelerometer
    // so we won't call this method here
    _accelerometerCb = (res: any) => {
        let x: number = res.x;
        let y: number = res.y;
        if (minigame.isLandscape) {
            const orientationFactor: number = (landscapeOrientation === Orientation.LANDSCAPE_RIGHT ? 1 : -1);
            x = -res.y * orientationFactor;
            y = res.x * orientationFactor;
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
        my.offAccelerometerChange(_accelerometerCb);
        _accelerometerCb = undefined;
    }
};
minigame.startAccelerometer = function (res: any) {
    if (_accelerometerCb) {
        my.onAccelerometerChange(_accelerometerCb);
    } else {
        // my.startAccelerometer() is not implemented.
        console.error('minigame.onAccelerometerChange() should be invoked before minigame.startAccelerometer() on taobao platform');
    }
};
minigame.stopAccelerometer = function (res: any) {
    // my.stopAccelerometer() is not implemented.
    minigame.offAccelerometerChange();
};
// #endregion Accelerometer

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
