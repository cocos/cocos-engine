import { Mat4, Quat, Vec3 } from '../../../core/math';
import { BuiltinSharedBody } from '../builtin-shared-body';
import { IBuiltinShape } from '../builtin-interface';
import { BuiltinObject } from '../object/builtin-object';
import { ColliderComponent, RigidBodyComponent, PhysicMaterial, PhysicsSystem } from '../../../../exports/physics-framework';
import { IBaseShape } from '../../spec/i-physics-spahe';
import { IVec3Like } from '../../../core/math/type-define';
import { BuiltInWorld } from '../builtin-world';
import { Node } from '../../../core';

export class BuiltinShape extends BuiltinObject implements IBaseShape {
    set material (v: PhysicMaterial) { }
    set isTrigger (v: boolean) { }
    get attachedRigidBody (): RigidBodyComponent | null { return null; }

    set center (v: IVec3Like) {
        Vec3.copy(this._localShape.center, v);
    }

    get localShape () {
        return this._worldShape;
    }

    get worldShape () {
        return this._worldShape;
    }

    get sharedBody () {
        return this._sharedBody;
    }

    get collider () {
        return this._collider;
    }

    /** id generator */
    private static idCounter: number = 0;
    readonly id: number = BuiltinShape.idCounter++;;

    protected _sharedBody!: BuiltinSharedBody;
    protected _collider!: ColliderComponent;
    protected _localShape!: IBuiltinShape;
    protected _worldShape!: IBuiltinShape;

    __preload (comp: ColliderComponent) {
        this._collider = comp;
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as BuiltInWorld).getSharedBody(this._collider.node as Node);
        this._sharedBody.reference = true;
    }

    onLoad () {
        this.center = this._collider.center;
        this.isTrigger = this._collider.isTrigger;
    }

    onEnable () {
        this._sharedBody.addShape(this);
        this._sharedBody.enabled = true;
    }

    onDisable () {
        this._sharedBody.removeShape(this);
        this._sharedBody.enabled = false;
    }

    onDestroy () {
        this._sharedBody.reference = false;
        (this._collider as any) = null;
        (this._localShape as any) = null;
        (this._worldShape as any) = null;
    }

    transform (m: Mat4, pos: Vec3, rot: Quat, scale: Vec3) {
        this._localShape.transform(m, pos, rot, scale, this._worldShape);
    }

}
