import { IMiniGame } from 'pal/minigame';
import { Orientation } from '../system/enum-type/orientation';
import { cloneObject } from '../utils';

declare let swan: any;

// @ts-expect-error can't init minigame when it's declared
const minigame: IMiniGame = {};
cloneObject(minigame, swan);

// SystemInfo
if (minigame.getSystemInfoSync) {
    const systemInfo = minigame.getSystemInfoSync();
    minigame.isDevTool = systemInfo.platform === 'devtools';
    minigame.isLandscape = systemInfo.screenWidth > systemInfo.screenHeight;
} else {
    // can't define window in devtool
    const descriptor = Object.getOwnPropertyDescriptor(global, 'window');
    minigame.isDevTool = !(!descriptor || descriptor.configurable === true);
    minigame.isLandscape = false;
}
minigame.isSubContext = (minigame.getOpenDataContext === undefined);
let orientation = minigame.isLandscape ? Orientation.LANDSCAPE_RIGHT : Orientation.PORTRAIT;

// Accelerometer
swan.onDeviceOrientationChange((res) => {
    if (res.value === 'landscape') {
        orientation = Orientation.LANDSCAPE_RIGHT;
    } else if (res.value === 'landscapeReverse') {
        orientation = Orientation.LANDSCAPE_LEFT;
    }
});

minigame.onAccelerometerChange = function (cb) {
    swan.onAccelerometerChange((res) => {
        let x = res.x;
        let y = res.y;
        if (minigame.isLandscape) {
            const orientationFactor = orientation === Orientation.LANDSCAPE_RIGHT ? 1 : -1;
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
    swan.stopAccelerometer();
};

minigame.getSafeArea = function () {
    console.warn('getSafeArea is not supported on this platform');
    if (minigame.getSystemInfoSync) {
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
    return {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        width: 0,
        height: 0,
    };
};

export { minigame };
