
interface Vec3 {
    x: number, y: number, z: number
}

interface Quat {
    x: number, y: number, z: number, w: number
}

interface FilterData {
    word0: number
    word1: number
    word2: number
    word3: number
}

declare namespace phy {
    /// Base ///

    const physics: Physics
    abstract class Physics {
        private constructor ()
        createCooking (cp: CookingParams): Cooking
        createSceneDesc (): SceneDesc
        createScene (desc: SceneDesc): Scene
        createRigidDynamic (pose: Transform): RigidDynamic
        createRigidStatic (pose: Transform): RigidStatic
        createMaterial (staticFriction: number, dynamicFriction: number, restitution: number): Material
        createShape (geometry: Geometry, material: Material, isExclusive?: boolean | false, shapeFlags?: number): Shape
    }

    interface Base {
        release (): void
    }

    class CookingParams { }

    abstract class Cooking {
        createHeightField (desc: HeightFieldDesc): HeightField
        createTriangleMesh (desc: TriangleMeshDesc): TriangleMesh
        validateTriangleMesh (desc: TriangleMeshDesc): boolean
        validateConvexMesh (desc: ConvexMeshDesc): boolean
        createConvexMesh (desc: ConvexMeshDesc): ConvexMesh
        setParams (params: CookingParams): void
        getParams (): CookingParams
    }

    interface ContactPairHeader {
        shapes: Shape[]
        pairBuffer: ArrayBuffer
        contactBuffer: ArrayBuffer
    }

    type onContact = (header: ContactPairHeader) => {}
    type onTrigger = (pairs: any[], pairsBuffer: ArrayBuffer) => {}
    class SimulationEventCallback {
        constructor ()
        setOnContact (method: onContact): void
        setOnTrigger (method: onTrigger): void
    }

    class SceneDesc {
        setFlags (flag: SceneFlag, val: boolean): void //PhysX 中为 setFlag
        setGravity (gravity: Vec3): void
        setSubThreadCount (val: number): void
        getMaxSubThreadCount (): number
        setSimulationEventCallback (callback: SimulationEventCallback): void
    }

    abstract class Scene {
        getGravity (): Vec3
        setGravity (val: Vec3): void
        addActor (actor: Actor): void
        removeActor (actor: Actor, wakeOnLostTouch?: boolean | true): void
        simulate (elapsedTime: number): void
        fetchResults (block?: boolean | true): void
        setFlag (flag: SceneFlag, value: boolean): void
        getFlags (): number
        getPhysics (): Physics
        getTimestamp (): number
    }

    class Bounds3 {
        getExtents (): Vec3
        getCenter (): Vec3
    }

    class Transform {
        constructor ()
        isValid (): boolean
        setPosition (pos: Vec3): void
        getPosition (): Vec3
        setQuaternion (quat: Quat): void
        getQuaternion (): Quat
    }

    abstract class Material implements Base {
        private constructor ()
        release (): void
        setFlag (flag: MaterialFlag, val: boolean): void
        setFlags (flags: number): void
        setRestitution (val: number): void
        setStaticFriction (val: number): void
        setDynamicFriction (val: number): void
        setFrictionCombineMode (mode: CombineMode): void
        setRestitutionCombineMode (mode: CombineMode): void
    }

    abstract class Shape implements Base {
        private constructor ()
        release (): void
        isExclusive (): boolean
        setFlag (flag: ShapeFlag, val: boolean): void
        getFlags (): number
        setFlags (flags: number): void
        setLocalPose (pose: Transform): void
        setQueryFilterData (data: FilterData): void
        setSimulationFilterData (data: FilterData): void
        setMaterials (materials: Array<Material>): void
        setRestOffset (val: number): void
        setContactOffset (offset: number): void
        setGeometry (geometry: Geometry): void
    }

    /// Actor ///

    abstract class Actor implements Base {
        release (): void
        getType (): number
        setUserData (data: number): void
        getUserData (): number
        setActorFlag (flag: ActorFlag, val: boolean): void
        setActorFlags (flags: number): void
        getActorFlags (): number
        getWorldBounds (inflation?: number | 1.01): Bounds3
        setDominanceGroup (val: number): number
        getDominanceGroup (): number
    }

    abstract class RigidActor extends Actor {
        setGlobalPose (pose: Transform, autowake?: boolean | true): void
        getGlobalPose (): Transform
        attachShape (shape: Shape): boolean
        getNbShapes (): number
    }

    class RigidStatic extends RigidActor { }

    abstract class RigidBody extends RigidActor {
        setMass (val: number): void
        getMass (val: number): void
        getInvMass (val: number): void
        setCMassLocalPose (pose: Transform): void
        getCMassLocalPose (): Transform
        setLinearDamping (val: number): void
        setAngularDamping (val: number): void
        setLinearVelocity (val: Vec3, autowake?: boolean | true): void
        setAngularVelocity (val: Vec3, autowake?: boolean | true): void
        addTorque (torque: Vec3, mode: number, autowake?: boolean | true): void
        setRigidBodyFlag (flag: RigidBodyFlag, val: boolean): void
        setRigidBodyFlags (flags: number): void
        getRigidBodyFlags (flags: number): void
        clearForce (mode: number): void
        clearTorque (mode: number): void
    }

    abstract class RigidDynamic extends RigidBody {
        wakeUp (): void
        isSleeping (): boolean
        putToSleep (): void
        setKinematicTarget (transform: Transform): void
        setWakeCounter (val: number): void
        getWakeCounter (): number
        setSleepThreshold (val: number): void
        getSleepThreshold (): void
        setContactReportThreshold (val: number): void
        getContactReportThreshold (): number
        setStabilizationThreshold (val: number): void
        getStabilizationThreshold (): number
        setRigidDynamicLockFlag (flag: RigidDynamicLockFlag, val: boolean): void
        setRigidDynamicLockFlags (flags: number): void
        getRigidDynamicLockFlags (): number
    }

    /// Geometry ///

    interface Geometry {
        isVaild (): boolean
    }

    /** Primitive */

    class BoxGeometry implements Geometry {
        constructor (halfSize: Vec3)
        isVaild (): boolean
        setHalfExtents (halfSize: Vec3): void
    }

    class SphereGeometry implements Geometry {
        constructor (radius: number)
        isVaild (): boolean
        setRadius (radius: number): void
    }

    class PlaneGeometry implements Geometry {
        constructor ()
        isVaild (): boolean
    }

    class CapsuleGeometry implements Geometry {
        constructor (radius: number, halfHeight: number)
        isVaild (): boolean
        setRadius (radius: number): void
        setHalfHeight (halfHeight: number): void
    }

    class MeshScale {
        constructor (scale: Vec3, rotation: Quat)
        isValidForConvexMesh (): boolean
        isValidForTriangleMesh (): boolean
        hasNegativeDeterminant (): boolean
        setScale (scale: Vec3): void
        setRotation (rotation: Quat): void
    }

    /** Triangle Mesh */

    class TriangleMeshDesc {
        constructor ()
        isValid (): boolean
        setPointsData (data: Float32Array): void
        setPointsCount (count: number): void
        setPointsStride (stride: number): void
        setTrianglesData (data: Uint32Array | Uint16Array): void
        setTrianglesCount (count: number): void
        setTrianglesStride (stride: number): void
        getMaterialsData (): Uint16Array
        setMaterialsData (data: Uint16Array): void
        getMaterialsStride (): number
        setMaterialsStride (stride: number): void
    }

    class TriangleMesh implements Base {
        private constructor ()
        release (): void
        getLocalBounds (): Bounds3
    }

    class TriangleMeshGeometry implements Geometry {
        constructor (mesh: TriangleMesh, scale: MeshScale, flags: number)
        isVaild (): boolean
        setScale (scale: MeshScale): void
        setFlags (flags: number): void
        setTriangleMesh (mesh: TriangleMesh): void
    }

    /** Convex Hull */

    class ConvexMeshDesc {
        isValid (): boolean
        setPointsData (data: Float32Array): void
        setPointsCount (count: number): void
        setPointsStride (stride: number): void
        setConvexFlags (flags: number): void
    }

    class ConvexMesh implements Base {
        private constructor ()
        release (): void
        getLocalBounds (): Bounds3
    }

