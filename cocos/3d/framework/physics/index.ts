import { PhysicsBoxShape, PhysicsSphereShape, RigidBody } from './body';
import './physical-system';
import './world';

// @ts-ignore
cc.RigidBody = RigidBody;
// @ts-ignore
cc.PhysicsBoxShape = PhysicsBoxShape;
// @ts-ignore
cc.PhysicsSphereShape = PhysicsSphereShape;

// namespace cc {
//     export const PhysicalBody = PhysicalBody;
//     export const PhysicalBoxShape = PhysicalBoxShape;
//     export const PhysicalSphereShape = PhysicalSphereShape;
// }
