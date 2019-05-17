import { Quat, Vec3 } from '../../../core/value-types';
import { clamp } from '../../../core/vmath';
import { intersect } from '../../geom-utils';
import { ICollisionCallback, ICollisionEvent, ICollisionType as ICollisionEventType, PhysicsWorldBase, RigidBodyBase } from '../api';
import { ERigidBodyType } from '../physic-enum';
import { BuiltInShape } from './built-in-shape';
import { BuiltInWorld } from './built-in-world';

/**
 * Built-in static collider, no physical forces involved
 */
export class BuiltInBody implements RigidBodyBase {
    /** id unique */
    public get id () { return this._id; }

    public get collisionFilterGroup () { return this._collisionFilterGroup; }

    public get collisionFilterMask () { return this._collisionFilterMask; }
    /** id generator */
    private static idCounter: number = 0;
    private readonly _id: number;

    private _type: ERigidBodyType = ERigidBodyType.DYNAMIC;

    private _group: number = 0;
    private _collisionFilterGroup: number = 1 << 0;
    private _collisionFilterMask: number = 1 << 0;

    private _collisionCB: ICollisionCallback[] = [];

    // private _collisionEnterCB: ICollisionCallback[] = [];
    // private _collisionStayCB: ICollisionCallback[] = [];
    // private _collisionExitCB: ICollisionCallback[] = [];

    /** 物理世界 */
    private _world!: BuiltInWorld | null;
    /** Body拥有的现状 */
    private _shapes: BuiltInShape[] = [];
    /** Body对应的场景对象 */
    private userData: any;

    constructor (options) {
        this._id = BuiltInBody.idCounter++;
    }
    public getGroup (): number {
        return this._group;
    }
    public setGroup (v: number): void {
        this._group = clamp(Math.floor(v), 0, 31);
        this._collisionFilterGroup = 1 << v;
    }
    public getMask (): number {
        return this._collisionFilterMask;
    }
    public setMask (v: number): void {
        v = clamp(Math.floor(v), 0, 31);
        this._collisionFilterMask = 1 << v;
    }
    public addMask (v: number): void {
        v = clamp(Math.floor(v), 0, 31);
        this._collisionFilterMask += 1 << v;
    }

    public removeMask (v: number): void {
        v = clamp(Math.floor(v), 0, 31);
        this._collisionFilterMask -= 1 << v;
    }

    public intersects (body: BuiltInBody): boolean {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this._shapes.length; i++) {
            const shapeA = this._shapes[i];
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < body._shapes.length; j++) {
                const shapeB = body._shapes[j];
                if (intersect.resolve(shapeA.shape, shapeB.shape)) {
                    return true;
                }
            }
        }
        return false;
    }
    public onCollision (type: ICollisionEventType, event: ICollisionEvent) {
        for (const callback of this._collisionCB) {
            callback(type, event);
        }
    }
    public onTrigger (type: ICollisionEventType, event: ICollisionEvent) {
        for (const callback of this._collisionCB) {
            callback(type, event);
        }
    }
    public getType (): ERigidBodyType {
        return this._type;
    }
    public setType (v: ERigidBodyType): void {
        this._type = v;
    }
    public wakeUp (): void {

    }
    public sleep (): void {

    }
    public addShape (shape: BuiltInShape): void {
        this._shapes.push(shape);
    }
    public removeShape (shape: BuiltInShape): void {
        const i = this._shapes.indexOf(shape);
        if (i >= 0) {
            this._shapes.splice(i, 1);
        }
    }
    public getMass (): number {
        return 0;
    }
    public setMass (value: number): void {

    }
    public applyForce (force: Vec3, position?: Vec3 | undefined): void {

    }
    public applyImpulse (impulse: Vec3, position?: Vec3 | undefined): void {

    }
    public getIsKinematic (): boolean {
        return true;
    }
    public setIsKinematic (value: boolean): void {

    }
    public getLinearDamping (): number {
        return 0;
    }
    public setLinearDamping (value: number): void {

    }
    public getAngularDamping (): number {
        return 0;
    }
    public setAngularDamping (value: number): void {

    }
    public getUseGravity (): boolean {
        return false;
    }
    public setUseGravity (value: boolean): void {

    }
    public getIsTrigger (): boolean {
        return false;
    }
    public setIsTrigger (value: boolean): void {

    }
    public getVelocity (): Vec3 {
        return new Vec3();
    }
    public setVelocity (value: Vec3): void {

    }
    public getFreezeRotation (): boolean {
        return false;
    }
    public setFreezeRotation (value: boolean): void {

    }
    public setCollisionFilter (group: number, mask: number): void {

    }
    public setWorld (world: PhysicsWorldBase | null): void {
        if (this._world) {
            this._world = null;
        }

        const cworld = world as unknown as (BuiltInWorld | null);
        if (cworld) {
            cworld.addBody(this);
        }
        this._world = cworld;
    }
    public commitShapeUpdates (): void {

    }
    public isPhysicsManagedTransform (): boolean {
        return false;
    }
    public getPosition (out: Vec3): void {

    }
    public setPosition (pos: Vec3): void {
        /** 更新所有形状的位置 */
        for (const shape of this._shapes) {
            shape.setPosition(pos);
        }
    }
    public getRotation (out: Quat): void {

    }
    public setRotation (rot: Quat): void {
        /** 更新所有形状的方向 */
        for (const shape of this._shapes) {
            shape.setRotation(rot);
        }
    }
    public scaleAllShapes (scale: Vec3): void {
        for (const shape of this._shapes) {
            shape.setScale(scale);
        }
    }
    public addCollisionCallback (callback: ICollisionCallback): void {
        this._collisionCB.push(callback);
    }
    public removeCollisionCllback (callback: ICollisionCallback): void {
        const i = this._collisionCB.indexOf(callback);
        if (i >= 0) {
            this._collisionCB.splice(i, 1);
        }
    }
    public getUserData () {
        return this.userData;
    }
    public setUserData (data: any): void {
        this.userData = data;
    }

}
