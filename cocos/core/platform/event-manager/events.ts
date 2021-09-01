/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
*/

/**
 * @packageDocumentation
 * @module event
 */

import Event from '../../event/event';
import { Vec2 } from '../../math/vec2';
import { Touch } from './touch';
import { Acceleration } from './acceleration';
import { legacyCC } from '../../global-exports';
import { SystemEventTypeUnion, SystemEventType } from './event-enum';
import { KeyCode } from './key-code';

const _vec2 = new Vec2();

/**
 * @en The mouse event
 * @zh 鼠标事件类型
 */
export class EventMouse extends Event {
    /**
     * @en The default tag when no button is pressed
     * @zh 按键默认的缺省状态
     */
    public static BUTTON_MISSING = -1;

    /**
     * @en The tag of mouse's left button.
     * @zh 鼠标左键的标签。
     */
    public static BUTTON_LEFT = 0;

    /**
     * @en The tag of mouse's right button  (The right button number is 2 on browser).
     * @zh 鼠标右键的标签。
     */
    public static BUTTON_RIGHT = 2;

    /**
     * @en The tag of mouse's middle button.
     * @zh 鼠标中键的标签。
     */
    public static BUTTON_MIDDLE = 1;

    /**
     * @en The tag of mouse's button 4.
     * @zh 鼠标按键 4 的标签。
     */
    public static BUTTON_4 = 3;

    /**
     * @en The tag of mouse's button 5.
     * @zh 鼠标按键 5 的标签。
     */
    public static BUTTON_5 = 4;

    /**
     * @en The tag of mouse's button 6.
     * @zh 鼠标按键 6 的标签。
     */
    public static BUTTON_6 = 5;

    /**
     * @en The tag of mouse's button 7.
     * @zh 鼠标按键 7 的标签。
     */
    public static BUTTON_7 = 6;

    /**
     * @en The tag of mouse's button 8.
     * @zh 鼠标按键 8 的标签。
     */
    public static BUTTON_8 = 7;

    /**
     * @en Mouse movement on x axis of the UI coordinate system.
     * @zh 鼠标在 UI 坐标系下 X 轴上的移动距离
     */
    public movementX = 0;

    /**
     * @en Mouse movement on y axis of the UI coordinate system.
     * @zh 鼠标在 UI 坐标系下 Y 轴上的移动距离
     */
    public movementY = 0;

    private _eventType: SystemEventTypeUnion;
    /**
     * @en The type of the event
     * @zh 鼠标事件类型
     *
     * @deprecated since v3.3, please use EventMouse.prototype.type instead.
     */
    public get eventType () {
        return this._eventType;
    }

    private _button: number = EventMouse.BUTTON_MISSING;

    private _x = 0;

    private _y = 0;

    private _prevX = 0;

    private _prevY = 0;

    private _scrollX = 0;

    private _scrollY = 0;

    /**
     * @param eventType - The type of the event
     * @param bubbles - Indicate whether the event bubbles up through the hierarchy or not.
     */
    constructor (eventType: SystemEventTypeUnion, bubbles?: boolean, prevLoc?: Vec2) {
        super(eventType, bubbles);
        this._eventType = eventType;
        if (prevLoc) {
            this._prevX = prevLoc.x;
            this._prevY = prevLoc.y;
        }
    }

    /**
     * @en Sets scroll data of the mouse.
     * @zh 设置鼠标滚轮的滚动数据。
     * @param scrollX - The scroll value on x axis
     * @param scrollY - The scroll value on y axis
     */
    public setScrollData (scrollX: number, scrollY: number) {
        this._scrollX = scrollX;
        this._scrollY = scrollY;
    }

    /**
     * @en Returns the scroll value on x axis.
     * @zh 获取鼠标滚动的 X 轴距离，只有滚动时才有效。
     */
    public getScrollX () {
        return this._scrollX;
    }

    /**
     * @en Returns the scroll value on y axis.
     * @zh 获取滚轮滚动的 Y 轴距离，只有滚动时才有效。
     */
    public getScrollY () {
        return this._scrollY;
    }

