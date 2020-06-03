/**
 * @hidden
 */

import { Mat4, Quat, Vec3 } from '../../core/math';
import { intersect } from '../../core/geometry';
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

    private static readonly sharedBodesMap = new Map<string, BuiltinSharedBody>();

    static getSharedBody (node: Node, wrappedWorld: BuiltInWorld) {
        const key = node.uuid;
        if (BuiltinSharedBody.sharedBodesMap.has(key)) {
            return BuiltinSharedBody.sharedBodesMap.get(key)!;
        } else {
            const newSB = new BuiltinSharedBody(node, wrappedWorld);
            BuiltinSharedBody.sharedBodesMap.set(node.uuid, newSB);
            return newSB;
        }
    }

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
                this.world.addSharedBody(this);
                this.syncInitial();
            }
        } else {
            if (this.index >= 0) {
                const isRemove = (this.shapes.length == 0);

                if (isRemove) {
                    this.index = -1;
                    this.world.removeSharedBody(this);
                }
            }
        }
    }

    set reference (v: boolean) {
        v ? this.ref++ : this.ref--;
        if (this.ref == 0) { this.destroy(); }
    }

    /** id generator */
    private static idCounter: number = 0;
    private readonly _id: number;
    private index: number = -1;
    private ref: number = 0;

    readonly node: Node;
    readonly world: BuiltInWorld;
    readonly shapes: BuiltinShape[] = [];

    private constructor (node: Node, world: BuiltInWorld) {
        super();
        this._id = BuiltinSharedBody.idCounter++;
        this.node = node;
        this.world = world;
    }

    intersects (body: BuiltinSharedBody) {
        for (let i = 0; i < this.shapes.length; i++) {
            const shapeA = this.shapes[i];
            for (let j = 0; j < body.shapes.length; j++) {
                const shapeB = body.shapes[j];
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

    syncInitial () {
        this.node.getWorldMatrix(m4_0);
        v3_0.set(this.node.worldPosition);
        quat_0.set(this.node.worldRotation);
        v3_1.set(this.node.worldScale);
        for (let i = 0; i < this.shapes.length; i++) {
            this.shapes[i].transform(m4_0, v3_0, quat_0, v3_1);
        }
    }

    private destroy () {
        BuiltinSharedBody.sharedBodesMap.delete(this.node.uuid);
        (this.node as any) = null;
        (this.world as any) = null;
        (this.shapes as any) = null;
    }
}
