/**
 * @hidden
 */

import { Vec3 } from '../../core/math';
import { BoxShape, PhysicsWorld, RigidBody, SphereShape, CapsuleShape } from './Physics-selector';
import { IRigidBody } from '../spec/i-rigid-body';
import { IBoxShape, ISphereShape, ICapsuleShape } from '../spec/i-physics-shape';
import { IPhysicsWorld } from '../spec/i-physics-world';
import { ECapsuleDirection } from './components/collider/capsule-collider-component';
import { warn } from '../../core';

export function createPhysicsWorld (): IPhysicsWorld {
    return new PhysicsWorld() as IPhysicsWorld;
}

export function createRigidBody (): IRigidBody {
    return new RigidBody!() as IRigidBody;
}

export function createBoxShape (size: Vec3): IBoxShape {
    return new BoxShape(size) as IBoxShape;
}

export function createSphereShape (radius: number): ISphereShape {
    return new SphereShape(radius) as ISphereShape;
}

export function createCapsuleShape (radius = 0.5, height = 2, dir = ECapsuleDirection.Y_AXIS): ICapsuleShape {
    if (CC_PHYSICS_BUILTIN) {
        return new CapsuleShape(radius, height, dir) as ICapsuleShape;
    } else {
        warn('[v1.0.3][Physics]: Currently only builtin support capsule collider');
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
