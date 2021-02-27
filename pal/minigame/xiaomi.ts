import { IMiniGame } from "pal_minigame";
import { Orientation } from "../orientation";
import { cloneObject } from "../utils";

declare let qg: any;

// @ts-ignore
let mg: IMiniGame = {};
cloneObject(mg, qg);

let systemInfo = mg.getSystemInfoSync();
mg.isSubContext = false;  // sub context not supported
mg.isDevTool = false;
mg.isLandscape = systemInfo.screenWidth > systemInfo.screenHeight;
let orientation = mg.isLandscape ? Orientation.LANDSCAPE_RIGHT : Orientation.PORTRAIT;

// // TouchEvent
// globalAdapter.onTouchStart = function (cb) {
//     window.canvas.ontouchstart = cb;
// };
// globalAdapter.onTouchMove = function (cb) {
//     window.canvas.ontouchmove = cb;
// };
// globalAdapter.onTouchEnd = function (cb) {
//     window.canvas.ontouchend = cb;
// };
// globalAdapter.onTouchCancel = function (cb) {
//     window.canvas.ontouchcancel = cb;
// };

// // Keyboard
// globalAdapter.showKeyboard = function (res) {
//     res.confirmHold = true;  // HACK: confirmHold not working on Xiaomi platform
//     qg.showKeyboard(res);
// };

// Accelerometer
qg.onDeviceOrientationChange(function (res) {
    if (res.value === 'landscape') {
        orientation = Orientation.LANDSCAPE_RIGHT;
    }
    else if (res.value === 'landscapeReverse') {
        orientation = Orientation.LANDSCAPE_LEFT;
    }
});

mg.onAccelerometerChange = function (cb) {
    qg.onAccelerometerChange(res => {
        let x = res.x;
        let y = res.y;
        if (mg.isLandscape) {
            let orientationFactor = orientation === Orientation.LANDSCAPE_RIGHT ? 1 : -1;
            let tmp = x;
            x = -y * orientationFactor;
            y = tmp * orientationFactor;
        }

        let resClone = {
            x,
            y,
            z: res.z,
        };
        cb(resClone);
    });
    // onAccelerometerChange would start accelerometer, need to mannually stop it
    qg.stopAccelerometer();
}

mg.getSafeArea = function () {
    console.warn('getSafeArea is not supported on this platform');
    if (mg.getSystemInfoSync) {
        let systemInfo =  mg.getSystemInfoSync();
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
}

export { mg };