/**
 * @hidden
 */
import { IBoxShape, ISphereShape, ICapsuleShape, ITrimeshShape } from './../spec/i-physics-shape';
import { IRigidBody } from '../spec/i-rigid-body';
import { IPhysicsWorld } from '../spec/i-physics-world';

export let PhysicsWorld: IPhysicsWorld;
export let RigidBody: IRigidBody;

export let BoxShape: IBoxShape;
export let SphereShape: ISphereShape;
export let CapsuleShape: ICapsuleShape;
export let TrimeshShape: ITrimeshShape;

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
