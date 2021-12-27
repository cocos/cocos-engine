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
import { legacyCC } from '../global-exports';

export type JsCallback = (arg: string) => void;
class JsEventHandler {
    //public
    /**
     * Method to set callback with an event name
     * should be triggered if the event is called by native function on JAVA or Objective-C etc.
     */
    public addCallback (event: string, callback: JsCallback): void {
        if (!this.eventMap.get(event)) {
            this.eventMap.set(event, new Array<JsCallback>());
        }
        this.eventMap.get(event)?.push(callback);
    }
    /**
     * Trigger native event on JAVA or Objective-C with a string type argeter
     */
    public sendToNative (event: string, arg?: string) {
        jsb.bridge.sendToNative(event, arg);
    }
    /**
     * Remove callback for certain event.
     * @param event event to delete
     * @returns
     */
    public removeEvent (event: string): boolean {
        if (!this.eventMap.get(event)) {
            return true;
        }
        this.eventMap.get(event)?.splice(0, this.eventMap.get(event)?.length);
        return this.eventMap.delete(event);
    }
    /**
     * remove a callback for certain event
     */
    public removeCallback (event: string, cb: JsCallback): boolean {
        const arr = this.eventMap.get(event);
        if (!arr) {
            return false;
        }
        for (let i = 0, l = arr.length; i < l; i++) {
            if (arr[i] === cb) {
                arr.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    public static getInstance () {
        if (!JsEventHandler.instance) {
            JsEventHandler.instance = new JsEventHandler();
        }
        return JsEventHandler.instance;
    }
    private constructor () {
        this.eventMap = new Map();
        JsEventHandler.instance = this;
        jsb.bridge.onNative = (methodName: string, arg1?: string | null) => {
            console.log(`Trigger event: ${methodName} with argeter: ${arg1!}`);
            JsEventHandler.instance.triggerEvent(methodName, arg1!);
        };
    }
    private triggerEvent (event: string, arg: string) {
        if (!this.eventMap.get(event)) {
            console.log(`Function ${event} not exist`);
        }
        const arr = this.eventMap.get(event);
        arr?.map((f) => f.call(null, arg));
    }
    private eventMap: Map<string, Array<JsCallback>>;
    private static instance: JsEventHandler;
}
export const jsEventHandler =  legacyCC.jsEventHandler = JsEventHandler.getInstance();
