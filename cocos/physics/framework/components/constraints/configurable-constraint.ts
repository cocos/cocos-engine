/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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
    editable,
    group,
} from 'cc.decorator';
import { EDITOR_NOT_IN_PREVIEW } from 'internal:constants';
import { Constraint } from './constraint';
import { Vec3, CCFloat, CCBoolean } from '../../../../core';
import { EConstraintType, EConstraintMode, EDriverMode } from '../../physics-enum';
import { IConfigurableConstraint } from '../../../spec/i-physics-constraint';

/**
 * @en The linear limit settings of the configurable constraint.
 * @zh 可配置约束的线性限制设置。
 */
@ccclass('cc.LinearLimitSettings')
export class LinearLimitSettings  {
    @type(EConstraintMode)
    @tooltip('i18n:physics3d.constraint.linearLimit.xMotion')
    get xMotion (): EConstraintMode {
        return this._xMotion;
    }
    set xMotion (v: EConstraintMode) {
        this._xMotion = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setConstraintMode(0, v);
        }
    }

    @type(EConstraintMode)
    @tooltip('i18n:physics3d.constraint.linearLimit.yMotion')
    get yMotion (): EConstraintMode {
        return this._yMotion;
    }
    set yMotion (v: EConstraintMode) {
        this._yMotion = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setConstraintMode(1, v);
        }
    }

    @type(EConstraintMode)
    @tooltip('i18n:physics3d.constraint.linearLimit.zMotion')
    get zMotion (): EConstraintMode {
        return this._zMotion;
    }
    set zMotion (v: EConstraintMode) {
        this._zMotion = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setConstraintMode(2, v);
        }
    }

    @type(Vec3)
    @tooltip('i18n:physics3d.constraint.linearLimit.upper')
    get upper (): Vec3 {
        return this._upper;
    }
    set upper (v: Vec3) {
        Vec3.copy(this._upper, v);
        if (!EDITOR_NOT_IN_PREVIEW) {
            const lower = this.lower;
            this._impl.setLinearLimit(0, lower.x, v.x);
            this._impl.setLinearLimit(1, lower.y, v.y);
            this._impl.setLinearLimit(2, lower.z, v.z);
        }
    }

    @type(Vec3)
    @tooltip('i18n:physics3d.constraint.linearLimit.lower')
    get lower (): Vec3 {
        return this._lower;
    }
    set lower (v: Vec3) {
        Vec3.copy(this._lower, v);
        if (!EDITOR_NOT_IN_PREVIEW) {
            const upper = this.upper;
            this._impl.setLinearLimit(0, v.x, upper.x);
            this._impl.setLinearLimit(1, v.y, upper.y);
            this._impl.setLinearLimit(2, v.z, upper.z);
        }
    }

    @type(CCFloat)
    @tooltip('i18n:physics3d.constraint.linearLimit.restitution')
    get restitution (): number {
        return this._bounciness;
    }
    set restitution (v: number) {
        this._bounciness = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setLinearRestitution(v);
        }
    }

    @type(CCBoolean)
    @tooltip('i18n:physics3d.constraint.linearLimit.enableSoftConstraint')
    @group({ id: 'SoftConstraint', name: 'SoftConstraintSettings', style: 'section' })
    get enableSoftConstraint (): boolean {
        return this._enableSoftConstraint;
    }
    set enableSoftConstraint (v: boolean) {
        this._enableSoftConstraint = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setLinearSoftConstraint(v);
        }
    }

    @type(CCFloat)
    @group({ id: 'SoftConstraint', name: 'SoftConstraintSettings' })
    @tooltip('i18n:physics3d.constraint.linearLimit.stiffness')
    get stiffness (): number {
        return this._stiffness;
    }
    set stiffness (v: number) {
        this._stiffness = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setLinearStiffness(v);
        }
    }

    @type(CCFloat)
    @tooltip('i18n:physics3d.constraint.linearLimit.damping')
    @group({ id: 'SoftConstraint', name: 'SoftConstraintSettings' })
    get damping (): number {
        return this._damping;
    }
    set damping (v: number) {
        this._damping = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setLinearDamping(v);
        }
    }

    @serializable
    private _xMotion = EConstraintMode.FREE;
    @serializable
    private _yMotion = EConstraintMode.FREE;
    @serializable
    private _zMotion = EConstraintMode.FREE;
    @serializable
    private _upper = new Vec3();
    @serializable
    private _lower = new Vec3();
    @serializable
    private _enableSoftConstraint = false;
    @serializable
    private _bounciness = 0; // restitution [0,1]
    @serializable
    private _stiffness = 0;
    @serializable
    private _damping = 0;

    /**
     * @engineInternal
     */
    set impl (v: IConfigurableConstraint) {
        this._impl = v;
    }

    private _impl: IConfigurableConstraint;
    constructor (configurableConstraint: IConfigurableConstraint) {
        this._impl = configurableConstraint;
    }
}

