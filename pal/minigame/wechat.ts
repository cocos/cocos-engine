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

import { IMiniGame, SystemInfo, DeviceInfo, WindowInfo, AppBaseInfo, SystemSetting, AppAuthorizeSetting } from 'pal/minigame';
import { checkPalIntegrity, withImpl } from '../integrity-check';
import { Orientation } from '../screen-adapter/enum-type';
import { cloneObject, createInnerAudioContextPolyfill, versionCompare } from '../utils';
import { sys, systemEvent } from '../../typedoc-index';

declare let wx: any;

const minigame: IMiniGame = {} as IMiniGame;
cloneObject(minigame, wx);

// #region platform related
minigame.wx = {};
minigame.wx.onKeyDown = wx.onKeyDown?.bind(wx);
minigame.wx.onKeyUp = wx.onKeyUp?.bind(wx);
minigame.wx.onMouseDown = wx.onMouseDown?.bind(wx);
minigame.wx.onMouseMove = wx.onMouseMove?.bind(wx);
minigame.wx.onMouseUp = wx.onMouseUp?.bind(wx);
minigame.wx.onWheel = wx.onWheel?.bind(wx);
// #endregion platform related

// This interface is not supported in versions below 2.25.3.
if (minigame.getSystemSetting === undefined) {
    minigame.getSystemSetting = function (): SystemSetting {
        const systemInfo = minigame.getSystemInfoSync();
        return {
            bluetoothEnabled: systemInfo.bluetoothEnabled,
            locationEnabled: systemInfo.locationEnabled,
            wifiEnabled: systemInfo.wifiEnabled,
            deviceOrientation: systemInfo.deviceOrientation,
        };
    };
}

if (minigame.getAppAuthorizeSetting === undefined) {
    minigame.getAppAuthorizeSetting = function (): AppAuthorizeSetting {
        const systemInfo = minigame.getSystemInfoSync();
        return {
            albumAuthorized: systemInfo.albumAuthorized === undefined ? undefined : ((systemInfo.albumAuthorized) ? 'authorized' : 'denied'),
            bluetoothAuthorized: systemInfo.bluetoothAuthorized === undefined ? undefined
                : ((systemInfo.bluetoothAuthorized) ? 'authorized' : 'denied'),
            cameraAuthorized: systemInfo.cameraAuthorized === undefined ? undefined
                : ((systemInfo.cameraAuthorized) ? 'authorized' : 'denied'),
            locationAuthorized: systemInfo.locationAuthorized === undefined ? undefined
                : ((systemInfo.locationAuthorized) ? 'authorized' : 'denied'),
            locationReducedAccuracy: systemInfo.locationReducedAccuracy === undefined ? undefined : (systemInfo.locationReducedAccuracy),
            microphoneAuthorized: systemInfo.microphoneAuthorized === undefined ? undefined
                : ((systemInfo.microphoneAuthorized) ? 'authorized' : 'denied'),
            notificationAuthorized: systemInfo.notificationAuthorized === undefined ? undefined
                : ((systemInfo.notificationAuthorized) ? 'authorized' : 'denied'),
            notificationAlertAuthorized: systemInfo.notificationAlertAuthorized === undefined ? undefined
                : ((systemInfo.notificationAlertAuthorized) ? 'authorized' : 'denied'),
            notificationBadgeAuthorized: systemInfo.notificationBadgeAuthorized === undefined ? undefined
                : ((systemInfo.notificationBadgeAuthorized) ? 'authorized' : 'denied'),
            notificationSoundAuthorized: systemInfo.notificationSoundAuthorized === undefined ? undefined
                : ((systemInfo.notificationSoundAuthorized) ? 'authorized' : 'denied'),
            phoneCalendarAuthorized: systemInfo.phoneCalendarAuthorized === undefined ? undefined
                : ((systemInfo.phoneCalendarAuthorized) ? 'authorized' : 'denied'),
        };
    };
}

if (minigame.getDeviceInfo === undefined) {
    minigame.getDeviceInfo = function (): DeviceInfo {
        const systemInfo = minigame.getSystemInfoSync();
        return {
            abi: systemInfo.abi,
            deviceAbi: systemInfo.deviceAbi,
            benchmarkLevel: systemInfo.benchmarkLevel,
            brand: systemInfo.brand,
            model: systemInfo.model,
            system: systemInfo.system,
            platform: systemInfo.platform,
            cpuType: systemInfo.cpuType,
            memorySize: systemInfo.memorySize,
        };
    };
}

