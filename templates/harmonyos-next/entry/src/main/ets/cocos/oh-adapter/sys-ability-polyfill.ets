/****************************************************************************
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/
import display from '@ohos.display';
import I18n from '@ohos.i18n';
import deviceInfo from '@ohos.deviceInfo';
import batteryInfo from '@ohos.batteryInfo';
import connection from '@ohos.net.connection'
import vibrator from '@ohos.vibrator';
import process from '@ohos.process';
import { ContextType } from "../../common/Constants"
import cocos from "libcocos.so";

const displayUtils = cocos.getContext(ContextType.DISPLAY_UTILS);

interface CutOut {
    left: number,
    top: number,
    width: number,
    height: number
}

interface ScreenInfo {
    width: number,
    height: number
}

let cutOut: CutOut = {
    left: 0,
    top: 0,
    width: 0,
    height: 0
};

let sceneInfo: ScreenInfo = {
    width: 0,
    height: 0
};

globalThis.getSystemLanguage = () => {
    return I18n.System.getSystemLanguage();
}

globalThis.getOSFullName = () => {
    return deviceInfo.osFullName;
}

globalThis.getDeviceModel = () => {
    return deviceInfo.productModel;
}

globalThis.getBatteryLevel = () => {
    return batteryInfo.batterySOC;
}

globalThis.getDPI = () => {
    let displayClass = display.getDefaultDisplaySync();
    return displayClass.densityDPI;
}

globalThis.getPixelRation = () => {
    let displayClass = display.getDefaultDisplaySync();
    return displayClass.densityPixels;
}

let onDisplayChange = () => {
    // Monitor changes in screen orientation.
    displayUtils.onDisplayChange(globalThis.getDeviceOrientation());

    // update screen cutout info
    globalThis.initScreenInfo();
}

try {
    display.on("change", onDisplayChange);
} catch (exception) {
    console.log('Failed to register callback. Code: ' + JSON.stringify(exception));
}

globalThis.getDeviceOrientation = (): display.Orientation => {
    let displayClass = display.getDefaultDisplaySync();
    return displayClass.rotation;
}

globalThis.getNetworkType = () => {
    let netHandle = connection.getDefaultNetSync();
    if (netHandle && netHandle.netId != 0) {
        let result = connection.getNetCapabilitiesSync(netHandle);
        if (result && result.bearerTypes) {
            return result.bearerTypes[0];
        }
    }
    return -1;
}

globalThis.vibrate = (duration: number) => {
    console.log('begin to vibrate, duration is.' + duration);
    try {
        vibrator.startVibration({
            type: 'time',
            duration: duration * 1000
        }, {
            id: 0,
            usage: 'alarm'
        }, (error) => {
            if (error) {
                console.error('vibrate fail, error.code: ' + error.code + 'error.message: ' + error.message);
                return error.code;
            }
            console.log('Vibration start sucessful.');
            return 0;
        });
      } catch (err) {
        console.error('errCode: ' + err.code + ' ,msg: ' + err.message);
      }
}

globalThis.initScreenInfo = () => {
    display.getDefaultDisplaySync().getCutoutInfo().then((data) => {
        if (data.boundingRects.length == 0) {
            return;
        }
        cutOut.left = data.boundingRects[0].left;
        cutOut.top = data.boundingRects[0].top;
        cutOut.width = data.boundingRects[0].width;
        cutOut.height = data.boundingRects[0].height;

        sceneInfo.width = display.getDefaultDisplaySync().width;
        sceneInfo.height = display.getDefaultDisplaySync().height;
    }).catch(() => {
        console.log("get cutout info error!");
    });
};
globalThis.initScreenInfo();

globalThis.getCutoutToTop = () => {
    if(!cutOut.height) {
        return 0;
    }

    return cutOut.top + cutOut.height;
}

globalThis.getCutoutToRight = () => {
    if(!sceneInfo.width) {
        return 0;
    }

    return sceneInfo.width - cutOut.left;
}

globalThis.getCutoutToBottom = () => {
    if(!sceneInfo.height) {
        return 0;
    }

    return sceneInfo.height - cutOut.top;
}

globalThis.getCutoutToLeft = () => {
    if(!cutOut.width) {
        return 0;
    }

    return cutOut.left + cutOut.width;
}

globalThis.getAvoidSide = () => {
    if (!sceneInfo.width || !sceneInfo.height) {
        console.log("get scene info error!");
        return -1;
    }

    // Calculate which side to yield by the yield area, return 0 means the yield area is top;return 1 means right; return 2 means bottom; return 3 means left
    let upAvoidArea = sceneInfo.width * (cutOut.top + cutOut.height);
    let minIndex = 0;
    let minAvoidArea = upAvoidArea;

    let rightAvoidArea = sceneInfo.height * (sceneInfo.width - cutOut.left);
    if (rightAvoidArea < minAvoidArea) {
        minAvoidArea = rightAvoidArea;
        minIndex = 1;
    }

    let bottomAvoidArea = sceneInfo.width * (sceneInfo.height - cutOut.top);
    if (bottomAvoidArea < minAvoidArea) {
        minAvoidArea = bottomAvoidArea;
        minIndex = 2;
    }

    let leftAvoidArea = sceneInfo.height * (cutOut.left + cutOut.width);
    if (leftAvoidArea < minAvoidArea) {
        minIndex = 3
    }

    return minIndex;
}