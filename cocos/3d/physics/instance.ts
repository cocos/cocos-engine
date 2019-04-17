import { Vec3 } from '../../core/value-types';
import { BoxShapeBase, ICreateBodyOptions, PhysicsWorldBase, RigidBodyBase, SphereShapeBase } from './api';
import { BoxShape, PhysicsWorld, RigidBody, SphereShape } from './impl-selector';
import { RaycastResult } from './raycast-result';

export function createPhysicsWorld (): PhysicsWorldBase {
    return new PhysicsWorld();
}

export function createRigidBody (options?: ICreateBodyOptions): RigidBodyBase {
    return new RigidBody(options);
}

export function createBoxShape (size: Vec3): BoxShapeBase {
    return new BoxShape(size);
}

export function createSphereShape (radius: number): SphereShapeBase {
    return new SphereShape(radius);
}

export function createRaycastResult (): RaycastResult {
    return new RaycastResult();
}

cc.createRaycastResult = createRaycastResult;