    class ConvexMeshGeometry implements Geometry {
        constructor (mesh: ConvexMesh, scale: MeshScale, flags: number)
        isVaild (): boolean
        setScale (scale: MeshScale): void
        setFlags (flags: number): void
        setTriangleMesh (mesh: TriangleMesh): void
    }

    /** Height Field */

    class HeightFieldDesc {
        isValid (): boolean
        setNbRows (rows: number): void
        setNbColumns (cols: number): void
        setSamples (samples: HeightFieldSamples): void
        setHeightFieldFlags (flags: number): void
        setConvexEdgeThreshold (threshold: number): void
    }

    class HeightFieldSamples {
        setHeightAtIndex (index: number, height: number): void
    }

    class HeightField implements Base {
        private constructor ()
        release (): void
    }

    class HeightFieldGeometry implements Geometry {
        constructor (hf: HeightField, heightScale: number, rowScale: number, colScale: number)
        isVaild (): boolean
    }

    /// Joints ///



    /// Extensions ///

    interface Spring {
        stiffness: number
        damping: number
    }

    interface Bounce {
        restitution: number
        velocityThreshold: number
    }

    class JointLimitParameters {
        protected constructor ()
        getRestitution (): number
        setRestitution (val: number): void
        setBounceThreshold (val: number): void
        getBounceThreshold (): number
        getStiffness (): number
        setStiffness (val: number): void
        getDamping (): number
        setDamping (val: number): void
        getContactDistance (): number
        setContactDistance (val: number): void
        isValid (): boolean
        isSoft (): boolean
    }

    class JointLinearLimit extends JointLimitParameters {
        constructor (extent: number, contactDist?: number | -1)
        constructor (extent: number, spring: Spring)
        getValue (): number
        setValue (val: number): void
    }

    class JointLinearLimitPair extends JointLimitParameters {
        constructor (lowerLimit: number, upperLimit: number, contactDist?: number | -1)
        constructor (lowerLimit: number, upperLimit: number, spring: Spring)
        getUpper (): number
        setUpper (val: number): void
        getLower (): number
        setLower (val: number): void
    }

    class JointAngularLimitPair extends JointLimitParameters {
        constructor (lowerLimit: number, upperLimit: number, contactDist?: number | -1)
        constructor (lowerLimit: number, upperLimit: number, spring: Spring)
        getUpper (): number
        setUpper (val: number): void
        getLower (): number
        setLower (val: number): void
    }

    class JointLimitCone extends JointLimitParameters {
        constructor (lowerLimit: number, upperLimit: number, contactDist?: number | -1)
        constructor (lowerLimit: number, upperLimit: number, spring: Spring)
        getYAngle (): number
        setYAngle (val: number): void
        getZAngle (): number
        setZAngle (val: number): void
    }

    class JointLimitPyramid extends JointLimitParameters {
        constructor (yLimitAngleMin: number, yLimitAngleMax: number, LimitAngleMin: number, zLimitAngleMax: number, contactDist?: number | -1)
        constructor (yLimitAngleMin: number, yLimitAngleMax: number, LimitAngleMin: number, zLimitAngleMax: number, spring: Spring)
        getYAngleMin (): number
        setYAngleMin (val: number): void
        getYAngleMax (): number
        setYAngleMax (val: number): void
        getZAngleMin (): number
        setZAngleMin (val: number): void
        getZAngleMax (): number
        setZAngleMax (val: number): void
    }

    interface JointBreakForce {
        force: number
        torque: number
    }

    class Joint implements Base {
        protected constructor ()
        release (): void
        setActors (actor0: RigidActor, actor1?: RigidActor): void
        setLocalPose (index: JointActorIndex, pose: Transform): void
        setBreakForce (force: number, torque: number): void
        getBreakForce (): JointBreakForce
        setConstraintFlag (flag: ConstraintFlag, val: boolean): void
        setConstraintFlags (flags: number): void
        getConstraintFlags (): number
        setInvMassScale0 (val: number): void
        setInvInertiaScale0 (val: number): void
        setInvMassScale1 (val: number): void
        setInvInertiaScale1 (val: number): void
        getInvMassScale0 (): number
        getInvMassScale1 (): number
        getInvInertiaScale0 (): number
        getInvInertiaScale1 (): number
        getLocalPose (index: JointActorIndex): Transform
        getRelativeTransform (): Transform
        getRelativeLinearVelocity (): Vec3
        getRelativeAngularVelocity (): Vec3
        getScene (): Scene | null
    }

    class RevoluteJoint extends Joint {
        private constructor ()
        getAngle (): number
        getVelocity (): number
        getLimit (): JointAngularLimitPair
        getDriveVelocity (): number
        getDriveForceLimit (): number
        getDriveGearRatio (): number
        getRevoluteJointFlags (): number
        getProjectionLinearTolerance (): number
        getProjectionAngularTolerance (): number
        setLimit (limit: JointAngularLimitPair): void
        setProjectionAngularTolerance (val: number): void
        setProjectionLinearTolerance (val: number): void
        setRevoluteJointFlags (flags: number): void
        setRevoluteJointFlag (flag: RevoluteJointFlag, val: boolean): void
        setDriveGearRatio (val: number): void
        setDriveForceLimit (val: number): void
        setDriveVelocity (val: number, autowake?: boolean | true): void
    }

    class DistanceJoint extends Joint {
        private constructor ()
        getDistance (): number
        getMinDistance (): number
        getMaxDistance (): number
        getTolerance (): number
        getStiffness (): number
        getDamping (): number
        getDistanceJointFlags (): number
        setDamping (): number
        setDistanceJointFlag (flag: DistanceJointFlag, val: boolean): void
        setDistanceJointFlags (flags: number): void
        setStiffness (val: number): void
        setTolerance (val: number): void
        setMaxDistance (val: number): void
        setMinDistance (val: number): void
    }

    class FixedJoint extends Joint {
        private constructor ()
        setProjectionLinearTolerance (val: number): void
        setProjectionAngularTolerance (val: number): void
        getProjectionAngularTolerance (): number
        getProjectionLinearTolerance (): number
    }

    class PrismaticJoint extends Joint {
        private constructor ()
        setLimit (limit: JointLinearLimitPair): void
        setPrismaticJointFlag (flag: PrismaticJointFlag, val: boolean): void
        setPrismaticJointFlags (flags: number): void
        setProjectionLinearTolerance (val: number): void
        setProjectionAngularTolerance (val: number): void
        getPosition (): number
        getVelocity (): number
        getLimit (): JointLinearLimitPair
        getPrismaticJointFlags (): number
        getProjectionLinearTolerance (): number
        getProjectionAngularTolerance (): number
    }

    class SphericalJoint extends Joint {
        private constructor ()
        getLimitCone (): JointLimitCone
        setSphericalJointFlag (flag: PrismaticJointFlag, val: boolean): void
        getSphericalJointFlags (): number
        getProjectionLinearTolerance (): number
        setLimitCone (limit: JointLimitCone): void
        setSphericalJointFlags (flags: number): void
        setProjectionLinearTolerance (val: number): void
    }

    class ContactJoint extends Joint {
        private constructor ()
        setContact (val: Vec3): void
        setContactNormal (val: Vec3): void
        setPenetration (val: number): void
        setResititution (val: number): void
        setBounceThreshold (val: number): void
        getContact (): Vec3
        getContactNormal (): Vec3
        getPenetration (): number
        getResititution (): number
        getBounceThreshold (): number
    }

    class D6JointDrive {
        constructor ()
        constructor (driveStiffness: number, driveDamping: number, driveForceLimit: number, isAcceleration?: boolean | false)
        setForceLimit (val: number): void
        getForceLimit (): number
        setFlags (flags: number): void
        getFlags (): number
        setStiffness (val: number): void
        getStiffness (): number
        setDamping (val: number): void
        getDamping (): number
    }

    interface DriveVelocity {
        linear: Vec3
        angular: Vec3
    }

