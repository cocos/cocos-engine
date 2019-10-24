import Ammo from 'ammo.js';
import { Vec3 } from "../../core/math";
import { PhysicsWorldBase, ConstraintBase } from "../api";
import { AmmoRigidBody } from "./ammo-body";
import { AmmoDebugger } from "./ammo-debugger";
import { RaycastResult } from "../raycast-result";
import { PhysicsSystem } from '../components';
import { AmmoCollisionFlags } from './ammo-enum';
import { AmmoShape } from './shapes/ammo-shape';
import { ArrayCollisionMatrix } from '../utils/array-collision-matrix';
import { ObjectCollisionMatrix } from '../utils/object-collision-matrix';
import { TupleDictionary } from '../utils/tuple-dictionary';
import { TriggerEventObject, CollisionEventObject } from './ammo-const';
import { Ammo2CocosVec3 } from './ammo-util';

export class AmmoWorld implements PhysicsWorldBase {
    defaultMaterial: any;
    setGravity (gravity: Vec3): void {
        throw new Error("Method not implemented.");
    }
    getGravity (out: Vec3): void {
        throw new Error("Method not implemented.");
    }
    getAllowSleep (): boolean {
        throw new Error("Method not implemented.");
    }
    setAllowSleep (v: boolean): void {
        throw new Error("Method not implemented.");
    }

    get gravity () {
        return this._gravity;
    }

    get impl () {
        return this._ammoWorld;
    }

    public static get instance (): AmmoWorld {
        return PhysicsSystem.instance._world as AmmoWorld;
    }

    private _customBeforeStepListener: Function[] = [];
    private _customAfterStepListener: Function[] = [];

    private _gravity: Vec3 = new Vec3(0, -9.81, 0);

    private _dispatcher: Ammo.btCollisionDispatcher;

    private _reverseBodyMap = new Map<Ammo.btRigidBody, AmmoRigidBody>();

    private _debugger: AmmoDebugger = new AmmoDebugger();

    // private _collisionEvent: CollisionEvent = new CollisionEvent();
    // private _collisionManager = new CollisionStateManager();

    private _hitPoint: Vec3 = new Vec3();
    private _hitNormal = new Vec3();

    private _ammoWorld: Ammo.btDiscreteDynamicsWorld;
    public readonly sharedStaticCompoundShape: Ammo.btCompoundShape;
    public readonly sharedStaticBody: Ammo.btRigidBody;
    public readonly sharedTriggerCompoundShape: Ammo.btCompoundShape;
    public readonly sharedTriggerBody: Ammo.btRigidBody;
    public readonly bodys: AmmoRigidBody[] = [];
    public readonly staticShapes: AmmoShape[] = [];
    public readonly triggerShapes: AmmoShape[] = [];

    public readonly triggerArrayMat = new ArrayCollisionMatrix();
    public readonly collisionArrayMat = new ArrayCollisionMatrix();
    public readonly contactsDic = new TupleDictionary();
    public readonly oldContactsDic = new TupleDictionary();

    constructor (options?: any) {
        const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
        this._dispatcher = dispatcher;
        const overlappingPairCache = new Ammo.btDbvtBroadphase();
        const solver = new Ammo.btSequentialImpulseConstraintSolver();
        this._ammoWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
        this._ammoWorld.setGravity(new Ammo.btVector3(this._gravity.x, this._gravity.y, this._gravity.z));

        /** shared static body */
        {
            this.sharedStaticCompoundShape = new Ammo.btCompoundShape(true);
            let localInertia = new Ammo.btVector3(0, 0, 0);
            this.sharedStaticCompoundShape.calculateLocalInertia(0, localInertia);
            let myMotionState = new Ammo.btDefaultMotionState();
            let rbInfo = new Ammo.btRigidBodyConstructionInfo(0, myMotionState, this.sharedStaticCompoundShape, localInertia);
            this.sharedStaticBody = new Ammo.btRigidBody(rbInfo);
            this._ammoWorld.addRigidBody(this.sharedStaticBody);
            this.sharedStaticBody.setUserIndex(-2);
            this.sharedStaticBody.setActivationState(4);
        }

        /** shared trigger body */
        {
            this.sharedTriggerCompoundShape = new Ammo.btCompoundShape(true);
            let localInertia = new Ammo.btVector3(0, 0, 0);
            this.sharedTriggerCompoundShape.calculateLocalInertia(0, localInertia);
            let myMotionState = new Ammo.btDefaultMotionState();
            let rbInfo = new Ammo.btRigidBodyConstructionInfo(0, myMotionState, this.sharedTriggerCompoundShape, localInertia);
            this.sharedTriggerBody = new Ammo.btRigidBody(rbInfo);
            this.sharedTriggerBody.setCollisionFlags(AmmoCollisionFlags.CF_NO_CONTACT_RESPONSE);
            this._ammoWorld.addRigidBody(this.sharedTriggerBody);
            this.sharedTriggerBody.setUserIndex(-3);
            this.sharedTriggerBody.setActivationState(4);
        }

    }

