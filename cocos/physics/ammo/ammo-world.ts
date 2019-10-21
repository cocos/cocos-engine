import Ammo from 'ammo.js';
import { Vec3 } from "../../core/math";
import { PhysicsWorldBase, ConstraintBase } from "../api";
import { AmmoRigidBody } from "./ammo-body";
import { AmmoDebugger } from "./ammo-debugger";
import { RaycastResult } from "../raycast-result";
import { PhysicsSystem } from '../components';
import { AmmoCollisionFlags } from './ammo-enum';
import { AmmoShape } from './shapes/ammo-shape';

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

    public readonly sharedStaticCompoundShape: Ammo.btCompoundShape;
    public readonly sharedStaticBody: Ammo.btRigidBody;
    public readonly sharedTriggerCompoundShape: Ammo.btCompoundShape;
    public readonly sharedTriggerBody: Ammo.btRigidBody;

    private _ammoWorld: Ammo.btDiscreteDynamicsWorld;
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

    public readonly bodys: AmmoRigidBody[] = [];

    public readonly staticShapes: AmmoShape[] = [];

    public readonly triggerShapes: AmmoShape[] = [];

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
        }

    }

    public destroy () {

    }

    public step (deltaTime: number, time?: number, maxSubStep?: number) {
        // this._callCustomBeforeSteps();

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

        // this._callCustomAfterSteps();

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
            const indexA = body0.getUserIndex();
            const indexB = body1.getUserIndex();
            // console.log('A:', indexA, 'B:', indexB);            
            // console.log('A:', indexA, 'B:', indexB);
            const numContacts = manifold.getNumContacts();
            for (let j = 0; j < numContacts; j++) {
                const manifoldPoint: Ammo.btManifoldPoint = manifold.getContactPoint(j);
                const d = manifoldPoint.getDistance();
                if (d <= 0) {
                    console.log("contact:");
                    break;
                }
            }
        }
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