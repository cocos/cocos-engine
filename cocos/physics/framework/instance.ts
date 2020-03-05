/**
 * @hidden
 */

import { Vec3 } from '../../core/math';
import { BoxShape, PhysicsWorld, RigidBody, SphereShape, CapsuleShape } from './Physics-selector';
import { IRigidBody } from '../spec/i-rigid-body';
import { IBoxShape, ISphereShape, ICapsuleShape } from '../spec/i-physics-shape';
import { IPhysicsWorld } from '../spec/i-physics-world';
import { warn, error } from '../../core';

export function createPhysicsWorld (): IPhysicsWorld {
    if (CC_DEBUG && checkPhysicsModule(PhysicsWorld)) { return null as any; }
    return new PhysicsWorld() as IPhysicsWorld;
}

export function createRigidBody (): IRigidBody {
    if (CC_DEBUG && checkPhysicsModule(RigidBody)) { return null as any; }
    return new RigidBody!() as IRigidBody;
}

export function createBoxShape (size: Vec3): IBoxShape {
    if (CC_DEBUG && checkPhysicsModule(BoxShape)) { return null as any; }
    return new BoxShape(size) as IBoxShape;
}

export function createSphereShape (radius: number): ISphereShape {
    if (CC_DEBUG && checkPhysicsModule(SphereShape)) { return null as any; }
    return new SphereShape(radius) as ISphereShape;
}

export function createCapsuleShape (radius = 0.5, height = 2, dir = 1): ICapsuleShape {
    if (CC_PHYSICS_BUILTIN || CC_PHYSICS_AMMO) {
        if (CC_DEBUG && checkPhysicsModule(CapsuleShape)) { return null as any; }
        return new CapsuleShape(radius, height, dir) as ICapsuleShape;
    } else {
        warn('[v1.0.3][Physics]: Currently cannon.js unsupport capsule collider');
        /** apater */
        return {
            radius: radius, height: height, direction: dir,
            material: null,
            isTrigger: false,
            center: new Vec3(),
            __preload: () => { },
            onLoad: () => { },
            onEnable: () => { },
            onDisable: () => { },
            onDestroy: () => { }
        } as any
    }
}

export function checkPhysicsModule (obj: any) {
    if (CC_DEBUG && !CC_TEST && !CC_EDITOR && obj == null) {
        error("[Physics]: Please check to see if physics modules are included.");
        return true;
    }
    return false;
}
