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

import { AccelerometerInputEvent, input, MouseInputEvent, MouseWheelInputEvent, TouchInputEvent, KeyboardInputEvent, MouseInputSource, TouchData } from 'pal/input';
import { Vec2 } from '../../math/index';
import { macro } from '../macro';
import { eventManager } from './event-manager';
import { EventAcceleration, EventKeyboard, EventMouse, EventTouch } from './events';
import { Touch } from './touch';
import { legacyCC } from '../../global-exports';
import { Acceleration } from './acceleration';
import { SystemEventType } from './event-enum';
import { touchManager } from '../../../../pal/input/touch-manager';

interface IView {
    _devicePixelRatio: number;
}

const pointerEventTypeMap = {
    [SystemEventType.MOUSE_DOWN]: SystemEventType.TOUCH_START,
    [SystemEventType.MOUSE_MOVE]: SystemEventType.TOUCH_MOVE,
    [SystemEventType.MOUSE_UP]: SystemEventType.TOUCH_END,
};

/**
 *  This class manages all events of input. include: touch, mouse, accelerometer, keyboard
 */
class InputManager {
    private _prevMousePoint = new Vec2();

    // TODO: remove this property
    private _glView: IView | null = null;

    /**
     * Clear events when game is resumed.
     */
    public clearEvents () {
        input.pollMouseEvents();
        input.pollTouchEvents();
        input.pollKeyboardEvents();
        input.pollAccelerometerEvents();
    }

    public frameDispatchEvents () {
        const mouseEvents = input.pollMouseEvents();
        // TODO: culling event queue
        for (let i = 0, length = mouseEvents.length; i < length; ++i) {
            const mouseEvent = mouseEvents[i];
            this._dispatchMouseEvent(mouseEvent);
        }

        const touchEvents = input.pollTouchEvents();
        // TODO: culling event queue
        for (let i = 0, length = touchEvents.length; i < length; ++i) {
            const touchEvent = touchEvents[i];
            this._dispatchTouchEvent(touchEvent);
        }

        const keyboardEvents = input.pollKeyboardEvents();
        // TODO: culling event queue
        for (let i = 0, length = keyboardEvents.length; i < length; ++i) {
            const keyboardEvent = keyboardEvents[i];
            this._dispatchKeyboardEvent(keyboardEvent);
        }

        const accelerometerEvents = input.pollAccelerometerEvents();
        // TODO: culling event queue
        for (let i = 0, length = accelerometerEvents.length; i < length; ++i) {
            const accelerometerEvent = accelerometerEvents[i];
            this._dispatchAccelerometerEvent(accelerometerEvent);
        }
    }

    // #region Mouse Handle
    private _dispatchMouseEvent (inputEvent: MouseInputEvent) {
        let touchInputEvent: TouchInputEvent;
        let mouseEvent: EventMouse;
        switch (inputEvent.type) {
        case SystemEventType.MOUSE_DOWN:
            mouseEvent = this._getMouseEvent(inputEvent);
            touchInputEvent = this._simulateTouchInputEvent(inputEvent);
            this._handleTouchesStart(touchInputEvent);
            eventManager.dispatchEvent(mouseEvent);
            break;
        case SystemEventType.MOUSE_MOVE:
            mouseEvent = this._getMouseEvent(inputEvent);
            touchInputEvent = this._simulateTouchInputEvent(inputEvent);
            this._handleTouchesMove(touchInputEvent);
            eventManager.dispatchEvent(mouseEvent);
            break;
        case SystemEventType.MOUSE_UP:
            mouseEvent = this._getMouseEvent(inputEvent);
            touchInputEvent = this._simulateTouchInputEvent(inputEvent);
            this._handleTouchesEnd(touchInputEvent);
            eventManager.dispatchEvent(mouseEvent);
            break;
        case SystemEventType.MOUSE_WHEEL:
            mouseEvent = this._getMouseEvent(inputEvent);
            mouseEvent.setScrollData((<MouseWheelInputEvent>inputEvent).deltaX, (<MouseWheelInputEvent>inputEvent).deltaY);
            eventManager.dispatchEvent(mouseEvent);
            break;
        default:
            break;
        }
    }
    // #endregion Mouse Handle

    // #region Touch Handle
    private _dispatchTouchEvent (inputEvent: TouchInputEvent) {
        switch (inputEvent.type) {
        case SystemEventType.TOUCH_START:
            this._handleTouchesStart(inputEvent);
            break;
        case SystemEventType.TOUCH_MOVE:
            this._handleTouchesMove(inputEvent);
            break;
        case SystemEventType.TOUCH_END:
            this._handleTouchesEnd(inputEvent);
            break;
        case SystemEventType.TOUCH_CANCEL:
            this._handleTouchesCancel(inputEvent);
            break;
        default:
            break;
        }
    }

    private _handleTouchesStart (inputEvent: TouchInputEvent) {
        const handleTouches: Touch[] = [];
        const changedTouches = inputEvent.changedTouches;
        const dpr = this._getViewPixelRatio();
        for (let i = 0; i < changedTouches.length; ++i) {
            const changedTouch = changedTouches[i];
            const touchID = changedTouch.identifier;
            if (touchID === null) {
                continue;
            }

            const touch = touchManager.createTouch(touchID, changedTouch.x * dpr, changedTouch.y * dpr);
            if (!touch) {
                continue;
            }
            handleTouches.push(touch);
            if (!macro.ENABLE_MULTI_TOUCH) {
                break;
            }
        }
        if (handleTouches.length > 0) {
            const touchEvent = new EventTouch(handleTouches, false, SystemEventType.TOUCH_START, macro.ENABLE_MULTI_TOUCH ? touchManager.getAllTouches() : handleTouches);
            eventManager.dispatchEvent(touchEvent);
        }
    }

