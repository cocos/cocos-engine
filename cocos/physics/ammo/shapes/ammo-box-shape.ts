import Ammo from 'ammo.js';
import { BoxShapeBase } from "../../api";
import { AmmoShape } from "./ammo-shape";
import { Vec3, Node } from "../../../core";
import { BoxColliderComponent, RigidBodyComponent } from '../../../../exports/physics-framework';
import { AmmoRigidBody } from '../ammo-body';
import { AmmoWorld } from '../ammo-world';
import { TransformDirtyBit } from '../../../core/scene-graph/node-enum';
import { Cocos2AmmoVec3, Cocos2AmmoQuat } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';


export class AmmoBoxShape extends AmmoShape implements BoxShapeBase {

    private _halfExtent: Vec3 = new Vec3();

    public get ammoBox (): Ammo.btBoxShape {
        return this._ammoShape as Ammo.btBoxShape;
    }

    public get boxCollider (): BoxColliderComponent {
        return this.collider as BoxColliderComponent;
    }

    public setScale (scale: Vec3): void {
        // super.setScale(scale);
        // this._recalcExtents();
    }

    private _recalcExtents () {
        // const halfExtents = new Vec3();
        // Vec3.multiply(halfExtents, this._halfExtent, this._scale);
        // this._ammoShape = new Ammo.btBoxShape(new Ammo.btVector3(halfExtents.x, halfExtents.y, halfExtents.z));
    }

    halfExt!: Ammo.btVector3;

    constructor (size: Vec3) {
        super();
        this.type = AmmoBroadphaseNativeTypes.BOX_SHAPE_PROXYTYPE;
    }

    public __preload () {
        super.__preload();
        /** 构造Box */
        // const halfExtents = this.boxCollider.size.clone();
        // halfExtents.multiplyScalar(0.5);
        this.halfExt = new Ammo.btVector3(0.5, 0.5, 0.5);
        this._ammoShape = new Ammo.btBoxShape(this.halfExt);
        /** 初始化Box形状属性 */
        // this._ammoShape.getLocalScaling()
    }

    public onLoad () {
        super.onLoad();
    }

    public start () {
        super.start();
    }

    public onEnable () {
        super.onEnable();
        this.attachRigidBody = this.collider.getComponent(RigidBodyComponent);
        if (this.attachRigidBody == null || this.collider.isTrigger) {
            Vec3.multiplyScalar(tmpv3, this.boxCollider.size, 1);
            tmpv3.multiply(this.collider.node.worldScale);
            Cocos2AmmoVec3(this.scale, tmpv3);
            this._ammoShape.setLocalScaling(this.scale);

            Cocos2AmmoQuat(this.localQuaternion, this.collider.node.worldRotation);
            this.localTransform.setRotation(this.localQuaternion);

            const pos = this.collider.center.clone();
            pos.multiply(this.collider.node.worldScale);
            Vec3.transformQuat(pos, pos, this.collider.node.worldRotation);
            pos.add(this.collider.node.worldPosition);
            Cocos2AmmoVec3(this.localTransform.getOrigin(), pos);

            if (this.collider.isTrigger) {
                AmmoWorld.instance.sharedTriggerCompoundShape.addChildShape(this.localTransform, this._ammoShape);
                this.index = AmmoWorld.instance.sharedTriggerCompoundShape.getNumChildShapes() - 1;
                AmmoWorld.instance.triggerShapes.push(this);
            } else {
                AmmoWorld.instance.sharedStaticCompoundShape.addChildShape(this.localTransform, this._ammoShape);
                this.index = AmmoWorld.instance.sharedStaticCompoundShape.getNumChildShapes() - 1;
                AmmoWorld.instance.staticShapes.push(this);
            }
        } else {

        }
    }

    public onDisable () {
        super.onDisable();
    }

