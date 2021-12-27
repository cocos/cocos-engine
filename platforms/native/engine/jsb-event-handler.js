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
const JsEventHandler = {
    eventMap: new Map(),
    /**
     * Method to set callback with an event name
     * should be triggered if the event is called by native function on JAVA or Objective-C etc.
     */
    addCallback (event, callback) {
        const _a = this.eventMap.get(event);
        if (!_a) {
            this.eventMap.set(event, []);
        }
        this.eventMap.get(event).push(callback);
    },
    /**
     * Trigger native event on JAVA or Objective-C with a string type argeter
     */
    dispatchNativeEvent (event, arg) {
        jsb.bridge.sendToNative(event, arg);
    },
    /**
     * Remove callback for certain event.
     * @param event event to delete
     * @returns
     */
    removeEvent (event) {
        const _a = this.eventMap.get(event);
        if (!_a) {
            return true;
        }
        _a.splice(0, _a.length);
        return this.eventMap.delete(event);
    },
    /**
     * remove a callback for certain event
     */
    removeCallback (event, cb) {
        if (!this.eventMap.get(event)) {
            return false;
        }
        const arr = this.eventMap.get(event);
        for (let i = 0, l = arr.length; i < l; i++) {
            if (arr[i] === cb) {
                arr.splice(i, 1);
                return true;
            }
        }
        return false;
    },
    triggerEvent (event, arg) {
        if (!this.eventMap.get(event)) {
            console.error(`${event} does not exist`);
            return;
        }
        const arr = this.eventMap.get(event);
        arr.map((f) => f.call(null, arg));
    },
};

Object.defineProperty(jsb, 'jsEventHandler', {
    get () {
        if (jsb.__jsEventHandler !== undefined) return jsb.__jsEventHandler;

        if (window.ScriptNativeBridge && cc.sys.os === cc.sys.OS.ANDROID || cc.sys.os === cc.sys.OS.IOS || cc.sys.os === cc.sys.OS.OSX) {
            jsb.__jsEventHandler = JsEventHandler;
            jsb.bridge.onNative = (methodName, arg1) => {
                console.log(`Trigger event: ${methodName} with argeter: ${arg1}`);
                jsb.__jsEventHandler.triggerEvent(methodName, arg1);
            };
        } else {
            jsb.__jsEventHandler = null;
        }
        return jsb.__jsEventHandler;
    },
    enumerable: true,
    configurable: true,
    set (value) {
        jsb.__jsEventHandler = value;
    },
});
