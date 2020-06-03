import Ammo from '@cocos/ammo';
import { Vec3 } from "../../core/math";
import { AmmoSharedBody } from "./ammo-shared-body";
import { AmmoRigidBody } from "./ammo-rigid-body";
import { AmmoShape } from './shapes/ammo-shape';
import { ArrayCollisionMatrix } from '../utils/array-collision-matrix';
import { TupleDictionary } from '../utils/tuple-dictionary';
import { TriggerEventObject, CollisionEventObject } from './ammo-const';
import { ammo2CocosVec3, cocos2AmmoVec3, cocos2AmmoQuat } from './ammo-util';
import { ray } from '../../core/geometry';
import { IRaycastOptions, IPhysicsWorld } from '../spec/i-physics-world';
import { PhysicsRayResult, PhysicMaterial } from '../framework';
import { Node, RecyclePool } from '../../core';
import { AmmoInstance } from './ammo-instance';
import { AmmoCollisionFilterGroups } from './ammo-enum';
import { IVec3Like } from '../../core/math/type-define';

const contactsPool = [] as any;
const v3_0 = new Vec3();
const v3_1 = new Vec3();

export class AmmoWorld implements IPhysicsWorld {

    setAllowSleep (v: boolean) { };
    setDefaultMaterial (v: PhysicMaterial) { };

    setGravity (gravity: IVec3Like) {
        cocos2AmmoVec3(this._btGravity, gravity);
        this._btWorld.setGravity(this._btGravity);
    }

    get impl () {
        return this._btWorld;
    }

    private readonly _btWorld: Ammo.btDiscreteDynamicsWorld;
    private readonly _btBroadphase: Ammo.btDbvtBroadphase;
    private readonly _btSolver: Ammo.btSequentialImpulseConstraintSolver;
    private readonly _btDispatcher: Ammo.btCollisionDispatcher;
    private readonly _btGravity: Ammo.btVector3;

    readonly bodies: AmmoSharedBody[] = [];
    readonly ghosts: AmmoSharedBody[] = [];
    readonly triggerArrayMat = new ArrayCollisionMatrix();
    readonly collisionArrayMat = new ArrayCollisionMatrix();
    readonly contactsDic = new TupleDictionary();
    readonly oldContactsDic = new TupleDictionary();

    readonly closeHitCB = new Ammo.ClosestRayResultCallback(new Ammo.btVector3(), new Ammo.btVector3());
    readonly allHitsCB = new Ammo.AllHitsRayResultCallback(new Ammo.btVector3(), new Ammo.btVector3());

    constructor (options?: any) {
        const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        this._btDispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
        this._btBroadphase = new Ammo.btDbvtBroadphase();
        this._btSolver = new Ammo.btSequentialImpulseConstraintSolver();
        this._btWorld = new Ammo.btDiscreteDynamicsWorld(this._btDispatcher, this._btBroadphase, this._btSolver, collisionConfiguration);
        this._btGravity = new Ammo.btVector3(0, -10, 0);
        this._btWorld.setGravity(this._btGravity);
    }

