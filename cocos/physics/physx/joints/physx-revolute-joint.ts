import { IVec3Like, Quat, Vec3 } from '../../../core';
import { HingeConstraint } from '../../framework';
import { IHingeConstraint } from '../../spec/i-physics-constraint';
import { PX, USE_BYTEDANCE, _pxtrans, _pxtrans2, _trans, _trans2 } from '../export-physx';
import { PhysXRigidBody } from '../physx-rigid-body';
import { PhysXJoint } from './physx-joint';

export class PhysXRevoluteJoint extends PhysXJoint implements IHingeConstraint {
    setPivotA (v: IVec3Like): void {
        const cs = this.constraint;
        Vec3.copy(_trans.translation, cs.pivotA);
        Quat.rotationTo(_trans.rotation, Vec3.UNIT_X, cs.axis);

        if (USE_BYTEDANCE) {
            _pxtrans.setPosition(_trans.translation);
            _pxtrans.setQuaternion(_trans.rotation);
            this._impl.setLocalPose(0, _pxtrans);
        } else {
            this._impl.setLocalPose(0, _trans);
        }

        if (!cs.connectedBody) this.setPivotB(cs.pivotB);
    }

    setPivotB (v: IVec3Like): void {
        const cs = this.constraint;
        Quat.rotationTo(_trans.rotation, Vec3.UNIT_X, cs.axis);
        if (this.constraint.connectedBody) {
            Vec3.copy(_trans.translation, cs.pivotB);
        } else {
            Vec3.add(_trans.translation, this._rigidBody.node.worldPosition, cs.pivotA);
            Vec3.add(_trans.translation, _trans.translation, cs.pivotB);
            Quat.multiply(_trans.rotation, _trans.rotation, this._rigidBody.node.worldRotation);
        }

        if (USE_BYTEDANCE) {
            _pxtrans.setPosition(_trans.translation);
            _pxtrans.setQuaternion(_trans.rotation);
            this._impl.setLocalPose(1, _pxtrans);
        } else {
            this._impl.setLocalPose(1, _trans);
        }
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
            if (USE_BYTEDANCE) {
                this._impl = PX.createRevoluteJoint(PhysXJoint.tempActor, _pxtrans, null, _pxtrans2);
            } else {
                this._impl = PX.PxRevoluteJointCreate(physics, PhysXJoint.tempActor, _trans, null, _trans);
            }
            this.setPivotA(this.constraint.pivotA);
            this.setPivotB(this.constraint.pivotB);
        }
    }
}
