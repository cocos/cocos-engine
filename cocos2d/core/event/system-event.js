/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

var EventTarget = require('../event/event-target');
var eventManager = require('../event-manager');
var inputManger = require('../platform/CCInputManager');;

/**
 * !#en The event type supported by SystemEvent
 * !#zh SystemEvent 支持的事件类型
 * @class SystemEvent.EventType
 * @static
 * @namespace SystemEvent
 */
var EventType = cc.Enum({
    /**
     * !#en The event type for press the key down event, you can use its value directly: 'keydown'
     * !#zh 当按下按键时触发的事件
     * @property KEY_DOWN
     * @type {String}
     * @static
     */
    KEY_DOWN: 'keydown',
    /**
     * !#en The event type for press the key up event, you can use its value directly: 'keyup'
     * !#zh 当松开按键时触发的事件
     * @property KEY_UP
     * @type {String}
     * @static
     */
    KEY_UP: 'keyup',
    /**
     * !#en The event type for press the devicemotion event, you can use its value directly: 'devicemotion'
     * !#zh 重力感应
     * @property DEVICEMOTION
     * @type {String}
     * @static
     */
    DEVICEMOTION: 'devicemotion'

});

/**
 * !#en
 * The System event, it currently supports keyboard events and accelerometer events.<br>
 * You can get the SystemEvent instance with cc.systemEvent.<br>
 * !#zh
 * 系统事件，它目前支持按键事件和重力感应事件。<br>
 * 你可以通过 cc.systemEvent 获取到 SystemEvent 的实例。<br>
 * @class SystemEvent
 * @extends EventTarget
 * @example
 * cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 * cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
 */

var keyboardListener = null;
var accelerationListener = null;
var SystemEvent = cc.Class({
    name: 'SystemEvent',
    extends: EventTarget,

    statics: {
        EventType: EventType
    },

    /**
     * !#en whether enable accelerometer event
     * !#zh 是否启用加速度计事件
     * @method setAccelerometerEnabled
     * @param {Boolean} isEnable
     */
    setAccelerometerEnabled: function (isEnable) {
        if (CC_EDITOR) {
            return;
        }
        inputManger.setAccelerometerEnabled(isEnable);
    },

    /**
     * !#en set accelerometer interval value
     * !#zh 设置加速度计间隔值
     * @method setAccelerometerInterval
     * @param {Number} interval
     */
    setAccelerometerInterval: function(interval) {
        if (CC_EDITOR) {
            return;
        }
        inputManger.setAccelerometerInterval(interval);
    },

    on: function (type, callback, target, once) {
        if (CC_EDITOR) {
            return;
        }
        this._super(type, callback, target, once);

        // Keyboard
        if (type === EventType.KEY_DOWN || type === EventType.KEY_UP) {
            if (!keyboardListener) {
                keyboardListener = cc.EventListener.create({
                    event: cc.EventListener.KEYBOARD,
                    onKeyPressed: function (keyCode, event) {
                        event.type = EventType.KEY_DOWN;
                        cc.systemEvent.dispatchEvent(event);
                    },
                    onKeyReleased: function (keyCode, event) {
                        event.type = EventType.KEY_UP;
                        cc.systemEvent.dispatchEvent(event);
                    }
                });
            }
            if (!eventManager.hasEventListener(cc.EventListener.ListenerID.KEYBOARD)) {
                eventManager.addListener(keyboardListener, 1);
            }
        }

        // Acceleration
        if (type === EventType.DEVICEMOTION) {
            if (!accelerationListener) {
                accelerationListener = cc.EventListener.create({
                    event: cc.EventListener.ACCELERATION,
                    callback: function (acc, event) {
                        event.type = EventType.DEVICEMOTION;
                        cc.systemEvent.dispatchEvent(event);
                    }
                });
            }
            if (!eventManager.hasEventListener(cc.EventListener.ListenerID.ACCELERATION)) {
                eventManager.addListener(accelerationListener, 1);
            }
        }
    },


    off: function (type, callback, target) {
        if (CC_EDITOR) {
            return;
        }
        this._super(type, callback, target);

        // Keyboard
        if (keyboardListener && (type === EventType.KEY_DOWN || type === EventType.KEY_UP)) {
            var hasKeyDownEventListener = this.hasEventListener(EventType.KEY_DOWN);
            var hasKeyUpEventListener = this.hasEventListener(EventType.KEY_UP);
            if (!hasKeyDownEventListener && !hasKeyUpEventListener) {
                eventManager.removeListener(keyboardListener);
            }
        }

        // Acceleration
        if (accelerationListener && type === EventType.DEVICEMOTION) {
            eventManager.removeListener(accelerationListener);
        }
    }

});

cc.SystemEvent = module.exports = SystemEvent;
/**
 * @module cc
 */

/**
 * !#en The System event singleton for global usage
 * !#zh 系统事件单例，方便全局使用
 * @property systemEvent
 * @type {SystemEvent}
 */
cc.systemEvent = new cc.SystemEvent();
