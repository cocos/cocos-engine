import TouchEvent from "./TouchEvent"
import _weakMap from "./util/WeakMap"
import DeviceMotionEvent from "./DeviceMotionEvent";

let _listenerStat = {};
let _onTouchStart = function (e) {
    let event = new TouchEvent("touchstart");
    window.dispatchEvent(Object.assign(event, e));
};
let _onTouchMove = function (e) {
    let event = new TouchEvent("touchmove");
    window.dispatchEvent(Object.assign(event, e));
};
let _onTouchCancel = function (e) {
    let event = new TouchEvent("touchcancel");
    window.dispatchEvent(Object.assign(event, e));
};
let _onTouchEnd = function (e) {
    let event = new TouchEvent("touchend");
    window.dispatchEvent(Object.assign(event, e));
};
let _onAccelerometerChange = function (e) {
    let event = new DeviceMotionEvent(e);
    window.dispatchEvent(event);
};

export default class EventTarget {
    constructor() {
        _weakMap.set(this, {})
    }

    addEventListener(type, listener, options = {}) {
        let events = _weakMap.get(this);

        if (!events) {
            _weakMap.set(this, events = {})
        }
        if (!events[type]) {
            events[type] = []
        }
        let listenerArray = events[type];
        let length = listenerArray;
        for (let index = 0; index < length; ++length) {
            if (listenerArray[index] === listener) {
                return;
            }
        }
        listenerArray.push(listener);
        if (_listenerStat[type]) {
            ++_listenerStat[type];
        } else {
            _listenerStat[type] = 1;
            switch (type) {
                case "touchstart": {
                    jsb.onTouchStart(_onTouchStart);
                    break;
                }
                case "touchmove": {
                    jsb.onTouchMove(_onTouchMove);
                    break;
                }
                case "touchcancel": {
                    jsb.onTouchCancel(_onTouchCancel);
                    break;
                }
                case "touchend": {
                    jsb.onTouchEnd(_onTouchEnd);
                    break;
                }
                case "devicemotion": {
                    jsb.onAccelerometerChange(_onAccelerometerChange);
                    jsb.device.setMotionEnabled(true);
                    break;
                }
            }
        }

        if (options.capture) {
            // console.warn('EventTarget.addEventListener: options.capture is not implemented.')
        }
        if (options.once) {
            // console.warn('EventTarget.addEventListener: options.once is not implemented.')
        }
        if (options.passive) {
            // console.warn('EventTarget.addEventListener: options.passive is not implemented.')
        }
    }

    removeEventListener(type, listener) {
        const events = _weakMap.get(this);

        if (events) {
            const listeners = events[type];

            if (listeners && listeners.length > 0) {
                for (let i = listeners.length; i--; i > 0) {
                    if (listeners[i] === listener) {
                        listeners.splice(i, 1);
                        if (--_listenerStat[type] === 0) {
                            switch (type) {
                                case "touchstart": {
                                    jsb.offTouchStart(_onTouchStart);
                                    break;
                                }
                                case "touchmove": {
                                    jsb.offTouchMove(_onTouchMove);
                                    break;
                                }
                                case "touchcancel": {
                                    jsb.offTouchCancel(_onTouchCancel);
                                    break;
                                }
                                case "touchend": {
                                    jsb.offTouchEnd(_onTouchEnd);
                                    break;
                                }
                                case "devicemotion": {
                                    jsb.offAccelerometerChange(_onAccelerometerChange);
                                    jsb.device.setMotionEnabled(false);
                                    break;
                                }
                            }
                        }
                        break
                    }
                }
            }
        }
    }

    dispatchEvent(event = {}) {
        event._target = event._currentTarget = this;
        if (event instanceof TouchEvent) {
            let toucheArray = event.touches;
            let length = toucheArray.length;
            for (let index = 0; index < length; ++index) {
                toucheArray[index].target = this;
            }
            toucheArray = event.changedTouches;
            length = toucheArray.length;
            for (let index = 0; index < length; ++index) {
                toucheArray[index].target = this;
            }
        }
        let callback = this["on" + event.type];
        if (typeof callback === "function") {
            callback.call(this, event);
        }
        let events = _weakMap.get(this);
        if (events) {
            const listeners = events[event.type];
            if (listeners) {
                for (let i = 0; i < listeners.length; i++) {
                    listeners[i].call(this, event)
                }
            }
        }
        event._target = event._currentTarget = null;

        return true;
    }
}