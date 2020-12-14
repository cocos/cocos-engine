import { ray } from '../../core/geometry';
import { IPhysicsWorld, IRaycastOptions } from '../spec/i-physics-world';
import { CollisionEventType, PhysicMaterial, PhysicsRayResult, TriggerEventType } from '../framework';
import { Node, RecyclePool } from '../../core';
import { IVec3Like } from '../../core/math/type-define';
import { IBaseConstraint } from '../spec/i-physics-constraint';
import { PhysXSharedBody } from './physx-shared-body';
import { PhysXRigidBody } from './physx-rigid-body';
import { PhysXShape } from './shapes/physx-shape';
import { PhysXContactEquation } from './physx-contact-equation';
import { CollisionEventObject, TriggerEventObject } from '../utils/util';
import { getContactData, getImplPtr, getWrapShape, PX, USE_BYTEDANCE } from './export-physx';

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

const contactsPool: [] = [];
function onCollision (type: CollisionEventType, wpa: PhysXShape, wpb: PhysXShape, c: number, d: any): void {
    if (wpa && wpb) {
        if (wpa.collider.needCollisionEvent || wpb.collider.needCollisionEvent) {
            CollisionEventObject.type = type;
            CollisionEventObject.impl = d;
            const contacts = CollisionEventObject.contacts;
            contactsPool.push.apply(contactsPool, contacts as any);
            contacts.length = 0;
            for (let i = 0; i < c; i++) {
                if (contactsPool.length > 0) {
                    const c = contactsPool.pop() as unknown as PhysXContactEquation;
                    c.colliderA = wpa.collider; c.colliderB = wpb.collider;
                    c.impl = getContactData(d, i); contacts.push(c);
                } else {
                    const c = new PhysXContactEquation(CollisionEventObject);
                    c.colliderA = wpa.collider; c.colliderB = wpb.collider;
                    c.impl = getContactData(d, i); contacts.push(c);
                }
            }
            if (wpa.collider.needCollisionEvent) {
                CollisionEventObject.selfCollider = wpa.collider;
                CollisionEventObject.otherCollider = wpb.collider;
                wpa.collider.emit(CollisionEventObject.type, CollisionEventObject);
            }
            if (wpb.collider.needCollisionEvent) {
                CollisionEventObject.selfCollider = wpb.collider;
                CollisionEventObject.otherCollider = wpa.collider;
                CollisionEventObject.contacts = [];
                wpb.collider.emit(CollisionEventObject.type, CollisionEventObject);
            }
        }
    }
}

