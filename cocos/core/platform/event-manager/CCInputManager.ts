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

import { rect } from '../../value-types/rect';
import Vec2, { v2 } from '../../value-types/vec2';
import macro from '../CCMacro';
import sys from '../CCSys';
import { EventAcceleration, EventKeyboard, EventMouse, EventTouch } from './CCEvent';
import eventManager from './CCEventManager';
import CCTouch from './CCTouch';

const TOUCH_TIMEOUT = macro.TOUCH_TIMEOUT;

const PORTRAIT = 0;
const LANDSCAPE_LEFT = -90;
const PORTRAIT_UPSIDE_DOWN = 180;
const LANDSCAPE_RIGHT = 90;

let _didAccelerateFun;

const _vec2 = v2();

interface IHTMLElementPosition {
    left: number;
    top: number;
    width: number;
    height: number;
}

interface IView {
    convertToLocationInView (tx: number, ty: number, elementPosition: IHTMLElementPosition, out?: Vec2): Vec2;

    _convertMouseToLocationInView (point: Vec2, elementPosition: IHTMLElementPosition): void;

    _convertTouchesWithScale (touches: CCTouch[]): void;
}

/**
 * !#en the device accelerometer reports values for each axis in units of g-force.
 * !#zh 设备重力传感器传递的各个轴的数据。
 */
class Acceleration {
    public x: number;
    public y: number;
    public z: number;
    public timestamp: number;
    constructor (x = 0, y = 0, z = 0, timestamp = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.timestamp = timestamp;
    }
}

/**
 *  This class manages all events of input. include: touch, mouse, accelerometer, keyboard
 */
class InputManager {
    private _mousePressed = false;

    private _isRegisterEvent = false;

    private _preTouchPoint = v2(0, 0);
    private _prevMousePoint = v2(0, 0);

    private _preTouchPool: CCTouch[] = [];
    private  _preTouchPoolPointer = 0;

    private _touches: CCTouch[] = [];
    private _touchesIntegerDict: { [index: number]: number | undefined; } = { };

    private _indexBitsUsed = 0;
    private _maxTouches = 8;

    private _accelEnabled = false;
    private _accelInterval = 1 / 5;
    private _accelMinus = 1;
    private  _accelCurTime = 0;
    private _acceleration: Acceleration | null = null;
    private _accelDeviceEvent = null;

    private _glView: IView | null = null;

    private _minus = 0;

    public handleTouchesBegin (touches: CCTouch[]) {
        const handleTouches: CCTouch[] = [];
        const locTouchIntDict = this._touchesIntegerDict;
        const now = sys.now();
        for (const touch of touches) {
            const touchID = touch.getID();
            if (touchID === null) {
                continue;
            }
            const index = locTouchIntDict[touchID];
            if (index === undefined) {
                const unusedIndex = this._getUnUsedIndex();
                if (unusedIndex === -1) {
                    cc.logID(2300, unusedIndex);
                    continue;
                }
                // curTouch = this._touches[unusedIndex] = touch;
                const curTouch = new CCTouch(touch._point.x, touch._point.y, touch.getID());
                this._touches[unusedIndex] = curTouch;
                curTouch._lastModified = now;
                curTouch._setPrevPoint(touch._prevPoint);
                locTouchIntDict[touchID] = unusedIndex;
                handleTouches.push(curTouch);
            }
        }
        if (handleTouches.length > 0) {
            this._glView!._convertTouchesWithScale(handleTouches);
            const touchEvent = new EventTouch(handleTouches);
            touchEvent._eventCode = EventTouch.BEGAN;
            eventManager.dispatchEvent(touchEvent);
        }
    }

