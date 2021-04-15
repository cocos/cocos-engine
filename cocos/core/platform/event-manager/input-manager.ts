/*
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
*/

/**
 * @packageDocumentation
 * @hidden
 */

import { system } from 'pal/system';
import { JSB, RUNTIME_BASED } from 'internal:constants';
import { Vec2 } from '../../math/index';
import { rect } from '../../math/rect';
import { macro } from '../macro';
import { sys } from '../sys';
import eventManager from './event-manager';
import { EventAcceleration, EventKeyboard, EventMouse, EventTouch } from './events';
import { Touch } from './touch';
import { legacyCC } from '../../global-exports';
import { logID } from '../debug';
import { input, MouseInputEvent, MouseWheelInputEvent, TouchInputEvent } from 'pal/input';
import { Acceleration } from './acceleration';

const TOUCH_TIMEOUT = macro.TOUCH_TIMEOUT;

const PORTRAIT = 0;
const LANDSCAPE_LEFT = -90;
const PORTRAIT_UPSIDE_DOWN = 180;
const LANDSCAPE_RIGHT = 90;

const _vec2 = new Vec2();
const _preLocation = new Vec2();

interface IView {
    _devicePixelRatio: number;
}

/**
 *  This class manages all events of input. include: touch, mouse, accelerometer, keyboard
 */
class InputManager {
    private _isRegisterEvent = false;

    private _preTouchPoint = new Vec2();
    private _prevMousePoint = new Vec2();

    private _preTouchPool: Touch[] = [];
    private _preTouchPoolPointer = 0;

    private _touches: Touch[] = [];
    private _touchesIntegerDict: { [index: number]: number | undefined; } = { };

    private _indexBitsUsed = 0;
    private _maxTouches = 8;

    // TODO: remove this property
    private _glView: IView | null = null;

    //#region Touch Handle
    public handleTouchesBegin (touches: Touch[]) {
        const handleTouches: Touch[] = [];
        const locTouchIntDict = this._touchesIntegerDict;
        for (let i = 0; i < touches.length; ++i) {
            const touch = touches[i];
            const touchID = touch.getID();
            if (touchID === null) {
                continue;
            }
            const index = locTouchIntDict[touchID];
            if (index === undefined) {
                const unusedIndex = this._getUnUsedIndex();
                if (unusedIndex === -1) {
                    logID(2300, unusedIndex);
                    continue;
                }
                // curTouch = this._touches[unusedIndex] = touch;
                touch.getLocation(_vec2);
                const curTouch = new Touch(_vec2.x, _vec2.y, touchID);
                this._touches[unusedIndex] = curTouch;
                touch.getPreviousLocation(_vec2);
                curTouch.setPrevPoint(_vec2);
                locTouchIntDict[touchID] = unusedIndex;
                handleTouches.push(curTouch);
            }
        }
        if (handleTouches.length > 0) {
            // this._glView!._convertTouchesWithScale(handleTouches);
            const touchEvent = new EventTouch(handleTouches, false, EventTouch.BEGAN, macro.ENABLE_MULTI_TOUCH ? this._getUsefulTouches() : handleTouches);
            eventManager.dispatchEvent(touchEvent);
        }
    }

    public handleTouchesMove (touches: Touch[]) {
        const handleTouches: Touch[] = [];
        const locTouches = this._touches;
        for (let i = 0; i < touches.length; ++i) {
            const touch = touches[i];
            const touchID = touch.getID();
            if (touchID === null) {
                continue;
            }
            const index = this._touchesIntegerDict[touchID];
            if (index === undefined) {
                // cc.log("if the index doesn't exist, it is an error");
                continue;
            }
            if (locTouches[index]) {
                touch.getLocation(_vec2);
                locTouches[index].setPoint(_vec2);
                touch.getPreviousLocation(_vec2);
                locTouches[index].setPrevPoint(_vec2);
                handleTouches.push(locTouches[index]);
            }
        }
        if (handleTouches.length > 0) {
            // this._glView!._convertTouchesWithScale(handleTouches);
            const touchEvent = new EventTouch(handleTouches, false, EventTouch.MOVED, macro.ENABLE_MULTI_TOUCH ? this._getUsefulTouches() : handleTouches);
            eventManager.dispatchEvent(touchEvent);
        }
    }

