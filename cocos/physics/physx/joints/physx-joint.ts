import { Constraint, RigidBody } from '../../framework';
import { IBaseConstraint } from '../../spec/i-physics-constraint';
import { PhysXRigidBody } from '../physx-rigid-body';
import { PhysXSharedBody } from '../physx-shared-body';

export class PhysXJoint implements IBaseConstraint {
    setConnectedBody (v: RigidBody | null): void {
    }

    setEnableCollision (v: boolean): void {
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
    }

    // virtual
    protected onComponentSet (): void { }

    onLoad (): void {

    }

    onEnable (): void {
        if (this._rigidBody) {
            const sb = (this._rigidBody.body as PhysXRigidBody).sharedBody;
            const connect = this._com.connectedBody;
            if (connect) {
                const sb2 = (connect.body as PhysXRigidBody).sharedBody;
                this._impl.setActors(sb.impl, sb2.impl);
            } else {
                this._impl.setActors(sb.impl, null);
            }
        }
    }

    onDisable (): void {
        this._impl.setActors(null, null);
    }

    onDestroy (): void {
        if (this._impl) {
            this._impl.release();
            (this._com as any) = null;
            (this._rigidBody as any) = null;
            this._impl = null;
        }
    }
}
