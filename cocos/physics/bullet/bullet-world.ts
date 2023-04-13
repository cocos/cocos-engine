/* eslint-disable new-cap */
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

import { BulletSharedBody } from './bullet-shared-body';
import { BulletRigidBody } from './bullet-rigid-body';
import { BulletShape } from './shapes/bullet-shape';
import { ArrayCollisionMatrix } from '../utils/array-collision-matrix';
import { TupleDictionary } from '../utils/tuple-dictionary';
import { TriggerEventObject, CollisionEventObject, CC_V3_0, CC_V3_1, BulletCache } from './bullet-cache';
import { bullet2CocosVec3, cocos2BulletVec3 } from './bullet-utils';
import { IRaycastOptions, IPhysicsWorld } from '../spec/i-physics-world';
import { PhysicsRayResult, PhysicsMaterial } from '../framework';
import { error, RecyclePool, Vec3, js, IVec3Like, geometry } from '../../core';
import { BulletContactData } from './bullet-contact-data';
import { BulletConstraint } from './constraints/bullet-constraint';
import { bt, EBulletType, EBulletTriangleRaycastFlag } from './instantiated';
import { Node } from '../../scene-graph';

const contactsPool: BulletContactData[] = [];
const v3_0 = CC_V3_0;
const v3_1 = CC_V3_1;

export class BulletWorld implements IPhysicsWorld {
    setDefaultMaterial (v: PhysicsMaterial) { }

    setAllowSleep (v: boolean) {
        bt.ccDiscreteDynamicsWorld_setAllowSleep(this._world, v);
    }

    setGravity (gravity: IVec3Like) {
        bt.DynamicsWorld_setGravity(this._world, cocos2BulletVec3(BulletCache.instance.BT_V3_0, gravity));
    }

    updateNeedEmitEvents (v: boolean) {
        if (!this.ghosts) return; // return if destroyed
        if (v) {
            this._needEmitEvents = true;
        } else {
            this._needEmitEvents = false;
            for (let i = 0; i < this.ghosts.length; i++) {
                const ghost = this.ghosts[i];
                const shapes = ghost.ghostStruct.wrappedShapes;
                for (let j = 0; j < shapes.length; j++) {
                    const collider = shapes[j].collider;
                    if (collider.needCollisionEvent || collider.needTriggerEvent) {
                        this._needEmitEvents = true;
                        return;
                    }
                }
            }

            for (let i = 0; i < this.bodies.length; i++) {
                const body = this.bodies[i];
                const shapes = body.bodyStruct.wrappedShapes;
                for (let j = 0; j < shapes.length; j++) {
                    const collider = shapes[j].collider;
                    if (collider.needCollisionEvent || collider.needTriggerEvent) {
                        this._needEmitEvents = true;
                        return;
                    }
                }
            }
        }
    }

    get impl () {
        return this._world;
    }

    private readonly _world: Bullet.ptr;
    private readonly _broadphase: Bullet.ptr;
    private readonly _solver: Bullet.ptr;
    private readonly _dispatcher: Bullet.ptr;

