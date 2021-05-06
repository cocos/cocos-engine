import { COCOSPLAY, HUAWEI, LINKSURE, OPPO, QTT, VIVO } from 'internal:constants';
import { SystemInfo, IMiniGame } from 'pal/minigame';

import { Orientation } from '../system/enum-type/orientation';
import { cloneObject, createInnerAudioContextPolyfill } from '../utils';

declare let ral: any;

// @ts-expect-error can't init minigame when it's declared
const minigame: IMiniGame = {};
cloneObject(minigame, ral);

// #region SystemInfo
const systemInfo = minigame.getSystemInfoSync();
minigame.isDevTool = (systemInfo.platform === 'devtools');

// NOTE: size and orientation info is wrong at the init phase, need to define as a getter
Object.defineProperty(minigame, 'isLandscape', {
    get () {
        if (VIVO) {
            return systemInfo.screenWidth > systemInfo.screenHeight;
        } else {
            const locSysInfo = minigame.getSystemInfoSync();
            return locSysInfo.screenWidth > locSysInfo.screenHeight;
        }
    },
});
// init landscapeOrientation as LANDSCAPE_RIGHT
const landscapeOrientation = Orientation.LANDSCAPE_RIGHT;
// NOTE: onDeviceOrientationChange is not supported on this platform
// ral.onDeviceOrientationChange((res) => {
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

// #region Accelerometer
minigame.onAccelerometerChange = function (cb) {
    ral.onAccelerometerChange((res) => {
        let x = res.x;
        let y = res.y;
        if (minigame.isLandscape) {
            const orientationFactor = landscapeOrientation === Orientation.LANDSCAPE_RIGHT ? 1 : -1;
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
    });
};
// #endregion Accelerometer

minigame.createInnerAudioContext = createInnerAudioContextPolyfill(ral, {
    onPlay: true,  // polyfill for vivo
    onPause: true,
    onStop: true,
    onSeek: true,
});

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

if (VIVO) {
    // TODO: need to be handled in ral lib.
    minigame.getSystemInfoSync = function () {
        const sys = ral.getSystemInfoSync() as SystemInfo;
        // on VIVO, windowWidth should be windowHeight when it is landscape
        sys.windowWidth = sys.screenWidth;
        sys.windowHeight = sys.screenHeight;
        return sys;
    };
}

export { minigame };
