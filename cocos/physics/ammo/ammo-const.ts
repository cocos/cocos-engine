import Ammo from 'ammo.js';

export const defaultShape = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 0.5, 0.5));
export const defaultInertia = new Ammo.btVector3();
defaultShape.calculateLocalInertia(10, defaultInertia);
export const defaultMotionState = new Ammo.btDefaultMotionState();
export const defaultRigidBodyInfo = new Ammo.btRigidBodyConstructionInfo(10, defaultMotionState, defaultShape, defaultInertia);