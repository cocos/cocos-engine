import { ray } from '../../core/geometry';
import { IPhysicsWorld, IRaycastOptions } from '../spec/i-physics-world';
import { CollisionEventType, PhysicMaterial, PhysicsRayResult, TriggerEventType } from '../framework';
import { Node, RecyclePool } from '../../core';
import { IVec3Like } from '../../core/math/type-define';
import { IBaseConstraint } from '../spec/i-physics-constraint';
import { PhysXSharedBody } from './physx-shared-body';
import { PhysXRigidBody } from './physx-rigid-body';
import { PhysXShape } from './shapes/physx-shape';
import { CollisionEventObject, TriggerEventObject } from '../utils/util';
import { PX, USE_BYTEDANCE } from './export-physx';

/**
 * @param type
 * @param a
 * @param b
 */
function onTrigger (type: TriggerEventType, wpa: PhysXShape, wpb: PhysXShape): void {
    if (wpa && wpb) {
        TriggerEventObject.type = type;
        if (wpa.collider.needTriggerEvent) {
            TriggerEventObject.selfCollider = wpa.collider;
            TriggerEventObject.otherCollider = wpb.collider;
            wpa.collider.emit(TriggerEventObject.type, TriggerEventObject);
        }
        if (wpb.collider.needTriggerEvent) {
            TriggerEventObject.selfCollider = wpb.collider;
            TriggerEventObject.otherCollider = wpa.collider;
            wpb.collider.emit(TriggerEventObject.type, TriggerEventObject);
        }
    }
}

/**
 * @param type
 * @param a
 * @param b
 */
function onCollision (type: CollisionEventType, wpa: PhysXShape, wpb: PhysXShape): void {
    if (wpa && wpb) {
        CollisionEventObject.type = type;
        if (wpa.collider.needCollisionEvent) {
            CollisionEventObject.selfCollider = wpa.collider;
            CollisionEventObject.otherCollider = wpb.collider;
            wpa.collider.emit(CollisionEventObject.type, CollisionEventObject);
        }
        if (wpb.collider.needCollisionEvent) {
            CollisionEventObject.selfCollider = wpb.collider;
            CollisionEventObject.otherCollider = wpa.collider;
            wpb.collider.emit(CollisionEventObject.type, CollisionEventObject);
        }
    }
}

const persistShapes: string[] = [];
const triggerCallback = {
    onContactBegin: (a: any, b: any): void => {
        const wpa = PX.IMPL_PTR[a.$$.ptr] as PhysXShape;
        const wpb = PX.IMPL_PTR[b.$$.ptr] as PhysXShape;
        onCollision('onCollisionEnter', wpa, wpb);
    },
    onContactEnd: (a: any, b: any): void => {
        const wpa = PX.IMPL_PTR[a.$$.ptr] as PhysXShape;
        const wpb = PX.IMPL_PTR[b.$$.ptr] as PhysXShape;
        onCollision('onCollisionExit', wpa, wpb);
    },
    onContactPersist: (a: any, b: any): void => {
        const wpa = PX.IMPL_PTR[a.$$.ptr] as PhysXShape;
        const wpb = PX.IMPL_PTR[b.$$.ptr] as PhysXShape;
        onCollision('onCollisionStay', wpa, wpb);
    },
    onTriggerBegin: (a: any, b: any): void => {
        const pa = a.$$.ptr as number;
        const pb = b.$$.ptr as number;
        const key = `${pa}-${pb}`;
        const i = persistShapes.indexOf(key);
        if (i < 0) {
            persistShapes.push(key);
        }
        const wpa = PX.IMPL_PTR[pa] as PhysXShape;
        const wpb = PX.IMPL_PTR[pb] as PhysXShape;
        onTrigger('onTriggerEnter', wpa, wpb);
    },
    onTriggerEnd: (a: any, b: any): void => {
        const pa = a.$$.ptr as number;
        const pb = b.$$.ptr as number;
        const key = `${pa}-${pb}`;
        const i = persistShapes.indexOf(key);
        if (i >= 0) {
            persistShapes.splice(i, 1);
        }
        const wpa = PX.IMPL_PTR[pa] as PhysXShape;
        const wpb = PX.IMPL_PTR[pb] as PhysXShape;
        onTrigger('onTriggerExit', wpa, wpb);
    },
    // onTriggerPersist: (...a: any) => { console.log('onTriggerPersist', a); },
};

