import Ammo from '../ammo-instantiated';
import { Vec3, Quat } from "../../../core/math";
import { ColliderComponent, RigidBodyComponent, PhysicMaterial, PhysicsSystem } from "../../../../exports/physics-framework";
import { AmmoWorld } from '../ammo-world';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { cocos2AmmoVec3, ammoDeletePtr } from '../ammo-util';
import { Node } from '../../../core';
import { IBaseShape } from '../../spec/i-physics-shape';
import { IVec3Like } from '../../../core/math/type-define';
import { AmmoSharedBody } from '../ammo-shared-body';

const v3_0 = new Vec3();

export class AmmoShape implements IBaseShape {

    setMaterial (v: PhysicMaterial | null) {
        if (!this._isTrigger && this._isEnabled && v) {
            if (this._btCompound) {
                const rollingFriction = 0.1;
                this._btCompound.setMaterial(this._index, v.friction, v.restitution, rollingFriction);
            } else {
                this._sharedBody.body.setFriction(v.friction);
                this._sharedBody.body.setRestitution(v.restitution);
            }
        }
    }

    setCenter (v: IVec3Like) {
        Vec3.copy(v3_0, v);
        v3_0.multiply(this._collider.node.worldScale);
        cocos2AmmoVec3(this.transform.getOrigin(), v3_0);
        if (this._btCompound) {
            this._btCompound.updateChildTransform(this._index, this.transform);
        }
    }

    setAsTrigger (v: boolean) {
        if (this._isTrigger == v)
            return;

        if (this._isEnabled) {
            this._sharedBody.removeShape(this, !v);
            this._sharedBody.addShape(this, v);
        }
        this._isTrigger = v;
    }

    get attachedRigidBody () {
        if (this._sharedBody.wrappedBody) { return this._sharedBody.wrappedBody.rigidBody; }
        return null;
    }

    get impl () { return this._btShape!; }
    get collider (): ColliderComponent { return this._collider; }
    get sharedBody (): AmmoSharedBody { return this._sharedBody; }
    get index () { return this._index; }

    private static idCounter = 0;
    readonly id: number;
    readonly type: AmmoBroadphaseNativeTypes;

    protected _index: number = -1;
    protected _isEnabled = false;
    protected _isBinding = false;
    protected _isTrigger = false;
    protected _sharedBody!: AmmoSharedBody;
    protected _btShape!: Ammo.btCollisionShape;
    protected _btCompound: Ammo.btCompoundShape | null = null;
    protected _collider!: ColliderComponent;

    readonly transform: Ammo.btTransform;
    readonly pos: Ammo.btVector3;
    readonly quat: Ammo.btQuaternion;
    readonly scale: Ammo.btVector3;

    constructor (type: AmmoBroadphaseNativeTypes) {
        this.type = type;
        this.id = AmmoShape.idCounter++;

        this.pos = new Ammo.btVector3(0, 0, 0);
        this.quat = new Ammo.btQuaternion();
        this.transform = new Ammo.btTransform(this.quat, this.pos);
        this.transform.setIdentity();

        this.scale = new Ammo.btVector3(1, 1, 1);
    }

    initialize (com: ColliderComponent) {
        this._collider = com;
        this._isBinding = true;
        this.onComponentSet();
        this.setWrapper();
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as AmmoWorld).getSharedBody(this._collider.node as Node);
        this._sharedBody.reference = true;
    }

    // virtual
    onComponentSet () { }

    onLoad () {
        this.setCenter(this._collider.center);
        this.setAsTrigger(this._collider.isTrigger);
    }

    onEnable () {
        this._isEnabled = true;
        this._sharedBody.addShape(this, this._isTrigger);

        this.setMaterial(this.collider.sharedMaterial);
    }

    onDisable () {
        this._isEnabled = false;
        this._sharedBody.removeShape(this, this._isTrigger);
    }

    onDestroy () {
        this._sharedBody.reference = false;
        this._btCompound = null;
        (this._collider as any) = null;
        const shape = Ammo.castObject(this._btShape, Ammo.btCollisionShape);
        shape['wrapped'] = null;
        Ammo.destroy(this.transform);
        Ammo.destroy(this.pos);
        Ammo.destroy(this.quat);
        Ammo.destroy(this.scale);
        Ammo.destroy(this._btShape);
        ammoDeletePtr(this.pos, Ammo.btVector3);
        ammoDeletePtr(this.quat, Ammo.btQuaternion);
        ammoDeletePtr(this.scale, Ammo.btVector3);
        ammoDeletePtr(this.transform, Ammo.btTransform);
        ammoDeletePtr(this._btShape, Ammo.btCollisionShape);
        (this._btShape as any) = null;
        (this.transform as any) = null;
        (this.pos as any) = null;
        (this.quat as any) = null;
        (this.scale as any) = null;
    }

    /** group mask */
    getGroup (): number {
        return this._sharedBody.collisionFilterGroup;
    }

    setGroup (v: number): void {
        this._sharedBody.collisionFilterGroup = v;
    }

    addGroup (v: number): void {
        this._sharedBody.collisionFilterGroup |= v;
    }

    removeGroup (v: number): void {
        this._sharedBody.collisionFilterGroup &= ~v;
    }

    getMask (): number {
        return this._sharedBody.collisionFilterMask;
    }

    setMask (v: number): void {
        this._sharedBody.collisionFilterMask = v;
    }

    addMask (v: number): void {
        this._sharedBody.collisionFilterMask |= v;
    }

    removeMask (v: number): void {
        this._sharedBody.collisionFilterMask &= ~v;
    }

    setCompound (compound: Ammo.btCompoundShape | null) {
        if (this._btCompound) {
            this._btCompound.removeChildShapeByIndex(this._index);
            this._index = -1;
        }
        if (compound) {
            compound.addChildShape(this.transform, this._btShape);
            this._index = compound.getNumChildShapes() - 1;
        }
        this._btCompound = compound;
    }

    setWrapper () {
        const shape = Ammo.castObject(this._btShape, Ammo.btCollisionShape);
        shape['wrapped'] = this;
    }

    setScale () {
        this.setCenter(this._collider.center);
    }

    /**DEBUG */
    private static _debugTransform: Ammo.btTransform | null;
    debugTransform (n: Node) {
        if (AmmoShape._debugTransform == null) {
            AmmoShape._debugTransform = new Ammo.btTransform();
        }
        let wt: Ammo.btTransform;
        if (this._isTrigger) {
            wt = this._sharedBody.ghost.getWorldTransform();
        } else {
            wt = this._sharedBody.body.getWorldTransform();
        }
        const lt = this.transform;
        AmmoShape._debugTransform.setIdentity();
        AmmoShape._debugTransform.op_mul(wt).op_mul(lt);
        let origin = AmmoShape._debugTransform.getOrigin();
        n.worldPosition = new Vec3(origin.x(), origin.y(), origin.z());
        let rotation = AmmoShape._debugTransform.getRotation();
        n.worldRotation = new Quat(rotation.x(), rotation.y(), rotation.z(), rotation.w());
        let scale = this.impl.getLocalScaling();
        n.scale = new Vec3(scale.x(), scale.y(), scale.z());
    }
}
