
declare const CC_PHYISCS_CANNON: boolean;
declare const CC_PHYISCS_AMMO: boolean;
declare const CC_PHYISCS_BUILT_IN: boolean;

declare const global: any;
const _global = typeof window === 'undefined' ? global : window;

// tslint:disable: no-string-literal
/** 如果这些宏都没有定义，才启用默认的值 */
if (typeof _global['CC_PHYISCS'] === 'undefined' &&
    typeof _global['CC_PHYISCS_AMMO'] === 'undefined' &&
    typeof _global['CC_PHYISCS_BUILT_IN'] === 'undefined') {
    /** 启用默认情况 */
    _global['CC_PHYISCS_CANNON'] = false;
    _global['CC_PHYISCS_AMMO'] = false;
    _global['CC_PHYISCS_BUILT_IN'] = true;
} else {
    /** 如果这些宏都没有启用的情况，则将BUTIL_IN启用 */
    if (_global['CC_PHYISCS_CANNON'] === false ||
        _global['CC_PHYISCS_AMMO'] === false ||
        _global['CC_PHYISCS_BUILT_IN'] === false) {
        /** 启用BUTIL_IN */
        _global['CC_PHYISCS_CANNON'] = false;
        _global['CC_PHYISCS_AMMO'] = false;
        _global['CC_PHYISCS_BUILT_IN'] = true;
    }
}

// Cannon
import { CannonBoxShape, CannonRigidBody, CannonSphereShape, CannonWorld } from './cannon-impl';

// Ammo
// import { AmmoBoxShape, AmmoRaycastResult, AmmoRigidBody, AmmoSphereShape, AmmoWorld, } from './ammo-impl';

// built-in
import { BuiltInBody } from './cocos/built-in-body';
import { BuiltInBoxShape } from './cocos/built-in-shape';
import { BuiltInSphereShape } from './cocos/built-in-shape';
import { BuiltInWorld } from './cocos/built-in-world';

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
