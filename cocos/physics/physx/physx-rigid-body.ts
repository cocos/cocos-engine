import { IVec3Like, Vec3 } from '../../core';
import { PhysicsSystem, RigidBody } from '../framework';
import { IRigidBody } from '../spec/i-rigid-body';
import { applyForce, applyImpulse, applyTorqueForce, PX, _trans } from './export-physx';
import { PhysXSharedBody } from './physx-shared-body';
import { PhysXWorld } from './physx-world';

const v3_0 = new Vec3();

export class PhysXRigidBody implements IRigidBody {
    get impl (): any { return this._sharedBody.impl; }

    get isAwake (): boolean { return !this.impl.isSleeping(); }
    isSleepy = false;
    get isSleeping (): boolean { return this.impl.isSleeping(); }

    get isEnabled (): boolean { return this._isEnabled; }
    get rigidBody (): RigidBody { return this._rigidBody; }
    get sharedBody (): PhysXSharedBody { return this._sharedBody; }
    get isStatic (): boolean { return !this.impl || this._sharedBody.isStatic; }
    get isStaticOrKinematic (): boolean { return !this.impl || this._sharedBody.isKinematic; }

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
        this.setMass(this._rigidBody.mass);
        this.setAllowSleep(this._rigidBody.allowSleep);
        this.setLinearDamping(this._rigidBody.linearDamping);
        this.setAngularDamping(this._rigidBody.angularDamping);
        this.setIsKinematic(this._rigidBody.isKinematic);
        this.fixRotation(this._rigidBody.fixedRotation);
        this.setLinearFactor(this._rigidBody.linearFactor);
        this.setAngularFactor(this._rigidBody.angularFactor);
        this.useGravity(this._rigidBody.useGravity);
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
        if (this.isStatic) return;
        this._sharedBody.setMass(v);
    }

    setLinearDamping (v: number): void {
        if (this.isStatic) return;
        this.impl.setLinearDamping(v);
    }

    setAngularDamping (v: number): void {
        if (this.isStatic) return;
        this.impl.setAngularDamping(v);
    }

    setIsKinematic (v: boolean): void {
        if (this.isStatic) return;
        this._sharedBody.setRigidBodyFlag(PX.RigidBodyFlag.eKINEMATIC, v);
    }

    useGravity (v: boolean): void {
        if (this.isStatic) return;
        this.impl.setActorFlag(PX.ActorFlag.eDISABLE_GRAVITY, !v);
    }

    useCCD (v: boolean): void {
        if (this.isStatic) return;
        this.impl.setRigidBodyFlag(PX.RigidBodyFlag.eENABLE_CCD, v);
    }

    fixRotation (v: boolean): void {
        if (this.isStatic) return;
        this.impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_ANGULAR_X, !!v);
        this.impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_ANGULAR_Y, !!v);
        this.impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_ANGULAR_Z, !!v);
        if (!v) { this.setAngularFactor(this._rigidBody.angularFactor); }
    }

    setLinearFactor (v: IVec3Like): void {
        if (this.isStatic) return;
        this.impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_LINEAR_X, !v.x);
        this.impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_LINEAR_Y, !v.y);
        this.impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_LINEAR_Z, !v.z);
    }

    setAngularFactor (v: IVec3Like): void {
        if (this.isStatic) return;
        this.impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_ANGULAR_X, !v.x);
        this.impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_ANGULAR_Y, !v.y);
        this.impl.setRigidDynamicLockFlag(PX.RigidDynamicLockFlag.eLOCK_ANGULAR_Z, !v.z);
    }

    setAllowSleep (v: boolean): void {
        if (this.isStaticOrKinematic) return;
        const st = this.impl.getSleepThreshold();
        const wc = v ? Math.max(0.0, st - 0.1) : st + 0xffffffff;
        this.impl.setWakeCounter(wc);
    }

    wakeUp (): void {
        if (this.isStatic) return;
        this.impl.wakeUp();
    }

    sleep (): void {
        if (this.isStatic) return;
        this.impl.putToSleep();
    }

    clearState (): void {
        if (this.isStatic) return;
        this.clearForces();
        this.clearVelocity();
    }

    clearForces (): void {
        if (this.isStatic) return;
        this._sharedBody.clearForces();
    }

    clearVelocity (): void {
        if (this.isStatic) return;
        this._sharedBody.clearVelocity();
    }

    setSleepThreshold (v: number): void {
        if (this.isStatic) return;
        this.impl.setSleepThreshold(v);
    }

    getSleepThreshold (): number {
        if (this.isStatic) return 0;
        return this.impl.getSleepThreshold();
    }

    getLinearVelocity (out: IVec3Like): void {
        if (this.isStatic) return;
        Vec3.copy(out, this.impl.getLinearVelocity());
    }

    setLinearVelocity (value: IVec3Like): void {
        if (this.isStatic) return;
        this.impl.setLinearVelocity(value, true);
    }

    getAngularVelocity (out: IVec3Like): void {
        if (this.isStatic) return;
        Vec3.copy(out, this.impl.getAngularVelocity());
    }

    setAngularVelocity (value: IVec3Like): void {
        if (this.isStatic) return;
        this.impl.setAngularVelocity(value, true);
    }

    applyForce (force: IVec3Like, relativePoint?: IVec3Like): void {
        if (this.isStatic) return;
        this._sharedBody.syncSceneToPhysics();
        const rp = relativePoint || Vec3.ZERO;
        applyForce(true, this.impl, force, rp);
    }

    applyLocalForce (force: IVec3Like, relativePoint?: IVec3Like): void {
        if (this.isStatic) return;
        this._sharedBody.syncSceneToPhysics();
        const rp = relativePoint || Vec3.ZERO;
        applyForce(false, this.impl, force, rp);
    }

    applyImpulse (force: IVec3Like, relativePoint?: IVec3Like): void {
        if (this.isStatic) return;
        this._sharedBody.syncSceneToPhysics();
        const rp = relativePoint || Vec3.ZERO;
        applyImpulse(true, this.impl, force, rp);
    }

    applyLocalImpulse (force: IVec3Like, relativePoint?: IVec3Like): void {
        if (this.isStatic) return;
        this._sharedBody.syncSceneToPhysics();
        const rp = relativePoint || Vec3.ZERO;
        applyImpulse(false, this.impl, force, rp);
    }

    applyTorque (torque: IVec3Like): void {
        if (this.isStatic) return;
        applyTorqueForce(this.impl, torque);
    }

    applyLocalTorque (torque: IVec3Like): void {
        if (this.isStatic) return;
        this._sharedBody.syncSceneToPhysics();
        Vec3.transformQuat(v3_0, torque, this._sharedBody.node.worldRotation);
        applyTorqueForce(this.impl, v3_0);
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
