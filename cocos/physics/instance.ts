/**
 * @hidden
 */

import { Vec3 } from '../core/math';
import { BoxShapeBase, ICreateBodyOptions, PhysicsWorldBase, RigidBodyBase, SphereShapeBase } from './api';
import { BoxShape, PhysicsWorld, RigidBody, SphereShape } from './impl-selector';
import { PhysicsRayResult } from './physics-ray-result';

export function createPhysicsWorld (): PhysicsWorldBase {
    return new PhysicsWorld() as PhysicsWorldBase;
}

export function createRigidBody (options?: ICreateBodyOptions): RigidBodyBase {
    return new RigidBody(options) as RigidBodyBase;
}

export function createBoxShape (size: Vec3): BoxShapeBase {
    return new BoxShape(size);
}

export function createSphereShape (radius: number): SphereShapeBase {
    return new SphereShape(radius);
}

export function createRaycastResult (): PhysicsRayResult {
    return new PhysicsRayResult();
}

cc.createRaycastResult = createRaycastResult;
