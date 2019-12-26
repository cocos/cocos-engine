/**
 * @hidden
 */

// Cannon
import { CannonRigidBody } from '../cannon/cannon-rigid-body';
import { CannonWorld } from '../cannon/cannon-world';
import { CannonBoxShape } from '../cannon/shapes/cannon-box-shape';
import { CannonSphereShape } from '../cannon/shapes/cannon-sphere-shape';

// built-in
import { BuiltInWorld } from '../cocos/builtin-world';
import { BuiltinBoxShape } from '../cocos/shapes/builtin-box-shape';
import { BuiltinSphereShape } from '../cocos/shapes/builtin-sphere-shape';

// Ammo
import { AmmoRigidBody } from '../ammo/ammo-rigid-body';
import { AmmoWorld } from '../ammo/ammo-world';
import { AmmoBoxShape } from '../ammo/shapes/ammo-box-shape';
import { AmmoSphereShape } from '../ammo/shapes/ammo-sphere-shape';

export let BoxShape: typeof CannonBoxShape | typeof BuiltinBoxShape | typeof AmmoBoxShape;
export let SphereShape: typeof CannonSphereShape | typeof BuiltinSphereShape | typeof AmmoSphereShape;
export let RigidBody: typeof CannonRigidBody | null | typeof AmmoRigidBody;
export let PhysicsWorld: typeof CannonWorld | typeof BuiltInWorld | typeof AmmoWorld;

export function instantiate (
    boxShape: typeof BoxShape,
    sphereShape: typeof SphereShape,
    body: typeof RigidBody,
    world: typeof PhysicsWorld) {
    BoxShape = boxShape;
    SphereShape = sphereShape;
    RigidBody = body;
    PhysicsWorld = world;
}
