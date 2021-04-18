import { IMiniGame } from 'pal/minigame';
import { Orientation } from '../system/enum-type/orientation';
import { cloneObject } from '../utils';

declare let ral: any;

// @ts-expect-error can't init minigame when it's declared
const minigame: IMiniGame = {};
cloneObject(minigame, ral);

const systemInfo = minigame.getSystemInfoSync();
minigame.isDevTool = (systemInfo.platform === 'devtools');

minigame.isLandscape = systemInfo.screenWidth > systemInfo.screenHeight;
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

// Accelerometer
// onDeviceOrientationChange is not supported
// ral.onDeviceOrientationChange(function (res) {
//     if (res.value === 'landscape') {
//         orientation = Orientation.LANDSCAPE_RIGHT;
//     }
//     else if (res.value === 'landscapeReverse') {
//         orientation = Orientation.LANDSCAPE_LEFT;
//     }
// });

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
    // onAccelerometerChange would start accelerometer, need to mannually stop it
    ral.stopAccelerometer();
};

minigame.createInnerAudioContext = function (): InnerAudioContext {
    const audioContext: InnerAudioContext = ral.createInnerAudioContext();

    // HACK: onSeeked method doesn't work on runtime
    const originalSeek = audioContext.seek;
    let _onSeekCB: (()=> void) | null = null;
    audioContext.onSeeked = function (cb: ()=> void) {
        _onSeekCB = cb;
    };
    audioContext.seek = function (time: number) {
        originalSeek.call(audioContext, time);
        _onSeekCB?.();
    };

    // HACK: onPause method doesn't work on runtime
    const originalPause = audioContext.pause;
    let _onPauseCB: (()=> void) | null = null;
    audioContext.onPause = function (cb: ()=> void) {
        _onPauseCB = cb;
    };
    audioContext.pause = function () {
        originalPause.call(audioContext);
        _onPauseCB?.();
    };

    // HACK: onStop method doesn't work on runtime
    const originalStop = audioContext.stop;
    let _onStopCB: (()=> void) | null = null;
    audioContext.onStop = function (cb: ()=> void) {
        _onStopCB = cb;
    };
    audioContext.stop = function () {
        originalStop.call(audioContext);
        _onStopCB?.();
    };
    return audioContext;
};

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
