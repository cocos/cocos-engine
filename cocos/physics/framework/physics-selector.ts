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
    if (obj.capsule) { CapsuleShape = obj.capsule; }
    if (obj.trimesh) { TrimeshShape = obj.trimesh; }
    if (obj.cylinder) { CylinderShape = obj.cylinder; }
    if (obj.cone) { ConeShape = obj.cone; }
    if (obj.terrain) { TerrainShape = obj.terrain; }
    if (obj.simple) { SimpleShape = obj.simple; }
    if (obj.plane) { PlaneShape = obj.plane; }
}
