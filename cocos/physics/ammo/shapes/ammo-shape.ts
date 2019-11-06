import Ammo from 'ammo.js';
import { Vec3, Quat } from "../../../core/math";
import { AmmoRigidBody } from "../ammo-rigid-body";
import { ColliderComponent, RigidBodyComponent, PhysicMaterial, PhysicsSystem } from "../../../../exports/physics-framework";
import { AmmoWorld } from '../ammo-world';
import { AmmoCollisionFlags, AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { defaultRigidBodyInfo } from '../ammo-const';
import { Cocos2AmmoVec3, Cocos2AmmoQuat } from '../ammo-util';
import { TransformDirtyBit } from '../../../core/scene-graph/node-enum';
import { Node } from '../../../core';
import { IBaseShape } from '../../spec/i-physics-spahe';
import { IVec3Like } from '../../../core/math/type-define';
import { AmmoSharedBody } from '../ammo-shared-body';

export class AmmoShape implements IBaseShape {

    set center (v: IVec3Like) {
        Cocos2AmmoVec3(this.transform.getOrigin(), v);
        if (this._btCompound) {
            this._btCompound.updateChildTransform(this.index, this.transform);
        }
    };

    set material (v: PhysicMaterial) { };

    set isTrigger (v: boolean) {
        if (this._isEnabled) {
            this._sharedBody.removeShape(this);
            this._sharedBody.addShape(this);
        }
    }

    get attachedRigidBody (): RigidBodyComponent | null { return null; }

    get shape () { return this._btShape!; }
    get collider (): ColliderComponent { return this._collider; }
    get sharedBody (): AmmoSharedBody { return this._sharedBody; }


    private static idCounter = 0;
    readonly id: number;

    readonly type: AmmoBroadphaseNativeTypes;
    index: number = -1;

    protected _sharedBody!: AmmoSharedBody;
    protected _btShape!: Ammo.btCollisionShape;
    protected _btCompound: Ammo.btCompoundShape | null = null;

    readonly transform: Ammo.btTransform;

    readonly pos: Ammo.btVector3;
    readonly quat: Ammo.btQuaternion;
    readonly scale: Ammo.btVector3;

    _collider!: ColliderComponent;

    private _isEnabled = false;

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
        this._sharedBody.addShape(this);
        this._sharedBody.enabled = true;
    }

    onDisable () {
        this._isEnabled = false;
        this._sharedBody.removeShape(this);
        this._sharedBody.enabled = false;
    }

    onDestroy () {
        this._sharedBody.reference = false;
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

    setIndex (i: number) {
        this.index = i;
    }

    setCompound (compound: Ammo.btCompoundShape | null) {
        this._btCompound = compound;
    }

    updateScale () {
        // this.center = this._collider.center;
    }

    UP (n: Node) {
        if (this.attachRigidBody && !this.collider.isTrigger) {
            const body = this.attachRigidBody.rigidBody as AmmoRigidBody;
            const wt = body.impl.getWorldTransform();
            const lt = this.transform;
            _trans.setIdentity();
            _trans.op_mul(wt).op_mul(lt);
            let origin = _trans.getOrigin();
            n.worldPosition = new Vec3(origin.x(), origin.y(), origin.z());
            let rotation = _trans.getRotation();
            n.worldRotation = new Quat(rotation.x(), rotation.y(), rotation.z(), rotation.w());
        } else {
            let origin = this.transform.getOrigin();
            n.worldPosition = new Vec3(origin.x(), origin.y(), origin.z());
            let rotation = this.transform.getRotation();
            n.worldRotation = new Quat(rotation.x(), rotation.y(), rotation.z(), rotation.w());
        }

        if (this.type == AmmoBroadphaseNativeTypes.SPHERE_SHAPE_PROXYTYPE) {
            let scale = this.shape.getLocalScaling();
            n.scale = new Vec3(scale.x(), scale.y(), scale.z());
        } else {
            let scale = this.shape.getLocalScaling();
            n.scale = new Vec3(scale.x(), scale.y(), scale.z());
        }
    }
}
const _trans = new Ammo.btTransform();
_trans.setIdentity();