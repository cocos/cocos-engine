import { IVec3Like, Quat, Vec3 } from '../../../core';
import { PointToPointConstraint } from '../../framework';
import { IPointToPointConstraint } from '../../spec/i-physics-constraint';
import { PX, _trans, _trans2 } from '../export-physx';
import { PhysXRigidBody } from '../physx-rigid-body';
import { PhysXJoint } from './physx-joint';

export class PhysXFixedJoint extends PhysXJoint implements IPointToPointConstraint {
    setPivotA (v: IVec3Like): void {
    }

    setPivotB (v: IVec3Like): void {
    }

    get constraint (): PointToPointConstraint {
        return this._com as PointToPointConstraint;
    }

    onComponentSet (): void {
        if (this._rigidBody) {
            const sb = (this._rigidBody.body as PhysXRigidBody).sharedBody;
            const physics = sb.wrappedWorld.physics;
            this._impl = PX.PxFixedJointCreate(physics, null, _trans, null, _trans2);
            this.setPivotA(this.constraint.pivotA);
            this.setPivotB(this.constraint.pivotB);
        }
    }
}
