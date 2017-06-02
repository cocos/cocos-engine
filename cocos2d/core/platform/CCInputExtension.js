/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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

if (!cc.ClassManager) {
    require("./_CCClass");
}

var inputManager = require("./CCInputManager");

inputManager.__instanceId = cc.ClassManager.getNewInstanceId();

/**
 * whether enable accelerometer event
 * @method setAccelerometerEnabled
 * @param {Boolean} isEnable
 */
inputManager.setAccelerometerEnabled = function(isEnable){
    var _t = this;
    if(_t._accelEnabled === isEnable)
        return;

    _t._accelEnabled = isEnable;
    var scheduler = cc.director.getScheduler();
    if(_t._accelEnabled){
        _t._accelCurTime = 0;
        scheduler.scheduleUpdate(_t);
    } else {
        _t._accelCurTime = 0;
        scheduler.scheduleUpdate(_t);
    }
};

/**
 * set accelerometer interval value
 * @method setAccelerometerInterval
 * @param {Number} interval
 */
inputManager.setAccelerometerInterval = function(interval){
    if (this._accelInterval !== interval) {
        this._accelInterval = interval;
    }
};

inputManager._registerKeyboardEvent = function(){
    cc.game.canvas.addEventListener("keydown", function (e) {
        cc.eventManager.dispatchEvent(new cc.Event.EventKeyboard(e.keyCode, true));
        e.stopPropagation();
        e.preventDefault();
    }, false);
    cc.game.canvas.addEventListener("keyup", function (e) {
        cc.eventManager.dispatchEvent(new cc.Event.EventKeyboard(e.keyCode, false));
        e.stopPropagation();
        e.preventDefault();
    }, false);
};

inputManager._registerAccelerometerEvent = function(){
    var w = window, _t = this;
    _t._acceleration = new cc.Acceleration();
    _t._accelDeviceEvent = w.DeviceMotionEvent || w.DeviceOrientationEvent;

    //TODO fix DeviceMotionEvent bug on QQ Browser version 4.1 and below.
    if (cc.sys.browserType === cc.sys.BROWSER_TYPE_MOBILE_QQ)
        _t._accelDeviceEvent = window.DeviceOrientationEvent;

    var _deviceEventType = (_t._accelDeviceEvent === w.DeviceMotionEvent) ? "devicemotion" : "deviceorientation";
    var ua = navigator.userAgent;
    if (/Android/.test(ua) || (/Adr/.test(ua) && cc.sys.browserType === cc.BROWSER_TYPE_UC)) {
        _t._minus = -1;
    }

    w.addEventListener(_deviceEventType, _t.didAccelerate.bind(_t), false);
};

inputManager.didAccelerate = function (eventData) {
    var _t = this, w = window;
    if (!_t._accelEnabled)
        return;

    var mAcceleration = _t._acceleration;

    var x, y, z;

    if (_t._accelDeviceEvent === window.DeviceMotionEvent) {
        var eventAcceleration = eventData["accelerationIncludingGravity"];
        x = _t._accelMinus * eventAcceleration.x * 0.1;
        y = _t._accelMinus * eventAcceleration.y * 0.1;
        z = eventAcceleration.z * 0.1;
    } else {
        x = (eventData["gamma"] / 90) * 0.981;
        y = -(eventData["beta"] / 90) * 0.981;
        z = (eventData["alpha"] / 90) * 0.981;
    }

    mAcceleration.x = x;
    mAcceleration.y = y;
    mAcceleration.z = z;

    mAcceleration.timestamp = eventData.timeStamp || Date.now();

    var tmpX = mAcceleration.x;
    if(w.orientation === cc.macro.WEB_ORIENTATION_LANDSCAPE_RIGHT){
        mAcceleration.x = -mAcceleration.y;
        mAcceleration.y = tmpX;
    }else if(w.orientation === cc.macro.WEB_ORIENTATION_LANDSCAPE_LEFT){
        mAcceleration.x = mAcceleration.y;
        mAcceleration.y = -tmpX;
    }else if(w.orientation === cc.macro.WEB_ORIENTATION_PORTRAIT_UPSIDE_DOWN){
        mAcceleration.x = -mAcceleration.x;
        mAcceleration.y = -mAcceleration.y;
    }
    // fix android acc values are opposite
    if (!CC_JSB && cc.sys.os === cc.sys.OS_ANDROID &&
        cc.sys.browserType !== cc.sys.BROWSER_TYPE_MOBILE_QQ) {
        mAcceleration.x = -mAcceleration.x;
        mAcceleration.y = -mAcceleration.y;
    }
};