    class D6Joint extends Joint {
        private constructor ()
        getMotion (axis: D6Axis): D6Motion
        getTwistAngle (): number
        getSwingYAngle (): number
        getSwingZAngle (): number
        getDistanceLimit (): JointLinearLimit
        getLinearLimit (axis: D6Axis): JointLinearLimitPair
        getTwistLimit (): JointAngularLimitPair
        getSwingLimit (): JointLimitCone
        getPyramidSwingLimit (): JointLimitPyramid
        getDrive (index: D6Drive): D6JointDrive
        getDrivePosition (): Transform
        getDriveVelocity (): DriveVelocity
        getProjectionLinearTolerance (): number
        getProjectionAngularTolerance (): number
        setDriveVelocity (linear: Vec3, angular: Vec3, autowake?: boolean | true): void
        setProjectionLinearTolerance (val: number): void
        setProjectionAngularTolerance (val: number): void
        setLinearLimit (axis: D6Axis, limit: JointLinearLimit): void
        setDrive (index: D6Drive, drive: D6JointDrive): void
        setDrivePosition (pose: Transform, autowake?: boolean | true): void
        setSwingLimit (limit: JointLimitCone): void
        setTwistLimit (limit: JointAngularLimitPair): void
        setMotion (index: D6Axis, motion: D6Motion): void
        setDistanceLimit (limit: JointLinearLimit): void
        setPyramidSwingLimit (limit: JointLimitPyramid): void
    }

    function createRevoluteJoint (actor0: RigidActor, localframe0: Transform, actor1: RigidActor | null, localframe1: Transform): RevoluteJoint
    function createContactJoint (actor0: RigidActor, localframe0: Transform, actor1: RigidActor | null, localframe1: Transform): ContactJoint
    function createDistanceJoint (actor0: RigidActor, localframe0: Transform, actor1: RigidActor | null, localframe1: Transform): DistanceJoint
    function createD6Joint (actor0: RigidActor, localframe0: Transform, actor1: RigidActor | null, localframe1: Transform): D6Joint
    function createPrismaticJoint (actor0: RigidActor, localframe0: Transform, actor1: RigidActor | null, localframe1: Transform): PrismaticJoint
    function createFixedJoint (actor0: RigidActor, localframe0: Transform, actor1: RigidActor | null, localframe1: Transform): FixedJoint
    function createSphericalJoint (actor0: RigidActor, localframe0: Transform, actor1: RigidActor | null, localframe1: Transform): SphericalJoint

    /// Extensions ///

    namespace ShapeExt {
        function getWorldBounds (shape: Shape, actor: RigidActor, inflation?: number | 1.01): Bounds3
    }

    namespace RigidBodyExt {
        function setMassAndUpdateInertia (body: RigidBody, shapeDensities: number | Array<number>, massLoclPose?: Vec3, includeNonSimShapes?: boolean): boolean
        function applyImpulse (body: RigidBody, impulse: Vec3, relativePoint: Vec3): void
        function applyLocalImpulse (body: RigidBody, localImpulse: Vec3, relativePoint: Vec3): void
        function applyForce (body: RigidBody, force: Vec3, relativePoint: Vec3): void
        function applyLocalForce (body: RigidBody, localForce: Vec3, relativePoint: Vec3): void
    }

    class SceneQueryHit {
        private constructor ()
        actor: RigidActor
        shape: Shape
        faceIndex: number
    }

    class RayCastHit {
        private constructor ()
        actor: RigidActor
        shape: Shape
        faceIndex: number
        u: number
        v: number
        normal: Vec3
        position: Vec3
        distance: number
        flags: number
    }

    type preFilter = (filterData: FilterData, shape: Shape, actor: RigidActor, hitFlags: number) => QueryHitType
    class QueryFilterCallback {
        constructor ()
        setPreFilter (cb: preFilter): void
        getPreFilter (): preFilter | null
    }

    namespace SceneQueryExt {

        interface SceneQueryFilterData {
            data: FilterData
            flags: number
        }

        function raycastSingle (scene: Scene, origin: Vec3, unitDir: Vec3, distacne: number, flags: number, filterData: SceneQueryFilterData, cb: QueryFilterCallback): RayCastHit | null
        function raycastAny (scene: Scene, origin: Vec3, unitDir: Vec3, distacne: number, filterData: SceneQueryFilterData, cb: QueryFilterCallback): SceneQueryHit | null
        function raycastMultiple (scene: Scene, origin: Vec3, unitDir: Vec3, distacne: number, maxRayCast: number, flags: number, filterData: SceneQueryFilterData, cb: QueryFilterCallback): Array<RayCastHit> | null
    }

    /// Enum ///

    enum Axis {
        x,
        y,
        z
    }

    enum ContactPairHeaderFlag {
        eREMOVED_ACTOR_0 = (1 << 0),			//!< The actor with index 0 has been removed from the scene.
        eREMOVED_ACTOR_1 = (1 << 1)			//!< The actor with index 1 has been removed from the scene.
    }

    enum ContactPairFlag {
        /**
        \brief The shape with index 0 has been removed from the actor/scene.
        */
        eREMOVED_SHAPE_0 = (1 << 0),

        /**
        \brief The shape with index 1 has been removed from the actor/scene.
        */
        eREMOVED_SHAPE_1 = (1 << 1),

        /**
        \brief First actor pair contact.

        The provided shape pair marks the first contact between the two actors, no other shape pair has been touching prior to the current simulation frame.

        \note: This info is only available if #PxPairFlag::eNOTIFY_TOUCH_FOUND has been declared for the pair.
        */
        eACTOR_PAIR_HAS_FIRST_TOUCH = (1 << 2),

        /**
        \brief All contact between the actor pair was lost.

        All contact between the two actors has been lost, no shape pairs remain touching after the current simulation frame.
        */
        eACTOR_PAIR_LOST_TOUCH = (1 << 3),

        /**
        \brief Internal flag, used by #PxContactPair.extractContacts()

        The applied contact impulses are provided for every contact point. 
        This is the case if #PxPairFlag::eSOLVE_CONTACT has been set for the pair.
        */
        eINTERNAL_HAS_IMPULSES = (1 << 4),

        /**
        \brief Internal flag, used by #PxContactPair.extractContacts()

        The provided contact point information is flipped with regards to the shapes of the contact pair. This mainly concerns the order of the internal triangle indices.
        */
        eINTERNAL_CONTACTS_ARE_FLIPPED = (1 << 5)
    }

    enum PairFlag {
        /**
        \brief Process the contacts of this collision pair in the dynamics solver.

        \note Only takes effect if the colliding actors are rigid bodies.
        */
        eSOLVE_CONTACT = (1 << 0),

        /**
        \brief Call contact modification callback for this collision pair

        \note Only takes effect if the colliding actors are rigid bodies.

        @see PxContactModifyCallback
        */
        eMODIFY_CONTACTS = (1 << 1),

        /**
        \brief Call contact report callback or trigger callback when this collision pair starts to be in contact.

        If one of the two collision objects is a trigger shape (see #PxShapeFlag::eTRIGGER_SHAPE) 
        then the trigger callback will get called as soon as the other object enters the trigger volume. 
        If none of the two collision objects is a trigger shape then the contact report callback will get 
        called when the actors of this collision pair start to be in contact.

        \note Only takes effect if the colliding actors are rigid bodies.

        \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

        @see PxSimulationEventCallback.onContact() PxSimulationEventCallback.onTrigger()
        */
        eNOTIFY_TOUCH_FOUND = (1 << 2),

        /**
        \brief Call contact report callback while this collision pair is in contact

        If none of the two collision objects is a trigger shape then the contact report callback will get 
        called while the actors of this collision pair are in contact.

        \note Triggers do not support this event. Persistent trigger contacts need to be tracked separately by observing eNOTIFY_TOUCH_FOUND/eNOTIFY_TOUCH_LOST events.

        \note Only takes effect if the colliding actors are rigid bodies.

        \note No report will get sent if the objects in contact are sleeping.

        \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

        \note If this flag gets enabled while a pair is in touch already, there will be no eNOTIFY_TOUCH_PERSISTS events until the pair loses and regains touch.

        @see PxSimulationEventCallback.onContact() PxSimulationEventCallback.onTrigger()
        */
        eNOTIFY_TOUCH_PERSISTS = (1 << 3),

