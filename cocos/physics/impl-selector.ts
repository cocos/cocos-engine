/**
 * @hidden
 */

// Cannon
import { CannonRigidBody } from './cannon/cannon-body';
import { CannonWorld } from './cannon/cannon-world';
import { CannonBoxShape } from './cannon/shapes/cannon-box-shape';
import { CannonSphereShape } from './cannon/shapes/cannon-sphere-shape';

// built-in
import { BuiltInBody } from './cocos/builtin-body';
import { BuiltInWorld } from './cocos/builtin-world';
import { BuiltinBoxShape } from './cocos/shapes/builtin-box-shape';
import { BuiltinSphereShape } from './cocos/shapes/builtin-sphere-shape';

export let BoxShape: typeof CannonBoxShape | typeof BuiltinBoxShape;
export let SphereShape: typeof CannonSphereShape | typeof BuiltinSphereShape;
export let RigidBody: typeof CannonRigidBody | typeof BuiltInBody;
export let PhysicsWorld: typeof CannonWorld | typeof BuiltInWorld;

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
