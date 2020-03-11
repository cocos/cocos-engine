/**
 * @hidden
 */
export let PhysicsWorld: any;
export let RigidBody: any;

export let BoxShape: any;
export let SphereShape: any;
export let CapsuleShape: any;
export let TrimeshShape: any;

export interface IPhysicsWrapperObject {
    world: any,
    body?: any,
    box: any,
    sphere: any,
    capsule?: any,
    trimesh?: any,
}

export function instantiate (obj: IPhysicsWrapperObject) {
    BoxShape = obj.box;
    SphereShape = obj.sphere;
    RigidBody = obj.body;
    PhysicsWorld = obj.world;
    if (obj.capsule) { CapsuleShape = obj.capsule; }
    if (obj.trimesh) { TrimeshShape = obj.trimesh; }
}
