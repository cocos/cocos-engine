import { Quat, Vec3 } from '../../../core';
import { Node } from '../../../scene-graph';
import { intersect } from '../../geom-utils';
import { ICollisionCallback, ICollisionEvent, PhysicsWorldBase, RigidBodyBase, ShapeBase } from '../api';
import { ERigidBodyType } from '../physic-enum';
import { BuiltInShape } from './built-in-shape';
import { BuiltInWorld } from './built-in-world';

/**
 * Built-in static collider, no physical forces involved
 */
export class BuiltInBody implements RigidBodyBase {
    get collisionFilterGroup () { return this._collisionFilterGroup; }
    set collisionFilterGroup (v: number) { this._collisionFilterGroup = v; }
    get collisionFilterMask () { return this._collisionFilterMask; }
    set collisionFilterMask (v: number) { this._collisionFilterMask = v; }

    /** 刚体类型 */
    private type: ERigidBodyType = ERigidBodyType.DYNAMIC;
    /** 属于的组 */
    private _collisionFilterGroup: number = 1;
    /** 检测的组 */
    private _collisionFilterMask: number = 1;
    /** 碰撞回调 */
    private _collisionCallbacks: ICollisionCallback[] = [];
    /** 物理世界 */
    private _world!: BuiltInWorld | null;
    /** Body拥有的现状 */
    private _shapes: BuiltInShape[] = [];
    /** Body对应的场景对象 */
    private userData: any;

    constructor (options) { }

    public intersects (body: BuiltInBody) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this._shapes.length; i++) {
            const shapeA = this._shapes[i];
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < body._shapes.length; j++) {
                const shapeB = body._shapes[j];
                if (intersect.resolve(shapeA.shape, shapeB.shape)) {
                    const event: ICollisionEvent = {
                        source: this,
                        target: body,
                    };
                    for (const callback of this._collisionCallbacks) {
                        callback(event);
                    }
                    for (const callback of body._collisionCallbacks) {
                        callback(event);
                    }
                }
            }
        }
    }
    public getType (): ERigidBodyType {
        return this.type;
    }
    public setType (v: ERigidBodyType): void {
        this.type = v;
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
        this._collisionCallbacks.push(callback);
    }
    public removeCollisionCllback (callback: ICollisionCallback): void {
        const i = this._collisionCallbacks.indexOf(callback);
        if (i >= 0) {
            this._collisionCallbacks.splice(i, 1);
        }
    }
    public getUserData () {
        return this.userData;
    }
    public setUserData (data: any): void {
        this.userData = data;
    }

}
