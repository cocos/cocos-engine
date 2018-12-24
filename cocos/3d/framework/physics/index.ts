import { PhysicsBoxShape, PhysicsSphereShape, RigidBody } from './body';
import { ContactMaterial } from './contact-material';
import './physics-system';
import './world';

// @ts-ignore
cc.RigidBody = RigidBody;
// @ts-ignore
cc.PhysicsBoxShape = PhysicsBoxShape;
// @ts-ignore
cc.PhysicsSphereShape = PhysicsSphereShape;
// @ts-ignore
cc.ContactMaterial = ContactMaterial;

// namespace cc {
//     export const PhysicalBody = PhysicalBody;
//     export const PhysicalBoxShape = PhysicalBoxShape;
//     export const PhysicalSphereShape = PhysicalSphereShape;
// }
