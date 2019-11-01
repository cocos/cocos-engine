/**
 * @hidden
 */

import { Vec3 } from '../core/math';
import { BoxShape, PhysicsWorld, RigidBody, SphereShape } from './impl-selector';
import { PhysicsRayResult } from './physics-ray-result';
import { IRigidBody } from './spec/I-rigid-body';
import { IBoxShape, ISphereShape } from './spec/i-physics-spahe';
import { IPhysicsWorld } from './spec/i-physics-world';

export function createPhysicsWorld (): IPhysicsWorld {
    return new PhysicsWorld() as IPhysicsWorld;
}

export function createRigidBody (options?: any): IRigidBody {
    return new RigidBody(options) as IRigidBody;
}

export function createBoxShape (size: Vec3): IBoxShape {
    return new BoxShape(size) as IBoxShape;
}

export function createSphereShape (radius: number): ISphereShape {
    return new SphereShape(radius) as ISphereShape;
}

export function createRaycastResult (): PhysicsRayResult {
    return new PhysicsRayResult();
}

cc.createRaycastResult = createRaycastResult;
