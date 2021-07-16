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

import { AccelerometerInputEvent, input, MouseInputEvent, TouchInputEvent } from 'pal/input';
import { Vec2 } from '../../math/index';
import { macro } from '../macro';
import eventManager from './event-manager';
import { EventAcceleration, EventKeyboard, EventMouse, EventTouch } from './events';
import { Touch } from './touch';
import { legacyCC } from '../../global-exports';
import { logID } from '../debug';
import { Acceleration } from './acceleration';
import { SystemEventType } from './event-enum';

const TOUCH_TIMEOUT = macro.TOUCH_TIMEOUT;

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

    // #region Touch Handle
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
            const touchEvent = new EventTouch(handleTouches, false, SystemEventType.TOUCH_START, macro.ENABLE_MULTI_TOUCH ? this._getUsefulTouches() : handleTouches);
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
            const touchEvent = new EventTouch(handleTouches, false, SystemEventType.TOUCH_MOVE, macro.ENABLE_MULTI_TOUCH ? this._getUsefulTouches() : handleTouches);
            eventManager.dispatchEvent(touchEvent);
        }
    }

    public handleTouchesEnd (touches: Touch[]) {
        const handleTouches = this.getSetOfTouchesEndOrCancel(touches);
        if (handleTouches.length > 0) {
            const touchEvent = new EventTouch(handleTouches, false, SystemEventType.TOUCH_END, macro.ENABLE_MULTI_TOUCH ? this._getUsefulTouches() : handleTouches);
            eventManager.dispatchEvent(touchEvent);
        }
        this._preTouchPool.length = 0;
    }

    public handleTouchesCancel (touches: Touch[]) {
        const handleTouches = this.getSetOfTouchesEndOrCancel(touches);
        if (handleTouches.length > 0) {
            const touchEvent = new EventTouch(handleTouches, false, SystemEventType.TOUCH_CANCEL, macro.ENABLE_MULTI_TOUCH ? this._getUsefulTouches() : handleTouches);
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
        touch.setPrevPoint(locPreTouch.x, locPreTouch.y);
        locPreTouch.x = x;
        locPreTouch.y = y;
        return touch;
    }

    private _getMouseEvent (inputEvent: MouseInputEvent): EventMouse {
        const locPreMouse = this._prevMousePoint;
        const mouseEvent = new EventMouse(inputEvent.type, false, locPreMouse);
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

        // Web only
        if (inputEvent.movementX) {
            mouseEvent.movementX = inputEvent.movementX;
        }
        if (inputEvent.movementY) {
            mouseEvent.movementY = inputEvent.movementY;
        }
        return mouseEvent;
    }

    private _getTouchList (inputEvent: TouchInputEvent) {
        const touchList: Touch[] = [];
        const locPreTouch = this._preTouchPoint;
        const length = inputEvent.changedTouches.length;
        const pixelRatio = this._getViewPixelRatio();
        for (let i = 0; i < length; i++) {
            const touchData = inputEvent.changedTouches[i];
            const x = touchData.x * pixelRatio;
            const y = touchData.y * pixelRatio;
            // TODO: what if touchData.identifier is undefined
            const touch = new Touch(x, y, touchData.identifier);
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
        const now = legacyCC.game.frameStartTime;

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
    // #endregion Touch Handle

    // #region Accelerometer Handle
    /**
     * Whether enable accelerometer event.
     */
    public setAccelerometerEnabled (isEnable: boolean) {
        if (isEnable) {
            input._accelerometer.start();
        } else {
            input._accelerometer.stop();
        }
    }

    /**
     * set accelerometer interval value in mileseconds
     * @method setAccelerometerInterval
     * @param {Number} intervalInMileseconds
     */
    public setAccelerometerInterval (intervalInMileseconds) {
        input._accelerometer.setInterval(intervalInMileseconds);
    }
    // #endregion Accelerometer Handle

    // #region Event Register
    public registerSystemEvent () {
        if (this._isRegisterEvent) {
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
            const mouseEvent = this._getMouseEvent(inputEvent);
            const touch =  this._getTouch(inputEvent);
            this.handleTouchesBegin([touch]);
            eventManager.dispatchEvent(mouseEvent);
        });
        input._mouse.onMove((inputEvent) => {
            const mouseEvent = this._getMouseEvent(inputEvent);
            const touch =  this._getTouch(inputEvent);
            this.handleTouchesMove([touch]);
            eventManager.dispatchEvent(mouseEvent);
        });
        input._mouse.onUp((inputEvent) => {
            const mouseEvent = this._getMouseEvent(inputEvent);
            const touch =  this._getTouch(inputEvent);
            this.handleTouchesEnd([touch]);
            eventManager.dispatchEvent(mouseEvent);
        });
        input._mouse.onWheel((inputEvent) => {
            const mouseEvent = this._getMouseEvent(inputEvent);
            mouseEvent.setScrollData(inputEvent.deltaX, inputEvent.deltaY);
            eventManager.dispatchEvent(mouseEvent);
        });
    }

    private _registerTouchEvents () {
        input._touch.onStart((inputEvent) => {
            const touchList = this._getTouchList(inputEvent);
            this.handleTouchesBegin(touchList);
        });
        input._touch.onMove((inputEvent) => {
            const touchList = this._getTouchList(inputEvent);
            this.handleTouchesMove(touchList);
        });
        input._touch.onEnd((inputEvent) => {
            const touchList = this._getTouchList(inputEvent);
            this.handleTouchesEnd(touchList);
        });
        input._touch.onCancel((inputEvent) => {
            const touchList = this._getTouchList(inputEvent);
            this.handleTouchesCancel(touchList);
        });
    }

    private _registerKeyboardEvent () {
        // TODO: to support in Input Module
        // input._keyboard.onDown((inputEvent) => {
        //     eventManager.dispatchEvent(new EventKeyboard(inputEvent.code, 'keypress'));
        // });
        input._keyboard.onPressing((inputEvent)  => {
            eventManager.dispatchEvent(new EventKeyboard(inputEvent.code, SystemEventType.KEY_DOWN));
        });
        input._keyboard.onUp((inputEvent)  => {
            eventManager.dispatchEvent(new EventKeyboard(inputEvent.code, SystemEventType.KEY_UP));
        });
    }

    private _registerAccelerometerEvent () {
        input._accelerometer.onChange((inputEvent: AccelerometerInputEvent) => {
            const { x, y, z, timestamp } = inputEvent;
            eventManager.dispatchEvent(new EventAcceleration(new Acceleration(x, y, z, timestamp)));
        });
    }
    // #endregion Event Register
}

const inputManager = new InputManager();

export default inputManager;

legacyCC.internal.inputManager = inputManager;
