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

export let WRAPPER: IPhysicsWrapperObject;

export function instantiate (obj: IPhysicsWrapperObject) {
    WRAPPER = obj;
}