        /**
        \brief Call contact report callback or trigger callback when this collision pair stops to be in contact

        If one of the two collision objects is a trigger shape (see #PxShapeFlag::eTRIGGER_SHAPE) 
        then the trigger callback will get called as soon as the other object leaves the trigger volume. 
        If none of the two collision objects is a trigger shape then the contact report callback will get 
        called when the actors of this collision pair stop to be in contact.

        \note Only takes effect if the colliding actors are rigid bodies.

        \note This event will also get triggered if one of the colliding objects gets deleted.

        \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

        @see PxSimulationEventCallback.onContact() PxSimulationEventCallback.onTrigger()
        */
        eNOTIFY_TOUCH_LOST = (1 << 4),

        /**
        \brief Call contact report callback when this collision pair is in contact during CCD passes.

        If CCD with multiple passes is enabled, then a fast moving object might bounce on and off the same
        object multiple times. Hence, the same pair might be in contact multiple times during a simulation step.
        This flag will make sure that all the detected collision during CCD will get reported. For performance
        reasons, the system can not always tell whether the contact pair lost touch in one of the previous CCD 
        passes and thus can also not always tell whether the contact is new or has persisted. eNOTIFY_TOUCH_CCD
        just reports when the two collision objects were detected as being in contact during a CCD pass.

        \note Only takes effect if the colliding actors are rigid bodies.

        \note Trigger shapes are not supported.

        \note Only takes effect if eDETECT_CCD_CONTACT is raised

        @see PxSimulationEventCallback.onContact() PxSimulationEventCallback.onTrigger()
        */
        eNOTIFY_TOUCH_CCD = (1 << 5),

        /**
        \brief Call contact report callback when the contact force between the actors of this collision pair exceeds one of the actor-defined force thresholds.

        \note Only takes effect if the colliding actors are rigid bodies.

        \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

        @see PxSimulationEventCallback.onContact()
        */
        eNOTIFY_THRESHOLD_FORCE_FOUND = (1 << 6),

        /**
        \brief Call contact report callback when the contact force between the actors of this collision pair continues to exceed one of the actor-defined force thresholds.

        \note Only takes effect if the colliding actors are rigid bodies.

        \note If a pair gets re-filtered and this flag has previously been disabled, then the report will not get fired in the same frame even if the force threshold has been reached in the
        previous one (unless #eNOTIFY_THRESHOLD_FORCE_FOUND has been set in the previous frame).

        \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

        @see PxSimulationEventCallback.onContact()
        */
        eNOTIFY_THRESHOLD_FORCE_PERSISTS = (1 << 7),

        /**
        \brief Call contact report callback when the contact force between the actors of this collision pair falls below one of the actor-defined force thresholds (includes the case where this collision pair stops being in contact).

        \note Only takes effect if the colliding actors are rigid bodies.

        \note If a pair gets re-filtered and this flag has previously been disabled, then the report will not get fired in the same frame even if the force threshold has been reached in the
        previous one (unless #eNOTIFY_THRESHOLD_FORCE_FOUND or #eNOTIFY_THRESHOLD_FORCE_PERSISTS has been set in the previous frame).

        \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

        @see PxSimulationEventCallback.onContact()
        */
        eNOTIFY_THRESHOLD_FORCE_LOST = (1 << 8),

        /**
        \brief Provide contact points in contact reports for this collision pair.

        \note Only takes effect if the colliding actors are rigid bodies and if used in combination with the flags eNOTIFY_TOUCH_... or eNOTIFY_THRESHOLD_FORCE_...

        \note Only takes effect if eDETECT_DISCRETE_CONTACT or eDETECT_CCD_CONTACT is raised

        @see PxSimulationEventCallback.onContact() PxContactPair PxContactPair.extractContacts()
        */
        eNOTIFY_CONTACT_POINTS = (1 << 9),

        /**
        \brief This flag is used to indicate whether this pair generates discrete collision detection contacts. 

        \note Contacts are only responded to if eSOLVE_CONTACT is enabled.
        */
        eDETECT_DISCRETE_CONTACT = (1 << 10),

        /**
        \brief This flag is used to indicate whether this pair generates CCD contacts. 

        \note The contacts will only be responded to if eSOLVE_CONTACT is enabled on this pair.
        \note The scene must have PxSceneFlag::eENABLE_CCD enabled to use this feature.
        \note Non-static bodies of the pair should have PxRigidBodyFlag::eENABLE_CCD specified for this feature to work correctly.
        \note This flag is not supported with trigger shapes. However, CCD trigger events can be emulated using non-trigger shapes 
        and requesting eNOTIFY_TOUCH_FOUND and eNOTIFY_TOUCH_LOST and not raising eSOLVE_CONTACT on the pair.

        @see PxRigidBodyFlag::eENABLE_CCD
        @see PxSceneFlag::eENABLE_CCD
        */
        eDETECT_CCD_CONTACT = (1 << 11),

        /**
        \brief Provide pre solver velocities in contact reports for this collision pair.
    	
        If the collision pair has contact reports enabled, the velocities of the rigid bodies before contacts have been solved
        will be provided in the contact report callback unless the pair lost touch in which case no data will be provided.
    	
        \note Usually it is not necessary to request these velocities as they will be available by querying the velocity from the provided
        PxRigidActor object directly. However, it might be the case that the velocity of a rigid body gets set while the simulation is running
        in which case the PxRigidActor would return this new velocity in the contact report callback and not the velocity the simulation used.
    	
        @see PxSimulationEventCallback.onContact(), PxContactPairVelocity, PxContactPairHeader.extraDataStream
        */
        ePRE_SOLVER_VELOCITY = (1 << 12),

        /**
        \brief Provide post solver velocities in contact reports for this collision pair.
    	
        If the collision pair has contact reports enabled, the velocities of the rigid bodies after contacts have been solved
        will be provided in the contact report callback unless the pair lost touch in which case no data will be provided.
    	
        @see PxSimulationEventCallback.onContact(), PxContactPairVelocity, PxContactPairHeader.extraDataStream
        */
        ePOST_SOLVER_VELOCITY = (1 << 13),

        /**
        \brief Provide rigid body poses in contact reports for this collision pair.
    	
        If the collision pair has contact reports enabled, the rigid body poses at the contact event will be provided 
        in the contact report callback unless the pair lost touch in which case no data will be provided.
    	
        \note Usually it is not necessary to request these poses as they will be available by querying the pose from the provided
        PxRigidActor object directly. However, it might be the case that the pose of a rigid body gets set while the simulation is running
        in which case the PxRigidActor would return this new pose in the contact report callback and not the pose the simulation used.
        Another use case is related to CCD with multiple passes enabled, A fast moving object might bounce on and off the same 
        object multiple times. This flag can be used to request the rigid body poses at the time of impact for each such collision event.
    	
        @see PxSimulationEventCallback.onContact(), PxContactPairPose, PxContactPairHeader.extraDataStream
        */
        eCONTACT_EVENT_POSE = (1 << 14),

        eNEXT_FREE = (1 << 15),        //!< For internal use only.

        /**
        \brief Provided default flag to do simple contact processing for this collision pair.
        */
        eCONTACT_DEFAULT = eSOLVE_CONTACT | eDETECT_DISCRETE_CONTACT,

        /**
        \brief Provided default flag to get commonly used trigger behavior for this collision pair.
        */
        eTRIGGER_DEFAULT = eNOTIFY_TOUCH_FOUND | eNOTIFY_TOUCH_LOST | eDETECT_DISCRETE_CONTACT
    }

    enum TriggerPairFlag {
        eREMOVED_SHAPE_TRIGGER = (1 << 0),					//!< The trigger shape has been removed from the actor/scene.
        eREMOVED_SHAPE_OTHER = (1 << 1),					//!< The shape causing the trigger event has been removed from the actor/scene.
        eNEXT_FREE = (1 << 2)					//!< For internal use only.
    }

    enum ActorType {
        /**
        \brief A static rigid body
        @see RigidStatic
        */
        eRIGID_STATIC,

        /**
        \brief A dynamic rigid body
        @see RigidDynamic
        */
        eRIGID_DYNAMIC,


        eARTICULATION_LINK
    }

    enum ActorFlag {
        /**
            /**
            \brief Disables scene gravity for this actor
            */
        eDISABLE_GRAVITY = (1 << 1),

        /**
        \brief Enables the sending of SimulationEventCallback::onWake() and SimulationEventCallback::onSleep() notify events
	
        @see SimulationEventCallback::onWake() SimulationEventCallback::onSleep()
        */
        eSEND_SLEEP_NOTIFIES = (1 << 2),

