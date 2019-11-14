/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { Vec3 } from '../../../value-types';
import { PhysicsRayResult } from '../framework/physics-ray-result';
import { BuiltinSharedBody } from './builtin-shared-body';
import { BuiltinShape } from './shapes/builtin-shape';
import { ArrayCollisionMatrix } from './utils/array-collision-matrix';
import { Ray, intersect } from '../../../geom-utils';
import { RecyclePool } from '../../../../renderer/memop';
import { IPhysicsWorld, IRaycastOptions } from '../spec/i-physics-world';
import { IVec3Like } from '../../../value-types/type-define';
import { TriggerEventType } from '../framework/physics-interface';
import { ColliderComponent } from '../exports/physics-framework';

const hitPoint = new Vec3();
const TriggerEventObject = {
    type: 'onTriggerEnter' as unknown as TriggerEventType,
    selfCollider: null as unknown as ColliderComponent,
    otherCollider: null as unknown as ColliderComponent,
};

/**
 * Built-in collision system, intended for use as a
 * efficient discrete collision detector,
 * not a full physical simulator
 */
export class BuiltInWorld implements IPhysicsWorld {
    set gravity (v: IVec3Like) { }
    set allowSleep (v: boolean) { }

    readonly shapeArr: BuiltinShape[] = [];
    readonly bodies: BuiltinSharedBody[] = [];

    private _shapeArrOld: BuiltinShape[] = [];
    private _collisionMatrix: ArrayCollisionMatrix = new ArrayCollisionMatrix();
    private _collisionMatrixPrev: ArrayCollisionMatrix = new ArrayCollisionMatrix();

    step (deltaTime: number): void {

        // store and reset collsion array
        this._shapeArrOld = this.shapeArr.slice();
        this.shapeArr.length = 0;

        // sync scene to physics
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].syncSceneToPhysics();
        }

        // collision detection
        for (let i = 0; i < this.bodies.length; i++) {
            const bodyA = this.bodies[i];
            for (let j = i + 1; j < this.bodies.length; j++) {
                const bodyB = this.bodies[j];

                // first, Check collision filter masks
                if ((bodyA.collisionFilterGroup & bodyB.collisionFilterMask) === 0 ||
                    (bodyB.collisionFilterGroup & bodyA.collisionFilterMask) === 0) {
                    continue;
                }
                bodyA.intersects(bodyB);
            }
        }

        // emit trigger event
        this.emitTriggerEvent();
    }

    raycastClosest (worldRay: Ray, options: IRaycastOptions, out: PhysicsRayResult): boolean {
        let tmp_d = Infinity;
        const max_d = options.maxDistance!;
        const mask = options.mask!;
        for (let i = 0; i < this.bodies.length; i++) {
            const body = this.bodies[i] as BuiltinSharedBody;
            for (let i = 0; i < body.shapes.length; i++) {
                const shape = body.shapes[i];
                // const collider = shape.collider;
                // if (!(collider.node.layer & mask)) {
                //     continue;
                // }
                const distance = intersect.resolve(worldRay, shape.worldShape);
                if (distance == 0 || distance > max_d) {
                    continue;
                }
                if (tmp_d > distance) {
                    tmp_d = distance;
                    Vec3.normalize(hitPoint, worldRay.d)
                    Vec3.scaleAndAdd(hitPoint, worldRay.o, hitPoint, distance);
                    out._assign(hitPoint, distance, shape.collider);
                }
            }
        }

        return !(tmp_d == Infinity);
    }

    raycast (worldRay: Ray, options: IRaycastOptions, pool: RecyclePool, results: PhysicsRayResult[]): boolean {
        const max_d = options.maxDistance!;
        const mask = options.mask!;
        for (let i = 0; i < this.bodies.length; i++) {
            const body = this.bodies[i] as BuiltinSharedBody;
            for (let i = 0; i < body.shapes.length; i++) {
                const shape = body.shapes[i];
                // const collider = shape.collider;
                // if (!(collider.node.layer & mask)) {
                //     continue;
                // }
                const distance = intersect.resolve(worldRay, shape.worldShape);
                if (distance == 0 || distance > max_d) {
                    continue;
                } else {
                    const r = pool.add();
                    worldRay.computeHit(hitPoint, distance);
                    r._assign(hitPoint, distance, shape.collider);
                    results.push(r);
                }
            }
        }
        return results.length > 0;
    }

    getSharedBody (node: any): BuiltinSharedBody {
        return BuiltinSharedBody.getSharedBody(node, this);
    }

    addSharedBody (body: BuiltinSharedBody) {
        const index = this.bodies.indexOf(body);
        if (index < 0) {
            this.bodies.push(body);
        }
    }

    removeSharedBody (body: BuiltinSharedBody) {
        const index = this.bodies.indexOf(body);
        if (index >= 0) {
            this.bodies.splice(index, 1);
        }
    }

    private emitTriggerEvent () {
        let shapeA: BuiltinShape;
        let shapeB: BuiltinShape;
        for (let i = 0; i < this.shapeArr.length; i += 2) {
            shapeA = this.shapeArr[i];
            shapeB = this.shapeArr[i + 1];

            TriggerEventObject.selfCollider = shapeA.collider;
            TriggerEventObject.otherCollider = shapeB.collider;

            this._collisionMatrix.set(shapeA.id, shapeB.id, true);

            if (this._collisionMatrixPrev.get(shapeA.id, shapeB.id)) {
                // emit stay
                TriggerEventObject.type = 'onTriggerStay';
            } else {
                // first trigger, emit enter
                TriggerEventObject.type = 'onTriggerEnter';
            }

            if (shapeA.collider) {
                shapeA.collider.emit(TriggerEventObject.type, TriggerEventObject);
            }

            TriggerEventObject.selfCollider = shapeB.collider;
            TriggerEventObject.otherCollider = shapeA.collider;

            if (shapeB.collider) {
                shapeB.collider.emit(TriggerEventObject.type, TriggerEventObject);
            }
        }

        for (let i = 0; i < this._shapeArrOld.length; i += 2) {
            shapeA = this._shapeArrOld[i];
            shapeB = this._shapeArrOld[i + 1];

            if (this._collisionMatrixPrev.get(shapeA.id, shapeB.id)) {
                if (!this._collisionMatrix.get(shapeA.id, shapeB.id)) {
                    // emit exit
                    TriggerEventObject.type = 'onTriggerExit';
                    TriggerEventObject.selfCollider = shapeA.collider;
                    TriggerEventObject.otherCollider = shapeB.collider;

                    if (shapeA.collider) {
                        shapeA.collider.emit(TriggerEventObject.type, TriggerEventObject);
                    }

                    TriggerEventObject.selfCollider = shapeB.collider;
                    TriggerEventObject.otherCollider = shapeA.collider;

                    if (shapeB.collider) {
                        shapeB.collider.emit(TriggerEventObject.type, TriggerEventObject);
                    }

                    this._collisionMatrix.set(shapeA.id, shapeB.id, false);
                }
            }
        }

        this._collisionMatrixPrev.matrix = this._collisionMatrix.matrix.slice();
        this._collisionMatrix.reset();

    }

}
