import Ammo from 'ammo.js';
import { SphereShapeBase } from "../../api";
import { Vec3 } from "../../../core";
import { AmmoShape } from "./ammo-shape";
import { SphereColliderComponent } from '../../../../exports/physics-framework';
import { AmmoRigidBody } from '../ammo-body';
import { AmmoWorld } from '../ammo-world';
import { Cocos2AmmoVec3, Cocos2AmmoQuat } from '../ammo-util';
import { AmmoBroadphaseNativeTypes } from '../ammo-enum';
import { abs, max } from '../../../core/math/bits';

export class AmmoSphereShape extends AmmoShape implements SphereShapeBase {

    public get ammoSphere (): Ammo.btSphereShape {
        return this._ammoShape as Ammo.btSphereShape;
    }

    public get sphereCollider (): SphereColliderComponent {
        return this.collider as SphereColliderComponent;
    }

    constructor (radius: number) {
        super();
        this.type = AmmoBroadphaseNativeTypes.SPHERE_SHAPE_PROXYTYPE;
    }

    public setScale (scale: Vec3): void {
        // super.setScale(scale);
        // this._recalcRadius();
    }

    private _recalcRadius () {
        // const radius = this._radius * maxComponent(this._scale);
        // this._ammoSphere = new Ammo.btSphereShape(radius);
    }

    public __preload () {
        super.__preload();
        /** 构造Sphere */
        this._ammoShape = new Ammo.btSphereShape(0.5);
        /** 初始化Box形状属性 */
        // this._ammoShape.getLocalScaling()
    }

    public beforeStep () {
        super.beforeStep();
        if (this.collider.node.hasChangedFlags) {
            const radius = this.sphereCollider.radius;
            tmpv3.set(radius, radius, radius);
            const ws = this.collider.node.worldScale;
            const max_sp = abs(max(max(ws.x, ws.y), ws.z));
            tmpv3.multiplyScalar(max_sp * 2);
            Cocos2AmmoVec3(this.scale, tmpv3);
            this._ammoShape.setLocalScaling(this.scale);

            Cocos2AmmoQuat(this.localQuaternion, this.collider.node.worldRotation);
            this.localTransform.setRotation(this.localQuaternion);

            tmpv3.set(max_sp, max_sp, max_sp);
            Vec3.multiply(tmpv3, tmpv3, this.collider.center);
            const lp = tmpv3;
            Vec3.transformQuat(lp, lp, this.collider.node.worldRotation);
            lp.add(this.collider.node.worldPosition);
            Cocos2AmmoVec3(this.localTransform.getOrigin(), lp);

            if (this.collider.isTrigger) {
                AmmoWorld.instance.sharedTriggerCompoundShape.updateChildTransform(this.index, this.localTransform, true);
            } else {
                AmmoWorld.instance.sharedStaticCompoundShape.updateChildTransform(this.index, this.localTransform, true);
            }
        }
    }

    public setRadius (radius: number) {
        tmpv3.set(radius * 2, radius * 2, radius * 2);
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

}

const tmpv3 = new Vec3();

// const pool = {};
// function getAmmoSphere (r: number): Ammo.btSphereShape {
//     const key = r;
//     if (pool[key] == null) {
//         return pool[key];
//     }
//     pool[key] = new Ammo.btSphereShape(r);
//     return pool[key];
// }
