/* eslint-disable new-cap */
/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
 */

/**
 * @packageDocumentation
 * @hidden
 */

import Ammo from './ammo-instantiated';
import { Vec3 } from '../../core/math';
import { AmmoSharedBody } from './ammo-shared-body';
import { AmmoRigidBody } from './ammo-rigid-body';
import { AmmoShape } from './shapes/ammo-shape';
import { ArrayCollisionMatrix } from '../utils/array-collision-matrix';
import { TupleDictionary } from '../utils/tuple-dictionary';
import { TriggerEventObject, CollisionEventObject, CC_V3_0, CC_V3_1, AmmoConstant } from './ammo-const';
import { ammo2CocosVec3, cocos2AmmoVec3, cocos2AmmoQuat } from './ammo-util';
import { Ray } from '../../core/geometry';
import { IRaycastOptions, IPhysicsWorld } from '../spec/i-physics-world';
import { PhysicsRayResult, PhysicsMaterial } from '../framework';
import { error, Node, RecyclePool } from '../../core';
import { AmmoInstance } from './ammo-instance';
import { IVec3Like } from '../../core/math/type-define';
import { AmmoContactEquation } from './ammo-contact-equation';
import { AmmoConstraint } from './constraints/ammo-constraint';
import { fastRemoveAt } from '../../core/utils/array';

const contactsPool: AmmoContactEquation[] = [];
const v3_0 = CC_V3_0;
const v3_1 = CC_V3_1;

export class AmmoWorld implements IPhysicsWorld {
    setAllowSleep (v: boolean) { }
    setDefaultMaterial (v: PhysicsMaterial) { }

    setGravity (gravity: IVec3Like) {
        const TMP = AmmoConstant.instance.VECTOR3_0;
        cocos2AmmoVec3(TMP, gravity);
        this._btWorld.setGravity(TMP);
    }

    get impl () {
        return this._btWorld;
    }

    private readonly _btWorld: Ammo.btDiscreteDynamicsWorld;
    private readonly _btBroadphase: Ammo.btDbvtBroadphase;
    private readonly _btSolver: Ammo.btSequentialImpulseConstraintSolver;
    private readonly _btDispatcher: Ammo.btCollisionDispatcher;
    private readonly _btCollisionConfiguration: Ammo.btDefaultCollisionConfiguration;

    readonly bodies: AmmoSharedBody[] = [];
    readonly ghosts: AmmoSharedBody[] = [];
    readonly constraints: AmmoConstraint[] = [];
    readonly triggerArrayMat = new ArrayCollisionMatrix();
    readonly collisionArrayMat = new ArrayCollisionMatrix();
    readonly contactsDic = new TupleDictionary();
    readonly oldContactsDic = new TupleDictionary();

    static closeHitCB: Ammo.ccClosestRayResultCallback;
    static allHitsCB: Ammo.ccAllHitsRayResultCallback;

    constructor (options?: any) {
        this._btCollisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        this._btDispatcher = new Ammo.btCollisionDispatcher(this._btCollisionConfiguration);
        // this._btDispatcher.setDispatcherFlags(AmmoDispatcherFlags.CD_STATIC_STATIC_REPORTED);
        this._btBroadphase = new Ammo.btDbvtBroadphase();
        this._btSolver = new Ammo.btSequentialImpulseConstraintSolver();
        this._btWorld = new (Ammo as any).ccDiscreteDynamicsWorld(this._btDispatcher, this._btBroadphase, this._btSolver, this._btCollisionConfiguration);
        this._btWorld.getPairCache().setOverlapFilterCallback(new Ammo.ccOverlapFilterCallback());
        // this._btWorld.setContactBreakingThreshold(0.04);
        const TMP = AmmoConstant.instance.VECTOR3_0;
        TMP.setValue(0, -10, 0);
        this._btWorld.setGravity(TMP);
        if (!AmmoWorld.closeHitCB) AmmoWorld.closeHitCB = new Ammo.ccClosestRayResultCallback(TMP, TMP);
        if (!AmmoWorld.allHitsCB) AmmoWorld.allHitsCB = new Ammo.ccAllHitsRayResultCallback(TMP, TMP);
    }