    private _needEmitEvents = false;
    private _needSyncAfterEvents = false;

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
    }

    destroy (): void {
        if (this.constraints.length || this.bodies.length) error('You should destroy all physics component first.');
        bt._safe_delete(this._world, EBulletType.EBulletTypeCollisionWorld);
        bt._safe_delete(this._broadphase, EBulletType.EBulletTypeDbvtBroadPhase);
        bt._safe_delete(this._dispatcher, EBulletType.EBulletTypeCollisionDispatcher);
        bt._safe_delete(this._solver, EBulletType.EBulletTypeSequentialImpulseConstraintSolver);
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
        if (!this.bodies.length && !this.ghosts.length) return;
        if (timeSinceLastCalled === undefined) timeSinceLastCalled = deltaTime;
        bt.DynamicsWorld_stepSimulation(this._world, timeSinceLastCalled, maxSubStep, deltaTime);
    }

    syncSceneToPhysics (): void {
        // Use reverse traversal order, because update dirty will mess up the ghosts or bodyies array.
        for (let i = this.ghosts.length - 1; i >= 0; i--) {
            const ghost = this.ghosts[i]; // Use temporary object, same reason as above
            ghost.updateDirty();
            ghost.syncSceneToGhost();
        }

        for (let i = this.bodies.length - 1; i >= 0; i--) {
            const body = this.bodies[i];
            body.updateDirty();
            body.syncSceneToPhysics();
        }
    }

    syncAfterEvents (): void {
        if (!this._needSyncAfterEvents) return;
        this.syncSceneToPhysics();
    }

    raycast (worldRay: geometry.Ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
        worldRay.computeHit(v3_0, options.maxDistance);
        const to = cocos2BulletVec3(BulletCache.instance.BT_V3_0, v3_0);
        const from = cocos2BulletVec3(BulletCache.instance.BT_V3_1, worldRay.o);
        const allHitsCB = bt.ccAllRayCallback_static();
        bt.ccAllRayCallback_reset(allHitsCB, from, to, options.mask, options.queryTrigger);
        bt.ccAllRayCallback_setFlags(allHitsCB, EBulletTriangleRaycastFlag.UseSubSimplexConvexCastRaytest);
        bt.CollisionWorld_rayTest(this._world, from, to, allHitsCB);
        if (bt.RayCallback_hasHit(allHitsCB)) {
            const posArray = bt.ccAllRayCallback_getHitPointWorld(allHitsCB);
            const normalArray = bt.ccAllRayCallback_getHitNormalWorld(allHitsCB);
            const ptrArray = bt.ccAllRayCallback_getCollisionShapePtrs(allHitsCB);
            for (let i = 0, n = bt.int_array_size(ptrArray); i < n; i++) {
                bullet2CocosVec3(v3_0, bt.Vec3_array_at(posArray, i));
                bullet2CocosVec3(v3_1, bt.Vec3_array_at(normalArray, i));
                const shape = BulletCache.getWrapper<BulletShape>(bt.int_array_at(ptrArray, i), BulletShape.TYPE);
                const r = pool.add(); results.push(r);
                r._assign(v3_0, Vec3.distance(worldRay.o, v3_0), shape.collider, v3_1);
            }
            return true;
        }
        return false;
    }

    raycastClosest (worldRay: geometry.Ray, options: IRaycastOptions, result: PhysicsRayResult): boolean {
        worldRay.computeHit(v3_0, options.maxDistance);
        const to = cocos2BulletVec3(BulletCache.instance.BT_V3_0, v3_0);
        const from = cocos2BulletVec3(BulletCache.instance.BT_V3_1, worldRay.o);
        const closeHitCB = bt.ccClosestRayCallback_static();
        bt.ccClosestRayCallback_reset(closeHitCB, from, to, options.mask, options.queryTrigger);
        bt.ccClosestRayCallback_setFlags(closeHitCB, EBulletTriangleRaycastFlag.UseSubSimplexConvexCastRaytest);
        bt.CollisionWorld_rayTest(this._world, from, to, closeHitCB);
        if (bt.RayCallback_hasHit(closeHitCB)) {
            bullet2CocosVec3(v3_0, bt.ccClosestRayCallback_getHitPointWorld(closeHitCB));
            bullet2CocosVec3(v3_1, bt.ccClosestRayCallback_getHitNormalWorld(closeHitCB));
            const shape = BulletCache.getWrapper<BulletShape>(bt.ccClosestRayCallback_getCollisionShapePtr(closeHitCB), BulletShape.TYPE);
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
            js.array.fastRemoveAt(this.bodies, i);
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
            js.array.fastRemoveAt(this.ghosts, i);
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
        this._needSyncAfterEvents = false;
        if (!this._needEmitEvents) return;
        this.gatherConatactData();
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
                    TriggerEventObject.impl = data.impl; //btPersistentManifold
                    TriggerEventObject.selfCollider = collider0;
                    TriggerEventObject.otherCollider = collider1;
                    collider0.emit(TriggerEventObject.type, TriggerEventObject);

                    TriggerEventObject.selfCollider = collider1;
                    TriggerEventObject.otherCollider = collider0;
                    collider1.emit(TriggerEventObject.type, TriggerEventObject);
                    this._needSyncAfterEvents = true;
                } else {
                    const body0 = collider0.attachedRigidBody;
                    const body1 = collider1.attachedRigidBody;
                    if (body0 && body1) {
                        if (body0.isSleeping && body1.isSleeping) continue;
                    } else if (!body0 && body1) {
                        if (body1.isSleeping) continue;
                    } else if (!body1 && body0) {
                        if (body0.isSleeping) continue;
                    }
                    if (this.collisionArrayMat.get(shape0.id, shape1.id)) {
                        CollisionEventObject.type = 'onCollisionStay';
                    } else {
                        CollisionEventObject.type = 'onCollisionEnter';
                        this.collisionArrayMat.set(shape0.id, shape1.id, true);
                    }

                    for (let i = 0; i < data.contacts.length; i++) {
                        const cq = data.contacts[i]; //btManifoldPoint
                        if (contactsPool.length > 0) {
                            const c = contactsPool.pop();
                            c!.impl = cq; //btManifoldPoint
                            CollisionEventObject.contacts.push(c!);
                        } else {
                            const c = new BulletContactData(CollisionEventObject);
                            c.impl = cq; //btManifoldPoint
                            CollisionEventObject.contacts.push(c);
                        }
                    }
                    CollisionEventObject.impl = data.impl; //btPersistentManifold
                    CollisionEventObject.selfCollider = collider0;
                    CollisionEventObject.otherCollider = collider1;
                    collider0.emit(CollisionEventObject.type, CollisionEventObject);

                    CollisionEventObject.selfCollider = collider1;
                    CollisionEventObject.otherCollider = collider0;
                    collider1.emit(CollisionEventObject.type, CollisionEventObject);
                    this._needSyncAfterEvents = true;
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
                            this._needSyncAfterEvents = true;
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
                        this._needSyncAfterEvents = true;
                    }
                }
            }
        }

        this.contactsDic.reset();
    }

    gatherConatactData () {
        const numManifolds = bt.Dispatcher_getNumManifolds(this._dispatcher);
        for (let i = 0; i < numManifolds; i++) {
            const manifold = bt.Dispatcher_getManifoldByIndexInternal(this._dispatcher, i);//btPersistentManifold
            const numContacts = bt.PersistentManifold_getNumContacts(manifold);
            for (let j = 0; j < numContacts; j++) {
                const manifoldPoint = bt.PersistentManifold_getContactPoint(manifold, j);//btManifoldPoint
                const s0 = bt.ManifoldPoint_getShape0(manifoldPoint);
                const s1 = bt.ManifoldPoint_getShape1(manifoldPoint);
                const shape0: BulletShape = BulletCache.getWrapper(s0, BulletShape.TYPE);
                const shape1: BulletShape = BulletCache.getWrapper(s1, BulletShape.TYPE);
                if (shape0.collider.needTriggerEvent || shape1.collider.needTriggerEvent
                    || shape0.collider.needCollisionEvent || shape1.collider.needCollisionEvent
                ) {
                    // current contact
                    let item = this.contactsDic.get<any>(shape0.id, shape1.id);
                    if (!item) {
                        item = this.contactsDic.set(shape0.id, shape1.id,
                            { shape0, shape1, contacts: [], impl: manifold });
                    }
                    item.contacts.push(manifoldPoint);//btManifoldPoint
                }
            }
        }
    }
}
