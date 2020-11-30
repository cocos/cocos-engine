import { IVec3Like, Quat, Vec3 } from '../../../core';
import { PointToPointConstraint } from '../../framework';
import { IPointToPointConstraint } from '../../spec/i-physics-constraint';
import { PX, _trans, _trans2 } from '../export-physx';
import { PhysXRigidBody } from '../physx-rigid-body';
import { PhysXJoint } from './physx-joint';

export class PhysXDistanceJoint extends PhysXJoint implements IPointToPointConstraint {
    setPivotA (v: IVec3Like): void {
        const pos = _trans.translation;
        const self = this._rigidBody;
        Vec3.copy(pos, v);
        if (self) Vec3.add(pos, pos, self.node.worldPosition);
        Vec3.copy(_trans.rotation, Quat.IDENTITY);
        this._impl.setLocalPose(0, _trans);
    }

    setPivotB (v: IVec3Like): void {
        const pos = _trans.translation;
        const connect = this._com.connectedBody;
        Vec3.copy(pos, v);
        if (connect) Vec3.add(pos, pos, connect.node.worldPosition);
        Vec3.copy(_trans.rotation, Quat.IDENTITY);
        this._impl.setLocalPose(1, _trans);
    }

    get constraint (): PointToPointConstraint {
        return this._com as PointToPointConstraint;
    }

    protected fixedTransform = {
        translation: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0, w: 1 },
    }

    onComponentSet (): void {
        if (this._rigidBody) {
            const sb = (this._rigidBody.body as PhysXRigidBody).sharedBody;
            const physics = sb.wrappedWorld.physics;
            Vec3.copy(_trans.translation, this.constraint.pivotA);
            Vec3.add(_trans.translation, _trans.translation, this._rigidBody.node.worldPosition);
            Vec3.copy(_trans.rotation, Quat.IDENTITY);
            Vec3.copy(_trans2.translation, this.constraint.pivotB);
            Vec3.copy(_trans2.rotation, Quat.IDENTITY);
            this._impl = PX.PxFixedJointCreate(physics, null, _trans, null, _trans2);
        }
    }

    onEnable (): void {
        super.onEnable();
        this.setPivotA(this.constraint.pivotA);
        this.setPivotB(this.constraint.pivotB);
    }

    updateLocalPose (): void {
        Vec3.copy(this.fixedTransform.translation, this._rigidBody.node.worldPosition);
        Vec3.copy(this.fixedTransform.rotation, this._rigidBody.node.worldRotation);
    }
}