    public handleTouchesEnd (touches: Touch[]) {
        const handleTouches = this.getSetOfTouchesEndOrCancel(touches);
        if (handleTouches.length > 0) {
            // this._glView!._convertTouchesWithScale(handleTouches);
            const touchEvent = new EventTouch(handleTouches, false, EventTouch.ENDED, macro.ENABLE_MULTI_TOUCH ? this._getUsefulTouches() : handleTouches);
            eventManager.dispatchEvent(touchEvent);
        }
        this._preTouchPool.length = 0;
    }

    public handleTouchesCancel (touches: Touch[]) {
        const handleTouches = this.getSetOfTouchesEndOrCancel(touches);
        if (handleTouches.length > 0) {
            // this._glView!._convertTouchesWithScale(handleTouches);
            const touchEvent = new EventTouch(handleTouches, false, EventTouch.CANCELLED, macro.ENABLE_MULTI_TOUCH ? this._getUsefulTouches() : handleTouches);
            eventManager.dispatchEvent(touchEvent);
        }
        this._preTouchPool.length = 0;
    }

    public getSetOfTouchesEndOrCancel (touches: Touch[]) {
        const handleTouches: Touch[] = [];
        const locTouches = this._touches;
        const locTouchesIntDict = this._touchesIntegerDict;
        for (let i = 0; i < touches.length; ++i) {
            const touch = touches[i];
            const touchID = touch.getID();
            if (touchID === null) {
                continue;
            }
            const index = locTouchesIntDict[touchID];
            if (index === undefined) {
                // cc.log("if the index doesn't exist, it is an error");
                continue;
            }
            if (locTouches[index]) {
                touch.getLocation(_vec2);
                locTouches[index].setPoint(_vec2);
                touch.getPreviousLocation(_vec2);
                locTouches[index].setPrevPoint(_vec2);
                handleTouches.push(locTouches[index]);
                this._removeUsedIndexBit(index);
                delete locTouchesIntDict[touchID];
            }
        }
        return handleTouches;
    }

    private _getPreTouch (touch: Touch) {
        let preTouch: Touch | null = null;
        const locPreTouchPool = this._preTouchPool;
        const id = touch.getID();
        for (let i = locPreTouchPool.length - 1; i >= 0; i--) {
            if (locPreTouchPool[i].getID() === id) {
                preTouch = locPreTouchPool[i];
                break;
            }
        }
        if (!preTouch) {
            preTouch = touch;
        }
        return preTouch;
    }

    private _setPreTouch (touch: Touch) {
        let find = false;
        const locPreTouchPool = this._preTouchPool;
        const id = touch.getID();
        for (let i = locPreTouchPool.length - 1; i >= 0; i--) {
            if (locPreTouchPool[i].getID() === id) {
                locPreTouchPool[i] = touch;
                find = true;
                break;
            }
        }
        if (!find) {
            if (locPreTouchPool.length <= 50) {
                locPreTouchPool.push(touch);
            } else {
                locPreTouchPool[this._preTouchPoolPointer] = touch;
                this._preTouchPoolPointer = (this._preTouchPoolPointer + 1) % 50;
            }
        }
    }

    // TODO: remove this private method
    private _getViewPixelRatio () {
        return this._glView ? this._glView._devicePixelRatio : 1;
    }

    private _getTouch (inputEvent: MouseInputEvent): Touch {
        const locPreTouch = this._preTouchPoint;
        const pixelRatio = this._getViewPixelRatio();
        const x = inputEvent.x * pixelRatio;
        const y = inputEvent.y * pixelRatio;
        const touch = new Touch(x, y, 0);
        //  TODO: what if the view is rotated ?
        touch.setPrevPoint(locPreTouch.x, locPreTouch.y);
        locPreTouch.x = x;
        locPreTouch.y = y;
        return touch;
    }