    /**
     * @en Sets cursor location.
     * @zh 设置当前鼠标位置。
     * @param x - The location on x axis
     * @param y - The location on y axis
     */
    public setLocation (x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    /**
     * @en Returns cursor location.
     * @zh 获取鼠标相对于左下角位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getLocation (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        Vec2.set(out, this._x, this._y);
        return out;
    }

    /**
     * @en Returns the current cursor location in game view coordinates.
     * @zh 获取当前事件在游戏窗口内的坐标位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getLocationInView (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        Vec2.set(out, this._x, legacyCC.view._designResolutionSize.height - this._y);
        return out;
    }

    /**
     * @en Returns the current cursor location in ui coordinates.
     * @zh 获取当前事件在 UI 窗口内的坐标位置，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getUILocation (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        Vec2.set(out, this._x, this._y);
        legacyCC.view._convertPointWithScale(out);
        return out;
    }

    /**
     * @en Returns the previous touch location.
     * @zh 获取鼠标点击在上一次事件时的位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getPreviousLocation (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        Vec2.set(out, this._prevX, this._prevY);
        return out;
    }

    /**
     * @en Returns the previous touch location.
     * @zh 获取鼠标点击在上一次事件时的位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getUIPreviousLocation (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        Vec2.set(out, this._prevX, this._prevY);
        legacyCC.view._convertPointWithScale(out);
        return out;
    }

    /**
     * @en Returns the delta distance from the previous location to current location.
     * @zh 获取鼠标距离上一次事件移动的距离对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getDelta (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        Vec2.set(out, this._x - this._prevX, this._y - this._prevY);
        return out;
    }

    /**
     * @en Returns the X axis delta distance from the previous location to current location.
     * @zh 获取鼠标距离上一次事件移动的 X 轴距离。
     */
    public getDeltaX () {
        return this._x - this._prevX;
    }

    /**
     * @en Returns the Y axis delta distance from the previous location to current location.
     * @zh 获取鼠标距离上一次事件移动的 Y 轴距离。
     */
    public getDeltaY () {
        return this._y - this._prevY;
    }

    /**
     * @en Returns the delta distance from the previous location to current location in the UI coordinates.
     * @zh 获取鼠标距离上一次事件移动在 UI 坐标系下的距离对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getUIDelta (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        Vec2.set(out, (this._x - this._prevX) / legacyCC.view.getScaleX(), (this._y - this._prevY) / legacyCC.view.getScaleY());
        return out;
    }

    /**
     * @en Returns the X axis delta distance from the previous location to current location in the UI coordinates.
     * @zh 获取鼠标距离上一次事件移动在 UI 坐标系下的 X 轴距离。
     */
    public getUIDeltaX () {
        return (this._x - this._prevX) / legacyCC.view.getScaleX();
    }

    /**
     * @en Returns the Y axis delta distance from the previous location to current location in the UI coordinates.
     * @zh 获取鼠标距离上一次事件移动在 UI 坐标系下的 Y 轴距离。
     */
    public getUIDeltaY () {
        return (this._y - this._prevY) / legacyCC.view.getScaleY();
    }

    /**
     * @en Sets mouse button code.
     * @zh 设置鼠标按键。
     * @param button - The button code
     */
    public setButton (button: number) {
        this._button = button;
    }

    /**
     * @en Returns mouse button code.
     * @zh 获取鼠标按键。
     */
    public getButton () {
        return this._button;
    }

    /**
     * @en Returns location data on X axis.
     * @zh 获取鼠标当前 X 轴位置。
     */
    public getLocationX () {
        return this._x;
    }

    /**
     * @en Returns location data on Y axis.
     * @zh 获取鼠标当前 Y 轴位置。
     */
    public getLocationY () {
        return this._y;
    }

    /**
     * @en Returns location data on X axis.
     * @zh 获取鼠标当前 X 轴位置。
     */
    public getUILocationX () {
        const viewport = legacyCC.view.getViewportRect();
        return (this._x - viewport.x) / legacyCC.view.getScaleX();
    }

    /**
     * @en Returns location data on Y axis.
     * @zh 获取鼠标当前 Y 轴位置。
     */
    public getUILocationY () {
        const viewport = legacyCC.view.getViewportRect();
        return (this._y - viewport.y) / legacyCC.view.getScaleY();
    }
}

/**
 * @en
 * The touch event.
 *
 * @zh
 * 触摸事件。
 */
export class EventTouch extends Event {
    /**
     * @en The maximum touch point numbers simultaneously
     * @zh 同时存在的最大触点数量。
     */
    public static MAX_TOUCHES = 5;

