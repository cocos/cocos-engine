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

import { Vec3, RecyclePool, error, js, IVec3Like, geometry, IQuatLike, warnID, Color } from '../../core';
import { PhysicsRayResult } from '../framework/physics-ray-result';
import { BuiltinSharedBody } from './builtin-shared-body';
import { BuiltinShape } from './shapes/builtin-shape';
import { ArrayCollisionMatrix } from '../utils/array-collision-matrix';
import { IPhysicsWorld, IRaycastOptions } from '../spec/i-physics-world';
import { PhysicsMaterial } from '../framework/assets/physics-material';
import { TriggerEventType } from '../framework/physics-interface';
import { Collider, EPhysicsDrawFlags } from '../../../exports/physics-framework';
import { BuiltinRigidBody } from './builtin-rigid-body';
import { Node } from '../../scene-graph';
import { GeometryRenderer } from '../../rendering/geometry-renderer';
import { director } from '../../game';
import { VEC3_0 } from '../utils/util';

const hitPoint = new Vec3();
const TriggerEventObject = {
    type: 'onTriggerEnter' as unknown as TriggerEventType,
    selfCollider: null as unknown as Collider,
    otherCollider: null as unknown as Collider,
    impl: {} as any,
};

const aabbTemp = new geometry.AABB();
const AABB_LINE_COUNT = 12;

/**
 * Built-in collision system, intended for use as a
 * efficient discrete collision detector,
 * not a full physical simulator
 */
export class BuiltInWorld implements IPhysicsWorld {
    sweepBox (
        worldRay: geometry.Ray,
        halfExtent: IVec3Like,
        orientation: IQuatLike,
        options: IRaycastOptions,
        pool: RecyclePool<PhysicsRayResult>,
        results: PhysicsRayResult[],
    ): boolean {
        warnID(9640);
        return false;
    }

    sweepBoxClosest (
        worldRay: geometry.Ray,
        halfExtent: IVec3Like,
        orientation: IQuatLike,
        options: IRaycastOptions,
        result: PhysicsRayResult,
    ): boolean {
        warnID(9640);
        return false;
    }

    sweepSphere (
        worldRay: geometry.Ray,
        radius: number,
        options: IRaycastOptions,
        pool: RecyclePool<PhysicsRayResult>,
        results: PhysicsRayResult[],
    ): boolean {
        warnID(9640);
        return false;
    }

    sweepSphereClosest (
        worldRay: geometry.Ray,
        radius: number,
        options: IRaycastOptions,
        result: PhysicsRayResult,
    ): boolean {
        warnID(9640);
        return false;
    }

    sweepCapsule (
        worldRay: geometry.Ray,
        radius: number,
        height: number,
        orientation: IQuatLike,
        options: IRaycastOptions,
        pool: RecyclePool<PhysicsRayResult>,
        results: PhysicsRayResult[],
    ): boolean {
        warnID(9640);
        return false;
    }

    sweepCapsuleClosest (
        worldRay: geometry.Ray,
        radius: number,
        height: number,
        orientation: IQuatLike,
        options: IRaycastOptions,
        result: PhysicsRayResult,
    ): boolean {
        warnID(9640);
        return false;
    }

    setGravity (v: IVec3Like): void {
        //empty
    }
    setAllowSleep (v: boolean): void {
        //empty
    }
    setDefaultMaterial (v: PhysicsMaterial): void {
        //empty
    }
    get impl (): BuiltInWorld { return this; }
    shapeArr: BuiltinShape[] = [];
    readonly bodies: BuiltinSharedBody[] = [];

    private _shapeArrPrev: BuiltinShape[] = [];
    private _collisionMatrix: ArrayCollisionMatrix = new ArrayCollisionMatrix();
    private _collisionMatrixPrev: ArrayCollisionMatrix = new ArrayCollisionMatrix();

    private _debugLineCount = 0;
    private _MAX_DEBUG_LINE_COUNT = 16384;
    private _debugDrawFlags = EPhysicsDrawFlags.NONE;
    private _debugConstraintSize = 0.3;
    private _aabbColor = new Color(0, 255, 255, 255);
    private _wireframeColor = new Color(255, 0, 255, 255);

    get debugDrawFlags (): EPhysicsDrawFlags {
        return this._debugDrawFlags;
    }

    set debugDrawFlags (v: EPhysicsDrawFlags) {
        this._debugDrawFlags = v;
    }

    get debugDrawConstraintSize (): number {
        return this._debugConstraintSize;
    }

    set debugDrawConstraintSize (v) {
        this._debugConstraintSize = v;
    }

    destroy (): void {
        if (this.bodies.length) error('You should destroy all physics component first.');
    }