        /**
        \brief Disables simulation for the actor.
    	
        \note This is only supported by RigidStatic and RigidDynamic actors and can be used to reduce the memory footprint when rigid actors are
        used for scene queries only.
	
        \note Setting this flag will remove all constraints attached to the actor from the scene.
	
        \note If this flag is set, the following calls are forbidden:
        \li RigidBody: setLinearVelocity(), setAngularVelocity(), addForce(), addTorque(), clearForce(), clearTorque()
        \li RigidDynamic: setKinematicTarget(), setWakeCounter(), wakeUp(), putToSleep()
	
        \par <b>Sleeping:</b>
        Raising this flag will set all velocities and the wake counter to 0, clear all forces, clear the kinematic target, put the actor
        to sleep and wake up all touching actors from the previous frame.
        */
        eDISABLE_SIMULATION = (1 << 3)
    }

    enum RigidBodyFlag {

        /**
        \brief Enables kinematic mode for the actor.

        Kinematic actors are special dynamic actors that are not 
        influenced by forces (such as gravity), and have no momentum. They are considered to have infinite
        mass and can be moved around the world using the setKinematicTarget() method. They will push 
        regular dynamic actors out of the way. Kinematics will not collide with static or other kinematic objects.

        Kinematic actors are great for moving platforms or characters, where direct motion control is desired.

        You can not connect Reduced joints to kinematic actors. Lagrange joints work ok if the platform
        is moving with a relatively low, uniform velocity.

        <b>Sleeping:</b>
        \li Setting this flag on a dynamic actor will put the actor to sleep and set the velocities to 0.
        \li If this flag gets cleared, the current sleep state of the actor will be kept.

        \note kinematic actors are incompatible with CCD so raising this flag will automatically clear eENABLE_CCD

        @see RigidDynamic.setKinematicTarget()
        */
        eKINEMATIC = (1 << 0),		//!< Enable kinematic mode for the body.

        /**
        \brief Use the kinematic target transform for scene queries.

        If this flag is raised, then scene queries will treat the kinematic target transform as the current pose
        of the body (instead of using the actual pose). Without this flag, the kinematic target will only take 
        effect with respect to scene queries after a simulation step.

        @see RigidDynamic.setKinematicTarget()
        */
        eUSE_KINEMATIC_TARGET_FOR_SCENE_QUERIES = (1 << 1),

        /**
        \brief Enables swept integration for the actor.

        If this flag is raised and CCD is enabled on the scene, then this body will be simulated by the CCD system to ensure that collisions are not missed due to 
        high-speed motion. Note individual shape pairs still need to enable PairFlag::eDETECT_CCD_CONTACT in the collision filtering to enable the CCD to respond to 
        individual interactions. 

        \note kinematic actors are incompatible with CCD so this flag will be cleared automatically when raised on a kinematic actor

        */
        eENABLE_CCD = (1 << 2),		//!< Enable CCD for the body.

        /**
        \brief Enabled CCD in swept integration for the actor.

        If this flag is raised and CCD is enabled, CCD interactions will simulate friction. By default, friction is disabled in CCD interactions because 
        CCD friction has been observed to introduce some simulation artifacts. CCD friction was enabled in previous versions of the SDK. Raising this flag will result in behavior 
        that is a closer match for previous versions of the SDK.

        \note This flag requires RigidBodyFlag::eENABLE_CCD to be raised to have any effect.
        */
        eENABLE_CCD_FRICTION = (1 << 3),

        /**
        \brief Register a rigid body for reporting pose changes by the simulation at an early stage.

        Sometimes it might be advantageous to get access to the new pose of a rigid body as early as possible and
        not wait until the call to fetchResults() returns. Setting this flag will schedule the rigid body to get reported
        in #SimulationEventCallback::onAdvance(). Please refer to the documentation of that callback to understand
        the behavior and limitations of this functionality.

        @see SimulationEventCallback::onAdvance()
        */
        eENABLE_POSE_INTEGRATION_PREVIEW = (1 << 4),

        /**
        \brief Register a rigid body to dynamicly adjust contact offset based on velocity. This can be used to achieve a CCD effect.
        */
        eENABLE_SPECULATIVE_CCD = (1 << 5),

        /**
        \brief Permit CCD to limit maxContactImpulse. This is useful for use-cases like a destruction system but can cause visual artefacts so is not enabled by default.
        */
        eENABLE_CCD_MAX_CONTACT_IMPULSE = (1 << 6)
    }

    enum ForceMode {
        eFORCE,				//!< parameter has unit of mass * distance/ time^2, i.e. a force
        eIMPULSE,			//!< parameter has unit of mass * distance /time
        eVELOCITY_CHANGE,	//!< parameter has unit of distance / time, i.e. the effect is mass independent: a velocity change.
        eACCELERATION		//!< parameter has unit of distance/ time^2, i.e. an acceleration. It gets treated just like a force except the mass is not divided out before integration.
    }

    enum RigidDynamicLockFlag {
        eLOCK_LINEAR_X = (1 << 0),
        eLOCK_LINEAR_Y = (1 << 1),
        eLOCK_LINEAR_Z = (1 << 2),
        eLOCK_ANGULAR_X = (1 << 3),
        eLOCK_ANGULAR_Y = (1 << 4),
        eLOCK_ANGULAR_Z = (1 << 5)
    }

    // Px1DConstraintFlag
    enum Constraint1DFlag {
        eSPRING = 1 << 0,		//!< whether the constraint is a spring. Mutually exclusive with eRESTITUTION. If set, eKEEPBIAS is ignored.
        eACCELERATION_SPRING = 1 << 1,		//!< whether the constraint is a force or acceleration spring. Only valid if eSPRING is set.
        eRESTITUTION = 1 << 2,		//!< whether the restitution model should be applied to generate the target velocity. Mutually exclusive with eSPRING. If restitution causes a bounces, eKEEPBIAS is ignored
        eKEEPBIAS = 1 << 3,		//!< whether to keep the error term when solving for velocity. Ignored if restitution generates bounce, or eSPRING is set.
        eOUTPUT_FORCE = 1 << 4,		//!< whether to accumulate the force value from this constraint in the force total that is reported for the constraint and tested for breakage
        eHAS_DRIVE_LIMIT = 1 << 5		//!< whether the constraint has a drive force limit (which will be scaled by dt unless PxConstraintFlag::eLIMITS_ARE_FORCES is set)
    }

    enum ConstraintFlag {
        eBROKEN = 1 << 0,			//!< whether the constraint is broken
        ePROJECT_TO_ACTOR0 = 1 << 1,			//!< whether actor1 should get projected to actor0 for this constraint (note: projection of a static/kinematic actor to a dynamic actor will be ignored)
        ePROJECT_TO_ACTOR1 = 1 << 2,			//!< whether actor0 should get projected to actor1 for this constraint (note: projection of a static/kinematic actor to a dynamic actor will be ignored)
        ePROJECTION = ePROJECT_TO_ACTOR0 | ePROJECT_TO_ACTOR1,	//!< whether the actors should get projected for this constraint (the direction will be chosen by PhysX)
        eCOLLISION_ENABLED = 1 << 3,			//!< whether contacts should be generated between the objects this constraint constrains
        eVISUALIZATION = 1 << 4,			//!< whether this constraint should be visualized, if constraint visualization is turned on
        eDRIVE_LIMITS_ARE_FORCES = 1 << 5,			//!< limits for drive strength are forces rather than impulses
        eIMPROVED_SLERP = 1 << 7,			//!< perform preprocessing for improved accuracy on D6 Slerp Drive (this flag will be removed in a future release when preprocessing is no longer required)
        eDISABLE_PREPROCESSING = 1 << 8,			//!< suppress constraint preprocessing, intended for use with rowResponseThreshold. May result in worse solver accuracy for ill-conditioned constraints.
        eGPU_COMPATIBLE = 1 << 9			//!< the constraint type is supported by gpu dynamic
    }

