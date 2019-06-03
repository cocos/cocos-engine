
declare const global: any;
const _global = typeof window === 'undefined' ? global : window;

// tslint:disable: no-string-literal
if (typeof _global['CC_PHYISCS_CANNON'] === 'undefined') {
    _global['CC_PHYISCS_CANNON'] = false;
}

if (typeof _global['CC_PHYISCS_AMMO'] === 'undefined') {
    _global['CC_PHYISCS_AMMO'] = false;
}

if (typeof _global['CC_PHYISCS_BUILT_IN'] === 'undefined') {
    _global['CC_PHYISCS_BUILT_IN'] = true;
}

// Cannon
import { CannonBoxShape, CannonRigidBody, CannonSphereShape, CannonWorld } from './cannon-impl';

// Ammo
// import { AmmoBoxShape, AmmoRaycastResult, AmmoRigidBody, AmmoSphereShape, AmmoWorld, } from './ammo-impl';

// built-in
import { BuiltInBody } from './cocos/builtin-body';
import { BuiltInBoxShape } from './cocos/builtin-shape';
import { BuiltInSphereShape } from './cocos/builtin-shape';
import { BuiltInWorld } from './cocos/builtin-world';

export let BoxShape: typeof CannonBoxShape | typeof BuiltInBoxShape;
export let SphereShape: typeof CannonSphereShape | typeof BuiltInSphereShape;
export let RigidBody: typeof CannonRigidBody | typeof BuiltInBody;
export let PhysicsWorld: typeof CannonWorld | typeof BuiltInWorld;

if (CC_PHYISCS_CANNON) {
    BoxShape = CannonBoxShape;
    SphereShape = CannonSphereShape;
    RigidBody = CannonRigidBody;
    PhysicsWorld = CannonWorld;
} else if (CC_PHYISCS_AMMO) {
    // TODO : 选择AMMO
} else if (CC_PHYISCS_BUILT_IN) {
    BoxShape = BuiltInBoxShape;
    SphereShape = BuiltInSphereShape;
    RigidBody = BuiltInBody;
    PhysicsWorld = BuiltInWorld;
}
