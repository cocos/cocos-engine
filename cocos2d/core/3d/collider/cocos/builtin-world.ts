/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 ****************************************************************************/

import { Vec3 } from '../../../value-types';
import { ColliderRayResult } from '../framework/collider-ray-result';
import { BuiltinSharedBody } from './builtin-shared-body';
import { BuiltinShape } from './shapes/builtin-shape';
import { ArrayCollisionMatrix } from './utils/array-collision-matrix';
import { Ray, intersect } from '../../../geom-utils';
import { RecyclePool } from '../../../../renderer/memop';
import { IColliderWorld, IRaycastOptions } from '../spec/i-collider-world';
import { IVec3Like } from '../../../value-types/math';
import { CollisionEventType } from '../framework/collider-interface';
import { Collider3D } from '../exports/collider-framework';

const hitPoint = new Vec3();
const ColliderEventObject = {
    type: 'onCollisionEnter' as unknown as CollisionEventType,
    selfCollider: null as unknown as Collider3D,
    otherCollider: null as unknown as Collider3D,
};

/**
 * Built-in collision system, intended for use as a
 * efficient discrete collision detector,
 * not a full physical simulator
 */
export class BuiltInWorld implements IColliderWorld {
    set gravity (v: IVec3Like) { }
    set allowSleep (v: boolean) { }

    readonly shapeArr: BuiltinShape[] = [];
    readonly bodies: BuiltinSharedBody[] = [];

    private _shapeArrOld: BuiltinShape[] = [];
    private _collisionMatrix: ArrayCollisionMatrix = new ArrayCollisionMatrix();
    private _collisionMatrixPrev: ArrayCollisionMatrix = new ArrayCollisionMatrix();

    step (): void {

        // store and reset collsion array
        this._shapeArrOld = this.shapeArr.slice();
        this.shapeArr.length = 0;

        // sync scene to collision
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].syncSceneToCollision();
        }

        const collisionMatrix = cc.game.collisionMatrix;
        
        // collision detection
        for (let i = 0; i < this.bodies.length; i++) {
            const bodyA = this.bodies[i];
            const nodeA = bodyA.node;
            const nodeACollisionMatrix = collisionMatrix[nodeA.groupIndex];
            if (!nodeACollisionMatrix) continue;
            for (let j = i + 1; j < this.bodies.length; j++) {
                const bodyB = this.bodies[j];
                const nodeB = bodyB.node;
                if (nodeA !== nodeB && nodeACollisionMatrix[nodeB.groupIndex]) {
                    bodyA.intersects(bodyB);
                }
            }
        }

        // emit collider event
        this.emitColliderEvent();
    }

    raycastClosest (worldRay: Ray, options: IRaycastOptions, out: ColliderRayResult): boolean {
        let tmp_d = Infinity;
        const max_d = options.maxDistance!;
        const groupIndex = options.groupIndex!;
        const collisionMatrix = cc.game.collisionMatrix;
        const rayCollisionMatrix = collisionMatrix[groupIndex];
        if (!rayCollisionMatrix) return false;

        for (let i = 0; i < this.bodies.length; i++) {
            const body = this.bodies[i] as BuiltinSharedBody;
            const bodyGroupIndex = body.node.groupIndex;
            const canCollider = rayCollisionMatrix[bodyGroupIndex];
            if (!canCollider) continue;
            for (let i = 0; i < body.shapes.length; i++) {
                const shape = body.shapes[i];
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

    raycast (worldRay: Ray, options: IRaycastOptions, pool: RecyclePool, results: ColliderRayResult[]): boolean {
        const max_d = options.maxDistance!;
        const groupIndex = options.groupIndex!;
        const collisionMatrix = cc.game.collisionMatrix;
        const rayCollisionMatrix = collisionMatrix[groupIndex];
        if (!rayCollisionMatrix) return false;

        for (let i = 0; i < this.bodies.length; i++) {
            const body = this.bodies[i] as BuiltinSharedBody;
            const bodyGroupIndex = body.node.groupIndex;
            const canCollider = rayCollisionMatrix[bodyGroupIndex];
            if (!canCollider) continue;
            for (let i = 0; i < body.shapes.length; i++) {
                const shape = body.shapes[i];
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

    private emitColliderEvent () {
        let shapeA: BuiltinShape;
        let shapeB: BuiltinShape;
        for (let i = 0; i < this.shapeArr.length; i += 2) {
            shapeA = this.shapeArr[i];
            shapeB = this.shapeArr[i + 1];

            ColliderEventObject.selfCollider = shapeA.collider;
            ColliderEventObject.otherCollider = shapeB.collider;

            this._collisionMatrix.set(shapeA.id, shapeB.id, true);

            if (this._collisionMatrixPrev.get(shapeA.id, shapeB.id)) {
                // emit stay
                ColliderEventObject.type = 'onCollisionStay';
            } else {
                // first collider, emit enter
                ColliderEventObject.type = 'onCollisionEnter';
            }

            if (shapeA.collider) {
                shapeA.collider.emit(ColliderEventObject.type, ColliderEventObject);
            }

            ColliderEventObject.selfCollider = shapeB.collider;
            ColliderEventObject.otherCollider = shapeA.collider;

            if (shapeB.collider) {
                shapeB.collider.emit(ColliderEventObject.type, ColliderEventObject);
            }
        }

        for (let i = 0; i < this._shapeArrOld.length; i += 2) {
            shapeA = this._shapeArrOld[i];
            shapeB = this._shapeArrOld[i + 1];

            if (this._collisionMatrixPrev.get(shapeA.id, shapeB.id)) {
                if (!this._collisionMatrix.get(shapeA.id, shapeB.id)) {
                    // emit exit
                    ColliderEventObject.type = 'onCollisionExit';
                    ColliderEventObject.selfCollider = shapeA.collider;
                    ColliderEventObject.otherCollider = shapeB.collider;

                    if (shapeA.collider) {
                        shapeA.collider.emit(ColliderEventObject.type, ColliderEventObject);
                    }

                    ColliderEventObject.selfCollider = shapeB.collider;
                    ColliderEventObject.otherCollider = shapeA.collider;

                    if (shapeB.collider) {
                        shapeB.collider.emit(ColliderEventObject.type, ColliderEventObject);
                    }

                    this._collisionMatrix.set(shapeA.id, shapeB.id, false);
                }
            }
        }

        this._collisionMatrixPrev.matrix = this._collisionMatrix.matrix.slice();
        this._collisionMatrix.reset();

    }

}
