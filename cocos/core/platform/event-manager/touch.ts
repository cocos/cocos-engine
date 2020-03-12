/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 * @category event
 */

import { Vec2 } from '../../math';

const _vec2 = new Vec2();
/**
 * @en The touch event class
 * @zh 封装了触摸相关的信息。
 * @class Touch
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} id
 */
export class Touch {
    /**
     * @zh 不建议用户直接使用。
     */
    public point: Vec2 = new Vec2();
    /**
     * @zh 不建议用户直接使用。
     */
    public prevPoint: Vec2 = new Vec2();
    /**
     * @zh 不建议用户直接使用。
     */
    public lastModified = 0;
    private _id: number | null = null;
    private _startPoint: Vec2 = new Vec2();
    private _startPointCaptured: boolean = false;

    constructor (x: number, y: number, id: number | null = null) {
        this.setTouchInfo(id, x, y);
    }

    /**
     * @en Returns the current touch location in OpenGL coordinates.、
     * @zh 获取当前触点位置。
     */
    public getLocation (out?: Vec2) {
        if (!out){
            out = new Vec2();
        }

        out.set(this.point.x, this.point.y);
        return out;
    }

    /**
     * @en Returns X axis location value.
     * @zh 获取当前触点 X 轴位置。
     */
    public getLocationX () {
        return this.point.x;
    }

    /**
     * @en Returns Y axis location value.
     * @zh 获取当前触点 Y 轴位置。
     */
    public getLocationY () {
        return this.point.y;
    }

    /**
     * @en Returns the current touch location in OpenGL coordinates.、
     * @zh 获取当前触点位置。
     */
    public getUILocation (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        out.set(this.point.x, this.point.y);
        cc.view._convertPointWithScale(out);
        return out;
    }

    /**
     * @en Returns X axis location value.
     * @zh 获取当前触点 X 轴位置。
     */
    public getUILocationX () {
        const viewport = cc.view.getViewportRect();
        return (this.point.x - viewport.x) / cc.view.getScaleX();
    }

    /**
     * @en Returns Y axis location value.
     * @zh 获取当前触点 Y 轴位置。
     */
    public getUILocationY () {
        const viewport = cc.view.getViewportRect();
        return (this.point.y - viewport.y) / cc.view.getScaleY();
    }

    /**
     * @en Returns the previous touch location in OpenGL coordinates.
     * @zh 获取触点在上一次事件时的位置对象，对象包含 x 和 y 属性。
     */
    public getPreviousLocation (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        out.set(this.prevPoint.x, this.prevPoint.y);
        return out;
    }

    /**
     * @en Returns the previous touch location in OpenGL coordinates.
     * @zh 获取触点在上一次事件时的位置对象，对象包含 x 和 y 属性。
     */
    public getUIPreviousLocation (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        out.set(this.prevPoint.x, this.prevPoint.y);
        cc.view._convertPointWithScale(out);
        return out;
    }

    /**
     * @en Returns the start touch location in OpenGL coordinates.
     * @zh 获获取触点落下时的位置对象，对象包含 x 和 y 属性。
     */
    public getStartLocation (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        out.set(this._startPoint.x, this._startPoint.y);
        return out;
    }

    /**
     * @en Returns the start touch location in OpenGL coordinates.
     * @zh 获获取触点落下时的位置对象，对象包含 x 和 y 属性。
     */
    public getUIStartLocation (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        out.set(this._startPoint.x, this._startPoint.y);
        cc.view._convertPointWithScale(out);
        return out;
    }

    /**
     * @en Returns the delta distance from the previous touche to the current one in screen coordinates.
     * @zh 获取触点距离上一次事件移动的距离对象，对象包含 x 和 y 属性。
     */
    public getDelta (out?: Vec2) {
        if (!out){
            out = new Vec2();
        }

        out.set(this.point);
        out.subtract(this.prevPoint);
        return out;
    }

    /**
     * @en Returns the delta distance from the previous touche to the current one in screen coordinates.
     * @zh 获取触点距离上一次事件移动的距离对象，对象包含 x 和 y 属性。
     */
    public getUIDelta (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        _vec2.set(this.point);
        _vec2.subtract(this.prevPoint);
        out.set(cc.view.getScaleX(), cc.view.getScaleY());
        Vec2.divide(out, _vec2, out);
        return out;
    }

    /**
     * @en Returns the current touch location in screen coordinates.
     * @zh 获取当前事件在游戏窗口内的坐标位置对象，对象包含 x 和 y 属性。
     */
    public getLocationInView (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        out.set(this.point.x, cc.view._designResolutionSize.height - this.point.y);
        return out;
    }

    /**
     * @en Returns the previous touch location in screen coordinates.
     * @zh 获取触点在上一次事件时在游戏窗口中的位置对象，对象包含 x 和 y 属性。
     */
    public getPreviousLocationInView (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        out.set(this.prevPoint.x, cc.view._designResolutionSize.height - this.prevPoint.y);
        return out;
    }

    /**
     * @en Returns the start touch location in screen coordinates.
     * @zh 获取触点落下时在游戏窗口中的位置对象，对象包含 x 和 y 属性。
     */
    public getStartLocationInView (out?: Vec2) {
        if (!out) {
            out = new Vec2();
        }

        out.set(this._startPoint.x, cc.view._designResolutionSize.height - this._startPoint.y);
        return out;
    }

    /**
     * @en Returns the id of cc.Touch.
     * @zh 触点的标识 ID，可以用来在多点触摸中跟踪触点。
     */
    public getID () {
        return this._id;
    }

    /**
     * @en Sets information to touch.
     * @zh 设置触摸相关的信息。用于监控触摸事件。
     */
    public setTouchInfo (id: number | null = null, x?: number, y?: number) {
        this.prevPoint = this.point;
        this.point = new Vec2(x || 0, y || 0);
        this._id = id;
        if (!this._startPointCaptured) {
            this._startPoint = new Vec2(this.point);
            // cc.view._convertPointWithScale(this._startPoint);
            this._startPointCaptured = true;
        }
    }

    public setPoint (point: Vec2): void;

    public setPoint (x: number, y: number): void;

    /**
     * @zh 设置屏幕触点信息。
     * NOTE：不建议用户调用。
     * @param x 当前屏幕横向触摸点
     * @param y 当前屏幕纵向触摸点
     */
    public setPoint (x: number | Vec2, y?: number) {
        if (typeof x === 'object') {
            this.point.x = x.x;
            this.point.y = x.y;
        } else {
            this.point.x = x || 0;
            this.point.y = y || 0;
        }
    }

    public setPrevPoint (point: Vec2): void;

    public setPrevPoint (x: number, y: number): void;

    /**
     * @zh 设置上一次屏幕触点信息。
     * NOTE：不建议用户调用。
     * @param x 上一次屏幕横向触摸点
     * @param y 上一次屏幕纵向触摸点
     */
    public setPrevPoint (x: number | Vec2, y?: number) {
        if (typeof x === 'object') {
            this.prevPoint = new Vec2(x.x, x.y);
        } else {
            this.prevPoint = new Vec2(x || 0, y || 0);
        }
    }
}

cc.Touch = Touch;
