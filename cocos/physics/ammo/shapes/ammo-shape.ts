import { ShapeBase } from "../../api";
import { Vec3, Quat } from "../../../core/math";
import { AmmoRigidBody } from "../ammo-body";
import { ColliderComponent, RigidBodyComponent } from "../../../../exports/physics-framework";

export class AmmoShape implements ShapeBase {

    collider!: ColliderComponent;
    rigidbody!: RigidBodyComponent;

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

    public get impl () {
        return this._ammoShape!;
    }

    get transform () {
        return this._transform;
    }

    protected _scale: Vec3 = new Vec3(1, 1, 1);

    protected _ammoShape: Ammo.btCollisionShape | null = null;

    protected _body: AmmoRigidBody | null = null;

    private _transform: Ammo.btTransform;

    private _index: number = -1;

    private _center: Vec3 = new Vec3(0, 0, 0);

    private _userData: any;

    public constructor () {
        this._transform = new Ammo.btTransform();
        this._transform.setIdentity();
    }

    public getUserData (): any {
        return this._userData;
    }

    public setUserData (data: any): void {
        this._userData = data;
    }

    public _setBody (body: AmmoRigidBody | null) {
        this._body = body;
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
        if (!this._body) {
            return;
        }
        // TO DO
    }
}