/**
 * @en The angular limit settings of the configurable constraint.
 * @zh 可配置约束的角度限制设置。
 */
@ccclass('cc.AngularLimitSettings')
export class AngularLimitSettings {
    @type(EConstraintMode)
    @tooltip('i18n:physics3d.constraint.angularLimit.twistMotion')
    get twistMotion (): EConstraintMode {
        return this._twistMotion;
    }
    set twistMotion (v: EConstraintMode) {
        this._twistMotion = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setConstraintMode(3, v);
        }
    }
    @type(EConstraintMode)
    @tooltip('i18n:physics3d.constraint.angularLimit.swingMotion1')
    get swingMotion1 (): EConstraintMode {
        return this._swing1Motion;
    }
    set swingMotion1 (v: EConstraintMode) {
        this._swing1Motion = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setConstraintMode(4, v);
        }
    }
    @type(EConstraintMode)
    @tooltip('i18n:physics3d.constraint.angularLimit.swingMotion2')
    get swingMotion2 (): EConstraintMode {
        return this._swing2Motion;
    }
    set swingMotion2 (v: EConstraintMode) {
        this._swing2Motion = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setConstraintMode(5, v);
        }
    }

    @type(CCFloat)
    @tooltip('i18n:physics3d.constraint.angularLimit.twistExtent')
    get twistExtent (): number {
        return this._twistExtent;
    }
    set twistExtent (v: number) {
        this._twistExtent = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setAngularExtent(v, this.swingExtent1, this.swingExtent2);
        }
    }

    @type(CCFloat)
    @tooltip('i18n:physics3d.constraint.angularLimit.swingExtent1')
    get swingExtent1 (): number {
        return this._swingExtent1;
    }
    set swingExtent1 (v: number) {
        this._swingExtent1 = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setAngularExtent(this.twistExtent, v, this.swingExtent2);
        }
    }

    @type(CCFloat)
    @tooltip('i18n:physics3d.constraint.angularLimit.swingExtent2')
    get swingExtent2 (): number {
        return this._swingExtent2;
    }
    set swingExtent2 (v: number) {
        this._swingExtent2 = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setAngularExtent(this.twistExtent, this.swingExtent1, v);
        }
    }

    @type(CCFloat)
    @tooltip('i18n:physics3d.constraint.angularLimit.twistRestitution')
    get twistRestitution (): number {
        return this._twistBounciness;
    }
    set twistRestitution (v: number) {
        this._twistBounciness = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setTwistRestitution(v);
        }
    }

    @type(CCFloat)
    @tooltip('i18n:physics3d.constraint.angularLimit.swingRestitution')
    get swingRestitution (): number {
        return this._swingBounciness;
    }
    set swingRestitution (v: number) {
        this._swingBounciness = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setSwingRestitution(v);
        }
    }

    @type(CCBoolean)
    @group({ id: 'SoftConstraint', name: 'SoftConstraintSettings' })
    @tooltip('i18n:physics3d.constraint.angularLimit.enableSoftConstraintTwist')
    get enableSoftConstraintTwist (): boolean {
        return this._enableSoftConstraintTwist;
    }
    set enableSoftConstraintTwist (v: boolean) {
        this._enableSoftConstraintTwist = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setTwistSoftConstraint(v);
        }
    }

    @type(CCFloat)
    @group({ id: 'SoftConstraint', name: 'SoftConstraintSettings' })
    @tooltip('i18n:physics3d.constraint.angularLimit.twistStiffness')
    get twistStiffness (): number {
        return this._twistStiffness;
    }
    set twistStiffness (v: number) {
        this._twistStiffness = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setTwistStiffness(v);
        }
    }

    @type(CCFloat)
    @group({ id: 'SoftConstraint', name: 'SoftConstraintSettings' })
    @tooltip('i18n:physics3d.constraint.angularLimit.twistDamping')
    get twistDamping (): number {
        return this._twistDamping;
    }
    set twistDamping (v: number) {
        this._twistDamping = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setTwistDamping(v);
        }
    }

    @type(CCBoolean)
    @group({ id: 'SoftConstraint', name: 'SoftConstraintSettings' })
    @tooltip('i18n:physics3d.constraint.angularLimit.enableSoftConstraintSwing')
    get enableSoftConstraintSwing (): boolean {
        return this._enableSoftConstraintSwing;
    }
    set enableSoftConstraintSwing (v: boolean) {
        this._enableSoftConstraintSwing = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setSwingSoftConstraint(v);
        }
    }

    @type(CCFloat)
    @group({ id: 'SoftConstraint', name: 'SoftConstraintSettings' })
    @tooltip('i18n:physics3d.constraint.angularLimit.swingStiffness')
    get swingStiffness (): number {
        return this._swingStiffness;
    }
    set swingStiffness (v: number) {
        this._swingStiffness = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setSwingStiffness(v);
        }
    }

    @type(CCFloat)
    @group({ id: 'SoftConstraint', name: 'SoftConstraintSettings' })
    @tooltip('i18n:physics3d.constraint.angularLimit.swingDamping')
    get swingDamping (): number {
        return this._swingDamping;
    }
    set swingDamping (v: number) {
        this._swingDamping = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setSwingDamping(v);
        }
    }

    @serializable
    private _swing1Motion = EConstraintMode.FREE;
    @serializable
    private _swing2Motion = EConstraintMode.FREE;
    @serializable
    private _twistMotion = EConstraintMode.FREE;

    @serializable
    private _twistExtent = 0;
    @serializable
    private _swingExtent1 = 0;
    @serializable
    private _swingExtent2 = 0;

    @serializable
    private _enableSoftConstraintSwing = false;
    @serializable
    private _swingBounciness = 0;
    @serializable
    private _swingStiffness = 0;
    @serializable
    private _swingDamping = 0;

    @serializable
    private _enableSoftConstraintTwist = false;
    @serializable
    private _twistBounciness = 0;
    @serializable
    private _twistStiffness = 0;
    @serializable
    private _twistDamping = 0;

    /**
     * @engineInternal
     */
    set impl (v: IConfigurableConstraint) {
        this._impl = v;
    }

    private _impl: IConfigurableConstraint;
    constructor (configurableConstraint: IConfigurableConstraint) {
        this._impl = configurableConstraint;
    }
}