    private _getMouseEvent (inputEvent: MouseInputEvent): EventMouse {
        const locPreMouse = this._prevMousePoint;
        const mouseEvent = new EventMouse(inputEvent.type as number, false, locPreMouse);
        const pixelRatio = this._getViewPixelRatio();
        // update previous location
        locPreMouse.x = inputEvent.x * pixelRatio;
        locPreMouse.y = inputEvent.y * pixelRatio;
        // HACK: maybe it's an HACK operation
        if (legacyCC.GAME_VIEW) {
            locPreMouse.x /= legacyCC.gameView.canvas.width / legacyCC.game.canvas.width;
            locPreMouse.y /= legacyCC.gameView.canvas.height / legacyCC.game.canvas.height;
        }
        mouseEvent.setLocation(locPreMouse.x, locPreMouse.y);
        mouseEvent.setButton(inputEvent.button);
        return mouseEvent;
    }

    private _getTouchList (inputEvent: TouchInputEvent) {
        const touchList: Touch[] = [];
        const locPreTouch = this._preTouchPoint;
        const length = inputEvent.changedTouches.length;
        const pixelRatio = this._getViewPixelRatio();
        for (let i = 0; i < length; i++) {
            let touchData = inputEvent.changedTouches[i];
            let x = touchData.x * pixelRatio;
            let y = touchData.y * pixelRatio;
            // TODO: what if the view is rotated ?
            // TODO: what if touchData.identifier is undefined
            let touch = new Touch(x, y, touchData.identifier);
            // use Touch Pool
            this._getPreTouch(touch).getLocation(_preLocation);
            touch.setPrevPoint(_preLocation.x, _preLocation.y);
            this._setPreTouch(touch);
            // update previous location
            locPreTouch.x = x;
            locPreTouch.y = y;
            touchList.push(touch);

            if (!macro.ENABLE_MULTI_TOUCH) {
                break;
            }
        }
        return touchList;
    }

    private _getUnUsedIndex () {
        let temp = this._indexBitsUsed;
        const now = legacyCC.director.getCurrentTime();

        for (let i = 0; i < this._maxTouches; i++) {
            if (!(temp & 0x00000001)) {
                this._indexBitsUsed |= (1 << i);
                return i;
            } else {
                const touch = this._touches[i];
                if (now - touch.lastModified > TOUCH_TIMEOUT) {
                    this._removeUsedIndexBit(i);
                    const touchID = touch.getID();
                    if (touchID !== null) {
                        delete this._touchesIntegerDict[touchID];
                    }
                    return i;
                }
            }
            temp >>= 1;
        }

        // all bits are used
        return -1;
    }

    private _removeUsedIndexBit (index) {
        if (index < 0 || index >= this._maxTouches) {
            return;
        }

        let temp = 1 << index;
        temp = ~temp;
        this._indexBitsUsed &= temp;
    }

    private _getUsefulTouches () {
        const touches: Touch[] = [];
        const touchDict = this._touchesIntegerDict;
        for (const id in touchDict) {
            const index = parseInt(id);
            const usedID = touchDict[index];
            if (usedID === undefined || usedID === null) {
                continue;
            }

            const touch = this._touches[usedID];
            touches.push(touch);
        }

        return touches;
    }
    //#endregion Touch Handle

    //#region Accelerometer Handle
    /**
     * Whether enable accelerometer event.
     */
    public setAccelerometerEnabled (isEnable: boolean) {
        if (isEnable) {
            input._accelerometer.start();
        }
        else {
            input._accelerometer.stop();
        }
        // if (this._accelEnabled === isEnable) {
        //     return;
        // }

        // this._accelEnabled = isEnable;
        // const scheduler = legacyCC.director.getScheduler();
        // scheduler.enableForTarget(this);
        // if (this._accelEnabled) {
        //     this._registerAccelerometerEvent();
        //     this._accelCurTime = 0;
        //     scheduler.scheduleUpdate(this);
        // } else {
        //     this._unregisterAccelerometerEvent();
        //     this._accelCurTime = 0;
        //     scheduler.unscheduleUpdate(this);
        // }
        
        // if (JSB) {
        //     // @ts-expect-error
        //     jsb.device.setMotionEnabled(isEnable);
        // }
    }