if (minigame.getWindowInfo === undefined) {
    minigame.getWindowInfo = function (): WindowInfo {
        const systemInfo = minigame.getSystemInfoSync();
        return {
            pixelRatio: systemInfo.pixelRatio,
            screenWidth: systemInfo.screenWidth,
            screenHeight: systemInfo.screenHeight,
            windowWidth: systemInfo.windowWidth,
            windowHeight: systemInfo.windowHeight,
            statusBarHeight: systemInfo.statusBarHeight,
            safeArea: systemInfo.safeArea,
            screenTop: systemInfo.screenTop,
        };
    };
}

if (minigame.getAppBaseInfo === undefined) {
    minigame.getAppBaseInfo = function (): AppBaseInfo {
        const systemInfo = minigame.getSystemInfoSync();
        return {
            SDKVersion: systemInfo.SDKVersion,
            enableDebug: systemInfo.enableDebug,
            host: systemInfo.host, // not
            language: systemInfo.language,
            version: systemInfo.version,
            theme: systemInfo.theme,
            mode: systemInfo.mode,
            fontSizeScaleFactor: systemInfo.fontSizeScaleFactor,
            fontSizeSetting: systemInfo.fontSizeSetting,
        };
    };
}

const devideInfo = minigame.getDeviceInfo();

minigame.isDevTool = (devideInfo.platform === 'devtools');
// NOTE: size and orientation info is wrong at the init phase, especially on iOS device
Object.defineProperty(minigame, 'isLandscape', {
    get () {
        const locSystemInfo = wx.getSystemInfoSync() as SystemInfo;
        if (typeof locSystemInfo.deviceOrientation === 'string') {
            return locSystemInfo.deviceOrientation.startsWith('landscape');
        } else {
            return locSystemInfo.screenWidth > locSystemInfo.screenHeight;
        }
    },
});
// init landscapeOrientation as LANDSCAPE_RIGHT
let landscapeOrientation = Orientation.LANDSCAPE_RIGHT;
if (devideInfo.platform.toLocaleLowerCase() !== 'android') {
    // onDeviceOrientationChange doesn't work well on Android.
    // see this issue: https://developers.weixin.qq.com/community/minigame/doc/000482138dc460e56cfaa5cb15bc00
    wx.onDeviceOrientationChange((res) => {
        if (res.value === 'landscape') {
            landscapeOrientation = Orientation.LANDSCAPE_RIGHT;
        } else if (res.value === 'landscapeReverse') {
            landscapeOrientation = Orientation.LANDSCAPE_LEFT;
        }
    });
}
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
        wx.offAccelerometerChange(_accelerometerCb);
        _accelerometerCb = undefined;
    }
};
minigame.startAccelerometer = function (res: any): void {
    if (_accelerometerCb) {
        wx.onAccelerometerChange(_accelerometerCb);
    }
    wx.startAccelerometer(res);
};
// #endregion Accelerometer

minigame.createInnerAudioContext = createInnerAudioContextPolyfill(wx, {
    onPlay: true,
    onPause: true,
    onStop: true,
    onSeek: false,
}, true);

// #region SafeArea
// FIX_ME: wrong safe area when orientation is landscape left
minigame.getSafeArea = function (): SafeArea {
    const windowInfo: WindowInfo = minigame.getWindowInfo();
    let safeArea = windowInfo.safeArea;
    if (!safeArea) {
        safeArea = {
            left: 0,
            top: 0,
            bottom: windowInfo.screenHeight,
            right: windowInfo.screenWidth,
            width: windowInfo.screenWidth,
            height: windowInfo.screenHeight,
        };
    }
    return safeArea;
};
// #endregion SafeArea

declare const canvas: any;  // defined in global

// HACK: adapt GL.useProgram: use program not supported to unbind program on pc end
const appBaseInfo = minigame.getAppBaseInfo();
if (devideInfo.platform === 'windows' && versionCompare(appBaseInfo.SDKVersion, '2.16.0') < 0) {
    const locCanvas = canvas;
    if (locCanvas) {
        const webglRC = locCanvas.getContext('webgl');
        const originalUseProgram = webglRC.useProgram.bind(webglRC);
        webglRC.useProgram = function (program): void {
            if (program) {
                originalUseProgram(program);
            }
        };
    }
}

export { minigame };

checkPalIntegrity<typeof import('pal/minigame')>(withImpl<typeof import('./wechat')>());
