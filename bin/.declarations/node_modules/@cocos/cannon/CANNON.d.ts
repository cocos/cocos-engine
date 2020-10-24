
// tslint:disable:max-line-length
// tslint:disable-next-line:no-namespace
declare namespace CANNON {

    interface IAABBOptions {

        upperBound?: Vec3;
        lowerBound?: Vec3;

    }

    class AABB {

        public lowerBound: Vec3;
        public upperBound: Vec3;

        constructor (options?: IAABBOptions);

        public clone (): AABB;
        public copy (aabb: AABB): void;
        public extend (aabb: AABB): void;
        public getCorners (a: Vec3, b: Vec3, c: Vec3, d: Vec3, e: Vec3, f: Vec3, g: Vec3, h: Vec3): void;
        public overlaps (aabb: AABB): boolean;
        public setFromPoints (points: Vec3[], position?: Vec3, quaternion?: Quaternion, skinSize?: number): AABB;
        public toLocalFrame (frame: Transform, target: AABB): AABB;
        public toWorldFrame (frame: Transform, target: AABB): AABB;

    }

    /**
     * @class OctreeNode
     * @param {object} [options]
     * @param {Octree} [options.root]
     * @param {AABB} [options.aabb]
     */
    class OctreeNode {
        /**
         * The root node
         * @property {OctreeNode} root
         */
        root: OctreeNode | null;

        /**
         * Boundary of this node
         * @property {AABB} aabb
         */
        aabb: AABB;

        /**
         * Contained data at the current node level.
         * @property {Array} data
         */
        data: number[];

        /**
         * Children to this node
         * @property {Array} children
         */
        children: OctreeNode[];

        /**
         * Insert data into this node
         * @method insert
         * @param  {AABB} aabb
         * @param  {object} elementData
         * @return {boolean} True if successful, otherwise false
         */
        insert (aabb: AABB, elementData: any, level?: number | 0): boolean

        reset (): void;

        /**
         * Create 8 equally sized children nodes and put them in the .children array.
         * @method subdivide
         */
        subdivide (): void;

        /**
         * Get all data, potentially within an AABB
         * @method aabbQuery
         * @param  {AABB} aabb
         * @param  {array} result
         * @return {array} The "result" object
         */
        aabbQuery (aabb: AABB, resul: any[]): any[]

        /**
         * Get all data, potentially intersected by a ray.
         * @method rayQuery
         * @param  {Ray} ray
         * @param  {Transform} treeTransform
         * @param  {array} result
         * @return {array} The "result" object
         */
        rayQuery (ray: Ray, treeTransform: Transform, result: any[]): any[];

        /**
         * @method removeEmptyNodes
         */
        removeEmptyNodes (): void;

    }

    /**
     * @class Octree
     * @param {AABB} aabb The total AABB of the tree
     * @param {object} [options]
     * @param {number} [options.maxDepth=8]
     * @extends OctreeNode
     */
    class Octree extends OctreeNode {
        maxDepth: number | 8;

        constructor (aabb?: AABB, opt?: any);
    }

    class ArrayCollisionMatrix {

        public matrix: Mat3[];

        public get (i: number, j: number): number;
        public set (i: number, j: number, value: number): void;
        public reset (): void;
        public setNumObjects (n: number): void;

    }

    class BroadPhase {

        public world: World;
        public useBoundingBoxes: boolean;
        public dirty: boolean;

        public collisionPairs (world: World, p1: Body[], p2: Body[]): void;
        public needBroadphaseCollision (bodyA: Body, bodyB: Body): boolean;
        public intersectionTest (bodyA: Body, bodyB: Body, pairs1: Body[], pairs2: Body[]): void;
        public doBoundingSphereBroadphase (bodyA: Body, bodyB: Body, pairs1: Body[], pairs2: Body[]): void;
        public doBoundingBoxBroadphase (bodyA: Body, bodyB: Body, pairs1: Body[], pairs2: Body[]): void;
        public makePairsUnique (pairs1: Body[], pairs2: Body[]): void;
        public setWorld (world: World): void;
        public boundingSphereCheck (bodyA: Body, bodyB: Body): boolean;
        public aabbQuery (world: World, aabb: AABB, result: Body[]): Body[];

    }

    class GridBroadphase extends BroadPhase {

        public nx: number;
        public ny: number;
        public nz: number;
        public aabbMin: Vec3;
        public aabbMax: Vec3;
        public bins: any[];

        constructor (aabbMin?: Vec3, aabbMax?: Vec3, nx?: number, ny?: number, nz?: number);

    }

    class NaiveBroadphase extends BroadPhase {
    }

    class ObjectCollisionMatrix {

        public matrix: number[];

        public get (i: number, j: number): number;
        public set (i: number, j: number, value: number): void;
        public reset (): void;
        public setNumObjects (n: number): void;

    }

    class Ray {

        public from: Vec3;
        public to: Vec3;
        public precision: number;
        public checkCollisionResponse: boolean;

        constructor (from?: Vec3, to?: Vec3);

        public getAABB (result: RaycastResult): void;

    }

