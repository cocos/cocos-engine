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

import { Vec2 } from '../../math';
import { legacyCC } from '../../global-exports';

const _vec2 = new Vec2();
/**
 * @en The touch point class
 * @zh 封装了触点相关的信息。
 */
export class Touch {
    private _point: Vec2 = new Vec2();
    private _prevPoint: Vec2 = new Vec2();
    private _lastModified = 0;
    private _id = 0;
    private _startPoint: Vec2 = new Vec2();
    private _startPointCaptured = false;

    get lastModified () {
        return this._lastModified;
    }

    /**
     * @param x - x position of the touch point
     * @param y - y position of the touch point
     * @param id - The id of the touch point
     */
    constructor (x: number, y: number, id = 0) {
        this.setTouchInfo(id, x, y);
    }

    /**
     * @en Returns the current touch location in OpenGL coordinates.、
     * @zh 获取当前触点位置。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getLocation (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        out.set(this._point.x, this._point.y);
        return out;
    }

    /**
     * @en Returns X axis location value.
     * @zh 获取当前触点 X 轴位置。
     */
    public getLocationX () {
        return this._point.x;
    }

    /**
     * @en Returns Y axis location value.
     * @zh 获取当前触点 Y 轴位置。
     */
    public getLocationY () {
        return this._point.y;
    }

    /**
     * @en Returns the current touch location in UI coordinates.、
     * @zh 获取当前触点在 UI 坐标系中的位置。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getUILocation (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        out.set(this._point.x, this._point.y);
        legacyCC.view._convertPointWithScale(out);
        return out;
    }

    /**
     * @en Returns X axis location value in UI coordinates.
     * @zh 获取当前触点在 UI 坐标系中 X 轴位置。
     */
    public getUILocationX () {
        const viewport = legacyCC.view.getViewportRect();
        return (this._point.x - viewport.x) / legacyCC.view.getScaleX();
    }

    /**
     * @en Returns Y axis location value in UI coordinates.
     * @zh 获取当前触点在 UI 坐标系中 Y 轴位置。
     */
    public getUILocationY () {
        const viewport = legacyCC.view.getViewportRect();
        return (this._point.y - viewport.y) / legacyCC.view.getScaleY();
    }

    /**
     * @en Returns the previous touch location.
     * @zh 获取触点在上一次事件时的位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getPreviousLocation (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        out.set(this._prevPoint.x, this._prevPoint.y);
        return out;
    }

    /**
     * @en Returns the previous touch location in UI coordinates.
     * @zh 获取触点在上一次事件时在 UI 坐标系中的位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getUIPreviousLocation (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        out.set(this._prevPoint.x, this._prevPoint.y);
        legacyCC.view._convertPointWithScale(out);
        return out;
    }

    /**
     * @en Returns the start touch location.
     * @zh 获取触点落下时的位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getStartLocation (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        out.set(this._startPoint.x, this._startPoint.y);
        return out;
    }

    /**
     * @en Returns the start touch location in UI coordinates.
     * @zh 获取触点落下时在 UI 坐标系中的位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getUIStartLocation (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        out.set(this._startPoint.x, this._startPoint.y);
        legacyCC.view._convertPointWithScale(out);
        return out;
    }

    /**
     * @en Returns the delta distance from the previous touche to the current one.
     * @zh 获取触点距离上一次事件移动的距离对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getDelta (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        out.set(this._point);
        out.subtract(this._prevPoint);
        return out;
    }

    /**
     * @en Returns the delta distance from the previous touche to the current one in UI coordinates.
     * @zh 获取触点距离上一次事件移动在 UI 坐标系中的距离对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getUIDelta (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        _vec2.set(this._point);
        _vec2.subtract(this._prevPoint);
        out.set(legacyCC.view.getScaleX(), legacyCC.view.getScaleY());
        Vec2.divide(out, _vec2, out);
        return out;
    }

    /**
     * @en Returns the current touch location in screen coordinates.
     * @zh 获取当前事件在游戏窗口内的坐标位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getLocationInView (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        out.set(this._point.x, legacyCC.view._designResolutionSize.height - this._point.y);
        return out;
    }

    /**
     * @en Returns the previous touch location in screen coordinates.
     * @zh 获取触点在上一次事件时在游戏窗口中的位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getPreviousLocationInView (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        out.set(this._prevPoint.x, legacyCC.view._designResolutionSize.height - this._prevPoint.y);
        return out;
    }

    /**
     * @en Returns the start touch location in screen coordinates.
     * @zh 获取触点落下时在游戏窗口中的位置对象，对象包含 x 和 y 属性。
     * @param out - Pass the out object to avoid object creation, very good practice
     */
    public getStartLocationInView (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        out.set(this._startPoint.x, legacyCC.view._designResolutionSize.height - this._startPoint.y);
        return out;
    }

    /**
     * @en Returns the id of the touch point.
     * @zh 触点的标识 ID，可以用来在多点触摸中跟踪触点。
     */
    public getID () {
        return this._id;
    }

    /**
     * @en Resets touch point information.
     * @zh 重置触点相关的信息。
     * @param id - The id of the touch point
     * @param x - x position of the touch point
     * @param y - y position of the touch point
     */
    public setTouchInfo (id = 0, x?: number, y?: number) {
        this._prevPoint = this._point;
        this._point = new Vec2(x || 0, y || 0);
        this._id = id;
        if (!this._startPointCaptured) {
            this._startPoint = new Vec2(this._point);
            // cc.view._convertPointWithScale(this._startPoint);
            this._startPointCaptured = true;
        }
    }

    /**
     * @en Sets touch point location.
     * @zh 设置触点位置。
     * @param point - The location
     */
    public setPoint (point: Vec2): void;

    /**
     * @en Sets touch point location.
     * @zh 设置触点位置。
     * @param x - x position
     * @param y - y position
     */
    public setPoint (x: number, y: number): void;

    public setPoint (x: number | Vec2, y?: number) {
        if (typeof x === 'object') {
            this._point.x = x.x;
            this._point.y = x.y;
        } else {
            this._point.x = x || 0;
            this._point.y = y || 0;
        }
        this._lastModified = legacyCC.game.getFrameStartTime();
    }

    /**
     * @en Sets the location previously registered for the current touch.
     * @zh 设置触点在前一次触发时收集的位置。
     * @param point - The location
     */
    public setPrevPoint (point: Vec2): void;

    /**
     * @en Sets the location previously registered for the current touch.
     * @zh 设置触点在前一次触发时收集的位置。
     * @param x - x position
     * @param y - y position
     */
    public setPrevPoint (x: number, y: number): void;

    public setPrevPoint (x: number | Vec2, y?: number) {
        if (typeof x === 'object') {
            this._prevPoint = new Vec2(x.x, x.y);
        } else {
            this._prevPoint = new Vec2(x || 0, y || 0);
        }
        this._lastModified = legacyCC.game.getFrameStartTime();
    }
}

legacyCC.Touch = Touch;
