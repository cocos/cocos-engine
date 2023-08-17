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

declare let qg: any;

const minigame: IMiniGame = {} as IMiniGame;
cloneObject(minigame, qg);

// #region SystemInfo
const systemInfo = minigame.getSystemInfoSync();
minigame.isDevTool = false;

minigame.isLandscape = systemInfo.screenWidth > systemInfo.screenHeight;
// init landscapeOrientation as LANDSCAPE_RIGHT
const landscapeOrientation = Orientation.LANDSCAPE_RIGHT;
// NOTE: onDeviceOrientationChange is not supported on this platform
// qg.onDeviceOrientationChange((res) => {
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
minigame.onTouchStart = function (cb): void {
    window.canvas.ontouchstart = cb;
};
minigame.onTouchMove = function (cb): void {
    window.canvas.ontouchmove = cb;
};
minigame.onTouchEnd = function (cb): void {
    window.canvas.ontouchend = cb;
};
minigame.onTouchCancel = function (cb): void {
    window.canvas.ontouchcancel = cb;
};
// #endregion TouchEvent

// // Keyboard
// globalAdapter.showKeyboard = function (res) {
//     res.confirmHold = true;  // HACK: confirmHold not working on Xiaomi platform
//     qg.showKeyboard(res);
// };

// #region Accelerometer
let _customAccelerometerCb: AccelerometerChangeCallback | undefined;
let _innerAccelerometerCb: AccelerometerChangeCallback | undefined;
minigame.onAccelerometerChange = function (cb: AccelerometerChangeCallback): void {
    // qg.offAccelerometerChange() is not supported.
    // so we can only register AccelerometerChange callback, but can't unregister.
    if (!_innerAccelerometerCb) {
        _innerAccelerometerCb = (res: any): void => {
            let x = res.x;
            let y = res.y;
            if (minigame.isLandscape) {
                const orientationFactor = (landscapeOrientation === Orientation.LANDSCAPE_RIGHT ? 1 : -1);
                const tmp = x;
                x = -y * orientationFactor;
                y = tmp * orientationFactor;
            }

            const standardFactor = -0.1;
            x *= standardFactor;
            y *= standardFactor;
            const resClone = {
                x,
                y,
                z: res.z,
            };
            _customAccelerometerCb?.(resClone);
        };
        qg.onAccelerometerChange(_innerAccelerometerCb);
    }
    _customAccelerometerCb = cb;
};
minigame.offAccelerometerChange = function (cb?: AccelerometerChangeCallback): void {
    // qg.offAccelerometerChange() is not supported.
    _customAccelerometerCb = undefined;
};
// #endregion Accelerometer

// #region InnerAudioContext
minigame.createInnerAudioContext = createInnerAudioContextPolyfill(qg, {
    onPlay: true,
    onPause: true,
    onStop: true,
    onSeek: false,
});
const originalCreateInnerAudioContext = minigame.createInnerAudioContext;
minigame.createInnerAudioContext = function (): InnerAudioContext {
    const audioContext = originalCreateInnerAudioContext.call(minigame);
    const originalStop = audioContext.stop;
    Object.defineProperty(audioContext, 'stop', {
        configurable: true,
        value (): void {
            // NOTE: stop won't seek to 0 when audio is paused on Xiaomi platform.
            audioContext.seek(0);
            originalStop.call(audioContext);
        },
    });
    return audioContext;
};
// #endregion InnerAudioContext

// #region SafeArea
minigame.getSafeArea = function (): SafeArea {
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

checkPalIntegrity<typeof import('pal/minigame')>(withImpl<typeof import('./xiaomi')>());
