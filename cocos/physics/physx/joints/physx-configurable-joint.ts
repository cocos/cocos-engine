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

/* eslint-disable @typescript-eslint/no-unsafe-return */

import { IVec3Like, Vec3, Quat, Mat4, error, math, toRadian } from '../../../core';
import { ConfigurableConstraint, EConstraintMode, EDriverMode } from '../../framework';
import { IConfigurableConstraint } from '../../spec/i-physics-constraint';
import { PX, _trans, getTempTransform, _pxtrans } from '../physx-adapter';
import { PhysXJoint } from './physx-joint';

function getConstraintFlag (v: EConstraintMode) {
    switch (v) {
    case EConstraintMode.FREE: return PX.D6Motion.eFREE;
    case EConstraintMode.LIMITED: return PX.D6Motion.eLIMITED;
    case EConstraintMode.LOCKED: return PX.D6Motion.eLOCKED;
    default:
        return PX.D6Motion.eFREE;
    }
}

export class PhysXConfigurableJoint extends PhysXJoint implements IConfigurableConstraint {
    protected _setLinearLimit () {
        const linearLimit = this.constraint.linearLimitSettings;

        const limitPairX = this._linearLimitX;
        const limitPairY = this._linearLimitY;
        const limitPairZ = this._linearLimitZ;

        const setLimitPair = (limitPair: any) => {
            if (linearLimit.enableSoftConstraint) {
                limitPair.stiffness = linearLimit.stiffness;
                limitPair.damping = linearLimit.damping;
            } else {
                limitPair.stiffness = 0;
                limitPair.damping = 0;
            }
            limitPair.bounceThreshold = 0.1;
            limitPair.contactDistance = 0.1;
            limitPair.restitution = linearLimit.restitution;
        };

        setLimitPair(limitPairX);
        setLimitPair(limitPairY);
        setLimitPair(limitPairZ);

        const lower = linearLimit.lower;
        const upper = linearLimit.upper;
        if (linearLimit.xMotion === EConstraintMode.LIMITED) {
            limitPairX.lower = -upper.x;
            limitPairX.upper = -lower.x;
            this._impl.setLinearLimit(PX.D6Axis.eX, limitPairX);
        }

        if (linearLimit.yMotion === EConstraintMode.LIMITED) {
            limitPairX.lower = -upper.y;
            limitPairX.upper = -lower.y;
            this._impl.setLinearLimit(PX.D6Axis.eY, limitPairY);
        }

        if (linearLimit.zMotion === EConstraintMode.LIMITED) {
            limitPairX.lower = -upper.z;
            limitPairX.upper = -lower.z;
            this._impl.setLinearLimit(PX.D6Axis.eZ, limitPairZ);
        }
    }

    protected _setSwingLimit () {
        const angularLimit = this.constraint.angularLimitSettings;
        const limitCone = this._swingLimit;

        if (angularLimit.enableSoftConstraintSwing) {
            limitCone.stiffness = angularLimit.swingStiffness;
            limitCone.damping = angularLimit.swingDamping;
        } else {
            limitCone.stiffness = 0;
            limitCone.springDamping = 0;
        }

        limitCone.yAngle = Math.PI;
        limitCone.zAngle = Math.PI;
        limitCone.contactDistance = 0.1;
        limitCone.bounceThreshold = 0.1;
        limitCone.restitution = angularLimit.swingRestitution;

        if (angularLimit.swingMotion1 === EConstraintMode.LIMITED) {
            limitCone.yAngle = toRadian(angularLimit.swingExtent1) * 0.5;
            this._impl.setSwingLimit(limitCone);
        }
        if (angularLimit.swingMotion2 === EConstraintMode.LIMITED) {
            limitCone.zAngle = toRadian(angularLimit.swingExtent2) * 0.5;
            this._impl.setSwingLimit(limitCone);
        }
    }

    protected _setTwistLimit () {
        const angularLimit = this.constraint.angularLimitSettings;
        const limitPair = this._twistLimit;

        if (angularLimit.enableSoftConstraintTwist) {
            limitPair.stiffness = angularLimit.twistStiffness;
            limitPair.damping = angularLimit.twistDamping;
        } else {
            limitPair.stiffness = 0;
            limitPair.damping = 0;
        }

        limitPair.contactDistance = 0.1;
        limitPair.bounceThreshold = 0.1;
        limitPair.restitution = angularLimit.twistRestitution;

        if (angularLimit.twistMotion === EConstraintMode.LIMITED) {
            limitPair.lower = toRadian(angularLimit.twistExtent) * -0.5;
            limitPair.upper = toRadian(angularLimit.twistExtent) * 0.5;
            this._impl.setTwistLimit(limitPair);
        }
    }