    enum ConstraintSolveHint {
        eNONE = 0,		//!< no special properties
        eACCELERATION1 = 256,		//!< a group of acceleration drive constraints with the same stiffness and drive parameters
        eSLERP_SPRING = 258,		//!< temporary special value to identify SLERP drive rows
        eACCELERATION2 = 512,		//!< a group of acceleration drive constraints with the same stiffness and drive parameters
        eACCELERATION3 = 768,		//!< a group of acceleration drive constraints with the same stiffness and drive parameters
        eROTATIONAL_EQUALITY = 1024,		//!< rotational equality constraints with no force limit and no velocity target
        eROTATIONAL_INEQUALITY = 1025,		//!< rotational inequality constraints with (0, PX_MAX_FLT) force limits	
        eEQUALITY = 2048,		//!< equality constraints with no force limit and no velocity target
        eINEQUALITY = 2049		//!< inequality constraints with (0, PX_MAX_FLT) force limits	
    }

    enum ConvexFlag {
        /**
        Denotes the use of 16-bit vertex indices in PxConvexMeshDesc::triangles or PxConvexMeshDesc::polygons.
        (otherwise, 32-bit indices are assumed)
        @see #PxConvexMeshDesc.indices
        */
        e16_BIT_INDICES = (1 << 0),

        /**
        Automatically recomputes the hull from the vertices. If this flag is not set, you must provide the entire geometry manually.

        \note There are two different algorithms for hull computation, please see PxConvexMeshCookingType. 

        @see PxConvexMeshCookingType
        */
        eCOMPUTE_CONVEX = (1 << 1),

        /**
        \brief Checks and removes almost zero-area triangles during convex hull computation. 
        The rejected area size is specified in PxCookingParams::areaTestEpsilon

        \note This flag is only used in combination with eCOMPUTE_CONVEX.

        \note If this flag is used in combination with eINFLATE_CONVEX, the newly added triangles 
        by the inflation algorithm are not checked (size of the triangles depends on PxCooking::skinWidth).  

        @see PxCookingParams PxCookingParams::areaTestEpsilon
        */
        eCHECK_ZERO_AREA_TRIANGLES = (1 << 2),

        /**
        \brief Inflates the convex points according to skin width.

        \note eINFLATE_CONVEX flag has been deprecated. The flag is automatically used when
        PxConvexMeshCookingType::eINFLATION_INCREMENTAL_HULL is set. The default algorithm 
        PxConvexMeshCookingType::eQUICK_HULL ignores this flag, inflation is not used. 

 

        /**
        \brief Quantizes the input vertices using the k-means clustering

        \note The input vertices are quantized to PxConvexMeshDesc::quantizedCount
        see http://en.wikipedia.org/wiki/K-means_clustering

        */
        eQUANTIZE_INPUT = (1 << 4),

        /**
        \brief Disables the convex mesh validation to speed-up hull creation. Please use separate validation
        function in checked/debug builds. Creating a convex mesh with invalid input data without prior validation
        may result in undefined behavior. 

        @see PxCooking::validateConvexMesh
        */
        eDISABLE_MESH_VALIDATION = (1 << 5),

        /**
        \brief Enables plane shifting vertex limit algorithm.

        Plane shifting is an alternative algorithm for the case when the computed hull has more vertices 
        than the specified vertex limit.

        The default algorithm computes the full hull, and an OBB around the input vertices. This OBB is then sliced
        with the hull planes until the vertex limit is reached.The default algorithm requires the vertex limit 
        to be set to at least 8, and typically produces results that are much better quality than are produced 
        by plane shifting.

        When plane shifting is enabled, the hull computation stops when vertex limit is reached. The hull planes
        are then shifted to contain all input vertices, and the new plane intersection points are then used to 
        generate the final hull with the given vertex limit.Plane shifting may produce sharp edges to vertices 
        very far away from the input cloud, and does not guarantee that all input vertices are inside the resulting
        hull.However, it can be used with a vertex limit as low as 4.
        */
        ePLANE_SHIFTING = (1 << 6),

        /**
        \brief Inertia tensor computation is faster using SIMD code, but the precision is lower, which may result 
        in incorrect inertia for very thin hulls.
        */
        eFAST_INERTIA_COMPUTATION = (1 << 7),


        /**
        \brief Convex hull input vertices are shifted to be around origin to provide better computation stability.
        It is recommended to provide input vertices around the origin, otherwise use this flag to improve 
        numerical stability.
        \note Is used only with eCOMPUTE_CONVEX flag.
        */
        eSHIFT_VERTICES = (1 << 9)
    }

    enum ConvexMeshCookingType {
        eQUICKHULL
    }

    enum MeshCookingHint {
        eSIM_PERFORMANCE = 0,		//!< Default value. Favors higher quality hierarchy with higher runtime performance over cooking speed.
        eCOOKING_PERFORMANCE = 1	//!< Enables fast cooking path at the expense of somewhat lower quality hierarchy construction.
    }

    enum MeshPreprocessingFlag {
        /**
        \brief When set, mesh welding is performed. See CookingParams::meshWeldTolerance. Clean mesh must be enabled.
        */
        eWELD_VERTICES = 1 << 0,

        /**
        \brief When set, mesh cleaning is disabled. This makes cooking faster.

        When clean mesh is not performed, mesh welding is also not performed. 

        It is recommended to use only meshes that passed during validateTriangleMesh. 

        */
        eDISABLE_CLEAN_MESH = 1 << 1,

        /**
        \brief When set, active edges are set for each triangle edge. This makes cooking faster but slow up contact generation.
        */
        eDISABLE_ACTIVE_EDGES_PRECOMPUTE = 1 << 2,

        /**
        \brief When set, 32-bit indices will always be created regardless of triangle count.

        \note By default mesh will be created with 16-bit indices for triangle count <= 0xFFFF and 32-bit otherwise.
        */
        eFORCE_32BIT_INDICES = 1 << 3
    }

    enum QueryHitType {
        eNONE = 0,	//!< the query should ignore this shape
        eTOUCH = 1,	//!< a hit on the shape touches the intersection geometry of the query but does not block it
        eBLOCK = 2		//!< a hit on the shape blocks the query (does not block overlap queries)
    }

    enum HitFlag {
        ePOSITION = (1 << 0),	//!< "position" member of #PxQueryHit is valid
        eNORMAL = (1 << 1),	//!< "normal" member of #PxQueryHit is valid
        eUV = (1 << 3),	//!< "u" and "v" barycentric coordinates of #PxQueryHit are valid. Not applicable to sweep queries.
        eASSUME_NO_INITIAL_OVERLAP = (1 << 4),	//!< Performance hint flag for sweeps when it is known upfront there's no initial overlap.
        //!< NOTE: using this flag may cause undefined results if shapes are initially overlapping.
        eMESH_MULTIPLE = (1 << 5),	//!< Report all hits for meshes rather than just the first. Not applicable to sweep queries.
        eMESH_ANY = (1 << 6),	//!< Report any first hit for meshes. If neither eMESH_MULTIPLE nor eMESH_ANY is specified,
        //!< a single closest hit will be reported for meshes.
        eMESH_BOTH_SIDES = (1 << 7),	//!< Report hits with back faces of mesh triangles. Also report hits for raycast
        //!< originating on mesh surface and facing away from the surface normal. Not applicable to sweep queries.
        //!< Please refer to the user guide for heightfield-specific differences.
        ePRECISE_SWEEP = (1 << 8),	//!< Use more accurate but slower narrow phase sweep tests.
        //!< May provide better compatibility with PhysX 3.2 sweep behavior.
        eMTD = (1 << 9),	//!< Report the minimum translation depth, normal and contact point.
        eFACE_INDEX = (1 << 10),	//!< "face index" member of #PxQueryHit is valid

        eDEFAULT = ePOSITION | eNORMAL | eFACE_INDEX,

        /** \brief Only this subset of flags can be modified by pre-filter. Other modifications will be discarded. */
        eMODIFIABLE_FLAGS = eMESH_MULTIPLE | eMESH_BOTH_SIDES | eASSUME_NO_INITIAL_OVERLAP | ePRECISE_SWEEP
    }

    enum FilterFlag {
        /**
        \brief Ignore the collision pair as long as the bounding volumes of the pair objects overlap.

        Killed pairs will be ignored by the simulation and won't run through the filter again until one
        of the following occurs:

        \li The bounding volumes of the two objects overlap again (after being separated)
        \li The user enforces a re-filtering (see #PxScene::resetFiltering())

        @see PxScene::resetFiltering()
        */
        eKILL = (1 << 0),

