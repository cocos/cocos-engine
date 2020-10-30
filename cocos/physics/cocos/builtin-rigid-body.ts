import { IRigidBody } from "../spec/i-rigid-body";
import { IVec3Like } from "../../core";
import { RigidBody, PhysicsSystem, ERigidBodyType } from "../framework";
import { BuiltinSharedBody } from "./builtin-shared-body";
import { BuiltInWorld } from "./builtin-world";

export class BuiltinRigidBody implements IRigidBody {
    get impl () { return this; }
    get isAwake () { return true; }
    get isSleepy () { return false; }
    get isSleeping () { return false; }

    get rigidBody () { return this._rigidBody; }
    get sharedBody () { return this._sharedBody; }

    private _rigidBody!: RigidBody;
    protected _sharedBody!: BuiltinSharedBody;

    initialize (com: RigidBody): void {
        this._rigidBody = com;
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as BuiltInWorld).getSharedBody(this._rigidBody.node, this);
        this._sharedBody.reference = true;
    }

    onEnable () {
        this._sharedBody.enabled = true;
    }

    onDisable () {
        this._sharedBody.enabled = false;
    }

    onDestroy () {
        this._sharedBody.reference = false;
        (this._rigidBody as any) = null;
        (this._sharedBody as any) = null;
    }

    setMass (v: number) { }
    setType (v: ERigidBodyType) { }
    setLinearDamping (v: number) { }
    setAngularDamping (v: number) { }
    useGravity (v: boolean) { }
    setLinearFactor (v: IVec3Like) { }
    setAngularFactor (v: IVec3Like) { }
    setAllowSleep (v: boolean) { }
    wakeUp (): void { }
    sleep (): void { }
    clearState (): void { }
    clearForces (): void { }
    clearVelocity (): void { }
    setSleepThreshold (v: number): void { }
    getSleepThreshold (): number { return 0 }
    getLinearVelocity (out: IVec3Like): void { }
    setLinearVelocity (value: IVec3Like): void { }
    getAngularVelocity (out: IVec3Like): void { }
    setAngularVelocity (value: IVec3Like): void { }
    applyForce (force: IVec3Like, relativePoint?: IVec3Like): void { }
    applyLocalForce (force: IVec3Like, relativePoint?: IVec3Like): void { }
    applyImpulse (force: IVec3Like, relativePoint?: IVec3Like): void { }
    applyLocalImpulse (force: IVec3Like, relativePoint?: IVec3Like): void { }
    applyTorque (torque: IVec3Like): void { }
    applyLocalTorque (torque: IVec3Like): void { }

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
