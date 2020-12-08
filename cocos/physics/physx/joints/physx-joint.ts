import { Constraint, PhysicsSystem, RigidBody } from '../../framework';
import { IBaseConstraint } from '../../spec/i-physics-constraint';
import { PX, USE_BYTEDANCE, _pxtrans } from '../export-physx';
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
        if (USE_BYTEDANCE) {
            //
        } else {
            PX.IMPL_PTR[this._impl.$$.ptr] = this;
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
            this._impl.setActors(sb.impl, sb2.impl);
        } else {
            // eslint-disable-next-line no-lonely-if
            if (USE_BYTEDANCE) {
                this._impl.setActors(sb.impl);
            } else {
                this._impl.setActors(sb.impl, null);
            }
        }
    }

    onDisable (): void {
        if (USE_BYTEDANCE) {
            this._impl.setActors(PhysXJoint.tempActor);
        } else {
            this._impl.setActors(PhysXJoint.tempActor, null);
        }
    }

    onDestroy (): void {
        if (USE_BYTEDANCE) {
            //
        } else {
            PX.IMPL_PTR[this._impl.$$.ptr] = null;
            delete PX.IMPL_PTR[this._impl.$$.ptr];
            this._impl.release();
        }
        (this._com as any) = null;
        (this._rigidBody as any) = null;
        this._impl = null;
    }
}