    public handleTouchesMove (touches: CCTouch[]) {
        const handleTouches: CCTouch[] = [];
        const locTouches = this._touches;
        const now = sys.now();
        for (const touch of touches) {
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
                locTouches[index]._setPoint(touch._point);
                locTouches[index]._setPrevPoint(touch._prevPoint);
                locTouches[index]._lastModified = now;
                handleTouches.push(locTouches[index]);
            }
        }
        if (handleTouches.length > 0) {
            this._glView!._convertTouchesWithScale(handleTouches);
            const touchEvent = new EventTouch(handleTouches);
            touchEvent._eventCode = EventTouch.MOVED;
            eventManager.dispatchEvent(touchEvent);
        }
    }

    public handleTouchesEnd (touches: CCTouch[]) {
        const handleTouches = this.getSetOfTouchesEndOrCancel(touches);
        if (handleTouches.length > 0) {
            this._glView!._convertTouchesWithScale(handleTouches);
            const touchEvent = new EventTouch(handleTouches);
            touchEvent._eventCode = EventTouch.ENDED;
            eventManager.dispatchEvent(touchEvent);
        }
        this._preTouchPool.length = 0;
    }

    public handleTouchesCancel (touches: CCTouch[]) {
        const handleTouches = this.getSetOfTouchesEndOrCancel(touches);
        if (handleTouches.length > 0) {
            this._glView!._convertTouchesWithScale(handleTouches);
            const touchEvent = new EventTouch(handleTouches);
            touchEvent._eventCode = EventTouch.CANCELLED;
            eventManager.dispatchEvent(touchEvent);
        }
        this._preTouchPool.length = 0;
    }

    public getSetOfTouchesEndOrCancel (touches: CCTouch[]) {
        const handleTouches: CCTouch[] = [];
        const locTouches = this._touches;
        const locTouchesIntDict = this._touchesIntegerDict;
        for (const touch of touches) {
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
                locTouches[index]._setPoint(touch._point);
                locTouches[index]._setPrevPoint(touch._prevPoint);
                handleTouches.push(locTouches[index]);
                this._removeUsedIndexBit(index);
                delete locTouchesIntDict[touchID];
            }
        }
        return handleTouches;
    }

    public getHTMLElementPosition (element: HTMLElement): IHTMLElementPosition {
        if (sys.platform === sys.WECHAT_GAME) {
            return {
                left: 0,
                top: 0,
                width: window.innerWidth,
                height: window.innerHeight,
            };
        }

        const docElem = document.documentElement;
        const leftOffset = window.pageXOffset - docElem.clientLeft;
        const topOffset = window.pageYOffset - docElem.clientTop;
        if (element.getBoundingClientRect) {
            const box = element.getBoundingClientRect();
            return {
                left: box.left + leftOffset,
                top: box.top + topOffset,
                width: box.width,
                height: box.height,
            };
        } else {
            if (element instanceof HTMLCanvasElement) {
                return {
                    left: leftOffset,
                    top: topOffset,
                    width: element.width,
                    height: element.height,
                };
            } else {
                return {
                    left: leftOffset,
                    top: topOffset,
                    width: parseInt(element.style.width || '0', undefined),
                    height: parseInt(element.style.height || '0', undefined),
                };
            }
        }
    }

    public getPreTouch (touch: CCTouch) {
        let preTouch: CCTouch | null = null;
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

    public setPreTouch (touch: CCTouch) {
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

    public getTouchByXY (tx: number, ty: number, pos: IHTMLElementPosition) {
        const locPreTouch = this._preTouchPoint;
        const location = this._glView!.convertToLocationInView(tx, ty, pos);
        const touch = new CCTouch(location.x,  location.y, 0);
        touch._setPrevPoint(locPreTouch.x, locPreTouch.y);
        locPreTouch.x = location.x;
        locPreTouch.y = location.y;
        return touch;
    }

    public getMouseEvent (
        location: { x: number; y: number; }, pos: IHTMLElementPosition, eventType: number): EventMouse {
        const locPreMouse = this._prevMousePoint;
        const mouseEvent = new EventMouse(eventType);
        mouseEvent._setPrevCursor(locPreMouse.x, locPreMouse.y);
        locPreMouse.x = location.x;
        locPreMouse.y = location.y;
        this._glView!._convertMouseToLocationInView(locPreMouse, pos);
        mouseEvent.setLocation(locPreMouse.x, locPreMouse.y);
        return mouseEvent;
    }

    public getPointByEvent (event: MouseEvent, pos: IHTMLElementPosition) {
        if (event.pageX != null) {  // not avalable in <= IE8
            return {x: event.pageX, y: event.pageY};
        }

        if (sys.platform === sys.WECHAT_GAME) {
            pos.left = 0;
            pos.top = 0;
        } else {
            pos.left -= document.body.scrollLeft;
            pos.top -= document.body.scrollTop;
        }
        return {x: event.clientX, y: event.clientY};
    }

    public getTouchesByEvent (event: TouchEvent, position: IHTMLElementPosition) {
        const touches: CCTouch[] = [];
        const locView = this._glView;
        const locPreTouch = this._preTouchPoint;

        const length = event.changedTouches.length;
        for (let i = 0; i < length; i++) {
            const changedTouch = event.changedTouches.item(i);
            if (!changedTouch) {
                continue;
            }
            let location;
            if (sys.BROWSER_TYPE_FIREFOX === sys.browserType) {
                location = locView!.convertToLocationInView(
                    changedTouch.pageX, changedTouch.pageY, position, _vec2);
            } else {
                location = locView!.convertToLocationInView(
                    changedTouch.clientX, changedTouch.clientY, position, _vec2);
            }
            let touch: CCTouch;
            if (changedTouch.identifier != null) {
                touch = new CCTouch(location.x, location.y, changedTouch.identifier);
                // use Touch Pool
                const preLocation = this.getPreTouch(touch).getLocation();
                touch._setPrevPoint(preLocation.x, preLocation.y);
                this.setPreTouch(touch);
            } else {
                touch = new CCTouch(location.x, location.y);
                touch._setPrevPoint(locPreTouch.x, locPreTouch.y);
            }
            locPreTouch.x = location.x;
            locPreTouch.y = location.y;
            touches.push(touch);
        }
        return touches;
    }

    public registerSystemEvent (element: HTMLElement) {
        if (this._isRegisterEvent) {
            return;
        }

        this._glView = cc.view;

        let prohibition = sys.isMobile;
        let supportMouse = ('mouse' in sys.capabilities);
        let supportTouches = ('touches' in sys.capabilities);
        if (sys.platform === sys.WECHAT_GAME) {
            prohibition = false;
            supportTouches = true;
            supportMouse = false;
        }

        // Register mouse events.
        if (supportMouse) {
            this._registerMouseEvents(element, prohibition);
        }

        // Register mouse pointer events.
        if (window.navigator.msPointerEnabled) {
            this._registerMousePointerEvents(element);
        }

        // Register touch events.
        if (supportTouches) {
            this._registerTouchEvents(element);
        }

        // Register keyboard events.
        if (cc.sys.browserType !== cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB) {
            this._registerKeyboardEvent();
        }

        this._isRegisterEvent = true;
    }

    /**
     * Whether enable accelerometer event.
     */
    public setAccelerometerEnabled (isEnable: boolean) {
        if (this._accelEnabled === isEnable) {
            return;
        }

        this._accelEnabled = isEnable;
        const scheduler = cc.director.getScheduler();
        scheduler.enableForTarget(this);
        if (this._accelEnabled) {
            this._registerAccelerometerEvent();
            this._accelCurTime = 0;
            scheduler.scheduleUpdate(this);
        } else {
            this._unregisterAccelerometerEvent();
            this._accelCurTime = 0;
            scheduler.unscheduleUpdate(this);
        }
    }

    public didAccelerate (eventData: DeviceMotionEvent | DeviceOrientationEvent) {
        if (!this._accelEnabled) {
            return;
        }

        const mAcceleration = this._acceleration!;

        let x = 0;
        let y = 0;
        let z = 0;

        // TODO
        // @ts-ignore
        if (this._accelDeviceEvent === window.DeviceMotionEvent) {
            const deviceMotionEvent = eventData as DeviceMotionEvent;
            const eventAcceleration = deviceMotionEvent.accelerationIncludingGravity;
            if (eventAcceleration) {
                x = this._accelMinus * (eventAcceleration.x || 0) * 0.1;
                y = this._accelMinus * (eventAcceleration.y || 0) * 0.1;
                z = (eventAcceleration.z || 0) * 0.1;
            }
        } else {
            const deviceOrientationEvent = eventData as DeviceOrientationEvent;
            x = ((deviceOrientationEvent.gamma || 0) / 90) * 0.981;
            y = -((deviceOrientationEvent.beta || 0) / 90) * 0.981;
            z = ((deviceOrientationEvent.alpha || 0) / 90) * 0.981;
        }

        if (cc.view._isRotated) {
            const tmp = x;
            x = -y;
            y = tmp;
        }
        mAcceleration.x = x;
        mAcceleration.y = y;
        mAcceleration.z = z;

        mAcceleration.timestamp = eventData.timeStamp || Date.now();

        const tmpX = mAcceleration.x;
        if (window.orientation === LANDSCAPE_RIGHT) {
            mAcceleration.x = -mAcceleration.y;
            mAcceleration.y = tmpX;
        } else if (window.orientation === LANDSCAPE_LEFT) {
            mAcceleration.x = mAcceleration.y;
            mAcceleration.y = -tmpX;
        } else if (window.orientation === PORTRAIT_UPSIDE_DOWN) {
            mAcceleration.x = -mAcceleration.x;
            mAcceleration.y = -mAcceleration.y;
        }
        // fix android acc values are opposite
        if (cc.sys.os === cc.sys.OS_ANDROID &&
            cc.sys.browserType !== cc.sys.BROWSER_TYPE_MOBILE_QQ) {
            mAcceleration.x = -mAcceleration.x;
            mAcceleration.y = -mAcceleration.y;
        }
    }

    public update (dt: number) {
        if (this._accelCurTime > this._accelInterval) {
            this._accelCurTime -= this._accelInterval;
            eventManager.dispatchEvent(new EventAcceleration(this._acceleration!));
        }
        this._accelCurTime += dt;
    }

    private _getUnUsedIndex () {
        let temp = this._indexBitsUsed;
        const now = cc.sys.now();

        for (let i = 0; i < this._maxTouches; i++) {
            if (!(temp & 0x00000001)) {
                this._indexBitsUsed |= (1 << i);
                return i;
            } else {
                const touch = this._touches[i];
                if (now - touch._lastModified > TOUCH_TIMEOUT) {
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

    /**
     * set accelerometer interval value
     * @method setAccelerometerInterval
     * @param {Number} interval
     */
    private setAccelerometerInterval (interval) {
        if (this._accelInterval !== interval) {
            this._accelInterval = interval;
        }
    }

    private _registerMouseEvents (element: HTMLElement, prohibition: boolean) {
        // HACK
        //  - At the same time to trigger the ontouch event and onmouse event
        //  - The function will execute 2 times
        // The known browser:
        //  liebiao
        //  miui
        //  WECHAT
        if (!prohibition) {
            this._registerWindowMouseEvents(element);
        }
        this._registerElementMouseEvents(element, prohibition);
    }

    private _registerWindowMouseEvents (element: HTMLElement) {
        window.addEventListener('mousedown', () => {
            this._mousePressed = true;
        }, false);
        window.addEventListener('mouseup', (event: MouseEvent) => {
            if (!this._mousePressed) {
                return;
            }
            this._mousePressed = false;
            const position = this.getHTMLElementPosition(element);
            const location = this.getPointByEvent(event, position);
            const positionRect = rect(position.left, position.top, position.width, position.height);
            if (!positionRect.contains(v2(location.x, location.y))) {
                this.handleTouchesEnd([this.getTouchByXY(location.x, location.y, position)]);
                const mouseEvent = this.getMouseEvent(location, position, EventMouse.UP);
                mouseEvent.setButton(event.button);
                eventManager.dispatchEvent(mouseEvent);
            }
        }, false);
    }

    private _registerElementMouseEvents (element: HTMLElement, prohibition: boolean) {
        // Register canvas mouse events.
        type Handler = (
            event: MouseEvent,
            mouseEvent: EventMouse,
            location: { x: number; y: number; },
            elementPosition: IHTMLElementPosition,
        ) => void;

        type MouseEventNames = 'mousedown' | 'mouseup' | 'mousemove';

        const listenDOMMouseEvent = (eventName: MouseEventNames, type: number, handler: Handler) => {
            element.addEventListener(eventName, (event) => {
                const pos = this.getHTMLElementPosition(element);
                const location = this.getPointByEvent(event, pos);
                const mouseEvent = this.getMouseEvent(location, pos, type);
                mouseEvent.setButton(event.button);

                handler(event, mouseEvent, location, pos);

                eventManager.dispatchEvent(mouseEvent);
                event.propagationStopped = true;
                event.preventDefault();
            });
        };

        if (!prohibition) {
            listenDOMMouseEvent('mousedown', EventMouse.DOWN, (event, mouseEvent, location, pos) => {
                this._mousePressed = true;
                this.handleTouchesBegin([this.getTouchByXY(location.x, location.y, pos)]);
                element.focus();
            });

            listenDOMMouseEvent('mouseup', EventMouse.UP, (event, mouseEvent, location, pos) => {
                this._mousePressed = false;
                this.handleTouchesEnd([this.getTouchByXY(location.x, location.y, pos)]);
            });

            listenDOMMouseEvent('mousemove', EventMouse.MOVE, (event, mouseEvent, location, pos) => {
                this.handleTouchesMove([this.getTouchByXY(location.x, location.y, pos)]);
                if (!this._mousePressed) {
                    mouseEvent.setButton(null);
                }
                if (event.movementX !== undefined && event.movementY !== undefined) {
                    mouseEvent.movementX = event.movementX;
                    mouseEvent.movementY = event.movementY;
                }
            });
        }

        // @ts-ignore
        listenDOMMouseEvent('mousewheel', EventMouse.SCROLL, (event, mouseEvent, location, pos) => {
            mouseEvent.setScrollData(0, event.wheelDelta);
        });

        /* firefox fix */
        // @ts-ignore
        listenDOMMouseEvent('DOMMouseScroll', EventMouse.SCROLL, (event, mouseEvent, location, pos) => {
            mouseEvent.setScrollData(0, event.detail * -120);
        });
    }

    private _registerMousePointerEvents (element: HTMLElement) {
        const _pointerEventsMap = {
            MSPointerDown     : this.handleTouchesBegin,
            MSPointerMove     : this.handleTouchesMove,
            MSPointerUp       : this.handleTouchesEnd,
            MSPointerCancel   : this.handleTouchesCancel,
        };
        for (const eventName of Object.keys(_pointerEventsMap)) {
            const touchEvent = _pointerEventsMap[eventName];
            // @ts-ignore
            element.addEventListener(eventName as MSPointerEventNames, (event: MSPointerEvent) => {
                const pos = this.getHTMLElementPosition(element);
                pos.left -= document.documentElement.scrollLeft;
                pos.top -= document.documentElement.scrollTop;
                touchEvent.call(this, [this.getTouchByXY(event.clientX, event.clientY, pos)]);
                event.propagationStopped = true;
            }, false);
        }
    }

    private _registerTouchEvents (element: HTMLElement) {
        if (cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB) {
            this._registerWXGameTouchEvents(element);
        } else {
            this._registerHTMLTouchEvents(element);
        }
    }

    private _registerWXGameTouchEvents (element: HTMLElement) {
        const makeTouchListener = (touchesHandler: (touchesToHandle: any) => void) => {
            return (event: TouchEvent) => {
                const pos = this.getHTMLElementPosition(element);
                const body = document.body;
                pos.left -= body.scrollLeft || 0;
                pos.top -= body.scrollTop || 0;
                touchesHandler(this.getTouchesByEvent(event, pos));
            };
        };

        wx.onTouchStart(makeTouchListener((touchesToHandle) => {
            this.handleTouchesBegin(touchesToHandle);
        }));
        wx.onTouchEnd(makeTouchListener((touchesToHandle) => {
            this.handleTouchesEnd(touchesToHandle);
        }));
        wx.onTouchMove(makeTouchListener((touchesToHandle) => {
            this.handleTouchesMove(touchesToHandle);
        }));
        wx.onTouchCancel(makeTouchListener((touchesToHandle) => {
            this.handleTouchesCancel(touchesToHandle);
        }));
    }

    private _registerHTMLTouchEvents (element: HTMLElement) {
        const makeTouchListener = (touchesHandler: (touchesToHandle: any) => void) => {
            return (event: TouchEvent) => {
                if (!event.changedTouches) {
                    return;
                }
                const pos = this.getHTMLElementPosition(element);
                const body = document.body;
                pos.left -= body.scrollLeft || 0;
                pos.top -= body.scrollTop || 0;
                touchesHandler(this.getTouchesByEvent(event, pos));
                event.propagationStopped = true;
                event.preventDefault();
            };
        };

        element.addEventListener('touchstart', makeTouchListener((touchesToHandle) => {
            this.handleTouchesBegin(touchesToHandle);
            if (sys.platform !== sys.WECHAT_GAME) {
                element.focus();
            }
        }), false);

        element.addEventListener('touchmove', makeTouchListener((touchesToHandle) => {
            this.handleTouchesMove(touchesToHandle);
        }), false);

        element.addEventListener('touchend', makeTouchListener((touchesToHandle) => {
            this.handleTouchesEnd(touchesToHandle);
        }), false);

        element.addEventListener('touchcancel', makeTouchListener((touchesToHandle) => {
            this.handleTouchesCancel(touchesToHandle);
        }), false);
    }

    private _registerKeyboardEvent () {
        const canvas = cc.game.canvas as HTMLCanvasElement;
        canvas.addEventListener('keydown', (event: KeyboardEvent) => {
            eventManager.dispatchEvent(new EventKeyboard(event, true));
            event.propagationStopped = true;
            event.preventDefault();
        }, false);
        canvas.addEventListener('keyup', (event: KeyboardEvent) => {
            eventManager.dispatchEvent(new EventKeyboard(event, false));
            event.propagationStopped = true;
            event.preventDefault();
        }, false);
    }

    private _registerAccelerometerEvent () {
        this._acceleration = new Acceleration();
        // TODO
        // @ts-ignore
        this._accelDeviceEvent = window.DeviceMotionEvent || window.DeviceOrientationEvent;

        // TODO fix DeviceMotionEvent bug on QQ Browser version 4.1 and below.
        if (cc.sys.browserType === cc.sys.BROWSER_TYPE_MOBILE_QQ) {
            // TODO
        // @ts-ignore
            this._accelDeviceEvent = window.DeviceOrientationEvent;
        }

        const _deviceEventType =
            // TODO
            // @ts-ignore
            this._accelDeviceEvent === window.DeviceMotionEvent ? 'devicemotion' : 'deviceorientation';
        const ua = navigator.userAgent;
        if (/Android/.test(ua) || (/Adr/.test(ua) && cc.sys.browserType === cc.BROWSER_TYPE_UC)) {
            this._minus = -1;
        }

        // @ts-ignore
        _didAccelerateFun = (...args: any[]) => this.didAccelerate(...args);
        window.addEventListener(_deviceEventType, _didAccelerateFun, false);
    }

    private _unregisterAccelerometerEvent () {
        const _deviceEventType =
            // TODO
            // @ts-ignore
            this._accelDeviceEvent === window.DeviceMotionEvent ? 'devicemotion' : 'deviceorientation';
        if (_didAccelerateFun) {
            window.removeEventListener(_deviceEventType, _didAccelerateFun, false);
        }
    }
}

const inputManager = new InputManager();

export default inputManager;

cc.internal.inputManager = inputManager;
