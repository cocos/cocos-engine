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
import { IHingeJoint } from '../../../spec/i-physics-joint';
import { EJoint2DType } from '../../physics-types';
import { help, serializable, tooltip, type } from '../../../../core/data/decorators';

const { ccclass, menu, property } = _decorator;

@ccclass('cc.HingeJoint2D')
@help('i18n:cc.Joint2D')
@menu('Physics2D/Joints/HingeJoint2D')
export class HingeJoint2D extends Joint2D {
    TYPE = EJoint2DType.HINGE;

    /**
     * @en
     * Enable joint limit?
     * @zh
     * 是否开启关节的限制？
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
     * The lower angle.
     * @zh
     * 角度的最低限制。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.lowerAngle')
    get lowerAngle (): number {
        return this._lowerAngle;
    }
    set lowerAngle (v: number) {
        this._lowerAngle = v;
        if (this._joint) {
            (this._joint as IHingeJoint).setLowerAngle(v);
        }
    }

    /**
     * @en
     * The upper angle.
     * @zh
     * 角度的最高限制。
     */
    @type(CCFloat)
    @tooltip('i18n:physics2d.joint.upperAngle')
    get upperAngle (): number {
        return this._upperAngle;
    }
    set upperAngle (v: number) {
        this._upperAngle = v;
        if (this._joint) {
            (this._joint as IHingeJoint).setUpperAngle(v);
        }
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
            (this._joint as IHingeJoint).enableMotor(v);
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
            (this._joint as IHingeJoint).setMaxMotorTorque(v);
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
            (this._joint as IHingeJoint).setMotorSpeed(v);
        }
    }

    /// private properties

    @serializable
    private _enableLimit = false;

    @serializable
    private _lowerAngle = 0;

    @serializable
    private _upperAngle = 0;

    @serializable
    private _enableMotor = false;

    @serializable
    private _maxMotorTorque = 1000;

    @serializable
    private _motorSpeed = 0;
}
