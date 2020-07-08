/**
 * @hidden
 */
export let PhysicsWorld: any;
export let RigidBody: any;

export let BoxShape: any;
export let SphereShape: any;
export let CapsuleShape: any;
export let TrimeshShape: any;
export let CylinderShape: any;
export let ConeShape: any;
export let TerrainShape: any;
export let SimpleShape: any;
export let PlaneShape: any;

export interface IPhysicsWrapperObject {
    world: any,
    body?: any,
    box: any,
    sphere: any,
    capsule?: any,
    trimesh?: any,
    cylinder?: any,
    cone?: any,
    terrain?: any,
    simple?: any,
    plane?: any,
}

export function instantiate (obj: IPhysicsWrapperObject) {
    BoxShape = obj.box;
    SphereShape = obj.sphere;
    RigidBody = obj.body;
    PhysicsWorld = obj.world;
    CapsuleShape = obj.capsule;
    TrimeshShape = obj.trimesh;
    CylinderShape = obj.cylinder;
    ConeShape = obj.cone;
    TerrainShape = obj.terrain;
    SimpleShape = obj.simple;
    PlaneShape = obj.plane;
}
