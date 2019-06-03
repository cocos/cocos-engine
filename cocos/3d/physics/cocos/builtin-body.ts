import { Quat, Vec3 } from '../../../core/value-types';
import { clamp, mat4, quat, vec3 } from '../../../core/vmath';
import { intersect } from '../../geom-utils';
import { BuiltInRigidBodyBase, ICollisionCallback, ICollisionEvent, ICollisionEventType, PhysicsWorldBase } from '../api';
import { ERigidBodyType } from '../physic-enum';
import { BuiltInWorld } from './builtin-world';
import { BuiltInShape } from './shapes/builtin-shape';

/**
 * Built-in static collider, no physical forces involved
 */
export class BuiltInBody implements BuiltInRigidBodyBase {
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
                if (intersect.resolve(shapeA.worldShape, shapeB.worldShape)) {
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
    public setCollisionFilter (group: number, mask: number): void {

    }
    public setWorld (world: PhysicsWorldBase | null): void {

        const cworld = world as unknown as (BuiltInWorld | null);
        if (cworld) {
            cworld.addBody(this);
        } else {
            if (this._world != null) {
                this._world.removeBody(this);
            }
        }

        this._world = cworld;
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

    public transform (m: mat4, pos: vec3, rot: quat, scale: vec3) {
        for (let i = this._shapes.length; i--;) {
            this._shapes[i].transform(m, pos, rot, scale);
        }
    }

    public translateAndRotate (m: mat4, rot: quat): void {
        for (let i = this._shapes.length; i--;) {
            this._shapes[i].translateAndRotate(m, rot);
        }
    }
}