    class RaycastResult {

        public rayFromWorld: Vec3;
        public rayToWorld: Vec3;
        public hitNormalWorld: Vec3;
        public hitPointWorld: Vec3;
        public hasHit: boolean;
        public shape: Shape;
        public body: Body;
        public distance: number;

        public reset (): void;
        public set (rayFromWorld: Vec3, rayToWorld: Vec3, hitNormalWorld: Vec3, hitPointWorld: Vec3, shape: Shape, body: Body, distance: number): void;

    }

    class SAPBroadphase extends BroadPhase {

        public static insertionSortX (a: any[]): any[];
        public static insertionSortY (a: any[]): any[];
        public static insertionSortZ (a: any[]): any[];
        public static checkBounds (bi: Body, bj: Body, axisIndex?: number): boolean;

        public axisList: any[];
        public world: World;
        public axisIndex: number;

        constructor (world?: World);

        public autoDetectAxis (): void;
        public aabbQuery (world: World, aabb: AABB, result?: Body[]): Body[];

    }

    interface IConstraintOptions {

        collideConnected?: boolean;
        wakeUpBodies?: boolean;

    }

    class Constraint {

        public equations: any[];
        public bodyA: Body;
        public bodyB: Body;
        public id: number;
        public collideConnected: boolean;

        constructor (bodyA: Body, bodyB: Body, options?: IConstraintOptions);

        public update (): void;
        public disable (): void;
        public enable (): void;

    }

    class DistanceConstraint extends Constraint {

        constructor (bodyA: Body, bodyB: Body, distance: number, maxForce?: number);

    }

    interface IHingeConstraintOptions {

        pivotA?: Vec3;
        axisA?: Vec3;
        pivotB?: Vec3;
        axisB?: Vec3;
        maxForce?: number;

    }

    class HingeConstraint extends PointToPointConstraint {

        public motorEnabled: boolean;
        public motorTargetVelocity: number;
        public motorMinForce: number;
        public motorMaxForce: number;
        public motorEquation: RotationalMotorEquation;
        pivotA: Vec3;
        axisA: Vec3;
        pivotB: Vec3;
        axisB: Vec3;
        equations: any[];
        constructor (bodyA: Body, bodyB: Body, options?: IHingeConstraintOptions);

        public enableMotor (): void;
        public disableMotor (): void;
        setMotorSpeed (v: number): void;
        setMotorMaxForce (v: number): void;
        update (): void;
    }

    class PointToPointConstraint extends Constraint {

        constructor (bodyA: Body, pivotA: Vec3 | null, bodyB: Body, pivotB?: Vec3, maxForce?: number);
        pivotA: Vec3;
        pivotB: Vec3;
        equations: ContactEquation[];
    }

    interface ILockConstraintOptions {
        maxForce?: number;
    }

    class LockConstraint extends Constraint {
        constructor (bodyA: Body, bodyB: Body, options?: ILockConstraintOptions);
    }

    interface IConeTwistConstraintOptions {
        pivotA?: Vec3;
        pivotB?: Vec3;
        axisA?: Vec3;
        axisB?: Vec3;
        maxForce?: number;
    }

    class ConeTwistConstraint extends Constraint {
        constructor (bodyA: Body, bodyB: Body, options?: IConeTwistConstraintOptions);
    }

    class Equation {

        public readonly id: number;
        public minForce: number;
        public maxForce: number;
        public bi: Body;
        public bj: Body;
        public a: number;
        public b: number;
        public eps: number;
        public jacobianElementA: JacobianElement;
        public jacobianElementB: JacobianElement;
        public enabled: boolean;
        public multiplier: number;
        constructor (bi: Body, bj: Body, minForce?: number, maxForce?: number);

        public setSpookParams (stiffness: number, relaxation: number, timeStep: number): void;
        public computeB (a: number, b: number, h: number): number;
        public computeGq (): number;
        public computeGW (): number;
        public computeGWlamda (): number;
        public computeGiMf (): number;
        public computeGiMGt (): number;
        public addToWlamda (deltalambda: number): number;
        public computeC (): number;

    }

    class FrictionEquation extends Equation {

        constructor (bi: Body, bj: Body, slipForce: number);

    }

    class RotationalEquation extends Equation {

        public ni: Vec3;
        public nj: Vec3;
        public nixnj: Vec3;
        public njxni: Vec3;
        public invIi: Mat3;
        public invIj: Mat3;
        public relVel: Vec3;
        public relForce: Vec3;

        axisA: Vec3;
        axisB: Vec3;
        maxAngle: number;

        constructor (bodyA: Body, bodyB: Body);        
    }

    class RotationalMotorEquation extends Equation {

        public axisA: Vec3;
        public axisB: Vec3;
        public invLi: Mat3;
        public invIj: Mat3;
        public targetVelocity: number;

        constructor (bodyA: Body, bodyB: Body, maxForce?: number);        
    }

    class ContactEquation extends Equation {

