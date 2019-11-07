import Ammo from 'ammo.js';
import { Vec3, Quat } from "../../../core/math";
import { ColliderComponent, RigidBodyComponent, PhysicMaterial, PhysicsSystem } from "../../../../exports/physics-framework";
import { AmmoWorld } from '../ammo-world';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { Cocos2AmmoVec3 } from '../ammo-util';
import { Node } from '../../../core';
import { IBaseShape } from '../../spec/i-physics-spahe';
import { IVec3Like } from '../../../core/math/type-define';
import { AmmoSharedBody } from '../ammo-shared-body';

const v3_0 = new Vec3();

export class AmmoShape implements IBaseShape {

    get sharedMaterial () { return this._collider.sharedMaterial; }
    set material (v: PhysicMaterial) { };

    set center (v: IVec3Like) {
        Vec3.copy(v3_0, v);
        v3_0.multiply(this._collider.node.worldScale);
        Cocos2AmmoVec3(this.transform.getOrigin(), v3_0);
        if (this._btCompound) {
            this._btCompound.updateChildTransform(this.index, this.transform);
        }
    };

    set isTrigger (v: boolean) {
        if (this._isTrigger == v)
            return;

        if (this._isEnabled) {
            this._sharedBody.removeShape(this, !v);
            this._sharedBody.addShape(this, v);
        }
        this._isTrigger = v;
    }

    get attachedRigidBody (): RigidBodyComponent | null {
        if (this._sharedBody.wrappedBody) { return this._sharedBody.wrappedBody.rigidBody; }
        return null;
    }

    get shape () { return this._btShape!; }
    get collider (): ColliderComponent { return this._collider; }
    get sharedBody (): AmmoSharedBody { return this._sharedBody; }
    get index () { return this._index; }

    private static idCounter = 0;
    readonly id: number;
    readonly type: AmmoBroadphaseNativeTypes;

    protected _index: number = -1;
    protected _isEnabled = false;
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

    __preload (com: ColliderComponent) {
        this._collider = com;
        this._sharedBody = (PhysicsSystem.instance.physicsWorld as AmmoWorld).getSharedBody(this._collider.node as Node);
        this._sharedBody.reference = true;
    }

    onLoad () {
        this.center = this._collider.center;
        this.isTrigger = this._collider.isTrigger;
    }

    onEnable () {
        this._isEnabled = true;
        this._sharedBody.addShape(this, this._isTrigger);
        if (this._isTrigger) {
            this._sharedBody.ghostEnabled = true;
        } else {
            this._sharedBody.bodyEnabled = true;
        }
    }

    onDisable () {
        this._isEnabled = false;
        this._sharedBody.removeShape(this, this._isTrigger);
        if (this._isTrigger) {
            this._sharedBody.ghostEnabled = false;
        } else {
            this._sharedBody.bodyEnabled = false;
        }
    }

    onDestroy () {
        this._sharedBody.reference = false;
        this._btCompound = null;
        (this._collider as any) = null;

        Ammo.destroy(this._btShape);
        Ammo.destroy(this.transform);
        Ammo.destroy(this.pos);
        Ammo.destroy(this.quat);
        Ammo.destroy(this.scale);
        (this._btShape as any) = null;
        (this.transform as any) = null;
        (this.pos as any) = null;
        (this.quat as any) = null;
        (this.scale as any) = null;
    }

    setGroup (v: number): void {
        throw new Error("Method not implemented.");
    }

    getGroup (): number {
        throw new Error("Method not implemented.");
    }

    addGroup (v: number): void {
        throw new Error("Method not implemented.");
    }

    removeGroup (v: number): void {
        throw new Error("Method not implemented.");
    }

    setMask (v: number): void {
        throw new Error("Method not implemented.");
    }

    getMask (): number {
        throw new Error("Method not implemented.");
    }

    addMask (v: number): void {
        throw new Error("Method not implemented.");
    }

    removeMask (v: number): void {
        throw new Error("Method not implemented.");
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

    updateScale () {
        // this.center = this._collider.center;
    }

    UP (n: Node) {
        // if (this.attachedRigidBody && !this.collider.isTrigger) {            
        //     const wt = this._sharedBody.body.getWorldTransform();
        //     const lt = this.transform;
        //     _trans.setIdentity();
        //     _trans.op_mul(wt).op_mul(lt);
        //     let origin = _trans.getOrigin();
        //     n.worldPosition = new Vec3(origin.x(), origin.y(), origin.z());
        //     let rotation = _trans.getRotation();
        //     n.worldRotation = new Quat(rotation.x(), rotation.y(), rotation.z(), rotation.w());
        // } else {
        //     let origin = this.transform.getOrigin();
        //     n.worldPosition = new Vec3(origin.x(), origin.y(), origin.z());
        //     let rotation = this.transform.getRotation();
        //     n.worldRotation = new Quat(rotation.x(), rotation.y(), rotation.z(), rotation.w());
        // }
        // if (this.type == AmmoBroadphaseNativeTypes.SPHERE_SHAPE_PROXYTYPE) {
        //     let scale = this.shape.getLocalScaling();
        //     n.scale = new Vec3(scale.x(), scale.y(), scale.z());
        // } else {
        //     let scale = this.shape.getLocalScaling();
        //     n.scale = new Vec3(scale.x(), scale.y(), scale.z());
        // }

        let wt: Ammo.btTransform;
        if (this._isTrigger) {
            wt = this._sharedBody.ghost.getWorldTransform();
        } else {
            wt = this._sharedBody.body.getWorldTransform();
        }
        const lt = this.transform;
        _trans.setIdentity();
        _trans.op_mul(wt).op_mul(lt);
        let origin = _trans.getOrigin();
        n.worldPosition = new Vec3(origin.x(), origin.y(), origin.z());
        let rotation = _trans.getRotation();
        n.worldRotation = new Quat(rotation.x(), rotation.y(), rotation.z(), rotation.w());
        let scale = this.shape.getLocalScaling();
        n.scale = new Vec3(scale.x(), scale.y(), scale.z());
    }
}
/** debug */
const _trans = new Ammo.btTransform();
_trans.setIdentity();