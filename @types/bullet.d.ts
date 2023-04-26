declare module 'external:emscripten/bullet/bullet.asm.js' {
    function factory (env: any, wasmMemory: ArrayBuffer): Bullet.instance;
    export default factory;
}

declare namespace Bullet {
    type ptr = number;
    interface instance {
        _malloc(bytes: number): ptr;
        _free(p: ptr): void;
        _read_f32(p: ptr): void;
        _write_f32(p: ptr, v: number): void;
        _safe_delete(p: ptr, bulletType: number):void;

        Vec3_new(x: number, y: number, z: number): ptr;
        Vec3_x(p: ptr): number;
        Vec3_y(p: ptr): number;
        Vec3_z(p: ptr): number;
        Vec3_set(p: ptr, x: number, y: number, z: number): void;

        Quat_new(x: number, y: number, z: number, w: number): ptr;
        Quat_x(p: ptr): number;
        Quat_y(p: ptr): number;
        Quat_z(p: ptr): number;
        Quat_w(p: ptr): number;
        Quat_set(p: ptr, x: number, y: number, z: number, w: number): void;

        Transform_new(): ptr;
        Transform_setIdentity(p: ptr): void;
        Transform_getOrigin(p: ptr): ptr;
        Transform_setRotation(p: ptr, quate: ptr): void;
        Transform_getRotation(p: ptr, quate: ptr): void;

        MotionState_getWorldTransform(p: ptr, transform: ptr): void;
        MotionState_setWorldTransform(p: ptr, transform: ptr): void;
        ccMotionState_new(id: number, initTrans: ptr): ptr;

        int_array_size(p: ptr): number;
        int_array_at(p: ptr, index: number): number;
        Vec3_array_at(p: ptr, index: number): ptr;

        // constraints

        TypedConstraint_getFixedBody(): ptr;
        HingeConstraint_new(ptr0: ptr, ptr1: ptr, ptr2: ptr, ptr3: ptr): ptr;
        HingeConstraint_setFrames(ptr0: ptr, ptr1: ptr, ptr2: ptr): void;
        P2PConstraint_new(ptr0: ptr, ptr1: ptr, ptr2: ptr, ptr3: ptr): ptr;
        P2PConstraint_setPivotA(ptr0: ptr, ptr1: ptr): void;
        P2PConstraint_setPivotB(ptr0: ptr, ptr1: ptr): void;
        TypedConstraint_setMaxImpulseThreshold(ptr0: ptr, maxImpulse: number): void;
        FixedConstraint_new(ptr0: ptr, ptr1: ptr, ptr2: ptr, ptr3: ptr): ptr;
        FixedConstraint_setFrames(ptr0: ptr, ptr1: ptr, ptr2: ptr): void;

        // shapes

        // CollisionShape_getUserIndex(p: ptr): number;
        // CollisionShape_setUserIndex(p: ptr, i: number): void;
        CollisionShape_isCompound(p: ptr): boolean;
        CollisionShape_setLocalScaling(p: ptr, scale: ptr): void;
        CollisionShape_calculateLocalInertia(p: ptr, mass: number, localInertia: ptr): void;
        CollisionShape_getAabb(p: ptr, t: ptr, min: ptr, max: ptr): void;
        CollisionShape_getLocalBoundingSphere(p: ptr): number;
        CollisionShape_setMargin(p: ptr, margin: number): void;
        CollisionShape_setMaterial(p: ptr, mat: ptr): void;
        CollisionShape_setUserPointer(p: ptr, p0: ptr): void;

        EmptyShape_static(): ptr;

        ConvexInternalShape_getImplicitShapeDimensions(p: ptr): ptr;

        BoxShape_new(p: ptr): ptr;
        BoxShape_setUnscaledHalfExtents(p: ptr, halfExtents: ptr): void;

        SphereShape_new(radius: number): ptr;
        SphereShape_setUnscaledRadius(p: ptr, radius: number): void;

        CylinderShape_new(halfExtents: ptr): ptr;
        CylinderShape_updateProp(p: ptr, r: number, g: number, d: number): void;

        CapsuleShape_new(radius: number, height: number): ptr;
        CapsuleShape_updateProp(p: ptr, r: number, g: number, d: number): void;

        ConeShape_new(radius: number, height: number): ptr;
        ConeShape_setRadius(p: ptr, v: number): void;
        ConeShape_setHeight(p: ptr, v: number): void;
        ConeShape_setConeUpIndex(p: ptr, v: number): void;

