import { PhysicalBody , PhysicalBoxShape, PhysicalSphereShape } from './body';
import './physical-system';
import './world';

// @ts-ignore
cc.PhysicalBody = PhysicalBody;
// @ts-ignore
cc.PhysicalBoxShape = PhysicalBoxShape;
// @ts-ignore
cc.PhysicalSphereShape = PhysicalSphereShape;

// namespace cc {
//     export const PhysicalBody = PhysicalBody;
//     export const PhysicalBoxShape = PhysicalBoxShape;
//     export const PhysicalSphereShape = PhysicalSphereShape;
// }
