import { PhysicsBoxShape, PhysicsSphereShape, PhysicsBody } from './body';
import { ContactMaterial } from './contact-material';
export {
    PhysicsBoxShape,
    PhysicsSphereShape,
    PhysicsBody,
    ContactMaterial,
};
export * from './physics-system';
export * from './world';

// @ts-ignore
cc.PhysicsBody = PhysicsBody;
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