    step (deltaTime: number): void {
        // store and reset collision array
        const tmp = this._shapeArrPrev;
        this._shapeArrPrev = this.shapeArr;
        this.shapeArr = tmp;
        this.shapeArr.length = 0;

        // collision detection
        for (let i = 0; i < this.bodies.length; i++) {
            const bodyA = this.bodies[i];
            for (let j = i + 1; j < this.bodies.length; j++) {
                const bodyB = this.bodies[j];

                // first, Check collision filter masks
                if ((bodyA.collisionFilterGroup & bodyB.collisionFilterMask) === 0
                    || (bodyB.collisionFilterGroup & bodyA.collisionFilterMask) === 0) {
                    continue;
                }
                bodyA.intersects(bodyB);
            }
        }

        this._debugDraw();
    }

    syncSceneToPhysics (): void {
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].syncSceneToPhysics();
        }
    }

    syncAfterEvents (): void {
        this.syncSceneToPhysics();
    }

    emitEvents (): void {
        this.emitTriggerEvent();
    }

    raycastClosest (worldRay: geometry.Ray, options: IRaycastOptions, out: PhysicsRayResult): boolean {
        let tmp_d = Infinity;
        const max_d = options.maxDistance;
        const mask = options.mask;
        for (let i = 0; i < this.bodies.length; i++) {
            const body = this.bodies[i];
            if (!(body.collisionFilterGroup & mask)) continue;
            for (let i = 0; i < body.shapes.length; i++) {
                const shape = body.shapes[i];
                const distance = geometry.intersect.resolve(worldRay, shape.worldShape);
                if (distance === 0 || distance > max_d) {
                    continue;
                }
                if (tmp_d > distance) {
                    tmp_d = distance;
                    Vec3.normalize(hitPoint, worldRay.d);
                    Vec3.scaleAndAdd(hitPoint, worldRay.o, hitPoint, distance);
                    out._assign(hitPoint, distance, shape.collider, Vec3.ZERO);
                }
            }
        }

        return !(tmp_d === Infinity);
    }

    raycast (worldRay: geometry.Ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
        const max_d = options.maxDistance;
        const mask = options.mask;
        for (let i = 0; i < this.bodies.length; i++) {
            const body = this.bodies[i];
            if (!(body.collisionFilterGroup & mask)) continue;
            for (let i = 0; i < body.shapes.length; i++) {
                const shape = body.shapes[i];
                const distance = geometry.intersect.resolve(worldRay, shape.worldShape);
                if (distance === 0 || distance > max_d) {
                    continue;
                } else {
                    const r = pool.add();
                    worldRay.computeHit(hitPoint, distance);
                    r._assign(hitPoint, distance, shape.collider, Vec3.ZERO);
                    results.push(r);
                }
            }
        }
        return results.length > 0;
    }

    getSharedBody (node: Node, wrappedBody?: BuiltinRigidBody): BuiltinSharedBody {
        return BuiltinSharedBody.getSharedBody(node, this, wrappedBody);
    }

    addSharedBody (body: BuiltinSharedBody): void {
        const index = this.bodies.indexOf(body);
        if (index < 0) {
            this.bodies.push(body);
        }
    }

    removeSharedBody (body: BuiltinSharedBody): void {
        const index = this.bodies.indexOf(body);
        if (index >= 0) {
            js.array.fastRemoveAt(this.bodies, index);
        }
    }

    private emitTriggerEvent (): void {
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

        for (let i = 0; i < this._shapeArrPrev.length; i += 2) {
            shapeA = this._shapeArrPrev[i];
            shapeB = this._shapeArrPrev[i + 1];

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

        const temp = this._collisionMatrixPrev.matrix;
        this._collisionMatrixPrev.matrix = this._collisionMatrix.matrix;
        this._collisionMatrix.matrix = temp;
        this._collisionMatrix.reset();
    }

    private _getDebugRenderer (): GeometryRenderer|null {
        const cameras = director.root!.mainWindow?.cameras;
        if (!cameras) return null;
        if (cameras.length === 0) return null;
        if (!cameras[0]) return null;
        cameras[0].initGeometryRenderer();

        return cameras[0].geometryRenderer;
    }

    private _debugDraw (): void {
        const debugRenderer = this._getDebugRenderer();
        if (!debugRenderer) return;

        this._debugLineCount = 0;
        if (this._debugDrawFlags & EPhysicsDrawFlags.AABB) {
            for (let i = 0; i < this.bodies.length; i++) {
                const body = this.bodies[i];
                for (let j = 0; j < body.shapes.length; j++) {
                    const shape = body.shapes[j];
                    if (this._debugLineCount + AABB_LINE_COUNT < this._MAX_DEBUG_LINE_COUNT) {
                        this._debugLineCount += AABB_LINE_COUNT;
                        shape.getAABB(aabbTemp);
                        debugRenderer.addBoundingBox(aabbTemp, this._aabbColor);
                    }
                }
            }
        }
    }
}