        public si: Shape;
        public sj: Shape;
        public restitution: number;
        public ri: Vec3;
        public rj: Vec3;
        // public penetrationVec: Vec3;
        public ni: Vec3;
        // public rixn: Vec3;
        // public rjxn: Vec3;
        // public invIi: Mat3;
        // public invIj: Mat3;
        // public biInvInertiaTimesRixn: Vec3;
        // public bjInvInertiaTimesRjxn: Vec3;

        constructor (bi: Body, bj: Body);

    }

    interface IContactMaterialOptions {

        friction?: number;
        restitution?: number;
        contactEquationStiffness?: number;
        contactEquationRelaxation?: number;
        frictionEquationStiffness?: number;
        frictionEquationRelaxation?: number;

    }

    class ContactMaterial {

        public id: number;
        public materials: Material[];
        public friction: number;
        public restitution: number;
        public contactEquationStiffness: number;
        public contactEquationRelaxation: number;
        public frictionEquationStiffness: number;
        public frictionEquationRelaxation: number;

        constructor (m1: Material, m2: Material, options?: IContactMaterialOptions);

    }

    class Material {

        public name: string;
        public id: number;
        public friction: number;
        public restitution: number;

        constructor (name: string);

    }

    class JacobianElement {

        public spatial: Vec3;
        public rotational: Vec3;

        public multiplyElement (element: JacobianElement): number;
        public multiplyVectors (spacial: Vec3, rotational: Vec3): number;

    }

    class Mat3 {

        constructor (elements?: number[]);

        public identity (): void;
        public setZero (): void;
        public setTrace (vec3: Vec3): void;
        public getTrace (target: Vec3): void;
        public vmult (v: Vec3, target?: Vec3): Vec3;
        public smult (s: number): void;
        public mmult (m: Mat3): Mat3;
        public scale (v: Vec3, target?: Mat3): Mat3;
        public solve (b: Vec3, target?: Vec3): Vec3;
        public e (row: number, column: number, value?: number): number;
        public copy (source: Mat3): Mat3;
        public toString (): string;
        public reverse (target?: Mat3): Mat3;
        public setRotationFromQuaternion (q: Quaternion): Mat3;
        public transpose (target?: Mat3): Mat3;

    }

    class Quaternion {

        public x: number;
        public y: number;
        public z: number;
        public w: number;

        constructor (x?: number, y?: number, z?: number, w?: number);

        public set (x: number, y: number, z: number, w: number): void;
        public toString (): string;
        public toArray (): number[];
        public setFromAxisAngle (axis: Vec3, angle: number): void;
        public toAxisAngle (targetAxis?: Vec3): any[];
        public setFromVectors (u: Vec3, v: Vec3): void;
        public mult (q: Quaternion, target?: Quaternion): Quaternion;
        public inverse (target?: Quaternion): Quaternion;
        public conjugate (target?: Quaternion): Quaternion;
        public normalize (): void;
        public normalizeFast (): void;
        public vmult (v: Vec3, target?: Vec3): Vec3;
        public copy (source: Quaternion): Quaternion;
        public toEuler (target: Vec3, order?: string): void;
        public setFromEuler (x: number, y: number, z: number, order?: string): Quaternion;
        public clone (): Quaternion;

    }

    class Transform {

        public static pointToLocalFrame (position: Vec3, quaternion: Quaternion, worldPoint: Vec3, result?: Vec3): Vec3;
        public static pointToWorldFrame (position: Vec3, quaternion: Quaternion, localPoint: Vec3, result?: Vec3): Vec3;

        public position: Vec3;
        public quaternion: Quaternion;

        public vectorToWorldFrame (localVector: Vec3, result?: Vec3): Vec3;
        public vectorToLocalFrame (position: Vec3, quaternion: Quaternion, worldVector: Vec3, result?: Vec3): Vec3;

    }

    class Vec3 {

        public static ZERO: Vec3;

        public x: number;
        public y: number;
        public z: number;

        constructor (x?: number, y?: number, z?: number);

        public cross (v: Vec3, target?: Vec3): Vec3;
        public set (x: number, y: number, z: number): Vec3;
        public setZero (): void;
        public vadd (v: Vec3, target?: Vec3): Vec3;
        public vsub (v: Vec3, target?: Vec3): Vec3;
        public crossmat (): Mat3;
        public normalize (): number;
        public unit (target?: Vec3): Vec3;
        public norm (): number;
        public length (): number;
        public norm2 (): number;
        public distanceTo (p: Vec3): number;
        public mult (scalar: number, target?: Vec3): Vec3;
        public scale (scalar: number, target?: Vec3): Vec3;
        public dot (v: Vec3): number;
        public isZero (): boolean;
        public negate (target?: Vec3): Vec3;
        public tangents (t1: Vec3, t2: Vec3): void;
        public toString (): string;
        public toArray (): number[];
        public copy (source: Vec3): Vec3;
        public lerp (v: Vec3, t: number, target?: Vec3): void;
        public almostEquals (v: Vec3, precision?: number): boolean;
        public almostZero (precision?: number): boolean;
        public isAntiparallelTo (v: Vec3, prescision?: number): boolean;
        public clone (): Vec3;

    }

