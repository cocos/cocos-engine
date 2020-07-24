import { IRigidBody } from "../spec/i-rigid-body";
import { IVec3Like } from "../../core";
import { RigidBodyComponent, PhysicsSystem } from "../framework";
import { BuiltinSharedBody } from "./builtin-shared-body";
import { BuiltInWorld } from "./builtin-world";

export class BuiltinRigidBody implements IRigidBody {
    get impl () { return this; }
    get isAwake () { return true; }
    get isSleepy () { return false; }
    get isSleeping () { return false; }

    rigidBody!: RigidBodyComponent;
    protected _sharedBody!: BuiltinSharedBody;

    initialize (com: RigidBodyComponent): void {
        this.rigidBody = com;
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as BuiltInWorld).getSharedBody(this.rigidBody.node);
        this._sharedBody.reference = true;
        this._sharedBody.wrappedBody = this;
    }

    onEnable () {
        // this._sharedBody.enabled = true;
    }

    onDisable () {
        // this._sharedBody.enabled = false;
    }

    onDestroy () {
        this._sharedBody.reference = false;
        (this.rigidBody as any) = null;
        (this._sharedBody as any) = null;
    }

    setMass (v: number) { }
    setLinearDamping (v: number) { }
    setAngularDamping (v: number) { }
    setIsKinematic (v: boolean) { }
    useGravity (v: boolean) { }
    fixRotation (v: boolean) { }
    setLinearFactor (v: IVec3Like) { }
    setAngularFactor (v: IVec3Like) { }
    setAllowSleep (v: boolean) { }
    wakeUp (): void { }
    sleep (): void { }
    clearState (): void { }
    clearForces (): void { }
    clearVelocity (): void { }
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
