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
import { CCBoolean, CCFloat, _decorator } from '../../../../core';
import { IWheelJoint } from '../../../spec/i-physics-joint';
import { EJoint2DType } from '../../physics-types';
import { help, serializable, tooltip, type } from '../../../../core/data/decorators';

const { ccclass, menu, property } = _decorator;

@ccclass('cc.WheelJoint2D')
@help('i18n:cc.Joint2D')
@menu('Physics2D/Joints/WheelJoint2D')
export class WheelJoint2D extends Joint2D {
    TYPE = EJoint2DType.WHEEL;

    /**
     * @en Wheel susspension direction.
     * @zh 轮子震动方向。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.angle')
    get angle (): number {
        return this._angle;
    }
    set angle (v: number) {
        this._angle = v;
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
        if (this._joint) {
            (this._joint as IWheelJoint).enableMotor(v);
        }
    }

    /**
     * @en
     * The maxium torque can be applied to rigidbody to rearch the target motor speed.
     * @zh
     * 可以施加到刚体的最大扭矩。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.maxMotorTorque')
    get maxMotorTorque (): number {
        return this._maxMotorTorque;
    }
    set maxMotorTorque (v: number) {
        this._maxMotorTorque = v;
        if (this._joint) {
            (this._joint as IWheelJoint).setMaxMotorTorque(v);
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
            (this._joint as IWheelJoint).setMotorSpeed(v);
        }
    }

    /**
     * @en
     * The spring frequency.
     * @zh
     * 弹性系数。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.frequency')
    get frequency (): number {
        return this._frequency;
    }
    set frequency (v: number) {
        this._frequency = v;
        if (this._joint) {
            (this._joint as IWheelJoint).setFrequency(v);
        }
    }

    /**
     * @en
     * The damping ratio.
     * @zh
     * 阻尼，表示关节变形后，恢复到初始状态受到的阻力。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.dampingRatio')
    get dampingRatio (): number {
        return this._dampingRatio;
    }
    set dampingRatio (v: number) {
        this._dampingRatio = v;
        if (this._joint) {
            (this._joint as IWheelJoint).setDampingRatio(v);
        }
    }

    /// private properties

    @serializable
    private _angle = 90;

    @serializable
    private _enableMotor = false;

    @serializable
    private _maxMotorTorque = 1000;

    @serializable
    private _motorSpeed = 0;

    @serializable
    private _frequency = 5;

    @serializable
    private _dampingRatio = 0.7;
}