    destroy (): void {
        if (this.constraints.length || this.bodies.length) error('You should destroy all physics component first.');
        Ammo.destroy(this._btWorld);
        Ammo.destroy(this._btSolver);
        Ammo.destroy(this._btBroadphase);
        Ammo.destroy(this._btDispatcher);
        Ammo.destroy(this._btCollisionConfiguration);
        (this as any)._btCollisionConfiguration = null;
        (this as any)._btDispatcher = null;
        (this as any)._btBroadphase = null;
        (this as any)._btSolver = null;
        (this as any)._btWorld = null;
        (this as any).bodies = null;
        (this as any).ghosts = null;
        (this as any).constraints = null;
        (this as any).triggerArrayMat = null;
        (this as any).collisionArrayMat = null;
        (this as any).contactsDic = null;
        (this as any).oldContactsDic = null;
        contactsPool.length = 0;
    }

    step (deltaTime: number, timeSinceLastCalled?: number, maxSubStep = 0) {
        if (this.bodies.length === 0 && this.ghosts.length === 0) return;
        if (timeSinceLastCalled === undefined) timeSinceLastCalled = deltaTime;
        this._btWorld.stepSimulation(timeSinceLastCalled, maxSubStep, deltaTime);

        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].syncPhysicsToScene();
        }
    }

    syncSceneToPhysics (): void {
        for (let i = 0; i < this.ghosts.length; i++) {
            this.ghosts[i].updateDirty();
            this.ghosts[i].syncSceneToGhost();
        }

        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].updateDirty();
            this.bodies[i].syncSceneToPhysics();
        }
    }

    syncAfterEvents (): void {
        this.syncSceneToPhysics();
    }

    // TODO: support query triggers
    raycast (worldRay: Ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
        const allHitsCB = AmmoWorld.allHitsCB;
        const from = cocos2AmmoVec3(allHitsCB.m_rayFromWorld, worldRay.o);
        worldRay.computeHit(v3_0, options.maxDistance);
        const to = cocos2AmmoVec3(allHitsCB.m_rayToWorld, v3_0);
        allHitsCB.m_collisionFilterGroup = -1;
        allHitsCB.m_collisionFilterMask = options.mask;
        allHitsCB.m_closestHitFraction = 1;
        (allHitsCB.m_collisionObject as any) = null;
        allHitsCB.m_shapeParts.clear();
        allHitsCB.m_hitFractions.clear();
        allHitsCB.m_collisionObjects.clear();
        const hp = allHitsCB.m_hitPointWorld;
        const hn = allHitsCB.m_hitNormalWorld;
        hp.clear();
        hn.clear();
        this._btWorld.rayTest(from, to, allHitsCB);
        if (allHitsCB.hasHit()) {
            for (let i = 0, n = allHitsCB.m_collisionObjects.size(); i < n; i++) {
                const btObj = allHitsCB.m_collisionObjects.at(i);
                const btCs = btObj.getCollisionShape();
                let shape: AmmoShape;
                if (btCs.isCompound()) {
                    const shapeIndex = allHitsCB.m_shapeParts.at(i);
                    const index = btObj.getUserIndex();
                    const shared = AmmoInstance.bodyAndGhosts[index];
                    shape = shared.wrappedShapes[shapeIndex];
                } else {
                    shape = (btCs as any).wrapped;
                }
                ammo2CocosVec3(v3_0, hp.at(i));
                ammo2CocosVec3(v3_1, hn.at(i));
                const distance = Vec3.distance(worldRay.o, v3_0);
                const r = pool.add();
                r._assign(v3_0, distance, shape.collider, v3_1);
                results.push(r);
            }
            return true;
        }
        return false;
    }

    // TODO: support query triggers
    raycastClosest (worldRay: Ray, options: IRaycastOptions, result: PhysicsRayResult): boolean {
        const closeHitCB = AmmoWorld.closeHitCB;
        const from = cocos2AmmoVec3(closeHitCB.m_rayFromWorld, worldRay.o);
        worldRay.computeHit(v3_0, options.maxDistance);
        const to = cocos2AmmoVec3(closeHitCB.m_rayToWorld, v3_0);

        closeHitCB.m_collisionFilterGroup = -1;
        closeHitCB.m_collisionFilterMask = options.mask;
        closeHitCB.m_closestHitFraction = 1;
        (closeHitCB.m_collisionObject as any) = null;

        this._btWorld.rayTest(from, to, closeHitCB);
        if (closeHitCB.hasHit()) {
            const btObj = closeHitCB.m_collisionObject;
            const btCs = btObj.getCollisionShape();
            let shape: AmmoShape;
            if (btCs.isCompound()) {
                const index = btObj.getUserIndex();
                const shared = AmmoInstance.bodyAndGhosts[index];
                const shapeIndex = closeHitCB.m_shapePart;
                shape = shared.wrappedShapes[shapeIndex];
            } else {
                shape = (btCs as any).wrapped;
            }
            ammo2CocosVec3(v3_0, closeHitCB.m_hitPointWorld);
            ammo2CocosVec3(v3_1, closeHitCB.m_hitNormalWorld);
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
            fastRemoveAt(this.bodies, i);
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
            fastRemoveAt(this.ghosts, i);
            this._btWorld.removeCollisionObject(sharedBody.ghost);
        }
    }

    addConstraint (constraint: AmmoConstraint) {
        const i = this.constraints.indexOf(constraint);
        if (i < 0) {
            this.constraints.push(constraint);
            this._btWorld.addConstraint(constraint.impl, !constraint.constraint.enableCollision);
            constraint.index = i;
        }
    }

    removeConstraint (constraint: AmmoConstraint) {
        const i = this.constraints.indexOf(constraint);
        if (i >= 0) {
            this.constraints.splice(i, 1);
            this._btWorld.removeConstraint(constraint.impl);
            constraint.index = -1;
        }
    }

    emitEvents () {
        const numManifolds = this._btDispatcher.getNumManifolds();
        for (let i = 0; i < numManifolds; i++) {
            const manifold = this._btDispatcher.getManifoldByIndexInternal(i);
            const body0 = manifold.getBody0() as any;
            const body1 = manifold.getBody1() as any;

            // TODO: SUPPORT CHARACTER EVENT
            if (body0.useCharacter || body1.useCharacter) { continue; }

            const numContacts = manifold.getNumContacts();
            for (let j = 0; j < numContacts; j++) {
                const manifoldPoint: Ammo.btManifoldPoint = manifold.getContactPoint(j);
                const s0 = manifoldPoint.getShape0();
                const s1 = manifoldPoint.getShape1();
                let shape0: AmmoShape;
                let shape1: AmmoShape;
                if (s0.isCompound()) {
                    const com = Ammo.castObject(s0, Ammo.btCompoundShape);
                    shape0 = (com.getChildShape(manifoldPoint.m_index0) as any).wrapped;
                } else {
                    shape0 = (s0 as any).wrapped;
                }

                if (s1.isCompound()) {
                    const com = Ammo.castObject(s1, Ammo.btCompoundShape);
                    shape1 = (com.getChildShape(manifoldPoint.m_index1) as any).wrapped;
                } else {
                    shape1 = (s1 as any).wrapped;
                }

                if (!shape0 || !shape1) continue;

                if (shape0.collider.needTriggerEvent
                    || shape1.collider.needTriggerEvent
                    || shape0.collider.needCollisionEvent
                    || shape1.collider.needCollisionEvent
                ) {
                    // current contact
                    let item = this.contactsDic.get<any>(shape0.id, shape1.id);
                    if (item == null) {
                        item = this.contactsDic.set(shape0.id, shape1.id,
                            {
                                shape0,
                                shape1,
                                contacts: [],
                                impl: manifold,
                            });
                    }
                    item.contacts.push(manifoldPoint);
                }
            }
        }

        // is enter or stay
        let dicL = this.contactsDic.getLength();
        while (dicL--) {
            contactsPool.push.apply(contactsPool, CollisionEventObject.contacts as AmmoContactEquation[]);
            CollisionEventObject.contacts.length = 0;
            const key = this.contactsDic.getKeyByIndex(dicL);
            const data = this.contactsDic.getDataByKey<any>(key);
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
                    TriggerEventObject.impl = data.impl;
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
                            c!.impl = cq;
                            CollisionEventObject.contacts.push(c!);
                        } else {
                            const c = new AmmoContactEquation(CollisionEventObject);
                            c.impl = cq;
                            CollisionEventObject.contacts.push(c);
                        }
                    }
                    CollisionEventObject.impl = data.impl;
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
            const key = this.oldContactsDic.getKeyByIndex(oldDicL);
            const data = this.oldContactsDic.getDataByKey<any>(key);
            const shape0: AmmoShape = data.shape0;
            const shape1: AmmoShape = data.shape1;
            const collider0 = shape0.collider;
            const collider1 = shape1.collider;
            if (collider0 && collider1) {
                const isTrigger = collider0.isTrigger || collider1.isTrigger;
                if (this.contactsDic.getDataByKey(key) == null) {
                    if (isTrigger) {
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
                    } else if (this.collisionArrayMat.get(shape0.id, shape1.id)) {
                        contactsPool.push.apply(contactsPool, CollisionEventObject.contacts as AmmoContactEquation[]);
                        CollisionEventObject.contacts.length = 0;

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

        this.contactsDic.reset();
    }
}
