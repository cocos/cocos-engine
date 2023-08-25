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
import { Orientation } from '../screen-adapter/enum-type';
import { cloneObject, createInnerAudioContextPolyfill, versionCompare } from '../utils';
import { Language } from '../system-info/enum-type';
import { checkPalIntegrity, withImpl } from '../integrity-check';

//taobao IDE language   ("Chinese")
//taobao phone language (Andrond: "cn", iPad: 'zh_CN')
const languageMap: Record<string, Language> = {
    Chinese: Language.CHINESE,
    cn: Language.CHINESE,
    zh_CN: Language.CHINESE,
};

declare let my: any;

const minigame: IMiniGame = {} as IMiniGame;
cloneObject(minigame, my);

// #region SystemInfo
const systemInfo = minigame.getSystemInfoSync();
systemInfo.language = languageMap[systemInfo.language] || systemInfo.language;
minigame.getSystemInfoSync = (): SystemInfo => systemInfo;

minigame.isDevTool = my.isIDE;

Object.defineProperty(minigame, 'isLandscape', {
    get () {
        const locSystemInfo = minigame.getSystemInfoSync();
        if (typeof locSystemInfo.deviceOrientation === 'string') {
            return locSystemInfo.deviceOrientation.startsWith('landscape');
        } else {
            return locSystemInfo.screenWidth > locSystemInfo.screenHeight;
        }
    },
});
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

function detectLandscapeSupport (): void {
    const locSysInfo = minigame.getSystemInfoSync();
    if (typeof locSysInfo.deviceOrientation === 'string' && locSysInfo.deviceOrientation.startsWith('landscape')) {
        if (versionCompare(locSysInfo.version, '10.15.10') < 0) {
            console.warn('The current Taobao client version does not support Landscape, the minimum requirement is 10.15.10');
        }
    }
}
detectLandscapeSupport();

// #region Audio
const polyfilledCreateInnerAudio = createInnerAudioContextPolyfill(my, {
    onPlay: true,  // Fix: onPlay won't execute.
    onPause: true,  // NOTE: calling pause() twice onPause won't execute twice.
    onStop: false,
    onSeek: false,
}, true);
minigame.createInnerAudioContext = function (): InnerAudioContext {
    // NOTE: `onCanPlay` is not standard minigame interface,
    // so here we mark audio as type of any
    const audio: any = polyfilledCreateInnerAudio();
    audio.onCanplay = audio.onCanPlay.bind(audio);
    delete audio.onCanPlay;
    return audio as InnerAudioContext;
};
// #region Audio

// #region Font
minigame.loadFont = function (url): string {
    // my.loadFont crash when url is not in user data path
    return 'Arial';
};
// #endregion Font

// #region Accelerometer
let _accelerometerCb: AccelerometerChangeCallback | undefined;
minigame.onAccelerometerChange = function (cb: AccelerometerChangeCallback): void {
    minigame.offAccelerometerChange();
    // onAccelerometerChange would start accelerometer
    // so we won't call this method here
    _accelerometerCb = (res: any): void => {
        let x: number = res.x;
        let y: number = res.y;
        if (minigame.isLandscape) {
            const orientationFactor: number = (landscapeOrientation === Orientation.LANDSCAPE_RIGHT ? 1 : -1);
            x = -res.y * orientationFactor;
            y = res.x * orientationFactor;
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
        console.error('minigame.onAccelerometerChange() should be invoked before minigame.startAccelerometer() on taobao platform');
    }
};
minigame.stopAccelerometer = function (res: any): void {
    // my.stopAccelerometer() is not implemented.
    minigame.offAccelerometerChange();
};
// #endregion Accelerometer

// #region SafeArea
// It should be a value that is not multiplied by dpr
minigame.getSafeArea = function (): SafeArea {
    const systemInfo = minigame.getSystemInfoSync();
    if (typeof systemInfo.safeArea !== 'undefined') {
        return systemInfo.safeArea;
    }
    console.warn('getSafeArea is not supported on this platform');
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

declare const $global: any;  // global variable on Taobao platform.

// TODO: A filpY operation will be performed after ReadPixels on Taobao.
if (!my.isIDE) {
    const locCanvas = $global.screencanvas;
    if (locCanvas) {
        const originalGetContext = locCanvas.getContext.bind(locCanvas);
        locCanvas.getContext = function (name, param): any {
            if (typeof name === 'string' && typeof param === 'object' && name.startsWith('webgl')) {
                Object.assign(param, { enable_flip_y_after_read_pixels: false });
                const gl = originalGetContext(name, param);
                adapterGL(gl);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return gl;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return originalGetContext(name, param);
        };
    }
}

let hasAdapter = false;
function adapterGL (gl): void {
    if (hasAdapter) { return; }
    hasAdapter = true;

    if (!my.isIDE) {
        // TODO: Premultiplication is already used on Taobao, do not use premultiplication on the phone.
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

        // TODO: adapter gl.getUniformLocation
        // Android return value: undefined.   iOS return value: {ID: -1}.
        if (my.getSystemInfoSync().platform.toLocaleLowerCase() === 'ios') {
            const originalGetUniformLocation = gl.getUniformLocation.bind(gl);
            gl.getUniformLocation = function (program, name): any {
                const glLoc = originalGetUniformLocation(program, name);
                if (glLoc && glLoc.ID === -1) {
                    return undefined;
                }
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return originalGetUniformLocation(program, name);
            };
        }
    }
}

export { minigame };

checkPalIntegrity<typeof import('pal/minigame')>(withImpl<typeof import('./taobao')>());
