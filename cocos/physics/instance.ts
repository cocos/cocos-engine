/**
 * @hidden
 */

import { Vec3 } from '../core/math';
import { BoxShapeBase, ICreateBodyOptions, PhysicsWorldBase, RigidBodyBase, SphereShapeBase } from './api';
import { BoxShape, PhysicsWorld, RigidBody, SphereShape } from './impl-selector';
import { PhysicsRayResult } from './physics-ray-result';
import { IRigidBody } from './spec/IRigidBody';
import { IBoxShape, ISphereShape } from './spec/IPhysicsSpahe';

export function createPhysicsWorld (): PhysicsWorldBase {
    return new PhysicsWorld() as PhysicsWorldBase;
}

export function createRigidBody (options?: ICreateBodyOptions): IRigidBody {
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
