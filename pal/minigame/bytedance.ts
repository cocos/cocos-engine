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

import { IMiniGame, SystemInfo } from 'pal/minigame';
import { checkPalIntegrity, withImpl } from '../integrity-check';
import { Orientation } from '../screen-adapter/enum-type';
import { cloneObject, createInnerAudioContextPolyfill } from '../utils';

declare let tt: any;

const minigame: IMiniGame = {} as IMiniGame;
cloneObject(minigame, tt);

// #region platform related
minigame.tt = {};
minigame.tt.getAudioContext = tt.getAudioContext?.bind(tt);
// #endregion platform related

// #region SystemInfo
let systemInfo = minigame.getSystemInfoSync();
minigame.getSystemInfoSync = (): SystemInfo => systemInfo;
minigame.onWindowResize?.(() => {
    systemInfo = minigame.getSystemInfoSync();
});

minigame.isDevTool = (systemInfo.platform === 'devtools');

minigame.isLandscape = systemInfo.screenWidth > systemInfo.screenHeight;
// init landscapeOrientation as LANDSCAPE_RIGHT
let landscapeOrientation = Orientation.LANDSCAPE_RIGHT;
tt.onDeviceOrientationChange((res) => {
    if (res.value === 'landscape') {
        landscapeOrientation = Orientation.LANDSCAPE_RIGHT;
    } else if (res.value === 'landscapeReverse') {
        landscapeOrientation = Orientation.LANDSCAPE_LEFT;
    }
});
Object.defineProperty(minigame, 'orientation', {
    get () {
        return minigame.isLandscape ? landscapeOrientation : Orientation.PORTRAIT;
    },
});
// #endregion SystemInfo

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
        tt.offAccelerometerChange(_accelerometerCb);
        _accelerometerCb = undefined;
    }
};
minigame.startAccelerometer = function (res: any): void {
    if (_accelerometerCb) {
        tt.onAccelerometerChange(_accelerometerCb);
    }
    tt.startAccelerometer(res);
};
// #endregion Accelerometer

minigame.createInnerAudioContext = createInnerAudioContextPolyfill(tt, {
    onPlay: true,
    onPause: true,
    onStop: true,
    onSeek: true,
});

// #region SafeArea
// FIX_ME: wrong safe area when orientation is landscape left
minigame.getSafeArea = function (): SafeArea {
    const locSystemInfo = tt.getSystemInfoSync() as SystemInfo;
    let { top, left, right } = locSystemInfo.safeArea;
    const { bottom, width, height } = locSystemInfo.safeArea;
    // HACK: on iOS device, the orientation should mannually rotate
    if (locSystemInfo.platform === 'ios' && !minigame.isDevTool && minigame.isLandscape) {
        const tmpTop = top; const tmpLeft = left; const tmpBottom = bottom; const tmpRight = right; const tmpWidth = width; const tmpHeight = height;
        top = tmpLeft;
        left = tmpTop;
        right = tmpRight - tmpTop;
    }
    return { top, left, bottom, right, width, height };
};
// #endregion SafeArea

export { minigame };

checkPalIntegrity<typeof import('pal/minigame')>(withImpl<typeof import('./bytedance')>());
