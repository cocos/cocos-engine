import { Vec3 } from '../../core/value-types';
import { BoxShapeBase, ICreateBodyOptions, PhysicsWorldBase, RaycastResultBase, RigidBodyBase } from './api';
import { BoxShape, PhysicsWorld, RaycastResult, RigidBody, SphereShape } from './impl-selector';

export function createPhysicsWorld (): PhysicsWorldBase {
    return new PhysicsWorld();
}

export function createRigidBody (options?: ICreateBodyOptions): RigidBodyBase {
    return new RigidBody(options);
}

export function createBoxShape (size: Vec3): BoxShapeBase {
    return new BoxShape(size);
}

export function createSphereShape (radius: number): SphereShape {
    return new SphereShape(radius);
}

export function createRaycastResult (): RaycastResultBase {
    return new RaycastResult();
}

cc.createRaycastResult = createRaycastResult;
