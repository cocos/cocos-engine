import Ammo from 'ammo.js';
import { BoxShapeBase } from "../../api";
import { AmmoShape } from "./ammo-shape";
import { Vec3 } from "../../../core";
import { AmmoTyping, AmmoCollisionFlags } from '../ammo-typing';
import { RigidBodyComponent } from '../../components/rigid-body-component';
import { AmmoRigidBody } from '../ammo-body';


export class AmmoBoxShape extends AmmoShape implements BoxShapeBase {

    private _halfExtent: Vec3 = new Vec3();

    public get ammoBox (): Ammo.btBoxShape {
        return this._ammoShape as Ammo.btBoxShape;
    }

    constructor (size: Vec3) {
        super();
        Vec3.multiplyScalar(this._halfExtent, size, 0.5);
        const halfExtents = this._halfExtent;
        this._ammoShape = new Ammo.btBoxShape(new Ammo.btVector3(halfExtents.x, halfExtents.y, halfExtents.z));
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
    }

    public onLoad () {
        super.onLoad();
    }

    public start () {
        super.start();
    }

    public onEnable () {
        super.onEnable();

        if (this.collider.isTrigger) {
            const key = this.collider.node.uuid + '1';
            let co: Ammo.btCollisionObject;
            if (CollisionObjectPool[key]) {
                co = CollisionObjectPool[key] as Ammo.btCollisionObject;
            } else {
                co = CollisionObjectPool[key] = new Ammo.btCollisionObject();
                co.setCollisionFlags(AmmoCollisionFlags.CF_NO_CONTACT_RESPONSE);
            }
            co.setCollisionShape(this.impl);
        } else {
            let rigidBody = this.collider.getComponent(RigidBodyComponent);
            if (rigidBody) {
                let ammoBody = (rigidBody as any)._impl as AmmoRigidBody;
                ammoBody.impl.setCollisionShape(this.impl);
            } else {
                const key = this.collider.node.uuid + '0';
                let co: Ammo.btCollisionObject;
                if (CollisionObjectPool[key]) {
                    co = CollisionObjectPool[key] as Ammo.btCollisionObject;
                } else {
                    co = CollisionObjectPool[key] = new Ammo.btCollisionObject();
                }
                co.setCollisionShape(this.impl);
            }
        }
    }

    public onDisable () {
        super.onDisable();
    }

}

var CollisionObjectPool = {};
