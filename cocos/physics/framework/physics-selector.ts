/**
 * @hidden
 */
interface IPhysicsWrapperObject {
    PhysicsWorld: any,
    RigidBody?: any,

    BoxShape: any,
    SphereShape: any,
    CapsuleShape?: any,
    TrimeshShape?: any,
    CylinderShape?: any,
    ConeShape?: any,
    TerrainShape?: any,
    SimplexShape?: any,
    PlaneShape?: any,

    PointToPointConstraint?: any,
    HingeConstraint?: any,
    ConeTwistConstraint?: any,
}

type IPhysicsEngineId = 'builtin' | 'cannon.js' | 'ammo.js' | string | undefined;

export let WRAPPER: IPhysicsWrapperObject;

export let physicsEngineId: IPhysicsEngineId;

export function select (id: IPhysicsEngineId, wrapper: IPhysicsWrapperObject) {
    physicsEngineId = id;
    globalThis['CC_PHYSICS_BUILTIN'] = id == 'builtin';
    globalThis['CC_PHYSICS_CANNON'] = id == "cannon.js";
    globalThis['CC_PHYSICS_AMMO'] = id == "ammo.js";
    
    WRAPPER = wrapper;
}
