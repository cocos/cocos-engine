import { IVec3Like, Quat, Vec3 } from '../../../core';
import { PointToPointConstraint } from '../../framework';
import { IPointToPointConstraint } from '../../spec/i-physics-constraint';
import { PX, _trans, getTempTransform, _pxtrans } from '../export-physx';
import { PhysXRigidBody } from '../physx-rigid-body';
import { PhysXJoint } from './physx-joint';

export class PhysXDistanceJoint extends PhysXJoint implements IPointToPointConstraint {
    setPivotA (v: IVec3Like): void {
        const cs = this.constraint;
        const pos = _trans.translation;
        const rot = _trans.rotation;
        Vec3.copy(pos, cs.pivotA);
        Quat.copy(rot, Quat.IDENTITY);
        this._impl.setLocalPose(0, getTempTransform(pos, rot));
        if (!cs.connectedBody) this.setPivotB(cs.pivotB);
    }

    setPivotB (v: IVec3Like): void {
        const cs = this.constraint;
        const pos = _trans.translation;
        const rot = _trans.rotation;
        Vec3.copy(pos, cs.pivotB);
        Quat.copy(rot, Quat.IDENTITY);
        if (cs.connectedBody) {
            Vec3.copy(pos, cs.pivotB);
        } else {
            Vec3.add(pos, this._rigidBody.node.worldPosition, cs.pivotA);
            Vec3.add(pos, pos, cs.pivotB);
            Quat.multiply(rot, rot, this._rigidBody.node.worldRotation);
        }
        this._impl.setLocalPose(1, getTempTransform(pos, rot));
    }

    get constraint (): PointToPointConstraint {
        return this._com as PointToPointConstraint;
    }

    onComponentSet (): void {
        if (this._rigidBody) {
            const sb = (this._rigidBody.body as PhysXRigidBody).sharedBody;
            const physics = sb.wrappedWorld.physics;
            this._impl = PX.PxDistanceJointCreate(physics, PhysXJoint.tempActor, _pxtrans, null, _pxtrans);
            this.setPivotA(this.constraint.pivotA);
            this.setPivotB(this.constraint.pivotB);
        }
    }
}