// eNONE = 0,   //!< the query should ignore this shape
// eTOUCH = 1,  //!< a hit on the shape touches the intersection geometry of the query but does not block it
// eBLOCK = 2   //!< a hit on the shape blocks the query (does not block overlap queries)
const queryCallback = {
    preFilter (filterData: any, shape: any, _actor: any, _out: any): void {
        // trigger filter
        // 0 for mask filter
        // 1 for trigger toggle
        // 2 for single hit
        const shapeFlags = shape.getFlags();
        if ((filterData.word3 & 2) && shapeFlags.isSet(PX.PxShapeFlag.eTRIGGER_SHAPE)) {
            return PX.PxQueryHitType.eNONE;
        }
        return filterData.word3 & 4 ? PX.PxQueryHitType.eBLOCK : PX.PxQueryHitType.eTOUCH;
    },
    // postFilter (a: any, b: any) {
    //     return PX.PxQueryHitType.eTOUCH;
    // }
};

export class PhysXWorld implements IPhysicsWorld {
    setAllowSleep (_v: boolean): void { }
    setDefaultMaterial (_v: PhysicMaterial): void { }
    setGravity (gravity: IVec3Like): void {
        this.scene.setGravity(gravity);
    }

    get impl (): any { return this.scene; }

    readonly physics: any;
    readonly scene: any;
    readonly cooking: any;

    readonly queryfilterData: any;
    readonly singleResult: any;
    readonly mutipleResults: any;
    readonly simulationCB: any;
    readonly queryFilterCB: any;

    readonly wrappedBodies: PhysXSharedBody[] = [];

    constructor (_options?: any) {
        if (USE_BYTEDANCE) {
            // const physics = PX.createPhysics();
            const physics = PX.physics;
            const cp = new PX.CookingParams();
            const cooking = PX.createCooking(cp);
            const sceneDesc = physics.createSceneDesc();
            const simulation = new PX.SimulationEventCallback();
            simulation.setOnContact((_header, pairs) => {
                for (let i = 0; i < pairs.length; i++) {
                    const cp = pairs[i];
                    if (cp.getContactPairFlags() & (1 | 2)) continue;

                    const events = cp.getPairFlags();
                    const shapes = cp.getShapes();
                    const a = shapes[0];
                    const b = shapes[1];
                    const shapeA = PX.IMPL_PTR[a.getQueryFilterData().word2] as PhysXShape;
                    const shapeB = PX.IMPL_PTR[b.getQueryFilterData().word2] as PhysXShape;
                    if (events & 4) {
                        onCollision('onCollisionEnter', shapeA, shapeB);
                    } else if (events & 8) {
                        onCollision('onCollisionStay', shapeA, shapeB);
                    } else if (events & 16) {
                        onCollision('onCollisionExit', shapeA, shapeB);
                    }
                }
            });
            simulation.setOnTrigger((pairs) => {
                for (let i = 0; i < pairs.length; i++) {
                    const cp = pairs[i];
                    if (cp.getFlags() & (1 | 2)) continue;

                    const events = cp.getStatus();
                    const a = cp.getTriggerShape();
                    const b = cp.getOtherShape();
                    const shapeA = PX.IMPL_PTR[a.getQueryFilterData().word2] as PhysXShape;
                    const shapeB = PX.IMPL_PTR[b.getQueryFilterData().word2] as PhysXShape;

                    if (events & 4) {
                        onTrigger('onTriggerEnter', shapeA, shapeB);
                    } else if (events & 8) {
                        onTrigger('onTriggerStay', shapeA, shapeB);
                    } else if (events & 16) {
                        onTrigger('onTriggerExit', shapeA, shapeB);
                    }
                }
            });
            sceneDesc.setSimulationEventCallback(simulation);
            const scene = physics.createScene(sceneDesc);
            this.physics = physics;
            this.cooking = cooking;
            this.scene = scene;
        } else {
            this.singleResult = new PX.PxRaycastHit();
            this.mutipleResults = new PX.PxRaycastHitVector();
            this.mutipleResults.resize(12, this.singleResult);
            this.queryfilterData = new PX.PxQueryFilterData();
            this.simulationCB = PX.PxSimulationEventCallback.implement(triggerCallback);
            this.queryFilterCB = PX.PxQueryFilterCallback.implement(queryCallback);
            const version = PX.PX_PHYSICS_VERSION;
            const defaultErrorCallback = new PX.PxDefaultErrorCallback();
            const allocator = new PX.PxDefaultAllocator();
            const foundation = PX.PxCreateFoundation(version, allocator, defaultErrorCallback);
            const scale = new PX.PxTolerancesScale();
            this.cooking = PX.PxCreateCooking(version, foundation, new PX.PxCookingParams(scale));
            this.physics = PX.PxCreatePhysics(version, foundation, scale, false, null);
            PX.PxInitExtensions(this.physics, null);
            const sceneDesc = PX.getDefaultSceneDesc(this.physics.getTolerancesScale(), 0, this.simulationCB);
            this.scene = this.physics.createScene(sceneDesc);
        }
        window.PP = this;
    }

