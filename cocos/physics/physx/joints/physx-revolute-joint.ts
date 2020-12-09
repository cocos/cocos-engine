import { IVec3Like, Quat, Vec3 } from '../../../core';
import { HingeConstraint } from '../../framework';
import { IHingeConstraint } from '../../spec/i-physics-constraint';
import { getTempTransform, PX, _pxtrans, _trans } from '../export-physx';
import { PhysXRigidBody } from '../physx-rigid-body';
import { PhysXJoint } from './physx-joint';

export class PhysXRevoluteJoint extends PhysXJoint implements IHingeConstraint {
    setPivotA (v: IVec3Like): void {
        const cs = this.constraint;
        const pos = _trans.translation;
        const rot = _trans.rotation;
        Vec3.copy(pos, cs.pivotA);
        Quat.rotationTo(rot, Vec3.UNIT_X, cs.axis);
        this._impl.setLocalPose(0, getTempTransform(pos, rot));
        if (!cs.connectedBody) this.setPivotB(cs.pivotB);
    }

    setPivotB (v: IVec3Like): void {
        const cs = this.constraint;
        const pos = _trans.translation;
        const rot = _trans.rotation;
        Quat.rotationTo(rot, Vec3.UNIT_X, cs.axis);
        if (this.constraint.connectedBody) {
            Vec3.copy(pos, cs.pivotB);
        } else {
            Vec3.add(pos, this._rigidBody.node.worldPosition, cs.pivotA);
            Vec3.add(pos, pos, cs.pivotB);
            Quat.multiply(rot, rot, this._rigidBody.node.worldRotation);
        }
        this._impl.setLocalPose(1, getTempTransform(pos, rot));
    }

    setAxisA (v: IVec3Like): void {
        this.setPivotA(this.constraint.pivotA);
        this.setPivotB(this.constraint.pivotB);
    }

    get constraint (): HingeConstraint {
        return this._com as HingeConstraint;
    }

    onComponentSet (): void {
        if (this._rigidBody) {
            const sb = (this._rigidBody.body as PhysXRigidBody).sharedBody;
            const physics = sb.wrappedWorld.physics;
            this._impl = PX.PxRevoluteJointCreate(physics, PhysXJoint.tempActor, _pxtrans, null, _pxtrans);
            this.setPivotA(this.constraint.pivotA);
            this.setPivotB(this.constraint.pivotB);
        }
    }
}
