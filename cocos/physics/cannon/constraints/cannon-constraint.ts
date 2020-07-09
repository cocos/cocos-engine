import CANNON from '@cocos/cannon';
import { IBaseConstraint } from '../../spec/i-physics-constraint';
import { ConstraintComponent, RigidBodyComponent } from '../../framework';
import { CannonRigidBody } from '../cannon-rigid-body';

CANNON.World['staticBody'] = new CANNON.Body();
CANNON.World['idToConstraintMap'] = {};

export class CannonConstraint implements IBaseConstraint {

    setConnectedBody (v: RigidBodyComponent | null): void {
        if (v) {
            this._impl.bodyB = (v.body as CannonRigidBody).impl;
        } else {
            this._impl.bodyB = CANNON.World['staticBody'];
        }
    }

    setCollideConnected (v: boolean): void {
        this._impl.collideConnected = v;
    }

    get impl () { return this._impl; }
    get constraint () { return this._com }

    protected _impl!: CANNON.Constraint;
    protected _com!: ConstraintComponent;
    protected _rigidBody: RigidBodyComponent | null = null;

    initialize (v: ConstraintComponent): void {
        this._com = v;
        this._rigidBody = v.attachedBody;
        this.onComponentSet();
        this.setCollideConnected(v.collideConnected);
        CANNON.World['idToConstraintMap'][this._impl.id] = this._impl;
    }

    // virtual
    protected onComponentSet () { }

    onLoad () {

    }

    onEnable () {
        if (this._rigidBody) {
            const sb = (this._rigidBody.body as CannonRigidBody).sharedBody;
            sb.wrappedWorld.addConstraint(this);
        }
    }

    onDisable () {
        if (this._rigidBody) {
            const sb = (this._rigidBody.body as CannonRigidBody).sharedBody;
            sb.wrappedWorld.removeConstraint(this);
        }
    }

    onDestroy () {
        delete CANNON.World['idToConstraintMap'][this._impl.id];
        (this._com as any) = null;
        (this._rigidBody as any) = null;
        (this._impl as any) = null;
    }
}
