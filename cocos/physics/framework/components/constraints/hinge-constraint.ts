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
    tooltip,
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

    constructor () {}

    /**
     * @en
     * Whether to enable the rotation limit of the hinge constraint.
     * @zh
     * 是否开启旋转限制。
     */
    @type(CCBoolean)
    get enabled (): boolean {
        return this._enabled;
    }
    set enabled (v: boolean) {
        this._enabled = v;
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

    constructor () {}

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
    }
}

@ccclass('cc.HingeConstraint')
@help('i18n:cc.HingeConstraint')
@menu('Physics/HingeConstraint(beta)')
export class HingeConstraint extends Constraint {
    /**
     * @en
     * The pivot point of the hinge in the local coordinate system of the own rigid body.
     * @zh
     * 在自身刚体的本地坐标系中，旋转轴的锚点位置。
     */
    @type(Vec3)
    @tooltip('i18n:physics3d.constraint.hinge.pivotA')
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
     * The pivot point of the hinge in the local coordinate system of the connected rigid body.
     * @zh
     * 在连接刚体的本地坐标系中，旋转轴的锚点位置。
     */
    @type(Vec3)
    @tooltip('i18n:physics3d.constraint.hinge.pivotB')
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
     * The axis of the hinge in the local coordinate system of the own rigid body.
     * @zh
     * 在自身刚体的本地坐标系中，旋转轴的方向。
     */
    @type(Vec3)
    @tooltip('i18n:physics3d.constraint.hinge.axis')
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
        return this._limitData.enabled;
    }
    set limitEnabled (v: boolean) {
        this._limitData.enabled = v;
        if (!EDITOR || cclegacy.GAME_VIEW) {
            this.constraint.setLimitEnabled(v);
        }
    }

    /**
     * @en
     * The upper limit to the rotation angle of pivotB related to pivotB's local position.
     * @zh
     * 转轴约束的旋转角度上限。
     */
    @type(CCFloat)
    get upperLimit (): number {
        return this._limitData.upperLimit;
    }
    set upperLimit (v: number) {
        this._limitData.upperLimit = v;
        if (!EDITOR || cclegacy.GAME_VIEW) {
            this.constraint.setUpperLimit(v);
        }
    }

    /**
     * @en
     * The lower limit to the rotation angle of pivotB related to pivotB's local position.
     * @zh
     * 转轴约束的旋转角度下限。
     */
    @type(CCFloat)
    get lowerLimit (): number {
        return this._limitData.lowerLimit;
    }
    set lowerLimit (v: number) {
        this._limitData.lowerLimit = v;
        if (!EDITOR || cclegacy.GAME_VIEW) {
            this.constraint.setLowerLimit(v);
        }
    }

    /**
     * @en
     * Whether the motor is enabled or not.
     * @zh
     * 转轴约束是否启用 Motor
     */
    @type(CCBoolean)
    get motorEnabled (): boolean {
        return this._motorData.enabled;
    }
    set motorEnabled (v: boolean) {
        this._motorData.enabled = v;
        if (!EDITOR || cclegacy.GAME_VIEW) {
            this.constraint.setMotorEnabled(v);
        }
    }

    /**
     * @en
     * The rotation speed of pivotA related to pivotB.
     * @zh
     * 转轴约束的旋转速度。
     */
    @type(CCFloat)
    get motorVelocity (): number {
        return this._motorData.motorVelocity;
    }
    set motorVelocity (v: number) {
        this._motorData.motorVelocity = v;
        if (!EDITOR || cclegacy.GAME_VIEW) {
            this.constraint.setMotorVelocity(v);
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
        return this._motorData.motorForceLimit;
    }
    set motorForceLimit (v: number) {
        this._motorData.motorForceLimit = v;
        if (!EDITOR || cclegacy.GAME_VIEW) {
            this.constraint.setMotorForceLimit(v);
        }
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
    private _limitData =  new HingeLimitData();

    @serializable
    @formerlySerializedAs('motorData')
    private _motorData =  new HingeMotorData();

    get constraint (): IHingeConstraint {
        return this._constraint as IHingeConstraint;
    }

    constructor () {
        super(EConstraintType.HINGE);
    }
}
