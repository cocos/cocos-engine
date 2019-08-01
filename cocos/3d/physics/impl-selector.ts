/**
 * @hidden
 */

declare const global: any;
const _global = typeof window === 'undefined' ? global : window;

// tslint:disable: no-string-literal;
if (typeof _global.CC_PHYSICS_CANNON === 'undefined') {
    _global.CC_PHYSICS_CANNON = true;
}

if (typeof _global.CC_PHYSICS_AMMO === 'undefined') {
    _global.CC_PHYSICS_AMMO = false;
}

if (typeof _global.CC_PHYSICS_BUILT_IN === 'undefined') {
    _global.CC_PHYSICS_BUILT_IN = false;
}

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