    /**
     * @en The current touch object
     * @zh 当前触点对象
     */
    public touch: Touch | null = null;
    /**
     * @en Indicate whether the touch event is simulated or real
     * @zh 表示触摸事件是真实触点触发的还是模拟的
     */
    public simulate = false;

    private _eventCode: SystemEventTypeUnion;  // deprecated since v3.3

    private _touches: Touch[];

    private _allTouches: Touch[];

    /**
     * @param touches - An array of current touches
     * @param bubbles - Indicate whether the event bubbles up through the hierarchy or not.
     * @param eventType - The type of the event
     */
    constructor (changedTouches: Touch[], bubbles: boolean, eventType: SystemEventTypeUnion, touches: Touch[] = []) {
        super(eventType, bubbles);
        this._eventCode = eventType;
        this._touches = changedTouches || [];
        this._allTouches = touches;
    }

    /**
     * @en Returns event type code.
     * @zh 获取触摸事件类型。
     *
     * @deprecated since v3.3, please use EventTouch.prototype.type instead.
     */
    public getEventCode () {
        return this._eventCode;
    }

    /**
     * @en Returns touches of event.
     * @zh 获取有变动的触摸点的列表。
     * 注意：第一根手指按下不动，接着按第二根手指，这时候触点信息就只有变动的这根手指（第二根手指）的信息。
     * 如果需要获取全部手指的信息，请使用 `getAllTouches`。
     */
    public getTouches () {
        return this._touches;
    }

    /**
     * @en Returns touches of event.
     * @zh 获取所有触摸点的列表。
     * 注意：如果手指行为是 touch end，这个时候列表是没有该手指信息的。如需知道该手指信息，可通过 `getTouches` 获取识别。
     */
    public getAllTouches () {
        return this._allTouches;
    }

    /**
     * @en Sets touch location.
     * @zh 设置当前触点位置
     * @param x - The current touch location on the x axis
     * @param y - The current touch location on the y axis
     */
    public setLocation (x: number, y: number) {
        if (this.touch) {
            this.touch.setTouchInfo(this.touch.getID(), x, y);
        }
    }

    /**
     * @en Returns the current touch location.
     * @zh 获取触点位置。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getLocation (out?: Vec2) {
        return this.touch ? this.touch.getLocation(out) : new Vec2();
    }

    /**
     * @en Returns the current touch location in UI coordinates.
     * @zh 获取 UI 坐标系下的触点位置。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getUILocation (out?: Vec2) {
        return this.touch ? this.touch.getUILocation(out) : new Vec2();
    }

    /**
     * @en Returns the current touch location in game screen coordinates.
     * @zh 获取当前触点在游戏窗口中的位置。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getLocationInView (out?: Vec2) {
        return this.touch ? this.touch.getLocationInView(out) : new Vec2();
    }

    /**
     * @en Returns the previous touch location.
     * @zh 获取触点在上一次事件时的位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getPreviousLocation (out?: Vec2) {
        return this.touch ? this.touch.getPreviousLocation(out) : new Vec2();
    }

    /**
     * @en Returns the start touch location.
     * @zh 获取触点落下时的位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getStartLocation (out?: Vec2) {
        return this.touch ? this.touch.getStartLocation(out) : new Vec2();
    }

    /**
     * @en Returns the start touch location in UI coordinates.
     * @zh 获取触点落下时的 UI 世界下位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getUIStartLocation (out?: Vec2) {
        return this.touch ? this.touch.getUIStartLocation(out) : new Vec2();
    }

    /**
     * @en Returns the id of the current touch point.
     * @zh 获取触点的标识 ID，可以用来在多点触摸中跟踪触点。
     */
    public getID () {
        return this.touch ? this.touch.getID() : null;
    }