/**
 * @en The linear driver settings of the configurable constraint.
 * @zh 可配置约束的线性驱动器设置。
 */
@ccclass('cc.LinearDriverSettings')
export class LinearDriverSettings {
    @type(EDriverMode)
    @tooltip('i18n:physics3d.constraint.linearDriver.xMode')
    get xDrive (): EDriverMode {
        return this._xDrive;
    }
    set xDrive (v: EDriverMode) {
        this._xDrive = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setDriverMode(0, v);
        }
    }

    @type(EDriverMode)
    @tooltip('i18n:physics3d.constraint.linearDriver.yMode')
    get yDrive (): EDriverMode {
        return this._yDrive;
    }
    set yDrive (v: EDriverMode) {
        this._yDrive = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setDriverMode(1, v);
        }
    }

    @type(EDriverMode)
    @tooltip('i18n:physics3d.constraint.linearDriver.zMode')
    get zDrive (): EDriverMode {
        return this._zDrive;
    }
    set zDrive (v: EDriverMode) {
        this._zDrive = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setDriverMode(2, v);
        }
    }

    @type(Vec3)
    @tooltip('i18n:physics3d.constraint.linearDriver.targetPosition')
    get targetPosition (): Vec3 {
        return this._target;
    }
    set targetPosition (v: Vec3) {
        Vec3.copy(this._target, v);
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setLinearMotorTarget(v);
        }
    }

    @type(Vec3)
    @tooltip('i18n:physics3d.constraint.linearDriver.targetVelocity')
    get targetVelocity (): Vec3 {
        return this._velocity;
    }
    set targetVelocity (v: Vec3) {
        Vec3.copy(this._velocity, v);
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setLinearMotorVelocity(v);
        }
    }

    @type(CCFloat)
    @tooltip('i18n:physics3d.constraint.linearDriver.strength')
    get strength (): number {
        return this._strength;
    }
    set strength (v) {
        this._strength = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setLinearMotorForceLimit(v);
        }
    }

    @serializable
    private _target = new Vec3();
    @serializable
    private _velocity = new Vec3();

    @serializable
    private _xDrive = EDriverMode.DISABLED;
    @serializable
    private _yDrive = EDriverMode.DISABLED;
    @serializable
    private _zDrive = EDriverMode.DISABLED;

    @serializable
    private _strength = 0;

    /**
     * @engineInternal
     */
    set impl (v: IConfigurableConstraint) {
        this._impl = v;
    }

    private _impl: IConfigurableConstraint;
    constructor (configurableConstraint: IConfigurableConstraint) {
        this._impl = configurableConstraint;
    }
}

