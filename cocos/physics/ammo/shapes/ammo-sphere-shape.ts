import Ammo from 'ammo.js';
import { Vec3 } from "../../../core";
import { AmmoShape } from "./ammo-shape";
import { SphereColliderComponent } from '../../../../exports/physics-framework';
import { Cocos2AmmoVec3 } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { ISphereShape } from '../../spec/i-physics-spahe';

const v3_0 = new Vec3();

export class AmmoSphereShape extends AmmoShape implements ISphereShape {

    public set radius (radius: number) {
        const ws = this.collider.node.worldScale;
        const max_sp = Math.abs(Math.max(Math.max(ws.x, ws.y), ws.z));
        v3_0.set(radius, radius, radius);
        v3_0.multiplyScalar(max_sp * 2);
        Cocos2AmmoVec3(this.scale, v3_0);
        this._btShape.setLocalScaling(this.scale);
        if (this._btCompound) {
            this._btCompound.updateChildTransform(this.index, this.transform, true);
        }
        // if (this.attachRigidBody) {
        //     const impl = this.attachRigidBody.rigidBody as AmmoRigidBody;
        //     impl._btCompoundShape.updateChildTransform(this.index, this.transform, true);
        // } else {
        //     if (this.collider.isTrigger) {
        //         AmmoWorld.instance.sharedTriggerCompoundShape.updateChildTransform(this.index, this.transform, true);
        //     } else {
        //         AmmoWorld.instance.sharedStaticCompoundShape.updateChildTransform(this.index, this.transform, true);
        //     }
        // }
    }

    public get btSphere (): Ammo.btSphereShape {
        return this._btShape as Ammo.btSphereShape;
    }

    public get sphereCollider (): SphereColliderComponent {
        return this.collider as SphereColliderComponent;
    }

    constructor (radius: number) {
        super(AmmoBroadphaseNativeTypes.SPHERE_SHAPE_PROXYTYPE);
        this._btShape = new Ammo.btSphereShape(0.5);
    }

    onLoad () {
        super.onLoad();
        this.radius = this.sphereCollider.radius;
    }

    updateScale () {
        super.updateScale();
        this.radius = this.sphereCollider.radius;
    }
}