    // public didAccelerate (eventData: DeviceMotionEvent | DeviceOrientationEvent) {
    //     if (!this._accelEnabled) {
    //         return;
    //     }

    //     const mAcceleration = this._acceleration!;

    //     let x = 0;
    //     let y = 0;
    //     let z = 0;

    //     // TODO
    //     if (this._accelDeviceEvent === window.DeviceMotionEvent) {
    //         const deviceMotionEvent = eventData as DeviceMotionEvent;
    //         const eventAcceleration = deviceMotionEvent.accelerationIncludingGravity;
    //         if (eventAcceleration) {
    //             x = this._accelMinus * (eventAcceleration.x || 0) * 0.1;
    //             y = this._accelMinus * (eventAcceleration.y || 0) * 0.1;
    //             z = (eventAcceleration.z || 0) * 0.1;
    //         }
    //     } else {
    //         const deviceOrientationEvent = eventData as DeviceOrientationEvent;
    //         x = ((deviceOrientationEvent.gamma || 0) / 90) * 0.981;
    //         y = -((deviceOrientationEvent.beta || 0) / 90) * 0.981;
    //         z = ((deviceOrientationEvent.alpha || 0) / 90) * 0.981;
    //     }

    //     if (legacyCC.view._isRotated) {
    //         const tmp = x;
    //         x = -y;
    //         y = tmp;
    //     }
    //     mAcceleration.x = x;
    //     mAcceleration.y = y;
    //     mAcceleration.z = z;

    //     mAcceleration.timestamp = eventData.timeStamp || Date.now();

    //     const tmpX = mAcceleration.x;
    //     if (window.orientation === LANDSCAPE_RIGHT) {
    //         mAcceleration.x = -mAcceleration.y;
    //         mAcceleration.y = tmpX;
    //     } else if (window.orientation === LANDSCAPE_LEFT) {
    //         mAcceleration.x = mAcceleration.y;
    //         mAcceleration.y = -tmpX;
    //     } else if (window.orientation === PORTRAIT_UPSIDE_DOWN) {
    //         mAcceleration.x = -mAcceleration.x;
    //         mAcceleration.y = -mAcceleration.y;
    //     }
    //     // fix android acc values are opposite
    //     if (legacyCC.sys.os === legacyCC.sys.OS_ANDROID
    //         && legacyCC.sys.browserType !== legacyCC.sys.BROWSER_TYPE_MOBILE_QQ) {
    //         mAcceleration.x = -mAcceleration.x;
    //         mAcceleration.y = -mAcceleration.y;
    //     }
    // }

    // public update (dt: number) {
    //     if (this._accelCurTime > this._accelInterval) {
    //         this._accelCurTime -= this._accelInterval;
    //         eventManager.dispatchEvent(new EventAcceleration(this._acceleration!));
    //     }
    //     this._accelCurTime += dt;
    // }

    /**
     * set accelerometer interval value
     * @method setAccelerometerInterval
     * @param {Number} interval
     */
    public setAccelerometerInterval (interval) {
        input._accelerometer.setInterval(interval);

            // if (JSB || RUNTIME_BASED) {
            //     // @ts-expect-error
            //     if (jsb.device && jsb.device.setMotionInterval) {
            //         // @ts-expect-error
            //         jsb.device.setMotionInterval(interval);
            //     }
            // }
    }
    //#endregion Accelerometer Handle

