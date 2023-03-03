/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import {
    ccclass,
    help,
    menu,
    serializable,
    formerlySerializedAs,
    type,
} from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { Constraint } from './constraint';
import { Vec3, cclegacy, CCFloat, CCBoolean } from '../../../../core';
import { EConstraintType } from '../../physics-enum';
import { IHingeConstraint } from '../../../spec/i-physics-constraint';

@ccclass('cc.HingeLimitData')
@help('i18n:cc.HingeLimitData')
@menu('Physics/HingeLimitData')
export class HingeLimitData {
    @serializable
    @formerlySerializedAs('enabled')
    private _enabled = false;

    @serializable
    @formerlySerializedAs('upperLimit')
    private _upperLimit = Number.MAX_VALUE;

    @serializable
    @formerlySerializedAs('lowerLimit')
    private _lowerLimit = -Number.MAX_VALUE;

    private _constraint: HingeConstraint | null = null;

    constructor (constraint: HingeConstraint | null) {
        this._constraint = constraint;
    }

    /**
     * @en
     * Whether to enable the rotation limit of the hinge constraint.
     * @zh
     * 是否开启旋转限制。
     */
    @type(Boolean)
    get enabled (): boolean {
        return this._enabled;
    }
    set enabled (v: boolean) {
        this._enabled = v;
        if (!EDITOR || cclegacy.GAME_VIEW) {
            this._constraint!.constraint.setLimitEnabled(v);
        }
    }

    /**
     * @en
     * The upper limit to the rotation of pivotB related to pivotB's local position. (in degrees)
     * @zh
     * 转轴约束的旋转上限。（以度为单位）
     */
    @type(CCFloat)
    get upperLimit (): number {
        return this._upperLimit;
    }
    set upperLimit (v: number) {
        this._upperLimit = v;
    }

    /**
     * @en
     * The lower limit to the rotation of pivotB related to pivotB's local position. (in degrees)
     * @zh
     * 转轴约束的旋转下限。（以度为单位）
     */
    @type(CCFloat)
    get lowerLimit (): number {
        return this._lowerLimit;
    }
    set lowerLimit (v: number) {
        this._lowerLimit = v;
    }
}

@ccclass('cc.HingeMotorData')
@help('i18n:cc.HingeMotorData')
@menu('Physics/HingeMotorData')
export class HingeMotorData {
    @serializable
    @formerlySerializedAs('enabled')
    private _enabled = false;

    @serializable
    @formerlySerializedAs('motorVelocity')
    private _motorVelocity = 0;

    @serializable
    @formerlySerializedAs('motorForceLimit')
    private _motorForceLimit = 0;

    private _constraint: HingeConstraint | null = null;

    constructor (constraint) {
        this._constraint = constraint;
    }

    /**
     * @en
     * Whether the motor is enabled or not.
     * @zh
     * 转轴约束是否启用 Motor
     */
    @type(CCBoolean)
    get enabled (): boolean {
        return this._enabled;
    }
    set enabled (v: boolean) {
        this._enabled = v;
        if (!EDITOR || cclegacy.GAME_VIEW) {
            this._constraint!.constraint.setMotorEnabled(v);
        }
    }

    /**
     * @en
     * The rotation speed of pivotA related to pivotB. (in degrees per second)
     * @zh
     * 转轴约束的旋转速度。（以度每秒为单位）
     */
    @type(CCFloat)
    get motorVelocity (): number {
        return this._motorVelocity;
    }
    set motorVelocity (v: number) {
        this._motorVelocity = v;
        if (!EDITOR || cclegacy.GAME_VIEW) {
            this._constraint!.constraint.setMotorVelocity(v);
        }
    }

    /**
     * @en
     * The max drive force of the motor.
     * @zh
     * 转轴约束的最大驱动力。
     */
    @type(CCFloat)
    get motorForceLimit (): number {
        return this._motorForceLimit;
    }
    set motorForceLimit (v: number) {
        this._motorForceLimit = v;
        if (!EDITOR || cclegacy.GAME_VIEW) {
            this._constraint!.constraint.setMotorForceLimit(v);
        }
    }
}

