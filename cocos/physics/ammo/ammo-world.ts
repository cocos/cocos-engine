import Ammo from 'ammo.js';
import { Vec3 } from "../../core/math";
import { AmmoSharedBody } from "./ammo-shared-body";
import { AmmoRigidBody } from "./ammo-rigid-body";
import { AmmoShape } from './shapes/ammo-shape';
import { ArrayCollisionMatrix } from '../utils/array-collision-matrix';
import { TupleDictionary } from '../utils/tuple-dictionary';
import { TriggerEventObject, CollisionEventObject } from './ammo-const';
import { Ammo2CocosVec3, Cocos2AmmoVec3 } from './ammo-util';
import { ray } from '../../core/geom-utils';
import { IRaycastOptions, IPhysicsWorld } from '../spec/i-physics-world';
import { PhysicsRayResult, PhysicMaterial } from '../framework';
import { Node, RecyclePool } from '../../core';
import { AmmoInstance } from './ammo-instance';
import { AmmoCollisionFilterGroups } from './ammo-enum';

const contactsPool = [] as any;

export class AmmoWorld implements IPhysicsWorld {

    set allowSleep (v: boolean) { };
    set defaultMaterial (v: PhysicMaterial) { };

    set gravity (gravity: Vec3) {
        Cocos2AmmoVec3(this._btGravity, gravity);
        this._world.setGravity(this._btGravity);
    }

    get world () {
        return this._world;
    }

    private readonly _world: Ammo.btDiscreteDynamicsWorld;
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

    constructor (options?: any) {
        const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        this._btDispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
        this._btBroadphase = new Ammo.btDbvtBroadphase();
        // this._btBroadphase.getOverlappingPairCache().setInternalGhostPairCallback(new Ammo.btGhostPairCallback());
        this._btSolver = new Ammo.btSequentialImpulseConstraintSolver();
        this._world = new Ammo.btDiscreteDynamicsWorld(this._btDispatcher, this._btBroadphase, this._btSolver, collisionConfiguration);
        this._btGravity = new Ammo.btVector3(0, -10, 0);
        this._world.setGravity(this._btGravity);

        // btGImpactCollisionAlgorithm::registerAlgorithm((btCollisionDispatcher *)dispatcher);

        // /** shared static body */
        // {
        //     this.sharedStaticCompoundShape = new Ammo.btCompoundShape(true);
        //     let localInertia = new Ammo.btVector3(0, 0, 0);
        //     this.sharedStaticCompoundShape.calculateLocalInertia(0, localInertia);
        //     let myMotionState = new Ammo.btDefaultMotionState();
        //     let rbInfo = new Ammo.btRigidBodyConstructionInfo(0, myMotionState, this.sharedStaticCompoundShape, localInertia);
        //     this.sharedStaticBody = new Ammo.btRigidBody(rbInfo);

        //     /** TODO: change to btCollisionObject */
        //     // this.sharedStaticBody = new Ammo.btCollisionObject();

        //     this._btWorld.addCollisionObject(this.sharedStaticBody);
        //     this.sharedStaticBody.setUserIndex(-2);
        // }

        // /** shared trigger body */
        // {
        //     this.sharedTriggerCompoundShape = new Ammo.btCompoundShape(true);
        //     let localInertia = new Ammo.btVector3(0, 0, 0);
        //     this.sharedTriggerCompoundShape.calculateLocalInertia(0, localInertia);
        //     let myMotionState = new Ammo.btDefaultMotionState();
        //     let rbInfo = new Ammo.btRigidBodyConstructionInfo(0, myMotionState, this.sharedTriggerCompoundShape, localInertia);
        //     this.sharedTriggerBody = new Ammo.btRigidBody(rbInfo);

        //     /** TODO: change to btCollisionObject */
        //     // this.sharedTriggerBody = new Ammo.btCollisionObject();

        //     this.sharedTriggerBody.setCollisionFlags(AmmoCollisionFlags.CF_NO_CONTACT_RESPONSE);
        //     this._btWorld.addCollisionObject(this.sharedTriggerBody);
        //     this.sharedTriggerBody.setUserIndex(-3);
        // }

    }

