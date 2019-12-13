/**
 * @hidden
 */

import { Vec3 } from '../../core/math';
import { BoxShape, PhysicsWorld, RigidBody, SphereShape } from './Physics-selector';
import { IRigidBody } from '../spec/irigid-body';
import { IBoxShape, ISphereShape } from '../spec/i-physics-shape';
import { IPhysicsWorld } from '../spec/i-physics-world';

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