    interface IBodyOptions {
        position?: Vec3;
        velocity?: Vec3;
        angularVelocity?: Vec3;
        quaternion?: Quaternion;
        mass?: number;
        material?: Material;
        type?: number;
        linearDamping?: number;
        angularDamping?: number;
        allowSleep?: boolean;
        sleepSpeedLimit?: number;
        sleepTimeLimit?: number;
        collisionFilterGroup?: number;
        collisionFilterMask?: number;
        fixedRotation?: boolean;
        useGravity?: boolean;
        shape?: Shape;
    }

    class Body extends EventTarget {

        public static DYNAMIC: number;
        public static STATIC: number;
        public static KINEMATIC: number;
        public static AWAKE: number;
        public static SLEEPY: number;
        public static SLEEPING: number;
        public static sleepyEvent: IEvent;
        public static sleepEvent: IEvent;

        public readonly id: number;
        public world: World;
        public preStep: Function;
        public postStep: Function;
        public vlambda: Vec3;
        public collisionFilterGroup: number;
        public collisionFilterMask: number;
        public collisionResponse: boolean;

        public position: Vec3;
        public previousPosition: Vec3;
        public initPosition: Vec3;
        public interpolatedPosition: Vec3;

        public velocity: Vec3;
        public initVelocity: Vec3;
        public angularVelocity: Vec3;
        public initAngularVelocity: Vec3;

        public force: Vec3;
        public torque: Vec3;

        public mass: number;
        public invMass: number;
        public material: Material;
        public linearDamping: number;
        public type: number;
        public allowSleep: boolean;
        public sleepState: number;
        public sleepSpeedLimit: number;
        public sleepTimeLimit: number;
        public timeLastSleepy: number;

        public quaternion: Quaternion;
        public previousQuaternion: Quaternion;
        public initQuaternion: Quaternion;
        public interpolatedQuaternion: Quaternion;

        public shapes: Shape[];
        public shapeOffsets: any[];
        public shapeOrientations: any[];

        public inertia: Vec3;
        public invInertia: Vec3;
        public invInertiaWorld: Mat3;
        public invMassSolve: number;
        public invInertiaSolve: Vec3;
        public invInteriaWorldSolve: Mat3;
        public fixedRotation: boolean;
        public angularDamping: number;
        public aabb: AABB;
        public aabbNeedsUpdate: boolean;
        public wlambda: Vec3;

        public angularFactor: Vec3;
        public linearFactor: Vec3;
        public useGravity: boolean;
        public hasTrigger: boolean;

        constructor (options?: IBodyOptions);

        public isAwake (): boolean;
        public isSleeping (): boolean;
        public isSleepy (): boolean;
        public wakeUp (): void;
        public sleep (): void;
        public sleepTick (time: number): void;
        public updateSolveMassProperties (): void;
        public pointToLocalFrame (worldPoint: Vec3, result?: Vec3): Vec3;
        public pointToWorldFrame (localPoint: Vec3, result?: Vec3): Vec3;
        public vectorToWorldFrame (localVector: Vec3, result?: Vec3): Vec3;
        public addShape (shape: Shape, offset?: Vec3, orientation?: Quaternion): void;
        public removeShape (shape: Shape): void;
        public updateBoundingRadius (): void;
        public computeAABB (): void;
        public updateInertiaWorld (force: Vec3): void;
        public applyForce (force: Vec3, worldPoint: Vec3): void;
        public applyImpulse (impulse: Vec3, worldPoint: Vec3): void;
        public applyLocalForce (force: Vec3, localPoint: Vec3): void;
        public applyLocalImpulse (impulse: Vec3, localPoint: Vec3): void;
        public updateMassProperties (): void;
        public getVelocityAtWorldPoint (worldPoint: Vec3, result: Vec3): Vec3;

        public updateHasTrigger (): void;
    }

    interface IRaycastVehicleOptions {

        chassisBody?: Body;
        indexRightAxis?: number;
        indexLeftAxis?: number;
        indexUpAxis?: number;

    }

    interface IWheelInfoOptions {

        chassisConnectionPointLocal?: Vec3;
        chassisConnectionPointWorld?: Vec3;
        directionLocal?: Vec3;
        directionWorld?: Vec3;
        axleLocal?: Vec3;
        axleWorld?: Vec3;
        suspensionRestLength?: number;
        suspensionMaxLength?: number;
        radius?: number;
        suspensionStiffness?: number;
        dampingCompression?: number;
        dampingRelaxation?: number;
        frictionSlip?: number;
        steering?: number;
        rotation?: number;
        deltaRotation?: number;
        rollInfluence?: number;
        maxSuspensionForce?: number;
        isFronmtWheel?: boolean;
        clippedInvContactDotSuspension?: number;
        suspensionRelativeVelocity?: number;
        suspensionForce?: number;
        skidInfo?: number;
        suspensionLength?: number;
        maxSuspensionTravel?: number;
        useCustomSlidingRotationalSpeed?: boolean;
        customSlidingRotationalSpeed?: number;

