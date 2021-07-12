import { COCOSPLAY, HUAWEI, LINKSURE, OPPO, QTT, VIVO } from 'internal:constants';
import { SystemInfo, IMiniGame } from 'pal/minigame';

import { Orientation } from '../screen-adapter/enum-type';
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

if (VIVO) {
    // TODO: need to be handled in ral lib.
    minigame.getSystemInfoSync = function () {
        const sys = ral.getSystemInfoSync() as SystemInfo;
        // on VIVO, windowWidth should be windowHeight when it is landscape
        sys.windowWidth = sys.screenWidth;
        sys.windowHeight = sys.screenHeight;
        return sys;
    };
} else if (LINKSURE) {
    // TODO: update system info when view resized, currently the resize callback is not supported.
    const cachedSystemInfo = ral.getSystemInfoSync() as SystemInfo;
    minigame.getSystemInfoSync = function () {
        return cachedSystemInfo;
    };
}
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

// NOTE: Audio playing crash on COCOSPLAY, need to play audio asynchronously.
if (COCOSPLAY) {
    minigame.createInnerAudioContext = createInnerAudioContextPolyfill(ral, {
        onPlay: true,  // polyfill for vivo
        onPause: true,
        onStop: true,
        onSeek: true,
    }, true);
} else {
    minigame.createInnerAudioContext = createInnerAudioContextPolyfill(ral, {
        onPlay: true,  // polyfill for vivo
        onPause: true,
        onStop: true,
        onSeek: true,
    });
}

// #region SafeArea
minigame.getSafeArea = function () {
    const locSystemInfo = ral.getSystemInfoSync() as SystemInfo;
    if (locSystemInfo.safeArea) {
        return locSystemInfo.safeArea;
    } else {
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
    }
};
// #endregion SafeArea

export { minigame };
