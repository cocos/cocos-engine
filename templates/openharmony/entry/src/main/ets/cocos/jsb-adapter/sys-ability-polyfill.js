import display from '@ohos.display';
import i18n from '@ohos.i18n'
import deviceInfo from '@ohos.deviceInfo'
import batteryInfo from '@ohos.batteryInfo';
import sensor from '@ohos.sensor';
import hilog from '@ohos.hilog';

window.oh = {};

module.exports = function systemReady () {
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

let sDeviceMotionValues = {};
try {
    sensor.on(sensor.SensorId.ACCELEROMETER, function (data) {
        sDeviceMotionValues[0] = data.x;
        sDeviceMotionValues[1] = data.y;
        sDeviceMotionValues[2] = data.z;
    },
        { interval: 10000000000 }
    );
} catch (err) {
    sDeviceMotionValues[0] = 0;
    sDeviceMotionValues[1] = 0;
    sDeviceMotionValues[2] = 0;
}

try {
    sensor.on(sensor.SensorId.LINEAR_ACCELEROMETER,function(data){
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
    sensor.on(sensor.SensorId.GYROSCOPE,function(data){
        sDeviceMotionValues[6] = data.x;
        sDeviceMotionValues[7] = data.y;
        sDeviceMotionValues[8] = data.z;
    },
        {interval: 10000000000}
    );
} catch (err) {
    sDeviceMotionValues[7] = 0;
    sDeviceMotionValues[8] = 0;
    sDeviceMotionValues[9] = 0;
}

window.getDeviceMotionValue = function () {
    return sDeviceMotionValues;
}
