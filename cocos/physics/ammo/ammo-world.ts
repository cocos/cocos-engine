import { Vec3 } from "../../core/math";
import { PhysicsWorldBase, ConstraintBase } from "../api";
import { AmmoRigidBody } from "./ammo-body";
import { AmmoDebugger } from "./ammo-debugger";
import { director, Node } from "../../core";
import { RaycastResult } from "../raycast-result";

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

    constructor (options?: any) {
        const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
        const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
        this._dispatcher = dispatcher;
        const overlappingPairCache = new Ammo.btDbvtBroadphase();
        const solver = new Ammo.btSequentialImpulseConstraintSolver();
        this._ammoWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
        this._ammoWorld.setGravity(new Ammo.btVector3(this._gravity.x, this._gravity.y, this._gravity.z));
    }

    public destroy () {

    }

    public step (deltaTime: number, time?: number, maxSubStep?: number) {
        this._callCustomBeforeSteps();
        this._ammoWorld.stepSimulation(deltaTime, maxSubStep, time);
        this._callCustomAfterSteps();

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

        // this._collisionManager.invalidateAll();
        // const nManifolds = this._dispatcher.getNumManifolds();
        // for (let iManifold = 0; iManifold < nManifolds; ++iManifold) {
        //     const manifold = this._dispatcher.getManifoldByIndexInternal(iManifold);
        //     const bodyA = this._getWrappedBody(manifold.getBody0());
        //     if (!bodyA) {
        //         continue;
        //     }
        //     const bodyB = this._getWrappedBody(manifold.getBody1());
        //     if (!bodyB) {
        //         continue;
        //     }
        //     const indexA = manifold.getBody0().getUserIndex();
        //     const indexB = manifold.getBody1().getUserIndex();
        //     const collisionState = this._collisionManager.query(indexA, indexB);
        //     if (!collisionState) {
        //         // this._dispatchCollisionEvent(manifold, bodyA, bodyB);
        //         this._collisionManager.emplace(indexA, indexB, { valid: true });
        //         // console.log(`haha`);
        //     } else {
        //         collisionState.valid = true;
        //     }
        // }
        // this._collisionManager.clear();
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