    //#region Event Register
    public registerSystemEvent (element: HTMLElement | null) {
        if (this._isRegisterEvent || !element) {
            return;
        }

        this._glView = legacyCC.view;

        // Register mouse events.
        if (input._mouse.support) {
            this._registerMouseEvents();
        }

        // Register touch events.
        if (input._touch.support) {
            this._registerTouchEvents();
        }

        if (input._keyboard.support) {
            this._registerKeyboardEvent();
        }

        if (input._accelerometer.support) {
            this._registerAccelerometerEvent();
        }
        this._isRegisterEvent = true;
    }

    private _registerMouseEvents () {
        input._mouse.onDown((inputEvent) => {
            let mouseEvent = this._getMouseEvent(inputEvent);
            let touch =  this._getTouch(inputEvent);
            this.handleTouchesBegin([touch]);
            eventManager.dispatchEvent(mouseEvent);
        });
        input._mouse.onMove((inputEvent) => {
            let mouseEvent = this._getMouseEvent(inputEvent);
            let touch =  this._getTouch(inputEvent);
            this.handleTouchesMove([touch]);
            eventManager.dispatchEvent(mouseEvent);
        });
        input._mouse.onUp((inputEvent) => {
            let mouseEvent = this._getMouseEvent(inputEvent);
            let touch =  this._getTouch(inputEvent);
            this.handleTouchesEnd([touch]);
            eventManager.dispatchEvent(mouseEvent);
        });
        input._mouse.onWheel((inputEvent) => {
            let mouseEvent = this._getMouseEvent(inputEvent);
            mouseEvent.setScrollData(inputEvent.deltaX, inputEvent.deltaY);
            eventManager.dispatchEvent(mouseEvent);            
        });
    }

    private _registerTouchEvents () {
        input._touch.onStart((inputEvent) => {
            let touchList = this._getTouchList(inputEvent);
            this.handleTouchesBegin(touchList);
        });
        input._touch.onMove((inputEvent) => {
            let touchList = this._getTouchList(inputEvent);
            this.handleTouchesMove(touchList);
        });
        input._touch.onEnd((inputEvent) => {
            let touchList = this._getTouchList(inputEvent);
            this.handleTouchesEnd(touchList);
        });
        input._touch.onCancel((inputEvent) => {
            let touchList = this._getTouchList(inputEvent);
            this.handleTouchesCancel(touchList);
        });
    }

    private _registerKeyboardEvent () {
        input._keyboard.onDown((inputEvent)  => {
            eventManager.dispatchEvent(new EventKeyboard(inputEvent.code, true));
        });
        input._keyboard.onUp((inputEvent)  => {
            eventManager.dispatchEvent(new EventKeyboard(inputEvent.code, false));
        });
    }

    private _registerAccelerometerEvent () {
        input._accelerometer.onChange((inputEvent) => {
            let {x, y, z, timestamp} = inputEvent;
            eventManager.dispatchEvent(new EventAcceleration(new Acceleration(x, y, z, timestamp)));
        });
        
        // this._acceleration = new Acceleration();
        // // TODO
        // // @ts-expect-error
        // this._accelDeviceEvent = window.DeviceMotionEvent || window.DeviceOrientationEvent;

        // // TODO fix DeviceMotionEvent bug on QQ Browser version 4.1 and below.
        // if (legacyCC.sys.browserType === legacyCC.sys.BROWSER_TYPE_MOBILE_QQ) {
        //     // TODO
        // // @ts-expect-error
        //     this._accelDeviceEvent = window.DeviceOrientationEvent;
        // }

        // const _deviceEventType =
        //     // TODO
        //     this._accelDeviceEvent === window.DeviceMotionEvent ? 'devicemotion' : 'deviceorientation';

        // // @ts-expect-error
        // _didAccelerateFun = (...args: any[]) => this.didAccelerate(...args);
        // window.addEventListener(_deviceEventType, _didAccelerateFun, false);
    }
    //#endregion Event Register
}

const inputManager = new InputManager();

export default inputManager;

legacyCC.internal.inputManager = inputManager;
