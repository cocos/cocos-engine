import { Vec3 } from '../../core/math';
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
function onTrigger (type: TriggerEventType, wpa: PhysXShape, wpb: PhysXShape) {
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
function onCollision (type: CollisionEventType, wpa: PhysXShape, wpb: PhysXShape) {
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

const triggerCallback = {
    onContactBegin: (a: any, b: any) => {
        const wpa = PX.IMPL_PTR[a['$$'].ptr] as PhysXShape;
        const wpb = PX.IMPL_PTR[b['$$'].ptr] as PhysXShape;
        onCollision('onCollisionEnter', wpa, wpb);
    },
    onContactEnd: (a: any, b: any) => {
        const wpa = PX.IMPL_PTR[a['$$'].ptr] as PhysXShape;
        const wpb = PX.IMPL_PTR[b['$$'].ptr] as PhysXShape;
        onCollision('onCollisionExit', wpa, wpb);
    },
    onContactPersist: (a: any, b: any) => {
        const wpa = PX.IMPL_PTR[a['$$'].ptr] as PhysXShape;
        const wpb = PX.IMPL_PTR[b['$$'].ptr] as PhysXShape;
        onCollision('onCollisionStay', wpa, wpb);
    },
    onTriggerBegin: (a: any, b: any) => {
        const pa = a['$$'].ptr;
        const pb = b['$$'].ptr;
        const key = pa + '-' + pb;
        const i = persistShapes.indexOf(key);
        if (i < 0) {
            persistShapes.push(key);
        }
        const wpa = PX.IMPL_PTR[pa] as PhysXShape;
        const wpb = PX.IMPL_PTR[pb] as PhysXShape;
        onTrigger('onTriggerEnter', wpa, wpb);
    },
    onTriggerEnd: (a: any, b: any) => {
        const pa = a['$$'].ptr;
        const pb = b['$$'].ptr;
        const key = pa + '-' + pb;
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

// eNONE = 0,	//!< the query should ignore this shape
// eTOUCH = 1,	//!< a hit on the shape touches the intersection geometry of the query but does not block it
// eBLOCK = 2		//!< a hit on the shape blocks the query (does not block overlap queries)
const queryCallback = {
    preFilter (filterData: any, shape: any, actor: any, out: any) {
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

const persistShapes: string[] = [];

export class PhysXWorld implements IPhysicsWorld {
    setAllowSleep (v: boolean) { }
    setDefaultMaterial (v: PhysicMaterial) { }
    setGravity (gravity: IVec3Like) {
        this.scene['setGravity'](gravity);
    }
    get impl () {
        return null;
    }

    readonly physics: PhysX.Physics;
    readonly scene: PhysX.Scene;
    readonly cooking: any;

    readonly queryfilterData: any;
    readonly singleResult: any;
    readonly mutipleResults: any;
    readonly simulationCB: any;
    readonly queryFilterCB: any;

    readonly wrappedBodies: PhysXSharedBody[] = [];

    constructor (options?: any) {
        if (USE_BYTEDANCE) {
            // const physics = PX.createPhysics();
            const physics = PX.physics;
            const cp = new PX.CookingParams();
            const cooking = PX.createCooking(cp);
            const sceneDesc = physics.createSceneDesc();
            const simulation = new PX.SimulationEventCallback();
            simulation.setOnContact(function (header, pairs) {
                for (let i = 0; i < pairs.length; i++) {
                    const cp = pairs[i];
                    if (cp.getContactPairFlags() & (1 | 2)) continue;

                    const events = cp.getPairFlags();
                    const shapes = cp.getShapes();
                    if (events & 4) {
                        var a = shapes[0] as any as PhysXShape;
                        var b = shapes[1] as any as PhysXShape;
                        onCollision('onCollisionEnter', a, b);
                    } else if (events & 8) {
                        var a = shapes[0] as any as PhysXShape;
                        var b = shapes[1] as any as PhysXShape;
                        onCollision('onCollisionStay', a, b);
                    } else if (events & 16) {
                        var a = shapes[0] as any as PhysXShape;
                        var b = shapes[1] as any as PhysXShape;
                        onCollision('onCollisionExit', a, b);
                    }
                }
            });
            simulation.setOnTrigger(function (pairs) {
                for (let i = 0; i < pairs.length; i++) {
                    const cp = pairs[i];
                    if (cp.getFlags() & (1 | 2)) continue;

                    const events = cp.getStatus();
                    var a = cp.getTriggerShape() as any as PhysXShape;
                    var b = cp.getOtherShape() as any as PhysXShape;
                    if (events & 4) {
                        onTrigger('onTriggerEnter', a, b);
                    } else if (events & 8) {
                        onTrigger('onTriggerStay', a, b);
                    } else if (events & 16) {
                        onTrigger('onTriggerExit', a, b);
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
            const sceneDesc = PX.getDefaultSceneDesc(this.physics['getTolerancesScale'](), 0, this.simulationCB);
            this.scene = this.physics.createScene(sceneDesc);
        }
        window.PP = this;
    }

    step (deltaTime: number, timeSinceLastCalled?: number, maxSubStep: number = 0) {
        if (this.wrappedBodies.length == 0) {
            return;
        }
        const scene = this.scene;
        if (USE_BYTEDANCE) {
            (scene as any).simulate(deltaTime);
        } else {
            (scene as any).simulate(deltaTime, true);
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
        const blocks = this.mutipleResults;
        const flags = (1 << 0) | (1 << 1) | (1 << 10);
        const word3 = 1 | (options.queryTrigger ? 0 : 2);
        this.queryfilterData.setWords(word3, 3);
        this.queryfilterData.setWords(options.mask >>> 0, 0);
        this.queryfilterData.setFlags((1 << 0) | (1 << 1) | (1 << 2) | (1 << 5));
        const r = this.scene['raycastMultiple'](worldRay.o, worldRay.d, options.maxDistance, flags, blocks, blocks.size(), this.queryfilterData, this.queryFilterCB, null);
        if (r > 0) {
            for (let i = 0; i < r; i++) {
                const block = blocks.get(i);
                const collider = (PX.IMPL_PTR[block.getShape()['$$'].ptr] as PhysXShape).collider;
                const result = pool.add();
                result._assign(block.position, block.distance, collider, block.normal);
                results.push(result);
            }
            return true;
        } else if (r == -1) {
            console.error("not enough memory.");
        }
        return false;
    }

    raycastClosest (worldRay: ray, options: IRaycastOptions, result: PhysicsRayResult): boolean {
        const block = this.singleResult;
        const flags = (1 << 0) | (1 << 1) //| (1 << 10);
        const word3 = 1 | (options.queryTrigger ? 0 : 2) | 4;
        this.queryfilterData.setWords(word3, 3);
        this.queryfilterData.setWords(options.mask >>> 0, 0);
        this.queryfilterData.setFlags((1 << 0) | (1 << 1) | (1 << 2));
        const r = this.scene['raycastSingle'](worldRay.o, worldRay.d, options.maxDistance, flags, block, this.queryfilterData, this.queryFilterCB, null);
        if (r) {
            const collider = (PX.IMPL_PTR[block.getShape()['$$'].ptr] as PhysXShape).collider;
            result._assign(block.position, block.distance, collider, block.normal);
            return true;
        }
        return false;
    }

    getSharedBody (node: Node, wrappedBody?: PhysXRigidBody) {
        return PhysXSharedBody.getSharedBody(node, this, wrappedBody);
    }

    addActor (body: PhysXSharedBody) {
        const index = this.wrappedBodies.indexOf(body);
        if (index < 0) {
            if (USE_BYTEDANCE) {
                this.scene['addActor'](body.impl);
            } else {
                this.scene['addActor'](body.impl, null);
            }
            this.wrappedBodies.push(body);
        }
    }

    removeActor (body: PhysXSharedBody) {
        const index = this.wrappedBodies.indexOf(body);
        if (index >= 0) {
            this.scene['removeActor'](body.impl, true);
            this.wrappedBodies.splice(index, 1);
        }
    }

    addConstraint (constraint: IBaseConstraint) { }

    removeConstraint (constraint: IBaseConstraint) { }

    updateCollisionMatrix (group: number, mask: number) { }

    emitEvents () {
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
