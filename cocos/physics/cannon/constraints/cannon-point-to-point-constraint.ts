import CANNON from '@cocos/cannon';
import { CannonConstraint } from './cannon-constraint';
import { IPointToPointConstraint } from '../../spec/i-physics-constraint';
import { IVec3Like, Vec3 } from '../../../core';
import { PointToPointConstraintComponent } from '../../framework';
import { CannonRigidBody } from '../cannon-rigid-body';

export class CannonPointToPointConstraint extends CannonConstraint implements IPointToPointConstraint {

    public get impl () {
        return this._impl as CANNON.PointToPointConstraint;
    }

    public get constraint () {
        return this._com as PointToPointConstraintComponent;
    }

    setPivotA (v: IVec3Like): void {
        Vec3.copy(this.impl.pivotA, v);
    }

    setPivotB (v: IVec3Like): void {
        Vec3.copy(this.impl.pivotB, v);
    }

    onComponentSet () {
        if (this._rigidBody) {
            const bodyA = (this._rigidBody.body as CannonRigidBody).impl;
            const cb = this.constraint.connectedBody;
            let bodyB: CANNON.Body = CANNON.World['staticBody'];
            if (cb) {
                bodyB = (cb.body as CannonRigidBody).impl;
            }
            this._impl = new CANNON.PointToPointConstraint(bodyA, null, bodyB);
            this.setPivotA(this.constraint.pivotA);
            this.setPivotB(this.constraint.pivotB);
        }
    }
}
