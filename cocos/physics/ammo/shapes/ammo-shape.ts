import Ammo from 'ammo.js';
import { ShapeBase } from "../../api";
import { Vec3, Quat } from "../../../core/math";
import { AmmoRigidBody } from "../ammo-body";
import { ColliderComponent, RigidBodyComponent } from "../../../../exports/physics-framework";
import { AmmoWorld } from '../ammo-world';
import { AmmoCollisionFlags } from '../ammo-enum';
import { defaultRigidBodyInfo } from '../ammo-const';
import { Cocos2AmmoVec3, Cocos2AmmoQuat } from '../ammo-util';
import { TransformDirtyBit } from '../../../core/scene-graph/node-enum';

export class AmmoShape implements ShapeBase {

    material?: import("../../api").PhysicMaterialBase;
    getCollisionResponse (): boolean {
        throw new Error("Method not implemented.");
    }
    setCollisionResponse (value: boolean): void {
        throw new Error("Method not implemented.");
    }
    addTriggerCallback (callback: import("../../api").ITriggerCallback): void {
        throw new Error("Method not implemented.");
    }
    removeTriggerCallback (callback: import("../../api").ITriggerCallback): void {
        throw new Error("Method not implemented.");
    }

    protected _scale: Vec3 = new Vec3(1, 1, 1);


    private _center: Vec3 = new Vec3(0, 0, 0);

    private _userData: any;


    public getUserData (): any {
        return this._userData;
    }

    public setUserData (data: any): void {
        this._userData = data;
    }

    public setCenter (center: Vec3): void {
        Vec3.copy(this._center, center);
        this._recalcCenter();
    }

    public setScale (scale: Vec3): void {
        Vec3.copy(this._scale, scale);
        this._recalcCenter();
    }

    public setRotation (rotation: Quat): void {
        // TO DO
    }

    private _recalcCenter () {
        if (!this._ammoBody) {
            return;
        }
        // TO DO
    }

    public get impl () {
        return this._ammoShape!;
    }

    protected _ammoShape!: Ammo.btCollisionShape;
    protected _ammoBody!: Ammo.btCollisionObject;
    public readonly localTransform: Ammo.btTransform;
    public readonly localPosition: Ammo.btVector3;
    public readonly localQuaternion: Ammo.btQuaternion;
    public readonly scale: Ammo.btVector3;

    public collider!: ColliderComponent;
    public attachRigidBody: RigidBodyComponent | null = null;

    private _index: number = -1;

    public constructor () {
        this.localPosition = new Ammo.btVector3(0, 0, 0);
        this.localQuaternion = new Ammo.btQuaternion();
        this.localTransform = new Ammo.btTransform(this.localQuaternion, this.localPosition);
        this.localTransform.setIdentity();

        this.scale = new Ammo.btVector3(1, 1, 1);
    }

    public __preload () {

    }

    public onLoad () {

    }

    public start () {

    }

    public onEnable () {
        if (this.collider.isTrigger) {
            /** scale \ translation \ rotation */
            this.localTransform.setIdentity();

            const pos = this.collider.center.clone();
            Vec3.transformQuat(pos, pos, this.collider.node.worldRotation);
            pos.multiply(this.collider.node.worldScale);
            Cocos2AmmoVec3(this.localTransform.getOrigin(), pos);

            Cocos2AmmoQuat(this.localQuaternion, this.collider.node.worldRotation);
            this.localTransform.setRotation(this.localQuaternion);

            Cocos2AmmoVec3(this.scale, this.collider.node.worldScale);
            this._ammoShape.setLocalScaling(this.scale);

            AmmoWorld.instance.sharedTriggerCompoundShape.addChildShape(this.localTransform, this._ammoShape);
            this._index = AmmoWorld.instance.sharedTriggerCompoundShape.getNumChildShapes() - 1;

            /** TODO: 将形状记录下来，并及时更新 transform */
            AmmoWorld.instance.triggerShapes.push(this);
        } else {
            this.attachRigidBody = this.collider.getComponent(RigidBodyComponent);
            if (this.attachRigidBody == null) {
                /** scale \ translation \ rotation */
                this.localTransform.setIdentity();

                const pos = this.collider.center.clone();
                Vec3.transformQuat(pos, pos, this.collider.node.worldRotation);
                pos.multiply(this.collider.node.worldScale);
                Cocos2AmmoVec3(this.localTransform.getOrigin(), pos);

                Cocos2AmmoQuat(this.localQuaternion, this.collider.node.worldRotation);
                this.localTransform.setRotation(this.localQuaternion);

                Cocos2AmmoVec3(this.scale, this.collider.node.worldScale);
                this._ammoShape.setLocalScaling(this.scale);

                AmmoWorld.instance.sharedStaticCompoundShape.addChildShape(this.localTransform, this._ammoShape);
                this._index = AmmoWorld.instance.sharedStaticCompoundShape.getNumChildShapes() - 1;

                /** TODO: 将形状记录下来，并及时更新 transform */
                AmmoWorld.instance.staticShapes.push(this);
            } else {
                // /** TODO：更新 local transform （实际上为 scale 、 offset) */
                // const lt = this.localTransform;
                // Cocos2AmmoVec3(lt.getOrigin(), this.collider.center);
                // Cocos2AmmoVec3(this._ammoShape.getLocalScaling(), this.collider.node.worldScale);
                // /** TODO：将形状加入到 rigid body 中 */
                // const ammoBody = this._attachRigidBody._impl as AmmoRigidBody;
                // ammoBody.ammoCompoundShape.addChildShape(this.localTransform, this._ammoShape);
                // this._index = ammoBody.ammoCompoundShape.getNumChildShapes() - 1;                
            }
        }
    }