    step (timeStep: number, fixTimeStep?: number, maxSubStep?: number) {

        for (let i = 0; i < this.ghosts.length; i++) {
            this.ghosts[i].syncSceneToGhost();
        }

        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].syncSceneToPhysics();
        }

        this._world.stepSimulation(timeStep, maxSubStep, fixTimeStep);

        for (let i = 0; i < this.bodies.length; i++) {
            this.bodies[i].syncPhysicsToScene();
        }

        const numManifolds = this._btDispatcher.getNumManifolds();
        for (let i = 0; i < numManifolds; i++) {
            const manifold = this._btDispatcher.getManifoldByIndexInternal(i);
            const body0 = manifold.getBody0();
            const body1 = manifold.getBody1();
            const index0 = body0.getUserIndex();
            const index1 = body1.getUserIndex();
            const numContacts = manifold.getNumContacts();
            for (let j = 0; j < numContacts; j++) {
                const manifoldPoint: Ammo.btManifoldPoint = manifold.getContactPoint(j);
                const d = manifoldPoint.getDistance();
                if (d <= 0.0001) {
                    const key0 = 'KEY' + index0;
                    const key1 = 'KEY' + index1;
                    const shared0 = AmmoInstance.bodyAndGhosts[key0];
                    const shared1 = AmmoInstance.bodyAndGhosts[key1];
                    const shape0 = shared0.wrappedShapes[manifoldPoint.m_index0];
                    const shape1 = shared1.wrappedShapes[manifoldPoint.m_index1];

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

                    // physics material
                    if (shape0.sharedMaterial && shape1.sharedMaterial) {
                        manifoldPoint.m_combinedFriction = shape0.sharedMaterial.friction * shape1.sharedMaterial.friction;
                        manifoldPoint.m_combinedRestitution = shape0.sharedMaterial.restitution * shape1.sharedMaterial.restitution;
                    }
                }
            }
        }

        this.emitEvents();
    }

    raycast (worldRay: ray, options: IRaycastOptions, pool: RecyclePool<PhysicsRayResult>, resultes: PhysicsRayResult[]): boolean {
        throw new Error("Method not implemented.");
    }

    /**
     * Ray cast, and return information of the closest hit.
     * @return True if any body was hit.
     */
    raycastClosest (worldRay: ray, options: any, result: PhysicsRayResult): boolean {
        const ammoFrom = new Ammo.btVector3();
        const ammoTo = new Ammo.btVector3();
        // vec3CreatorToAmmo(ammoFrom, from);
        // vec3CreatorToAmmo(ammoTo, to);

        const closestRayResultCallback = new Ammo.ClosestRayResultCallback(ammoFrom, ammoTo);
        // const rayCallBack = Ammo.castObject(closestRayResultCallback, Ammo.RayResultCallback);
        // rayCallBack.set_m_closestHitFraction(1);
        // rayCallBack.set_m_collisionObject(null);
        // closestRayResultCallback.get_m_rayFromWorld().setValue(from.x, from.y, from.z);
        // closestRayResultCallback.get_m_rayToWorld().setValue(to.x, to.y, to.z);

        this._world.rayTest(ammoFrom, ammoTo, closestRayResultCallback);
        if (!closestRayResultCallback.hasHit()) {
            return false;
        }

        const ammoObject = closestRayResultCallback.get_m_collisionObject()!;
        // const wrappedBody = this._getWrappedBody(ammoObject);
        // if (!wrappedBody) {
        //     return false;
        // }

        // vec3AmmoToCreator(this._hitPoint, closestRayResultCallback.get_m_hitPointWorld());
        // vec3AmmoToCreator(this._hitNormal, closestRayResultCallback.get_m_hitNormalWorld());
        // const distance = Vec3.distance(from, this._hitPoint);

        throw new Error(`not impl.`);
        // result._assign(this._hitPoint, distance, null, wrappedBody);
        // return true;
    }

    getSharedBody (node: Node, wrappedBody?: AmmoRigidBody) {
        return AmmoSharedBody.getSharedBody(node, this, wrappedBody);
    }

    addSharedBody (sharedBody: AmmoSharedBody) {
        const i = this.bodies.indexOf(sharedBody);
        if (i < 0) {
            this.bodies.push(sharedBody);
            this._world.addRigidBody(sharedBody.body);
        }
    }

    removeSharedBody (sharedBody: AmmoSharedBody) {
        const i = this.bodies.indexOf(sharedBody);
        if (i >= 0) {
            this.bodies.splice(i, 1);
            this._world.removeRigidBody(sharedBody.body);
        }
    }

    addGhostObject (sharedBody: AmmoSharedBody) {
        const i = this.ghosts.indexOf(sharedBody);
        if (i < 0) {
            this.ghosts.push(sharedBody);
            this._world.addCollisionObject(sharedBody.ghost, AmmoCollisionFilterGroups.SensorTrigger, -1);
        }
    }

    removeGhostObject (sharedBody: AmmoSharedBody) {
        const i = this.ghosts.indexOf(sharedBody);
        if (i >= 0) {
            this.ghosts.splice(i, 1);
            this._world.removeCollisionObject(sharedBody.ghost);
        }
    }

    emitEvents () {
        // is enter or stay
        let dicL = this.contactsDic.getLength();
        while (dicL--) {
            for (let j = CollisionEventObject.contacts.length; j--;) {
                contactsPool.push(CollisionEventObject.contacts.pop());
            }

            let key = this.contactsDic.getKeyByIndex(dicL);
            let data = this.contactsDic.getDataByKey(key) as any;
            const shape0: AmmoShape = data.shape0;
            const shape1: AmmoShape = data.shape1;
            this.oldContactsDic.set(shape0.id, shape1.id, data);

            const collider0 = shape0.collider;
            const collider1 = shape1.collider;
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
                        Ammo2CocosVec3(c.contactA, cq.m_positionWorldOnA);
                        Ammo2CocosVec3(c.contactB, cq.m_positionWorldOnB);
                        Ammo2CocosVec3(c.normal, cq.m_normalWorldOnB);
                        CollisionEventObject.contacts.push(c);
                    } else {
                        const c = {
                            contactA: Ammo2CocosVec3(new Vec3(), cq.m_positionWorldOnA),
                            contactB: Ammo2CocosVec3(new Vec3(), cq.m_positionWorldOnB),
                            normal: Ammo2CocosVec3(new Vec3(), cq.m_normalWorldOnB),
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

            shape0.sharedBody.syncSceneToPhysics();
            shape1.sharedBody.syncSceneToPhysics();
        }

        /** TODO: 待一致，此处 trigger 和 collsion 事件，
         * 在碰撞盒子改变 isTrigger 后目前不会触发 exit 事件 
         * */
        // is exit
        let oldDicL = this.oldContactsDic.getLength();
        while (oldDicL--) {
            let key = this.oldContactsDic.getKeyByIndex(oldDicL);
            let data = this.oldContactsDic.getDataByKey(key) as any;
            const shape0: AmmoShape = data.shape0;
            const shape1: AmmoShape = data.shape1;
            const collider0 = shape0.collider;
            const collider1 = shape1.collider;
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
                                Ammo2CocosVec3(c.contactA, cq.m_positionWorldOnA);
                                Ammo2CocosVec3(c.contactB, cq.m_positionWorldOnB);
                                Ammo2CocosVec3(c.normal, cq.m_normalWorldOnB);
                                CollisionEventObject.contacts.push(c);
                            } else {
                                const c = {
                                    contactA: Ammo2CocosVec3(new Vec3(), cq.m_positionWorldOnA),
                                    contactB: Ammo2CocosVec3(new Vec3(), cq.m_positionWorldOnB),
                                    normal: Ammo2CocosVec3(new Vec3(), cq.m_normalWorldOnB),
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

                shape0.sharedBody.syncSceneToPhysics();
                shape1.sharedBody.syncSceneToPhysics();
            }
        }

        this.contactsDic.reset();
    }
}