@ccclass('cc.HingeConstraint')
@help('i18n:cc.HingeConstraint')
@menu('Physics/HingeConstraint(beta)')
export class HingeConstraint extends Constraint {
    /**
     * @en
     * The position of the own rigid body in local space with respect to the constraint axis.
     * @zh
     * 在本地空间中，自身刚体相对于约束关节的位置。
     */
    @type(Vec3)
    get pivotA (): Vec3 {
        return this._pivotA;
    }

    set pivotA (v: Vec3) {
        Vec3.copy(this._pivotA, v);
        if (!EDITOR || cclegacy.GAME_VIEW) {
            this.constraint.setPivotA(this._pivotA);
        }
    }

    /**
     * @en
     * The position of the connected rigid body in the local space with respect to the constraint axis.
     * @zh
     * 在本地空间中，连接刚体相对于约束关节的位置。
     */
    @type(Vec3)
    get pivotB (): Vec3 {
        return this._pivotB;
    }

    set pivotB (v: Vec3) {
        Vec3.copy(this._pivotB, v);
        if (!EDITOR || cclegacy.GAME_VIEW) {
            this.constraint.setPivotB(this._pivotB);
        }
    }

    /**
     * @en
     * The direction of the constraint axis rotation in local space.
     * @zh
     * 在本地空间中，约束关节旋转的方向。
     */
    @type(Vec3)
    get axis (): Vec3 {
        return this._axis;
    }

    set axis (v: Vec3) {
        Vec3.copy(this._axis, v);
        if (!EDITOR || cclegacy.GAME_VIEW) {
            this.constraint.setAxis(this._axis);
        }
    }

    /**
     * @en
     * Whether to enable the rotation limit of the hinge constraint.
     * @zh
     * 是否开启旋转限制。
     */
    @type(CCBoolean)
    get limitEnabled (): boolean {
        return this.limitData.enabled;
    }
    set limitEnabled (v: boolean) {
        this.limitData.enabled = v;
    }

    /**
     * @en
     * The upper limit to the rotation of pivotB related to pivotB's local position.
     * @zh
     * 转轴约束的旋转上限。
     */
    @type(CCFloat)
    get upperLimit (): number {
        return this.limitData.upperLimit;
    }
    set upperLimit (v: number) {
        this.limitData.upperLimit = v;
    }

    /**
     * @en
     * The lower limit to the rotation of pivotB related to pivotB's local position.
     * @zh
     * 转轴约束的旋转下限。
     */
    @type(CCFloat)
    get lowerLimit (): number {
        return this.limitData.lowerLimit;
    }
    set lowerLimit (v: number) {
        this.limitData.lowerLimit = v;
    }

    /**
     * @en
     * Whether the motor is enabled or not.
     * @zh
     * 转轴约束是否启用 Motor
     */
    @type(CCBoolean)
    get motorEnabled (): boolean {
        return this.motorData.enabled;
    }
    set motorEnabled (v: boolean) {
        this.motorData.enabled = v;
    }

    /**
     * @en
     * The rotation speed of pivotA related to pivotB.
     * @zh
     * 转轴约束的旋转速度。
     */
    @type(CCFloat)
    get motorVelocity (): number {
        return this.motorData.motorVelocity;
    }
    set motorVelocity (v: number) {
        this.motorData.motorVelocity = v;
    }

    /**
     * @en
     * The max drive force of the motor.
     * @zh
     * 转轴约束的最大驱动力。
     */
    @type(CCFloat)
    get motorForceLimit (): number {
        return this.motorData.motorForceLimit;
    }
    set motorForceLimit (v: number) {
        this.motorData.motorForceLimit = v;
    }

    @serializable
    @formerlySerializedAs('axisA')
    private readonly _axis: Vec3 = new Vec3();

    @serializable
    @formerlySerializedAs('pivotA')
    private readonly _pivotA: Vec3 = new Vec3();

    @serializable
    @formerlySerializedAs('pivotB')
    private readonly _pivotB: Vec3 = new Vec3();

    @serializable
    @formerlySerializedAs('limitData')
    public limitData =  new HingeLimitData(this);

    @serializable
    @formerlySerializedAs('motorData')
    public motorData =  new HingeMotorData(this);

    get constraint (): IHingeConstraint {
        return this._constraint as IHingeConstraint;
    }

    constructor () {
        super(EConstraintType.HINGE);
    }
}
