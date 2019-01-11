/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const eventManager = require('../event-manager');
const inputManager = require("./CCInputManager");

const PORTRAIT = 0;
const LANDSCAPE_LEFT = -90;
const PORTRAIT_UPSIDE_DOWN = 180;
const LANDSCAPE_RIGHT = 90;

let _didAccelerateFun;

/**
 * !#en the device accelerometer reports values for each axis in units of g-force.
 * !#zh 设备重力传感器传递的各个轴的数据。
 * @class Acceleration
 * @method constructor
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @param {Number} timestamp
 */
cc.Acceleration = function (x, y, z, timestamp) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.timestamp = timestamp || 0;
};

/**
 * whether enable accelerometer event
 * @method setAccelerometerEnabled
 * @param {Boolean} isEnable
 */
inputManager.setAccelerometerEnabled = function (isEnable) {
    let _t = this;
    if(_t._accelEnabled === isEnable)
        return;

    _t._accelEnabled = isEnable;
    let scheduler = cc.director.getScheduler();
    scheduler.enableForTarget(_t);
    if (_t._accelEnabled) {
        _t._registerAccelerometerEvent();
        _t._accelCurTime = 0;
        scheduler.scheduleUpdate(_t);
    } else {
        _t._unregisterAccelerometerEvent();
        _t._accelCurTime = 0;
        scheduler.unscheduleUpdate(_t);
    }

    if (CC_JSB || CC_RUNTIME) {
        jsb.device.setMotionEnabled(isEnable);
    }
};

/**
 * set accelerometer interval value
 * @method setAccelerometerInterval
 * @param {Number} interval
 */
inputManager.setAccelerometerInterval = function (interval) {
    if (this._accelInterval !== interval) {
        this._accelInterval = interval;

        if (CC_JSB || CC_RUNTIME) {
            jsb.device.setMotionInterval(interval);
        }
    }
};

inputManager._registerKeyboardEvent = function () {
    cc.game.canvas.addEventListener("keydown", function (e) {
        eventManager.dispatchEvent(new cc.Event.EventKeyboard(e.keyCode, true));
        e.stopPropagation();
        e.preventDefault();
    }, false);
    cc.game.canvas.addEventListener("keyup", function (e) {
        eventManager.dispatchEvent(new cc.Event.EventKeyboard(e.keyCode, false));
        e.stopPropagation();
        e.preventDefault();
    }, false);
};

inputManager._registerAccelerometerEvent = function () {
    let w = window, _t = this;
    _t._acceleration = new cc.Acceleration();
    _t._accelDeviceEvent = w.DeviceMotionEvent || w.DeviceOrientationEvent;

    //TODO fix DeviceMotionEvent bug on QQ Browser version 4.1 and below.
    if (cc.sys.browserType === cc.sys.BROWSER_TYPE_MOBILE_QQ)
        _t._accelDeviceEvent = window.DeviceOrientationEvent;

    let _deviceEventType = (_t._accelDeviceEvent === w.DeviceMotionEvent) ? "devicemotion" : "deviceorientation";
    let ua = navigator.userAgent;
    if (/Android/.test(ua) || (/Adr/.test(ua) && cc.sys.browserType === cc.BROWSER_TYPE_UC)) {
        _t._minus = -1;
    }

    _didAccelerateFun = _t.didAccelerate.bind(_t);
    w.addEventListener(_deviceEventType, _didAccelerateFun, false);
};

inputManager._unregisterAccelerometerEvent = function () {
    let w = window, _t = this;
    let _deviceEventType = (_t._accelDeviceEvent === w.DeviceMotionEvent) ? "devicemotion" : "deviceorientation";
    if (_didAccelerateFun) {
        w.removeEventListener(_deviceEventType, _didAccelerateFun, false);
    }
};

inputManager.didAccelerate = function (eventData) {
    let _t = this, w = window;
    if (!_t._accelEnabled)
        return;

    let mAcceleration = _t._acceleration;

    let x, y, z;

    if (_t._accelDeviceEvent === window.DeviceMotionEvent) {
        let eventAcceleration = eventData["accelerationIncludingGravity"];
        x = _t._accelMinus * eventAcceleration.x * 0.1;
        y = _t._accelMinus * eventAcceleration.y * 0.1;
        z = eventAcceleration.z * 0.1;
    } else {
        x = (eventData["gamma"] / 90) * 0.981;
        y = -(eventData["beta"] / 90) * 0.981;
        z = (eventData["alpha"] / 90) * 0.981;
    }

    if (cc.view._isRotated) {
        let tmp = x;
        x = -y;
        y = tmp;
    }
    mAcceleration.x = x;
    mAcceleration.y = y;
    mAcceleration.z = z;

    mAcceleration.timestamp = eventData.timeStamp || Date.now();

    let tmpX = mAcceleration.x;
    if (w.orientation === LANDSCAPE_RIGHT) {
        mAcceleration.x = -mAcceleration.y;
        mAcceleration.y = tmpX;
    } else if (w.orientation === LANDSCAPE_LEFT) {
        mAcceleration.x = mAcceleration.y;
        mAcceleration.y = -tmpX;
    } else if (w.orientation === PORTRAIT_UPSIDE_DOWN) {
        mAcceleration.x = -mAcceleration.x;
        mAcceleration.y = -mAcceleration.y;
    }
    // fix android acc values are opposite
    if (cc.sys.os === cc.sys.OS_ANDROID &&
        cc.sys.browserType !== cc.sys.BROWSER_TYPE_MOBILE_QQ) {
        mAcceleration.x = -mAcceleration.x;
        mAcceleration.y = -mAcceleration.y;
    }
};