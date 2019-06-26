
declare module Ammo {
    type Constructor<T = {}> = new(...args: any[]) => T;
    
    export type btScalar = number;

    export class btQuadWord {
        x (): btScalar;

        y (): btScalar;

        z (): btScalar;

        w (): btScalar;

        setX (_x: btScalar): void;

        setY (_y: btScalar): void;

        setZ (_z: btScalar): void;

        setW (_w: btScalar): void;
    }

    export class btVector3 extends btQuadWord {
        constructor ();

        constructor (x: btScalar, y: btScalar, z: btScalar);

        setValue (x: btScalar, y: btScalar, z: btScalar): void;
    }

    export class btQuaternion extends btQuadWord {

    }

    export class btTransform {
        constructor ();

        constructor (q: btQuaternion, v: btVector3);

        setIdentity (): void;

        setOrigin (origin: btVector3): void;

        setRotation (rotation: btQuaternion): void;

        getOrigin (): btVector3;

        getRotation (): btQuaternion;
    }

    export class btManifoldPoint {
        getPositionWorldOnA (): btVector3;

        getPositionWorldOnB (): btVector3;

        getAppliedImpulse (): btScalar;

        getDistance (): btScalar;

        get_m_localPointA (): btVector3;

        get_m_localPointB (): btVector3;

        get_m_positionWorldOnA (): btVector3;

        get_m_positionWorldOnB (): btVector3;

        get_m_normalWorldOnB (): btVector3;

        getUserPersistentDataAsInt(): number;

        setUserPersistentDataAsInt(value: number): void;
    }

    export class btCollisionConfiguration {
        constructor ();
    }

    export class btDefaultCollisionConfiguration extends btCollisionConfiguration {
        constructor ();
    }

    export class btPersistentManifold {
        constructor ();

        getBody0 (): btCollisionObject;

        getBody1 (): btCollisionObject;

        getNumContacts (): number;

        getContactPoint (index: number): btManifoldPoint;
    }

    export class btDispatcher {
        getNumManifolds (): number;

        getManifoldByIndexInternal (index: number): btPersistentManifold;
    }

    export class btCollisionDispatcher extends btDispatcher {
        constructor (configuration: btCollisionConfiguration);
    }

    export class btBroadphaseInterface {

    }

    export class btDbvtBroadphase extends btBroadphaseInterface {

    }

    export class btConstraintSolver {

    }

    export class btSequentialImpulseConstraintSolver extends btConstraintSolver {

    }

    export class btCollisionShape {
        setLocalScaling (scaling: btVector3): void;

        getLocalScaling (): btVector3;

        calculateLocalInertia (mass: btScalar, inertia: btVector3): void;

        setMargin (margin: number): void;

        getMargin (): number;
    }

    export class btCompoundShape extends btCollisionShape {
        constructor (enableDynamicAabbTree?: boolean);

        addChildShape (localTransform: btTransform, shape: btCollisionShape): void;

        getNumChildShapes (): number;

        getChildShape (index: number): btCollisionShape;

        removeChildShapeByIndex (childShapeindex: number): void;

        setMargin (margin: number): void;

        getMargin (): number;
    }

    export class btConvexShape extends btCollisionShape {

    }

    export class btBoxShape extends btConvexShape {
        constructor (boxHalfExtents: btVector3);
    }

    export class btSphereShape extends btConvexShape {
        constructor (radius: btScalar);
    }

    export class btCylinderShape extends btConvexShape {
        constructor (halfExtents: btVector3);
    }

    export class btCollisionObject {
        setAnisotropicFriction (anisotropicFriction: btVector3, frictionMode: number): void;

        getCollisionShape (): btCollisionShape;

        setContactProcessingThreshold (contactProcessingThreshold: number): void;

        setActivationState (newState: number): void;

        forceActivationState (newState: number): void;

        activate (forceActivation?: boolean): void;

        isActive (): boolean;

        isKinematicObject (): boolean;

        isStaticObject (): boolean;

        isStaticOrKinematicObject (): boolean;

        setRestitution (rest: number): void;

        setFriction (frict: number): void;

        setRollingFriction (frict: number): void;

        getWorldTransform (): btTransform;

        setWorldTransform (worldTrans: btTransform): void;

        setCollisionShape (collisionShape: btCollisionShape): void;

        getCollisionFlags (): number;

        setCollisionFlags (flags: number): void;

        getUserIndex(): number;

        setUserIndex(index: number): void;
    }

    /**
     * The btMotionState interface class allows the dynamics world to synchronize and interpolate
     * the updated world transforms with graphics For optimizations,
     * potentially only moving objects get synchronized (using setWorldPosition/setWorldOrientation)
     */
    export class btMotionState {
        getWorldTransform (worldTrans: btTransform): void;

        setWorldTransform (worldTrans: btTransform): void;
    }

    /**
     * The btDefaultMotionState provides a common implementation to synchronize world transforms with offsets. More...
     */
    export class btDefaultMotionState extends btMotionState {
        constructor (startTrans?: btTransform, centerOfMassOffset?: btTransform);

