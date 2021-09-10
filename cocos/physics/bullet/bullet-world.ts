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

import { BulletSharedBody } from './bullet-shared-body';
import { BulletRigidBody } from './bullet-rigid-body';
import { BulletShape } from './shapes/bullet-shape';
import { ArrayCollisionMatrix } from '../utils/array-collision-matrix';
import { TupleDictionary } from '../utils/tuple-dictionary';
import { TriggerEventObject, CollisionEventObject, CC_V3_0, CC_V3_1, BulletConst } from './bullet-const';
import { bullet2CocosVec3, cocos2BulletVec3 } from './bullet-utils';
import { Ray } from '../../core/geometry';
import { IRaycastOptions, IPhysicsWorld } from '../spec/i-physics-world';
import { PhysicsRayResult, PhysicsMaterial } from '../framework';
import { error, Node, RecyclePool, Vec3 } from '../../core';
import { IVec3Like } from '../../core/math/type-define';
import { BulletContactData } from './bullet-contact-data';
import { BulletConstraint } from './constraints/bullet-constraint';
import { fastRemoveAt } from '../../core/utils/array';
import { bt } from './bullet.asmjs';

const contactsPool: BulletContactData[] = [];
const v3_0 = CC_V3_0;
const v3_1 = CC_V3_1;

export class BulletWorld implements IPhysicsWorld {
    setAllowSleep (v: boolean) {
        bt.ccDiscreteDynamicsWorld_setAllowSleep(this._world, v);
    }

    setDefaultMaterial (v: PhysicsMaterial) { }

    setGravity (gravity: IVec3Like) {
        const TMP = BulletConst.instance.BT_V3_0;
        cocos2BulletVec3(TMP, gravity);
        bt.DynamicsWorld_setGravity(this._world, TMP);
    }

    get impl () {
        return this._world;
    }

    private readonly _world: Bullet.ptr;
    private readonly _broadphase: Bullet.ptr;
    private readonly _solver: Bullet.ptr;
    private readonly _dispatcher: Bullet.ptr;

    readonly bodies: BulletSharedBody[] = [];
    readonly ghosts: BulletSharedBody[] = [];
    readonly constraints: BulletConstraint[] = [];
    readonly triggerArrayMat = new ArrayCollisionMatrix();
    readonly collisionArrayMat = new ArrayCollisionMatrix();
    readonly contactsDic = new TupleDictionary();
    readonly oldContactsDic = new TupleDictionary();

    constructor () {
        this._broadphase = bt.DbvtBroadphase_new();
        this._dispatcher = bt.CollisionDispatcher_new();
        this._solver = bt.SequentialImpulseConstraintSolver_new();
        this._world = bt.ccDiscreteDynamicsWorld_new(this._dispatcher, this._broadphase, this._solver);
        const TMP = BulletConst.instance.BT_V3_0;
        bt.Vec3_set(TMP, 0, -10, 0);
        bt.DynamicsWorld_setGravity(this._world, TMP);
    }

