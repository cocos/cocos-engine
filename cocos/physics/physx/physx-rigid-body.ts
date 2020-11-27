import { IVec3Like, Node, Vec3 } from '../../core';
import { TransformBit } from '../../core/scene-graph/node-enum';
import { PhysicsSystem, RigidBody } from '../framework';
import { IRigidBody } from '../spec/i-rigid-body';
import { PX, USE_BYTEDANCE, _trans } from './export-physx';
import { PhysXSharedBody } from './physx-shared-body';
import { PhysXWorld } from './physx-world';

const v30 = new Vec3();

export class PhysXRigidBody implements IRigidBody {
    get impl (): any { return this._sharedBody.impl; }

    get isAwake (): boolean { return !this.impl.isSleeping(); }
    isSleepy = false;
    get isSleeping (): boolean { return this.impl.isSleeping(); }

    get isEnabled (): boolean { return this._isEnabled; }
    get rigidBody (): RigidBody { return this._rigidBody; }

    private _isEnabled = false;
    private _rigidBody!: RigidBody;
    private _sharedBody!: PhysXSharedBody;

    initialize (v: RigidBody): void {
        this._rigidBody = v;
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as PhysXWorld).getSharedBody(v.node, this);
        this._sharedBody.reference = true;
    }

    onLoad (): void {
    }

    onEnable (): void {
        this._isEnabled = true;
        this.setGroup(this._rigidBody.group);
        if (PhysicsSystem.instance.useCollisionMatrix) {
            this.setMask(PhysicsSystem.instance.collisionMatrix[this._rigidBody.group]);
        }
        this._sharedBody.enabled = true;
    }

    onDisable (): void {
        this._isEnabled = false;
        this._sharedBody.enabled = false;
    }

    onDestroy (): void {
        this._sharedBody.reference = false;
        (this._rigidBody as any) = null;
        (this._sharedBody as any) = null;
    }

    setMass (v: number): void {
        // if (v == 0 && !this.isStatic) {
        //     this.isStatic = true;
        //     this.impl.release();
        //     const t = _trans as unknown as PhysX.Transform;
        //     Vec3.copy(_trans.translation, this.rigidBody.node.worldPosition);
        //     Quat.copy(_trans.rotation, this.rigidBody.node.worldRotation);
        //     this.impl = this.wrappedWorld.physics.createRigidStatic(t);
        // } else {
        //     this.impl.setMassAndUpdateInertia(v);
        // }
        if (v <= 0) return;
        if (this._sharedBody.isStatic) return;
        this.impl.setMassAndUpdateInertia(v);
    }

    setLinearDamping (v: number): void {
        this.impl.setLinearDamping(v);
    }

    setAngularDamping (v: number): void {
        this.impl.setAngularDamping(v);
    }

    setIsKinematic (v: boolean): void {
        if (this._sharedBody.isStatic) return;
        if (USE_BYTEDANCE) {
            this._sharedBody.setRigidBodyFlag(PX.RigidBodyFlag.eKINEMATIC, !!v);
        } else {
            this._sharedBody.setRigidBodyFlag(PX.PxRigidBodyFlag.eKINEMATIC, v);
        }
    }

    useGravity (v: boolean): void {
        if (USE_BYTEDANCE) {
            this.impl.setActorFlag(PX.ActorFlag.eDISABLE_GRAVITY, !v);
        } else {
            this.impl.setActorFlag(PX.PxActorFlag.eDISABLE_GRAVITY, !v);
        }
    }

    fixRotation (v: boolean): void {
        if (USE_BYTEDANCE) {
            this.impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_ANGULAR_X, !!v);
            this.impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_ANGULAR_Y, !!v);
            this.impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_ANGULAR_Z, !!v);
        } else {
            this.impl.setRigidDynamicLockFlag(PX.PxRigidDynamicLockFlag.eLOCK_ANGULAR_X, v);
            this.impl.setRigidDynamicLockFlag(PX.PxRigidDynamicLockFlag.eLOCK_ANGULAR_Y, v);
            this.impl.setRigidDynamicLockFlag(PX.PxRigidDynamicLockFlag.eLOCK_ANGULAR_Z, v);
        }
        if (!v) { this.setAngularFactor(this._rigidBody.angularFactor); }
    }

    setLinearFactor (v: IVec3Like): void {
        if (USE_BYTEDANCE) {
            this.impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_LINEAR_X, !v.x);
            this.impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_LINEAR_Y, !v.y);
            this.impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_LINEAR_Z, !v.z);
        } else {
            this.impl.setRigidDynamicLockFlag(PX.PxRigidDynamicLockFlag.eLOCK_LINEAR_X, !v.x);
            this.impl.setRigidDynamicLockFlag(PX.PxRigidDynamicLockFlag.eLOCK_LINEAR_Y, !v.y);
            this.impl.setRigidDynamicLockFlag(PX.PxRigidDynamicLockFlag.eLOCK_LINEAR_Z, !v.z);
        }
    }

    setAngularFactor (v: IVec3Like): void {
        if (USE_BYTEDANCE) {
            this.impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_ANGULAR_X, !v.x);
            this.impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_ANGULAR_Y, !v.y);
            this.impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_ANGULAR_Z, !v.z);
        } else {
            this.impl.setRigidDynamicLockFlag(PX.PxRigidDynamicLockFlag.eLOCK_ANGULAR_X, !v.x);
            this.impl.setRigidDynamicLockFlag(PX.PxRigidDynamicLockFlag.eLOCK_ANGULAR_Y, !v.y);
            this.impl.setRigidDynamicLockFlag(PX.PxRigidDynamicLockFlag.eLOCK_ANGULAR_Z, !v.z);
        }
    }

    setAllowSleep (v: boolean): void {
        const st = this.impl.getSleepThreshold();
        const wc = v ? Math.max(0.0, st - 0.1) : st + 1;
        this.impl.setWakeCounter(wc);
    }

    wakeUp (): void {
        this.impl.wakeUp();
    }

    sleep (): void {
        this.impl.putToSleep();
    }

    clearState (): void {
        this.clearForces();
        this.clearVelocity();
    }

    clearForces (): void {
        this.impl.clearForce(PX.PxForceMode.eFORCE); // this.impl.clearForce(PX.PxForceMode.eACCELERATION);
        this.impl.clearForce(PX.PxForceMode.eIMPULSE); // this.impl.clearForce(PX.PxForceMode.eVELOCITY_CHANGE);
    }

    clearVelocity (): void {
        this.impl.setLinearVelocity(Vec3.ZERO, true);
        this.impl.setAngularVelocity(Vec3.ZERO, true);
    }

    setSleepThreshold (v: number): void {
        this.impl.setSleepThreshold(v);
    }

    getSleepThreshold (): number {
        return this.impl.getSleepThreshold();
    }

    getLinearVelocity (out: IVec3Like): void {
        Vec3.copy(out, this.impl.getLinearVelocity());
    }

    setLinearVelocity (value: IVec3Like): void {
        this.impl.setLinearVelocity(value, true);
    }

    getAngularVelocity (out: IVec3Like): void {
        Vec3.copy(out, this.impl.getAngularVelocity());
    }

    setAngularVelocity (value: IVec3Like): void {
        this.impl.setAngularVelocity(value, true);
    }

    applyForce (force: IVec3Like, relativePoint?: IVec3Like): void {
        this._sharedBody.syncSceneToPhysics();
        const rp = relativePoint || Vec3.ZERO;
        if (USE_BYTEDANCE) {
            this.impl.addForce(force, PX.ForceMode.eFORCE, true);
        } else {
            this.impl.addForceAtLocalPos(force, rp);
        }
    }

    applyLocalForce (force: IVec3Like, relativePoint?: IVec3Like): void {
        this._sharedBody.syncSceneToPhysics();
        const rp = relativePoint || Vec3.ZERO;
        if (USE_BYTEDANCE) {
            this.impl.addForce(force, PX.ForceMode.eFORCE, true);
        } else {
            this.impl.addForceAtLocalPos(force, rp);
        }
    }

    applyImpulse (force: IVec3Like, relativePoint?: IVec3Like): void {
        this._sharedBody.syncSceneToPhysics();
        const rp = relativePoint || Vec3.ZERO;
        if (USE_BYTEDANCE) {
            this.impl.addForce(force, PX.ForceMode.eIMPULSE, true);
        } else {
            this.impl.addImpulseAtPos(force, rp);
        }
    }

    applyLocalImpulse (force: IVec3Like, relativePoint?: IVec3Like): void {
        this._sharedBody.syncSceneToPhysics();
        const rp = relativePoint || Vec3.ZERO;
        if (USE_BYTEDANCE) {
            this.impl.addForce(force, PX.ForceMode.eIMPULSE, true);
        } else {
            this.impl.addImpulseAtLocalPos(force, rp);
        }
    }

    applyTorque (torque: IVec3Like): void {
        if (USE_BYTEDANCE) {
            this.impl.addTorque(torque, PX.ForceMode.eFORCE, true);
        } else {
            this.impl.addTorque(torque);
        }
    }

    applyLocalTorque (torque: IVec3Like): void {
        this._sharedBody.syncSceneToPhysics();
        Vec3.transformQuat(v30, torque, this._sharedBody.node.worldRotation);
        if (USE_BYTEDANCE) {
            this.impl.addTorque(v30, PX.ForceMode.eFORCE, true);
        } else {
            this.impl.addTorque(v30);
        }
    }

    setGroup (v: number): void {
        this._sharedBody.setGroup(v);
    }

    getGroup (): number {
        return this._sharedBody.getGroup();
    }

    addGroup (v: number): void {
        this._sharedBody.addGroup(v);
    }

    removeGroup (v: number): void {
        this._sharedBody.removeGroup(v);
    }

    setMask (v: number): void {
        this._sharedBody.setMask(v);
    }

    getMask (): number {
        return this._sharedBody.getMask();
    }

    addMask (v: number): void {
        this._sharedBody.addMask(v);
    }

    removeMask (v: number): void {
        this._sharedBody.removeMask(v);
    }
}
