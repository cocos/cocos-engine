
import CANNON, { RotationalEquation } from '@cocos/cannon';
import { CannonConstraint } from './cannon-constraint';
import { IHingeConstraint } from '../../spec/i-physics-constraint';
import { HingeConstraint } from '../../framework';
import { CannonRigidBody } from '../cannon-rigid-body';
import { IVec3Like, Vec3 } from '../../../core';

const v3_0 = new Vec3();
const v3_1 = new Vec3();

export class CannonHingeConstraint extends CannonConstraint implements IHingeConstraint {

    public get impl () {
        return this._impl as CANNON.HingeConstraint;
    }

    public get constraint () {
        return this._com as HingeConstraint;
    }

    setPivotA (v: IVec3Like): void {
        Vec3.multiply(v3_0, v, this._com.node.worldScale);
        Vec3.copy(this.impl.pivotA, v3_0);
    }

    setPivotB (v: IVec3Like): void {
        Vec3.copy(v3_0, v);
        const cb = this.constraint.connectedBody;
        if (cb) {
            Vec3.multiply(v3_0, v3_0, cb.node.worldScale);
        } else {
            Vec3.add(v3_0, v3_0, this._com.node.worldPosition);
            Vec3.multiply(v3_1, this.constraint.pivotA, this._com.node.worldScale);
            Vec3.add(v3_0, v3_0, v3_1);
        }
        Vec3.copy(this.impl.pivotB, v3_0);
    }

    setAxisA (v: IVec3Like): void {
        Vec3.copy(this.impl.axisA, v);
        Vec3.copy((this.impl.equations[3] as RotationalEquation).axisA, v);
        Vec3.copy((this.impl.equations[4] as RotationalEquation).axisA, v);
    }

    setAxisB (v: IVec3Like): void {
        Vec3.copy(this.impl.axisB, v);
        Vec3.copy((this.impl.equations[3] as RotationalEquation).axisB, v);
        Vec3.copy((this.impl.equations[4] as RotationalEquation).axisB, v);
    }

    onComponentSet () {
        if (this._rigidBody) {
            const bodyA = (this._rigidBody.body as CannonRigidBody).impl;
            const cb = this.constraint.connectedBody;
            let bodyB: CANNON.Body = CANNON.World['staticBody'];
            if (cb) {
                bodyB = (cb.body as CannonRigidBody).impl;
            }
            this._impl = new CANNON.HingeConstraint(bodyA, bodyB);
            this.setPivotA(this.constraint.pivotA);
            this.setPivotB(this.constraint.pivotB);
            this.setAxisA(this.constraint.axisA);
            this.setAxisB(this.constraint.axisB);
        }
    }
}