    public setCenter (center: Vec3): void {
        if (this.attachRigidBody == null || this.collider.isTrigger) {
            const pos = center.clone();
            pos.multiply(this.collider.node.worldScale);
            Vec3.transformQuat(pos, pos, this.collider.node.worldRotation);
            pos.add(this.collider.node.worldPosition);
            Cocos2AmmoVec3(this.localTransform.getOrigin(), pos);
            if (this.collider.isTrigger) {
                AmmoWorld.instance.sharedTriggerCompoundShape.updateChildTransform(this.index, this.localTransform, true);
            } else {
                AmmoWorld.instance.sharedStaticCompoundShape.updateChildTransform(this.index, this.localTransform, true);
            }
        } else {
            Cocos2AmmoVec3(this.localTransform.getOrigin(), center);
            const impl = this.attachRigidBody._impl as AmmoRigidBody;
            impl.ammoCompoundShape.updateChildTransform(this.index, this.localTransform, true);
        }
    }

    public setSize (size: Vec3) {
        // Vec3.multiplyScalar(this._halfExtent, size, 0.5);

        // const newShape = new Ammo.btBoxShape(this.halfExt);
        // newShape.setLocalScaling(this.scale);

        // let comShape: Ammo.btCompoundShape;
        // if (this.attachRigidBody) {
        //     const impl = this.attachRigidBody._impl as AmmoRigidBody;
        //     comShape = impl.ammoCompoundShape;
        // } else {
        //     if (this.collider.isTrigger) {
        //         comShape = AmmoWorld.instance.sharedTriggerCompoundShape;
        //     } else {
        //         comShape = AmmoWorld.instance.sharedStaticCompoundShape;
        //     }
        // }
        // comShape.removeChildShapeByIndex(this.index);
        // comShape.addChildShape(this.localTransform, newShape);
        // this.index = comShape.getNumChildShapes() - 1;
        // comShape.updateChildTransform(this.index, this.localTransform, true);

        // Ammo.destroy(this._ammoShape);
        // this._ammoShape = newShape;

        Vec3.multiplyScalar(tmpv3, this.boxCollider.size, 1);
        tmpv3.multiply(this.collider.node.worldScale)
        Cocos2AmmoVec3(this.scale, tmpv3);
        this._ammoShape.setLocalScaling(this.scale);
        if (this.attachRigidBody) {
            const impl = this.attachRigidBody._impl as AmmoRigidBody;
            impl.ammoCompoundShape.updateChildTransform(this.index, this.localTransform, true);
        } else {
            if (this.collider.isTrigger) {
                AmmoWorld.instance.sharedTriggerCompoundShape.updateChildTransform(this.index, this.localTransform, true);
            } else {
                AmmoWorld.instance.sharedStaticCompoundShape.updateChildTransform(this.index, this.localTransform, true);
            }
        }
    }

    public beforeStep () {
        super.beforeStep();
        if (this.collider.node.hasChangedFlags) {
            Vec3.multiplyScalar(tmpv3, this.boxCollider.size, 1);
            tmpv3.multiply(this.collider.node.worldScale);
            Cocos2AmmoVec3(this.scale, tmpv3);
            this._ammoShape.setLocalScaling(this.scale);

            Cocos2AmmoQuat(this.localQuaternion, this.collider.node.worldRotation);
            this.localTransform.setRotation(this.localQuaternion);

            const pos = this.collider.center.clone();
            pos.multiply(this.collider.node.worldScale);
            Vec3.transformQuat(pos, pos, this.collider.node.worldRotation);
            pos.add(this.collider.node.worldPosition);
            Cocos2AmmoVec3(this.localTransform.getOrigin(), pos);

            if (this.collider.isTrigger) {
                AmmoWorld.instance.sharedTriggerCompoundShape.updateChildTransform(this.index, this.localTransform, true);
            } else {
                AmmoWorld.instance.sharedStaticCompoundShape.updateChildTransform(this.index, this.localTransform, true);
            }
        }
    }


    // public UP (n: Node) {
    //     super.UP(n);
    //     // let scale = this.impl.getLocalScaling();
    //     // tmpv3.set(scale.x(), scale.y(), scale.z());
    //     // n.worldScale = tmpv3;
    // }
}

const tmpv3 = new Vec3();

// const pool = {};
// function getAmmoBox (hE: Vec3): Ammo.btBoxShape {
//     const key = hE.x + '-' + hE.y + '-' + hE.z;
//     if (pool[key] == null) {
//         return pool[key];
//     }
//     pool[key] = new Ammo.btBoxShape(new Ammo.btVector3(hE.x, hE.y, hE.z));
//     return pool[key];
// }