const persistShapes: string[] = [];
const eventCallback = {
    onContactBegin: (a: any, b: any, c: any, d: any): void => {
        const wpa = getWrapShape<PhysXShape>(a);
        const wpb = getWrapShape<PhysXShape>(b);
        onCollision('onCollisionEnter', wpa, wpb, c, d);
    },
    onContactEnd: (a: any, b: any, c: any, d: any): void => {
        const wpa = getWrapShape<PhysXShape>(a);
        const wpb = getWrapShape<PhysXShape>(b);
        onCollision('onCollisionExit', wpa, wpb, c, d);
    },
    onContactPersist: (a: any, b: any, c: any, d: any): void => {
        const wpa = getWrapShape<PhysXShape>(a);
        const wpb = getWrapShape<PhysXShape>(b);
        onCollision('onCollisionStay', wpa, wpb, c, d);
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
    preFilter (filterData: any, shape: any, _actor: any, _out: any): number {
        // 0 for mask filter
        // 1 for trigger toggle
        // 2 for single hit
        if (USE_BYTEDANCE) {
            const shapeFlags = shape.getFlags();
            if ((filterData.word3 & 2) && (shapeFlags & PX.ShapeFlag.eTRIGGER_SHAPE)) {
                return PX.QueryHitType.eNONE;
            }
            return filterData.word3 & 4 ? PX.QueryHitType.eBLOCK : PX.QueryHitType.eTOUCH;
        }

        const shapeFlags = shape.getFlags();
        if ((filterData.word3 & 2) && shapeFlags.isSet(PX.PxShapeFlag.eTRIGGER_SHAPE)) {
            return PX.PxQueryHitType.eNONE;
        }
        return filterData.word3 & 4 ? PX.PxQueryHitType.eBLOCK : PX.PxQueryHitType.eTOUCH;
    },
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

    protected mutipleResultSize = 12;

    constructor () {
        if (USE_BYTEDANCE) {
            // const physics = PX.createPhysics();
            const physics = PX.physics;
            const cp = new PX.CookingParams();
            const cooking = PX.createCooking(cp);
            const sceneDesc = physics.createSceneDesc();
            const simulation = new PX.SimulationEventCallback();
            simulation.setOnContact((_header: any, pairs: any) => {
                for (let i = 0; i < pairs.length; i++) {
                    const cp = pairs[i];
                    if (cp.getContactPairFlags() & 3) continue;
                    const shapes = cp.getShapes();
                    const shape0 = shapes.shape0;
                    const shape1 = shapes.shape1;
                    if (!shape0 || !shape1) continue;
                    const shapeA = getWrapShape<PhysXShape>(shape0);
                    const shapeB = getWrapShape<PhysXShape>(shape1);
                    const events = cp.getPairFlags();
                    const contacts = cp.getContactsPoint();
                    if (events & 4) {
                        onCollision('onCollisionEnter', shapeA, shapeB, contacts.length, contacts);
                    } else if (events & 8) {
                        onCollision('onCollisionStay', shapeA, shapeB, contacts.length, contacts);
                    } else if (events & 16) {
                        onCollision('onCollisionExit', shapeA, shapeB, contacts.length, contacts);
                    }
                }
            });
            simulation.setOnTrigger((pairs: any) => {
                for (let i = 0; i < pairs.length; i++) {
                    const cp = pairs[i];
                    if (cp.getFlags() & 3) continue;
                    const events = cp.getStatus();
                    const ca = cp.getTriggerShape();
                    const cb = cp.getOtherShape();
                    const shapeA = getWrapShape<PhysXShape>(ca);
                    const shapeB = getWrapShape<PhysXShape>(cb);
                    const key = `${getImplPtr(ca)}-${getImplPtr(cb)}`;
                    const _i = persistShapes.indexOf(key);
                    if (events & 4) {
                        if (_i < 0) persistShapes.push(key);
                        onTrigger('onTriggerEnter', shapeA, shapeB);
                    } /*else if (events & 8) {
                        onTrigger('onTriggerStay', shapeA, shapeB);
                    } */else if (events & 16) {
                        if (_i >= 0) persistShapes.splice(_i, 1);
                        onTrigger('onTriggerExit', shapeA, shapeB);
                    }
                }
            });
            this.simulationCB = simulation;
            this.queryFilterCB = new PX.QueryFilterCallback();
            this.queryFilterCB.setPreFilter(queryCallback.preFilter);
            this.queryfilterData = { data: { word0: 0, word1: 0, word2: 0, word3: 1 }, flags: 0 };
            sceneDesc.setSimulationEventCallback(simulation);
            const scene = physics.createScene(sceneDesc);
            this.physics = physics;
            this.cooking = cooking;
            this.scene = scene;
        } else {
            this.singleResult = new PX.PxRaycastHit();
            this.mutipleResults = new PX.PxRaycastHitVector();
            this.mutipleResults.resize(this.mutipleResultSize, this.singleResult);
            this.queryfilterData = new PX.PxQueryFilterData();
            this.simulationCB = PX.PxSimulationEventCallback.implement(eventCallback);
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
            PX.physics = this.physics;
        }
    }

    step (deltaTime: number, _timeSinceLastCalled?: number, _maxSubStep = 0): void {
        if (this.wrappedBodies.length === 0) {
            return;
        }
        const scene = this.scene;
        if (USE_BYTEDANCE) {
            scene.simulate(deltaTime);
        } else {
            scene.simulate(deltaTime, true);
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

    raycast (worldRay: ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
        const maxDistance = options.maxDistance;
        const flags = (1 << 0) | (1 << 1) | (1 << 10);
        const word3 = 1 | (options.queryTrigger ? 0 : 2);
        if (USE_BYTEDANCE) {
            this.queryfilterData.data.word3 = word3;
            this.queryfilterData.data.word0 = options.mask >>> 0;
            this.queryfilterData.flags = (1 << 0) | (1 << 1) | (1 << 2) | (1 << 5);
            const r = PX.SceneQueryExt.raycastMultiple(this.scene, worldRay.o, worldRay.d, maxDistance, flags,
                this.mutipleResultSize, this.queryfilterData, this.queryFilterCB);

            if (r) {
                for (let i = 0; i < r.length; i++) {
                    const block = r[i];
                    const collider = getWrapShape<PhysXShape>(block.shape).collider;
                    const result = pool.add();
                    result._assign(block.position, block.distance, collider, block.normal);
                    results.push(result);
                }
                return true;
            }
        } else {
            this.queryfilterData.setWords(word3, 3);
            this.queryfilterData.setWords(options.mask >>> 0, 0);
            this.queryfilterData.setFlags((1 << 0) | (1 << 1) | (1 << 2) | (1 << 5));
            const blocks = this.mutipleResults;
            const r = this.scene.raycastMultiple(worldRay.o, worldRay.d, maxDistance, flags,
                blocks, blocks.size(), this.queryfilterData, this.queryFilterCB, null);

            if (r > 0) {
                for (let i = 0; i < r; i++) {
                    const block = blocks.get(i);
                    const collider = getWrapShape<PhysXShape>(block.getShape()).collider;
                    const result = pool.add();
                    result._assign(block.position, block.distance, collider, block.normal);
                    results.push(result);
                }
                return true;
            } if (r === -1) {
                console.error('not enough memory.');
            }
        }
        return false;
    }

    raycastClosest (worldRay: ray, options: IRaycastOptions, result: PhysicsRayResult): boolean {
        const maxDistance = options.maxDistance;
        const flags = (1 << 0) | (1 << 1); // | (1 << 10);
        const word3 = 1 | (options.queryTrigger ? 0 : 2) | 4;
        if (USE_BYTEDANCE) {
            this.queryfilterData.data.word3 = word3;
            this.queryfilterData.data.word0 = options.mask >>> 0;
            this.queryfilterData.flags = (1 << 0) | (1 << 1) | (1 << 2);
            const block = PX.SceneQueryExt.raycastSingle(this.scene, worldRay.o, worldRay.d, maxDistance,
                flags, this.queryfilterData, this.queryFilterCB);
            if (block) {
                const collider = getWrapShape<PhysXShape>(block.shape).collider;
                result._assign(block.position, block.distance, collider, block.normal);
                return true;
            }
        } else {
            this.queryfilterData.setWords(options.mask >>> 0, 0);
            this.queryfilterData.setWords(word3, 3);
            this.queryfilterData.setFlags((1 << 0) | (1 << 1) | (1 << 2));
            const block = this.singleResult;
            const r = this.scene.raycastSingle(worldRay.o, worldRay.d, options.maxDistance, flags,
                block, this.queryfilterData, this.queryFilterCB, null);
            if (r) {
                const collider = getWrapShape<PhysXShape>(block.getShape()).collider;
                result._assign(block.position, block.distance, collider, block.normal);
                return true;
            }
        }
        return false;
    }

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