/**
 * @en The angular driver settings of the configurable constraint.
 * @zh 可配置约束的角度驱动器设置。
 */
@ccclass('cc.AngularDriverSettings')
export class AngularDriverSettings {
    @type(EDriverMode)
    @tooltip('i18n:physics3d.constraint.angularDriver.twistMode')
    get twistDrive (): EDriverMode {
        return this._twistDrive;
    }
    set twistDrive (v: EDriverMode) {
        this._twistDrive = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setDriverMode(3, v);
        }
    }

    @type(EDriverMode)
    @tooltip('i18n:physics3d.constraint.angularDriver.swingMode1')
    get swingDrive1 (): EDriverMode {
        return this._swingDrive1;
    }
    set swingDrive1 (v: EDriverMode) {
        this._swingDrive1 = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setDriverMode(4, v);
        }
    }

    @type(EDriverMode)
    @tooltip('i18n:physics3d.constraint.angularDriver.swingMode2')
    get swingDrive2 (): EDriverMode {
        return this._swingDrive2;
    }
    set swingDrive2 (v: EDriverMode) {
        this._swingDrive2 = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setDriverMode(5, v);
        }
    }

    @type(Vec3)
    @tooltip('i18n:physics3d.constraint.angularDriver.targetOrientation')
    get targetOrientation (): Vec3 {
        return this._targetOrientation;
    }
    set targetOrientation (v) {
        Vec3.copy(this._targetOrientation, v);
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setAngularMotorTarget(v);
        }
    }

    @type(Vec3)
    @tooltip('i18n:physics3d.constraint.angularDriver.targetAngularVelocity')
    get targetVelocity (): Vec3 {
        return this._targetVelocity;
    }
    set targetVelocity (v) {
        Vec3.copy(this._targetVelocity, v);
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setAngularMotorVelocity(v);
        }
    }

    @type(CCFloat)
    @tooltip('i18n:physics3d.constraint.angularDriver.strength')
    get strength (): number {
        return this._strength;
    }
    set strength (v) {
        this._strength = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this._impl.setAngularMotorForceLimit(v);
        }
    }

    @serializable
    private _swingDrive1 = EDriverMode.DISABLED;
    @serializable
    private _swingDrive2 = EDriverMode.DISABLED;
    @serializable
    private _twistDrive = EDriverMode.DISABLED;

    @serializable
    private _targetOrientation = new Vec3();
    @serializable
    private _targetVelocity = new Vec3();

    @serializable
    private _strength = 0;

    /**
     * @engineInternal
     */
    set impl (v: IConfigurableConstraint) {
        this._impl = v;
    }

    private _impl: IConfigurableConstraint;
    constructor (configurableConstraint: IConfigurableConstraint) {
        this._impl = configurableConstraint;
    }
}

/**
 * @en The configurable constraint component.
 * The configurable constraint provides all the functionality of other constraints, and provides comprehensive configurable options.
 * @zh 可配置约束组件。
 * 可配置约束提供了其他约束的所有功能支持，提供了全面的可配置选项。
 */
@ccclass('cc.ConfigurableConstraint')
@help('i18n:cc.ConfigurableConstraint')
@menu('Physics/ConfigurableConstraint(beta)')
export class ConfigurableConstraint extends Constraint {
    /**
     * @en
     * The axis of the constraint in the local coordinate system of the attached rigid body.
     * @zh
     * 约束关节在连接刚体的本地坐标系中的轴。
     */
    @type(Vec3)
    @tooltip('i18n:physics3d.constraint.axis')
    get axis (): Vec3 {
        return this._axis;
    }
    set axis (v: Vec3) {
        Vec3.copy(this._axis, v);
        if (!EDITOR_NOT_IN_PREVIEW) {
            this.constraint.setAxis(this._axis);
        }
    }

