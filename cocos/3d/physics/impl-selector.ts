
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

// Ammo
// import { AmmoBoxShape, AmmoRaycastResult, AmmoRigidBody, AmmoSphereShape, AmmoWorld, } from './ammo-impl';

// built-in
import { BuiltInBody } from './cocos/builtin-body';
import { BuiltInWorld } from './cocos/builtin-world';
import { BuiltinBoxShape } from './cocos/shapes/builtin-box-shape';
import { BuiltinSphereShape } from './cocos/shapes/builtin-sphere-shape';

export let BoxShape: typeof CannonBoxShape | typeof BuiltinBoxShape;
export let SphereShape: typeof CannonSphereShape | typeof BuiltinSphereShape;
export let RigidBody: typeof CannonRigidBody | typeof BuiltInBody;
export let PhysicsWorld: typeof CannonWorld | typeof BuiltInWorld;

if (CC_PHYSICS_CANNON) {
    BoxShape = CannonBoxShape;
    SphereShape = CannonSphereShape;
    RigidBody = CannonRigidBody;
    PhysicsWorld = CannonWorld;
} else if (CC_PHYSICS_AMMO) {
    // TODO : 选择AMMO
} else if (CC_PHYSICS_BUILT_IN) {
    BoxShape = BuiltinBoxShape;
    SphereShape = BuiltinSphereShape;
    RigidBody = BuiltInBody;
    PhysicsWorld = BuiltInWorld;
}
