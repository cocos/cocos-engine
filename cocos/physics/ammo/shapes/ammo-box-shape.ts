import Ammo from 'ammo.js';
import { AmmoShape } from "./ammo-shape";
import { Vec3 } from "../../../core";
import { BoxColliderComponent } from '../../../../exports/physics-framework';
import { Cocos2AmmoVec3 } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { IBoxShape } from '../../spec/i-physics-spahe';

const v3_0 = new Vec3();

export class AmmoBoxShape extends AmmoShape implements IBoxShape {

    // set center (center: Vec3) {
    //     if (this.attachRigidBody == null || this.collider.isTrigger) {
    //         const pos = center.clone();
    //         pos.multiply(this.collider.node.worldScale);
    //         Vec3.transformQuat(pos, pos, this.collider.node.worldRotation);
    //         pos.add(this.collider.node.worldPosition);
    //         Cocos2AmmoVec3(this.transform.getOrigin(), pos);
    //         if (this.collider.isTrigger) {
    //             AmmoWorld.instance.sharedTriggerCompoundShape.updateChildTransform(this.index, this.transform, true);
    //         } else {
    //             AmmoWorld.instance.sharedStaticCompoundShape.updateChildTransform(this.index, this.transform, true);
    //         }
    //     } else {
    //         Cocos2AmmoVec3(this.transform.getOrigin(), center);
    //         const impl = this.attachRigidBody.rigidBody as AmmoRigidBody;
    //         impl._btCompoundShape.updateChildTransform(this.index, this.transform, true);
    //     }
    // }

    set size (size: Vec3) {
        // Vec3.multiplyScalar(tmpv3, this.boxCollider.size, 1);
        // tmpv3.multiply(this.collider.node.worldScale)
        // Cocos2AmmoVec3(this.scale, tmpv3);
        // this._btShape.setLocalScaling(this.scale);
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
        Vec3.copy(v3_0, size);
        Vec3.multiply(v3_0, v3_0, this._collider.node.worldScale);
        Cocos2AmmoVec3(this.scale, v3_0);
        this._btShape.setLocalScaling(this.scale);
        if (this._btCompound) {
            this._btCompound.updateChildTransform(this.index, this.transform, true);
        }
    }

    get boxShape () {
        return this._btShape as Ammo.btBoxShape;
    }

    get boxCollider () {
        return this.collider as BoxColliderComponent;
    }

    readonly halfExt: Ammo.btVector3;

    constructor (size: Vec3) {
        super(AmmoBroadphaseNativeTypes.BOX_SHAPE_PROXYTYPE);
        this.halfExt = new Ammo.btVector3(0.5, 0.5, 0.5);
        this._btShape = new Ammo.btBoxShape(this.halfExt);
    }

    onLoad () {
        super.onLoad();
        this.size = this.boxCollider.size;
    }
    // onEnable () {
    //     super.onEnable();
    //     this.attachRigidBody = this.collider.getComponent(RigidBodyComponent);
    //     if (this.attachRigidBody == null || this.collider.isTrigger) {
    //         Vec3.multiplyScalar(tmpv3, this.boxCollider.size, 1);
    //         tmpv3.multiply(this.collider.node.worldScale);
    //         Cocos2AmmoVec3(this.scale, tmpv3);
    //         this._btShape.setLocalScaling(this.scale);

    //         Cocos2AmmoQuat(this.quat, this.collider.node.worldRotation);
    //         this.transform.setRotation(this.quat);

    //         const pos = this.collider.center.clone();
    //         pos.multiply(this.collider.node.worldScale);
    //         Vec3.transformQuat(pos, pos, this.collider.node.worldRotation);
    //         pos.add(this.collider.node.worldPosition);
    //         Cocos2AmmoVec3(this.transform.getOrigin(), pos);

    //         if (this.collider.isTrigger) {
    //             AmmoWorld.instance.sharedTriggerCompoundShape.addChildShape(this.transform, this._btShape);
    //             this.index = AmmoWorld.instance.sharedTriggerCompoundShape.getNumChildShapes() - 1;
    //             AmmoWorld.instance.triggerShapes.push(this);
    //         } else {
    //             AmmoWorld.instance.sharedStaticCompoundShape.addChildShape(this.transform, this._btShape);
    //             this.index = AmmoWorld.instance.sharedStaticCompoundShape.getNumChildShapes() - 1;
    //             AmmoWorld.instance.staticShapes.push(this);
    //         }
    //     } else {

    //     }
    // }

    // beforeStep () {
    //     super.beforeStep();
    //     if (this.collider.node.hasChangedFlags) {
    //         Vec3.multiplyScalar(tmpv3, this.boxCollider.size, 1);
    //         tmpv3.multiply(this.collider.node.worldScale);
    //         Cocos2AmmoVec3(this.scale, tmpv3);
    //         this._btShape.setLocalScaling(this.scale);

    //         Cocos2AmmoQuat(this.quat, this.collider.node.worldRotation);
    //         this.transform.setRotation(this.quat);

    //         const pos = this.collider.center.clone();
    //         pos.multiply(this.collider.node.worldScale);
    //         Vec3.transformQuat(pos, pos, this.collider.node.worldRotation);
    //         pos.add(this.collider.node.worldPosition);
    //         Cocos2AmmoVec3(this.transform.getOrigin(), pos);

    //         if (this.collider.isTrigger) {
    //             AmmoWorld.instance.sharedTriggerCompoundShape.updateChildTransform(this.index, this.transform, true);
    //         } else {
    //             AmmoWorld.instance.sharedStaticCompoundShape.updateChildTransform(this.index, this.transform, true);
    //         }
    //     }
    // }

    onDestroy () {
        super.onDestroy();
        Ammo.destroy(this.halfExt);
        (this.halfExt as any) = null;
    }

    updateScale () {
        super.updateScale();
        this.size = this.boxCollider.size;
    }

}
