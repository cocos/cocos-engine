import Ammo from '../ammo-instantiated';
import { IBaseConstraint } from "../../spec/i-physics-constraint";
import { Constraint, RigidBody } from "../../framework";
import { AmmoRigidBody } from '../ammo-rigid-body';

export class AmmoConstraint implements IBaseConstraint {

    setConnectedBody (v: RigidBody | null): void {
        // TODO: support dynamic change connected body
    }

    setEnableCollision (v: boolean): void {
        if (this._collided != v) {
            this._collided = v;
            this.updateByReAdd();
        }
    }

    get impl (): Ammo.btTypedConstraint {
        return this._impl;
    }

    get constraint (): Constraint {
        return this._com;
    }

    dirty: number = 0;
    index: number = -1;

    protected _impl!: Ammo.btTypedConstraint;
    protected _com!: Constraint;
    protected _rigidBody: RigidBody | null = null;
    protected _collided = false;

    updateByReAdd () {
        if (this._rigidBody && this.index >= 0) {
            const sb = (this._rigidBody.body as AmmoRigidBody).sharedBody;
            sb.wrappedWorld.removeConstraint(this);
            sb.wrappedWorld.addConstraint(this);
        }
    }

    initialize (v: Constraint): void {
        this._com = v;
        this._rigidBody = v.attachedBody;
        this._collided = v.enableCollision;
        this.onComponentSet();
    }

    // virtual
    protected onComponentSet () { }

    onLoad (): void {

    }

    onEnable (): void {
        if (this._rigidBody) {
            const sb = (this._rigidBody.body as AmmoRigidBody).sharedBody;
            sb.wrappedWorld.addConstraint(this);
        }
    }

    onDisable (): void {
        if (this._rigidBody) {
            const sb = (this._rigidBody.body as AmmoRigidBody).sharedBody;
            sb.wrappedWorld.removeConstraint(this);
        }
    }

    onDestroy (): void {
        Ammo.destroy(this._impl);
        (this._com as any) = null;
        (this._rigidBody as any) = null;
        (this._impl as any) = null;
    }
}
