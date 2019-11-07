import Ammo from 'ammo.js';
import { Vec3 } from "../../../core";
import { AmmoShape } from "./ammo-shape";
import { SphereColliderComponent } from '../../../../exports/physics-framework';
import { Cocos2AmmoVec3 } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { ISphereShape } from '../../spec/i-physics-spahe';

const v3_0 = new Vec3();

export class AmmoSphereShape extends AmmoShape implements ISphereShape {

    // public set center (v: IVec3Like) {
    //     if (this.attachRigidBody == null || this.collider.isTrigger) {
    //         const lp = tmpv3;
    //         const ws = this.collider.node.worldScale;
    //         const max_s = Math.max(Math.max(ws.x, ws.y), ws.z);
    //         lp.set(max_s, max_s, max_s);
    //         Vec3.multiply(lp, lp, v);
    //         Vec3.transformQuat(lp, lp, this.collider.node.worldRotation);
    //         lp.add(this.collider.node.worldPosition);
    //         Cocos2AmmoVec3(this.transform.getOrigin(), lp);
    //         if (this.collider.isTrigger) {
    //             AmmoWorld.instance.sharedTriggerCompoundShape.updateChildTransform(this.index, this.transform, true);
    //         } else {
    //             AmmoWorld.instance.sharedStaticCompoundShape.updateChildTransform(this.index, this.transform, true);
    //         }
    //     } else {
    //         Cocos2AmmoVec3(this.transform.getOrigin(), v);
    //         const impl = this.attachRigidBody.rigidBody as AmmoRigidBody;
    //         impl._btCompoundShape.updateChildTransform(this.index, this.transform, true);
    //     }
    // }

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

    // public onEnable () {
    //     super.onEnable();

    //     this.attachRigidBody = this.collider.getComponent(RigidBodyComponent);
    //     if (this.attachRigidBody == null || this.collider.isTrigger) {
    //         const radius = this.sphereCollider.radius;
    //         tmpv3.set(radius, radius, radius);
    //         const ws = this.collider.node.worldScale;
    //         const max_sp = Math.abs(Math.max(Math.max(ws.x, ws.y), ws.z));
    //         tmpv3.multiplyScalar(max_sp * 2);
    //         Cocos2AmmoVec3(this.scale, tmpv3);
    //         this._btShape.setLocalScaling(this.scale);

    //         Cocos2AmmoQuat(this.quat, this.collider.node.worldRotation);
    //         this.transform.setRotation(this.quat);

    //         tmpv3.set(max_sp, max_sp, max_sp);
    //         Vec3.multiply(tmpv3, tmpv3, this.collider.center);
    //         const lp = tmpv3;
    //         Vec3.transformQuat(lp, lp, this.collider.node.worldRotation);
    //         lp.add(this.collider.node.worldPosition);
    //         Cocos2AmmoVec3(this.transform.getOrigin(), lp);

    //         if (this.collider.isTrigger) {
    //             AmmoWorld.instance.sharedTriggerCompoundShape.addChildShape(this.transform, this._btShape);
    //             this.index = AmmoWorld.instance.sharedTriggerCompoundShape.getNumChildShapes() - 1;
    //             AmmoWorld.instance.triggerShapes.push(this);
    //         } else {
    //             AmmoWorld.instance.sharedStaticCompoundShape.addChildShape(this.transform, this._btShape);
    //             this.index = AmmoWorld.instance.sharedStaticCompoundShape.getNumChildShapes() - 1;
    //             AmmoWorld.instance.staticShapes.push(this);
    //         }
    //     }
    // }

    // public beforeStep () {
    //     super.beforeStep();
    //     if (this.collider.node.hasChangedFlags) {
    //         const ws = this.collider.node.worldScale;
    //         const max_sp = Math.abs(Math.max(Math.max(ws.x, ws.y), ws.z));
    //         const radius = this.sphereCollider.radius;
    //         tmpv3.set(radius, radius, radius);
    //         tmpv3.multiplyScalar(max_sp * 2);
    //         Cocos2AmmoVec3(this.scale, tmpv3);
    //         this._btShape.setLocalScaling(this.scale);

    //         const lp = tmpv3;
    //         lp.set(max_sp, max_sp, max_sp);
    //         Vec3.multiply(lp, lp, this.collider.center);
    //         Vec3.transformQuat(lp, lp, this.collider.node.worldRotation);
    //         lp.add(this.collider.node.worldPosition);
    //         Cocos2AmmoVec3(this.transform.getOrigin(), lp);

    //         Cocos2AmmoQuat(this.quat, this.collider.node.worldRotation);
    //         this.transform.setRotation(this.quat);

    //         if (this.collider.isTrigger) {
    //             AmmoWorld.instance.sharedTriggerCompoundShape.updateChildTransform(this.index, this.transform, true);
    //         } else {
    //             AmmoWorld.instance.sharedStaticCompoundShape.updateChildTransform(this.index, this.transform, true);
    //         }
    //     }
    // }

    updateScale () {
        super.updateScale();
        this.radius = this.sphereCollider.radius;
    }
}