    step (deltaTime: number, _timeSinceLastCalled?: number, _maxSubStep = 0): void {
        if (this.wrappedBodies.length === 0) {
            return;
        }
        const scene = this.scene;
        if (USE_BYTEDANCE) {
            (scene).simulate(deltaTime);
        } else {
            (scene).simulate(deltaTime, true);
        }
        scene.fetchResults(true);
        for (let i = 0; i < this.wrappedBodies.length; i++) {
            const body = this.wrappedBodies[i];
            body.syncPhysicsToScene();
        }
    }

    syncSceneToPhysics (): void {
        for (let i = 0; i < this.wrappedBodies.length; i++) {
            const body = this.wrappedBodies[i];
            body.syncSceneToPhysics();
        }
    }

    raycast (worldRay: ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
        if (USE_BYTEDANCE) return false;

        const blocks = this.mutipleResults;
        const flags = (1 << 0) | (1 << 1) | (1 << 10);
        const word3 = 1 | (options.queryTrigger ? 0 : 2);
        this.queryfilterData.setWords(word3, 3);
        this.queryfilterData.setWords(options.mask >>> 0, 0);
        this.queryfilterData.setFlags((1 << 0) | (1 << 1) | (1 << 2) | (1 << 5));
        const r = this.scene.raycastMultiple(worldRay.o, worldRay.d, options.maxDistance, flags,
            blocks, blocks.size(), this.queryfilterData, this.queryFilterCB, null);
        if (r > 0) {
            for (let i = 0; i < r; i++) {
                const block = blocks.get(i);
                const collider = (PX.IMPL_PTR[block.getShape().$$.ptr] as PhysXShape).collider;
                const result = pool.add();
                result._assign(block.position, block.distance, collider, block.normal);
                results.push(result);
            }
            return true;
        } if (r === -1) {
            console.error('not enough memory.');
        }
        return false;
    }

    raycastClosest (worldRay: ray, options: IRaycastOptions, result: PhysicsRayResult): boolean {
        if (USE_BYTEDANCE) return false;

        const block = this.singleResult;
        const flags = (1 << 0) | (1 << 1); // | (1 << 10);
        const word3 = 1 | (options.queryTrigger ? 0 : 2) | 4;
        this.queryfilterData.setWords(word3, 3);
        this.queryfilterData.setWords(options.mask >>> 0, 0);
        this.queryfilterData.setFlags((1 << 0) | (1 << 1) | (1 << 2));
        const r = this.scene.raycastSingle(worldRay.o, worldRay.d, options.maxDistance, flags, block, this.queryfilterData, this.queryFilterCB, null);
        if (r) {
            const collider = (PX.IMPL_PTR[block.getShape().$$.ptr] as PhysXShape).collider;
            result._assign(block.position, block.distance, collider, block.normal);
            return true;
        }
        return false;
    }

    getSharedBody (node: Node, wrappedBody?: PhysXRigidBody): PhysXSharedBody {
        return PhysXSharedBody.getSharedBody(node, this, wrappedBody);
    }

    addActor (body: PhysXSharedBody): void {
        const index = this.wrappedBodies.indexOf(body);
        if (index < 0) {
            if (USE_BYTEDANCE) {
                this.scene.addActor(body.impl);
            } else {
                this.scene.addActor(body.impl, null);
            }
            this.wrappedBodies.push(body);
        }
    }

    removeActor (body: PhysXSharedBody): void {
        const index = this.wrappedBodies.indexOf(body);
        if (index >= 0) {
            this.scene.removeActor(body.impl, true);
            this.wrappedBodies.splice(index, 1);
        }
    }

    addConstraint (_constraint: IBaseConstraint): void { }

    removeConstraint (_constraint: IBaseConstraint): void { }

    updateCollisionMatrix (_group: number, _mask: number): void {
        for (let i = 0; i < this.wrappedBodies.length; i++) {
            const g = this.wrappedBodies[i];
            if (g.getGroup() === _group) {
                g.setMask(_mask);
            }
        }
    }

    emitEvents (): void {
        const l = persistShapes.length;
        for (let i = 0; i < l; i++) {
            const key = persistShapes[i];
            const ptr = key.split('-');
            const wpa = PX.IMPL_PTR[ptr[0]];
            const wpb = PX.IMPL_PTR[ptr[1]];
            onTrigger('onTriggerStay', wpa, wpb);
        }
    }
}
