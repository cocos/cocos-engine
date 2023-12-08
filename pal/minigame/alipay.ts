/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { IMiniGame } from 'pal/minigame';
import { checkPalIntegrity, withImpl } from '../integrity-check';
import { Orientation } from '../screen-adapter/enum-type';
import { cloneObject, createInnerAudioContextPolyfill } from '../utils';

declare let my: any;

const minigame: IMiniGame = {} as IMiniGame;
cloneObject(minigame, my);

// #region SystemInfo
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
// #endregion SystemInfo

// #region TouchEvent
// my.onTouchStart register touch event listner on body
// need to register on canvas
minigame.onTouchStart = function (cb): void {
    window.canvas.addEventListener('touchstart', (res) => {
        cb && cb(res);
    });
};
minigame.onTouchMove = function (cb): void {
    window.canvas.addEventListener('touchmove', (res) => {
        cb && cb(res);
    });
};
minigame.onTouchEnd = function (cb): void {
    window.canvas.addEventListener('touchend', (res) => {
        cb && cb(res);
    });
};
minigame.onTouchCancel = function (cb): void {
    window.canvas.addEventListener('touchcancel', (res) => {
        cb && cb(res);
    });
};
// #endregion TouchEvent

// #region Audio
const polyfilledCreateInnerAudio = createInnerAudioContextPolyfill(my, {
    onPlay: true,  // Fix: onPlay can not be executed at Alipay(Override onPlay method).
    onPause: true,  // Fix: calling pause twice, onPause won't execute twice.(Override onPause method)
    onStop: false,
    onSeek: false,
}, true);

// eslint-disable-next-line func-names
minigame.createInnerAudioContext = function (): InnerAudioContext {
    // NOTE: `onCanPlay` and `offCanPlay` is not standard minigame interface,
    // so here we mark audio as type of any
    const audio: any = polyfilledCreateInnerAudio();
    audio.onCanplay = audio.onCanPlay.bind(audio);
    audio.offCanplay = audio.offCanPlay.bind(audio);
    delete audio.onCanPlay;
    delete audio.offCanPlay;
    return audio as InnerAudioContext;
};

// #region Accelerometer
let _accelerometerCb: AccelerometerChangeCallback | undefined;
minigame.onAccelerometerChange = function (cb: AccelerometerChangeCallback): void {
    minigame.offAccelerometerChange();
    // onAccelerometerChange would start accelerometer
    // so we won't call this method here
    _accelerometerCb = (res: any): void => {
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
minigame.offAccelerometerChange = function (cb?: AccelerometerChangeCallback): void {
    if (_accelerometerCb) {
        my.offAccelerometerChange(_accelerometerCb);
        _accelerometerCb = undefined;
    }
};
minigame.startAccelerometer = function (res: any): void {
    if (_accelerometerCb) {
        my.onAccelerometerChange(_accelerometerCb);
    } else {
        // my.startAccelerometer() is not implemented.
        console.error('minigame.onAccelerometerChange() should be invoked before minigame.startAccelerometer() on alipay platform');
    }
};
minigame.stopAccelerometer = function (res: any): void {
    // my.stopAccelerometer() is not implemented.
    minigame.offAccelerometerChange();
};
// #endregion Accelerometer

// #region SafeArea
minigame.getSafeArea = function (): SafeArea {
    console.warn('getSafeArea is not supported on this platform');
    const systemInfo =  minigame.getSystemInfoSync();
    return {
        top: 0,
        left: 0,
        bottom: systemInfo.windowHeight,
        right: systemInfo.windowWidth,
        width: systemInfo.windowWidth,
        height: systemInfo.windowHeight,
    };
};
// #endregion SafeArea

export { minigame };

checkPalIntegrity<typeof import('pal/minigame')>(withImpl<typeof import('./alipay')>());