        position?: Vec3;
        direction?: Vec3;
        axis?: Vec3;
        body?: Body;

    }

    class WheelInfo {

        public maxSuspensionTravbel: number;
        public customSlidingRotationalSpeed: number;
        public useCustomSlidingRotationalSpeed: boolean;
        public sliding: boolean;
        public chassisConnectionPointLocal: Vec3;
        public chassisConnectionPointWorld: Vec3;
        public directionLocal: Vec3;
        public directionWorld: Vec3;
        public axleLocal: Vec3;
        public axleWorld: Vec3;
        public suspensionRestLength: number;
        public suspensionMaxLength: number;
        public radius: number;
        public suspensionStiffness: number;
        public dampingCompression: number;
        public dampingRelaxation: number;
        public frictionSlip: number;
        public steering: number;
        public rotation: number;
        public deltaRotation: number;
        public rollInfluence: number;
        public maxSuspensionForce: number;
        public engineForce: number;
        public brake: number;
        public isFrontWheel: boolean;
        public clippedInvContactDotSuspension: number;
        public suspensionRelativeVelocity: number;
        public suspensionForce: number;
        public skidInfo: number;
        public suspensionLength: number;
        public sideImpulse: number;
        public forwardImpulse: number;
        public raycastResult: RaycastResult;
        public worldTransform: Transform;
        public isInContact: boolean;

        constructor (options?: IWheelInfoOptions);

    }

    class RaycastVehicle {

        public chassisBody: Body;
        public wheelInfos: IWheelInfoOptions[];
        public sliding: boolean;
        public world: World;
        public iindexRightAxis: number;
        public indexForwardAxis: number;
        public indexUpAxis: number;

        constructor (options?: IRaycastVehicleOptions);

        public addWheel (options?: IWheelInfoOptions): void;
        public setSteeringValue (value: number, wheelIndex: number): void;
        public applyEngineForce (value: number, wheelIndex: number): void;
        public setBrake (brake: number, wheelIndex: number): void;
        public addToWorld (world: World): void;
        public getVehicleAxisWorld (axisIndex: number, result: Vec3): Vec3;
        public updateVehicle (timeStep: number): void;
        public updateSuspension (deltaTime: number): void;
        public removeFromWorld (world: World): void;
        public getWheelTransformWorld (wheelIndex: number): Transform;

    }

    interface IRigidVehicleOptions {

        chassisBody: Body;

    }

    class RigidVehicle {

        public wheelBodies: Body[];
        public coordinateSystem: Vec3;
        public chassisBody: Body;
        public constraints: Constraint[];
        public wheelAxes: Vec3[];
        public wheelForces: Vec3[];

        constructor (options?: IRigidVehicleOptions);

        public addWheel (options?: IWheelInfoOptions): Body;
        public setSteeringValue (value: number, wheelIndex: number): void;
        public setMotorSpeed (value: number, wheelIndex: number): void;
        public disableMotor (wheelIndex: number): void;
        public setWheelForce (value: number, wheelIndex: number): void;
        public applyWheelForce (value: number, wheelIndex: number): void;
        public addToWorld (world: World): void;
        public removeFromWorld (world: World): void;
        public getWheelSpeed (wheelIndex: number): number;

    }

    class SPHSystem {

        public particles: Particle[];
        public density: number;
        public smoothingRadius: number;
        public speedOfSound: number;
        public viscosity: number;
        public eps: number;
        public pressures: number[];
        public densities: number[];
        public neighbors: number[];

        public add (particle: Particle): void;
        public remove (particle: Particle): void;
        public getNeighbors (particle: Particle, neighbors: Particle[]): void;
        public update (): void;
        public w (r: number): number;
        public gradw (rVec: Vec3, resultVec: Vec3): void;
        public nablaw (r: number): number;

    }

    interface ISpringOptions {

        restLength?: number;
        stiffness?: number;
        damping?: number;
        worldAnchorA?: Vec3;
        worldAnchorB?: Vec3;
        localAnchorA?: Vec3;
        localAnchorB?: Vec3;

    }

    class Spring {

        public restLength: number;
        public stffness: number;
        public damping: number;
        public bodyA: Body;
        public bodyB: Body;
        public localAnchorA: Vec3;
        public localAnchorB: Vec3;

        constructor (options?: ISpringOptions);

        public setWorldAnchorA (worldAnchorA: Vec3): void;
        public setWorldAnchorB (worldAnchorB: Vec3): void;
        public getWorldAnchorA (result: Vec3): void;
        public getWorldAnchorB (result: Vec3): void;
        public applyForce (): void;

    }

    class Box extends Shape {

        public static calculateIntertia (halfExtents: Vec3, mass: number, target: Vec3): void;

        public boundingSphereRadius: number;
        public collisionResponse: boolean;
        public halfExtents: Vec3;
        public convexPolyhedronRepresentation: ConvexPolyhedron;

        constructor (halfExtents: Vec3);