    /**
     * @en The secondary axis of the constraint in the local coordinate system of the attached rigid body.
     * @zh 约束关节在连接刚体的本地坐标系中的第二轴。
     */
    @type(Vec3)
    @tooltip('i18n:physics3d.constraint.secondaryAxis')
    get secondaryAxis (): Vec3 {
        return this._secondaryAxis;
    }
    set secondaryAxis (v: Vec3) {
        Vec3.copy(this._secondaryAxis, v);
        if (!EDITOR_NOT_IN_PREVIEW) {
            this.constraint.setSecondaryAxis(this._secondaryAxis);
        }
    }

    /**
     * @en
     * The pivot point of the constraint in the local coordinate system of the attached rigid body.
     * @zh
     * 约束关节在连接刚体的本地坐标系中的锚点。
     */
    @type(Vec3)
    @tooltip('i18n:physics3d.constraint.pivotA')
    get pivotA (): Vec3 {
        return this._pivotA;
    }

    set pivotA (v: Vec3) {
        Vec3.copy(this._pivotA, v);
        if (!EDITOR_NOT_IN_PREVIEW) {
            this.constraint.setPivotA(this._pivotA);
        }
    }

    /**
     * @en
     * The pivot point of the constraint in the local coordinate system of the connected rigid body.
     * @zh
     * 约束关节在连接刚体的本地坐标系中的锚点。
     */
    @type(Vec3)
    @tooltip('i18n:physics3d.constraint.pivotB')
    get pivotB (): Vec3 {
        return this._pivotB;
    }

    set pivotB (v: Vec3) {
        Vec3.copy(this._pivotB, v);
        if (!EDITOR_NOT_IN_PREVIEW) {
            this.constraint.setPivotB(this._pivotB);
        }
    }

    /**
     * @en
     * The pivotB is derived automatically.
     * @zh
     * pivotB 会自动计算。
     */
    @type(CCBoolean)
    @tooltip('i18n:physics3d.constraint.autoCalculatePivotB')
    get autoPivotB (): boolean {
        return this._autoPivotB;
    }

