/**
 * @hidden
 */

import { Mat4, Quat, Vec3 } from '../../../core/value-types';
import { intersect } from '../../geom-utils';
import { BuiltInRigidBodyBase, PhysicsWorldBase } from '../api';
import { ERigidBodyType } from '../physic-enum';
import { BuiltInWorld } from './builtin-world';
import { BuiltinObject } from './object/builtin-object';
import { BuiltinShape } from './shapes/builtin-shape';
// tslint:disable: prefer-for-of

/**
 * Built-in static collider, no physical forces involved
 */
export class BuiltInBody extends BuiltinObject implements BuiltInRigidBodyBase {

    /** id generator */
    private static idCounter: number = 0;

    private readonly _id: number;

    /** id unique */
    public get id () { return this._id; }

    private _type: ERigidBodyType = ERigidBodyType.DYNAMIC;

    private _world!: BuiltInWorld;

    private _shapes: BuiltinShape[] = [];

    private userData: any;

    constructor (options) {
        super();
        this._id = BuiltInBody.idCounter++;
    }

    public intersects (body: BuiltInBody) {
        for (let i = 0; i < this._shapes.length; i++) {
            const shapeA = this._shapes[i];

            for (let j = 0; j < body._shapes.length; j++) {
                const shapeB = body._shapes[j];

                // first, Check collision filter masks
                if ((shapeA.collisionFilterGroup & shapeB.collisionFilterMask) === 0 ||
                    (shapeB.collisionFilterGroup & shapeA.collisionFilterMask) === 0) {
                    continue;
                }

                if (intersect.resolve(shapeA.worldShape, shapeB.worldShape)) {
                    this._world.shapeArr.push(shapeA);
                    this._world.shapeArr.push(shapeB);
                }
            }
        }
    }

    public addShape (shape: BuiltinShape): void {
        this._shapes.push(shape);
        shape.body = this;
    }

    public removeShape (shape: BuiltinShape): void {
        const i = this._shapes.indexOf(shape);
        if (i >= 0) {
            this._shapes.splice(i, 1);
        }
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

        this._world = cworld as any;
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

    public getUserData () {
        return this.userData;
    }

    public setUserData (data: any): void {
        this.userData = data;
    }

    public transform (m: Mat4, pos: Vec3, rot: Quat, scale: Vec3) {
        for (let i = this._shapes.length; i--;) {
            this._shapes[i].transform(m, pos, rot, scale);
        }
    }

    public translateAndRotate (m: Mat4, rot: Quat): void {
        for (let i = this._shapes.length; i--;) {
            this._shapes[i].translateAndRotate(m, rot);
        }
    }
}
