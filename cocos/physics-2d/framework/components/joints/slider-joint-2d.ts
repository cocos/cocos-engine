/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

import { Joint2D } from './joint-2d';
import { ISliderJoint } from '../../../spec/i-physics-joint';
import { EJoint2DType } from '../../physics-types';
import { Vec2, IVec2Like, toDegree, _decorator, CCFloat, CCBoolean } from '../../../../core';
import { help, serializable, tooltip, type } from '../../../../core/data/decorators';

const tempVec2 = new Vec2();
const { ccclass, menu, property } = _decorator;

@ccclass('cc.SliderJoint2D')
@help('i18n:cc.Joint2D')
@menu('Physics2D/Joints/SliderJoint2D')
export class SliderJoint2D extends Joint2D {
    TYPE = EJoint2DType.SLIDER;

    /**
     * @en Slide direction.
     * @zh 滑动的方向。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.angle')
    get angle (): number {
        if (this._autoCalcAngle) {
            if (this.connectedBody) {
                Vec2.subtract(tempVec2, this.connectedBody.node.worldPosition as IVec2Like, this.node.worldPosition as IVec2Like);
            } else {
                Vec2.subtract(tempVec2, new Vec2(0, 0), this.node.worldPosition as IVec2Like);
            }
            this._angle = toDegree(Math.atan2(tempVec2.y, tempVec2.x));
        }
        return this._angle;
    }
    set angle (v: number) {
        this._angle = v;
    }

    /**
     * @en Auto calculate slide direction according to the slide direction.
     * @zh 根据连接的两个刚体自动计算滑动方向。
     */
    @type(CCBoolean)
    @tooltip('i18n:physics2d.joint.autoCalcAngle')
    get autoCalcAngle (): boolean {
        return this._autoCalcAngle;
    }
    set autoCalcAngle (v: boolean) {
        this._autoCalcAngle = v;
    }

    /**
     * @en
     * Enable joint motor?
     * @zh
     * 是否开启关节马达？
     */
    @type(CCBoolean)
    @tooltip('i18n:physics2d.joint.enableMotor')
    get enableMotor (): boolean {
        return this._enableMotor;
    }
    set enableMotor (v: boolean) {
        this._enableMotor = v;
    }

    /**
     * @en
     * The maxium force can be applied to rigidbody to rearch the target motor speed.
     * @zh
     * 可以施加到刚体的最大力。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.maxMotorForce')
    get maxMotorForce (): number {
        return this._maxMotorForce;
    }
    set maxMotorForce (v: number) {
        this._maxMotorForce = v;
        if (this._joint) {
            (this._joint as ISliderJoint).setMaxMotorForce(v);
        }
    }

    /**
     * @en
     * The expected motor speed.
     * @zh
     * 期望的马达速度。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.motorSpeed')
    get motorSpeed (): number {
        return this._motorSpeed;
    }
    set motorSpeed (v: number) {
        this._motorSpeed = v;
        if (this._joint) {
            (this._joint as ISliderJoint).setMotorSpeed(v);
        }
    }

    /**
     * @en
     * Enable joint distance limit?
     * @zh
     * 是否开启关节的距离限制？
     */
    @type(CCBoolean)
    @tooltip('i18n:physics2d.joint.enableLimit')
    get enableLimit (): boolean {
        return this._enableLimit;
    }
    set enableLimit (v: boolean) {
        this._enableLimit = v;
    }

    /**
     * @en
     * The lower joint limit.
     * @zh
     * 刚体能够移动的最小值。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.lowerLimit')
    get lowerLimit (): number {
        return this._lowerLimit;
    }
    set lowerLimit (v: number) {
        this._lowerLimit = v;
        if (this._joint) {
            (this._joint as ISliderJoint).setLowerLimit(v);
        }
    }

    /**
     * @en
     * The lower joint limit.
     * @zh
     * 刚体能够移动的最大值。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.upperLimit')
    get upperLimit (): number {
        return this._upperLimit;
    }
    set upperLimit (v: number) {
        this._upperLimit = v;
        if (this._joint) {
            (this._joint as ISliderJoint).setUpperLimit(v);
        }
    }

    /// private properties

    @serializable
    private _angle = 0;

    @serializable
    private _autoCalcAngle = true;

    @serializable
    private _enableMotor = false;

    @serializable
    private _maxMotorForce = 1000;

    @serializable
    private _motorSpeed = 1000;

    @serializable
    private _enableLimit = false;

    @serializable
    private _lowerLimit = 0;

    @serializable
    private _upperLimit = 0;
}
