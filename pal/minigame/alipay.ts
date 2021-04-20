import { IMiniGame, SystemInfo } from 'pal/minigame';
import { Orientation } from '../system/enum-type/orientation';
import { cloneObject } from '../utils';

declare let my: any;

// @ts-expect-error can't init minigame when it's declared
const minigame: IMiniGame = {};
cloneObject(minigame, my);

const systemInfo = minigame.getSystemInfoSync();
minigame.isDevTool = window.navigator && (/AlipayIDE/.test(window.navigator.userAgent));

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

// TouchEvent
// my.onTouchStart register touch event listner on body
// need to register on canvas
minigame.onTouchStart = function (cb) {
    window.canvas.addEventListener('touchstart', (res) => {
        cb && cb(res);
    });
};
minigame.onTouchMove = function (cb) {
    window.canvas.addEventListener('touchmove', (res) => {
        cb && cb(res);
    });
};
minigame.onTouchEnd = function (cb) {
    window.canvas.addEventListener('touchend', (res) => {
        cb && cb(res);
    });
};
minigame.onTouchCancel = function (cb) {
    window.canvas.addEventListener('touchcancel', (res) => {
        cb && cb(res);
    });
};

minigame.getSystemInfoSync = function (): SystemInfo {
    const sys = my.getSystemInfoSync() as SystemInfo;
    sys.screenWidth = sys.windowWidth;
    sys.screenHeight = sys.windowHeight;
    return sys;
};

minigame.createInnerAudioContext = function (): InnerAudioContext {
    const audio: InnerAudioContext = my.createInnerAudioContext();
    // @ts-expect-error InnerAudioContext has onCanPlay
    audio.onCanplay = audio.onCanPlay.bind(audio);
    // @ts-expect-error InnerAudioContext has offCanPlay
    audio.offCanplay = audio.offCanPlay.bind(audio);
    // @ts-expect-error InnerAudioContext has onCanPlay
    delete audio.onCanPlay;
    // @ts-expect-error InnerAudioContext has offCanPlay
    delete audio.offCanPlay;
    return audio;
};

// Font
minigame.loadFont = function (url) {
    // my.loadFont crash when url is not in user data path
    return 'Arial';
};

// Accelerometer
minigame.onAccelerometerChange = function (cb) {
    my.onAccelerometerChange((res) => {
        let x = res.x;
        let y = res.y;
        if (minigame.isLandscape) {
            // NOTE: onDeviceOrientationChange is not supported on alipay platform
            const tmp = x;
            x = -y;
            y = tmp;
        }

        const resClone = {
            x,
            y,
            z: res.z,
        };
        cb(resClone);
    });
    // onAccelerometerChange would start accelerometer, need to mannually stop it
    my.stopAccelerometer();
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
