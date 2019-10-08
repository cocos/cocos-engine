import Ammo from 'ammo.js';
import { BoxShapeBase } from "../../api";
import { AmmoShape } from "./ammo-shape";
import { Vec3 } from "../../../core";
import { AmmoCollisionFlags } from '../ammo-enum';
import { RigidBodyComponent } from '../../components/rigid-body-component';
import { AmmoRigidBody } from '../ammo-body';
import { defaultRigidBodyInfo } from '../ammo-const';
import { AmmoWorld } from '../ammo-world';
import { Cocos2AmmoVec3, Cocos2AmmoQuat } from '../ammo-util';
import { BoxColliderComponent } from '../../../../exports/physics-framework';


export class AmmoBoxShape extends AmmoShape implements BoxShapeBase {

    private _halfExtent: Vec3 = new Vec3();

    public get ammoBox (): Ammo.btBoxShape {
        return this._ammoShape as Ammo.btBoxShape;
    }

    public get boxCollider (): BoxColliderComponent {
        return this.collider as BoxColliderComponent;
    }

    constructor (size: Vec3) {
        super();
    }

    public setScale (scale: Vec3): void {
        super.setScale(scale);
        this._recalcExtents();
    }

    public setSize (size: Vec3) {
        Vec3.multiplyScalar(this._halfExtent, size, 0.5);
        this._recalcExtents();
    }

    private _recalcExtents () {
        const halfExtents = new Vec3();
        Vec3.multiply(halfExtents, this._halfExtent, this._scale);
        this._ammoShape = new Ammo.btBoxShape(new Ammo.btVector3(halfExtents.x, halfExtents.y, halfExtents.z));
    }

    public __preload () {
        super.__preload();
        /** 构造Box */
        const halfExtents = this.boxCollider.size.clone();
        halfExtents.multiplyScalar(0.5);
        this._ammoShape = new Ammo.btBoxShape(new Ammo.btVector3(halfExtents.x, halfExtents.y, halfExtents.z));
        /** 初始化Box形状属性 */

    }

    public onLoad () {
        super.onLoad();
    }

    public start () {
        super.start();
    }

    public onEnable () {
        super.onEnable();

        // if (this.collider.isTrigger) {
        //     const key = this.collider.node.uuid + '1';
        //     let co: Ammo.btCollisionObject;
        //     if (CollisionObjectPool[key]) {
        //         co = CollisionObjectPool[key] as Ammo.btCollisionObject;
        //     } else {
        //         co = CollisionObjectPool[key] = new Ammo.btCollisionObject();
        //         co.setCollisionFlags(AmmoCollisionFlags.CF_NO_CONTACT_RESPONSE);
        //     }
        //     co.setCollisionShape(this.impl);
        // } else {
        //     let rigidBody = this.collider.getComponent(RigidBodyComponent);
        //     if (rigidBody) {
        //         let ammoBody = (rigidBody as any)._impl as AmmoRigidBody;
        //         ammoBody.impl.setCollisionShape(this.impl);
        //     } else {
        //         const key = this.collider.node.uuid + '0';
        //         let co: Ammo.btCollisionObject;
        //         if (CollisionObjectPool[key]) {
        //             co = CollisionObjectPool[key] as Ammo.btCollisionObject;
        //         } else {
        //             co = CollisionObjectPool[key] = new Ammo.btCollisionObject();
        //         }
        //         co.setCollisionShape(this.impl);
        //     }
        // }

        if (this.collider.isTrigger) {
            const key = this.collider.node.uuid + '1';
            let co: Ammo.btRigidBody;
            if (CollisionObjectPool[key]) {
                co = CollisionObjectPool[key] as Ammo.btRigidBody;
            } else {
                co = CollisionObjectPool[key] = new Ammo.btRigidBody(defaultRigidBodyInfo);
                co.setCollisionFlags(AmmoCollisionFlags.CF_NO_CONTACT_RESPONSE);
            }
            co.setCollisionShape(this.impl);

            AmmoWorld.instance.impl.addRigidBody(co);
        } else {
            let rigidBody = this.collider.getComponent(RigidBodyComponent);
            if (rigidBody) {
                // let ammoBody = (rigidBody as any)._impl as AmmoRigidBody;
                // ammoBody.impl.setCollisionShape(this.impl);
            } else {
                const key = this.collider.node.uuid + '0';
                let co: Ammo.btRigidBody;
                if (CollisionObjectPool[key]) {
                    co = CollisionObjectPool[key] as Ammo.btRigidBody;
                } else {
                    /** 单形状 */
                    let wt = new Ammo.btTransform();
                    wt.setIdentity();
                    Cocos2AmmoVec3(wt.getOrigin(), this.collider.node.worldPosition);
                    Cocos2AmmoQuat(wt.getRotation(), this.collider.node.worldRotation);
                    
                    const defaultInertia = new Ammo.btVector3(0, 0, 0);
                    const defaultMotionState = new Ammo.btDefaultMotionState(wt);
                    const defaultRigidBodyInfo = new Ammo.btRigidBodyConstructionInfo(0, defaultMotionState, this.impl, defaultInertia);
                    co = CollisionObjectPool[key] = new Ammo.btRigidBody(defaultRigidBodyInfo);
                }
                AmmoWorld.instance.impl.addRigidBody(co);
            }
        }
    }

    public onDisable () {
        super.onDisable();
    }

}

var CollisionObjectPool = {};
