/**
 * @hidden
 */

import { Mat4, Quat, Vec3 } from '../../core/math';
import { intersect } from '../../core/geom-utils';
import { BuiltInWorld } from './builtin-world';
import { BuiltinObject } from './object/builtin-object';
import { BuiltinShape } from './shapes/builtin-shape';
import { Node } from '../../core';
// tslint:disable: prefer-for-of

const m4_0 = new Mat4();
const v3_0 = new Vec3();
const v3_1 = new Vec3();
const quat_0 = new Quat();

/**
 * Built-in static collider, no physical forces involved
 */
export class BuiltinSharedBody extends BuiltinObject {

    get id () {
        return this._id;
    }

    /**
     * add or remove from world \
     * add, if enable \
     * remove, if disable & shapes.length == 0 & wrappedBody disable
     */
    set enabled (v: boolean) {
        if (v) {
            if (this.index < 0) {
                this.index = this.world.bodies.length;
                this.world.addBody(this);
            }
        } else {
            if (this.index >= 0) {
                const isRemove = (this.shapes.length == 0);

                if (isRemove) {
                    this.index = -1;
                    this.world.removeBody(this);
                }
            }
        }
    }

    set reference (v: boolean) {
        v ? this.ref++ : this.ref--;
        if (this.ref == 0) { this.destory(); }
    }

    /** id generator */
    private static idCounter: number = 0;
    private readonly _id: number;
    private index: number = -1;
    private ref: number = 0;

    readonly node: Node;
    readonly world: BuiltInWorld;
    readonly shapes: BuiltinShape[] = [];

    constructor (node: Node, world: BuiltInWorld) {
        super();
        this._id = BuiltinSharedBody.idCounter++;
        this.node = node;
        this.world = world;
        this.world.sharedBodesMap.set(node.uuid, this);
    }

    intersects (body: BuiltinSharedBody) {
        for (let i = 0; i < this.shapes.length; i++) {
            const shapeA = this.shapes[i];

            for (let j = 0; j < body.shapes.length; j++) {
                const shapeB = body.shapes[j];

                // first, Check collision filter masks
                if ((shapeA.collisionFilterGroup & shapeB.collisionFilterMask) === 0 ||
                    (shapeB.collisionFilterGroup & shapeA.collisionFilterMask) === 0) {
                    continue;
                }

                if (intersect.resolve(shapeA.worldShape, shapeB.worldShape)) {
                    this.world.shapeArr.push(shapeA);
                    this.world.shapeArr.push(shapeB);
                }
            }
        }
    }

    addShape (shape: BuiltinShape): void {
        const i = this.shapes.indexOf(shape);
        if (i < 0) {
            this.shapes.push(shape);
        }
    }

    removeShape (shape: BuiltinShape): void {
        const i = this.shapes.indexOf(shape);
        if (i >= 0) {
            this.shapes.splice(i, 1);
        }
    }

    syncSceneToPhysics () {
        if (this.node.hasChangedFlags) {
            this.node.getWorldMatrix(m4_0);
            v3_0.set(this.node.worldPosition);
            quat_0.set(this.node.worldRotation);
            v3_1.set(this.node.worldScale);
            for (let i = 0; i < this.shapes.length; i++) {
                this.shapes[i].transform(m4_0, v3_0, quat_0, v3_1);
            }
        }
    }

    private destory () {
        this.world.delSharedBody(this.node);
        (this.node as any) = null;
        (this.world as any) = null;
        (this.shapes as any) = null;
    }
}
