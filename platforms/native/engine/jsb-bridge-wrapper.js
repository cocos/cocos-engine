/****************************************************************************
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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
const JsbBridgeWrapper = {
    eventMap: new Map(),
    addNativeEventListener (eventName, listener) {
        if (!this.eventMap.get(eventName)) {
            this.eventMap.set(eventName, []);
        }
        const arr = this.eventMap.get(eventName);
        if (!arr.find(listener)) {
            arr.push(listener);
        }
    },
    dispatchEventToNative (eventName, arg) {
        jsb.bridge.sendToNative(eventName, arg);
    },
    removeAllListenersForEvent (eventName) {
        return this.eventMap.delete(eventName);
    },
    removeNativeEventListener (eventName, listener) {
        const arr = this.eventMap.get(eventName);
        if (!arr) {
            return false;
        }
        for (let i = 0, l = arr.length; i < l; i++) {
            if (arr[i] === listener) {
                arr.splice(i, 1);
                return true;
            }
        }
        return true;
    },
    removeAllListeners () {
        this.eventMap.clear();
    },
    triggerEvent (eventName, arg) {
        const arr = this.eventMap.get(eventName);
        if (!arr) {
            console.error(`${eventName} does not exist`);
            return;
        }
        arr.map((listener) => listener.call(null, arg));
    },
};

Object.defineProperty(jsb, 'jsbBridgeWrapper', {
    get () {
        if (jsb.__JsbBridgeWrapper !== undefined) return jsb.__JsbBridgeWrapper;

        if (window.ScriptNativeBridge && cc.sys.os === cc.sys.OS.ANDROID || cc.sys.os === cc.sys.OS.IOS || cc.sys.os === cc.sys.OS.OSX) {
            jsb.__JsbBridgeWrapper = JsbBridgeWrapper;
            jsb.bridge.onNative = (methodName, arg1) => {
                console.log(`Trigger event: ${methodName} with argeter: ${arg1}`);
                jsb.__JsbBridgeWrapper.triggerEvent(methodName, arg1);
            };
        } else {
            jsb.__JsbBridgeWrapper = null;
        }
        return jsb.__JsbBridgeWrapper;
    },
    enumerable: true,
    configurable: true,
    set (value) {
        jsb.__JsbBridgeWrapper = value;
    },
});