        public updateConvexPolyhedronRepresentation (): void;
        public calculateLocalInertia (mass: number, target?: Vec3): Vec3;
        public getSideNormals (sixTargetVectors: boolean, quat?: Quaternion): Vec3[];
        public updateBoundingSphereRadius (): number;
        public volume (): number;
        public forEachWorldCorner (pos: Vec3, quat: Quaternion, callback: Function): void;
        public calculateWorldAABB (pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;

    }

    class ConvexPolyhedron extends Shape {

        public static computeNormal (va: Vec3, vb: Vec3, vc: Vec3, target: Vec3): void;
        public static project (hull: ConvexPolyhedron, axis: Vec3, pos: Vec3, quat: Quaternion, result: number[]): void;

        public vertices: Vec3[];
        public worldVertices: Vec3[];
        public worldVerticesNeedsUpdate: boolean;
        public worldFaceNormalsNeedsUpdate: boolean;
        public faces: number[][];
        public faceNormals: Vec3[];
        public uniqueEdges: Vec3[];
        public uniqueAxes: Vec3[];

        constructor (points?: Vec3[], faces?: number[][]);

        public computeEdges (): void;
        public computeNormals (): void;
        public computeWorldFaceNormals (quat: Quaternion): void;
        public getFaceNormal (i: number, target: Vec3): Vec3;
        public clipAgainstHull (posA: Vec3, quatA: Quaternion, hullB: Vec3, quatB: Quaternion, separatingNormal: Vec3, minDist: number, maxDist: number, result: any[]): void;
        public findSaparatingAxis (hullB: ConvexPolyhedron, posA: Vec3, quatA: Quaternion, posB: Vec3, quatB: Quaternion, target: Vec3, faceListA: any[], faceListB: any[]): boolean;
        public testSepAxis (axis: Vec3, hullB: ConvexPolyhedron, posA: Vec3, quatA: Quaternion, posB: Vec3, quatB: Quaternion): number;
        public getPlaneConstantOfFace (face_i: number): number;
        public clipFaceAgainstHull (separatingNormal: Vec3, posA: Vec3, quatA: Quaternion, worldVertsB1: Vec3[], minDist: number, maxDist: number, result: any[]): void;
        public clipFaceAgainstPlane (inVertices: Vec3[], outVertices: Vec3[], planeNormal: Vec3, planeConstant: number): Vec3;
        public computeWorldVertices (position: Vec3, quat: Quaternion): void;
        public computeLocalAABB (aabbmin: Vec3, aabbmax: Vec3): void;
        public computeWorldFaceNormals (quat: Quaternion): void;
        public calculateWorldAABB (pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;
        public getAveragePointLocal (target: Vec3): Vec3;
        public transformAllPoints (offset: Vec3, quat: Quaternion): void;
        public pointIsInside (p: Vec3): boolean;

    }

    class Cylinder extends ConvexPolyhedron {

        constructor (radiusTop: number, radiusBottom: number, height: number, numSegments: number, isDirY?: boolean);
        public calculateWorldAABB (pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;
    }

    interface IHightfield {

        minValue?: number;
        maxValue?: number;
        elementSize: number;

    }

    class Heightfield extends Shape {

        public data: number[][];
        public maxValue: number;
        public minValue: number;
        public elementSize: number;
        public cacheEnabled: boolean;
        public pillarConvex: ConvexPolyhedron;
        public pillarOffset: Vec3;
        public type: number;

        constructor (data: number[][], options?: IHightfield);

        public update (): void;
        public updateMinValue (): void;
        public updateMaxValue (): void;
        public setHeightValueAtIndex (xi: number, yi: number, value: number): void;
        public getRectMinMax (iMinX: number, iMinY: number, iMaxX: number, iMaxY: number, result: any[]): void;
        public getIndexOfPosition (x: number, y: number, result: any[], clamp: boolean): boolean;
        public getConvexTrianglePillar (xi: number, yi: number, getUpperTriangle: boolean): void;
        public calculateWorldAABB (pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;

    }

    class Particle extends Shape {
        public calculateWorldAABB (pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;
    }

    class Plane extends Shape {

        public worldNormal: Vec3;
        public worldNormalNeedsUpdate: boolean;
        public boundingSphereRadius: number;

        public computeWorldNormal (quat: Quaternion): void;
        public calculateWorldAABB (pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;

    }

    class Shape extends EventTarget {

        public static types: {

            SPHERE: number;
            PLANE: number;
            BOX: number;
            COMPOUND: number;
            CONVEXPOLYHEDRON: number;
            HEIGHTFIELD: number;
            PARTICLE: number;
            CYLINDER: number;

        };
        public readonly id: number;
        public type: number;
        public body: Body;
        public boundingSphereRadius: number;
        public collisionFilterMask: number;
        public collisionFilterGroup: number;
        public collisionResponse: boolean;
        public material: Material;
        public updateBoundingSphereRadius (): number;
        public volume (): number;
        public calculateLocalInertia (mass: number, target: Vec3): Vec3;

