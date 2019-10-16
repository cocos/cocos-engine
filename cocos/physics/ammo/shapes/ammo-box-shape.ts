import Ammo from 'ammo.js';
import { BoxShapeBase } from "../../api";
import { AmmoShape } from "./ammo-shape";
import { Vec3, Node } from "../../../core";
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

    }

    public onDisable () {
        super.onDisable();
    }

    public UP (n: Node) {
        super.UP(n);
        
    }

}