    private _handleTouchesMove (inputEvent: TouchInputEvent) {
        const handleTouches: Touch[] = [];
        const changedTouches = inputEvent.changedTouches;
        const dpr = this._getViewPixelRatio();
        for (let i = 0; i < changedTouches.length; ++i) {
            const changedTouch = changedTouches[i];
            const touchID = changedTouch.identifier;
            if (touchID === null) {
                continue;
            }
            touchManager.updateTouch(touchID, changedTouch.x * dpr, changedTouch.y * dpr);
            const touch = touchManager.getTouch(touchID);
            if (!touch) {
                continue;
            }
            handleTouches.push(touch);
            if (!macro.ENABLE_MULTI_TOUCH) {
                break;
            }
        }
        if (handleTouches.length > 0) {
            const touchEvent = new EventTouch(handleTouches, false, SystemEventType.TOUCH_MOVE, macro.ENABLE_MULTI_TOUCH ? touchManager.getAllTouches() : handleTouches);
            eventManager.dispatchEvent(touchEvent);
        }
    }

    private _handleTouchesEnd (inputEvent: TouchInputEvent) {
        const handleTouches = this._getSetOfTouchesEndOrCancel(inputEvent);
        if (handleTouches.length > 0) {
            const touchEvent = new EventTouch(handleTouches, false, SystemEventType.TOUCH_END, macro.ENABLE_MULTI_TOUCH ? touchManager.getAllTouches() : handleTouches);
            eventManager.dispatchEvent(touchEvent);
        }
    }

    private _handleTouchesCancel (inputEvent: TouchInputEvent) {
        const handleTouches = this._getSetOfTouchesEndOrCancel(inputEvent);
        if (handleTouches.length > 0) {
            const touchEvent = new EventTouch(handleTouches, false, SystemEventType.TOUCH_CANCEL, macro.ENABLE_MULTI_TOUCH ? touchManager.getAllTouches() : handleTouches);
            eventManager.dispatchEvent(touchEvent);
        }
    }

    private _getSetOfTouchesEndOrCancel (inputEvent: TouchInputEvent) {
        const handleTouches: Touch[] = [];
        const changedTouches = inputEvent.changedTouches;
        const dpr = this._getViewPixelRatio();
        for (let i = 0; i < changedTouches.length; ++i) {
            const changedTouch = changedTouches[i];
            const touchID = changedTouch.identifier;
            if (touchID === null) {
                continue;
            }
            touchManager.updateTouch(touchID, changedTouch.x * dpr, changedTouch.y * dpr);
            const touch = touchManager.getTouch(touchID);
            if (!touch) {
                continue;
            }
            handleTouches.push(touch);
            touchManager.releaseTouch(touchID);
            if (!macro.ENABLE_MULTI_TOUCH) {
                break;
            }
        }
        return handleTouches;
    }

    // TODO: remove this private method
    private _getViewPixelRatio () {
        if (!this._glView) {
            this._glView = legacyCC.view;
        }
        return this._glView ? this._glView._devicePixelRatio : 1;
    }

    private _simulateTouchInputEvent (mouseInputEvent: MouseInputEvent): TouchInputEvent {
        const touchData: TouchData = {
            identifier: 0,
            x: mouseInputEvent.x,
            y: mouseInputEvent.y,
            force: 0,
        };

        const touchInputEvent: TouchInputEvent = {
            type: pointerEventTypeMap[mouseInputEvent.type],
            changedTouches: [touchData],
            timestamp: mouseInputEvent.timestamp,
        };
        return touchInputEvent;
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
    // #endregion Touch Handle

    // #region Keyboard Handle
    private _dispatchKeyboardEvent (inputEvent: KeyboardInputEvent) {
        switch (inputEvent.type) {
        // TODO: to support in Input Module
        // case 'keypress':
        //     eventManager.dispatchEvent(new EventKeyboard(inputEvent.code, 'keypress'));
        //     break;
        case SystemEventType.KEY_DOWN:
            eventManager.dispatchEvent(new EventKeyboard(inputEvent.code, SystemEventType.KEY_DOWN));
            break;
        case SystemEventType.KEY_UP:
            eventManager.dispatchEvent(new EventKeyboard(inputEvent.code, SystemEventType.KEY_UP));
            break;
        default:
            break;
        }
    }
    // #endregion Keyboard Handle

    // #region Accelerometer Handle
    _dispatchAccelerometerEvent (inputEvent: AccelerometerInputEvent) {
        if (inputEvent.type === SystemEventType.DEVICEMOTION) {
            const { x, y, z, timestamp } = inputEvent;
            eventManager.dispatchEvent(new EventAcceleration(new Acceleration(x, y, z, timestamp)));
        }
    }
    /**
     * Whether enable accelerometer event.
     */
    public setAccelerometerEnabled (isEnable: boolean) {
        if (isEnable) {
            input.startAccelerometer();
        } else {
            input.stopAccelerometer();
        }
    }

    /**
     * set accelerometer interval value in mile seconds
     * @method setAccelerometerInterval
     * @param {Number} intervalInMileSeconds
     */
    public setAccelerometerInterval (intervalInMileSeconds) {
        input.setAccelerometerInterval(intervalInMileSeconds);
    }
    // #endregion Accelerometer Handle
}

const inputManager = new InputManager();

export default inputManager;

legacyCC.internal.inputManager = inputManager;