    step (deltaTime: number, timeSinceLastCalled?: number, maxSubStep: number = 0) {
        if (this.bodies.length == 0 && this.ghosts.length == 0) return;
        if (timeSinceLastCalled == undefined) timeSinceLastCalled = deltaTime;
        this._btWorld.stepSimulation(timeSinceLastCalled, maxSubStep, deltaTime);

        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].syncPhysicsToScene();
        }
    }

    syncSceneToPhysics (): void {
        for (let i = 0; i < this.ghosts.length; i++) {
            this.ghosts[i].syncSceneToGhost();
        }

        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].syncSceneToPhysics();
        }
    }

    raycast (worldRay: ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
        let from = cocos2AmmoVec3(this.allHitsCB.m_rayFromWorld, worldRay.o);
        worldRay.computeHit(v3_0, options.maxDistance);
        let to = cocos2AmmoVec3(this.allHitsCB.m_rayToWorld, v3_0);

        this.allHitsCB.m_collisionFilterGroup = -1;
        this.allHitsCB.m_collisionFilterMask = options.mask;
        this.allHitsCB.m_closestHitFraction = 1;
        this.allHitsCB.m_shapePart = -1;
        (this.allHitsCB.m_collisionObject as any) = null;
        this.allHitsCB.m_shapeParts.clear();
        this.allHitsCB.m_hitFractions.clear();
        this.allHitsCB.m_collisionObjects.clear();
        // TODO: typing
        const hp = (this.allHitsCB.m_hitPointWorld as any);
        const hn = (this.allHitsCB.m_hitNormalWorld as any);
        hp.clear();
        hn.clear();
        this._btWorld.rayTest(from, to, this.allHitsCB);
        if (this.allHitsCB.hasHit()) {
            for (let i = 0, n = this.allHitsCB.m_collisionObjects.size(); i < n; i++) {
                const shapeIndex = this.allHitsCB.m_shapeParts.at(i);
                const btObj = this.allHitsCB.m_collisionObjects.at(i);
                const index = btObj.getUserIndex();
                const shared = AmmoInstance.bodyAndGhosts['KEY' + index];
                // if (shared.wrappedShapes.length > shapeIndex) {
                const shape = shared.wrappedShapes[shapeIndex];
                ammo2CocosVec3(v3_0, hp.at(i));
                ammo2CocosVec3(v3_1, hn.at(i));
                const distance = Vec3.distance(worldRay.o, v3_0);
                const r = pool.add();
                r._assign(v3_0, distance, shape.collider, v3_1);
                results.push(r);
                // }
            }
            return true;
        }
        return false;
    }

    /**
     * Ray cast, and return information of the closest hit.
     * @return True if any body was hit.
     */
    raycastClosest (worldRay: ray, options: IRaycastOptions, result: PhysicsRayResult): boolean {
        let from = cocos2AmmoVec3(this.closeHitCB.m_rayFromWorld, worldRay.o);
        worldRay.computeHit(v3_0, options.maxDistance);
        let to = cocos2AmmoVec3(this.closeHitCB.m_rayToWorld, v3_0);

        this.closeHitCB.m_collisionFilterGroup = -1;
        this.closeHitCB.m_collisionFilterMask = options.mask;
        this.closeHitCB.m_closestHitFraction = 1;
        (this.closeHitCB.m_collisionObject as any) = null;

        this._btWorld.rayTest(from, to, this.closeHitCB);
        if (this.closeHitCB.hasHit()) {
            const btObj = this.closeHitCB.m_collisionObject;
            const index = btObj.getUserIndex();
            const shared = AmmoInstance.bodyAndGhosts['KEY' + index];
            const shapeIndex = this.closeHitCB.m_shapePart;
            const shape = shared.wrappedShapes[shapeIndex];
            ammo2CocosVec3(v3_0, this.closeHitCB.m_hitPointWorld);
            ammo2CocosVec3(v3_1, this.closeHitCB.m_hitNormalWorld);
            const distance = Vec3.distance(worldRay.o, v3_0);
            result._assign(v3_0, distance, shape.collider, v3_1);
            return true;
        }
        return false;
    }

    getSharedBody (node: Node, wrappedBody?: AmmoRigidBody) {
        return AmmoSharedBody.getSharedBody(node, this, wrappedBody);
    }

    addSharedBody (sharedBody: AmmoSharedBody) {
        const i = this.bodies.indexOf(sharedBody);
        if (i < 0) {
            this.bodies.push(sharedBody);
            this._btWorld.addRigidBody(sharedBody.body, sharedBody.collisionFilterGroup, sharedBody.collisionFilterMask);
        }
    }

    removeSharedBody (sharedBody: AmmoSharedBody) {
        const i = this.bodies.indexOf(sharedBody);
        if (i >= 0) {
            this.bodies.splice(i, 1);
            this._btWorld.removeRigidBody(sharedBody.body);
        }
    }

    addGhostObject (sharedBody: AmmoSharedBody) {
        const i = this.ghosts.indexOf(sharedBody);
        if (i < 0) {
            this.ghosts.push(sharedBody);
            this._btWorld.addCollisionObject(sharedBody.ghost, sharedBody.collisionFilterGroup, sharedBody.collisionFilterMask);
        }
    }

    removeGhostObject (sharedBody: AmmoSharedBody) {
        const i = this.ghosts.indexOf(sharedBody);
        if (i >= 0) {
            this.ghosts.splice(i, 1);
            this._btWorld.removeCollisionObject(sharedBody.ghost);
        }
    }

    emitEvents () {
        const numManifolds = this._btDispatcher.getNumManifolds();
        for (let i = 0; i < numManifolds; i++) {
            const manifold = this._btDispatcher.getManifoldByIndexInternal(i);
            const numContacts = manifold.getNumContacts();
            for (let j = 0; j < numContacts; j++) {
                const manifoldPoint: Ammo.btManifoldPoint = manifold.getContactPoint(j);
                const d = manifoldPoint.getDistance();
                if (d <= 0.0001) {
                    const s0 = manifoldPoint.getShape0();
                    const s1 = manifoldPoint.getShape1();
                    let shape0: any;
                    let shape1: any;
                    if (s0.isCompound()) {
                        const com = Ammo.castObject(s0, Ammo.btCompoundShape) as Ammo.btCompoundShape;
                        shape0 = (com.getChildShape(manifoldPoint.m_index0) as any).wrapped;
                    } else {
                        shape0 = (s0 as any).wrapped;
                    }

                    if (s1.isCompound()) {
                        const com = Ammo.castObject(s1, Ammo.btCompoundShape) as Ammo.btCompoundShape;
                        shape1 = (com.getChildShape(manifoldPoint.m_index1) as any).wrapped;
                    } else {
                        shape1 = (s1 as any).wrapped;
                    }

                    // current contact
                    var item = this.contactsDic.get(shape0.id, shape1.id) as any;
                    if (item == null) {
                        item = this.contactsDic.set(shape0.id, shape1.id,
                            {
                                shape0: shape0,
                                shape1: shape1,
                                contacts: []
                            }
                        );
                    }
                    item.contacts.push(manifoldPoint);
                }
            }
        }

        // is enter or stay
        let dicL = this.contactsDic.getLength();
        while (dicL--) {
            for (let j = CollisionEventObject.contacts.length; j--;) {
                contactsPool.push(CollisionEventObject.contacts.pop());
            }

            const key = this.contactsDic.getKeyByIndex(dicL);
            const data = this.contactsDic.getDataByKey(key) as any;
            const shape0: AmmoShape = data.shape0;
            const shape1: AmmoShape = data.shape1;
            this.oldContactsDic.set(shape0.id, shape1.id, data);
            const collider0 = shape0.collider;
            const collider1 = shape1.collider;
            if (collider0 && collider1) {
                const isTrigger = collider0.isTrigger || collider1.isTrigger;
                if (isTrigger) {
                    if (this.triggerArrayMat.get(shape0.id, shape1.id)) {
                        TriggerEventObject.type = 'onTriggerStay';
                    } else {
                        TriggerEventObject.type = 'onTriggerEnter';
                        this.triggerArrayMat.set(shape0.id, shape1.id, true);
                    }
                    TriggerEventObject.selfCollider = collider0;
                    TriggerEventObject.otherCollider = collider1;
                    collider0.emit(TriggerEventObject.type, TriggerEventObject);

                    TriggerEventObject.selfCollider = collider1;
                    TriggerEventObject.otherCollider = collider0;
                    collider1.emit(TriggerEventObject.type, TriggerEventObject);
                } else {
                    const body0 = collider0.attachedRigidBody;
                    const body1 = collider1.attachedRigidBody;
                    if (body0 && body1) {
                        if (body0.isSleeping && body1.isSleeping) continue;
                    } else if (body0 == null && body1) {
                        if (body1.isSleeping) continue;
                    } else if (body1 == null && body0) {
                        if (body0.isSleeping) continue;
                    }
                    if (this.collisionArrayMat.get(shape0.id, shape1.id)) {
                        CollisionEventObject.type = 'onCollisionStay';
                    } else {
                        CollisionEventObject.type = 'onCollisionEnter';
                        this.collisionArrayMat.set(shape0.id, shape1.id, true);
                    }

                    for (let i = 0; i < data.contacts.length; i++) {
                        const cq = data.contacts[i] as Ammo.btManifoldPoint;
                        if (contactsPool.length > 0) {
                            const c = contactsPool.pop();
                            ammo2CocosVec3(c.contactA, cq.m_localPointA);
                            ammo2CocosVec3(c.contactB, cq.m_localPointB);
                            ammo2CocosVec3(c.normal, cq.m_normalWorldOnB);
                            CollisionEventObject.contacts.push(c);
                        } else {
                            const c = {
                                contactA: ammo2CocosVec3(new Vec3(), cq.m_localPointA),
                                contactB: ammo2CocosVec3(new Vec3(), cq.m_localPointB),
                                normal: ammo2CocosVec3(new Vec3(), cq.m_normalWorldOnB),
                            };
                            CollisionEventObject.contacts.push(c);
                        }
                    }

                    CollisionEventObject.selfCollider = collider0;
                    CollisionEventObject.otherCollider = collider1;
                    collider0.emit(CollisionEventObject.type, CollisionEventObject);

                    CollisionEventObject.selfCollider = collider1;
                    CollisionEventObject.otherCollider = collider0;
                    collider1.emit(CollisionEventObject.type, CollisionEventObject);
                }

                if (this.oldContactsDic.get(shape0.id, shape1.id) == null) {
                    this.oldContactsDic.set(shape0.id, shape1.id, data);
                }
            }
        }

        // is exit
        let oldDicL = this.oldContactsDic.getLength();
        while (oldDicL--) {
            let key = this.oldContactsDic.getKeyByIndex(oldDicL);
            let data = this.oldContactsDic.getDataByKey(key) as any;
            const shape0: AmmoShape = data.shape0;
            const shape1: AmmoShape = data.shape1;
            const collider0 = shape0.collider;
            const collider1 = shape1.collider;
            if (collider0 && collider1) {
                const isTrigger = collider0.isTrigger || collider1.isTrigger;
                if (this.contactsDic.getDataByKey(key) == null) {
                    if (isTrigger) {
                        // emit exit
                        if (this.triggerArrayMat.get(shape0.id, shape1.id)) {
                            TriggerEventObject.type = 'onTriggerExit';
                            TriggerEventObject.selfCollider = collider0;
                            TriggerEventObject.otherCollider = collider1;
                            collider0.emit(TriggerEventObject.type, TriggerEventObject);

                            TriggerEventObject.selfCollider = collider1;
                            TriggerEventObject.otherCollider = collider0;
                            collider1.emit(TriggerEventObject.type, TriggerEventObject);

                            this.triggerArrayMat.set(shape0.id, shape1.id, false);
                            this.oldContactsDic.set(shape0.id, shape1.id, null);
                        }
                    }
                    else {
                        // emit exit
                        if (this.collisionArrayMat.get(shape0.id, shape1.id)) {
                            for (let j = CollisionEventObject.contacts.length; j--;) {
                                contactsPool.push(CollisionEventObject.contacts.pop());
                            }

                            for (let i = 0; i < data.contacts.length; i++) {
                                const cq = data.contacts[i] as Ammo.btManifoldPoint;
                                if (contactsPool.length > 0) {
                                    const c = contactsPool.pop();
                                    ammo2CocosVec3(c.contactA, cq.m_localPointA);
                                    ammo2CocosVec3(c.contactB, cq.m_localPointB);
                                    ammo2CocosVec3(c.normal, cq.m_normalWorldOnB);
                                    CollisionEventObject.contacts.push(c);
                                } else {
                                    const c = {
                                        contactA: ammo2CocosVec3(new Vec3(), cq.m_localPointA),
                                        contactB: ammo2CocosVec3(new Vec3(), cq.m_localPointB),
                                        normal: ammo2CocosVec3(new Vec3(), cq.m_normalWorldOnB),
                                    };
                                    CollisionEventObject.contacts.push(c);
                                }
                            }

                            CollisionEventObject.type = 'onCollisionExit';
                            CollisionEventObject.selfCollider = collider0;
                            CollisionEventObject.otherCollider = collider1;
                            collider0.emit(CollisionEventObject.type, CollisionEventObject);

                            CollisionEventObject.selfCollider = collider1;
                            CollisionEventObject.otherCollider = collider0;
                            collider1.emit(CollisionEventObject.type, CollisionEventObject);

                            this.collisionArrayMat.set(shape0.id, shape1.id, false);
                            this.oldContactsDic.set(shape0.id, shape1.id, null);
                        }
                    }
                }
            }
        }

        this.contactsDic.reset();
    }
}