        /**
        \brief Ignore the collision pair as long as the bounding volumes of the pair objects overlap or until filtering relevant data changes for one of the collision objects.

        Suppressed pairs will be ignored by the simulation and won't make another filter request until one
        of the following occurs:

        \li Same conditions as for killed pairs (see #eKILL)
        \li The filter data or the filter object attributes change for one of the collision objects

        \note For PxCloth objects, eSUPPRESS will be treated as eKILL.

        @see PxFilterData PxFilterObjectAttributes
        */
        eSUPPRESS = (1 << 1),

        /**
        \brief Invoke the filter callback (#PxSimulationFilterCallback::pairFound()) for this collision pair.

        @see PxSimulationFilterCallback
        */
        eCALLBACK = (1 << 2),

        /**
        \brief Track this collision pair with the filter callback mechanism.

        When the bounding volumes of the collision pair lose contact, the filter callback #PxSimulationFilterCallback::pairLost()
        will be invoked. Furthermore, the filter status of the collision pair can be adjusted through #PxSimulationFilterCallback::statusChange()
        once per frame (until a pairLost() notification occurs).

        @see PxSimulationFilterCallback
        */
        eNOTIFY = (1 << 3) | eCALLBACK,

        /**
        \brief Provided default to get standard behavior:

        The application configure the pair's collision properties once when bounding volume overlap is found and
        doesn't get asked again about that pair until overlap status or filter properties changes, or re-filtering is requested.

        No notification is provided when bounding volume overlap is lost

        The pair will not be killed or suppressed, so collision detection will be processed
        */

        eDEFAULT = 0
    }

    enum FilterObjectType {
        /**
        \brief A static rigid body
        @see RigidStatic
        */
        eRIGID_STATIC,

        /**
        \brief A dynamic rigid body
        @see RigidDynamic
        */
        eRIGID_DYNAMIC,

        /**
        \brief An articulation
        @see Articulation
        */
        eARTICULATION = 4,


    }

    enum FilterObjectFlag {
        eKINEMATIC = (1 << 4),
        eTRIGGER = (1 << 5)
    }

    enum GeometryType {
        eSPHERE,
        ePLANE,
        eCAPSULE,
        eBOX,
        eCONVEXMESH,
        eTRIANGLEMESH,
        eHEIGHTFIELD
    }

    enum ConvexMeshGeometryFlag {
        eTIGHT_BOUNDS = (1 << 0)	//!< Use tighter (but more expensive to compute) bounds around the convex geometry.
    }

    enum HeightFieldFormat {
        /**
        \brief Height field height data is 16 bit signed integers, followed by triangle materials. 
        
        Each sample is 32 bits wide arranged as follows:
        
        \image html heightFieldFormat_S16_TM.png

        1) First there is a 16 bit height value.
        2) Next, two one byte material indices, with the high bit of each byte reserved for special use.
        (so the material index is only 7 bits).
        The high bit of material0 is the tess-flag.
        The high bit of material1 is reserved for future use.
        
        There are zero or more unused bytes before the next sample depending on HeightFieldDesc.sampleStride, 
        where the application may eventually keep its own data.

        This is the only format supported at the moment.

        @see HeightFieldDesc.format HeightFieldDesc.samples
        */
        eS16_TM = (1 << 0)
    }

    enum HeightFieldFlag {
        /**
        \brief Disable collisions with height field with boundary edges.
    	
        Raise this flag if several terrain patches are going to be placed adjacent to each other, 
        to avoid a bump when sliding across.

        This flag is ignored in contact generation with sphere and capsule shapes.

        @see PxHeightFieldDesc.flags
        */
        eNO_BOUNDARY_EDGES = (1 << 0)
    }

    enum D6Axis {
        eX = 0,	//!< motion along the X axix
        eY = 1,	//!< motion along the Y axis
        eZ = 2,	//!< motion along the Z axis
        eTWIST = 3,	//!< motion around the X axis
        eSWING1 = 4,	//!< motion around the Y axis
        eSWING2 = 5,	//!< motion around the Z axis
    }

    enum D6Motion {
        eLOCKED,	//!< The DOF is locked, it does not allow relative motion.
        eLIMITED,	//!< The DOF is limited, it only allows motion within a specific range.
        eFREE		//!< The DOF is free and has its full range of motion.
    }

    enum D6Drive {
        eX = 0,		//!< drive along the X-axis
        eY = 1,		//!< drive along the Y-axis
        eZ = 2,		//!< drive along the Z-axis
        eSWING = 3,		//!< drive of displacement from the X-axis
        eTWIST = 4,		//!< drive of the displacement around the X-axis
        eSLERP = 5,		//!< drive of all three angular degrees along a SLERP-path
    }

    enum D6JointDriveFlag {
        eACCELERATION = 1	//!< drive spring is for the acceleration at the joint (rather than the force) 
    }

    enum JointActorIndex {
        eACTOR0,
        eACTOR1,
    }

    enum DistanceJointFlag {
        eMAX_DISTANCE_ENABLED = 1 << 1,
        eMIN_DISTANCE_ENABLED = 1 << 2,
        eSPRING_ENABLED = 1 << 3
    }

    enum PrismaticJointFlag {
        eLIMIT_ENABLED = 1 << 1
    }

    enum RevoluteJointFlag {
        eLIMIT_ENABLED = 1 << 0,		//!< enable the limit
        eDRIVE_ENABLED = 1 << 1,		//!< enable the drive
        eDRIVE_FREESPIN = 1 << 2		//!< if the existing velocity is beyond the drive velocity, do not add force
    }

    enum MaterialFlag {
        /**
        If this flag is set, friction computations are always skipped between shapes with this material and any other shape.
        */
        eDISABLE_FRICTION = 1 << 0,

        /**
        The difference between "normal" and "strong" friction is that the strong friction feature
        remembers the "friction error" between simulation steps. The friction is a force trying to
        hold objects in place (or slow them down) and this is handled in the solver. But since the
        solver is only an approximation, the result of the friction calculation can include a small
        "error" - e.g. a box resting on a slope should not move at all if the static friction is in
        action, but could slowly glide down the slope because of a small friction error in each 
        simulation step. The strong friction counter-acts this by remembering the small error and
        taking it to account during the next simulation step.

        However, in some cases the strong friction could cause problems, and this is why it is
        possible to disable the strong friction feature by setting this flag. One example is
        raycast vehicles, that are sliding fast across the surface, but still need a precise
        steering behavior. It may be a good idea to reenable the strong friction when objects
        are coming to a rest, to prevent them from slowly creeping down inclines.

        Note: This flag only has an effect if the MaterialFlag::eDISABLE_FRICTION bit is 0.
        */
        eDISABLE_STRONG_FRICTION = 1 << 1
    }

    enum CombineMode {
        eAVERAGE = 0,		//!< Average: (a + b)/2
        eMIN = 1,		//!< Minimum: minimum(a,b)
        eMULTIPLY = 2,		//!< Multiply: a*b
        eMAX = 3,		//!< Maximum: maximum(a,b)
    }

    enum SceneFlag {
        /**
        \brief Enable Active Actors Notification.

        This flag enables the Active Actor Notification feature for a scene.  This
        feature defaults to disabled.  When disabled, the function
        Scene::getActiveActors() will always return a NULL list.

        \note There may be a performance penalty for enabling the Active Actor Notification, hence this flag should
        only be enabled if the application intends to use the feature.

        <b>Default:</b> False
        */
        eENABLE_ACTIVE_ACTORS = (1 << 0),

        /**
        \brief Enables a second broad phase check after integration that makes it possible to prevent objects from tunneling through eachother.

        PairFlag::eDETECT_CCD_CONTACT requires this flag to be specified.

        \note For this feature to be effective for bodies that can move at a significant velocity, the user should raise the flag RigidBodyFlag::eENABLE_CCD for them.
        \note This flag is not mutable, and must be set in SceneDesc at scene creation.

        <b>Default:</b> False

        @see RigidBodyFlag::eENABLE_CCD, PairFlag::eDETECT_CCD_CONTACT, eDISABLE_CCD_RESWEEP
        */
        eENABLE_CCD = (1 << 2),

