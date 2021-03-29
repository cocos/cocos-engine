import { IMiniGame } from 'pal/minigame';
import { Orientation } from '../orientation';
import { cloneObject } from '../utils';

declare let ral: any;

// @ts-expect-error can't init mg when it's declared
const mg: IMiniGame = {};
cloneObject(mg, ral);

const systemInfo = mg.getSystemInfoSync();
mg.isSubContext = mg.getOpenDataContext !== undefined;
mg.isDevTool = (systemInfo.platform === 'devtools');
mg.isLandscape = systemInfo.screenWidth > systemInfo.screenHeight;
const orientation = mg.isLandscape ? Orientation.LANDSCAPE_RIGHT : Orientation.PORTRAIT;

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

mg.onAccelerometerChange = function (cb) {
    ral.onAccelerometerChange((res) => {
        let x = res.x;
        let y = res.y;
        if (mg.isLandscape) {
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
    ral.stopAccelerometer();
};

// safeArea
// origin point on the top-left corner
// FIX_ME: wrong safe area when orientation is landscape left
mg.getSafeArea = function () {
    let { top, left, bottom, right, width, height } = systemInfo.safeArea;
    // HACK: on iOS device, the orientation should mannually rotate
    if (systemInfo.platform === 'ios' && !mg.isDevTool && mg.isLandscape) {
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

export { mg };
