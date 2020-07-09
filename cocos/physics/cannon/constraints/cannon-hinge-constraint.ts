
import CANNON, { RotationalEquation } from '@cocos/cannon';
import { CannonConstraint } from './cannon-constraint';
import { IHingeConstraint } from '../../spec/i-physics-constraint';
import { HingeConstraintComponent } from '../../framework';
import { CannonRigidBody } from '../cannon-rigid-body';
import { IVec3Like, Vec3 } from '../../../core';

export class CannonHingeConstraint extends CannonConstraint implements IHingeConstraint {

    public get impl () {
        return this._impl as CANNON.HingeConstraint;
    }

    public get constraint () {
        return this._com as HingeConstraintComponent;
    }

    setPivotA (v: IVec3Like): void {
        Vec3.copy(this.impl.pivotA, v);
    }

    setPivotB (v: IVec3Like): void {
        Vec3.copy(this.impl.pivotB, v);
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
