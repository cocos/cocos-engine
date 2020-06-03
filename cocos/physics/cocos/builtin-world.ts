/**
 * @hidden
 */

import { Vec3 } from '../../core/math';
import { PhysicsRayResult } from '../framework/physics-ray-result';
import { BuiltinSharedBody } from './builtin-shared-body';
import { BuiltinShape } from './shapes/builtin-shape';
import { ArrayCollisionMatrix } from '../utils/array-collision-matrix';
import { ray, intersect } from '../../core/geometry';
import { RecyclePool, Node } from '../../core';
import { IPhysicsWorld, IRaycastOptions } from '../spec/i-physics-world';
import { IVec3Like } from '../../core/math/type-define';
import { PhysicMaterial } from './../framework/assets/physic-material';
import { TriggerEventType } from '../framework/physics-interface';
import { ColliderComponent } from '../../../exports/physics-framework';

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
    setGravity (v: IVec3Like) { }
    setAllowSleep (v: boolean) { }
    setDefaultMaterial (v: PhysicMaterial) { }
    get impl () { return this; }
    shapeArr: BuiltinShape[] = [];
    readonly bodies: BuiltinSharedBody[] = [];

    private _shapeArrPrev: BuiltinShape[] = [];
    private _collisionMatrix: ArrayCollisionMatrix = new ArrayCollisionMatrix();
    private _collisionMatrixPrev: ArrayCollisionMatrix = new ArrayCollisionMatrix();

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
                if ((bodyA.collisionFilterGroup & bodyB.collisionFilterMask) === 0 ||
                    (bodyB.collisionFilterGroup & bodyA.collisionFilterMask) === 0) {
                    continue;
                }
                bodyA.intersects(bodyB);
            }
        }
    }

    syncSceneToPhysics (): void {
        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].syncSceneToPhysics();
        }
    }

    emitEvents (): void {
        this.emitTriggerEvent();
    }

    raycastClosest (worldRay: ray, options: IRaycastOptions, out: PhysicsRayResult): boolean {
        let tmp_d = Infinity;
        const max_d = options.maxDistance!;
        const mask = options.mask!;
        for (let i = 0; i < this.bodies.length; i++) {
            const body = this.bodies[i] as BuiltinSharedBody;
            if (!(body.collisionFilterGroup & mask)) continue;
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
                    out._assign(hitPoint, distance, shape.collider, Vec3.ZERO);
                }
            }
        }

        return !(tmp_d == Infinity);
    }

    raycast (worldRay: ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
        const max_d = options.maxDistance!;
        const mask = options.mask!;
        for (let i = 0; i < this.bodies.length; i++) {
            const body = this.bodies[i] as BuiltinSharedBody;
            if (!(body.collisionFilterGroup & mask)) continue;
            for (let i = 0; i < body.shapes.length; i++) {
                const shape = body.shapes[i];
                const distance = intersect.resolve(worldRay, shape.worldShape);
                if (distance == 0 || distance > max_d) {
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

    getSharedBody (node: Node): BuiltinSharedBody {
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

}