        /**
        \brief Enables a simplified swept integration strategy, which sacrifices some accuracy for improved performance.

        This simplified swept integration approach makes certain assumptions about the motion of objects that are not made when using a full swept integration. 
        These assumptions usually hold but there are cases where they could result in incorrect behavior between a set of fast-moving rigid bodies. A key issue is that
        fast-moving dynamic objects may tunnel through each-other after a rebound. This will not happen if this mode is disabled. However, this approach will be potentially 
        faster than a full swept integration because it will perform significantly fewer sweeps in non-trivial scenes involving many fast-moving objects. This approach 
        should successfully resist objects passing through the static environment.

        PairFlag::eDETECT_CCD_CONTACT requires this flag to be specified.

        \note This scene flag requires eENABLE_CCD to be enabled as well. If it is not, this scene flag will do nothing.
        \note For this feature to be effective for bodies that can move at a significant velocity, the user should raise the flag RigidBodyFlag::eENABLE_CCD for them.
        \note This flag is not mutable, and must be set in SceneDesc at scene creation.

        <b>Default:</b> False

        @see RigidBodyFlag::eENABLE_CCD, PairFlag::eDETECT_CCD_CONTACT, eENABLE_CCD
        */
        eDISABLE_CCD_RESWEEP = (1 << 3),

        /**
        \brief Enable adaptive forces to accelerate convergence of the solver. 
        
        \note This flag is not mutable, and must be set in SceneDesc at scene creation.

        <b>Default:</b> false
        */
        eADAPTIVE_FORCE = (1 << 4),

        /**
        \brief Enable GJK-based distance collision detection system.
        
        \note This flag is not mutable, and must be set in SceneDesc at scene creation.

        <b>Default:</b> true
        */
        eENABLE_PCM = (1 << 9),

        /**
        \brief Disable contact report buffer resize. Once the contact buffer is full, the rest of the contact reports will 
        not be buffered and sent.

        \note This flag is not mutable, and must be set in SceneDesc at scene creation.
        
        <b>Default:</b> false
        */
        eDISABLE_CONTACT_REPORT_BUFFER_RESIZE = (1 << 10),

        /**
        \brief Disable contact cache.
        
        Contact caches are used internally to provide faster contact generation. You can disable all contact caches
        if memory usage for this feature becomes too high.

        \note This flag is not mutable, and must be set in SceneDesc at scene creation.

        <b>Default:</b> false
        */
        eDISABLE_CONTACT_CACHE = (1 << 11),

        /**
        \brief Require scene-level locking

        When set to true this requires that threads accessing the Scene use the
        multi-threaded lock methods.
        
        \note This flag is not mutable, and must be set in SceneDesc at scene creation.

        @see Scene::lockRead
        @see Scene::unlockRead
        @see Scene::lockWrite
        @see Scene::unlockWrite
        
        <b>Default:</b> false
        */
        eREQUIRE_RW_LOCK = (1 << 12),

        /**
        \brief Enables additional stabilization pass in solver

        When set to true, this enables additional stabilization processing to improve that stability of complex interactions between large numbers of bodies.

        Note that this flag is not mutable and must be set in SceneDesc at scene creation. Also, this is an experimental feature which does result in some loss of momentum.
        */
        eENABLE_STABILIZATION = (1 << 14),

        /**
        \brief Enables average points in contact manifolds

        When set to true, this enables additional contacts to be generated per manifold to represent the average point in a manifold. This can stabilize stacking when only a small
        number of solver iterations is used.

        Note that this flag is not mutable and must be set in SceneDesc at scene creation.
        */
        eENABLE_AVERAGE_POINT = (1 << 15),

        /**
        \brief Do not report kinematics in list of active actors/transforms.

        Since the target pose for kinematics is set by the user, an application can track the activity state directly and use
        this flag to avoid that kinematics get added to the list of active actors/transforms.

        \note This flag has only an effect in combination with eENABLE_ACTIVE_ACTORS or eENABLE_ACTIVETRANSFORMS.

        @see eENABLE_ACTIVE_ACTORS eENABLE_ACTIVETRANSFORMS

        <b>Default:</b> false
        */
        eEXCLUDE_KINEMATICS_FROM_ACTIVE_ACTORS = (1 << 17),

        /**
        \brief Provides improved determinism at the expense of performance. 

        By default, we provides limited determinism guarantees. Specifically, we guarantees that the exact scene (same actors created in the same order) and simulated using the same 
        time-stepping scheme should provide the exact same behaviour.

        However, if additional actors are added to the simulation, this can affect the behaviour of the existing actors in the simulation, even if the set of new actors do not interact with 
        the existing actors.

        This flag provides an additional level of determinism that guarantees that the simulation will not change if additional actors are added to the simulation, provided those actors do not interfere
        with the existing actors in the scene. Determinism is only guaranteed if the actors are inserted in a consistent order each run in a newly-created scene and simulated using a consistent time-stepping
        scheme.

        Note that this flag is not mutable and must be set at scene creation.

        Note that enabling this flag can have a negative impact on performance.

        Note that this feature is not currently supported on GPU.

        <b>Default</b> false
        */
        eENABLE_ENHANCED_DETERMINISM = (1 << 20),
    }

    enum ActorTypeFlag {
        /**
        \brief A static rigid body
        @see RigidStatic
        */
        eRIGID_STATIC = (1 << 0),

        /**
        \brief A dynamic rigid body
        @see RigidDynamic
        */
        eRIGID_DYNAMIC = (1 << 1),
    }

    enum ShapeFlag {
        /**
        \brief The shape will partake in collision in the physical simulation.
    
        \note It is illegal to raise the eSIMULATION_SHAPE and eTRIGGER_SHAPE flags.
        In the event that one of these flags is already raised the sdk will reject any 
        attempt to raise the other.  To raise the eSIMULATION_SHAPE first ensure that 
        eTRIGGER_SHAPE is already lowered.
    
        \note This flag has no effect if simulation is disabled for the corresponding actor (see #ActorFlag::eDISABLE_SIMULATION).
    
        @see SimulationEventCallback.onContact() Scene.setSimulationEventCallback() Shape.setFlag(), Shape.setFlags()
        */
        eSIMULATION_SHAPE = (1 << 0),

        /**
        \brief The shape will partake in scene queries (ray casts, overlap tests, sweeps, ...).
        */
        eSCENE_QUERY_SHAPE = (1 << 1),

        /**
        \brief The shape is a trigger which can send reports whenever other shapes enter/leave its volume.
    
        \note Triangle meshes and heightfields can not be triggers. Shape creation will fail in these cases.
    
        \note Shapes marked as triggers do not collide with other objects. If an object should act both
        as a trigger shape and a collision shape then create a rigid body with two shapes, one being a 
        trigger shape and the other a collision shape. 	It is illegal to raise the eTRIGGER_SHAPE and 
        eSIMULATION_SHAPE flags on a single Shape instance.  In the event that one of these flags is already 
        raised the sdk will reject any attempt to raise the other.  To raise the eTRIGGER_SHAPE flag first 
        ensure that eSIMULATION_SHAPE flag is already lowered.
    
        \note Shapes marked as triggers are allowed to participate in scene queries, provided the eSCENE_QUERY_SHAPE flag is set. 
    
        \note This flag has no effect if simulation is disabled for the corresponding actor (see #ActorFlag::eDISABLE_SIMULATION).
    
        @see SimulationEventCallback.onTrigger() Scene.setSimulationEventCallback() Shape.setFlag(), Shape.setFlags()
        */
        eTRIGGER_SHAPE = (1 << 2),
    }

    enum MeshGeometryFlag {
        eDOUBLE_SIDED = (1 << 1)
    }

    enum MeshFlag {
        /**
        \brief Specifies if the SDK should flip normals.

        The PhysX libraries assume that the face normal of a triangle with vertices [a,b,c] can be computed as:
        edge1 = b-a
        edge2 = c-a
        face_normal = edge1 x edge2.

        Note: This is the same as a counterclockwise winding in a right handed coordinate system or
        alternatively a clockwise winding order in a left handed coordinate system.

        If this does not match the winding order for your triangles, raise the below flag.
        */

        eFLIPNORMALS = (1 << 0),
        e16_BIT_INDICES = (1 << 1)	//!< Denotes the use of 16-bit vertex indices
    }

}