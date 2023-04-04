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
import i18n from '@ohos.i18n'
import deviceInfo from '@ohos.deviceInfo'
import batteryInfo from '@ohos.batteryInfo';
import sensor from '@ohos.sensor';

export function systemReady () {
    return new Promise(resolve => {
        if (typeof XMLHttpRequest === 'undefined') {
            window.XMLHttpRequest = function () {}
        }
        display.getDefaultDisplay((err, data) => {
            window.oh.display = data;
            // TODO: impl device in js.
            //https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-display-0000001281001106
        });
        resolve();
    })

}

window.getSystemLanguage = function () {
    return i18n.getSystemLanguage();
}

window.getOSFullName = function () {
    return deviceInfo.osFullName;
}

window.getBatteryLevel = function () {
    return batteryInfo.batterySOC;
}

window.getDPI = function () {
    var displayClass = display.getDefaultDisplaySync();
    return displayClass.densityDPI;
}

window.getPixelRation = function () {
    var displayClass = display.getDefaultDisplaySync();
    return displayClass.densityPixels;
}

window.getDeviceOrientation = function () {
    var displayClass = display.getDefaultDisplaySync();
    return displayClass.rotation;
}

function radiansToDegrees(radians)  {
    var pi = Math.PI;
    return radians * (180/pi);
}


let sDeviceMotionValues = [];
try {
    sensor.on(sensor.SensorType.SENSOR_TYPE_ID_ACCELEROMETER, function (data) {
        sDeviceMotionValues[0] = data.x;
        sDeviceMotionValues[1] = data.y;
        sDeviceMotionValues[2] = -data.z;
    },
        { interval: 10000000000 }
    );
} catch (err) {
    sDeviceMotionValues[0] = 0;
    sDeviceMotionValues[1] = 0;
    sDeviceMotionValues[2] = 0;
}

try {
    // TODO(qgh):Must pass values, macros have been renamed and can cause problems with linear sensors
    //sensor.on(sensor.SensorType.SENSOR_TYPE_ID_LINEAR_ACCELEROMETER,function(data){
    sensor.on(258,function(data){
        sDeviceMotionValues[3] = data.x;
        sDeviceMotionValues[4] = data.y;
        sDeviceMotionValues[5] = data.z;
    },
        {interval: 10000000000}
    );
} catch (err) {
    sDeviceMotionValues[3] = 0;
    sDeviceMotionValues[4] = 0;
    sDeviceMotionValues[5] = 0;
}
try {
    sensor.on(sensor.SensorType.SENSOR_TYPE_ID_GYROSCOPE,function(data){
        sDeviceMotionValues[6] = radiansToDegrees(data.x);
        sDeviceMotionValues[7] = radiansToDegrees(data.y);
        sDeviceMotionValues[8] = radiansToDegrees(data.z);
    },
        {interval: 10000000000}
    );
} catch (err) {
    sDeviceMotionValues[6] = 0;
    sDeviceMotionValues[7] = 0;
    sDeviceMotionValues[8] = 0;
}
// Keep this, in the master branch, this interface has been replaced.
//try {
//    sensor.on(sensor.SensorId.ACCELEROMETER, function (data) {
//        sDeviceMotionValues[0] = data.x;
//        sDeviceMotionValues[1] = data.y;
//        sDeviceMotionValues[2] = data.z;
//    },
//        { interval: 10000000000 }
//    );
//} catch (err) {
//    sDeviceMotionValues[0] = 0;
//    sDeviceMotionValues[1] = 0;
//    sDeviceMotionValues[2] = 0;
//}
//
//try {
//    sensor.on(sensor.SensorId.LINEAR_ACCELEROMETER,function(data){
//        sDeviceMotionValues[3] = data.x;
//        sDeviceMotionValues[4] = data.y;
//        sDeviceMotionValues[5] = data.z;
//    },
//        {interval: 10000000000}
//    );
//} catch (err) {
//    sDeviceMotionValues[3] = 0;
//    sDeviceMotionValues[4] = 0;
//    sDeviceMotionValues[5] = 0;
//}
//try {
//    sensor.on(sensor.SensorId.GYROSCOPE,function(data){
//        sDeviceMotionValues[6] = data.x;
//        sDeviceMotionValues[7] = data.y;
//        sDeviceMotionValues[8] = data.z;
//    },
//        {interval: 10000000000}
//    );
//} catch (err) {
//    sDeviceMotionValues[7] = 0;
//    sDeviceMotionValues[8] = 0;
//    sDeviceMotionValues[9] = 0;
//}

window.getDeviceMotionValue = function () {
    return sDeviceMotionValues;
}
