import { Constraint, RigidBody } from '../../framework';
import { IBaseConstraint } from '../../spec/i-physics-constraint';
import { PX } from '../export-physx';
import { PhysXRigidBody } from '../physx-rigid-body';
import { PhysXSharedBody } from '../physx-shared-body';

export class PhysXJoint implements IBaseConstraint {
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
        PX.IMPL_PTR[this._impl.$$.ptr] = this;
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
            this._impl.setActors(sb.impl, sb2.impl);
        } else {
            this._impl.setActors(sb.impl, null);
        }
    }

    onDisable (): void {
        this._impl.setActors(null, null);
    }

    onDestroy (): void {
        PX.IMPL_PTR[this._impl.$$.ptr] = null;
        delete PX.IMPL_PTR[this._impl.$$.ptr];
        this._impl.release();
        (this._com as any) = null;
        (this._rigidBody as any) = null;
        this._impl = null;
    }
}
