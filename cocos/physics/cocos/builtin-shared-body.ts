/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { Mat4, Quat, Vec3, js, geometry } from '../../core';
import { BuiltInWorld } from './builtin-world';
import { BuiltinObject } from './object/builtin-object';
import { BuiltinShape } from './shapes/builtin-shape';
import { Node } from '../../scene-graph';
import { BuiltinRigidBody } from './builtin-rigid-body';
import { PhysicsSystem } from '../framework';
import { PhysicsGroup } from '../framework/physics-enum';

const m4_0 = new Mat4();
const v3_0 = new Vec3();
const v3_1 = new Vec3();
const quat_0 = new Quat();

/**
 * Built-in static collider, no physical forces involved
 */
export class BuiltinSharedBody extends BuiltinObject {
    private static readonly sharedBodesMap = new Map<string, BuiltinSharedBody>();

    static getSharedBody (node: Node, wrappedWorld: BuiltInWorld, wrappedBody?: BuiltinRigidBody): BuiltinSharedBody {
        const key = node.uuid;
        let newSB: BuiltinSharedBody;
        if (BuiltinSharedBody.sharedBodesMap.has(key)) {
            newSB = BuiltinSharedBody.sharedBodesMap.get(key)!;
        } else {
            newSB = new BuiltinSharedBody(node, wrappedWorld);
            const g = PhysicsGroup.DEFAULT;
            const m = PhysicsSystem.instance.collisionMatrix[g];
            newSB.collisionFilterGroup = g;
            newSB.collisionFilterMask = m;
            BuiltinSharedBody.sharedBodesMap.set(node.uuid, newSB);
        }
        if (wrappedBody) {
            newSB.wrappedBody = wrappedBody;
            const g = wrappedBody.rigidBody.group;
            const m = PhysicsSystem.instance.collisionMatrix[g];
            newSB.collisionFilterGroup = g;
            newSB.collisionFilterMask = m;
        }
        return newSB;
    }

    get id (): number {
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
        } else if (this.index >= 0) {
            const isRemove = (this.shapes.length === 0);

            if (isRemove) {
                this.index = -1;
                this.world.removeSharedBody(this);
            }
        }
    }

    set reference (v: boolean) {
        // eslint-disable-next-line no-unused-expressions
        v ? this.ref++ : this.ref--;
        if (this.ref === 0) { this.destroy(); }
    }

    /** id generator */
    private static idCounter = 0;
    private readonly _id: number;
    private index = -1;
    private ref = 0;

    readonly node: Node;
    readonly world: BuiltInWorld;
    readonly shapes: BuiltinShape[] = [];
    wrappedBody: BuiltinRigidBody | null = null;

    private constructor (node: Node, world: BuiltInWorld) {
        super();
        this._id = BuiltinSharedBody.idCounter++;
        this.node = node;
        this.world = world;
    }

    intersects (body: BuiltinSharedBody): void {
        for (let i = 0; i < this.shapes.length; i++) {
            const shapeA = this.shapes[i];
            for (let j = 0; j < body.shapes.length; j++) {
                const shapeB = body.shapes[j];
                if (shapeA.collider.needTriggerEvent || shapeB.collider.needTriggerEvent) {
                    if (geometry.intersect.resolve(shapeA.worldShape, shapeB.worldShape)) {
                        this.world.shapeArr.push(shapeA);
                        this.world.shapeArr.push(shapeB);
                    }
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
            js.array.fastRemoveAt(this.shapes, i);
        }
    }

    syncSceneToPhysics (): void {
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

    syncInitial (): void {
        this.node.getWorldMatrix(m4_0);
        v3_0.set(this.node.worldPosition);
        quat_0.set(this.node.worldRotation);
        v3_1.set(this.node.worldScale);
        for (let i = 0; i < this.shapes.length; i++) {
            this.shapes[i].transform(m4_0, v3_0, quat_0, v3_1);
        }
    }

    private destroy (): void {
        BuiltinSharedBody.sharedBodesMap.delete(this.node.uuid);
        (this.node as any) = null;
        (this.world as any) = null;
        (this.shapes as any) = null;
    }
}
