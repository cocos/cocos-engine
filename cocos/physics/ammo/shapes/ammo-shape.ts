import Ammo from 'ammo.js';
import { Vec3, Quat } from "../../../core/math";
import { AmmoRigidBody } from "../ammo-rigid-body";
import { ColliderComponent, RigidBodyComponent, PhysicMaterial } from "../../../../exports/physics-framework";
import { AmmoWorld } from '../ammo-world';
import { AmmoCollisionFlags, AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { defaultRigidBodyInfo } from '../ammo-const';
import { Cocos2AmmoVec3, Cocos2AmmoQuat } from '../ammo-util';
import { TransformDirtyBit } from '../../../core/scene-graph/node-enum';
import { Node } from '../../../core';
import { IBaseShape } from '../../spec/i-physics-spahe';
import { IVec3Like } from '../../../core/math/type-define';

export class AmmoShape implements IBaseShape {
    set material (v: PhysicMaterial) { };
    set isTrigger (v: boolean) { };
    set center (v: IVec3Like) { };

    get attachedRigidBody (): RigidBodyComponent | null { return null; }

    readonly type: AmmoBroadphaseNativeTypes;
    readonly id: number;
    private static idCounter = 0;

    get impl () {
        return this._btShape!;
    }

    index: number = -1;
    protected _btShape!: Ammo.btCollisionShape;

    readonly transform: Ammo.btTransform;

    readonly pos: Ammo.btVector3;
    readonly quat: Ammo.btQuaternion;
    readonly scale: Ammo.btVector3;

    collider!: ColliderComponent;
    attachRigidBody: RigidBodyComponent | null = null;

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
        this.collider = com;
        this.attachRigidBody = this.collider.getComponent(RigidBodyComponent);
    }

    onLoad () { }

    start () { }

    onEnable () { }

    onDisable () { }

    setCenter (center: Vec3): void { }

    /**
     * 针对 static 或 trigger
     */
    beforeStep () { }

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
            let scale = this.impl.getLocalScaling();
            n.scale = new Vec3(scale.x(), scale.y(), scale.z());
        } else {
            let scale = this.impl.getLocalScaling();
            n.scale = new Vec3(scale.x(), scale.y(), scale.z());
        }
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
}
const _trans = new Ammo.btTransform();
_trans.setIdentity();