    /**
     * @en Returns the delta distance from the previous location to current location.
     * @zh 获取触点距离上一次事件移动的距离对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getDelta (out?: Vec2) {
        return this.touch ? this.touch.getDelta(out) : new Vec2();
    }

    /**
     * @en Returns the delta distance from the previous location to current location.
     * @zh 获取触点距离上一次事件 UI 世界下移动的距离对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
    */
    public getUIDelta (out?: Vec2) {
        return this.touch ? this.touch.getUIDelta(out) : new Vec2();
    }

    /**
     * @en Returns the X axis delta distance from the previous location to current location.
     * @zh 获取触点距离上一次事件移动的 x 轴距离。
     */
    public getDeltaX () {
        return this.touch ? this.touch.getDelta(_vec2).x : 0;
    }

    /**
     * @en Returns the Y axis delta distance from the previous location to current location.
     * @zh 获取触点距离上一次事件移动的 y 轴距离。
     */
    public getDeltaY () {
        return this.touch ? this.touch.getDelta(_vec2).y : 0;
    }

    /**
     * @en Returns location X axis data.
     * @zh 获取当前触点 X 轴位置。
     */
    public getLocationX () {
        return this.touch ? this.touch.getLocationX() : 0;
    }

    /**
     * @en Returns location Y axis data.
     * @zh 获取当前触点 Y 轴位置。
     */
    public getLocationY () {
        return this.touch ? this.touch.getLocationY() : 0;
    }
}

/**
 * @en
 * The acceleration event.
 * @zh
 * 加速计事件。
 */
export class EventAcceleration extends Event {
    /**
     * @en The acceleration object
     * @zh 加速度对象
     */
    public acc: Acceleration;

    /**
     * @param acc - The acceleration
     * @param bubbles - Indicate whether the event bubbles up through the hierarchy or not.
     */
    constructor (acc: Acceleration, bubbles?: boolean) {
        super(SystemEventType.DEVICEMOTION, bubbles);
        this.acc = acc;
    }
}

/**
 * @en
 * The keyboard event.
 * @zh
 * 键盘事件。
 */
export class EventKeyboard extends Event {
    /**
     * @en The KeyCode enum value of current keyboard event.
     * @zh 当前键盘事件的 KeyCode 枚举值
     */
    public keyCode: KeyCode;

    /**
     * @en Raw DOM KeyboardEvent.
     * @zh 原始 DOM KeyboardEvent 事件对象
     *
     * @deprecated since v3.3, can't access rawEvent anymore
     */
    public rawEvent?: KeyboardEvent;

    private _isPressed: boolean;
    /**
     * @en Indicates whether the current key is being pressed
     * @zh 表示当前按键是否正在被按下
     */
    public get isPressed () {
        return this._isPressed;
    }

    /**
     * @param keyCode - The key code of the current key or the DOM KeyboardEvent
     * @param isPressed - Indicates whether the current key is being pressed, this is the DEPRECATED parameter.
     * @param bubbles - Indicates whether the event bubbles up through the hierarchy or not.
     */
    constructor (keyCode: number | KeyboardEvent, isPressed: boolean, bubbles?: boolean);
    /**
     * @param keyCode - The key code of the current key or the DOM KeyboardEvent
     * @param eventType - The type of the event
     * @param bubbles - Indicates whether the event bubbles up through the hierarchy or not.
     */
    constructor (keyCode: KeyCode | KeyboardEvent, eventType: SystemEventTypeUnion, bubbles?: boolean);
    constructor (keyCode: any, eventType: SystemEventTypeUnion | boolean, bubbles?: boolean) {
        if (typeof eventType === 'boolean') {
            const isPressed = eventType;
            eventType = isPressed ? SystemEventType.KEY_DOWN : SystemEventType.KEY_UP;
        }
        super(eventType, bubbles);
        this._isPressed = eventType !== SystemEventType.KEY_UP;

        if (typeof keyCode === 'number') {
            this.keyCode = keyCode;
        } else {
            this.keyCode = keyCode.keyCode;
            this.rawEvent = keyCode;
        }
    }
}

// @ts-expect-error TODO
Event.EventMouse = EventMouse;

// @ts-expect-error TODO
Event.EventTouch = EventTouch;

// @ts-expect-error TODO
Event.EventAcceleration = EventAcceleration;

// @ts-expect-error TODO
Event.EventKeyboard = EventKeyboard;
