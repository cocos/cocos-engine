import CANNON from '@cocos/cannon';
import { CannonConstraint } from './cannon-constraint';
import { IPointToPointConstraint } from '../../spec/i-physics-constraint';
import { IVec3Like, Vec3 } from '../../../core';
import { PointToPointConstraint } from '../../framework';
import { CannonRigidBody } from '../cannon-rigid-body';

const v3_0 = new Vec3();
const v3_1 = new Vec3();

export class CannonPointToPointConstraint extends CannonConstraint implements IPointToPointConstraint {

    public get impl () {
        return this._impl as CANNON.PointToPointConstraint;
    }

    public get constraint () {
        return this._com as PointToPointConstraint;
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