    protected _updateDrive (idx: number) {
        let axis = PX.D6Axis.eX;
        let driveMode = EDriverMode.DISABLED;
        const com = this.constraint;
        const ld = com.linearDriverSettings;
        const ad = com.angularDriverSettings;

        const getSwingDriveMode =  () => {
            const ad = this.constraint.angularDriverSettings;
            if (ad.swingDrive1 === EDriverMode.INDUCTION || ad.swingDrive2 === EDriverMode.INDUCTION) {
                return EDriverMode.INDUCTION;
            } else if (ad.swingDrive1 === EDriverMode.SERVO || ad.swingDrive2 === EDriverMode.SERVO) {
                return EDriverMode.SERVO;
            } else {
                return EDriverMode.DISABLED;
            }
        };

        switch (idx) {
        case 0: axis = PX.D6Drive.eX; driveMode = ld.xDrive;  break;
        case 1: axis = PX.D6Drive.eY; driveMode = ld.yDrive; break;
        case 2: axis = PX.D6Drive.eZ; driveMode = ld.zDrive; break;
        case 3: axis = PX.D6Drive.eTWIST; driveMode = ad.twistDrive; break;
        case 4: axis = PX.D6Drive.eSWING; driveMode = getSwingDriveMode(); break;
        case 5: axis = PX.D6Drive.eSWING; driveMode = getSwingDriveMode(); break;
        default: break;
        }
        const drive = this._drive[idx];
        if (idx >= 0 && idx < 3) {
            drive.forceLimit = com.linearDriverSettings.strength;
        } else if (idx < 6) {
            drive.forceLimit = com.angularDriverSettings.strength;
        }
        if (driveMode === EDriverMode.DISABLED) {
            drive.forceLimit = 0;
        } else if (driveMode === EDriverMode.SERVO) {
            drive.damping = 0;
            drive.stiffness = 1000;
        } else if (driveMode === EDriverMode.INDUCTION) {
            drive.damping = 1000;
            drive.stiffness = 0;
        }
        this._impl.setDrive(axis, drive);
    }

    protected _updateDriveTarget () {
        const linearTarget = this.constraint.linearDriverSettings.targetPosition;
        const angularTarget = this.constraint.angularDriverSettings.targetOrientation;
        const quat = this._rot;
        Quat.fromEuler(quat, -angularTarget.x, -angularTarget.y, -angularTarget.z); // no need to calculation radian for quat.fromEuler
        getTempTransform(linearTarget, quat);
        Vec3.multiplyScalar(_pxtrans.p, _pxtrans.p, -1);
        this._impl.setDrivePosition(_pxtrans, true);
    }

    protected _updateDriveVelocity () {
        const linearVelocity = this.constraint.linearDriverSettings.targetVelocity;
        const angularVelocity = this.constraint.angularDriverSettings.targetVelocity;
        const lv = new Vec3(-linearVelocity.x, -linearVelocity.y, -linearVelocity.z);
        const av = new Vec3(toRadian(-angularVelocity.x), toRadian(-angularVelocity.y), toRadian(-angularVelocity.z));
        this._impl.setDriveVelocity(lv, av, true);
    }

    protected _updateDriveSettings () {
        this._updateDrive(0);
        this._updateDrive(1);
        this._updateDrive(2);
        this._updateDrive(3);
        this._updateDrive(4);
        this._updateDrive(5);
        this._updateDriveTarget();
        this._updateDriveVelocity();
    }

    setConstraintMode (idx: number, v: EConstraintMode): void {
        let axis = PX.D6Axis.eX;
        switch (idx) {
        case 0: axis = PX.D6Axis.eX; break;
        case 1: axis = PX.D6Axis.eY; break;
        case 2: axis = PX.D6Axis.eZ; break;
        case 3: axis = PX.D6Axis.eTWIST; break;
        case 4: axis = PX.D6Axis.eSWING1; break;
        case 5: axis = PX.D6Axis.eSWING2; break;
        default: break;
        }
        const mode = getConstraintFlag(v);
        this._impl.setMotion(axis, mode);
    }

    setLinearLimit (idx: number, lower: number, upper: number): void {
        this._setLinearLimit();
    }
    setAngularExtent (twist: number, swing1: number, swing2: number): void {
        this._setSwingLimit();
        this._setTwistLimit();
    }
    setLinearRestitution (v: number): void {
        this._setLinearLimit();
    }
    setSwingRestitution (v: number): void {
        this._setSwingLimit();
    }
    setTwistRestitution (v: number): void {
        this._setTwistLimit();
    }

    setLinearSoftConstraint (v: boolean): void {
        this._setLinearLimit();
    }
    setLinearStiffness (v: number): void {
        this._setLinearLimit();
    }
    setLinearDamping (v: number): void {
        this._setLinearLimit();
    }

    setSwingSoftConstraint (v: boolean): void {
        this._setSwingLimit();
    }
    setSwingStiffness (v: number): void {
        this._setSwingLimit();
    }
    setSwingDamping (v: number): void {
        this._setSwingLimit();
    }

    setTwistSoftConstraint (v: boolean): void {
        this._setTwistLimit();
    }
    setTwistStiffness (v: number): void {
        this._setTwistLimit();
    }
    setTwistDamping (v: number): void {
        this._setTwistLimit();
    }

