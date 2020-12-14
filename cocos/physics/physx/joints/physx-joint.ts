import { Constraint, PhysicsSystem, RigidBody } from '../../framework';
import { IBaseConstraint } from '../../spec/i-physics-constraint';
import { PX, setJointActors, _pxtrans } from '../export-physx';
import { PhysXRigidBody } from '../physx-rigid-body';
import { PhysXSharedBody } from '../physx-shared-body';
import { PhysXWorld } from '../physx-world';

export class PhysXJoint implements IBaseConstraint {
    private static _tempActor: any;

    static get tempActor (): any {
        if (this._tempActor == null) {
            const physics = (PhysicsSystem.instance.physicsWorld as PhysXWorld).physics;
            this._tempActor = physics.createRigidDynamic(_pxtrans);
        }
        return this._tempActor;
    }

    setConnectedBody (v: RigidBody | null): void {
        // TODO
    }

    setEnableCollision (v: boolean): void {
        this._impl.setConstraintFlag(1 << 3, v);
    }

    get impl (): any { return this._impl; }

    protected _impl!: any;
    protected _com!: Constraint;
    protected _rigidBody!: RigidBody;
    protected _sharedBody!: PhysXSharedBody;

    initialize (v: Constraint): void {
        this._com = v;
        this._rigidBody = v.attachedBody!;
        this.onComponentSet();
        this.setEnableCollision(this._com.enableCollision);
        if (this._impl.$$) {
            PX.IMPL_PTR[this._impl.$$.ptr] = this;
        } else {
            //
        }
    }

    // virtual
    protected onComponentSet (): void { }

    onLoad (): void {

    }

    onEnable (): void {
        const sb = (this._rigidBody.body as PhysXRigidBody).sharedBody;
        const connect = this._com.connectedBody;
        if (connect) {
            const sb2 = (connect.body as PhysXRigidBody).sharedBody;
            setJointActors(this._impl, sb.impl, sb2.impl);
        } else {
            setJointActors(this._impl, sb.impl, null);
        }
    }

    onDisable (): void {
        setJointActors(this._impl, PhysXJoint.tempActor, null);
    }

    onDestroy (): void {
        if (this._impl.$$) {
            PX.IMPL_PTR[this._impl.$$.ptr] = null;
            delete PX.IMPL_PTR[this._impl.$$.ptr];
        } else {
            //
        }
        this._impl.release();
        (this._com as any) = null;
        (this._rigidBody as any) = null;
        this._impl = null;
    }
}
