import Ammo from 'ammo.js';
import { ShapeBase } from "../../api";
import { Vec3, Quat } from "../../../core/math";
import { AmmoRigidBody } from "../ammo-body";
import { ColliderComponent, RigidBodyComponent } from "../../../../exports/physics-framework";
import { AmmoWorld } from '../ammo-world';
import { AmmoCollisionFlags, AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { defaultRigidBodyInfo } from '../ammo-const';
import { Cocos2AmmoVec3, Cocos2AmmoQuat } from '../ammo-util';
import { TransformDirtyBit } from '../../../core/scene-graph/node-enum';
import { Node } from '../../../core';

export class AmmoShape implements ShapeBase {

    public readonly type: AmmoBroadphaseNativeTypes;
    public readonly id: number;
    private static idCounter = 0;

    public get impl () {
        return this._btShape!;
    }

    public index: number = -1;
    protected _btShape!: Ammo.btCollisionShape;

    public readonly transform: Ammo.btTransform;

    public readonly pos: Ammo.btVector3;
    public readonly quat: Ammo.btQuaternion;
    public readonly scale: Ammo.btVector3;

    public collider!: ColliderComponent;
    public attachRigidBody: RigidBodyComponent | null = null;

    public constructor (type: AmmoBroadphaseNativeTypes) {
        this.type = type;
        this.id = AmmoShape.idCounter++;

        this.pos = new Ammo.btVector3(0, 0, 0);
        this.quat = new Ammo.btQuaternion();
        this.transform = new Ammo.btTransform(this.quat, this.pos);
        this.transform.setIdentity();

        this.scale = new Ammo.btVector3(1, 1, 1);
    }

    public __preload () {
        this.attachRigidBody = this.collider.getComponent(RigidBodyComponent);
    }

    public onLoad () { }

    public start () { }

    public onEnable () { }

    public onDisable () { }

    public setCenter (center: Vec3): void { }

    /**
     * 针对 static 或 trigger
     */
    public beforeStep () { }

    public UP (n: Node) {
        if (this.attachRigidBody && !this.collider.isTrigger) {
            const body = this.attachRigidBody._impl as AmmoRigidBody;
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

}
const _trans = new Ammo.btTransform();
_trans.setIdentity();