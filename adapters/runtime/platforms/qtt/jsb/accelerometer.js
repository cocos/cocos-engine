let _rt = loadRuntime();
let _systemInfo = _rt.getSystemInfoSync();
let _listeners = [];
window.jsb = window.jsb || {};
jsb.device = jsb.device || {};

if (_rt.offAccelerometerChange) {
    // runtime v2
    let _alpha = 0.8;
    let _gravity = [0, 0, 0];
    let _onAccelerometerChange;
    let _dispatchEvent = function (data) {
        // Isolate the force of gravity with the low-pass filter.
        _gravity[0] = _alpha * _gravity[0] + (1 - _alpha) * data.x;
        _gravity[1] = _alpha * _gravity[1] + (1 - _alpha) * data.y;
        _gravity[2] = _alpha * _gravity[2] + (1 - _alpha) * data.z;
        _listeners.forEach(function (listener) {
            listener({
                // Remove the gravity contribution with the high-pass filter.
                acceleration: {
                    x: data.x - _gravity[0],
                    y: data.y - _gravity[1],
                    z: data.z - _gravity[2]
                },
                accelerationIncludingGravity: {
                    x: data.x,
                    y: data.y,
                    z: data.z
                }
            });
        });
    };
    if (_systemInfo.platform.toLowerCase() === "android") {
        // 调整坐标系 + 适配 web 标准
        _onAccelerometerChange= function (data) {
            data.x *= -10;
            data.y *= -10;
            data.z *= -10;
            _dispatchEvent(data);
        };
    } else {
        // 适配 web 标准
        _onAccelerometerChange= function (data) {
            data.x *= 10;
            data.y *= 10;
            data.z *= 10;
            _dispatchEvent(data);
        };
    }

    jsb.onAccelerometerChange = function (listener) {
        if (typeof listener === "function") {
            let length = _listeners.length;
            for (let index = 0; index < length; ++index) {
                if (listener === _listeners[index]) {
                    return;
                }
            }
            _listeners.push(listener);
            if (length === 0) {
                _rt.onAccelerometerChange(_onAccelerometerChange);
            }
        }
    };
    jsb.offAccelerometerChange = function (listener) {
        let length = _listeners.length;
        for (let index = 0; index < length; ++index) {
            if (listener === _listeners[index]) {
                _listeners.splice(index, 1);
                if (length === 1) {
                    _rt.offAccelerometerChange(_onAccelerometerChange);
                }
                return;
            }
        }
    };

    jsb.device.setMotionEnabled = function (enable) {
        if (enable) {
            _rt.startAccelerometer({type: "accelerationIncludingGravity"});
        } else {
            _rt.stopAccelerometer({});
        }
    };
} else {
    // runtime v1
    jsb.onAccelerometerChange = function (listener) {
        if (typeof listener === "function") {
            let length = _listeners.length;
            for (let index = 0; index < length; ++index) {
                if (listener === _listeners[index]) {
                    return;
                }
            }
            _listeners.push(listener);
        }
    };
    jsb.offAccelerometerChange = function (listener) {
        let length = _listeners.length;
        for (let index = 0; index < length; ++index) {
            if (listener === _listeners[index]) {
                _listeners.splice(index, 1);
                return;
            }
        }
    };

    jsb.device.dispatchDeviceMotionEvent = function (event) {
        _listeners.forEach(function (listener) {
            listener(event);
        });
    }
}