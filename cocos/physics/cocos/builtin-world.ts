/**
 * @hidden
 */

import { Vec3 } from '../../core/math';
import { PhysicsRayResult } from '../physics-ray-result';
import { BuiltinSharedBody } from './builtin-shared-body';
import { BuiltinShape } from './shapes/builtin-shape';
import { ArrayCollisionMatrix } from './utils/array-collision-matrix';
import { ray, intersect } from '../../core/geom-utils';
import { RecyclePool, Node } from '../../core';
import { IPhysicsWorld, IRaycastOptions } from '../spec/i-physics-world';
import { IVec3Like } from '../../core/math/type-define';
import { PhysicMaterial } from '../assets/physic-material';
import { TriggerEventType } from '../export-api';
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
    set gravity (v: IVec3Like) { }
    set allowSleep (v: boolean) { }
    set defaultMaterial (v: PhysicMaterial) { }

    readonly sharedBodesMap = new Map<string, BuiltinSharedBody>();
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

    raycastClosest (worldRay: ray, options: IRaycastOptions, out: PhysicsRayResult): boolean {
        let tmp_d = Infinity;
        const max_d = options.maxDistance!;
        const mask = options.mask!;
        for (let i = 0; i < this.bodies.length; i++) {
            const body = this.bodies[i] as BuiltinSharedBody;
            for (let i = 0; i < body.shapes.length; i++) {
                const shape = body.shapes[i];
                // const collider = shape.getUserData();
                // if (!(collider!.node.layer & mask)) {
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

    raycast (worldRay: ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
        const max_d = options.maxDistance!;
        const mask = options.mask!;
        for (let i = 0; i < this.bodies.length; i++) {
            const body = this.bodies[i] as BuiltinSharedBody;
            for (let i = 0; i < body.shapes.length; i++) {
                const shape = body.shapes[i];
                // const collider = shape.getUserData();
                // if (!(collider!.node.layer & mask)) {
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

    getSharedBody (node: Node): BuiltinSharedBody {
        const key = node.uuid;
        if (this.sharedBodesMap.has(key)) {
            return this.sharedBodesMap.get(key)!;
        } else {
            const newSB = new BuiltinSharedBody(node, this);
            return newSB;
        }
    }

    delSharedBody (node: Node): boolean {
        const key = node.uuid;
        return this.sharedBodesMap.delete(key);
    }

    addBody (body: BuiltinSharedBody) {
        const index = this.bodies.indexOf(body);
        if (index < 0) {
            this.bodies.push(body);
        }
    }

    removeBody (body: BuiltinSharedBody) {
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