        StaticPlaneShape_new(normal: ptr, constant: number): ptr;
        StaticPlaneShape_getPlaneNormal(p: ptr): ptr;
        StaticPlaneShape_setPlaneConstant(p: ptr, constant: number): void;

        TerrainShape_new(i: number, j: number, p: ptr, hs: number, min: number, max: number): ptr;

        TriangleMesh_new(): ptr;
        TriangleMesh_addTriangle(p: ptr, v0: ptr, v1: ptr, v2: ptr): void;
        BvhTriangleMeshShape_new(p: ptr, c: boolean, bvh: boolean): ptr;
        BvhTriangleMeshShape_getOptimizedBvh(p: ptr): ptr;
        BvhTriangleMeshShape_setOptimizedBvh(p: ptr, p1: ptr, scaleX: number, scaleY: number, scaleZ: number);
        ScaledBvhTriangleMeshShape_new(p: ptr, scaleX: number, scaleY: number, scaleZ: number): ptr;
        ConvexTriangleMeshShape_new(p: ptr): ptr;

        SimplexShape_new(): ptr;
        SimplexShape_addVertex(p: ptr, pt: ptr): void;

        ccCompoundShape_new(): ptr;
        CompoundShape_getNumChildShapes(p: ptr): number;
        CompoundShape_getChildShape(p: ptr, i: number): ptr;
        CompoundShape_addChildShape(p: ptr, local: ptr, shape: ptr): void;
        CompoundShape_removeChildShape(p: ptr, shape: ptr): void;
        CompoundShape_updateChildTransform(p: ptr, i: number, trans: ptr, shouldRecalculateLocalAabb: boolean): void;
        CompoundShape_setMaterial(p: ptr, i: number, f: number, r: number, rf: number, sf: number): void;

        // collision

        CollisionObject_new(): number;
        CollisionObject_getCollisionShape(p: ptr): ptr;
        CollisionObject_setContactProcessingThreshold(p: ptr, contactProcessingThreshold: number): void;
        CollisionObject_getActivationState(p: ptr): number;
        CollisionObject_setActivationState(p: ptr, newState: number): void;
        CollisionObject_forceActivationState(p: ptr, newState: number): void;
        CollisionObject_activate(p: ptr, forceActivation?: boolean): void;
        CollisionObject_isActive(p: ptr): boolean;
        CollisionObject_isKinematicObject(p: ptr): boolean;
        CollisionObject_isStaticObject(p: ptr): boolean;
        CollisionObject_isStaticOrKinematicObject(p: ptr): boolean;
        CollisionObject_getWorldTransform(p: ptr): ptr;
        CollisionObject_getCollisionFlags(p: ptr): number;
        CollisionObject_setCollisionFlags(p: ptr, flags: number): void;
        CollisionObject_setWorldTransform(p: ptr, transform: ptr): void;
        CollisionObject_setCollisionShape(p: ptr, shape: ptr): void;
        CollisionObject_setCcdMotionThreshold(p: ptr, ccdMotionThreshold: number): void;
        CollisionObject_setCcdSweptSphereRadius(p: ptr, radius: number): void;
        CollisionObject_getUserIndex(p: ptr): number;
        CollisionObject_setUserIndex(p: ptr, index: number): void;
        CollisionObject_getUserPointer(p: ptr): number;
        CollisionObject_setUserPointer(p: ptr, userPointer: number): void;
        CollisionObject_setMaterial(p: ptr, f: number, r: number, rf: number, sf: number): void;
        CollisionObject_setIgnoreCollisionCheck(p: ptr, p0: ptr, v: boolean): void;