        /**
         * Synchronizes world transform from user to physics.
         */
        getWorldTransform (worldTrans: btTransform): void;

        /**
         * Synchronizes world transform from physics to user Bullet only calls the update of worldtransform for active objects.
         */
        setWorldTransform (worldTrans: btTransform): void;
    }

    export class btRigidBodyConstructionInfo {
        constructor (mass: btScalar, motionState: btMotionState, collisionShape: btCollisionShape, localInertia?: btVector3);
    }

    export class btRigidBody extends btCollisionObject {
        constructor (constructionInfo: btRigidBodyConstructionInfo);

        getCenterOfMassTransform (): btTransform;

        setCenterOfMassTransform (xform: btTransform): void;

        setSleepingThresholds (linear: number, angular: number): void;

        setDamping (lin_damping: btScalar, ang_damping: btScalar): void;

        getLinearDamping (): btScalar;

        getAngularDamping (): btScalar;

        setMassProps (mass: btScalar, inertia: btVector3): void;

        applyForce (force: btVector3, rel_pos: btVector3): void;

        applyImpulse (impulse: btVector3, rel_pos: btVector3): void;

        applyCentralImpulse (impulse: btVector3): void;

        getLinearVelocity (): btVector3;

        setLinearVelocity (lin_vel: btVector3): void;

        getMotionState (): btMotionState;

        applyGravity (): void;

        getGravity (): btVector3;

        setGravity (acceleration: btVector3): void;
    }

    // [Prefix="btCollisionWorld::"]
    export class RayResultCallback {
        hasHit(): boolean;

        get_m_collisionFilterGroup (): number;
        set_m_collisionFilterGroup (value: number): void;

        get_m_collisionFilterMask (): number;
        set_m_collisionFilterMask (value: number): void;

        get_m_closestHitFraction(): btScalar;
        set_m_closestHitFraction(value: btScalar): void;

        get_m_collisionObject(): btCollisionObject | null;
        set_m_collisionObject(value: btCollisionObject | null): void;
    }

    // [Prefix="btCollisionWorld::"]
    export class ClosestRayResultCallback extends RayResultCallback {
        constructor (from: btVector3, to: btVector3);
        get_m_rayFromWorld(): btVector3;
        get_m_rayToWorld(): btVector3;
        get_m_hitNormalWorld(): btVector3;
        get_m_hitPointWorld(): btVector3;
    }

    export class btCollisionWorld {
        getDispatcher (): btDispatcher;

        rayTest (rayFromWorld: btVector3, rayToWorld: btVector3, resultCallback: RayResultCallback): void;

        updateSingleAabb (colObj: btCollisionObject): void;

        setDebugDrawer(debugDrawer: btIDebugDraw): void;
        
        getDebugDrawer(): btIDebugDraw;

        debugDrawWorld(): void;

        debugDrawObject(worldTransform: btTransform, shape: btCollisionShape, color: btVector3): void;
    }

    export class btDynamicsWorld extends btCollisionWorld {
        stepSimulation (timeStep: btScalar, maxSubSteps: number, fixedTimeStep?: btScalar): number;

        addRigidBody (body: btRigidBody): void;

        removeRigidBody (body: btRigidBody): void;
    }

    export class btDiscreteDynamicsWorld extends btDynamicsWorld {
        constructor (dispatcher: btDispatcher, pairCache: btBroadphaseInterface, constraintSolver: btConstraintSolver, collisionConfiguration: btCollisionConfiguration);

        setGravity (gravity: btVector3): void;

        getGravity (): btVector3;

        setContactProcessedCallback (callbackFunction: Pointer): void;

        setContactDestroyedCallback (callbackFunction: Pointer): void;
    }

    export interface btIDebugDraw {
        drawLine(from: Pointer, to: Pointer, color: Pointer): void;

        drawContactPoint(pointOnB: Pointer, normalOnB: Pointer, distance: number, liftTime: number, color: Pointer): void;

        reportErrorWarning(warningString: string): void;

        draw3dText (location: Pointer, textString: string): void;

        setDebugMode (debugMode: number): void;

        getDebugMode (): number;
    }

    export class DebugDrawer implements btIDebugDraw {
        drawLine(from: Pointer, to: Pointer, color: Pointer): void;

        drawContactPoint(pointOnB: Pointer, normalOnB: Pointer, distance: number, liftTime: number, color: Pointer): void;

        reportErrorWarning(warningString: string): void;

        draw3dText (location: Pointer, textString: string): void;

        setDebugMode (debugMode: number): void;

        getDebugMode (): number;
    }

    type Pointer = number;

    export function wrapPointer<T> (pointer: Pointer, constructor: Constructor<T>): T;

    export function castObject<T> (from: any, to: Constructor<T>): T;

    export function addFunction (fx: Function): Pointer;
}

declare module 'ammo.js' {
    export = Ammo;
}