        /**
         * @method calculateWorldAABB
         * @param {Vec3}        pos
         * @param {Quaternion}  quat
         * @param {Vec3}        min
         * @param {Vec3}        max
         * @note only child have implement
         */
        public calculateWorldAABB (pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;
    }

    class Sphere extends Shape {

        public radius: number;

        constructor (radius: number);

    }

    class Trimesh extends Shape {

        /**
         * @property vertices
         * @type {Array}
         */
        public vertices: Float32Array;

        /**
         * Array of integers, indicating which vertices each triangle consists of. The length of this array is thus 3 times the number of triangles.
         * @property indices
         * @type {Array}
         */
        public indices: Int16Array;

        /**
         * The normals data.
         * @property normals
         * @type {Array}
         */
        public normals: Float32Array;

        /**
         * The local AABB of the mesh.
         * @property aabb
         * @type {Array}
         */
        public aabb: AABB;

        /**
         * References to vertex pairs, making up all unique edges in the trimesh.
         * @property {array} edges
         */
        public edges: [];

        /**
         * Local scaling of the mesh. Use .setScale() to set it.
         * @property {Vec3} scale
         */
        public scale: Vec3;

        /**
         * The indexed triangles. Use .updateTree() to update it.
         * @property {Octree} tree
         */
        public tree: Octree;

        constructor (vertices: Float32Array, indices: Uint16Array);

        public updateTree (): void;

        public getTrianglesInAABB (): [];

        public setScale (scale: Vec3): void;

        /**
         * Compute the normals of the faces. Will save in the .normals array.
         * @method updateNormals
         */
        public updateNormals (): void;

        /**
         * Update the .edges property
         * @method updateEdges
         */
        public updateEdges (): void;

        /**
         * Get an edge vertex
         * @method getEdgeVertex
         * @param  {number} edgeIndex
         * @param  {number} firstOrSecond 0 or 1, depending on which one of the vertices you need.
         * @param  {Vec3} vertexStore Where to store the result
         */
        public getEdgeVertex (edgeIndex: number, firstOrSecond: number, vertexStore: Vec3): void;

        /**
         * Get a vector along an edge.
         * @method getEdgeVector
         * @param  {number} edgeIndex
         * @param  {Vec3} vectorStore
         */
        public getEdgeVector (edgeIndex: number, vectorStore: Vec3): void;

        /**
         * Get vertex i.
         * @method getVertex
         * @param  {number} i
         * @param  {Vec3} out
         * @return {Vec3} The "out" vector object
         */
        public getVertex (i: number, out: Vec3): Vec3;

        /**
         * Get raw vertex i
         * @private
         * @method _getUnscaledVertex
         * @param  {number} i
         * @param  {Vec3} out
         * @return {Vec3} The "out" vector object
         */
        public _getUnscaledVertex (i: number, out: Vec3): Vec3;

        /**
         * Get a vertex from the trimesh,transformed by the given position and quaternion.
         * @method getWorldVertex
         * @param  {number} i
         * @param  {Vec3} pos
         * @param  {Quaternion} quat
         * @param  {Vec3} out
         * @return {Vec3} The "out" vector object
         */
        public getWorldVertex (i: number, pos: Vec3, qua: Quaternion, out: Vec3): Vec3;

        /**
         * Get the three vertices for triangle i.
         * @method getTriangleVertices
         * @param  {number} i
         * @param  {Vec3} a
         * @param  {Vec3} b
         * @param  {Vec3} c
         */
        public getTriangleVertices (i: number, a: Vec3, b: Vec3, c: Vec3): void;

        /**
         * Compute the normal of triangle i.
         * @method getNormal
         * @param  {Number} i
         * @param  {Vec3} target
         * @return {Vec3} The "target" vector object
         */
        public getNormal (i: number, target: Vec3): Vec3;

        /**
         * @method calculateLocalInertia
         * @param  {Number} mass
         * @param  {Vec3} target
         * @return {Vec3} The "target" vector object
         */
        public calculateLocalInertia (mass: number, target: Vec3): Vec3;

        /**
         * Compute the local AABB for the trimesh
         * @method computeLocalAABB
         * @param  {AABB} aabb
         */
        public computeLocalAABB (aabb: AABB): void;

        /**
         * Update the .aabb property
         * @method updateAABB
         */
        public updateAABB (): void;

        /**
         * @method calculateWorldAABB
         * @param {Vec3}        pos
         * @param {Quaternion}  quat
         * @param {Vec3}        min
         * @param {Vec3}        max
         */
        public calculateWorldAABB (pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;

        /**
         * Get approximate volume
         * @method volume
         * @return {Number}
         */
        public volume (): number;

        /**
         * Get face normal given 3 vertices
         * @static
         * @method computeNormal
         * @param {Vec3} va
         * @param {Vec3} vb
         * @param {Vec3} vc
         * @param {Vec3} target
         */
        public static computeNormal (va: Vec3, vb: Vec3, vc: Vec3, target: Vec3): void;

        /**
         * Create a Trimesh instance, shaped as a torus.
         * @static
         * @method createTorus
         * @param  {number} [radius=1]
         * @param  {number} [tube=0.5]
         * @param  {number} [radialSegments=8]
         * @param  {number} [tubularSegments=6]
         * @param  {number} [arc=6.283185307179586]
         * @return {Trimesh} A torus
         */
        public static createTorus (radius: number, tube: number, radialSegments: number, tubularSegments: number, arc: number): Trimesh;
    }