    setDriverMode (idx: number, v: EDriverMode): void {
        this._updateDrive(idx);
    }
    setLinearMotorTarget (v: IVec3Like): void {
        this._updateDriveTarget();
    }
    setLinearMotorVelocity (v: IVec3Like): void {
        this._updateDriveVelocity();
    }
    setLinearMotorForceLimit (v: number): void {
        this._updateDrive(0);
        this._updateDrive(1);
        this._updateDrive(2);
    }
    setAngularMotorTarget (v: IVec3Like): void {
        this._updateDriveTarget();
    }
    setAngularMotorVelocity (v: IVec3Like): void {
        this._updateDriveVelocity();
    }
    setAngularMotorForceLimit (v: number): void {
        this._updateDrive(3);
        this._updateDrive(4);
        this._updateDrive(5);
    }

    setPivotA (v: IVec3Like): void {
        this.updateFrames();
    }
    setPivotB (v: IVec3Like): void {
        this.updateFrames();
    }
    setAutoPivotB (v: boolean): void {
        this.updateFrames();
    }

    setAxis (v: IVec3Like): void {
        this.updateFrames();
    }
    setSecondaryAxis (v: IVec3Like): void {
        this.updateFrames();
    }

    setBreakForce (v: number): void {
        const force = this.constraint.breakForce;
        const torque = this.constraint.breakTorque;
        this._impl.setBreakForce(force, torque);
    }
    setBreakTorque (v: number): void {
        const force = this.constraint.breakForce;
        const torque = this.constraint.breakTorque;
        this._impl.setBreakForce(force, torque);
    }

    get constraint (): ConfigurableConstraint {
        return this._com as ConfigurableConstraint;
    }

    private _rot = new Quat(Quat.IDENTITY);
    private _jointToleranceScale = new PX.TolerancesScale();
    private _drive = [new PX.D6JointDrive(), new PX.D6JointDrive(),
        new PX.D6JointDrive(), new PX.D6JointDrive(), new PX.D6JointDrive(), new PX.D6JointDrive()];
    private _linearLimitX = new PX.PxJointLinearLimitPair(this._jointToleranceScale, 0, 0);
    private _linearLimitY = new PX.PxJointLinearLimitPair(this._jointToleranceScale, 0, 0);
    private _linearLimitZ = new PX.PxJointLinearLimitPair(this._jointToleranceScale, 0, 0);
    private _twistLimit = new PX.PxJointAngularLimitPair(0, 0);
    private _swingLimit = new PX.PxJointLimitCone(1.5, 1.5);

    onComponentSet (): void {
        const cs = this.constraint;
        this._impl = PX.createD6Joint(PhysXJoint.tempActor, _pxtrans, null, _pxtrans);
        this.setBreakForce(cs.breakForce);
        this.setBreakTorque(cs.breakTorque);

        const ll = cs.linearLimitSettings;
        const al = cs.angularLimitSettings;
        this.setConstraintMode(0, ll.xMotion);
        this.setConstraintMode(1, ll.yMotion);
        this.setConstraintMode(2, ll.zMotion);
        this.setConstraintMode(3, al.twistMotion);
        this.setConstraintMode(4, al.swingMotion1);
        this.setConstraintMode(5, al.swingMotion2);
        this._setLinearLimit();
        this._setSwingLimit();
        this._setTwistLimit();

        this._updateDriveSettings();

        this.updateFrames();
    }

    updateFrames () {
        const cs = this.constraint;
        const node = cs.node;
        const pos = _trans.translation;
        const rot = _trans.rotation;
        const cb = cs.connectedBody;

        const axisX = cs.axis;
        const axisY = cs.secondaryAxis;
        const axisZ = Vec3.cross(new Vec3(), axisX, axisY);

        const mat = new Mat4(
            axisX.x, axisY.x, axisZ.x, 0,
            axisX.y, axisY.y, axisZ.y, 0,
            axisX.z, axisY.z, axisZ.z, 0,
            0, 0, 0, 1,
        );
        Vec3.multiply(pos, cs.node.worldScale, cs.pivotA);
        mat.getRotation(this._rot);
        this._impl.setLocalPose(0, getTempTransform(pos, this._rot));

        if (cb) {
            Quat.multiply(this._rot, node.worldRotation, this._rot);
            Quat.invert(rot, cb.node.worldRotation);
            Quat.multiply(this._rot, rot, this._rot);
            if (cs.autoPivotB) {
                Vec3.multiply(pos, cs.node.worldScale, cs.pivotA);
                Vec3.transformQuat(pos, pos, node.worldRotation);
                Vec3.add(pos, pos, node.worldPosition);
                Vec3.subtract(pos, pos, cb.node.worldPosition);
                Vec3.transformQuat(pos, pos, rot);
            } else {
                Vec3.multiply(pos, cb.node.worldScale, cs.pivotB);
            }
        } else {
            Vec3.multiply(pos, node.worldScale, cs.pivotA);
            Vec3.transformQuat(pos, pos, node.worldRotation);
            Vec3.add(pos, pos, node.worldPosition);
            Quat.multiply(this._rot, node.worldRotation, this._rot);
        }
        this._impl.setLocalPose(1, getTempTransform(pos, this._rot));
    }

    updateScale0 (): void {
        this.updateFrames();
    }

    updateScale1 (): void {
        this.updateFrames();
    }
}