    public onDisable () {
        if (this._index >= 0) {
            if (this.collider.isTrigger) {
                AmmoWorld.instance.sharedTriggerCompoundShape.removeChildShapeByIndex(this._index)
                AmmoWorld.instance.triggerShapes.splice(this._index, 1);
                this._index = -1;
            } else {
                if (this.attachRigidBody == null) {
                    AmmoWorld.instance.sharedStaticCompoundShape.removeChildShapeByIndex(this._index)
                    AmmoWorld.instance.staticShapes.splice(this._index, 1);
                    this._index = -1;
                } else {
                    // /** TODO：将形状从 rigid body 中移除 */
                    // const ammoBody = this._attachRigidBody._impl as AmmoRigidBody;
                    // ammoBody.ammoCompoundShape.removeChildShapeByIndex(this._index);
                    // this._index = -1;
                }
            }
        }
    }

    public beforeStep () {

        let dirty = false;
        // /** scale */
        // if (this.collider.node.hasChangedFlags & TransformDirtyBit.SCALE) {
        //     Cocos2AmmoVec3(this._ammoShape.getLocalScaling(), this.collider.node.worldScale);
        //     dirty = true;
        // }

        // /** rotation */
        // if (this.collider.node.hasChangedFlags & TransformDirtyBit.ROTATION) {
        //     Cocos2AmmoQuat(this.localQuaternion, this.collider.node.worldRotation);
        //     this.localTransform.setRotation(this.localQuaternion);
        //     dirty = true;
        // }

        // /** position */
        // if (this.collider.node.hasChangedFlags & TransformDirtyBit.POSITION) {
        //     const origin = this.localTransform.getOrigin();
        //     origin.setValue(
        //         this.collider.center.x + this.collider.node.worldPosition.x,
        //         this.collider.center.y + this.collider.node.worldPosition.y,
        //         this.collider.center.z + this.collider.node.worldPosition.z
        //     );
        //     dirty = true;
        // }

        if (this.collider.node.hasChangedFlags) {
            dirty = true;

            Cocos2AmmoVec3(this.scale, this.collider.node.worldScale);
            this._ammoShape.setLocalScaling(this.scale);

            Cocos2AmmoQuat(this.localQuaternion, this.collider.node.worldRotation);
            this.localTransform.setRotation(this.localQuaternion);

            const pos = this.collider.center.clone();
            pos.multiply(this.collider.node.worldScale);
            Vec3.transformQuat(pos, pos, this.collider.node.worldRotation);
            pos.add(this.collider.node.worldPosition);
            Cocos2AmmoVec3(this.localTransform.getOrigin(), pos);
        }

        if (dirty) {
            if (this.collider.isTrigger) {
                AmmoWorld.instance.sharedTriggerCompoundShape.updateChildTransform(this._index, this.localTransform, true);
            } else {
                AmmoWorld.instance.sharedStaticCompoundShape.updateChildTransform(this._index, this.localTransform, true);
            }
        }
    }

}