    set autoPivotB (v: boolean) {
        this._autoPivotB = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this.constraint.setAutoPivotB(this._autoPivotB);
        }
    }

    /**
     * @en
     * The break force threshold of the constraint.
     * @zh
     * 约束的断裂力阈值。
     */
    @type(CCFloat)
    @tooltip('i18n:physics3d.constraint.breakForce')
    get breakForce (): number {
        return this._breakForce;
    }
    set breakForce (v) {
        this._breakForce = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this.constraint.setBreakForce(v);
        }
    }

    /**
     * @en
     * The break torque threshold of the constraint.
     * @zh
     * 约束的断裂扭矩阈值。
     */
    @type(CCFloat)
    @tooltip('i18n:physics3d.constraint.breakTorque')
    get breakTorque (): number {
        return this._breakTorque;
    }
    set breakTorque (v) {
        this._breakTorque = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            this.constraint.setBreakTorque(v);
        }
    }

    /**
     * @en
     * The linear limit settings of the constraint.
     * @zh
     * 线性限制设置。
     */
    @type(LinearLimitSettings)
    @tooltip('i18n:physics3d.constraint.linearLimit')
    get linearLimitSettings (): LinearLimitSettings {
        return this._linearLimitSettings;
    }
    set linearLimitSettings (v) {
        this._linearLimitSettings = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            const constraint = this.constraint;
            constraint.setConstraintMode(0, v.xMotion);
            constraint.setConstraintMode(1, v.yMotion);
            constraint.setConstraintMode(2, v.zMotion);
            const upper = v.upper;
            const lower = v.lower;
            constraint.setLinearLimit(0, lower.x, upper.x);
            constraint.setLinearLimit(1, lower.y, upper.y);
            constraint.setLinearLimit(2, lower.z, upper.z);
            constraint.setLinearSoftConstraint(v.enableSoftConstraint);
            constraint.setLinearDamping(v.damping);
            constraint.setLinearStiffness(v.stiffness);
            constraint.setLinearRestitution(v.restitution);
        }
    }

    /**
     * @en
     * The angular limit settings of the constraint.
     * @zh
     * 角度限制设置。
     */
    @type(AngularLimitSettings)
    @tooltip('i18n:physics3d.constraint.angularLimit')
    get angularLimitSettings (): AngularLimitSettings {
        return this._angularLimitSettings;
    }
    set angularLimitSettings (v) {
        this._angularLimitSettings = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            const constraint = this.constraint;
            constraint.setConstraintMode(3, v.twistMotion);
            constraint.setConstraintMode(4, v.swingMotion1);
            constraint.setConstraintMode(5, v.swingMotion2);
            constraint.setAngularExtent(v.twistExtent, v.swingExtent1, v.swingExtent2);
            constraint.setTwistRestitution(v.twistRestitution);
            constraint.setSwingRestitution(v.swingRestitution);
            constraint.setTwistSoftConstraint(v.enableSoftConstraintTwist);
            constraint.setSwingSoftConstraint(v.enableSoftConstraintSwing);
            constraint.setTwistDamping(v.twistDamping);
            constraint.setSwingDamping(v.swingDamping);
            constraint.setTwistStiffness(v.twistStiffness);
            constraint.setSwingStiffness(v.swingStiffness);
        }
    }

    /**
     * @en
     * The linear drive settings of the constraint.
     * @zh
     * 线性驱动设置。
     */
    @type(LinearDriverSettings)
    @tooltip('i18n:physics3d.constraint.linearDrive')
    get linearDriverSettings (): LinearDriverSettings {
        return this._linearDriverSettings;
    }
    set linearDriverSettings (v) {
        this._linearDriverSettings = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            const constraint = this.constraint;
            constraint.setDriverMode(0, v.xDrive);
            constraint.setDriverMode(1, v.yDrive);
            constraint.setDriverMode(2, v.zDrive);
            constraint.setLinearMotorTarget(v.targetPosition);
            constraint.setLinearMotorVelocity(v.targetVelocity);
            constraint.setLinearMotorForceLimit(v.strength);
        }
    }

    /**
     * @en
     * The angular drive settings of the constraint.
     * @zh
     * 角度驱动设置。
     */
    @type(AngularDriverSettings)
    @tooltip('i18n:physics3d.constraint.angularDrive')
    get angularDriverSettings (): AngularDriverSettings {
        return this._angularDriverSettings;
    }
    set angularDriverSettings (v) {
        this._angularDriverSettings = v;
        if (!EDITOR_NOT_IN_PREVIEW) {
            const constraint = this.constraint;
            constraint.setDriverMode(3, v.twistDrive);
            constraint.setDriverMode(4, v.swingDrive1);
            constraint.setDriverMode(5, v.swingDrive2);
            constraint.setAngularMotorTarget(v.targetOrientation);
            constraint.setAngularMotorVelocity(v.targetVelocity);
            constraint.setAngularMotorForceLimit(v.strength);
        }
    }

    @serializable
    private _breakForce = 1e8;

    @serializable
    private _breakTorque = 1e8;

    @serializable
    @formerlySerializedAs('linearLimitSettings')
    private _linearLimitSettings: LinearLimitSettings;

    @serializable
    @formerlySerializedAs('angularLimitSettings')
    private _angularLimitSettings: AngularLimitSettings;

    @serializable
    @formerlySerializedAs('linearDriverSettings')
    private _linearDriverSettings: LinearDriverSettings;

    @serializable
    @formerlySerializedAs('angularDriverSettings')
    private _angularDriverSettings: AngularDriverSettings;

    @serializable
    private readonly _pivotA: Vec3 = new Vec3();

    @serializable
    private readonly _pivotB: Vec3 = new Vec3();

    @serializable
    private _autoPivotB = false;

    @serializable
    private readonly _axis: Vec3 = new Vec3(0, 1, 0);

    @serializable
    private readonly _secondaryAxis: Vec3 = new Vec3(1, 0, 0);

    get constraint (): IConfigurableConstraint {
        return this._constraint as IConfigurableConstraint;
    }

    constructor () {
        super(EConstraintType.CONFIGURABLE);
        this._linearLimitSettings = new LinearLimitSettings(this.constraint);
        this._angularLimitSettings = new AngularLimitSettings(this.constraint);
        this._linearDriverSettings = new LinearDriverSettings(this.constraint);
        this._angularDriverSettings = new AngularDriverSettings(this.constraint);
    }

    onLoad (): void {
        super.onLoad();
        if (!EDITOR_NOT_IN_PREVIEW) {
            this.linearLimitSettings.impl = this.constraint;
            this.angularLimitSettings.impl = this.constraint;
            this.linearDriverSettings.impl = this.constraint;
            this.angularDriverSettings.impl = this.constraint;
        }
    }
}