        RigidBody_new(m: number, ms: number): ptr;
        RigidBody_getFlags(p: ptr): number;
        RigidBody_setFlags(p: ptr, flags: number): void;
        RigidBody_setGravity(p: ptr, g: ptr): number;
        RigidBody_setDamping(p: ptr, lin: number, ang: number): void;
        RigidBody_setMass(p: ptr, m: number);
        RigidBody_setMassProps(p: ptr, m: number, localInertia: ptr): void;
        RigidBody_setLinearFactor(p: ptr, f: ptr): number;
        RigidBody_setAngularFactor(p: ptr, f: ptr): number;
        RigidBody_getLinearVelocity(p: ptr): ptr;
        RigidBody_getAngularVelocity(p: ptr): ptr;
        RigidBody_setLinearVelocity(p: ptr, v: ptr): void;
        RigidBody_setAngularVelocity(p: ptr, v: ptr): void;
        RigidBody_clearState(p: ptr): void;
        RigidBody_clearForces(p: ptr): void;
        RigidBody_wantsSleeping(p: ptr): boolean;
        RigidBody_setSleepingThresholds(p: ptr, linear: number, angular: number): void;
        RigidBody_getLinearSleepingThreshold(p: ptr): number;
        RigidBody_getMotionState(p: ptr): ptr;
        RigidBody_applyTorque(p: ptr, f: ptr): void;
        RigidBody_applyForce(p: ptr, f: ptr, rp: ptr): void;
        RigidBody_applyImpulse(p: ptr, f: ptr, rp: ptr): void;

        // dynamic

        DefaultCollisionConfiguration_static(): ptr;
        CollisionDispatcher_new(): ptr;
        Dispatcher_getNumManifolds(p: ptr): number;
        Dispatcher_getManifoldByIndexInternal(p: ptr, i: number): ptr;

        ManifoldPoint_getShape0(p: ptr): ptr;
        ManifoldPoint_getShape1(p: ptr): ptr;
        ManifoldPoint_get_m_index0(p: ptr): number;
        ManifoldPoint_get_m_index1(p: ptr): number;
        PersistentManifold_getBody0(p: ptr): ptr;
        PersistentManifold_getBody1(p: ptr): ptr;
        PersistentManifold_getNumContacts(p: ptr): number;
        PersistentManifold_getContactPoint(p: ptr, i: number): ptr;
        ManifoldPoint_get_m_localPointA(p: ptr): ptr;
        ManifoldPoint_get_m_localPointB(p: ptr): ptr;
        ManifoldPoint_get_m_positionWorldOnA(p: ptr): ptr;
        ManifoldPoint_get_m_positionWorldOnB(p: ptr): ptr;
        ManifoldPoint_get_m_normalWorldOnB(p: ptr): ptr;

        DbvtBroadphase_new(): ptr;
        SequentialImpulseConstraintSolver_new(): ptr;

        CollisionWorld_addCollisionObject(p: ptr, body: ptr, g: number, m: number): void;
        CollisionWorld_removeCollisionObject(p: ptr, body: ptr): void;
        CollisionWorld_rayTest(p: ptr, p0: ptr, p1: ptr, p2: ptr): void;

        ccDiscreteDynamicsWorld_new(dispatcher: ptr, pairCache: ptr, solver: ptr): ptr;
        ccDiscreteDynamicsWorld_setAllowSleep(p: ptr, v: boolean): void;
        DynamicsWorld_setGravity(p: ptr, g: ptr): void;
        DynamicsWorld_stepSimulation(p: ptr, timeStep: number, maxSubSteps: number, fixedTimeStep: number): ptr;
        DynamicsWorld_addRigidBody(p: ptr, body: ptr, g: number, m: number): void;
        DynamicsWorld_removeRigidBody(p: ptr, body: ptr): void;
        DynamicsWorld_addConstraint(p: ptr, p2: ptr, v: boolean): void;
        DynamicsWorld_removeConstraint(p: ptr, p2: ptr): void;

        RayCallback_hasHit(p: ptr): boolean;

        ccAllRayCallback_static(): ptr;
        ccAllRayCallback_setFlags(p: ptr, flag: number): void;
        ccAllRayCallback_reset(p: ptr, p0: ptr, p1: ptr, m: number, q: boolean): void;
        ccAllRayCallback_getHitPointWorld(p: ptr): ptr;
        ccAllRayCallback_getHitNormalWorld(p: ptr): ptr;
        ccAllRayCallback_getCollisionShapePtrs(p: ptr): ptr;

        ccClosestRayCallback_static(): ptr;
        ccClosestRayCallback_setFlags(p: ptr, flag: number): void;
        ccClosestRayCallback_reset(p: ptr, p0: ptr, p1: ptr, m: number, q: boolean): void;
        ccClosestRayCallback_getHitPointWorld(p: ptr): ptr;
        ccClosestRayCallback_getHitNormalWorld(p: ptr): ptr;
        ccClosestRayCallback_getCollisionShapePtr(p: ptr): ptr;

        ccMaterial_new(): ptr;
        ccMaterial_set(p: ptr, r: number, f: number, rf: number, sf: number): void;
    }
}
