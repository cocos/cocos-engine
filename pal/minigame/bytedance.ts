import { IMiniGame } from 'pal/minigame';
import { Orientation } from '../orientation';
import { cloneObject } from '../utils';

declare let tt: any;

// @ts-expect-error can't init mg when it's declared
const mg: IMiniGame = {};
cloneObject(mg, tt);

const systemInfo = mg.getSystemInfoSync();
mg.isSubContext = mg.getOpenDataContext !== undefined;
mg.isDevTool = (systemInfo.platform === 'devtools');
mg.isLandscape = systemInfo.screenWidth > systemInfo.screenHeight;
let orientation = mg.isLandscape ? Orientation.LANDSCAPE_RIGHT : Orientation.PORTRAIT;

// Accelerometer
tt.onDeviceOrientationChange((res) => {
    if (res.value === 'landscape') {
        orientation = Orientation.LANDSCAPE_RIGHT;
    } else if (res.value === 'landscapeReverse') {
        orientation = Orientation.LANDSCAPE_LEFT;
    }
});

mg.onAccelerometerChange = function (cb) {
    tt.onAccelerometerChange((res) => {
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
    tt.stopAccelerometer();
};

// safeArea
// origin point on the top-left corner
mg.getSafeArea = function () {
    let { top, left, bottom, right, width, height } = systemInfo.safeArea;
    // HACK: on iOS device, the orientation should mannually rotate
    if (systemInfo.platform === 'ios' && !mg.isDevTool && mg.isLandscape) {
        const tempData = [right, top, left, bottom, width, height];
        top = tempData[2];
        left = tempData[1];
        bottom = tempData[3];
        right = tempData[0];
        height = tempData[5];
        width = tempData[4];
    }
    return { top, left, bottom, right, width, height };
};

export { mg };