    public destroy () {

    }

    public step (deltaTime: number, time?: number, maxSubStep?: number) {

        for (let i = 0; i < this.bodys.length; i++) {
            this.bodys[i].beforeStep();
        }

        for (let i = 0; i < this.staticShapes.length; i++) {
            this.staticShapes[i].beforeStep();
        }

        for (let i = 0; i < this.triggerShapes.length; i++) {
            this.triggerShapes[i].beforeStep();
        }

        this._ammoWorld.stepSimulation(deltaTime, maxSubStep, time);

        for (let i = 0; i < this.bodys.length; i++) {
            this.bodys[i].afterStep();
        }

        for (let i = 0; i < this.staticShapes.length; i++) {
            this.staticShapes[i].beforeStep();
        }

        for (let i = 0; i < this.triggerShapes.length; i++) {
            this.triggerShapes[i].beforeStep();
        }

        // if (!this._debugger.avaiable) {
        //     const scene = director.getScene();
        //     if (scene) {
        //         const node = new Node('bullet-debugger');
        //         scene.addChild(node as any);
        //         this._debugger.bind(node);
        //         this._ammoWorld.setDebugDrawer(this._debugger.ammoDrawDebugger);
        //     }
        // }

        // this._debugger.clear();
        // this._ammoWorld.debugDrawWorld();
        // this._debugger.present();

        const numManifolds = this._dispatcher.getNumManifolds();
        for (let i = 0; i < numManifolds; i++) {
            const manifold = this._dispatcher.getManifoldByIndexInternal(i);
            const body0 = manifold.getBody0();
            const body1 = manifold.getBody1();
            const index0 = body0.getUserIndex();
            const index1 = body1.getUserIndex();
            const numContacts = manifold.getNumContacts();
            for (let j = 0; j < numContacts; j++) {
                const manifoldPoint: Ammo.btManifoldPoint = manifold.getContactPoint(j);
                const d = manifoldPoint.getDistance();
                if (d <= 0) {
                    let shape0: AmmoShape;
                    if (index0 == -2) {
                        shape0 = this.staticShapes[manifoldPoint.m_index0];
                    } else if (index0 == -3) {
                        shape0 = this.triggerShapes[manifoldPoint.m_index0];
                    } else {
                        shape0 = this.bodys[index0].shapes[manifoldPoint.m_index0];
                    }

                    let shape1: AmmoShape;
                    if (index1 == -2) {
                        shape1 = this.staticShapes[manifoldPoint.m_index1];
                    } else if (index1 == -3) {
                        shape1 = this.triggerShapes[manifoldPoint.m_index1];
                    } else {
                        shape1 = this.bodys[index1].shapes[manifoldPoint.m_index1];
                    }
                    /** TODO */
                    // if shape0 & shape1 not care events, just continue

                    // Current contact
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
        var i = this.contactsDic.getLength();
        var key: string;
        var data: any;
        while (i--) {
            for (let j = CollisionEventObject.contacts.length; j--;) {
                contactsPool.push(CollisionEventObject.contacts.pop());
            }

            key = this.contactsDic.getKeyByIndex(i);
            data = this.contactsDic.getDataByKey(key);
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

                for (i = 0; i < data.contacts.length; i++) {
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
                break;
            }
            if (this.oldContactsDic.get(shape0.id, shape1.id) == null) {
                this.oldContactsDic.set(shape0.id, shape1.id, data);
            }
        }

        // is exit
        i = this.oldContactsDic.getLength();
        while (i--) {
            key = this.oldContactsDic.getKeyByIndex(i);
            data = this.oldContactsDic.getDataByKey(key);
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

                        for (i = 0; i < data.contacts.length; i++) {
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
            }
        }

        this.contactsDic.reset();
    }

    public addBeforeStep (cb: Function) {
        this._customBeforeStepListener.push(cb);
    }

    public removeBeforeStep (cb: Function) {
        const i = this._customBeforeStepListener.indexOf(cb);
        if (i < 0) {
            return;
        }
        this._customBeforeStepListener.splice(i, 1);
    }

    public addAfterStep (cb: Function) {
        this._customAfterStepListener.push(cb);
    }

    public removeAfterStep (cb: Function) {
        const i = this._customAfterStepListener.indexOf(cb);
        if (i < 0) {
            return;
        }
        this._customAfterStepListener.splice(i, 1);
    }

    /**
     * Ray cast, and return information of the closest hit.
     * @return True if any body was hit.
     */
    public raycastClosest (from: Vec3, to: Vec3, options: any, result: RaycastResult): boolean {
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

        this._ammoWorld.rayTest(ammoFrom, ammoTo, closestRayResultCallback);
        if (!closestRayResultCallback.hasHit()) {
            return false;
        }

        const ammoObject = closestRayResultCallback.get_m_collisionObject()!;
        const wrappedBody = this._getWrappedBody(ammoObject);
        if (!wrappedBody) {
            return false;
        }

        // vec3AmmoToCreator(this._hitPoint, closestRayResultCallback.get_m_hitPointWorld());
        // vec3AmmoToCreator(this._hitNormal, closestRayResultCallback.get_m_hitNormalWorld());
        const distance = Vec3.distance(from, this._hitPoint);

        throw new Error(`not impl.`);
        // result._assign(this._hitPoint, distance, null, wrappedBody);
        // return true;
    }

    /**
     * Ray cast, and stop at the first result. Note that the order is random - but the method is fast.
     * @return True if any body was hit.
     */
    public raycastAny (from: Vec3, to: Vec3, options: any, result: RaycastResult): boolean {
        return false;
    }

    /**
     * Ray cast against all bodies. The provided callback will be executed for each hit with a RaycastResult as single argument.
     * @return True if any body was hit.
     */
    public raycastAll (from: Vec3, to: Vec3, options: any, callback: (result: RaycastResult) => void): boolean {
        return false;
    }

    public addConstraint (constraint: ConstraintBase) {
    }

    public removeConstraint (constraint: ConstraintBase) {
    }

    public associate (rigidBody: AmmoRigidBody) {
        this._reverseBodyMap.set(rigidBody.impl, rigidBody);
    }

    public decouple (rigidBody: AmmoRigidBody) {
        this._reverseBodyMap.delete(rigidBody.impl);
    }

    private _dispatchCollisionEvent (contactPoint: Ammo.btManifoldPoint, bodyA: AmmoRigidBody, bodyB: AmmoRigidBody) {
        // const collisionEvent = this._collisionEvent;
        // vec3AmmoToCreator(collisionEvent._position, contactPoint.getPositionWorldOnA());
        // vec3AmmoToCreator(collisionEvent._targetPosition, contactPoint.get_m_positionWorldOnB());
        // vec3AmmoToCreator(collisionEvent._targetNormal, contactPoint.get_m_normalWorldOnB());
        // Vec3.negate(collisionEvent.normal, collisionEvent.targetNormal);
        // bodyA.dispatchCollisionWith(bodyB);
        // bodyB.dispatchCollisionWith(bodyA);
    }

    private _getWrappedBody (ammoObject: Ammo.btCollisionObject) {
        const ammoRigid = Ammo.castObject<Ammo.btRigidBody>(ammoObject, Ammo.btRigidBody);
        const body = this._reverseBodyMap.get(ammoRigid);
        return body;
    }

    private _callCustomBeforeSteps () {
        // TO DO
        // Note there may be BUG if fx call removeFunction
        this._customBeforeStepListener.forEach((fx) => fx());
    }

    private _callCustomAfterSteps () {
        this._customAfterStepListener.forEach((fx) => fx());
    }
}

const contactsPool = [] as any;