    destroy (): void {
        if (this.constraints.length || this.bodies.length) error('You should destroy all physics component first.');
        bt.CollisionWorld_del(this._world);
        bt.DbvtBroadphase_del(this._broadphase);
        bt.CollisionDispatcher_del(this._dispatcher);
        bt.SequentialImpulseConstraintSolver_del(this._solver);
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
        bt.DynamicsWorld_stepSimulation(this._world, timeSinceLastCalled, maxSubStep, deltaTime);

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

    raycast (worldRay: Ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
        worldRay.computeHit(v3_0, options.maxDistance);
        const to = cocos2BulletVec3(BulletConst.instance.BT_V3_0, v3_0);
        const from = cocos2BulletVec3(BulletConst.instance.BT_V3_1, worldRay.o);
        const allHitsCB = bt.ccAllRayCallback_static();
        bt.ccAllRayCallback_reset(allHitsCB, from, to, options.mask, options.queryTrigger);
        bt.CollisionWorld_rayTest(this._world, from, to, allHitsCB);
        if (bt.RayCallback_hasHit(allHitsCB)) {
            const posArray = bt.ccAllRayCallback_getHitPointWorld(allHitsCB);
            const normalArray = bt.ccAllRayCallback_getHitNormalWorld(allHitsCB);
            const ptrArray = bt.ccAllRayCallback_getCollisionShapePtrs(allHitsCB);
            for (let i = 0, n = bt.int_array_size(ptrArray); i < n; i++) {
                bullet2CocosVec3(v3_0, bt.Vec3_array_at(posArray, i));
                bullet2CocosVec3(v3_1, bt.Vec3_array_at(normalArray, i)); 
                const shape = BulletConst.getWrapper<BulletShape>(bt.int_array_at(ptrArray, i));
                const r = pool.add(); results.push(r);
                r._assign(v3_0, Vec3.distance(worldRay.o, v3_0), shape.collider, v3_1);
            }
            return true;
        }
        return false;
    }

    raycastClosest (worldRay: Ray, options: IRaycastOptions, result: PhysicsRayResult): boolean {
        worldRay.computeHit(v3_0, options.maxDistance);
        const to = cocos2BulletVec3(BulletConst.instance.BT_V3_0, v3_0);
        const from = cocos2BulletVec3(BulletConst.instance.BT_V3_1, worldRay.o);
        const closeHitCB = bt.ccClosestRayCallback_static();
        bt.ccClosestRayCallback_reset(closeHitCB, from, to, options.mask, options.queryTrigger);
        bt.CollisionWorld_rayTest(this._world, from, to, closeHitCB);
        if (bt.RayCallback_hasHit(closeHitCB)) {
            bullet2CocosVec3(v3_0, bt.ccClosestRayCallback_getHitPointWorld(closeHitCB));
            bullet2CocosVec3(v3_1, bt.ccClosestRayCallback_getHitNormalWorld(closeHitCB));
            const shape = BulletConst.getWrapper<BulletShape>(bt.ccClosestRayCallback_getCollisionShapePtr(closeHitCB));
            result._assign(v3_0, Vec3.distance(worldRay.o, v3_0), shape.collider, v3_1);
            return true;
        }
        return false;
    }

    getSharedBody (node: Node, wrappedBody?: BulletRigidBody) {
        return BulletSharedBody.getSharedBody(node, this, wrappedBody);
    }

    addSharedBody (sharedBody: BulletSharedBody) {
        const i = this.bodies.indexOf(sharedBody);
        if (i < 0) {
            this.bodies.push(sharedBody);
            bt.DynamicsWorld_addRigidBody(this._world, sharedBody.body, sharedBody.collisionFilterGroup, sharedBody.collisionFilterMask);
        }
    }

    removeSharedBody (sharedBody: BulletSharedBody) {
        const i = this.bodies.indexOf(sharedBody);
        if (i >= 0) {
            fastRemoveAt(this.bodies, i);
            bt.DynamicsWorld_removeRigidBody(this._world, sharedBody.body);
        }
    }

    addGhostObject (sharedBody: BulletSharedBody) {
        const i = this.ghosts.indexOf(sharedBody);
        if (i < 0) {
            this.ghosts.push(sharedBody);
            bt.CollisionWorld_addCollisionObject(this._world, sharedBody.ghost, sharedBody.collisionFilterGroup, sharedBody.collisionFilterMask);
        }
    }

    removeGhostObject (sharedBody: BulletSharedBody) {
        const i = this.ghosts.indexOf(sharedBody);
        if (i >= 0) {
            fastRemoveAt(this.ghosts, i);
            bt.CollisionWorld_removeCollisionObject(this._world, sharedBody.ghost);
        }
    }

    addConstraint (constraint: BulletConstraint) {
        const i = this.constraints.indexOf(constraint);
        if (i < 0) {
            this.constraints.push(constraint);
            bt.DynamicsWorld_addConstraint(this.impl, constraint.impl, !constraint.constraint.enableCollision);
            constraint.index = i;
        }
    }

    removeConstraint (constraint: BulletConstraint) {
        const i = this.constraints.indexOf(constraint);
        if (i >= 0) {
            this.constraints.splice(i, 1);
            bt.DynamicsWorld_removeConstraint(this.impl, constraint.impl);
            constraint.index = -1;
        }
    }

    emitEvents () {
        // const numManifolds = bt.Dispatcher_getNumManifolds(this._dispatcher);
        // for (let i = 0; i < numManifolds; i++) {
        //     const manifold = bt.Dispatcher_getManifoldByIndexInternal(this._dispatcher, i);
        //     // const body0 = bt.PersistentManifold_getBody0(manifold);
        //     // const body1 = bt.PersistentManifold_getBody1(manifold);

        //     // // TODO: SUPPORT CHARACTER EVENT
        //     // if (body0.useCharacter || body1.useCharacter) { continue; }

        //     const numContacts = bt.PersistentManifold_getNumContacts(manifold);
        //     for (let j = 0; j < numContacts; j++) {
        //         // const manifoldPoint: Ammo.btManifoldPoint = manifold.getContactPoint(j);
        //         // const s0 = body0.getCollisionShape();
        //         // const s1 = body1.getCollisionShape();
        //         const manifoldPoint = bt.PersistentManifold_getContactPoint(manifold, j);
        //         const s0 = bt.ManifoldPoint_getShape0(manifoldPoint);
        //         const s1 = bt.ManifoldPoint_getShape1(manifoldPoint);
        //         let shape0: BulletShape;
        //         let shape1: BulletShape;
        //         if (bt.CollisionShape_isCompound(s0)) {
        //             const index0 = bt.ManifoldPoint_get_m_index0(manifoldPoint);
        //             shape0 = bt.getObjByPtr(bt.CompoundShape_getChildShape(s0, index0));
        //         } else {
        //             // shape0 = s0.wrapped;
        //             shape0 = bt.getObjByPtr(s0);
        //         }

        //         if (!shape0) continue;

        //         if (bt.CollisionShape_isCompound(s1)) {
        //             const index1 = bt.ManifoldPoint_get_m_index1(manifoldPoint);
        //             shape1 = bt.getObjByPtr(bt.CompoundShape_getChildShape(s1, index1));
        //         } else {
        //             // shape1 = s1.wrapped;
        //             shape1 = bt.getObjByPtr(s1);
        //         }

        //         if (!shape1) continue;

        //         if (shape0.collider.needTriggerEvent
        //             || shape1.collider.needTriggerEvent
        //             || shape0.collider.needCollisionEvent
        //             || shape1.collider.needCollisionEvent
        //         ) {
        //             // current contact
        //             let item = this.contactsDic.get<any>(shape0.id, shape1.id);
        //             if (item == null) {
        //                 item = this.contactsDic.set(shape0.id, shape1.id,
        //                     {
        //                         shape0,
        //                         shape1,
        //                         contacts: [],
        //                         impl: manifold,
        //                     });
        //             }
        //             item.contacts.push(manifoldPoint);
        //         }
        //     }
        // }

        // is enter or stay
        let dicL = this.contactsDic.getLength();
        while (dicL--) {
            contactsPool.push.apply(contactsPool, CollisionEventObject.contacts as BulletContactData[]);
            CollisionEventObject.contacts.length = 0;
            const key = this.contactsDic.getKeyByIndex(dicL);
            const data = this.contactsDic.getDataByKey<any>(key);
            const shape0: BulletShape = data.shape0;
            const shape1: BulletShape = data.shape1;
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
                        const cq = data.contacts[i];
                        if (contactsPool.length > 0) {
                            const c = contactsPool.pop();
                            c!.impl = cq;
                            CollisionEventObject.contacts.push(c!);
                        } else {
                            const c = new BulletContactData(CollisionEventObject);
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
            const shape0: BulletShape = data.shape0;
            const shape1: BulletShape = data.shape1;
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
                        contactsPool.push.apply(contactsPool, CollisionEventObject.contacts as BulletContactData[]);
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