    class GSSolver extends Solver {

        public iterations: number;
        public tolerance: number;

        public solve (dy: number, world: World): number;

    }

    class Solver {
        public iterations: number;
        public equations: Equation[];

        public solve (dy: number, world: World): number;
        public addEquation (eq: Equation): void;
        public removeEquation (eq: Equation): void;
        public removeAllEquations (): void;

    }

    class SplitSolver extends Solver {

        public subsolver: Solver;

        constructor (subsolver: Solver);

        public solve (dy: number, world: World): number;

    }

    class EventTarget {

        public addEventListener (type: string, listener: Function): EventTarget;
        public hasEventListener (type: string, listener: Function): boolean;
        public removeEventListener (type: string, listener: Function): EventTarget;
        public dispatchEvent (event: IEvent): IEvent;

    }

    class Pool {

        public objects: any[];
        public type: any[];

        public release (): any;
        public get (): any;
        public constructObject (): any;

    }

    class TupleDictionary {

        public data: {
            keys: any[];
        };

        public get (i: number, j: number): number;
        public set (i: number, j: number, value: number): void;
        public reset (): void;

    }

    class Utils {

        public static defaults (options?: any, defaults?: any): any;

    }

    class Vec3Pool extends Pool {

        public type: any;

        public constructObject (): Vec3;

    }

    class NarrowPhase {

        public contactPointPool: Pool[];
        public v3pool: Vec3Pool;

    }

    class World extends EventTarget {
        public iterations: number;
        public dt: number;
        public allowSleep: boolean;
        public contacts: ContactEquation[];
        public frictionEquations: FrictionEquation[];
        public quatNormalizeSkip: number;
        public quatNormalizeFast: boolean;
        public time: number;
        public stepnumber: number;
        public default_dt: number;
        public nextId: number;
        public gravity: Vec3;
        public broadphase: NaiveBroadphase;
        public bodies: Body[];
        public solver: Solver;
        public constraints: Constraint[];
        public narrowPhase: NarrowPhase;
        public collisionMatrix: ArrayCollisionMatrix;
        public collisionMatrixPrevious: ArrayCollisionMatrix;
        public materials: Material[];
        public contactmaterials: ContactMaterial[];
        public contactMaterialTable: TupleDictionary;
        public defaultMaterial: Material;
        public defaultContactMaterial: ContactMaterial;
        public doProfiling: boolean;
        public profile: {
            solve: number;
            makeContactConstraints: number;
            broadphaser: number;
            integrate: number;
            narrowphase: number;
        };
        public subsystems: any[];
        public addBodyEvent: IBodyEvent;
        public removeBodyEvent: IBodyEvent;

        public getContactMaterial (m1: Material, m2: Material): ContactMaterial;
        public numObjects (): number;
        public collisionMatrixTick (): void;
        public addBody (body: Body): void;
        public addConstraint (c: Constraint): void;
        public removeConstraint (c: Constraint): void;
        public rayTest (from: Vec3, to: Vec3, result: RaycastResult): void;
        public remove (body: Body): void;
        public addMaterial (m: Material): void;
        public addContactMaterial (cmat: ContactMaterial): void;
        public step (dy: number, timeSinceLastCalled?: number, maxSubSteps?: number): void;

        /** raycast */
        public raycastAny (from: Vec3, to: Vec3, options: IRaycastOptions, result: RaycastResult): boolean;
        public raycastClosest (from: Vec3, to: Vec3, options: IRaycastOptions, result: RaycastResult): boolean;
        public raycastAll (from: Vec3, to: Vec3, options: IRaycastOptions, callback: (result: RaycastResult) => {}): boolean;
        // public raycastCollider()

        /** events */
        public emitTriggeredEvents (): void;
        public emitCollisionEvents (): void;
    }

    interface IRaycastOptions {
        collisionFilterMask?: number,
        collisionFilterGroup?: number;
        skipBackFaces?: boolean;
        checkCollisionResponse?: boolean;
    }

    interface IEvent {
        target: any;
        type: string;

    }

    interface ITriggeredEvent extends IEvent {
        event: 'onTriggerEnter' | 'onTriggerStay' | 'onTriggerExit';
        selfBody: Body;
        otherBody: Body;
        selfShape: Shape;
        otherShape: Shape;
    }

    interface IBodyEvent extends IEvent {
        type: '';
        body: Body;
        target: Body;
        contact: ContactEquation;
    }

    interface ICollisionEvent extends IBodyEvent {
        event: 'onCollisionEnter' | 'onCollisionStay' | 'onCollisionExit';
        selfShape: Shape;
        otherShape: Shape;
        contacts: ContactEquation[];
    }

}

declare module '@cocos/cannon' {
    export = CANNON;
}
